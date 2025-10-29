import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { TransaccionTipo } from './create-transaccion.dto';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum TransaccionesSortBy {
  FECHA = 'fecha',
  MONTO = 'monto',
  ID = 'id_transaccion',
}

export class ListTransaccionesDto {
  @ApiPropertyOptional({ description: 'Página', example: 1, default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Registros por página', example: 10, default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Orden asc/desc', enum: SortOrder, example: SortOrder.DESC, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ description: 'Campo de ordenamiento', enum: TransaccionesSortBy, example: TransaccionesSortBy.FECHA, default: TransaccionesSortBy.FECHA })
  @IsOptional()
  @IsEnum(TransaccionesSortBy)
  sortBy?: TransaccionesSortBy = TransaccionesSortBy.FECHA;

  @ApiPropertyOptional({ description: 'Fecha desde (ISO)', example: '2025-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiPropertyOptional({ description: 'Fecha hasta (ISO)', example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @ApiPropertyOptional({ description: 'Tipo de transacción', enum: TransaccionTipo, example: TransaccionTipo.TRANSFERENCIA })
  @IsOptional()
  @IsEnum(TransaccionTipo)
  tipo?: TransaccionTipo;

  @ApiPropertyOptional({ description: 'Referencia contiene', example: 'REF-2025' })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiPropertyOptional({ description: 'Monto mínimo', example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  minMonto?: number;

  @ApiPropertyOptional({ description: 'Monto máximo', example: 100000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxMonto?: number;
}

export interface PaginatedTransacciones {
  data: any[];
  total: number;
  page: number;
  limit: number;
}


