import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum TopeTipo {
  CONSUMO = 'consumo',
  TRANSFERENCIA = 'transferencia',
}

export class CreateTopeDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  @Type(() => Number)
  @IsNumber()
  id_usuario: number;

  @ApiProperty({ description: 'Tipo de tope', enum: TopeTipo, example: TopeTipo.CONSUMO })
  @IsEnum(TopeTipo)
  tipo: TopeTipo;

  @ApiProperty({ description: 'Monto máximo', example: 500000 })
  @Type(() => Number)
  @IsNumber()
  monto_maximo: number;
}


