import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

export const prospectsApi = {
  getAll: (params) => api.get('/prospects', { params }),
  getOne: (id) => api.get(`/prospects/${id}`),
  create: (data) => api.post('/prospects', data),
  update: (id, data) => api.put(`/prospects/${id}`, data),
  getConversations: (id) => api.get(`/prospects/${id}/conversations`),
};

export const appointmentsApi = {
  getAll: (params) => api.get('/appointments', { params }),
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  getSlots: (date) => api.get(`/appointments/slots/${date}`),
  getAvailableDates: () => api.get('/appointments/available-dates'),
};

export default api;
