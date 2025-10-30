import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBolsilloDto {
  @ApiPropertyOptional({ description: 'ID del usuario (se obtiene automáticamente del JWT)', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  id_usuario?: number;

  @ApiPropertyOptional({ description: 'Nombre del bolsillo', example: 'Ahorro viaje' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Saldo inicial', example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  saldo?: number;
}


