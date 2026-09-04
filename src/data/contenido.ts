/**
 * Todo el texto del sitio, tomado del sitio original de la Fundación.
 * La copia institucional es del cliente: se puede reordenar y recomponer,
 * pero no reescribir. Nada de lo que hay acá es inventado.
 */

export const sitio = {
  fundacion: 'Fundación Tassaroli',
  proyecto: 'Centro Tecnológico Carlos José Tassaroli',
  lugar: 'Parque Norte, San Rafael, Mendoza',
  lugarCorto: 'San Rafael · Mendoza',
  descripcion:
    'Anteproyecto del Centro Tecnológico Carlos José Tassaroli: formación, investigación e innovación para el corredor cordillerano de Mendoza.',
} as const;

export const navegacion = [
  { href: '/', nodo: 'INICIO', texto: 'Inicio' },
  { href: '/proyecto', nodo: 'PROYECTO', texto: 'Proyecto Construcción' },
  { href: '/documentacion', nodo: 'DOCUMENTACIÓN', texto: 'Documentación' },
] as const;

/* ---------------------------------------------------------------- inicio */

export const antecedentes = {
  titulo: 'Antecedentes',
  cuerpo: `La Fundación TASSAROLI nace con el propósito de generar y lograr cambios culturales en el corredor cordillerano de Mendoza y provincias vecinas, para impulsar el desarrollo productivo y humano, integrando Educación, Investigación, Tecnología e Industria, generando oportunidades reales en la comunidad, promoviendo la innovación a través del talento formado y fortaleciendo el crecimiento sostenible. Entendiendo que los grandes cambios se lideran y construyen en red, la Fundación TASSAROLI impulsa la articulación público-privada convocando a los actores claves para transformar el futuro energético y productivo de nuestra región.`,
};

export const porQue = {
  titulo: '¿Por qué San Rafael?',
  cuerpo: `El sur de Mendoza ofrece una oportunidad única para el desarrollo Metalmecánico, Hidrocarburos, Minero y Energía. La proximidad a los yacimientos de petróleo y gas no convencionales de Vaca Muerta en la cuenca neuquina y los recursos minerales de Malargüe prometen crecimiento social y económico. Se identifica un gap entre la mano de obra calificada requerida y la disponibilidad de capital humano preparado con las especialidades adecuadas para acompañar las oportunidades productivas que la zona presenta.`,
  sectores: ['Metalmecánica', 'Hidrocarburos', 'Minería', 'Energía'],
};

export const activo = {
  titulo: 'Activo estratégico',
  cuerpo: `San Rafael se consolida como una de las plazas educativas más robustas del interior del país, garantizando una comunidad superior a los 10.000 estudiantes de nivel superior. Liderada por grandes instituciones como la UTN (Universidad Tecnológica Nacional Regional San Rafael), UNCuyo y la Universidad de Mendoza, entre otras. El ecosistema se potencia con un semillero técnico, con más de siete escuelas secundarias de orientación industrial. El Centro Tecnológico articula el talento formado por las instituciones educativas con las oportunidades reales de la matriz productiva, promoviendo —a través de la educación, la innovación y el trabajo conjunto— el desarrollo de capacidades alineadas a las demandas del futuro.`,
  datos: [
    { valor: '+10.000', unidad: 'estudiantes', detalle: 'de nivel superior en San Rafael' },
    { valor: '+7', unidad: 'escuelas', detalle: 'secundarias de orientación industrial' },
    { valor: '3', unidad: 'universidades', detalle: 'UTN Regional San Rafael, UNCuyo, Universidad de Mendoza' },
  ],
};

/**
 * Estado real del proyecto. Las tres cosas son hechos declarados por la
 * Fundación, no promesas: distinguirlas es lo que separa este proyecto de
 * un render bonito.
 */
export const estado = [
  {
    marca: 'Construido',
    titulo: 'Centro de Formación Profesional Carlos José Tassaroli',
    cuerpo:
      'Funcionando hace tres años junto a escuelas técnicas, universidades, empresas y organismos públicos. El modelo de aprender haciendo ya demostró que transforma oportunidades en empleo.',
  },
  {
    marca: 'Dibujado',
    titulo: 'Anteproyecto del Centro Tecnológico',
    cuerpo:
      'Memoria técnica, verificación normativa, criterios sustentables, informe de demanda y documentación gráfica completa. El proyecto está documentado, no enunciado.',
  },
  {
    marca: 'Comprometido',
    titulo: 'Nueve hectáreas',
    cuerpo:
      'La Fundación Tassaroli destinó nueve hectáreas propias para el futuro Polo Científico, Tecnológico, Educativo y de Innovación del Sur de Mendoza.',
  },
];

export const areas = [
  {
    n: 'Área 1',
    titulo: 'Formación y entrenamiento en realidad industrial',
    cuerpo:
      'En vinculación con el sistema educativo, entrenar, formar y certificar en especializaciones técnica o profesional centrada en la demanda de la matriz productiva regional, bajo un esquema de aprendizaje práctico en entornos formativos industriales reales junto a profesionales idóneos especializados.',
    render: 'area-formacion',
    alt: 'Render del área de formación y entrenamiento en realidad industrial del Centro Tecnológico',
  },
  {
    n: 'Área 2',
    titulo: 'Laboratorios de ensayos, análisis e investigación',
    cuerpo:
      'En vinculación con el mundo científico, establecer un sector de laboratorios para la realización de actividades de investigación y para ofrecer servicios de análisis y consultoría tecnológica, centrado en apoyar el desarrollo industrial en el corredor cordillerano de Mendoza y provincias vecinas, facilitando la innovación en los sectores: Metalmecánica, Minería, Hidrocarburos y Energía.',
    render: 'area-laboratorios',
    alt: 'Render del área de laboratorios de ensayos, análisis e investigación',
  },
  {
    n: 'Área 3',
    titulo: 'Innovación y desarrollo tecnológico',
    cuerpo:
      'En vinculación con la demanda productiva, científica y académica, desarrollar una estructura de apoyo integral para la creación, diseño y desarrollo, prototipado, gestión de propiedad intelectual e innovación, para impulsar la competitividad y el desarrollo de soluciones nuevas para la industria nacional.',
    render: 'area-innovacion',
    alt: 'Render del área de innovación y desarrollo tecnológico',
  },
];

export const arquitectura = [
  {
    titulo: 'Sustentabilidad y eficiencia ambiental',
    cuerpo:
      'El proyecto incorpora criterios pasivos de eficiencia energética: orientación adecuada, control solar, ventilación cruzada, aprovechamiento de iluminación natural y preservación de la vegetación existente.',
    render: 'arq-sustentabilidad',
    alt: 'Render mostrando los criterios de eficiencia energética del edificio',
  },
  {
    titulo: 'Emplazamiento y relación con el entorno urbano',
    cuerpo:
      'El proyecto se implanta dentro del Parque Norte, en un predio de gran escala con abundante vegetación y recorridos consolidados. El edificio se concibe como parte de un sistema paisajístico mayor, reforzando la continuidad del espacio público. La implantación prioriza la permeabilidad visual y física, la continuidad peatonal, transiciones graduales entre espacio público e interior y la valorización del arbolado existente, posicionando al edificio como hito tecnológico e institucional.',
    render: 'arq-emplazamiento',
    alt: 'Render del edificio emplazado dentro del Parque Norte',
  },
  {
    titulo: 'Organización funcional',
    cuerpo:
      'El conjunto se estructura en áreas claramente diferenciadas: investigación y laboratorios, HUB I+D+i, capacitación y coworking, y área institucional y pública. Esta zonificación asegura eficiencia operativa, flexibilidad de uso y coexistencia de actividades sin interferencias.',
    render: 'arq-organizacion',
    alt: 'Esquema de organización funcional del conjunto',
  },
  {
    titulo: 'Circulaciones y flujos',
    cuerpo:
      'Se diferencian circulaciones públicas, técnicas y productivas, garantizando seguridad, claridad espacial y funcionamiento simultáneo de las distintas actividades. Los recorridos exteriores se integran al parque y los interiores aseguran control y eficiencia.',
    render: 'arq-circulaciones',
    alt: 'Esquema de circulaciones públicas, técnicas y productivas',
  },
  {
    titulo: 'Sistema constructivo y expresión arquitectónica',
    cuerpo:
      'El lenguaje arquitectónico es industrial contemporáneo, con estructura metálica visible, hormigón visto y cerramientos livianos metálicos. La expresión formal es honesta y tecnológica, donde cada material manifiesta su función.',
    render: 'arq-sistema-constructivo',
    alt: 'Detalle de la estructura metálica vista y el hormigón visto del edificio',
  },
];

export const implantacion = {
  titulo: 'Implantación del proyecto',
  lugar: 'Parque Norte, ciudad de San Rafael, Mendoza, Argentina.',
  render: 'implantacion',
  alt: 'Plano de implantación del Centro Tecnológico en el Parque Norte de San Rafael',
};

export const cierre = {
  lema: 'Aquí se construye el futuro',
};

/* -------------------------------------------------------------- proyecto */

export const carta = {
  epigrafe:
    'Hay proyectos que nacen para resolver un problema. Y hay otros que nacen para transformar una realidad.',
  parrafos: [
    `La Fundación Tassaroli nació con la convicción de que el verdadero desarrollo de una comunidad comienza por la educación, la formación de talentos y la construcción de una cultura que valore el conocimiento, el trabajo y la innovación como motores del progreso. Allí reside la posibilidad de generar un cambio económico, social y cultural duradero.`,
    `Con ese propósito asumimos un desafío concreto: acercar la educación al empleo, reducir las brechas entre la formación técnica y las necesidades de la industria e impulsar alianzas entre el sector educativo, el Estado y las empresas que aceleren el desarrollo de nuestra región. Hace tres años dimos el primer paso con la creación del Centro de Formación Profesional Carlos José Tassaroli. Junto a escuelas técnicas, universidades, empresas y organismos públicos, demostramos que un modelo basado en el aprender haciendo puede transformar oportunidades en empleo y desarrollo.`,
    `Hoy iniciamos una nueva etapa. Presentamos el anteproyecto del edificio definitivo del Centro Tecnológico Carlos José Tassaroli, el primero de una nueva generación de Centros Tecnológicos Sectoriales de Mendoza. Un espacio concebido para formar a más de 1.000 personas por año, integrar educación, investigación, innovación e industria y convertirse en el nodo central de un proyecto mucho más amplio: el futuro Polo Científico, Tecnológico, Educativo y de Innovación del Sur de Mendoza.`,
    `Este Centro se desarrollará sobre las 9 hectáreas que la Fundación Tassaroli ha destinado para hacer realidad esa visión: un ecosistema abierto donde universidades, empresas, organismos públicos, emprendedores y centros de investigación trabajen de manera articulada para impulsar el talento, la innovación, la transferencia tecnológica y la competitividad regional.`,
    `Cada espacio de esta infraestructura ha sido pensado para conectar a las personas con la tecnología, el conocimiento y los desafíos reales del mundo productivo. Porque creemos que las obras que verdaderamente transforman un territorio nacen cuando la visión del sector privado y el compromiso del sector público se unen con un propósito compartido.`,
    `Este proyecto no busca únicamente construir un edificio. Busca construir oportunidades, fortalecer el talento de nuestra región y dejar una infraestructura que trascienda generaciones. Los invito a ser parte de esta visión y a construir, juntos, el ecosistema que hará posible el futuro del Sur de Mendoza.`,
  ],
  firma: 'Antonella Tassaroli',
  cargo: 'Presidenta, Fundación Tassaroli',
};

export const espacios = [
  {
    nodo: 'Espacios comunes',
    titulo: 'Espacios comunes',
    cuerpo:
      'Un entorno flexible diseñado para fomentar encuentros espontáneos, conversaciones productivas y nuevas conexiones. La combinación de mobiliario modular, mesas comunitarias, barras de trabajo y rincones de conversación permite adaptar el espacio a distintas formas de uso: descansar, trabajar, reunirse o intercambiar ideas. Una propuesta dinámica y abierta que promueve la colaboración, la interacción y la construcción de comunidad.',
    renders: [
      'esp-comunes-01',
      'esp-comunes-02',
      'esp-comunes-03',
      'esp-comunes-04',
      'esp-comunes-05',
      'esp-comunes-06',
      'esp-comunes-07',
    ],
    alt: 'Render de los espacios comunes con mobiliario modular y mesas comunitarias',
  },
  {
    nodo: 'Sala de reuniones',
    titulo: 'Sala de reuniones',
    cuerpo:
      'La Sala de reuniones se concibe como un espacio estratégico de encuentro, inspiración y toma de decisiones, suspendido sobre el parque y en permanente conexión con la naturaleza. El recorrido desde el hall genera una transición hacia un ambiente de mayor concentración y reflexión, culminando en un espacio donde el entorno se convierte en protagonista. La arquitectura busca desdibujar los límites entre interior y exterior, permitiendo que los árboles, la luz natural y el paso de las estaciones formen parte de la experiencia. Un espacio pensado para que las ideas, las decisiones y las estrategias de futuro se desarrollen en contacto directo con el entorno, potenciando una experiencia diferencial y un fuerte valor para la innovación y la visión a largo plazo.',
    renders: ['esp-sala-reuniones'],
    alt: 'Render de la sala de reuniones suspendida sobre el parque',
  },
  {
    nodo: 'Salas de encuentro',
    titulo: 'Salas de encuentro',
    cuerpo:
      'Pequeños espacios de reunión distribuidos estratégicamente en el recorrido entre la cocina, el cowork y el área de IDI, diseñados para acompañar la dinámica cotidiana del proyecto. Estas cápsulas ofrecen un entorno flexible para reuniones rápidas, conversaciones privadas, definiciones operativas, videoconferencias y cierre de acuerdos, optimizando el uso de los espacios formales y favoreciendo una cultura de trabajo ágil, colaborativa y conectada.',
    renders: ['esp-salas-encuentro-01', 'esp-salas-encuentro-02'],
    alt: 'Render de las cápsulas de reunión distribuidas en el recorrido',
  },
  {
    nodo: 'Auditorio',
    titulo: 'Auditorio',
    cuerpo:
      'Auditorio para 150 a 200 personas, con gradas suaves que garantizan excelente visibilidad y una sensación de cercanía con el expositor. Su configuración busca una experiencia dinámica e inmersiva, inspirada en el formato TED Conference, promoviendo una relación más directa y participativa entre el público y el expositor. Las fachadas laterales vidriadas presentan dos tratamientos: una con vista abierta e inmersiva hacia el parque, integrando el paisaje al salón; y otra con malla metálica microperforada de diseño orgánico, que aporta control solar, identidad arquitectónica y filtrado de luz.',
    renders: ['esp-auditorio-01', 'esp-auditorio-02', 'esp-auditorio-03'],
    alt: 'Render del auditorio con gradas suaves y fachada vidriada hacia el parque',
  },
  {
    nodo: 'Circulaciones',
    titulo: 'Circulaciones',
    cuerpo:
      'La circulación del edificio se organiza como una red de recorridos que conecta los principales nodos de actividad: Talleres, Aulas, Laboratorios, Cowork e IDI. Se propone un sistema de orientación integrado a la arquitectura mediante líneas, texturas o iluminación, inspirado en circuitos tecnológicos y ondas sonoras. Cada recorrido tendrá una identidad propia, guiando intuitivamente a las personas y reforzando la idea de una red de conocimiento en movimiento, sin competir visualmente con el espacio ni interferir con la conexión hacia el parque. La señalización se integra al lenguaje arquitectónico como parte de la experiencia, evitando la percepción de una señalética tradicional.',
    renders: [
      'esp-circulaciones-01',
      'esp-circulaciones-02',
      'esp-circulaciones-03',
      'esp-circulaciones-04',
      'esp-circulaciones-05',
      'esp-circulaciones-06',
    ],
    alt: 'Render de las circulaciones con el sistema de orientación integrado a la arquitectura',
  },
  {
    nodo: 'Laboratorios',
    titulo: 'Laboratorios',
    cuerpo:
      'Un espacio especializado para la investigación, el desarrollo y la innovación aplicada, equipado con áreas destinadas al análisis y estudio de materiales. El laboratorio integra sala de corrosión, análisis químicos, muestras y metalografía, complementadas por espacios de trabajo ubicados en el acceso a cada área. Una propuesta que articula conocimiento, experimentación y tecnología para impulsar soluciones y nuevos desarrollos industriales.',
    renders: [
      'esp-laboratorios-01',
      'esp-laboratorios-02',
      'esp-laboratorios-03',
      'esp-laboratorios-05',
      'esp-laboratorios-06',
      'esp-laboratorios-07',
      'esp-laboratorios-08',
    ],
    alt: 'Render del laboratorio de ensayos y análisis de materiales',
  },
  {
    nodo: 'Aulas',
    titulo: 'Aulas',
    cuerpo:
      'El proyecto incorpora un sistema educativo innovador, con aulas especializadas diseñadas para responder a las nuevas demandas de la formación tecnológica e industrial. En planta baja se ubican espacios destinados a laboratorio, neumática, sensores, programación y simulación de robots, junto con aulas taller. En planta alta, cuatro aulas complementan el programa educativo, conformando un entorno flexible y contemporáneo. La conexión visual con el taller a través de la doble altura y la estructura metálica liviana refuerzan la integración entre aprendizaje, tecnología y práctica.',
    renders: [
      'esp-aulas-01',
      'esp-aulas-02',
      'esp-aulas-03',
      'esp-aulas-04',
      'esp-aulas-05',
      'esp-aulas-06',
      'esp-aulas-07',
      'esp-aulas-08',
      'esp-aulas-09',
      'esp-aulas-10',
    ],
    alt: 'Render de las aulas con conexión visual al taller a través de la doble altura',
  },
  {
    nodo: 'HUB IDI',
    titulo: 'HUB IDI',
    cuerpo:
      'El espacio de IDI se concibe como un laboratorio de innovación y desarrollo orientado a transformar desafíos industriales en soluciones concretas. Bajo el concepto “Del Problema al Prototipo”, el área integra diseño, experimentación y validación, manteniendo una conexión visual directa con el taller. Esta relación permite seguir el recorrido completo de una idea: desde su concepción y desarrollo hasta su materialización, generando un entorno donde la innovación se transforma en tecnología aplicada.',
    renders: [
      'esp-hub-idi-01',
      'esp-hub-idi-02',
      'esp-hub-idi-03',
      'esp-hub-idi-04',
    ],
    alt: 'Render del HUB de innovación y desarrollo con conexión visual al taller',
  },
  {
    nodo: 'Coworking',
    titulo: 'Coworking',
    cuerpo:
      'Un espacio concebido como una extensión natural de la creatividad y la innovación del Centro Tecnológico. Un entorno flexible y colaborativo donde las ideas se desarrollan tanto en el trabajo individual como en los encuentros espontáneos y alrededor de una mesa de café. La tecnología acompaña y potencia la experiencia, pero las personas son el centro, favoreciendo el intercambio, la conexión y la generación de nuevas ideas. Un ecosistema vivo donde conocimiento, creatividad, colaboración e innovación conviven de manera natural.',
    renders: [
      'esp-coworking-01',
      'esp-coworking-02',
      'esp-coworking-03',
      'esp-coworking-04',
      'esp-coworking-05',
    ],
    alt: 'Render del espacio de coworking',
  },
  {
    nodo: 'Baño y vestuarios',
    titulo: 'Baño y vestuarios',
    cuerpo:
      'Espacios de alta calidad y uso flexible, preparados para alumnos, docentes, empresas, visitantes, actividades industriales y eventos de público masivo. Integran sanitarios, lockers y duchas, con una estética contemporánea que evoluciona hacia un lenguaje más minimalista, luminoso y tecnológico, en sintonía con el ecosistema de innovación y la identidad del Centro Tecnológico.',
    renders: [
      'esp-banos-vestuarios-01',
      'esp-banos-vestuarios-02',
      'esp-banos-vestuarios-03',
      'esp-banos-vestuarios-04',
      'esp-banos-vestuarios-05',
    ],
    alt: 'Render de los baños y vestuarios con sanitarios, lockers y duchas',
  },
  {
    nodo: 'Taller',
    titulo: 'Taller',
    cuerpo:
      'Un espacio tecnológico de vanguardia pensado para potenciar la formación y la innovación industrial. El taller integra equipamiento especializado, tecnología de fabricación avanzada y áreas de ensayo, articuladas en un espacio de doble altura que conecta aulas y áreas prácticas. Su resolución en estructura metálica liviana refuerza una arquitectura flexible, contemporánea y preparada para acompañar el crecimiento y la evolución tecnológica.',
    renders: [
      'esp-taller-01',
      'esp-taller-02',
      'esp-taller-03',
      'esp-taller-04',
      'esp-taller-05',
      'esp-taller-06',
      'esp-taller-07',
      'esp-taller-08',
      'esp-taller-09',
      'esp-taller-10',
      'esp-taller-11',
    ],
    alt: 'Render del taller de doble altura con estructura metálica liviana',
  },
  {
    nodo: 'Exteriores',
    titulo: 'Exteriores',
    cuerpo:
      'El objetivo es que el Master Plan construya la idea de un parque de aprendizaje donde, naturalmente, existe un edificio. La experiencia educativa, cultural, tecnológica y humana comienza desde el primer paso dentro del predio y acompaña al visitante a lo largo de todo el recorrido hasta el acceso principal. El exterior se concibe como una extensión activa del Centro Tecnológico, un espacio de encuentro, trabajo, contemplación, creatividad e inspiración, donde naturaleza y conocimiento conviven de manera integrada. El visitante no debe sentir que llega simplemente a un edificio, sino que ingresa a una experiencia que transmite desde el primer momento los valores de innovación, curiosidad, conocimiento, creatividad, bienestar y encuentro humano, convirtiendo al paisaje en una de las principales señas de identidad del Centro Tecnológico Carlos José Tassaroli.',
    renders: [
      'esp-exteriores-01',
      'esp-exteriores-02',
      'esp-exteriores-03',
      'esp-exteriores-04',
      'esp-exteriores-05',
      'esp-exteriores-06',
      'esp-exteriores-07',
      'esp-exteriores-08',
      'esp-exteriores-09',
      'esp-exteriores-10',
      'esp-exteriores-11',
      'esp-exteriores-12',
      'esp-exteriores-13',
      'esp-exteriores-14',
      'esp-exteriores-15',
      'esp-exteriores-17',
      'esp-exteriores-18',
      'esp-exteriores-19',
      'esp-exteriores-20',
    ],
    alt: 'Render de los exteriores y el parque de aprendizaje',
  },
];

export const proposito = {
  cita: 'Mendoza necesita 23.000 personas formadas para 2030.',
  titulo: 'Un propósito transformador',
  cuerpo:
    'Transformar talento en desarrollo productivo sostenible. El Centro Tecnológico, a través de un modelo Público-Privado, conectará educación, investigación, tecnología e industria para formar las capacidades que demanda el futuro, impulsando la innovación, la empleabilidad y el crecimiento económico de la región.',
};

/* --------------------------------------------------------- documentación */


/**
 * La proteccion viaja con el archivo, no con el link.
 *
 * Cada PDF esta encriptado con AES-256 y no abre sin la clave. Se eligio
 * asi, y no una contrasena en el sitio, porque una contrasena en el sitio
 * solo cuida el camino hasta la descarga: una vez bajado, el archivo queda
 * suelto. Encriptado sigue cerrado aunque alguien lo reenvie.
 *
 * Los links de Drive pueden entonces quedar como estan; lo que se controla
 * es a quien se le da la clave. Se generan con herramientas/proteger-pdf.py.
 */

const DRIVE_ARCHIVO = 'https://drive.google.com/file/d/';
const DRIVE_CARPETA = 'https://drive.google.com/drive/folders/';

export type Documento = {
  slug: string;
  lema: string;
  bajada: string;
  titulo: string;
  drive: string;
};

export const documentos: Documento[] = [
  {
    slug: 'memoria-tecnica',
    lema: 'Del concepto a la construcción',
    bajada:
      'La memoria técnica reúne las decisiones, sistemas y estrategias que transforman la idea proyectual en una obra posible.',
    titulo: 'Memoria técnica',
    drive: `${DRIVE_ARCHIVO}17SjwW9n3_pYq-qWTMGLSxXam8HQvDXDA/view`,
  },
  {
    slug: 'restricciones',
    lema: 'Las reglas del proyecto',
    bajada: 'Condiciones, restricciones y oportunidades que determinan las decisiones proyectuales.',
    titulo: 'Listado de restricciones y condicionantes',
    drive: `${DRIVE_ARCHIVO}12qTEn00-NKr6SjxgUewq5n1Ia0XQt8UM/view`,
  },
  {
    slug: 'esquemas-conceptuales',
    lema: 'De la idea a la forma',
    bajada: 'Esquemas conceptuales que muestran la evolución de las primeras ideas hacia una propuesta definida.',
    titulo: 'Listado de opciones o esquemas conceptuales',
    drive: `${DRIVE_ARCHIVO}1obpXv7Owah-YDwIv-8WOPGjNviyunGnh/view`,
  },
  {
    slug: 'informe-fotografico',
    lema: 'Conocer el sitio',
    bajada: 'Un registro del lugar y su contexto a través de imágenes, datos y documentación catastral.',
    titulo: 'Informe fotográfico y plano catastral',
    drive: `${DRIVE_ARCHIVO}16V9wI3-8jrxhtBPK1S5unOT_gJPZpXp6/view`,
  },
  {
    slug: 'situacion-legal',
    lema: 'Validar para proyectar',
    bajada: 'La revisión legal y normativa como base para garantizar la viabilidad del proyecto.',
    titulo: 'Informe de situación legal y verificación normativa',
    drive: `${DRIVE_ARCHIVO}1lofIC6RjEuJ6xSk9P7G1EMvUYhkDC9Ke/view`,
  },
  {
    slug: 'criterios-sustentables',
    lema: 'Proyectar con conciencia',
    bajada:
      'Estrategias sustentables que integran las condiciones del entorno, los recursos y el funcionamiento del proyecto.',
    titulo: 'Informe de criterios sustentables',
    drive: `${DRIVE_ARCHIVO}1YwaBgCKtfcUnvtVKOZvQB2CaloFhRx2T/view`,
  },
  {
    slug: 'compatibilidad',
    lema: 'Intervenir con criterio',
    bajada: 'Análisis de compatibilidad para garantizar una intervención integrada y respetuosa con su entorno.',
    titulo: 'Informe de compatibilidad patrimonial y ambiental',
    drive: `${DRIVE_ARCHIVO}1iB9PHVU-VJ9-BXjLQKFY3_zsVYoEZ2Lj/view`,
  },
  {
    slug: 'demanda-potencial',
    lema: 'Oportunidad y demanda',
    bajada: 'Análisis del contexto comercial y de los potenciales usuarios de la propuesta.',
    titulo: 'Informe comercial o de demanda potencial',
    drive: `${DRIVE_ARCHIVO}1Nv5pSgwu18Gw6qh9dR7-zHsBK9StF3WJ/view`,
  },
  {
    slug: 'documento-tecnico',
    lema: 'El proyecto en detalle',
    bajada: 'Una descripción integral de los espacios, materiales, sistemas y criterios que conforman el proyecto.',
    titulo: 'Documento técnico descriptivo',
    drive: `${DRIVE_ARCHIVO}1kBIWopSubDF1oBtoySbgzJLIombzhVcK/view`,
  },
];

export const planos = {
  titulo: 'Anteproyecto',
  bajada:
    'Representación gráfica de la propuesta arquitectónica, donde se definen la organización espacial, distribución de los usos, circulaciones y principales decisiones de diseño.',
  carpeta: `${DRIVE_CARPETA}1cVeEjfFg76UYbVsje7UMW2X2V21jPx_6`,
  laminas: [
    'Planta nivel 0.00m',
    'Planta nivel +3.00m',
    'Planta de evacuación nivel 0.00m',
    'Planta de evacuación nivel +3.00m',
    'Esquema estructural general',
  ],
};

export const acceso = {
  titulo: 'La documentación está protegida',
  cuerpo:
    'Los documentos se descargan desde Google Drive, pero están protegidos con contraseña: para abrirlos hace falta una clave que entrega la Fundación a quien la solicite.',
};
