import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('credito')
export class Credito {
  @PrimaryGeneratedColumn()
  id_credito: number;

  @Column()
  id_usuario: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monto: number;

  @Column()
  plazo: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  tasa_interes: number;

  @Column({ length: 20 })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.creditos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}