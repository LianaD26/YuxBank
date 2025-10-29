import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { Factura } from './factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('facturas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('facturas')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar facturas' })
  @ApiOkResponse({ type: [Factura] })
  findAll(): Promise<Factura[]> {
    return this.facturaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Factura })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Factura> {
    return this.facturaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear factura' })
  @ApiBody({ type: CreateFacturaDto })
  @ApiCreatedResponse({ type: Factura })
  create(@Body() dto: CreateFacturaDto): Promise<Factura> {
    return this.facturaService.create(dto as any);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar factura' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Factura })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFacturaDto): Promise<Factura> {
    return this.facturaService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar factura' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.facturaService.remove(id);
  }
}