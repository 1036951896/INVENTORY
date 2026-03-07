
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

      // Sales by day - traer TODOS y agrupar en JS
      let ordersByDay: any[] = [];
      try {
        // Traer todas las órdenes sin agrupar
        const allOrders = await this.prisma.order.findMany({
          select: {
            createdAt: true,
            total: true,
          }
        });
        
        // Agrupar por fecha en JavaScript
        const groupedByDate: { [key: string]: { orders: number; total: number } } = {};
        allOrders.forEach(order => {
          const dateStr = order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'Unknown';
          if (!groupedByDate[dateStr]) {
            groupedByDate[dateStr] = { orders: 0, total: 0 };
          }
          groupedByDate[dateStr].orders += 1;
          groupedByDate[dateStr].total += order.total || 0;
        });
        
        // Convertir a array y ordenar
        ordersByDay = Object.entries(groupedByDate)
          .map(([date, data]) => ({
            date,
            orders: data.orders,
            total: data.total
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } catch (err) {
        this.logger.warn('Error fetching ordersByDay:', err);
        ordersByDay = [];
      }

      // Sales by category 
      let salesByCategory: any[] = [];
      try {
        const orderItems = await this.prisma.orderItem.findMany({
          include: {
            producto: {
              include: {
                categoria: true
              }
            }
          }
        });

        const groupedByCategory: { [key: string]: { category: string; orders: Set<string>; items: number; total: number } } = {};
        
        orderItems.forEach(item => {
          const categoryName = item.producto?.categoria?.nombre || 'Sin categoría';
          if (!groupedByCategory[categoryName]) {
            groupedByCategory[categoryName] = { 
              category: categoryName, 
              orders: new Set(), 
              items: 0, 
              total: 0 
            };
          }
          groupedByCategory[categoryName].orders.add(item.ordenId);
          groupedByCategory[categoryName].items += 1;
          groupedByCategory[categoryName].total += item.subtotal || 0;
        });

        salesByCategory = Object.values(groupedByCategory)
          .map(data => ({
            category: data.category,
            orders: data.orders.size,
            items: data.items,
            total: data.total
          }))
          .sort((a, b) => b.total - a.total);
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

      // Top products (ALL DATA)
      let topProducts: any[] = [];
      try {
        const orderItems = await this.prisma.orderItem.findMany({
          include: {
            producto: true
          }
        });

        const productMap: { [key: string]: { id: string; nombre: string; precio: number; cantidad_vendida: number; total_unidades: number; total_ingresos: number } } = {};
        
        orderItems.forEach(item => {
          if (!item.producto) return;
          const prodId = item.producto.id;
          if (!productMap[prodId]) {
            productMap[prodId] = {
              id: prodId,
              nombre: item.producto.nombre,
              precio: item.producto.precio,
              cantidad_vendida: 0,
              total_unidades: 0,
              total_ingresos: 0
            };
          }
          productMap[prodId].cantidad_vendida += 1;
          productMap[prodId].total_unidades += item.cantidad || 0;
          productMap[prodId].total_ingresos += (item.cantidad || 0) * (item.precioUnitario || 0);
        });

        topProducts = Object.values(productMap)
          .filter(p => p.cantidad_vendida > 0)
          .sort((a, b) => b.total_unidades - a.total_unidades)
          .slice(0, 10);
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
