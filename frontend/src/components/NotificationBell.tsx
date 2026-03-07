import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.ts';
import './notification-bell.css';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  leida: boolean;
  categoria: 'PEDIDO' | 'PRODUCTO' | 'USUARIO' | 'REPORTE' | 'GENERAL';
}

interface NotificationResponse {
  total: number;
  unreadCount: number;
  notifications: Notification[];
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener notificaciones
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get<NotificationResponse>('/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marcar como leída
  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, leida: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, leida: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Polling para nuevas notificaciones (cada 10 segundos)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryLabel = (categoria: string): string => {
    const labels: Record<string, string> = {
      PEDIDO: 'Pedido',
      PRODUCTO: 'Producto',
      USUARIO: 'Usuario',
      REPORTE: 'Reporte',
      GENERAL: 'General',
    };
    return labels[categoria] || categoria;
  };

  const formatTime = (timestamp: Date): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'hace unos segundos';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        className="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Notificaciones"
        aria-label="Notificaciones"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={markAllAsRead}
                title="Marcar todas como leídas"
              >
                Marcar como leído
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading && <div className="notification-loading">Cargando...</div>}

            {!loading && notifications.length === 0 && (
              <div className="notification-empty">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                <p>Sin notificaciones</p>
              </div>
            )}

            {!loading && notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.leida ? 'unread' : ''}`}
                onClick={() => !notification.leida && markAsRead(notification.id)}
              >
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-meta">
                    <span className="notification-category">
                      {getCategoryLabel(notification.categoria)}
                    </span>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
                {!notification.leida && <div className="notification-unread-dot"></div>}
              </div>
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <small>{notifications.length} notificación{notifications.length !== 1 ? 'es' : ''}</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
