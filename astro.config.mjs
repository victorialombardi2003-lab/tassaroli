// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

import { ANCHOS } from './src/lib/anchos-imagen.mjs';

// Vercel comunica el dominio público a Astro mediante cabeceras del proxy.
const dominiosVercel = [...new Set([
  'tassaroli.vercel.app',
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
].filter(Boolean))];

// Solo documentación y acceso se resuelven en servidor.
export default defineConfig({
  /* El dominio real todavía no resuelve —verificado: no responde—, y el sitio
     vive en Vercel. Esto no es un detalle de configuración: de acá salen la
     URL canónica y la de la imagen de vista previa, las dos absolutas. Con el
     dominio que no existe, Google vería un canónico muerto y WhatsApp
     buscaría la imagen donde no está, que es justamente por lo que la vista
     previa del link se veía mal.

     Cuando fundaciontassaroli.org.ar apunte al sitio, esta línea vuelve a ese
     dominio y se acabó. */
  site: 'https://tassaroli.vercel.app',
  output: 'static',
  /* Sin `imageService`, que es lo que enciende el optimizador de Vercel.
     Las variantes las genera Astro durante el build y quedan como archivos
     estáticos en el CDN.

     La razón es el plan: Vercel cobra el optimizador por transformación
     —cada combinación de imagen, ancho y calidad cuenta una vez— y este
     sitio puede pedir 594 combinaciones distintas, 87 imágenes por 6,7
     anchos promedio. Generadas en el build, no cuentan ninguna.

     Lo que cuesta: el build tarda unos 16 segundos más y deja unos 750
     archivos de imagen. Nadie los descarga todos; cada visitante baja el
     ancho que le toca.

     `imagesConfig` queda igual porque no molesta y deja la puerta abierta:
     si algún día se vuelve a encender el optimizador, los anchos que sirve
     ya son los mismos que pide el componente. Ver src/lib/anchos-imagen.mjs
     para por qué esas dos listas tienen que coincidir. */
  adapter: vercel({ imagesConfig: { sizes: ANCHOS } }),
  security: {
    allowedDomains: dominiosVercel.map((hostname) => ({ protocol: 'https', hostname })),
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
});
