import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  url!: string;

  @IsString()
  productoId!: string;

  @IsOptional()
  @IsBoolean()
  principal?: boolean;
}

export class UpdateProductImageDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsBoolean()
  principal?: boolean;
}
