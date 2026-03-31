import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const nombreUsuario = dto.nombreUsuario.toLowerCase().trim();
    const correo = dto.correo.toLowerCase().trim();

    await this.ensureUniqueFields(nombreUsuario, correo);

    const contrasenaHash = await bcrypt.hash(dto.contrasena, 10);

    const user = this.usersRepository.create({
      nombreUsuario,
      correo,
      contrasenaHash,
      role: dto.role,
    });

    return this.usersRepository.save(user);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC');

    return paginate<User>(queryBuilder, options);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.contrasenaHash')
      .where('LOWER(user.nombreUsuario) = LOWER(:login)', { login })
      .orWhere('LOWER(user.correo) = LOWER(:login)', { login })
      .getOne();
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    const newUsername = dto.nombreUsuario?.toLowerCase().trim();
    const newCorreo = dto.correo?.toLowerCase().trim();

    if (
      (newUsername && newUsername !== user.nombreUsuario) ||
      (newCorreo && newCorreo !== user.correo)
    ) {
      await this.ensureUniqueFields(
        newUsername ?? user.nombreUsuario,
        newCorreo ?? user.correo,
        id,
      );
    }

    if (newUsername) {
      user.nombreUsuario = newUsername;
    }

    if (newCorreo) {
      user.correo = newCorreo;
    }

    if (dto.role) {
      user.role = dto.role;
    }

    if (typeof dto.activo === 'boolean') {
      user.activo = dto.activo;
    }

    if (dto.contrasena) {
      user.contrasenaHash = await bcrypt.hash(dto.contrasena, 10);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  private async ensureUniqueFields(
    nombreUsuario: string,
    correo: string,
    excludeId?: string,
  ): Promise<void> {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.nombreUsuario) = LOWER(:nombreUsuario)', {
        nombreUsuario,
      })
      .orWhere('LOWER(user.correo) = LOWER(:correo)', { correo });

    if (excludeId) {
      qb.andWhere('user.id != :excludeId', { excludeId });
    }

    const existing = await qb.getOne();

    if (existing) {
      throw new ConflictException('El nombre de usuario o correo ya existe');
    }
  }
}
