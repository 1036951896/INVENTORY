import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/stock-movement.dto';

@Injectable()
export class StockMovementsService {
  constructor(private prisma: PrismaService) {}

  async registrar(dto: CreateStockMovementDto, usuarioId?: string) {
    const movimiento = await this.prisma.stockMovement.create({
      data: {
        ...dto,
        usuarioId,
      },
      include: {
        producto: true,
        usuario: true,
      },
    });

    // Actualizar stock del producto
    let nuevoStock = 0;
    if (dto.tipo === 'ENTRADA' || dto.tipo === 'DEVOLUCIÓN') {
      nuevoStock = await this.prisma.product.update({
        where: { id: dto.productoId },
        data: {
          stock: {
            increment: dto.cantidad,
          },
        },
      }).then(p => p.stock);
    } else if (dto.tipo === 'SALIDA') {
      nuevoStock = await this.prisma.product.update({
        where: { id: dto.productoId },
        data: {
          stock: {
            decrement: dto.cantidad,
          },
        },
      }).then(p => p.stock);
    } else if (dto.tipo === 'AJUSTE') {
      // Para ajuste, la cantidad ya incluye el signo
      nuevoStock = await this.prisma.product.update({
        where: { id: dto.productoId },
        data: {
          stock: {
            increment: dto.cantidad,
          },
        },
      }).then(p => p.stock);
    }

    return { ...movimiento, nuevoStock };
  }

  async obtenerPorProducto(productoId: string, limit = 50, offset = 0) {
    const movimientos = await this.prisma.stockMovement.findMany({
      where: { productoId },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.stockMovement.count({
      where: { productoId },
    });

    return { movimientos, total };
  }

  async obtenerTodos(limit = 50, offset = 0) {
    const movimientos = await this.prisma.stockMovement.findMany({
      include: {
        producto: {
          select: { id: true, nombre: true },
        },
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.stockMovement.count();

    return { movimientos, total };
  }

  async obtenerPorRango(from: Date, to: Date, limit = 100, offset = 0) {
    const movimientos = await this.prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      include: {
        producto: {
          select: { id: true, nombre: true },
        },
        usuario: {
          select: { id: true, nombre: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.prisma.stockMovement.count({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    return { movimientos, total };
  }
}
