import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateViajeDto {
  @IsOptional()
  @IsString()
  vehiculoId?: string;

  @IsOptional()
  @IsString()
  rutaId?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  guia?: string;

  @IsOptional()
  @IsString()
  producto?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ton?: number;
}
