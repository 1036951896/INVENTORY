import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { alert2 } from '../utils/notifications';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.login(email, password);

      // Verificar el rol y redirigir
      if (data.user && data.user.rol === 'ADMIN') {
        // LOGIN ADMIN
        const usuarioAdmin = {
          ...data.user,
          access_token: data.access_token,
          permisos: {
            ver_productos: true,
            editar_productos: true,
            eliminar_productos: true,
            crear_productos: true,
            ver_pedidos: true,
            editar_pedidos: true,
            autorizar_pedidos: true,
            rechazar_pedidos: true,
            ver_usuarios: true,
            ver_categorias: true,
            editar_categorias: true,
            ver_reportes: true,
            ver_configuracion: true
          }
        };
        localStorage.setItem('admin-token', data.access_token);
        localStorage.setItem('admin-usuario', JSON.stringify(usuarioAdmin));

        alert2(`👋 Bienvenido, ${data.user.nombre || 'Admin'}!`, 'success');
        
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        // LOGIN CLIENTE
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-usuario');

        const usuarioCliente = {
          ...data.user,
          access_token: data.access_token,
          permisos: {
            ver_carrito: true,
            agregar_carrito: true,
            crear_pedidos: true,
            ver_pedidos: true,
            ver_direcciones: true,
            agregar_direcciones: true,
            editar_direcciones: true,
            eliminar_direcciones: true
          }
        };
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('usuario', JSON.stringify(usuarioCliente));

        alert2(`👋 Bienvenido, ${data.user.nombre || 'Cliente'}!`, 'success');
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Correo o contraseña incorrectos';
      setError(msg);
      
      // Si es un usuario no registrado, mostrar alerta con opción de registro
      if (msg.toLowerCase().includes('no encontrado') || 
          msg.toLowerCase().includes('no existe') ||
          msg.toLowerCase().includes('no registrado') ||
          msg.toLowerCase().includes('correo o contraseña')) {
        
        const respuesta = confirm(
          '👤 No tenemos registrado este usuario.\n\n¿Deseas ir a la página de registro para crear tu cuenta?'
        );
        
        if (respuesta) {
          navigate('/registro');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* LADO IZQUIERDO - BRANDING */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <img src="/logo-storehub.svg" alt="StoreHub Logo" />
          </div>
          <h1>Gestiona pedidos sin complicaciones</h1>
          <p>Controla productos, inventario y pedidos desde un solo lugar</p>
          
          <ul className="auth-features">
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Gestión de pedidos
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Control de inventario
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Panel administrativo
            </li>
          </ul>
        </div>
      </div>

      {/* LADO DERECHO - LOGIN */}
      <div className="auth-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Iniciar sesión</h2>
            <p className="subtitle">Accede a tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="form-login">
            {sessionExpired && (
              <div className="mensaje error" style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffc107' }}>
                ⚠️ Tu sesión expiró. Por favor inicia sesión de nuevo.
              </div>
            )}
            {error && (
              <div className="mensaje error">
                {error}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="tu@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="forgot-password">
            <a href="/recuperar-password">¿Olvidaste tu contraseña?</a>
          </div>

          <div className="extra-links">
            <a href="/registro">Crear cuenta</a>
            <a href="/">Volver al inicio</a>
          </div>
        </div>
      </div>
    </div>
  );
}
