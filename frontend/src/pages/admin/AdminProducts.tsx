import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { alert2 } from '../../utils/notifications';
import { exportData } from '../../utils/export.utils';
import './admin-products.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: string;
}

interface Category {
  id: string;
  nombre: string;
}

interface ProductImage {
  id: string;
  url: string;
  principal: boolean;
  orden: number;
}

interface AvailableImage {
  nombre: string;
  ruta: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [minPriceFilter, setMinPriceFilter] = useState<string>('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<string>('');
  const [minStockFilter, setMinStockFilter] = useState<string>('');
  const [maxStockFilter, setMaxStockFilter] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [availableImages, setAvailableImages] = useState<AvailableImage[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showForm) {
      fetchAvailableImages();
    }
  }, [showForm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products - Solicitar todos sin límite de paginación
      const prodRes = await fetch(`${VITE_API_URL}/api/v1/products?limit=500&page=1`);
      const prodData = prodRes.ok ? await prodRes.json() : { data: [] };
      setProducts(prodData.data || []);

      // Fetch categories
      const catRes = await fetch(`${VITE_API_URL}/api/v1/categories`);
      const catData = catRes.ok ? await catRes.json() : [];
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableImages = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${VITE_API_URL}/api/v1/product-images/available-images`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableImages(data.imagenes || []);
      }
    } catch (error: any) {
      console.error('Error al cargar imágenes disponibles:', error);
    }
  };

  const handleSelectAvailableImage = async (imagePath: string) => {
    try {
      const newImage = {
        id: Math.random().toString(),
        url: imagePath,
        principal: productImages.length === 0,
        orden: productImages.length,
      };
      setProductImages([...productImages, newImage]);
      alert2('Imagen agregada correctamente', 'success');
    } catch (error: any) {
      alert2(error.message || 'Error al agregar imagen', 'error');
    }
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.precio || !formData.categoriaId) {
      alert2('Rellena todos los campos requeridos', 'info');
      return;
    }

    try {
      const token = authService.getToken();
      const url = editingId 
        ? `${VITE_API_URL}/api/v1/products/${editingId}`
        : `${VITE_API_URL}/api/v1/products`;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar');

      const product = await response.json();
      const productId = product.id || editingId;

      // Guardar imágenes asociadas al producto
      if (productImages.length > 0) {
        for (let i = 0; i < productImages.length; i++) {
          const img = productImages[i];
          await fetch(`${VITE_API_URL}/api/v1/product-images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              productoId: productId,
              url: img.url,
              principal: i === 0 // Primera imagen como principal
            })
          });
        }
      }

      alert2(editingId ? 'Producto actualizado' : 'Producto creado', 'success');
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: '', descripcion: '', precio: 0, stock: 0, categoriaId: '' });
      setProductImages([]);
      setImageUrl('');
      fetchData();
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al guardar', 'error');
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm('¿Suspender este producto?')) return;

    try {
      const token = authService.getToken();
      const response = await fetch(`${VITE_API_URL}/api/v1/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al suspender');

      alert2('Producto suspendido', 'success');
      fetchData();
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message, 'error');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio,
      stock: product.stock,
      categoriaId: product.categoriaId
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '', precio: 0, stock: 0, categoriaId: '' });
    setProductImages([]);
    setImageUrl('');
  };

  const handleUploadFile = async (file: File) => {
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append('archivo', file);

      const token = authService.getToken();
      const response = await fetch(`${VITE_API_URL}/api/v1/product-images/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataFile,
      });

      if (!response.ok) throw new Error('Error al subir imagen');
      
      const result = await response.json();
      setProductImages([...productImages, {
        id: Math.random().toString(),
        url: result.url,
        principal: productImages.length === 0,
        orden: productImages.length,
      }]);
      alert2('Imagen subida correctamente', 'success');
    } catch (error: any) {
      alert2(error.message || 'Error al subir imagen', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDownloadFromUrl = async () => {
    if (!imageUrl) {
      alert2('Ingresa una URL válida', 'info');
      return;
    }

    setUploadingImage(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${VITE_API_URL}/api/v1/product-images/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) throw new Error('Error al descargar imagen');
      
      const result = await response.json();
      setProductImages([...productImages, {
        id: Math.random().toString(),
        url: result.url,
        principal: productImages.length === 0,
        orden: productImages.length,
      }]);
      setImageUrl('');
      alert2('Imagen descargada correctamente', 'success');
    } catch (error: any) {
      alert2(error.message || 'Error al descargar imagen', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index);
    setProductImages(newImages);
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = product.nombre.toLowerCase().includes(searchLower) ||
      product.descripcion?.toLowerCase().includes(searchLower);

    const matchesCategory = !categoryFilter || product.categoriaId === categoryFilter;

    const minPrice = minPriceFilter ? parseFloat(minPriceFilter) : 0;
    const maxPrice = maxPriceFilter ? parseFloat(maxPriceFilter) : Infinity;
    const matchesPrice = product.precio >= minPrice && product.precio <= maxPrice;

    const minStock = minStockFilter ? parseInt(minStockFilter) : 0;
    const maxStock = maxStockFilter ? parseInt(maxStockFilter) : Infinity;
    const matchesStock = product.stock >= minStock && product.stock <= maxStock;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // KPI Calculations
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.precio * p.stock), 0);
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      alert2('No hay productos para exportar', 'info');
      return;
    }

    const headers = ['Nombre', 'Categoría', 'Precio', 'Stock', 'Descripción'];
    const rows = filteredProducts.map(product => {
      const catName = categories.find(c => c.id === product.categoriaId)?.nombre || '-';
      return [
        product.nombre,
        catName,
        `$${product.precio.toLocaleString('es-CO')}`,
        product.stock,
        product.descripcion || ''
      ];
    });

    exportData.csv({
      headers,
      rows,
      title: 'REPORTE DE PRODUCTOS',
      filename: 'productos'
    });

    alert2('Productos exportados a CSV correctamente', 'success');
  };

  const handleExportPDF = () => {
    if (filteredProducts.length === 0) {
      alert2('No hay productos para exportar', 'info');
      return;
    }

    const headers = ['Nombre', 'Categoría', 'Precio', 'Stock', 'Estado'];
    const rows = filteredProducts.map(product => {
      const catName = categories.find(c => c.id === product.categoriaId)?.nombre || '-';
      const estado = product.stock === 0 ? 'Sin Stock' : product.stock < 10 ? 'Stock Bajo' : 'En Stock';
      return [
        product.nombre,
        catName,
        `$${product.precio.toLocaleString('es-CO')}`,
        product.stock,
        estado
      ];
    });

    exportData.pdf({
      headers,
      rows,
      title: 'REPORTE DE PRODUCTOS',
      filename: 'productos'
    });

    alert2('Productos exportados a PDF correctamente', 'success');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setMinPriceFilter('');
    setMaxPriceFilter('');
    setMinStockFilter('');
    setMaxStockFilter('');
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* HEADER PROFESIONAL */}
      <div className="products-header">
        <div className="header-info">
          <div className="module-badge">Inventario</div>
          <h1>Gestión de Productos</h1>
          <p>Control total del inventario y disponibilidad de productos</p>
        </div>
        <button 
          className="btn-nuevo-producto"
          onClick={() => setShowForm(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Productos Totales</div>
          <div className="kpi-value">{totalProducts}</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-label">Stock Bajo</div>
          <div className="kpi-value">{lowStockProducts}</div>
        </div>
        <div className="kpi-card danger">
          <div className="kpi-label">Sin Stock</div>
          <div className="kpi-value">{outOfStockProducts}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Valor Inventario</div>
          <div className="kpi-value">${totalInventoryValue.toLocaleString('es-CO', {maximumFractionDigits: 0})}</div>
        </div>
      </div>

      {/* FILTROS AVANZADOS */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Buscar
            </label>
            <input
              id="search"
              type="text"
              placeholder="Nombre, descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              Categoría
            </label>
            <select 
              id="category"
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="minPrice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12h8M12 8v8"/>
              </svg>
              Precio Min
            </label>
            <input
              id="minPrice"
              type="number"
              placeholder="0"
              value={minPriceFilter}
              onChange={(e) => setMinPriceFilter(e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12h8M12 8v8"/>
              </svg>
              Precio Max
            </label>
            <input
              id="maxPrice"
              type="number"
              placeholder="999999"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="minStock">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M12 2v20M2 12h20"/>
              </svg>
              Stock Min
            </label>
            <input
              id="minStock"
              type="number"
              placeholder="0"
              value={minStockFilter}
              onChange={(e) => setMinStockFilter(e.target.value)}
              className="filter-input"
              min="0"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="btn-secondary" 
            onClick={resetFilters}
          >
            Limpiar Filtros
          </button>
          <div className="export-buttons-group">
            <button 
              className="btn-export btn-csv" 
              onClick={handleExportCSV}
              title="Exportar a CSV"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M12 17v-5M8 12l4 4 4-4M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
              </svg>
              CSV
            </button>
            <button 
              className="btn-export btn-pdf" 
              onClick={handleExportPDF}
              title="Exportar a PDF"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              PDF
            </button>
          </div>
          <span className="filter-count">Mostrando <strong>{filteredProducts.length}</strong> de {products.length}</span>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="products-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
              <path d="M9 12h6m-6 4h6m2-11H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
            </svg>
            <p>No hay productos que coincidan con los filtros</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const stockPercentage = product.stock > 0 ? Math.min((product.stock / 100) * 100, 100) : 0;
            let stockStatus = 'normal';
            let statusLabel = 'En Stock';
            
            if (product.stock === 0) {
              stockStatus = 'out-of-stock';
              statusLabel = 'Sin Stock';
            } else if (product.stock < 5) {
              stockStatus = 'low-stock';
              statusLabel = 'Stock Bajo';
            }

            return (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <span className={`status-badge ${stockStatus}`}>{statusLabel}</span>
                </div>
                <div className="product-body">
                  <h3 className="product-name">{product.nombre}</h3>
                  <p className="product-desc">{product.descripcion || 'Sin descripción'}</p>
                  <div className="product-meta">
                    <div className="price">${product.precio.toLocaleString('es-CO', {maximumFractionDigits: 0})}</div>
                    <div className="stock-info">
                      <div className="stock-bar">
                        <div className="stock-fill" style={{width: `${stockPercentage}%`}}></div>
                      </div>
                      <span className="stock-text">{product.stock} unidades</span>
                    </div>
                  </div>
                </div>
                <div className="product-actions">
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEdit(product)}
                    title="Editar"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M3 17.25V21h3.75L17.81 9.94m-6.75-6.75l2.5-2.5a2 2 0 0 1 2.83 0l2.5 2.5a2 2 0 0 1 0 2.83l-2.5 2.5"/>
                    </svg>
                  </button>
                  <button 
                    className="btn-action suspend"
                    onClick={() => handleSuspend(product.id)}
                    title="Suspender"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m6 5v6m-3-3h6"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="btn-close" onClick={handleCancel}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body form-body">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Descripción (opcional)"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio (COP) *</label>
                  <input
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: Number(e.target.value)})}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              {/* SECCIÓN DE IMÁGENES */}
              <div className="form-group">
                <label className="images-label">Imágenes del Producto</label>
                <div className="images-upload-section">
                  <div className="upload-method">
                    <label htmlFor="file-input" className="file-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Subir Archivo
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleUploadFile(e.target.files[0])}
                      disabled={uploadingImage}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div className="divider">O</div>

                  <div className="upload-method url-method">
                    <div className="url-input-group">
                      <input
                        type="url"
                        placeholder="Ej: https://ejemplo.com/imagen.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        disabled={uploadingImage}
                      />
                      <button
                        type="button"
                        onClick={handleDownloadFromUrl}
                        disabled={uploadingImage || !imageUrl}
                        className="btn-url-submit"
                      >
                        {uploadingImage ? 'Cargando...' : 'Descargar'}
                      </button>
                    </div>
                  </div>

                  {availableImages.length > 0 && (
                    <>
                      <div className="divider">O</div>

                      <div className="upload-method available-method">
                        <label className="available-label">Seleccionar de Imágenes Disponibles</label>
                        <div className="available-images-grid">
                          {availableImages.map((img) => (
                            <div key={img.nombre} className="available-image-item">
                              <img src={img.ruta} alt={img.nombre} />
                              <button
                                type="button"
                                onClick={() => handleSelectAvailableImage(img.ruta)}
                                className="btn-select-image"
                                title={img.nombre}
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                </svg>
                              </button>
                              <span className="image-name">{img.nombre.substring(0, 15)}...</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* VISTA PREVIA DE IMÁGENES */}
                {productImages.length > 0 && (
                  <div className="images-preview">
                    <h4>Imágenes cargadas ({productImages.length})</h4>
                    <div className="images-grid">
                      {productImages.map((img, idx) => (
                        <div key={idx} className="image-item">
                          <img src={img.url} alt={`Producto imagen ${idx + 1}`} />
                          {productImages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="btn-remove-image"
                              title="Eliminar imagen"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
