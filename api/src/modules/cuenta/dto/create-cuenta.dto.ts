import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export enum CuentaTipo {
  AHORROS = 'ahorros',
  CORRIENTE = 'corriente',
}

export enum CuentaEstado {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export class CreateCuentaDto {
  @ApiProperty({ description: 'ID del usuario propietario', example: 1 })
  @Type(() => Number)
  @IsNumber()
  id_usuario: number;

  @ApiProperty({ description: 'Número de cuenta único', example: '1234567890' })
  @IsString()
  @Length(1, 20)
  num_cuenta: string;

  @ApiProperty({ description: 'Tipo de cuenta', enum: CuentaTipo, example: CuentaTipo.AHORROS })
  @IsEnum(CuentaTipo)
  tipo: CuentaTipo;

  @ApiProperty({ description: 'Saldo inicial', example: 0, required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  saldo?: number;

  @ApiProperty({ description: 'Estado de la cuenta', enum: CuentaEstado, example: CuentaEstado.ACTIVO, required: false })
  @IsOptional()
  @IsEnum(CuentaEstado)
  estado?: CuentaEstado;
}


