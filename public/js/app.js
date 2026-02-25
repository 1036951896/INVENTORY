
// ===== FUNCIÓN ALERT2 - NOTIFICACIÓN MEJORADA =====
/**
 * Alert mejorado para StoreHub
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - 'success', 'error', 'warning', 'info' (por defecto)
 */
function alert2(message, type = 'info') {
  const iconos = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colores = {
    success: '#27AE60',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB'
  };

  const icon = iconos[type] || iconos.info;
  const color = colores[type] || colores.info;

  const contenedor = document.createElement('div');
  contenedor.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${color};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10001;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    font-size: 0.95rem;
    line-height: 1.4;
  `;
  contenedor.textContent = icon + ' ' + message;
  document.body.appendChild(contenedor);

  setTimeout(() => {
    contenedor.style.opacity = '0';
    contenedor.style.transition = 'opacity 0.3s ease';
    setTimeout(() => contenedor.remove(), 300);
  }, 4000);
}

// ===== APLICACIÓN E-COMMERCE =====

// Función para abrir búsqueda expandible en mobile
function abrirBuscador() {
  const buscador = document.querySelector('.barra-busqueda-contenedor-desktop');
  if (buscador) {
    buscador.classList.add('activo');
    const input = document.getElementById('buscar');
    if (input) {
      input.focus();
    }
  }
}

// Función para cerrar búsqueda expandible
function cerrarBuscador() {
  const buscador = document.querySelector('.barra-busqueda-contenedor-desktop');
  if (buscador) {
    buscador.classList.remove('activo');
  }
}

// Validar permisos de cliente
function validarPermisosCliente(permisoRequerido) {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  return usuario.permisos && usuario.permisos[permisoRequerido];
}

/**
 * Función fallback para obtener dirección
 * Si direcciones.js no cargó correctamente, proporciona versión simplificada
 */
if (typeof obtenerDireccionSeleccionada === 'undefined') {
  console.warn('⚠️ obtenerDireccionSeleccionada no está disponible, usando fallback');
  window.obtenerDireccionSeleccionada = async function() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const direccionId = localStorage.getItem('direccionSeleccionada');
    
    // Si hay dirección en localStorage, devolverla
    if (direccionId) {
      try {
        const resp = await fetch(`${window.BACKEND_URL}/api/v1/addresses/${direccionId}`, {
          headers: {
            'Authorization': `Bearer ${usuario.access_token}`
          }
        });
        if (resp.ok) {
          return await resp.json();
        }
      } catch (e) {
        console.error('Error obteniendo dirección:', e);
      }
    }

    // Si no hay dirección específica, obtener la principal
    try {
      const resp = await fetch(`${window.BACKEND_URL}/api/v1/addresses/principal`, {
        headers: {
          'Authorization': `Bearer ${usuario.access_token}`
        }
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.error('Error obteniendo dirección principal:', e);
    }

    // Fallback final: retornar dirección mínima
    return {
      id: 'default',
      calle: 'Dirección no especificada',
      numero: '0',
      ciudad: 'No especificada',
      pais: 'Colombia',
      codigoPostal: '00000',
      principal: true
    };
  };
}

// ===== MENÚ HAMBURGUESA CATEGORÍAS =====
document.addEventListener('DOMContentLoaded', () => {

  const btnCategoriasMenu = document.getElementById('btn-categorias-menu');
  const categoriasLista = document.getElementById('categorias-lista');

  if (btnCategoriasMenu && categoriasLista) {
    // Toggle del menú
    btnCategoriasMenu.addEventListener('click', (e) => {
      e.preventDefault();
      btnCategoriasMenu.classList.toggle('activo');
      categoriasLista.classList.toggle('activo');
    });

    // Cerrar menú cuando se hace clic en una categoría
    categoriasLista.querySelectorAll('.categoria').forEach(categoria => {
      categoria.addEventListener('click', () => {
        btnCategoriasMenu.classList.remove('activo');
        categoriasLista.classList.remove('activo');
      });
    });

    // Cerrar menú cuando se redimensiona a pantalla grande
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        btnCategoriasMenu.classList.remove('activo');
        categoriasLista.classList.remove('activo');
      }
    });
  }
});

// ===== GESTIÓN DEL CARRITO (Funciones globales) =====

function actualizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const carritoContenido = document.getElementById('carrito-contenido');
  const totalCarrito = document.getElementById('total-carrito');
  const contador = document.getElementById('contador');
  const btnConfirmar = document.getElementById('confirmar-pedido');

  // Si los elementos no existen aún, salir
  if (!carritoContenido || !totalCarrito || !contador || !btnConfirmar) {
    return;
  }

  // Actualizar contador
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  contador.textContent = totalItems;

  // Si el carrito está vacío
  if (carrito.length === 0) {
    carritoContenido.innerHTML = '<div class="carrito-vacio"><p>Tu carrito está vacío</p></div>';
    totalCarrito.textContent = '$0.00';
    btnConfirmar.disabled = true;
    return;
  }

  // Mostrar items del carrito
  let html = '';
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `
      <div class="carrito-item">
        <div class="carrito-item-imagen">
          <img src="${item.imagen}" alt="${item.nombre}" onerror="this.onerror=null;this.src='${(window.BACKEND_URL || 'http://localhost:3000')}/assets/product-placeholder.svg'">
        </div>
        <div class="carrito-item-info">
          <div class="carrito-item-nombre">${item.nombre}</div>
          <div class="carrito-item-precio">$${item.precio.toLocaleString('es-CO')}</div>
          <div class="carrito-item-cantidad">
            <button onclick="modificarCantidad('${item.id}', -1)">−</button>
            <input type="number" value="${item.cantidad}" min="1" onchange="cambiarCantidadDirecta('${item.id}', this.value)">
            <button onclick="modificarCantidad('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="carrito-item-eliminar" onclick="eliminarDelCarrito('${item.id}')">🗑️</button>
      </div>
    `;
  });

  carritoContenido.innerHTML = html;
  totalCarrito.textContent = '$' + total.toLocaleString('es-CO');
  btnConfirmar.disabled = false;
  
  // Esta función ya no es necesaria pues la dirección no se muestra en carrito
  // actualizarDireccionMostrada();
}

/**
 * Actualizar dirección mostrada en el carrito - DEPRECATED
 * Esta función ya no se usa pues la dirección se selecciona en un modal aparte
 */
async function actualizarDireccionMostrada() {
  // Mantener para compatibilidad pero no hacer nada
  return;
}

function modificarCantidad(id, cambio) {
  // Convertir ID a string
  id = String(id);
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const item = carrito.find(i => String(i.id) === id);

  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      carrito = carrito.filter(i => String(i.id) !== id);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
  }
}

function cambiarCantidadDirecta(id, cantidad) {
  // Convertir ID a string y cantidad a número
  id = String(id);
  cantidad = parseInt(cantidad) || 1;
  
  // Validar que la cantidad sea mayor a 0
  if (cantidad < 1) {
    cantidad = 1;
  }
  
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const item = carrito.find(i => String(i.id) === id);

  if (item) {
    item.cantidad = cantidad;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
  }
}

function eliminarDelCarrito(id) {
  // Convertir ID a string
  id = String(id);
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(item => String(item.id) !== id);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

// Base de datos de productos por defecto
let productos = [];
let productosFiltrados = [];
let ofertas = [];

// Cargar ofertas desde localStorage
function cargarOfertas() {
  try {
    const ofertasGuardadas = localStorage.getItem('ofertas');
    if (ofertasGuardadas) {
      ofertas = JSON.parse(ofertasGuardadas);
      console.log('✓ Ofertas cargadas:', ofertas);
    } else {
      ofertas = [];
    }
  } catch (error) {
    console.error('❌ Error cargando ofertas:', error);
    ofertas = [];
  }
}

// Obtener oferta de un producto
function obtenerOferta(productoId) {
  return ofertas.find(o => String(o.productoId) === String(productoId));
}

// Calcular precio con oferta
function calcularPrecioConOferta(producto) {
  const oferta = obtenerOferta(producto.id);
  if (!oferta) {
    return {
      precio: producto.precio,
      tieneOferta: false
    };
  }

  // Tipo 1: Descuento por porcentaje
  if (oferta.tipo === 'porcentaje' || oferta.descuento) {
    const descuento = oferta.descuento || 0;
    const precioFinal = Math.floor(producto.precio * (1 - descuento / 100));
    return {
      precioOriginal: producto.precio,
      precio: precioFinal,
      tieneOferta: true,
      tipo: 'porcentaje',
      descuento: descuento,
      ahorros: producto.precio - precioFinal
    };
  }

  // Tipo 2: Precio especial por cantidad
  if (oferta.tipo === 'cantidad' && oferta.cantidadMinima && oferta.precioEspecial) {
    return {
      precioOriginal: producto.precio,
      precio: producto.precio,
      tieneOferta: true,
      tipo: 'cantidad',
      cantidadMinima: oferta.cantidadMinima,
      precioEspecial: oferta.precioEspecial,
      texto: `${oferta.cantidadMinima} por $${oferta.precioEspecial.toLocaleString('es-CO')}`
    };
  }

  return {
    precio: producto.precio,
    tieneOferta: false
  };
}

// Cargar productos desde JSON local (tiene imágenes y datos correctos)
async function cargarProductosJSON() {
  try {
    console.log('📦 Cargando productos desde JSON local...');
    const responseLocal = await fetch('../data/productos-imagenes.json');
    if (responseLocal.ok) {
      const dataLocal = await responseLocal.json();
      productos = dataLocal.productos.map(prod => ({
        id: String(prod.id),
        nombre: prod.nombre,
        categoria: prod.categoria || '',
        precio: prod.precio,
        stock: prod.stock,
        imagen: prod.imagen || '',
        descripcion: prod.descripcion || prod.nombre
      }));
      productosFiltrados = [...productos];
      console.log('✅ Productos cargados desde JSON - ' + productos.length + ' productos');
      return;
    }
  } catch (error) {
    console.error('❌ Error cargando productos desde JSON:', error);
  }
  // Si todo falla, inicializar vacío
  productos = [];
  productosFiltrados = [];
}

// Función para determinar categoría basada en el nombre
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

// Normalizar / validar URL de imagen; devuelve placeholder si la URL está mal formada
function normalizarImagenUrl(url) {
  if (!url || typeof url !== 'string') return (window.BACKEND_URL || 'http://localhost:3000') + '/assets/product-placeholder.svg';

  url = url.trim();

  // Si parece un tamaño suelto como "250x200" sin más context, rechazar
  if (/^\d+x\d+$/.test(url)) {
    return (window.BACKEND_URL || 'http://localhost:3000') + '/assets/product-placeholder.svg';
  }

  // Si estamos en desarrollo local (localhost) y la URL apunta a producción (Render),
  // reemplazar con la URL local
  if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
      url.includes('storehub-api-74yl.onrender.com')) {
    url = url.replace('https://storehub-api-74yl.onrender.com', 'http://localhost:3000');
  }

  // Aceptar data URIs, rutas relativas (./, ../) y URLs absolutas (http(s)://)
  if (url.startsWith('data:') || url.startsWith('./') || url.startsWith('../') || /^https?:\/\//i.test(url)) {
    return url;
  }
  
  // Si comienza con /, agregar BACKEND_URL
  if (url.startsWith('/')) {
    return (window.BACKEND_URL || 'http://localhost:3000') + url;
  }

  // Si llega algo como imagen.svg (sin ruta), prefijar assets
  if (/^[\w-]+\.(png|jpg|jpeg|svg|webp)$/i.test(url)) {
    return '../assets/' + url;
  }

  // Por defecto, fallback al placeholder
  return (window.BACKEND_URL || 'http://localhost:3000') + '/assets/product-placeholder.svg';
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', function() {
  // Cargar primero los productos desde JSON
  cargarProductosJSON().then(() => {
    // Cargar ofertas
    cargarOfertas();
    
    // Normalizar imágenes de productos cargados
    productos = productos.map(p => ({ ...p, imagen: normalizarImagenUrl(p.imagen) }));
    cargarProductos();
    cargarCategoriasDinámicas();  // ← NUEVA LÍNEA: Cargar categorías dinámicamente
    cargarCategoriasDinámicasDropdown();  // Cargar categorías en dropdown
    verificarUsuarioLogueado();
    verificarAdmin();
    configurarEventos();
    escucharCambiosProductos();

    // Buscador móvil interactivo
    const buscadorContenedor = document.querySelector('.barra-busqueda-contenedor-desktop');
    const inputBuscar = document.getElementById('buscar');
    
    if (buscadorContenedor && inputBuscar) {
      // Cerrar búsqueda al hacer clic fuera
      document.addEventListener('click', (e) => {
        const btnBusqueda = document.getElementById('btn-busqueda-movil');
        
        // Si está activa y se hace clic fuera
        if (buscadorContenedor.classList.contains('activo')) {
          if (!buscadorContenedor.contains(e.target) && !btnBusqueda.contains(e.target)) {
            // Cerrar si el input está vacío
            if (inputBuscar.value === '') {
              cerrarBuscador();
            }
          }
        }
      });
      
      // Cerrar al pulsar Escape
      inputBuscar.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          cerrarBuscador();
        }
      });
    }

    // Inicializar carrito y eventos relacionados
    const btnConfirmar = document.getElementById('confirmar-pedido');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', async function() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        
        if (!usuario) {
          window.location.href = 'login.html';
          return;
        }

        // Validar permisos para crear pedidos
        if (!validarPermisosCliente('crear_pedidos')) {
          alert2('No tienes permisos para crear pedidos', 'error');
          return;
        }

        if (!usuario.access_token) {
          alert2('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 'error');
          localStorage.removeItem('usuario');
          window.location.href = 'login.html';
          return;
        }

        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
          return;
        }

        // Mostrar selector de dirección
        mostrarSelectorDirecciones(() => {
          // Callback cuando se confirma la dirección
          procederAlPedido();
        });
      });
    }

    // Inicializar vista del carrito
    actualizarCarrito();
    
    // Escuchar cambios en la dirección seleccionada
    window.addEventListener('direccionSeleccionada', () => {
      actualizarDireccionMostrada();
    });

// ===== FLUJO DE PEDIDO =====
/**
 * Proceder al envío del pedido después de confirmar dirección
 */
async function procederAlPedido() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.access_token) {
      alert2('Necesitas estar logueado para continuar', 'error');
      window.location.href = 'login.html';
      return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
      alert2('Tu carrito está vacío', 'warning');
      return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const items = carrito.map(item => ({
      productoId: String(item.id),
      cantidad: item.cantidad,
      precioUnitario: item.precio
    }));

    // Obtener dirección seleccionada
    const direccion = await obtenerDireccionSeleccionada();
    if (!direccion) {
      alert2('Por favor selecciona una dirección de entrega', 'error');
      return;
    }

    console.log('📤 Enviando orden al backend...');

    const resp = await fetch(`${window.BACKEND_URL}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usuario.access_token}`
      },
      body: JSON.stringify({
        items: items,
        direccionId: direccion.id
      })
    });

    let data;
    try {
      data = await resp.json();
    } catch (e) {
      data = {};
    }

    if (!resp.ok) {
      let msg = 'No se pudo registrar el pedido';
      if (resp.status === 401) {
        msg = data.message || 'No autorizado. Inicia sesión nuevamente.';
      } else if (resp.status === 404) {
        msg = `Endpoint no encontrado: ${window.BACKEND_URL}/api/v1/orders`;
      } else if (resp.status === 400) {
        msg = data.message || 'Datos inválidos.';
      } else if (resp.status === 500) {
        msg = 'Error interno del servidor. Intenta más tarde.';
      } else if (data.message) {
        msg = data.message;
      }
      throw new Error(msg);
    }

    const pedidoCreado = data;
    localStorage.removeItem('carrito');

    // Preparar mensaje para WhatsApp
    const itemsTexto = carrito.map(item => `• ${item.nombre} x${item.cantidad}`).join('%0A');
    const totalFormato = total.toLocaleString('es-CO');
    const mensaje = `Nuevo Pedido 🛒%0A%0ARadicado: ${pedidoCreado.id}%0ACliente: ${usuario.nombre}%0ATelefono: ${usuario.telefono || 'No proporcionado'}%0A%0A*ITEMS:*%0A${itemsTexto}%0A%0A*Total:* $${totalFormato}%0A%0APor favor autorizar o rechazar`;
    const numeroAdmin = '573116579677';
    const urlWhatsApp = `https://wa.me/${numeroAdmin}?text=${mensaje}`;

    localStorage.setItem('urlWhatsAppPendiente', urlWhatsApp);
    
    // Redirigir a página de confirmación
    setTimeout(() => {
      window.location.href = 'confirmacion-pedido.html?pedido=' + pedidoCreado.id;
    }, 500);

  } catch (err) {
    console.error('💥 Error al proceder con el pedido:', err);
    alert2(err.message, 'error');
  }
}

// --- GESTIÓN DE EVENTOS DEL CARRITO ---
function bindCartEvents() {
  const carritoPanel = document.getElementById('carrito-panel');
  const btnCarrito = document.getElementById('btn-carrito');
  const btnCerrar = document.getElementById('cerrar-carrito');
  try {
    var attached = false;
    if (btnCarrito && carritoPanel) {
      btnCarrito.addEventListener('click', function(e) {
        e.stopPropagation();
        carritoPanel.classList.toggle('activo');
      });
      attached = true;
    }
    if (btnCerrar && carritoPanel) {
      btnCerrar.addEventListener('click', function(e) {
        e.stopPropagation();
        carritoPanel.classList.remove('activo');
      });
      attached = true;
    }
    // Fallback: delegación de eventos en documento para clicks en el botón del carrito
    if (!attached) {
      document.addEventListener('click', function(evt) {
        var btn = evt.target.closest ? evt.target.closest('#btn-carrito') : null;
        if (btn && carritoPanel) {
          evt.stopPropagation();
          carritoPanel.classList.toggle('activo');
        }
      });
    }
    // Cerrar carrito si se hace clic fuera del panel
    document.addEventListener('click', function(e) {
      if (carritoPanel && carritoPanel.classList.contains('activo') && !carritoPanel.contains(e.target) && e.target.id !== 'btn-carrito') {
        carritoPanel.classList.remove('activo');
      }
    });
  } catch (e) {}
}

// Exponer helpers para debug globalmente
window.openCarrito = function() {
  const carritoPanel = document.getElementById('carrito-panel');
  if (carritoPanel) carritoPanel.classList.add('activo');
};
window.closeCarrito = function() {
  const carritoPanel = document.getElementById('carrito-panel');
  if (carritoPanel) carritoPanel.classList.remove('activo');
};

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  bindCartEvents();
});
  });
});

// Obtener nombre de categoría (válido para string y objeto)
function obtenerNombreCategoria(categoria) {
  if (!categoria) return '';
  if (typeof categoria === 'string') return categoria;
  if (typeof categoria === 'object' && categoria.nombre) return categoria.nombre;
  return '';
}

// Cargar categorías dinámicamente desde los productos
function cargarCategoriasDinámicas() {
  const categoriasList = document.getElementById('categorias-lista');
  if (!categoriasList) return;
  
  // Extraer categorías únicas de los productos
  const categoriasUnicas = new Set();
  productos.forEach(p => {
    const nombreCategoria = obtenerNombreCategoria(p.categoria);
    if (nombreCategoria && nombreCategoria.trim()) {
      categoriasUnicas.add(nombreCategoria.trim());
    }
  });
  
  // Convertir a array y ordenar
  const categoriasArray = Array.from(categoriasUnicas).sort();
  
  // Crear icono SVG genérico para las categorías
  const iconoSVG = `<svg class="icono-categoria" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
  </svg>`;
  
  // Reconstruir el HTML con "Todas" y las categorías dinámicas
  let html = `
    <a href="#" class="categoria activo" data-categoria="todas" onclick="filtrarPorCategoria('todas', event)">
      <svg class="icono-categoria" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5h2v2H3zm4 0h14v2H7zm0 4h14v2H7zm0 4h14v2H7zm0 4h14v2H7zM3 9h2v2H3zm0 4h2v2H3zm0 4h2v2H3z"/>
      </svg>
      <span>Todas</span>
    </a>
  `;
  
  // Agregar cada categoría única
  categoriasArray.forEach(categoria => {
    html += `
      <a href="#" class="categoria" data-categoria="${categoria}" onclick="filtrarPorCategoria('${categoria}', event)">
        ${iconoSVG}
        <span>${categoria}</span>
      </a>
    `;
  });
  
  categoriasList.innerHTML = html;
}

// Cargar productos en el grid
function cargarProductos(productosMostrar = productos) {
  const grid = document.getElementById('productos-grid');
  
  // Si el grid no existe, no es una página con productos (puede ser login, etc)
  if (!grid) {
    console.log('ℹ️ Grid de productos no encontrado (página sin catálogo)');
    return;
  }
  
  grid.innerHTML = '';

  productosMostrar.forEach(producto => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-producto';
    const nombreCategoria = obtenerNombreCategoria(producto.categoria);
    const ofertaInfo = calcularPrecioConOferta(producto);
    
    // Generar HTML basado en si tiene oferta o no
    let precioHTML = '';
    if (ofertaInfo.tieneOferta && ofertaInfo.tipo === 'porcentaje') {
      precioHTML = `
        <div class="tarjeta-producto-precio-oferta">
          <span class="precio-original" style="text-decoration: line-through; color: #999;">$${ofertaInfo.precioOriginal.toLocaleString('es-CO')}</span>
          <span class="precio-final" style="color: #E74C3C; font-size: 1.2em; font-weight: bold;">$${ofertaInfo.precio.toLocaleString('es-CO')}</span>
          <span class="oferta-badge" style="background: #E74C3C; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8em; font-weight: bold;">-${ofertaInfo.descuento}%</span>
        </div>
      `;
    } else if (ofertaInfo.tieneOferta && ofertaInfo.tipo === 'cantidad') {
      precioHTML = `
        <div class="tarjeta-producto-precio-oferta">
          <span class="precio-normal">$${ofertaInfo.precio.toLocaleString('es-CO')}</span>
          <span class="oferta-badge" style="background: #27AE60; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8em; font-weight: bold;">🎉 ${ofertaInfo.texto}</span>
        </div>
      `;
    } else {
      precioHTML = `<div class="tarjeta-producto-precio">$${producto.precio.toLocaleString('es-CO')}</div>`;
    }
    
    tarjeta.innerHTML = `
      <div class="tarjeta-producto-imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.onerror=null;this.src='${(window.BACKEND_URL || 'http://localhost:3000')}/assets/product-placeholder.svg'">
      </div>
      <div class="tarjeta-producto-contenido">
        <div class="tarjeta-producto-nombre">${producto.nombre}</div>
        <div class="tarjeta-producto-categoria">${nombreCategoria}</div>
        ${precioHTML}
        <div class="tarjeta-producto-stock">
          Stock: <strong>${producto.stock}</strong>
        </div>
        <div class="tarjeta-producto-botones">
          <button class="btn btn-principal" onclick="agregarAlCarrito('${producto.id}')">
            Agregar al carrito
          </button>
          <button class="btn btn-secundario" onclick="verDetalle('${producto.id}')">
            Ver más
          </button>
        </div>
      </div>
    `;
    grid.appendChild(tarjeta);
  });
}

// Filtrar por categoría (función global para ser llamada desde HTML)
function filtrarPorCategoria(categoria, event) {
  if (event) {
    event.preventDefault();
  }
  
  // Encontrar el elemento de categoría que fue clickeado
  let categoriaElement = event.target;
  if (!categoriaElement.classList.contains('categoria')) {
    categoriaElement = categoriaElement.closest('.categoria');
  }
  
  // Actualizar clase activa
  document.querySelectorAll('.categoria').forEach(cat => cat.classList.remove('activo'));
  if (categoriaElement) {
    categoriaElement.classList.add('activo');
  }
  
  // Filtrar productos
  if (categoria.toLowerCase() === 'todas') {
    productosFiltrados = [...productos];
  } else {
    productosFiltrados = productos.filter(p => {
      const nombreCategoria = obtenerNombreCategoria(p.categoria);
      return nombreCategoria && nombreCategoria.toLowerCase() === categoria.toLowerCase();
    });
  }
  cargarProductos(productosFiltrados);
}

// Filtrar por categoría (para los eventos del DOM después de cargar)
function configurarEventos() {
  const categorias = document.querySelectorAll('.categoria');
  if (categorias.length === 0) {
    console.log('ℹ️ Categorías no encontradas (página sin catálogo)');
    return;
  }
  
  // Las categorías ya tienen onclick en el HTML, pero agregamos listener adicional
  categorias.forEach(categoria => {
    categoria.addEventListener('click', function(e) {
      e.preventDefault();
      const cat = this.getAttribute('data-categoria');
      filtrarPorCategoria(cat, {target: this});
    });
  });

  // Búsqueda
  const inputBuscar = document.getElementById('buscar');
  if (!inputBuscar) return;
  
  inputBuscar.addEventListener('input', function() {
    const termino = this.value.toLowerCase().trim();
    
    if (termino === '') {
      productosFiltrados = [...productos];
      cargarProductos(productosFiltrados);
    } else {
      productosFiltrados = productos.filter(p => {
        const nombreCategoria = obtenerNombreCategoria(p.categoria);
        return p.nombre.toLowerCase().includes(termino) ||
               nombreCategoria.toLowerCase().includes(termino);
      });
      cargarProductos(productosFiltrados);
    }
  });

  // Evento del botón carrito
  document.getElementById('btn-carrito').addEventListener('click', function() {
    document.getElementById('carrito-panel').classList.toggle('activo');
  });

  // Cerrar carrito
  document.getElementById('cerrar-carrito').addEventListener('click', function() {
    document.getElementById('carrito-panel').classList.remove('activo');
  });
}

// Escuchar cambios en los productos desde el panel admin
function escucharCambiosProductos() {
  window.addEventListener('storage', function(e) {
    if (e.key === 'productos-admin' && e.newValue) {
      // Actualizar productos desde localStorage (sanitizando imágenes)
      try {
        const parsed = JSON.parse(e.newValue);
        const cleaned = parsed.map(p => ({ ...p, imagen: normalizarImagenUrl(p.imagen) }));
        productos = cleaned;
        productosFiltrados = [...productos];
        cargarProductos(productos);
        cargarCategoriasDinámicas();  // Actualizar categorías también
        cargarCategoriasDinámicasDropdown();  // Actualizar categorías en dropdown también
        mostrarNotificacion('✓ Catálogo actualizado con nuevos productos');
      } catch (err) {
        console.error('Error procesando productos-admin desde storage:', err);
      }
    }
  });
}

// Ver detalle de producto
function verDetalle(id) {
  // Convertir ID a string
  id = String(id);
  const producto = productos.find(p => String(p.id) === id);
  if (producto) {
    // Guardar producto actual en sessionStorage y navegar a detalle
    sessionStorage.setItem('productoDetalle', JSON.stringify(producto));
    window.location.href = 'detalle-producto.html?id=' + id;
  }
}

// Agregar al carrito
function agregarAlCarrito(id) {
  // Validar permisos de cliente
  if (!validarPermisosCliente('ver_carrito')) {
    mostrarNotificacion('❌ Debes iniciar sesión para agregar productos al carrito');
    window.location.href = 'login.html';
    return;
  }
  
  // Convertir ID a string
  id = String(id);
  
  const producto = productos.find(p => String(p.id) === id);
  if (!producto) {
    console.error('Producto no encontrado:', id);
    return;
  }

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Verificar si el producto ya está en el carrito
  const itemExistente = carrito.find(item => String(item.id) === id);
  
  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
  
  // Mostrar mensaje
  mostrarNotificacion(`✓ ${producto.nombre} agregado al carrito`);
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
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
  `;
  contenedor.textContent = mensaje;
  document.body.appendChild(contenedor);

  setTimeout(() => {
    contenedor.remove();
  }, 3000);
}

// Verificar usuario logueado
function verificarUsuarioLogueado() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const menuUsuario = document.getElementById('menu-usuario');

  if (usuario) {
    menuUsuario.innerHTML = `
      <div class="usuario-info" style="display: flex; align-items: center; gap: 1rem; color: white;">
        <span style="color: white; font-weight: 500;">${usuario.nombre}</span>
        <button 
          class="btn-logout" 
          onclick="cerrarSesion()" 
          title="Cerrar sesión"
          style="
            background: none;
            border: none;
            cursor: pointer;
            color: white;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            transition: all 0.3s ease;
          "
          onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)'"
          onmouseout="this.style.backgroundColor='transparent'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    `;
  }
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

// Mostrar botón de admin para el número del propietario
function verificarAdmin() {
  const btnAdmin = document.getElementById('btnAdmin');

  // Mostrar el enlace de admin solo si existe un token admin en localStorage
  const tokenAdmin = localStorage.getItem('admin-token');
  if (btnAdmin) {
    if (tokenAdmin) {
      btnAdmin.style.display = 'inline-block';
    } else {
      btnAdmin.style.display = 'none';
    }
  }
}

// ===== DROPDOWN DE CATEGORÍAS =====
function toggleCategorias() {
  const dropdown = document.getElementById('dropdown-categorias');
  if (dropdown) {
    dropdown.classList.toggle('activo');
  }
}

function cargarCategoriasDinámicasDropdown() {
  const dropdownLista = document.getElementById('categorias-dropdown-lista');
  if (!dropdownLista) return;
  
  // Extraer categorías únicas de los productos
  const categoriasUnicas = new Set();
  productos.forEach(p => {
    const nombreCategoria = obtenerNombreCategoria(p.categoria);
    if (nombreCategoria && nombreCategoria.trim()) {
      categoriasUnicas.add(nombreCategoria.trim());
    }
  });
  
  // Convertir a array y ordenar
  const categoriasArray = Array.from(categoriasUnicas).sort();
  
  // Crear HTML con "Todas" y las categorías dinámicas
  let html = `
    <a href="#" class="categoria-item activo" data-categoria="todas" onclick="filtrarPorCategoria('todas', event); toggleCategorias();">
      <svg class="icono-categoria-dropdown" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5h2v2H3zm4 0h14v2H7zm0 4h14v2H7zm0 4h14v2H7zm0 4h14v2H7zM3 9h2v2H3zm0 4h2v2H3zm0 4h2v2H3z"/>
      </svg>
      <span>Todas</span>
    </a>
  `;
  
  // Agregar cada categoría única
  categoriasArray.forEach(categoria => {
    html += `
      <a href="#" class="categoria-item" data-categoria="${categoria}" onclick="filtrarPorCategoria('${categoria}', event); toggleCategorias();">
        <svg class="icono-categoria-dropdown" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 5h2v2H3zm4 0h14v2H7zm0 4h14v2H7zm0 4h14v2H7zm0 4h14v2H7zM3 9h2v2H3zm0 4h2v2H3zm0 4h2v2H3z"/>
        </svg>
        <span>${categoria}</span>
      </a>
    `;
  });
  
  dropdownLista.innerHTML = html;
}

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('dropdown-categorias');
  const btnHamburguesa = document.getElementById('btn-hamburguesa');
  
  if (dropdown && btnHamburguesa) {
    if (!dropdown.contains(event.target) && !btnHamburguesa.contains(event.target)) {
      dropdown.classList.remove('activo');
    }
  }
});

// (verificarAdmin se ejecuta desde el flujo principal DOMContentLoaded)
