import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export enum TarjetaEstado {
  ACTIVO = 'activo',
  BLOQUEADO = 'bloqueado',
}

export class CreateTarjetaCreditoDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  @Type(() => Number)
  @IsNumber()
  id_usuario: number;

  @ApiProperty({ description: 'Número de tarjeta único', example: '4111111111111111' })
  @IsString()
  @Length(1, 20)
  num_tarjeta: string;

  @ApiPropertyOptional({ description: 'Fecha de expedición', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  fecha_expedicion?: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento', example: '2028-01-01' })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @ApiPropertyOptional({ description: 'Cupo', example: 3000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cupo?: number;

  @ApiProperty({ description: 'Estado de la tarjeta', enum: TarjetaEstado, example: TarjetaEstado.ACTIVO, required: false })
  @IsOptional()
  @IsEnum(TarjetaEstado)
  estado?: TarjetaEstado;
}


