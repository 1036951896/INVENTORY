import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { alert2 } from '../../utils/notifications';
import { exportData } from '../../utils/export.utils';
import './admin-orders.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Order {
  id: string;
  numero: string;
  estado: string;
  total: number;
  createdAt: string;
  usuario: {
    nombre: string;
    email: string;
    telefono?: string;
  };
  items: Array<{ cantidad: number; producto: { nombre: string } }>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');
  const [minPriceFilter, setMinPriceFilter] = useState<string>('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  // Calcular métricas para el día de hoy
  const getTodayMetrics = () => {
    const today = new Date().toLocaleDateString('es-CO');
    const todayOrders = orders.filter(o => 
      new Date(o.createdAt).toLocaleDateString('es-CO') === today
    );
    
    return {
      ordersToday: todayOrders.length,
      salestoday: todayOrders.reduce((sum, o) => sum + o.total, 0),
      pending: orders.filter(o => o.estado === 'PENDIENTE').length,
      preparing: orders.filter(o => o.estado === 'EN_PREPARACION').length
    };
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await fetch(`${VITE_API_URL}/api/v1/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al cargar órdenes');

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al cargar órdenes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filtro de búsqueda por nombre, email o número de orden
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.numero.toLowerCase().includes(searchLower) ||
      order.usuario.nombre.toLowerCase().includes(searchLower) ||
      order.usuario.email.toLowerCase().includes(searchLower);

    // Filtro por estado
    const matchesStatus = !statusFilter || order.estado === statusFilter;

    // Filtro por fecha (desde)
    const orderDate = new Date(order.createdAt);
    const matchesDateFrom = !dateFromFilter || orderDate >= new Date(dateFromFilter);

    // Filtro por fecha (hasta)
    const matchesDateTo = !dateToFilter || orderDate <= new Date(dateToFilter + 'T23:59:59');

    // Filtro por precio mínimo
    const minPrice = minPriceFilter ? parseFloat(minPriceFilter) : 0;
    const matchesMinPrice = order.total >= minPrice;

    // Filtro por precio máximo
    const maxPrice = maxPriceFilter ? parseFloat(maxPriceFilter) : Infinity;
    const matchesMaxPrice = order.total <= maxPrice;

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo && matchesMinPrice && matchesMaxPrice;
  });

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert2('No hay órdenes para exportar', 'info');
      return;
    }

    const headers = ['Número', 'Cliente', 'Email', 'Teléfono', 'Total', 'Estado', 'Fecha'];
    const rows = filteredOrders.map(order => [
      order.numero,
      order.usuario.nombre,
      order.usuario.email,
      order.usuario.telefono || '-',
      `$${order.total.toLocaleString('es-CO')}`,
      order.estado,
      new Date(order.createdAt).toLocaleDateString('es-CO')
    ]);

    exportData.csv({
      headers,
      rows,
      title: 'REPORTE DE PEDIDOS',
      filename: 'pedidos'
    });

    alert2('Órdenes exportadas a CSV correctamente', 'success');
  };

  const handleExportPDF = () => {
    if (filteredOrders.length === 0) {
      alert2('No hay órdenes para exportar', 'info');
      return;
    }

    const headers = ['Número', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha'];
    const rows = filteredOrders.map(order => [
      order.numero,
      order.usuario.nombre,
      order.usuario.email,
      `$${order.total.toLocaleString('es-CO')}`,
      order.estado,
      new Date(order.createdAt).toLocaleDateString('es-CO')
    ]);

    exportData.pdf({
      headers,
      rows,
      title: 'REPORTE DE PEDIDOS',
      filename: 'pedidos'
    });

    alert2('Órdenes exportadas a PDF correctamente', 'success');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setMinPriceFilter('');
    setMaxPriceFilter('');
  };

  const handleChangeStatus = async (order: Order) => {
    if (!newStatus) {
      alert2('Selecciona un estado', 'info');
      return;
    }

    try {
      const token = authService.getToken();

      const response = await fetch(`${VITE_API_URL}/api/v1/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: newStatus })
      });

      if (!response.ok) throw new Error('Error al actualizar estado');

      alert2('Estado actualizado correctamente', 'success');
      setShowModal(false);
      setSelectedOrder(null);
      setNewStatus('');
      fetchOrders();
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al actualizar estado', 'error');
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      'PENDIENTE': 'status-pending',
      'EN_PREPARACION': 'status-preparing',
      'ENTREGADO': 'status-delivered',
      'CANCELADO': 'status-cancelled'
    };
    return colors[estado] || 'status-pending';
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  const metrics = getTodayMetrics();

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="header-info">
          <div className="module-badge">Ventas</div>
          <h1>Gestión de Pedidos</h1>
          <p>Monitorea y procesa los pedidos de clientes</p>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon orders">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="12 7 12 12 16 14"></polyline>
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M12 2v4"></path>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Pedidos Hoy</p>
            <p className="metric-value">{metrics.ordersToday}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon sales">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Ventas Hoy</p>
            <p className="metric-value">${metrics.salestoday.toLocaleString('es-CO', {maximumFractionDigits: 0})}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pending">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Pendientes</p>
            <p className="metric-value">{metrics.pending}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon preparing">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
              <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"></path>
              <polyline points="16 13 12 17 8 13"></polyline>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">En Preparación</p>
            <p className="metric-value">{metrics.preparing}</p>
          </div>
        </div>
      </div>

      {/* FILTROS COMPACTOS */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-item flex-2">
            <input
              id="search"
              type="text"
              placeholder="Buscar pedido o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <select 
              id="status"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Estado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PREPARACION">En Preparación</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div className="filter-item">
            <input
              id="dateFrom"
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <input
              id="dateTo"
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-item">
            <input
              id="minPrice"
              type="number"
              placeholder="Precio min"
              value={minPriceFilter}
              onChange={(e) => setMinPriceFilter(e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>

          <div className="filter-item">
            <input
              id="maxPrice"
              type="number"
              placeholder="Precio max"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>

          <div className="filter-actions">
            <button 
              className="btn-filter-reset" 
              onClick={resetFilters}
            >
              Limpiar
            </button>
            <div className="export-buttons-group">
              <button 
                className="btn-export btn-csv" 
                onClick={handleExportCSV}
                title="Exportar a CSV"
              >
                CSV
              </button>
              <button 
                className="btn-export btn-pdf" 
                onClick={handleExportPDF}
                title="Exportar a PDF"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-table-wrapper">
        {filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <p>No hay pedidos para mostrar</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="code">{order.numero}</td>
                  <td className="customer-info">
                    <div className="customer-name">{order.usuario?.nombre || '-'}</div>
                    <div className="customer-email">{order.usuario?.email || '-'}</div>
                  </td>
                  <td className="date">{new Date(order.createdAt).toLocaleDateString('es-CO')}</td>
                  <td className="amount">${order.total.toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.estado)}`}>
                      {order.estado === 'PENDIENTE' && 'Pendiente'}
                      {order.estado === 'EN_PREPARACION' && 'Preparación'}
                      {order.estado === 'ENTREGADO' && 'Entregado'}
                      {order.estado === 'CANCELADO' && 'Cancelado'}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-action view"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.estado);
                        setShowModal(true);
                      }}
                      title="Ver detalles"
                    >
                      Ver
                    </button>
                    <button 
                      className="btn-action edit"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.estado);
                        setShowModal(true);
                      }}
                      title="Editar"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Pedido</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="order-info">
                <div className="info-row">
                  <label>Número:</label>
                  <span>{selectedOrder.numero}</span>
                </div>
                <div className="info-row">
                  <label>Cliente:</label>
                  <span>{selectedOrder.usuario?.nombre}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{selectedOrder.usuario?.email}</span>
                </div>
                <div className="info-row">
                  <label>Teléfono:</label>
                  <span>{selectedOrder.usuario?.telefono || '-'}</span>
                </div>
                <div className="info-row">
                  <label>Total:</label>
                  <span className="total">${selectedOrder.total.toLocaleString('es-CO', {maximumFractionDigits: 0})}</span>
                </div>
              </div>

              <div className="items-section">
                <h3>Productos</h3>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="item">
                    <span>{item.cantidad}x {item.producto?.nombre}</span>
                  </div>
                ))}
              </div>

              <div className="status-section">
                <label>Actualizar Estado:</label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="status-select"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PREPARACION">En Preparación</option>
                  <option value="ENTREGADO">Entregado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => handleChangeStatus(selectedOrder)}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
