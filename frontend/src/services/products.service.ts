import api from './api';
import type { Product } from '../types';

export const productsService = {
  // Obtener todos los productos
  async getAll(page = 1, limit = 100): Promise<Product[]> {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    // El backend puede devolver {data: [...]} o directamente [...]
    return Array.isArray(response.data) ? response.data : response.data.data;
  },

  // Obtener producto por ID
  async getById(id: number | string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Crear producto (solo admin)
  async create(productData: Partial<Product>): Promise<Product> {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Actualizar producto (solo admin)
  async update(id: number | string, productData: Partial<Product>): Promise<Product> {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  // Eliminar producto (solo admin)
  async delete(id: number | string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Buscar productos
  async search(query: string): Promise<Product[]> {
    const response = await api.get(`/products/search?q=${query}`);
    return Array.isArray(response.data) ? response.data : response.data.data;
  },
};
