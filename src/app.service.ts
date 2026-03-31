import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome() {
    return {
      message: 'API TAEHI backend activa',
      docsHint: 'Usa el prefijo /api para los endpoints de negocio',
    };
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'taehi-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
