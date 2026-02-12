import { Controller, Get, Post, HttpCode, Query } from '@nestjs/common';
import { SeedService } from '../seed/seed.service';

@Controller('health')
export class HealthController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Endpoint para ejecutar el seed (solo una vez)
   * Inicializa la base de datos con datos de prueba
   * @param force Si es "true", fuerza el reset de la BD y carga todos los datos nuevamente
   */
  @Post('seed')
  @HttpCode(200)
  async seed(@Query('force') force?: string) {
    const forceReset = force === 'true';
    return await this.seedService.executeSeed(forceReset);
  }
}
