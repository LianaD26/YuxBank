import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaService } from './cuenta.service';
import { CuentaController } from './cuenta.controller';
import { Cuenta } from './cuenta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuenta])],
  controllers: [CuentaController],
  providers: [CuentaService],
  exports: [CuentaService],
})
export class CuentaModule {}