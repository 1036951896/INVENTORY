/**
 * Script de diagnóstico para verificar la conexión al backend
 * Copia y pega este código en la consola del navegador (F12)
 */

async function runDiagnostics() {
  console.log('🔍 Iniciando diagnósticos del sistema...\n');
  
  const BACKEND_URL = window.BACKEND_URL || 'http://localhost:3000';
  const API_BASE = `${BACKEND_URL}/api/v1`;
  
  console.log('📋 Información del entorno:');
  console.log('Backend URL:', BACKEND_URL);
  console.log('API Base:', API_BASE);
  console.log('');
  
  // 1. Verificar si el backend está conectado
  console.log('1️⃣  Verificando conexión al backend...');
  try {
    const healthCheck = await fetch(`${BACKEND_URL}/api/v1/orders/test/ping`);
    console.log('✅ Backend está en línea. Status:', healthCheck.status);
  } catch (err) {
    console.error('❌ Error conectando al backend:', err.message);
    console.error('Asegúrate que:');
    console.error('  - El backend está corriendo en puerto 3000');
    console.error('  - La URL es correcta:', BACKEND_URL);
    return;
  }
  console.log('');
  
  // 2. Verificar datos de usuario en localStorage
  console.log('2️⃣  Verificando datos del usuario en localStorage:');
  const usuarioStr = localStorage.getItem('usuario');
  if (!usuarioStr) {
    console.error('❌ No hay usuario en localStorage. Por favor inicia sesión primero.');
    return;
  }
  
  const usuario = JSON.parse(usuarioStr);
  console.log('✅ Usuario encontrado:', usuario.nombre);
  console.log('   Email:', usuario.email);
  console.log('   Rol:', usuario.rol);
  console.log('   Token presente:', !!usuario.access_token);
  
  if (!usuario.access_token) {
    console.error('❌ El token de acceso no está en los datos del usuario.');
    console.error('Usuario guardado:', usuario);
    return;
  }
  console.log('');
  
  // 3. Verificar formato del token
  console.log('3️⃣  Verificando formato del token JWT:');
  const tokenParts = usuario.access_token.split('.');
  if (tokenParts.length === 3) {
    console.log('✅ Formato de JWT válido (3 partes separadas por puntos)');
    console.log('   Cabecera:', tokenParts[0].substring(0, 20) + '...');
    console.log('   Payload:', tokenParts[1].substring(0, 20) + '...');
    console.log('   Firma:', tokenParts[2].substring(0, 20) + '...');
  } else {
    console.error('❌ Formato de token inválido. Partes:', tokenParts.length);
    return;
  }
  console.log('');
  
  // 4. Probar obtener órdenes del usuario actual
  console.log('4️⃣  Probando obtener órdenes del usuario:');
  try {
    const ordersResp = await fetch(`${API_BASE}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usuario.access_token}`
      }
    });
    
    console.log('   Status:', ordersResp.status);
    
    if (ordersResp.ok) {
      const orders = await ordersResp.json();
      console.log('✅ Obtención de órdenes exitosa');
      console.log('   Órdenes encontradas:', orders.length);
      if (orders.length > 0) {
        console.log('   Primera orden:', orders[0].id);
      }
    } else {
      console.error('❌ Error al obtener órdenes. Status:', ordersResp.status);
      const errData = await ordersResp.json();
      console.error('   Respuesta:', errData);
    }
  } catch (err) {
    console.error('❌ Error en solicitud de órdenes:', err.message);
  }
  console.log('');
  
  // 5. Verificar carrito
  console.log('5️⃣  Verificando carrito:');
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  console.log('   Items en carrito:', carrito.length);
  if (carrito.length > 0) {
    console.log('✅ Hay items en el carrito');
    carrito.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.nombre} x${item.cantidad} @ $${item.precio}`);
    });
  } else {
    console.warn('⚠️  El carrito está vacío');
  }
  console.log('');
  
  // 6. Simular creación de orden (sin ejecutar)
  console.log('6️⃣  Información para crear orden:');
  const items = carrito.map(item => ({
    productoId: String(item.id),
    cantidad: item.cantidad,
    precioUnitario: item.precio
  }));
  
  console.log('   URL:', `${API_BASE}/orders`);
  console.log('   Método: POST');
  console.log('   Headers:', {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer [TOKEN]'
  });
  console.log('   Body:', { items });
  console.log('');
  
  // 7. Crear orden de prueba
  console.log('7️⃣  Intentando crear orden...');
  if (carrito.length === 0) {
    console.warn('⚠️  No hay items en el carrito. Por favor agrega items antes de crear una orden.');
  } else {
    try {
      const createResp = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usuario.access_token}`
        },
        body: JSON.stringify({ items })
      });
      
      console.log('   Status:', createResp.status, createResp.statusText);
      const data = await createResp.json();
      
      if (createResp.ok) {
        console.log('✅ Orden creada exitosamente');
        console.log('   ID:', data.id);
      } else {
        console.error('❌ Error al crear orden:');
        console.error('   Status:', createResp.status);
        console.error('   Respuesta:', data);
      }
    } catch (err) {
      console.error('❌ Error en solicitud de creación:', err.message);
    }
  }
  
  console.log('\n✅ Diagnóstico completado');
}

// Ejecutar función
runDiagnostics();
