import { useState, useEffect } from 'react';
import type { Product } from '../types';

interface CategoriesProps {
  products: Product[];
  onCategoryChange: (category: string) => void;
  activeCategory: string;
  showMobile?: boolean;
}

export default function Categories({ products, onCategoryChange, activeCategory, showMobile = false }: CategoriesProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Extraer categorías únicas de los productos
    const uniqueCategories = new Set<string>();
    products.forEach(product => {
      if (product.categoria && product.categoria.trim()) {
        uniqueCategories.add(product.categoria.trim());
      }
    });

    // Convertir a array y ordenar
    const categoriesArray = Array.from(uniqueCategories).sort();
    setCategories(categoriesArray);
  }, [products]);

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    onCategoryChange(category);
  };

  return (
    <section className={`categorias-seccion ${showMobile ? 'mostrar-mobile' : ''}`}>
      <div className="categorias">
        <div className="contenedor-filtros">
          <div className="categorias-lista" id="categorias-lista">
            {/* Botón "Todas" */}
            <a 
              href="#" 
              className={`categoria ${activeCategory === 'todas' ? 'activo' : ''}`}
              data-categoria="todas"
              onClick={(e) => handleCategoryClick('todas', e)}
            >
              <svg className="icono-categoria" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5h2v2H3zm4 0h14v2H7zm0 4h14v2H7zm0 4h14v2H7zm0 4h14v2H7zM3 9h2v2H3zm0 4h2v2H3zm0 4h2v2H3z"/>
              </svg>
              <span>Todas</span>
            </a>

            {/* Categorías dinámicas */}
            {categories.map((category) => (
              <a
                key={category}
                href="#"
                className={`categoria ${activeCategory === category ? 'activo' : ''}`}
                data-categoria={category}
                onClick={(e) => handleCategoryClick(category, e)}
              >
                <svg className="icono-categoria" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                </svg>
                <span>{category}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
