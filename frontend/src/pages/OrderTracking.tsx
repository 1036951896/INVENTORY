import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { alert2 } from '../utils/notifications';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/order-tracking.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Order {
  id: string;
  numero?: string;
  estado: string;
  total: number;
  createdAt: string;
  usuario?: {
    nombre: string;
    email: string;
  };
}

export default function OrderTracking() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch(`${VITE_API_URL}/api/v1/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los pedidos');
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      alert2(error.message || 'Error al cargar los pedidos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      alert2('Debes iniciar sesión para ver tus pedidos', 'error');
      navigate('/login', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, []);

  const getEstadoClass = (estado: string) => {
    const estados: Record<string, string> = {
      'PENDIENTE': 'estado-pendiente',
      'EN_PREPARACION': 'estado-preparacion',
      'ENTREGADO': 'estado-entregado',
      'CANCELADO': 'estado-cancelado'
    };
    return estados[estado] || 'estado-pendiente';
  };

  const getEstadoText = (estado: string) => {
    const textos: Record<string, string> = {
      'PENDIENTE': '⏳ Pendiente',
      'EN_PREPARACION': '📦 En Preparación',
      'ENTREGADO': '✓ Entregado',
      'CANCELADO': '❌ Cancelado'
    };
    return textos[estado] || '⏳ Pendiente';
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="tracking-container">
        <div className="tracking-wrapper">
          <h1 className="tracking-titulo">Mis Pedidos</h1>

          {loading ? (
            <div className="tracking-loading">
              <div className="loading-spinner"></div>
              <p>Cargando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="tracking-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h2>No tienes pedidos aún</h2>
              <p>Comienza a comprar en StoreHub</p>
              <Link to="/" className="btn btn-principal">Ir a la Tienda</Link>
            </div>
          ) : (
            <div className="tracking-list">
              {orders.map((order) => {
                const fechaFormato = order.createdAt 
                  ? new Date(order.createdAt).toLocaleDateString('es-CO')
                  : 'Fecha no disponible';
                
                return (
                  <div key={order.id} className="tracking-item">
                    <div className="tracking-header">
                      <div className="tracking-info">
                        <h3>Pedido #{order.numero || `PED-${String(order.id).padStart(10, '0')}`}</h3>
                        <span className="tracking-fecha">{fechaFormato}</span>
                      </div>
                      <div className={`tracking-estado ${getEstadoClass(order.estado)}`}>
                        {getEstadoText(order.estado)}
                      </div>
                    </div>

                    <div className="tracking-details">
                      <div className="detail">
                        <span className="detail-label">Total:</span>
                        <span className="detail-value">${(order.total || 0).toLocaleString('es-CO', {minimumFractionDigits: 0})}</span>
                      </div>
                      <div className="detail">
                        <span className="detail-label">Estado:</span>
                        <span className="detail-value">{getEstadoText(order.estado)}</span>
                      </div>
                    </div>

                    <div className="tracking-action">
                      <Link to={`/pedido-confirmado/${order.id}`} className="btn btn-pequeño">
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="tracking-footer">
            <Link to="/" className="btn btn-secundario">Volver al Inicio</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
