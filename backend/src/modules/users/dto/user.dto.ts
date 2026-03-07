import { IsString, IsEmail, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsString()
  @IsOptional()
  rol?: string; // ADMIN | CLIENTE

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

  @IsString()
  @IsOptional()
  rol?: string; // ADMIN | CLIENTE
}

export class UserResponseDto {
  id!: string;
  nombre!: string;
  email!: string;
  telefono?: string;
  rol!: string; // ADMIN | CLIENTE
  activo!: boolean;
  createdAt!: Date;
}
