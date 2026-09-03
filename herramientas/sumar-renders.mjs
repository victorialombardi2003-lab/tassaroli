/**
 * Suma renders sueltos al sitio.
 *
 * El estudio manda las vistas de un espacio numeradas: `esp-aulas 1.png`,
 * `esp-aulas 2.png`… Este script las toma de la raíz del proyecto, guarda el
 * original intacto en `renders-originales/`, escribe la versión web en
 * `src/assets/renders/` y deja anotada la lista completa en `contenido.ts`
 * para que el espacio se arme como carrusel.
 *
 * Se puede correr las veces que haga falta: siempre reescribe la lista con
 * lo que hay en disco, así que sumar una vista más es volver a correrlo.
 *
 *   node herramientas/sumar-renders.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = process.cwd();
const DESTINO = 'src/assets/renders';
const ORIGINALES = 'renders-originales';
const CONTENIDO = 'src/data/contenido.ts';

/* Los renders del estudio vienen a 1537px de ancho. El tope de 2400 es por
   si alguna vez llegan más grandes: de ahí para arriba no se aprecia en
   pantalla y pesa el doble. `withoutEnlargement` es lo que garantiza que
   uno chico nunca se estire, que es donde un render se arruina. */
const TOPE = 2400;
const CALIDAD = 92;

const suelto = /^(.+?)[ _-](\d+)\.(png|jpe?g|webp)$/i;

const tandas = new Map();
for (const archivo of fs.readdirSync(RAIZ)) {
  const m = archivo.match(suelto);
  if (!m) continue;
  const prefijo = m[1].trim().toLowerCase().replace(/\s+/g, '-');
  if (!prefijo.startsWith('esp-')) continue;
  if (!tandas.has(prefijo)) tandas.set(prefijo, []);
  tandas.get(prefijo).push({ archivo, n: Number(m[2]) });
}

if (tandas.size === 0) {
  console.log('No hay renders sueltos en la raíz.');
  process.exit(0);
}

fs.mkdirSync(ORIGINALES, { recursive: true });
const kb = (f) => Math.round(fs.statSync(f).size / 1024) + 'KB';

for (const [prefijo, vistas] of tandas) {
  vistas.sort((a, b) => a.n - b.n);
  console.log('');
  console.log(prefijo);

  for (const { archivo, n } of vistas) {
    // Se respeta el número que puso el estudio, aunque falte alguno: si
    // después aparece la vista que falta entra en su lugar, sin renombrar
    // las otras ni alterar el orden de lo que ya está publicado.
    const slug = prefijo + '-' + String(n).padStart(2, '0');
    const meta = await sharp(archivo).metadata();
    fs.copyFileSync(archivo, path.join(ORIGINALES, slug + path.extname(archivo)));
    const salida = path.join(DESTINO, slug + '.webp');
    await sharp(archivo)
      .resize({ width: TOPE, withoutEnlargement: true })
      .webp({ quality: CALIDAD, effort: 6, smartSubsample: true })
      .toFile(salida);
    const medida = meta.width + 'x' + meta.height;
    console.log('  ' + slug.padEnd(26) + medida.padEnd(11) + kb(archivo) + ' -> ' + kb(salida));
    fs.unlinkSync(archivo);
  }
}

// Lo que hay en disco manda: se relee la carpeta y se reescribe la lista.
let texto = fs.readFileSync(CONTENIDO, 'utf8');
const enDisco = fs
  .readdirSync(DESTINO)
  .filter((f) => f.endsWith('.webp'))
  .map((f) => f.replace(/\.webp$/, ''));

for (const prefijo of tandas.keys()) {
  const lista = enDisco.filter((s) => s === prefijo || s.startsWith(prefijo + '-')).sort();

  // Se busca a mano el bloque `renders: [...]` que ya nombra a este espacio.
  // Con corchetes y comillas de por medio, recorrer el texto es más claro
  // —y más difícil de romper— que una expresión regular.
  const clave = "'" + prefijo;
  let desde = texto.indexOf('renders: [');
  let hallado = -1;
  let hasta = -1;
  while (desde !== -1) {
    const cierre = texto.indexOf(']', desde);
    const bloque = texto.slice(desde, cierre + 1);
    if (bloque.includes(clave + "'") || bloque.includes(clave + '-')) {
      hallado = desde;
      hasta = cierre + 2; // el +2 se lleva también la coma del final
      break;
    }
    desde = texto.indexOf('renders: [', cierre);
  }

  if (hallado === -1) {
    console.log('');
    console.log('  ! ' + prefijo + ': no encontré dónde anotarlo en contenido.ts');
    continue;
  }

  const reemplazo =
    lista.length === 1
      ? "renders: ['" + lista[0] + "'],"
      : 'renders: [\n' + lista.map((s) => "      '" + s + "',").join('\n') + '\n    ],';
  texto = texto.slice(0, hallado) + reemplazo + texto.slice(hasta);
  console.log('');
  console.log('  ' + prefijo + ': ' + lista.length + (lista.length === 1 ? ' vista' : ' vistas'));
}

fs.writeFileSync(CONTENIDO, texto);
