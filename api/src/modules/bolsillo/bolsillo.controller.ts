import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Req, Query } from '@nestjs/common';
import { BolsilloService } from './bolsillo.service';
import { Bolsillo } from './bolsillo.entity';
import { CreateBolsilloDto } from './dto/create-bolsillo.dto';
import { UpdateBolsilloDto } from './dto/update-bolsillo.dto';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('bolsillos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bolsillos')
export class BolsilloController {
  constructor(private readonly bolsilloService: BolsilloService) {}

  @Get()
  @ApiOperation({ summary: 'Listar bolsillos del usuario autenticado' })
  @ApiOkResponse({ type: [Bolsillo] })
  findAll(@Req() req: any): Promise<Bolsillo[]> {
    const userId = req.user.id_usuario;
    return this.bolsilloService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un bolsillo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Bolsillo })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Bolsillo> {
    return this.bolsilloService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear bolsillo (deduce dinero de la cuenta si se especifica saldo inicial)' })
  @ApiBody({ type: CreateBolsilloDto })
  @ApiQuery({ name: 'num_cuenta', required: false, description: 'Número de cuenta desde donde se tomará el saldo inicial' })
  @ApiCreatedResponse({ type: Bolsillo })
  create(@Body() dto: CreateBolsilloDto, @Req() req: any, @Query('num_cuenta') numCuenta?: string): Promise<Bolsillo> {
    const userId = req.user.id_usuario;
    return this.bolsilloService.create({ ...dto, id_usuario: userId } as any, numCuenta);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar bolsillo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Bolsillo })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBolsilloDto): Promise<Bolsillo> {
    return this.bolsilloService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar bolsillo (devuelve el saldo a la cuenta)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'num_cuenta', required: false, description: 'Número de cuenta donde se devolverá el saldo' })
  remove(@Param('id', ParseIntPipe) id: number, @Query('num_cuenta') numCuenta?: string): Promise<void> {
    return this.bolsilloService.remove(id, numCuenta);
  }
}