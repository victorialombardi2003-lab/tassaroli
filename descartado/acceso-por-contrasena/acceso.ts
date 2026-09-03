/**
 * Puerta de la documentación.
 *
 * La verificación pasa entera en el servidor. El navegador nunca recibe la
 * contraseña ni la ruta de los archivos: lo único que viaja al cliente es
 * una cookie firmada que dice «esta sesión ya se validó, y vence tal día».
 *
 * Los PDF viven en `documentos/`, fuera de `public/`, así que nunca se
 * publican como archivos estáticos. La única forma de bajarlos es el
 * endpoint autenticado.
 */

export const COOKIE = 'ft_acceso';

/** Netlify inyecta las variables en tiempo de ejecución, no de build. */
function variable(nombre: string): string | undefined {
  const runtime = typeof process !== 'undefined' ? process.env?.[nombre] : undefined;
  return runtime ?? (import.meta.env as Record<string, string | undefined>)[nombre];
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
