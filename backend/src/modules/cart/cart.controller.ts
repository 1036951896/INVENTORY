import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerCarrito(@NestRequest() req: any) {
    return this.cartService.obtenerOCrearCarrito(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('agregar')
  async agregarProducto(@NestRequest() req: any, @Body() dto: AddCartItemDto) {
    return this.cartService.agregarProducto(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('producto/:productoId')
  async actualizarProducto(
    @NestRequest() req: any,
    @Param('productoId') productoId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.actualizarProducto(req.user.id, productoId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('producto/:productoId')
  async eliminarProducto(@NestRequest() req: any, @Param('productoId') productoId: string) {
    return this.cartService.eliminarProducto(req.user.id, productoId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async vaciarCarrito(@NestRequest() req: any) {
    return this.cartService.vaciarCarrito(req.user.id);
  }
}
