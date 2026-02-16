// Lock para evitar ejecuciones concurrentes de actualizarDashboard
let dashboardUpdating = false;

// ===== PANEL ADMINISTRADOR =====
// URL base del backend
const BACKEND_URL = window.BACKEND_URL || 'http://localhost:3000';
const API_URL = BACKEND_URL + '/api/v1';

// Normaliza la URL de la imagen para rutas relativas o absolutas
function normalizarImagenUrlAdmin(url) {
  if (!url) return '../assets/product-placeholder.svg';
  if (url.startsWith('http')) return url;
  // Si la ruta es relativa, asegúrate de que apunte a la carpeta correcta
  if (url.startsWith('/')) return '..' + url;
  return '../assets/' + url;
}

// Validar permisos de administrador
function validarPermisosAdmin(permisoRequerido) {
  const adminUsuario = JSON.parse(localStorage.getItem('admin-usuario') || '{}');
  return adminUsuario.permisos && adminUsuario.permisos[permisoRequerido];
}

// Cargar productos desde el backend (API REST)
async function cargarProductosFromJSON() {
  try {
    // Validar que el usuario tiene permisos para ver productos
    if (!validarPermisosAdmin('ver_productos')) {
      console.warn('❌ Permisos insuficientes para ver productos');
      return [];
    }
    
    const token = localStorage.getItem('admin-token') || '';
    
    // Intentar cargar desde el backend API primero
    console.log('🔍 Cargando productos desde el backend...');
    const response = await fetch(`${BACKEND_URL}/api/v1/products?page=1&limit=1000`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('📦 Respuesta del backend:', data);
      
      // Manejar tanto respuesta con {data: [...]} como respuesta directa [...]
      let productosArray = Array.isArray(data) ? data : (data.data || []);
      
      console.log('🔢 Total de productos recibidos:', productosArray.length);
      
      const productos = productosArray.map(prod => ({
        id: String(prod.id),
        nombre: prod.nombre,
        categoria: prod.categoria?.nombre || prod.categoriaId || '',
        categoriaId: prod.categoriaId,  // Incluir el ID para editar
        precio: prod.precio,
        stock: prod.stock,
        imagen: normalizarImagenUrlAdmin(prod.imagen || prod.imagenes?.[0]?.url),
        descripcion: prod.descripcion || prod.nombre
      }));
      console.log('✅ Productos del backend cargados:', productos.length);
      return productos;
    } else if (response.status === 401) {
      console.warn('⚠️ Token inválido o expirado. Usando JSON local como fallback.');
    } else {
      console.warn(`⚠️ Error del backend (${response.status}). Intentando JSON local como fallback.`);
    }
    
    // Fallback: cargar desde JSON local si el backend no responde
    console.log('🔍 Cargando productos desde JSON local...');
    const responseLocal = await fetch('../data/productos-imagenes.json');
    if (responseLocal.ok) {
      const dataLocal = await responseLocal.json();
      console.log('✅ Productos del JSON cargados:', dataLocal.productos.length);
      return dataLocal.productos.map(prod => ({
        id: String(prod.id),
        nombre: prod.nombre,
        categoria: prod.categoria || '',
        precio: prod.precio,
        stock: prod.stock,
        imagen: normalizarImagenUrlAdmin(prod.imagen),
        descripcion: prod.descripcion || prod.nombre
      }));
    }
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
  }
  // Si falla, retornar vacío
  return [];
}

// Inicialización automática al cargar la página admin
document.addEventListener('DOMContentLoaded', function() {
  // Validar token y permisos antes de proceder
  const adminToken = localStorage.getItem('admin-token');
  const adminUsuarioRaw = localStorage.getItem('admin-usuario');
  console.log('🔍 DEBUG Admin.js - Token:', adminToken, 'Usuario Raw:', adminUsuarioRaw);
  
  let adminUsuario = {};
  try {
    adminUsuario = adminUsuarioRaw ? JSON.parse(adminUsuarioRaw) : {};
  } catch (e) {
    console.error('❌ Error parsing admin-usuario:', e);
    localStorage.removeItem('admin-usuario');
  }
  
  console.log('🔍 DEBUG - Has token:', !!adminToken, 'Has permisos:', !!adminUsuario.permisos);
  
  if (!adminToken || !adminUsuario.permisos) {
    console.warn('⚠️ No hay token de administrador o permisos insuficientes. Redirigiendo a login...');
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-usuario');
    window.location.href = 'login-admin.html';
    return;
  }
  
  console.log('✅ Admin autenticado. Cargando dashboard...');
  
  // Configurar nombre de usuario en la interfaz
  const nombreUsuarioEl = document.getElementById('nombre-usuario');
  if (nombreUsuarioEl) {
    nombreUsuarioEl.textContent = adminUsuario.nombre || 'Administrador';
  }
  
  cargarDatosAdmin();
  configurarMenu();
  
  // Asegurar que el dashboard se muestra por defecto
  document.getElementById('seccion-dashboard').style.display = 'block';
  document.getElementById('titulo-seccion').textContent = 'Dashboard';
  document.querySelectorAll('.menu-lateral-enlace').forEach(e => e.classList.remove('activo'));
  document.querySelector('a[data-seccion="dashboard"]').classList.add('activo');
  // Actualización automática de pedidos y dashboard cada 10 segundos SOLO si hay cambios
  let lastUpdateTime = Date.now();
  setInterval(() => {
    const now = Date.now();
    // Evitar actualización demasiado frecuente
    if (now - lastUpdateTime < 8000) return;
    lastUpdateTime = now;
    
    cargarDatosAdmin();
    // Si la sección de pedidos está visible, recargar la tabla
    const seccionPedidos = document.getElementById('seccion-pedidos');
    if (seccionPedidos && typeof seccionPedidos.style !== 'undefined' && (seccionPedidos.style.display !== 'none' || seccionPedidos.classList.contains('activa'))) {
      cargarTablaPedidos();
    }
    // Si el dashboard está visible, actualizarlo
    const seccionDashboard = document.getElementById('seccion-dashboard');
    if (seccionDashboard && typeof seccionDashboard.style !== 'undefined' && (seccionDashboard.style.display !== 'none' || seccionDashboard.classList.contains('activa'))) {
      actualizarDashboard();
    }
  }, 10000);

  // Cargar categorías para el formulario de productos
  cargarCategoriasAdmin();

  // Configurar listener del formulario de producto
  const formProducto = document.getElementById('form-producto');
  if (formProducto) {
    formProducto.addEventListener('submit', function(e) {
      e.preventDefault();
      guardarProducto();
    });
  }
});

// Helper para obtener credenciales admin
async function getAdminCredenciales() {
  try {
    const stored = localStorage.getItem('admin-cred');
    if (stored) return JSON.parse(stored);
    const resp = await fetch('../config/admin.json');
    if (resp.ok) return await resp.json();
  } catch (e) {
    console.error('Error obteniendo credenciales admin', e);
  }
  return null;
}
// Exponer la función para scripts inline
window.getAdminCredenciales = getAdminCredenciales;

// Cargar datos del inventario real
async function cargarDatosAdmin() {
  try {
    // Cargar productos desde JSON o backend
    productosAdmin = await cargarProductosFromJSON();
    // Cargar pedidos reales desde la API REST
    // Configuración flexible de la URL del backend
    // ...existing code...
    let pedidosRespOk = false;
    try {
      const respPedidos = await fetch(`${BACKEND_URL}/api/v1/orders`, {
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('admin-token') || '')
        }
      });
      if (respPedidos.ok) {
        const pedidosData = await respPedidos.json();
        // El backend retorna directamente un array, no un objeto con propiedad 'data'
        pedidosAdmin = Array.isArray(pedidosData) ? pedidosData : (Array.isArray(pedidosData.data) ? pedidosData.data : []);
        console.log('Pedidos cargados:', pedidosAdmin);
        pedidosRespOk = true;
      } else {
        pedidosAdmin = [];
        if (!window._errorPedidosShown) {
          console.error('No se pudieron cargar los pedidos reales. Status:', respPedidos.status);
          window._errorPedidosShown = true;
        }
      }
    } catch (err) {
      pedidosAdmin = [];
      if (!window._errorPedidosShown) {
        console.error('No se pudo conectar al backend de pedidos:', err);
        window._errorPedidosShown = true;
      }
    }
    // Consultar usuarios desde el backend
    try {
      const respUsuarios = await fetch(`${BACKEND_URL}/api/v1/users`, {
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('admin-token') || '')
        }
      });
      usuariosAdmin = respUsuarios.ok ? await respUsuarios.json() : [];
    } catch (err) {
      usuariosAdmin = [];
      console.error('No se pudieron cargar los usuarios reales:', err);
    }
    productosAdmin = productosAdmin.map(p => ({ ...p, imagen: normalizarImagenUrlAdmin(p.imagen) }));
    cargarTablaProductos();
    // Las siguientes llamadas deben estar fuera de cualquier bloque de gráficos
    cargarTablaPedidos();
    cargarTablaUsuarios();
  } catch (e) {
    console.error('Error cargando inventario real:', e);
    productosAdmin = [];
    cargarTablaProductos();
  }
}

// Configurar menú
function configurarMenu() {
  const enlaces = document.querySelectorAll('.menu-lateral-enlace');
  
  enlaces.forEach(enlace => {
    enlace.addEventListener('click', function(e) {
      e.preventDefault();
      
      const seccion = this.getAttribute('data-seccion');
      
      // Actualizar enlace activo
      document.querySelectorAll('.menu-lateral-enlace').forEach(e => e.classList.remove('activo'));
      this.classList.add('activo');
      
      // Mostrar sección
      document.querySelectorAll('.seccion-contenido').forEach(s => s.style.display = 'none');
      document.getElementById('seccion-' + seccion).style.display = 'block';
      
      // Actualizar título
      const titulos = {
        dashboard: 'Dashboard',
        productos: 'Gestión de Productos',
        categorias: 'Categorías',
        pedidos: 'Gestión de Pedidos',
        usuarios: 'Gestión de Usuarios',
        reportes: 'Reportes',
        notificaciones: 'Notificaciones',
        ofertas: 'Gestión de Ofertas',
        configuracion: 'Configuración'
      };
      
      document.getElementById('titulo-seccion').textContent = titulos[seccion] || 'Dashboard';
      
        // Actualizar tablas al cambiar de sección
        if (seccion === 'pedidos') cargarTablaPedidos();
        if (seccion === 'usuarios') cargarTablaUsuarios();
        if (seccion === 'categorias') mostrarCategoriasConProductos();
        if (seccion === 'notificaciones') actualizarTablaNotificaciones('todas');
        if (seccion === 'reportes') generarReporteInventario();
        if (seccion === 'ofertas') cargarTablaOfertas();
    });
  });
}

// Actualizar Dashboard

// Variables para los gráficos
window.chartVentas = null;
window.chartInventario = null;
window.chartVentasMes = null;
window.chartCategorias = null;

function actualizarDashboard() {
  const totalVentas = pedidosAdmin.reduce((sum, p) => sum + (p.total || 0), 0);
  const totalProductos = productosAdmin.length;
  const pedidosPendientes = pedidosAdmin.filter(p => p.estado === 'PENDIENTE').length;
  const pedidosEnPreparacion = pedidosAdmin.filter(p => p.estado === 'EN_PREPARACION').length;
  const pedidosEntregados = pedidosAdmin.filter(p => p.estado === 'ENTREGADO').length;
  const totalClientes = usuariosAdmin.length;
  const productosSinStock = productosAdmin.filter(p => p.stock === 0).length;

  const ventasElem = document.getElementById('total-ventas');
  if (ventasElem) ventasElem.textContent = '$' + totalVentas.toLocaleString('es-CO');
  const prodElem = document.getElementById('total-productos');
  if (prodElem) prodElem.textContent = totalProductos;
  const pedidosElem = document.getElementById('pedidos-pendientes');
  if (pedidosElem) pedidosElem.textContent = pedidosPendientes;
  const clientesElem = document.getElementById('total-clientes');
  if (clientesElem) clientesElem.textContent = totalClientes;
  
  // Actualizar más estadísticas si existen en el HTML
  const statEnPreparacion = document.getElementById('stat-en-preparacion');
  if (statEnPreparacion) {
    statEnPreparacion.innerHTML = `<div class="stat-icono"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m0 5.08l-4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24M19.78 19.78l-4.24-4.24m0-5.08l4.24-4.24M23 12h-6m-6 0H5M19.78 4.22l-4.24 4.24m-5.08 0l-4.24-4.24"></path></svg></div><div class="stat-valor">${pedidosEnPreparacion}</div><div class="stat-etiqueta">En Preparación</div>`;
  }
  const statEntregados = document.getElementById('stat-entregados');
  if (statEntregados) {
    statEntregados.innerHTML = `<div class="stat-icono"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><polyline points="20 6 9 17 4 12"></polyline></svg></div><div class="stat-valor">${pedidosEntregados}</div><div class="stat-etiqueta">Entregados</div>`;
  }
  const statSinStock = document.getElementById('stat-sin-stock');
  if (statSinStock) {
    statSinStock.innerHTML = `<div class="stat-icono"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div><div class="stat-valor">${productosSinStock}</div><div class="stat-etiqueta">Sin Stock</div>`;
  }

  // Destruir gráficos previos si existen
  if (dashboardUpdating) return;
  dashboardUpdating = true;
  try {
    if (window.chartVentas && typeof window.chartVentas.destroy === 'function') { window.chartVentas.destroy(); window.chartVentas = null; }
    if (window.chartInventario && typeof window.chartInventario.destroy === 'function') { window.chartInventario.destroy(); window.chartInventario = null; }
    if (window.chartVentasMes && typeof window.chartVentasMes.destroy === 'function') { window.chartVentasMes.destroy(); window.chartVentasMes = null; }
    if (window.chartCategorias && typeof window.chartCategorias.destroy === 'function') { window.chartCategorias.destroy(); window.chartCategorias = null; }

    // Gráfico de ventas por producto
    // Destruir el gráfico y esperar un ciclo antes de crear el nuevo
    const oldCanvasVentas = document.getElementById('grafico-ventas');
    if (window.chartVentas && typeof window.chartVentas.destroy === 'function') {
      window.chartVentas.destroy();
      window.chartVentas = null;
    }
    if (oldCanvasVentas) {
      setTimeout(() => {
        window.chartVentas = new Chart(oldCanvasVentas, {
          type: 'bar',
          data: {
            labels: productosAdmin.slice(0, 5).map(p => p.nombre),
            datasets: [{
              label: 'Ventas (en unidades)',
              data: productosAdmin.slice(0, 5).map(() => Math.floor(Math.random() * 100)),
              backgroundColor: '#B6E1F2',
              borderColor: '#386273',
              borderWidth: 2
            }]
          },
          options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
      }, 0);
    }
    const oldCanvasInventario = document.getElementById('grafico-inventario');
    if (window.chartInventario && typeof window.chartInventario.destroy === 'function') {
      window.chartInventario.destroy();
      window.chartInventario = null;
    }
    if (oldCanvasInventario) {
      setTimeout(() => {
        window.chartInventario = new Chart(oldCanvasInventario, {
          type: 'doughnut',
          data: {
            labels: productosAdmin.slice(0, 4).map(p => p.nombre),
            datasets: [{
              data: productosAdmin.slice(0, 4).map(p => p.stock),
              backgroundColor: ['#B6E1F2', '#386273', '#7CB9E8', '#4A9FCE'],
              borderColor: '#FFF',
              borderWidth: 2
            }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      }, 0);
    }
// Las llamadas a cargarTablaPedidos y cargarTablaUsuarios se mueven fuera del bloque de gráficos.
    const oldCanvasVentasMes = document.getElementById('grafico-ventas-mes');
    if (window.chartVentasMes && typeof window.chartVentasMes.destroy === 'function') {
      window.chartVentasMes.destroy();
      window.chartVentasMes = null;
    }
    if (oldCanvasVentasMes) {
      setTimeout(() => {
        window.chartVentasMes = new Chart(oldCanvasVentasMes, {
          type: 'line',
          data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [{
              label: 'Ventas ($)',
              data: [15000, 18000, 20000, 17000, 22000, 25000],
              borderColor: '#386273',
              backgroundColor: 'rgba(182, 225, 242, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: true
            }]
          },
          options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
      }, 0);
    }
    const oldCanvasCategorias = document.getElementById('grafico-categorias');
    if (window.chartCategorias && typeof window.chartCategorias.destroy === 'function') {
      window.chartCategorias.destroy();
      window.chartCategorias = null;
    }
    if (oldCanvasCategorias) {
      setTimeout(() => {
        const categorias = {};
        productosAdmin.forEach(p => { categorias[p.categoria] = (categorias[p.categoria] || 0) + 1; });
        window.chartCategorias = new Chart(oldCanvasCategorias, {
          type: 'pie',
          data: {
            labels: Object.keys(categorias),
            datasets: [{
              data: Object.values(categorias),
              backgroundColor: ['#B6E1F2', '#386273', '#7CB9E8', '#4A9FCE'],
              borderColor: '#FFF',
              borderWidth: 2
            }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      }, 0);
    }
  } catch (err) {
    console.error('Error al crear los gráficos:', err);
  }
  finally {
    dashboardUpdating = false;
  }
  // Llamar a las funciones de tabla después de cargar productos y gráficos
  cargarTablaPedidos();
  cargarTablaUsuarios();
}

// Cargar tabla de productos
function cargarTablaProductos() {
  const tbody = document.getElementById('tabla-productos-body');
  tbody.innerHTML = '';

  productosAdmin.forEach(producto => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <img src="${producto.imagen}" alt="${producto.nombre}" class="tabla-imagen">
      </td>
      <td><strong>${producto.nombre}</strong></td>
      <td>${producto.categoria}</td>
      <td>$${producto.precio.toLocaleString('es-CO')}</td>
      <td>
        <strong>${producto.stock}</strong>
        ${producto.stock < 20 ? '<span style="color: var(--error);"> ⚠️ Bajo</span>' : ''}
      </td>
      <td class="acciones-tabla">
        <button class="btn-editar" onclick="editarProducto('${producto.id}')">✎ Editar</button>
        <button class="btn-eliminar" onclick="eliminarProducto('${producto.id}')">🗑️ Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

// Cargar tabla de pedidos
function cargarTablaPedidos() {
  const tbody = document.getElementById('tabla-pedidos-body');
  if (!tbody) return;
  
  if (!Array.isArray(pedidosAdmin) || pedidosAdmin.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="sin-datos">No hay pedidos aún</td></tr>';
    return;
  }

  // Ordenar pedidos por más nuevos primero
  const pedidosOrdenados = [...pedidosAdmin].sort((a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha));
  
  tbody.innerHTML = pedidosOrdenados.map(pedido => {
    const nombreCliente = pedido.usuario?.nombre || pedido.cliente || 'Desconocido';
    const telefonoCliente = pedido.usuario?.telefono || pedido.telefono || '';
    const numeroRadicado = pedido.numero || pedido.id || 'S/N';
    const fechaPedido = pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString('es-CO') : 'N/A';
    const cantidadItems = pedido.items ? pedido.items.length : 0;
    const totalPedido = pedido.total ? pedido.total.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00';
    const estado = pedido.estado || 'PENDIENTE';
    const estaConfirmado = estado === 'EN_PREPARACION' || estado === 'ENTREGADO';
    
    const badgeEstado = estado === 'PENDIENTE' ? 'badge-pendiente' : 
                        estado === 'EN_PREPARACION' ? 'badge-preparacion' :
                        estado === 'ENVIADO' ? 'badge-enviado' :
                        estado === 'ENTREGADO' ? 'badge-entregado' : 'badge-default';
    
    return `
      <tr class="fila-pedido">
        <td><strong>#${numeroRadicado}</strong></td>
        <td>${nombreCliente}</td>
        <td>${telefonoCliente || 'N/A'}</td>
        <td><span class="badge-items">${cantidadItems} items</span></td>
        <td><strong>$${totalPedido}</strong></td>
        <td><span class="badge ${badgeEstado}">${estado}</span></td>
        <td>${fechaPedido}${pedido.entregaEn ? `<br><small style="color: #666;">Entregado: ${new Date(pedido.entregaEn).toLocaleDateString('es-CO')}</small>` : ''}</td>
        <td class="acciones-tabla">
          <div class="accion-item">
            <button class="btn-ver" onclick="abrirDetallePedido('${pedido.id}')" title="Ver detalles">👁️ Ver</button>
          </div>
          <div class="accion-item">
            ${!estaConfirmado ? `<button class="btn-confirmar-mini" onclick="confirmarPedido('${pedido.id}')" title="Confirmar">✓ Confirmar</button>` : `<span class="estado-confirmado">✓ Confirmado</span>`}
          </div>
          <div class="accion-item">
            ${estado !== 'ENTREGADO' && estado !== 'CANCELADO' && (estado === 'EN_PREPARACION' || estado === 'ENVIADO') ? `<button class="btn-entregado" onclick="marcarComoEntregado('${pedido.id}')" title="Marcar como Entregado">📦 Entregado</button>` : ''}
          </div>
          <div class="accion-item">
            <a href="https://wa.me/${(telefonoCliente || '').replace(/\D/g, '')}" target="_blank" class="btn-whatsapp" title="WhatsApp">💬 Contactar</a>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Agregar evento al campo de búsqueda
  const filtro = document.getElementById('filtro-pedidos');
  if (filtro) {
    filtro.addEventListener('keyup', filtrarPedidos);
  }
}

function filtrarPedidos() {
  const filtro = document.getElementById('filtro-pedidos').value.toLowerCase();
  const filas = document.querySelectorAll('.fila-pedido');
  
  filas.forEach(fila => {
    const texto = fila.textContent.toLowerCase();
    fila.style.display = texto.includes(filtro) ? '' : 'none';
  });
}

function abrirDetallePedido(pedidoId) {
  const pedido = pedidosAdmin.find(p => p.id === pedidoId);
  if (!pedido) return;

  const nombreCliente = pedido.usuario?.nombre || pedido.cliente || 'Desconocido';
  const emailCliente = pedido.usuario?.email || pedido.email || 'N/A';
  const telefonoCliente = pedido.usuario?.telefono || pedido.telefono || 'N/A';
  const numeroRadicado = pedido.numero || pedido.id || 'S/N';
  const fechaPedido = pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString('es-CO') : 'N/A';
  const horaPedido = pedido.createdAt ? new Date(pedido.createdAt).toLocaleTimeString('es-CO') : 'N/A';
  const estado = pedido.estado || 'PENDIENTE';
  const estaConfirmado = estado === 'EN_PREPARACION' || estado === 'ENTREGADO';

  let contenidoDetalle = `
    <div class="detalle-pedido-contenedor">
      <div class="detalle-header">
        <div class="detalle-seccion">
          <h3>Información del Pedido</h3>
          <div class="detalle-grid">
            <div class="detalle-item">
              <span class="detalle-label">Radicado:</span>
              <span class="detalle-valor">#${numeroRadicado}</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Estado:</span>
              <span class="badge badge-${estado === 'PENDIENTE' ? 'pendiente' : estado === 'EN_PREPARACION' ? 'preparacion' : estado === 'ENTREGADO' ? 'entregado' : 'default'}">${estado}</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Fecha:</span>
              <span class="detalle-valor">${fechaPedido} - ${horaPedido}</span>
            </div>
          </div>
        </div>

        <div class="detalle-seccion">
          <h3>Información del Cliente</h3>
          <div class="detalle-grid">
            <div class="detalle-item">
              <span class="detalle-label">Nombre:</span>
              <span class="detalle-valor">${nombreCliente}</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Email:</span>
              <span class="detalle-valor">${emailCliente}</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Teléfono:</span>
              <span class="detalle-valor">${telefonoCliente}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="detalle-items">
        <h3>📦 Items del Pedido</h3>
        <table class="tabla-items">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${(pedido.items || []).map(item => {
              const precio = item.precioUnitario || item.precio || 0;
              const subtotal = (item.cantidad * precio).toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2});
              return `
                <tr>
                  <td>${item.producto?.nombre || item.nombre || 'Producto'}</td>
                  <td class="cantidad">${item.cantidad}</td>
                  <td class="precio">$${precio.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td class="subtotal"><strong>$${subtotal}</strong></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="detalle-total">
        <div class="total-item">
          <span>Total Pedido:</span>
          <strong>$${(pedido.total || 0).toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
        </div>
      </div>

      ${pedido.notas ? `
        <div class="detalle-notas">
          <h3>📝 Notas de Entrega</h3>
          <p>${pedido.notas}</p>
        </div>
      ` : ''}

      <div class="detalle-acciones-modal">
        ${!estaConfirmado ? `
          <button class="btn btn-principal" onclick="confirmarPedidoYCerrar('${pedido.id}')">✓ Confirmar Pedido</button>
        ` : `
          <button class="btn btn-secundario" onclick="actualizarEstadoPedido('${pedido.id}', '${estado}')" title="Cambiar estado">📝 Cambiar Estado</button>
        `}
        <a href="https://wa.me/${(telefonoCliente || '').replace(/\D/g, '')}" target="_blank" class="btn" style="background: #25d366; color: white; text-decoration: none;">📱 Contactar por WhatsApp</a>
      </div>
    </div>
  `;

  document.getElementById('contenido-detalle-pedido').innerHTML = contenidoDetalle;
  document.getElementById('modal-detalle-pedido').style.display = 'flex';
}

function cerrarModalDetallePedido() {
  document.getElementById('modal-detalle-pedido').style.display = 'none';
}

function confirmarPedidoYCerrar(pedidoId) {
  confirmarPedido(pedidoId);
  cerrarModalDetallePedido();
}

// Cargar tabla de usuarios
function cargarTablaUsuarios() {
  const tbody = document.getElementById('tabla-usuarios-body');
  tbody.innerHTML = '';

  usuariosAdmin.forEach(usuario => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><strong>${usuario.nombre}</strong></td>
      <td>${usuario.email}</td>
      <td>${usuario.telefono || 'N/A'}</td>
      <td>
        <span style="background-color: #E3F2FD; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem;">
          ${usuario.tipo || 'Cliente'}
        </span>
      </td>
      <td class="acciones-tabla">
        <button class="btn-eliminar" onclick="eliminarUsuario('${usuario.id}')">🗑️ Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

// Modal de producto
function abrirModalProducto() {
  const modal = document.getElementById('modal-producto');
  const form = document.getElementById('form-producto');
  const modalTitulo = document.getElementById('modal-titulo-producto');
  
  if (!modal || !form) {
    console.error('❌ Modal o formulario no encontrado');
    return;
  }
  
  // Determinar si es nuevo o edición
  const productoId = form.getAttribute('data-id');
  const esNuevo = !productoId;
  
  // Actualizar título
  if (modalTitulo) {
    modalTitulo.textContent = esNuevo ? 'Agregar Producto' : 'Editar Producto';
  }
  
  // Limpiar formulario solo si es nuevo producto
  if (esNuevo) {
    form.reset();
  }
  
  // Mostrar modal con display: flex para que se centre correctamente
  modal.style.display = 'flex';
  modal.classList.add('activo');
  
  console.log('✏️ Modal abierto -', esNuevo ? 'Nuevo producto' : 'Editando producto');
}

function cerrarModalProducto() {
  const modal = document.getElementById('modal-producto');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('activo');
  }
}

function editarProducto(id) {
  // Validar permisos de administrador
  if (!validarPermisosAdmin('editar_productos')) {
    mostrarMensajeAdmin('❌ No tienes permisos para editar productos', 'error');
    return;
  }
  
  // Asegurar que el ID es string
  const idString = String(id);
  const producto = productosAdmin.find(p => String(p.id) === idString);
  if (!producto) {
    console.error('❌ Producto no encontrado. ID:', idString, 'Productos disponibles:', productosAdmin.map(p => p.id).slice(0, 5));
    mostrarMensajeAdmin('❌ Producto no encontrado', 'error');
    return;
  }

  console.log('✏️ Editando producto:', producto);

  document.getElementById('prod-nombre').value = producto.nombre;
  // Usar categoriaId si está disponible, sino usar categoria
  const categoriaId = producto.categoriaId || producto.categoria;
  document.getElementById('prod-categoria').value = categoriaId;
  document.getElementById('prod-precio').value = producto.precio;
  document.getElementById('prod-stock').value = producto.stock;
  document.getElementById('prod-imagen').value = producto.imagen || '';
  document.getElementById('prod-descripcion').value = producto.descripcion || '';
  document.getElementById('form-producto').setAttribute('data-id', idString);

  abrirModalProducto();
}

function eliminarProducto(id) {
  // Validar permisos de administrador
  if (!validarPermisosAdmin('eliminar_productos')) {
    mostrarMensajeAdmin('❌ No tienes permisos para eliminar productos', 'error');
    return;
  }
  
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    // Asegurar que el ID es string
    const idString = String(id);
    // Eliminar producto en el backend
    fetch(`${BACKEND_URL}/api/v1/products/${idString}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + (localStorage.getItem('admin-token') || '')
      }
    })
      .then(resp => {
        if (resp.ok) {
          mostrarMensajeAdmin('✓ Producto eliminado correctamente', 'exito');
          cargarDatosAdmin();
        } else {
          mostrarMensajeAdmin('Error al eliminar el producto', 'error');
        }
      })
      .catch(() => mostrarMensajeAdmin('Error de red al eliminar producto', 'error'));
  }
}

// Cargar categorías desde el backend
async function cargarCategoriasAdmin() {
  try {
    const token = localStorage.getItem('admin-token') || '';
    console.log('🔍 Cargando categorías con token:', token.substring(0, 20) + '...');
    
    const resp = await fetch(`${BACKEND_URL}/api/v1/categories`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('📡 Response Status:', resp.status);
    
    if (resp.ok) {
      const categorias = await resp.json();
      const selectCateg = document.getElementById('prod-categoria');
      
      if (!selectCateg) {
        console.error('❌ Select prod-categoria no encontrado en el DOM');
        return;
      }
      
      // Limpiar opciones previas (excepto la primera)
      while (selectCateg.options.length > 1) {
        selectCateg.remove(1);
      }
      
      // Agregar categorías desde el backend
      if (Array.isArray(categorias) && categorias.length > 0) {
        categorias.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.nombre;
          selectCateg.appendChild(option);
          console.log(`  ✓ ${cat.nombre} (${cat.id})`);
        });
        console.log('✅ Categorías cargadas:', categorias.length);
      } else {
        console.warn('⚠️ No hay categorías en la respuesta o respuesta no es array');
      }
    } else {
      const errorData = await resp.text();
      console.error('❌ Error cargando categorías:', resp.status, errorData);
      mostrarMensajeAdmin(`Error al cargar categorías (${resp.status})`, 'error');
    }
  } catch (err) {
    console.error('❌ Error fetching categorías:', err);
    mostrarMensajeAdmin('Error de red al cargar categorías: ' + err.message, 'error');
  }
}

// Guardar producto
function guardarProducto() {
  // Validar permisos de administrador
  if (!validarPermisosAdmin('crear_productos')) {
    mostrarMensajeAdmin('❌ No tienes permisos para crear productos', 'error');
    return;
  }

  const nombre = document.getElementById('prod-nombre').value.trim();
  const categoriaId = document.getElementById('prod-categoria').value;
  const precio = parseFloat(document.getElementById('prod-precio').value);
  const stock = parseInt(document.getElementById('prod-stock').value);
  const imagen = document.getElementById('prod-imagen').value.trim();
  const descripcion = document.getElementById('prod-descripcion').value.trim();
  const form = document.getElementById('form-producto');
  const productoId = form.getAttribute('data-id');

  // Validar campos requeridos
  if (!nombre || !categoriaId || isNaN(precio) || isNaN(stock)) {
    mostrarMensajeAdmin('❌ Por favor completa todos los campos requeridos', 'error');
    return;
  }

  if (precio < 0 || stock < 0) {
    mostrarMensajeAdmin('❌ Precio y stock no pueden ser negativos', 'error');
    return;
  }

  const productData = {
    nombre,
    categoriaId,
    precio,
    stock,
    imagen: imagen || null,
    descripcion: descripcion || null
  };

  console.log('📤 Enviando datos del producto:', productData);

  const method = productoId ? 'PUT' : 'POST';
  const url = productoId 
    ? `${BACKEND_URL}/api/v1/products/${productoId}`
    : `${BACKEND_URL}/api/v1/products`;

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('admin-token') || '')
    },
    body: JSON.stringify(productData)
  })
    .then(resp => {
      console.log('📡 Response Status:', resp.status);
      
      if (resp.ok) {
        const action = productoId ? 'actualizado' : 'creado';
        mostrarMensajeAdmin(`✓ Producto ${action} correctamente`, 'exito');
        cerrarModalProducto();
        cargarDatosAdmin();
      } else {
        // Intentar leer el error del servidor
        resp.json().then(data => {
          const errorMsg = data.message || data.error || 'Error desconocido';
          console.error('❌ Error del servidor:', errorMsg);
          mostrarMensajeAdmin(`Error: ${errorMsg}`, 'error');
        }).catch(err => {
          console.error('❌ Error al guardar el producto:', resp.status, resp.statusText);
          mostrarMensajeAdmin(`❌ Error al guardar el producto (${resp.status})`, 'error');
        });
      }
    })
    .catch(err => {
      console.error('❌ Error de red guardando producto:', err);
      mostrarMensajeAdmin('❌ Error de red al guardar producto: ' + err.message, 'error');
    });
}

// Confirmar pedido (cambia estado a EN_PREPARACION)
function confirmarPedido(idPedido) {
  // Validar permisos de administrador
  if (!validarPermisosAdmin('autorizar_pedidos')) {
    mostrarMensajeAdmin('❌ No tienes permisos para autorizar pedidos', 'error');
    return;
  }
  
  if (confirm('¿Deseas confirmar este pedido? Se enviará una notificación WhatsApp al cliente.')) {
    fetch(`${BACKEND_URL}/api/v1/orders/${idPedido}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (localStorage.getItem('admin-token') || '')
      },
      body: JSON.stringify({
        estado: 'EN_PREPARACION',
        notasEntrega: 'Pedido confirmado por administrador'
      })
    })
      .then(resp => {
        if (resp.ok) {
          mostrarMensajeAdmin('✓ Pedido confirmado. Notificación enviada al cliente.', 'exito');
          cargarDatosAdmin();
          cargarTablaPedidos();
        } else {
          mostrarMensajeAdmin('Error al confirmar el pedido', 'error');
        }
      })
      .catch(() => mostrarMensajeAdmin('Error de red al confirmar pedido', 'error'));
  }
}

// Marcar pedido como entregado
function marcarComoEntregado(idPedido) {
  // Validar permisos de administrador
  if (!validarPermisosAdmin('editar_pedidos')) {
    mostrarMensajeAdmin('❌ No tienes permisos para marcar pedidos como entregados', 'error');
    return;
  }
  
  if (confirm('¿Deseas marcar este pedido como ENTREGADO?')) {
    fetch(`${window.BACKEND_URL}/api/v1/orders/${idPedido}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (localStorage.getItem('admin-token') || '')
      },
      body: JSON.stringify({
        estado: 'ENTREGADO',
        notasEntrega: 'Pedido entregado al cliente'
      })
    })
      .then(resp => {
        if (resp.ok) {
          mostrarMensajeAdmin('✓ Pedido marcado como entregado.', 'exito');
          cargarDatosAdmin();
          cargarTablaPedidos();
        } else {
          resp.json().then(data => {
            mostrarMensajeAdmin(`Error: ${data.message || 'No se pudo marcar como entregado'}`, 'error');
          }).catch(() => mostrarMensajeAdmin('Error al marcar pedido como entregado', 'error'));
        }
      })
      .catch(() => mostrarMensajeAdmin('Error de red al marcar como entregado', 'error'));
  }
}

// Cambiar estado de pedido
function cambiarEstadoPedido(idPedido) {
  // Validar permisos de administrador
  if (!validarPermisosAdmin('editar_pedidos')) {
    mostrarMensajeAdmin('❌ No tienes permisos para modificar pedidos', 'error');
    return;
  }
  
  const pedido = pedidosAdmin.find(p => p.id === idPedido);
  if (!pedido) return;

  // Ciclo de estados
  const estados = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO'];
  const indiceActual = estados.indexOf(pedido.estado);
  const nuevoEstado = estados[(indiceActual + 1) % estados.length];

  // Actualizar estado en el backend
  // ...existing code...
  fetch(`${BACKEND_URL}/api/v1/orders/${idPedido}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem('admin-token') || '')
    },
    body: JSON.stringify({ estado: nuevoEstado })
  })
    .then(resp => {
      if (resp.ok) {
        mostrarMensajeAdmin(`✓ Pedido cambió a estado: ${nuevoEstado}`, 'exito');
        cargarDatosAdmin(); // Recargar datos y tabla
      } else {
        mostrarMensajeAdmin('Error al actualizar el estado', 'error');
      }
    })
    .catch(() => mostrarMensajeAdmin('Error de red al actualizar pedido', 'error'));
}

// Eliminar usuario
function eliminarUsuario(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    // Eliminar usuario en el backend
    // ...existing code...
    fetch(`${BACKEND_URL}/api/v1/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + (localStorage.getItem('admin-token') || '')
      }
    })
      .then(resp => {
        if (resp.ok) {
          mostrarMensajeAdmin('Usuario eliminado', 'exito');
          cargarDatosAdmin();
        } else {
          mostrarMensajeAdmin('Error al eliminar el usuario', 'error');
        }
      })
      .catch(() => mostrarMensajeAdmin('Error de red al eliminar usuario', 'error'));
  }
}

// Configurar formulario de producto

// Guardar configuración
function guardarConfiguracion() {
  mostrarMensajeAdmin('Configuración guardada correctamente', 'exito');
}

// Mostrar mensaje
function mostrarMensajeAdmin(mensaje, tipo) {
  const contenedor = document.createElement('div');
  contenedor.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: ${tipo === 'exito' ? '#27AE60' : '#E74C3C'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  contenedor.textContent = mensaje;
  document.body.appendChild(contenedor);

  setTimeout(() => {
    contenedor.remove();
  }, 3000);
}

// Cerrar sesión
function cerrarSesionAdmin() {
  if (confirm('¿Deseas cerrar sesión?')) {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-usuario');
    window.location.href = 'login-admin.html';
  }
}

// Mostrar productos agrupados por categoría en la sección de categorías
let categoriaFiltroActual = 'todas';

async function mostrarCategoriasConProductos() {
  try {
    const token = localStorage.getItem('admin-token');
    let productos = [];

    // Intentar cargar desde la API primero
    if (token) {
      try {
        const res = await fetch(API_URL + '/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) productos = data;
        }
      } catch (e) {
        console.log('Usando productos locales...');
      }
    }

    // Fallback a productos locales
    if (productos.length === 0) {
      productos = productosAdmin || [];
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      document.getElementById('categorias-lista').innerHTML = '<div class="categoria-vacia">No hay productos para mostrar</div>';
      return;
    }

    // Guardar productos para búsqueda y ordenamiento
    productosParaBuscar = JSON.parse(JSON.stringify(productos));
    busquedaActual = '';
    ordenActual = '';
    document.getElementById('input-buscar-productos').value = '';
    document.getElementById('select-ordenar').value = '';

    // Agrupar productos por categoría
    const categorias = {};
    productos.forEach(prod => {
      const cat = prod.categoria || 'Sin categoría';
      if (!categorias[cat]) categorias[cat] = [];
      categorias[cat].push(prod);
    });

    // Generar botones de filtro dinámicamente
    const botonesContainer = document.getElementById('botones-categorias');
    const categoriasArray = Object.keys(categorias).sort();
    
    botonesContainer.innerHTML = categoriasArray.map((cat, idx) => {
      const icono = obtenerIconoCategoria(cat);
      const contador = categorias[cat].length;
      return `
        <button class="filtro-btn" onclick="filtrarPorCategoria('${cat}')">
          <span class="filtro-icono">${icono}</span>
          <span class="filtro-texto">${cat}</span>
          <span class="filtro-contador">${contador}</span>
        </button>
      `;
    }).join('');

    // Calcular estadísticas totales
    const totalProductos = productos.length;
    const stockTotal = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
    const valorInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

    document.getElementById('stat-total-productos').textContent = totalProductos;
    document.getElementById('stat-stock-total').textContent = stockTotal;
    document.getElementById('stat-valor-inventario').textContent = '$' + valorInventario.toLocaleString('es-CO', { maximumFractionDigits: 0 });
    document.getElementById('stat-categorias-activas').textContent = categoriasArray.length;
    document.getElementById('contador-todas').textContent = totalProductos;

    // Renderizar productos filtrados
    mostrarProductosPorCategoria(categorias);
    
  } catch (error) {
    console.error('Error cargando categorías:', error);
    document.getElementById('categorias-lista').innerHTML = '<div class="categoria-vacia">Error al cargar las categorías</div>';
  }
}

function filtrarPorCategoria(categoria) {
  categoriaFiltroActual = categoria;
  
  // Actualizar botones
  document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('activo'));
  if (categoria === 'todas') {
    document.querySelector('[onclick="filtrarPorCategoria(\'todas\')"]').classList.add('activo');
  } else {
    document.querySelectorAll('.filtro-btn').forEach(btn => {
      if (btn.textContent.includes(categoria)) {
        btn.classList.add('activo');
      }
    });
  }

  // Re-renderizar
  const contenedorPrincipal = document.getElementById('categorias-lista');
  const gruposActuales = contenedorPrincipal.querySelectorAll('.categoria-grupo');
  
  gruposActuales.forEach(grupo => {
    const tituloCat = grupo.querySelector('.categoria-titulo-icono').parentElement.textContent.trim();
    if (categoria === 'todas') {
      grupo.style.display = 'block';
    } else if (tituloCat.includes(categoria)) {
      grupo.style.display = 'block';
    } else {
      grupo.style.display = 'none';
    }
  });
}

function mostrarProductosPorCategoria(categorias) {
  const contenedor = document.getElementById('categorias-lista');
  
  contenedor.innerHTML = Object.keys(categorias)
    .sort()
    .map(categoria => {
      const productos = categorias[categoria];
      const icono = obtenerIconoCategoria(categoria);
      const stockCat = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
      const valorCat = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
      const disponibles = productos.filter(p => p.stock > 0).length;
      
      return `
        <div class="categoria-grupo" style="display: ${categoriaFiltroActual === 'todas' || categoriaFiltroActual === categoria ? 'block' : 'none'}">
          <div class="categoria-header">
            <div class="categoria-titulo">
              <span class="categoria-titulo-icono">${icono}</span>
              <span>${categoria}</span>
            </div>
            <div class="categoria-badge">${productos.length} productos</div>
          </div>
          
          <div class="categoria-stats">
            <div class="categoria-stat-item">
              <span class="categoria-stat-numero">${stockCat}</span>
              <span class="categoria-stat-label">Stock Total</span>
            </div>
            <div class="categoria-stat-item">
              <span class="categoria-stat-numero">${disponibles}</span>
              <span class="categoria-stat-label">Disponibles</span>
            </div>
            <div class="categoria-stat-item">
              <span class="categoria-stat-numero">$${(valorCat / 1000).toFixed(1)}k</span>
              <span class="categoria-stat-label">Valor</span>
            </div>
          </div>

          <div class="categoria-productos">
            ${productos.map(prod => `
              <div class="categoria-producto">
                <img src="${prod.imagen || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%23eee%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E'}" alt="${prod.nombre}" class="categoria-producto-imagen" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%23eee%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E'">
                <div class="categoria-producto-info">
                  <div class="categoria-producto-nombre">${prod.nombre}</div>
                  <div class="categoria-producto-precio">$${prod.precio ? prod.precio.toLocaleString('es-CO') : 0}</div>
                  <span class="categoria-producto-stock ${prod.stock === 0 ? 'agotado' : prod.stock < 5 ? 'bajo' : ''}">
                    Stock: ${prod.stock}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    })
    .join('');
}

function obtenerIconoCategoria(categoria) {
  const iconos = {
    'bebidas': '🥤',
    'snacks': '🍪',
    'limpieza': '🧹',
    'higiene': '🧼',
    'frutas': '🍎',
    'verduras': '🥬',
    'lácteos': '🧀',
    'carnes': '🥩',
    'pan': '🍞',
    'bebida': '🥤',
    'snack': '🍪',
  };
  
  return iconos[categoria.toLowerCase()] || '📦';
}

// Variables globales para búsqueda y ordenamiento
let productosParaBuscar = [];
let ordenActual = '';
let busquedaActual = '';

function buscarProductos(termino) {
  busquedaActual = termino.toLowerCase();
  
  if (!busquedaActual) {
    // Si está vacío, mostrar todos
    mostrarCategoriasConProductos();
    return;
  }

  // Filtrar productos que coincidan con el término
  const productosFiltrados = productosParaBuscar.filter(p =>
    p.nombre.toLowerCase().includes(busquedaActual) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(busquedaActual))
  );

  if (productosFiltrados.length === 0) {
    document.getElementById('categorias-lista').innerHTML = '<div class="categoria-vacia">No se encontraron productos</div>';
    return;
  }

  // Agrupar resultados por categoría
  const categorias = {};
  productosFiltrados.forEach(prod => {
    const cat = prod.categoria || 'Sin categoría';
    if (!categorias[cat]) categorias[cat] = [];
    categorias[cat].push(prod);
  });

  // Actualizar estadísticas
  const totalResultados = productosFiltrados.length;
  document.getElementById('stat-total-productos').textContent = totalResultados;
  document.getElementById('stat-stock-total').textContent = productosFiltrados.reduce((sum, p) => sum + (p.stock || 0), 0);
  document.getElementById('stat-valor-inventario').textContent = '$' + productosFiltrados.reduce((sum, p) => sum + (p.precio * p.stock), 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });

  mostrarProductosPorCategoria(categorias);
}

function ordenarProductos(criterio) {
  ordenActual = criterio;
  
  if (!criterio) {
    mostrarCategoriasConProductos();
    return;
  }

  let productosOrdenados = [...productosParaBuscar];

  if (busquedaActual) {
    productosOrdenados = productosOrdenados.filter(p =>
      p.nombre.toLowerCase().includes(busquedaActual) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(busquedaActual))
    );
  }

  // Aplicar ordenamiento
  switch(criterio) {
    case 'nombre-asc':
      productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case 'nombre-desc':
      productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    case 'precio-asc':
      productosOrdenados.sort((a, b) => (a.precio || 0) - (b.precio || 0));
      break;
    case 'precio-desc':
      productosOrdenados.sort((a, b) => (b.precio || 0) - (a.precio || 0));
      break;
    case 'stock-asc':
      productosOrdenados.sort((a, b) => (a.stock || 0) - (b.stock || 0));
      break;
    case 'stock-desc':
      productosOrdenados.sort((a, b) => (b.stock || 0) - (a.stock || 0));
      break;
  }

  // Reagrupar por categoría
  const categorias = {};
  productosOrdenados.forEach(prod => {
    const cat = prod.categoria || 'Sin categoría';
    if (!categorias[cat]) categorias[cat] = [];
    categorias[cat].push(prod);
  });

  mostrarProductosPorCategoria(categorias);
}

function exportarCSV() {
  try {
    let productos = productosParaBuscar;

    if (busquedaActual) {
      productos = productos.filter(p =>
        p.nombre.toLowerCase().includes(busquedaActual) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(busquedaActual))
      );
    }

    let csv = 'Categoría,Nombre,Descripción,Precio,Stock,ID\n';
    
    productos.forEach(prod => {
      const categoria = (prod.categoria || 'Sin categoría').replace(/,/g, ';');
      const nombre = (prod.nombre || '').replace(/,/g, ';');
      const descripcion = (prod.descripcion || '').replace(/,/g, ';');
      const precio = prod.precio || 0;
      const stock = prod.stock || 0;
      const id = prod.id || '';

      csv += `"${categoria}","${nombre}","${descripcion}",${precio},${stock},${id}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `categorias-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('✅ Archivo CSV exportado correctamente');
  } catch (error) {
    console.error('Error exportando CSV:', error);
    alert('❌ Error al exportar CSV');
  }
}

function exportarCategorias() {
  try {
    let productos = productosParaBuscar;

    if (busquedaActual) {
      productos = productos.filter(p =>
        p.nombre.toLowerCase().includes(busquedaActual) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(busquedaActual))
      );
    }

    // Agrupar por categoría
    const categorias = {};
    productos.forEach(prod => {
      const cat = prod.categoria || 'Sin categoría';
      if (!categorias[cat]) categorias[cat] = [];
      categorias[cat].push(prod);
    });

    // Crear contenido HTML para PDF
    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Categorías</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          h1 { color: #386273; text-align: center; margin-bottom: 30px; }
          .categoria-seccion { page-break-inside: avoid; margin-bottom: 30px; }
          .categoria-titulo { 
            background: linear-gradient(135deg, #386273 0%, #5a8fa3 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: bold;
          }
          .tabla-productos { 
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .tabla-productos th {
            background: #f0f0f0;
            color: #386273;
            padding: 10px;
            text-align: left;
            border-bottom: 2px solid #B6E1F2;
            font-weight: bold;
          }
          .tabla-productos td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          .tabla-productos tr:hover { background: #f9f9f9; }
          .resumen { 
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-top: 30px;
          }
          .resumen-item {
            display: inline-block;
            margin-right: 30px;
            margin-bottom: 10px;
          }
          .resumen-numero {
            font-size: 20px;
            font-weight: bold;
            color: #386273;
          }
          .resumen-label { color: #999; font-size: 12px; }
          @media print {
            body { margin: 0; }
            .categoria-seccion { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>📦 Reporte de Categorías y Productos</h1>
        <p style="text-align: center; color: #999;">Generado el: ${new Date().toLocaleString('es-CO')}</p>
    `;

    // Agregar cada categoría
    Object.keys(categorias).sort().forEach(cat => {
      const prods = categorias[cat];
      const stockTotal = prods.reduce((sum, p) => sum + (p.stock || 0), 0);
      const valorTotal = prods.reduce((sum, p) => sum + (p.precio * p.stock), 0);

      html += `
        <div class="categoria-seccion">
          <div class="categoria-titulo">📂 ${cat} (${prods.length} productos)</div>
          <table class="tabla-productos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
      `;

      prods.forEach(prod => {
        const valor = (prod.precio || 0) * (prod.stock || 0);
        html += `
          <tr>
            <td>${prod.nombre}</td>
            <td>$${(prod.precio || 0).toLocaleString('es-CO')}</td>
            <td>${prod.stock || 0}</td>
            <td>$${valor.toLocaleString('es-CO')}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
          <div style="text-align: right; padding: 10px; background: #f0f7fa; border-radius: 4px;">
            <strong>Stock Total: ${stockTotal}</strong> | 
            <strong>Valor: $${valorTotal.toLocaleString('es-CO')}</strong>
          </div>
        </div>
      `;
    });

    // Agregar resumen final
    const totalProductos = productos.length;
    const stockTotal = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
    const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

    html += `
      <div class="resumen">
        <h3>📊 Resumen General</h3>
        <div class="resumen-item">
          <div class="resumen-numero">${totalProductos}</div>
          <div class="resumen-label">Productos</div>
        </div>
        <div class="resumen-item">
          <div class="resumen-numero">${Object.keys(categorias).length}</div>
          <div class="resumen-label">Categorías</div>
        </div>
        <div class="resumen-item">
          <div class="resumen-numero">${stockTotal}</div>
          <div class="resumen-label">Stock Total</div>
        </div>
        <div class="resumen-item">
          <div class="resumen-numero">$${valorTotal.toLocaleString('es-CO')}</div>
          <div class="resumen-label">Valor Inventario</div>
        </div>
      </div>
    </body>
    </html>
    `;

    // Crear y descargar PDF usando print
    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(html);
    ventana.document.close();
    
    // Dar tiempo para que se renderice antes de imprimir
    setTimeout(() => {
      ventana.print();
      ventana.close();
    }, 250);

    alert('✅ Reporte generado. Imprime o guarda como PDF desde el diálogo de impresión');
  } catch (error) {
    console.error('Error exportando PDF:', error);
    alert('❌ Error al generar el reporte');
  }
}

// ===== REPORTES =====
let chartInventario = null;
let chartTopSellers = null;
let chartSinRotacion = null;

async function mostrarReporte(tipo) {
  // Actualizar botones de pestaña
  const botones = document.querySelectorAll('.tab-btn');
  botones.forEach(btn => {
    btn.classList.remove('activo');
    if ((tipo === 'inventario' && btn.textContent.includes('Stock')) ||
        (tipo === 'top-sellers' && btn.textContent.includes('Vendidos')) ||
        (tipo === 'sin-rotacion' && btn.textContent.includes('Rotación'))) {
      btn.classList.add('activo');
    }
  });

  // Ocultar todos los reportes
  document.getElementById('reporte-inventario').style.display = 'none';
  document.getElementById('reporte-top-sellers').style.display = 'none';
  document.getElementById('reporte-sin-rotacion').style.display = 'none';

  // Mostrar reporte seleccionado
  if (tipo === 'inventario') {
    document.getElementById('reporte-inventario').style.display = 'block';
    await generarReporteInventario();
  } else if (tipo === 'top-sellers') {
    document.getElementById('reporte-top-sellers').style.display = 'block';
    await generarReporteTopSellers();
  } else if (tipo === 'sin-rotacion') {
    document.getElementById('reporte-sin-rotacion').style.display = 'block';
    await generarReporteSinRotacion();
  }
}

async function actualizarReporte() {
  // Determinar cuál reporte está activo
  if (document.getElementById('reporte-inventario').style.display !== 'none') {
    await generarReporteInventario();
  } else if (document.getElementById('reporte-top-sellers').style.display !== 'none') {
    await generarReporteTopSellers();
  } else if (document.getElementById('reporte-sin-rotacion').style.display !== 'none') {
    await generarReporteSinRotacion();
  }
}

async function generarReporteInventario() {
  try {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      console.error('No hay token válido');
      return;
    }

    // Cargar productos
    const prodRes = await fetch(API_URL + '/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let productos = await prodRes.json();
    // Manejar respuesta del backend (puede ser array directo o con propiedad 'data')
    productos = Array.isArray(productos) ? productos : (Array.isArray(productos.data) ? productos.data : []);

    // Separar productos por estado de stock
    const bajoStock = productos.filter(p => p.stock > 0 && p.stock < 5);
    const agotados = productos.filter(p => p.stock === 0);
    const criticos = productos.filter(p => p.stock > 0 && p.stock < 3);

    // Actualizar estadísticas
    document.getElementById('stat-bajo-stock').textContent = bajoStock.length;
    document.getElementById('stat-agotados').textContent = agotados.length;
    document.getElementById('stat-critico').textContent = criticos.length;

    // Llenar tabla de inventario
    const todosBajoStock = [...bajoStock, ...agotados].sort((a, b) => a.stock - b.stock);
    
    const html = todosBajoStock.map(prod => `
      <tr>
        <td>${prod.nombre}</td>
        <td>${prod.categoria || 'Sin categoría'}</td>
        <td><strong>${prod.stock}</strong></td>
        <td>
          <span style="
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            background: ${prod.stock === 0 ? '#ffccbc' : prod.stock < 3 ? '#ffe0b2' : '#fff3cd'};
            color: ${prod.stock === 0 ? '#bf360c' : prod.stock < 3 ? '#e65100' : '#856404'};
          ">
            ${prod.stock === 0 ? 'AGOTADO' : prod.stock < 3 ? 'CRÍTICO' : 'BAJO STOCK'}
          </span>
        </td>
        <td>
          <button class="btn btn-pequeno" onclick="editarProducto('${prod.id}')">Editar</button>
        </td>
      </tr>
    `).join('');

    document.getElementById('tabla-inventario-body').innerHTML = html || '<tr><td colspan="5" style="text-align:center;">Sin productos con bajo stock</td></tr>';

    // Gráfico de distribución
    const ctx = document.getElementById('chart-inventario-dist').getContext('2d');
    
    if (chartInventario) chartInventario.destroy();
    
    chartInventario = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Stock Normal', 'Bajo Stock', 'Agotado'],
        datasets: [{
          data: [
            productos.filter(p => p.stock >= 5).length,
            bajoStock.length,
            agotados.length
          ],
          backgroundColor: ['#c8e6c9', '#ffe0b2', '#ffccbc'],
          borderColor: ['#2e7d32', '#e65100', '#bf360c'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

  } catch (error) {
    console.error('Error generando reporte inventario:', error);
    document.getElementById('tabla-inventario-body').innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Error cargando datos</td></tr>';
  }
}

async function generarReporteTopSellers() {
  try {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      console.error('No hay token válido');
      return;
    }

    // Cargar órdenes y productos
    const ordRes = await fetch(API_URL + '/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const ordenes = await ordRes.json();

    const prodRes = await fetch(API_URL + '/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const productos = await prodRes.json();

    // Calcular ventas por producto
    const ventasPorProducto = {};

    ordenes.forEach(orden => {
      if (orden.estado === 'completada' || orden.estado === 'entregada') {
        // Procesar items de la orden
        if (orden.items && Array.isArray(orden.items)) {
          orden.items.forEach(item => {
            if (!ventasPorProducto[item.product_id]) {
              ventasPorProducto[item.product_id] = { cantidad: 0, ingresos: 0 };
            }
            ventasPorProducto[item.product_id].cantidad += item.quantity_sold || item.cantidad || 1;
            ventasPorProducto[item.product_id].ingresos += (item.precio || 0) * (item.quantity_sold || item.cantidad || 1);
          });
        }
      }
    });

    // Crear array y ordenar por cantidad vendida
    const topVentas = Object.entries(ventasPorProducto)
      .map(([prodId, data]) => {
        const prod = productos.find(p => p.id == prodId);
        return {
          id: prodId,
          nombre: prod?.nombre || 'Producto Desconocido',
          categoria: prod?.categoria || 'N/A',
          cantidad: data.cantidad,
          ingresos: data.ingresos
        };
      })
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);

    const totalVendido = topVentas.reduce((sum, p) => sum + p.cantidad, 0);
    const totalIngresos = topVentas.reduce((sum, p) => sum + p.ingresos, 0);

    document.getElementById('stat-total-vendido').textContent = totalVendido;
    document.getElementById('stat-ingresos-totales').textContent = '$' + totalIngresos.toLocaleString('es-CO', { minimumFractionDigits: 2 });
    document.getElementById('stat-tickets-total').textContent = ordenes.filter(o => o.estado === 'completada' || o.estado === 'entregada').length;

    // Llenar tabla
    const html = topVentas.map((prod, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${prod.nombre}</td>
        <td>${prod.categoria}</td>
        <td><strong>${prod.cantidad}</strong> unidades</td>
        <td>$${prod.ingresos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
        <td>${((prod.cantidad / totalVendido) * 100).toFixed(1)}%</td>
      </tr>
    `).join('');

    document.getElementById('tabla-top-sellers-body').innerHTML = html || '<tr><td colspan="6" style="text-align:center;">Sin datos</td></tr>';

    // Gráfico
    const ctx = document.getElementById('chart-top-sellers').getContext('2d');
    
    if (chartTopSellers) chartTopSellers.destroy();
    
    chartTopSellers = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topVentas.map(p => p.nombre.substring(0, 15)),
        datasets: [{
          label: 'Unidades Vendidas',
          data: topVentas.map(p => p.cantidad),
          backgroundColor: '#386273',
          borderColor: '#2c5a6f',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });

  } catch (error) {
    console.error('Error generando reporte top sellers:', error);
    document.getElementById('tabla-top-sellers-body').innerHTML = '<tr><td colspan="6" style="text-align:center; color: red;">Error cargando datos</td></tr>';
  }
}

async function generarReporteSinRotacion() {
  try {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      console.error('No hay token válido');
      return;
    }

    // Cargar órdenes y productos
    const ordRes = await fetch(API_URL + '/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const ordenes = await ordRes.json();

    const prodRes = await fetch(API_URL + '/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const productos = await prodRes.json();

    // Identificar productos vendidos
    const productosVendidos = new Set();
    const ventasPorProducto = {};

    ordenes.forEach(orden => {
      if (orden.estado === 'completada' || orden.estado === 'entregada') {
        if (orden.items && Array.isArray(orden.items)) {
          orden.items.forEach(item => {
            productosVendidos.add(item.product_id);
            if (!ventasPorProducto[item.product_id]) {
              ventasPorProducto[item.product_id] = 0;
            }
            ventasPorProducto[item.product_id] += item.quantity_sold || item.cantidad || 1;
          });
        }
      }
    });

    // Clasificar productos
    const sinVentas = productos.filter(p => !productosVendidos.has(p.id));
    const rotacionMinima = productos.filter(p => productosVendidos.has(p.id) && (ventasPorProducto[p.id] || 0) < 5);
    const stockMuerto = productos.filter(p => p.stock > 20 && (!productosVendidos.has(p.id) || (ventasPorProducto[p.id] || 0) < 3));

    document.getElementById('stat-sin-venta').textContent = sinVentas.length;
    document.getElementById('stat-stock-muerto').textContent = stockMuerto.length;
    document.getElementById('stat-rotacion-minima').textContent = rotacionMinima.length;

    // Combinar y mostrar todos los productos sin rotación
    const productosSinRotacion = [
      ...sinVentas.map(p => ({ ...p, problema: 'Sin ventas', ventas: 0 })),
      ...rotacionMinima.map(p => ({ ...p, problema: 'Rotación mínima', ventas: ventasPorProducto[p.id] || 0 }))
    ].sort((a, b) => a.ventas - b.ventas);

    const html = productosSinRotacion.map(prod => `
      <tr>
        <td>${prod.nombre}</td>
        <td>${prod.categoria || 'N/A'}</td>
        <td><strong>${prod.stock}</strong> unidades</td>
        <td>${prod.ventas}</td>
        <td>
          <span style="
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            background: ${prod.ventas === 0 ? '#ffccbc' : '#fff3cd'};
            color: ${prod.ventas === 0 ? '#bf360c' : '#856404'};
          ">
            ${prod.problema}
          </span>
        </td>
        <td>
          <button class="btn btn-pequeno" onclick="editarProducto('${prod.id}')">Editar</button>
        </td>
      </tr>
    `).join('');

    document.getElementById('tabla-sin-rotacion-body').innerHTML = html || '<tr><td colspan="6" style="text-align:center;">Sin datos</td></tr>';

    // Gráfico
    const ctx = document.getElementById('chart-sin-rotacion').getContext('2d');
    
    if (chartSinRotacion) chartSinRotacion.destroy();
    
    chartSinRotacion = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Sin Rotación', 'Con Rotación Normal', 'Stock Crítico'],
        datasets: [{
          data: [
            productosSinRotacion.length,
            productos.filter(p => !productosSinRotacion.find(sr => sr.id === p.id)).length,
            stockMuerto.length
          ],
          backgroundColor: ['#ffccbc', '#c8e6c9', '#ffe0b2'],
          borderColor: ['#bf360c', '#2e7d32', '#e65100'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

  } catch (error) {
    console.error('Error generando reporte sin rotación:', error);
    document.getElementById('tabla-sin-rotacion-body').innerHTML = '<tr><td colspan="6" style="text-align:center; color: red;">Error cargando datos</td></tr>';
  }
}

// ===== SISTEMA DE OFERTAS =====

// Cargar ofertas desde localStorage
function cargarOfertasAdmin() {
  try {
    const ofertasGuardadas = localStorage.getItem('ofertas');
    if (ofertasGuardadas) {
      return JSON.parse(ofertasGuardadas);
    }
  } catch (error) {
    console.error('❌ Error cargando ofertas:', error);
  }
  return [];
}

// Guardar ofertas en localStorage
function guardarOfertasAdmin(ofertas) {
  try {
    localStorage.setItem('ofertas', JSON.stringify(ofertas));
    console.log('✓ Ofertas guardadas');
  } catch (error) {
    console.error('❌ Error guardando ofertas:', error);
  }
}

// Cargar tabla de ofertas
function cargarTablaOfertas() {
  const ofertas = cargarOfertasAdmin();
  const tbody = document.getElementById('tabla-ofertas-body');
  const sinOfertas = document.getElementById('sin-ofertas');
  
  if (!tbody) return;

  if (ofertas.length === 0) {
    tbody.innerHTML = '';
    sinOfertas.style.display = 'block';
    return;
  }

  sinOfertas.style.display = 'none';

  // Cargar productos primero del JSON local
  cargarProductosFromJSON().then(productos => {
    let html = '';

    ofertas.forEach(oferta => {
      const producto = productos.find(p => String(p.id) === String(oferta.productoId));
      if (!producto) return;

      let fila = '';
      
      if (oferta.tipo === 'porcentaje' || oferta.descuento) {
        // Tipo: Descuento por porcentaje
        const precioOriginal = producto.precio;
        const descuento = oferta.descuento || 0;
        const precioFinal = Math.floor(precioOriginal * (1 - descuento / 100));

        fila = `
          <tr>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${precioOriginal.toLocaleString('es-CO')}</td>
            <td><span class="badge-descuento-admin">-${descuento}%</span></td>
            <td>$${precioFinal.toLocaleString('es-CO')}</td>
            <td><span style="background: #E74C3C; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8em;">Descuento</span></td>
            <td><span style="color: #27AE60; font-weight: bold;">✓ Activa</span></td>
            <td style="white-space: nowrap;">
              <button class="btn-accion btn-editar" onclick="editarOferta('${oferta.id}')">Editar</button>
              <button class="btn-accion btn-eliminar" onclick="eliminarOferta('${oferta.productoId}')">Eliminar</button>
            </td>
          </tr>
        `;
      } else if (oferta.tipo === 'cantidad' && oferta.cantidadMinima && oferta.precioEspecial) {
        // Tipo: Precio especial por cantidad
        const precioNormal = producto.precio * oferta.cantidadMinima;
        const precioEspecial = oferta.precioEspecial * oferta.cantidadMinima;
        const ahorro = precioNormal - precioEspecial;

        fila = `
          <tr>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio.toLocaleString('es-CO')} c/u</td>
            <td><span class="badge-descuento-admin">${oferta.cantidadMinima} x $${oferta.precioEspecial.toLocaleString('es-CO')}</span></td>
            <td>Ahorra $${ahorro.toLocaleString('es-CO')}</td>
            <td><span style="background: #27AE60; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8em;">Cantidad</span></td>
            <td><span style="color: #27AE60; font-weight: bold;">✓ Activa</span></td>
            <td style="white-space: nowrap;">
              <button class="btn-accion btn-editar" onclick="editarOferta('${oferta.id}')">Editar</button>
              <button class="btn-accion btn-eliminar" onclick="eliminarOferta('${oferta.productoId}')">Eliminar</button>
            </td>
          </tr>
        `;
      }

      html += fila;
    });

    tbody.innerHTML = html;
  });
}

// Abrir modal para agregar oferta
function abrirModalOferta() {
  const modal = document.getElementById('modal-oferta');
  const formulario = document.getElementById('formulario-oferta');
  const titulo = document.getElementById('modal-oferta-titulo');
  const tipoSelect = document.getElementById('oferta-tipo');

  titulo.textContent = 'Nueva Oferta';
  formulario.reset();
  tipoSelect.value = 'porcentaje';
  cambiarTipoOferta();
  
  // Cargar productos en el select
  cargarProductosFromJSON().then(productos => {
    const select = document.getElementById('oferta-producto');
    select.innerHTML = '<option value="">-- Selecciona un producto --</option>';
    
    productos.forEach(prod => {
      const option = document.createElement('option');
      option.value = prod.id;
      option.textContent = `${prod.nombre} - $${prod.precio.toLocaleString('es-CO')}`;
      select.appendChild(option);
    });
  });

  formulario.onsubmit = function(e) {
    e.preventDefault();
    guardarOferta();
  };

  modal.style.display = 'flex';
}

// Editar oferta
function editarOferta(ofertaId) {
  const ofertas = cargarOfertasAdmin();
  const oferta = ofertas.find(o => o.id === ofertaId);
  
  if (!oferta) return;

  const modal = document.getElementById('modal-oferta');
  const formulario = document.getElementById('formulario-oferta');
  const titulo = document.getElementById('modal-oferta-titulo');

  titulo.textContent = 'Editar Oferta';

  // Cargar productos
  cargarProductosFromJSON().then(productos => {
    const select = document.getElementById('oferta-producto');
    const tipoSelect = document.getElementById('oferta-tipo');
    
    select.innerHTML = '<option value="">-- Selecciona un producto --</option>';
    
    productos.forEach(prod => {
      const option = document.createElement('option');
      option.value = prod.id;
      option.textContent = `${prod.nombre} - $${prod.precio.toLocaleString('es-CO')}`;
      if (String(prod.id) === String(oferta.productoId)) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    // Cargar tipo de oferta
    tipoSelect.value = oferta.tipo || 'porcentaje';
    cambiarTipoOferta();

    // Cargar datos según el tipo
    if (oferta.tipo === 'porcentaje' || oferta.descuento) {
      document.getElementById('oferta-descuento').value = oferta.descuento || 10;
    } else if (oferta.tipo === 'cantidad') {
      document.getElementById('oferta-cantidad-minima').value = oferta.cantidadMinima || 3;
      document.getElementById('oferta-precio-especial').value = oferta.precioEspecial || 0;
    }

    actualizarPrecioOferta();
  });

  formulario.onsubmit = function(e) {
    e.preventDefault();
    guardarOferta(ofertaId);
  };

  modal.style.display = 'flex';
}

// Cambiar tipo de oferta
function cambiarTipoOferta() {
  const tipo = document.getElementById('oferta-tipo').value;
  const seccionPorcentaje = document.getElementById('seccion-porcentaje');
  const seccionCantidad = document.getElementById('seccion-cantidad');

  if (tipo === 'porcentaje') {
    seccionPorcentaje.style.display = 'block';
    seccionCantidad.style.display = 'none';
  } else {
    seccionPorcentaje.style.display = 'none';
    seccionCantidad.style.display = 'block';
  }
  actualizarPrecioOferta();
}

// Actualizar visualización del precio de oferta
function actualizarPrecioOferta() {
  const productoSelect = document.getElementById('oferta-producto');
  const tipoSelect = document.getElementById('oferta-tipo');
  const tipo = tipoSelect.value;

  cargarProductosFromJSON().then(productos => {
    const productoId = productoSelect.value;
    const producto = productos.find(p => String(p.id) === String(productoId));

    if (!producto) return;

    if (tipo === 'porcentaje') {
      const descuentoInput = document.getElementById('oferta-descuento');
      const precioOriginal = document.getElementById('oferta-precio-original');
      const precioFinal = document.getElementById('oferta-precio-final');

      const precio = producto.precio;
      const descuento = Number(descuentoInput.value) || 0;
      const final = Math.floor(precio * (1 - descuento / 100));

      precioOriginal.value = `$${precio.toLocaleString('es-CO')}`;
      precioFinal.value = `$${final.toLocaleString('es-CO')}`;
    } else if (tipo === 'cantidad') {
      const cantidadInput = document.getElementById('oferta-cantidad-minima');
      const precioEspecialInput = document.getElementById('oferta-precio-especial');
      const precioNormalCantidad = document.getElementById('oferta-precio-normal-cantidad');
      const totalEspecial = document.getElementById('oferta-total-especial');

      const cantidad = Number(cantidadInput.value) || 1;
      const precioNormal = producto.precio * cantidad;
      const precioEspecial = Number(precioEspecialInput.value) || 0;
      const totalEsp = precioEspecial * cantidad;

      precioNormalCantidad.value = `$${precioNormal.toLocaleString('es-CO')} (${cantidad} × $${producto.precio.toLocaleString('es-CO')})`;
      totalEspecial.value = `$${totalEsp.toLocaleString('es-CO')} (${cantidad} × $${precioEspecial.toLocaleString('es-CO')})`;
    }
  });
}

// Guardar oferta
function guardarOferta(ofertaId = null) {
  const productoId = document.getElementById('oferta-producto').value;
  const tipo = document.getElementById('oferta-tipo').value;

  if (!productoId) {
    alert('❌ Por favor selecciona un producto');
    return;
  }

  let nuevaOferta = {
    id: ofertaId || 'oferta_' + Date.now(),
    productoId: productoId,
    tipo: tipo,
    fechaCreacion: new Date().toISOString(),
    activa: true
  };

  if (tipo === 'porcentaje') {
    const descuento = Number(document.getElementById('oferta-descuento').value);
    if (!descuento || descuento < 1 || descuento > 100) {
      alert('❌ Ingresa un descuento válido (1-100)');
      return;
    }
    nuevaOferta.descuento = descuento;
  } else if (tipo === 'cantidad') {
    const cantidadMinima = Number(document.getElementById('oferta-cantidad-minima').value);
    const precioEspecial = Number(document.getElementById('oferta-precio-especial').value);
    if (!cantidadMinima || cantidadMinima < 2 || !precioEspecial || precioEspecial < 0) {
      alert('❌ Ingresa una cantidad válida (mínimo 2) y un precio especial');
      return;
    }
    nuevaOferta.cantidadMinima = cantidadMinima;
    nuevaOferta.precioEspecial = precioEspecial;
  }

  let ofertas = cargarOfertasAdmin();

  if (ofertaId) {
    // Actualizar oferta existente
    const indexOferta = ofertas.findIndex(o => o.id === ofertaId);
    if (indexOferta > -1) {
      ofertas[indexOferta] = nuevaOferta;
    }
  } else {
    // Verificar si el producto ya tiene oferta
    const existente = ofertas.find(o => String(o.productoId) === String(productoId));
    if (existente) {
      alert('❌ Este producto ya tiene una oferta activa');
      return;
    }
    ofertas.push(nuevaOferta);
  }

  guardarOfertasAdmin(ofertas);
  cerrarModalOferta();
  cargarTablaOfertas();
  mostrarMensajeAdmin('✓ Oferta guardada exitosamente', 'exito');
}

// Eliminar oferta
function eliminarOferta(productoId) {
  if (!confirm('¿Estás seguro que deseas eliminar esta oferta?')) {
    return;
  }

  let ofertas = cargarOfertasAdmin();
  ofertas = ofertas.filter(o => String(o.productoId) !== String(productoId));

  guardarOfertasAdmin(ofertas);
  cargarTablaOfertas();
  alert('✓ Oferta eliminada');
}

// Cerrar modal de oferta
function cerrarModalOferta() {
  document.getElementById('modal-oferta').style.display = 'none';
}

// ===== INICIALIZACIÓN DE SECCIÓN DE CONFIGURACIÓN =====
// Esta función se ejecuta después de que todo el script está cargado
async function initAdminAccountSection() {
  const creds = await getAdminCredenciales();
  if (creds && creds.email) {
    const emailInput = document.getElementById('admin-email');
    if (emailInput) emailInput.value = creds.email;
  }

  const btnChangePass = document.getElementById('btn-change-admin-pass');
  if (btnChangePass) {
    btnChangePass.addEventListener('click', async function() {
      const current = document.getElementById('admin-current-password').value || '';
      const nw = document.getElementById('admin-new-password').value || '';
      const conf = document.getElementById('admin-confirm-password').value || '';
      const msg = document.getElementById('admin-pass-msg');
      msg.textContent = '';

      if (!current || !nw || !conf) { 
        msg.textContent = 'Por favor completa todos los campos.'; 
        msg.className='mensaje mensaje-error'; 
        return; 
      }
      if (nw !== conf) { 
        msg.textContent = 'Las contraseñas nuevas no coinciden.'; 
        msg.className='mensaje mensaje-error'; 
        return; 
      }

      const stored = localStorage.getItem('admin-cred');
      const adminCred = stored ? JSON.parse(stored) : {};

      if (adminCred.password !== current) {
        msg.textContent = 'Contraseña actual incorrecta.';
        msg.className='mensaje mensaje-error';
        return;
      }

      adminCred.password = nw;
      localStorage.setItem('admin-cred', JSON.stringify(adminCred));
      msg.textContent = 'Contraseña actualizada correctamente';
      msg.className='mensaje mensaje-exito';

      setTimeout(() => {
        document.getElementById('admin-current-password').value = '';
        document.getElementById('admin-new-password').value = '';
        document.getElementById('admin-confirm-password').value = '';
        msg.textContent = '';
      }, 2000);
    });
  }
}

// Ejecutar inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminAccountSection);
} else {
  // El DOM ya está cargado (esto puede pasar si el script se carga después)
  initAdminAccountSection();
}

// ===== HEADER QUE SE CONTRAE AL SCROLLEAR =====
(() => {
  let lastScroll = 0;
  const header = document.querySelector('header');

  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100 && currentScroll > lastScroll) {
        header.classList.add('header-hidden');
      } else if (currentScroll < 100 || currentScroll < lastScroll) {
        header.classList.remove('header-hidden');
      }

      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });
  }
})();
