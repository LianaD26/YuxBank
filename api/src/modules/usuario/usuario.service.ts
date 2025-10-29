import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    const { contrasena, ...rest } = usuario as any;
    return rest as Usuario;
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.contrasena, saltRounds);
    const entidad = this.usuarioRepository.create({
      ...dto,
      contrasena: hashedPassword,
      estado: 'activo', 
    });
    const saved = await this.usuarioRepository.save(entidad);
    const { contrasena, ...rest } = saved as any;
    return rest as Usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    await this.findOne(id);

    if (dto.contrasena) {
      const saltRounds = 10;
      dto.contrasena = await bcrypt.hash(dto.contrasena, saltRounds);
    }

    await this.usuarioRepository.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }

  async changePassword(id: number, nuevaContrasena: string): Promise<{ message: string }> {
    const usuario = await this.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevaContrasena, saltRounds);
    await this.usuarioRepository.update(id, { contrasena: hashedPassword });
    return { message: 'Contraseña actualizada correctamente' };
  }

  async changeEmail(id: number, nuevoCorreo: string): Promise<{ message: string }> {
    const usuario = await this.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    await this.usuarioRepository.update(id, { correo: nuevoCorreo });
    return { message: 'Correo actualizado correctamente' };
  }
  async findByCorreo(correo: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({ where: { correo } });
  }
}