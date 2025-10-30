import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { typeOrmConfig } from './database/typeorm.config';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { CuentaModule } from './modules/cuenta/cuenta.module';
import { TransaccionModule } from './modules/transaccion/transaccion.module';
import { FacturaModule } from './modules/factura/factura.module';
import { TarjetaCreditoModule } from './modules/tarjeta_credito/tarjeta_credito.module';
import { SolicitudCreditoModule } from './modules/solicitud_credito/solicitud_credito.module';
import { CreditoModule } from './modules/credito/credito.module';
import { BolsilloModule } from './modules/bolsillo/bolsillo.module';
import { TopeModule } from './modules/tope/tope.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(__dirname, '..', '..', '.env'),
        join(__dirname, '..', '.env'),
        '.env',
      ],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsuarioModule,
    CuentaModule,
    TransaccionModule,
    FacturaModule,
    TarjetaCreditoModule,
    SolicitudCreditoModule,
    CreditoModule,
    BolsilloModule,
    TopeModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}