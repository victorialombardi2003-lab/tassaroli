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

  1. Poné los PDF originales en `documentos-a-proteger/`
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

ENTRADA = Path("documentos-a-proteger")
SALIDA = Path("documentos-protegidos")

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

    archivos = sorted(p for p in ENTRADA.iterdir() if p.suffix.lower() == ".pdf")
    if not archivos:
        print(f"No hay PDF en {ENTRADA}/.")
        return

    print(f"{len(archivos)} archivo{'' if len(archivos) == 1 else 's'} para proteger.\n")
    clave = pedir_clave()
    SALIDA.mkdir(exist_ok=True)

    print()
    fallados = []
    for origen in archivos:
        destino = SALIDA / origen.name
        try:
            paginas = proteger(origen, destino, clave)
            kb = destino.stat().st_size // 1024
            print(f"  {origen.name[:52]:<54}{paginas:>4} pág   {kb:>6} KB")
        except Exception as e:  # noqa: BLE001 — se informa y se sigue con el resto
            fallados.append((origen.name, e))
            destino.unlink(missing_ok=True)
            print(f"  {origen.name[:52]:<54}  FALLÓ")

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
