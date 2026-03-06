// Script de depuración para verificar el flujo de autenticación y pedidos
// Copia y pega esto en la consola del navegador (F12)

console.log('=== DEPURACIÓN DE FLUJO DE PEDIDOS ===\n');

// 1. Verificar si hay usuario guardado
const usuarioJSON = localStorage.getItem('usuario');
console.log('1. Usuario en localStorage:', usuarioJSON ? JSON.parse(usuarioJSON) : 'NO ENCONTRADO');

if (!usuarioJSON) {
  console.warn('⚠️ NO HAY USUARIO. Debes iniciar sesión primero.');
  console.log('Ir a: index.html → Iniciar Sesión → Crear Cuenta');
} else {
  const usuario = JSON.parse(usuarioJSON);
  console.log('✅ Usuario encontrado:', usuario.nombre, usuario.email);
  
  // 2. Verificar si hay token
  if (usuario.access_token) {
    console.log('✅ Token de acceso encontrado');
    console.log('   Token:', usuario.access_token.substring(0, 20) + '...');
  } else {
    console.error('❌ NO HAY TOKEN en el usuario');
  }
}

// 3. Verificar token alternativo
const userToken = localStorage.getItem('user-token');
console.log('2. Token alternativo (user-token):', userToken ? userToken.substring(0, 20) + '...' : 'NO ENCONTRADO');

// 4. Verificar carrito
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
console.log('3. Carrito:', carrito.length > 0 ? carrito : 'VACÍO');

// 5. Verificar URL actual
const params = new URLSearchParams(window.location.search);
const idPedido = params.get('pedido');
console.log('4. ID de Pedido en URL:', idPedido || 'NO ENCONTRADO');

if (idPedido) {
  console.log('\n=== INTENTANDO OBTENER PEDIDO DEL BACKEND ===\n');
  
  const BACKEND_URL = window.BACKEND_URL || 'http://localhost:3000';
  const token = usuario?.access_token || userToken;
  
  if (!token) {
    console.error('❌ Sin token. No se puede hacer fetch.');
  } else {
    console.log('Haciendo request a:', `${BACKEND_URL}/api/v1/orders/${idPedido}`);
    console.log('Con token:', token.substring(0, 20) + '...');
    
    fetch(`${BACKEND_URL}/api/v1/orders/${idPedido}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(resp => {
      console.log('Response status:', resp.status, resp.statusText);
      return resp.json();
    })
    .then(data => {
      console.log('✅ Datos del pedido:', data);
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
    });
  }
}

console.log('\n=== FIN DEPURACIÓN ===');
