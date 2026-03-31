import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GastosModule } from '../gastos/gastos.module';
import { InsumosModule } from '../insumos/insumos.module';
import { RutasModule } from '../rutas/rutas.module';
import { VehiculosModule } from '../vehiculos/vehiculos.module';
import { ViajesController } from './viajes.controller';
import { Viaje } from './entities/viaje.entity';
import { ViajesService } from './viajes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Viaje]),
    VehiculosModule,
    RutasModule,
    GastosModule,
    InsumosModule,
  ],
  controllers: [ViajesController],
  providers: [ViajesService],
  exports: [ViajesService],
})
export class ViajesModule {}
