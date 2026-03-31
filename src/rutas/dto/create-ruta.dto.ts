import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateRutaDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsNumber()
  @Min(0)
  km: number;

  @IsNumber()
  @Min(0)
  flete: number;

  @IsString()
  @MinLength(3)
  provincia: string;
}
