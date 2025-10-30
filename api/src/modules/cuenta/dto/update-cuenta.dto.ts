import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { CuentaTipo } from './create-cuenta.dto';

export class UpdateCuentaDto {
  @ApiPropertyOptional({ description: 'Número de cuenta', example: '1234567890' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  num_cuenta?: string;

  @ApiPropertyOptional({ description: 'Tipo de cuenta', enum: CuentaTipo })
  @IsOptional()
  @IsEnum(CuentaTipo)
  tipo?: CuentaTipo;

  @ApiPropertyOptional({ description: 'Saldo', example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  saldo?: number;
}
