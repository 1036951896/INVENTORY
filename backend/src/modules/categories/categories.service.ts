import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { nombre: createCategoryDto.nombre },
    });

    if (existing) {
      throw new BadRequestException(`La categoría "${createCategoryDto.nombre}" ya existe`);
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { productos: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        productos: {
          where: { activo: true },
          select: {
            id: true,
            nombre: true,
            precio: true,
            stock: true,
            imagen: true,
          },
        },
        _count: {
          select: { productos: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    if (updateCategoryDto.nombre && updateCategoryDto.nombre !== category.nombre) {
      const existing = await this.prisma.category.findUnique({
        where: { nombre: updateCategoryDto.nombre },
      });
      if (existing) {
        throw new BadRequestException(`La categoría "${updateCategoryDto.nombre}" ya existe`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { productos: true } } },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    if (category._count.productos > 0) {
      throw new BadRequestException(
        `No se puede eliminar la categoría "${category.nombre}" porque tiene ${category._count.productos} producto(s) asociado(s)`,
      );
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
