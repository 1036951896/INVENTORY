import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async executeSeed(forceReset: boolean = false) {
    try {
      this.logger.log('Iniciando Seed...');

      // Verificar si ya existen datos (verificar AMBOS users y products)
      const userCount = await this.prisma.user.count();
      const productCount = await this.prisma.product.count();
      
      if ((userCount > 0 || productCount > 0) && !forceReset) {
        return {
          success: false,
          message: `La base de datos ya contiene datos (${userCount} users, ${productCount} products). Seed no se ejecutó. Usa ?force=true para resetear.`,
          status: 'ALREADY_SEEDED',
        };
      }

      // Si es force reset, limpiar todo
      if (forceReset) {
        this.logger.log('Force reset: limpiando base de datos...');
        const productsBeforeDelete = await this.prisma.product.count();
        const usersBeforeDelete = await this.prisma.user.count();
        this.logger.log(`  Antes: ${productsBeforeDelete} productos, ${usersBeforeDelete} usuarios`);

        await this.prisma.orderItem.deleteMany({});
        await this.prisma.order.deleteMany({});
        await this.prisma.user.deleteMany({});
        await this.prisma.product.deleteMany({});
        await this.prisma.category.deleteMany({});

        const productsAfterDelete = await this.prisma.product.count();
        const usersAfterDelete = await this.prisma.user.count();
        this.logger.log(`  Despues: ${productsAfterDelete} productos, ${usersAfterDelete} usuarios`);
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

      this.logger.log('Creando categorias...');
      for (const categoria of categoriasSeed) {
        try {
          await this.prisma.category.create({
            data: categoria,
          });
          this.logger.log(`  Categoria creada: ${categoria.nombre}`);
        } catch (err) {
          this.logger.warn(`  Error creando categoria "${categoria.nombre}":`, err.message);
        }
      }

      this.logger.log('Creando productos...');
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
            this.logger.log(`  ${i + 1}/${productosJSON.length} productos creados`);
          }
        } catch (err) {
          productsFailed++;
          this.logger.error(`  Error al crear producto ${i + 1} (ID: "${producto.id}"):`, err.message);
        }
      }

      this.logger.log(`Productos: ${productsSucceeded} exitosos, ${productsFailed} fallidos`);

      // Crear imágenes para los productos
      this.logger.log('🖼️ Creando imágenes de prueba desde backend/public/assets...');
      const imageMap: { [key: string]: string } = {
        '1': 'papa_cafe_2.5kg_new.jpeg',           // PAPA CAFÉ X 2.5 FARM FRITES
        '2': 'papa_nacional_2.5_new.jpeg',        // PAPA NACIONAL X 2.5
        '3': 'PAPA_X_2_K_FARM FRITES.jpeg',       // PAPA X 2 K FARM FRITES
        '4': 'star frites 2k.jpeg',               // PAPA X 2 K STAR FRITES
        '5': 'papa_crunch_500gr_new.jpeg',        // PAPA X 1 K CRUNCH HOUSE
        '6': 'papa_crunch_500gr_new.jpeg',        // PAPA X 500 CRUNCH HOUSE
        '7': 'sabrosura_del_campo_1kg.jpeg',      // RIPIO SAN MIGUEL X 1 K
        '8': 'sabrosura_del_campo_1kg.jpeg',      // RIPIO X 1 K SABROSURA
        '9': 'RIPIO_X_500_SABROSURA_DEL_CAMPO.jpeg', // RIPIO X 500
        '10': 'RIPIO_X_250_SABROSURA_DEL_CAMPO.jpeg', // RIPIO X 250
        '11': 'MAIZ_SAN_MIGUEL_X_1_K.jpeg',       // MAIZ SAN MIGUEL X 1 K
        '12': 'MAIZ_SAN_MIGUEL_X_500_gr.jpeg',    // MAIZ SAN MIGUEL X 500 GR
        '13': 'MAIZ_A_GRANEL_SAN_MIGUEL_10_K.jpeg', // MAIZ A GRANEL
        '14': 'MIX_VERDURAS_SAN_MIGUEL_X_500_GR.jpeg', // MIX VERDURAS
        '15': 'YUCA_ALRICO_X_1k.jpeg',            // YUCA ALRICO X 1 K
        '16': 'YUCA_ALRICO_X_500gr.jpeg',         // YUCA ALRICO X 500 GR
        '17': 'vinipel_20ts.jpeg',                // VINIPEL 20 MTS
        '18': 'vinipel_50mts.jpeg',               // VINILPEX X50 MTS
        '19': 'vinipel_100mts.jpeg',              // VINILPEX X100 MTS
        '20': 'vinipel_300mts.jpeg',              // VINILPEX X 300 MTS
        '21': 'vinipel_300mts.jpeg',              // VINILPEX X 300 1/2
        '22': 'guantes_transparente_Hause.jpeg',  // GUANTES PLASTICOS
        '23': 'guantes_nitrilo_negro_tm.jpeg',    // GUANTES NITRILO T M
        '24': 'guantes_nitrilo_negro_tl.jpeg',    // GUANTES NITRILO T L
        '25': 'lam_parafinada_15x15_regular_libra.jpeg', // LAM PARAFINADA 15X15
        '26': 'lam_parafinada_15x15_ecologica_libra.jpeg', // LAM PARAFINADA ECOLÓGICA
        '27': 'LAM_PARAFINADA_30X30_COLOR_REGULAR.jpeg', // LAM PARAFINADA 30X30
        '28': 'papel_parafinado_ecologico_30x30.jpeg', // ROLLO PARAFINADO
        '29': 'rollo_parafinado_x10mts.jpeg',     // ROLLO PARAFINADO X 10 MTS
        '30': 'aluminio_7mts.jpeg',               // ALUMINIO 7 MTS
        '31': 'aluminio_16mts.jpeg',              // ALUMINIO 16 MTS
        '32': 'aluminio_40mts.jpeg',              // ALUMINIO 40 MTS
        '33': 'aluminio_100mts.jpeg',             // ALUMINIO 100 MTS
        '34': 'bolsa_metalizada_6x6.jpeg',        // BOLSA METALIZADA 6X6
        '35': 'bolsa_metalizada_7x10.jpeg',       // BOLSA METALIZADA 7X10
        '36': 'bolsa_metalizada_8x10.jpeg',       // BOLSA METALIZADA 8X10
        '37': 'BOLSA_METALIZADA_10X14.jpeg',      // BOLSA METALIZADA 10X14
        '38': 'bolsa_metalizada_8x10.jpeg',       // Fallback
        '39': 'PORTA_HAMBURGUESA_CARTON.jpeg',    // PORTA HAMBURGUESA
        '40': 'PORTA_PERRO_CARTON.jpeg',          // PORTA PERRO
        '41': 'bolsa_papel_1.jpeg',               // BOLSA PAPEL # 1
        '42': 'bolsa_papel2.jpeg',                // BOLSA PAPEL # 2
        '43': 'bolsa_papel_3.jpeg',               // BOLSA PAPEL # 3
        '44': 'bolsa_papel_4.jpeg',               // BOLSA PAPEL # 4
        '45': 'bolsa_papel_6.jpeg',               // BOLSA PAPEL # 6
        '46': 'sachet_salsa_tomate_9gr.jpeg',     // SACHET TOMATE 9GR
        '47': 'sachet_salsa_tomate_6gr.jpeg',     // SACHET TOMATE 6GR
        '48': 'sachet_miel.jpeg',                 // SACHET MIEL
        '49': 'sachet_salsa_rosada_9gr.jpeg',     // SACHET ROSADA
        '50': 'salsa_tomate_x4kg.jpeg',           // SALSA TOMATE X 4 K
        '51': 'mayonesa_4kg.jpeg',                // MAYONESA X 4 K
        '52': 'CARNE_HAMBURGUESA_9GRX10.jpeg',    // CARNE HAMBURG
        '53': 'patacon_coctelero.jpeg',           // PATACON COCTELERO
        '54': 'patacon_mediano_1000gr.jpeg',      // PATACON MEDIANO
        '55': 'patacon_ovalado_1000gr.jpeg',      // PATACON OVALADO
        '56': 'patacon_redondo_1000gr.jpeg',      // PATACON REDONDO
        '57': 'bolsa_t20_lec.jpeg',               // BOLSA T 20 LEC
        '58': 'bolsa_t25_lec.jpeg',               // BOLSA T-25 LEC
        '59': 'bolsa_t30_lec.jpeg',               // BOLSA T-30 LEC
        '60': 'bolsa_t25_lec.jpeg',               // BOLSA T-35 LEC
        '61': 'bolsa_t30_lec.jpeg',               // BOLSA T-40 LEC
        '62': 'BOLSA_METALIZADA_10X14.jpeg',      // BOLSA T-50 LEC
        '63': 'BOLSA_METALIZADA_10X14.jpeg',      // BOLSA T-60
        '64': 'bolsa_biodegradable_extraresistente.png', // BOLSA BIODEGRADABLE
      };
      
      let imagesCreated = 0;
      for (const producto of productosJSON) {
        const imageName = imageMap[producto.id] || 'product-placeholder.svg';
        try {
          await this.prisma.productImage.create({
            data: {
              productoId: producto.id,
              url: `https://inventory-1-jkh2.onrender.com/assets/${imageName}`,
              principal: true,
              orden: 1,
            },
          });
          imagesCreated++;
          this.logger.debug(`Imagen ${producto.id}: ${imageName}`);
        } catch (error) {
          this.logger.error(
            `Error creando imagen para producto ${producto.id}:`,
            error.message
          );
        }
      }
      this.logger.log(`✓ ${imagesCreated} imágenes creadas`);

      // Crear usuarios de prueba
      this.logger.log('Creando usuarios...');
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

      this.logger.log('Seed completado!');

      return {
        success: true,
        message: 'Seed ejecutado correctamente',
        status: 'SEED_COMPLETED',
        data: {
          categoriesCreated: categoriasSeed.length,
          productsCreated: productsSucceeded,
          productsFailed: productsFailed,
          imagesCreated: imagesCreated,
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
      this.logger.error('Error en seed:', error);
      throw new BadRequestException(`Error al ejecutar seed: ${error.message}`);
    }
  }
}
