import { Controller, Post, HttpCode } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('health')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  /**
   * Endpoint para ejecutar el seed (solo una vez)
   * Este endpoint puede ser llamado sin autenticación para inicializar la BD
   */
  @Post('seed')
  @HttpCode(200)
  async seed() {
    return await this.seedService.executeSeed();
  }
}
