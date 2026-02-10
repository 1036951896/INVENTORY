// ===== SISTEMA DE OFERTAS =====

// Variable global para almacenar ofertas
let ofertas = [];
let ofertasFiltradas = [];

// Cargar ofertas desde localStorage
function cargarOfertas() {
  try {
    const ofertasGuardadas = localStorage.getItem('ofertas');
    if (ofertasGuardadas) {
      ofertas = JSON.parse(ofertasGuardadas);
      console.log('✓ Ofertas cargadas desde localStorage:', ofertas.length);
    } else {
      ofertas = [];
      console.log('ℹ️ No hay ofertas guardadas');
    }
  } catch (error) {
    console.error('❌ Error cargando ofertas:', error);
    ofertas = [];
  }
  ofertasFiltradas = [...ofertas];
}

// Obtener producto completo por ID desde la lista de productos
function obtenerProductoPorId(id) {
  return productos.find(p => String(p.id) === String(id));
}

// Enriquecer oferta con datos del producto
function enriquecerOferta(oferta) {
  const producto = obtenerProductoPorId(oferta.productoId);
  if (producto) {
    return {
      ...oferta,
      nombre: producto.nombre,
      imagen: producto.imagen,
      categoria: producto.categoria,
      stock: producto.stock
    };
  }
  return oferta;
}

// Mostrar productos en oferta en el grid
function cargarProductosOferta(productosOfertas = ofertasFiltradas) {
  const grid = document.getElementById('productos-grid');
  const sinOfertas = document.getElementById('sin-ofertas');
  
  if (!grid) return;

  // Si no hay ofertas
  if (productosOfertas.length === 0) {
    grid.innerHTML = '';
    if (sinOfertas) sinOfertas.style.display = 'block';
    document.getElementById('total-ofertas').textContent = '0';
    return;
  }

  if (sinOfertas) sinOfertas.style.display = 'none';
  grid.innerHTML = '';

  productosOfertas.forEach(oferta => {
    const producto = obtenerProductoPorId(oferta.productoId);
    if (!producto) return;

    const precioOriginal = producto.precio;
    const descuentoPorcentaje = oferta.descuento || 0;
    const precioOferta = Math.floor(precioOriginal * (1 - descuentoPorcentaje / 100));

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-producto';
    
    const nombreCategoria = obtenerNombreCategoria(producto.categoria);
    
    tarjeta.innerHTML = `
      <div class="tarjeta-producto-imagen" style="position: relative;">
        <div class="badge-descuento">-${descuentoPorcentaje}%</div>
        <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.onerror=null;this.src='../assets/product-placeholder.svg'">
      </div>
      <div class="tarjeta-producto-contenido">
        <div class="tarjeta-producto-nombre">${producto.nombre}</div>
        <div class="tarjeta-producto-categoria">${nombreCategoria}</div>
        
        <div>
          <div class="precio-original">$${precioOriginal.toLocaleString('es-CO')}</div>
          <div class="precio-oferta">$${precioOferta.toLocaleString('es-CO')}</div>
        </div>
        
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

  document.getElementById('total-ofertas').textContent = productosOfertas.length;
}

// Cargar categorías de los productos en oferta para filtros
function cargarFiltrosOfertas() {
  const contenedorFiltros = document.getElementById('filtros-ofertas');
  if (!contenedorFiltros) return;

  // Extraer categorías únicas de las ofertas
  const categoriasUnicas = new Set();
  ofertas.forEach(oferta => {
    const producto = obtenerProductoPorId(oferta.productoId);
    if (producto && producto.categoria) {
      const nombreCategoria = obtenerNombreCategoria(producto.categoria);
      if (nombreCategoria) categoriasUnicas.add(nombreCategoria);
    }
  });

  const categoriasArray = Array.from(categoriasUnicas).sort();

  // Crear filtro "Todas"
  let html = `
    <button class="filtro-oferta activo" onclick="filtrarOfertasPorCategoria('todas')">
      Todas (${ofertas.length})
    </button>
  `;

  // Agregar cada categoría
  categoriasArray.forEach(categoria => {
    const count = ofertas.filter(o => {
      const producto = obtenerProductoPorId(o.productoId);
      return producto && obtenerNombreCategoria(producto.categoria) === categoria;
    }).length;
    
    html += `
      <button class="filtro-oferta" onclick="filtrarOfertasPorCategoria('${categoria}')">
        ${categoria} (${count})
      </button>
    `;
  });

  contenedorFiltros.innerHTML = html;
}

// Filtrar ofertas por categoría
function filtrarOfertasPorCategoria(categoria) {
  // Actualizar estado activo de botones
  document.querySelectorAll('.filtro-oferta').forEach(btn => {
    btn.classList.remove('activo');
  });
  event.target.classList.add('activo');

  // Filtrar
  if (categoria === 'todas') {
    ofertasFiltradas = [...ofertas];
  } else {
    ofertasFiltradas = ofertas.filter(oferta => {
      const producto = obtenerProductoPorId(oferta.productoId);
      return producto && obtenerNombreCategoria(producto.categoria) === categoria;
    });
  }

  cargarProductosOferta(ofertasFiltradas);
}

// Filtrar ofertas por búsqueda
function filtrarOfertasPorBusqueda(termino) {
  const terminoLower = termino.toLowerCase().trim();

  if (terminoLower === '') {
    ofertasFiltradas = [...ofertas];
  } else {
    ofertasFiltradas = ofertas.filter(oferta => {
      const producto = obtenerProductoPorId(oferta.productoId);
      if (!producto) return false;
      
      const nombreCategoria = obtenerNombreCategoria(producto.categoria);
      return producto.nombre.toLowerCase().includes(terminoLower) ||
             nombreCategoria.toLowerCase().includes(terminoLower);
    });
  }

  cargarProductosOferta(ofertasFiltradas);
}

// Agregar oferta a un producto
window.agregarOferta = function(productoId, descuento) {
  const ofertaExistente = ofertas.find(o => String(o.productoId) === String(productoId));
  
  if (ofertaExistente) {
    // Actualizar oferta existente
    ofertaExistente.descuento = descuento;
    ofertaExistente.fechaCreacion = new Date().toISOString();
  } else {
    // Crear nueva oferta
    ofertas.push({
      id: 'oferta_' + Date.now(),
      productoId: productoId,
      descuento: descuento,
      fechaCreacion: new Date().toISOString(),
      activa: true
    });
  }

  guardarOfertas();
  mostrarNotificacion(`✓ Oferta ${ofertaExistente ? 'actualizada' : 'agregada'} exitosamente`);
};

// Eliminar oferta
window.eliminarOferta = function(productoId) {
  ofertas = ofertas.filter(o => String(o.productoId) !== String(productoId));
  guardarOfertas();
  mostrarNotificacion('✓ Oferta eliminada');
  
  // Recargar si estamos en página de ofertas
  if (document.getElementById('productos-grid')) {
    cargarOfertas();
    cargarProductosOferta();
    cargarFiltrosOfertas();
  }
};

// Guardar ofertas en localStorage
function guardarOfertas() {
  try {
    localStorage.setItem('ofertas', JSON.stringify(ofertas));
    console.log('✓ Ofertas guardadas');
    
    // Notificar otras pestañas
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'ofertas',
      newValue: JSON.stringify(ofertas),
      oldValue: null,
      storageArea: localStorage
    }));
  } catch (error) {
    console.error('❌ Error guardando ofertas:', error);
  }
}

// Verificar si un producto tiene oferta
window.tieneOferta = function(productoId) {
  return ofertas.some(o => String(o.productoId) === String(productoId));
};

// Obtener descuento de oferta para un producto
window.obtenerDescuentoOferta = function(productoId) {
  const oferta = ofertas.find(o => String(o.productoId) === String(productoId));
  return oferta ? oferta.descuento : 0;
};

// Contar ofertas activas
window.contarOfertas = function() {
  return ofertas.length;
};

// Escuchar cambios en ofertas desde otras pestañas
window.addEventListener('storage', function(e) {
  if (e.key === 'ofertas' && e.newValue) {
    try {
      ofertas = JSON.parse(e.newValue);
      ofertasFiltradas = [...ofertas];
      if (document.getElementById('productos-grid')) {
        cargarProductosOferta();
        cargarFiltrosOfertas();
      }
    } catch (err) {
      console.error('Error procesando ofertas desde storage:', err);
    }
  }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Cargar productos primero (desde app.js)
  cargarProductosJSON().then(() => {
    productos = productos.map(p => ({ ...p, imagen: normalizarImagenUrl(p.imagen) }));
    
    // Luego cargar ofertas
    cargarOfertas();
    
    // Mostrar productos en oferta
    cargarProductosOferta();
    cargarFiltrosOfertas();
    
    // Verificar usuario
    verificarUsuarioLogueado();
    verificarAdmin();

    // Actualizar carrito
    actualizarCarrito();

    // Búsqueda
    const inputBuscar = document.getElementById('buscar');
    if (inputBuscar) {
      inputBuscar.addEventListener('input', function() {
        filtrarOfertasPorBusqueda(this.value);
      });
    }

    // Eventos del carrito
    const btnCarrito = document.getElementById('btn-carrito');
    if (btnCarrito) {
      btnCarrito.addEventListener('click', function() {
        document.getElementById('carrito-panel').classList.toggle('activo');
      });
    }

    const btnCerrar = document.getElementById('cerrar-carrito');
    if (btnCerrar) {
      btnCerrar.addEventListener('click', function() {
        document.getElementById('carrito-panel').classList.remove('activo');
      });
    }

    // Botón finalizar pedido
    const btnFinalizar = document.getElementById('finalizar-pedido');
    if (btnFinalizar) {
      btnFinalizar.addEventListener('click', async function() {
        btnFinalizar.disabled = true;
        btnFinalizar.textContent = 'Procesando...';

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) {
          btnFinalizar.disabled = false;
          btnFinalizar.textContent = 'Finalizar Pedido';
          window.location.href = 'login.html';
          return;
        }

        if (!validarPermisosCliente('crear_pedidos')) {
          btnFinalizar.disabled = false;
          btnFinalizar.textContent = 'Finalizar Pedido';
          mostrarNotificacion('❌ No tienes permisos para crear pedidos');
          return;
        }

        if (!usuario.access_token) {
          alert('❌ Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          localStorage.removeItem('usuario');
          window.location.href = 'login.html';
          return;
        }

        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
          btnFinalizar.disabled = false;
          btnFinalizar.textContent = 'Finalizar Pedido';
          return;
        }

        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        const items = carrito.map(item => ({
          productoId: String(item.id),
          cantidad: item.cantidad,
          precioUnitario: item.precio
        }));

        try {
          console.log('📤 Enviando orden al backend...');
          
          const resp = await fetch(`${BACKEND_URL}/api/v1/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${usuario.access_token}`
            },
            body: JSON.stringify({
              items: items
            })
          });

          let data;
          try {
            data = await resp.json();
          } catch (e) {
            data = {};
          }

          if (!resp.ok) {
            let msg = 'No se pude registrar el pedido';
            if (resp.status === 401) {
              msg = data.message || 'No autorizado. Inicia sesión nuevamente.';
            } else if (resp.status === 404) {
              msg = `Endpoint no encontrado: ${BACKEND_URL}/api/v1/orders`;
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

          const itemsTexto = carrito.map(item => `• ${item.nombre} x${item.cantidad}`).join('%0A');
          const totalFormato = total.toLocaleString('es-CO');
          const mensaje = `Nuevo Pedido 🛒%0A%0ARadicado: ${pedidoCreado.id}%0ACliente: ${usuario.nombre}%0ATelefono: ${usuario.telefono || 'No proporcionado'}%0A%0A*ITEMS:*%0A${itemsTexto}%0A%0A*Total:* $${totalFormato}%0A%0APor favor autorizar o rechazar`;
          const numeroAdmin = '573116579677';
          const urlWhatsApp = `https://wa.me/${numeroAdmin}?text=${mensaje}`;

          setTimeout(() => {
            localStorage.setItem('urlWhatsAppPendiente', urlWhatsApp);
            window.location.href = 'confirmacion-pedido.html?pedido=' + pedidoCreado.id;
          }, 500);
        } catch (err) {
          console.error('💥 Error al enviar el pedido:', err);
          btnFinalizar.disabled = false;
          btnFinalizar.textContent = 'Finalizar Pedido';
          mostrarNotificacion('✗ ' + err.message);
        }
      });
    }

    // Función para cargar carrito
    function bindCartEvents() {
      const carritoPanel = document.getElementById('carrito-panel');
      const btnCarrito = document.getElementById('btn-carrito');
      const btnCerrar = document.getElementById('cerrar-carrito');
      
      if (btnCarrito && carritoPanel) {
        btnCarrito.addEventListener('click', function(e) {
          e.stopPropagation();
          carritoPanel.classList.toggle('activo');
        });
      }
      
      if (btnCerrar && carritoPanel) {
        btnCerrar.addEventListener('click', function(e) {
          e.stopPropagation();
          carritoPanel.classList.remove('activo');
        });
      }
      
      document.addEventListener('click', function(e) {
        if (carritoPanel && carritoPanel.classList.contains('activo') && !carritoPanel.contains(e.target) && e.target.id !== 'btn-carrito') {
          carritoPanel.classList.remove('activo');
        }
      });
    }

    bindCartEvents();
  });
});
