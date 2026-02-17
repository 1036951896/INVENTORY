import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Verificar que la categoría existe
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoriaId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.prisma.product.create({
      data: {
        nombre: createProductDto.nombre,
        descripcion: createProductDto.descripcion,
        precio: createProductDto.precio,
        stock: createProductDto.stock,
        categoriaId: createProductDto.categoriaId,
      },
      include: {
        categoria: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 20, search?: string) {
    // Validar y normalizar page y limit
    let pageNum = Number(page);
    let limitNum = Number(limit);
    if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
    if (isNaN(limitNum) || limitNum < 1) limitNum = 20;
    const skip = (pageNum - 1) * limitNum;

    const where = search
      ? {
          activo: true,
          stock: { gt: 0 },
          OR: [
            { nombre: { contains: search, mode: 'insensitive' as const } },
            { descripcion: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : { activo: true, stock: { gt: 0 } };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { 
          categoria: true,
          imagenes: {
            select: {
              id: true,
              url: true,
              principal: true,
              orden: true
            },
            orderBy: { orden: 'asc' }
          }
        },
        skip,
        take: limitNum,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categoria: true,
        orderItems: {
          select: {
            cantidad: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findByCategory(categoriaId: string, page: number = 1, limit: number = 20) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoriaId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { categoriaId, activo: true },
        include: { categoria: true },
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.product.count({ where: { categoriaId, activo: true } }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Validar categoría si se está actualizando
    if (updateProductDto.categoriaId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoriaId },
      });
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: { categoria: true },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Marcar como inactivo en lugar de eliminar
    return this.prisma.product.update({
      where: { id },
      data: { activo: false },
    });
  }

  async updateStock(id: string, cantidad: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const newStock = product.stock - cantidad;

    if (newStock < 0) {
      throw new BadRequestException('Stock insuficiente');
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
  }
}
