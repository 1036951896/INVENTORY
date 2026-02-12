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

  /**
   * Endpoint de DEBUG: Muestra información de la base de datos
   * Útil para diagnosticar problemas con el seed
   */
  @Get('debug/status')
  async debugStatus() {
    const totalProducts = await this.prisma.product.count();
    const totalCategories = await this.prisma.category.count();
    const totalUsers = await this.prisma.user.count();
    
    // Obtener lista de todos los productos (solo IDs y nombres)
    const productsList = await this.prisma.product.findMany({
      select: {
        id: true,
        nombre: true,
        activo: true,
        stock: true,
      },
      orderBy: { nombre: 'asc' },
    });

    // Obtener primeros 5 y últimos 5 productos
    const first5 = productsList.slice(0, 5);
    const last5 = productsList.slice(-5);

    return {
      database: {
        totalProducts,
        totalCategories,
        totalUsers,
      },
      products: {
        total: productsList.length,
        first5,
        last5,
        allProductIds: productsList.map(p => p.id),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
