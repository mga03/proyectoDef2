// API Configuration
const API_BASE_URL = "http://localhost:8080/api";

// Storage keys
const TOKEN_KEY = "taskflow_token";
const USER_KEY = "taskflow_user";

// API Helper Functions
const api = {
  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Save auth token to localStorage
  saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove auth token
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Save user info
  saveUser(username) {
    localStorage.setItem(USER_KEY, username);
  },

  // Get user info
  getUser() {
    return localStorage.getItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Generic request function
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.removeToken();
        window.location.reload();
        throw new Error(
          "Sesión expirada. Por favor, inicia sesión nuevamente."
        );
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Error: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Auth endpoints
  auth: {
    async register(username, email, password) {
      return await api.request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
    },

    async login(username, password) {
      const response = await api.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.token) {
        api.saveToken(response.token);
        api.saveUser(username);
      }

      return response;
    },

    logout() {
      api.removeToken();
    },
  },

  // Projects endpoints
  projects: {
    async getAll() {
      return await api.request("/proyectos", {
        method: "GET",
      });
    },

    async getById(id) {
      return await api.request(`/proyectos/${id}`, {
        method: "GET",
      });
    },

    async create(nombre, descripcion) {
      return await api.request("/proyectos", {
        method: "POST",
        body: JSON.stringify({ nombre, descripcion }),
      });
    },

    async update(id, nombre, descripcion) {
      return await api.request(`/proyectos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nombre, descripcion }),
      });
    },

    async delete(id) {
      return await api.request(`/proyectos/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Tasks endpoints
  tasks: {
    async getByProject(proyectoId) {
      return await api.request(`/proyectos/${proyectoId}/tareas`, {
        method: "GET",
      });
    },

    async create(proyectoId, titulo, descripcion, fechaVencimiento) {
      return await api.request(`/proyectos/${proyectoId}/tareas`, {
        method: "POST",
        body: JSON.stringify({
          titulo,
          descripcion,
          fechaVencimiento,
        }),
      });
    },

    async update(
      proyectoId,
      tareaId,
      titulo,
      descripcion,
      fechaVencimiento,
      estado
    ) {
      return await api.request(`/proyectos/${proyectoId}/tareas/${tareaId}`, {
        method: "PUT",
        body: JSON.stringify({
          titulo,
          descripcion,
          fechaVencimiento,
          estado,
        }),
      });
    },

    async delete(proyectoId, tareaId) {
      return await api.request(`/proyectos/${proyectoId}/tareas/${tareaId}`, {
        method: "DELETE",
      });
    },
  },
};
