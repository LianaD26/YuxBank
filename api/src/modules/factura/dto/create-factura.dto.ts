import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export enum FacturaEstado {
  PAGADO = 'pagado',
  PENDIENTE = 'pendiente',
}

export class CreateFacturaDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  @Type(() => Number)
  @IsNumber()
  id_usuario: number;

  @ApiPropertyOptional({ description: 'Empresa emisora', example: 'Acme SA' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  empresa?: string;

  @ApiPropertyOptional({ description: 'Número de referencia', example: 'FAC-2025-001' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  num_referencia?: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @ApiProperty({ description: 'Monto', example: 12345.67 })
  @Type(() => Number)
  @IsNumber()
  monto: number;

  @ApiProperty({ description: 'Estado', enum: FacturaEstado, example: FacturaEstado.PENDIENTE })
  @IsEnum(FacturaEstado)
  estado: FacturaEstado;
}


