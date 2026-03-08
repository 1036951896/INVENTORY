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
      
      // Lista de todas las imágenes disponibles (fallback para productos sin mapeo específico)
      const availableImages = [
        'papa_cafe_2.5kg_new.jpeg',
        'papa_nacional_2.5_new.jpeg',
        'PAPA_X_2_K_FARM FRITES.jpeg',
        'star frites 2k.jpeg',
        'papa_crunch_500gr_new.jpeg',
        'sabrosura_del_campo_1kg.jpeg',
        'RIPIO_X_500_SABROSURA_DEL_CAMPO.jpeg',
        'RIPIO_X_250_SABROSURA_DEL_CAMPO.jpeg',
        'MAIZ_SAN_MIGUEL_X_1_K.jpeg',
        'MAIZ_SAN_MIGUEL_X_500_gr.jpeg',
        'MAIZ_A_GRANEL_SAN_MIGUEL_10_K.jpeg',
        'MIX_VERDURAS_SAN_MIGUEL_X_500_GR.jpeg',
        'YUCA_ALRICO_X_1k.jpeg',
        'YUCA_ALRICO_X_500gr.jpeg',
        'vinipel_20ts.jpeg',
        'vinipel_50mts.jpeg',
        'vinipel_100mts.jpeg',
        'vinipel_300mts.jpeg',
        'guantes_transparente_Hause.jpeg',
        'guantes_nitrilo_negro_tm.jpeg',
        'guantes_nitrilo_negro_tl.jpeg',
        'lam_parafinada_15x15_regular_libra.jpeg',
        'lam_parafinada_15x15_ecologica_libra.jpeg',
        'LAM_PARAFINADA_30X30_COLOR_REGULAR.jpeg',
        'papel_parafinado_ecologico_30x30.jpeg',
        'rollo_parafinado_x10mts.jpeg',
        'aluminio_7mts.jpeg',
        'aluminio_16mts.jpeg',
        'aluminio_40mts.jpeg',
        'aluminio_100mts.jpeg',
        'bolsa_metalizada_6x6.jpeg',
        'bolsa_metalizada_7x10.jpeg',
        'bolsa_metalizada_8x10.jpeg',
        'BOLSA_METALIZADA_10X14.jpeg',
        'PORTA_HAMBURGUESA_CARTON.jpeg',
        'PORTA_PERRO_CARTON.jpeg',
        'bolsa_papel_1.jpeg',
        'bolsa_papel2.jpeg',
        'bolsa_papel_3.jpeg',
        'bolsa_papel_4.jpeg',
        'bolsa_papel_6.jpeg',
        'sachet_salsa_tomate_9gr.jpeg',
        'sachet_salsa_tomate_6gr.jpeg',
        'sachet_miel.jpeg',
        'sachet_salsa_rosada_9gr.jpeg',
        'salsa_tomate_x4kg.jpeg',
        'mayonesa_4kg.jpeg',
        'CARNE_HAMBURGUESA_9GRX10.jpeg',
        'patacon_coctelero.jpeg',
        'patacon_mediano_1000gr.jpeg',
        'patacon_ovalado_1000gr.jpeg',
        'patacon_redondo_1000gr.jpeg',
        'bolsa_t20_lec.jpeg',
        'bolsa_t25_lec.jpeg',
        'bolsa_t30_lec.jpeg',
        'bolsa_biodegradable_extraresistente.png',
      ];
      
      // Mapeo específico por producto ID
      const imageMap: { [key: string]: string } = {
        '1': 'papa_cafe_2.5kg_new.jpeg',
        '2': 'papa_nacional_2.5_new.jpeg',
        '3': 'PAPA_X_2_K_FARM FRITES.jpeg',
        '4': 'star frites 2k.jpeg',
        '5': 'papa_crunch_500gr_new.jpeg',
        '6': 'papa_crunch_500gr_new.jpeg',
        '7': 'sabrosura_del_campo_1kg.jpeg',
        '8': 'sabrosura_del_campo_1kg.jpeg',
        '9': 'RIPIO_X_500_SABROSURA_DEL_CAMPO.jpeg',
        '10': 'RIPIO_X_250_SABROSURA_DEL_CAMPO.jpeg',
        '11': 'MAIZ_SAN_MIGUEL_X_1_K.jpeg',
        '12': 'MAIZ_SAN_MIGUEL_X_500_gr.jpeg',
        '13': 'MAIZ_A_GRANEL_SAN_MIGUEL_10_K.jpeg',
        '14': 'MIX_VERDURAS_SAN_MIGUEL_X_500_GR.jpeg',
        '15': 'YUCA_ALRICO_X_1k.jpeg',
        '16': 'YUCA_ALRICO_X_500gr.jpeg',
        '17': 'vinipel_20ts.jpeg',
        '18': 'vinipel_50mts.jpeg',
        '19': 'vinipel_100mts.jpeg',
        '20': 'vinipel_300mts.jpeg',
        '21': 'vinipel_300mts.jpeg',
        '22': 'guantes_transparente_Hause.jpeg',
        '23': 'guantes_nitrilo_negro_tm.jpeg',
        '24': 'guantes_nitrilo_negro_tl.jpeg',
        '25': 'lam_parafinada_15x15_regular_libra.jpeg',
        '26': 'lam_parafinada_15x15_ecologica_libra.jpeg',
        '27': 'LAM_PARAFINADA_30X30_COLOR_REGULAR.jpeg',
        '28': 'papel_parafinado_ecologico_30x30.jpeg',
        '29': 'rollo_parafinado_x10mts.jpeg',
        '30': 'aluminio_7mts.jpeg',
        '31': 'aluminio_16mts.jpeg',
        '32': 'aluminio_40mts.jpeg',
        '33': 'aluminio_100mts.jpeg',
        '34': 'bolsa_metalizada_6x6.jpeg',
        '35': 'bolsa_metalizada_7x10.jpeg',
        '36': 'bolsa_metalizada_8x10.jpeg',
        '37': 'BOLSA_METALIZADA_10X14.jpeg',
        '38': 'bolsa_metalizada_8x10.jpeg',
        '39': 'PORTA_HAMBURGUESA_CARTON.jpeg',
        '40': 'PORTA_PERRO_CARTON.jpeg',
        '41': 'bolsa_papel_1.jpeg',
        '42': 'bolsa_papel2.jpeg',
        '43': 'bolsa_papel_3.jpeg',
        '44': 'bolsa_papel_4.jpeg',
        '45': 'bolsa_papel_6.jpeg',
        '46': 'sachet_salsa_tomate_9gr.jpeg',
        '47': 'sachet_salsa_tomate_6gr.jpeg',
        '48': 'sachet_miel.jpeg',
        '49': 'sachet_salsa_rosada_9gr.jpeg',
        '50': 'salsa_tomate_x4kg.jpeg',
        '51': 'mayonesa_4kg.jpeg',
        '52': 'CARNE_HAMBURGUESA_9GRX10.jpeg',
        '53': 'patacon_coctelero.jpeg',
        '54': 'patacon_mediano_1000gr.jpeg',
        '55': 'patacon_ovalado_1000gr.jpeg',
        '56': 'patacon_redondo_1000gr.jpeg',
        '57': 'bolsa_t20_lec.jpeg',
        '58': 'bolsa_t25_lec.jpeg',
        '59': 'bolsa_t30_lec.jpeg',
        '60': 'bolsa_t25_lec.jpeg',
        '61': 'bolsa_t30_lec.jpeg',
        '62': 'BOLSA_METALIZADA_10X14.jpeg',
        '63': 'BOLSA_METALIZADA_10X14.jpeg',
        '64': 'bolsa_biodegradable_extraresistente.png',
      };
      
      let imagesCreated = 0;
      let imagesFailed = 0;
      for (let i = 0; i < productosJSON.length; i++) {
        const producto = productosJSON[i];
        // Usar mapeo específico, si no, ciclar entre imágenes disponibles
        const imageName = imageMap[producto.id] || availableImages[i % availableImages.length];
        
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
          this.logger.debug(`✓ Imagen ${producto.id}: ${imageName}`);
        } catch (error) {
          imagesFailed++;
          this.logger.error(
            `✗ Error creando imagen para producto ${producto.id} (${producto.nombre}):`,
            error.message
          );
        }
      }
      this.logger.log(`✓ ${imagesCreated} imágenes creadas, ${imagesFailed} fallidas`);

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
