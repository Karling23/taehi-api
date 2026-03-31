import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RutasModule } from '../rutas/rutas.module';
import { GastosController } from './gastos.controller';
import { GastosService } from './gastos.service';
import { GastoRuta } from './entities/gasto-ruta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GastoRuta]), RutasModule],
  controllers: [GastosController],
  providers: [GastosService],
  exports: [GastosService],
})
export class GastosModule {}
