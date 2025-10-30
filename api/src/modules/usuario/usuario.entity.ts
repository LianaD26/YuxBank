import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cuenta } from '../cuenta/cuenta.entity';
import { Factura } from '../factura/factura.entity';
import { TarjetaCredito } from '../tarjeta_credito/tarjeta_credito.entity';
import { SolicitudCredito } from '../solicitud_credito/solicitud_credito.entity';
import { Credito } from '../credito/credito.entity';
import { Bolsillo } from '../bolsillo/bolsillo.entity';
import { Tope } from '../tope/tope.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 50 })
  apellido: string;

  @Column({ length: 100, unique: true })
  correo: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @Column({ length: 10 })
  estado: string;

  @OneToMany(() => Cuenta, (cuenta) => cuenta.usuario)
  cuentas: Cuenta[];

  @OneToMany(() => Factura, (factura) => factura.usuario)
  facturas: Factura[];

  @OneToMany(() => TarjetaCredito, (tarjeta) => tarjeta.usuario)
  tarjetas: TarjetaCredito[];

  @OneToMany(() => SolicitudCredito, (solicitud) => solicitud.usuario)
  solicitudes: SolicitudCredito[];

  @OneToMany(() => Credito, (credito) => credito.usuario)
  creditos: Credito[];

  @OneToMany(() => Bolsillo, (bolsillo) => bolsillo.usuario)
  bolsillos: Bolsillo[];

  @OneToMany(() => Tope, (tope) => tope.usuario)
  topes: Tope[];
}