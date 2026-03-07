import api from './api';
import type { Product } from '../types';

export const productsService = {
  // Obtener todos los productos
  async getAll(page = 1, limit = 100): Promise<Product[]> {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    
    // El backend devuelve { data: [...], pagination: {...} }
    let products = Array.isArray(response.data) ? response.data : response.data?.data || [];
    
    // Mapear productos para extraer la imagen principal y convertir categoría
    return products.map((product: any) => ({
      ...product,
      categoria: product.categoria?.nombre || product.categoria || 'Sin categoría',
      imagen: product.imagenes?.[0]?.url || product.imagen || '',
    }));
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
    let products = Array.isArray(response.data) ? response.data : response.data?.data || [];
    
    return products.map((product: any) => ({
      ...product,
      categoria: product.categoria?.nombre || product.categoria || 'Sin categoría',
      imagen: product.imagenes?.[0]?.url || product.imagen || '',
    }));
  },
};
