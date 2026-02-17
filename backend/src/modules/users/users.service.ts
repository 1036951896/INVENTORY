import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new BadRequestException(`El email "${createUserDto.email}" ya está registrado`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Preparar datos del usuario
    const userData: any = {
      nombre: createUserDto.nombre,
      email: createUserDto.email,
      password: hashedPassword,
      rol: createUserDto.rol || 'CLIENTE',
    };

    if (createUserDto.telefono) {
      userData.telefono = createUserDto.telefono;
    }

    // Si se incluye dirección, crearla también
    if (createUserDto.direccion) {
      userData.direcciones = {
        create: [
          {
            calle: createUserDto.direccion.calle,
            numero: createUserDto.direccion.numero,
            apartamento: createUserDto.direccion.apartamento || null,
            ciudad: createUserDto.direccion.ciudad,
            departamento: createUserDto.direccion.departamento,
            codigoPostal: createUserDto.direccion.codigoPostal || null,
            pais: createUserDto.direccion.pais || 'Colombia',
            esPrincipal: createUserDto.direccion.esPrincipal !== false,
          },
        ],
      };
    }

    const user = await this.prisma.user.create({
      data: userData,
    });

    return this.formatUserResponse(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => this.formatUserResponse(user));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return this.formatUserResponse(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.formatUserResponse(updated);
  }

  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { activo: false },
    });

    return this.formatUserResponse(updated);
  }

  async reactivate(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { activo: true },
    });

    return this.formatUserResponse(updated);
  }

  private formatUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      activo: user.activo,
      createdAt: user.createdAt,
    };
  }
}
