import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bolsillo } from './bolsillo.entity';
import { CreateBolsilloDto } from './dto/create-bolsillo.dto';
import { UpdateBolsilloDto } from './dto/update-bolsillo.dto';

@Injectable()
export class BolsilloService {
  constructor(
    @InjectRepository(Bolsillo)
    private readonly bolsilloRepository: Repository<Bolsillo>,
  ) {}

  findAll(): Promise<Bolsillo[]> {
    return this.bolsilloRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Bolsillo> {
    const bolsillo = await this.bolsilloRepository.findOne({
      where: { id_bolsillo: id },
      relations: ['usuario'],
    });
    if (!bolsillo) {
      throw new NotFoundException(`Bolsillo con id ${id} no encontrado`);
    }
    return bolsillo;
  }

  create(bolsillo: CreateBolsilloDto): Promise<Bolsillo> {
    return this.bolsilloRepository.save(bolsillo as any);
  }

  async update(id: number, bolsillo: UpdateBolsilloDto): Promise<Bolsillo> {
    await this.bolsilloRepository.update(id, bolsillo as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.bolsilloRepository.delete(id);
  }
}