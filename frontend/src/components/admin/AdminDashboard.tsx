import { useEffect } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/admin';
import AdminLayout from './AdminLayout';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export default function AdminDashboard() {
  const { products, orders, users, loadProducts, loadOrders, loadUsers } = useAdmin();

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadUsers();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = users.filter(u => u.role === 'cliente').length;
  const pendingOrders = orders.filter(o => o.status === 'pendiente').length;
  const lowStockProducts = products.filter(p => p.stock < 20).length;

  const totalRevenue = orders
    .filter(o => o.status === 'entregado')
    .reduce((sum, order) => sum + order.total, 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#386273] mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-2 border-[#B6E1F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Productos</span>
              <Package className="w-8 h-8 text-[#386273]" />
            </div>
            <p className="text-3xl font-bold text-[#386273]">{totalProducts}</p>
            {lowStockProducts > 0 && (
              <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {lowStockProducts} con stock bajo
              </p>
            )}
          </Card>

          <Card className="p-6 border-2 border-[#B6E1F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Pedidos</span>
              <ShoppingBag className="w-8 h-8 text-[#386273]" />
            </div>
            <p className="text-3xl font-bold text-[#386273]">{totalOrders}</p>
            {pendingOrders > 0 && (
              <p className="text-sm text-blue-600 mt-2">
                {pendingOrders} pendientes
              </p>
            )}
          </Card>

          <Card className="p-6 border-2 border-[#B6E1F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Clientes</span>
              <Users className="w-8 h-8 text-[#386273]" />
            </div>
            <p className="text-3xl font-bold text-[#386273]">{totalCustomers}</p>
          </Card>

          <Card className="p-6 border-2 border-[#B6E1F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Ingresos</span>
              <TrendingUp className="w-8 h-8 text-[#386273]" />
            </div>
            <p className="text-3xl font-bold text-[#386273]">S/ {totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">Pedidos entregados</p>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6 border-2 border-[#B6E1F2]">
          <h2 className="text-xl font-bold text-[#386273] mb-4">Pedidos Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#B6E1F2]">
                  <th className="text-left py-3 px-4 text-[#386273] font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-[#386273] font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 text-[#386273] font-semibold">Fecha</th>
                  <th className="text-left py-3 px-4 text-[#386273] font-semibold">Total</th>
                  <th className="text-left py-3 px-4 text-[#386273] font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.customerName}</td>
                    <td className="py-3 px-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm font-semibold">S/ {order.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge
                        variant={
                          order.status === 'pendiente'
                            ? 'warning'
                            : order.status === 'en preparación'
                            ? 'info'
                            : 'success'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Low Stock Alert */}
        {lowStockProducts > 0 && (
          <Card className="p-6 border-2 border-orange-200 bg-orange-50 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-orange-900 mb-2">Alerta de Stock Bajo</h3>
                <p className="text-orange-700">
                  Hay {lowStockProducts} productos con stock menor a 20 unidades.
                  Considera reabastecer el inventario.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
