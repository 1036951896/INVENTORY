import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { alert2 } from '../../utils/notifications';
import './admin-users.css';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
  activo: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await fetch(`${VITE_API_URL}/api/v1/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al cargar usuarios');

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (user: User) => {
    if (!newRole || newRole === user.rol) {
      alert2('Selecciona un rol diferente', 'info');
      return;
    }

    setUpdatingId(user.id);

    try {
      const token = authService.getToken();

      const response = await fetch(`${VITE_API_URL}/api/v1/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rol: newRole })
      });

      if (!response.ok) throw new Error('Error al actualizar rol');

      alert2('Rol actualizado correctamente', 'success');
      setShowModal(false);
      setSelectedUser(null);
      setNewRole('');
      fetchUsers();
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al actualizar rol', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleActive = async (user: User) => {
    setUpdatingId(user.id);

    try {
      const token = authService.getToken();

      const response = await fetch(`${VITE_API_URL}/api/v1/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activo: !user.activo })
      });

      if (!response.ok) throw new Error('Error al actualizar estado');

      alert2(
        user.activo ? 'Usuario desactivado' : 'Usuario activado',
        'success'
      );
      fetchUsers();
    } catch (error: any) {
      console.error('Error:', error);
      alert2(error.message || 'Error al actualizar estado', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrar usuarios por búsqueda, rol y estado
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.rol === filterRole;
    const matchesStatus = !filterStatus || (filterStatus === 'activo' ? user.activo : !user.activo);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      alert2('No hay usuarios para exportar', 'info');
      return;
    }

    const headers = ['Nombre', 'Email', 'Teléfono', 'Rol', 'Estado', 'Fecha Creación'];
    const rows = filteredUsers.map(user => [
      user.nombre,
      user.email,
      user.telefono || '-',
      user.rol,
      user.activo ? 'Activo' : 'Inactivo',
      new Date(user.createdAt).toLocaleDateString('es-CO')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `usuarios-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert2('Usuarios exportados correctamente', 'success');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterStatus('');
  };

  const getStatusBadgeClass = (activo: boolean) => {
    return activo ? 'status-active' : 'status-inactive';
  };

  const getRoleBadgeClass = (rol: string) => {
    return rol === 'ADMIN' ? 'role-admin' : 'role-cliente';
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <div className="header-info">
          <div className="module-badge">Acceso</div>
          <h1>Gestión de Usuarios</h1>
          <p>Administra clientes y permisos del sistema</p>
        </div>
        <span className="users-count">Total: {filteredUsers.length}</span>
      </div>

      {/* FILTROS AVANZADOS */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-item">
            <label htmlFor="search">Buscar:</label>
            <input
              id="search"
              type="text"
              placeholder="Nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <label htmlFor="role">Rol:</label>
            <select 
              id="role"
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="CLIENTE">Cliente</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="status">Estado:</label>
            <select 
              id="status"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="btn-filter-reset" 
            onClick={resetFilters}
          >
            Limpiar filtros
          </button>
          <button 
            className="btn-export" 
            onClick={handleExportCSV}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="users-table-wrapper">
        {loading ? (
          <div className="users-loading">
            <div className="loading-spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-empty">
            <p>No hay usuarios para mostrar</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={!user.activo ? 'inactive-row' : ''}>
                  <td className="name">{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.telefono || '-'}</td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(user.rol)}`}>
                      {user.rol === 'ADMIN' ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          Admin
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          Cliente
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(user.activo)}`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="date">
                    {new Date(user.createdAt).toLocaleDateString('es-CO')}
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-action cambiar"
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.rol);
                        setShowModal(true);
                      }}
                      title="Cambiar rol"
                      disabled={updatingId === user.id}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1 .12-8.83"></path>
                      </svg>
                    </button>
                    <button 
                      className={`btn-action ${user.activo ? 'desactivar' : 'activar'}`}
                      onClick={() => handleToggleActive(user)}
                      title={user.activo ? 'Desactivar' : 'Activar'}
                      disabled={updatingId === user.id}
                    >
                      {user.activo ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 9.2 1"></path>
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL CAMBIAR ROL */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cambiar Rol de Usuario</h2>
              <button 
                className="btn-close" 
                onClick={() => setShowModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="user-info">
                <div className="info-item">
                  <label>Nombre:</label>
                  <span>{selectedUser.nombre}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="info-item">
                  <label>Rol Actual:</label>
                  <span className={`role-badge ${getRoleBadgeClass(selectedUser.rol)}`}>
                    {selectedUser.rol}
                  </span>
                </div>
              </div>

              <div className="role-section">
                <label htmlFor="role-select">Nuevo Rol:</label>
                <select 
                  id="role-select"
                  value={newRole} 
                  onChange={(e) => setNewRole(e.target.value)}
                  className="role-select"
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="CLIENTE">Cliente</option>
                </select>
              </div>

              <div className="warning" style={{ display: newRole !== selectedUser.rol ? 'block' : 'none' }}>
                Este cambio asignará nuevos permisos al usuario
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowModal(false)}
                disabled={updatingId === selectedUser.id}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => handleChangeRole(selectedUser)}
                disabled={updatingId === selectedUser.id}
              >
                {updatingId === selectedUser.id ? 'Procesando...' : 'Actualizar Rol'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
