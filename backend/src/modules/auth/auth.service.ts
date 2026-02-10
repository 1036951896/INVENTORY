import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar si el email ya existe
    const userExist = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (userExist) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const user = await this.prisma.user.create({
      data: {
        nombre: registerDto.nombre,
        email: registerDto.email,
        password: hashedPassword,
        telefono: registerDto.telefono,
        rol: 'CLIENTE',
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });

    // Generar JWT
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      rol: user.rol,
    });

    return {
      access_token,
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Generar JWT
    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      rol: user.rol,
    });

    return {
      access_token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }
}
