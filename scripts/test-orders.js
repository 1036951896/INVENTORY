// Script para probar la creación de órdenes
const http = require('http');

// Primero, obtén un token (simula login)
const loginData = JSON.stringify({
  email: 'cliente@inventory.com',
  password: 'cliente123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('1. Intentando login...');

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    try {
      const parsed = JSON.parse(data);
      const token = parsed.access_token;
      console.log(`✓ Token obtenido: ${token.substring(0, 20)}...`);
      
      // Ahora intenta crear una orden
      console.log('\n2. Intentando crear orden...');
      testOrder(token);
    } catch (e) {
      console.error('❌ Error parsing login response:', e.message);
      console.log('Response:', data);
    }
  });
});

loginReq.on('error', (e) => console.error('Login error:', e));
loginReq.write(loginData);
loginReq.end();

function testOrder(token) {
  const orderData = JSON.stringify({
    items: [
      {
        productoId: '1',
        cantidad: 1,
        precioUnitario: 9.99
      }
    ]
  });

  const orderOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': orderData.length
    }
  };

  const orderReq = http.request(orderOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      try {
        const parsed = JSON.parse(data);
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log('✓ Orden creada exitosamente:', parsed);
        } else {
          console.log('❌ Error:', parsed);
        }
      } catch (e) {
        console.log('Response:', data);
      }
    });
  });

  orderReq.on('error', (e) => console.error('Order error:', e));
  orderReq.write(orderData);
  orderReq.end();
}
