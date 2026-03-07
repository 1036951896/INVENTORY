import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { productsService } from '../services/products.service';
import { useCart } from '../context/CartContext';
import { alert2 } from '../utils/notifications';
import { mockProducts } from '../data/mockProducts';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USE_MOCK_DATA = false; // Cambiar a false cuando tengas el backend corriendo

interface ProductGridProps {
  activeCategory?: string;
}

export default function ProductGrid({ activeCategory = 'todas' }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrar productos cuando cambia la categoría
  useEffect(() => {
    if (activeCategory === 'todas') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.categoria === activeCategory));
    }
  }, [activeCategory, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } else {
        const data = await productsService.getAll();
        console.log('Products loaded:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Los productos no fueron cargados correctamente');
        }
        
        if (data.length === 0) {
          console.warn('No products found');
        }
        
        setProducts(data);
        setFilteredProducts(data);
      }
      
    } catch (err: any) {
      console.error('Error cargando productos:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error al cargar productos';
      setError(errorMsg);
      alert2(errorMsg, 'error');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevenir navegación al detalle
    }
    if (product.stock === 0) return;
    addToCart(product, 1);
    alert2(`${product.nombre} agregado al carrito`, 'success');
  };

  const handleProductClick = (productId: number | string) => {
    navigate(`/producto/${productId}`);
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return `${BACKEND_URL}/assets/product-placeholder.svg`;
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  if (loading) {
    return (
      <main>
        <section>
          <h2>Catálogo de Productos</h2>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p>Cargando productos...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section>
          <h2>Catálogo de Productos</h2>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ color: '#E74C3C' }}>❌ {error}</p>
            <button onClick={loadProducts} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#386273', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <main>
        <section>
          <h2>Catálogo de Productos</h2>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p>No hay productos disponibles {activeCategory !== 'todas' ? `en la categoría "${activeCategory}"` : ''}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <h2>Catálogo de Productos</h2>
        <div className="productos-grid" id="productos-grid">
          {filteredProducts.map((product) => {
            const badgeDisponible = product.stock > 0 ? '🟢 Disponible' : '❌ Agotado';
            const stockClass = product.stock > 0 ? 'disponible' : 'agotado';

            return (
              <div 
                key={product.id} 
                className="tarjeta-producto"
                onClick={() => handleProductClick(product.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="tarjeta-producto-imagen">
                  <img
                    src={getImageUrl(product.imagen)}
                    alt={product.nombre}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `${BACKEND_URL}/assets/product-placeholder.svg`;
                    }}
                  />
                </div>
                <div className="tarjeta-producto-contenido">
                  <h3 className="tarjeta-producto-nombre">{product.nombre}</h3>
                  
                  <div className="tarjeta-producto-precio">
                    ${product.precio.toLocaleString('es-CO')}
                  </div>
                  
                  <p className={`tarjeta-producto-disponibilidad ${stockClass}`}>
                    {badgeDisponible}
                  </p>
                  
                  <button
                    className="tarjeta-producto-btn-principal"
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.stock === 0}
                  >
                    🛒 Agregar al carrito
                  </button>
                  
                  <div className="tarjeta-producto-link-detalle">
                    Ver detalles →
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
