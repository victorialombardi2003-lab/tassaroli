import fs from 'node:fs';
import path from 'node:path';
import { documentos, planos } from '../data/contenido';

/** Pesa un archivo del anteproyecto, si ya fue cargado en `documentos/`. */
export function peso(archivo: string): string | null {
  let bytes: number;
  try {
    bytes = fs.statSync(path.join(process.cwd(), 'documentos', archivo)).size;
  } catch {
    return null;
  }
  const mega = 1048576;
  if (bytes >= mega) {
    return (bytes / mega).toFixed(1) + ' MB';
  }
  return Math.max(1, Math.round(bytes / 1024)) + ' KB';
}

export type Fila = {
  slug: string;
  titulo: string;
  peso: string | null;
};

export type FilaInforme = Fila & { lema: string; bajada: string };

export function informes(): FilaInforme[] {
  return documentos.map((d) => ({
    slug: d.slug,
    titulo: d.titulo,
    lema: d.lema,
    bajada: d.bajada,
    peso: peso(d.archivo),
  }));
}

export function laminas(): Fila[] {
  return planos.laminas.map((l) => ({
    slug: l.slug,
    titulo: l.titulo,
    peso: peso(l.archivo),
  }));
}
