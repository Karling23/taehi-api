import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { GastoRuta } from '../../gastos/entities/gasto-ruta.entity';

@Entity('rutas')
export class Ruta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 150 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  km: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  flete: number;

  @Column({ length: 120 })
  provincia: string;

  @OneToOne(() => GastoRuta, (gastoRuta) => gastoRuta.ruta)
  gastoRuta: GastoRuta;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
