import { PartialType } from '@nestjs/mapped-types';
import { CreateTarjetaCreditoDto, TarjetaEstado } from './create-tarjeta_credito.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTarjetaCreditoDto extends PartialType(CreateTarjetaCreditoDto) {
  @ApiPropertyOptional({ description: 'Número de tarjeta', example: '4111111111111111' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  num_tarjeta?: string;

  @ApiPropertyOptional({ description: 'Fecha de expedición', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  fecha_expedicion?: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento', example: '2028-01-01' })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @ApiPropertyOptional({ description: 'Cupo', example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cupo?: number;

  @ApiPropertyOptional({ description: 'Estado', enum: TarjetaEstado })
  @IsOptional()
  @IsEnum(TarjetaEstado)
  estado?: TarjetaEstado;
}


