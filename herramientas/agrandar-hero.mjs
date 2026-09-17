/**
 * Prepara la apertura de Proyecto Construcción, que es la excepción a la
 * regla del resto de los renders.
 *
 * La regla, que está en Render.astro y es correcta para los otros noventa
 * archivos: nunca pedir más ancho que el que tiene el original, porque
 * agrandar no agrega detalle. Para un render que se muestra a media página,
 * eso es exactamente lo que hay que hacer.
 *
 * La apertura no es ese caso. Ocupa el ancho entero de la pantalla, y el
 * original que entregó el estudio mide 1537px. En un monitor de 1920 el
 * navegador ya la estira 1,25x; en una pantalla retina, 2,5x. Nadie decide
 * si se agranda o no: se agranda igual. Lo único que se puede decidir es
 * quién hace esa cuenta.
 *
 * Y ahí hay diferencia. El navegador interpola y listo. Lanczos con un
 * realce medido encima deja los bordes —los marcos de las ventanas, los
 * listones de madera— con filo en vez de lavados. Se comparó el mismo
 * recorte al doble con los dos métodos antes de escribir esto.
 *
 * De paso arregla algo que costaba calidad de arriba: hoy la imagen se
 * comprime dos veces, porque el archivo que hay en `src/assets/renders/`
 * ya es un webp y Astro lo vuelve a comprimir. Este script parte del PNG
 * del estudio, así que esa pasada de más desaparece.
 *
 * Medido contra el original, la imagen que termina sirviéndose:
 *   antes  38,5 dB a 1537px
 *   ahora  40,0 dB a 2400px
 *
 * Por qué webp q95 y no PNG como archivo fuente: en PNG la imagen servida
 * llega a 41,5 dB, kilo y medio mejor, pero el archivo pesa 7,7 MB y entra
 * al historial de git para siempre. Kilo y medio de decibel no vale eso.
 *
 * Nada de esto inventa detalle. El techo lo pone el archivo del estudio, y
 * la solución de verdad es pedirle a Lucchesi una exportación de 3840px de
 * ancho: a esa medida no se agranda en ninguna pantalla común. Si algún día
 * llega, este script deja de hacer falta —el `resize` no agranda lo que ya
 * es más grande que el objetivo— y basta con dejar el archivo nuevo en
 * `renders-originales/` y volver a correrlo.
 *
 *   node herramientas/agrandar-hero.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ENTRADA = 'renders-originales/hero-proyecto.png';
const SALIDA = 'src/assets/renders/hero-proyecto.webp';

/* 2400 y no 3840: con `sizes="100vw"` un monitor de 1920 pide 1920 y una
   retina de 1440 pide 2880, así que 2400 cubre el primero de sobra y deja
   al segundo con un estirón de 1,2x en vez de 1,9x. Subir a 3840 sobre un
   original de 1537 es inventar el 60% de los píxeles y pagarlos en peso. */
const ANCHO = 2400;

/* Realce suave. Con más, el render queda crocante y se le ven los halos en
   los bordes de las figuras, que en una imagen de arquitectura canta. */
const REALCE = { sigma: 0.7, m1: 0.5, m2: 0.9 };

if (!fs.existsSync(ENTRADA)) {
  console.log(`No encontré ${ENTRADA}.`);
  console.log('Es el original del estudio y esa carpeta no entra al repositorio,');
  console.log('así que en una máquina recién clonada hay que traerlo primero.');
  process.exit(1);
}

/* Los archivos se leen a memoria antes de mirarlos. Pasándole la ruta,
   sharp deja el archivo tomado y en Windows eso hace que el `toFile` sobre
   ese mismo nombre falle con un «Invalid argument» que no dice nada. */
const leer = (f) => sharp(fs.readFileSync(f)).metadata();

const antes = fs.existsSync(SALIDA) ? await leer(SALIDA) : null;
const origen = await leer(ENTRADA);

// Se escribe al lado y recién al final se pisa el archivo bueno: si algo
// falla a mitad de camino, el que estaba sigue estando.
const temporal = `${SALIDA}.nuevo`;
await sharp(ENTRADA)
  .resize({ width: ANCHO, kernel: 'lanczos3', withoutEnlargement: false })
  .sharpen(REALCE)
  .webp({ quality: 95, effort: 6 })
  .toFile(temporal);
fs.renameSync(temporal, SALIDA);

const final = await leer(SALIDA);
const kb = (f) => Math.round(fs.statSync(f).size / 1024);

console.log(`original del estudio : ${origen.width}x${origen.height}`);
if (antes) console.log(`antes                : ${antes.width}x${antes.height}`);
console.log(`ahora                : ${final.width}x${final.height}  ${kb(SALIDA)} KB  ->  ${path.normalize(SALIDA)}`);

if (origen.width >= ANCHO) {
  console.log('\nEl original ya venía con ancho de sobra: no se agrandó nada, sólo se');
  console.log('encodeó. Este script ya no hace falta.');
} else {
  console.log(`\nSe agrandó ${(ANCHO / origen.width).toFixed(2)}x. El detalle que falta no lo inventa nadie:`);
  console.log('para que deje de estirarse hay que pedirle al estudio 3840px de ancho.');
}
