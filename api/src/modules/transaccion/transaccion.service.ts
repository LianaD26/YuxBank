import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, SelectQueryBuilder } from 'typeorm';
import { Transaccion } from './transaccion.entity';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { ListTransaccionesDto, PaginatedTransacciones, TransaccionesSortBy, SortOrder } from './dto/list-transacciones.dto';

@Injectable()
export class TransaccionService {
    constructor(
        @InjectRepository(Transaccion)
        private readonly transaccionRepository: Repository<Transaccion>,
        private readonly dataSource: DataSource,
    ) {}

    findAll(): Promise<Transaccion[]> {
        return this.transaccionRepository.find({ relations: ['cuenta_origen', 'cuenta_destino'] });
    }

    async findOne(id: number): Promise<Transaccion> {
        const transaccion = await this.transaccionRepository.findOne({ where: { id_transaccion: id }, relations: ['cuenta_origen', 'cuenta_destino'] });
        if (!transaccion) {
            throw new NotFoundException(`Transacción con id ${id} no encontrada`);
        }
        return transaccion;
    }

    create(transaccion: CreateTransaccionDto): Promise<Transaccion> {
        return this.transaccionRepository.save(transaccion as any);
    }

    async update(id: number, transaccion: UpdateTransaccionDto): Promise<Transaccion> {
        await this.transaccionRepository.update(id, transaccion as any);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.transaccionRepository.delete(id);
    }

    async findAllPaginated(query: ListTransaccionesDto, userId?: number): Promise<PaginatedTransacciones> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.transaccionRepository.createQueryBuilder('t')
            .leftJoinAndSelect('t.cuenta_origen', 'co')
            .leftJoinAndSelect('t.cuenta_destino', 'cd');

        this.applyFilters(qb, query);

        if (userId) {
            qb.andWhere('(co.id_usuario = :userId OR cd.id_usuario = :userId)', { userId });
        }

        // Sorting
        const sortBy = query.sortBy ?? TransaccionesSortBy.FECHA;
        const sortOrder = query.sortOrder ?? SortOrder.DESC;
        qb.orderBy(`t.${sortBy}`, sortOrder);

        qb.skip(skip).take(limit);

        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }

    async findByCuenta(idCuenta: number, query: ListTransaccionesDto, userId?: number): Promise<PaginatedTransacciones> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.transaccionRepository.createQueryBuilder('t')
            .leftJoinAndSelect('t.cuenta_origen', 'co')
            .leftJoinAndSelect('t.cuenta_destino', 'cd')
            .where('t.id_cuenta_origen = :idCuenta OR t.id_cuenta_destino = :idCuenta', { idCuenta });

        this.applyFilters(qb, query);

        if (userId) {
            qb.andWhere('(co.id_usuario = :userId OR cd.id_usuario = :userId)', { userId });
        }

        const sortBy = query.sortBy ?? TransaccionesSortBy.FECHA;
        const sortOrder = query.sortOrder ?? SortOrder.DESC;
        qb.orderBy(`t.${sortBy}`, sortOrder);
        qb.skip(skip).take(limit);

        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }

    private applyFilters(qb: SelectQueryBuilder<Transaccion>, query: ListTransaccionesDto) {
        if (query.tipo) {
            qb.andWhere('t.tipo = :tipo', { tipo: query.tipo });
        }
        if (query.referencia) {
            qb.andWhere('t.referencia ILIKE :ref', { ref: `%${query.referencia}%` });
        }
        if (query.minMonto) {
            qb.andWhere('t.monto >= :minMonto', { minMonto: query.minMonto });
        }
        if (query.maxMonto) {
            qb.andWhere('t.monto <= :maxMonto', { maxMonto: query.maxMonto });
        }
        if (query.fechaDesde) {
            qb.andWhere('t.fecha >= :fechaDesde', { fechaDesde: query.fechaDesde });
        }
        if (query.fechaHasta) {
            qb.andWhere('t.fecha <= :fechaHasta', { fechaHasta: query.fechaHasta });
        }
    }

    // Transferencia atómica con validación de saldo, tope y idempotencia por referencia
    async transfer(userId: number, dto: CreateTransaccionDto): Promise<Transaccion> {
        // Resolver cuenta origen/destino por id o num_cuenta
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const resolveCuentaId = async (id?: number, num?: string): Promise<number> => {
            if (id) return id;
            if (!num) {
                throw new NotFoundException('Debe indicar id de cuenta o número de cuenta');
            }
            const c = await queryRunner.manager
                .getRepository('cuenta')
                .createQueryBuilder('c')
                .where('c.num_cuenta = :num', { num })
                .getOne();
            if (!c) throw new NotFoundException('Cuenta no encontrada por número');
            return (c as any).id_cuenta as number;
        };

        const origenId = await resolveCuentaId(dto.id_cuenta_origen, dto.num_cuenta_origen);
        const destinoId = await resolveCuentaId(dto.id_cuenta_destino, dto.num_cuenta_destino);

        if (origenId === destinoId) {
            throw new NotFoundException('La cuenta origen y destino no pueden ser la misma');
        }

        // Idempotencia: si existe transacción con misma referencia, monto y cuentas, devolverla
        if (dto.referencia) {
            const existing = await this.transaccionRepository.findOne({
                where: {
                    id_cuenta_origen: origenId,
                    id_cuenta_destino: destinoId,
                    monto: dto.monto as any,
                    referencia: dto.referencia,
                },
            });
            if (existing) {
                await queryRunner.release();
                return existing;
            }
        }

        try {
            // Bloquear filas de cuentas
            const cuentaOrigen = await queryRunner.manager
                .getRepository('cuenta')
                .createQueryBuilder('c')
                .setLock('pessimistic_write')
                .where('c.id_cuenta = :id', { id: origenId })
                .getOne();

            const cuentaDestino = await queryRunner.manager
                .getRepository('cuenta')
                .createQueryBuilder('c')
                .setLock('pessimistic_write')
                .where('c.id_cuenta = :id', { id: destinoId })
                .getOne();

            if (!cuentaOrigen || !cuentaDestino) {
                throw new NotFoundException('Cuenta origen o destino no existe');
            }

            // Autorización: el usuario solo puede debitar desde su propia cuenta
            const ownerId = Number((cuentaOrigen as any).id_usuario);
            const requesterId = Number(userId);
            if (ownerId !== requesterId) {
                throw new ForbiddenException('No autorizado para operar la cuenta origen');
            }

            // Tope: validar contra tope de tipo transferencia del usuario
            const tope = await queryRunner.manager
                .getRepository('tope')
                .createQueryBuilder('t')
                .where('t.id_usuario = :userId', { userId })
                .andWhere('t.tipo = :tipo', { tipo: 'transferencia' })
                .getOne();

            if (tope && Number(dto.monto) > Number((tope as any).monto_maximo)) {
                throw new NotFoundException('Monto excede el tope permitido');
            }

            // Saldo suficiente
            const saldoOrigen = Number((cuentaOrigen as any).saldo);
            if (saldoOrigen < Number(dto.monto)) {
                throw new NotFoundException('Saldo insuficiente');
            }

            // Debitar/abonar
            await queryRunner.manager
                .createQueryBuilder()
                .update('cuenta')
                .set({ saldo: () => `saldo - ${Number(dto.monto)}` })
                .where('id_cuenta = :id', { id: origenId })
                .execute();

            await queryRunner.manager
                .createQueryBuilder()
                .update('cuenta')
                .set({ saldo: () => `saldo + ${Number(dto.monto)}` })
                .where('id_cuenta = :id', { id: destinoId })
                .execute();

            // Registrar transacción
            const toSave = this.transaccionRepository.create({
                id_cuenta_origen: origenId,
                id_cuenta_destino: destinoId,
                tipo: dto.tipo,
                monto: dto.monto as any,
                referencia: dto.referencia,
                descripcion: dto.descripcion,
                fecha: dto.fecha ? (dto.fecha as any) : undefined,
            } as any);

            const insertResult = await queryRunner.manager.getRepository(Transaccion).insert(toSave);
            const newId = insertResult.identifiers[0]?.id_transaccion as number;
            await queryRunner.commitTransaction();
            return this.findOne(newId);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}