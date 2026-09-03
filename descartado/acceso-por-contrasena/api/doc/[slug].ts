import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { COOKIE, cookieValida } from '../../../lib/acceso';
import { archivos } from '../../../data/contenido';

export const prerender = false;

/**
 * Entrega un archivo del anteproyecto, y sólo si la sesión está validada.
 *
 * El `slug` nunca toca el sistema de archivos: se usa como clave de una
 * tabla fija. Un slug inventado no encuentra entrada y termina en 404, así
 * que no hay forma de escapar de la carpeta.
 */
export const GET: APIRoute = async ({ params, cookies }) => {
  if (!(await cookieValida(cookies.get(COOKIE)?.value))) {
    return new Response('Acceso restringido.', {
      status: 401,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const entrada = params.slug ? archivos[params.slug] : undefined;
  if (!entrada) {
    return new Response('Documento inexistente.', { status: 404 });
  }

  const ruta = path.join(process.cwd(), 'documentos', entrada.archivo);
  if (!fs.existsSync(ruta)) {
    return new Response('El documento todavía no fue cargado.', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const contenido = fs.readFileSync(ruta);
  const nombre = encodeURIComponent(`${entrada.titulo}.pdf`);

  return new Response(new Uint8Array(contenido), {
    headers: {
      'content-type': 'application/pdf',
      'content-length': String(contenido.length),
      'content-disposition': `attachment; filename*=UTF-8''${nombre}`,
      // Nunca cachear en intermediarios: el archivo es privado.
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
    },
  });
};
