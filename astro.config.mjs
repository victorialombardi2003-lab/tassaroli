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
  site: 'https://fundaciontassaroli.org.ar',
  output: 'static',
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
});
