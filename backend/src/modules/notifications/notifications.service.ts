import { Injectable, Logger } from '@nestjs/common';

interface NotificationLog {
  id: string;
  phone: string;
  message: string;
  url: string;
  timestamp: Date;
  tipo: 'ADMIN' | 'CLIENTE';
  estado: 'GENERADA' | 'ENVIADA' | 'PENDIENTE';
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notificationHistory: NotificationLog[] = [];

  /**
   * Enviar mensaje WhatsApp
   * Nota: wa.me es solo para abrir el chat manualmente.
   * Para envío automático, se requiere integrar un proveedor como:
   * - Twilio (requiere credenciales y API Key)
   * - Chat-API (requiere credenciales y API Key)
   * - WhatsApp Business API (requiere configuración avanzada y verificación)
   * 
   * Por ahora, generamos el enlace y lo registramos para que el admin lo use manualmente.
   * 
   * TODO: Integrar con Twilio o similar para envío automático
   */
  async sendWhatsAppMessage(
    phone: string,
    message: string,
    tipo: 'ADMIN' | 'CLIENTE' = 'CLIENTE',
  ): Promise<string> {
    // Limpiar número de teléfono
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Generar URL de WhatsApp
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Crear registro en el historial
    const notification: NotificationLog = {
      id: `notif-${Date.now()}`,
      phone: cleanPhone,
      message,
      url,
      timestamp: new Date(),
      tipo,
      estado: 'GENERADA',
    };

    this.notificationHistory.push(notification);

    // Registrar en logs del servidor con información detallada
    this.logger.log(`📱 MENSAJE WHATSAPP GENERADO`);
    this.logger.log(`   ID: ${notification.id}`);
    this.logger.log(`   Tipo: ${tipo}`);
    this.logger.log(`   Teléfono: +${cleanPhone}`);
    this.logger.log(`   Mensaje: ${message.substring(0, 100)}...`);
    this.logger.log(`   URL: ${url}`);
    this.logger.log(`   Timestamp: ${notification.timestamp.toISOString()}`);
    this.logger.log(`   📌 Para usar: Abre el enlace en el navegador`);
    
    return url;
  }

  /**
   * Obtener historial de notificaciones
   */
  getNotificationHistory(tipo?: 'ADMIN' | 'CLIENTE', limit: number = 50): NotificationLog[] {
    let history = this.notificationHistory;

    if (tipo) {
      history = history.filter(n => n.tipo === tipo);
    }

    return history.slice(-limit).reverse();
  }

  /**
   * Obtener estadísticas de notificaciones
   */
  getNotificationStats() {
    return {
      total: this.notificationHistory.length,
      admin: this.notificationHistory.filter(n => n.tipo === 'ADMIN').length,
      cliente: this.notificationHistory.filter(n => n.tipo === 'CLIENTE').length,
      ultimaNotificacion: this.notificationHistory.length > 0 
        ? this.notificationHistory[this.notificationHistory.length - 1].timestamp 
        : null,
    };
  }
}
