import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Product, Order } from '../types';
import { productsService, ordersService, usersService } from '../services/api';

interface AdminContextType {
  adminUser: User | null;
  setAdminUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  loading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  loadOrders: () => Promise<void>;
  loadUsers: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const user = JSON.parse(saved);
      // Verificar que sea admin
      if (user.role === 'administrador' || user.rol === 'ADMIN') {
        return user;
      }
    }
    return null;
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getAll();
      const data = Array.isArray(response) ? response : response.data || [];
      setProducts(data);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load products';
      setError(errorMsg);
      console.error('Error loading products:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersService.getAll();
      const data = Array.isArray(response) ? response : response.data || [];
      setOrders(data);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load orders';
      setError(errorMsg);
      console.error('Error loading orders:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAll();
      const data = Array.isArray(response) ? response : response.data || [];
      setUsers(data);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load users';
      setError(errorMsg);
      console.error('Error loading users:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        setAdminUser,
        products,
        setProducts,
        orders,
        setOrders,
        users,
        setUsers,
        loading,
        error,
        loadProducts,
        loadOrders,
        loadUsers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
