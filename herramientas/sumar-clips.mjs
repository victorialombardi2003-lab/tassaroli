/**
 * Convierte los clips en crudo del estudio en loops para el sitio.
 *
 * El estudio manda los recorridos exportados casi sin comprimir: 720p a 30
 * fps y entre 22 y 56 Mbps, o sea 30 MB cada nueve segundos. Este script los
 * recorta, los baja a una medida de pantalla y los escribe en `public/clips/`
 * junto con un cuadro de póster, que es lo que se ve antes de que el clip
 * arranque.
 *
 * Lo que sale pesa alrededor de un 3% del original y se ve igual al tamaño en
 * que se muestra. Para comparar: el mismo clip como GIF pesaba 23 MB contra
 * 1 MB de acá, medido, y encima con bandas de color en los degradados.
 *
 * Se puede correr las veces que haga falta: siempre reescribe lo que hay.
 *
 *   node herramientas/sumar-clips.mjs
 *
 * Requiere ffmpeg (brew install ffmpeg).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ORIGEN = 'WEB';
const DESTINO = 'public/clips';

/* 960px de ancho, no los 1280 del original: en la página el clip vive en una
   columna de 44vw, así que ni en una pantalla de 2560 se muestra más grande
   que eso. CRF 28 es el punto donde la imagen todavía aguanta sin que se vea
   el bloque en las sombras —y las sombras son la mitad de estos renders—. */
const ANCHO = 960;
const CRF = 28;

/* Qué clip va en cada espacio, y de qué pedazo.
 *
 * `desde` y `hasta` en segundos; sin ellos va entero. El clip de taller,
 * pasillo y comedor es una sola toma continua de 27 s sin cortes de escena,
 * así que los tres pedazos se marcan a mano: a los 11,5 s la cámara cruza el
 * umbral al pasillo y a los 20,5 s desemboca en el comedor.
 *
 * De los tres exteriores entra sólo el del parque con el espejo de agua, que
 * es el que más cuenta del conjunto. Los otros dos —la escultura contra la
 * fachada y la pérgola— quedan sin usar, disponibles si algún día se quieren.
 */
const CLIPS = [
  /* Se corta a los nueve segundos: en quince, el follaje del parque se lleva
     cuatro megas —más que los otros cuatro clips juntos—, y a los nueve el
     edificio ya se reveló entero. */
  {
    espacio: 'Exteriores',
    salida: 'exteriores',
    archivo: 'CLIP 7 - EXT - TASSAROLI - 21.07.26.mp4',
    hasta: 9,
  },
  /* Arranca tres décimas más adelante porque el original abre con un cuadro
     en negro: medido, luma 3 al empezar y 92 a los 0,3 s. Sin el corte, el
     póster del espacio es una caja negra. */
  {
    espacio: 'Espacios comunes',
    salida: 'espacios-comunes',
    archivo: 'espacios comunes.mp4',
    desde: 0.3,
  },
  { espacio: 'Taller', salida: 'taller', archivo: 'Taller 2.mp4' },
  { espacio: 'Coworking', salida: 'coworking', archivo: 'CLIP Coworking.mp4' },
  {
    espacio: 'Circulaciones',
    salida: 'circulaciones',
    archivo: 'Copia de Taller + aulas + comedor.mp4',
    desde: 11.5,
    hasta: 20.5,
  },
];

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const kb = (f) => Math.round(fs.statSync(f).size / 1024);

fs.mkdirSync(DESTINO, { recursive: true });

console.log(`${'espacio'.padEnd(20)}${'clip'.padStart(9)}${'póster'.padStart(9)}`);

let total = 0;
for (const c of CLIPS) {
  const entrada = path.join(ORIGEN, c.archivo);
  if (!fs.existsSync(entrada)) {
    console.log(`${c.espacio.padEnd(20)}  falta ${entrada}`);
    continue;
  }

  const recorte = [];
  if (c.desde) recorte.push('-ss', String(c.desde));
  if (c.hasta) recorte.push('-to', String(c.hasta));

  const video = path.join(DESTINO, `${c.salida}.mp4`);
  /* `-an` porque no hay audio que perder: los siete clips vienen mudos, y
     declararlo evita que un futuro clip con sonido se publique sonando.
     `+faststart` mueve el índice al principio del archivo, que es lo que
     permite empezar a ver sin haberlo descargado entero. */
  ff([
    ...recorte, '-i', entrada,
    '-an',
    '-vf', `scale=${ANCHO}:-2`,
    '-c:v', 'libx264', '-crf', String(CRF), '-preset', 'slow',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    video,
  ]);

  /* El póster es el primer cuadro del clip, no una imagen cualquiera: es lo
     que se ve mientras el video no cargó, y si no coincide con el arranque se
     nota un salto en el momento en que empieza. */
  const poster = path.join(DESTINO, `${c.salida}.webp`);
  /* ffmpeg saca el cuadro y sharp lo pasa a webp. Va en dos pasos porque el
     ffmpeg de Homebrew viene sin codificador webp, y sharp ya está en el
     proyecto —es lo que usa Astro para los renders—, así que no suma nada. */
  const crudo = path.join(DESTINO, `${c.salida}.png`);
  ff([...(c.desde ? ['-ss', String(c.desde)] : []), '-i', entrada,
      '-frames:v', '1', '-vf', `scale=${ANCHO}:-2`, crudo]);
  await sharp(crudo).webp({ quality: 80 }).toFile(poster);
  fs.unlinkSync(crudo);

  total += kb(video) + kb(poster);
  console.log(`${c.espacio.padEnd(20)}${(kb(video) + ' KB').padStart(9)}${(kb(poster) + ' KB').padStart(9)}`);
}

console.log(`\ntotal en public/clips: ${(total / 1024).toFixed(1)} MB`);
