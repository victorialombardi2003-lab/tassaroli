# Documentación restringida

Los PDF del anteproyecto van **acá**, no en `public/`.

Esa distinción es toda la seguridad del sistema: lo que está en `public/`
queda publicado en internet con una URL adivinable. Lo que está en esta
carpeta sólo sale por el endpoint `/api/doc/[slug]`, que primero verifica la
cookie de acceso.

Esta carpeta está en `.gitignore`: los archivos no se suben al repositorio.
Se cargan en el servidor al desplegar.

## Nombres exactos

El endpoint los busca por nombre. Tienen que llamarse así:

### Informes

| Archivo                                          | Documento                                       |
| ------------------------------------------------ | ----------------------------------------------- |
| `memoria-tecnica.pdf`                            | Memoria técnica                                 |
| `restricciones-y-condicionantes.pdf`             | Listado de restricciones y condicionantes       |
| `esquemas-conceptuales.pdf`                      | Listado de opciones o esquemas conceptuales     |
| `informe-fotografico-y-plano-catastral.pdf`      | Informe fotográfico y plano catastral           |
| `situacion-legal-y-verificacion-normativa.pdf`   | Informe de situación legal y verificación normativa |
| `criterios-sustentables.pdf`                     | Informe de criterios sustentables               |
| `compatibilidad-patrimonial-ambiental.pdf`       | Informe de compatibilidad patrimonial y ambiental |
| `informe-comercial-demanda-potencial.pdf`        | Informe comercial o de demanda potencial        |
| `documento-tecnico-descriptivo.pdf`              | Documento técnico descriptivo                   |

### Láminas

| Archivo                            | Lámina                              |
| ---------------------------------- | ----------------------------------- |
| `planta-nivel-0.00m.pdf`           | Planta nivel 0.00m                  |
| `planta-nivel-3.00m.pdf`           | Planta nivel +3.00m                 |
| `evacuacion-nivel-0.00m.pdf`       | Planta de evacuación nivel 0.00m    |
| `evacuacion-nivel-3.00m.pdf`       | Planta de evacuación nivel +3.00m   |
| `esquema-estructural-general.pdf`  | Esquema estructural general         |

Un archivo que falte no rompe nada: la fila aparece como **No disponible**
hasta que el PDF esté cargado.

## Importante

Mientras los mismos archivos sigan compartidos en Google Drive como
«cualquier persona con el enlace», la contraseña de este sitio no protege
nada: alcanza con tener el link viejo. Hay que restringir la carpeta de
Drive.
