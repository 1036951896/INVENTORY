import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProductImageDto } from './dto/product-image.dto';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import axios from 'axios';

@Injectable()
export class ProductImagesService {
  constructor(private prisma: PrismaService) {}

  async subirImagenLocal(archivo: Express.Multer.File, productoId?: string, principal: boolean = false) {
    try {
      const nombreArchivo = archivo.filename;
      const rutaPublica = `/images/productos/${nombreArchivo}`;

      // Si se proporciona productoId, se almacena en la base de datos
      if (productoId) {
        return await this.agregar(productoId, {
          url: rutaPublica,
          principal,
        });
      }

      return {
        nombre: nombreArchivo,
        url: rutaPublica,
        ruta: rutaPublica,
        mensaje: 'Imagen subida correctamente',
      };
    } catch (error) {
      throw new BadRequestException(`Error al subir imagen: ${error.message}`);
    }
  }

  async descargarYGuardarImagen(url: string, productoId?: string, principal: boolean = false) {
    try {
      // Validar que sea una URL vÃ¡lida
      new URL(url);

      // Crear directorio si no existe
      const imagensDir = path.join(process.cwd(), 'public', 'images', 'productos');
      if (!fs.existsSync(imagensDir)) {
        fs.mkdirSync(imagensDir, { recursive: true });
      }

      // Descargar la imagen
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 10000,
      });

      // Validar que sea una imagen
      const contentType = response.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        throw new BadRequestException('URL does not point to a valid image');
      }

      // Generar nombre Ãºnico para la imagen
      const extension = this.obtenerExtensionDesdeContentType(contentType);
      const nombreArchivo = `producto-${randomUUID()}${extension}`;
      const rutaArchivo = path.join(imagensDir, nombreArchivo);

      // Guardar imagen en el sistema de archivos
      fs.writeFileSync(rutaArchivo, response.data);

      // Ruta pÃºblica
      const rutaPublica = `/images/productos/${nombreArchivo}`;

      // Si se proporciona productoId, se almacena en la base de datos
      if (productoId) {
        return await this.agregar(productoId, {
          url: rutaPublica,
          principal,
        });
      }

      return {
        nombre: nombreArchivo,
        url: rutaPublica,
        ruta: rutaPublica,
        mensaje: 'Imagen descargada y guardada correctamente',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error descargando imagen: ${error.message}`);
    }
  }

  private obtenerExtensionDesdeContentType(contentType: string): string {
    const extensiones: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
    };
    return extensiones[contentType.split(';')[0]] || '.jpg';
  }

  async agregar(productoId: string, dto: { url: string; principal?: boolean }) {
    // Si es principal, desmarcar otras imÃ¡genes
    if (dto.principal) {
      await this.prisma.productImage.updateMany({
        where: { productoId, principal: true },
        data: { principal: false },
      });
    }

    // Obtener el mÃ¡ximo orden
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

  async obtenerImagenesDisponibles() {
    try {
      const assetsDir = path.join(process.cwd(), 'public', 'assets');
      if (!fs.existsSync(assetsDir)) {
        return { imagenes: [] };
      }

      const archivos = fs.readdirSync(assetsDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      });

      const imagenes = archivos.map(archivo => ({
        nombre: archivo,
        ruta: `/assets/${archivo}`,
      }));

      return { imagenes: imagenes.sort((a, b) => a.nombre.localeCompare(b.nombre)) };
    } catch (error) {
      throw new BadRequestException(`Error al obtener imÃ¡genes disponibles: ${error.message}`);
    }
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
