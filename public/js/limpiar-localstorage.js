#!/usr/bin/env node

// Script para limpiar localStorage y reiniciar la aplicación
const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════╗');
console.log('║   LIMPIAR LOCALSTORAGE Y RECARGAR    ║');
console.log('╚════════════════════════════════════════╝\n');

console.log('⚠️  El localStorage del navegador contiene datos viejos.');
console.log('📝 Esto impide que se carguen los productos reales.\n');

console.log('✅ Pasos a seguir:\n');
console.log('1. Abre el navegador en: http://localhost:3000');
console.log('2. Abre la consola con: F12');
console.log('3. Pega este comando:\n');

console.log('─'.repeat(50));
console.log('localStorage.removeItem("productos-admin");');
console.log('location.reload();');
console.log('─'.repeat(50));

console.log('\n4. Presiona Enter\n');

console.log('Resultado esperado:');
console.log('✓ Verás los 70 productos REALES (Papas, Ripios, etc.)');
console.log('✗ NO verás más "Jabón Líquido", "Gaseosa", etc.\n');

console.log('O ejecuta esto para VER TODO el localStorage:\n');
console.log('─'.repeat(50));
console.log('Object.keys(localStorage).forEach(key => {');
console.log('  console.log(key + ":", localStorage.getItem(key).substring(0, 100));');
console.log('});');
console.log('─'.repeat(50));
console.log('\n');
