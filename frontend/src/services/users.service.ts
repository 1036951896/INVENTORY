import { api } from './api.client';

/**
 * Tipos para usuarios
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'CLIENT';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  email?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Servicio de usuarios
 * Maneja gestión de perfiles y administración de usuarios
 */
export const usersService = {
  /**
   * Obtiene lista de todos los usuarios (solo admin)
   */
  getAll: async (page = 1, limit = 10): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Obtiene un usuario por ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Obtiene el perfil del usuario autenticado
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  /**
   * Actualiza el perfil del usuario
   */
  updateProfile: async (data: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<User>('/users/profile', data);
    return response.data;
  },

  /**
   * Actualiza la información de un usuario (solo admin)
   */
  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Elimina un usuario (solo admin)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  /**
   * Cambia el rol de un usuario (solo admin)
   */
  changeRole: async (id: string, role: 'ADMIN' | 'CLIENT'): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/role`, { role });
    return response.data;
  },
};

export default usersService;
