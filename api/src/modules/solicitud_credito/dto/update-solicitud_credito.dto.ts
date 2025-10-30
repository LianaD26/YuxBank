import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudCreditoDto, SolicitudEstado } from './create-solicitud_credito.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class UpdateSolicitudCreditoDto extends PartialType(CreateSolicitudCreditoDto) {
  @ApiPropertyOptional({ description: 'Fecha de solicitud', example: '2025-10-30T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  fecha_solicitud?: string;

  @ApiPropertyOptional({ description: 'Estado', enum: SolicitudEstado })
  @IsOptional()
  @IsEnum(SolicitudEstado)
  estado?: SolicitudEstado;
}


