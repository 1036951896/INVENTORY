import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Categories from '../components/Categories';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import CartPanel from '../components/CartPanel';
import MobileMenu from '../components/MobileMenu';
import { mockProducts } from '../data/mockProducts';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [products] = useState(mockProducts);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Extraer categorías únicas de los productos
  const categories = Array.from(
    new Set(products
      .map(p => p.categoria)
      .filter(c => c && c.trim()))
  ).sort() as string[];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Limpiar búsqueda al cambiar categoría
    localStorage.removeItem('searchTerm');
  };

  return (
    <>
      <Header 
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        onHamburguesaClick={() => setIsMobileMenuOpen(true)}
      />
      <Categories 
        products={products} 
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCategory}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      <Hero />
      <ProductGrid activeCategory={activeCategory} />
      <Footer />
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
