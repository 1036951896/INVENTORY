// ===== DATOS DE DEMOSTRACIÓN PARA PRUEBAS =====
// Ejecuta este script en la consola del navegador para cargar datos de prueba

// Limpiar datos anteriores
localStorage.clear();

// Crear usuarios de prueba
const usuarios = [
  {
    id: 'USR-001',
    nombre: 'Juan García',
    email: 'juan@example.com',
    telefono: '+506 2234-5678',
    password: 'pass123',
    tipo: 'cliente',
    fechaRegistro: '10/01/2026'
  },
  {
    id: 'USR-002',
    nombre: 'María López',
    email: 'maria@example.com',
    telefono: '+506 8765-4321',
    password: 'pass123',
    tipo: 'cliente',
    fechaRegistro: '09/01/2026'
  },
  {
    id: 'USR-003',
    nombre: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    telefono: '+506 7654-3210',
    password: 'pass123',
    tipo: 'cliente',
    fechaRegistro: '08/01/2026'
  }
];

// Crear productos de prueba
const productos = [
  {
    id: 1,
    nombre: 'Gaseosa Cola 2L',
    categoria: 'bebidas',
    precio: 51000,
    stock: 45,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Gaseosa tipo cola refrescante de 2 litros'
  },
  {
    id: 2,
    nombre: 'Jugo Natural Naranja 1L',
    categoria: 'bebidas',
    precio: 35000,
    stock: 60,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Jugo 100% natural de naranja, sin conservantes'
  },
  {
    id: 3,
    nombre: 'Papas Fritas Clásicas',
    categoria: 'snacks',
    precio: 21000,
    stock: 120,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Crujientes papas fritas sabor clásico, bolsa de 150g'
  },
  {
    id: 4,
    nombre: 'Chocolate Oscuro 100g',
    categoria: 'snacks',
    precio: 27000,
    stock: 80,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Chocolate oscuro premium de alta calidad'
  },
  {
    id: 5,
    nombre: 'Detergente Multiusos 2L',
    categoria: 'limpieza',
    precio: 39000,
    stock: 70,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Detergente potente para limpiar pisos y superficies'
  },
  {
    id: 6,
    nombre: 'Desinfectante Spray 500ml',
    categoria: 'limpieza',
    precio: 32000,
    stock: 90,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Spray desinfectante antibacterial de acción rápida'
  },
  {
    id: 7,
    nombre: 'Jabón Líquido Manos 250ml',
    categoria: 'higiene',
    precio: 17000,
    stock: 150,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Jabón líquido suave para manos, aroma fresco'
  },
  {
    id: 8,
    nombre: 'Papel Higiénico Pack 12',
    categoria: 'higiene',
    precio: 57000,
    stock: 200,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Pack de 12 rollos de papel higiénico de alta resistencia'
  },
  {
    id: 9,
    nombre: 'Galletas Integrales 400g',
    categoria: 'snacks',
    precio: 29000,
    stock: 55,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Galletas integrales crujientes, fuente de fibra'
  },
  {
    id: 10,
    nombre: 'Leche Entera 1L',
    categoria: 'bebidas',
    precio: 24000,
    stock: 85,
    imagen: '../assets/product-placeholder.svg',
    descripcion: 'Leche pasteurizada entera, fresca y deliciosa'
  }
];

// Crear pedidos de prueba
const pedidos = [
  {
    id: 'PED-1704067200000',
    cliente: 'Juan García',
    email: 'juan@example.com',
    fecha: '01/01/2026',
    items: [
      { id: 1, nombre: 'Gaseosa Cola 2L', precio: 51000, cantidad: 2, imagen: '../assets/product-placeholder.svg' },
      { id: 3, nombre: 'Papas Fritas', precio: 21000, cantidad: 1, imagen: '../assets/product-placeholder.svg' }
    ],
    total: 123000,
    estado: 'entregado'
  },
  {
    id: 'PED-1704153600000',
    cliente: 'María López',
    email: 'maria@example.com',
    fecha: '02/01/2026',
    items: [
      { id: 5, nombre: 'Detergente', precio: 39000, cantidad: 1, imagen: '../assets/product-placeholder.svg' },
      { id: 7, nombre: 'Jabón Líquido', precio: 17000, cantidad: 2, imagen: '../assets/product-placeholder.svg' }
    ],
    total: 73000,
    estado: 'preparacion'
  },
  {
    id: 'PED-1704240000000',
    cliente: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    fecha: '03/01/2026',
    items: [
      { id: 2, nombre: 'Jugo Natural', precio: 35000, cantidad: 2, imagen: '../assets/product-placeholder.svg' }
    ],
    total: 70000,
    estado: 'pendiente'
  },
  {
    id: 'PED-1704326400000',
    cliente: 'Juan García',
    email: 'juan@example.com',
    fecha: '04/01/2026',
    items: [
      { id: 4, nombre: 'Chocolate', precio: 27000, cantidad: 3, imagen: '../assets/product-placeholder.svg' },
      { id: 8, nombre: 'Papel Higiénico', precio: 57000, cantidad: 1, imagen: '../assets/product-placeholder.svg' }
    ],
    total: 138000,
    estado: 'entregado'
  }
];

// Guardar en localStorage
localStorage.setItem('usuarios', JSON.stringify(usuarios));
localStorage.setItem('productos-admin', JSON.stringify(productos));
localStorage.setItem('pedidos', JSON.stringify(pedidos));

// Crear carrito de prueba vacío
localStorage.setItem('carrito', JSON.stringify([]));

console.log('✓ Datos de demostración cargados exitosamente!');
console.log('');
console.log('📋 Usuarios registrados:');
usuarios.forEach(u => {
  console.log(`  - ${u.nombre} (${u.email})`);
});
console.log('');
console.log('📦 Productos en catálogo:', productos.length);
console.log('🚚 Pedidos cargados:', pedidos.length);
console.log('');
console.log('Puedes ahora:');
console.log('  1. Iniciar sesión con juan@example.com / pass123');
console.log('  2. Explorar el catálogo de productos');
console.log('  3. Agregar productos al carrito');
console.log('  4. Ver pedidos en el panel admin');
console.log('');
console.log('¡Listo para probar la aplicación! 🎉');
