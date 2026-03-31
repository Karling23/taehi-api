import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TipoVehiculo } from '../../common/enums/tipo-vehiculo.enum';

@Entity('costos_mantenimiento')
export class CostoMantenimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TipoVehiculo, unique: true })
  tipoVehiculo: TipoVehiculo;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  costoKm: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
