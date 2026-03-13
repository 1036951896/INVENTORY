
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './public-offers.css';
import { getPublicOffers } from '../../services/admin-api.service';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  productos?: Product[];
  offerType?: 'percentage' | 'fixed' | 'bulk';
  offerDetails?: {
    percentaje?: number;
    fijo?: number;
    compre?: number;
    lleve?: number;
  };
  productosCount?: number;
}

const PublicOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todas');
  const navigate = useNavigate();

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return `${BACKEND_URL}/assets/product-placeholder.svg`;
    // Ya viene completa del servicio
    return imagePath;
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getPublicOffers();
        const offersData: Offer[] = Array.isArray(data) ? data.map((o: any) => ({
          id: o.id,
          title: o.title,
          description: o.description,
          discount: o.discount,
          validUntil: o.validUntil,
          offerType: o.offerType,
          offerDetails: o.offerDetails,
          productosCount: o.productosCount,
          product: o.product ? {
            id: o.product.id,
            nombre: o.product.nombre,
            imagen: o.product.imagen,
            categoria: o.product.categoria,
            precio: o.product.precio,
            stock: o.product.stock,
          } : {},
          productos: Array.isArray(o.productos) ? o.productos.map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            imagen: p.imagen,
            categoria: p.categoria,
            precio: p.precio,
            stock: p.stock,
          })) : [],
        })) : [];
        const sorted = offersData.sort((a, b) => new Date(b.validUntil || '').getTime() - new Date(a.validUntil || '').getTime());
        setOffers(sorted);
        setFilteredOffers(sorted);
      } catch (error) {
        console.error('Error fetching public offers:', error);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchOffers();
  }, []);

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

  const categories = Array.from(new Set(offers.map(o => o.product?.categoria).filter((cat): cat is string => Boolean(cat))));

  const getOfferBadgeText = (offer: Offer): string => {
    switch (offer.offerType) {
      case 'percentage':
        return `-${offer.offerDetails?.percentaje || 0}%`;
      case 'fixed':
        return `-$${offer.offerDetails?.fijo || 0}`;
      case 'bulk':
        return `${offer.offerDetails?.compre}x${offer.offerDetails?.lleve}`;
      default:
        return `-${offer.discount || 0}%`;
    }
  };

  const getOfferDescription = (offer: Offer): string => {
    switch (offer.offerType) {
      case 'percentage':
        return `${offer.offerDetails?.percentaje}% de descuento`;
      case 'fixed':
        return `$${offer.offerDetails?.fijo?.toLocaleString('es-CO')} de descuento`;
      case 'bulk':
        return `Compra ${offer.offerDetails?.compre} lleva ${offer.offerDetails?.lleve}`;
      default:
        return offer.description || 'Oferta especial';
    }
  };

  const calculateOfferPrice = (precio: number, offer: Offer): number => {
    if (offer.offerType === 'percentage') {
      const desc = offer.offerDetails?.percentaje || 0;
      return Math.floor(precio * (1 - desc / 100));
    } else if (offer.offerType === 'fixed') {
      const desc = offer.offerDetails?.fijo || 0;
      return Math.max(0, precio - desc);
    }
    return precio;
  };

  if (loading) {
    return <div className="public-offers-container"><p>Cargando ofertas...</p></div>;
  }

  return (
    <div className="public-offers-container">
      {/* Banner */}
      <section className="banner-ofertas">
        <div className="banner-hero-grid">
          {/* Izquierda: texto */}
          <div className="banner-hero-texto">
            <span className="banner-badge-urgencia">🔥 Ofertas limitadas</span>
            <h2 className="banner-hero-titulo">Descuentos<br/>Especiales</h2>
            <div className="banner-descuento-bloque">
              <span className="banner-hasta">HASTA</span>
              <span className="banner-porcentaje">40%</span>
              <span className="banner-off">OFF</span>
            </div>
            <p className="banner-hero-subtitulo">En productos seleccionados por tiempo limitado</p>
            <div className="banner-hero-acciones">
              <button className="btn-ofertas-hero" onClick={() => navigate('/')}>
                ← Volver al inicio
              </button>
              <span className="banner-badge-urgencia">⏳ Solo por hoy</span>
            </div>
          </div>
          {/* Derecha: visual decorativo */}
          <div className="banner-hero-visual">
            <div className="banner-productos-visual">
              <div className="banner-emoji-grande">🛒</div>
              <div className="banner-emojis-fila">
                <span>🥕</span>
                <span>🥔</span>
                <span>🌽</span>
              </div>
              <div className="banner-emojis-fila">
                <span>📦</span>
                <span>🧂</span>
                <span>🥩</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Búsqueda */}
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

      {/* Filtros */}
      <div className="filtro-tabs-container">
        <div className="filtro-ofertas">
          <button
            className={`filter-btn ${activeCategory === 'todas' ? 'activo' : ''}`}
            onClick={() => setActiveCategory('todas')}
          >
            <span className="filter-label">Todas</span>
            <span className="filter-count">({offers.length})</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'activo' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="filter-label">{cat}</span>
            </button>
          ))}
        </div>
        <div className="filter-counter">
          {filteredOffers.length} {filteredOffers.length === 1 ? 'oferta' : 'ofertas'}
        </div>
      </div>

      {/* Grid */}
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
          filteredOffers.flatMap(offer => {
            // Si la oferta tiene múltiples productos, crear una tarjeta por cada uno
            const productosEnOferta = (offer.productos && offer.productos.length > 0) ? offer.productos : [];
            
            if (productosEnOferta.length === 0) {
              return [];
            }
            
            // Retornar una tarjeta para cada producto
            return productosEnOferta.map((producto, idx) => {
              const precioOriginal = typeof producto.precio === 'number' ? producto.precio : 0;
              const precioOferta = calculateOfferPrice(precioOriginal, offer);
              const badgeText = getOfferBadgeText(offer);
              
              return (
                <div key={`${offer.id}-${idx}`} className={`tarjeta-producto oferta-tipo-${offer.offerType || 'percentage'}`}>
                  {/* Imagen del producto específico */}
                  <div className="tarjeta-producto-imagen" style={{ position: 'relative' }}>
                    <div className={`badge-descuento ${offer.offerType || 'percentage'}`}>
                      {badgeText}
                    </div>
                    
                    <img
                      src={getImageUrl(producto.imagen)}
                      alt={producto.nombre || 'Producto'}
                      onError={e => { e.currentTarget.src = `${BACKEND_URL}/assets/product-placeholder.svg`; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div className="tarjeta-producto-contenido">
                    <div className="tarjeta-producto-nombre">{producto.nombre || 'Sin nombre'}</div>
                    <div className="tarjeta-producto-categoria">{producto.categoria || 'General'}</div>
                    <div className="oferta-tipo-label">{getOfferDescription(offer)}</div>
                    
                    {offer.offerType !== 'bulk' && (
                      <div className="precios">
                        <div className="precio-original">${precioOriginal.toLocaleString('es-CO')}</div>
                        <div className="precio-oferta">${precioOferta.toLocaleString('es-CO')}</div>
                      </div>
                    )}
                    
                    <div className="tarjeta-producto-stock">
                      Stock: <strong>{typeof producto.stock === 'number' ? producto.stock : 'N/A'}</strong>
                    </div>
                    <div className="tarjeta-producto-botones">
                      <button className="btn btn-principal">
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              );
            });
          })
        )}
      </div>
    </div>
  );
};

export default PublicOffers;