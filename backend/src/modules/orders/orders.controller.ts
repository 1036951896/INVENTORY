import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    console.log('📝 POST /orders recibido');
    console.log('Usuario:', req.user);
    console.log('DTO:', createOrderDto);
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get('/test/ping')
  async testPing() {
    return { message: 'Orders endpoint is working', timestamp: new Date().toISOString() };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Request() req: any) {
    // Admin sees all orders, clients see only their orders
    const usuarioId = req.user.rol === 'ADMIN' ? undefined : req.user.id;
    return this.ordersService.findAll(usuarioId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id') id: string, @Request() req: any) {
    const order = await this.ordersService.findById(id);
    
    // Ensure user can only see their own orders (unless admin)
    if (req.user.rol !== 'ADMIN' && order.usuario.id !== req.user.id) {
      throw new Error('No tienes permiso para ver esta orden');
    }

    return order;
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @Request() req: any,
  ) {
    // Only admins can update order status
    if (req.user.rol !== 'ADMIN') {
      throw new Error('No tienes permiso para actualizar el estado de órdenes');
    }

    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  async cancel(@Param('id') id: string, @Request() req: any) {
    const order = await this.ordersService.findById(id);
    
    // Ensure user can only cancel their own orders (unless admin)
    if (req.user.rol !== 'ADMIN' && order.usuario.id !== req.user.id) {
      throw new Error('No tienes permiso para cancelar esta orden');
    }

    return this.ordersService.cancel(id);
  }
}
