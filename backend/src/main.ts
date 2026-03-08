import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // CORS - Aplicar primero
  const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:3000',
      'http://localhost:8000',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501',
      'http://127.0.0.1:5502',
      'http://localhost:5500',
      'http://localhost:5501',
      'http://localhost:5502',
      'https://inventory-frontend-97h4.onrender.com',
      ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [])
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  app.enableCors(corsOptions);
  
  // Middleware personalizado para CORS en archivos estáticos
  app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin;
    if (corsOptions.origin.includes(origin) || corsOptions.origin.includes('*')) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Max-Age', '86400');
    }
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
  // Servir archivos estáticos desde backend/public/assets
  // En producción, look for public folder relative to dist
  const publicPath = join(__dirname, '..', 'public', 'assets');
  app.use('/assets', express.static(publicPath, {
    maxAge: '1d',
    etag: false
  }));
  logger.log(`Sirviendo assets desde: ${publicPath}`);

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

  // Prefijo global
  app.setGlobalPrefix(`api/${process.env.API_VERSION || 'v1'}`);

  const port = parseInt(process.env.API_PORT || '3000', 10);
  await app.listen(port);

  logger.log(`Inventory Backend iniciado en http://localhost:${port}`);
  logger.log(`API disponible en /api/v1`);
}

bootstrap();
