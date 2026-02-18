import { api } from './api.client';

/**
 * Tipos para categorías
 */
export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  nombre: string;
  descripcion?: string;
  icono?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface CategoriesResponse {
  data: Category[];
  total?: number;
}

/**
 * Servicio de categorías
 * Maneja operaciones CRUD de categorías de productos
 */
export const categoriesService = {
  /**
   * Obtiene todas las categorías
   */
  getAll: async (): Promise<CategoriesResponse> => {
    const response = await api.get<CategoriesResponse>('/categories');
    return response.data;
  },

  /**
   * Obtiene una categoría por ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva categoría (solo admin)
   */
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  /**
   * Actualiza una categoría (solo admin)
   */
  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Elimina una categoría (solo admin)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export default categoriesService;
