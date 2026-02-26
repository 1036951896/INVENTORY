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
  
  // Funciones del header
  mostrarBtnAdminSiValido();
  cargarCategoriasDropdown();
  configurarEventos();
  
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
  
  // PRECIO Y DESCUENTO (con psicología)
  const precioActual = productoActual.precio;
  const precioOriginal = Math.round(precioActual * 1.1); // Simular 10% descuento
  const descuento = Math.round(((precioOriginal - precioActual) / precioOriginal) * 100);
  
  // Mostrar precio original tachado
  const precioOriginalEl = document.getElementById('precio-original');
  precioOriginalEl.textContent = '$' + precioOriginal.toLocaleString('es-CO');
  
  // Mostrar precio actual
  document.getElementById('precio-producto').textContent = '$' + precioActual.toLocaleString('es-CO');
  
  // Mostrar badge de descuento
  const descuentoBadge = document.getElementById('descuento-badge');
  descuentoBadge.textContent = `-${descuento}%`;
  
  // Cuota (psicología: pago en cuotas)
  const cuotasInfo = document.getElementById('cuota-info');
  const cuotaMensual = Math.round(precioActual / 3);
  cuotasInfo.textContent = `En 3x de $${cuotaMensual.toLocaleString('es-CO')} sin interés`;
  
  // ETIQUETA DE URGENCIA/VENTAS
  const soldBadge = document.getElementById('sold-badge');
  const ventasAleatorias = Math.floor(Math.random() * 30) + 10; // 10-40 vendidos
  soldBadge.innerHTML = `🔥 ${ventasAleatorias} vendidos esta semana`;
  
  // IMAGEN
  document.getElementById('imagen-producto').src = productoActual.imagen;
  
  // STOCK CON PSICOLOGÍA
  const stockEl = document.getElementById('stock-producto');
  if (productoActual.stock === 0) {
    stockEl.textContent = '❌ Sin stock disponible';
    stockEl.className = 'detalle-stock-disponible sin';
    document.getElementById('cantidad-detalle').max = 0;
    document.querySelector('.btn-comprar-ahora').disabled = true;
    document.querySelector('.btn-agregar-carrito').disabled = true;
  } else if (productoActual.stock < 5) {
    stockEl.textContent = `⚠️ Solo ${productoActual.stock} disponible(s) - ¡Apúrate!`;
    stockEl.className = 'detalle-stock-disponible bajo';
    document.getElementById('cantidad-detalle').max = productoActual.stock;
  } else {
    stockEl.textContent = `🟢 En stock — ${productoActual.stock} disponibles`;
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

function irAlCarrito() {
  // Simular clic en el botón de carrito
  const btnCarrito = document.getElementById('btn-carrito');
  if (btnCarrito) {
    btnCarrito.click();
  }
}

// ===== FUNCIONES PARA HEADER =====

// Toggle menú categorías
function toggleCategorias() {
  const dropdownCategorias = document.getElementById('dropdown-categorias');
  if (dropdownCategorias) {
    if (dropdownCategorias.style.display === 'none' || !dropdownCategorias.style.display) {
      dropdownCategorias.style.display = 'block';
    } else {
      dropdownCategorias.style.display = 'none';
    }
  }
}

// Cerrar menú de categorías
function cerrarMenuCategorias() {
  const dropdownCategorias = document.getElementById('dropdown-categorias');
  if (dropdownCategorias) {
    dropdownCategorias.style.display = 'none';
  }
}

// Cerrar menú al hacer click afuera
document.addEventListener('click', function(e) {
  const dropdownCategorias = document.getElementById('dropdown-categorias');
  const btnHamburguesa = document.getElementById('btn-hamburguesa');
  
  if (dropdownCategorias && btnHamburguesa && !btnHamburguesa.contains(e.target) && !dropdownCategorias.contains(e.target)) {
    cerrarMenuCategorias();
  }
});

// Cargar categorías en el dropdown
function cargarCategoriasDropdown() {
  const dropdownList = document.getElementById('categorias-dropdown-lista');
  if (!dropdownList) return;

  // Obtener todas las categorías únicas de products
  const categorias = new Set();
  productosDetalle.forEach(prod => {
    const categoria = obtenerCategoria(prod.nombre);
    if (categoria) categorias.add(categoria);
  });

  // Limpiar e insertar opción "Todas"
  dropdownList.innerHTML = `
    <a href="index.html" class="categoria-item" data-categoria="todas">
      <svg class="icono-categoria-dropdown" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5h2v2H3zm4 0h14v2H7zm0 4h14v2H7zm0 4h14v2H7zm0 4h14v2H7zM3 9h2v2H3zm0 4h2v2H3zm0 4h2v2H3z"/>
      </svg>
      <span>Catálogo</span>
    </a>
  `;

  // Agregar categorías dinámicas
  categorias.forEach(cat => {
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'categoria-item';
    link.dataset.categoria = cat;
    link.innerHTML = `
      <svg class="icono-categoria-dropdown" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      </svg>
      <span>${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
    `;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarMenuCategorias();
      if (cat === 'todas') {
        window.location.href = 'index.html';
      }
    });
    dropdownList.appendChild(link);
  });
}

// Función para abrir el buscador en móvil
window.abrirBuscador = function() {
  const inputBuscar = document.getElementById('buscar');
  
  if (window.innerWidth < 768) {
    const modal = document.createElement('div');
    modal.id = 'modal-busqueda';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5); z-index: 999;
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 60px;
    `;
    
    modal.innerHTML = `
      <div style="width: 90%; max-width: 500px; background: white; border-radius: 12px; padding: 1rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
          <input type="text" id="buscar-modal" placeholder="Buscar producto..." style="flex: 1; padding: 0.75rem; border: 1px solid #B6E1F2; border-radius: 6px; font-size: 0.95rem;">
          <button onclick="document.getElementById('modal-busqueda').remove()" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #999;">✕</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    const inputModal = document.getElementById('buscar-modal');
    inputModal.focus();
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  } else {
    inputBuscar.focus();
  }
};

// Mostrar botón admin si es válido
function mostrarBtnAdminSiValido() {
  try {
    const usuarioClienteStr = localStorage.getItem('usuario');
    if (usuarioClienteStr) {
      return;
    }
    
    const adminUsuarioStr = localStorage.getItem('admin-usuario');
    const adminToken = localStorage.getItem('admin-token');
    
    if (!adminUsuarioStr || !adminToken) {
      return;
    }
    
    try {
      const adminUsuario = JSON.parse(adminUsuarioStr);
      if (adminUsuario && (adminUsuario.rol === 'ADMIN' || adminUsuario.rol === 'admin')) {
        const contenedor = document.getElementById('contenedor-btn-admin');
        if (!contenedor) return;
        
        contenedor.innerHTML = `
          <button class="btn-icono" onclick="window.location.href='admin.html'" title="Panel de Administrador">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 3h-2.5a2.5 2.5 0 0 0 0 5H16"></path>
              <path d="M8 3H5.5a2.5 2.5 0 0 0 0 5H8"></path>
              <path d="M12 11v4"></path>
              <path d="M8 13h8"></path>
            </svg>
          </button>
        `;
      }
    } catch (e) {
      console.error('Error parseando admin usuario:', e);
    }
  } catch (e) {
    console.error('Error en mostrarBtnAdminSiValido:', e);
  }
}

// Configurar eventos del buscador
function configurarEventos() {
  const inputBuscar = document.getElementById('buscar');
  if (!inputBuscar) return;

  inputBuscar.addEventListener('input', function() {
    const limpiar = document.querySelector('.btn-limpiar-buscar');
    if (limpiar) {
      limpiar.style.display = this.value ? 'block' : 'none';
    }
  });
}
