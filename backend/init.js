#!/usr/bin/env node

/**
 * Script de inicialización que ejecuta migraciones con reintentos
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let appProcess = null;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForDatabase() {
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`⏳ Verificando BD (intento ${attempt}/${maxAttempts})...`);
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$connect();
      await prisma.$disconnect();
      console.log('✅ BD disponible');
      return true;
    } catch (error) {
      console.log(`❌ BD no disponible: ${error.message}`);
      if (attempt < maxAttempts) {
        await delay(3000);
      }
    }
  }
  return false;
}

async function runMigrations() {
  return new Promise((resolve) => {
    console.log('🔄 Ejecutando migraciones...');
    
    const proc = spawn('npx', ['prisma', 'migrate', 'deploy', '--skip-generate'], {
      stdio: 'inherit',
      shell: true,
    });
    
    proc.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Migraciones completadas');
      } else {
        console.warn(`⚠️  Migraciones fallaron (código: ${code}), continuando...`);
      }
      resolve(true);
    });
    
    proc.on('error', (error) => {
      console.warn('⚠️  Error al ejecutar migraciones:', error.message);
      resolve(true);
    });
  });
}

async function startApp() {
  return new Promise((resolve) => {
    console.log('🚀 Iniciando aplicación...');
    
    appProcess = spawn('node', ['dist/main.js'], {
      stdio: 'inherit',
      shell: false,
    });
    
    // Manejar signals
    ['SIGTERM', 'SIGINT'].forEach(signal => {
      process.on(signal, () => {
        console.log(`\n📴 Recibido ${signal}, cerrando...`);
        if (appProcess) {
          appProcess.kill(signal);
        }
        process.exit(0);
      });
    });
    
    appProcess.on('exit', (code) => {
      console.log(`App salió con código ${code}`);
      process.exit(code || 0);
    });
    
    appProcess.on('error', (error) => {
      console.error('❌ Error iniciando app:', error);
      process.exit(1);
    });
  });
}

async function main() {
  try {
    // Esperar a BD
    const dbReady = await waitForDatabase();
    
    // Si BD está lista, intentar migraciones
    if (dbReady) {
      await runMigrations();
    } else {
      console.warn('⚠️  BD no disponible, intentando de todas formas...');
    }
    
    // Iniciar app (siempre, incluso si migraciones fallaron)
    await startApp();
    
  } catch (error) {
    console.error('❌ Error crítico:', error);
    process.exit(1);
  }
}

main();
