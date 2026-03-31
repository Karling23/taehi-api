import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { GastoRuta } from './gastos/entities/gasto-ruta.entity';
import { GastosModule } from './gastos/gastos.module';
import { CostoMantenimiento } from './insumos/entities/costo-mantenimiento.entity';
import { Insumo } from './insumos/entities/insumo.entity';
import { InsumosModule } from './insumos/insumos.module';
import { IndicadorMes } from './indicadores/entities/indicador-mes.entity';
import { IndicadoresModule } from './indicadores/indicadores.module';
import { Ruta } from './rutas/entities/ruta.entity';
import { RutasModule } from './rutas/rutas.module';
import { Vehiculo } from './vehiculos/entities/vehiculo.entity';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { Viaje } from './viajes/entities/viaje.entity';
import { ViajesModule } from './viajes/viajes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'taehi_db',
      entities: [
        User,
        Vehiculo,
        Ruta,
        GastoRuta,
        Insumo,
        CostoMantenimiento,
        Viaje,
        IndicadorMes,
      ],
      synchronize: (process.env.DB_SYNC ?? 'true') === 'true',
      logging: false,
    }),
    AuthModule,
    UsersModule,
    VehiculosModule,
    RutasModule,
    GastosModule,
    InsumosModule,
    ViajesModule,
    IndicadoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
