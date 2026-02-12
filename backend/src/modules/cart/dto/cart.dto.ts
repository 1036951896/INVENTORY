import { IsString, IsNumber, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  productoId!: string;

  @IsNumber()
  @Min(1)
  cantidad!: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  cantidad!: number;
}
