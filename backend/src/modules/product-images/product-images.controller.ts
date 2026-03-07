import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto, UpdateProductImageDto } from './dto/product-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public', 'images', 'productos');
    cb(null, uploadPath);
  },
  filename: (_req, _file, cb) => {
    const ext = path.extname(_file.originalname);
    const nombre = `producto-${uuidv4()}${ext}`;
    cb(null, nombre);
  },
});

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage,
      fileFilter: (_req, _file, cb) => {
        if (!_file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Solo se aceptan archivos de imagen'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async subirImagen(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() body: { productoId?: string; principal?: string },
  ) {
    if (!archivo) {
      throw new BadRequestException('No se proporcionó archivo');
    }
    return this.productImagesService.subirImagenLocal(archivo, body.productoId, body.principal === 'true');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('download')
  async descargarImagen(@Body() dto: { url: string; productoId?: string; principal?: boolean }) {
    if (!dto.url) {
      throw new BadRequestException('URL is required');
    }
    return this.productImagesService.descargarYGuardarImagen(dto.url, dto.productoId, dto.principal);
  }

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
