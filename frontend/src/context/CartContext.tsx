import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, CartItem } from '../types';
import { alert2 } from '../utils/notifications';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => String(item.producto.id) === String(product.id));
      
      if (existing) {
        // Actualizar cantidad del producto existente
        return prev.map(item =>
          String(item.producto.id) === String(product.id)
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      }
      
      // Agregar nuevo producto
      return [...prev, { producto: product, cantidad: quantity }];
    });
    
    alert2(`✓ ${product.nombre} agregado al carrito`, 'success');
  };

  const removeFromCart = (productId: number | string) => {
    setCart(prev => prev.filter(item => String(item.producto.id) !== String(productId)));
    alert2('Producto eliminado del carrito', 'info');
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        String(item.producto.id) === String(productId)
          ? { ...item, cantidad: quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
