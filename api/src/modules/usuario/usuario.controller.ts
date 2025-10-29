import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBody } from '@nestjs/swagger';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @ApiOkResponse({ type: [Usuario] })
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Post()
  @ApiCreatedResponse({ type: Usuario })
  create(@Body() createDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(createDto as any);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nuevaContrasena: { type: 'string', example: '654321' },
      },
    },
  })
  async changePassword(@Request() req, @Body() body: { nuevaContrasena: string }) {
    const { nuevaContrasena } = body;
    return this.usuarioService.changePassword(req.user.id_usuario, nuevaContrasena);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-email')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nuevoCorreo: { type: 'string', example: 'mateo2@yuxbank.com' },
      },
    },
  })
  async changeEmail(@Request() req, @Body() body: { nuevoCorreo: string }) {
    const { nuevoCorreo } = body;
    return this.usuarioService.changeEmail(req.user.id_usuario, nuevoCorreo);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Usuario })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Usuario })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.update(id, updateDto as any);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usuarioService.remove(id);
  }
  
}
