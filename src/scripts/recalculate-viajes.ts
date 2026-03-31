import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { AppModule } from '../app.module';
import { Viaje } from '../viajes/entities/viaje.entity';
import { ViajesService } from '../viajes/viajes.service';

async function run(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const viajesRepo = app.get<Repository<Viaje>>(getRepositoryToken(Viaje));
    const viajesService = app.get(ViajesService);

    const viajes = await viajesRepo.find();
    let updated = 0;

    for (const viaje of viajes) {
      await viajesService.update(viaje.id, {
        vehiculoId: viaje.vehiculoId,
        rutaId: viaje.rutaId,
        fecha: viaje.fecha,
        guia: viaje.guia ?? undefined,
        producto: viaje.producto ?? undefined,
        ton: Number(viaje.ton),
      });
      updated += 1;
    }

    // eslint-disable-next-line no-console
    console.log(`Viajes recalculados: ${updated}`);
  } finally {
    await app.close();
  }
}

run().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Error al recalcular viajes:', error);
  process.exit(1);
});
