import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export enum CreditoEstado {
  VIGENTE = 'vigente',
  PAGADO = 'pagado',
  RECHAZADO = 'rechazado',
}

export class CreateCreditoDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  @Type(() => Number)
  @IsNumber()
  id_usuario: number;

  @ApiProperty({ description: 'Monto del crédito', example: 1000000 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  monto: number;

  @ApiProperty({ description: 'Plazo en meses', example: 12 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  plazo: number;

  @ApiPropertyOptional({ description: 'Tasa de interés en %', example: 2.5 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  tasa_interes?: number;

  @ApiProperty({ description: 'Estado del crédito', enum: CreditoEstado, example: CreditoEstado.VIGENTE, required: false })
  @IsOptional()
  @IsEnum(CreditoEstado)
  estado?: CreditoEstado;
}


