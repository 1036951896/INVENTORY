import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { alert2 } from '../../utils/notifications';
import './admin-layout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user || user.rol !== 'ADMIN') {
      alert2('Acceso denegado: Solo administradores', 'error');
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    authService.logout();
    alert2('Sesión cerrada', 'success');
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user || user.rol !== 'ADMIN') {
    return null;
  }

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <img src="/logo-storehub.svg" alt="Logo" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
            onClick={() => navigate('/admin')}
            title="Dashboard"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z"/>
            </svg>
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            className={`nav-item ${isActive('/admin/pedidos') ? 'active' : ''}`}
            onClick={() => navigate('/admin/pedidos')}
            title="Pedidos"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {sidebarOpen && <span>Pedidos</span>}
          </button>

          <button
            className={`nav-item ${isActive('/admin/productos') ? 'active' : ''}`}
            onClick={() => navigate('/admin/productos')}
            title="Productos"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {sidebarOpen && <span>Productos</span>}
          </button>

          <button
            className={`nav-item ${isActive('/admin/inventario') ? 'active' : ''}`}
            onClick={() => navigate('/admin/inventario')}
            title="Inventario"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {sidebarOpen && <span>Inventario</span>}
          </button>

          <button
            className={`nav-item ${isActive('/admin/categorias') ? 'active' : ''}`}
            onClick={() => navigate('/admin/categorias')}
            title="Categorías"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2l-5.5 9h11z" />
              <path d="M17.5 13c1.93 0 3.5 1.57 3.5 3.5S19.43 20 17.5 20 14 18.43 14 16.5s1.57-3.5 3.5-3.5z"/>
              <path d="M3 13.5h8v8H3z"/>
            </svg>
            {sidebarOpen && <span>Categorías</span>}
          </button>

          <button
            className={`nav-item ${isActive('/admin/usuarios') ? 'active' : ''}`}
            onClick={() => navigate('/admin/usuarios')}
            title="Usuarios"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {sidebarOpen && <span>Usuarios</span>}
          </button>

          <button
            className={`nav-item ${isActive('/admin/ofertas') ? 'active' : ''}`}
            onClick={() => navigate('/admin/ofertas')}
            title="Ofertas"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zM7 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 6h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
            </svg>
            {sidebarOpen && <span>Ofertas</span>}
          </button>

          <button
            className={`nav-item ${isActive('/admin/reportes') ? 'active' : ''}`}
            onClick={() => navigate('/admin/reportes')}
            title="Reportes"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M5 9h14V5H5v4zm0 5h14v-4H5v4zm0 5h14v-4H5v4z"/>
            </svg>
            {sidebarOpen && <span>Reportes</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout} title="Cerrar sesión">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            {sidebarOpen && <span>Salir</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <div className="admin-topbar">
          <button 
            className="btn-toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Alternar sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" width="24" height="24" stroke="currentColor">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="topbar-spacer"></div>

          <div className="topbar-user">
            <div className="user-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span className="user-name">{user?.nombre || 'Admin'}</span>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
