"""
Le pone contraseña a los PDF de la documentación.

La clave se pide por teclado y no se muestra ni queda guardada en ningún
lado: ni en este archivo, ni en el historial de la terminal, ni en el
repositorio. Si hace falta cambiarla, se vuelve a correr sobre los
originales, que nunca se tocan.

Encripta con AES-256, que es lo que hoy resiste. El default histórico del
formato PDF es RC4 de 40 bits, que se rompe en minutos con herramientas que
se bajan gratis; por eso acá está forzado y no es configurable.

Cómo se usa:

  1. Bajá las carpetas de Drive (botón derecho sobre la carpeta →
     Descargar) y descomprimí los zip dentro de `documentos-a-proteger/`.
     No hace falta sacar los PDF de sus carpetas: se buscan también en las
     subcarpetas y la salida conserva la misma estructura, así que después
     cada archivo vuelve a Drive a donde estaba.
  2. python herramientas/proteger-pdf.py
  3. Escribí la clave (no se va a ver mientras la tipeás) y confirmala
  4. Subí a Drive lo que quedó en `documentos-protegidos/`

Los originales quedan intactos donde estaban.
"""

import getpass
import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.errors import FileNotDecryptedError

# La consola de Windows no siempre arranca en UTF-8, y ahí un acento no sólo
# se ve mal: puede cortar el script a mitad de camino con un error de
# codificación, dejando algunos archivos protegidos y otros no. Con esto la
# salida nunca falla por un carácter.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Las carpetas se buscan al lado de este script, no donde esté parada la
# terminal. Si dependieran del directorio actual, correrlo desde adentro de
# `documentos-a-proteger` —que es lo natural, porque es donde uno acaba de
# dejar los archivos— no encontraría nada y no quedaría claro por qué.
RAIZ = Path(__file__).resolve().parent.parent
ENTRADA = RAIZ / "documentos-a-proteger"
SALIDA = RAIZ / "documentos-protegidos"

# Una clave corta se rompe probando combinaciones, y un PDF encriptado se
# puede atacar sin límite de intentos porque el atacante lo tiene en su
# máquina. No hay portero que lo frene después del quinto intento fallido.
MINIMO = 12


def pedir_clave() -> str:
    clave = getpass.getpass("Clave para los PDF (no se ve al tipear): ")
    if len(clave) < MINIMO:
        print(f"\nMuy corta: hacen falta al menos {MINIMO} caracteres.")
        print("Un PDF encriptado se ataca sin límite de intentos, así que")
        print("la única defensa es el largo. Una frase de cuatro palabras")
        print("sirve y es más fácil de dictar por teléfono que ocho signos.")
        sys.exit(1)
    if clave != getpass.getpass("Repetila para confirmar: "):
        print("\nNo coinciden. No se hizo nada.")
        sys.exit(1)
    return clave


def proteger(origen: Path, destino: Path, clave: str) -> int:
    lector = PdfReader(origen)
    paginas = len(lector.pages)

    escritor = PdfWriter()
    escritor.append(lector)
    # `user_password` es la que importa: sin ella el documento no abre. La de
    # propietario sola no sirve de nada, porque solo pide permisos y casi
    # todos los lectores la ignoran. Van las dos iguales para no tener un
    # segundo secreto que después nadie recuerda.
    escritor.encrypt(user_password=clave, owner_password=clave, algorithm="AES-256")
    with destino.open("wb") as f:
        escritor.write(f)

    # Verificación, porque "encripté los archivos" sin comprobarlo es una
    # suposición, y la que se paga cara es justamente ésta.
    control = PdfReader(destino)
    if not control.is_encrypted:
        raise RuntimeError(f"{destino.name}: quedó sin encriptar")
    try:
        _ = control.pages[0]
    except FileNotDecryptedError:
        pass  # es lo que tiene que pasar: sin clave no se puede leer
    else:
        raise RuntimeError(f"{destino.name}: abre sin clave")

    abierto = PdfReader(destino)
    if not abierto.decrypt(clave):
        raise RuntimeError(f"{destino.name}: no abre ni con la clave")
    if len(abierto.pages) != paginas:
        raise RuntimeError(
            f"{destino.name}: quedó con {len(abierto.pages)} páginas y el original tenía {paginas}"
        )
    return paginas


def main() -> None:
    if not ENTRADA.is_dir():
        ENTRADA.mkdir(parents=True)
        print(f"Creé la carpeta {ENTRADA}/. Poné ahí los PDF y volvé a correr esto.")
        return

    # rglob y no iterdir: las carpetas bajadas de Drive vienen dentro de un
    # zip que al descomprimirse deja su propia carpeta. Buscar en profundidad
    # evita tener que desarmar eso a mano, que es donde se traspapela uno.
    archivos = sorted(p for p in ENTRADA.rglob("*") if p.suffix.lower() == ".pdf")
    if not archivos:
        print(f"No hay PDF en {ENTRADA}/ ni en sus subcarpetas.")
        return

    print(f"{len(archivos)} archivo{'' if len(archivos) == 1 else 's'} para proteger.\n")
    clave = pedir_clave()
    SALIDA.mkdir(exist_ok=True)

    print()
    fallados = []
    for origen in archivos:
        # La salida repite la estructura de la entrada, así que cada archivo
        # vuelve a Drive a la carpeta de la que salió.
        relativo = origen.relative_to(ENTRADA)
        destino = SALIDA / relativo
        destino.parent.mkdir(parents=True, exist_ok=True)
        rotulo = str(relativo)
        try:
            paginas = proteger(origen, destino, clave)
            kb = destino.stat().st_size // 1024
            print(f"  {rotulo[:60]:<62}{paginas:>4} pág   {kb:>6} KB")
        except Exception as e:  # noqa: BLE001 — se informa y se sigue con el resto
            fallados.append((rotulo, e))
            destino.unlink(missing_ok=True)
            print(f"  {rotulo[:60]:<62}  FALLÓ")

    print()
    if fallados:
        print("No se pudo con:")
        for nombre, e in fallados:
            print(f"  {nombre}: {e}")
        print()
    listos = len(archivos) - len(fallados)
    print(f"{listos} de {len(archivos)} protegidos y verificados, en {SALIDA}/")
    print("Los originales quedaron intactos.")
    print()
    print("Cada uno se probó: sin la clave no abre, con la clave abre entero.")


if __name__ == "__main__":
    main()
