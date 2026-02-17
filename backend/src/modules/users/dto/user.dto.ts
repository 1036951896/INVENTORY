import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '@prisma/client';

// DTO para direcciones
export class CreateAddressDto {
  @IsString()
  calle!: string;

  @IsString()
  numero!: string;

  @IsString()
  @IsOptional()
  apartamento?: string | null;

  @IsString()
  ciudad!: string;

  @IsString()
  departamento!: string;

  @IsString()
  @IsOptional()
  codigoPostal?: string | null;

  @IsString()
  @IsOptional()
  pais?: string;

  @IsString()
  @IsOptional()
  detallesAdicionales?: string | null;

  @IsBoolean()
  @IsOptional()
  esPrincipal?: boolean;
}

export class CreateUserDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEnum(UserRole)
  @IsOptional()
  rol?: UserRole;

  // Datos de dirección
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsOptional()
  direccion?: CreateAddressDto;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEnum(UserRole)
  @IsOptional()
  rol?: UserRole;
}

export class UserResponseDto {
  id!: string;
  nombre!: string;
  email!: string;
  telefono?: string;
  rol!: UserRole;
  activo!: boolean;
  createdAt!: Date;
}
