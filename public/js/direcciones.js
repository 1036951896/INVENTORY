/**
 * Gestión de Direcciones de Entrega
 */

/**
 * Obtener todas las direcciones del usuario
 */
async function obtenerDirecciones() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.access_token) {
    console.warn('⚠️ Usuario no autenticado');
    return [];
  }

  try {
    const resp = await fetch(`${window.BACKEND_URL}/api/v1/addresses`, {
      headers: {
        'Authorization': `Bearer ${usuario.access_token}`
      }
    });

    if (resp.ok) {
      return await resp.json();
    }
    return [];
  } catch (err) {
    console.error('❌ Error obteniendo direcciones:', err);
    return [];
  }
}

/**
 * Obtener dirección principal
 */
async function obtenerDireccionPrincipal() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.access_token) {
    return null;
  }

  try {
    const resp = await fetch(`${window.BACKEND_URL}/api/v1/addresses/principal`, {
      headers: {
        'Authorization': `Bearer ${usuario.access_token}`
      }
    });

    if (resp.ok) {
      return await resp.json();
    }
    return null;
  } catch (err) {
    console.error('❌ Error obteniendo dirección principal:', err);
    return null;
  }
}

/**
 * Crear una nueva dirección
 */
async function crearDireccion(datosDireccion) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.access_token) {
    throw new Error('Usuario no autenticado');
  }

  const resp = await fetch(`${window.BACKEND_URL}/api/v1/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${usuario.access_token}`
    },
    body: JSON.stringify(datosDireccion)
  });

  if (!resp.ok) {
    const data = await resp.json();
    throw new Error(data.message || 'Error al crear dirección');
  }

  return await resp.json();
}

/**
 * Crear dirección predeterminada si el usuario no tiene ninguna
 */
async function crearDireccionPredeterminada() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.access_token) {
    console.warn('⚠️ Usuario no autenticado, no se puede crear dirección');
    return;
  }

  try {
    const direcciones = await obtenerDirecciones();
    
    if (direcciones && direcciones.length > 0) {
      console.log('✅ El usuario ya tiene direcciones registradas');
      return;
    }

    console.log('📝 Creando dirección predeterminada para el usuario...');

    const direccionPredeterminada = {
      calle: 'Calle Principal',
      numero: '123',
      ciudad: usuario.ciudad || 'Bogotá',
      departamento: usuario.departamento || 'Cundinamarca',
      pais: 'Colombia',
      codigoPostal: '110111',
      esPrincipal: true,
      detallesAdicionales: 'Dirección de prueba'
    };

    const nueva = await crearDireccion(direccionPredeterminada);
    console.log('✅ Dirección predeterminada creada:', nueva);
  } catch (err) {
    console.warn('⚠️ No se pudo crear dirección predeterminada:', err.message);
  }
}

/**
 * Mostrar modal para agregar/editar dirección
 */
function mostrarModalDireccion(direccion = null) {
  const titulo = direccion ? 'Editar Dirección' : 'Agregar Dirección';
  const botonTexto = direccion ? 'Actualizar' : 'Agregar';

  const modalHTML = `
    <div class="modal-overlay" id="modal-direccion" onclick="cerrarModalDireccion()">
      <div class="modal-contenido" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>${titulo}</h2>
          <button class="btn-cerrar" onclick="cerrarModalDireccion()">✕</button>
        </div>
        
        <form id="form-direccion" onsubmit="guardarDireccion(event)">
          <div class="form-grupo">
            <label for="calle">Calle *</label>
            <input 
              type="text" 
              id="calle" 
              name="calle" 
              required 
              value="${direccion?.calle || ''}"
              placeholder="Cra. 7"
            >
          </div>

          <div class="form-grupo">
            <label for="numero">Número *</label>
            <input 
              type="text" 
              id="numero" 
              name="numero" 
              required 
              value="${direccion?.numero || ''}"
              placeholder="45-23"
            >
          </div>

          <div class="form-grupo">
            <label for="apartamento">Apartamento (Opcional)</label>
            <input 
              type="text" 
              id="apartamento" 
              name="apartamento" 
              value="${direccion?.apartamento || ''}"
              placeholder="Apt. 501"
            >
          </div>

          <div class="form-grupo">
            <label for="ciudad">Ciudad *</label>
            <input 
              type="text" 
              id="ciudad" 
              name="ciudad" 
              required 
              value="${direccion?.ciudad || ''}"
              placeholder="Bogotá"
            >
          </div>

          <div class="form-grupo">
            <label for="departamento">Departamento *</label>
            <input 
              type="text" 
              id="departamento" 
              name="departamento" 
              required 
              value="${direccion?.departamento || ''}"
              placeholder="Cundinamarca"
            >
          </div>

          <div class="form-grupo">
            <label for="pais">País</label>
            <input 
              type="text" 
              id="pais" 
              name="pais" 
              value="${direccion?.pais || 'Colombia'}"
              placeholder="Colombia"
            >
          </div>

          <div class="form-grupo">
            <label for="codigoPostal">Código Postal (Opcional)</label>
            <input 
              type="text" 
              id="codigoPostal" 
              name="codigoPostal" 
              value="${direccion?.codigoPostal || ''}"
              placeholder="110111"
            >
          </div>

          <div class="form-grupo">
            <label for="detallesAdicionales">Detalles Adicionales (Opcional)</label>
            <textarea 
              id="detallesAdicionales" 
              name="detallesAdicionales" 
              placeholder="Puerta roja, portero disponible de 8AM-6PM"
            >${direccion?.detallesAdicionales || ''}</textarea>
          </div>

          <div class="form-grupo checkbox">
            <input 
              type="checkbox" 
              id="esPrincipal" 
              name="esPrincipal" 
              ${direccion?.esPrincipal ? 'checked' : ''}
            >
            <label for="esPrincipal">Establecer como dirección principal</label>
          </div>

          <div class="modal-acciones">
            <button type="button" class="btn btn-secundario" onclick="cerrarModalDireccion()">Cancelar</button>
            <button type="submit" class="btn btn-principal">${botonTexto}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Añadir el modal al body si no existe
  let modal = document.getElementById('modal-direccion');
  if (modal) {
    modal.remove();
  }

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Agregar estilos si no existen
  if (!document.getElementById('estilos-modal-direccion')) {
    const estilos = document.createElement('style');
    estilos.id = 'estilos-modal-direccion';
    estilos.textContent = `
      .modal-overlay {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-contenido {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid #E0E0E0;
        padding-bottom: 1rem;
      }

      .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
      }

      .btn-cerrar {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      }

      .form-grupo {
        margin-bottom: 1rem;
      }

      .form-grupo label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #333;
      }

      .form-grupo input,
      .form-grupo textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #DDD;
        border-radius: 4px;
        font-size: 1rem;
        font-family: inherit;
      }

      .form-grupo textarea {
        resize: vertical;
        min-height: 80px;
      }

      .form-grupo.checkbox {
        display: flex;
        align-items: center;
      }

      .form-grupo.checkbox input {
        width: auto;
        margin-right: 0.5rem;
      }

      .form-grupo.checkbox label {
        margin-bottom: 0;
      }

      .modal-acciones {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #E0E0E0;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }

      .btn-principal {
        background-color: #007bff;
        color: white;
      }

      .btn-principal:hover {
        background-color: #0056b3;
      }

      .btn-secundario {
        background-color: #E0E0E0;
        color: #333;
      }

      .btn-secundario:hover {
        background-color: #D0D0D0;
      }
    `;
    document.head.appendChild(estilos);
  }
}

/**
 * Cerrar modal de dirección
 */
function cerrarModalDireccion() {
  const modal = document.getElementById('modal-direccion');
  if (modal) {
    modal.remove();
  }
}

/**
 * Guardar dirección (crear o actualizar)
 */
async function guardarDireccion(event) {
  event.preventDefault();

  const form = document.getElementById('form-direccion');
  const formData = new FormData(form);

  const datosDireccion = {
    calle: formData.get('calle'),
    numero: formData.get('numero'),
    apartamento: formData.get('apartamento') || undefined,
    ciudad: formData.get('ciudad'),
    departamento: formData.get('departamento'),
    pais: formData.get('pais'),
    codigoPostal: formData.get('codigoPostal') || undefined,
    detallesAdicionales: formData.get('detallesAdicionales') || undefined,
    esPrincipal: formData.get('esPrincipal') === 'on'
  };

  try {
    const nueva = await crearDireccion(datosDireccion);
    console.log('✅ Dirección guardada:', nueva);
    cerrarModalDireccion();
    
    // Actualizar selector si está abierto
    const selectorAbierto = document.getElementById('modal-selector-direcciones');
    if (selectorAbierto) {
      cerrarSelectorDirecciones();
      setTimeout(() => mostrarSelectorDirecciones(), 500);
    }
    
    alert('✅ Dirección guardada correctamente');
  } catch (err) {
    console.error('❌ Error al guardar dirección:', err);
    alert('❌ Error: ' + err.message);
  }
}

/**
 * Mostrar modal para seleccionar dirección de entrega
 */
async function mostrarSelectorDirecciones(callback = null) {
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
  if (!usuarioGuardado || !usuarioGuardado.access_token) {
    alert2('Por favor inicia sesión primero', 'error');
    return;
  }

  try {
    const direcciones = await obtenerDirecciones();

    if (!direcciones || direcciones.length === 0) {
      alert2('No tienes direcciones registradas. Por favor agrega una dirección de entrega.', 'warning');
      mostrarModalDireccion();
      return;
    }

    const direccionSeleccionada = localStorage.getItem('direccionSeleccionada');

    const modalHTML = `
      <div class="modal-overlay" id="modal-selector-direcciones" onclick="cerrarSelectorDirecciones()">
        <div class="modal-contenido" onclick="event.stopPropagation()" style="max-width: 600px;">
          <div class="modal-header">
            <h2>📍 Seleccionar Dirección de Entrega</h2>
            <button class="btn-cerrar" onclick="cerrarSelectorDirecciones()">✕</button>
          </div>
          
          <div class="direcciones-lista">
            ${direcciones.map(dir => `
              <div class="direccion-item ${dir.id === direccionSeleccionada ? 'seleccionada' : ''}" 
                   onclick="seleccionarDireccion('${dir.id}')">
                <div class="direccion-selectable">
                  <input 
                    type="radio" 
                    name="direccion" 
                    value="${dir.id}"
                    ${dir.id === direccionSeleccionada ? 'checked' : ''}
                  >
                  <div class="direccion-info">
                    <h4>${dir.calle} ${dir.numero}${dir.apartamento ? ', ' + dir.apartamento : ''}</h4>
                    <p>${dir.ciudad}, ${dir.departamento}</p>
                    <p style="font-size: 0.85rem; color: #999;">${dir.codigoPostal || ''} ${dir.pais}</p>
                    ${dir.detallesAdicionales ? `<p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">ℹ️ ${dir.detallesAdicionales}</p>` : ''}
                    ${dir.esPrincipal ? '<span class="badge-principal">⭐ Principal</span>' : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="modal-acciones">
            <button class="btn btn-secundario" onclick="mostrarModalDireccion(); cerrarSelectorDirecciones();">
              ➕ Agregar Nueva Dirección
            </button>
            <button class="btn btn-principal" onclick="confirmarDireccion(window._callbackPedido || null)">
              ✓ Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    `;

    // Remover modal anterior si existe
    let modalAnterior = document.getElementById('modal-selector-direcciones');
    if (modalAnterior) {
      modalAnterior.remove();
    }

    // Guardar el callback en una variable global temporal para que el botón pueda accederlo
    if (typeof callback === 'function') {
      window._callbackPedido = callback;
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Agregar estilos si no existían
    if (!document.getElementById('estilos-selector-direcciones')) {
      const estilos = document.createElement('style');
      estilos.id = 'estilos-selector-direcciones';
      estilos.textContent = `
        .direcciones-lista {
          margin: 1.5rem 0;
          max-height: 400px;
          overflow-y: auto;
        }

        .direccion-item {
          border: 2px solid #E0E0E0;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .direccion-item:hover {
          border-color: #007bff;
          background-color: #F8FBFF;
        }

        .direccion-item.seleccionada {
          border-color: #007bff;
          background-color: #E7F2FF;
        }

        .direccion-selectable {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .direccion-selectable input[type="radio"] {
          margin-top: 0.5rem;
          cursor: pointer;
        }

        .direccion-info {
          flex: 1;
        }

        .direccion-info h4 {
          margin: 0 0 0.3rem 0;
          font-size: 1rem;
          color: #333;
        }

        .direccion-info p {
          margin: 0.2rem 0;
          color: #666;
          font-size: 0.9rem;
        }

        .badge-principal {
          display: inline-block;
          background-color: #FFD700;
          color: #333;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }
      `;
      document.head.appendChild(estilos);
    }

  } catch (err) {
    console.error('❌ Error al mostrar selector de direcciones:', err);
    alert('Error al cargar las direcciones');
  }
}

/**
 * Cerrar selector de direcciones
 */
function cerrarSelectorDirecciones() {
  const modal = document.getElementById('modal-selector-direcciones');
  if (modal) {
    modal.remove();
  }
}

/**
 * Seleccionar una dirección
 */
function seleccionarDireccion(direccionId) {
  console.log('📍 Dirección seleccionada:', direccionId);
  document.querySelectorAll('input[name="direccion"]').forEach(radio => {
    radio.checked = radio.value === direccionId;
  });
  document.querySelectorAll('.direccion-item').forEach(item => {
    item.classList.remove('seleccionada');
  });
  event.currentTarget.classList.add('seleccionada');
}

/**
 * Confirmar dirección seleccionada
 */
function confirmarDireccion(callback = null) {
  const direccionSeleccionada = document.querySelector('input[name="direccion"]:checked')?.value;
  
  if (!direccionSeleccionada) {
    alert2('Por favor selecciona una dirección', 'warning');
    return;
  }

  localStorage.setItem('direccionSeleccionada', direccionSeleccionada);
  console.log('✅ Dirección confirmada:', direccionSeleccionada);
  cerrarSelectorDirecciones();
  
  // Disparar evento para que app.js se entere
  window.dispatchEvent(new Event('direccionSeleccionada'));
  
  // Ejecutar callback si fue proporcionado
  if (typeof callback === 'function') {
    setTimeout(() => callback(), 300); // Esperar a que se cierre el modal
  }
}

/**
 * Obtener dirección seleccionada
 */
async function obtenerDireccionSeleccionada() {
  const direccionId = localStorage.getItem('direccionSeleccionada');
  
  if (!direccionId) {
    console.warn('⚠️ No hay dirección seleccionada, obteniendo dirección principal...');
    return obtenerDireccionPrincipal();
  }

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.access_token) {
    return null;
  }

  try {
    const resp = await fetch(`${window.BACKEND_URL}/api/v1/addresses/${direccionId}`, {
      headers: {
        'Authorization': `Bearer ${usuario.access_token}`
      }
    });

    if (resp.ok) {
      return await resp.json();
    }
    return null;
  } catch (err) {
    console.error('❌ Error obteniendo dirección seleccionada:', err);
    return obtenerDireccionPrincipal();
  }
}
