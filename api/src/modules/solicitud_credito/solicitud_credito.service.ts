
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudCredito } from './solicitud_credito.entity';
import { CreateSolicitudCreditoDto } from './dto/create-solicitud_credito.dto';
import { UpdateSolicitudCreditoDto } from './dto/update-solicitud_credito.dto';

@Injectable()
export class SolicitudCreditoService {
  constructor(
    @InjectRepository(SolicitudCredito)
    private readonly solicitudRepository: Repository<SolicitudCredito>,
  ) {}

  findAll(): Promise<SolicitudCredito[]> {
    return this.solicitudRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<SolicitudCredito> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id_solicitud: id },
      relations: ['usuario'],
    });
    if (!solicitud) {
      throw new NotFoundException(`Solicitud de crédito con id ${id} no encontrada`);
    }
    return solicitud;
  }

  create(solicitud: CreateSolicitudCreditoDto): Promise<SolicitudCredito> {
    return this.solicitudRepository.save(solicitud as any);
  }

  async update(id: number, solicitud: UpdateSolicitudCreditoDto): Promise<SolicitudCredito> {
    await this.solicitudRepository.update(id, solicitud as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.solicitudRepository.delete(id);
  }
}