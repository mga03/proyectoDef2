// Global State
let currentProjectId = null;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthPage = document.getElementById('auth-screen');
    const isDashboardPage = document.getElementById('dashboard-screen');

    // Check if we are on the login page (index.html or root)
    if (isAuthPage) {
        if (api.isAuthenticated()) {
            window.location.href = '/dashboard';
        }
        return;
    }

    // Check if we are on the dashboard page
    if (isDashboardPage) {
        if (!api.isAuthenticated()) {
            window.location.href = '/index.html';
            return;
        }

        const username = api.getUser();
        if (username) {
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) userNameElement.textContent = username;
        }
        
        // Load projects first
        await loadProjects();

        // Handle initial URL state (if we want to support deep linking with hash or query params in the future)
        // For now, simple loading is enough as we are moving to static file serving
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', async (event) => {
    const path = window.location.pathname;
    
    // Close modals if open
    const projectModal = document.getElementById('project-modal');
    const taskModal = document.getElementById('task-modal');
    if (projectModal) projectModal.classList.remove('active');
    if (taskModal) taskModal.classList.remove('active');

    if (path === '/dashboard') {
        backToProjects(false);
    } else if (path === '/dashboard/proyectos') {
        backToProjects(false);
        showCreateProjectModal(false);
    } else {
        const projectMatch = path.match(/^\/dashboard\/proyectos\/(\d+)$/);
        if (projectMatch) {
            const projectId = projectMatch[1];
            await openProject(projectId, false);
        }
        
        const taskMatch = path.match(/^\/dashboard\/proyectos\/(\d+)\/tareas\/nueva$/);
        if (taskMatch) {
            const projectId = taskMatch[1];
            // Ensure project is open first
            if (currentProjectId != projectId) {
                await openProject(projectId, false);
            }
            showCreateTaskModal(false);
        }
    }
});

// ========================================
// NAVIGATION
// ========================================
function showLogin() {
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
}

function showRegister() {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
}

function backToProjects(updateUrl = true) {
    document.getElementById('projects-section').style.display = 'block';
    document.getElementById('tasks-section').style.display = 'none';
    currentProjectId = null;
    
    if (updateUrl) {
        history.pushState(null, '', '/dashboard');
    }
}

// ========================================
// AUTHENTICATION
// ========================================
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    showLoading();
    
    try {
        await api.auth.login(username, password);
        // Redirect to dashboard on success
        window.location.href = '/dashboard';
    } catch (error) {
        showToast('Error al iniciar sesión: ' + error.message, 'error');
        hideLoading();
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        await api.auth.register(username, email, password);
        showToast('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión', 'success');
        showLogin();
        
        // Auto-fill login form
        document.getElementById('login-username').value = username;
    } catch (error) {
        showToast('Error al registrarse: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function handleLogout() {
    api.auth.logout();
    window.location.href = '/';
}

// ========================================
// PROJECTS
// ========================================
async function loadProjects() {
    showLoading();
    
    try {
        const projects = await api.projects.getAll();
        console.log('Projects loaded:', projects);
        displayProjects(projects);
    } catch (error) {
        showToast('Error al cargar proyectos: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function displayProjects(projects) {
    console.log('Displaying projects:', projects);
    const grid = document.getElementById('projects-grid');
    if (!grid) return; // Guard clause
    
    if (!projects || projects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-secondary);">
                    No tienes proyectos aún
                </h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                    Crea tu primer proyecto para comenzar a organizar tus tareas
                </p>
                <button class="btn btn-primary" onclick="showCreateProjectModal()">
                    <span class="btn-icon">+</span>
                    Crear Primer Proyecto
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = projects
        .filter(project => {
            if (!project.id) {
                console.warn('Skipping project with invalid ID:', project);
                return false;
            }
            return true;
        })
        .map(project => `
        <div class="project-card" onclick="openProject(${project.id})">
            <div class="project-card-header">
                <div>
                    <h3>${escapeHtml(project.nombre)}</h3>
                </div>
                <div class="project-card-actions" onclick="event.stopPropagation()">
                    <button class="icon-btn" onclick="showEditProjectModal(${project.id}, '${escapeHtml(project.nombre)}', '${escapeHtml(project.descripcion || '')}')" title="Editar">
                        ✎
                    </button>
                    <button class="icon-btn" onclick="showDeleteConfirmation(${project.id})" title="Eliminar">
                        ×
                    </button>
                </div>
            </div>
            <p class="project-description">
                ${escapeHtml(project.descripcion || 'Sin descripción')}
            </p>
            <div class="project-meta">
                <span class="project-date">
                    ${formatDate(project.fechaCreacion)}
                </span>
                <span class="project-badge">Ver tareas →</span>
            </div>
        </div>
    `).join('');
}

function showCreateProjectModal(updateUrl = true) {
    document.getElementById('project-modal-title').textContent = 'Nuevo Proyecto';
    document.getElementById('project-submit-btn').textContent = 'Crear Proyecto';
    document.getElementById('project-modal').classList.add('active');
    document.getElementById('project-id').value = '';
    document.getElementById('project-name').value = '';
    document.getElementById('project-description').value = '';
    
    if (updateUrl) {
        history.pushState({modal: 'createProject'}, '', '/dashboard/proyectos');
    }
}

function showEditProjectModal(id, nombre, descripcion) {
    document.getElementById('project-modal-title').textContent = 'Editar Proyecto';
    document.getElementById('project-submit-btn').textContent = 'Guardar Cambios';
    document.getElementById('project-modal').classList.add('active');
    document.getElementById('project-id').value = id;
    document.getElementById('project-name').value = nombre;
    document.getElementById('project-description').value = descripcion;
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.remove('active');
    
    // Revert URL if we are on the create project URL
    if (window.location.pathname === '/dashboard/proyectos') {
        history.pushState(null, '', '/dashboard');
    }
}

async function handleSaveProject(event) {
    event.preventDefault();
    
    const id = document.getElementById('project-id').value;
    const nombre = document.getElementById('project-name').value;
    const descripcion = document.getElementById('project-description').value;
    
    showLoading();
    
    try {
        if (id) {
            // Update existing project
            await api.projects.update(id, nombre, descripcion);
            showToast('Proyecto actualizado exitosamente', 'success');
        } else {
            // Create new project
            await api.projects.create(nombre, descripcion);
            showToast('Proyecto creado exitosamente', 'success');
        }
        closeProjectModal();
        await loadProjects();
    } catch (error) {
        showToast('Error al guardar proyecto: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Delete confirmation modal
let projectToDelete = null;

function showDeleteConfirmation(id) {
    projectToDelete = id;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
    projectToDelete = null;
}

async function confirmDelete() {
    const idToDelete = projectToDelete;
    console.log('Attempting to delete project. ID:', idToDelete, 'Type:', typeof idToDelete);

    if (idToDelete === null || idToDelete === undefined || idToDelete === 'null' || idToDelete === 'undefined') {
        console.error('Invalid project ID for deletion:', idToDelete);
        showToast('Error: ID de proyecto inválido', 'error');
        closeDeleteModal();
        return;
    }
    
    showLoading();
    closeDeleteModal(); // This clears projectToDelete, but we have idToDelete
    
    try {
        console.log('Sending delete request for ID:', idToDelete);
        await api.projects.delete(idToDelete);
        showToast('Proyecto eliminado correctamente', 'success');
        await loadProjects();
    } catch (error) {
        console.error('Delete failed:', error);
        showToast('Error al eliminar proyecto: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function openProject(id, updateUrl = true) {
    currentProjectId = id;
    
    showLoading();
    
    try {
        const project = await api.projects.getById(id);
        const titleEl = document.getElementById('project-title');
        if (titleEl) titleEl.textContent = `Tareas: ${project.nombre}`;
        
        document.getElementById('projects-section').style.display = 'none';
        document.getElementById('tasks-section').style.display = 'block';
        
        if (updateUrl) {
            history.pushState({projectId: id}, '', `/dashboard/proyectos/${id}`);
        }
        
        await loadTasks(id);
    } catch (error) {
        showToast('Error al abrir proyecto: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// ========================================
// TASKS
// ========================================
async function loadTasks(projectId) {
    showLoading();
    
    try {
        const tasks = await api.tasks.getByProject(projectId);
        displayTasks(tasks);
    } catch (error) {
        showToast('Error al cargar tareas: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function displayTasks(tasks) {
    const list = document.getElementById('tasks-list');
    if (!list) return;

    if (!tasks || tasks.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem;">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-secondary);">
                    No hay tareas en este proyecto
                </h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                    Crea una nueva tarea para comenzar
                </p>
                <button class="btn btn-primary" onclick="showCreateTaskModal()">
                    <span class="btn-icon">+</span>
                    Crear Primera Tarea
                </button>
            </div>
        `;
        return;
    }
    
    list.innerHTML = tasks.map(task => `
        <div class="task-card">
            <div class="task-checkbox"></div>
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.titulo)}</div>
                <div class="task-description">${escapeHtml(task.descripcion || 'Sin descripción')}</div>
            </div>
            <div class="task-meta">
                <span class="task-status ${getStatusClass(task.estado)}">
                    ${task.estado || 'PENDIENTE'}
                </span>
            </div>
        </div>
    `).join('');
}

function showCreateTaskModal(updateUrl = true) {
    if (!currentProjectId) {
        showToast('Error: No hay proyecto seleccionado', 'error');
        return;
    }
    
    document.getElementById('task-modal').classList.add('active');
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-date').value = '';
    
    if (updateUrl) {
        history.pushState({modal: 'createTask'}, '', `/dashboard/proyectos/${currentProjectId}/tareas/nueva`);
    }
}

function closeTaskModal() {
    document.getElementById('task-modal').classList.remove('active');
    
    // Revert URL to project view
    if (currentProjectId) {
        history.pushState({projectId: currentProjectId}, '', `/dashboard/proyectos/${currentProjectId}`);
    }
}

async function handleCreateTask(event) {
    event.preventDefault();
    
    if (!currentProjectId) {
        showToast('Error: No hay proyecto seleccionado', 'error');
        return;
    }
    
    const titulo = document.getElementById('task-title').value;
    const descripcion = document.getElementById('task-description').value;
    const fechaVencimiento = document.getElementById('task-date').value || null;
    
    showLoading();
    
    try {
        await api.tasks.create(currentProjectId, titulo, descripcion, fechaVencimiento);
        showToast('Tarea creada exitosamente', 'success');
        closeTaskModal();
        await loadTasks(currentProjectId);
    } catch (error) {
        showToast('Error al crear tarea: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function getStatusClass(status) {
    if (!status) return 'pendiente';
    
    const statusLower = status.toLowerCase().replace('_', '-');
    return statusLower;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const projectModal = document.getElementById('project-modal');
    const taskModal = document.getElementById('task-modal');
    const deleteModal = document.getElementById('delete-modal');
    
    if (projectModal && event.target === projectModal) {
        closeProjectModal();
    }
    if (taskModal && event.target === taskModal) {
        closeTaskModal();
    }
    if (deleteModal && event.target === deleteModal) {
        closeDeleteModal();
    }
}
