import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Servir archivos estáticos desde /public (accesibles en raíz /)
  const publicPath = path.join(__dirname, '..', '..', 'public');
  app.use(express.static(publicPath));

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8000',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501',
      'http://127.0.0.1:5502',
      'http://localhost:5500',
      'http://localhost:5501',
      'http://localhost:5502',
      'https://inventory-app-r7ex.onrender.com',
      ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [])
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Prefijo global
  app.setGlobalPrefix(`api/${process.env.API_VERSION || 'v1'}`);

  const port = parseInt(process.env.API_PORT || '3000', 10);
  await app.listen(port);

  console.log(`
╔══════════════════════════════════════╗
║  🚀 Inventory Backend iniciado      ║
║  📍 http://localhost:${port}${' '.repeat(port.toString().length > 4 ? 0 : 5 - port.toString().length)}      ║
║  🔌 API: /api/v1                     ║
╚══════════════════════════════════════╝
  `);
}

bootstrap();
