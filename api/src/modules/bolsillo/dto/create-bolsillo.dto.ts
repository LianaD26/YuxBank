import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBolsilloDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  @Type(() => Number)
  @IsNumber()
  id_usuario: number;

  @ApiPropertyOptional({ description: 'Nombre del bolsillo', example: 'Ahorro viaje' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  nombre?: string;

  @ApiPropertyOptional({ description: 'Saldo', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  saldo?: number;
}


