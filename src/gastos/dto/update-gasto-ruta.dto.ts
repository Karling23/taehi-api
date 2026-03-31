import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateGastoRutaDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  peajes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dias?: number;
}
