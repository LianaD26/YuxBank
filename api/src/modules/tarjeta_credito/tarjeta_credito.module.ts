import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarjetaCreditoService } from './tarjeta_credito.service';
import { TarjetaCreditoController } from './tarjeta_credito.controller';
import { TarjetaCredito } from './tarjeta_credito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TarjetaCredito])],
  controllers: [TarjetaCreditoController],
  providers: [TarjetaCreditoService],
  exports: [TarjetaCreditoService],
})
export class TarjetaCreditoModule {}