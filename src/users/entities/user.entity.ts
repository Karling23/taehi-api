import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../common/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 80 })
  nombreUsuario: string;

  @Column({ unique: true, length: 120 })
  correo: string;

  @Column({ select: false })
  contrasenaHash: string;

  @Column({ type: 'enum', enum: Role, default: Role.USUARIO })
  role: Role;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
