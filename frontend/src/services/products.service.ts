import { api } from './api.client';

/**
 * Tipos para productos
 */
export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: string;
  categoriaId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoriaId: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Servicio de productos
 * Maneja operaciones CRUD de productos e inventario
 */
export const productsService = {
  /**
   * Obtiene lista de productos con paginación
   */
  getAll: async (page = 1, limit = 10): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Obtiene un producto por ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo producto (requiere rol ADMIN)
   */
  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  /**
   * Actualiza un producto existente (requiere rol ADMIN)
   */
  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Elimina un producto (requiere rol ADMIN)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  /**
   * Obtiene productos por categoría
   */
  getByCategory: async (categoryId: string, page = 1, limit = 10): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(
      `/products/category/${categoryId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Busca productos por nombre o descripción
   */
  search: async (query: string, page = 1, limit = 10): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(
      `/products?search=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export default productsService;
