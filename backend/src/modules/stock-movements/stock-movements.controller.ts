import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/stock-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async registrar(@NestRequest() req: any, @Body() dto: CreateStockMovementDto) {
    return this.stockMovementsService.registrar(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('producto/:productoId')
  async obtenerPorProducto(
    @Param('productoId') productoId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.stockMovementsService.obtenerPorProducto(
      productoId,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async obtenerTodos(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.stockMovementsService.obtenerTodos(
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('rango/:from/:to')
  async obtenerPorRango(
    @Param('from') from: string,
    @Param('to') to: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.stockMovementsService.obtenerPorRango(
      new Date(from),
      new Date(to),
      limit ? parseInt(limit) : 100,
      offset ? parseInt(offset) : 0,
    );
  }
}
