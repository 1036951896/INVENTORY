import React, { useEffect, useState } from 'react';
import './public-offers.css'; // Crea un archivo CSS para estilos específicos
import { getPublicOffers } from '../../services/admin-api.service';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
}

const PublicOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getPublicOffers(); // Llama al servicio para obtener ofertas públicas
        setOffers(data);
      } catch (error) {
        console.error('Error fetching public offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return <p>Cargando ofertas...</p>;
  }

  if (offers.length === 0) {
    return <p>No hay ofertas disponibles en este momento.</p>;
  }

  return (
    <div className="public-offers-container">
      <h1>Ofertas Especiales</h1>
      <div className="offers-grid">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>
            <p>
              <strong>{offer.discount}% de descuento</strong>
            </p>
            <p>Válido hasta: {new Date(offer.validUntil).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicOffers;