import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
  ) {}

  findAll(): Promise<Factura[]> {
    return this.facturaRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id_factura: id },
      relations: ['usuario'],
    });
    if (!factura) {
      throw new NotFoundException(`Factura con id ${id} no encontrada`);
    }
    return factura;
  }

  create(factura: CreateFacturaDto): Promise<Factura> {
    return this.facturaRepository.save(factura as any);
  }

  async update(id: number, factura: UpdateFacturaDto): Promise<Factura> {
    await this.facturaRepository.update(id, factura as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.facturaRepository.delete(id);
  }
}
