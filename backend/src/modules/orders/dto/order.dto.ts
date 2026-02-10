import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

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
  @IsOptional()
  notasEntrega?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  estado: OrderStatus = OrderStatus.PENDIENTE;

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
  } = { id: '', nombre: '', imagen: '' };
}

export class OrderResponseDto {
  id: string = '';
  numero: string = '';
  total: number = 0;
  estado: OrderStatus = OrderStatus.PENDIENTE;
  notasEntrega?: string = '';
  entregaEn?: Date = undefined;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    telefono?: string;
  } = { id: '', nombre: '', email: '', telefono: '' };
  items: OrderItemResponseDto[] = [];
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
