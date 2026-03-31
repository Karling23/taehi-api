import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { TipoVehiculo } from '../common/enums/tipo-vehiculo.enum';
import { GastosService } from '../gastos/gastos.service';
import { InsumosService } from '../insumos/insumos.service';
import { RutasService } from '../rutas/rutas.service';
import { VehiculosService } from '../vehiculos/vehiculos.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Viaje } from './entities/viaje.entity';

const COMBUSTIBLE_COSTO = 2.76;
const VIATICO_DIARIO = 12;

const CALC_CONFIG: Record<
  TipoVehiculo,
  { kmGalonBase: number; peajesFactor: number; manteKmDefault: number }
> = {
  [TipoVehiculo.TRAILER]: {
    kmGalonBase: 6.5,
    peajesFactor: 6,
    manteKmDefault: 0.05585804444444444,
  },
  [TipoVehiculo.MINITRAILER]: {
    kmGalonBase: 8,
    peajesFactor: 5,
    manteKmDefault: 0.08308559599999998,
  },
  [TipoVehiculo.MULA]: {
    kmGalonBase: 8,
    peajesFactor: 3,
    manteKmDefault: 0.02263958333333333,
  },
};

@Injectable()
export class ViajesService {
  constructor(
    @InjectRepository(Viaje)
    private readonly viajesRepository: Repository<Viaje>,
    private readonly vehiculosService: VehiculosService,
    private readonly rutasService: RutasService,
    private readonly gastosService: GastosService,
    private readonly insumosService: InsumosService,
  ) {}

  async create(dto: CreateViajeDto) {
    const computed = await this.computeFields(dto);
    const viaje = this.viajesRepository.create({ ...dto, ...computed });
    return this.viajesRepository.save(viaje);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Viaje>> {
    const queryBuilder = this.viajesRepository
      .createQueryBuilder('viaje')
      .leftJoinAndSelect('viaje.vehiculo', 'vehiculo')
      .leftJoinAndSelect('viaje.ruta', 'ruta')
      .orderBy('viaje.fecha', 'DESC')
      .addOrderBy('viaje.createdAt', 'DESC');

    return paginate<Viaje>(queryBuilder, options);
  }

  async findById(id: string) {
    const viaje = await this.viajesRepository.findOne({
      where: { id },
      relations: { vehiculo: true, ruta: true },
    });

    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }

    return viaje;
  }

  async update(id: string, dto: UpdateViajeDto) {
    const viaje = await this.findById(id);

    const payload: CreateViajeDto = {
      vehiculoId: dto.vehiculoId ?? viaje.vehiculoId,
      rutaId: dto.rutaId ?? viaje.rutaId,
      fecha: dto.fecha ?? viaje.fecha,
      guia: dto.guia ?? viaje.guia,
      producto: dto.producto ?? viaje.producto,
      ton: dto.ton ?? Number(viaje.ton),
    };

    const computed = await this.computeFields(payload);

    Object.assign(viaje, payload, computed);

    return this.viajesRepository.save(viaje);
  }

  async remove(id: string) {
    const viaje = await this.findById(id);
    await this.viajesRepository.remove(viaje);
  }

  private async computeFields(dto: CreateViajeDto) {
    const vehiculo = await this.vehiculosService.findById(dto.vehiculoId);
    const ruta = await this.rutasService.findById(dto.rutaId);
    const config = CALC_CONFIG[vehiculo.tipo];
    const gastoRuta = await this.gastosService
      .findByRutaId(dto.rutaId)
      .catch(() => ({ peajes: 0, dias: 0 }));
    const costoMantenimiento = await this.insumosService
      .findCostoMantenimientoByTipo(vehiculo.tipo)
      .catch(() => null);

    const ton = dto.ton;
    const flete = Number(ruta.flete);
    const subtotal = ton * flete;
    const trip = Number(ruta.km);
    const roundTrip = trip * 2;
    const kmGls = roundTrip / config.kmGalonBase;
    const costo = kmGls * COMBUSTIBLE_COSTO;
    const manteKm = costoMantenimiento
      ? Number(costoMantenimiento.costoKm)
      : config.manteKmDefault;
    const mante = roundTrip * manteKm;
    const pasd = Number(gastoRuta.peajes);
    const peajes = pasd * config.peajesFactor;
    const tim = Number(gastoRuta.dias);
    const viaticos = tim * VIATICO_DIARIO;
    const utilidad = subtotal - costo - peajes - viaticos - mante;

    return {
      flete,
      subtotal,
      trip,
      roundTrip,
      kmGls,
      costo,
      mante,
      pasd,
      peajes,
      tim,
      viaticos,
      utilidad,
    };
  }
}
