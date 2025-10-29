import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopeService } from './tope.service';
import { TopeController } from './tope.controller';
import { Tope } from './tope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tope])],
  controllers: [TopeController],
  providers: [TopeService],
  exports: [TopeService],
})
export class TopeModule {}