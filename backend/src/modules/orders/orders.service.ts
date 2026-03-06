
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(usuarioId: string, createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('La orden debe contener al menos un item');
    }

    // Validate that address belongs to user
    const address = await this.prisma.address.findUnique({
      where: { id: createOrderDto.direccionId },
    });

    if (!address || address.usuarioId !== usuarioId) {
      throw new BadRequestException('Dirección no válida o no pertenece al usuario');
    }

    // Validate products and stock
    let total = 0;
    for (const item of createOrderDto.items) {
      this.logger.debug(`Buscando producto con ID: "${item.productoId}"`);
      const product = await this.prisma.product.findUnique({
        where: { id: item.productoId },
      });

      if (!product) {
        this.logger.error(`Producto NO ENCONTRADO: ${item.productoId}`);
        throw new NotFoundException(`Producto con ID ${item.productoId} no encontrado`);
      }

      this.logger.debug(`Producto encontrado: ${product.nombre}`);
      if (product.stock < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para el producto "${product.nombre}". Disponible: ${product.stock}`,
        );
      }

      total += item.precioUnitario * item.cantidad;
    }

    // Generate order number
    const numero = `PED-${Date.now()}`;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        numero,
        total,
        estado: OrderStatus.PENDIENTE,
        usuarioId,
        direccionId: createOrderDto.direccionId,
        notasEntrega: createOrderDto.notasEntrega,
        items: {
          create: createOrderDto.items.map(item => ({
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.precioUnitario * item.cantidad,
            productoId: item.productoId,
          })),
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
        direccion: {
          select: {
            id: true,
            calle: true,
            numero: true,
            apartamento: true,
            ciudad: true,
            departamento: true,
            pais: true,
          },
        },
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    // Update stock for each product and register stock movement
    for (const item of createOrderDto.items) {
      await this.prisma.product.update({
        where: { id: item.productoId },
        data: {
          stock: {
            decrement: item.cantidad,
          },
        },
      });

      // Register stock movement
      await this.prisma.stockMovement.create({
        data: {
          tipo: 'SALIDA',
          cantidad: item.cantidad,
          razon: `Venta - Pedido ${numero}`,
          referencia: numero,
          productoId: item.productoId,
        },
      });
    }

    // Enviar WhatsApp al admin (número de prueba)
    const adminPhone = '573116579677'; // Número de prueba solicitado
    const adminMsg = `Hola Administrador,\n\nSe ha recibido un nuevo pedido (${order.numero}) de ${order.usuario.nombre} (${order.usuario.telefono || 'sin teléfono'}). Por favor, ingrese al panel para revisarlo.`;
    try {
      await this.notificationsService.sendWhatsAppMessage(adminPhone, adminMsg, 'ADMIN');
    } catch (err) {
      this.logger.error('Error enviando notificación WhatsApp al admin', err);
    }

    return this.formatOrderResponse(order);
  }

  async findAll(usuarioId?: string) {
    const where = usuarioId ? { usuarioId } : {};

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        direccion: {
          select: {
            id: true,
            calle: true,
            numero: true,
            apartamento: true,
            ciudad: true,
            departamento: true,
            pais: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => this.formatOrderResponse(order));
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        direccion: {
          select: {
            id: true,
            calle: true,
            numero: true,
            apartamento: true,
            ciudad: true,
            departamento: true,
            pais: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return this.formatOrderResponse(order);
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    let updateData: any = { estado: updateStatusDto.estado };
    
    if (updateStatusDto.notasEntrega) {
      updateData.notasEntrega = updateStatusDto.notasEntrega;
    }

    if (updateStatusDto.estado === OrderStatus.ENTREGADO) {
      updateData.entregaEn = new Date();
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        direccion: {
          select: {
            id: true,
            calle: true,
            numero: true,
            apartamento: true,
            ciudad: true,
            departamento: true,
            pais: true,
          },
        },
      },
    });

    // Si el pedido fue aprobado (por ejemplo, estado pasa a EN_PREPARACION o ENTREGADO), notificar al cliente
    if (updated.estado === OrderStatus.EN_PREPARACION || updated.estado === OrderStatus.ENTREGADO) {
      const clientePhone = updated.usuario.telefono;
      if (clientePhone) {
        const clienteMsg = `Estimado/a ${updated.usuario.nombre},\n\nNos complace informarle que su pedido (${updated.numero}) ha sido aprobado y será entregado en los próximos días.\nAgradecemos su confianza y preferencia.\n\nAtentamente, Distribuidora Inventory`;
        try {
          await this.notificationsService.sendWhatsAppMessage(clientePhone, clienteMsg, 'CLIENTE');
        } catch (err) {
          this.logger.error('Error enviando notificación WhatsApp al cliente', err);
        }
      }
    }

    return this.formatOrderResponse(updated);
  }

  async cancel(id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    if (order.estado === OrderStatus.ENTREGADO) {
      throw new BadRequestException('No se puede cancelar una orden entregada');
    }

    // Restore stock
    for (const item of order.items) {
      await this.prisma.product.update({
        where: { id: item.productoId },
        data: {
          stock: {
            increment: item.cantidad,
          },
        },
      });
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { estado: OrderStatus.CANCELADO },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        direccion: {
          select: {
            id: true,
            calle: true,
            numero: true,
            apartamento: true,
            ciudad: true,
            departamento: true,
            pais: true,
          },
        },
      },
    });

    return this.formatOrderResponse(updated);
  }

  private formatOrderResponse(order: any): OrderResponseDto {
    return {
      id: order.id,
      numero: order.numero,
      total: order.total,
      estado: order.estado,
      notasEntrega: order.notasEntrega,
      entregaEn: order.entregaEn,
      usuario: order.usuario,
      direccion: order.direccion,
      items: order.items,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
