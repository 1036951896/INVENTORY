import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { authService } from '../services/auth.service';
import { alert2 } from '../utils/notifications';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/checkout.css';

interface Address {
  calle: string;
  numero: string;
  apartamento?: string;
  ciudad: string;
  departamento: string;
  codigoPostal?: string;
  pais: string;
}

export default function Checkout() {
  const { cart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [user] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  
  // Datos de dirección
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);
  const [address, setAddress] = useState<Address>({
    calle: '',
    numero: '',
    apartamento: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    pais: 'Colombia'
  });
  
  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [notes, setNotes] = useState('');

  // Cargar dirección del usuario al iniciał
  useEffect(() => {
    if (!user) {
      alert2('Debes iniciar sesión para continuar', 'error');
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      alert2('Tu carrito está vacío', 'warning');
      navigate('/');
      return;
    }

    // Cargar dirección principal del usuario
    fetchUserAddress();
  }, [user, cart, navigate]);

  const fetchUserAddress = async () => {
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/addresses/principal`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.calle) {
          setSavedAddress({
            calle: data.calle,
            numero: data.numero,
            apartamento: data.apartamento || '',
            ciudad: data.ciudad,
            departamento: data.departamento,
            codigoPostal: data.codigoPostal || '',
            pais: data.pais || 'Colombia'
          });
          // Auto-cargar la dirección guardada
          setAddress({
            calle: data.calle,
            numero: data.numero,
            apartamento: data.apartamento || '',
            ciudad: data.ciudad,
            departamento: data.departamento,
            codigoPostal: data.codigoPostal || '',
            pais: data.pais || 'Colombia'
          });
        }
      }
    } catch (error) {
      console.error('Error cargando dirección:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleUseSavedAddress = () => {
    if (savedAddress) {
      setAddress(savedAddress);
      setUseSavedAddress(true);
    }
  };

  const handleSubmitOrder = async () => {
    // Validaciones
    if (!address.calle || !address.numero || !address.ciudad || !address.departamento) {
      alert2('Por favor completa todos los campos de dirección obligatorios', 'error');
      return;
    }

    const token = authService.getToken();
    if (!token) {
      alert2('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 'error');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // Paso 1: Crear dirección en el backend
      const addressResp = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/addresses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            calle: address.calle,
            numero: address.numero,
            apartamento: address.apartamento || undefined,
            ciudad: address.ciudad,
            departamento: address.departamento,
            codigoPostal: address.codigoPostal || undefined,
            pais: address.pais || 'Colombia',
            esPrincipal: true
          })
        }
      );

      if (!addressResp.ok) {
        const error = await addressResp.json();
        throw new Error(error.message || 'Error al guardar la dirección');
      }

      const addressData = await addressResp.json();
      const direccionId = addressData.id || addressData.direccionId;

      if (!direccionId) {
        throw new Error('No se obtuvo el ID de la dirección');
      }

      // Paso 2: Crear pedido con el direccionId
      const items = cart.map(item => ({
        productoId: String(item.producto.id),
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio
      }));

      const notasCompletas = [
        `Método de pago: ${paymentMethod === 'efectivo' ? 'Efectivo contra entrega' : paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : 'Nequi/Daviplata'}`,
        notes ? `Notas: ${notes}` : ''
      ]
        .filter(Boolean)
        .join('\n');

      const resp = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            items,
            direccionId,
            notasEntrega: notasCompletas || undefined
          })
        }
      );

      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.message || 'Error al crear el pedido');
      }

      const data = await resp.json();
      
      // Limpiar carrito
      clearCart();
      
      // Mostrar mensaje de éxito
      alert2('¡Pedido creado exitosamente!', 'success');
      
      // Redirigir a página de confirmación
      navigate(`/pedido-confirmado/${data.id}`);
      
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      alert2(error.message || 'Error al crear el pedido. Intenta nuevamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <>
      <Header />
      
      <main className="checkout-container">
        <div className="checkout-wrapper">
          <h1 className="checkout-title">Confirmar Pedido</h1>
          
          <div className="checkout-grid">
            {/* COLUMNA IZQUIERDA: FORMULARIOS */}
            <div className="checkout-forms">
              
              {/* INFORMACIÓN DE ENTREGA */}
              <section className="checkout-section">
                <h2 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Dirección de Entrega
                </h2>

                {loadingAddress ? (
                  <div className="loading-address">
                    <div className="spinner-mini"></div>
                    <p>Cargando tu dirección...</p>
                  </div>
                ) : savedAddress ? (
                  <>
                    {/* OPCIONES DE DIRECCIÓN */}
                    <div className="address-options">
                      <label className={`address-option ${useSavedAddress ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="addressOption"
                          checked={useSavedAddress}
                          onChange={() => {
                            setUseSavedAddress(true);
                            handleUseSavedAddress();
                          }}
                        />
                        <div className="option-content">
                          <span className="option-title">📍 Mi dirección guardada</span>
                          <span className="option-desc">
                            {savedAddress.calle} {savedAddress.numero}
                            {savedAddress.apartamento && `, ${savedAddress.apartamento}`}
                            <br />
                            {savedAddress.ciudad}, {savedAddress.departamento}
                          </span>
                        </div>
                      </label>

                      <label className={`address-option ${!useSavedAddress ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="addressOption"
                          checked={!useSavedAddress}
                          onChange={() => setUseSavedAddress(false)}
                        />
                        <div className="option-content">
                          <span className="option-title">🏠 Entregar en otro lugar</span>
                          <span className="option-desc">Especifica una dirección diferente</span>
                        </div>
                      </label>
                    </div>

                    {/* FORMULARIO SOLO SI SELECCIONA OTRO LUGAR */}
                    {!useSavedAddress && (
                      <div className="address-form-container">
                        <p className="form-subtitle">Ingresa la dirección de entrega</p>
                        <div className="form-grid">
                          <div className="form-group span-2">
                            <label htmlFor="calle">Calle *</label>
                            <input
                              type="text"
                              id="calle"
                              name="calle"
                              required
                              placeholder="Ej: Carrera 64 b"
                              value={address.calle}
                              onChange={handleAddressChange}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="numero">Número *</label>
                            <input
                              type="text"
                              id="numero"
                              name="numero"
                              required
                              placeholder="Ej: 40-33"
                              value={address.numero}
                              onChange={handleAddressChange}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="apartamento">Apartamento (Opcional)</label>
                            <input
                              type="text"
                              id="apartamento"
                              name="apartamento"
                              placeholder="Ej: 101"
                              value={address.apartamento || ''}
                              onChange={handleAddressChange}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="ciudad">Ciudad *</label>
                            <input
                              type="text"
                              id="ciudad"
                              name="ciudad"
                              required
                              placeholder="Ej: Bogotá"
                              value={address.ciudad}
                              onChange={handleAddressChange}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="departamento">Departamento *</label>
                            <input
                              type="text"
                              id="departamento"
                              name="departamento"
                              required
                              placeholder="Ej: Cundinamarca"
                              value={address.departamento}
                              onChange={handleAddressChange}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="codigoPostal">Código Postal (Opcional)</label>
                            <input
                              type="text"
                              id="codigoPostal"
                              name="codigoPostal"
                              placeholder="Ej: 110111"
                              value={address.codigoPostal || ''}
                              onChange={handleAddressChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Si no hay dirección guardada, mostrar formulario directo
                  <div className="form-grid">
                    <div className="form-group span-2">
                      <label htmlFor="calle">Calle *</label>
                      <input
                        type="text"
                        id="calle"
                        name="calle"
                        required
                        placeholder="Ej: Carrera 64 b"
                        value={address.calle}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="numero">Número *</label>
                      <input
                        type="text"
                        id="numero"
                        name="numero"
                        required
                        placeholder="Ej: 40-33"
                        value={address.numero}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="apartamento">Apartamento (Opcional)</label>
                      <input
                        type="text"
                        id="apartamento"
                        name="apartamento"
                        placeholder="Ej: 101"
                        value={address.apartamento || ''}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="ciudad">Ciudad *</label>
                      <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        required
                        placeholder="Ej: Bogotá"
                        value={address.ciudad}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="departamento">Departamento *</label>
                      <input
                        type="text"
                        id="departamento"
                        name="departamento"
                        required
                        placeholder="Ej: Cundinamarca"
                        value={address.departamento}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="codigoPostal">Código Postal (Opcional)</label>
                      <input
                        type="text"
                        id="codigoPostal"
                        name="codigoPostal"
                        placeholder="Ej: 110111"
                        value={address.codigoPostal || ''}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* MÉTODO DE PAGO */}
              <section className="checkout-section">
                <h2 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Método de Pago
                </h2>
                
                <div className="payment-methods">
                  <label className={`payment-option ${paymentMethod === 'efectivo' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="efectivo"
                      checked={paymentMethod === 'efectivo'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <span className="payment-icon">💵</span>
                      <div>
                        <div className="payment-name">Efectivo</div>
                        <div className="payment-desc">Pago contra entrega</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${paymentMethod === 'transferencia' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === 'transferencia'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <span className="payment-icon">🏦</span>
                      <div>
                        <div className="payment-name">Transferencia Bancaria</div>
                        <div className="payment-desc">Te enviaremos los datos por WhatsApp</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${paymentMethod === 'nequi' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nequi"
                      checked={paymentMethod === 'nequi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <span className="payment-icon">📱</span>
                      <div>
                        <div className="payment-name">Nequi / Daviplata</div>
                        <div className="payment-desc">Pago por billetera digital</div>
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              {/* NOTAS ADICIONALES */}
              <section className="checkout-section">
                <h2 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  Notas Adicionales (Opcional)
                </h2>
                
                <textarea
                  className="checkout-notes"
                  placeholder="Agrega instrucciones especiales para la entrega..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </section>
            </div>

            {/* COLUMNA DERECHA: RESUMEN */}
            <div className="checkout-summary">
              <div className="summary-card">
                <h2 className="summary-title">Resumen del Pedido</h2>
                
                <div className="summary-items">
                  {cart.map(item => (
                    <div key={item.producto.id} className="summary-item">
                      <div className="summary-item-image">
                        <img src={item.producto.imagen} alt={item.producto.nombre} />
                      </div>
                      <div className="summary-item-info">
                        <div className="summary-item-name">{item.producto.nombre}</div>
                        <div className="summary-item-quantity">
                          Cantidad: {item.cantidad}
                        </div>
                      </div>
                      <div className="summary-item-price">
                        ${(item.producto.precio * item.cantidad).toLocaleString('es-CO')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-total">
                  <span>Total a Pagar:</span>
                  <span className="summary-total-amount">
                    ${getCartTotal().toLocaleString('es-CO')}
                  </span>
                </div>
                
                <button
                  className="btn-confirm-order"
                  onClick={handleSubmitOrder}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
                
                <div className="security-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Compra 100% segura
                </div>
                
                <Link to="/" className="continue-shopping">
                  ← Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
