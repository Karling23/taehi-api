import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CostoMantenimiento } from './entities/costo-mantenimiento.entity';
import { Insumo } from './entities/insumo.entity';
import { InsumosController } from './insumos.controller';
import { InsumosService } from './insumos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Insumo, CostoMantenimiento])],
  controllers: [InsumosController],
  providers: [InsumosService],
  exports: [InsumosService],
})
export class InsumosModule {}
