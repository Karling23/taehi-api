import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateInsumoDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  producto?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorUnitario?: number;
}
