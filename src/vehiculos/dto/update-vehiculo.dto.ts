import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { TipoVehiculo } from '../../common/enums/tipo-vehiculo.enum';

export class UpdateVehiculoDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  codigo?: string;

  @IsOptional()
  @IsEnum(TipoVehiculo)
  tipo?: TipoVehiculo;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
