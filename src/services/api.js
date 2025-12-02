// src/services/api.js
// Servicios para conectar con el backend

const API_BASE = '/api';

// Helper para hacer requests
const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Agregar user-id si existe en localStorage
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en la solicitud');
    }
    
    return data;
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    throw error;
  }
};

// ============================================
// AUTENTICACIÓN
// ============================================
export const authService = {
  login: async (username, password) => {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.user) {
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ============================================
// DEPORTISTAS
// ============================================
export const deportistasService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/deportistas${query ? `?${query}` : ''}`);
  },

  getById: (id) => fetchApi(`/deportistas/${id}`),

  getByRfid: (rfid) => fetchApi(`/deportistas/rfid/${rfid}`),

  create: (deportista) => fetchApi('/deportistas', {
    method: 'POST',
    body: JSON.stringify(deportista),
  }),

  update: (id, deportista) => fetchApi(`/deportistas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deportista),
  }),

  assignRfid: (id, rfidCode) => fetchApi(`/deportistas/${id}/rfid`, {
    method: 'PUT',
    body: JSON.stringify({ rfidCode }),
  }),

  delete: (id) => fetchApi(`/deportistas/${id}`, { method: 'DELETE' }),
};

// ============================================
// COMPETENCIAS
// ============================================
export const competenciasService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/competencias${query ? `?${query}` : ''}`);
  },

  getById: (id) => fetchApi(`/competencias/${id}`),

  create: (competencia) => fetchApi('/competencias', {
    method: 'POST',
    body: JSON.stringify(competencia),
  }),

  update: (id, competencia) => fetchApi(`/competencias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(competencia),
  }),

  cambiarEstado: (id, estado) => fetchApi(`/competencias/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado }),
  }),

  delete: (id) => fetchApi(`/competencias/${id}`, { method: 'DELETE' }),
};

// ============================================
// CARRERAS
// ============================================
export const carrerasService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/carreras${query ? `?${query}` : ''}`);
  },

  getActiva: () => fetchApi('/carreras/activa'),

  getById: (id) => fetchApi(`/carreras/${id}`),

  create: (carrera) => fetchApi('/carreras', {
    method: 'POST',
    body: JSON.stringify(carrera),
  }),

  asignarCarril: (id, rfidCode, carril) => fetchApi(`/carreras/${id}/asignar-carril`, {
    method: 'POST',
    body: JSON.stringify({ rfidCode, carril }),
  }),

  asignarSiguiente: (id, rfidCode) => fetchApi(`/carreras/${id}/asignar-siguiente`, {
    method: 'POST',
    body: JSON.stringify({ rfidCode }),
  }),

  iniciar: (id, tiempoInicio) => fetchApi(`/carreras/${id}/iniciar`, {
    method: 'PUT',
    body: JSON.stringify({ tiempoInicio }),
  }),

  registrarLlegada: (id, carril, tiempoLlegada, rfidCode) => 
    fetchApi(`/carreras/${id}/registrar-llegada`, {
      method: 'PUT',
      body: JSON.stringify({ carril, tiempoLlegada, rfidCode }),
    }),

  finalizar: (id) => fetchApi(`/carreras/${id}/finalizar`, { method: 'PUT' }),

  quitarParticipacion: (id, carril) => 
    fetchApi(`/carreras/${id}/participacion/${carril}`, { method: 'DELETE' }),
};

// ============================================
// EVENTOS DEL SENSOR
// ============================================
export const eventosService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/eventos${query ? `?${query}` : ''}`);
  },

  getUltimos: () => fetchApi('/eventos/ultimo'),

  getPendientes: () => fetchApi('/eventos/pendientes'),

  procesar: (idEvento, idCarrera) => fetchApi('/eventos/procesar', {
    method: 'POST',
    body: JSON.stringify({ idEvento, idCarrera }),
  }),

  procesarAutomatico: (idCarrera) => fetchApi('/eventos/procesar-automatico', {
    method: 'POST',
    body: JSON.stringify({ idCarrera }),
  }),

  simular: (carril, rfid, evento = 'TOQUE') => fetchApi('/eventos/simular', {
    method: 'POST',
    body: JSON.stringify({ carril, rfid, evento }),
  }),
};

// ============================================
// CATÁLOGOS
// ============================================
export const catalogosService = {
  getClubes: () => fetchApi('/catalogos/clubes'),
  createClub: (club) => fetchApi('/catalogos/clubes', {
    method: 'POST',
    body: JSON.stringify(club),
  }),

  getCategorias: () => fetchApi('/catalogos/categorias'),
  createCategoria: (categoria) => fetchApi('/catalogos/categorias', {
    method: 'POST',
    body: JSON.stringify(categoria),
  }),

  getPruebas: () => fetchApi('/catalogos/pruebas'),
  createPrueba: (prueba) => fetchApi('/catalogos/pruebas', {
    method: 'POST',
    body: JSON.stringify(prueba),
  }),

  getEstadisticas: () => fetchApi('/catalogos/estadisticas'),
};

// ============================================
// HEALTH CHECK
// ============================================
export const healthCheck = () => fetchApi('/health');

export default {
  auth: authService,
  deportistas: deportistasService,
  competencias: competenciasService,
  carreras: carrerasService,
  eventos: eventosService,
  catalogos: catalogosService,
  healthCheck,
};
