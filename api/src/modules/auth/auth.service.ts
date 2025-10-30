import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const usuario = await this.usuarioService.create(dto);
    const payload = { sub: usuario.id_usuario, correo: usuario.correo };
    const token = this.jwtService.sign(payload);
    return { usuario, token };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioService.findByCorreo(dto.correo);
    if (!usuario) throw new UnauthorizedException('Correo no encontrado');

    const match = await bcrypt.compare(dto.contrasena, usuario.contrasena);
    if (!match) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: usuario.id_usuario, correo: usuario.correo };
    const token = this.jwtService.sign(payload);
    return { usuario, token };
  }
}