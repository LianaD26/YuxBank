import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum TopeTipo {
  CONSUMO = 'consumo',
  TRANSFERENCIA = 'transferencia',
}

export class CreateTopeDto {
  @ApiProperty({ description: 'ID del usuario (se obtiene automáticamente del JWT)', example: 1, required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  id_usuario?: number;

  @ApiProperty({ description: 'Tipo de tope', enum: TopeTipo, example: TopeTipo.CONSUMO })
  @IsEnum(TopeTipo)
  tipo: TopeTipo;

  @ApiProperty({ description: 'Monto máximo', example: 500000 })
  @Type(() => Number)
  @IsNumber()
  monto_maximo: number;
}


