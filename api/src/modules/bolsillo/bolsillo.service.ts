import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Bolsillo } from './bolsillo.entity';
import { CreateBolsilloDto } from './dto/create-bolsillo.dto';
import { UpdateBolsilloDto } from './dto/update-bolsillo.dto';
import { Cuenta } from '../cuenta/cuenta.entity';

@Injectable()
export class BolsilloService {
  constructor(
    @InjectRepository(Bolsillo)
    private readonly bolsilloRepository: Repository<Bolsillo>,
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<Bolsillo[]> {
    return this.bolsilloRepository.find({ relations: ['usuario'] });
  }

  async findByUser(userId: number): Promise<Bolsillo[]> {
    return this.bolsilloRepository.find({ 
      where: { id_usuario: userId },
      order: { id_bolsillo: 'ASC' }
    });
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

  async create(bolsillo: CreateBolsilloDto, numCuenta?: string): Promise<Bolsillo> {
    // Si se proporciona un monto inicial, validar que la cuenta tenga saldo suficiente
    if (bolsillo.saldo && bolsillo.saldo > 0 && numCuenta) {
      const cuenta = await this.cuentaRepository.findOne({ 
        where: { num_cuenta: numCuenta, id_usuario: bolsillo.id_usuario } 
      });
      
      if (!cuenta) {
        throw new NotFoundException('Cuenta no encontrada');
      }
      
      if (Number(cuenta.saldo) < Number(bolsillo.saldo)) {
        throw new BadRequestException('Saldo insuficiente en la cuenta');
      }

      // Usar transacción para asegurar consistencia
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Restar el monto de la cuenta
        cuenta.saldo = Number(cuenta.saldo) - Number(bolsillo.saldo);
        await queryRunner.manager.save(cuenta);

        // Crear el bolsillo
        const nuevoBolsillo = await queryRunner.manager.save(Bolsillo, bolsillo as any);
        
        await queryRunner.commitTransaction();
        return nuevoBolsillo;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    // Si no hay monto inicial, crear el bolsillo directamente
    return this.bolsilloRepository.save({ ...bolsillo, saldo: 0 } as any);
  }

  async update(id: number, bolsillo: UpdateBolsilloDto): Promise<Bolsillo> {
    await this.bolsilloRepository.update(id, bolsillo as any);
    return this.findOne(id);
  }

  async remove(id: number, numCuenta?: string): Promise<void> {
    const bolsillo = await this.bolsilloRepository.findOne({ 
      where: { id_bolsillo: id } 
    });
    
    if (!bolsillo) {
      throw new NotFoundException('Bolsillo no encontrado');
    }

    // Si el bolsillo tiene saldo, devolverlo a la cuenta
    if (Number(bolsillo.saldo) > 0 && numCuenta) {
      const cuenta = await this.cuentaRepository.findOne({ 
        where: { num_cuenta: numCuenta, id_usuario: bolsillo.id_usuario } 
      });
      
      if (!cuenta) {
        throw new NotFoundException('Cuenta no encontrada');
      }

      // Usar transacción para asegurar consistencia
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Devolver el saldo a la cuenta
        cuenta.saldo = Number(cuenta.saldo) + Number(bolsillo.saldo);
        await queryRunner.manager.save(cuenta);

        // Eliminar el bolsillo
        await queryRunner.manager.delete(Bolsillo, id);
        
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } else {
      // Si no tiene saldo, eliminar directamente
      await this.bolsilloRepository.delete(id);
    }
  }
}