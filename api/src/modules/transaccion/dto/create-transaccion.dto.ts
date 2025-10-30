import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export enum TransaccionTipo {
  TRANSFERENCIA = 'transferencia',
  PAGO = 'pago',
}

export class CreateTransaccionDto {
  @ApiPropertyOptional({ description: 'ID de la cuenta origen', example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  id_cuenta_origen?: number;

  @ApiPropertyOptional({ description: 'Número de cuenta origen', example: '123' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  num_cuenta_origen?: string;

  @ApiPropertyOptional({ description: 'ID de la cuenta destino', example: 2 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  id_cuenta_destino?: number;

  @ApiPropertyOptional({ description: 'Número de cuenta destino', example: '456' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  num_cuenta_destino?: string;

  @ApiProperty({ description: 'Tipo de transacción', enum: TransaccionTipo, example: TransaccionTipo.TRANSFERENCIA })
  @IsEnum(TransaccionTipo)
  tipo: TransaccionTipo;

  @ApiProperty({ description: 'Monto de la transacción', example: 1500.5 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  monto: number;

  @ApiPropertyOptional({ description: 'Referencia externa o código asociado', example: 'REF-20251027-1234' })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiPropertyOptional({ description: 'Descripción de la transacción', example: 'Pago factura servicios' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Fecha ISO 8601', example: '2025-10-27T12:34:56.000Z' })
  @IsOptional()
  @IsDateString()
  fecha?: string;
}