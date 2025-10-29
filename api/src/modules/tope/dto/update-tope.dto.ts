import { PartialType } from '@nestjs/mapped-types';
import { CreateTopeDto, TopeTipo } from './create-tope.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTopeDto extends PartialType(CreateTopeDto) {
  @ApiPropertyOptional({ description: 'Tipo', enum: TopeTipo })
  @IsOptional()
  @IsEnum(TopeTipo)
  tipo?: TopeTipo;

  @ApiPropertyOptional({ description: 'Monto máximo', example: 750000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  monto_maximo?: number;
}


