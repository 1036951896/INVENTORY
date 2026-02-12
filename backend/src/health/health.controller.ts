import { Controller, Get, Post, HttpCode } from '@nestjs/common';
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
   */
  @Post('seed')
  @HttpCode(200)
  async seed() {
    return await this.seedService.executeSeed();
  }
}
