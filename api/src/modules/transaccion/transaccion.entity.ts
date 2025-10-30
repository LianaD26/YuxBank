import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cuenta } from '../cuenta/cuenta.entity';

@Entity('transaccion')
export class Transaccion {
  @PrimaryGeneratedColumn()
  id_transaccion: number;

  @Column()
  id_cuenta_origen: number;

  @Column()
  id_cuenta_destino: number;

  @Column({ length: 20 })
  tipo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monto: number;

  @Column({ length: 100, nullable: true })
  referencia: string;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  @ManyToOne(() => Cuenta, (cuenta) => cuenta.transacciones_origen)
  @JoinColumn({ name: 'id_cuenta_origen' })
  cuenta_origen: Cuenta;

  @ManyToOne(() => Cuenta, (cuenta) => cuenta.transacciones_destino)
  @JoinColumn({ name: 'id_cuenta_destino' })
  cuenta_destino: Cuenta;
}