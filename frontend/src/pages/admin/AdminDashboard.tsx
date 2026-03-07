import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './admin-dashboard.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Statistics {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    pendingOrders: number;
    completionRate: number;
  };
  salesByDay: Array<{ date: string; orders: number; total: number }>;
  salesByCategory: Array<{ category: string; orders: number; items: number; total: number }>;
  topCustomers: Array<{ id: string; nombre: string; email: string; orders: number; total: number }>;
  topProducts: Array<{ id: string; nombre: string; precio: number; cantidad_vendida: number; total_unidades: number; total_ingresos: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
}

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = authService.getToken();

      const response = await fetch(`${VITE_API_URL}/api/v1/orders/admin/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <p>{error || 'Error al cargar estadísticas'}</p>
          <button onClick={fetchStatistics} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const COLORS = ['#667eea', '#764ba2', '#15803d', '#4338ca', '#be185d'];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <p>Resumen de desempeño de tu negocio</p>
        </div>
        <button onClick={fetchStatistics} className="btn-refresh">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          Actualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon revenue">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.48-.84-2.22-.93-2.22-1.58 0-.67.52-1.06 1.56-1.06 1.03 0 1.87.51 1.97 1.36h1.87c-.09-1.71-1.3-2.61-3.84-2.61-2.27 0-3.74 1.45-3.74 3.44 0 2.02 1.18 2.87 3.12 3.66 1.52.8 1.97.91 1.97 1.57 0 .68-.63 1.13-1.72 1.13-1.04 0-1.9-.62-1.98-1.4h-1.88c.13 1.59 1.33 2.63 3.85 2.63 2.5 0 3.92-1.38 3.92-3.44 0-1.94-.88-2.84-3.12-3.71z"/>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Ingreso Total</p>
            <h3 className="kpi-value">${statistics.summary.totalRevenue.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</h3>
            <p className="kpi-change positive">+12% respecto al mes anterior</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon orders">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Pedidos Totales</p>
            <h3 className="kpi-value">{statistics.summary.totalOrders}</h3>
            <p className="kpi-change positive">+8 esta semana</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon completed">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Completados</p>
            <h3 className="kpi-value">{statistics.summary.completedOrders}</h3>
            <p className="kpi-change positive">{statistics.summary.completionRate}% tasa de finalización</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon pending">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Pendientes</p>
            <h3 className="kpi-value">{statistics.summary.pendingOrders}</h3>
            <p className="kpi-change warning">Requiere atención</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Sales Trend */}
        <div className="chart-card">
          <h3>Ventas Últimos 30 Días</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statistics.salesByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => typeof value === 'number' ? value.toLocaleString('es-CO') : value}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={false}
                name="Ingreso"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div className="chart-card">
          <h3>Ventas por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.salesByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => typeof value === 'number' ? value.toLocaleString('es-CO') : value}
              />
              <Legend />
              <Bar dataKey="total" fill="#764ba2" name="Ingreso" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="chart-card">
          <h3>Desglose de Pedidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statistics.statusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
              >
                {statistics.statusBreakdown.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="top-customers-card">
        <h3>Productos Más Vendidos</h3>
        <div className="customers-table">
          <div className="table-header">
            <div className="col-nombre">Producto</div>
            <div className="col-email">Precio</div>
            <div className="col-orders">Unidades</div>
            <div className="col-total">Ingresos</div>
          </div>
          <div className="table-body">
            {statistics.topProducts && statistics.topProducts.length > 0 ? (
              statistics.topProducts.map((product, index) => (
                <div key={product.id} className="table-row">
                  <div className="col-nombre">
                    <span className="rank">#{index + 1}</span>
                    {product.nombre}
                  </div>
                  <div className="col-email">
                    ${product.precio.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="col-orders">{product.total_unidades || 0}</div>
                  <div className="col-total">
                    ${(product.total_ingresos || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              ))
            ) : (
              <div className="table-row">
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af' }}>
                  No hay datos disponibles
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
