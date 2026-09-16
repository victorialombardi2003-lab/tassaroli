// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

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
  adapter: vercel(),
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
});
