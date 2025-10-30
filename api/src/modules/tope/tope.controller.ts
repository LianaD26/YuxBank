import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { TopeService } from './tope.service';
import { Tope } from './tope.entity';
import { CreateTopeDto } from './dto/create-tope.dto';
import { UpdateTopeDto } from './dto/update-tope.dto';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('topes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('topes')
export class TopeController {
  constructor(private readonly topeService: TopeService) {}

  @Get()
  @ApiOperation({ summary: 'Listar topes del usuario autenticado' })
  @ApiOkResponse({ type: [Tope] })
  findAll(@Req() req: any): Promise<Tope[]> {
    const userId = req.user.id_usuario;
    return this.topeService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tope por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Tope })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tope> {
    return this.topeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear tope' })
  @ApiBody({ type: CreateTopeDto })
  @ApiCreatedResponse({ type: Tope })
  create(@Body() dto: CreateTopeDto, @Req() req: any): Promise<Tope> {
    const userId = req.user.id_usuario;
    return this.topeService.create({ ...dto, id_usuario: userId } as any);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar tope' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Tope })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTopeDto): Promise<Tope> {
    return this.topeService.update(id, dto as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tope' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.topeService.remove(id);
  }
}