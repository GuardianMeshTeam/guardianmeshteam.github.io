> *Nota de curaduría: los prompts fueron estandarizados bajo la estructura Rol, Contexto, Tarea y Restricciones (cada ficha incluye los apartados que aplican) para documentar la construcción del MVP.*

# Bitácora de Prompts — Felipe Eduardo Calvache Gallego

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorios / Capas trabajadas:** `GuardianMesh-front` · `GuardianMesh-api` · `GuardianMesh-infra` (análisis de `GuardianMesh-communications`)
- **Herramientas y modelos utilizados:** Claude (app de Claude, sesión agéntica) · `claude-opus-5-5`
- **Asignatura:** SWNT 2026-2

---

## Tabla Resumen Cronológica

| ID | Módulo / Archivo | Título técnico | Herramienta y modelo | Entregable real generado |
|---|---|---|---|---|
| PRM-FC-GEN-01 | Jira · organización `GuardianMeshTeam` | Validación del estado del proyecto y selección de historia | Claude · claude-opus-5-5 | Revisión del resumen de Jira (inconsistencia de 34 vs 37 puntos) y recomendación de tomar la HU-23 |
| PRM-FC-GEN-02 | Entorno local · Git | Conexión del repositorio y preparación del entorno de trabajo | Claude · claude-opus-5-5 | Clon fuera de OneDrive y rama `feature/HU-23-esqueleto-pwa` |
| PRM-FC-FRONT-01 | HU-23 · Jira | Definición de criterios de aceptación de la HU-23 | Claude · claude-opus-5-5 | 8 criterios de aceptación listos para Jira |
| PRM-FC-FRONT-02 | `src/styles/design-system.css`, `src/components/layout/*`, `src/screens/*`, `App.tsx` | Esqueleto PWA accesible y navegación base | Claude · claude-opus-5-5 | Primera versión del tema accesible, `TopBar`, `BottomNav`, `AppShell`, pantallas 01 y 02 del Figma y 5 tests; base de la navegación única actual para todas las cuentas |
| PRM-FC-FRONT-03 | `.env.local`, `src/lib/supabase.ts` | Depuración del arranque local (Vite y pantalla en blanco) | Claude · claude-opus-5-5 | Diagnóstico de `npm install` faltante y del `throw` por variables de entorno; `.env.local` de desarrollo (configuración previa a la migración a Cognito) |
| PRM-FC-FRONT-04 | Auditoría de accesibilidad | Verificación de contraste WCAG AA y Lighthouse | Claude · claude-opus-5-5 | 12 pares de color verificados (≥ 6,3:1); Lighthouse 100 en las dos pantallas |
| PRM-FC-FRONT-05 | PR HU-23 | Mensajes al equipo y descripción del Pull Request | Claude · claude-opus-5-5 | Commit, mensaje de avance y descripción del PR |
| PRM-FC-FRONT-06 | `src/App.tsx` · merge `origin/cristian` | Integración con la migración a Cognito y resolución de conflicto | Claude · claude-opus-5-5 | Merge sin Supabase; 159 tests en verde |
| PRM-FC-INFRA-01 | `GuardianMesh-infra`, `GuardianMesh-api` | Análisis de repos y alcance real de la HU-30 | Claude · claude-opus-5-5 | Hallazgo de `development` como rama real y de las tablas existentes; propuesta `alerts` + `trust-links` |
| PRM-FC-INFRA-02 | `modules/monitoring/*`, `environments/dev/monitoring.tf`, `tests/monitoring/*` | Módulo Terraform de alertas y Red de Confianza | Claude · claude-opus-5-5 | 2 tablas DynamoDB declaradas en `dev`, con GSI, TTL, KMS y PITR; políticas IAM; README con 8 patrones de acceso; 19 tests |
| PRM-FC-API-01 | `contracts/events/*`, `tests/contracts/*` | Catálogo de eventos en JSON Schema 2020-12 | Claude · claude-opus-5-5 | Prototipo en la rama de trabajo `feature/HU-30-catalogo-eventos`: envelope + 8 eventos, 8 ejemplos válidos y 14 inválidos, 57 tests, README del catálogo |
| PRM-FC-API-02 | `contracts/events` | Demostración de validación de contratos | Claude · claude-opus-5-5 | Prototipo en la rama de trabajo `feature/HU-30-catalogo-eventos`: script que acepta la alerta válida y rechaza la que filtra la transcripción |
| PRM-FC-DOC-01 | HU-30 (api + infra) | Explicación del diseño y evaluación por casos | Claude · claude-opus-5-5 | Explicación paso a paso y dos evaluaciones (8 casos de contratos, 5 de tablas) |
| PRM-FC-API-03 | `contracts/events/envelope.v1.schema.json` | Alineación de contratos con `GuardianMesh-communications` | Claude · claude-opus-5-5 | Prototipo en la rama de trabajo `feature/HU-30-catalogo-eventos`: corrección del formato de `callId` (`uuid4().hex`); caso inválido nuevo; 58 tests |
| PRM-FC-API-04 | `tools/call-simulator/*` | Simulador de llamante con audio genuino y clonado | Claude · claude-opus-5-5 | Herramienta de pruebas en la rama de trabajo `feature/HU-09-simulador-llamadas`: CLI `send`/`receive`/`list`, receptor de prueba, trazas JSONL, Dockerfile, README, 32 tests (94 % de cobertura). La aplicación envía el audio a `POST /api/v1/calls/{callId}/evaluate` |
| PRM-FC-DOC-02 | `tools/call-simulator/audio/README.md` | Guía de grabación y consentimiento del dataset | Claude · claude-opus-5-5 | Herramienta de pruebas en la rama de trabajo `feature/HU-09-simulador-llamadas`: reglas de consentimiento, formato, frases sugeridas y mensaje al equipo |
| PRM-FC-API-05 | `tools/call-simulator` (Windows) | Prueba de punta a punta con audio real | Claude · claude-opus-5-5 | Herramienta de pruebas en la rama de trabajo `feature/HU-09-simulador-llamadas`: instalación de FFmpeg y prueba con nota de voz `.ogg`: 335/335 tramas |
| PRM-FC-API-06 | `call_simulator/sender.py`, `receiver.py`, `tests/test_timing.py` | Corrección de cortes de tiempo real en Windows | Claude · claude-opus-5-5 | Herramienta de pruebas en la rama de trabajo `feature/HU-09-simulador-llamadas`: temporizador de 1 ms, espera híbrida, `perf_counter`; 0 cortes; 35 tests |
| PRM-FC-DOC-03 | PRs HU-30 y HU-09 | Descripciones de Pull Requests | Claude · claude-opus-5-5 | Descripciones de los PR del módulo `monitoring` (integrado en `development`), del catálogo de eventos y del simulador (ramas de trabajo) |
| PRM-FC-GEN-03 | VS Code | Configuración de Claude Code en VS Code | Claude · claude-opus-5-5 | Pasos de instalación según la documentación oficial |
| PRM-FC-INFRA-03 | `modules/cognito/*`, gateway | Análisis de arquitectura para login con Google | Claude · claude-opus-5-5 | Repos afectados (infra + front), problema del claim `aal2`, riesgos de seguridad |
| PRM-FC-GEN-04 | Los 4 repositorios | Sincronización y revisión de cambios del equipo | Claude · claude-opus-5-5 | Resumen de impactos: MFA retirado, tabla `contacts`, estado de PRs |
| PRM-FC-DOC-04 | `~/workspace/PLAN-google-auth.md` | Plan de implementación de login solo con Google | Claude · claude-opus-5-5 | Plan por fases para el acceso con Google, que en la aplicación convive con correo y contraseña |
| PRM-FC-FRONT-07 | Login Android (Capacitor) | Experiencia del login con Google dentro de la app | Claude · claude-opus-5-5 | Comparativa Custom Tab frente a selector nativo; la app abre el login en el navegador del sistema (Custom Tab, `@capacitor/browser`) |

---

## Listado Cronológico Detallado de Prompts

---

### `PRM-FC-GEN-01` · Validación del estado del proyecto y selección de historia

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front` (planeación general)
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Confirmar que el resumen de Jira del proyecto era coherente y elegir una historia de usuario que pudiera trabajar en pareja sin bloquear a nadie.

**Prompt estructurado:**

```text
Rol: Actúa como Tech Lead de un equipo Scrum de 6 personas.

Contexto: Vamos a empezar a desarrollar GuardianMesh. La organización de GitHub es
GuardianMeshTeam y tiene 3 repositorios: GuardianMesh-api, GuardianMesh-front y
GuardianMeshInfra. El equipo mencionó una "migración a Cognito". Te adjunto el resumen
de Jira: 4 épicas (EP-01 Autenticación, EP-02 Audio VoIP y transcripción, EP-03 Motor
multiagente, EP-04 UI y alertas) y el Sprint 1 (26 oct – 1 nov) con 8 historias, varias
sin asignar. Trabajamos por parejas y yo estoy en el equipo de David, que tiene la HU-24
(pantalla de llamada con botones grandes).

Tarea:
1. Confirma si el resumen de Jira es coherente y señala inconsistencias.
2. Explica qué significa "migración a Cognito" y a qué historias afecta.
3. Recomiéndame qué historia tomar.
4. Dime qué información necesitas para empezar.

Restricciones: la historia elegida debe complementar la HU-24 de David sin que nos
bloqueemos, y debe poder cerrarse antes del fin del sprint.
```

**Entregable:** Revisión del resumen de Jira (inconsistencia de 34 vs 37 puntos) y recomendación de tomar la HU-23.

---

### `PRM-FC-GEN-02` · Conexión del repositorio y preparación del entorno de trabajo

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Darle al asistente acceso de lectura y escritura al repositorio sin instalar una app en la organización de GitHub, y dejar un entorno local estable.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero DevOps que configura el entorno de un desarrollador nuevo.

Contexto: Voy a trabajar la HU-23 en GuardianMesh-front. Soy owner de la organización
GuardianMeshTeam. Tengo Claude Desktop y Git Bash en Windows, y una carpeta
~/workspace/SWNT. Te comparto también el Figma: el flujo de extremo a
extremo y las 14 pantallas individuales.

Tarea:
1. Explícame cómo darte acceso al repositorio.
2. Compara conectar el repo directamente vs. conectar la sesión a mi computador.
3. Guíame para clonar el repo y crear la rama de trabajo.
4. Estima cuánto tiempo toma la HU-23.

Restricciones: no instalar apps en la organización de GitHub; trabajar en una rama
feature y nunca en main; evitar problemas de sincronización de OneDrive con node_modules.
```

**Entregable:** Clon fuera de OneDrive y rama `feature/HU-23-esqueleto-pwa`.

---

### `PRM-FC-FRONT-01` · Definición de criterios de aceptación de la HU-23

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** La tarjeta de Jira no tenía criterios de aceptación, así que no estaba definido cuándo se consideraba terminada.

**Prompt estructurado:**

```text
Rol: Actúa como Product Owner con experiencia en accesibilidad (WCAG).

Contexto: La HU-23 dice: "Como Doña Carmen (adulta mayor), quiero una PWA accesible con
alto contraste y tipografía grande para usar la aplicación fácilmente". Pertenece a la
EP-04: "Implementar UI accesible (PWA) y sistema de alertas/escalamiento, incluyendo E2E
demo y datos semilla. Historias: HU-23..HU-32". La tarjeta no trae criterios de aceptación.

Tarea: Redacta criterios de aceptación medibles para pegar en Jira, alineados con el Figma
(pantallas 01 y 02 marcadas como HU-23).

Restricciones: cada criterio debe poder verificarse con una herramienta o un test
(contraste WCAG AA, tamaños mínimos, Lighthouse, npm test); nada subjetivo.
```

**Entregable:** 8 criterios de aceptación listos para Jira.

---

### `PRM-FC-FRONT-02` · Esqueleto PWA accesible y navegación base

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Construir la base visual y de navegación de la app para que el resto del equipo (empezando por la HU-24) monte sus pantallas encima.

**Prompt estructurado:**

```text
Rol: Actúa como desarrollador frontend senior especializado en React y accesibilidad.

Contexto: GuardianMesh-front usa React 19 + Vite + TypeScript + Vitest, con
vite-plugin-pwa ya configurado (manifest, íconos, service worker) y un
design-system.css con la paleta del Figma. El lienzo está fijo a 360 px. Usuarios:
adultos mayores (persona protegida) y familiares (guardianes).

Tarea:
1. Haz el design system responsive (320–480 px), con texto base de 18 px escalable,
   botones de mínimo 56 px, foco visible, color ámbar y soporte para reducir movimiento.
2. Crea TopBar, BottomNav y AppShell reutilizables, con una navegación para la persona
   protegida (Inicio, Contactos, Ajustes) y otra para el guardián (Resumen, Historial,
   Ajustes).
3. Implementa las pantallas 01 (Inicio) y 02 (Vincular teléfono) del Figma con datos
   de ejemplo, y pantallas temporales para el resto.
4. Agrega tests de navegación con Testing Library.

Restricciones: no tocar las rutas de login existentes; seguir la convención de tests
del repo (import de vitest y jest-dom); verificar que tsc y el build pasen.
```

**Entregable:** Primera versión del tema accesible, `TopBar`, `BottomNav`, `AppShell`, pantallas 01 y 02 del Figma y 5 tests; base de la navegación única actual para todas las cuentas.

---

### `PRM-FC-FRONT-03` · Depuración del arranque local

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Resolver dos errores al correr la app en local: `"vite" no se reconoce` y una pantalla en blanco.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero de soporte de desarrollo frontend.

Contexto: Al correr `npm run dev` en Windows (Git Bash) primero obtuve
`"vite" no se reconoce como un comando interno o externo`. Después Vite arrancó
(VITE v6.4.5 ready, PWA v2.0.0 generateSW), pero el navegador muestra la pantalla en blanco.

Tarea: Diagnostica la causa de cada error, corrígela y explícame en términos simples
qué es el .env.local, qué es Supabase y por qué tumbaba toda la app.

Restricciones: no subir secretos al repositorio; usar valores de relleno solo para
desarrollo y confirmar que el archivo esté en el .gitignore.
```

**Entregable:** Diagnóstico de `npm install` faltante y del `throw` por variables de entorno; `.env.local` de desarrollo (configuración previa a la migración a Cognito).

---

### `PRM-FC-FRONT-04` · Verificación de contraste WCAG AA y Lighthouse

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Demostrar con evidencia medible que se cumplen los criterios de accesibilidad de la HU-23.

**Prompt estructurado:**

```text
Rol: Actúa como especialista en auditoría de accesibilidad web.

Contexto: Las pantallas /carmen y /carmen/vincular ya corren en local. Necesito evidencia
de los criterios de contraste y accesibilidad. Al intentar Lighthouse, F12 activa el modo
avión en mi portátil y luego Lighthouse reportó "Multiple tabs are being controlled by the
same service worker".

Tarea:
1. Calcula el contraste de todas las combinaciones de color del design system contra
   WCAG AA.
2. Guíame para correr Lighthouse (Mobile, solo Accessibility) y resolver el bloqueo del
   service worker.
3. Explícame qué es Lighthouse y por qué importa para GuardianMesh.

Restricciones: mínimo 4,5:1 en texto normal; meta de Lighthouse ≥ 90.
```

**Entregable:** 12 pares de color verificados (≥ 6,3:1); Lighthouse 100 en las dos pantallas.

---

### `PRM-FC-FRONT-05` · Mensajes al equipo y descripción del Pull Request

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Comunicar el avance de la HU-23 y documentar el PR para revisión.

**Prompt estructurado:**

```text
Rol: Actúa como desarrollador que documenta su trabajo para el equipo.

Contexto: La HU-23 está terminada en feature/HU-23-esqueleto-pwa, con Lighthouse 100 en
las dos pantallas. El login aún depende de Supabase y existe una migración a Cognito en
otra rama.

Tarea:
1. Redacta un mensaje de avance para el grupo (acompañará dos capturas de Lighthouse),
   terminando con la pregunta de si el PR va hacia development o main.
2. Redacta la pregunta sobre las variables de Supabase frente a la migración a Cognito.
3. Redacta la descripción del PR.

Restricciones: tono de estudiante, ni muy formal ni muy informal, sin extenderse; la
descripción del PR en Markdown, con redacción clara, directa y profesional.
```

**Entregable:** Commit, mensaje de avance y descripción del PR.

---

### `PRM-FC-FRONT-06` · Integración con la migración a Cognito

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Alinear la rama de la HU-23 con la rama `cristian`, que reemplaza Supabase por Amazon Cognito.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero de integración con experiencia en Git.

Contexto: Mi rama feature/HU-23-esqueleto-pwa salió de main, que usa Supabase. Cristian
informó que la migración a Cognito está en la rama `cristian`. Al hacer
`git merge origin/cristian` obtuve: CONFLICT (content): Merge conflict in src/App.tsx.

Tarea:
1. Evalúa qué tan grave es y qué archivos tocan las dos ramas.
2. Resuelve el conflicto conservando las rutas de Cognito y las nuevas de la HU-23.
3. Verifica que compile y que pasen todos los tests.
4. Explícame con un ejemplo qué cambió (Supabase vs. Cognito, .env.local) y actualiza la
   descripción del PR.

Restricciones: no reescribir el historial (la rama ya está en GitHub); no incluir
package-lock.json generado localmente.
```

**Entregable:** Merge sin Supabase; 159 tests en verde.

---

### `PRM-FC-INFRA-01` · Análisis de repositorios y alcance real de la HU-30

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Entender qué existía ya en infra y api antes de diseñar el modelo de datos, para no duplicar trabajo del equipo.

**Prompt estructurado:**

```text
Rol: Actúa como arquitecto de software cloud en AWS.

Contexto: Me asignaron la HU-09 (simulador de llamante) y la HU-30 (esquema DynamoDB y
catálogo de eventos JSON Schema). Te pego las tarjetas completas de Jira con sus criterios
de aceptación. Para la HU-30: diseño PK/SK y GSIs según patrones de acceso, TTL, esquemas
JSON (CallStarted, AudioTranscribed, VoiceAnalysisCompleted, FraudAlertTriggered) con
validación y versionado, plantilla IaC y ejemplos válidos e inválidos. Ya cloné
GuardianMesh-api y GuardianMesh-infra.

Tarea:
1. Revisa los dos repos y las ramas, y dime qué existe ya.
2. Propón qué falta para la HU-30 y en qué repositorio va cada parte.
3. Dime si lo que propones es lo que pide el proyecto o una decisión nuestra.
4. Redacta un mensaje al equipo para validar el diseño.

Restricciones: no duplicar tablas existentes; seguir las convenciones del repo; basarse
en el Figma y en las HU, no en supuestos.
```

**Entregable:** Hallazgo de `development` como rama real y de las tablas existentes; propuesta `alerts` + `trust-links`.

---

### `PRM-FC-INFRA-02` · Módulo Terraform de alertas y Red de Confianza

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Modelar y declarar en Terraform las tablas de alertas y de la Red de Confianza, preparadas para panel, historial y un futuro escalamiento.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero de infraestructura especialista en Terraform y DynamoDB.

Contexto: GuardianMesh-infra (rama development) ya tiene las tablas profiles, challenges,
calls y call-connections, cifradas con CMK por clase de dato, y tests en Python que leen
los .tf como texto y los validan contra un snapshot del schema del provider de AWS.

Tarea: Crea el módulo modules/monitoring en la rama feature/HU-30-esquema-dynamodb con:
1. Tabla `alerts` (PK protected_user_id, SK alert_id tipo ULID) con GSI por llamada y un
   GSI disperso de alertas pendientes de confirmación ordenadas por hora de escalamiento.
2. Tabla `trust-links` (PK protected_user_id, SK guardian_id) con GSI desde el guardián.
3. Política IAM por tabla: solo operaciones de ítem, cubriendo los índices, y cifrado a
   nivel de campo atado al contexto `pii`.
4. Conexión al ambiente dev, outputs y README con patrones de acceso y atributos.
5. Tests al estilo del repo.

Restricciones: CMK `pii`, PITR, deletion protection y PAY_PER_REQUEST; TTL solo en
alertas (90 días); no guardar transcripciones; sin account IDs en el código; pasar
`terraform fmt`, ruff y pytest.
```

**Entregable:** 2 tablas DynamoDB declaradas en `dev`, con GSI, TTL, KMS y PITR; políticas IAM; README con 8 patrones de acceso; 19 tests.

---

### `PRM-FC-API-01` · Catálogo de eventos en JSON Schema 2020-12

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Estandarizar los mensajes entre servicios para que cada pieza del sistema se comunique con nombres, tipos y campos obligatorios acordados.

**Prompt estructurado:**

```text
Rol: Actúa como arquitecto de integración especialista en contratos de eventos.

Contexto: Criterios de la HU-30: validar cada payload contra su .schema.json; debe pasar
si cumple las propiedades requeridas (timestamp, callId, eventType, payload) y fallar
explícitamente ante campos ausentes o tipos inválidos (CA-02); cada evento incluye una
versión para evolucionar sin romper consumidores (CA-03); ejemplos válidos e inválidos
(CA-04).

Tarea: En contracts/events/ del repo api (rama feature/HU-30-catalogo-eventos):
1. Un sobre común (envelope) con los campos compartidos.
2. Los 4 eventos de la tarjeta, más los del flujo del Figma: pregunta de seguridad
   respondida, alerta confirmada, alerta escalada y protección pausada.
3. Ejemplos válidos e inválidos por evento.
4. Tests con jsonschema y un README del catálogo.

Restricciones: niveles de riesgo GREEN/AMBER/RED (una alerta solo AMBER o RED); ningún
evento salvo AudioTranscribed puede llevar texto de la llamada ni la respuesta del
desafío; payloads estrictos (additionalProperties: false); cada esquema acepta 1.x.x y
rechaza otra versión mayor.
```

**Entregable:** Prototipo en la rama de trabajo `feature/HU-30-catalogo-eventos`: envelope + 8 eventos, 8 ejemplos válidos y 14 inválidos, 57 tests, README del catálogo.

---

### `PRM-FC-API-02` · Demostración de validación de contratos

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Tener una evidencia que mostrarle al equipo, porque el trabajo de la HU-30 no tiene interfaz visible.

**Prompt estructurado:**

```text
Rol: Actúa como QA que prepara una demo técnica.

Contexto: La HU-30 no cambia nada visual en la app; solo hay esquemas, tablas y pruebas.

Tarea: Dame un comando que se pueda correr en Git Bash y que muestre en consola que una
alerta válida pasa y una alerta con la transcripción incluida se rechaza, con el motivo
del rechazo. Indica también qué más puedo mostrarles a mis compañeros.

Restricciones: un solo comando copiable, sin sangría (el primer intento falló con
IndentationError), y que use los ejemplos del repo.
```

**Entregable:** Prototipo en la rama de trabajo `feature/HU-30-catalogo-eventos`: script que acepta la alerta válida y rechaza la que filtra la transcripción.

---

### `PRM-FC-DOC-01` · Explicación del diseño y evaluación por casos

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `Documentación / Web 3D`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Entender y poder defender el diseño de la HU-30 (eventos y tablas) frente al equipo y en la sustentación.

**Prompt estructurado:**

```text
Rol: Actúa como mentor técnico que explica arquitectura a un estudiante.

Contexto: Terminamos la HU-30 y necesito comprender a fondo el diseño para sustentarlo.

Tarea:
1. Explícame al detalle, paso a paso y con ejemplos literales (JSON y filas de tabla, no
   analogías), qué hicimos en api y en infra, qué pasaría sin ello y cómo estaba antes.
2. Muestra una llamada de estafa completa, de inicio a fin, conectando cada evento con
   cada tabla y cada pantalla del Figma.
3. Resuelve mis dudas puntuales: qué hace el envelope, qué significan $ref, required,
   properties y additionalProperties, dónde va la fecha del ULID, para qué son los
   índices, los permisos IAM y la conexión con dev.
4. Evalúame con casos prácticos: eventos que pasan o fallan en api, y situaciones sobre
   las tablas en infra.

Restricciones: explicaciones concretas y graduales; corregirme cuando me equivoque y
explicar por qué.
```

**Entregable:** Explicación paso a paso y dos evaluaciones (8 casos de contratos, 5 de tablas).

---

### `PRM-FC-API-03` · Alineación de contratos con `GuardianMesh-communications`

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Verificar que el trabajo de la HU-30 siguiera siendo válido después de que el equipo creara el repositorio de comunicaciones.

**Prompt estructurado:**

```text
Rol: Actúa como arquitecto que revisa la consistencia entre servicios.

Contexto: El equipo creó el repositorio GuardianMesh-communications (señalización
WebRTC 1:1). Ya lo cloné en ~/workspace.

Tarea:
1. Analiza el repositorio y dime si cambia algo de lo que hicimos en la HU-30 (eventos y
   tablas) o de lo planeado para la HU-09.
2. Corrige lo que no sea compatible.
3. Recomienda en qué repositorio va el simulador de la HU-09.

Restricciones: los ids de los eventos deben coincidir con el formato que genera
communications; mantener todos los tests en verde.
```

**Entregable:** Prototipo en la rama de trabajo `feature/HU-30-catalogo-eventos`: corrección del formato de `callId` (`uuid4().hex`); caso inválido nuevo; 58 tests.

---

### `PRM-FC-API-04` · Simulador de llamante con audio genuino y clonado

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Poder probar de punta a punta el pipeline de audio y la detección de voz clonada sin hacer llamadas reales.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero de software senior especializado en audio en tiempo real y
herramientas de prueba.

Contexto: HU-09: "Como ingeniero del equipo de GuardianMesh, quiero disponer de un
simulador de cliente/llamante VoIP capaz de reproducir e inyectar flujos de audio de
prueba con muestras de voces genuinas y clonadas, para validar de punta a punta la
resiliencia del pipeline de audio, la transcripción y la precisión de los modelos de
detección de fraude".
- CA-01: el audio se transmite a tasa constante (tiempo real), sin pérdida ni cortes.
- CA-02: el simulador envía las etiquetas genuino/clonado en la sesión o en un archivo
  de traza.
- CA-03: URL, puerto, codec, jitter opcional y selección de audio por CLI o variable de
  entorno.
- CA-04: README con requisitos (Docker / Python / FFmpeg) y ejemplos de ambos tipos.
La ingesta de audio (HU-12, PCM 16 kHz por WSS) todavía no existe.

Tarea: En tools/call-simulator del repo api (rama feature/HU-09-simulador-llamadas),
implementa el simulador, un receptor de prueba que mida integridad y ritmo, el dataset
organizado en audio/genuine y audio/cloned con ficha por audio, un Dockerfile, el README
y los tests.

Restricciones: Python 3.10+; WebSocket con PCM16 a 16 kHz y tramas de 20 ms; callId con
el formato de communications; el formato de los mensajes aislado en un solo archivo para
cambiarlo cuando exista la HU-12; cobertura ≥ 80 % y ruff en verde; los audios no se
suben al repositorio.
```

**Entregable:** Herramienta de pruebas en la rama de trabajo `feature/HU-09-simulador-llamadas`: CLI `send`/`receive`/`list`, receptor de prueba, trazas JSONL, Dockerfile, README, 32 tests (94 % de cobertura). La aplicación envía el audio a `POST /api/v1/calls/{callId}/evaluate`.

---

### `PRM-FC-DOC-02` · Guía de grabación y consentimiento del dataset

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `Documentación / Web 3D`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Conseguir audios reales del equipo para el dataset de la HU-09 de forma ética y en un formato utilizable.

**Prompt estructurado:**

```text
Rol: Actúa como responsable de datos de prueba con criterios éticos.

Contexto: El simulador de la HU-09 necesita voces genuinas y clonadas de las mismas
personas.

Tarea:
1. Define en qué formato se necesitan los audios y si el dataset bloquea el desarrollo.
2. Redacta las reglas del dataset: consentimiento, nombres de archivo, ficha JSON y
   frases sugeridas (mitad normales, mitad tipo estafa).
3. Redacta el mensaje al grupo pidiendo voluntarios, con mi forma de escribir.

Restricciones: solo voces de compañeros que den su permiso explícito; las grabaciones
no se suben al repositorio; aceptar los formatos comunes del celular (.ogg de WhatsApp,
.m4a, .mp3).
```

**Entregable:** Herramienta de pruebas en la rama de trabajo `feature/HU-09-simulador-llamadas`: reglas de consentimiento, formato, frases sugeridas y mensaje al equipo.

---

### `PRM-FC-API-05` · Prueba de punta a punta con audio real

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Validar el simulador en mi computador con mi propia voz y entender por qué se usa FFmpeg.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero de QA que guía una prueba de integración local.

Contexto: Los 32 tests del simulador pasan, pero no tengo FFmpeg instalado en Windows.
Tengo una nota de voz en formato .ogg y no encuentro la ruta de la carpeta del dataset.

Tarea:
1. Explícame qué es FFmpeg y si usarlo fue una decisión propia o lo pide la historia.
2. Guíame para instalarlo en Windows.
3. Dame la ruta exacta para copiar el audio.
4. Dame los comandos para levantar el receptor y simular la llamada, e interpreta el
   resultado.

Restricciones: comandos copiables para Git Bash y PowerShell.
```

**Entregable:** Herramienta de pruebas en la rama de trabajo `feature/HU-09-simulador-llamadas`: instalación de FFmpeg y prueba con nota de voz `.ogg`: 335/335 tramas.

---

### `PRM-FC-API-06` · Corrección de cortes de tiempo real en Windows

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Cumplir el CA-01 ("sin cortes") en Windows, donde la prueba real mostró un hueco de 63 ms entre tramas.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero de sistemas de tiempo real.

Contexto: Prueba real en Windows: 335/335 tramas, complete: true,
meanIntervalMs: 19.97, maxIntervalMs: 63.0, gaps: 1 (tolerancia de 60 ms).

Tarea: Corrige la precisión del envío y de la medición para que no haya cortes en
Windows, agrega tests de precisión y dime cómo volver a probarlo.

Restricciones: no aumentar la tolerancia para ocultar el problema; no acumular jitter;
restaurar la configuración del sistema aunque el envío falle; mantener la cobertura y
ruff en verde.
```

**Entregable:** Herramienta de pruebas en la rama de trabajo `feature/HU-09-simulador-llamadas`: temporizador de 1 ms, espera híbrida, `perf_counter`; 0 cortes; 35 tests.

---

### `PRM-FC-DOC-03` · Descripciones de Pull Requests de la HU-30 y la HU-09

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-infra` · `GuardianMesh-api`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Documentar los tres PR hacia `development` dejando explícitas las decisiones que el equipo debía revisar.

**Prompt estructurado:**

```text
Rol: Actúa como desarrollador que documenta cambios para revisión de código.

Contexto: Tengo listos tres PR hacia development: el módulo monitoring (infra), el
catálogo de eventos (api) y el simulador de llamante (api).

Tarea: Escribe el título y la descripción de cada PR: qué se hizo, cómo probarlo, los
resultados de las pruebas y las decisiones abiertas (no guardar transcripciones, regla
de versionado semver, audios fuera del repositorio).

Restricciones: redacción clara, directa y profesional; las
decisiones propias se presentan como propuestas, no como hechos acordados.
```

**Entregable:** Descripciones de los PR del módulo `monitoring` (integrado en `development`), del catálogo de eventos y del simulador (ramas de trabajo).

---

### `PRM-FC-GEN-03` · Configuración de Claude Code en VS Code

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `Documentación / Web 3D`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Trabajar con Claude Code directamente dentro del editor.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero de herramientas de desarrollo.

Contexto: Uso VS Code en Windows y tengo los repositorios en ~/workspace.

Tarea: Explícame cómo instalar y activar la extensión de Claude Code en VS Code, cómo
abrirla y cómo iniciar sesión.

Restricciones: basarse en la documentación oficial vigente, no en memoria.
```

**Entregable:** Pasos de instalación según la documentación oficial.

---

### `PRM-FC-INFRA-03` · Análisis de arquitectura para login con Google

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Decidir en qué repositorios se implementa la autenticación con Google y detectar riesgos antes de programar.

**Prompt estructurado:**

```text
Rol: Actúa como arquitecto de seguridad e identidad (Amazon Cognito / OAuth 2.0).

Contexto: Necesito agregar autenticación con Google al proyecto. El login actual usa
Cognito, administrado desde GuardianMesh-infra con Terraform.

Tarea:
1. Recomienda en cuál repositorio implementarlo (api, infra, front o communications),
   o si hay que combinar varios; idealmente uno solo.
2. Revisa la configuración actual de Cognito (Lambdas de tokens y de registro) y dime si
   algo impide o complica el login federado.
3. Lista lo que es parte del trabajo y lo que depende de decisiones del equipo.

Restricciones: no romper la validación de tokens del gateway ni de communications;
ningún secreto en el repositorio.
```

**Entregable:** Repos afectados (infra + front), problema del claim `aal2`, riesgos de seguridad.

---

### `PRM-FC-GEN-04` · Sincronización y revisión de cambios del equipo

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front` · `GuardianMesh-api` · `GuardianMesh-infra` · `GuardianMesh-communications`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Actualizar los cuatro repos y revisar cómo afectaban los cambios del equipo al plan de Google.

**Prompt estructurado:**

```text
Rol: Actúa como Tech Lead que revisa el estado de los repositorios.

Contexto: El equipo hizo varios cambios en los cuatro repositorios.

Tarea:
1. Dame los comandos para actualizar todos los repositorios en development.
2. Revisa los commits nuevos y dime cuáles afectan mi trabajo o el login con Google.
3. Confirma si el MFA sigue activo y si eso genera algún problema.

Restricciones: no perder cambios locales sin confirmar; respuestas claras de sí o no
sobre si existe un bloqueo.
```

**Entregable:** Resumen de impactos: MFA retirado, tabla `contacts`, estado de PRs.

---

### `PRM-FC-DOC-04` · Plan de implementación de login solo con Google

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `Documentación / Web 3D`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Dejar un plan completo para ejecutar el login con Google en Claude Code (VS Code), con el contexto del proyecto incluido.

**Prompt estructurado:**

```text
Rol: Actúa como ingeniero de software senior que redacta un plan técnico para que otro
agente lo ejecute.

Contexto: El login debe quedar solo con Google (reemplazando correo y contraseña). Yo
creo el cliente OAuth en Google Cloud Console. El MFA ya fue retirado. El front también
se empaqueta como app Android con Capacitor.

Tarea: Escribe un archivo Markdown para Claude Code con: contexto del proyecto y
convenciones, estado actual, decisiones pendientes, plan por fases (Google Cloud, infra,
front web, Android, limpieza), criterios de terminado y qué no cambia.

Restricciones: los personajes de las historias (Carmen, Andrea) son ejemplos: nunca usar
nombres de personas en rutas, carpetas, componentes ni tests, solo roles; detenerse al
final de cada fase para revisión; no borrar código de otros sin preguntar; ningún
secreto en el repositorio.
```

**Entregable:** Plan por fases para el acceso con Google, que en la aplicación convive con correo y contraseña.

---

### `PRM-FC-FRONT-07` · Experiencia del login con Google dentro de la app Android

- **Responsable:** Felipe Eduardo Calvache Gallego
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude · claude-opus-5-5
- **Objetivo técnico:** Garantizar que el login con Google se vea dentro de la app Android y no saque al usuario a otra aplicación.

**Prompt estructurado:**

```text
Rol: Actúa como desarrollador móvil experto en Capacitor y OAuth en Android.

Contexto: El plan proponía abrir el navegador del sistema para el login con Google en
Android. Requisito de producto: el login debe verse dentro de la app al abrirla.

Tarea: Explica las alternativas que cumplen el requisito y las restricciones de Google
(bloqueo del WebView), compáralas en experiencia, esfuerzo e impacto en infra, y ajusta
la fase 4 del plan según la opción elegida.

Restricciones: compatible con Cognito como intermediario; sin cargar el login de Google
dentro del WebView de la app.
```

**Entregable:** Comparativa Custom Tab frente a selector nativo; la app abre el login en el navegador del sistema (Custom Tab, `@capacitor/browser`).

---

# Bitácora de Prompts — Juan Miguel Rojas

- **Responsable:** Juan Miguel Rojas
- **Repositorios / Capas trabajadas:** Documentación (modelo financiero, requerimientos, plan MVP y descripción del proyecto) y backend (prototipo de laboratorio del componente C2)
- **Herramientas y modelos utilizados:** Claude (chat y Claude Code) · `claude-haiku-5-5`
- **Asignatura:** SWNT 2026-2

---

## Tabla Resumen Cronológica

| ID | Módulo / Archivo | Título técnico | Herramienta y modelo | Entregable real generado |
|---|---|---|---|---|
| PRM-JM-FIN-01 | Modelo financiero (`Plantilla_Finanzas_SWNT_PG_IA_GuardianMesh.xlsm`) | Separadores de miles en cifras | Claude Haiku 5.5 | Excel con formato `#,##0` aplicado |
| PRM-JM-FIN-02 | Modelo financiero (`.xlsm`) | Formatos de negativos, porcentajes y fechas | Claude Haiku 5.5 | Parche de `styles.xml` (52 estilos con `applyNumberFormat`) y render de verificación en LibreOffice |
| PRM-JM-FIN-03 | Informe financiero (`GuardianMesh_Entrega_Taller_Modelo_Financiero.docx`) | Verificación Word frente a Excel | Claude Haiku 5.5 | Informe en minutos de 15 páginas con 126 cifras verificadas contra el Excel |
| PRM-JM-DOC-01 | Correo de entrega | Asunto y mensaje de entrega de plantilla y documento | Claude Haiku 5.5 | Borrador de asunto y cuerpo del correo |
| PRM-JM-LAB-01 | Laboratorio 3, componente C2 (`handler.py`, `test_challenge_responses_lambda.py`) | Implementación C2 con Vibe Coding | Claude Haiku 5.5 | Prototipo de laboratorio: `handler.py` v2, suite de 21 pruebas en verde e `Informe_Laboratorio3_C2.docx` |
| PRM-JM-REQ-01 | Requerimientos de arquitectura (Laboratorio 2) | Documento de especificaciones de 7 componentes | Claude Haiku 5.5 | Especificaciones de 7 componentes, consolidadas en la v3.0 |
| PRM-JM-REQ-02 | Requerimientos de arquitectura | Alinear requerimientos con el backlog de Jira | Claude Haiku 5.5 | `GuardianMesh_Requerimientos_Arquitectura_v3.md` v3.0, reconstruido desde el Plan MVP |
| PRM-JM-PLAN-01 | Plan MVP (`GuardianMesh-Plan-MVP.docx`) | Corrección de duplas | Claude Haiku 5.5 | `GuardianMesh-Plan-MVP_duplas_corregidas.docx` |
| PRM-JM-REQ-03 | Requerimientos v3 | Actualizar requerimientos con las duplas corregidas | Claude Haiku 5.5 | v3.1 en `.md` y `.docx` |
| PRM-JM-REQ-04 | Requerimientos v3.1 | Entrega en formato Word | Claude Haiku 5.5 | `GuardianMesh_Requerimientos_Arquitectura_v3.1.docx` |
| PRM-JM-REQ-05 | Requerimientos funcionales y no funcionales | Documento de RF y RNF | Claude Haiku 5.5 | `GuardianMesh_Requerimientos_Funcionales_NoFuncionales.docx` (RF-01 a RF-38, RNF-01 a RNF-59) |
| PRM-JM-DOC-02 | Descripción del proyecto para los jueces | Descripción de media página: dolor, solución y negocio | Claude Haiku 5.5 | Texto de descripción del proyecto |

---

## Listado Cronológico Detallado de Prompts

---

### `PRM-JM-FIN-01` · Separadores de miles en cifras del modelo

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Que las cifras grandes del modelo financiero (en COP) se lean sin esfuerzo. Las cifras se mostraban sin separador de miles.

**Prompt estructurado:**

```text
Rol: Analista financiero y especialista en formato de hojas de cálculo.
Contexto: Modelo financiero de GuardianMesh en Excel (.xlsm), con cifras en COP en el rango de millones y miles de millones. Las celdas no muestran separadores de miles.
Tarea: Aplica separador de miles a todas las cifras monetarias y de cantidades del modelo, para que se lean con facilidad.
Restricciones:
- No cambiar valores, fórmulas ni entradas; solo el formato de visualización.
- Mantener la coherencia del formato en todas las hojas.
```

**Entregable:** Excel con separador de miles aplicado.

---

### `PRM-JM-FIN-02` · Formatos de negativos, porcentajes y fechas

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Corregir tres errores de formato detectados al abrir el Excel: los negativos no aparecían entre paréntesis, los porcentajes se veían como decimales y algunas fechas se veían como números de serie (por ejemplo, 46789).

**Prompt estructurado:**

```text
Rol: Ingeniero de hojas de cálculo con dominio de OOXML (styles.xml).
Contexto: Libro .xlsm del modelo financiero de GuardianMesh. Tras el cambio a minutos, varias celdas muestran:
  1. Negativos sin paréntesis.
  2. Porcentajes como decimales (0,15 en lugar de 15 %).
  3. Fechas como números de serie (46789) en lugar de "Mes N".
Tarea: Corregir el formato de número de esas celdas, sin modificar los valores ni las fórmulas. Verificar el resultado con una conversión a PDF.
Restricciones:
- Negativos en formato #,##0;[Red](#,##0);- ; porcentajes en 0.0%;[Red](0.0%);- ; meses como "Mes "0.
- Revisar los estilos de celda (cellXfs) y activar applyNumberFormat donde falte.
- Entregar el libro con los valores originales y comprobar el render antes de entregarlo.
```

**Entregable:** Parche de `styles.xml` (52 estilos con `applyNumberFormat="true"` y `[RED]` cambiado a `[Red]`). Render de verificación en LibreOffice.

---

### `PRM-JM-FIN-03` · Verificación del Word frente al Excel

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Confirmar que el informe Word refleja exactamente las cifras del modelo ya corregido en minutos.

**Prompt estructurado:**

```text
Rol: Auditor de consistencia entre documentos financieros.
Contexto: Existen un Excel (modelo en minutos) y un Word (informe del taller). El Word debe coincidir con el Excel en cada cifra citada.
Tarea: Contrastar cada cifra del Word contra la celda correspondiente del Excel e informar cualquier diferencia. Si hay diferencias, corregir el Word.
Restricciones:
- Reportar el número de cifras verificadas.
- No cambiar el Excel para que coincida con el Word; la fuente de verdad es el Excel.
```

**Entregable:** Word en minutos de 15 páginas. Se verificaron 126 cifras contra el Excel.

---

### `PRM-JM-DOC-01` · Asunto y mensaje del correo de entrega

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Redactar el correo con el que el equipo entrega la plantilla financiera y el documento.

**Prompt estructurado:**

```text
Rol: Asistente de comunicación académica en español.
Contexto: El equipo de GuardianMesh entrega a los evaluadores de SWNT 2026-2 la plantilla financiera (.xlsm) y el informe del taller (.docx).
Tarea: Redactar el asunto y el cuerpo de un correo de entrega formal y breve, que mencione los dos archivos adjuntos.
Restricciones: Tono profesional, en español, sin relleno.
```

**Entregable:** Asunto y cuerpo del correo.

---

### `PRM-JM-LAB-01` · Implementación del componente C2 con Vibe Coding (Laboratorio 3)

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Prototipo de laboratorio, como referencia para `GuardianMesh-api`
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Implementar el componente C2 (HU-04) en Python con boto3, KMS y DynamoDB, de modo que la respuesta de desafío nunca se guarde en claro. El primer ciclo de pruebas dio 8 de 21 en verde, y tras corregir el manejo de `Binary` y la normalización se llegó a 21 de 21.

**Prompt estructurado:**

```text
Rol: Actúa como un Senior Full-Stack Architect y Prompt Engineer.

Tarea: Utilizando la especificación del componente C2 (Challenge Response & KMS Module - HU-04) descrita en la Parte 1 de nuestro Documento de Requerimientos, necesito que ejecutes el Laboratorio 3 (Implementación de Componentes con Vibe Coding) de forma completa y estructurada.

Genera un informe con los 4 entregables exigidos por la rúbrica del Laboratorio 3:

ENTREGABLES A GENERAR:

1. PROMPT INICIAL (Plantilla 3.1):
   - Redacta el prompt técnico exacto que se le entregaría a una herramienta de Vibe Coding para implementar el componente.
   - Debe incluir: Nombre, Tipo, Stack (Python / boto3 / pytest), Especificación completa, Entradas/Salidas, Reglas de negocio (Normalización NFKC, vinculación contextual user_id+challenge_id), Flujo de 5 pasos, RNF y Criterios de Aceptación (Dado/Cuando/Entonces).

2. CÓDIGO GENERADO (Implementación Modular y Probada):
   - Muestra el código modular de producción en Python para `handler.py` que implementa `store_challenge_answer` y `verify_challenge_answer` usando AWS KMS (`generate_mac`, `verify_mac`) y DynamoDB.
   - Incluye la suite completa de pruebas unitarias (`test_challenge_responses_lambda.py`) usando `pytest` y `moto` / mocks que cubran:
     a) Guardar escribe solo el MAC binario/base64 y nunca texto plano.
     b) Verificación exitosa con respuestas normalizadas (espacios/tildes).
     c) Rechazo de respuestas incorrectas (retorna `valid: False`).
     d) Protección contra ataques de replay/transposición entre usuarios.

3. PROMPT REFINADO Y PROCESO DE ITERACIÓN:
   - Presenta la versión iterada y mejorada del prompt inicial tras detectar un hallazgo de seguridad/calidad (ej. normalización Unicode NFKC para evitar que "Bogotá" falle contra "bogota", o manejo seguro de excepciones KMS).
   - Explica detalladamente qué cambios se añadieron en las instrucciones y por qué mejoraron el código.

4. REFLEXIÓN TÉCNICA FINAL:
   - Redacta una autoevaluación analítica respondiendo:
     * ¿Qué funcionó de manera óptima en el prompt inicial?
     * ¿Qué ajustes fueron necesarios durante la iteración?
     * ¿Qué lecciones de Prompt Engineering se aprendieron para guiar agentes de IA en componentes críticos de ciberseguridad?

FORMATO Y RESTRICCIONES:
- Tono académico y técnico riguroso.
- Todo el código debe estar comentado y listo para producción sin marcadores de posición (`placeholders`).
```

**Entregable:** Prototipo de laboratorio: `handler.py` (v2), `test_challenge_responses_lambda.py` (21 pruebas en verde) e `Informe_Laboratorio3_C2.docx`. En `GuardianMesh-api`, el desafío se implementó con HMAC-SHA256 y una clave en Secrets Manager.

---

### `PRM-JM-REQ-01` · Documento de requerimientos y arquitectura (Laboratorio 2)

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Generar las especificaciones de los 7 componentes críticos según la plantilla del Laboratorio 2 de SWNT.

**Prompt estructurado:**

```text
Rol: Actúa como Senior Software Architect y Lead Systems Analyst.

Tarea: Tu objetivo es redactar el Documento de Requerimientos y Especificaciones de Arquitectura completo para nuestra startup DeepTech "GuardianMesh", siguiendo estrictamente las plantillas del Laboratorio 2 de la asignatura SWNT.

CONTEXTO DE GUARDIANMESH Y EQUIPO:
- Producto: Sistema ambiental de seguridad pasiva con IA en tiempo real para adultos mayores (Doña Carmen) y su Red de Confianza (Andrea), detectando clonación de voz y extorsiones telefónicas.
- Pila Técnica: Amazon Bedrock (`mistral.voxtral-small-24b-2507` para transcripción y `us.amazon.nova-lite-v1:0` para análisis de intención), Python 3.12 en AWS Lambda, con FastAPI para ejecución local (`GuardianMesh-api`), API Gateway, señalización WebSocket para WebRTC 1:1 P2P (`GuardianMesh-communications`), DynamoDB cifrado con AWS KMS, HMAC-SHA256 con clave en AWS Secrets Manager para los desafíos, Amazon Cognito y frontend React + TypeScript + Capacitor (`GuardianMesh-front`).
- Organización del Equipo por Duplas:
  * Dupla 1: María Paula Rodríguez & Juan Miguel Rojas (Seguridad, Arquitectura & Core IA).
  * Dupla 2: David Salamanca & Felipe Calvache (Frontend UI/UX & Backend API).
  * Dupla 3: Cristian Silva & Miguel Vanegas (Backend Core, VoIP & Alertas).

ESTRUCTURA OBLIGATORIA DEL DOCUMENTO (Laboratorio 2):

1. MAPA DE COMPONENTES v1 (Sección 2.1):
   - Módulos Principales (3 a 5 módulos):
     * M1: Autenticación, Usuarios y Seguridad PII.
     * M2: Señalización WebRTC y Motor de Inferencia IA.
     * M3: Gestión de Desafíos y Verificación Segura (HU-04).
     * M4: Visualización Ambiental y Red de Confianza.
   - Tabla de Componentes: ID (C1 a C7), Nombre, Tipo (UI | Servicio | Datos | Integración), Dupla Responsable y Descripción Funcional.
   - Mapa de Dependencias entre componentes y delimitación del alcance MVP vs. Trabajo Futuro.

2. ESPECIFICACIONES DETALLADAS DE COMPONENTES CRÍTICOS (Sección 2.2):
   Genera la especificación técnica completa para los siguientes 7 componentes críticos del proyecto:
   - C1: Cognito Auth & Identity Service (Dupla 1)
   - C2: Challenge Response & KMS Module [HU-04] (Dupla 1)
   - C3: AI Inference Router & Bedrock Core (Dupla 1)
   - C4: Dashboard UI/UX & Ambient Risk Shield (Dupla 2)
   - C5: Backend REST API & Gateway Bridge (Dupla 2)
   - C6: WebRTC Signaling & Peer Bridge (Dupla 3)
   - C7: Real-Time WebSocket Alert Dispatcher (Dupla 3)

ESTRUCTURA INTERNA EXIGIDA PARA CADA COMPONENTE:
Cada uno de los 7 componentes debe desarrollarse bajo la siguiente plantilla:
- Nombre del Componente, ID, Tipo (UI / Servicio / Datos / Integración) y Dupla Responsable.
- Propósito e Historias de Usuario relacionadas (ej. HU-01, HU-02, HU-04, HU-05, HU-06).
- Entradas y Salidas Técnicas (nombres de variables, payloads JSON, firmas de métodos o tipos de datos).
- Reglas de Negocio (3 a 5 reglas técnicas sin ambigüedad).
- Flujo Principal (secuencia numerada de máximo 5 pasos).
- Requisitos No Funcionales (RNF): Rendimiento (latencias p95), Seguridad (políticas IAM, cifrado KMS, manejo de PII) y Accesibilidad (WCAG 2.1 AA para el adulto mayor).
- Criterios de Aceptación Medibles: Mínimo 2 Criterios de Aceptación en formato estricto: "Dado [contexto], cuando [acción], entonces [resultado esperado]".

FORMATO DE ENTREGA:
- Redacción técnica ingenieril de alto nivel en formato Markdown.
- Cero código de relleno; enfócate en especificaciones, entradas/salidas, diagramas textuales de flujo y reglas de arquitectura.
```

**Entregable:** Documento de requerimientos y arquitectura `GuardianMesh_Requerimientos_Arquitectura.md`, con las especificaciones de los 7 componentes críticos, consolidado después en la v3.0 frente al backlog.

---

### `PRM-JM-REQ-02` · Alinear requerimientos con el backlog de Jira

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Verificar si el documento de requerimientos v2 coincide con el backlog ya montado en Jira, y reconstruirlo sobre el Plan MVP si no coincide.

**Prompt estructurado:**

```text
Rol: Analista de requisitos con enfoque en trazabilidad.
Contexto: El backlog ya está montado en Jira y su fuente de verdad es el Plan MVP. La versión 2 de los requerimientos usa números de historia y duplas que no coinciden con ese backlog (por ejemplo, HU-01 para C3 y HU-06 para C7).
Tarea:
1. Verificar si cada historia y cada criterio de aceptación de los requerimientos existe en el Plan MVP, y con la misma dupla y número.
2. Si no coincide, decidir si conviene ajustar el backlog de Jira o los requerimientos. El backlog de Jira está tal cual el Plan MVP, así que la decisión es ajustar los requerimientos.
3. Reconstruir los requerimientos desde el Plan MVP y documentar las discrepancias que el equipo debe decidir.
Restricciones:
- No inventar historias, criterios ni cifras que no estén en el Plan MVP o en la wiki.
- Marcar explícitamente las contradicciones entre la versión anterior y el Plan MVP.
```

- "Es en base al backlog esta hecho todo eso?"
- "Es que el backlog ya esta montado en jira ni se puede dejar asi o porque cambisrlo?"
- "El jira esta tal cual el plan mvp"

**Entregable:** `GuardianMesh_Requerimientos_Arquitectura_v3.md` v3.0. Incluye la tabla de trazabilidad y la sección de hallazgos y decisiones pendientes.

---

### `PRM-JM-PLAN-01` · Corrección de duplas en el Plan MVP

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Corregir la composición de las duplas en el Plan MVP. La composición correcta es D1 = MPR y JMR; D2 = DS y FC; D3 = CS y MV. El plan tenía a MV en D2 y a FC en D3.

**Prompt estructurado:**

```text
Rol: Ingeniero de documentación técnica con experiencia en Word y control de consistencia.
Contexto: El Plan MVP de GuardianMesh (.docx) asigna mal las duplas. La composición correcta es:
  - Dupla 1: MPR y JMR.
  - Dupla 2: DS y FC.
  - Dupla 3: CS y MV.
Tarea: Actualizar el Plan MVP con las duplas correctas en todas sus secciones:
  1. La columna Dupla de cada historia. Cada historia sigue a su responsable; por ejemplo, las de MV pasan a D3 y las de FC a D2.
  2. La tabla de duplas por épica.
  3. La tabla de carga por sprint, recalculando los puntos.
  4. La tabla del equipo (roster).
  5. La tabla de componentes por dupla.
  6. Las referencias de texto a duplas.
Restricciones:
- No cambiar responsables, puntos ni sprints; solo corregir las duplas.
- Los totales por sprint deben seguir igual (37, 35, 42, 33).
- Conservar el formato del documento original.
- Señalar las decisiones de criterio que el equipo debe confirmar.
```

**Entregable:** `GuardianMesh-Plan-MVP_duplas_corregidas.docx`. Dos correcciones de la primera pasada: la fila de Backlog y los stretch. Se rehizo el proceso desde el original.

---

### `PRM-JM-REQ-03` · Actualizar requerimientos con las duplas corregidas

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Llevar los requerimientos v3 a las duplas corregidas del Plan MVP, para que no haya contradicciones entre documentos.

**Prompt estructurado:**

```text
Rol: Analista de requisitos con enfoque en consistencia entre documentos.
Contexto: El Plan MVP ya tiene las duplas corregidas. Los requerimientos v3 todavía tienen la asignación anterior de MV y FC.
Tarea: Actualizar el documento de requerimientos v3 para que coincida con el Plan MVP corregido:
  - La tabla de trazabilidad.
  - Los componentes C1 a C7 y su dupla.
  - Las asignaciones de cada sección.
  - El encabezado de duplas y su nota.
Restricciones:
- Subir la versión a 3.1 y no cambiar el contenido funcional.
- Corregir cualquier otra inconsistencia que se encuentre.
```

**Entregable:** `GuardianMesh_Requerimientos_Arquitectura_v3.1.md`. Durante la revisión se detectó que HU-20 estaba en S4 y el Plan MVP la programa en S3. Se corrigió, y se regeneró el `.docx`.

---

### `PRM-JM-REQ-04` · Entrega del documento en formato Word

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Convertir el documento v3.1 de Markdown a Word para entregarlo.

**Prompt estructurado:**

```text
Rol: Editor técnico.
Contexto: El documento de requerimientos v3.1 está en Markdown.
Tarea: Convertirlo a .docx con las tablas y los encabezados conservados.
Restricciones: Verificar que el archivo abre y que el contenido coincide con la versión .md.
```

**Entregable:** `GuardianMesh_Requerimientos_Arquitectura_v3.1.docx`. Se regeneró tras corregir HU-20.

---

### `PRM-JM-REQ-05` · Documento de requerimientos funcionales y no funcionales

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Producir un documento separado con los requisitos funcionales y no funcionales, trazables al Plan MVP y a la wiki.

**Prompt estructurado:**

```text
Rol: Analista de requisitos senior especializado en sistemas de seguridad para adultos mayores.
Contexto: GuardianMesh es una capa de protección antifraude para las llamadas de un adulto mayor. Fuentes: Plan MVP con duplas corregidas, Requerimientos v3.1 y la matriz de atributos de calidad de la wiki.
Tarea: Redactar un documento de requerimientos funcionales y no funcionales.
  - Requerimientos funcionales: uno por historia del Plan MVP, con prioridad MoSCoW, dupla y sprint.
  - Requerimientos no funcionales: rendimiento, capacidad, disponibilidad, efectividad de la detección, seguridad, privacidad, accesibilidad, costo, calidad y DevOps, observabilidad y compatibilidad. Cada uno con su medida y su fuente.
  - Supuestos y puntos abiertos, y glosario.
Restricciones:
- No inventar cifras. Si una medida no está en las fuentes, marcarla como pendiente.
- Seguir el Plan MVP cuando haya contradicción con la versión anterior, y señalarla.
```

**Entregable:** `GuardianMesh_Requerimientos_Funcionales_NoFuncionales.docx`. Contiene RF-01 a RF-38 (uno por HU) y RNF-01 a RNF-59.

---

### `PRM-JM-DOC-02` · Descripción del proyecto para los jueces

- **Responsable:** Juan Miguel Rojas
- **Repositorio / Capa:** Documentación
- **Herramienta y modelo:** Claude Haiku 5.5 (`claude-haiku-5-5`)
- **Objetivo técnico:** Redactar la descripción de media página del proyecto, con el dolor, la solución y el negocio, como introducción para el jurado académico.

**Prompt estructurado:**

```text
Rol: Product manager con experiencia en pitch para jurados académicos.
Contexto: Los evaluadores pidieron a cada grupo una descripción de no más de media página del proyecto, para compartirla con el jurado académico antes de las presentaciones. El proyecto es GuardianMesh.
Tarea: Redactar la descripción con tres partes:
  1. El dolor: qué le pasa a los adultos mayores con las estafas telefónicas.
  2. La solución: cómo funciona GuardianMesh (app, análisis en vivo, niveles de riesgo, alertas).
  3. El negocio: suscripción, precio, costo por minuto, margen y punto de equilibrio, tomados del modelo financiero.
Restricciones:
- Máximo media página, en español.
- Cifras solo del modelo financiero en minutos.
```

**Entregable:** Texto de descripción del proyecto.

---

# Bitácora de Prompts — María Paula Rodríguez Muñoz

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorios / Capas trabajadas:** `GuardianMesh-front`, `GuardianMesh-communications`, `GuardianMesh-api`, `GuardianMesh-infra` (rama `development`) y Portal Técnico / Web 3D (`guardianmeshteam.github.io`)
- **Herramientas y modelos utilizados:** Gemini / Claude
- **Asignatura:** SWNT 2026-2

---

## Tabla Resumen Cronológica

| ID | Módulo / Archivo | Título técnico | Herramienta y modelo | Entregable real generado |
| :--- | :--- | :--- | :--- | :--- |
| `PRM-MP-DOC-01` | Backlog & Casos de Uso | Definición de actores, épicas, historias Gherkin y matriz `CU-01` a `CU-03` | Gemini | Backlog ágil y matriz de casos de uso con umbrales 0–100 |
| `PRM-MP-DOC-02` | `FLUJO GUARDIANMESH.drawio` | Modelado del flujo operativo end-to-end de llamada y escalamiento de riesgo | Gemini | Diagrama de flujo operativo entre Adulto Mayor, Atacante y Familiar |
| `PRM-MP-DOC-03` | `GUARDIAN MESH DIAGRAMS.drawio` | Especificación de Diagrama C4 de Contenedores y Diagrama de Secuencia (24 pasos) | Gemini | Vistas arquitectónicas C4 en AWS `us-east-1` y secuencia en 5 fases |
| `PRM-MP-FRONT-01` | `GuardianMesh-front` | Diseño UX/UI accesible y multisensorial con interfaz unificada | Gemini | Interfaz de semáforo ambiental (Verde/Ámbar/Rojo) sin fricción |
| `PRM-MP-COMM-01` | `GuardianMesh-communications` | Señalización WebSocket para WebRTC 1:1 P2P, timbre de 30 s y canal de avisos | Gemini / Claude | Contratos de eventos (`call:init`, SDP/ICE, `risk:update`, `call:end`) |
| `PRM-MP-SEC-01` | `GuardianMesh-api` / `infra` | Arquitectura Zero-Storage, cumplimiento Ley 1581, 3 CMK en KMS y HMAC-SHA256 | Gemini / Claude | Diseño de privacidad en RAM, segregación KMS y hash de pregunta secreta |
| `PRM-MP-IA-01` | `GuardianMesh-api` | Pipeline híbrido en Bedrock (Voxtral + Nova Lite), RMS/ZCR, reglas e histéresis | Gemini / Claude | Orquestador de ventanas de 8 s, esquema JSON y fallback determinístico |
| `PRM-MP-FIN-01` | `Análisis de Caso Instabeat y GuardianMesh.md` | Análisis estratégico de computación ambiental y arquitectura FinOps | Gemini | Documento comparativo de computación ambiental y contención de tokens e infraestructura por llamada |
| `PRM-MP-DOC-04` | `AUDITORIA_TECNICA.md` y `README.md` | Auditoría de veracidad técnica y estandarización de documentación en 4 repos | Gemini / Claude | `AUDITORIA_TECNICA.md` limpio y `README.md` con badges estáticos en `development` |
| `PRM-MP-WEB-01` | `guardianmeshteam.github.io` | Arquitectura de portal técnico multipágina con escenas 3D y secuencia en Mermaid | Gemini / Claude | Sitio web de documentación técnica navegable mediante código QR |
| `PRM-MP-WEB-02` | `architecture.html#simulacion-3d` | Simulación 3D interactiva End-to-End en Three.js con actores sincronizados | Gemini / Claude | Escena 3D en Three.js integrando video real de la app Android y panel familiar |
| `PRM-MP-QA-01` | Matriz ISO/IEC 25010 & QA | Matriz verificable de calidad ISO/IEC 25010 y checklist de 20 pruebas E2E | Gemini | Tabla de atributos de calidad del MVP y plan de validación de casos límite |
| `PRM-MP-PRES-01` | `GuardianMesh_Sustentacion_Tecnica_6_2.pptx` | Estructuración visual y narrativa del deck técnico de 13 diapositivas | Gemini / Claude | Presentación ejecutiva alineada a rúbrica SWNT con transiciones *Morph* |

---

## Listado Cronológico Detallado de Prompts

---

### `PRM-MP-DOC-01` · Definición de actores, backlog ágil y casos de uso principales

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** Documentación funcional (`guardianmeshteam.github.io`)
- **Herramienta y modelo:** Gemini
- **Objetivo técnico:** Establecer el alcance funcional del MVP centrado en el adulto mayor, definiendo roles, historias de usuario con criterios Gherkin y los tres niveles operativos del semáforo de riesgo.

**Prompt estructurado:**

```text
Rol: Actúa como un Product Owner y Arquitecto de Software especializado en soluciones de ciberseguridad accesibles para adultos mayores.

Contexto: Estamos iniciando el desarrollo de **GuardianMesh**, una aplicación móvil que detecta fraude telefónico (vishing y suplantación con voz clonada por IA) en tiempo real y alerta a la red familiar.

Tarea: Define la estructura funcional base del MVP incluyendo:
1. Los actores principales del sistema (Adulto Mayor, Familiar Protector, Atacante externo y Motor de IA).
2. Épicas e historias de usuario redactadas con criterios de aceptación en formato Gherkin (Dado / Cuando / Entonces) cubriendo: vinculación familiar rápida, configuración de Pregunta Secreta Familiar, monitoreo silencioso en llamada, verificación de sospecha y alerta crítica.
3. Una tabla de casos de uso principales mapeados a un puntaje de riesgo de 0 a 100: CU-01 Verde (0–39, monitoreo silencioso), CU-02 Ámbar (40–69, desafío mediante Pregunta Secreta Familiar) y CU-03 Rojo (70–100, recomendación de colgar y aviso al familiar con un toque).
```

**Entregable:** Generó el backlog inicial, las historias de usuario con criterios Gherkin y la matriz de casos de uso (`CU-01`, `CU-02`, `CU-03`) que rige toda la lógica de negocio del proyecto.

---

### `PRM-MP-DOC-02` · Modelado del flujo operativo end-to-end de llamada

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** Documentación / Arquitectura (`FLUJO GUARDIANMESH.drawio`)
- **Herramienta y modelo:** Gemini
- **Objetivo técnico:** Diseñar el flujo lógico completo desde la recepción de una llamada entrante hasta la resolución en estado Verde, validación por Pregunta Secreta en Ámbar o aviso al familiar, con un toque, en Rojo.

**Prompt estructurado:**

```text
Rol: Actúa como un Analista de Sistemas y Arquitecto de Procesos.

Contexto: Necesito modelar el flujo operativo completo de una llamada en GuardianMesh para diagramarlo en Draw.io (`FLUJO GUARDIANMESH.drawio`).

Tarea: Detalla paso a paso las decisiones, estados y bifurcaciones del proceso:
1. Inicio de llamada entrante hacia el Adulto Mayor y validación inicial de red de confianza.
2. Captura continua de ventanas de audio durante la conversación y evaluación periódica del nivel de riesgo (0–100).
3. Ramificación según el umbral:
   - Puntaje 0–39 (Verde): mantener monitoreo pasivo sin interrumpir la conversación.
   - Puntaje 40–69 (Ámbar): desplegar en pantalla la Pregunta Secreta Familiar para que el adulto mayor verifique la identidad del interlocutor; si acierta, retornar a Verde; si falla o persiste la sospecha, escalar.
   - Puntaje 70–100 (Rojo): activar alerta multisensorial, mostrar botón de colgar y desplegar el botón táctil de acción inmediata «Avisar a [familiar]», para que el adulto mayor envíe la notificación con un solo toque cuando lo necesite (la notificación no se dispara sola).
4. Cierre de llamada y liberación de memoria temporal.
```

**Entregable:** Sirvió de base directa para construir el diagrama `FLUJO GUARDIANMESH.drawio` y validar con el equipo la experiencia paso a paso antes de codificar.

---

### `PRM-MP-DOC-03` · Especificación de Diagrama C4 de Contenedores y Diagrama de Secuencia

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** Arquitectura del sistema (`GUARDIAN MESH DIAGRAMS.drawio` / `GuardianMesh-infra`)
- **Herramienta y modelo:** Gemini
- **Objetivo técnico:** Traducir el flujo funcional a una arquitectura serverless en AWS (`us-east-1`) dividida en 4 repositorios, detallando tanto la vista estática de contenedores (C4) como la vista dinámica en tiempo real (Secuencia en 5 fases).

**Prompt estructurado:**

```text
Rol: Actúa como un Arquitecto de Soluciones Cloud certificado en AWS.

Tarea: Diseña la especificación técnica completa para modelar la arquitectura de GuardianMesh distribuida en 4 repositorios (`GuardianMesh-front`, `GuardianMesh-communications`, `GuardianMesh-api` y `GuardianMesh-infra` en rama `development`):

1. **Diagrama C4 de Contenedores (AWS `us-east-1`):**
   - Cliente móvil híbrido (`GuardianMesh-front`: PWA y Android en React 19 + TypeScript + Capacitor) con captura de audio PCM 16 kHz.
   - Autenticación federada mediante Amazon Cognito (OAuth + PKCE) con validación JWT en cada petición.
   - Tres contenedores serverless desacoplados: Señalización (`GuardianMesh-communications`: API Gateway WebSocket + Lambdas Python 3.12 + EventBridge Scheduler para expirar el timbre a los 30 s), Gateway y Motor de Riesgo (API Gateway HTTP + AWS Lambda + Amazon Bedrock) y Avisos (API Gateway WebSocket + Lambda).
   - Persistencia y seguridad: DynamoDB (con PITR y TTL) y AWS Secrets Manager.

2. **Diagrama de Secuencia (5 fases y 24 pasos):**
   - Fase 1 y 2: Autenticación, `call:init`, programación por Señalización de la expiración de timbre de 30 s en EventBridge Scheduler e intercambio SDP/ICE por WebSocket.
   - Fase 3: Establecimiento de canal de voz WebRTC 1:1 P2P directo (sin servidores PSTN ni tránsito de la llamada por servidores de medios en AWS).
   - Fase 4 y 5: Bucle activo cada ~6 s enviando fragmentos solapados de 8 s a `POST /calls/{id}/evaluate`, actualización de riesgo (`risk:update`), validación de desafío (`POST /calls/{id}/challenge`), alerta (`POST /notifications` -> HTTP 202) y cierre (`call:end`).
```

**Entregable:** Generó los diagramas maestros en `GUARDIAN MESH DIAGRAMS.drawio` y las vistas técnicas usadas en `architecture.html` y en las diapositivas 4 a 9 de la sustentación.

---

### `PRM-MP-FRONT-01` · Diseño UX/UI accesible y multisensorial para adulto mayor

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Gemini
- **Objetivo técnico:** Diseñar una interfaz sin fricción cognitiva para el adulto mayor mediante redundancia multisensorial (color, texto grande, voz y vibración), dentro de una interfaz unificada para todas las cuentas.

**Prompt estructurado:**

```text
Rol: Actúa como un Diseñador UX/UI Senior especialista en accesibilidad cognitiva y visual para adultos mayores (estándar WCAG AAA).

Tarea: Diseña la especificación de componentes y pantallas de `GuardianMesh-front` (React 19 + TypeScript + Capacitor para Android):

1. **Interfaz unificada para cualquier cuenta:**
   - Desde la misma aplicación, cada cuenta puede configurar su red de confianza y la Pregunta Secreta Familiar, revisar su Historial y recibir y consultar sus Avisos.
   - La pantalla de llamada activa se mantiene minimalista, sin menús complejos ni configuraciones técnicas que generen fricción durante la llamada.
2. **Semáforo ambiental con redundancia multisensorial obligatoria:**
   - Estado Verde (0–39): indicador de alto contraste con mensaje claro ("Todo está bien") y botones táctiles grandes de Altavoz y Colgar.
   - Estado Ámbar (40–69): alerta preventiva ("Ten cuidado · Te está pidiendo dinero") acompañada de la tarjeta de Pregunta Secreta Familiar con campo de verificación rápida.
   - Estado Rojo (70–100): alerta crítica ("Riesgo alto · Cuelga y llama a tu familiar") con botón directo de auxilio.
   - Garantiza redundancia multisensorial: color de alto contraste y texto grande en cada nivel, alerta por voz cuando cambia el nivel y vibración con sonido al llegar a Rojo, configurables desde Ajustes.
```

**Entregable:** Definió los estados visuales, textos de interfaz y criterios de accesibilidad implementados en los componentes de `GuardianMesh-front`.

---

### `PRM-MP-COMM-01` · Contratos de señalización WebSocket, WebRTC P2P y canal de avisos

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** `GuardianMesh-communications`
- **Herramienta y modelo:** Gemini / Claude
- **Objetivo técnico:** Estructurar los eventos en tiempo real sobre WebSocket para negociación WebRTC 1:1 sin servidores de medios y entrega instantánea de alertas al familiar.

**Prompt estructurado:**

```text
Rol: Actúa como un Ingeniero Backend especialista en comunicaciones en tiempo real (WebRTC y WebSockets serverless en AWS).

Tarea: Define los contratos de eventos y flujos de mensajes para `GuardianMesh-communications`:

1. **Canal de Señalización (API Gateway WebSocket + AWS Lambda):**
   - Eventos de ciclo de vida de llamada: `auth`, `call:init`, `call:accept`, `call:reject` y `call:end`.
   - Intercambio de señalización P2P: reenvío de `call:offer`, `call:answer` y `call:ice-candidate` entre llamante y receptor para establecer audio WebRTC 1:1 directo sin pasar por PSTN ni servidores TURN/media centralizados en el MVP.
   - Temporizador de timbre: programación de regla de 30 segundos en EventBridge Scheduler para expirar llamadas no contestadas automáticamente.
2. **Canal de Avisos en Vivo:**
   - Emisión en tiempo real de `risk:update` hacia el cliente del adulto mayor y entrega inmediata de notificaciones de emergencia al panel del familiar protector conectado, manteniendo persistencia temporal en DynamoDB si el familiar está desconectado al momento del evento.
```

**Entregable:** Estandarizó los esquemas de mensajes WebSocket y la integración entre `GuardianMesh-front` y los handlers de `GuardianMesh-communications`.

---

### `PRM-MP-SEC-01` · Arquitectura Zero-Storage, cumplimiento Ley 1581, KMS y HMAC-SHA256

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** `GuardianMesh-api` y `GuardianMesh-infra`
- **Herramienta y modelo:** Gemini / Claude
- **Objetivo técnico:** Garantizar privacidad por diseño sobre el audio de las llamadas, proteger secretos familiares mediante criptografía irreversible y segregar llaves de cifrado conforme a la Ley 1581 de 2012.

**Prompt estructurado:**

```text
Rol: Actúa como un Arquitecto de Ciberseguridad y Privacidad de Datos especializado en AWS y regulación colombiana (Ley 1581 de 2012).

Tarea: Define los controles de seguridad obligatorios para `GuardianMesh-api` y `GuardianMesh-infra`:

1. **Arquitectura Zero-Storage para voz:**
   - Asegura que los fragmentos de audio PCM de 16 kHz viajen cifrados en tránsito (HTTPS/TLS y DTLS-SRTP), se procesen de forma efímera en memoria volátil (RAM) dentro de AWS Lambda y Amazon Bedrock (Zero-Storage), y que el audio no se persista en S3, DynamoDB ni logs de aplicación; de la voz solo se guardan los rasgos numéricos (RMS/ZCR) de la huella vocal.
2. **Protección criptográfica de la Pregunta Secreta Familiar:**
   - Diseña el almacenamiento y validación usando hash irreversible **HMAC-SHA256** con llave secreta custodiada en AWS Secrets Manager, de modo que la respuesta nunca se guarde en texto plano.
3. **Segregación de llaves en AWS KMS y ciclo de vida de datos:**
   - Especifica 3 Customer Managed Keys (CMK) independientes en AWS KMS (`pii` para datos personales en DynamoDB, `secrets` para Secrets Manager y `logs` para CloudWatch Logs), complementadas con políticas TTL de expiración automática y Point-in-Time Recovery (PITR) en DynamoDB, más el flujo de consentimiento informado explícito exigido por la Ley 1581: una pantalla en el cliente (`GuardianMesh-front`) que el usuario debe aceptar antes de usar el servicio.
```

**Entregable:** Estableció los controles de seguridad, políticas KMS y manejo efímero de audio documentados en la arquitectura y verificados en la rúbrica de calidad.

---

### `PRM-MP-IA-01` · Pipeline híbrido de IA en Amazon Bedrock y reglas determinísticas

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Gemini / Claude
- **Objetivo técnico:** Diseñar una arquitectura de decisión híbrida donde la IA generativa extraiga señales semánticas estructuradas pero la clasificación final del semáforo sea auditable, determinística y resistente a fallos.

**Prompt estructurado:**

```text
Rol: Actúa como un Ingeniero de Machine Learning y Sistemas Distribuidos en AWS.

Tarea: Diseña el pipeline híbrido de evaluación de riesgo en tiempo real de `GuardianMesh-api` procesando ventanas solapadas de ~8 segundos de audio cada ~6 segundos:

1. **Etapa 1 — Orquestación en Amazon Bedrock Converse API:**
   - Encadena dos modelos con responsabilidades separadas: `mistral.voxtral-small-24b-2507` para transcripción de voz y `us.amazon.nova-lite-v1:0` para análisis semántico de intención devolviendo estrictamente un JSON estructurado con indicadores de urgencia extrema, coerción/secreto, suplantación de autoridad y solicitud financiera.
2. **Etapa 2 — Rasgos acústicos, después de Bedrock:**
   - Los rasgos base de la huella vocal (RMS/ZCR) se registran al configurar la seguridad del contacto de confianza, cuando se aporta una muestra de voz (`/contacts/{id}/security`); es lo único de la voz que se persiste en DynamoDB, y el audio no se almacena.
   - Durante la llamada, el pipeline evalúa ventanas solapadas de ~8 s cada ~6 s: calcula energía RMS y tasa de cruces por cero (ZCR) sobre el PCM de 16 kHz para compararlas con esa base y detectar voz sintética.
3. **Etapa 3 — Motor determinístico, Fallback e Histéresis:**
   - Combina las señales en un puntaje auditable (0–100) mediante reglas duras; garantiza 100 % de fallback determinístico si Bedrock excede latencia o falla; y aplica histéresis asimétrica de 15 segundos al descenso automático por puntuación de Rojo a Verde, para evitar que una frase calmada del atacante apague una alerta real. Si se acierta el desafío de la Pregunta Secreta Familiar, la alerta se levanta de inmediato, sin esperar los 15 segundos.
```

**Entregable:** Definió la arquitectura de 3 etapas, el contrato JSON de salida de Nova Lite y la regla de histéresis de 15 s implementados en el motor de riesgo.

---

### `PRM-MP-FIN-01` · Análisis estratégico y arquitectura FinOps para sostenibilidad de márgenes

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** Documentación estratégica (`Análisis de Caso Instabeat y GuardianMesh.md`)
- **Herramienta y modelo:** Gemini
- **Objetivo técnico:** Fundamentar el diseño de computación ambiental sin fricción y establecer mecanismos FinOps para evitar la destrucción de márgenes por consumo descontrolado de inferencia en la nube.

**Prompt estructurado:**

```text
Rol: Actúa como un Estratega de Producto Tecnológico y Arquitecto FinOps.

Tarea: Realiza un análisis estratégico comparando el caso de hardware deportivo Instabeat con la plataforma VoIP + IA GuardianMesh enfocado en computación ambiental y sostenibilidad financiera:

1. Contrasta el ADN compartido de fricción cero (el nadador solo usa sus gafas; el adulto mayor solo contesta su teléfono) y el uso de indicadores visuales ambientales de alto contraste (semáforo Verde, Ámbar, Rojo) para evitar sobrecarga cognitiva.
2. Analiza el riesgo de margin destruction: fallas físicas/garantías en hardware frente a consumo descontrolado de tokens de STT y LLM en llamadas largas.
3. Explica cómo la arquitectura implementada contiene el consumo de tokens e infraestructura por llamada: el audio de la conversación viaja por WebRTC 1:1 P2P, sin tránsito por servidores de medios en la nube; el análisis usa un muestreo acotado de ventanas de ~8 s; la intención se evalúa con un modelo ligero (`Nova Lite`); y un fallback determinístico, con un solo reintento, evita insistir cuando la IA no responde.
```

**Entregable:** Produjo el documento `Análisis de Caso Instabeat y GuardianMesh.md` y sustentó la viabilidad económica y arquitectura FinOps del proyecto.

---

### `PRM-MP-DOC-04` · Auditoría técnica y estandarización de README en los 4 repositorios

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** `GuardianMesh-front`, `GuardianMesh-communications`, `GuardianMesh-api`, `GuardianMesh-infra`
- **Herramienta y modelo:** Gemini / Claude
- **Objetivo técnico:** Garantizar veracidad técnica estricta en toda la documentación de los repositorios (rama `development`), eliminando inconsistencias y estandarizando los `README.md` y `AUDITORIA_TECNICA.md`.

**Prompt estructurado:**

```text
Rol: Actúa como un Staff Software Engineer y Auditor Técnico.

Tarea: Revisa la documentación y estructura de los 4 repositorios de GuardianMesh en la rama `development` (`GuardianMesh-front`, `GuardianMesh-communications`, `GuardianMesh-api` y `GuardianMesh-infra`) para regenerar `AUDITORIA_TECNICA.md` y actualizar cada `README.md`:

1. **Veracidad técnica estricta:** Documenta únicamente las tecnologías, modelos, endpoints y recursos AWS realmente configurados en el código e infraestructura Terraform (React 19, TypeScript, Capacitor, Python 3.12, AWS Lambda, API Gateway HTTP/WebSocket, DynamoDB, Cognito, KMS, EventBridge, Amazon Bedrock con Voxtral Small y Nova Lite, Vitest y Ruff), sin exagerar capacidades ni incluir componentes no implementados.
2. **Estandarización visual y estructural:** Incluye badges estáticos consistentes con la paleta de marca de GuardianMesh, arquitectura del módulo, variables de entorno requeridas, instrucciones de despliegue/ejecución y enlaces cruzados entre los 4 repositorios.
```

**Entregable:** Regeneró `AUDITORIA_TECNICA.md` y dejó los `README.md` de los 4 repositorios alineados, limpios y verificables antes de la entrega final.

---

### `PRM-MP-WEB-01` · Portal técnico multipágina en GitHub Pages con escenas 3D y secuencia Mermaid

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** Portal Web (`guardianmeshteam.github.io`)
- **Herramienta y modelo:** Gemini / Claude
- **Objetivo técnico:** Consolidar toda la ingeniería, diagramas y documentación de GuardianMesh en un portal web público accesible mediante código QR durante la sustentación.

**Prompt estructurado:**

```text
Rol: Actúa como un Ingeniero Frontend y Arquitecto de Documentación Técnica.

Tarea: Diseña y estructura el portal web multipágina de ingeniería de GuardianMesh desplegado en GitHub Pages (`guardianmeshteam.github.io`):

1. **Arquitectura de información navegable:** Organiza secciones claras para visión del problema, casos de uso, arquitectura técnica (`architecture.html`), pipeline de IA híbrida, criterios de calidad ISO/IEC 25010 y bitácora de prompts.
2. **Diagramas técnicos interactivos:** Usa Mermaid para el diagrama de secuencia; construye como escenas 3D interactivas los casos de uso, las máquinas de estado, el modelo de datos, el pipeline de IA y la simulación end-to-end; y presenta la arquitectura C4 (contenedores y componentes) como diagramas SVG interactivos hechos en draw.io, todo con la paleta visual de GuardianMesh.
3. **Optimización para consulta móvil vía QR:** Asegura diseño responsivo, carga rápida y navegación intuitiva para que el jurado pueda explorar la documentación y arquitectura desde sus dispositivos durante la exposición.
```

**Entregable:** Desplegó el sitio multipágina `guardianmeshteam.github.io` enlazado directamente en el QR 1 de la presentación.

---

### `PRM-MP-WEB-02` · Simulación 3D End-to-End en Three.js con actores sincronizados

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** Portal Web / Web 3D (`architecture.html#simulacion-3d`)
- **Herramienta y modelo:** Gemini / Claude
- **Objetivo técnico:** Construir una visualización 3D interactiva que demuestre en paralelo el comportamiento de los tres actores y la app Android real durante un ataque de vishing en tiempo real.

**Prompt estructurado:**

```text
Rol: Actúa como un Desarrollador Creative Frontend especialista en Three.js y visualización de sistemas en tiempo real.

Tarea: Implementa una simulación 3D interactiva End-to-End embebida en `architecture.html#simulacion-3d`:

1. **Escena sincronizada de 3 actores:** Representa espacialmente en paralelo al Atacante externo (izquierda), al Adulto Mayor con la pantalla real de la app Android (centro) y al Familiar Protector con su panel de avisos (derecha), conectados mediante flujos visuales de señalización, audio P2P y análisis en la nube.
2. **Integración de video real y línea de tiempo:** Sincroniza la reproducción del video real de la aplicación ejecutando el escenario de ataque ("Me acabo de estrellar, necesito 10 millones urgente") con hitos marcados en `00:00` (estado Verde), `00:17` (detección de urgencia + dinero -> cambio a estado Rojo) y `00:25` (disparo y recepción de alerta en el panel del familiar).
3. **Controles de reproducción:** Incluye controles de reproducción/pausa y etiquetas descriptivas sincronizadas para utilizar tanto en el portal web como en las demostraciones de la sustentación.
```

**Entregable:** Generó la simulación 3D interactiva en `architecture.html#simulacion-3d` y los clips sincronizados integrados en las diapositivas 3 y 12.

---

### `PRM-MP-QA-01` · Matriz de calidad ISO/IEC 25010 y checklist de verificación E2E

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** Aseguramiento de calidad y sustentación (SWNT 2026-2)
- **Herramienta y modelo:** Gemini
- **Objetivo técnico:** Definir métricas verificables en el MVP bajo la norma ISO/IEC 25010 y estructurar una lista de chequeo de pruebas funcionales y casos límite.

**Prompt estructurado:**

```text
Rol: Actúa como un Líder de Aseguramiento de Calidad (QA) en Ingeniería de Software.

Tarea: Construye el marco de verificación de calidad del MVP de GuardianMesh:

1. **Matriz ISO/IEC 25010 con indicadores medibles en el MVP:**
   - *Usabilidad y accesibilidad:* redundancia en 3 canales simultáneos (semáforo visual de alto contraste + texto grande, voz al cambiar de nivel y vibración en Rojo).
   - *Seguridad y privacidad:* cumplimiento de Ley 1581, procesamiento Zero-Storage en RAM, hash irreversible HMAC-SHA256 para la pregunta secreta y 3 llaves CMK independientes en AWS KMS (`pii`, `secrets`, `logs`).
   - *Fiabilidad:* 100 % de continuidad operativa mediante fallback determinístico cuando la IA presenta latencia o indisponibilidad.
   - *Mantenibilidad:* infraestructura como código reproducible en Terraform y CI en dos repositorios: `GuardianMesh-front` (pruebas con Vitest, build con verificación de tipos, `npm audit` y APK de debug) y `GuardianMesh-infra` (Ruff, shellcheck, yamllint, tflint, `terraform validate`, pytest con cobertura, Gitleaks, Checkov y pip-audit). `GuardianMesh-api` y `GuardianMesh-communications` tienen pruebas con pytest que se ejecutan localmente, sin CI de pruebas configurado.
2. **Checklist de 20 escenarios E2E y casos límite:** Incluye pruebas de estafa con voz clonada, emergencia real desde número prestado resolviendo la pregunta secreta, llamada de familiar verificado, pérdida de conexión a internet y revocación de permisos en Android.
```

**Entregable:** Produjo la matriz ISO/IEC 25010 presentada en la diapositiva 11 y el checklist interactivo de 20 puntos de control del MVP.

---

### `PRM-MP-PRES-01` · Estructuración técnica y visual del deck de sustentación (13 diapositivas)

- **Responsable:** María Paula Rodríguez Muñoz
- **Repositorio / Capa:** Documentación de sustentación (`GuardianMesh_Sustentacion_Tecnica_6_2.pptx`)
- **Herramienta y modelo:** Gemini / Claude
- **Objetivo técnico:** Diseñar una presentación ejecutiva de 13 diapositivas alineada con todos los criterios de la rúbrica SWNT 2026-2, incorporando códigos QR, animaciones 3D y vistas progresivas Morph para los diagramas complejos.

**Prompt estructurado:**

```text
Rol: Actúa como un Arquitecto de Software y Especialista en Comunicación Técnica.

Tarea: Diseña la estructura completa de una presentación técnica de 13 diapositivas (`GuardianMesh_Sustentacion_Tecnica_6_2.pptx`) para la sustentación de SWNT 2026-2 ante el jurado académico:

1. **Alineación directa con la rúbrica de evaluación:**
   - Slide 1: Portada con propuesta de valor y 2 códigos QR grandes (QR 1 al portal `guardianmeshteam.github.io` con documentación y bitácora de prompts; QR 2 de descarga directa del `.apk`).
   - Slide 2: Contexto y cifras de vishing en Colombia, 4 vectores psicológicos y brecha de los bloqueadores tradicionales.
   - Slide 3: Actores y casos de uso (`CU-01`, `CU-02`, `CU-03`) sincronizados con animación 3D.
   - Slides 4–6: Arquitectura técnica en 4 repositorios y Diagrama C4 de contenedores con acercamientos progresivos tipo *Zoom Morph* (vista general, capa superior frontend/Cognito y capa inferior serverless AWS).
   - Slides 7–9: Diagrama de Secuencia en 5 fases con acercamientos *Zoom Morph* (Parte A señalización/WebRTC P2P y Parte B bucle de evaluación cada ~6 s).
   - Slide 10: Pipeline híbrido de IA (RMS/ZCR + Bedrock Converse API con Voxtral Small y Nova Lite + reglas e histéresis de 15 s) y nota de entrega de prompts.
   - Slide 11: Criterios de calidad ISO/IEC 25010 medibles en el MVP.
   - Slides 12–13: Demostración end-to-end sobre escenario real (`00:00` Verde -> `00:17` Rojo -> `00:25` Aviso familiar) y cierre.
2. **Principio de diseño visual:** Prioriza diagramas limpios, tarjetas escaneables con jerarquía tipográfica clara y cero sobrecarga de texto en pantalla.
```

**Entregable:** Consolidó el deck final `GuardianMesh_Sustentacion_Tecnica_6_2.pptx` listo para proyectar y defender ante el jurado.
