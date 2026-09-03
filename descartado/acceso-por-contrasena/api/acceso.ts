import type { APIRoute } from 'astro';
import { COOKIE, claveCorrecta, configurado, emitirCookie, opcionesCookie } from '../../lib/acceso';

export const prerender = false;

/** Entrar: valida la clave y deja la cookie firmada. */
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!configurado()) {
    return redirect('/documentacion?error=config', 303);
  }

  const datos = await request.formData();
  const clave = String(datos.get('clave') ?? '');

  if (!(await claveCorrecta(clave))) {
    // Freno artificial: no es rate limiting real (una función sin estado no
    // puede llevar la cuenta), pero encarece el intento por fuerza bruta.
    await new Promise((r) => setTimeout(r, 700));
    return redirect('/documentacion?error=clave', 303);
  }

  const { valor, maxAge } = await emitirCookie();
  cookies.set(COOKIE, valor, { ...opcionesCookie, maxAge });

  return redirect('/documentacion', 303);
};

/** Salir: borra la cookie. */
export const DELETE: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(COOKIE, { path: '/' });
  return redirect('/documentacion', 303);
};
