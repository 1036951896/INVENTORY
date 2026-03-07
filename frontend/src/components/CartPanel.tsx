import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/cart-panel.css';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleIncrement = (productId: number | string) => {
    const item = cart.find(i => i.producto.id === productId);
    if (item) {
      updateQuantity(productId, item.cantidad + 1);
    }
  };

  const handleDecrement = (productId: number | string) => {
    const item = cart.find(i => i.producto.id === productId);
    if (item) {
      if (item.cantidad === 1) {
        removeFromCart(productId);
      } else {
        updateQuantity(productId, item.cantidad - 1);
      }
    }
  };

  const handleQuantityChange = (productId: number | string, value: string) => {
    const newQuantity = parseInt(value) || 1;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;
    onClose();
    navigate('/checkout');
  };

  return (
    <div className={`carrito-panel ${isOpen ? 'activo' : ''}`}>
      {/* ENCABEZADO */}
      <div className="carrito-encabezado">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Mi Carrito
        </h3>
        <button className="carrito-cerrar" onClick={onClose}>✕</button>
      </div>

      {/* CONTENIDO */}
      <div className="carrito-contenido">
        {cart.length === 0 ? (
          <div className="carrito-vacio">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          cart.map((item) => {
            return (
              <div key={item.producto.id} className="carrito-item">
                <div className="carrito-item-imagen">
                  <img 
                    src={item.producto.imagen} 
                    alt={item.producto.nombre}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/product-placeholder.svg';
                    }}
                  />
                </div>
                <div className="carrito-item-info">
                  <div className="carrito-item-nombre">{item.producto.nombre}</div>
                  <div className="carrito-item-precio">
                    ${item.producto.precio.toLocaleString('es-CO')}
                  </div>
                  <div className="carrito-item-cantidad">
                    <button onClick={() => handleDecrement(item.producto.id)}>−</button>
                    <input 
                      type="number" 
                      value={item.cantidad} 
                      min="1"
                      onChange={(e) => handleQuantityChange(item.producto.id, e.target.value)}
                    />
                    <button onClick={() => handleIncrement(item.producto.id)}>+</button>
                  </div>
                </div>
                <button 
                  className="carrito-item-eliminar" 
                  onClick={() => removeFromCart(item.producto.id)}
                >
                  🗑️
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* PIE */}
      <div className="carrito-pie">
        <div className="carrito-resumen">
          <div className="carrito-total">
            <span>Total:</span>
            <span id="total-carrito">
              ${getCartTotal().toLocaleString('es-CO')}
            </span>
          </div>
        </div>
        <button 
          className="btn btn-principal" 
          onClick={handleConfirmOrder}
          disabled={cart.length === 0}
        >
          Confirmar Pedido
        </button>
        <div className="carrito-security">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M10 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          🔒 Pago 100% seguro
        </div>
      </div>
    </div>
  );
}
