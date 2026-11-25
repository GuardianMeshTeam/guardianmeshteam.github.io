# Faltantes y pendientes del portal `guardianmesh-docs/`

Lo que **no estaba en el workspace** y hay que completar a mano. Los datos técnicos del portal salen de `AUDITORIA_TECNICA.md` y de los 4 README (rama `development`).

## 1. Archivos y enlaces

| # | Pendiente | Dónde se usa | Qué hacer |
|---|---|---|---|
| 1 | **URL final del `.apk`** | `index.html`, botón `#apk-cta` | Hoy apunta a `https://github.com/GuardianMeshTeam/GuardianMesh-front/releases/latest`. No verifiqué que exista una release publicada. Sube el APK (workflow `Android release` o artefacto de CI) y, si quieres un enlace directo, cambia el `href`. Opcional: borrar el aviso `.cta-note` cuando ya exista. |
| 2 | **Logo definitivo** | `assets/logo-guardianmesh.svg` | No hay un logo dedicado en el front. Copié `GuardianMesh-front/public/favicon.svg` (escudo blanco sobre `#0B3D66`) como logo provisional y como favicon. Reemplaza el archivo conservando el nombre. |
| 3 | **Capturas reales de la app Android** | `architecture.html` (slot `mockup-app.png`) | Guardar `assets/img/mockup-app.png`. |
| 4 | **Diagramas exportados** | `architecture.html` | Guardar `assets/img/diagrama-componentes.png`, `diagrama-secuencia.png`, `diagrama-casos-uso.png`. Los diagramas Mermaid ya se ven en vivo; las imágenes son opcionales. |
| 5 | **Integrantes y roles** | `index.html`, sección Equipo | Reemplazar las filas marcadas con borde punteado (`.todo`). Hay 4 filas de ejemplo; ajusta el número. |
| 6 | **Prompts reales de SWNT (RTF + CoT)** | `ai-engine.html`, "Prompts de ingeniería usados en SWNT" | No encontré esos prompts en el workspace. Puse **dos plantillas ilustrativas** (arquitectura y STRIDE), señaladas como tales en la página. Pega los prompts reales del equipo. |
| 7 | Enlaces externos adicionales | Todas | Opcional: repositorio de documentos del curso, video demo, presentación, QR del portal publicado. |
| 8 | URL pública del portal | — | Tras activar GitHub Pages, generar el QR hacia esa URL. |

## 2. Cómo publicar en GitHub Pages

1. Sube `guardianmesh-docs/` a un repositorio (o usa su contenido como raíz o carpeta `/docs`).
2. Settings → Pages → *Deploy from a branch* → rama y carpeta que contienen `index.html`.
3. Todas las rutas son relativas (`assets/...`, `page.html`), por lo que funcionan bajo `https://<org>.github.io/<repo>/`.

## 3. Cosas a tener en cuenta

* **Mermaid v11** se carga desde `cdn.jsdelivr.net`. Sin conexión, la página muestra el código fuente del diagrama y un aviso. No lo probé en un navegador: abre las 5 páginas una vez y confirma que los 6 diagramas se renderizan.
* Un script local comprobó que todos los enlaces internos y `assets/` existen (solo faltan las 4 imágenes opcionales de `assets/img/`, que muestran su espacio reservado). No abrí el sitio en un navegador ni en el celular.
* No se usa fuente web: la tipografía es `Inter` si el sistema la tiene y, si no, la fuente del sistema.
* **Resultados de pruebas:** el portal no cita conteos de tests pasados (ver hallazgo 7 de `AUDITORIA_TECNICA.md`: no pude ejecutarlos en Python 3.12).
* **Datos que conviene reconfirmar antes de presentar:** los hashes (`94ae66f`, `ef4ee97`, `0f5663a`, `86c501c`) son los de `development` al momento de la auditoría; cambiarán con nuevos commits. Hoy las ediciones de la auditoría, los README y las docstrings de `api` siguen **sin commitear**.
* El código de `GuardianMesh-front/src/services/alerts.ts` aún referencia rutas `/api/v1/alerts` que el backend no expone (hallazgo 5 de la auditoría).
