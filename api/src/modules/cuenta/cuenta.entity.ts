import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Transaccion } from '../transaccion/transaccion.entity';

@Entity('cuenta')
export class Cuenta {
  @PrimaryGeneratedColumn()
  id_cuenta: number;

  @Column()
  id_usuario: number;

  @Column({ unique: true, length: 20 })
  num_cuenta: string;

  @Column({ length: 20 })
  tipo: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  saldo: number;

  @Column({ length: 10, default: 'activo' })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.cuentas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => Transaccion, (transaccion) => transaccion.cuenta_origen)
  transacciones_origen: Transaccion[];

  @OneToMany(() => Transaccion, (transaccion) => transaccion.cuenta_destino)
  transacciones_destino: Transaccion[];
}