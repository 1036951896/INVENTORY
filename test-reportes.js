// Script para probar los reportes del admin
const API_URL = 'http://localhost:3000/api/v1';
const ADMIN_EMAIL = 'admin@inventory.com';
const ADMIN_PASSWORD = 'password123';

async function testReportes() {
  console.log('🧪 Iniciando prueba de reportes...');
  
  try {
    // 1. Login
    console.log('1️⃣ Intentando login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    
    if (!loginRes.ok) {
      console.error('❌ Login fallido:', loginRes.status, await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('✅ Login exitoso, token:', token.substring(0, 20) + '...');
    
    // 2. Cargar productos
    console.log('2️⃣ Cargando productos...');
    const prodRes = await fetch(`${API_URL}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!prodRes.ok) {
      console.error('❌ Error cargando productos:', prodRes.status);
      return;
    }
    
    const productos = await prodRes.json();
    console.log('✅ Productos cargados:', productos.length);
    
    // 3. Cargar órdenes
    console.log('3️⃣ Cargando órdenes...');
    const ordRes = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!ordRes.ok) {
      console.error('❌ Error cargando órdenes:', ordRes.status);
      return;
    }
    
    const ordenes = await ordRes.json();
    console.log('✅ Órdenes cargadas:', ordenes.length);
    
    // 4. Prueba de reportes
    console.log('4️⃣ Analizando reportes...');
    
    const bajoStock = productos.filter(p => p.stock < 5);
    const agotados = productos.filter(p => p.stock === 0);
    console.log(`  - Bajo stock: ${bajoStock.length}`);
    console.log(`  - Agotados: ${agotados.length}`);
    
    const completadas = ordenes.filter(o => o.estado === 'completada' || o.estado === 'entregada');
    console.log(`  - Órdenes completadas: ${completadas.length}`);
    
    console.log('\n✅ Todas las pruebas pasaron correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testReportes();
