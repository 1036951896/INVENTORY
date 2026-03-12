/**
 * Utilidades para gestionar ofertas con localStorage
 */

export type OfferType = 'percentage' | 'fixed' | 'bulk';

export interface StoredOffer {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: OfferType; // 'percentage' | 'fixed' | 'bulk'
  
  // Campos según el tipo
  descuentoPorcentaje?: number; // Para 'percentage' (0-100)
  descuentoFijo?: number; // Para 'fixed' (cantidad en pesos)
  cantidadCompre?: number; // Para 'bulk' (ej: compre 2)
  cantidadLleve?: number; // Para 'bulk' (ej: lleve 3)
  
  // Productos que aplican
  productosIds: string[]; // IDs de productos en oferta
  
  // Vigencia
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}

const STORAGE_KEY = 'app_offers_v2';

/**
 * Cargar todas las ofertas desde localStorage
 */
export const loadOffers = (): StoredOffer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading offers from storage:', error);
    return [];
  }
};

/**
 * Guardar ofertas en localStorage
 */
export const saveOffers = (offers: StoredOffer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  } catch (error) {
    console.error('Error saving offers to storage:', error);
  }
};

/**
 * Obtener solo ofertas activas
 */
export const getActiveOffers = (): StoredOffer[] => {
  return loadOffers().filter(offer => offer.activa);
};

/**
 * Crear una nueva oferta
 */
export const createOffer = (offer: Omit<StoredOffer, 'id'>): StoredOffer => {
  const offers = loadOffers();
  const newOffer: StoredOffer = {
    ...offer,
    id: Date.now().toString(),
  };
  offers.push(newOffer);
  saveOffers(offers);
  return newOffer;
};

/**
 * Actualizar una oferta existente
 */
export const updateOffer = (id: string, updates: Partial<StoredOffer>): StoredOffer | null => {
  const offers = loadOffers();
  const index = offers.findIndex(o => o.id === id);
  
  if (index === -1) return null;
  
  const updatedOffer = { ...offers[index], ...updates };
  offers[index] = updatedOffer;
  saveOffers(offers);
  
  return updatedOffer;
};

/**
 * Eliminar una oferta
 */
export const deleteOffer = (id: string): boolean => {
  const offers = loadOffers();
  const filtered = offers.filter(o => o.id !== id);
  
  if (filtered.length === offers.length) return false;
  
  saveOffers(filtered);
  return true;
};

/**
 * Alternar estado activo/inactivo de una oferta
 */
export const toggleOfferActive = (id: string): StoredOffer | null => {
  const offers = loadOffers();
  const offer = offers.find(o => o.id === id);
  
  if (!offer) return null;
  
  offer.activa = !offer.activa;
  saveOffers(offers);
  return offer;
};

/**
 * Obtener descripción legible del tipo de oferta
 */
export const getOfferDescription = (offer: StoredOffer): string => {
  switch (offer.tipo) {
    case 'percentage':
      return `${offer.descuentoPorcentaje}% de descuento`;
    case 'fixed':
      return `$${offer.descuentoFijo?.toLocaleString('es-CO')} de descuento`;
    case 'bulk':
      return `Compra ${offer.cantidadCompre} lleva ${offer.cantidadLleve}`;
    default:
      return 'Oferta especial';
  }
};

/**
 * Calcular precio final con la oferta aplicada
 */
export const calculateOfferPrice = (
  precio: number,
  offer: StoredOffer
): number => {
  switch (offer.tipo) {
    case 'percentage':
      const descPercentage = offer.descuentoPorcentaje || 0;
      return Math.floor(precio * (1 - descPercentage / 100));
    case 'fixed':
      const descFixed = offer.descuentoFijo || 0;
      return Math.max(0, precio - descFixed);
    case 'bulk':
      // Para bulk, el precio se calcula diferente
      // No se aplica descuento directo, se muestra en la tarjeta
      return precio;
    default:
      return precio;
  }
};

