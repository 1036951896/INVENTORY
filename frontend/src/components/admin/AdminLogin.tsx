import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { useAdmin } from '../../context/admin';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setAdminUser } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Formato de correo inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrige los errores del formulario');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(email, password);

      console.log('🔓 Login response:', response);
      console.log('📋 User role:', response.user?.rol);

      // Verificar que sea administrador (ADMIN es el rol del backend)
      if (response.user?.rol !== 'ADMIN') {
        toast.error('No tienes permisos para acceder al panel (rol requerido: ADMIN)');
        return;
      }

      setAdminUser(response.user);
      toast.success(`¡Bienvenido, ${response.user.nombre}!`);
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Credenciales inválidas';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#386273] to-[#B6E1F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#386273] rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">IA</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#386273] mb-2">Panel de Administrador</h1>
          <p className="text-gray-600">Acceso exclusivo para empleados</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="admin@inventory.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'border-red-500' : ''}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Cargando...' : 'Acceder al Panel'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-[#386273] hover:underline">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
