import { api } from './api';

/**
 * Servicio para gestionar productos
 */
export const productsApiService = {
  // Obtener todos los productos
  getAll: async (limit = 100, page = 1) => {
    const response = await api.get(`/products?limit=${limit}&page=${page}`);
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Crear un nuevo producto (solo admin)
  create: async (data: any) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Actualizar un producto (solo admin)
  update: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Eliminar un producto (solo admin)
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Agregar imagen a producto
  addImage: async (imageData: any) => {
    const response = await api.post('/product-images', imageData);
    return response.data;
  },

  // Eliminar imagen de producto
  deleteImage: async (imageId: string) => {
    const response = await api.delete(`/product-images/${imageId}`);
    return response.data;
  },
};

/**
 * Servicio para gestionar categorías
 */
export const categoriesApiService = {
  // Obtener todas las categorías
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Crear una nueva categoría
  create: async (data: any) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Actualizar una categoría
  update: async (id: string, data: any) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Eliminar una categoría
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

/**
 * Servicio para gestionar ofertas (PROXIMAS)
 * Nota: Este modelo no está implementado aún en el backend
 */
export const offersApiService = {
  // Obtener todas las ofertas
  getAll: async () => {
    // TODO: Implementar en backend
    return [];
  },

  // Crear una nueva oferta
  create: async (data: any) => {
    // TODO: Implementar en backend
    return data;
  },

  // Actualizar una oferta
  update: async (_id: string, data: any) => {
    // TODO: Implementar en backend
    return data;
  },

  // Eliminar una oferta
  delete: async (_id: string) => {
    // TODO: Implementar en backend
    return { id: _id };
  },
};

/**
 * Servicio para gestionar pedidos (órdenes)
 */
export const ordersApiService = {
  // Obtener todas las órdenes (admin)
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Obtener una orden por ID
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Crear una nueva orden
  create: async (data: any) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Actualizar estado de una orden
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/orders/${id}/status`, { estado: status });
    return response.data;
  },

  // Obtener estadísticas de órdenes (admin)
  getStatistics: async () => {
    const response = await api.get('/orders/admin/statistics');
    return response.data;
  },
};

/**
 * Servicio para gestionar usuarios
 */
export const usersApiService = {
  // Obtener todos los usuarios (admin)
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Obtener un usuario por ID
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Actualizar un usuario
  update: async (id: string, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Eliminar un usuario (admin)
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

/**
 * Servicio para gestionar inventario
 */
export const inventoryApiService = {
  // Obtener movimientos de inventario
  getMovements: async () => {
    const response = await api.get('/stock-movements');
    return response.data;
  },

  // Registrar movimiento de inventario
  registerMovement: async (data: any) => {
    const response = await api.post('/stock-movements', data);
    return response.data;
  },

  // Obtener estado de inventario
  getStatus: async () => {
    const response = await api.get('/products?limit=1000');
    return response.data;
  },
};

export default {
  productsApiService,
  categoriesApiService,
  offersApiService,
  ordersApiService,
  usersApiService,
  inventoryApiService,
};
