import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateStockMovementDto {
  @IsString()
  tipo!: 'ENTRADA' | 'SALIDA' | 'DEVOLUCIÓN' | 'AJUSTE';

  @IsNumber()
  cantidad!: number;

  @IsString()
  razon!: string;

  @IsString()
  productoId!: string;

  @IsOptional()
  @IsString()
  referencia?: string;
}
