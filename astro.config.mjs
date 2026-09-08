// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Sin adaptador, a propósito.
 *
 * Las tres páginas son estáticas y no queda ninguna ruta que necesite
 * servidor, así que el build emite HTML plano y lo sirve cualquier hosting:
 * Vercel, Netlify o un bucket. Antes había un adaptador de Netlify por el
 * endpoint que servía la documentación con contraseña; ese acceso ahora lo
 * gestiona Google Drive y el endpoint ya no existe.
 *
 * De paso saca del medio el CDN de imágenes del adaptador, que volvía a
 * comprimir cada render con su calidad por defecto (~75) encima de la
 * nuestra: dos pasadas con pérdida, y la peor decidida por otro. Así las
 * variantes se generan acá con sharp, con la calidad que fijamos nosotros.
 */
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
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
});
