// Script para verificar y limpiar localStorage desde la consola del navegador
// Copia y pega esto en la consola del navegador (F12)

console.log('=== CONTENIDO DEL LOCALSTORAGE ===');
console.log('Total de items:', localStorage.length);
console.log('---');

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}:`, value.substring(0, 100) + (value.length > 100 ? '...' : ''));
}

console.log('---');
console.log('Para LIMPIAR TODO localStorage, ejecuta:');
console.log('localStorage.clear()');
console.log('---');

// Mostrar específicamente los productos si existen
if (localStorage.getItem('productos-admin')) {
  console.log('⚠️  ENCONTRADO: productos-admin (DATOS VIEJOS)');
  console.log('Esto está bloqueando los productos reales.');
  console.log('');
  console.log('Para eliminar y cargar productos reales, ejecuta:');
  console.log('localStorage.removeItem("productos-admin"); location.reload();');
}
