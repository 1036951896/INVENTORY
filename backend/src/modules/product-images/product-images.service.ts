import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProductImageDto } from './dto/product-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(private prisma: PrismaService) {}

  async agregar(productoId: string, dto: { url: string; principal?: boolean }) {
    // Si es principal, desmarcar otras imágenes
    if (dto.principal) {
      await this.prisma.productImage.updateMany({
        where: { productoId, principal: true },
        data: { principal: false },
      });
    }

    // Obtener el máximo orden
    const ultimaImagen = await this.prisma.productImage.findFirst({
      where: { productoId },
      orderBy: { orden: 'desc' },
    });

    return this.prisma.productImage.create({
      data: {
        url: dto.url,
        principal: dto.principal || false,
        productoId,
        orden: (ultimaImagen?.orden ?? -1) + 1,
      },
    });
  }

  async obtenerPorProducto(productoId: string) {
    return this.prisma.productImage.findMany({
      where: { productoId },
      orderBy: { orden: 'asc' },
    });
  }

  async obtenerPrincipal(productoId: string) {
    return this.prisma.productImage.findFirst({
      where: { productoId, principal: true },
    });
  }

  async actualizar(id: string, dto: UpdateProductImageDto) {
    if (dto.principal) {
      const imagen = await this.prisma.productImage.findUnique({ where: { id } });
      if (imagen) {
        await this.prisma.productImage.updateMany({
          where: { 
            productoId: imagen.productoId,
            NOT: { id },
            principal: true 
          },
          data: { principal: false },
        });
      }
    }

    return this.prisma.productImage.update({
      where: { id },
      data: dto,
    });
  }

  async reordenar(_productoId: string, imagenesIds: string[]) {
    const updates = imagenesIds.map((id, index) =>
      this.prisma.productImage.update({
        where: { id },
        data: { orden: index },
      }),
    );
    return Promise.all(updates);
  }

  async eliminar(id: string) {
    return this.prisma.productImage.delete({
      where: { id },
    });
  }
}
