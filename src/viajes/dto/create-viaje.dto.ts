import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateViajeDto {
  @IsString()
  vehiculoId: string;

  @IsString()
  rutaId: string;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  guia?: string;

  @IsOptional()
  @IsString()
  producto?: string;

  @IsNumber()
  @Min(0)
  ton: number;
}
