import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateIndicadorMesDto {
  @IsString()
  vehiculoId: string;

  @IsString()
  @MinLength(2)
  detalle: string;

  @IsNumber()
  @Min(0)
  mes: number;
}
