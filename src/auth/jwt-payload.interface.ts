import { Role } from '../common/enums/role.enum';

export interface JwtPayload {
  sub: string;
  nombreUsuario: string;
  correo: string;
  role: Role;
}
