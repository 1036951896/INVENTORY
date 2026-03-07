
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto } from './dto/order.dto';
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
        estado: "PENDIENTE",
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
                nombre: true,                imagenes: {
                  where: { principal: true },
                  take: 1,
                  select: { url: true }
                }              },
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
    const adminMsg = `Hola Administrador,\n\nSe ha recibido un nuevo pedido (${order.numero}) de ${(order as any).usuario.nombre} (${(order as any).usuario.telefono || 'sin teléfono'}). Por favor, ingrese al panel para revisarlo.`;
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
                imagenes: {
                  where: { principal: true },
                  take: 1,
                  select: { url: true }
                }
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
                imagenes: {
                  where: { principal: true },
                  take: 1,
                  select: { url: true }
                }
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

    if (updateStatusDto.estado === "ENTREGADO") {
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
    if (updated.estado === "EN_PREPARACION" || updated.estado === "ENTREGADO") {
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

    if (order.estado === "ENTREGADO") {
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
      data: { estado: "CANCELADO" },
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

  async getStatistics() {
    try {
      // Cambiar a traer TODOS los datos sin filtro de fecha
      // const thirtyDaysAgo = new Date();
      // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Total metrics
      const totalOrders = await this.prisma.order.count();
      const totalRevenue = await this.prisma.order.aggregate({
        _sum: { total: true },
      });
      const completedOrders = await this.prisma.order.count({
        where: { estado: 'ENTREGADO' },
      });
      const pendingOrders = await this.prisma.order.count({
        where: { estado: 'PENDIENTE' },
      });

      // Sales by day (ALL DATA - sin filtro de fecha)
      let ordersByDay: any[] = [];
      try {
        ordersByDay = (await this.prisma.$queryRaw`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as orders,
            COALESCE(SUM(total), 0) as total
          FROM "Order"
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        `) as any[];
      } catch (err) {
        this.logger.warn('Error fetching ordersByDay:', err);
        ordersByDay = [];
      }

      // Sales by category (last 30 days)
      let salesByCategory: any[] = [];
      try {
        salesByCategory = (await this.prisma.$queryRaw`
          SELECT 
            c.nombre as category,
            COUNT(DISTINCT o.id) as orders,
            COUNT(oi.id) as items,
            COALESCE(SUM(oi.subtotal), 0) as total
          FROM "Order" o
          JOIN "OrderItem" oi ON o.id = oi.order_id
          JOIN "Product" p ON oi.product_id = p.id
          JOIN "Category" c ON p.category_id = c.id
          GROUP BY c.id, c.nombre
          ORDER BY total DESC
        `) as any[];
      } catch (err) {
        this.logger.warn('Error fetching salesByCategory:', err);
        salesByCategory = [];
      }

      // Top customers (last 30 days)
      let topCustomers: any[] = [];
      try {
        topCustomers = (await this.prisma.$queryRaw`
          SELECT 
            u.id,
            u.nombre,
            u.email,
            COUNT(o.id) as orders,
            COALESCE(SUM(o.total), 0) as total
          FROM "User" u
          LEFT JOIN "Order" o ON u.id = o.usuario_id
          GROUP BY u.id, u.nombre, u.email
          HAVING COUNT(o.id) > 0
          ORDER BY total DESC
          LIMIT 10
        `) as any[];
      } catch (err) {
        this.logger.warn('Error fetching topCustomers:', err);
        topCustomers = [];
      }

      // Top products (ALL DATA - sin filtro de fecha)
      let topProducts: any[] = [];
      try {
        topProducts = (await this.prisma.$queryRaw`
          SELECT 
            p.id,
            p.nombre,
            p.precio,
            COUNT(oi.id) as cantidad_vendida,
            SUM(oi.cantidad) as total_unidades,
            COALESCE(SUM(oi.cantidad * oi.precio_unitario), 0) as total_ingresos
          FROM "Product" p
          LEFT JOIN "OrderItem" oi ON p.id = oi.producto_id
          LEFT JOIN "Order" o ON oi.order_id = o.id
          GROUP BY p.id, p.nombre, p.precio
          HAVING COUNT(oi.id) > 0
          ORDER BY total_unidades DESC
          LIMIT 10
        `) as any[];
      } catch (err) {
        this.logger.warn('Error fetching topProducts:', err);
        topProducts = [];
      }

      // Order status breakdown
      let statusBreakdown: any[] = [];
      try {
        const breakdown = await this.prisma.order.groupBy({
          by: ['estado'],
          _count: {
            id: true,
          },
        });
        statusBreakdown = breakdown as any[];
      } catch (err) {
        this.logger.warn('Error fetching statusBreakdown:', err);
        statusBreakdown = [];
      }

      return {
        summary: {
          totalOrders,
          totalRevenue: totalRevenue._sum.total || 0,
          completedOrders,
          pendingOrders,
          completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
        },
        salesByDay: ordersByDay,
        salesByCategory: salesByCategory,
        topCustomers: topCustomers,
        topProducts: topProducts,
        statusBreakdown: statusBreakdown.map((status: any) => ({
          status: status.estado,
          count: status._count.id,
        })),
      };
    } catch (err) {
      this.logger.error('Error in getStatistics:', err);
      // Return empty statistics on error
      return {
        summary: {
          totalOrders: 0,
          totalRevenue: 0,
          completedOrders: 0,
          pendingOrders: 0,
          completionRate: 0,
        },
        salesByDay: [],
        salesByCategory: [],
        topCustomers: [],
        statusBreakdown: [],
      };
    }
  }
}
