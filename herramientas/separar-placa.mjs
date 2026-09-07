/**
 * Separa los logos de la placa institucional.
 *
 * La placa venía como una imagen plana: el degradé, la ola, y los cuatro
 * logos pintados encima. Eso hacía que cualquier cambio de disposición
 * —mover un logo, ponerle un rótulo— fuera cirugía sobre un mapa de bits, y
 * cada intento o cortaba el logo, o se llevaba al vecino, o pisaba el borde
 * de la ola.
 *
 * Este script rompe esa dependencia: recorta cada logo del arco blanco como
 * un archivo propio con transparencia, y deja la placa con el arco limpio.
 * De ahí en más los logos se acomodan en HTML, donde moverlos es una línea.
 *
 * El logo del Centro Tecnológico no se toca: está sobre el azul, es blanco y
 * es parte del fondo.
 *
 *   node herramientas/separar-placa.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ENTRADA = 'src/assets/placa-instituciones.webp';
const SALIDA_PLACA = 'src/assets/placa-fondo.webp';
const CARPETA = 'src/assets/logos';

const { data, info } = await sharp(ENTRADA).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;

const esBlanco = (p) => {
  const i = p * 4;
  return data[i] > 246 && data[i + 1] > 246 && data[i + 2] > 246;
};

/* El arco es la mancha blanca más grande de la placa.

   La primera versión sembraba el relleno desde el borde derecho, dando por
   hecho que el arco llegaba hasta ahí. No llega: por la derecha corre una
   franja naranja, y el borde no tiene un solo píxel blanco en las 1726 filas.
   Sembrar desde el borde de abajo tampoco sirve, porque el logo del Centro
   Tecnológico es blanco sobre azul y entraría como si fuera arco.

   Buscar la mancha más grande no depende de dónde esté: el arco ocupa el 10%
   de la placa y el logo del Centro una fracción de eso. */
const etiqueta = new Int32Array(W * H).fill(-1);
let mejor = -1;
let mejorTam = 0;
let n = 0;
for (let semilla = 0; semilla < W * H; semilla++) {
  if (etiqueta[semilla] >= 0 || !esBlanco(semilla)) continue;
  let tam = 0;
  const cola = [semilla];
  etiqueta[semilla] = n;
  while (cola.length) {
    const p = cola.pop();
    tam++;
    const x = p % W;
    const y = (p - x) / W;
    for (const q of [p - 1, p + 1, p - W, p + W]) {
      if (q < 0 || q >= W * H || etiqueta[q] >= 0 || !esBlanco(q)) continue;
      if (Math.abs((q % W) - x) > 1) continue;
      etiqueta[q] = n;
      cola.push(q);
    }
  }
  if (tam > mejorTam) {
    mejorTam = tam;
    mejor = n;
  }
  n++;
}

const enArco = new Uint8Array(W * H);
for (let p = 0; p < W * H; p++) if (etiqueta[p] === mejor) enArco[p] = 1;
console.log(`  arco: ${((100 * mejorTam) / (W * H)).toFixed(1)}% de la placa, de ${n} manchas blancas`);

/* Por fila, el arco va de su borde izquierdo hasta el borde de la imagen. Las
   islas quedan adentro de ese tramo aunque el relleno no las haya tocado, así
   que el tramo es la forma completa del arco, logos incluidos. */
const desde = new Int32Array(H).fill(-1);
const hasta = new Int32Array(H).fill(-1);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (!enArco[y * W + x]) continue;
    if (desde[y] < 0) desde[y] = x;
    hasta[y] = x;
  }
}

const dentro = (x, y) => desde[y] >= 0 && x >= desde[y] && x <= hasta[y];

/* Las islas: lo que está dentro del arco y no es blanco. Son los tres logos. */
const isla = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = desde[y] < 0 ? 0 : desde[y]; x <= hasta[y]; x++) {
    const p = y * W + x;
    if (!esBlanco(p)) isla[p] = 1;
  }
}

/* Se engordan unos píxeles para que los trazos sueltos de un mismo logo
   cuenten como una pieza, y se agrupan en componentes conexos. */
const RADIO = Math.round(W * 0.006);
const gordo = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (!isla[y * W + x]) continue;
    for (let dy = -RADIO; dy <= RADIO; dy++) {
      const yy = y + dy;
      if (yy < 0 || yy >= H) continue;
      for (let dx = -RADIO; dx <= RADIO; dx++) {
        const xx = x + dx;
        if (xx >= 0 && xx < W) gordo[yy * W + xx] = 1;
      }
    }
  }
}

const visto = new Uint8Array(W * H);
const piezas = [];
for (let inicio = 0; inicio < W * H; inicio++) {
  if (!gordo[inicio] || visto[inicio]) continue;
  const c = { x0: W, x1: 0, y0: H, y1: 0, n: 0 };
  const cola = [inicio];
  visto[inicio] = 1;
  while (cola.length) {
    const p = cola.pop();
    const x = p % W;
    const y = (p - x) / W;
    c.n++;
    if (x < c.x0) c.x0 = x;
    if (x > c.x1) c.x1 = x;
    if (y < c.y0) c.y0 = y;
    if (y > c.y1) c.y1 = y;
    for (const q of [p - 1, p + 1, p - W, p + W]) {
      if (q < 0 || q >= W * H || visto[q] || !gordo[q]) continue;
      if (Math.abs((q % W) - x) > 1) continue;
      visto[q] = 1;
      cola.push(q);
    }
  }
  if (c.n > W * H * 0.00005) piezas.push(c);
}

/* Los componentes salen fragmentados: el escudo de Mendoza queda separado de
   su texto, el del Municipio de su bajada. Se unen las cajas que están cerca,
   repitiendo la pasada hasta que no quede nada por unir.
 
   La distancia de unión es menor que el hueco entre logos vecinos —medido, el
   más chico es del 4,7% del ancho—, así que dos logos distintos nunca se
   funden en uno. */
const UNIR = Math.round(W * 0.012);
let hubo = true;
while (hubo) {
  hubo = false;
  for (let i = 0; i < piezas.length && !hubo; i++) {
    for (let j = i + 1; j < piezas.length; j++) {
      const a = piezas[i];
      const b = piezas[j];
      const separadas =
        b.x0 > a.x1 + UNIR || a.x0 > b.x1 + UNIR || b.y0 > a.y1 + UNIR || a.y0 > b.y1 + UNIR;
      if (separadas) continue;
      a.x0 = Math.min(a.x0, b.x0);
      a.x1 = Math.max(a.x1, b.x1);
      a.y0 = Math.min(a.y0, b.y0);
      a.y1 = Math.max(a.y1, b.y1);
      piezas.splice(j, 1);
      hubo = true;
      break;
    }
  }
}
piezas.sort((a, b) => a.x0 - b.x0);

/* Sólo se separa el logo de la Fundación, que es el que hay que reubicar. Los
   otros dos se quedan donde están, en la imagen. Es la pieza más a la
   izquierda de las que están sobre el arco. */
fs.mkdirSync(CARPETA, { recursive: true });
const c = piezas[0];
const MARGEN = Math.round(W * 0.004);
const x0 = Math.max(0, c.x0 - MARGEN);
const x1 = Math.min(W - 1, c.x1 + MARGEN);
const y0 = Math.max(0, c.y0 - MARGEN);
const y1 = Math.min(H - 1, c.y1 + MARGEN);
const w = x1 - x0 + 1;
const h = y1 - y0 + 1;

/* El fondo del recorte es blanco, así que la opacidad se despeja de cuánto se
   aleja el píxel del blanco, y el color se des-premultiplica: si no, los
   bordes suavizados quedan lavados. */
const buf = Buffer.alloc(w * h * 4);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = ((y + y0) * W + (x + x0)) * 4;
    const o = (y * w + x) * 4;
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    const a = 1 - min / 255;
    buf[o + 3] = Math.round(a * 255);
    for (let j = 0; j < 3; j++) {
      buf[o + j] = a < 0.004 ? 255 : Math.max(0, Math.min(255, Math.round((data[i + j] - 255 * (1 - a)) / a)));
    }
  }
}
await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(CARPETA, 'fundacion.png'));
console.log(`  logo de la Fundacion: ${w}x${h}`);

/* Y se borra de la placa pintando de blanco sólo sus píxeles, no su caja: la
   caja tocaría el borde del arco y dejaría una muesca. Todos esos píxeles
   están dentro del arco por construcción, así que pintarlos de blanco no
   puede dañar nada. */
let borrados = 0;
for (let y = c.y0; y <= c.y1; y++) {
  for (let x = c.x0; x <= c.x1; x++) {
    const p = y * W + x;
    if (!isla[p]) continue;
    const i = p * 4;
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    borrados++;
  }
}
console.log(`  ${borrados.toLocaleString()} pixeles borrados de la placa`);

await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 92, effort: 6 })
  .toFile(SALIDA_PLACA);

console.log(`
  fondo sin el logo en ${SALIDA_PLACA} (${Math.round(fs.statSync(SALIDA_PLACA).size / 1024)}KB)`);
