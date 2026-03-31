import { IsNumber, IsString, Min } from 'class-validator';

export class CreateGastoRutaDto {
  @IsString()
  rutaId: string;

  @IsNumber()
  @Min(0)
  peajes: number;

  @IsNumber()
  @Min(0)
  dias: number;
}
