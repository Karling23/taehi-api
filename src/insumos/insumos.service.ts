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

import { CreateCostoMantenimientoDto } from './dto/create-costo-mantenimiento.dto';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateCostoMantenimientoDto } from './dto/update-costo-mantenimiento.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { CostoMantenimiento } from './entities/costo-mantenimiento.entity';
import { Insumo } from './entities/insumo.entity';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumosRepository: Repository<Insumo>,
    @InjectRepository(CostoMantenimiento)
    private readonly costosRepository: Repository<CostoMantenimiento>,
  ) {}

  async createInsumo(dto: CreateInsumoDto) {
    const producto = dto.producto.toUpperCase().trim();
    const exists = await this.insumosRepository.findOne({ where: { producto } });

    if (exists) {
      throw new ConflictException('El insumo ya existe');
    }

    const insumo = this.insumosRepository.create({
      ...dto,
      producto,
      descripcion: dto.descripcion?.trim(),
    });

    return this.insumosRepository.save(insumo);
  }

  findAllInsumos(options: IPaginationOptions): Promise<Pagination<Insumo>> {
    const queryBuilder = this.insumosRepository
      .createQueryBuilder('insumo')
      .orderBy('insumo.producto', 'ASC');

    return paginate<Insumo>(queryBuilder, options);
  }

  async updateInsumo(id: string, dto: UpdateInsumoDto) {
    const insumo = await this.insumosRepository.findOne({ where: { id } });

    if (!insumo) {
      throw new NotFoundException('Insumo no encontrado');
    }

    if (dto.producto) {
      const producto = dto.producto.toUpperCase().trim();
      const exists = await this.insumosRepository.findOne({ where: { producto } });
      if (exists && exists.id !== id) {
        throw new ConflictException('El insumo ya existe');
      }
      insumo.producto = producto;
    }

    if (typeof dto.costo === 'number') {
      insumo.costo = dto.costo;
    }

    if (typeof dto.cantidad === 'number') {
      insumo.cantidad = dto.cantidad;
    }

    if (typeof dto.valorUnitario === 'number') {
      insumo.valorUnitario = dto.valorUnitario;
    }

    if (typeof dto.descripcion === 'string') {
      insumo.descripcion = dto.descripcion.trim();
    }

    return this.insumosRepository.save(insumo);
  }

  async removeInsumo(id: string) {
    const insumo = await this.insumosRepository.findOne({ where: { id } });
    if (!insumo) {
      throw new NotFoundException('Insumo no encontrado');
    }

    await this.insumosRepository.remove(insumo);
  }

  async createCostoMantenimiento(dto: CreateCostoMantenimientoDto) {
    const exists = await this.costosRepository.findOne({
      where: { tipoVehiculo: dto.tipoVehiculo },
    });

    if (exists) {
      throw new ConflictException('Ya existe costo de mantenimiento para este tipo');
    }

    const costo = this.costosRepository.create(dto);
    return this.costosRepository.save(costo);
  }

  findAllCostosMantenimiento(
    options: IPaginationOptions,
  ): Promise<Pagination<CostoMantenimiento>> {
    const queryBuilder = this.costosRepository
      .createQueryBuilder('costo')
      .orderBy('costo.tipoVehiculo', 'ASC');

    return paginate<CostoMantenimiento>(queryBuilder, options);
  }

  async findCostoMantenimientoByTipo(tipoVehiculo: CostoMantenimiento['tipoVehiculo']) {
    const costo = await this.costosRepository.findOne({ where: { tipoVehiculo } });
    if (!costo) {
      throw new NotFoundException('No hay costo de mantenimiento configurado para el tipo de vehículo');
    }
    return costo;
  }

  async updateCostoMantenimiento(id: string, dto: UpdateCostoMantenimientoDto) {
    const costo = await this.costosRepository.findOne({ where: { id } });

    if (!costo) {
      throw new NotFoundException('Costo de mantenimiento no encontrado');
    }

    costo.costoKm = dto.costoKm;

    return this.costosRepository.save(costo);
  }

  async removeCostoMantenimiento(id: string) {
    const costo = await this.costosRepository.findOne({ where: { id } });

    if (!costo) {
      throw new NotFoundException('Costo de mantenimiento no encontrado');
    }

    await this.costosRepository.remove(costo);
  }
}
