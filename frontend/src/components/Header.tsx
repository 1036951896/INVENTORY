import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { authService, isUserAdmin } from '../services/auth.service';

interface HeaderProps {
  onCartClick?: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const { getCartItemsCount } = useCart();
  const [user] = useState(authService.getCurrentUser());
  const cartCount = getCartItemsCount();
  const navigate = useNavigate();

  return (
    <header>
      <div className="contenedor">
        <div className="encabezado-contenedor">
          {/* LOGO */}
          <div className="logo">
            <img src="/logo-storehub.svg" alt="Logo StoreHub" className="logo-img" />
          </div>

          {/* BARRA DE BÚSQUEDA */}
          <div className="barra-busqueda-grupo">
            <button className="btn-hamburguesa" id="btn-hamburguesa" title="Filtros">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" width="20" height="20" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <div className="barra-busqueda-contenedor-desktop">
              <div className="barra-busqueda">
                <svg className="icono-buscar-fijo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input type="text" id="buscar" placeholder="Buscar producto..." className="input-buscar" />
              </div>
            </div>

            <button className="btn-busqueda-movil" id="btn-busqueda-movil" title="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>

          {/* MENU SUPERIOR */}
          <div className="menu-superior">
            {/* CARRITO */}
            <div 
              className="icono-carrito" 
              id="btn-carrito" 
              title="Mi carrito"
              onClick={onCartClick}
              style={{ cursor: 'pointer' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="contador-carrito" id="contador">{cartCount}</span>
            </div>

            {/* USUARIO */}
            <div id="menu-usuario">
              {user ? (
                <button className="btn-icono" title={`Bienvenido ${user.nombre}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </button>
              ) : (
                <button className="btn-icono" onClick={() => navigate('/login')} title="Iniciar sesión">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </button>
              )}
            </div>

            {/* SEGUIMIENTO */}
            <Link to="/pedidos" className="btn-icono" title="Ver mis pedidos">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-2c1.66 0 3 1.34 3 3v2h-6V9c0-1.66 1.34-3 3-3zm6 16H6V10h12v12zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
            </Link>

            {/* ADMIN */}
            {isUserAdmin() && (
              <button 
                className="btn-icono btn-admin" 
                title="Ir a administrador"
                onClick={() => navigate('/admin')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19.14,12.94c0.04,-0.3 0.06,-0.61 0.06,-0.94c0,-0.32 -0.02,-0.64 -0.07,-0.94l2.03,-1.58c0.18,-0.14 0.23,-0.41 0.12,-0.64l-1.92,-3.32c-0.12,-0.22 -0.37,-0.29 -0.59,-0.22l-2.39,0.96c-0.5,-0.38 -1.03,-0.7 -1.62,-0.94l-0.36,-2.54c-0.04,-0.24 -0.24,-0.41 -0.48,-0.41h-3.84c-0.24,0 -0.43,0.17 -0.47,0.41l-0.36,2.54c-0.59,0.24 -1.13,0.57 -1.62,0.94l-2.39,-0.96c-0.22,-0.08 -0.47,0 -0.59,0.22l-1.92,3.32c-0.13,0.22 -0.07,0.5 0.12,0.64l2.03,1.58c-0.05,0.3 -0.07,0.62 -0.07,0.94s0.02,0.64 0.07,0.94l-2.03,1.58c-0.18,0.14 -0.23,0.41 -0.12,0.64l1.92,3.32c0.12,0.22 0.37,0.29 0.59,0.22l2.39,-0.96c0.5,0.38 1.03,0.7 1.62,0.94l0.36,2.54c0.05,0.24 0.24,0.41 0.47,0.41h3.84c0.24,0 0.44,-0.17 0.47,-0.41l0.36,-2.54c0.59,-0.24 1.13,-0.56 1.62,-0.94l2.39,0.96c0.22,0.08 0.47,0 0.59,-0.22l1.92,-3.32c0.12,-0.22 0.07,-0.5 -0.12,-0.64l-2.03,-1.58zM12,15.6c-1.98,0 -3.6,-1.62 -3.6,-3.6s1.62,-3.6 3.6,-3.6s3.6,1.62 3.6,3.6s-1.62,3.6 -3.6,3.6z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
