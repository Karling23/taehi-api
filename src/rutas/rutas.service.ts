import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { Ruta } from './entities/ruta.entity';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private readonly rutasRepository: Repository<Ruta>,
  ) {}

  async create(dto: CreateRutaDto) {
    const nombre = dto.nombre.toUpperCase().trim();
    const existing = await this.rutasRepository.findOne({ where: { nombre } });

    if (existing) {
      throw new ConflictException('La ruta ya existe');
    }

    const ruta = this.rutasRepository.create({
      ...dto,
      nombre,
      provincia: dto.provincia.toUpperCase().trim(),
    });

    return this.rutasRepository.save(ruta);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Ruta>> {
    const queryBuilder = this.rutasRepository
      .createQueryBuilder('ruta')
      .orderBy('ruta.nombre', 'ASC');

    return paginate<Ruta>(queryBuilder, options);
  }

  async findById(id: string) {
    const ruta = await this.rutasRepository.findOne({ where: { id } });
    if (!ruta) {
      throw new NotFoundException('Ruta no encontrada');
    }
    return ruta;
  }

  async update(id: string, dto: UpdateRutaDto) {
    const ruta = await this.findById(id);

    if (dto.nombre) {
      const nombre = dto.nombre.toUpperCase().trim();
      const existing = await this.rutasRepository.findOne({ where: { nombre } });
      if (existing && existing.id !== id) {
        throw new ConflictException('La ruta ya existe');
      }
      ruta.nombre = nombre;
    }

    if (typeof dto.km === 'number') {
      ruta.km = dto.km;
    }

    if (typeof dto.flete === 'number') {
      ruta.flete = dto.flete;
    }

    if (dto.provincia) {
      ruta.provincia = dto.provincia.toUpperCase().trim();
    }

    return this.rutasRepository.save(ruta);
  }

  async remove(id: string) {
    const ruta = await this.findById(id);
    await this.rutasRepository.remove(ruta);
  }
}
