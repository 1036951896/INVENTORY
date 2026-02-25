// ===== DETALLE DE PRODUCTO =====

let productoActual = null;
let productosDetalle = []; // Cambio: usar nombre diferente para evitar conflicto con app.js

// Función para obtener categoría basada en el nombre
function obtenerCategoria(nombre) {
  nombre = nombre.toLowerCase();
  if (nombre.includes('papa') || nombre.includes('ripio') || nombre.includes('maiz') || nombre.includes('yuca')) {
    return 'snacks';
  } else if (nombre.includes('vini') || nombre.includes('aluminio') || nombre.includes('rollo') || nombre.includes('lam') || nombre.includes('bolsa') || nombre.includes('sachet') || nombre.includes('salsa') || nombre.includes('mayo')) {
    return 'limpieza';
  } else if (nombre.includes('guante') || nombre.includes('parafinado') || nombre.includes('porta') || nombre.includes('servilleta') || nombre.includes('toalla') || nombre.includes('papel')) {
    return 'higiene';
  }
  return 'varios';
}

// Normalizar / validar URL de imagen
function normalizarImagenUrl(url) {
  if (!url || typeof url !== 'string') return (window.BACKEND_URL || 'http://localhost:3000') + '/assets/product-placeholder.svg';
  url = url.trim();
  if (/^\d+x\d+$/.test(url)) {
    return (window.BACKEND_URL || 'http://localhost:3000') + '/assets/product-placeholder.svg';
  }
  // Si estamos en desarrollo local (localhost) y la URL apunta a producción (Render),
  // reemplazar con la URL local
  if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
      url.includes('storehub-api-74yl.onrender.com')) {
    url = url.replace('https://storehub-api-74yl.onrender.com', 'http://localhost:3000');
  }
  if (url.startsWith('data:') || url.startsWith('./') || url.startsWith('../') || url.startsWith('/') || /^https?:\/\//i.test(url)) {
    return url;
  }
  if (/^[\w-]+\.(png|jpg|jpeg|svg|webp)$/i.test(url)) {
    return '../assets/' + url;
  }
  return (window.BACKEND_URL || 'http://localhost:3000') + '/assets/product-placeholder.svg';
}

// Cargar productos desde JSON
async function cargarProductosJSON() {
  try {
    // Cargar desde JSON local
    const responseLocal = await fetch('../data/productos-imagenes.json');
    if (responseLocal.ok) {
      const dataLocal = await responseLocal.json();
      productosDetalle = dataLocal.productos.map(prod => ({
        id: String(prod.id),
        nombre: prod.nombre,
        categoria: prod.categoria || '',
        precio: prod.precio,
        stock: prod.stock,
        imagen: normalizarImagenUrl(prod.imagen),
        descripcion: prod.descripcion || prod.nombre
      }));
      console.log('✅ Productos cargados desde JSON en detalle-producto');
      return;
    }
  } catch (error) {
    console.error('❌ Error cargando productos desde JSON:', error);
  }
  // Si falla, inicializar vacío
  productosDetalle = [];
}

document.addEventListener('DOMContentLoaded', async function() {
  // Cargar productos del JSON
  await cargarProductosJSON();
  
  // Obtener ID del producto
  const params = new URLSearchParams(window.location.search);
  const idProducto = String(params.get('id'));
  
  // Buscar producto
  productoActual = productosDetalle.find(p => String(p.id) === idProducto);
  
  if (!productoActual) {
    window.location.href = 'index.html';
    return;
  }
  
  // Cargar datos del producto
  cargarDetalleProducto();
  
  // Cargar productos relacionados
  cargarProductosRelacionados();
  
  // Verificar usuario
  verificarUsuarioLogueado();
  
  // Configurar eventos del carrito
  document.getElementById('btn-carrito').addEventListener('click', function() {
    document.getElementById('carrito-panel').classList.toggle('activo');
  });
  
  document.getElementById('cerrar-carrito').addEventListener('click', function() {
    document.getElementById('carrito-panel').classList.remove('activo');
  });
  
  // Inicializar carrito
  actualizarCarrito();
});

function cargarDetalleProducto() {
  document.getElementById('nombre-producto').textContent = productoActual.nombre;
  document.getElementById('descripcion-producto').textContent = 
    productoActual.descripcion || 'Producto de excelente calidad. Ideal para tus necesidades del hogar y abarrotes.';
  document.getElementById('precio-producto').textContent = '$' + productoActual.precio.toLocaleString('es-CO');
  document.getElementById('categoria-producto').textContent = productoActual.categoria.toUpperCase();
  document.getElementById('imagen-producto').src = productoActual.imagen;
  
  // Actualizar stock
  const stockEl = document.getElementById('stock-producto');
  if (productoActual.stock === 0) {
    stockEl.textContent = '⛔ Sin stock disponible';
    stockEl.className = 'detalle-stock-disponible sin';
    document.getElementById('cantidad-detalle').max = 0;
    document.getElementById('agregar-contenedor').classList.add('deshabilitado');
    document.querySelector('.detalle-agregar button').disabled = true;
  } else if (productoActual.stock < 5) {
    stockEl.textContent = `⚠️ Solo ${productoActual.stock} unidad(es) disponible(s)`;
    stockEl.className = 'detalle-stock-disponible bajo';
    document.getElementById('cantidad-detalle').max = productoActual.stock;
  } else {
    stockEl.textContent = `✓ ${productoActual.stock} unidades disponibles`;
    stockEl.className = 'detalle-stock-disponible';
    document.getElementById('cantidad-detalle').max = productoActual.stock;
  }
}

function cargarProductosRelacionados() {
  // Obtener productos de la misma categoría (máximo 4)
  const relacionados = productosDetalle
    .filter(p => p.categoria === productoActual.categoria && String(p.id) !== String(productoActual.id))
    .slice(0, 4);
  
  if (relacionados.length === 0) return;
  
  const seccionRelacionados = document.getElementById('seccion-relacionados');
  const gridRelacionados = document.getElementById('productos-relacionados');
  
  seccionRelacionados.style.display = 'block';
  
  let html = '';
  relacionados.forEach(p => {
    html += `
      <div class="tarjeta-producto-mini" onclick="irAProducto('${p.id}')">
        <div class="tarjeta-producto-mini-imagen">
          <img src="${p.imagen}" alt="${p.nombre}">
        </div>
        <div class="tarjeta-producto-mini-info">
          <div class="tarjeta-producto-mini-nombre">${p.nombre}</div>
          <div class="tarjeta-producto-mini-precio">$${p.precio.toLocaleString('es-CO')}</div>
        </div>
      </div>
    `;
  });
  
  gridRelacionados.innerHTML = html;
}

function aumentarCantidad() {
  const input = document.getElementById('cantidad-detalle');
  const cantidad = parseInt(input.value) + 1;
  if (cantidad <= parseInt(input.max)) {
    input.value = cantidad;
  }
}

function disminuirCantidad() {
  const input = document.getElementById('cantidad-detalle');
  const cantidad = parseInt(input.value) - 1;
  if (cantidad >= 1) {
    input.value = cantidad;
  }
}

function actualizarCantidadDetalle(cantidad) {
  const input = document.getElementById('cantidad-detalle');
  cantidad = parseInt(cantidad) || 1;
  
  // Validar que esté dentro de los límites
  if (cantidad < 1) {
    cantidad = 1;
  }
  if (cantidad > parseInt(input.max)) {
    cantidad = parseInt(input.max);
  }
  
  input.value = cantidad;
}

function agregarAlCarritoDetalle() {
  if (productoActual.stock === 0) {
    alert2('Este producto no está disponible', 'error');
    return;
  }
  
  const cantidad = parseInt(document.getElementById('cantidad-detalle').value);
  
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Buscar si el producto ya existe en el carrito
  const itemExistente = carrito.find(item => item.id === productoActual.id);
  
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id: productoActual.id,
      nombre: productoActual.nombre,
      precio: productoActual.precio,
      imagen: productoActual.imagen,
      cantidad: cantidad
    });
  }
  
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
  
  // Mostrar confirmación
  mostrarConfirmacion(`✓ ${productoActual.nombre} agregado al carrito (${cantidad} unidad${cantidad > 1 ? 'es' : ''})`);
  
  // Resetear cantidad
  document.getElementById('cantidad-detalle').value = 1;
}

function mostrarConfirmacion(mensaje) {
  const contenedor = document.createElement('div');
  contenedor.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #27AE60;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 600;
  `;
  contenedor.textContent = mensaje;
  document.body.appendChild(contenedor);
  
  setTimeout(() => {
    contenedor.remove();
  }, 3000);
}

function verificarUsuarioLogueado() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const menuUsuario = document.getElementById('menu-usuario');
  
  if (usuario) {
    menuUsuario.innerHTML = `
      <div class="usuario-info">
        <span>${usuario.nombre}</span>
        <button class="btn btn-secundario" onclick="cerrarSesion()" style="padding: 0.5rem 1rem;">Salir</button>
      </div>
    `;
  }
}

function cerrarSesion() {
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

function irAProducto(id) {
  window.location.href = 'detalle-producto.html?id=' + id;
}
