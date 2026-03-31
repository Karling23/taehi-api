import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Role } from '../common/enums/role.enum';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      ...dto,
      role: Role.USUARIO,
    });

    return this.buildAuthResponse(user.id, user.nombreUsuario, user.correo, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByLogin(dto.login);

    if (!user || !user.contrasenaHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordOk = await bcrypt.compare(dto.contrasena, user.contrasenaHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return this.buildAuthResponse(user.id, user.nombreUsuario, user.correo, user.role);
  }

  private buildAuthResponse(
    id: string,
    nombreUsuario: string,
    correo: string,
    role: Role,
  ) {
    const payload = {
      sub: id,
      nombreUsuario,
      correo,
      role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id,
        nombreUsuario,
        correo,
        role,
      },
    };
  }
}
