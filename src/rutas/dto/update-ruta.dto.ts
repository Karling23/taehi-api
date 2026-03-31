import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateRutaDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  nombre?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  km?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  flete?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  provincia?: string;
}
