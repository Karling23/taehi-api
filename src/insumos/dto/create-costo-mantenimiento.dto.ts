import { IsEnum, IsNumber, Min } from 'class-validator';

import { TipoVehiculo } from '../../common/enums/tipo-vehiculo.enum';

export class CreateCostoMantenimientoDto {
  @IsEnum(TipoVehiculo)
  tipoVehiculo: TipoVehiculo;

  @IsNumber()
  @Min(0)
  costoKm: number;
}
