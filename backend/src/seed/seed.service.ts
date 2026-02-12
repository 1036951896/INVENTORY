import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async executeSeed() {
    try {
      console.log('🌱 Iniciando Seed...');

      // Verificar si ya existen datos
      const userCount = await this.prisma.user.count();
      if (userCount > 0) {
        return {
          success: true,
          message: 'La base de datos ya contiene datos. Seed no se ejecutó.',
          status: 'ALREADY_SEEDED',
        };
      }

      const categoriasSeed = [
        { id: '1', nombre: 'Papas', descripcion: 'Productos de papa', icono: '🥔' },
        { id: '2', nombre: 'Ripios', descripcion: 'Ripios congelados', icono: '❄️' },
        { id: '3', nombre: 'Legumbres', descripcion: 'Legumbres y verduras', icono: '🌽' },
        { id: '4', nombre: 'Raices y tuberculos', descripcion: 'Yuca y otros tubérculos', icono: '🥕' },
        { id: '5', nombre: 'Empaques', descripcion: 'Bolsas y empaques', icono: '📦' },
        { id: '6', nombre: 'Condimentos', descripcion: 'Salsas y condimentos', icono: '🧂' },
      ];

      const productosJSON = [
        { id: '1', nombre: 'PAPA CAFÉ X 2.5 FARM FRITES', precio: 22500, stock: 10, categoriaId: '1' },
        { id: '2', nombre: 'PAPA NACIONAL X 2.5', precio: 21600, stock: 10, categoriaId: '1' },
        { id: '3', nombre: 'PAPA X 2 K FARM FRITES', precio: 15000, stock: 10, categoriaId: '1' },
        { id: '4', nombre: 'PAPA X 2 K STAR FRITES', precio: 15000, stock: 10, categoriaId: '1' },
        { id: '5', nombre: 'PAPA X 1 K CRUNCH HOUSE', precio: 9700, stock: 10, categoriaId: '1' },
        { id: '6', nombre: 'PAPA X 500 CRUNCH HOUSE', precio: 5400, stock: 10, categoriaId: '1' },
        { id: '7', nombre: 'RIPIO SAN MIGUEL X 1 K', precio: 9000, stock: 10, categoriaId: '2' },
        { id: '8', nombre: 'RIPIO X 1 K SABROSURA DEL CAMPO', precio: 8000, stock: 10, categoriaId: '2' },
        { id: '9', nombre: 'RIPIO X 500 SABROSURA DEL CAMPO', precio: 5500, stock: 10, categoriaId: '2' },
        { id: '10', nombre: 'RIPIO X 250 SABROSURA DEL CAMPO', precio: 3500, stock: 10, categoriaId: '2' },
      ];

      console.log('🧹 Limpiando base de datos...');
      await this.prisma.orderItem.deleteMany({});
      await this.prisma.order.deleteMany({});
      await this.prisma.user.deleteMany({});
      await this.prisma.product.deleteMany({});
      await this.prisma.category.deleteMany({});

      console.log('📦 Creando categorías...');
      for (const categoria of categoriasSeed) {
        await this.prisma.category.create({
          data: categoria,
        });
      }

      console.log('🛍️ Creando productos...');
      for (const producto of productosJSON) {
        await this.prisma.product.create({
          data: {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            categoriaId: producto.categoriaId,
            descripcion: `${producto.nombre} - Producto de calidad`,
          },
        });
      }

      // Crear usuarios de prueba
      console.log('👤 Creando usuarios...');
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      const hashedClientPassword = await bcrypt.hash('cliente123', 10);

      await this.prisma.user.create({
        data: {
          nombre: 'Administrador',
          email: 'admin@inventory.com',
          password: hashedAdminPassword,
          telefono: '+57 315 5508228',
          rol: 'ADMIN',
          activo: true,
        },
      });

      await this.prisma.user.create({
        data: {
          nombre: 'Cliente Prueba',
          email: 'cliente@inventory.com',
          password: hashedClientPassword,
          telefono: '+57 315 1234567',
          rol: 'CLIENTE',
          activo: true,
        },
      });

      console.log('✅ ¡Seed completado!');

      return {
        success: true,
        message: 'Seed ejecutado correctamente',
        status: 'SEED_COMPLETED',
        data: {
          categoriesCreated: categoriasSeed.length,
          productsCreated: productosJSON.length,
          usersCreated: 2,
          testAccounts: [
            {
              rol: 'ADMIN',
              email: 'admin@inventory.com',
              password: 'admin123',
            },
            {
              rol: 'CLIENTE',
              email: 'cliente@inventory.com',
              password: 'cliente123',
            },
          ],
        },
      };
    } catch (error) {
      console.error('❌ Error en seed:', error);
      throw new BadRequestException(`Error al ejecutar seed: ${error.message}`);
    }
  }
}
