import { Controller, Post, HttpCode } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('health')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('seed')
  @HttpCode(200)
  async seed() {
    return await this.seedService.executeSeed();
  }

  /**
   * Endpoint one-time para mover la carne de hamburguesa a la categoría Carnes
   * Puede llamarse con POST /api/v1/health/fix-carnes
   */
  @Post('fix-carnes')
  @HttpCode(200)
  async fixCarnesCategory() {
    return await this.seedService.fixCarnesCategory();
  }
}
