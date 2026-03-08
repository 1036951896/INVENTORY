import { useEffect } from 'react';
import './mobile-menu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onCategoryChange,
}: MobileMenuProps) {
  // Cerrar menú cuando se hace click fuera
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menu = document.querySelector('.mobile-menu');
      const backdrop = document.querySelector('.mobile-menu-backdrop');
      
      if (backdrop?.contains(target) && !menu?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="mobile-menu-backdrop" />}
      
      {/* Menú drawer */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Categorías</h3>
          <button 
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <div className="mobile-menu-content">
          {/* Todas las categorías */}
          <button
            className={`mobile-menu-item ${activeCategory === 'todas' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('todas')}
          >
            <span>Todas las categorías</span>
          </button>

          {/* Categorías individuales */}
          {categories.map((category) => (
            <button
              key={category}
              className={`mobile-menu-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
