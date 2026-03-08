import { useState, useEffect } from 'react';
import './admin-offers.css';

interface Offer {
  id: string;
  nombre: string;
  descripcion: string;
  descuento: number;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  productosAfectados?: number;
}

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descuento: 0,
    fechaInicio: '',
    fechaFin: '',
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      // Simulamos datos de ejemplo hasta tener endpoint real
      const mockOffers: Offer[] = [
        {
          id: '1',
          nombre: 'Descuento Primavera',
          descripcion: 'Descuento especial en productos seleccionados',
          descuento: 20,
          fechaInicio: '2026-03-01',
          fechaFin: '2026-03-31',
          activa: true,
          productosAfectados: 15,
        },
        {
          id: '2',
          nombre: 'Black Friday Anticipado',
          descripcion: 'Hasta 50% en categorías especiales',
          descuento: 50,
          fechaInicio: '2026-03-15',
          fechaFin: '2026-03-22',
          activa: false,
          productosAfectados: 8,
        },
      ];
      setOffers(mockOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.descuento) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newOffer: Offer = {
      id: Date.now().toString(),
      ...formData,
      activa: true,
      productosAfectados: 0,
    };

    setOffers([newOffer, ...offers]);
    setFormData({
      nombre: '',
      descripcion: '',
      descuento: 0,
      fechaInicio: '',
      fechaFin: '',
    });
    setShowForm(false);
  };

  const handleSuspendOffer = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setOffers(offers.map(o =>
      o.id === id ? { ...o, activa: !o.activa } : o
    ));
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
            
            <div className="form-grupo">
              <label>Nombre de la Oferta</label>
              <input
                type="text"
                placeholder="Ej: Descuento de Primavera"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-grupo">
              <label>Descripción</label>
              <textarea
                placeholder="Describe la oferta..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-fila">
              <div className="form-grupo">
                <label>Descuento (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="20"
                  value={formData.descuento}
                  onChange={(e) => setFormData({ ...formData, descuento: Number(e.target.value) })}
                  required
                />
              </div>

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

            <div className="form-acciones">
              <button type="submit" className="btn-guardar">Guardar Oferta</button>
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
          <p>Cargando ofertas...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zM7 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 6h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
          </svg>
          <h3>No hay ofertas activas</h3>
          <p>Crea tu primera oferta para atraer más clientes</p>
        </div>
      ) : (
        <div className="ofertas-grid">
          {offers.map((offer) => (
            <div key={offer.id} className={`oferta-card ${offer.activa ? 'activa' : 'inactiva'}`}>
              <div className="oferta-header">
                <div className="oferta-descuento">
                  <span className="porcentaje">{offer.descuento}%</span>
                  <span className="descuento">Desc.</span>
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
                <p>{offer.descripcion}</p>
                
                {offer.productosAfectados && (
                  <div className="oferta-productos">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M7 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7-2c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm-7 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7-2c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm-7 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7-2c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/>
                    </svg>
                    <span>{offer.productosAfectados} productos</span>
                  </div>
                )}

                {offer.fechaInicio && offer.fechaFin && (
                  <div className="oferta-fechas">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                    </svg>
                    <span>{offer.fechaInicio} - {offer.fechaFin}</span>
                  </div>
                )}
              </div>

              <div className="oferta-acciones">
                <button
                  className={`btn-toggle ${offer.activa ? 'desactivar' : 'activar'}`}
                  onClick={() => handleToggleActive(offer.id)}
                >
                  {offer.activa ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  className="btn-suspend"
                  onClick={() => handleSuspendOffer(offer.id)}
                >
                  Suspender
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
