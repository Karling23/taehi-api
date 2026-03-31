import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  nombreUsuario: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
