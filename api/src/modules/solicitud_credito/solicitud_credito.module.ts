import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudCreditoService } from './solicitud_credito.service';
import { SolicitudCreditoController } from './solicitud_credito.controller';
import { SolicitudCredito } from './solicitud_credito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SolicitudCredito])],
  controllers: [SolicitudCreditoController],
  providers: [SolicitudCreditoService],
  exports: [SolicitudCreditoService],
})
export class SolicitudCreditoModule {}