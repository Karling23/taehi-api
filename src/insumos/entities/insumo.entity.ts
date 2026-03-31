import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('insumos')
export class Insumo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 150 })
  producto: string;

  @Column({ nullable: true, length: 150 })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  costo: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  cantidad?: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  valorUnitario?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
