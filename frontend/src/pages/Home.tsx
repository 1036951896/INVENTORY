import { useState } from 'react';
import Header from '../components/Header';
import Categories from '../components/Categories';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import CartPanel from '../components/CartPanel';
import MobileMenu from '../components/MobileMenu';
import type { Product } from '../types';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [categories, setCategories] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleProductsLoaded = (products: Product[]) => {
    const cats = Array.from(
      new Set(products
        .filter(p => p.precio > 0 && p.categoria && p.categoria.trim())
        .map(p => p.categoria))
    ).sort() as string[];
    setCategories(cats);
  };

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
        products={categories.map(c => ({ categoria: c } as any))}
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
      <ProductGrid activeCategory={activeCategory} onProductsLoaded={handleProductsLoaded} />
      <Footer />
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
