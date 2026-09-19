/**
 * El código QR que lleva a la página, para imprimir en la maqueta.
 *
 * Genera tres archivos en `marca/`:
 *
 *   qr-sitio.svg       vectorial, el que hay que mandar a imprimir
 *   qr-sitio.png       2000px, por si el imprentero pide un mapa de bits
 *   qr-sitio-logo.svg  con el isotipo en el centro
 *
 * Decisiones que importan cuando el destino es papel y no una pantalla:
 *
 * Corrección de errores en nivel H, el más alto: el código sigue leyéndose
 * con hasta un 30% de la superficie tapada o arruinada. En una maqueta que
 * se toca, se raya y junta polvo, eso no es exceso de precaución. Además es
 * lo que hace posible el logo en el centro: se puede tapar el medio
 * justamente porque sobra redundancia.
 *
 * Vectorial antes que mapa de bits. Un QR es geometría pura, así que en SVG
 * sale nítido a cualquier tamaño, sea una etiqueta de 3cm o un cartel. El
 * PNG está por si hace falta, pero si se puede, va el SVG.
 *
 * El margen blanco alrededor —la «zona de silencio»— no es aire de diseño:
 * la especificación pide cuatro módulos y sin eso muchos lectores no
 * encuentran el código. Si alguien recorta el archivo «para que quede más
 * prolijo», lo rompe.
 *
 * Azul de marca y no negro. Lo que un lector necesita es contraste de
 * luminancia, y este azul sobre blanco da de sobra —se verifica más abajo
 * decodificando el resultado, no a ojo—.
 *
 * Y el tamaño impreso: la regla práctica es que el lado del código mida al
 * menos la décima parte de la distancia desde la que se va a escanear. Para
 * alguien parado frente a la maqueta, a unos 40cm, cuatro centímetros de
 * lado alcanzan y sobran.
 *
 *   node herramientas/hacer-qr.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import QR from 'qrcode';
import jsQR from 'jsqr';
import sharp from 'sharp';

/* El sitio vive acá. El dominio propio todavía no resuelve, y un QR impreso
   no se puede corregir después: si mañana apunta a fundaciontassaroli.org.ar,
   hay que volver a correr esto y reimprimir. Vercel no da de baja la
   dirección .vercel.app al agregar un dominio propio, así que lo que se
   imprima hoy va a seguir funcionando. */
const DESTINO = 'https://tassaroli.vercel.app';

const AZUL = '#2563eb';
const CARPETA = 'marca';
const LOGO = 'src/assets/marca-tassaroli.png';

const opciones = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: { dark: AZUL, light: '#ffffff' },
};

fs.mkdirSync(CARPETA, { recursive: true });

/** Lee el código de una imagen. Es la única prueba que vale. */
async function leer(archivo) {
  const { data, info } = await sharp(fs.readFileSync(archivo))
    .flatten({ background: '#ffffff' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const leido = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  return leido?.data ?? null;
}

async function verificar(archivo, etiqueta) {
  const leido = await leer(archivo);
  const kb = Math.round(fs.statSync(archivo).size / 1024);
  if (leido !== DESTINO) {
    console.log(`  ${etiqueta.padEnd(22)} NO SE PUEDE LEER  (devolvió ${leido ?? 'nada'})`);
    return false;
  }
  console.log(`  ${etiqueta.padEnd(22)} ${String(kb).padStart(4)} KB   se lee y apunta a ${leido}`);
  return true;
}

// --- el liso ---------------------------------------------------------------
const svg = path.join(CARPETA, 'qr-sitio.svg');
const png = path.join(CARPETA, 'qr-sitio.png');
fs.writeFileSync(svg, await QR.toString(DESTINO, { ...opciones, type: 'svg' }), 'utf8');
await QR.toFile(png, DESTINO, { ...opciones, width: 2000 });

// --- el del logo -----------------------------------------------------------
/* El isotipo va en una tarjeta blanca en el medio, ocupando el 22% del lado.
   Eso es alrededor del 5% de la superficie, muy por debajo del 30% que el
   nivel H tolera, así que sobra margen. Igual se verifica: el número
   tranquiliza pero no prueba nada. */
const LADO_LOGO = 0.22;

const crudo = await QR.toString(DESTINO, { ...opciones, type: 'svg' });
const medida = /viewBox="0 0 (\d+) (\d+)"/.exec(crudo);
const lado = medida ? Number(medida[1]) : 0;

if (!lado) {
  console.log('No pude leer el viewBox del SVG; salteo la versión con logo.');
} else {
  const caja = lado * LADO_LOGO;
  const borde = caja * 0.12;
  const x = (lado - caja) / 2;

  const isotipo = await sharp(fs.readFileSync(LOGO))
    .resize({ width: 512, withoutEnlargement: true })
    .png()
    .toBuffer();

  const conLogo = crudo.replace(
    '</svg>',
    `<rect x="${x - borde}" y="${x - borde}" width="${caja + 2 * borde}" height="${caja + 2 * borde}" rx="${caja * 0.12}" fill="#ffffff"/>` +
      `<image x="${x}" y="${x}" width="${caja}" height="${caja}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${isotipo.toString('base64')}"/>` +
      '</svg>',
  );
  fs.writeFileSync(path.join(CARPETA, 'qr-sitio-logo.svg'), conLogo, 'utf8');
  await sharp(Buffer.from(conLogo)).resize({ width: 2000 }).png().toFile(path.join(CARPETA, 'qr-sitio-logo.png'));
}

console.log(`\nQR de ${DESTINO}\n`);
const resultados = [
  await verificar(png, 'qr-sitio.png'),
  fs.existsSync(path.join(CARPETA, 'qr-sitio-logo.png'))
    ? await verificar(path.join(CARPETA, 'qr-sitio-logo.png'), 'qr-sitio-logo.png')
    : true,
];

console.log(`\nY los vectoriales, que son los que van a imprenta:`);
console.log(`  ${svg}`);
if (fs.existsSync(path.join(CARPETA, 'qr-sitio-logo.svg'))) {
  console.log(`  ${path.join(CARPETA, 'qr-sitio-logo.svg')}`);
}

if (!resultados.every(Boolean)) {
  console.log('\nAlgo no se lee. No mandar a imprimir así.');
  process.exit(1);
}
console.log('\nLos dos se decodificaron acá mismo, no es una suposición.');
