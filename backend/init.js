#!/usr/bin/env node

/**
 * Init script para ejecutar migraciones de Prisma antes de iniciar la app
 * Soluciona problemas de timing entre BD y app en Render
 */

const { spawn } = require('child_process');
const { execSync } = require('child_process');

async function runMigrations() {
  try {
    console.log('🔄 Iniciando migraciones de Prisma...');
    
    // Ejecutar migraciones de forma segura
    try {
      execSync('npx prisma migrate deploy --skip-generate', {
        stdio: 'inherit',
        env: process.env,
      });
      console.log('✅ Migraciones completadas exitosamente');
    } catch (migrationError) {
      console.warn('⚠️  Advertencia en migraciones, continuando...', migrationError.message);
      // No lanzar error, continuar de todas formas
    }
    
    console.log('🚀 Iniciando aplicación...');
    
    // Iniciar la app
    const app = spawn('node', ['dist/main.js'], {
      stdio: 'inherit',
      env: process.env,
    });
    
    // Pasar signals al proceso hijo
    process.on('SIGTERM', () => {
      app.kill('SIGTERM');
      process.exit(0);
    });
    
    process.on('SIGINT', () => {
      app.kill('SIGINT');
      process.exit(0);
    });
    
    app.on('exit', (code) => {
      process.exit(code);
    });
    
  } catch (error) {
    console.error('❌ Error crítico:', error);
    process.exit(1);
  }
}

// Ejecutar
runMigrations().catch(err => {
  console.error('❌ Error no manejado:', err);
  process.exit(1);
});
