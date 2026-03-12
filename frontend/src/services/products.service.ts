import api, { BACKEND_URL } from './api';
import type { Product } from '../types';

export const productsService = {
  // Obtener todos los productos
  async getAll(page = 1, limit = 100): Promise<Product[]> {
    try {
      const response = await api.get(`/products?page=${page}&limit=${limit}`);
      
      // Manejar ambos casos: array directo o {data: [...], pagination: {...}}
      let products: any[] = [];
      
      if (Array.isArray(response.data)) {
        // Si es un array directo
        products = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Si es {data: [...], pagination: {...}}
        products = response.data.data;
      } else {
        // Caso inesperado
        console.error('Unexpected response format:', response.data);
        return [];
      }
      
      // Función para obtener URL de imagen completa
      const getImageUrl = (product: any): string => {
        const imagen = product.imagenes?.[0]?.url || product.imagen || '';
        if (!imagen) return '';
        // Las imágenes vienen con rutas relativas tipo /images/productos/nombre.jpg
        // Solo agregar BACKEND_URL si no es una URL completa
        if (imagen.startsWith('http')) return imagen;
        if (imagen.startsWith('/')) return `${BACKEND_URL}${imagen}`;
        // Si no empieza con /, asumir que es relativa a /
        return `${BACKEND_URL}/${imagen}`;
      };

      // Mapear productos para extraer la imagen principal y convertir categoría
      const mapped = products.map((product: any) => {
        const categoria = product.categoria?.nombre || product.categoria || 'Sin categoría';
        
        const mappedProduct: Product = {
          id: product.id,
          nombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: product.precio || 0,
          stock: product.stock || 0,
          categoria,
          imagen: getImageUrl(product),
          activo: product.activo ?? true,
        };
        return mappedProduct;
      });
      
      return mapped;
    } catch (error: any) {
      console.error('Error in productsService.getAll:', error);
      throw error;
    }
  },

  // Obtener producto por ID
  async getById(id: number | string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data;
      
      // Función para obtener URL de imagen completa
      const getImageUrl = (img: string): string => {
        if (!img) return '';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return `${BACKEND_URL}${img}`;
        return `${BACKEND_URL}/${img}`;
      };

      // Procesar la respuesta
      const imagen = product.imagenes?.[0]?.url || product.imagen || '';
      const categoria = product.categoria?.nombre || product.categoria || 'Sin categoría';
      
      return {
        id: product.id,
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || 0,
        stock: product.stock || 0,
        categoria,
        imagen: getImageUrl(imagen),
        activo: product.activo ?? true,
        imagenes: product.imagenes || [] // Incluir array completo de imágenes
      } as any;
    } catch (error: any) {
      console.error('Error in productsService.getById:', error);
      throw error;
    }
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
    try {
      const response = await api.get(`/products/search?q=${query}`);
      
      // Manejar ambos casos: array directo o {data: [...], pagination: {...}}
      let products: any[] = [];
      
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      } else {
        console.error('Unexpected search response format:', response.data);
        return [];
      }
      
      return products.map((product: any) => {
        const imagen = product.imagenes?.[0]?.url || product.imagen || '';
        const categoria = product.categoria?.nombre || product.categoria || 'Sin categoría';
        
        return {
          id: product.id,
          nombre: product.nombre || '',
          descripcion: product.descripcion || '',
          precio: product.precio || 0,
          stock: product.stock || 0,
          categoria,
          imagen,
          activo: product.activo ?? true,
        } as Product;
      });
    } catch (error: any) {
      console.error('Error in productsService.search:', error);
      throw error;
    }
  },
};
