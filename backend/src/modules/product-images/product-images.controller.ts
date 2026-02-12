import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto, UpdateProductImageDto } from './dto/product-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async agregar(@Body() dto: CreateProductImageDto) {
    return this.productImagesService.agregar(dto.productoId, {
      url: dto.url,
      principal: dto.principal,
    });
  }

  @Get('producto/:productoId')
  async obtenerPorProducto(@Param('productoId') productoId: string) {
    return this.productImagesService.obtenerPorProducto(productoId);
  }

  @Get('principal/:productoId')
  async obtenerPrincipal(@Param('productoId') productoId: string) {
    return this.productImagesService.obtenerPrincipal(productoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: UpdateProductImageDto) {
    return this.productImagesService.actualizar(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('reordenar/:productoId')
  async reordenar(
    @Param('productoId') productoId: string,
    @Body() dto: { imagenesIds: string[] },
  ) {
    return this.productImagesService.reordenar(productoId, dto.imagenesIds);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return this.productImagesService.eliminar(id);
  }
}
