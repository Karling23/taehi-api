import { existsSync } from 'node:fs';
import path from 'node:path';

import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

import { AppModule } from '../app.module';
import { GastoRuta } from '../gastos/entities/gasto-ruta.entity';
import { Insumo } from '../insumos/entities/insumo.entity';
import { Ruta } from '../rutas/entities/ruta.entity';

type RutaInput = {
  nombre: string;
  km: number;
  flete: number;
  provincia: string;
};

type GastoInput = {
  rutaNombre: string;
  peajes: number;
  dias: number;
};

type InsumoInput = {
  producto: string;
  descripcion?: string;
  costo: number;
  cantidad?: number;
  valorUnitario?: number;
};

const DEFAULT_EXCEL_PATH = path.resolve(process.cwd(), '..', 'CS-UE1058-2026.xlsx');

const roundTo = (value: number, scale: number): number => {
  const factor = 10 ** scale;
  return Math.round(value * factor) / factor;
};

const toCleanString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
};

const toUpper = (value: unknown): string => toCleanString(value).toUpperCase();

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;

  const normalized = String(value)
    .replace(/\$/g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '')
    .trim();

  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeKey = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/gi, '')
    .toUpperCase();

const RUTA_ALIASES: Record<string, string> = {
  FLABIOALFARO: 'FLAVIOALFARO',
  LACONCONDIA: 'LACONCORDIA',
  SANPEDRODEGUACA: 'SANPEDRODEHUACA',
};

const normalizeRutaKey = (value: string): string => {
  const normalized = normalizeKey(value);
  return RUTA_ALIASES[normalized] ?? normalized;
};

const parseRutas = (sheet: XLSX.WorkSheet): RutaInput[] => {
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
    header: 1,
    raw: true,
    defval: '',
  });

  const byName = new Map<string, RutaInput>();
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] ?? [];
    const nombre = toUpper(row[0]);
    const km = toNumber(row[1]);
    const flete = toNumber(row[2]);
    const provincia = toUpper(row[3]);

    if (!nombre || km === null || flete === null || !provincia) continue;
    byName.set(nombre, {
      nombre,
      km: roundTo(km, 2),
      flete: roundTo(flete, 4),
      provincia,
    });
  }

  return [...byName.values()];
};

const parseGastos = (sheet: XLSX.WorkSheet): GastoInput[] => {
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
    header: 1,
    raw: true,
    defval: '',
  });

  const byRuta = new Map<string, GastoInput>();
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] ?? [];
    const rutaNombre = toUpper(row[0]);
    const peajes = toNumber(row[1]);
    const dias = toNumber(row[2]);

    if (!rutaNombre || peajes === null || dias === null) continue;
    byRuta.set(rutaNombre, {
      rutaNombre,
      peajes: roundTo(peajes, 2),
      dias: roundTo(dias, 2),
    });
  }

  return [...byRuta.values()];
};

const parseInsumos = (sheet: XLSX.WorkSheet): InsumoInput[] => {
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
    header: 1,
    raw: true,
    defval: '',
  });

  const items: InsumoInput[] = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] ?? [];
    const producto = toUpper(row[0]);
    const descripcion = toCleanString(row[1]);
    const costo = toNumber(row[2]);
    const cantidad = toNumber(row[3]);
    const valorUnitario = toNumber(row[4]);

    if (!producto) {
      if (items.length > 0) break;
      continue;
    }

    if (costo === null) continue;

    items.push({
      producto,
      descripcion: descripcion || undefined,
      costo: roundTo(costo, 4),
      cantidad: cantidad === null ? undefined : roundTo(cantidad, 4),
      valorUnitario: valorUnitario === null ? undefined : roundTo(valorUnitario, 4),
    });
  }

  return items;
};

async function run(): Promise<void> {
  const excelPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : DEFAULT_EXCEL_PATH;

  if (!existsSync(excelPath)) {
    throw new Error(`No se encontro el archivo Excel: ${excelPath}`);
  }

  const workbook = XLSX.readFile(excelPath, { cellDates: false });
  const rutasSheet = workbook.Sheets.RUTAS;
  const gastosSheet = workbook.Sheets.GASTOS;
  const insuSheet = workbook.Sheets.INSU;

  if (!rutasSheet || !gastosSheet || !insuSheet) {
    throw new Error('El Excel debe incluir las hojas RUTAS, GASTOS e INSU');
  }

  const rutasInput = parseRutas(rutasSheet);
  const gastosInput = parseGastos(gastosSheet);
  const insumosInput = parseInsumos(insuSheet);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const rutasRepo = app.get<Repository<Ruta>>(getRepositoryToken(Ruta));
    const gastosRepo = app.get<Repository<GastoRuta>>(getRepositoryToken(GastoRuta));
    const insumosRepo = app.get<Repository<Insumo>>(getRepositoryToken(Insumo));

    let rutasCreated = 0;
    let rutasUpdated = 0;
    let gastosCreated = 0;
    let gastosUpdated = 0;
    let insumosCreated = 0;
    let insumosUpdated = 0;

    for (const row of rutasInput) {
      const existing = await rutasRepo.findOne({ where: { nombre: row.nombre } });
      if (!existing) {
        await rutasRepo.save(rutasRepo.create(row));
        rutasCreated += 1;
        continue;
      }

      const changed =
        roundTo(Number(existing.km), 2) !== row.km ||
        roundTo(Number(existing.flete), 4) !== row.flete ||
        existing.provincia !== row.provincia;

      if (changed) {
        existing.km = row.km;
        existing.flete = row.flete;
        existing.provincia = row.provincia;
        await rutasRepo.save(existing);
        rutasUpdated += 1;
      }
    }

    const rutas = await rutasRepo.find();
    const rutaByNormalizedName = new Map<string, Ruta>();
    for (const ruta of rutas) {
      rutaByNormalizedName.set(normalizeRutaKey(ruta.nombre), ruta);
    }

    const gastosSinRuta: string[] = [];
    for (const row of gastosInput) {
      const ruta = rutaByNormalizedName.get(normalizeRutaKey(row.rutaNombre));
      if (!ruta) {
        gastosSinRuta.push(row.rutaNombre);
        continue;
      }

      const existing = await gastosRepo.findOne({ where: { rutaId: ruta.id } });
      if (!existing) {
        await gastosRepo.save(
          gastosRepo.create({
            rutaId: ruta.id,
            peajes: row.peajes,
            dias: row.dias,
          }),
        );
        gastosCreated += 1;
        continue;
      }

      const changed =
        roundTo(Number(existing.peajes), 2) !== row.peajes ||
        roundTo(Number(existing.dias), 2) !== row.dias;
      if (changed) {
        existing.peajes = row.peajes;
        existing.dias = row.dias;
        await gastosRepo.save(existing);
        gastosUpdated += 1;
      }
    }

    for (const row of insumosInput) {
      const existing = await insumosRepo.findOne({ where: { producto: row.producto } });
      if (!existing) {
        await insumosRepo.save(insumosRepo.create(row));
        insumosCreated += 1;
        continue;
      }

      const changed =
        roundTo(Number(existing.costo), 4) !== row.costo ||
        roundTo(Number(existing.cantidad ?? 0), 4) !==
          roundTo(Number(row.cantidad ?? 0), 4) ||
        roundTo(Number(existing.valorUnitario ?? 0), 4) !==
          roundTo(Number(row.valorUnitario ?? 0), 4) ||
        (existing.descripcion ?? '') !== (row.descripcion ?? '');

      if (changed) {
        existing.costo = row.costo;
        existing.cantidad = row.cantidad;
        existing.valorUnitario = row.valorUnitario;
        existing.descripcion = row.descripcion;
        await insumosRepo.save(existing);
        insumosUpdated += 1;
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Importacion completada desde: ${excelPath}`);
    // eslint-disable-next-line no-console
    console.log(
      `Rutas -> creadas: ${rutasCreated}, actualizadas: ${rutasUpdated}, total leidas: ${rutasInput.length}`,
    );
    // eslint-disable-next-line no-console
    console.log(
      `Gastos -> creados: ${gastosCreated}, actualizados: ${gastosUpdated}, total leidos: ${gastosInput.length}`,
    );
    if (gastosSinRuta.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `Gastos omitidos por ruta no encontrada (${gastosSinRuta.length}): ${gastosSinRuta
          .slice(0, 20)
          .join(', ')}${gastosSinRuta.length > 20 ? ', ...' : ''}`,
      );
    }
    // eslint-disable-next-line no-console
    console.log(
      `Insumos -> creados: ${insumosCreated}, actualizados: ${insumosUpdated}, total leidos: ${insumosInput.length}`,
    );
  } finally {
    await app.close();
  }
}

run().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Error al importar Excel:', error);
  process.exit(1);
});
