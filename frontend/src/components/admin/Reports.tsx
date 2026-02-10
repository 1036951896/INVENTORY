import { useEffect } from 'react';
import { useAdmin } from '../../context/admin';
import AdminLayout from './AdminLayout';
import { Card } from '../ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Reports() {
  const { products, orders, loadProducts, loadOrders } = useAdmin();

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // Products by category
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    cantidad: value,
  }));

  // Stock levels
  const stockData = products
    .map((product) => ({
      name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
      stock: product.stock,
    }))
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10);

  // Sales by product (from delivered orders)
  const salesByProduct = orders
    .filter((order) => order.status === 'entregado')
    .flatMap((order) => order.items)
    .reduce(
      (acc, item) => {
        const name = item.product?.name || 'Producto Desconocido';
        if (!acc[name]) {
          acc[name] = { name, cantidad: 0, ingresos: 0 };
        }
        acc[name].cantidad += item.quantity;
        acc[name].ingresos += item.price * item.quantity;
        return acc;
      },
      {} as Record<string, { name: string; cantidad: number; ingresos: number }>
    );

  const topProducts = Object.values(salesByProduct)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  // Order status distribution
  const orderStatusData = [
    { name: 'Pendiente', value: orders.filter((o) => o.status === 'pendiente').length },
    {
      name: 'En preparación',
      value: orders.filter((o) => o.status === 'en preparación').length,
    },
    { name: 'Entregado', value: orders.filter((o) => o.status === 'entregado').length },
  ].filter((item) => item.value > 0);

  const COLORS = ['#FFC658', '#8884D8', '#00C49F'];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#386273] mb-6">Reportes y Análisis</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products by Category */}
          {categoryData.length > 0 && (
            <Card className="p-6 border-2 border-[#B6E1F2]">
              <h2 className="text-xl font-bold text-[#386273] mb-4">Productos por Categoría</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#386273" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Stock Levels */}
          {stockData.length > 0 && (
            <Card className="p-6 border-2 border-[#B6E1F2]">
              <h2 className="text-xl font-bold text-[#386273] mb-4">
                Niveles de Stock (Menor a Mayor)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" fill="#B6E1F2" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Top Selling Products */}
          <Card className="p-6 border-2 border-[#B6E1F2]">
            <h2 className="text-xl font-bold text-[#386273] mb-4">Productos Más Vendidos</h2>
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#386273" name="Unidades Vendidas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No hay datos de ventas
              </div>
            )}
          </Card>

          {/* Order Status Distribution */}
          <Card className="p-6 border-2 border-[#B6E1F2]">
            <h2 className="text-xl font-bold text-[#386273] mb-4">
              Distribución de Pedidos por Estado
            </h2>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No hay pedidos
              </div>
            )}
          </Card>

          {/* Revenue by Product */}
          {topProducts.length > 0 && (
            <Card className="p-6 border-2 border-[#B6E1F2] lg:col-span-2">
              <h2 className="text-xl font-bold text-[#386273] mb-4">Ingresos por Producto</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `S/ ${Number(value).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#00C49F" name="Ingresos (S/)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
