// Tipos principales del proyecto

export interface Product {
  id: number | string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen: string;
  imagenes?: { url: string }[];
  descripcion?: string;
  activo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  fechaCreacion?: string;
}

export interface CartItem {
  producto: Product;
  cantidad: number;
}

export interface User {
  id: string | number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: 'ADMIN' | 'CLIENTE';
  permisos?: Record<string, boolean>;
  access_token?: string;
}

export interface Order {
  id: number;
  usuario_id: number;
  total: number;
  status: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  items: OrderItem[];
  direccion?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Product;
}

export interface Address {
  id?: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  es_predeterminada?: boolean;
}

export interface Notification {
  id: number;
  tipo: 'pedido' | 'sistema' | 'stock';
  mensaje: string;
  leida: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  createdAt: string;
}
