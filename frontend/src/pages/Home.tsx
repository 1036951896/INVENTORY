import { useState } from 'react';
import Header from '../components/Header';
import Categories from '../components/Categories';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import CartPanel from '../components/CartPanel';
import { mockProducts } from '../data/mockProducts';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [products] = useState(mockProducts);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(!isCartOpen)} />
      <Categories 
        products={products} 
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCategory}
      />
      <Hero />
      <ProductGrid activeCategory={activeCategory} />
      <Footer />
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
