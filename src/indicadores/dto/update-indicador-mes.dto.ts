import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateIndicadorMesDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  detalle?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mes?: number;
}
