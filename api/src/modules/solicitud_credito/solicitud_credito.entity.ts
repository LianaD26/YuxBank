import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('solicitud_credito')
export class SolicitudCredito {
  @PrimaryGeneratedColumn()
  id_solicitud: number;

  @Column()
  id_usuario: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_solicitud: Date;

  @Column({ length: 20 })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}