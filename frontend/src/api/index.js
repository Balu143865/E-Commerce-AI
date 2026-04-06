import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  getCategories: () => api.get('/products/meta/categories')
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/add', data),
  updateItem: (productId, data) => api.put(`/cart/update/${productId}`, data),
  removeItem: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear')
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  getAllAdmin: (params) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  updatePayment: (id, data) => api.put(`/orders/${id}/payment`, data)
};

// Recommendation APIs
export const recommendationAPI = {
  getPersonalized: (limit) => api.get('/recommendations/personalized', { params: { limit } }),
  getContentBased: (limit) => api.get('/recommendations/content-based', { params: { limit } }),
  getCollaborative: (limit) => api.get('/recommendations/collaborative', { params: { limit } }),
  getRecentlyViewed: (limit) => api.get('/recommendations/recently-viewed', { params: { limit } }),
  logSearch: (data) => api.post('/recommendations/log-search', data)
};

export default api;