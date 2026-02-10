// User types
export interface User {
  id: string;
  nombre?: string;  // Backend devuelve 'nombre'
  name?: string;    // Frontend puede usar 'name'
  email: string;
  password?: string;
  rol?: string;     // Backend devuelve 'rol' (ADMIN, CLIENTE, etc)
  role?: string;    // Frontend alternativa
  phone?: string;
  telefono?: string;
  createdAt?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Order types
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pendiente' | 'en preparación' | 'entregado' | 'cancelado';
  customerName: string;
  customerEmail: string;
  deliveryAddress?: string;
  phone?: string;
  notes?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
