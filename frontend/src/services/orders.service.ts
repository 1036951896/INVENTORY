import { api } from './api.client';

/**
 * Tipos para órdenes
 */
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddressId: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Servicio de órdenes
 * Maneja creación, consulta y actualización de órdenes de compra
 */
export const ordersService = {
  /**
   * Obtiene todas las órdenes (admin) o las del usuario actual (cliente)
   */
  getAll: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const response = await api.get<OrdersResponse>(`/orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Obtiene una orden por ID
   */
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva orden
   */
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  /**
   * Actualiza el estado de una orden (solo admin)
   */
  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  /**
   * Obtiene órdenes de un usuario específico
   */
  getByUserId: async (userId: string, page = 1, limit = 10): Promise<OrdersResponse> => {
    const response = await api.get<OrdersResponse>(
      `/orders/user/${userId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Cancela una orden
   */
  cancel: async (id: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status: 'CANCELLED' });
    return response.data;
  },

  /**
   * Elimina una orden (solo admin)
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};

export default ordersService;
