import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credito } from './credito.entity';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';

@Injectable()
export class CreditoService {
  constructor(
    @InjectRepository(Credito)
    private readonly creditoRepository: Repository<Credito>,
  ) {}

  findAll(): Promise<Credito[]> {
    return this.creditoRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Credito> {
    const credito = await this.creditoRepository.findOne({
      where: { id_credito: id },
      relations: ['usuario'],
    });
    if (!credito) {
      throw new NotFoundException(`Crédito con id ${id} no encontrado`);
    }
    return credito;
  }

  create(credito: CreateCreditoDto): Promise<Credito> {
    return this.creditoRepository.save(credito as any);
  }

  async update(id: number, credito: UpdateCreditoDto): Promise<Credito> {
    await this.creditoRepository.update(id, credito as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.creditoRepository.delete(id);
  }
}