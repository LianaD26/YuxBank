import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum SolicitudEstado {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
}

export class CreateSolicitudCreditoDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  @Type(() => Number)
  @IsNumber()
  id_usuario: number;

  @ApiPropertyOptional({ description: 'Fecha de solicitud', example: '2025-10-29T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  fecha_solicitud?: string;

  @ApiProperty({ description: 'Estado', enum: SolicitudEstado, example: SolicitudEstado.PENDIENTE, required: false })
  @IsOptional()
  @IsEnum(SolicitudEstado)
  estado?: SolicitudEstado;
}


