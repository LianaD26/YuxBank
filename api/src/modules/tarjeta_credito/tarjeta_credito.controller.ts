import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TarjetaCreditoService } from './tarjeta_credito.service';
import { TarjetaCredito } from './tarjeta_credito.entity';
import { CreateTarjetaCreditoDto } from './dto/create-tarjeta_credito.dto';
import { UpdateTarjetaCreditoDto } from './dto/update-tarjeta_credito.dto';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tarjetas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tarjetas')
export class TarjetaCreditoController {
  constructor(private readonly tarjetaService: TarjetaCreditoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tarjetas de crédito' })
  @ApiOkResponse({ type: [TarjetaCredito] })
  findAll(): Promise<TarjetaCredito[]> {
    return this.tarjetaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarjeta por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: TarjetaCredito })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TarjetaCredito> {
    return this.tarjetaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear tarjeta' })
  @ApiBody({ type: CreateTarjetaCreditoDto })
  @ApiCreatedResponse({ type: TarjetaCredito })
  create(@Body() dto: CreateTarjetaCreditoDto): Promise<TarjetaCredito> {
    return this.tarjetaService.create(dto as any);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar tarjeta' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: TarjetaCredito })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTarjetaCreditoDto): Promise<TarjetaCredito> {
    return this.tarjetaService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarjeta' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tarjetaService.remove(id);
  }
}