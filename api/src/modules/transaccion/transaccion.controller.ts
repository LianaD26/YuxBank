import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { Transaccion } from './transaccion.entity';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiQuery, ApiBearerAuth, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ListTransaccionesDto } from './dto/list-transacciones.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('transacciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transacciones')
export class TransaccionController {
  constructor(private readonly transaccionService: TransaccionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar transacciones del usuario autenticado' })
  @ApiOkResponse({ type: [Transaccion] })
  async findAll(@Request() req): Promise<Transaccion[]> {
    const userId = req.user.id_usuario;
    return this.transaccionService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Transaccion })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Transaccion> {
    return this.transaccionService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear transacción' })
  @ApiBody({ type: CreateTransaccionDto })
  @ApiCreatedResponse({ type: Transaccion })
  create(@Request() req, @Body() dto: CreateTransaccionDto): Promise<Transaccion> {
    // Usa lógica segura de transferencia
    return this.transaccionService.transfer(req.user.id_usuario, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar transacción' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Transaccion })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTransaccionDto): Promise<Transaccion> {
    return this.transaccionService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar transacción' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.transaccionService.remove(id);
  }

  @Get('historial')
  @ApiOperation({ summary: 'Historial global de transacciones con paginación' })
  findHistorial(@Request() req, @Query() query: ListTransaccionesDto) {
    return this.transaccionService.findAllPaginated(query, req.user.id_usuario);
  }

  @Get('cuenta/:id/historial')
  @ApiOperation({ summary: 'Historial de transacciones por cuenta con paginación' })
  @ApiParam({ name: 'id', type: Number })
  findHistorialByCuenta(@Request() req, @Param('id', ParseIntPipe) id: number, @Query() query: ListTransaccionesDto) {
    return this.transaccionService.findByCuenta(id, query, req.user.id_usuario);
  }

  @Post('transferir')
  @ApiOperation({ summary: 'Transferir entre cuentas (atómico)' })
  @ApiBody({ type: CreateTransaccionDto })
  @ApiCreatedResponse({ type: Transaccion })
  @ApiBadRequestResponse({ description: 'Saldo insuficiente / Tope excedido / Datos inválidos' })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  transfer(@Request() req, @Body() dto: CreateTransaccionDto) {
    return this.transaccionService.transfer(req.user.id_usuario, dto);
  }
}