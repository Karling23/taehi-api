import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TipoVehiculo } from '../../common/enums/tipo-vehiculo.enum';
import { IndicadorMes } from '../../indicadores/entities/indicador-mes.entity';
import { Viaje } from '../../viajes/entities/viaje.entity';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ type: 'enum', enum: TipoVehiculo })
  tipo: TipoVehiculo;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Viaje, (viaje) => viaje.vehiculo)
  viajes: Viaje[];

  @OneToMany(() => IndicadorMes, (indicador) => indicador.vehiculo)
  indicadores: IndicadorMes[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
