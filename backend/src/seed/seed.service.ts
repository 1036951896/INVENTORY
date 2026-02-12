import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async executeSeed(forceReset: boolean = false) {
    try {
      console.log('🌱 Iniciando Seed...');

      // Verificar si ya existen datos (a menos que sea force reset)
      const userCount = await this.prisma.user.count();
      if (userCount > 0 && !forceReset) {
        return {
          success: true,
          message: 'La base de datos ya contiene datos. Seed no se ejecutó. Usa ?force=true para resetear.',
          status: 'ALREADY_SEEDED',
        };
      }

      // Si es force reset, limpiar todo
      if (forceReset) {
        console.log('🧹 Force reset: limpiando base de datos...');
        const productsBeforeDelete = await this.prisma.product.count();
        console.log(`  📊 Productos antes de eliminar: ${productsBeforeDelete}`);

        await this.prisma.orderItem.deleteMany({});
        await this.prisma.order.deleteMany({});
        await this.prisma.user.deleteMany({});
        await this.prisma.product.deleteMany({});
        await this.prisma.category.deleteMany({});

        const productsAfterDelete = await this.prisma.product.count();
        console.log(`  📊 Productos después de eliminar: ${productsAfterDelete}`);
      } else {
        const existingProducts = await this.prisma.product.count();
        if (existingProducts > 0) {
          console.log(`⚠️ La base de datos ya contiene ${existingProducts} productos`);
        }
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
        { id: '11', nombre: 'MAIZ SAN MIGUEL X 1 K', precio: 8700, stock: 10, categoriaId: '3' },
        { id: '12', nombre: 'MAIZ SAN MIGUEL X 500 GR', precio: 4700, stock: 10, categoriaId: '3' },
        { id: '13', nombre: 'MAIZ A GRANEL SAN MIGUEL X 10 K', precio: 80000, stock: 5, categoriaId: '3' },
        { id: '14', nombre: 'MIX VERDURAS SAN MICHEL X 500 GR', precio: 4700, stock: 10, categoriaId: '3' },
        { id: '15', nombre: 'YUCA ALRICO X 1 K', precio: 6900, stock: 10, categoriaId: '4' },
        { id: '16', nombre: 'YUCA ALRICO X 500 GR', precio: 3800, stock: 10, categoriaId: '4' },
        { id: '17', nombre: 'VINIPEL 20 MTS', precio: 1500, stock: 50, categoriaId: '5' },
        { id: '18', nombre: 'VINILPEX X50 MTS', precio: 2700, stock: 50, categoriaId: '5' },
        { id: '19', nombre: 'VINILPEX X100 MTS', precio: 4700, stock: 50, categoriaId: '5' },
        { id: '20', nombre: 'VINILPEX X 300 MTS LARGO', precio: 8700, stock: 20, categoriaId: '5' },
        { id: '21', nombre: 'VINILPEX X 300 1/2', precio: 4700, stock: 20, categoriaId: '5' },
        { id: '22', nombre: 'GUANTES PLASTICOS TRANSPARENTE HAUSE', precio: 1670, stock: 50, categoriaId: '5' },
        { id: '23', nombre: 'GUANTES NITRILO NEGRO T M HAUSE', precio: 21600, stock: 30, categoriaId: '5' },
        { id: '24', nombre: 'GUANTES NITRILO NEGRO T L HAUSE', precio: 21600, stock: 30, categoriaId: '5' },
        { id: '25', nombre: 'LAM PARAFINADA 15X15 REGULAR LIBRA', precio: 9700, stock: 40, categoriaId: '5' },
        { id: '26', nombre: 'LAM PARAFINADA 15X15 ECOLOGICA LIBRA', precio: 7800, stock: 40, categoriaId: '5' },
        { id: '27', nombre: 'LAM PARAFINADA 30X30 COLOR REGULAR', precio: 9700, stock: 40, categoriaId: '5' },
        { id: '28', nombre: 'ROLLO PARAFINADO X 50 MTS', precio: 17400, stock: 20, categoriaId: '5' },
        { id: '29', nombre: 'ROLLO PARAFINADO X 10 MTS', precio: 2800, stock: 60, categoriaId: '5' },
        { id: '30', nombre: 'ALUMINIO 7 MTS', precio: 2500, stock: 50, categoriaId: '5' },
        { id: '31', nombre: 'ALUMINIO 16 MTS', precio: 4700, stock: 50, categoriaId: '5' },
        { id: '32', nombre: 'ALUMINIO 40 MTS', precio: 9500, stock: 30, categoriaId: '5' },
        { id: '33', nombre: 'ALUMINIO 100 MTS', precio: 23000, stock: 10, categoriaId: '5' },
        { id: '34', nombre: 'BOLSA METALIZADA 6X6 ABTA', precio: 1900, stock: 100, categoriaId: '5' },
        { id: '35', nombre: 'BOLSA METALIZADA 7X10', precio: 3500, stock: 100, categoriaId: '5' },
        { id: '36', nombre: 'BOLSA METALIZADA 8X10', precio: 3900, stock: 100, categoriaId: '5' },
        { id: '37', nombre: 'BOLSA METALIZADA 8X12', precio: 4800, stock: 100, categoriaId: '5' },
        { id: '38', nombre: 'BOLSA METALIZADA 10X14', precio: 6900, stock: 100, categoriaId: '5' },
        { id: '39', nombre: 'PORTA HAMBURGUESA CARTON', precio: 9000, stock: 50, categoriaId: '5' },
        { id: '40', nombre: 'PORTA PERRO CARTON', precio: 9000, stock: 50, categoriaId: '5' },
        { id: '41', nombre: 'BOLSA PAPEL # 1', precio: 3100, stock: 100, categoriaId: '5' },
        { id: '42', nombre: 'BOLSA PAPEL # 2', precio: 4200, stock: 100, categoriaId: '5' },
        { id: '43', nombre: 'BOLSA PAPEL # 3', precio: 5300, stock: 100, categoriaId: '5' },
        { id: '44', nombre: 'BOLSA PAPEL # 4', precio: 6300, stock: 100, categoriaId: '5' },
        { id: '45', nombre: 'BOLSA PAPEL # 6', precio: 9000, stock: 100, categoriaId: '5' },
        { id: '46', nombre: 'SACHET TOMATE 9GR X 102', precio: 7800, stock: 50, categoriaId: '6' },
        { id: '47', nombre: 'SACHET TOMATE 6 GR X 204', precio: 11400, stock: 50, categoriaId: '6' },
        { id: '48', nombre: 'SACHET MIEL 9GR X 102', precio: 7800, stock: 50, categoriaId: '6' },
        { id: '49', nombre: 'SACHET ROSADA 9GR X 102', precio: 11400, stock: 50, categoriaId: '6' },
        { id: '50', nombre: 'SALSA TOMATE X 4 K', precio: 25300, stock: 20, categoriaId: '6' },
        { id: '51', nombre: 'MAYONESA X 4 K', precio: 34000, stock: 20, categoriaId: '6' },
        { id: '52', nombre: 'CARNE DE HAMBURG 9GR X 10', precio: 12300, stock: 30, categoriaId: '6' },
        { id: '53', nombre: 'PATACON COCTELERO X 1000 GR', precio: 9600, stock: 40, categoriaId: '1' },
        { id: '54', nombre: 'PATACON MEDIANO X 1000 GR', precio: 9600, stock: 40, categoriaId: '1' },
        { id: '55', nombre: 'PATACON OVALADO X 1000 GR', precio: 9600, stock: 40, categoriaId: '1' },
        { id: '56', nombre: 'PATACON REDONDO X 1000 GR', precio: 9600, stock: 40, categoriaId: '1' },
        { id: '57', nombre: 'BOLSA T 20 LEC BIO-SOSTENIBLE', precio: 2800, stock: 100, categoriaId: '5' },
        { id: '58', nombre: 'BOLSA T-25 LEC R.U BIO-SOSTENIBLE', precio: 3600, stock: 100, categoriaId: '5' },
        { id: '59', nombre: 'BOLSA T-30 LEC ECONOMICA R.U BIO-SOSTENIBLE', precio: 5700, stock: 100, categoriaId: '5' },
        { id: '60', nombre: 'BOLSA T-35 LEC RESIST R.U BIO-SOSTENIBLE', precio: 7200, stock: 100, categoriaId: '5' },
        { id: '61', nombre: 'BOLSA T-40 LEC RESIST R.U BIO-SOSTENIBLE', precio: 8900, stock: 100, categoriaId: '5' },
        { id: '62', nombre: 'BOLSA T-50 LEC RESIST R.U BIO-SOSTENIBLE', precio: 11200, stock: 100, categoriaId: '5' },
        { id: '63', nombre: 'BOLSA T-60 RESIST R.U BIO-SOSTENIBLE', precio: 13500, stock: 100, categoriaId: '5' },
        { id: '64', nombre: 'BOLSA BIODEGRADABLE EXTRA RESISTANT', precio: 15000, stock: 50, categoriaId: '5' },
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
      let productsSucceeded = 0;
      let productsFailed = 0;

      for (let i = 0; i < productosJSON.length; i++) {
        const producto = productosJSON[i];
        try {
          await this.prisma.product.create({
            data: {
              id: producto.id,
              nombre: producto.nombre,
              precio: producto.precio,
              stock: producto.stock,
              activo: true,
              categoriaId: producto.categoriaId,
              descripcion: `${producto.nombre} - Producto de calidad`,
            },
          });
          productsSucceeded++;
          if ((i + 1) % 10 === 0) {
            console.log(`  ✅ ${i + 1}/${productosJSON.length} productos creados`);
          }
        } catch (err) {
          productsFailed++;
          console.error(`  ❌ Error al crear producto ${i + 1} (ID: "${producto.id}", Nombre: "${producto.nombre}"):`, err.message);
        }
      }

      console.log(`✅ Productos: ${productsSucceeded} exitosos, ${productsFailed} fallidos`);

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
          productsCreated: productsSucceeded,
          productsFailed: productsFailed,
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
