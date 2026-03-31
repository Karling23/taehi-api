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

import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculosRepository: Repository<Vehiculo>,
  ) {}

  async create(dto: CreateVehiculoDto) {
    const codigo = dto.codigo.toUpperCase().trim();
    const existing = await this.vehiculosRepository.findOne({ where: { codigo } });

    if (existing) {
      throw new ConflictException('Ya existe un vehículo con ese código');
    }

    const vehiculo = this.vehiculosRepository.create({
      codigo,
      tipo: dto.tipo,
    });

    return this.vehiculosRepository.save(vehiculo);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Vehiculo>> {
    const queryBuilder = this.vehiculosRepository
      .createQueryBuilder('vehiculo')
      .orderBy('vehiculo.codigo', 'ASC');

    return paginate<Vehiculo>(queryBuilder, options);
  }

  async findById(id: string) {
    const vehiculo = await this.vehiculosRepository.findOne({ where: { id } });
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return vehiculo;
  }

  async update(id: string, dto: UpdateVehiculoDto) {
    const vehiculo = await this.findById(id);

    if (dto.codigo) {
      const codigo = dto.codigo.toUpperCase().trim();
      const existing = await this.vehiculosRepository.findOne({ where: { codigo } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un vehículo con ese código');
      }
      vehiculo.codigo = codigo;
    }

    if (dto.tipo) {
      vehiculo.tipo = dto.tipo;
    }

    if (typeof dto.activo === 'boolean') {
      vehiculo.activo = dto.activo;
    }

    return this.vehiculosRepository.save(vehiculo);
  }

  async remove(id: string) {
    const vehiculo = await this.findById(id);
    await this.vehiculosRepository.remove(vehiculo);
  }
}
