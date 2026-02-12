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
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@NestRequest() req: any, @Body() dto: CreateAddressDto) {
    return this.addressesService.crear(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerMias(@NestRequest() req: any) {
    return this.addressesService.obtenerPorUsuario(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('principal')
  async obtenerPrincipal(@NestRequest() req: any) {
    return this.addressesService.obtenerPrincipal(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.addressesService.obtenerPorId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressesService.actualizar(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return this.addressesService.eliminar(id);
  }
}
