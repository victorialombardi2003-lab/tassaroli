import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

// Prueba el bundle real del adaptador con el proxy que no existe en astro dev.
process.env.ACCESO_PASSWORD = 'solo-para-prueba-local';
process.env.ACCESO_SECRET = randomBytes(32).toString('hex');
const { default: handler } = await import('../.vercel/output/functions/_render.func/dist/server/entry.mjs');
const server = createServer((req, res) => {
  req.headers.host = 'servidor-interno.invalid';
  req.headers['x-forwarded-host'] = 'tassaroli.vercel.app';
  req.headers['x-forwarded-proto'] = 'https';
  req.headers['x-forwarded-for'] = '127.0.0.1';
  handler(req, res).catch(error => { console.error(error); res.writeHead(500); res.end(); });
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  const origen = 'https://tassaroli.vercel.app';
  const post = (clave, origin = origen) => fetch(base + '/api/acceso', {
    method: 'POST', headers: { Origin: origin, Accept: 'application/json' },
    body: new URLSearchParams({ clave }), redirect: 'manual',
  });
  assert.equal((await post('incorrecta')).status, 401, 'El proxy debe permitir llegar a la validación de contraseña');
  assert.equal((await post(process.env.ACCESO_PASSWORD, 'https://otro.example')).status, 403, 'Mantener protección de origen');
  const ingreso = await post(process.env.ACCESO_PASSWORD);
  assert.equal(ingreso.status, 200);
  const cookie = ingreso.headers.get('set-cookie');
  assert.match(cookie, /Secure/i);
  const pagina = await fetch(base + '/documentacion');
  const html = await pagina.text();
  assert(!html.includes('drive.google.com'));
  const privado = await fetch(base + '/documentacion', { headers: { Cookie: cookie.split(';')[0] } });
  assert.match(await privado.text(), /drive\.google\.com/);
  const config = JSON.parse(readFileSync('.vercel/output/config.json', 'utf8'));
  assert(config.images?.sizes.length);
  let cantidad = 0;
  for (const contenido of [html, readFileSync('.vercel/output/static/index.html', 'utf8'), readFileSync('.vercel/output/static/proyecto/index.html', 'utf8')]) {
    for (const [, raw] of contenido.matchAll(/<img[^>]*src="([^"]+)"/g)) {
      const url = new URL(raw.replaceAll('&#38;', '&').replaceAll('&amp;', '&'), origen);
      assert.notEqual(url.pathname, '/_image', 'No usar el endpoint Sharp en Vercel');
      const archivo = url.pathname === '/_vercel/image' ? url.searchParams.get('url') : url.pathname;
      assert(existsSync('.vercel/output/static/' + archivo.replace(/^\//, '')), `Imagen incluida en despliegue: ${archivo}`);
      if (url.pathname === '/_vercel/image') assert(config.images.sizes.includes(Number(url.searchParams.get('w'))));
      cantidad++;
    }
  }
  console.log(`OK: ingreso tras proxy, rechazo de origen externo, sesión Secure, documentación privada y ${cantidad} imágenes con archivos y tamaños válidos.`);
} finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
