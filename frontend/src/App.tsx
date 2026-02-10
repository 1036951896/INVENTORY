import { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminProvider } from './context/admin';
import {
  AdminLogin,
  AdminDashboard,
  ProductsManagement,
  OrdersManagement,
  UsersManagement,
  Reports,
} from './components/admin';

// Types
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'cliente' | 'administrador';
};

type AppContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

function StoreFront() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/products')
      .then(r => r.json())
      .then(data => {
        const formattedProducts = data.data.map((p: any) => ({
          id: String(p.id),
          name: p.nombre,
          category: p.categoria,
          price: p.precio,
          stock: p.stock,
          image: p.imagen,
          description: p.descripcion || ''
        }));
        setProducts(formattedProducts);
      })
      .catch(err => console.error('Error loading products:', err))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  const contextValue: AppContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    user,
    setUser,
    products,
    setProducts
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider value={contextValue}>
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Header */}
        <header style={{ background: '#386273', color: '#fff', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '28px' }}>🛍️ Distribuidora Inventory</h1>
            <button
              onClick={() => setShowCart(!showCart)}
              style={{
                background: '#27ae60',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🛒 {totalItems > 0 ? `(${totalItems})` : ''}
            </button>
          </div>
        </header>

        {/* Cart Modal */}
        {showCart && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              zIndex: 1000
            }}
            onClick={() => setShowCart(false)}
          >
            <div
              style={{
                background: '#fff',
                width: '100%',
                maxWidth: '450px',
                height: '100vh',
                padding: '20px',
                overflowY: 'auto',
                boxShadow: '-2px 0 10px rgba(0,0,0,0.2)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Tu Carrito</h2>
                <button
                  onClick={() => setShowCart(false)}
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '16px',
                        padding: '12px',
                        border: '1px solid #eee',
                        borderRadius: '8px'
                      }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                        onError={e => (e.currentTarget.src = '/images/placeholder.svg')}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.product.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>${item.product.price}</p>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              background: '#f8f8f8',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            −
                          </button>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              background: '#f8f8f8',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            style={{
                              marginLeft: 'auto',
                              background: 'none',
                              border: 'none',
                              color: '#e74c3c',
                              cursor: 'pointer',
                              fontSize: '16px'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: '2px solid #eee', paddingTop: '16px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                      <span>Total:</span>
                      <span>${totalPrice.toLocaleString('es-CO')}</span>
                    </div>
                    <button
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#27ae60',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Proceder al Pago
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>Productos Disponibles</h2>

          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '18px', color: '#888' }}>Cargando productos...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
              {products.map(product => (
                <div
                  key={product.id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    onError={e => (e.currentTarget.src = '/images/placeholder.svg')}
                  />
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{product.name}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#888' }}>{product.category}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '600', color: '#386273' }}>
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                      <span style={{ fontSize: '12px', color: product.stock > 0 ? '#27ae60' : '#e74c3c' }}>
                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        alert(`✓ ${product.name} agregado al carrito`);
                      }}
                      disabled={product.stock === 0}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: product.stock > 0 ? '#27ae60' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/productos" element={<ProductsManagement />} />
          <Route path="/admin/pedidos" element={<OrdersManagement />} />
          <Route path="/admin/usuarios" element={<UsersManagement />} />
          <Route path="/admin/reportes" element={<Reports />} />

          {/* Store Routes */}
          <Route path="/" element={<StoreFront />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </AdminProvider>
    </BrowserRouter>
  );
}
