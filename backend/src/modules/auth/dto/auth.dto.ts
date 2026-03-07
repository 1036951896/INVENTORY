import { IsEmail, IsNotEmpty, MinLength, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class AddressDataDto {
  @IsString()
  calle!: string;

  @IsString()
  numero!: string;

  @IsOptional()
  @IsString()
  apartamento?: string;

  @IsString()
  ciudad!: string;

  @IsString()
  departamento!: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @IsOptional()
  @IsString()
  pais?: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  @IsString()
  telefono!: string;

  @IsOptional()
  direccion?: AddressDataDto;
}

export class AuthResponseDto {
  access_token: string = '';
  user: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  } = { id: '', nombre: '', email: '', rol: '' };
}
