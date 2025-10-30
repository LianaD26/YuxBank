import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('factura')
export class Factura {
  @PrimaryGeneratedColumn()
  id_factura: number;

  @Column()
  id_usuario: number;

  @Column({ length: 100, nullable: true })
  empresa: string;

  @Column({ length: 50, nullable: true })
  num_referencia: string;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monto: number;

  @Column({ length: 20 })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.facturas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}