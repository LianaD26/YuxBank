import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { Cuenta } from './cuenta.entity';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiParam, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cuenta')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cuenta')
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar cuentas' })
  @ApiOkResponse({ type: [Cuenta] })
  findAll(): Promise<Cuenta[]> {
    return this.cuentaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cuenta por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Cuenta })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Cuenta> {
    return this.cuentaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear cuenta' })
  @ApiBody({ type: CreateCuentaDto })
  @ApiCreatedResponse({ type: Cuenta })
  create(@Body() dto: CreateCuentaDto, @Req() req): Promise<Cuenta> {
    const userId = req.user.id_usuario;
    return this.cuentaService.create(dto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar cuenta' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Cuenta })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCuentaDto): Promise<Cuenta> {
    return this.cuentaService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cuenta' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cuentaService.remove(id);
  }
}