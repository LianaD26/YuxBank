import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CreditoService } from './credito.service';
import { Credito } from './credito.entity';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('creditos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('creditos')
export class CreditoController {
  constructor(private readonly creditoService: CreditoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar créditos' })
  @ApiOkResponse({ type: [Credito] })
  findAll(): Promise<Credito[]> {
    return this.creditoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un crédito por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Credito })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Credito> {
    return this.creditoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear crédito' })
  @ApiBody({ type: CreateCreditoDto })
  @ApiCreatedResponse({ type: Credito })
  create(@Body() dto: CreateCreditoDto): Promise<Credito> {
    return this.creditoService.create(dto as any);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar crédito' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Credito })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCreditoDto): Promise<Credito> {
    return this.creditoService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar crédito' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.creditoService.remove(id);
  }
}