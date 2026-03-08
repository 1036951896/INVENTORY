import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { alert2 } from '../utils/notifications';
import '../styles/auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    calle: '',
    numero: '',
    apartamento: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    password: '',
    confirmPassword: ''
  });
  const [terminos, setTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.email || 
        !formData.telefono || !formData.password || !formData.confirmPassword ||
        !formData.calle || !formData.numero || !formData.ciudad || !formData.departamento) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!terminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      setLoading(true);

      const usuarioData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        direccion: {
          calle: formData.calle,
          numero: formData.numero,
          apartamento: formData.apartamento || null,
          ciudad: formData.ciudad,
          departamento: formData.departamento,
          codigoPostal: formData.codigoPostal || null,
          pais: 'Colombia'
        }
      };

      await authService.register(usuarioData);

      alert2(`👋 ¡Bienvenido, ${formData.nombre}!`, 'success');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al crear la cuenta';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BRANDING SECTION (solo móvil) */}
      <div className="auth-left auth-left-mobile">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <img src="/logo-storehub.svg" alt="StoreHub Logo" />
          </div>
          <h1>Gestiona pedidos sin complicaciones</h1>
          <p>Controla productos, inventario y pedidos desde un solo lugar</p>
        </div>
      </div>

      <div className="registro-wrapper">
      <div className="registro-card">
        <div className="registro-header">
          <h1>Crear cuenta</h1>
          <p className="registro-subtitle">Toma menos de 1 minuto</p>
        </div>

        <form onSubmit={handleSubmit} className="form-registro">
          {error && (
            <div className="mensaje error">
              {error}
            </div>
          )}

          {/* INFORMACIÓN PERSONAL */}
          <div className="form-section">
            <h3 className="section-title">Información personal</h3>
            
            <div className="grid-2">
              <div className="input-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  placeholder="Juan"
                  autoComplete="given-name"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  required
                  placeholder="García"
                  autoComplete="family-name"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="tu@email.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  required
                  placeholder="+57 300 1234567"
                  autoComplete="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* DIRECCIÓN DE ENVÍO */}
          <div className="form-section">
            <h3 className="section-title">Dirección de envío</h3>
            
            <div className="grid-2">
              <div className="input-group">
                <label htmlFor="calle">Calle</label>
                <input
                  type="text"
                  id="calle"
                  name="calle"
                  required
                  placeholder="Calle Principal"
                  autoComplete="street-address"
                  value={formData.calle}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="numero">Número</label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  required
                  placeholder="123"
                  value={formData.numero}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label htmlFor="apartamento">Apartamento (Opcional)</label>
                <input
                  type="text"
                  id="apartamento"
                  name="apartamento"
                  placeholder="Apt 4B"
                  value={formData.apartamento}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  required
                  placeholder="Bogotá"
                  autoComplete="address-level2"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label htmlFor="departamento">Departamento</label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  required
                  placeholder="Cundinamarca"
                  autoComplete="address-level1"
                  value={formData.departamento}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="codigoPostal">Código Postal (Opcional)</label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  placeholder="110111"
                  autoComplete="postal-code"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="pais">País</label>
              <input
                type="text"
                id="pais"
                name="pais"
                value="Colombia"
                disabled
              />
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div className="form-section">
            <h3 className="section-title">Contraseña</h3>
            
            <div className="grid-2">
              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* TÉRMINOS */}
          <div className="terms-group">
            <input
              type="checkbox"
              id="terminos"
              name="terminos"
              required
              checked={terminos}
              onChange={(e) => setTerminos(e.target.checked)}
            />
            <label htmlFor="terminos">
              Acepto los <a href="#" target="_blank">términos y condiciones</a> y la{' '}
              <a href="#" target="_blank">política de privacidad</a>
            </label>
          </div>

          <button type="submit" className="registro-btn" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="extra-links">
          <p>¿Ya tienes cuenta?</p>
          <a href="/login">Inicia sesión aquí</a>
        </div>
      </div>
    </div>
    </>
  );
}
