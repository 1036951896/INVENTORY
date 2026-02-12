import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
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

  @IsOptional()
  @IsString()
  detallesAdicionales?: string;

  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  calle?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  apartamento?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  detallesAdicionales?: string;

  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;
}
