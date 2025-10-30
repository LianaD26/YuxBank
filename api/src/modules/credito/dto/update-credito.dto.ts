import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditoDto, CreditoEstado } from './create-credito.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCreditoDto extends PartialType(CreateCreditoDto) {
  @ApiPropertyOptional({ description: 'Monto', example: 2000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  monto?: number;

  @ApiPropertyOptional({ description: 'Plazo', example: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  plazo?: number;

  @ApiPropertyOptional({ description: 'Tasa de interés', example: 2.8 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tasa_interes?: number;

  @ApiPropertyOptional({ description: 'Estado', enum: CreditoEstado })
  @IsOptional()
  @IsEnum(CreditoEstado)
  estado?: CreditoEstado;
}


