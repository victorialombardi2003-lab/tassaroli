import type { APIRoute } from 'astro';
import { COOKIE, claveCorrecta, configurado, emitirCookie, opcionesCookie } from '../../lib/acceso';

export const prerender = false;
// Límite por instancia; en un despliegue distribuido complementar con el firewall.
const intentos = new Map<string, { cantidad: number; vence: number }>();

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  const json = request.headers.get('accept')?.includes('application/json');
  const responder = (estado: number, error?: string) => json
    ? new Response(JSON.stringify({ ok: estado === 200, error }), {
        status: estado, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      })
    : redirect(`/documentacion${error ? `?error=${error}` : ''}#documentacion-acceso`, 303);

  if (request.headers.get('origin') !== new URL(request.url).origin) return responder(403, 'origen');
  if (!configurado()) return responder(503, 'config');
  if (Number(request.headers.get('content-length')) > 4096) return responder(413, 'clave');

  const ahora = Date.now();
  for (const [ip, intento] of intentos) if (intento.vence <= ahora) intentos.delete(ip);
  const ip = clientAddress;
  const intento = intentos.get(ip) ?? { cantidad: 0, vence: ahora + 15 * 60_000 };
  if (intento.cantidad >= 8) return responder(429, 'limite');
  intento.cantidad++;
  intentos.set(ip, intento);

  let datos: FormData;
  try { datos = await request.formData(); } catch { return responder(400, 'clave'); }
  const clave = datos.get('clave');
  if (typeof clave !== 'string' || clave.length > 256 || !(await claveCorrecta(clave))) {
    return responder(401, 'clave');
  }
  intentos.delete(ip);
  const { valor, maxAge } = await emitirCookie();
  cookies.set(COOKIE, valor, { ...opcionesCookie, maxAge });
  return responder(200);
};
