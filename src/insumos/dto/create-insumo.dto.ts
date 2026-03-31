import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateInsumoDto {
  @IsString()
  @MinLength(2)
  producto: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  costo: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorUnitario?: number;
}
