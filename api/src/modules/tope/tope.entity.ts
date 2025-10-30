import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('tope')
export class Tope {
  @PrimaryGeneratedColumn()
  id_tope: number;

  @Column()
  id_usuario: number;

  @Column({ length: 20 })
  tipo: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monto_maximo: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.topes)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}