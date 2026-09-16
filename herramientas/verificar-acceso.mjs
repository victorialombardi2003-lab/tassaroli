import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const origen = process.env.TEST_ORIGIN ?? 'http://127.0.0.1:4321';
const clave = process.env.ACCESO_PASSWORD ?? readFileSync('.env.local', 'utf8').match(/^ACCESO_PASSWORD=(.*)$/m)?.[1];
assert(clave, 'Configurar ACCESO_PASSWORD para ejecutar la prueba.');
const post = (valor, opciones = {}) => fetch(`${origen}/api/acceso`, {
  method: 'POST', redirect: 'manual',
  headers: { Origin: origen, Accept: 'application/json', ...opciones },
  body: new URLSearchParams({ clave: valor }),
});
const pagina = await fetch(`${origen}/documentacion`);
assert.equal(pagina.status, 200);
assert.match(pagina.headers.get('cache-control'), /no-store/);
const publico = await pagina.text();
assert(!publico.includes('drive.google.com'), 'Los enlaces no deben enviarse sin sesión.');
assert(!publico.includes(clave), 'La clave no debe enviarse al navegador.');
assert.equal((await post('clave-incorrecta-de-prueba')).status, 401);
assert.equal((await post(clave, { Origin: 'https://otro-sitio.example' })).status, 403);
const ingreso = await post(clave);
assert.equal(ingreso.status, 200);
const cookie = ingreso.headers.get('set-cookie');
assert.match(cookie, /HttpOnly/i);
assert.match(cookie, /SameSite=Lax/i);
const sesion = cookie.split(';')[0];
const privado = await fetch(`${origen}/documentacion`, { headers: { Cookie: sesion } });
assert.match(await privado.text(), /drive\.google\.com/);
const falsa = await fetch(`${origen}/documentacion`, { headers: { Cookie: `${sesion}alterada` } });
assert(!(await falsa.text()).includes('drive.google.com'), 'Rechazar firmas adulteradas.');
const sinJS = await post(clave, { Accept: 'text/html' });
assert.equal(sinJS.status, 303);
assert.match(sinJS.headers.get('location'), /#documentacion-acceso$/);
const salida = await fetch(`${origen}/api/salir`, {
  method: 'POST', redirect: 'manual', headers: { Origin: origen, Cookie: sesion },
});
assert.equal(salida.status, 303);
assert.match(salida.headers.get('set-cookie'), /Max-Age=0|Expires=Thu, 01 Jan 1970/i);
console.log('OK: página privada, clave incorrecta/correcta, origen, cookie firmada, formulario sin JS y cierre.');
