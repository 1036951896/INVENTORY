import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { alert2 } from '../utils/notifications';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/order-confirmation.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface OrderItem {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  producto?: {
    nombre: string;
    imagen?: string;
    imagenes?: Array<{ url: string }>;
  };
}

interface Order {
  id: string;
  numero?: string;
  cliente: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  estado: string;
  items: OrderItem[];
  total: number;
  direccionEntrega?: any;
  metodoPago?: string;
  notas?: string;
}

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);

      const token = authService.getToken();
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch(`${VITE_API_URL}/api/v1/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el pedido');
      }

      const data = await response.json();
      
      // Format the order
      const formattedOrder: Order = {
        id: data.id,
        numero: data.numero || `PED-${String(data.id).padStart(10, '0')}`,
        cliente: data.usuario?.nombre || user?.nombre || 'Cliente',
        email: data.usuario?.email || user?.email || '',
        telefono: data.usuario?.telefono || user?.telefono || '',
        fecha: new Date(data.createdAt).toLocaleDateString('es-CO'),
        hora: new Date(data.createdAt).toLocaleTimeString('es-CO'),
        estado: data.estado || 'pendiente',
        items: data.items || [],
        total: data.total || 0,
        direccionEntrega: data.direccion,
        metodoPago: data.notasEntrega,
        notas: data.notasEntrega
      };

      setOrder(formattedOrder);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      alert2(error.message || 'Error al cargar el pedido', 'error');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    if (!user) {
      alert2('Debes iniciar sesión para ver tus pedidos', 'error');
      navigate('/login', { replace: true });
      return;
    }

    if (!id) {
      alert2('No se encontró el pedido', 'error');
      navigate('/', { replace: true });
      return;
    }
  }, [user, navigate, id]);

  useEffect(() => {
    if (user && id) {
      fetchOrder();
    }
  }, [id]);

  const getEstadoClass = (estado: string) => {
    const estados: Record<string, string> = {
      'pendiente': 'estado-pendiente',
      'confirmado': 'estado-confirmado',
      'en_proceso': 'estado-proceso',
      'enviado': 'estado-enviado',
      'entregado': 'estado-entregado',
      'cancelado': 'estado-cancelado'
    };
    return estados[estado] || 'estado-pendiente';
  };

  const getEstadoText = (estado: string) => {
    const estados: Record<string, string> = {
      'pendiente': '⏳ Pendiente',
      'confirmado': '✅ Confirmado',
      'en_proceso': '📦 En Proceso',
      'enviado': '🚚 Enviado',
      'entregado': '✓ Entregado',
      'cancelado': '❌ Cancelado'
    };
    return estados[estado] || '⏳ Pendiente';
  };

  const handleDownloadReceipt = () => {
    alert2('Función de descarga en desarrollo', 'info');
    // TODO: Implementar generación de PDF
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="confirmation-loading">
          <div className="loading-spinner"></div>
          <p>Cargando pedido...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="confirmation-error">
          <h2>Pedido no encontrado</h2>
          <Link to="/" className="btn btn-principal">Ir al Inicio</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="confirmacion-container">
        <div className="confirmacion-wrapper">
          
          {/* ICONO DE ÉXITO */}
          <div className="confirmacion-icono">
            <svg viewBox="0 0 52 52" className="checkmark">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>

          {/* TÍTULO */}
          <h1 className="confirmacion-titulo">¡Pedido Confirmado!</h1>
          <p className="confirmacion-mensaje">
            Hemos recibido tu pedido correctamente. Te enviaremos una notificación por WhatsApp con los detalles.
          </p>

          {/* NÚMERO DE PEDIDO */}
          <div className="confirmacion-numero">
            <p className="confirmacion-numero-label">Número de Pedido:</p>
            <div className="numero">{order.numero}</div>
          </div>

          {/* ESTADO */}
          <div className={`confirmacion-estado ${getEstadoClass(order.estado)}`}>
            {getEstadoText(order.estado)}
          </div>

          {/* DETALLES DEL PEDIDO */}
          <div className="confirmacion-detalles">
            <div className="detalles-grid">
              <div className="detalle-item">
                <span className="detalle-label">Cliente:</span>
                <span className="detalle-valor">{order.cliente}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Email:</span>
                <span className="detalle-valor">{order.email}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Teléfono:</span>
                <span className="detalle-valor">{order.telefono}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Total Items:</span>
                <span className="detalle-valor">{order.items.length}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Fecha:</span>
                <span className="detalle-valor">{order.fecha}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Hora:</span>
                <span className="detalle-valor">{order.hora}</span>
              </div>
              {order.metodoPago && (
                <div className="detalle-item">
                  <span className="detalle-label">Método de Pago:</span>
                  <span className="detalle-valor">{order.metodoPago}</span>
                </div>
              )}
            </div>

            {/* TRACKING STEPS */}
            <div className="tracking-container">
              <div className="tracking-step completed">
                <div className="step-indicator completed">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                  </svg>
                </div>
                <span className="step-label completed">Recibido</span>
              </div>
              <div className={`tracking-step ${order.estado === 'PENDIENTE' ? 'active' : 'completed'}`}>
                <div className={`step-indicator ${order.estado !== 'PENDIENTE' ? 'completed' : 'active'}`}>
                  {order.estado === 'PENDIENTE' ? '2' : '✓'}
                </div>
                <span className={`step-label ${order.estado !== 'PENDIENTE' ? 'completed' : 'active'}`}>Confirmado</span>
              </div>
              <div className={`tracking-step ${['EN_PREPARACION', 'ENTREGADO'].includes(order.estado) ? 'completed' : ''}`}>
                <div className={`step-indicator ${['EN_PREPARACION', 'ENTREGADO'].includes(order.estado) ? 'completed' : ''}`}>
                  {['EN_PREPARACION', 'ENTREGADO'].includes(order.estado) ? '✓' : '3'}
                </div>
                <span className={`step-label ${['EN_PREPARACION', 'ENTREGADO'].includes(order.estado) ? 'completed' : ''}`}>En Preparación</span>
              </div>
              <div className={`tracking-step ${order.estado === 'ENTREGADO' ? 'completed' : ''}`}>
                <div className={`step-indicator ${order.estado === 'ENTREGADO' ? 'completed' : ''}`}>
                  {order.estado === 'ENTREGADO' ? '✓' : '4'}
                </div>
                <span className={`step-label ${order.estado === 'ENTREGADO' ? 'completed' : ''}`}>Entregado</span>
              </div>
            </div>

            {/* PRODUCTOS */}
            <div className="confirmacion-productos">
              <h3>Productos Ordenados</h3>
              {order.items.map((item, index) => {
                const subtotal = item.cantidad * item.precioUnitario;
                const imagen = item.producto?.imagenes?.[0]?.url || item.producto?.imagen;
                return (
                  <div key={index} className="producto-item">
                    {imagen && (
                      <img 
                        src={imagen} 
                        alt={item.producto?.nombre}
                        className="producto-imagen"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="producto-info">
                      <span className="producto-cantidad">{item.cantidad}x</span>
                      <div className="producto-detalles">
                        <span className="producto-nombre">
                          {item.producto?.nombre || `Producto #${item.productoId}`}
                        </span>
                        <span className="producto-unitario">
                          ${item.precioUnitario.toLocaleString('es-CO', {minimumFractionDigits: 0})}
                        </span>
                      </div>
                    </div>
                    <span className="producto-precio">${subtotal.toLocaleString('es-CO', {minimumFractionDigits: 0})}</span>
                  </div>
                );
              })}
            </div>

            {/* TOTAL */}
            <div className="confirmacion-total">
              <span>Total del Pedido:</span>
              <span className="total-monto">${order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* DIRECCIÓN DE ENTREGA */}
          {order.direccionEntrega && (
            <div className="confirmacion-direccion">
              <h3>📍 Dirección de Entrega</h3>
              <p>
                {order.direccionEntrega.calle} {order.direccionEntrega.numero}
                {order.direccionEntrega.apartamento && `, ${order.direccionEntrega.apartamento}`}
                <br />
                {order.direccionEntrega.ciudad}, {order.direccionEntrega.departamento}
                {order.direccionEntrega.codigoPostal && ` - ${order.direccionEntrega.codigoPostal}`}
              </p>
            </div>
          )}

          {/* NOTAS */}
          {order.notas && (
            <div className="confirmacion-notas">
              <h3>📝 Notas Adicionales</h3>
              <p>{order.notas}</p>
            </div>
          )}

          {/* MENSAJE DE ESPERA */}
          <div className="confirmacion-info">
            <p>
              ⏰ Nuestro equipo está procesando tu pedido. 
              Te contactaremos pronto por WhatsApp al número <strong>{order.telefono}</strong> para confirmar los detalles de la entrega.
            </p>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="confirmacion-acciones">
            <Link to="/" className="btn btn-secundario">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Ir al Inicio
            </Link>
            <button onClick={handleDownloadReceipt} className="btn btn-principal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Descargar Recibo
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
