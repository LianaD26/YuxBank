import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BolsilloService } from './bolsillo.service';
import { Bolsillo } from './bolsillo.entity';
import { CreateBolsilloDto } from './dto/create-bolsillo.dto';
import { UpdateBolsilloDto } from './dto/update-bolsillo.dto';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bolsillos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bolsillos')
export class BolsilloController {
  constructor(private readonly bolsilloService: BolsilloService) {}

  @Get()
  @ApiOperation({ summary: 'Listar bolsillos' })
  @ApiOkResponse({ type: [Bolsillo] })
  findAll(): Promise<Bolsillo[]> {
    return this.bolsilloService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un bolsillo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Bolsillo })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Bolsillo> {
    return this.bolsilloService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear bolsillo' })
  @ApiBody({ type: CreateBolsilloDto })
  @ApiCreatedResponse({ type: Bolsillo })
  create(@Body() dto: CreateBolsilloDto): Promise<Bolsillo> {
    return this.bolsilloService.create(dto as any);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar bolsillo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Bolsillo })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBolsilloDto): Promise<Bolsillo> {
    return this.bolsilloService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar bolsillo' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.bolsilloService.remove(id);
  }
}