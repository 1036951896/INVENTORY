import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { alert2 } from '../../utils/notifications';
import { exportData } from '../../utils/export.utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './admin-reports.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('ventas');
  const [loading, setLoading] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('mes');
  const [reportData, setReportData] = useState<any>(null);

  const tabs = [
    { id: 'ventas', label: 'Ventas' },
    { id: 'productos', label: 'Productos Más Vendidos' },
    { id: 'rotacion', label: 'Baja Rotación' },
    { id: 'alertas', label: 'Alertas de Inventario' }
  ];

  useEffect(() => {
    setReportData(null); // Reset data when tab changes
    fetchReportData();
  }, [activeTab, periodFilter]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const mockData = await generateMockData();
      setReportData(mockData);
    } catch (error: any) {
      console.error('Error:', error);
      alert2('Error al cargar reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = async () => {
    if (activeTab === 'ventas') {
      return {
        type: 'ventas',
        period: periodFilter,
        summary: {
          totalSales: 8230000,
          totalOrders: 156,
          avgTicket: 52750
        },
        data: [
          { date: 'Lun 3', sales: 280000 },
          { date: 'Mar 4', sales: 320000 },
          { date: 'Mié 5', sales: 410000 },
          { date: 'Jue 6', sales: 350000 },
          { date: 'Vie 7', sales: 480000 },
          { date: 'Sab 8', sales: 520000 },
          { date: 'Dom 9', sales: 450000 }
        ]
      };
    } else if (activeTab === 'productos') {
      try {
        const token = authService.getToken();
        
        console.log('📊 Cargando datos de productos más vendidos...');
        
        // Obtener productos
        const prodRes = await fetch(`${VITE_API_URL}/api/v1/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!prodRes.ok) throw new Error(`Error al obtener productos: ${prodRes.status}`);
        
        const prodData = await prodRes.json();
        const productos = Array.isArray(prodData) ? prodData : prodData.data || [];
        
        console.log('✅ Productos cargados:', productos.length);
        
        // Si no hay productos, devolver data vacía con mensaje
        if (!productos || productos.length === 0) {
          console.warn('⚠️ No hay productos en la base de datos');
          return {
            type: 'productos',
            data: []
          };
        }

        // Simular datos de ventas para demostración
        // En un caso real, esto vendría de un endpoint /api/v1/reports/top-products
        const productosVendidos = productos
          .slice(0, 10)
          .map((prod: any, idx: number) => ({
            name: prod.nombre || 'Sin nombre',
            units: Math.floor(Math.random() * 100) + 10,
            revenue: (prod.precio || 0) * (Math.floor(Math.random() * 100) + 10),
            percentage: 0
          }));

        // Calcular porcentajes
        const totalUnits = productosVendidos.reduce((sum: number, p: any) => sum + p.units, 0);
        productosVendidos.forEach((p: any) => {
          p.percentage = Math.round((p.units / totalUnits) * 100);
        });

        // Ordenar por unidades
        productosVendidos.sort((a: any, b: any) => b.units - a.units);

        return {
          type: 'productos',
          data: productosVendidos
        };
      } catch (error) {
        console.error('❌ Error fetching product data:', error);
        alert2('Error al cargar productos más vendidos', 'error');
        return {
          type: 'productos',
          data: []
        };
      }
    } else if (activeTab === 'rotacion') {
      try {
        const token = authService.getToken();
        
        console.log('📊 Cargando datos de baja rotación...');
        
        const prodRes = await fetch(`${VITE_API_URL}/api/v1/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!prodRes.ok) throw new Error(`Error al obtener productos: ${prodRes.status}`);
        
        const prodData = await prodRes.json();
        const productos = Array.isArray(prodData) ? prodData : prodData.data || [];
        
        console.log('✅ Productos cargados para rotación:', productos.length);
        
        const rotacionData = productos
          .filter((p: any) => p.stock > 0)
          .slice(0, 10)
          .map((p: any) => ({
            name: p.nombre || 'Sin nombre',
            lastSale: 'Sin datos',
            stock: p.stock || 0
          }));

        return {
          type: 'rotacion',
          data: rotacionData
        };
      } catch (error) {
        console.error('❌ Error fetching rotation data:', error);
        alert2('Error al cargar datos de rotación', 'error');
        return {
          type: 'rotacion',
          data: []
        };
      }
    } else {
      // Alertas de Inventario
      try {
        const token = authService.getToken();
        
        console.log('📊 Cargando alertas de inventario...');
        
        const prodRes = await fetch(`${VITE_API_URL}/api/v1/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!prodRes.ok) throw new Error(`Error al obtener productos: ${prodRes.status}`);
        
        const prodData = await prodRes.json();
        const productos = Array.isArray(prodData) ? prodData : prodData.data || [];
        
        console.log('✅ Productos cargados para alertas:', productos.length);
        
        const alertas = productos
          .filter((p: any) => {
            const stock = p.stock || 0;
            const minStock = p.stockMinimo || 10;
            return stock <= minStock;
          })
          .map((p: any) => ({
            name: p.nombre || 'Sin nombre',
            stock: p.stock || 0,
            minStock: p.stockMinimo || 10,
            status: (p.stock || 0) === 0 ? 'agotado' : 'bajo'
          }));

        console.log('⚠️ Alertas encontradas:', alertas.length);

        return {
          type: 'alertas',
          data: alertas
        };
      } catch (error) {
        console.error('❌ Error fetching alerts data:', error);
        alert2('Error al cargar alertas de inventario', 'error');
        return {
          type: 'alertas',
          data: []
        };
      }
    }
  };

  const exportPDF = () => {
    if (!reportData || !reportData.data || reportData.data.length === 0) {
      alert2('No hay datos para exportar', 'info');
      return;
    }

    const headers = Object.keys(reportData.data[0] || {});
    const rows = reportData.data.map((item: any) => 
      headers.map(key => item[key])
    );

    exportData.pdf({
      headers,
      rows,
      title: `REPORTE: ${reportData.type?.toUpperCase()} (${reportData.period?.toUpperCase()})`,
      filename: `reporte-${reportData.type}`
    });

    alert2('Reporte exportado a PDF correctamente', 'success');
  };

  const exportCSV = () => {
    if (!reportData || !reportData.data || reportData.data.length === 0) {
      alert2('No hay datos para exportar', 'info');
      return;
    }

    const headers = Object.keys(reportData.data[0] || {});
    const rows = reportData.data.map((item: any) => 
      headers.map(key => item[key])
    );

    exportData.csv({
      headers,
      rows,
      title: `REPORTE: ${reportData.type?.toUpperCase()} (${reportData.period?.toUpperCase()})`,
      filename: `reporte-${reportData.type}`
    });

    alert2('Reporte exportado a CSV correctamente', 'success');
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-info">
          <div className="module-badge">Análisis</div>
          <h1>Reportes del Negocio</h1>
          <p>Analiza ventas, inventario y productos</p>
        </div>
      </div>

      {/* TABS DE REPORTES */}
      <div className="reports-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id === 'ventas' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            )}
            {tab.id === 'productos' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M2 8.5A2.5 2.5 0 0 1 4.5 6H20m-16-2h6m10 0l2 14"></path>
              </svg>
            )}
            {tab.id === 'rotacion' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            )}
            {tab.id === 'alertas' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* FILTROS POR PERIODO */}
      {(activeTab === 'ventas') && (
        <div className="period-filter">
          <select 
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="period-select"
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Última Semana</option>
            <option value="mes">Último Mes</option>
            <option value="trimestre">Último Trimestre</option>
            <option value="ano">Último Año</option>
          </select>

          <div className="export-buttons">
            <button className="btn-export-pdf" onClick={exportPDF}>
              Exportar PDF
            </button>
            <button className="btn-export-csv" onClick={exportCSV}>
              Exportar CSV
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO DE REPORTES */}
      {loading ? (
        <div className="report-loading">
          <div className="loading-spinner"></div>
          <p>Cargando reporte...</p>
        </div>
      ) : !reportData ? (
        <div className="report-loading">
          <p>Selecciona un reporte para ver los datos</p>
        </div>
      ) : reportData.data?.length === 0 ? (
        <div className="report-empty">
          <div className="empty-icon">📊</div>
          <p>No hay datos disponibles para este reporte</p>
          <small>Intenta con otro período o verifica que haya datos en el sistema</small>
        </div>
      ) : reportData ? (
        <div className="report-content">
          {/* REPORTE DE VENTAS */}
          {activeTab === 'ventas' && reportData?.type === 'ventas' && (
            <div className="report-ventas">
              <div className="report-summary">
                <div className="summary-card">
                  <p className="summary-label">Ventas Totales</p>
                  <p className="summary-value">${(reportData.summary?.totalSales || 0).toLocaleString('es-CO', {maximumFractionDigits: 0})}</p>
                </div>
                <div className="summary-card">
                  <p className="summary-label">Pedidos</p>
                  <p className="summary-value">{reportData.summary?.totalOrders || 0}</p>
                </div>
                <div className="summary-card">
                  <p className="summary-label">Ticket Promedio</p>
                  <p className="summary-value">${(reportData.summary?.avgTicket || 0).toLocaleString('es-CO', {maximumFractionDigits: 0})}</p>
                </div>
              </div>

              <div className="report-placeholder">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.data || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af"
                      style={{ fontSize: '0.85rem' }}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      style={{ fontSize: '0.85rem' }}
                      label={{ value: 'COP $', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: any) => `$${value?.toLocaleString('es-CO', {maximumFractionDigits: 0}) || 0}`}
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={{ fill: '#6366f1', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Ingresos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <table className="report-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Pedidos</th>
                    <th>Ingreso</th>
                    <th>Ticket Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.data?.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td>{row.date}</td>
                      <td>{Math.floor(Math.random() * 30) + 15}</td>
                      <td>${(row.sales || 0).toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                      <td>${(((row.sales || 0) / (Math.floor(Math.random() * 30) + 15))).toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PRODUCTOS MÁS VENDIDOS */}
          {activeTab === 'productos' && reportData?.type === 'productos' && (
            <div className="report-productos">
              <div className="export-buttons">
                <button className="btn-export-pdf" onClick={exportPDF}>
                  Exportar PDF
                </button>
                <button className="btn-export-csv" onClick={exportCSV}>
                  Exportar CSV
                </button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.data || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      stroke="#9ca3af"
                      style={{ fontSize: '0.75rem' }}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      style={{ fontSize: '0.85rem' }}
                      label={{ value: 'Unidades', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip formatter={(value: any) => value}/>
                    <Legend />
                    <Bar 
                      dataKey="units" 
                      fill="#6366f1"
                      name="Unidades Vendidas"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <table className="report-table">
                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Producto</th>
                    <th>Unidades Vendidas</th>
                    <th>Ingreso Generado</th>
                    <th>% Total</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.data?.map((product: any, idx: number) => (
                    <tr key={idx}>
                      <td className="rank">
                        <span className="rank-badge">{idx + 1}</span>
                      </td>
                      <td className="product-name">{product.name}</td>
                      <td className="units">{product.units}</td>
                      <td className="revenue">${(product.revenue || 0).toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                      <td className="percentage">
                        <div className="progress-bar">
                          <div className="progress" style={{width: `${product.percentage}%`}}></div>
                        </div>
                        <span>{product.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* BAJA ROTACIÓN */}
          {activeTab === 'rotacion' && reportData?.type === 'rotacion' && (
            <div className="report-rotacion">
              <div className="export-buttons">
                <button className="btn-export-pdf" onClick={exportPDF}>
                  Exportar PDF
                </button>
                <button className="btn-export-csv" onClick={exportCSV}>
                  Exportar CSV
                </button>
              </div>

              <table className="report-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Última Venta</th>
                    <th>Stock Actual</th>
                    <th>Acción Recomendada</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.data?.map((product: any, idx: number) => (
                    <tr key={idx}>
                      <td className="product-name">{product.name}</td>
                      <td className="last-sale">{product.lastSale}</td>
                      <td className="stock">{product.stock}</td>
                      <td className="action">
                        <span className="action-badge">Aplicar Descuento</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ALERTAS DE INVENTARIO */}
          {activeTab === 'alertas' && reportData?.type === 'alertas' && (
            <div className="report-alertas">
              <div className="export-buttons">
                <button className="btn-export-pdf" onClick={exportPDF}>
                  Exportar PDF
                </button>
                <button className="btn-export-csv" onClick={exportCSV}>
                  Exportar CSV
                </button>
              </div>

              <table className="report-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock Actual</th>
                    <th>Stock Mínimo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.data?.map((product: any, idx: number) => (
                    <tr key={idx}>
                      <td className="product-name">{product.name}</td>
                      <td className="stock">{product.stock}</td>
                      <td className="min-stock">{product.minStock}</td>
                      <td>
                        <span className={`status-badge ${product.status}`}>
                          {product.status === 'bajo' && 'Bajo Stock'}
                          {product.status === 'agotado' && 'Agotado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
