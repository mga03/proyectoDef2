// CONFIGURACIÓN: Apuntamos al puerto 8083 (Backend)
const API_BASE_URL = "http://localhost:8083/api";
const TOKEN_KEY = "taskflow_token";
const USER_KEY = "taskflow_user";

const api = {
  getToken() { return localStorage.getItem(TOKEN_KEY); },
  saveToken(token) { localStorage.setItem(TOKEN_KEY, token); },
  removeToken() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
  saveUser(username) { localStorage.setItem(USER_KEY, username); },
  getUser() { return localStorage.getItem(USER_KEY); },
  isAuthenticated() { return !!this.getToken(); },

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    const config = {
      headers: { 
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // Enviamos token por si acaso
        ...options.headers 
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const contentType = response.headers.get("content-type");
      return contentType && contentType.includes("application/json") ? await response.json() : await response.text();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // --- 1. SIMULACIÓN DE SEGURIDAD ---
  // Como PruebaApi no tiene login, lo simulamos aquí para que la web te deje entrar.
  auth: {
    async register(username, email, password) {
      return Promise.resolve({ message: "Registro simulado OK" });
    },
    async login(username, password) {
      // Simulación: Si es admin/123456 te deja pasar
      if (username === "admin" && password === "123456") {
        const fakeToken = "token_falso_bypass";
        api.saveToken(fakeToken);
        api.saveUser(username);
        return Promise.resolve({ token: fakeToken });
      }
      return Promise.reject(new Error("Usuario incorrecto (Mock)"));
    },
    logout() { api.removeToken(); },
  },

  // --- 2. PROYECTOS (Directo a la API) ---
  projects: {
    async getAll() { return await api.request("/proyectos"); },
    async getById(id) { return await api.request(`/proyectos/${id}`); },
    async create(nombre, descripcion) {
      // Enviamos valores por defecto que la API pueda necesitar
      return await api.request("/proyectos", {
        method: "POST",
        body: JSON.stringify({ nombre, descripcion, estado: "ACTIVO", prioridad: 1 }),
      });
    },
    async update(id, nombre, descripcion) {
      const current = await this.getById(id); // Recuperar para no borrar otros campos
      return await api.request(`/proyectos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...current, nombre, descripcion }),
      });
    },
    async delete(id) { return await api.request(`/proyectos/${id}`, { method: "DELETE" }); },
  },

  // --- 3. TAREAS (Adaptado: Filtro Manual) ---
  tasks: {
    async getByProject(proyectoId) {
      // PROBLEMA: PruebaApi no tiene endpoint "/proyectos/{id}/tareas"
      // SOLUCIÓN: Pedimos TODAS y filtramos aquí en el navegador
      const allTasks = await api.request("/tareas");
      return allTasks.filter(t => t.proyectoId == proyectoId);
    },
    async create(proyectoId, titulo, descripcion, fechaVencimiento) {
      return await api.request("/tareas", {
        method: "POST",
        body: JSON.stringify({
          titulo, descripcion, fechaVencimiento,
          proyectoId: parseInt(proyectoId), // Vinculamos manualmente
          estado: "PENDIENTE", prioridad: 1
        }),
      });
    },
    async update(proyectoId, tareaId, titulo, descripcion, fechaVencimiento, estado) {
      const current = await api.request(`/tareas/${tareaId}`);
      return await api.request(`/tareas/${tareaId}`, {
        method: "PUT",
        body: JSON.stringify({ ...current, titulo, descripcion, fechaVencimiento, estado }),
      });
    },
    async delete(proyectoId, tareaId) { return await api.request(`/tareas/${tareaId}`, { method: "DELETE" }); },
  },
};