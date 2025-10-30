import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SolicitudCreditoService } from './solicitud_credito.service';
import { SolicitudCredito } from './solicitud_credito.entity';
import { CreateSolicitudCreditoDto } from './dto/create-solicitud_credito.dto';
import { UpdateSolicitudCreditoDto } from './dto/update-solicitud_credito.dto';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('solicitudes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('solicitudes')
export class SolicitudCreditoController {
  constructor(private readonly solicitudService: SolicitudCreditoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes de crédito' })
  @ApiOkResponse({ type: [SolicitudCredito] })
  findAll(): Promise<SolicitudCredito[]> {
    return this.solicitudService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: SolicitudCredito })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SolicitudCredito> {
    return this.solicitudService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear solicitud' })
  @ApiBody({ type: CreateSolicitudCreditoDto })
  @ApiCreatedResponse({ type: SolicitudCredito })
  create(@Body() dto: CreateSolicitudCreditoDto): Promise<SolicitudCredito> {
    return this.solicitudService.create(dto as any);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar solicitud' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: SolicitudCredito })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSolicitudCreditoDto): Promise<SolicitudCredito> {
    return this.solicitudService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar solicitud' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.solicitudService.remove(id);
  }
}