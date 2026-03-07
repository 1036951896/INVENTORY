import type { Product } from '../types';

// Datos completos de productos-imagenes.json (64 productos)
export const mockProducts: Product[] = [
  // Snacks (11 productos)
  { id: 1, nombre: 'PAPA CAFÉ X 2.5 FARM FRITES', precio: 22500, stock: 40, categoria: 'Snacks', descripcion: 'Papa café congelada de alta calidad', imagen: '/assets/papa_cafe_2.5kg_new.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, nombre: 'PAPA NACIONAL X 2.5', precio: 21600, stock: 40, categoria: 'Snacks', descripcion: 'Papa nacional congelada', imagen: '/assets/papa_nacional_2.5_new.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, nombre: 'PAPA X 2 K FARM FRITES', precio: 15000, stock: 40, categoria: 'Snacks', descripcion: 'Papa congelada Farm Frites 2kg', imagen: '/assets/PAPA_X_2_K_FARM FRITES.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, nombre: 'PAPA X 2 K STAR FRITES', precio: 15000, stock: 40, categoria: 'Snacks', descripcion: 'Papa congelada Star Frites 2kg', imagen: '/assets/star frites 2k.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, nombre: 'PAPA X 1 K CRUNCH HOUSE', precio: 9700, stock: 40, categoria: 'Snacks', descripcion: 'Papa crujiente Crunch House 1kg', imagen: '/assets/crunch house 1k.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, nombre: 'PAPA X 500 CRUNCH HOUSE', precio: 5400, stock: 40, categoria: 'Snacks', descripcion: 'Papa crujiente Crunch House 500g', imagen: '/assets/papa_crunch_500gr_new.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 58, nombre: 'PATACON COCTELERO X 1000 GR', precio: 9600, stock: 40, categoria: 'Snacks', descripcion: 'Patacón coctelero congelado', imagen: '/assets/patacon_coctelero.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 59, nombre: 'PATACON MEDIANO X 1000 GR', precio: 9600, stock: 40, categoria: 'Snacks', descripcion: 'Patacón mediano congelado', imagen: '/assets/patacon_mediano_1000gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 60, nombre: 'PATACON OVALADO X 1000 GR', precio: 9600, stock: 40, categoria: 'Snacks', descripcion: 'Patacón ovalado congelado', imagen: '/assets/patacon_ovalado_1000gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 61, nombre: 'PATACON REDONDO X 1000 GR', precio: 9600, stock: 40, categoria: 'Snacks', descripcion: 'Patacón redondo congelado', imagen: '/assets/patacon_redondo_1000gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 65, nombre: 'PATACON REDONDO X 100 GR', precio: 1500, stock: 80, categoria: 'Snacks', descripcion: 'Patacón redondo pequeño', imagen: '/assets/patacon_redondo_100gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },

  // Ripios (4 productos)
  { id: 7, nombre: 'RIPIO SAN MIGUEL X 1 K', precio: 9000, stock: 40, categoria: 'Ripios', descripcion: 'Ripio de papa San Miguel 1kg', imagen: '/assets/Ripio_papa.jpg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, nombre: 'RIPIO X 1 K SABROSURA DEL CAMPO', precio: 8000, stock: 40, categoria: 'Ripios', descripcion: 'Ripio Sabrosura del Campo 1kg', imagen: '/assets/sabrosura_del_campo_1kg.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 9, nombre: 'RIPIO X 500 SABROSURA DEL CAMPO', precio: 5500, stock: 40, categoria: 'Ripios', descripcion: 'Ripio Sabrosura del Campo 500g', imagen: '/assets/RIPIO_X_500_SABROSURA_DEL_CAMPO.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 10, nombre: 'RIPIO X 250 SABROSURA DEL CAMPO', precio: 3500, stock: 40, categoria: 'Ripios', descripcion: 'Ripio Sabrosura del Campo 250g', imagen: '/assets/RIPIO_X_250_SABROSURA_DEL_CAMPO.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },

  // Maíz (4 productos)
  { id: 11, nombre: 'MAIZ SAN MIGUEL X 1 K', precio: 8700, stock: 40, categoria: 'Maíz', descripcion: 'Maíz congelado San Miguel 1kg', imagen: '/assets/MAIZ_SAN_MIGUEL_X_1_K.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 12, nombre: 'MAIZ SAN MIGUEL X 500 GR', precio: 4700, stock: 40, categoria: 'Maíz', descripcion: 'Maíz congelado San Miguel 500g', imagen: '/assets/MAIZ_SAN_MIGUEL_X_500_gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 13, nombre: 'MAIZ A GRANEL SAN MIGUEL X 10 K', precio: 80000, stock: 35, categoria: 'Maíz', descripcion: 'Maíz congelado a granel 10kg', imagen: '/assets/MAIZ_A_GRANEL_SAN_MIGUEL_10_K.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 14, nombre: 'MIX VERDURAS SAN MIGUEL X 500 GR', precio: 4700, stock: 40, categoria: 'Maíz', descripcion: 'Mix de verduras congeladas 500g', imagen: '/assets/MIX_VERDURAS_SAN_MIGUEL_X_500_GR.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },

  // Tubérculos (2 productos)
  { id: 15, nombre: 'YUCA ALRICO X 1 K', precio: 6900, stock: 40, categoria: 'Tubérculos', descripcion: 'Yuca congelada Alrico 1kg', imagen: '/assets/YUCA_ALRICO_X_1k.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 16, nombre: 'YUCA ALRICO X 500 GR', precio: 3800, stock: 40, categoria: 'Tubérculos', descripcion: 'Yuca congelada Alrico 500g', imagen: '/assets/YUCA_ALRICO_X_500gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },

  // Empaques (30 productos)
  { id: 17, nombre: 'VINIPEL 20 MTS', precio: 1500, stock: 80, categoria: 'Empaques', descripcion: 'Rollo de vinipel 20 metros', imagen: '/assets/vinipel_20ts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 18, nombre: 'VINILPEX X50 MTS', precio: 2700, stock: 80, categoria: 'Empaques', descripcion: 'Rollo de vinipel 50 metros', imagen: '/assets/vinipel_50mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 19, nombre: 'VINILPEX X100 MTS', precio: 4700, stock: 80, categoria: 'Empaques', descripcion: 'Rollo de vinipel 100 metros', imagen: '/assets/vinipel_100mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 20, nombre: 'VINILPEX X 300 MTS LARGO', precio: 8700, stock: 50, categoria: 'Empaques', descripcion: 'Rollo de vinipel 300 metros', imagen: '/assets/vinipel_300mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 24, nombre: 'LAM PARAFINADA 15X15 REGULAR LIBRA', precio: 9700, stock: 40, categoria: 'Empaques', descripcion: 'Lámina parafinada 15x15 regular', imagen: '/assets/lam_parafinada_15x15_regular_libra.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 25, nombre: 'LAM PARAFINADA 15X15 ECOLOGICA LIBRA', precio: 7800, stock: 40, categoria: 'Empaques', descripcion: 'Lámina parafinada 15x15 ecológica', imagen: '/assets/lam_parafinada_15x15_ecologica_libra.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 26, nombre: 'LAM PARAFINADA 15X15 COLOR REGULAR', precio: 9700, stock: 40, categoria: 'Empaques', descripcion: 'Lámina parafinada 15x15 color', imagen: '/assets/LAM_PARAFINADA_30X30_COLOR_REGULAR.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 27, nombre: 'LAM PARAFINADA 30X30 COLOR REGULAR', precio: 9700, stock: 40, categoria: 'Empaques', descripcion: 'Lámina parafinada 30x30 color', imagen: '/assets/LAM_PARAFINADA_30X30_COLOR_REGULAR.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 28, nombre: 'LAM PARAFINADA 30X30 ECOLOGICA', precio: 7800, stock: 40, categoria: 'Empaques', descripcion: 'Lámina parafinada 30x30 ecológica', imagen: '/assets/papel_parafinado_ecologico_30x30.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 29, nombre: 'ROLLO PARAFINADO X 50 MTS', precio: 17400, stock: 40, categoria: 'Empaques', descripcion: 'Rollo parafinado 50 metros', imagen: '/assets/rollo_parafinado_x10mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 30, nombre: 'ROLLO PARAFINADO X 10 MTS', precio: 2800, stock: 40, categoria: 'Empaques', descripcion: 'Rollo parafinado 10 metros', imagen: '/assets/rollo_parafinado_x10mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 31, nombre: 'ALUMINIO 7 MTS', precio: 2500, stock: 40, categoria: 'Empaques', descripcion: 'Rollo de aluminio 7 metros', imagen: '/assets/aluminio_7mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 32, nombre: 'ALUMINIO 16 MTS', precio: 4700, stock: 40, categoria: 'Empaques', descripcion: 'Rollo de aluminio 16 metros', imagen: '/assets/aluminio_16mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 33, nombre: 'ALUMINIO 40 MTS', precio: 9500, stock: 40, categoria: 'Empaques', descripcion: 'Rollo de aluminio 40 metros', imagen: '/assets/aluminio_40mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 34, nombre: 'ALUMINIO 100 MTS', precio: 23000, stock: 40, categoria: 'Empaques', descripcion: 'Rollo de aluminio 100 metros', imagen: '/assets/aluminio_100mts.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 35, nombre: 'BOLSA METALIZADA 6X6 ABTA', precio: 1900, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa metalizada 6x6 cm', imagen: '/assets/bolsa_metalizada_6x6.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 36, nombre: 'BOLSA METALIZADA 7X10', precio: 3500, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa metalizada 7x10 cm', imagen: '/assets/bolsa_metalizada_7x10.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 37, nombre: 'BOLSA METALIZADA 8X10', precio: 3900, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa metalizada 8x10 cm', imagen: '/assets/bolsa_metalizada_8x10.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 38, nombre: 'BOLSA METALIZADA 8X12', precio: 4800, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa metalizada 8x12 cm', imagen: '/assets/bolsa_metalizada_8x10.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 39, nombre: 'BOLSA METALIZADA 10X14', precio: 6900, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa metalizada 10x14 cm', imagen: '/assets/BOLSA_METALIZADA_10X14.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 40, nombre: 'PORTA HAMBURGUESA CARTON', precio: 9000, stock: 40, categoria: 'Empaques', descripcion: 'Porta hamburguesa de cartón', imagen: '/assets/PORTA_HAMBURGUESA_CARTON.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 41, nombre: 'PORTA PERRO CARTON', precio: 9000, stock: 40, categoria: 'Empaques', descripcion: 'Porta perro caliente de cartón', imagen: '/assets/PORTA_PERRO_CARTON.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 42, nombre: 'SERVILLETA NUBE X 300', precio: 3600, stock: 40, categoria: 'Empaques', descripcion: 'Servilletas Nube paquete x300', imagen: '/assets/SERVILLETA_NUBE.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 43, nombre: 'SERVILLETA MIA 1 A 1 X 200', precio: 2500, stock: 40, categoria: 'Empaques', descripcion: 'Servilletas Mía paquete x200', imagen: '/assets/SERVILLETA_MIA_X200.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 44, nombre: 'TOHALLA MANO X 150', precio: 7600, stock: 40, categoria: 'Empaques', descripcion: 'Toalla de mano rollo x150', imagen: '/assets/TOALLA_MANOS_X150.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 45, nombre: 'TOHALLA COCINA X 120', precio: 5720, stock: 40, categoria: 'Empaques', descripcion: 'Toalla de cocina rollo x120', imagen: '/assets/TOALLA_COCINA_X120.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 46, nombre: 'BOLSA PAPEL # 1', precio: 3100, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa de papel tamaño #1', imagen: '/assets/bolsa_papel_1.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 47, nombre: 'BOLSA PAPEL # 2', precio: 4200, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa de papel tamaño #2', imagen: '/assets/bolsa_papel2.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 48, nombre: 'BOLSA PAPEL # 3', precio: 5300, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa de papel tamaño #3', imagen: '/assets/bolsa_papel_3.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 49, nombre: 'BOLSA PAPEL # 4', precio: 6300, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa de papel tamaño #4', imagen: '/assets/bolsa_papel_4.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 50, nombre: 'BOLSA PAPEL # 6', precio: 9000, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa de papel tamaño #6', imagen: '/assets/bolsa_papel_6.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 62, nombre: 'BOLSA T 20 LEC BIO-SOSTENIBLE', precio: 2800, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa biodegradable T20', imagen: '/assets/bolsa_t20_lec.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 63, nombre: 'BOLSA T-25 LEC R.U BIO-SOSTENIBLE', precio: 3600, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa biodegradable T25', imagen: '/assets/bolsa_t25_lec.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 64, nombre: 'BOLSA T-30 LEC ECONOMICA R.U BIO-SOSTENIBLE', precio: 5700, stock: 40, categoria: 'Empaques', descripcion: 'Bolsa biodegradable T30', imagen: '/assets/bolsa_t30_lec.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },

  // Guantes (3 productos)
  { id: 21, nombre: 'GUANTES PLASTICOS TRANSPARENTE HAUSE', precio: 1670, stock: 40, categoria: 'Guantes', descripcion: 'Guantes plásticos transparentes', imagen: '/assets/guantes_transparente_Hause.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 22, nombre: 'GUANTES NITRILO NEGRO T M HAUSE', precio: 21600, stock: 40, categoria: 'Guantes', descripcion: 'Guantes de nitrilo negro talla M', imagen: '/assets/guantes_nitrilo_negro_tm.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 23, nombre: 'GUANTES NITRILO NEGRO T L HAUSE', precio: 21600, stock: 40, categoria: 'Guantes', descripcion: 'Guantes de nitrilo negro talla L', imagen: '/assets/guantes_nitrilo_negro_tl.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },

  // Condimentos (6 productos)
  { id: 51, nombre: 'SACHET TOMATE 9GR X 102', precio: 7800, stock: 40, categoria: 'Condimentos', descripcion: 'Sachet salsa tomate 9gr x102 unidades', imagen: '/assets/sachet_salsa_tomate_9gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 52, nombre: 'SACHET TOMATE 6 GR X 204', precio: 11400, stock: 40, categoria: 'Condimentos', descripcion: 'Sachet salsa tomate 6gr x204 unidades', imagen: '/assets/sachet_salsa_tomate_6gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 53, nombre: 'SACHET MIEL 9GR X 102', precio: 7800, stock: 40, categoria: 'Condimentos', descripcion: 'Sachet miel 9gr x102 unidades', imagen: '/assets/sachet_miel.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 54, nombre: 'SACHET ROSADA 9GR X 102', precio: 11400, stock: 40, categoria: 'Condimentos', descripcion: 'Sachet salsa rosada 9gr x102 unidades', imagen: '/assets/sachet_salsa_rosada_9gr.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 55, nombre: 'SALSA TOMATE X 4 K', precio: 25300, stock: 40, categoria: 'Condimentos', descripcion: 'Salsa de tomate galón 4kg', imagen: '/assets/salsa_tomate_x4kg.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 56, nombre: 'MAYONESA X 4 K', precio: 34000, stock: 40, categoria: 'Condimentos', descripcion: 'Mayonesa galón 4kg', imagen: '/assets/mayonesa_4kg.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },

  // Carnes (1 producto)
  { id: 57, nombre: 'CARNE DE HAMBURG 9GR X 10', precio: 12300, stock: 40, categoria: 'Carnes', descripcion: 'Carne de hamburguesa 90gr x10 unidades', imagen: '/assets/CARNE_HAMBURGUESA_9GRX10.jpeg', activo: true, createdAt: new Date(), updatedAt: new Date() },
];
