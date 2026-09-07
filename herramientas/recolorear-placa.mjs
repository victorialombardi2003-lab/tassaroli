/**
 * Le cambia el fondo a la placa institucional: donde hoy hay un azul plano,
 * pone el degradé azul-naranja de la pieza del cliente. La ola blanca y los
 * logos quedan intactos.
 *
 * El truco es que el azul de la placa es un color plano exacto —#276AE7— y
 * todo lo azul de la imagen es ese color mezclado con blanco en distinta
 * proporción: el azul pleno del fondo, la ola clara, los bordes suavizados.
 * Entonces, para cada píxel, se calcula cuánto blanco tiene mezclado y se
 * vuelve a mezclar esa misma proporción pero contra el degradé en vez de
 * contra el azul plano. Los píxeles que no son mezcla de ese azul —los logos
 * de Mendoza y el Municipio, con sus verdes y sus ocres— no cumplen la
 * condición y se dejan como están.
 *
 *   node herramientas/recolorear-placa.mjs
 */
import fs from 'node:fs';
import sharp from 'sharp';

const ENTRADA = 'marca/placa-instituciones-original.png';
const SALIDA = 'src/assets/placa-instituciones.webp';

/** El azul plano del fondo original. */
const BASE = [39, 106, 231];

/* El degradé de la pieza. Los cortes no son los del CSS: aquéllos están
   calculados para una banda apaisada, y en este lienzo de 3:2 el naranja
   quedaba en un hilo del borde derecho. Acá se corren para que el reparto se
   parezca al de la referencia del cliente: azul la mitad izquierda, la
   transición en el medio y el naranja ocupando la derecha. */
const LINEAL = [
  [0.0, [31, 86, 221]],
  [0.22, [47, 127, 228]],
  [0.4, [63, 159, 234]],
  [0.52, [90, 182, 238]],
  [0.62, [150, 176, 196]],
  [0.74, [231, 154, 51]],
  [0.88, [242, 146, 28]],
  [1.0, [242, 146, 28]],
];

const RADIAL = [
  [0.0, [242, 146, 28], 0.96],
  [0.26, [240, 150, 35], 0.72],
  [0.46, [238, 160, 60], 0.28],
  [0.66, [240, 160, 60], 0.0],
];

const entre = (a, b, t) => a + (b - a) * t;

function tramo(paradas, t) {
  if (t <= paradas[0][0]) return paradas[0];
  for (let i = 0; i < paradas.length - 1; i++) {
    const [p0, p1] = [paradas[i], paradas[i + 1]];
    if (t <= p1[0]) {
      const k = (t - p0[0]) / (p1[0] - p0[0]);
      return [t, p0[1].map((c, j) => entre(c, p1[1][j], k)), p0[2] === undefined ? undefined : entre(p0[2], p1[2], k)];
    }
  }
  return paradas[paradas.length - 1];
}

/* 104 grados y no los 118 del CSS: más horizontal, que es como corre en la
   referencia. */
const ANGULO = (104 * Math.PI) / 180;
const DX = Math.sin(ANGULO);
const DY = -Math.cos(ANGULO);

function degrade(x, y, W, H, largo) {
  const t = 0.5 + ((x - W / 2) * DX + (y - H / 2) * DY) / largo;
  const base = tramo(LINEAL, Math.max(0, Math.min(1, t)))[1];

  // El resplandor naranja de la esquina, encima del lineal.
  const dx = (x - 1.04 * W) / (0.78 * W);
  const dy = (y - 1.08 * H) / (0.74 * H);
  const d = Math.hypot(dx, dy);
  const [, color, alfa] = tramo(RADIAL, Math.max(0, Math.min(1, d)));
  const a = d >= 0.66 ? 0 : alfa;
  return base.map((c, i) => c * (1 - a) + color[i] * a);
}

/* Se reduce antes de recolorear: la salida mide 2600 igual, y el relleno por
   contigüidad sobre los 8041px del original serían cuarenta millones de
   píxeles para nada. */
const { data, info } = await sharp(ENTRADA)
  .resize({ width: 2600 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const largo = Math.abs(W * DX) + Math.abs(H * DY);

/* Cuánto blanco tiene mezclado este píxel, si es que es el azul base mezclado
   con blanco. Devuelve null si no lo es —los logos de Mendoza y del Municipio,
   con sus verdes y sus ocres, caen acá—. */
function mezclaDeBase(i) {
  const k = [0, 1, 2].map((j) => (data[i + j] - BASE[j]) / (255 - BASE[j]));
  const min = Math.min(...k);
  const max = Math.max(...k);
  if (min < -0.04 || max > 1.04 || max - min > 0.06) return null;
  return Math.max(0, Math.min(1, (min + max) / 2));
}

/* Los logos se preservan con una observación que simplifica todo: los tres
   logos del arco —Fundación, Mendoza, Municipio— están apoyados sobre blanco.
   Dentro de la caja de cada uno, entonces, el fondo es blanco y todo lo que no
   es blanco es logo.

   Eso resuelve el caso difícil, que era el de la Fundación: su azul es el
   mismo azul del fondo, así que por color no hay manera de distinguirlo. Por
   posición sí.

   El logo del Centro Tecnológico no necesita caja: está sobre el azul y es
   blanco, y el blanco no cambia —una mezcla del 100% con blanco sigue dando
   blanco, contra cualquier degradé—. De hecho darle caja era peor, porque
   adentro quedaba el azul viejo y se veía el rectángulo dibujado. */
function esMarca(i) {
  const blanco = data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245;
  return mezclaDeBase(i) === null && !blanco;
}

/* Las marcas se engordan unos píxeles para que los trazos sueltos de un mismo
   logo —las letras de FUNDACIÓN, el escudo de Mendoza y su texto— queden
   pegados y cuenten como una sola pieza. Un radio chico: si fuera grande,
   logos vecinos se tocarían y terminarían siendo uno. */
const RADIO = Math.round(W * 0.005);
const marca = new Uint8Array(W * H);
for (let p = 0; p < W * H; p++) if (esMarca(p * 4)) marca[p] = 1;

const gordo = new Uint8Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (!marca[y * W + x]) continue;
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

/* Componentes conexos de verdad, no agrupado por cercanía: la primera versión
   agrandaba una caja a medida que recorría, y esa caja terminaba absorbiendo
   todo lo que encontraba. Medido, una sola cubría del 23% al 100% del ancho,
   y ahí se perdía el naranja entero. */
const visto = new Uint8Array(W * H);
const cajas = [];
for (let inicio = 0; inicio < W * H; inicio++) {
  if (!gordo[inicio] || visto[inicio]) continue;
  const c = { x0: W, x1: 0, y0: H, y1: 0 };
  const pila = [inicio];
  visto[inicio] = 1;
  while (pila.length) {
    const p = pila.pop();
    const x = p % W;
    const y = (p - x) / W;
    if (x < c.x0) c.x0 = x;
    if (x > c.x1) c.x1 = x;
    if (y < c.y0) c.y0 = y;
    if (y > c.y1) c.y1 = y;
    for (const q of [p - 1, p + 1, p - W, p + W]) {
      if (q < 0 || q >= W * H) continue;
      if (Math.abs((q % W) - x) > 1) continue;
      if (gordo[q] && !visto[q]) {
        visto[q] = 1;
        pila.push(q);
      }
    }
  }
  cajas.push(c);
}

/* Sólo se protegen las piezas que están sobre blanco. Se mira qué hay justo
   arriba y abajo de cada caja. */
const MARGEN = Math.round(W * 0.008);
const enLogo = new Uint8Array(W * H);
let protegidas = 0;
for (const c of cajas) {
  let blancos = 0;
  let total = 0;
  for (let x = c.x0; x <= c.x1; x += 2) {
    for (const y of [c.y0 - MARGEN, c.y1 + MARGEN]) {
      if (y < 0 || y >= H) continue;
      const i = (y * W + x) * 4;
      total++;
      if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) blancos++;
    }
  }
  if (!total || blancos / total < 0.6) continue;
  protegidas++;
  for (let y = Math.max(0, c.y0 - MARGEN); y <= Math.min(H - 1, c.y1 + MARGEN); y++) {
    for (let x = Math.max(0, c.x0 - MARGEN); x <= Math.min(W - 1, c.x1 + MARGEN); x++) {
      enLogo[y * W + x] = 1;
    }
  }
}

let recoloreados = 0;
for (let p = 0; p < W * H; p++) {
  const i = p * 4;
  const mezcla = mezclaDeBase(i);
  if (mezcla === null) continue;
  // Dentro de la caja de un logo sólo se toca lo que ya es casi blanco: el
  // fondo. Lo demás es el dibujo y se deja tal cual.
  if (enLogo[p] && mezcla < 0.9) continue;
  const x = p % W;
  const y = (p - x) / W;
  const g = degrade(x, y, W, H, largo);
  for (let j = 0; j < 3; j++) data[i + j] = Math.round(g[j] * (1 - mezcla) + 255 * mezcla);
  recoloreados++;
}

console.log(`  ${cajas.length} piezas detectadas, ${protegidas} protegidas por estar sobre blanco`);

/* Acá se intentó correr el logo de la Fundación hacia la izquierda para
   separarlo de los patrocinadores, y no funciona. Queda anotado para que no
   se vuelva a intentar por este camino.

   El problema es que en una imagen plana los logos no son objetos: son
   píxeles al lado de un borde curvo. Cualquier caja que se recorte o bien
   corta el texto del propio logo, o bien se lleva puesto el escudo del
   vecino, o bien pisa de blanco un pedazo del arco. Medir los límites
   tampoco alcanza: el detector de tinta no distingue el degradé del dibujo,
   porque los dos son oscuros contra el blanco.

   Mover ese logo pide rehacer la franja en HTML: el degradé ya es un token
   de CSS, la ola puede ser un SVG y cada logo su propia imagen. Ahí moverlo
   es una línea. */

await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 92, effort: 6 })
  .toFile(SALIDA);

const kb = Math.round(fs.statSync(SALIDA).size / 1024);
console.log(`${W}x${H}  fondo recoloreado: ${((100 * recoloreados) / (W * H)).toFixed(1)}% de los pixeles  ->  ${SALIDA}  ${kb}KB`);
