import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cuenta } from './cuenta.entity';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  findAll(): Promise<Cuenta[]> {
    return this.cuentaRepository.find({ relations: ['usuario'] });
  }

  async findByUser(userId: number): Promise<Cuenta[]> {
    console.log('=== FIND BY USER SERVICE ===');
    console.log('User ID:', userId);
    
    const cuentas = await this.cuentaRepository.find({ 
      where: { id_usuario: userId },
      select: ['id_cuenta', 'num_cuenta', 'tipo', 'saldo', 'estado', 'id_usuario'],
      order: { id_cuenta: 'ASC' }
    });
    
    console.log('Cuentas found in DB:', cuentas);
    return cuentas;
  }

  async findOne(id: number): Promise<Cuenta> {
    const cuenta = await this.cuentaRepository.findOne({ where: { id_cuenta: id }, relations: ['usuario'] });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con id ${id} no encontrada`);
    }
    return cuenta;
  }

  async create(cuenta: CreateCuentaDto, userId: number): Promise<Cuenta> {
    // Check if account number already exists
    const existingAccount = await this.cuentaRepository.findOne({ where: { num_cuenta: cuenta.num_cuenta } });
    if (existingAccount) {
      throw new BadRequestException('El número de cuenta ya existe');
    }

    const saldo = Math.floor(Math.random() * (1000000 - 1000 + 1)) + 1000;
    const estado = 'activo';
    const nuevaCuenta = this.cuentaRepository.create({
      num_cuenta: cuenta.num_cuenta,
      tipo: cuenta.tipo,
      saldo,
      estado,
      id_usuario: userId,
    });
    return await this.cuentaRepository.save(nuevaCuenta);
  }

  async update(id: number, cuenta: UpdateCuentaDto): Promise<Cuenta> {
    await this.cuentaRepository.update(id, cuenta as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cuentaRepository.delete(id);
  }
}