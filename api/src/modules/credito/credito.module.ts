import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditoService } from './credito.service';
import { CreditoController } from './credito.controller';
import { Credito } from './credito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Credito])],
  controllers: [CreditoController],
  providers: [CreditoService],
  exports: [CreditoService],
})
export class CreditoModule {}