# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (confirmed by the user). Static site with one server-rendered area: the documentation download gate needs server-side validation, so the project runs a hybrid adapter rather than a pure static build.

**Deploy target: undecided.** Netlify is the working assumption (free tier covers the functions the gate needs); swapping to Vercel is an adapter change plus an env var. Confirm before launch.

## Users

Two audiences, weighted toward the first.

**Primary — institutional decision-makers.** Provincial and municipal government officials, executives at energy/mining/metalworking companies, university and technical-school leadership, and potential funders. They arrive to judge whether the Centro Tecnológico is real, credible, and worth backing. They are evaluating a proposal, often before a meeting, often on a phone. They want the scale, the evidence, and the technical documentation — and they want to know who is behind it.

**Secondary — the San Rafael community.** Students, families, technical-school teachers, and local businesses who want to understand what is being built in Parque Norte and what it means for the region.

## Product Purpose

Present the Centro Tecnológico Carlos José Tassaroli — its purpose, program, architecture, and supporting documentation — so that public and private actors decide to join the project.

The site is not a brochure for a finished building. It is the public case for a project at the anteproyecto stage, made by a foundation that has already put nine hectares and a working precedent behind it. Success is an institutional visitor who leaves convinced the project is credible and consequential, and who requests the documentation.

## Positioning

The Fundación Tassaroli is not proposing a training center in the abstract. It has:

- already run the **Centro de Formación Profesional Carlos José Tassaroli** for about three years, alongside technical schools, universities, companies and public bodies — a working precedent, not a promise;
- **committed nine hectares** of its own land to the larger vision;
- the backing of **Metalúrgica Tassaroli S.A.**, a San Rafael company operating since 1953 in oil, mining and renewable energy, with ISO 9001 and API Spec Q1 certification and bases across South America.

The Centro is framed as the **first of a new generation of Centros Tecnológicos Sectoriales de Mendoza**, and as the seed of a future Polo Científico, Tecnológico, Educativo y de Innovación del Sur de Mendoza.

## Operating Context

- **Location:** Parque Norte, ciudad de San Rafael, Mendoza, Argentina.
- **Regional case:** southern Mendoza sits near the Vaca Muerta unconventional oil and gas fields (cuenca neuquina) and the mineral resources of Malargüe. There is a confirmed gap between the qualified labour the region's productive matrix demands and the trained people available.
- **Educational base:** San Rafael holds a higher-education community of more than 10,000 students, led by UTN Regional San Rafael, UNCuyo and Universidad de Mendoza, plus more than seven industrial-orientation secondary schools.
- **Target sectors:** metalmecánica, minería, hidrocarburos, energía.
- **Model:** público-privado.
- **Architecture:** anteproyecto by Estudio Lucchesi. Industrial contemporary language — exposed metal structure, exposed concrete, light metal cladding. Passive environmental strategy: orientation, solar control, cross ventilation, natural light, preservation of existing trees.
- **President of the Fundación:** Antonella Tassaroli. The letter presenting the project on the "Nuestro proyecto" page is signed by her and is confirmed first-party copy.

## Capabilities and Constraints

**Site scope:** three pages — Inicio, Nuestro proyecto, Documentación. Content is confirmed and comes from the client's existing Google Sites; it is preserved in substance, not invented.

**Documentation gate (client requirement).** Downloads must be restricted by password. This must be enforced server-side: a client-side check would be decorative, since anyone can read the page source. Implementation: files are not published to the public directory; an endpoint validates a password held in an environment variable and only then serves the file. The current Google Drive links are shared "anyone with the link" and must be locked down, or the gate is meaningless.

**Language:** Spanish (Argentina). No second language requested.

**Program of the Centro — three areas:**
1. Formación y Entrenamiento en Realidad Industrial — training and certification in technical specializations driven by regional demand, taught in real industrial settings.
2. Laboratorios de Ensayos, Análisis e Investigación — research plus analysis and technology consulting services; corrosion, chemical analysis, samples, metallography.
3. Innovación y Desarrollo Tecnológico — creation, design, prototyping, intellectual-property management; "del problema al prototipo."

**Spaces documented in the anteproyecto:** espacios comunes, sala de reuniones, salas de encuentro, auditorio (150–200 people, TED-style tiering), circulaciones, laboratorios, aulas, HUB IDI, coworking, baños y vestuarios, taller, exteriores.

**Undecided:** deploy target; whether a contact channel is added (the current site has none).

## Brand Commitments

- **Name:** Fundación Tassaroli. The building is the **Centro Tecnológico Carlos José Tassaroli**, named for the founder of Metalúrgica Tassaroli (company founded 1953).
- **Logo and palette:** the client is providing the logo and brand colours. Until they arrive, the visual system must keep colour and mark in swappable tokens so adopting the real identity is a single-file change.
- **Voice:** institutional, declarative, unhedged. The existing copy uses lines like "AQUÍ SE CONSTRUYE EL FUTURO" and "Hay proyectos que nacen para resolver un problema. Y hay otros que nacen para transformar una realidad." Preserve that register; do not soften it into generic non-profit prose.

## Evidence on Hand

**Confirmed and usable:**
- Full text of all three pages of the client's Google Sites.
- The president's letter (Antonella Tassaroli), verbatim.
- Descriptions of all twelve spaces in the anteproyecto, verbatim.
- The figure "Mendoza necesita 23.000 personas formadas para 2030" — presented on the client's site as a quotation.
- Capacity target: more than 1,000 people trained per year.
- Nine hectares committed by the Fundación.
- Documentation set: memoria técnica; listado de restricciones y condicionantes; listado de opciones o esquemas conceptuales; informe fotográfico y plano catastral; informe de situación legal y verificación normativa; informe de criterios sustentables; informe de compatibilidad patrimonial/ambiental; informe comercial o de demanda potencial; documento técnico descriptivo. Plans: planta nivel 0.00m, planta nivel +3.00m, planta de evacuación 0.00m, planta de evacuación +3.00m, esquema estructural general.

**Not on hand — must not be fabricated:**
- **Architectural renders.** Roughly 30 exist on the client's site but are locked behind Google's CDN (CORS and referer blocked). The client is sending originals. Every image slot is built to the right aspect ratio and named, awaiting the real files.
- **Logo files and brand palette.** Client is sending them.
- **The documentation PDFs themselves.** Currently on a Google Drive folder that requires login.
- **Contact details.** The current site publishes no email, phone, or address for the Fundación. None may be invented. (Metalúrgica Tassaroli S.A. publishes Av. Mitre 3495, San Rafael — but that is the company, not the Fundación, and the two must not be conflated.)
- No testimonials, partner logos, funding figures, or construction timeline exist. Do not create them.

## Product Principles

1. **Evidence over adjectives.** This project's strength is that it has already been done once at smaller scale, with land committed and documentation produced. Lead with what is real and countable; the copy already avoids hedging, and the design should too.
2. **The architecture is the argument.** The renders are the most persuasive asset. Design so they carry the page rather than sitting in decorative frames.
3. **Two readers, one path.** An official skimming on a phone before a meeting and a neighbour reading in full must both be served by the same page — depth available, never mandatory.
4. **The gate must be real.** Restricted documentation is a client requirement, not a visual affordance. If it cannot be enforced server-side, it must not be presented as protection.
5. **Preserve first-party voice.** The president's letter and the space descriptions are the client's words. Reformat freely; do not rewrite.

## Accessibility & Inclusion

No client-specific standard was set. Institutional and public-sector visitors make WCAG 2.1 AA the working floor: real text contrast, keyboard-reachable navigation and gate, visible focus, honoured `prefers-reduced-motion` (the design leans on scroll motion, so this matters), and meaningful alternative text on every render.
