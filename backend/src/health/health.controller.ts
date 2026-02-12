import { Controller, Get, Post, HttpCode, Query } from '@nestjs/common';
import { SeedService } from '../seed/seed.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly seedService: SeedService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('db-status')
  async dbStatus() {
    try {
      const totalProducts = await this.prisma.product.count();
      const totalCategories = await this.prisma.category.count();
      const totalUsers = await this.prisma.user.count();
      
      // Obtener todos los productos (solo IDs y nombres)
      const productsList = await this.prisma.product.findMany({
        select: {
          id: true,
          nombre: true,
          activo: true,
          stock: true,
        },
        orderBy: { nombre: 'asc' },
        take: 100,
      });

      return {
        ok: true,
        database: {
          totalProducts,
          totalCategories,
          totalUsers,
        },
        products: {
          count: productsList.length,
          first5: productsList.slice(0, 5),
          last5: productsList.slice(-5),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
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
