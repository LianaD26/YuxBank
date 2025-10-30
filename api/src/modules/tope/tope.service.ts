import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tope } from './tope.entity';
import { CreateTopeDto } from './dto/create-tope.dto';
import { UpdateTopeDto } from './dto/update-tope.dto';

@Injectable()
export class TopeService {
  constructor(
    @InjectRepository(Tope)
    private readonly topeRepository: Repository<Tope>,
  ) {}

  findAll(): Promise<Tope[]> {
    return this.topeRepository.find();
  }

  async findByUser(userId: number): Promise<Tope[]> {
    return this.topeRepository.find({ 
      where: { id_usuario: userId },
      order: { tipo: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Tope> {
    const tope = await this.topeRepository.findOne({ where: { id_tope: id } });
    if (!tope) {
      throw new NotFoundException(`Tope con id ${id} no encontrado`);
    }
    return tope;
  }

  create(tope: CreateTopeDto): Promise<Tope> {
    return this.topeRepository.save(tope as any);
  }

  async update(id: number, tope: UpdateTopeDto): Promise<Tope> {
    await this.topeRepository.update(id, tope as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.topeRepository.delete(id);
  }
}