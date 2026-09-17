/**
 * La escalera de anchos con la que se sirven las imágenes.
 *
 * Vive en su propio archivo porque la usan dos lados que no se hablan, y si
 * estuviera duplicada sería cuestión de tiempo que quedaran distintas —con
 * una consecuencia que no se ve hasta producción y que además no rompe
 * nada, sólo empeora las imágenes en silencio.
 *
 * Los dos lados son:
 *
 *   - `astro.config.mjs`, que se la pasa al optimizador de Vercel como la
 *     lista de anchos permitidos. Vercel sólo sirve los anchos declarados
 *     ahí: cualquier otro lo ignora.
 *
 *   - `Render.astro`, que arma el `srcset` de cada imagen.
 *
 * Que estuvieran desalineadas costó caro. La lista de Vercel venía con su
 * default —640, 750, 828, 1080, 1200, 1920, 2048, 3840— y el componente
 * pedía 480, 640, 960, 1280, 1600, 2000 y el ancho nativo del archivo. De
 * todo eso, el único ancho que estaba en las dos listas era 640. Resultado:
 * cada render de pantalla completa salía con un `srcset` de un solo
 * candidato de 640px, que en un monitor de 1920 el navegador estiraba 3x.
 * Se veía blando y parecía culpa de los archivos del estudio.
 *
 * Los escalones de abajo cubren lo que hay: pantallas comunes a 1x
 * (1280, 1600, 1920), retina de notebook (2560, 2880) y 4K (3840). Cada
 * imagen usa sólo los que no superan su ancho real, así que nadie pide un
 * agrandado.
 */
/* 1440 y 1536 están para no desperdiciar archivos. Los renders del estudio
   miden 1537 de ancho y la foto aérea 1448: sin esos dos escalones, el más
   alto que les queda por debajo es 1280, y se estarían sirviendo a 1280 unas
   imágenes que tienen 1537 píxeles de verdad. */
export const ANCHOS = [480, 640, 828, 1080, 1280, 1440, 1536, 1600, 1920, 2048, 2400, 2880, 3840];
