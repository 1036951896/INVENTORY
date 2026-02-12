import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener o crear carrito del usuario
   */
  async obtenerOCrearCarrito(usuarioId: string) {
    let carrito = await this.prisma.cart.findUnique({
      where: { usuarioId },
      include: {
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                precio: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!carrito) {
      carrito = await this.prisma.cart.create({
        data: { usuarioId },
        include: {
          items: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
                  stock: true,
                },
              },
            },
          },
        },
      });
    }

    return this.formatearCarrito(carrito);
  }

  /**
   * Agregar producto al carrito
   */
  async agregarProducto(usuarioId: string, dto: AddCartItemDto) {
    // Validar producto existe y obtener precio actual
    const producto = await this.prisma.product.findUnique({
      where: { id: dto.productoId },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${dto.productoId} no encontrado`);
    }

    if (producto.stock < dto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`,
      );
    }

    // Obtener o crear carrito
    let carrito = await this.prisma.cart.findUnique({
      where: { usuarioId },
    });

    if (!carrito) {
      carrito = await this.prisma.cart.create({
        data: { usuarioId },
      });
    }

    // Verificar si producto ya está en carrito
    const cartItemExistente = await this.prisma.cartItem.findUnique({
      where: {
        carritoId_productoId: {
          carritoId: carrito.id,
          productoId: dto.productoId,
        },
      },
    });

    if (cartItemExistente) {
      // Actualizar cantidad
      const nuevaCantidad = cartItemExistente.cantidad + dto.cantidad;
      if (producto.stock < nuevaCantidad) {
        throw new BadRequestException(
          `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`,
        );
      }
      await this.prisma.cartItem.update({
        where: { id: cartItemExistente.id },
        data: { cantidad: nuevaCantidad },
        include: {
          producto: true,
        },
      });
    } else {
      // Crear nuevo item
      await this.prisma.cartItem.create({
        data: {
          carritoId: carrito.id,
          productoId: dto.productoId,
          cantidad: dto.cantidad,
          precioUnitario: producto.precio,
        },
        include: {
          producto: true,
        },
      });
    }

    return this.obtenerOCrearCarrito(usuarioId);
  }

  /**
   * Actualizar cantidad de producto en carrito
   */
  async actualizarProducto(usuarioId: string, productoId: string, dto: UpdateCartItemDto) {
    const carrito = await this.prisma.cart.findUnique({
      where: { usuarioId },
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        carritoId_productoId: {
          carritoId: carrito.id,
          productoId,
        },
      },
      include: {
        producto: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Producto no está en el carrito');
    }

    if (dto.cantidad < 1) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    if (cartItem.producto.stock < dto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para "${cartItem.producto.nombre}". Disponible: ${cartItem.producto.stock}`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { cantidad: dto.cantidad },
    });

    return this.obtenerOCrearCarrito(usuarioId);
  }

  /**
   * Eliminar producto del carrito
   */
  async eliminarProducto(usuarioId: string, productoId: string) {
    const carrito = await this.prisma.cart.findUnique({
      where: { usuarioId },
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    await this.prisma.cartItem.delete({
      where: {
        carritoId_productoId: {
          carritoId: carrito.id,
          productoId,
        },
      },
    });

    return this.obtenerOCrearCarrito(usuarioId);
  }

  /**
   * Vaciar carrito completamente
   */
  async vaciarCarrito(usuarioId: string) {
    const carrito = await this.prisma.cart.findUnique({
      where: { usuarioId },
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    await this.prisma.cartItem.deleteMany({
      where: { carritoId: carrito.id },
    });

    return this.obtenerOCrearCarrito(usuarioId);
  }

  /**
   * Formatear respuesta del carrito con totales
   */
  private formatearCarrito(carrito: any) {
    const items = carrito.items.map((item: any) => ({
      id: item.id,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.cantidad * item.precioUnitario,
      producto: item.producto,
    }));

    const total = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    const cantidadItems = items.reduce((sum: number, item: any) => sum + item.cantidad, 0);

    return {
      id: carrito.id,
      usuarioId: carrito.usuarioId,
      items,
      total,
      cantidadItems,
      createdAt: carrito.createdAt,
      updatedAt: carrito.updatedAt,
    };
  }
}
