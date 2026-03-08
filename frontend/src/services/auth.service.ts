import api from './api';
import type { User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  direccion: {
    calle: string;
    numero: string;
    apartamento?: string | null;
    ciudad: string;
    departamento: string;
    codigoPostal?: string | null;
    pais: string;
  };
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  // Login de usuario
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('user-token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login de administrador
  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/admin/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('admin-token', response.data.access_token);
      localStorage.setItem('admin-usuario', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Registro de usuario
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('user-token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('user-token');
    localStorage.removeItem('admin-token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin-usuario');
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user') || localStorage.getItem('admin-usuario');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!(localStorage.getItem('user-token') || localStorage.getItem('admin-token'));
  },

  // Verificar si es admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'ADMIN';
  },

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('user-token') || localStorage.getItem('admin-token');
  },
};

// Función helper para verificar si el usuario es admin
export const isUserAdmin = (): boolean => {
  return authService.isAdmin();
};
