import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('tarjeta_credito')
export class TarjetaCredito {
  @PrimaryGeneratedColumn()
  id_tarjeta: number;

  @Column()
  id_usuario: number;

  @Column({ unique: true, length: 20 })
  num_tarjeta: string;

  @Column({ type: 'date', nullable: true })
  fecha_expedicion: Date;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  cupo: number;

  @Column({ length: 20 })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.tarjetas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}