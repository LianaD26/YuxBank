import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export enum CuentaTipo {
  AHORROS = 'ahorros',
  CORRIENTE = 'corriente',
}

export class CreateCuentaDto {
  @ApiProperty({ description: 'Número de cuenta único', example: '1234567890' })
  @IsString()
  @Length(1, 20)
  num_cuenta: string;

  @ApiProperty({ description: 'Tipo de cuenta', enum: CuentaTipo, example: CuentaTipo.AHORROS })
  @IsEnum(CuentaTipo)
  tipo: CuentaTipo;

  @ApiProperty({ description: 'Contraseña del usuario para validar la creación', example: 'MiClaveSegura123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

