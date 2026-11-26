#!/usr/bin/env python3
"""Genera Bitacora_Prompts_GuardianMesh.pdf a partir de PROMPTS.md.

Uso:
    pip install markdown          (solo la primera vez)
    python build_prompts_pdf.py

Requiere Google Chrome o Microsoft Edge instalado.

Para sumar la bitácora de otra persona: pega su .md completo al final de
PROMPTS.md y vuelve a ejecutar el script. Cada título de nivel 1 ("# ...")
empieza en una página nueva. La portada no cambia: los integrantes, la
institución y la fecha se editan en las constantes TEAM, INSTITUTION, COURSE y DATE.
"""
from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
import tempfile
from html import escape
from pathlib import Path

try:
    import markdown
except ImportError:
    sys.exit("Falta la librería 'markdown'. Instálala con:  pip install markdown")

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "PROMPTS.md"
OUTPUT = ROOT / "Bitacora_Prompts_GuardianMesh.pdf"
LOGO = ROOT / "assets" / "logo-guardianmesh.png"

# Equipo, institución y fecha de la portada. Es la única fuente: pegar más
# bitácoras en PROMPTS.md no añade ni duplica nombres.
TEAM = (
    "María Paula Rodríguez Muñoz",
    "Felipe Calvache",
    "David Salamanca",
    "Miguel Vanegas",
    "Juan Miguel Rojas",
    "Cristian Silva",
)
INSTITUTION = "Escuela Colombiana de Ingeniería Julio Garavito"
COURSE = "SWNT 2026-2"
DATE = "25/11/2026"

CSS = """
@page { size: A4; margin: 12mm 13mm 14mm;
  @bottom-left { content: "GuardianMesh · SWNT 2026-2"; font: 8pt 'Segoe UI', Arial, sans-serif; color: #5B6B80; }
  @bottom-right { content: counter(page) " / " counter(pages); font: 8pt 'Segoe UI', Arial, sans-serif; color: #5B6B80; } }
@page :first { margin: 0; @bottom-left { content: none; } @bottom-right { content: none; } }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font: 9.2pt/1.42 'Inter', 'Segoe UI', Arial, sans-serif; color: #0F172A; }

.cover { height: 297mm; padding: 38mm 22mm 22mm; background: linear-gradient(150deg, #071D49 0%, #0B2F6E 62%, #0A4DA2 100%);
  color: #fff; display: flex; flex-direction: column; break-after: page; border-bottom: 5mm solid #00B87C; }
.cover .logo { width: 34mm; height: 34mm; background: #fff; border-radius: 7mm; padding: 3mm; object-fit: contain; }
.cover .kicker { margin: 16mm 0 3mm; font-size: 11pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #6FE3B8; }
.cover h1 { margin: 0; font-size: 30pt; line-height: 1.15; max-width: 150mm; color: #fff; border: 0; padding: 0; }
.cover .sub { margin: 6mm 0 0; font-size: 12pt; color: #E2EAF6; max-width: 140mm; }
.cover .note blockquote { margin: 9mm 0 0; max-width: 150mm; background: rgba(255,255,255,.1); border-left-color: #00B87C; color: #E2EAF6; font-size: 9.2pt; line-height: 1.5; }
.cover .meta { margin-top: auto; font-size: 10.5pt; line-height: 1.6; color: #E2EAF6; }
.cover .meta b { color: #fff; }
.cover .meta ul { list-style: none; margin: 1.5mm 0 5mm; padding: 0; }
.cover .meta li { margin: 0; }

section.doc > ul:first-of-type { margin-bottom: 0; }
h1 { font-size: 17pt; line-height: 1.25; color: #071D49; margin: 0 0 4mm; padding-bottom: 2.5mm; border-bottom: 1.2mm solid #00B87C; }
section.doc + section.doc { break-before: page; }
h2 { font-size: 13pt; color: #0B4394; margin: 4mm 0 2.5mm; break-after: avoid; }
h3 { font-size: 11pt; line-height: 1.35; color: #071D49; margin: 3.5mm 0 1.8mm; break-after: avoid; }
h3 code { background: #E3F1FC; color: #0B4394; }
.entry { break-inside: avoid; }
.entry.long { font-size: 8.4pt; line-height: 1.32; }
.entry.long pre { font-size: 6.9pt; line-height: 1.28; padding: 2mm 3mm; }
h3 + ul, p:has(+ pre) { break-after: avoid; }
p { margin: 0 0 1.6mm; orphans: 3; widows: 3; }
ul, ol { margin: 0 0 1.8mm; padding-left: 5mm; }
li { margin-bottom: .2mm; }
hr { border: 0; border-top: .3mm solid #E2E8F0; margin: 2.5mm 0; }
a { color: #0B4394; }
blockquote { margin: 2.5mm 0 0; padding: 2mm 3.5mm; background: #EEF4FB; border-left: 1.2mm solid #00B87C; border-radius: 1.5mm; font-size: 8.4pt; break-inside: avoid; }
blockquote p { margin: 0; }
code { font: .9em 'Consolas', 'Cascadia Mono', Menlo, monospace; background: #EEF4FB; padding: .2mm 1mm; border-radius: 1mm; overflow-wrap: anywhere; }
pre { background: #F1F5F9; border: .3mm solid #E2E8F0; border-left: 1.2mm solid #0B4394; border-radius: 2mm; padding: 2.6mm 3.5mm; margin: .8mm 0 2mm;
  white-space: pre-wrap; overflow-wrap: break-word; font-size: 7.7pt; line-height: 1.38; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
pre code { background: none; padding: 0; font-size: 1em; overflow-wrap: break-word; }

table { width: 100%; border-collapse: collapse; margin: 2mm 0 4mm; font-size: 7.7pt; line-height: 1.32; table-layout: fixed; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th, td { border: .25mm solid #D5DEE9; padding: 1.15mm 1.6mm; vertical-align: top; text-align: left; overflow-wrap: break-word; hyphens: manual; }
th { background: #071D49; color: #fff; font-weight: 700; }
tbody tr:nth-child(even) td { background: #F8FAFC; }
td code { background: none; padding: 0; color: #0B4394; font-size: .94em; }
table { break-inside: avoid; }
table.dense { font-size: 6.4pt; line-height: 1.1; margin: .5mm 0 0; }
table.dense code { font-size: .92em; }
table.dense ~ hr { display: none; }
table.dense th, table.dense td { padding: .25mm 1mm; }
/* encabezado compacto solo en la bitácora con tabla larga, para que ambos quepan en una página */
section.doc:has(table.dense) > ul:first-of-type { font-size: 8.6pt; line-height: 1.28; }
section.doc:has(table.dense) > hr:first-of-type { display: none; }
section.doc:has(table.dense) > h2:first-of-type { margin-top: 1.5mm; margin-bottom: 1mm; }
/* el selector repite la clase para ganar a los anchos generales de 5 columnas */
table.dense.cols-5 th:nth-child(1), table.dense.cols-5 td:nth-child(1) { width: 13%; }
table.dense.cols-5 th:nth-child(2), table.dense.cols-5 td:nth-child(2) { width: 22%; }
table.dense.cols-5 th:nth-child(3), table.dense.cols-5 td:nth-child(3) { width: 24%; }
table.dense.cols-5 th:nth-child(4), table.dense.cols-5 td:nth-child(4) { width: 9%; }
table.dense.cols-5 th:nth-child(5), table.dense.cols-5 td:nth-child(5) { width: 32%; }
table.dense.huge { font-size: 6.2pt; }
table.dense.huge.cols-5 th:nth-child(2), table.dense.huge.cols-5 td:nth-child(2) { width: 24%; }
table.dense.huge.cols-5 th:nth-child(3), table.dense.huge.cols-5 td:nth-child(3) { width: 21%; }
table.dense.huge.cols-5 th:nth-child(4), table.dense.huge.cols-5 td:nth-child(4) { width: 15%; }
table.dense.huge.cols-5 th:nth-child(5), table.dense.huge.cols-5 td:nth-child(5) { width: 27%; }
table.split { break-inside: auto; font-size: 7pt; line-height: 1.22; }
table.split th, table.split td { padding: .7mm 1.4mm; }
/* tabla resumen de 5 columnas: ID · Módulo · Título · Herramienta · Entregable */
table.cols-5 th:nth-child(1), table.cols-5 td:nth-child(1) { width: 15%; white-space: nowrap; }
table.cols-5 th:nth-child(2), table.cols-5 td:nth-child(2) { width: 20%; }
table.cols-5 th:nth-child(3), table.cols-5 td:nth-child(3) { width: 27%; }
table.cols-5 th:nth-child(4), table.cols-5 td:nth-child(4) { width: 12%; }
table.cols-5 th:nth-child(5), table.cols-5 td:nth-child(5) { width: 26%; }
"""


def find_browser() -> str:
    candidates = [os.environ.get("CHROME_PATH", "")]
    for base in (os.environ.get("PROGRAMFILES"), os.environ.get("PROGRAMFILES(X86)"), os.environ.get("LOCALAPPDATA")):
        if base:
            candidates += [rf"{base}\Google\Chrome\Application\chrome.exe", rf"{base}\Microsoft\Edge\Application\msedge.exe"]
    candidates += [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ]
    for name in ("google-chrome", "chromium", "chromium-browser", "microsoft-edge"):
        candidates.append(shutil.which(name) or "")
    for path in candidates:
        if path and Path(path).is_file():
            return path
    sys.exit("No encontré Chrome ni Edge. Define la variable CHROME_PATH con la ruta del navegador.")


def build_html(text: str) -> str:
    body = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])

    def classify(match: re.Match[str]) -> str:
        table = match.group(0)
        head = table.split("</tr>")[0]
        dense = " dense" if table.count("<tr") > 16 else ""  # tablas largas: letra menor para que quepan enteras
        if table.count("<tr") > 26:
            dense += " huge"  # columna de herramienta más ancha: filas más bajas
        if table.count("<tr") > 40:
            dense = " split"  # no cabe en una página: se divide y repite el encabezado
        return table.replace("<table>", f'<table class="cols-{len(re.findall(r'<th[ >]', head))}{dense}">', 1)

    body = re.sub(r"<table>.*?</table>", classify, body, flags=re.S)
    def keep_together(match: re.Match[str]) -> str:
        # cada ficha (título, datos, prompt y resultado) va entera en una página si cabe
        card = match.group(0)
        lines = sum(1 + len(line) // 105 for line in re.sub(r"<[^>]+>", "", card).splitlines() if line)
        if lines >= 95:
            return card
        # las fichas muy largas usan letra menor para caber en una sola página
        return f'<div class="entry{" long" if lines >= 55 else ""}">{card}</div>'

    body = re.sub(r"<h3>.*?(?=<hr />|<h2>|<h1>|\Z)", keep_together, body, flags=re.S)
    # el título de la sección viaja con la primera ficha, para que no quede suelto al pie
    body = re.sub(r'(<h2>[^<]*</h2>)\s*(?:<hr />\s*)?(<div class="entry[^"]*">)', r'\2\1', body)
    # lo que haya antes del primer título (la nota de curaduría) se muestra en la portada
    note, mark, body = body.partition("<h1>")
    body = mark + body
    if not mark:
        note, body = "", note
    parts = [p for p in re.split(r"(?=<h1>)", body) if p.strip()]
    body = "".join(f'<section class="doc">{p}</section>' for p in parts)

    logo = f'<img class="logo" src="{LOGO.as_uri()}" alt="">' if LOGO.is_file() else ""
    team = "".join(f"<li>{escape(name)}</li>" for name in TEAM)
    return f"""<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>Bitácora de Prompts · GuardianMesh</title><style>{CSS}</style></head>
<body>
<div class="cover">
  {logo}
  <p class="kicker">GuardianMesh · {COURSE}</p>
  <h1>Bitácora de Ingeniería de Prompts</h1>
  <p class="sub">Prompts estructurados utilizados para diseñar, desarrollar y documentar la aplicación GuardianMesh.</p>
  <div class="note">{note}</div>
  <div class="meta">
    <b>Equipo responsable:</b>
    <ul>{team}</ul>
    <div><b>Institución:</b> {INSTITUTION}</div>
    <div><b>Asignatura:</b> {COURSE}</div>
    <div><b>Fecha:</b> {DATE}</div>
  </div>
</div>
{body}
</body></html>"""


def main() -> None:
    if not SOURCE.is_file():
        sys.exit(f"No existe {SOURCE.name} en {ROOT}")
    html = build_html(SOURCE.read_text(encoding="utf-8-sig").replace("\r\n", "\n"))
    browser = find_browser()
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "bitacora.html"
        page.write_text(html, encoding="utf-8")
        result_pdf = Path(tmp) / "bitacora.pdf"
        subprocess.run(
            [browser, "--headless=new", "--disable-gpu", f"--user-data-dir={Path(tmp) / 'profile'}",
             "--no-first-run", "--no-pdf-header-footer", "--allow-file-access-from-files",
             f"--print-to-pdf={result_pdf}", page.as_uri()],
            check=False, capture_output=True, timeout=120,
        )
        if not result_pdf.is_file():
            sys.exit("El navegador no generó el PDF.")
        try:
            shutil.copyfile(result_pdf, OUTPUT)
        except PermissionError:
            sys.exit(f"No pude escribir {OUTPUT.name}: ciérralo si está abierto en un visor.")
    print(f"Listo: {OUTPUT.name} ({OUTPUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
