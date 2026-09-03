// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// Static by default. Only the routes that guard the documentation opt out of
// prerendering (`export const prerender = false`), so the password check runs
// on the server and never reaches the browser bundle.
//
// Moving to Vercel: swap this adapter for `@vercel/astro` and carry the two
// environment variables across. Nothing else in the project is host-specific.
// El adaptador sólo se engancha al construir. En `astro dev` el servidor de
// desarrollo ya resuelve las rutas on-demand por su cuenta, y el plugin de
// Netlify intenta escribir su configuración global en el perfil del usuario,
// cosa que falla en entornos con el sistema de archivos restringido.
const construyendo = process.argv.includes('build');

export default defineConfig({
  site: 'https://fundaciontassaroli.org.ar',
  output: 'static',
  // Los PDF viven fuera de `public/`, así que hay que pedirle al adaptador
  // que los meta en el bundle de la función. Sin esto, el endpoint los
  // busca en producción y no los encuentra.
  adapter: construyendo ? netlify({ includedFiles: ['documentos/**'] }) : undefined,
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
});
