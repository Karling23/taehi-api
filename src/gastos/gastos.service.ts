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

import { RutasService } from '../rutas/rutas.service';
import { CreateGastoRutaDto } from './dto/create-gasto-ruta.dto';
import { UpdateGastoRutaDto } from './dto/update-gasto-ruta.dto';
import { GastoRuta } from './entities/gasto-ruta.entity';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(GastoRuta)
    private readonly gastosRepository: Repository<GastoRuta>,
    private readonly rutasService: RutasService,
  ) {}

  async create(dto: CreateGastoRutaDto) {
    await this.rutasService.findById(dto.rutaId);

    const existing = await this.gastosRepository.findOne({ where: { rutaId: dto.rutaId } });
    if (existing) {
      throw new ConflictException('Ya existe gasto para esa ruta');
    }

    const gasto = this.gastosRepository.create(dto);
    return this.gastosRepository.save(gasto);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<GastoRuta>> {
    const queryBuilder = this.gastosRepository
      .createQueryBuilder('gasto')
      .leftJoinAndSelect('gasto.ruta', 'ruta')
      .orderBy('ruta.nombre', 'ASC');

    return paginate<GastoRuta>(queryBuilder, options);
  }

  async findByRutaId(rutaId: string) {
    const gasto = await this.gastosRepository.findOne({
      where: { rutaId },
      relations: { ruta: true },
    });

    if (!gasto) {
      throw new NotFoundException('No hay gastos configurados para esta ruta');
    }

    return gasto;
  }

  async update(id: string, dto: UpdateGastoRutaDto) {
    const gasto = await this.gastosRepository.findOne({ where: { id } });
    if (!gasto) {
      throw new NotFoundException('Gasto de ruta no encontrado');
    }

    if (typeof dto.peajes === 'number') {
      gasto.peajes = dto.peajes;
    }

    if (typeof dto.dias === 'number') {
      gasto.dias = dto.dias;
    }

    return this.gastosRepository.save(gasto);
  }

  async remove(id: string) {
    const gasto = await this.gastosRepository.findOne({ where: { id } });
    if (!gasto) {
      throw new NotFoundException('Gasto de ruta no encontrado');
    }

    await this.gastosRepository.remove(gasto);
  }
}
