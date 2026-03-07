import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  productoId!: string;

  @IsNumber()
  @Min(1)
  cantidad!: number;

  @IsNumber()
  @Min(0)
  precioUnitario!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @IsString()
  direccionId!: string;

  @IsString()
  @IsOptional()
  notasEntrega?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  @Transform(({ value }) => value?.toString().toUpperCase() || value)
  estado: string = "PENDIENTE"; // PENDIENTE | EN_PREPARACION | ENTREGADO | CANCELADO

  @IsString()
  @IsOptional()
  notasEntrega?: string;
}

export class OrderItemResponseDto {
  id: string = '';
  cantidad: number = 0;
  precioUnitario: number = 0;
  subtotal: number = 0;
  producto: {
    id: string;
    nombre: string;
    imagen?: string;
  } = { id: '', nombre: '' };
}

export class OrderResponseDto {
  id: string = '';
  numero: string = '';
  total: number = 0;
  estado: string = "PENDIENTE"; // PENDIENTE | EN_PREPARACION | ENTREGADO | CANCELADO
  notasEntrega?: string = '';
  entregaEn?: Date = undefined;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    telefono?: string;
  } = { id: '', nombre: '', email: '', telefono: '' };
  direccion: {
    id: string;
    calle: string;
    numero: string;
    apartamento?: string;
    ciudad: string;
    departamento: string;
    pais: string;
  } = { id: '', calle: '', numero: '', ciudad: '', departamento: '', pais: '' };
  items: OrderItemResponseDto[] = [];
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
