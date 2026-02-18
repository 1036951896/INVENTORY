import axios, { AxiosInstance } from 'axios';

/**
 * Cliente HTTP centralizado para la aplicación
 * Maneja autenticación, respuestas y errores globales
 */
export const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para agregar token JWT a cada request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Interceptor para manejar errores globales
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado, logear usuario
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createApiClient();
