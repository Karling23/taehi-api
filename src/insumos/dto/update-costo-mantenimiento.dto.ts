import { IsNumber, Min } from 'class-validator';

export class UpdateCostoMantenimientoDto {
  @IsNumber()
  @Min(0)
  costoKm: number;
}
