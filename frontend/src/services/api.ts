import axios from 'axios';

// URL base del backend
export const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_URL = `${BACKEND_URL}/api/v1`;

// Cliente HTTP configurado
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin-token') || localStorage.getItem('user-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globalmente
let redirectingToLogin = false;
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !redirectingToLogin) {
      // Token expirado o inválido — redirigir una sola vez
      redirectingToLogin = true;
      localStorage.removeItem('admin-token');
      localStorage.removeItem('user-token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin-usuario');
      window.location.replace('/login?expired=1');
    }
    return Promise.reject(error);
  }
);

export default api;
