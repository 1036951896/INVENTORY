// ===== SERVIDOR EXPRESS PARA INVENTORY APP =====

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde /public/html (raíz del navegador)
app.use(express.static(path.join(__dirname, '../public/html')));
// Servir assets desde /public/assets
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/data', express.static(path.join(__dirname, '../public/data')));
app.use('/config', express.static(path.join(__dirname, '../public/config')));

// Simular base de datos en memoria
let usuarios = [];
let productos = [];
let pedidos = [];

// ===== ENDPOINTS PRODUCTOS =====

// GET - Obtener todos los productos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// POST - Crear nuevo producto (solo admin)
app.post('/api/productos', (req, res) => {
  const { nombre, categoria, precio, stock, imagen, descripcion } = req.body;

  if (!nombre || !categoria || !precio || stock === undefined) {
    return res.status(400).json({ error: 'Campos requeridos incompletos' });
  }

  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    categoria,
    precio,
    stock,
    imagen: imagen || '/assets/product-placeholder.svg',
    descripcion,
    fechaCreacion: new Date()
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// PUT - Actualizar producto
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const producto = productos.find(p => p.id === parseInt(id));

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const { nombre, categoria, precio, stock, imagen, descripcion } = req.body;

  if (nombre) producto.nombre = nombre;
  if (categoria) producto.categoria = categoria;
  if (precio) producto.precio = precio;
  if (stock !== undefined) producto.stock = stock;
  if (imagen) producto.imagen = imagen;
  if (descripcion) producto.descripcion = descripcion;

  res.json(producto);
});

// DELETE - Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const productoEliminado = productos.splice(index, 1);
  res.json(productoEliminado[0]);
});

// ===== ENDPOINTS USUARIOS =====

// POST - Registro de cliente
app.post('/api/usuarios/registro', (req, res) => {
  const { nombre, apellido, email, telefono, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Campos requeridos incompletos' });
  }

  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  const nuevoUsuario = {
    id: 'USR-' + Date.now(),
    nombre: nombre + ' ' + apellido,
    email,
    telefono,
    password, // En producción: hashear la contraseña
    tipo: 'cliente',
    fechaRegistro: new Date()
  };

  usuarios.push(nuevoUsuario);
  res.status(201).json({
    mensaje: 'Usuario registrado exitosamente',
    usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email }
  });
});

// POST - Login de cliente
app.post('/api/usuarios/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json({
    mensaje: 'Inicio de sesión exitoso',
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, telefono: usuario.telefono },
    token: 'token-' + Date.now() // En producción: generar JWT
  });
});

// GET - Obtener todos los usuarios (solo admin)
app.get('/api/usuarios', (req, res) => {
  res.json(usuarios.map(u => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    telefono: u.telefono,
    tipo: u.tipo
  })));
});

// ===== ENDPOINTS PEDIDOS =====

// POST - Crear pedido
app.post('/api/pedidos', (req, res) => {
  const { cliente, email, items, total } = req.body;

  if (!cliente || !items || items.length === 0 || !total) {
    return res.status(400).json({ error: 'Datos de pedido incompletos' });
  }

  const nuevoPedido = {
    id: 'PED-' + Date.now(),
    cliente,
    email,
    items,
    total,
    estado: 'pendiente',
    fecha: new Date().toLocaleDateString('es-CO'),
    fechaCreacion: new Date()
  };

  pedidos.push(nuevoPedido);
  res.status(201).json(nuevoPedido);
});

// GET - Obtener todos los pedidos (admin)
app.get('/api/pedidos', (req, res) => {
  res.json(pedidos);
});

// GET - Obtener pedido por ID
app.get('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  res.json(pedido);
});

// PUT - Actualizar estado de pedido
app.put('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  const estadosValidos = ['pendiente', 'preparacion', 'entregado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  pedido.estado = estado;
  res.json(pedido);
});

// ===== ENDPOINTS REPORTES =====

// GET - Reporte de ventas
app.get('/api/reportes/ventas', (req, res) => {
  const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0);
  const cantidadPedidos = pedidos.length;
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;

  res.json({
    totalVentas,
    cantidadPedidos,
    pedidosPendientes,
    clientesUnicos: [...new Set(pedidos.map(p => p.email))].length
  });
});

// GET - Productos más vendidos
app.get('/api/reportes/productos-vendidos', (req, res) => {
  const productosVendidos = {};

  pedidos.forEach(pedido => {
    pedido.items.forEach(item => {
      if (!productosVendidos[item.id]) {
        productosVendidos[item.id] = {
          nombre: item.nombre,
          cantidad: 0,
          ingresos: 0
        };
      }
      productosVendidos[item.id].cantidad += item.cantidad;
      productosVendidos[item.id].ingresos += item.precio * item.cantidad;
    });
  });

  const resultado = Object.values(productosVendidos)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10);

  res.json(resultado);
});

// ===== RUTAS ESTÁTICAS =====

// Servir archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/admin.html'));
});

// ===== MANEJO DE ERRORES =====

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error del servidor' });
});

// ===== INICIAR SERVIDOR =====

// SPA Routing - Cualquier ruta HTML no reconocida que no sea API
app.use('*', (req, res) => {
  // Si es una API, retornar error 404 JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Ruta API no encontrada' });
  }
  
  // Para todo lo demás, servir index.html
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Servidor Inventory ejecutándose en puerto ${PORT}`);
  console.log(`\n📊 E-Commerce: http://localhost:${PORT}`);
  console.log(`🔧 Panel Admin: http://localhost:${PORT}/admin`);
  console.log(`\n📚 APIs disponibles en: /api/v1/*\n`);
});
