import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Cargar los datos del JSON para obtener información consistente
const productosJSON = [
  { id: "1", nombre: 'PAPA CAFÉ X 2.5 FARM FRITES', precio: 22500, stock: 10, categoriaId: '1' },
  { id: "2", nombre: 'PAPA NACIONAL X 2.5', precio: 21600, stock: 10, categoriaId: '1' },
  { id: "3", nombre: 'PAPA X 2 K FARM FRITES', precio: 15000, stock: 10, categoriaId: '1' },
  { id: "4", nombre: 'PAPA X 2 K STAR FRITES', precio: 15000, stock: 10, categoriaId: '1' },
  { id: "5", nombre: 'PAPA X 1 K CRUNCH HOUSE', precio: 9700, stock: 10, categoriaId: '1' },
  { id: "6", nombre: 'PAPA X 500 CRUNCH HOUSE', precio: 5400, stock: 10, categoriaId: '1' },
  { id: "7", nombre: 'RIPIO SAN MIGUEL X 1 K', precio: 9000, stock: 10, categoriaId: '2' },
  { id: "8", nombre: 'RIPIO X 1 K SABROSURA DEL CAMPO', precio: 8000, stock: 10, categoriaId: '2' },
  { id: "9", nombre: 'RIPIO X 500 SABROSURA DEL CAMPO', precio: 5500, stock: 10, categoriaId: '2' },
  { id: "10", nombre: 'RIPIO X 250 SABROSURA DEL CAMPO', precio: 3500, stock: 10, categoriaId: '2' },
  { id: "11", nombre: 'MAIZ SAN MIGUEL X 1 K', precio: 8700, stock: 10, categoriaId: '3' },
  { id: "12", nombre: 'MAIZ SAN MIGUEL X 500 GR', precio: 4700, stock: 10, categoriaId: '3' },
  { id: "13", nombre: 'MAIZ A GRANEL SAN MIGUEL X 10 K', precio: 80000, stock: 5, categoriaId: '3' },
  { id: "14", nombre: 'MIX VERDURAS SAN MIGUEL X 500 GR', precio: 4700, stock: 10, categoriaId: '3' },
  { id: "15", nombre: 'YUCA ALRICO X 1 K', precio: 6900, stock: 10, categoriaId: '4' },
  { id: "16", nombre: 'YUCA ALRICO X 500 GR', precio: 3800, stock: 10, categoriaId: '4' },
  { id: "17", nombre: 'VINIPEL 20 MTS', precio: 1500, stock: 50, categoriaId: '5' },
  { id: "18", nombre: 'VINILPEX X50 MTS', precio: 2700, stock: 50, categoriaId: '5' },
  { id: "19", nombre: 'VINILPEX X100 MTS', precio: 4700, stock: 50, categoriaId: '5' },
  { id: "20", nombre: 'VINILPEX X 300 MTS LARGO', precio: 8700, stock: 20, categoriaId: '5' },
  { id: "21", nombre: 'VINILPEX X 300 1/2', precio: 4700, stock: 20, categoriaId: '5' },
  { id: "22", nombre: 'GUANTES PLASTICOS TRANSPARENTE HAUSE', precio: 1670, stock: 50, categoriaId: '5' },
  { id: "23", nombre: 'GUANTES NITRILO NEGRO T M HAUSE', precio: 21600, stock: 30, categoriaId: '5' },
  { id: "24", nombre: 'GUANTES NITRILO NEGRO T L HAUSE', precio: 21600, stock: 30, categoriaId: '5' },
  { id: "25", nombre: 'LAM PARAFINADA 15X15 REGULAR LIBRA', precio: 9700, stock: 40, categoriaId: '5' },
  { id: "26", nombre: 'LAM PARAFINADA 15X15 ECOLOGICA LIBRA', precio: 7800, stock: 40, categoriaId: '5' },
  { id: "27", nombre: 'LAM PARAFINADA 30X30 COLOR REGULAR', precio: 9700, stock: 40, categoriaId: '5' },
  { id: "28", nombre: 'ROLLO PARAFINADO X 50 MTS', precio: 17400, stock: 20, categoriaId: '5' },
  { id: "29", nombre: 'ROLLO PARAFINADO X 10 MTS', precio: 2800, stock: 60, categoriaId: '5' },
  { id: "30", nombre: 'ALUMINIO 7 MTS', precio: 2500, stock: 50, categoriaId: '5' },
  { id: "31", nombre: 'ALUMINIO 16 MTS', precio: 4700, stock: 50, categoriaId: '5' },
  { id: "32", nombre: 'ALUMINIO 40 MTS', precio: 9500, stock: 30, categoriaId: '5' },
  { id: "33", nombre: 'ALUMINIO 100 MTS', precio: 23000, stock: 10, categoriaId: '5' },
  { id: "34", nombre: 'BOLSA METALIZADA 6X6 ABTA', precio: 1900, stock: 100, categoriaId: '5' },
  { id: "35", nombre: 'BOLSA METALIZADA 7X10', precio: 3500, stock: 100, categoriaId: '5' },
  { id: "36", nombre: 'BOLSA METALIZADA 8X10', precio: 3900, stock: 100, categoriaId: '5' },
  { id: "37", nombre: 'BOLSA METALIZADA 8X12', precio: 4800, stock: 100, categoriaId: '5' },
  { id: "38", nombre: 'BOLSA METALIZADA 10X14', precio: 6900, stock: 100, categoriaId: '5' },
  { id: "39", nombre: 'PORTA HAMBURGUESA CARTON', precio: 9000, stock: 50, categoriaId: '5' },
  { id: "40", nombre: 'PORTA PERRO CARTON', precio: 9000, stock: 50, categoriaId: '5' },
  { id: "41", nombre: 'BOLSA PAPEL # 1', precio: 3100, stock: 100, categoriaId: '5' },
  { id: "42", nombre: 'BOLSA PAPEL # 2', precio: 4200, stock: 100, categoriaId: '5' },
  { id: "43", nombre: 'BOLSA PAPEL # 3', precio: 5300, stock: 100, categoriaId: '5' },
  { id: "44", nombre: 'BOLSA PAPEL # 4', precio: 6300, stock: 100, categoriaId: '5' },
  { id: "45", nombre: 'BOLSA PAPEL # 6', precio: 9000, stock: 100, categoriaId: '5' },
  { id: "46", nombre: 'SACHET TOMATE 9GR X 102', precio: 7800, stock: 50, categoriaId: '6' },
  { id: "47", nombre: 'SACHET TOMATE 6 GR X 204', precio: 11400, stock: 50, categoriaId: '6' },
  { id: "48", nombre: 'SACHET MIEL 9GR X 102', precio: 7800, stock: 50, categoriaId: '6' },
  { id: "49", nombre: 'SACHET ROSADA 9GR X 102', precio: 11400, stock: 50, categoriaId: '6' },
  { id: "50", nombre: 'SALSA TOMATE X 4 K', precio: 25300, stock: 20, categoriaId: '6' },
  { id: "51", nombre: 'MAYONESA X 4 K', precio: 34000, stock: 20, categoriaId: '6' },
  { id: "52", nombre: 'CARNE DE HAMBURG 9GR X 10', precio: 12300, stock: 30, categoriaId: '6' },
  { id: "53", nombre: 'PATACON COCTELERO X 1000 GR', precio: 9600, stock: 40, categoriaId: '1' },
  { id: "54", nombre: 'PATACON MEDIANO X 1000 GR', precio: 9600, stock: 40, categoriaId: '1' },
  { id: "55", nombre: 'PATACON OVALADO X 1000 GR', precio: 9600, stock: 40, categoriaId: '1' },
  { id: "56", nombre: 'PATACON REDONDO X 1000 GR', precio: 9600, stock: 40, categoriaId: '1' },
  { id: "57", nombre: 'BOLSA T 20 LEC BIO-SOSTENIBLE', precio: 2800, stock: 100, categoriaId: '5' },
  { id: "58", nombre: 'BOLSA T-25 LEC R.U BIO-SOSTENIBLE', precio: 3600, stock: 100, categoriaId: '5' },
  { id: "59", nombre: 'BOLSA T-30 LEC ECONOMICA R.U BIO-SOSTENIBLE', precio: 5700, stock: 100, categoriaId: '5' },
  { id: "60", nombre: 'BOLSA T-35 LEC RESIST R.U BIO-SOSTENIBLE', precio: 7200, stock: 100, categoriaId: '5' },
  { id: "61", nombre: 'BOLSA T-40 LEC RESIST R.U BIO-SOSTENIBLE', precio: 8900, stock: 100, categoriaId: '5' },
  { id: "62", nombre: 'BOLSA T-50 LEC RESIST R.U BIO-SOSTENIBLE', precio: 11200, stock: 100, categoriaId: '5' },
  { id: "63", nombre: 'BOLSA T-60 RESIST R.U BIO-SOSTENIBLE', precio: 13500, stock: 100, categoriaId: '5' },
  { id: "64", nombre: 'BOLSA BIODEGRADABLE EXTRA RESISTANT', precio: 15000, stock: 50, categoriaId: '5' },
];

const categoriasSeed = [
  { id: '1', nombre: 'Snacks', descripcion: 'Snacks y papas fritas', icono: '🥔' },
  { id: '2', nombre: 'Ripios', descripcion: 'Ripios y mezclas', icono: '🌽' },
  { id: '3', nombre: 'Maíz', descripcion: 'Productos de maíz', icono: '🌾' },
  { id: '4', nombre: 'Tubérculos', descripcion: 'Yuca y otros tubérculos', icono: '🥕' },
  { id: '5', nombre: 'Empaques', descripcion: 'Empaques y bolsas', icono: '📦' },
  { id: '6', nombre: 'Condimentos', descripcion: 'Salsas y condimentos', icono: '🧂' },
];

async function main() {
  // Borrar datos existentes (en orden correcto de FK)
  console.log('🧹 Limpiando base de datos...');
  await prisma.orderItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('📦 Creando categorías...');
  for (const categoria of categoriasSeed) {
    await prisma.category.upsert({
      where: { id: categoria.id },
      update: {},
      create: categoria,
    });
  }

  console.log('🛍️ Creando productos...');
  for (const producto of productosJSON) {
    await prisma.product.upsert({
      where: { id: producto.id },
      update: {},
      create: {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId: producto.categoriaId,
        descripcion: `${producto.nombre} - Producto de calidad`,
      },
    });
  }

  // Mapeo de product id → ruta real en /assets/
  const imagenesProductos: Record<string, string> = {
    '1':  '/assets/papa_cafe_2.5kg_new.jpeg',
    '2':  '/assets/papa_nacional_2.5_new.jpeg',
    '3':  '/assets/PAPA_X_2_K_FARM FRITES.jpeg',
    '4':  '/assets/star frites 2k.jpeg',
    '5':  '/assets/crunch house 1k.jpeg',
    '6':  '/assets/papa_crunch_500gr_new.jpeg',
    '7':  '/assets/Ripio_papa.jpg',
    '8':  '/assets/sabrosura_del_campo_1kg.jpeg',
    '9':  '/assets/RIPIO_X_500_SABROSURA_DEL_CAMPO.jpeg',
    '10': '/assets/RIPIO_X_250_SABROSURA_DEL_CAMPO.jpeg',
    '11': '/assets/MAIZ_SAN_MIGUEL_X_1_K.jpeg',
    '12': '/assets/MAIZ_SAN_MIGUEL_X_500_gr.jpeg',
    '13': '/assets/MAIZ_A_GRANEL_SAN_MIGUEL_10_K.jpeg',
    '14': '/assets/MIX_VERDURAS_SAN_MIGUEL_X_500_GR.jpeg',
    '15': '/assets/YUCA_ALRICO_X_1k.jpeg',
    '16': '/assets/YUCA_ALRICO_X_500gr.jpeg',
    '17': '/assets/vinipel_20ts.jpeg',
    '18': '/assets/vinipel_50mts.jpeg',
    '19': '/assets/vinipel_100mts.jpeg',
    '20': '/assets/vinipel_300mts.jpeg',
    '21': '/assets/vinipel_300mts.jpeg',
    '22': '/assets/guantes_transparente_Hause.jpeg',
    '23': '/assets/guantes_nitrilo_negro_tm.jpeg',
    '24': '/assets/guantes_nitrilo_negro_tl.jpeg',
    '25': '/assets/lam_parafinada_15x15_regular_libra.jpeg',
    '26': '/assets/lam_parafinada_15x15_ecologica_libra.jpeg',
    '27': '/assets/LAM_PARAFINADA_30X30_COLOR_REGULAR.jpeg',
    '28': '/assets/papel_parafinado_ecologico_30x30.jpeg',
    '29': '/assets/rollo_parafinado_x10mts.jpeg',
    '30': '/assets/aluminio_7mts.jpeg',
    '31': '/assets/aluminio_16mts.jpeg',
    '32': '/assets/aluminio_40mts.jpeg',
    '33': '/assets/aluminio_100mts.jpeg',
    '34': '/assets/bolsa_metalizada_6x6.jpeg',
    '35': '/assets/bolsa_metalizada_7x10.jpeg',
    '36': '/assets/bolsa_metalizada_8x10.jpeg',
    '37': '/assets/bolsa_metalizada_8x10.jpeg',
    '38': '/assets/BOLSA_METALIZADA_10X14.jpeg',
    '39': '/assets/PORTA_HAMBURGUESA_CARTON.jpeg',
    '40': '/assets/PORTA_PERRO_CARTON.jpeg',
    '41': '/assets/bolsa_papel_1.jpeg',
    '42': '/assets/bolsa_papel2.jpeg',
    '43': '/assets/bolsa_papel_3.jpeg',
    '44': '/assets/bolsa_papel_4.jpeg',
    '45': '/assets/bolsa_papel_6.jpeg',
    '46': '/assets/sachet_salsa_tomate_9gr.jpeg',
    '47': '/assets/sachet_salsa_tomate_6gr.jpeg',
    '48': '/assets/sachet_miel.jpeg',
    '49': '/assets/sachet_salsa_rosada_9gr.jpeg',
    '50': '/assets/salsa_tomate_x4kg.jpeg',
    '51': '/assets/mayonesa_4kg.jpeg',
    '52': '/assets/CARNE_HAMBURGUESA_9GRX10.jpeg',
    '53': '/assets/patacon_coctelero.jpeg',
    '54': '/assets/patacon_mediano_1000gr.jpeg',
    '55': '/assets/patacon_ovalado_1000gr.jpeg',
    '56': '/assets/patacon_redondo_1000gr.jpeg',
    '57': '/assets/bolsa_t20_lec.jpeg',
    '58': '/assets/bolsa_t25_lec.jpeg',
    '59': '/assets/bolsa_t30_lec.jpeg',
    '60': '/assets/bolsa_t30_lec.jpeg',
    '61': '/assets/bolsa_t30_lec.jpeg',
    '62': '/assets/bolsa_t30_lec.jpeg',
    '63': '/assets/bolsa_t30_lec.jpeg',
    '64': '/assets/bolsa_biodegradable_extraresistente.png',
  };

  // Crear imágenes para los productos usando archivos reales en /assets/
  console.log('🖼️ Creando imágenes de productos...');
  let imagesCreated = 0;
  for (const producto of productosJSON) {
    try {
      const imageUrl = imagenesProductos[producto.id] ||
        `https://via.placeholder.com/300x300?text=${encodeURIComponent(producto.nombre.substring(0, 15))}`;
      await prisma.productImage.create({
        data: {
          productoId: producto.id,
          url: imageUrl,
          principal: true,
          orden: 1,
        },
      });
      imagesCreated++;
    } catch (error) {
      console.error(`Error creando imagen para producto ${producto.id}:`, error);
    }
  }
  console.log(`✓ ${imagesCreated} imágenes creadas`);

  // Crear usuarios de prueba
  console.log('👤 Creando usuarios...');
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedClientPassword = await bcrypt.hash('cliente123', 10);

  const adminUser = await prisma.user.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@inventory.com',
      password: hashedAdminPassword,
      telefono: '+57 315 5508228',
      rol: 'ADMIN',
      activo: true,
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      nombre: 'Cliente Prueba',
      email: 'cliente@inventory.com',
      password: hashedClientPassword,
      telefono: '+57 315 1234567',
      rol: 'CLIENTE',
      activo: true,
    },
  });

  // Crear direcciones por defecto para los usuarios
  console.log('📍 Creando direcciones de prueba...');
  await prisma.address.create({
    data: {
      usuarioId: adminUser.id,
      calle: 'Carrera 64 b',
      numero: '40-33',
      apartamento: 'Oficina 1',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      codigoPostal: '110111',
      pais: 'Colombia',
      esPrincipal: true,
    },
  });

  await prisma.address.create({
    data: {
      usuarioId: clientUser.id,
      calle: 'Carrera 64 b',
      numero: '40-33',
      apartamento: 'Apto 101',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      codigoPostal: '110111',
      pais: 'Colombia',
      esPrincipal: true,
    },
  });

  console.log('\n✅ ¡Seed completado exitosamente!');
  console.log(`✓ ${categoriasSeed.length} categorías creadas`);
  console.log(`✓ ${productosJSON.length} productos creados`);
  console.log(`✓ ${productosJSON.length} imágenes creadas`);
  console.log('✓ 2 usuarios creados con direcciones');
  console.log('\n📋 Credenciales de prueba:');
  console.log('  Admin: admin@inventory.com / admin123');
  console.log('  Cliente: cliente@inventory.com / cliente123');
  console.log('\n📍 Direcciones guardadas:');
  console.log('  Carrera 64 b #40-33, Bogotá, Cundinamarca');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
