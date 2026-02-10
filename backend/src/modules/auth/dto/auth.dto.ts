import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  @IsString()
  telefono!: string;
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
