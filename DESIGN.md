# Diseño

Sistema visual del sitio de la Fundación Tassaroli, tal como está construido.

## Idea

El sitio se recorre como se va a recorrer el edificio. Una línea continua
atraviesa cada página de arriba abajo y planta un nodo en cada destino. La
línea no es un adorno de scroll: **cambia de carril cuando cambia el
recorrido**, y los cuatro recorridos son la zonificación real del
anteproyecto — área pública, parque y circulaciones, capacitación,
investigación.

Lo que el sitio rechaza a propósito: render a sangre con titular centrado
sobre velo oscuro, tres tarjetas con ícono para las tres áreas, y franja de
cifras que cuentan al entrar en pantalla. Es la página que arma cualquier
fundación, y no dice nada sobre ésta.

## Color

| Rol                          | Token         | Valor     |
| ---------------------------- | ------------- | --------- |
| Fondo principal              | `--papel`     | `#FAF9F6` |
| Banda alterna                | `--papel-2`   | `#F4F3EF` |
| Banda marcada                | `--papel-3`   | `#EDECE6` |
| Tarjetas, bordes, divisores  | `--linea`     | `#E5E7EB` |
| Títulos y textos             | `--tinta`     | `#14213D` |
| Texto secundario (7.2:1)     | `--tinta-2`   | `#48546E` |
| Texto terciario (4.9:1)      | `--tinta-3`   | `#636D89` |
| Botones, enlaces, detalles   | `--azul-600`  | `#2563EB` |
| Hover y acentos fuertes      | `--azul-700`  | `#1D4ED8` |
| Velo de acento               | `--azul-50`   | `#EFF6FF` |
| Pie                          | `--azul-900`  | `#14213D` |

Estrategia: paleta restringida. El azul entra en tonos, no en cantidad —
manda en botones, marcas de nodo, cifras y epígrafes. **El único bloque en
azul noche es el pie**, que ancla la página sin oscurecer la lectura.

Todos los pares de texto sobre fondo llegan o superan 4.5:1. Los valores
están medidos, no estimados.

## Tipografía

- **Archivo Variable** (con eje de ancho, 62%–125%) para todo el texto.
  Es una grotesca de raíz señalética: condensada para rótulos, apenas
  expandida para el display. Se usa el archivo `standard.css` de Fontsource,
  que trae peso y ancho variables.
- **Martian Mono** exclusivamente para datos reales: medidas, cantidades,
  números de lámina, pesos de archivo. Nunca como disfraz de "técnico".

Escala en `clamp()`, display topado en 5rem, tracking nunca más cerrado que
-0.035em, medida de lectura 68ch.

## Estructura

**El sitio ocupa todo el ancho de la pantalla** (`--max: 100%`), por pedido
del cliente: no hay caja centrada. Los párrafos igual se frenan en `--medida`
(68ch), porque una línea de texto de 1900px no se puede leer. En 1680px el
contenido va de borde a borde y el cuerpo mide 721px.

- `.calle` — el contenedor de página. Deja libre a la izquierda un carril
  (`--rail`) por donde baja la línea. Es la misma regla en todas las
  secciones, y por eso la línea nunca tiene que esquivar nada.
- `.banda` / `.banda-fuerte` — el único recurso de contraste de fondo.
- `.sangrado` — ancho completo sin desbordar por la barra de scroll.
- `.nodo` — anotación de plano al margen, con el rótulo en vertical.
  **Nunca va arriba del título**: eso sería un antetítulo, y además repetiría
  la palabra. Bajo 48rem el rótulo se oculta y queda sólo la marca.

## Láminas

Las imágenes se presentan como láminas técnicas: marco de gris claro con
borde de 1px, la imagen adentro escalada 1.06 con paralaje de ±3%, y un
epígrafe numerado debajo (`Fig. 01`) en azul.

Mientras un render no exista, `Render.astro` dibuja una trama de rayado a 45°
con el nombre del archivo que falta. No es un placeholder gris: es una lámina
sin imprimir. Cuando el JPG aparece en `public/renders/`, se usa la imagen
sin tocar código.

## Movimiento

Un solo mecanismo, no efectos sueltos. `Linea.astro` monta todo con GSAP y
ScrollTrigger:

1. **La línea se dibuja** con `strokeDashoffset` atado al scroll de la página
   (`scrub`). Es el momento de autor.
2. **Los nodos se encienden** cuando la línea los alcanza.
3. **Las secciones aparecen** al entrar en pantalla, con `expo.out` y
   stagger de 55ms.
4. **Las láminas hacen paralaje** de ±3% dentro de su marco.
5. **La portada entra** apenas hay DOM — no espera a `load`, porque esperar
   a los renders produciría un parpadeo.

La geometría de la línea se calcula desde el DOM real y se recalcula al
redimensionar y al cargar las fuentes.

**Reglas que no se negocian:** con `prefers-reduced-motion` todo se dibuja
entero y quieto; sin JavaScript el contenido se lee igual, porque los estados
previos viven bajo `[data-motion='on']`; y hay una red de seguridad a los 4
segundos que muestra todo pase lo que pase. El contenido nunca depende del
scroll para existir.

## Superficies del navegador

Selección, cursor, barra de scroll y anillo de foco están tematizados desde
la paleta. Los números en tablas usan `tabular-nums`.

## Marca

Son **dos marcas distintas**, y el render del hall lo confirma: en la pared
del Centro está el hexágono con el nombre «Centro Tecnológico Carlos José
Tassaroli». El infinito es de la Fundación; el hexágono, del Centro.

| Archivo                           | Qué es                    | Dónde se usa              |
| --------------------------------- | ------------------------- | ------------------------- |
| `src/assets/isotipo-fundacion.png`| Infinito de la Fundación  | Barra superior y favicons |
| `src/assets/marca-tassaroli.png`  | Hexágono del Centro       | Fondo del hero de inicio  |

Los originales sin tocar están en `marca/`. Las fuentes de `src/assets/`
están recortadas a su contenido real y reducidas; Astro genera el `srcset` y
en producción el Image CDN de Netlify las redimensiona.

El archivo del isotipo no trae texto, así que **el nombre va escrito al
lado** en `Marca.astro`: Archivo con peso 430 y caja de oración, lo más
parecido al logotipo original que se puede armar con la tipografía del sitio
sin cargar una fuente extra. El color lo hereda del contenedor
(`currentColor`), para que sobre el hero oscuro toda la marca pase a blanco
de una sola vez —el isotipo con `filter: brightness(0) invert(1)`, sin
segundo archivo.

## Barra de navegación

Tres columnas: marca, navegación centrada, y un botón a Documentación.

«Documentación» está en los dos lados, así que **nunca se muestra dos
veces**: en escritorio manda el botón y el enlace del centro se oculta; abajo
de 44rem la grilla colapsa a dos filas, el botón se va y el enlace vuelve.
Son complementarios.

Sobre una página que abre con hero oscuro (`heroOscuro` en el layout), la
barra arranca transparente con marca y enlaces en blanco, y recupera el
estado claro apoyado apenas empieza el scroll.

**Pendiente de decisión — hay tres azules:**

| Azul                | Valor     | De dónde sale          |
| ------------------- | --------- | ---------------------- |
| Logo de la Fundación| `#093B9A` | El archivo de marca    |
| Acento del sitio    | `#2563EB` | La paleta del cliente  |
| Azul noche          | `#14213D` | La paleta del cliente  |

El logo y el acento quedan uno al lado del otro en la barra superior y la
diferencia se nota. Hay que unificar: lo más directo es llevar `--azul-600`
a `#093B9A` (mantiene 9.5:1 sobre el fondo), o dejar el logo como marca
institucional y el `#2563EB` como color de acción, asumiendo que conviven.

## Renders

Van en `src/assets/renders/` con el nombre que espera cada slot —
`Render.astro` los busca por nombre con `import.meta.glob`. Sumar un render
es dejar el archivo ahí, sin tocar código; el que falta se dibuja como lámina
rayada con su nombre.

Los originales pesados quedan en `renders-originales/` (fuera de git). Las
copias de trabajo son WebP a 2000px de ancho máximo, calidad 84: los tres de
las áreas bajaron de ~2 MB a ~150 KB cada uno.

Cargados: `hero-proyecto`, `area-formacion`, `area-laboratorios`,
`area-innovacion`, `implantacion`, `esp-comunes-01` … `esp-comunes-07`.

## Hero de «Nuestro proyecto»

Render a pantalla completa (`100svh`) con el texto anclado abajo a la
izquierda y dos velos en azul noche entre la imagen y el texto.

**El velo se calibró contra el render real, no a ojo.** La luminancia media
bajo el texto es 138/255: con la rampa que pedía la especificación el
antetítulo quedaba en 3.4:1, por debajo del mínimo AA para 11px. Subiendo la
rampa inferior y llevando el antetítulo de `#9dc0ff` a `#b8d4ff` llega a
6.7:1, y el título a 10:1. Si mañana entra un render más claro, hay que
volver a medir.

La línea del recorrido cruza el hero aclarada: el trazo usa un degradé cuyo
corte se calcula en JavaScript, exactamente donde termina el hero.

## Hero de «Documentación»

Fondo a pantalla completa con la placa de marca del cliente
(`public/marca/placa-centro-tecnologico.jpg`). El degradé azul → naranja y el
lockup son **parte de la imagen**: no se recrean en CSS ni se le superpone
ninguna marca.

Dos decisiones que importan:

- **El mismo degradé existe también en CSS**, como fondo de la sección. No es
  redundancia: evita el destello blanco del primer frame y, si el archivo
  falta, el hero maqueta igual y se ve intencional.
- **El encuadre se decide por proporción, no por ancho.** La placa es
  apaisada (≈3:2); en cualquier viewport más alto que ese ratio `cover`
  recortaría los laterales y se comería la esquina naranja, así que desde
  `max-aspect-ratio: 3/2` se ancla a la derecha. Un monitor 4:3 lo necesita
  tanto como un teléfono.

El velo es uno solo y sólo en el tramo inferior: arriba el degradé y el
lockup tienen que verse limpios. Sobre el hero, la línea del recorrido y su
nodo van en blanco (`--red-alto`), y vuelven al azul en la sección siguiente.

## Documentación

**No hay contraseña en el sitio.** Los documentos se enlazan a Google Drive y
el permiso lo gestiona la Fundación desde ahí: quien no tenga acceso ve la
pantalla de «Solicitar acceso» de Google. Es más seguro que una clave en el
sitio —no hay nada que circule ni que se filtre— y no necesita servidor: las
tres páginas son estáticas.

La versión anterior, con contraseña y endpoint autenticado, quedó guardada en
`descartado/acceso-por-contrasena/` por si hace falta volver.

## Carrusel

Un espacio con más de un render se muestra en carrusel. En `contenido.ts`
cada espacio declara `renders: string[]`: con uno se dibuja la lámina
simple, con varios entra `Carrusel.astro`. No hay que tocar código para
sumar vistas a un espacio.

El mecanismo es **scroll-snap nativo**: se arrastra con el dedo, se recorre
con la rueda y funciona sin JavaScript. Los botones, el contador y las
flechas del teclado son mejoras encima, no el motor. Se ve a propósito un
pedazo de la lámina siguiente: eso avisa que hay más, sin necesidad de
puntitos.

Sin autoplay. En un sitio institucional el visitante decide cuándo avanzar,
y una imagen que se mueve sola compite con la lectura.

Accesibilidad: `aria-roledescription` de carrusel y diapositiva, contador en
`aria-live`, botones con etiqueta, pista enfocable con flechas, y
`scroll-behavior: auto` bajo `prefers-reduced-motion`.

## Qué falta

- **Renders.** Los del edificio y los doce espacios del recorrido.
- **PDFs.** En `documentos/`, con los nombres del README de esa carpeta.
