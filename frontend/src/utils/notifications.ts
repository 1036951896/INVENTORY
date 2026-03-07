/**
 * Sistema de notificaciones personalizado (migrado de alert2)
 * Compatible con tu función alert2 original
 */

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export function alert2(message: string, type: NotificationType = 'info'): void {
  const iconos = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colores = {
    success: '#27AE60',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB'
  };

  const icon = iconos[type];
  const color = colores[type];

  // Agregar estilos de animación si no existen
  if (!document.getElementById('alert2-styles')) {
    const estilo = document.createElement('style');
    estilo.id = 'alert2-styles';
    estilo.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }
    `;
    document.head.appendChild(estilo);
  }

  const contenedor = document.createElement('div');
  contenedor.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${color};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
    z-index: 99999;
    animation: slideInRight 0.4s ease-out;
    max-width: 320px;
    font-size: 0.95rem;
    line-height: 1.4;
    font-weight: 500;
  `;
  contenedor.textContent = icon + ' ' + message;
  document.body.appendChild(contenedor);

  setTimeout(() => {
    contenedor.style.animation = 'slideOutRight 0.3s ease-in forwards';
    setTimeout(() => contenedor.remove(), 300);
  }, 4000);
}

// Exportar también como funciones específicas
export const showSuccess = (message: string) => alert2(message, 'success');
export const showError = (message: string) => alert2(message, 'error');
export const showWarning = (message: string) => alert2(message, 'warning');
export const showInfo = (message: string) => alert2(message, 'info');
