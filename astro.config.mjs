// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

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
  adapter: vercel({ imageService: true }),
  security: {
    allowedDomains: dominiosVercel.map((hostname) => ({ protocol: 'https', hostname })),
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
});
