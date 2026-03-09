
import React, { useEffect, useState } from 'react';
import './public-offers.css';
import { getPublicOffers } from '../../services/admin-api.service';

interface Product {
  id?: string;
  nombre?: string;
  imagen?: string;
  categoria?: string;
  precio?: number;
  stock?: number;
}

interface Offer {
  id?: string;
  title?: string;
  description?: string;
  discount?: number;
  validUntil?: string;
  product?: Product;
}

const PublicOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todas');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getPublicOffers();
        // Ordenar por fecha de vigencia descendente
        // Validar que cada oferta tenga la estructura esperada
        const offersData: Offer[] = Array.isArray(data) ? data.map((o: any) => ({
          id: o.id,
          title: o.title,
          description: o.description,
          discount: o.discount,
          validUntil: o.validUntil,
          product: o.product ? {
            id: o.product.id,
            nombre: o.product.nombre,
            imagen: o.product.imagen,
            categoria: o.product.categoria,
            precio: o.product.precio,
            stock: o.product.stock,
          } : {},
        })) : [];
        const sorted = offersData.sort((a, b) => new Date(b.validUntil || '').getTime() - new Date(a.validUntil || '').getTime());
        setOffers(sorted);
        setFilteredOffers(sorted);
      } catch (error) {
        console.error('Error fetching public offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Filtrar por búsqueda
  useEffect(() => {
    let filtered = offers;
    if (search.trim()) {
      filtered = filtered.filter(offer => {
        const prod = offer.product || {};
        return (
          (prod.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
          (prod.categoria || '').toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    if (activeCategory !== 'todas') {
      filtered = filtered.filter(offer => {
        const prod = offer.product || {};
        return prod.categoria === activeCategory;
      });
    }
    setFilteredOffers(filtered);
  }, [search, activeCategory, offers]);

  // Extraer categorías únicas
  const categories = Array.from(new Set(offers.map(o => o.product?.categoria).filter(Boolean)));

  if (loading) {
    return <div className="public-offers-container"><p>Cargando ofertas...</p></div>;
  }

  return (
    <div className="public-offers-container">
      {/* Banner de ofertas */}
      <section className="banner-ofertas">
        <div className="banner-content">
          <svg className="banner-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          <h2>OFERTAS ESPECIALES</h2>
          <p>Aprovecha nuestros descuentos limitados en productos seleccionados</p>
        </div>
      </section>

      {/* Barra de búsqueda */}
      <div className="barra-busqueda-contenedor">
        <div className="barra-busqueda">
          <svg className="icono-buscar-fijo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar en ofertas..."
            className="input-buscar"
          />
        </div>
      </div>

      {/* Filtros de categorías */}
      <div className="filtro-tabs-container">
        <div className="filtro-ofertas">
          <button
            className={`filter-btn ${activeCategory === 'todas' ? 'activo' : ''}`}
            onClick={() => setActiveCategory('todas')}
            title="Ver todas las ofertas"
          >
            <svg className="filter-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/>
            </svg>
            <span className="filter-label">Todas</span>
            <span className="filter-count">({offers.length})</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'activo' : ''}`}
              onClick={() => setActiveCategory(cat)}
              title={`Filtrar por ${cat}`}
            >
              <svg className="filter-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-1.9-2-2-2zm5-4c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-5-6C5.9 8 5 8.9 5 10s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 0c-1.1 0-1.99.9-1.99 2S10.9 10 12 10s2-.9 2-2-.9-2-2-2zm5 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span className="filter-label">{cat}</span>
            </button>
          ))}
        </div>
        <div className="filter-counter">
          {filteredOffers.length} {filteredOffers.length === 1 ? 'oferta' : 'ofertas'}
        </div>
      </div>

      {/* Grid de productos en oferta */}
      <div className="productos-grid">
        {filteredOffers.length === 0 ? (
          <div className="sin-ofertas">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6m0 4v.01" />
            </svg>
            <h3>No hay ofertas disponibles</h3>
            <p>Vuelve pronto para ver nuestras próximas promociones</p>
            <a href="/" className="btn btn-principal" style={{ marginTop: 20, display: 'inline-block' }}>
              Ver catálogo completo
            </a>
          </div>
        ) : (
          filteredOffers.map(offer => {
            const prod = offer.product || {};
            const precioOriginal = typeof prod.precio === 'number' ? prod.precio : 0;
            const descuentoPorcentaje = typeof offer.discount === 'number' ? offer.discount : 0;
            const precioOferta = Math.floor(precioOriginal * (1 - descuentoPorcentaje / 100));
            return (
              <div key={offer.id || Math.random()} className="tarjeta-producto">
                <div className="tarjeta-producto-imagen" style={{ position: 'relative' }}>
                  <div className="badge-descuento">-{descuentoPorcentaje}%</div>
                  <img
                    src={prod.imagen || '/assets/product-placeholder.svg'}
                    alt={prod.nombre || 'Producto'}
                    onError={e => { e.currentTarget.src = '/assets/product-placeholder.svg'; }}
                  />
                </div>
                <div className="tarjeta-producto-contenido">
                  <div className="tarjeta-producto-nombre">{prod.nombre || 'Sin nombre'}</div>
                  <div className="tarjeta-producto-categoria">{prod.categoria || 'Sin categoría'}</div>
                  <div>
                    <div className="precio-original">${precioOriginal.toLocaleString('es-CO')}</div>
                    <div className="precio-oferta">${precioOferta.toLocaleString('es-CO')}</div>
                  </div>
                  <div className="tarjeta-producto-stock">
                    Stock: <strong>{typeof prod.stock === 'number' ? prod.stock : 'N/A'}</strong>
                  </div>
                  <div className="tarjeta-producto-botones">
                    <button className="btn btn-principal">
                      Agregar al carrito
                    </button>
                    <button className="btn btn-secundario">
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PublicOffers;