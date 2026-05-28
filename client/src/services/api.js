import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

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

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getBySource: () => api.get('/analytics/by-source'),
  getTimeSeries: (params) => api.get('/analytics/time-series', { params }),
  getAppointmentStats: () => api.get('/analytics/appointments'),
  getRecentActivity: () => api.get('/analytics/recent'),
};

export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
};

export const chatbotApi = {
  sendMessage: (session_id, message) => api.post('/chatbot/message', { session_id, message }),
};

export default api;
