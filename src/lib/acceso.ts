/** Contraseña validada en servidor y sesión firmada de duración limitada. */

export const COOKIE = 'ft_acceso';

/** Variables privadas disponibles únicamente en el servidor. */
function variable(nombre: string): string | undefined {
  const runtime = typeof process !== 'undefined' ? process.env?.[nombre] : undefined;
  return runtime ?? (import.meta.env as Record<string, string | undefined>)[nombre];
}

/**
 * Los enlaces de Drive, que tampoco viven en el repositorio.
 *
 * El repositorio es público. Mientras los PDF estuvieron encriptados eso no
 * importaba —el enlace solo no abría nada—, pero sin la contraseña del PDF el
 * enlace ES el documento: quien lo tenga, lo baja sin pasar por esta puerta.
 * Dejarlos en contenido.ts sería poner la llave abajo del felpudo.
 *
 * Van en ACCESO_ENLACES, un JSON de slug a URL, al lado de ACCESO_PASSWORD.
 * Se leen sólo en el servidor y sólo se escriben en la página cuando la
 * cookie es válida.
 *
 * Si falta o está mal escrito devuelve vacío en vez de reventar: una variable
 * mal pegada no puede tirar abajo la página entera.
 */
export function enlaces(): Record<string, string> {
  const crudo = variable('ACCESO_ENLACES');
  if (!crudo) return {};
  try {
    const datos: unknown = JSON.parse(crudo);
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return {};
    return Object.fromEntries(
      Object.entries(datos as Record<string, unknown>).filter(
        (par): par is [string, string] => typeof par[1] === 'string' && par[1].length > 0,
      ),
    );
  } catch {
    return {};
  }
}

export function configurado(): boolean {
  return Boolean(variable('ACCESO_PASSWORD') && variable('ACCESO_SECRET'));
}

function horasValidas(): number {
  const crudo = Number(variable('ACCESO_HORAS'));
  return Number.isFinite(crudo) && crudo > 0 ? crudo : 12;
}

const codificador = new TextEncoder();

async function hmac(mensaje: string, secreto: string): Promise<string> {
  const clave = await crypto.subtle.importKey(
    'raw',
    codificador.encode(secreto),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const firma = await crypto.subtle.sign('HMAC', clave, codificador.encode(mensaje));
  return [...new Uint8Array(firma)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Comparación de tiempo constante: no filtra cuántos caracteres acertó. */
function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

export async function claveCorrecta(intento: string): Promise<boolean> {
  const esperada = variable('ACCESO_PASSWORD');
  if (!esperada) return false;
  // Se comparan los digest, no los textos: así la comparación es de largo
  // fijo aunque los dos strings midan distinto.
  const secreto = variable('ACCESO_SECRET') ?? esperada;
  const [a, b] = await Promise.all([hmac(intento, secreto), hmac(esperada, secreto)]);
  return iguales(a, b);
}

export async function emitirCookie(): Promise<{ valor: string; maxAge: number }> {
  const secreto = variable('ACCESO_SECRET');
  if (!secreto) throw new Error('ACCESO_SECRET sin configurar');
  const maxAge = Math.round(horasValidas() * 3600);
  const vence = Date.now() + maxAge * 1000;
  const firma = await hmac(String(vence), secreto);
  return { valor: `${vence}.${firma}`, maxAge };
}

export async function cookieValida(valor: string | undefined): Promise<boolean> {
  if (!valor) return false;
  const secreto = variable('ACCESO_SECRET');
  if (!secreto) return false;

  const corte = valor.lastIndexOf('.');
  if (corte < 1) return false;

  const vence = Number(valor.slice(0, corte));
  const firma = valor.slice(corte + 1);
  if (!Number.isFinite(vence) || vence < Date.now()) return false;

  return iguales(firma, await hmac(String(vence), secreto));
}

export const opcionesCookie = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: import.meta.env.PROD,
} as const;
