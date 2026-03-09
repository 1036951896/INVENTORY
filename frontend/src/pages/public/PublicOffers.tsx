
import React, { useEffect, useState } from 'react';
import './public-offers.css';
import { getPublicOffers } from '../../services/admin-api.service';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  product?: Product;
}

interface Product {
  id: string;
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
  stock: number;
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
        const sorted = data.sort((a: Offer, b: Offer) => new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime());
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
        <h2>🎉 ¡OFERTAS ESPECIALES! 🎉</h2>
        <p>Aprovecha nuestros descuentos limitados en productos seleccionados</p>
      </section>

      {/* Contador de ofertas */}
      <div className="contador-ofertas">
        Total de ofertas: <span>{filteredOffers.length}</span>
      </div>

      {/* Barra de búsqueda */}
      <div className="barra-busqueda-contenedor" style={{ marginBottom: '20px' }}>
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
      <div className="filtro-ofertas">
        <button
          className={activeCategory === 'todas' ? 'activo' : ''}
          onClick={() => setActiveCategory('todas')}
        >
          Todas ({offers.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={activeCategory === cat ? 'activo' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
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
            const precioOriginal = prod.precio || 0;
            const descuentoPorcentaje = offer.discount || 0;
            const precioOferta = Math.floor(precioOriginal * (1 - descuentoPorcentaje / 100));
            return (
              <div key={offer.id} className="tarjeta-producto">
                <div className="tarjeta-producto-imagen" style={{ position: 'relative' }}>
                  <div className="badge-descuento">-{descuentoPorcentaje}%</div>
                  <img
                    src={prod.imagen || '/assets/product-placeholder.svg'}
                    alt={prod.nombre}
                    onError={e => { e.currentTarget.src = '/assets/product-placeholder.svg'; }}
                  />
                </div>
                <div className="tarjeta-producto-contenido">
                  <div className="tarjeta-producto-nombre">{prod.nombre}</div>
                  <div className="tarjeta-producto-categoria">{prod.categoria}</div>
                  <div>
                    <div className="precio-original">${precioOriginal.toLocaleString('es-CO')}</div>
                    <div className="precio-oferta">${precioOferta.toLocaleString('es-CO')}</div>
                  </div>
                  <div className="tarjeta-producto-stock">
                    Stock: <strong>{prod.stock}</strong>
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