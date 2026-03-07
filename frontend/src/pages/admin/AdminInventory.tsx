import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { alert2 } from '../../utils/notifications';
import './admin-inventory.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  id: string;
  nombre: string;
  sku: string;
  categoria: {
    nombre: string;
  };
  stock: number;
  stockMinimo: number;
  precio: number;
}

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await fetch(`${VITE_API_URL}/api/v1/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al cargar productos');

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getMetrics = () => {
    const totalValue = products.reduce((sum, p) => sum + (p.precio * p.stock), 0);
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.stockMinimo).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    return {
      total: products.length,
      totalValue,
      lowStock,
      outOfStock
    };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.categoria?.nombre === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: 'agotado', label: 'Agotado' };
    if (product.stock <= product.stockMinimo) return { status: 'bajo', label: 'Bajo stock' };
    return { status: 'normal', label: 'Normal' };
  };

  const categories = Array.from(new Set(products.map(p => p.categoria?.nombre).filter(Boolean)));

  const metrics = getMetrics();

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="loading-spinner"></div>
        <p>Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <div className="header-info">
          <div className="module-badge">Inventario</div>
          <h1>Control de Stock</h1>
          <p>Gestiona el inventario y monitorea el stock de productos</p>
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon products">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Productos Totales</p>
            <p className="metric-value">{metrics.total}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon value">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Valor del Inventario</p>
            <p className="metric-value">${metrics.totalValue.toLocaleString('es-CO', {maximumFractionDigits: 0})}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Bajo Stock</p>
            <p className="metric-value">{metrics.lowStock}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon danger">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div className="metric-content">
            <p className="metric-label">Agotados</p>
            <p className="metric-value">{metrics.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-item flex-2">
            <input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLA DE INVENTARIO */}
      <div className="inventory-table-wrapper">
        {filteredProducts.length === 0 ? (
          <div className="inventory-empty">
            <p>No hay productos para mostrar</p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Stock Mínimo</th>
                <th>Precio</th>
                <th>Valor Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);
                const totalValue = product.precio * product.stock;

                return (
                  <tr key={product.id}>
                    <td className="product-name">{product.nombre}</td>
                    <td className="sku">{product.sku}</td>
                    <td className="category">{product.categoria?.nombre || '-'}</td>
                    <td className="stock">
                      <strong>{product.stock}</strong>
                    </td>
                    <td className="stock-min">{product.stockMinimo}</td>
                    <td className="price">${product.precio.toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                    <td className="value">${totalValue.toLocaleString('es-CO', {maximumFractionDigits: 0})}</td>
                    <td>
                      <span className={`status-badge ${status.status}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
