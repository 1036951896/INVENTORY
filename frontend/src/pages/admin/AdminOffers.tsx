import { useState, useEffect } from 'react';
import './admin-offers.css';
import { 
  loadOffers, 
  createOffer, 
  deleteOffer, 
  toggleOfferActive,
  getOfferDescription,
  type StoredOffer,
  type OfferType
} from '../../utils/offersStorage';
import { productsApiService } from '../../services/admin-api.service';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
}

export default function AdminOffers() {
  const [offers, setOffers] = useState<StoredOffer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [tipoOferta, setTipoOferta] = useState<OfferType>('percentage');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchProductsQuery, setSearchProductsQuery] = useState<string>('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descuentoPorcentaje: 0,
    descuentoFijo: 0,
    cantidadCompre: 2,
    cantidadLleve: 3,
    fechaInicio: '',
    fechaFin: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Cargar ofertas
      const storedOffers = loadOffers();
      setOffers(storedOffers);
      
      // Cargar productos
      try {
        const productsData = await productsApiService.getAll();
        console.log('Products data:', productsData); // DEBUG
        
        let productsList = [];
        
        // Manejar diferentes estructuras de respuesta
        if (Array.isArray(productsData)) {
          productsList = productsData;
        } else if (productsData && Array.isArray(productsData.data)) {
          // Estructura: { data: [...], pagination: {...} }
          productsList = productsData.data;
        } else if (productsData && Array.isArray(productsData.items)) {
          productsList = productsData.items;
        } else if (productsData && Array.isArray(productsData.products)) {
          productsList = productsData.products;
        } else if (productsData && typeof productsData === 'object') {
          const values = Object.values(productsData).filter((item: any) => 
            Array.isArray(item) || (item && typeof item === 'object' && (item.nombre || item.name))
          );
          productsList = Array.isArray(values[0]) ? values[0] : values;
        }
        
        console.log('Processed products list:', productsList); // DEBUG
        
        const formattedProducts = (Array.isArray(productsList) ? productsList : []).map((p: any) => ({
          id: String(p.id),
          nombre: p.nombre || p.name || 'Sin nombre',
          precio: Number(p.precio || p.price || 0),
          categoria: p.categoria?.nombre || p.categoria?.name || p.category || 'General'
        }));
        
        console.log('Formatted products:', formattedProducts); // DEBUG
        setProducts(formattedProducts);
      } catch (productsError) {
        console.error('Error loading products:', productsError);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || selectedProducts.length === 0) {
      alert('⚠️ Completa el nombre y selecciona al menos un producto');
      return;
    }

    // Validar según tipo de oferta
    if (tipoOferta === 'percentage' && !formData.descuentoPorcentaje) {
      alert('⚠️ Ingresa el porcentaje de descuento');
      return;
    }
    if (tipoOferta === 'fixed' && !formData.descuentoFijo) {
      alert('⚠️ Ingresa el descuento fijo');
      return;
    }
    if (tipoOferta === 'bulk' && (!formData.cantidadCompre || !formData.cantidadLleve)) {
      alert('⚠️ Ingresa las cantidades para la promoción');
      return;
    }

    // Crear oferta
    const newOffer = createOffer({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      tipo: tipoOferta,
      descuentoPorcentaje: tipoOferta === 'percentage' ? formData.descuentoPorcentaje : undefined,
      descuentoFijo: tipoOferta === 'fixed' ? formData.descuentoFijo : undefined,
      cantidadCompre: tipoOferta === 'bulk' ? formData.cantidadCompre : undefined,
      cantidadLleve: tipoOferta === 'bulk' ? formData.cantidadLleve : undefined,
      productosIds: selectedProducts,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      activa: true,
    });

    setOffers([newOffer, ...offers]);
    
    // Reset form
    setFormData({
      nombre: '',
      descripcion: '',
      descuentoPorcentaje: 0,
      descuentoFijo: 0,
      cantidadCompre: 2,
      cantidadLleve: 3,
      fechaInicio: '',
      fechaFin: '',
    });
    setSelectedProducts([]);
    setTipoOferta('percentage');
    setShowForm(false);
    alert('✅ Oferta creada exitosamente');
  };

  const handleSuspendOffer = (id: string) => {
    if (!confirm('¿Estás seguro que deseas eliminar esta oferta?')) return;
    deleteOffer(id);
    setOffers(offers.filter(o => o.id !== id));
    alert('✓ Oferta eliminada');
  };

  const handleToggleActive = (id: string) => {
    const updated = toggleOfferActive(id);
    if (updated) {
      setOffers(offers.map(o => o.id === id ? updated : o));
      alert(`✓ Oferta ${updated.activa ? 'activada' : 'desactivada'}`);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="offers-container">
      <div className="offers-header">
        <div>
          <h1>Gestión de Ofertas</h1>
          <p>Crea y administra promociones para tus clientes</p>
        </div>
        <button 
          className="btn-crear-oferta"
          onClick={() => setShowForm(!showForm)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Nueva Oferta
        </button>
      </div>

      {/* FORM CREAR OFERTA */}
      {showForm && (
        <div className="oferta-form-container">
          <form className="oferta-form" onSubmit={handleAddOffer}>
            <h3>Crear Nueva Oferta</h3>
            
            {/* Nombre y Descripción */}
            <div className="form-grupo">
              <label>Nombre de la Oferta *</label>
              <input
                type="text"
                placeholder="Ej: Black Friday, Descuento Primavera"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-grupo">
              <label>Descripción</label>
              <textarea
                placeholder="Describe brevemente la oferta..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={2}
              />
            </div>

            {/* Tipo de Oferta */}
            <div className="form-grupo">
              <label>Tipo de Oferta *</label>
              <div className="tipo-oferta-tabs">
                <button
                  type="button"
                  className={`tab-btn ${tipoOferta === 'percentage' ? 'activo' : ''}`}
                  onClick={() => setTipoOferta('percentage')}
                >
                  % Descuento
                </button>
                <button
                  type="button"
                  className={`tab-btn ${tipoOferta === 'fixed' ? 'activo' : ''}`}
                  onClick={() => setTipoOferta('fixed')}
                >
                  $ Descuento Fijo
                </button>
                <button
                  type="button"
                  className={`tab-btn ${tipoOferta === 'bulk' ? 'activo' : ''}`}
                  onClick={() => setTipoOferta('bulk')}
                >
                  🎁 Pague X Lleve Y
                </button>
              </div>
            </div>

            {/* Campos dinámicos según tipo */}
            {tipoOferta === 'percentage' && (
              <div className="form-grupo">
                <label>Descuento (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Ej: 30"
                  value={formData.descuentoPorcentaje}
                  onChange={(e) => setFormData({ ...formData, descuentoPorcentaje: Number(e.target.value) })}
                />
              </div>
            )}

            {tipoOferta === 'fixed' && (
              <div className="form-grupo">
                <label>Descuento Fijo ($)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  placeholder="Ej: 5000"
                  value={formData.descuentoFijo}
                  onChange={(e) => setFormData({ ...formData, descuentoFijo: Number(e.target.value) })}
                />
              </div>
            )}

            {tipoOferta === 'bulk' && (
              <div className="form-fila">
                <div className="form-grupo">
                  <label>Compra (cantidad)</label>
                  <input
                    type="number"
                    min="2"
                    value={formData.cantidadCompre}
                    onChange={(e) => setFormData({ ...formData, cantidadCompre: Number(e.target.value) })}
                  />
                </div>
                <div className="form-grupo">
                  <label>Lleva (cantidad)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.cantidadLleve}
                    onChange={(e) => setFormData({ ...formData, cantidadLleve: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}

            {/* Fechas */}
            <div className="form-fila">
              <div className="form-grupo">
                <label>Fecha Inicio</label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                />
              </div>
              <div className="form-grupo">
                <label>Fecha Fin</label>
                <input
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                />
              </div>
            </div>

            {/* Seleccionar Productos */}
            <div className="form-grupo">
              <label>Productos en Oferta * ({selectedProducts.length} seleccionados)</label>
              
              {/* Buscador de productos */}
              <input
                type="text"
                placeholder="🔍 Buscar productos por nombre..."
                value={searchProductsQuery}
                onChange={(e) => setSearchProductsQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
              
              <div className="productos-selector">
                {products.length === 0 ? (
                  <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                    No hay productos disponibles
                  </p>
                ) : (() => {
                  const filtered = products.filter(p =>
                    p.nombre.toLowerCase().includes(searchProductsQuery.toLowerCase())
                  );
                  
                  return (
                    <>
                      {filtered.length === 0 ? (
                        <p style={{ color: '#d32f2f', textAlign: 'center', padding: '20px', fontSize: '14px' }}>
                          No se encontraron productos con "{searchProductsQuery}"
                        </p>
                      ) : (
                        <>
                          <div style={{ textAlign: 'right', padding: '8px 12px', fontSize: '12px', color: '#666' }}>
                            {filtered.length} de {products.length} productos
                          </div>
                          <div className="productos-grid-selector">
                            {filtered.map(product => (
                              <label key={product.id} className="producto-checkbox">
                                <input
                                  type="checkbox"
                                  checked={selectedProducts.includes(product.id)}
                                  onChange={() => toggleProductSelection(product.id)}
                                />
                                <span className="producto-info">
                                  <strong>{product.nombre}</strong>
                                  <small>${product.precio?.toLocaleString('es-CO') || 'N/A'}</small>
                                </span>
                              </label>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Botones */}
            <div className="form-acciones">
              <button type="submit" className="btn-guardar">Crear Oferta</button>
              <button 
                type="button" 
                className="btn-cancelar"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTA DE OFERTAS */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zM7 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 6h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
          </svg>
          <h3>No hay ofertas aún</h3>
          <p>Crea tu primera promoción para atraer más clientes</p>
        </div>
      ) : (
        <div className="ofertas-grid">
          {offers.map((offer) => (
            <div key={offer.id} className={`oferta-card ${offer.activa ? 'activa' : 'inactiva'}`}>
              <div className="oferta-header">
                <div className="oferta-tipo-badge">
                  {offer.tipo === 'percentage' && `${offer.descuentoPorcentaje}%`}
                  {offer.tipo === 'fixed' && `$${offer.descuentoFijo?.toLocaleString('es-CO')}`}
                  {offer.tipo === 'bulk' && `${offer.cantidadCompre}x${offer.cantidadLleve}`}
                </div>
                <div className="oferta-estado">
                  {offer.activa ? (
                    <span className="badge-activa">Activa</span>
                  ) : (
                    <span className="badge-inactiva">Inactiva</span>
                  )}
                </div>
              </div>

              <div className="oferta-content">
                <h4>{offer.nombre}</h4>
                <p className="oferta-tipo-desc">{getOfferDescription(offer)}</p>
                {offer.descripcion && <p className="oferta-desc">{offer.descripcion}</p>}
                
                <div className="oferta-productos-count">
                  📦 {offer.productosIds?.length || 0} productos
                </div>

                {offer.fechaInicio && offer.fechaFin && (
                  <div className="oferta-fechas">
                    📅 {offer.fechaInicio} → {offer.fechaFin}
                  </div>
                )}
              </div>

              <div className="oferta-acciones">
                <button
                  className={`btn-toggle ${offer.activa ? 'desactivar' : 'activar'}`}
                  onClick={() => handleToggleActive(offer.id)}
                >
                  {offer.activa ? '⏸ Desactivar' : '▶ Activar'}
                </button>
                <button
                  className="btn-suspend"
                  onClick={() => handleSuspendOffer(offer.id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
