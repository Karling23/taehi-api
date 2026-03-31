import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Ruta } from '../../rutas/entities/ruta.entity';

@Entity('gastos_ruta')
export class GastoRuta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  rutaId: string;

  @OneToOne(() => Ruta, (ruta) => ruta.gastoRuta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rutaId' })
  ruta: Ruta;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  peajes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  dias: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
