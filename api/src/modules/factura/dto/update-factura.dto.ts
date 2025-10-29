import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDto, FacturaEstado } from './create-factura.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class UpdateFacturaDto extends PartialType(CreateFacturaDto) {
  @ApiPropertyOptional({ description: 'Fecha de vencimiento', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @ApiPropertyOptional({ description: 'Estado', enum: FacturaEstado })
  @IsOptional()
  @IsEnum(FacturaEstado)
  estado?: FacturaEstado;
}


