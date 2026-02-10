import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { useAdmin } from '../../context/admin';
import { authService } from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Inicio',
  },
  {
    path: '/admin/productos',
    icon: Package,
    label: 'Productos',
  },
  {
    path: '/admin/pedidos',
    icon: ShoppingBag,
    label: 'Pedidos',
  },
  {
    path: '/admin/usuarios',
    icon: Users,
    label: 'Usuarios',
  },
  {
    path: '/admin/reportes',
    icon: BarChart3,
    label: 'Reportes',
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, setAdminUser, orders } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!adminUser) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    authService.logout();
    setAdminUser(null);
    toast.success('Sesión cerrada correctamente');
    navigate('/admin/login');
  };

  const pendingOrders = orders.filter((o) => o.status === 'pendiente').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#386273] text-white transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 border-b border-[#B6E1F2]">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="font-bold text-lg">IA</div>
            ) : (
              <div className="font-bold text-xl mx-auto">IA</div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:bg-[#B6E1F2] hover:text-[#386273]"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-[#B6E1F2] hover:text-[#386273] transition-colors ${
                    isActive ? 'bg-[#B6E1F2] text-[#386273]' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <div className="flex items-center justify-between flex-1">
                      <span>{item.label}</span>
                      {item.path === '/admin/pedidos' &&
                        pendingOrders > 0 && (
                          <Badge className="bg-red-500 text-white">
                            {pendingOrders}
                          </Badge>
                        )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 hover:bg-red-500 hover:text-white transition-colors text-left"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
      >
        {/* Header */}
        <header className="bg-white border-b-2 border-[#B6E1F2] sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                >
                  <Bell className="w-5 h-5 text-[#386273]" />
                  {pendingOrders > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0.5 text-xs">
                      {pendingOrders}
                    </Badge>
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#386273] rounded-full flex items-center justify-center text-white font-bold">
                    {(adminUser.nombre || adminUser.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#386273]">
                      {adminUser.nombre || adminUser.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Administrador
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
