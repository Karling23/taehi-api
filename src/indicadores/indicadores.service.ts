import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { VehiculosService } from '../vehiculos/vehiculos.service';
import { CreateIndicadorMesDto } from './dto/create-indicador-mes.dto';
import { UpdateIndicadorMesDto } from './dto/update-indicador-mes.dto';
import { IndicadorMes } from './entities/indicador-mes.entity';

@Injectable()
export class IndicadoresService {
  constructor(
    @InjectRepository(IndicadorMes)
    private readonly indicadoresRepository: Repository<IndicadorMes>,
    private readonly vehiculosService: VehiculosService,
  ) {}

  async create(dto: CreateIndicadorMesDto) {
    await this.vehiculosService.findById(dto.vehiculoId);
    const indicador = this.indicadoresRepository.create(dto);
    return this.indicadoresRepository.save(indicador);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<IndicadorMes>> {
    const queryBuilder = this.indicadoresRepository
      .createQueryBuilder('indicador')
      .leftJoinAndSelect('indicador.vehiculo', 'vehiculo')
      .orderBy('vehiculo.codigo', 'ASC')
      .addOrderBy('indicador.detalle', 'ASC');

    return paginate<IndicadorMes>(queryBuilder, options);
  }

  async update(id: string, dto: UpdateIndicadorMesDto) {
    const indicador = await this.indicadoresRepository.findOne({ where: { id } });

    if (!indicador) {
      throw new NotFoundException('Indicador no encontrado');
    }

    if (dto.detalle) {
      indicador.detalle = dto.detalle.trim();
    }

    if (typeof dto.mes === 'number') {
      indicador.mes = dto.mes;
    }

    return this.indicadoresRepository.save(indicador);
  }

  async remove(id: string) {
    const indicador = await this.indicadoresRepository.findOne({ where: { id } });

    if (!indicador) {
      throw new NotFoundException('Indicador no encontrado');
    }

    await this.indicadoresRepository.remove(indicador);
  }
}
