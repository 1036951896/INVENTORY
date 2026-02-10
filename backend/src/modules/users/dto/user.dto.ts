import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

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
