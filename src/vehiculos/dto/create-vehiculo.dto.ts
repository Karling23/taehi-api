import { IsEnum, IsString, MinLength } from 'class-validator';

import { TipoVehiculo } from '../../common/enums/tipo-vehiculo.enum';

export class CreateVehiculoDto {
  @IsString()
  @MinLength(3)
  codigo: string;

  @IsEnum(TipoVehiculo)
  tipo: TipoVehiculo;
}
