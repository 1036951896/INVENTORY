import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { alert2 } from '../../utils/notifications';
import './admin-categories.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${VITE_API_URL}/api/v1/categories`);
      const data = response.ok ? await response.json() : [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al cargar categorías', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nombre) {
      alert2('El nombre es requerido', 'info');
      return;
    }

    try {
      const token = authService.getToken();
      const url = editingId 
        ? `${VITE_API_URL}/api/v1/categories/${editingId}`
        : `${VITE_API_URL}/api/v1/categories`;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar');

      alert2(editingId ? 'Categoría actualizada' : 'Categoría creada', 'success');
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: '', descripcion: '' });
      fetchCategories();
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return;

    try {
      const token = authService.getToken();
      const response = await fetch(`${VITE_API_URL}/api/v1/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al eliminar');

      alert2('Categoría eliminada', 'success');
      fetchCategories();
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message, 'error');
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || ''
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nombre: '', descripcion: '' });
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase().trim();
    
    // Condimentos - Frasco con especias
    if (name.includes('condimen')) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          {/* Frasco */}
          <path d="M7 4h10v2H7V4zm2-2h6v2H9V2z" fill="currentColor"/>
          <rect x="6" y="6" width="12" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Granos de especias dentro */}
          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="14" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="14" r="1" fill="currentColor"/>
          <circle cx="8" cy="15" r="1" fill="currentColor"/>
        </svg>
      );
    }
    
    // Empaques - Caja abierta
    if (name.includes('empaqu')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          {/* Caja abierta */}
          <path d="M3 8l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
          <path d="M12 2v6M3 8l9 6 9-6"/>
          {/* Línea de apertura */}
          <path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"/>
        </svg>
      );
    }
    
    // Maíz - Elote/Mazorca
    if (name.includes('maíz') || name.includes('maiz')) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          {/* Mazorca */}
          <rect x="9" y="4" width="6" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          {/* Granos */}
          <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
          <circle cx="13" cy="7" r="1.2" fill="currentColor"/>
          <circle cx="11" cy="10" r="1.2" fill="currentColor"/>
          <circle cx="13" cy="10" r="1.2" fill="currentColor"/>
          <circle cx="11" cy="13" r="1.2" fill="currentColor"/>
          <circle cx="13" cy="13" r="1.2" fill="currentColor"/>
          {/* Tallo/hojas */}
          <path d="M9 16c-1-1-2-2-2-4M15 16c1-1 2-2 2-4"/>
        </svg>
      );
    }
    
    // Ríos (Arroz) - Grano de arroz
    if (name.includes('río') || name.includes('rio') || name.includes('arroz')) {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          {/* Granos de arroz */}
          <ellipse cx="8" cy="9" rx="2" ry="4" fill="currentColor" opacity="0.8"/>
          <ellipse cx="12" cy="6" rx="2" ry="4" fill="currentColor" opacity="0.9"/>
          <ellipse cx="16" cy="9" rx="2" ry="4" fill="currentColor" opacity="0.8"/>
          <ellipse cx="10" cy="14" rx="2" ry="4" fill="currentColor" opacity="0.85"/>
          <ellipse cx="14" cy="14" rx="2" ry="4" fill="currentColor" opacity="0.85"/>
          {/* Línea decorativa */}
          <path d="M4 18h16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      );
    }
    
    // Snacks - Bolsa de papas/snacks
    if (name.includes('snack')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          {/* Forma de bolsa ondulada */}
          <path d="M4 4c0 0 1 4 2 6s3 4 4 5c1 1 3 3 4 3s3-2 4-3c1-1 3-3 4-5s2-6 2-6"/>
          <path d="M4 4l2 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l2-14"/>
          {/* Puntos para representar papas dentro */}
          <circle cx="8" cy="10" r="0.8" fill="currentColor"/>
          <circle cx="12" cy="8" r="0.8" fill="currentColor"/>
          <circle cx="16" cy="10" r="0.8" fill="currentColor"/>
          <circle cx="10" cy="14" r="0.8" fill="currentColor"/>
          <circle cx="14" cy="14" r="0.8" fill="currentColor"/>
        </svg>
      );
    }
    
    // Icono por defecto - Caja genérica
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 3v18"/>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div className="header-info">
          <div className="module-badge">Organización</div>
          <h1>Gestión de Categorías</h1>
          <p>Organiza los productos en categorías</p>
        </div>
        <button 
          className="btn-nueva-categoria"
          onClick={() => setShowForm(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Nueva Categoría
        </button>
      </div>

      <div className="categories-table-wrapper">
        {categories.length === 0 ? (
          <div className="categories-empty">
            <p>No hay categorías. Crea la primera!</p>
          </div>
        ) : (
          <table className="categories-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="name">
                    <span className="category-icon">{getCategoryIcon(category.nombre)}</span>
                    <span className="category-badge">{category.nombre}</span>
                  </td>
                  <td className="description">{category.descripcion || '-'}</td>
                  <td className="products-count">-</td>
                  <td className="actions">
                    <button 
                      className="btn-action edit"
                      onClick={() => handleEdit(category)}
                      title="Editar"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M3 17.25V21h3.75L17.81 9.94m-6.75-6.75l2.5-2.5a2 2 0 0 1 2.83 0l2.5 2.5a2 2 0 0 1 0 2.83l-2.5 2.5"/>
                      </svg>
                    </button>
                    <button 
                      className="btn-action delete"
                      onClick={() => handleDelete(category.id)}
                      title="Eliminar"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M10 5h4a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button className="btn-close" onClick={handleCancel}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Nombre de la categoría"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Descripción (opcional)"
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
