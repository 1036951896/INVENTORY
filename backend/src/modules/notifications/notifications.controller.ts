import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /notifications/unread
   * Obtener notificaciones no leídas para el administrador
   */
  @Get('unread')
  @UseGuards(AuthGuard('jwt'))
  async getUnreadNotifications(@Request() req: any) {
    // Solo admins pueden ver notificaciones
    if (req.user.rol !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden ver notificaciones');
    }

    const notifications = this.notificationsService.getUnreadNotifications();
    return {
      count: notifications.length,
      notifications,
    };
  }

  /**
   * GET /notifications
   * Obtener notificaciones recientes
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getRecentNotifications(@Request() req: any) {
    // Solo admins pueden ver notificaciones
    if (req.user.rol !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden ver notificaciones');
    }

    const notifications = this.notificationsService.getRecentNotifications();
    const unreadCount = this.notificationsService.getUnreadNotifications().length;
    
    return {
      total: notifications.length,
      unreadCount,
      notifications,
    };
  }

  /**
   * PATCH /notifications/:id/read
   * Marcar una notificación como leída
   */
  @Patch(':id/read')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Request() req: any, @Param('id') notificationId: string) {
    // Solo admins pueden marcar notificaciones
    if (req.user.rol !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden marcar notificaciones');
    }

    if (!notificationId) {
      throw new BadRequestException('ID de notificación requerido');
    }

    const notification = this.notificationsService.markAsRead(notificationId);
    
    if (!notification) {
      throw new BadRequestException('Notificación no encontrada');
    }

    return {
      success: true,
      message: 'Notificación marcada como leída',
      notification,
    };
  }

  /**
   * PATCH /notifications/read-all
   * Marcar todas las notificaciones como leídas
   */
  @Patch('read-all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Request() req: any) {
    // Solo admins pueden marcar notificaciones
    if (req.user.rol !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden marcar notificaciones');
    }

    this.notificationsService.markAllAsRead();

    return {
      success: true,
      message: 'Todas las notificaciones marcadas como leídas',
    };
  }
}
