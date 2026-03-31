import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity';

@Entity('indicadores_mes')
export class IndicadorMes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehiculoId: string;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.indicadores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehiculoId' })
  vehiculo: Vehiculo;

  @Column({ length: 120 })
  detalle: string;

  @Column({ type: 'decimal', precision: 12, scale: 6 })
  mes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
