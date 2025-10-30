

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TarjetaCredito } from './tarjeta_credito.entity';
import { CreateTarjetaCreditoDto } from './dto/create-tarjeta_credito.dto';
import { UpdateTarjetaCreditoDto } from './dto/update-tarjeta_credito.dto';

@Injectable()
export class TarjetaCreditoService {
  constructor(
    @InjectRepository(TarjetaCredito)
    private readonly tarjetaRepository: Repository<TarjetaCredito>,
  ) {}

  findAll(): Promise<TarjetaCredito[]> {
    return this.tarjetaRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<TarjetaCredito> {
    const tarjeta = await this.tarjetaRepository.findOne({
      where: { id_tarjeta: id },
      relations: ['usuario'],
    });
    if (!tarjeta) {
      throw new NotFoundException(`Tarjeta de crédito con id ${id} no encontrada`);
    }
    return tarjeta;
  }

  create(tarjeta: CreateTarjetaCreditoDto): Promise<TarjetaCredito> {
    return this.tarjetaRepository.save(tarjeta as any);
  }

  async update(id: number, tarjeta: UpdateTarjetaCreditoDto): Promise<TarjetaCredito> {
    await this.tarjetaRepository.update(id, tarjeta as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.tarjetaRepository.delete(id);
  }
}