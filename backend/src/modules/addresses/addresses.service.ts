import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async crear(usuarioId: string, dto: CreateAddressDto) {
    // Si es principal, desmarcar otras direcciones del usuario
    if (dto.esPrincipal) {
      await this.prisma.address.updateMany({
        where: { usuarioId, esPrincipal: true },
        data: { esPrincipal: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        usuarioId,
      },
    });
  }

  async obtenerPorUsuario(usuarioId: string) {
    return this.prisma.address.findMany({
      where: { usuarioId },
      orderBy: { esPrincipal: 'desc' },
    });
  }

  async obtenerPrincipal(usuarioId: string) {
    return this.prisma.address.findFirst({
      where: { usuarioId, esPrincipal: true },
    });
  }

  async obtenerPorId(id: string) {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async actualizar(id: string, dto: UpdateAddressDto) {
    // Si es principal, desmarcar otras del mismo usuario
    if (dto.esPrincipal) {
      const direccion = await this.prisma.address.findUnique({ where: { id } });
      if (direccion) {
        await this.prisma.address.updateMany({
          where: { 
            usuarioId: direccion.usuarioId,
            NOT: { id },
            esPrincipal: true 
          },
          data: { esPrincipal: false },
        });
      }
    }

    return this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  async eliminar(id: string) {
    return this.prisma.address.delete({
      where: { id },
    });
  }
}
