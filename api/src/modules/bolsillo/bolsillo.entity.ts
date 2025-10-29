import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('bolsillo')
export class Bolsillo {
  @PrimaryGeneratedColumn()
  id_bolsillo: number;

  @Column()
  id_usuario: number;

  @Column({ length: 50, nullable: true })
  nombre: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  saldo: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.bolsillos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}