import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { alert2 } from '../utils/notifications';
import { productsService } from '../services/products.service';
import type { Product } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartPanel from '../components/CartPanel';
import '../styles/product-detail.css';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ProductWithImages extends Product {
  imagenes?: Array<{ url: string; principal: boolean; orden: number }>;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [salesCount, setSalesCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Obtener producto de la API
        const response = await productsService.getById(id || '');
        
        if (!response) {
          alert2('Producto no encontrado', 'error');
          navigate('/');
          return;
        }
        
        setProduct(response as ProductWithImages);
        
        // Generar número aleatorio de ventas (10-40)
        setSalesCount(Math.floor(Math.random() * 30) + 10);
        
        // Cargar todos los productos para encontrar relacionados
        const allProducts = await productsService.getAll();
        const related = allProducts
          .filter(p => p.categoria === response.categoria && String(p.id) !== String(response.id))
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error: any) {
        console.error('Error cargando producto:', error);
        alert2('Error al cargar el producto', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />
        <main className="contenedor">
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p>Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />
        <main className="contenedor">
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p>Producto no encontrado</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return `${BACKEND_URL}/assets/product-placeholder.svg`;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return `${BACKEND_URL}${imagePath}`;
    return `${BACKEND_URL}/${imagePath}`;
  };

  // Obtener imagen principal del array de imagenes
  const mainImage = product.imagenes?.find(img => img.principal)?.url || product.imagen;
  const precioOriginal = Math.round(product.precio * 1.1);
  const descuento = Math.round(((precioOriginal - product.precio) / precioOriginal) * 100);
  const cuotaMensual = Math.round(product.precio / 3);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      alert2('Producto sin stock', 'error');
      return;
    }
    
    addToCart(product, quantity);
    
    alert2(`${quantity} ${product.nombre} agregado al carrito`, 'success');
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      alert2('Producto sin stock', 'error');
      return;
    }
    
    handleAddToCart();
    navigate('/checkout');
  };

  const handleRelatedClick = (productId: number | string) => {
    navigate(`/producto/${productId}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />
      
      <main className="contenedor">
        {/* Botón retroceso */}
        <Link to="/" className="btn-retroceso">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>

        <div className="detalle-contenedor">
          {/* IMAGEN DEL PRODUCTO */}
          <div className="detalle-imagen">
            <img 
              id="imagen-producto" 
              src={getImageUrl(mainImage)}
              alt={product.nombre}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${BACKEND_URL}/assets/product-placeholder.svg`;
              }}
            />
          </div>

          {/* INFO DEL PRODUCTO */}
          <div className="detalle-info">
            {/* Badge de urgencia */}
            <div className="detalle-sold-badge" id="sold-badge">
              🔥 {salesCount} vendidos esta semana
            </div>

            {/* Nombre */}
            <h1 className="detalle-nombre" id="nombre-producto">
              {product.nombre}
            </h1>

            {/* Rating */}
            <div className="detalle-rating">
              <span className="stars">★★★★★</span>
              <span className="reviews-count">(4.8/5 - 127 reseñas)</span>
            </div>

            {/* Precio */}
            <div className="detalle-precio-block">
              <div className="detalle-precio-original" id="precio-original">
                ${precioOriginal.toLocaleString('es-CO')}
              </div>
              
              <div className="detalle-precio-row">
                <div className="detalle-precio" id="precio-producto">
                  ${product.precio.toLocaleString('es-CO')}
                </div>
                <span className="detalle-descuento" id="descuento-badge">
                  -{descuento}%
                </span>
              </div>
              
              <div className="detalle-cuota" id="cuota-info">
                En 3x de ${cuotaMensual.toLocaleString('es-CO')} sin interés
              </div>
            </div>

            {/* Beneficios */}
            <div className="detalle-benefits">
              <p>✅ Envío gratis en compras mayores a $50.000</p>
              <p>✅ Devolución gratis en 30 días</p>
              <p>✅ Garantía de calidad</p>
            </div>

            {/* Stock */}
            <div className="detalle-stock">
              {product.stock === 0 ? (
                <div className="detalle-stock-disponible sin" id="stock-producto">
                  ❌ Sin stock disponible
                </div>
              ) : product.stock < 5 ? (
                <div className="detalle-stock-disponible bajo" id="stock-producto">
                  ⚠️ Solo {product.stock} disponible(s) - ¡Apúrate!
                </div>
              ) : (
                <div className="detalle-stock-disponible" id="stock-producto">
                  🟢 En stock — {product.stock} disponibles
                </div>
              )}
            </div>

            {/* Descripción */}
            <p className="detalle-descripcion" id="descripcion-producto">
              {product.descripcion || 'Producto de excelente calidad. Ideal para tus necesidades del hogar y abarrotes.'}
            </p>

            {/* Cantidad y acciones */}
            <div className="detalle-acciones">
              <div className="detalle-cantidad">
                <button 
                  type="button" 
                  onClick={handleDecrement}
                  disabled={product.stock === 0}
                >
                  −
                </button>
                <input 
                  type="number" 
                  id="cantidad-detalle" 
                  value={quantity}
                  min="1"
                  max={product.stock}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  disabled={product.stock === 0}
                />
                <button 
                  type="button" 
                  onClick={handleIncrement}
                  disabled={product.stock === 0}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de compra */}
            <div className="detalle-agregar">
              <button 
                className="btn-comprar-ahora"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Comprar ahora
              </button>
              <button 
                className="btn-agregar-carrito"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCTOS RELACIONADOS */}
        {relatedProducts.length > 0 && (
          <section className="seccion-relacionados" id="seccion-relacionados">
            <h3>Productos relacionados</h3>
            <div className="productos-grid-relacionados" id="productos-relacionados">
              {relatedProducts.map(p => (
                <div 
                  key={p.id}
                  className="tarjeta-producto-mini" 
                  onClick={() => handleRelatedClick(p.id)}
                >
                  <div className="tarjeta-producto-mini-imagen">
                    <img 
                      src={getImageUrl(p.imagen)} 
                      alt={p.nombre}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `${BACKEND_URL}/assets/product-placeholder.svg`;
                      }}
                    />
                  </div>
                  <div className="tarjeta-producto-mini-info">
                    <div className="tarjeta-producto-mini-nombre">{p.nombre}</div>
                    <div className="tarjeta-producto-mini-precio">
                      ${p.precio.toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
