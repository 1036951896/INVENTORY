import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { memo, useMemo, useCallback } from 'react';
import '../styles/cart-panel.css';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return `${BACKEND_URL}/assets/product-placeholder.svg`;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return `${BACKEND_URL}${imagePath}`;
  return `${BACKEND_URL}/${imagePath}`;
};

// Componente para cada item del carrito - memoizado para evitar re-renders
const CartItemComponent = memo(function CartItem({ 
  item, 
  onIncrement, 
  onDecrement, 
  onQuantityChange, 
  onRemove 
}: any) {
  return (
    <div className="carrito-item">
      <div className="carrito-item-imagen">
        <img 
          src={getImageUrl(item.producto.imagen)} 
          alt={item.producto.nombre}
          loading="lazy"
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
          <button onClick={() => onDecrement(item.producto.id)}>−</button>
          <input 
            type="number" 
            value={item.cantidad} 
            min="1"
            onChange={(e) => onQuantityChange(item.producto.id, e.target.value)}
          />
          <button onClick={() => onIncrement(item.producto.id)}>+</button>
        </div>
      </div>
      <button 
        className="carrito-item-eliminar" 
        onClick={() => onRemove(item.producto.id)}
      >
        🗑️
      </button>
    </div>
  );
});

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleIncrement = useCallback((productId: number | string) => {
    const item = cart.find(i => i.producto.id === productId);
    if (item) {
      updateQuantity(productId, item.cantidad + 1);
    }
  }, [cart, updateQuantity]);

  const handleDecrement = useCallback((productId: number | string) => {
    const item = cart.find(i => i.producto.id === productId);
    if (item) {
      if (item.cantidad === 1) {
        removeFromCart(productId);
      } else {
        updateQuantity(productId, item.cantidad - 1);
      }
    }
  }, [cart, updateQuantity, removeFromCart]);

  const handleQuantityChange = useCallback((productId: number | string, value: string) => {
    const newQuantity = parseInt(value) || 1;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  }, [updateQuantity]);

  const handleConfirmOrder = useCallback(() => {
    if (cart.length === 0) return;
    onClose();
    navigate('/checkout');
  }, [cart.length, onClose, navigate]);

  // Memoizar la lista de items para evitar re-renders
  const cartItems = useMemo(() => {
    return cart.map((item) => (
      <CartItemComponent
        key={item.producto.id}
        item={item}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onQuantityChange={handleQuantityChange}
        onRemove={removeFromCart}
      />
    ));
  }, [cart, handleIncrement, handleDecrement, handleQuantityChange, removeFromCart]);

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
          cartItems
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
