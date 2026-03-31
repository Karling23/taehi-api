import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehiculosModule } from '../vehiculos/vehiculos.module';
import { IndicadoresController } from './indicadores.controller';
import { IndicadoresService } from './indicadores.service';
import { IndicadorMes } from './entities/indicador-mes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndicadorMes]), VehiculosModule],
  controllers: [IndicadoresController],
  providers: [IndicadoresService],
})
export class IndicadoresModule {}
