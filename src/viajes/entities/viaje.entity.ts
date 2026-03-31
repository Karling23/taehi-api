import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Ruta } from '../../rutas/entities/ruta.entity';
import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity';

@Entity('viajes')
export class Viaje {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehiculoId: string;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.viajes, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehiculoId' })
  vehiculo: Vehiculo;

  @Column()
  rutaId: string;

  @ManyToOne(() => Ruta, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'rutaId' })
  ruta: Ruta;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ length: 60, nullable: true })
  guia?: string;

  @Column({ length: 120, nullable: true })
  producto?: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  ton: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  flete: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  trip: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  roundTrip: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  kmGls: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  costo: number;

  @Column({ type: 'decimal', precision: 12, scale: 6 })
  mante: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  pasd: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  peajes: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  tim: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  viaticos: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  utilidad: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
