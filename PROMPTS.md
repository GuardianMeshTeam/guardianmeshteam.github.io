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

# Bitácora de Prompts — Cristian Silva

- **Responsable:** Cristian Silva
- **Repositorios / Capas trabajadas:** `GuardianMesh-communications` (señalización WebRTC y OpenSpec) · `GuardianMesh-api` (gateway, contactos, riesgo de llamadas) · `GuardianMesh-front` (cliente de llamadas, pantalla de riesgo, Android) · `GuardianMesh-infra` (Terraform: comunicaciones, gateway, CI/CD)
- **Herramientas y modelos utilizados:** Claude Code CLI · Claude Sonnet 5.5 y Claude Haiku 5.5
- **Asignatura:** SWNT 2026-2

---

## Tabla resumen

| ID | Módulo / Archivo | Título técnico | Herramienta y modelo | Entregable real generado |
|---|---|---|---|---|
| PRM-COM-01 | `src/guardianmesh_communications/` | Núcleo de señalización WebRTC 1:1 | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `2f8d1c7` · core, adapters, interfaces y pruebas unit/contract |
| PRM-COM-02 | `openspec/changes/add-webrtc-1to1-calls` | Alinear el contrato con la infra real | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `a4c1405` · `design.md`, `tasks.md` |
| PRM-COM-03 | `openspec/changes/add-webrtc-1to1-calls` | Marcar el grupo 5 de tareas | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `f1748fa` · `tasks.md` |
| PRM-COM-04 | `openspec/changes/add-contacts-directory` | Propuesta OpenSpec del directorio de contactos | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `cd725d2` · proposal, design, specs, tasks |
| PRM-COM-05 | `openspec/changes/add-contacts-directory` | Validación en dev del directorio | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `59be439` · `validation.md` |
| PRM-COM-06 | `openspec/changes/add-contacts-directory` | Completar la validación | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `3649699` · `validation.md`, `tasks.md` |
| PRM-COM-07 | `openspec/changes/harden-real-call-risk` | Propuesta OpenSpec de detección de fraude real | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `d98e7cc` · proposal, design, specs, tasks |
| PRM-COM-08 | `openspec/changes/harden-real-call-risk` | Pregunta de seguridad compacta y reglas duras | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `53b2ab6` · specs `call-risk-evaluation` y `call-risk-delivery` |
| PRM-API-01 | `src/guardianmesh_auth/` (contactos) | Directorio de contactos con invitación por correo | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `22c9461` · `core/contacts.py`, adapters DynamoDB y Cognito admin, rutas |
| PRM-API-02 | `src/guardianmesh_auth/interfaces/lambda_handler.py` | Logs INFO del Lambda gateway | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `10d3482` · `lambda_handler.py`, `test_lambda_logging.py` |
| PRM-API-03 | `src/guardianmesh_auth/`, `guardianmesh_orchestrator`, `guardianmesh_challenge`, `guardianmesh_voice` | Detección de fraude real y endurecida | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `632e6e8` · riesgo en DynamoDB, desafío HMAC, Bedrock, notificador WebSocket, tests de contrato |
| PRM-API-04 | `guardianmesh_orchestrator` | Solo reglas duras suben el riesgo tras un desafío acertado | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `345203e` · `estados.py`, `orquestador.py`, `test_orquestador.py` |
| PRM-FRO-01 | `src/components/call/`, `src/services/calls/` | Cliente de llamadas de audio y directorio de contactos | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `3cd769e` · `CallProvider`, `CallScreen`, `useCall` |
| PRM-FRO-02 | `android/`, `capacitor.config.ts`, `.github/workflows/` | App Android con Capacitor y CI que genera el APK | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `353de34`, `a4ee08e` · proyecto Android, `android-release.yml` |
| PRM-FRO-03 | `.github/workflows/android-release.yml` | APK sobre el cliente de llamadas ya integrado | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `dc62cea` · workflows CI |
| PRM-FRO-04 | `android/app/src/main/AndroidManifest.xml` | Permiso de micrófono y llave de debug | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `172b386` · `AndroidManifest.xml`, `useCall.ts` |
| PRM-FRO-05 | `src/components/risk/`, `src/services/callRisk.ts` | Semáforo de riesgo real con audio casi en tiempo real | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `13d73aa` · `callRisk.ts`, `signaling.ts`, `riskCopy.ts` |
| PRM-FRO-06 | `src/components/call/CallScreen.tsx` | Pantalla de llamada con controles fijos y riesgo real | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `99fe398` · `CallScreen.tsx`, `SecurityChallenge.tsx`, `TrustedContactAlert.tsx`, `peer.ts` |
| PRM-FRO-07 | `src/screens/carmen/ContactsScreen.tsx`, `design-system.css` | Hoja de invitar sólida y tarjeta en escritorio | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `cb88032` · `ContactsScreen.tsx`, `design-system.css` |
| PRM-FRO-08 | `src/components/call/CallProvider.tsx` | Aviso de fin de llamada compacto | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `3039dc0` · `CallProvider.tsx`, `call.css` |
| PRM-FRO-09 | `src/auth/`, front de autenticación | Migrar la autenticación del front a Cognito | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `1d7cbc0` · `src/auth/providers/cognito.ts` |
| PRM-INF-01 | `.github/workflows/`, `.checkov.yaml`, `.gitleaks.toml`, `Makefile` | Pipeline CI/CD con gates DevSecOps bloqueantes | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `fcc14db` · `ci.yml`, `deploy.yml`, configuración de Checkov, Gitleaks y TFLint |
| PRM-INF-02 | `modules/cognito/`, `environments/*/terraform.tfvars.example` | Habilitar USER_SRP_AUTH para la PWA y Android | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `c0549aa` · `cognito/policy.json`, `test_cognito_pool_policy.py` |
| PRM-INF-03 | `modules/communications/`, `environments/dev/communications.tf` | Módulo de señalización WebRTC 1:1 (HU-10) | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `4aad7e3` · `api.tf`, `iam.tf`, `lambda.tf`, `scheduler.tf`, `tables.tf` |
| PRM-INF-04 | `modules/communications/iam.tf` | Permiso de la CMK `pii` a través de DynamoDB | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `b4bedad` · `iam.tf`, test del módulo |
| PRM-INF-05 | `modules/communications/`, `modules/gateway/iam.tf` | Tabla de contactos y permisos del gateway | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `3fe080f` · `tables.tf`, `iam.tf`, `gateway.tf` |
| PRM-INF-06 | `scripts/build-lambda-packages.sh` | El zip del Lambda no incluía sus paquetes | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `61b0df8` · script de build, `test_pipeline.py` |
| PRM-INF-07 | `modules/communications/`, `modules/gateway/`, `environments/dev/data_protection.tf` | Tabla, secreto y permisos para la detección de fraude real | Claude Code CLI · Sonnet 5.5 / Haiku 5.5 | `8f7812d` · `tables.tf`, `iam.tf`, `data_protection.tf` y tests |

---

## Listado cronológico de prompts

## Módulo COMUNICACIONES (`GuardianMesh-communications`)

### `PRM-COM-01` · Núcleo de señalización WebRTC 1:1

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-communications`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Construir el servicio de señalización de llamadas 1:1 (`call:init`, `call:accept`, `call:offer`, `call:answer`, `call:ice-candidate`, `call:end`) con máquina de estados, adaptadores DynamoDB/API Gateway/EventBridge y puertos desacoplados del núcleo.

**Prompt estructurado:**

```text
Rol: Ingeniero de software senior en Python 3.12 especializado en sistemas de tiempo real y arquitectura hexagonal.
Contexto: GuardianMesh necesita llamadas de audio WebRTC 1:1 entre dos usuarios autenticados. La señalización corre en AWS (API Gateway WebSocket, DynamoDB, EventBridge Scheduler). El audio viaja peer a peer; el servicio solo enruta SDP e ICE.
Tarea: Implementar el núcleo de señalización con su ciclo de vida de llamada (ringing → accepted → ended/rejected/timeout/failed), los puertos del núcleo y sus adaptadores (DynamoDB para llamadas y conexiones, notificador `@connections`, scheduler para el timeout), además de los puntos de entrada Lambda y servidor local.
Restricciones técnicas:
- El núcleo no importa boto3 (pruébalo con un test de pureza).
- El emisor se toma de la sesión autenticada, nunca de un `senderId` enviado por el cliente.
- SDP e ICE son transitorios: no se persisten ni se registran en logs.
- Validar estructura y tamaño de cada evento.
- Pruebas unitarias y de contrato por adaptador.
```

---

### `PRM-COM-02` · Alinear el contrato de `add-webrtc-1to1-calls` con la infra real

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-communications` (OpenSpec)
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Corregir `design.md` y `tasks.md` para que describan los recursos y el contrato de eventos que Terraform de verdad despliega, no una propuesta anterior.

**Prompt estructurado:**

```text
Rol: Arquitecto de software que mantiene artefactos OpenSpec sincronizados con la implementación.
Contexto: El change `add-webrtc-1to1-calls` describe un servicio FastAPI con ALB. La infraestructura real (`GuardianMesh-infra/modules/communications`) usa API Gateway WebSocket, Lambda, DynamoDB y EventBridge Scheduler.
Tarea: Revisar `design.md` y `tasks.md` y reescribirlos para reflejar el contrato real de la infraestructura desplegable, sin cambiar el alcance funcional (audio 1:1, aceptar/rechazar/colgar, timeout).
Restricciones técnicas:
- No inventar recursos: cada recurso citado debe existir en el módulo Terraform.
- Mantener la estructura de tareas OpenSpec y los identificadores de grupo.
- Solo cambios de documentación.
```

---

### `PRM-COM-03` · Marcar el grupo 5 de tareas WebRTC como completado

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-communications` (OpenSpec)
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Reflejar en `tasks.md` el estado real del grupo 5 (cliente WebRTC en el front) tras la integración.

**Prompt estructurado:**

```text
Rol: Responsable de seguimiento de un change OpenSpec.
Contexto: El grupo 5 de `add-webrtc-1to1-calls` corresponde al cliente WebRTC del front (`useCall`, `CallScreen`, peer de audio). Ya está integrado en `GuardianMesh-front`.
Tarea: Marcar como completadas en `tasks.md` solo las subtareas del grupo 5 que estén verificadas en el código y en las pruebas; dejar pendientes las que no.
Restricciones técnicas: No modificar el alcance ni otros grupos. Solo edición de `tasks.md`.
```

---

### `PRM-COM-04` · Crear el change `add-contacts-directory`

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-communications` (OpenSpec)
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Definir la propuesta, el diseño, la especificación y las tareas del directorio de contactos con invitación por correo, antes de implementarlo.

**Prompt estructurado:**

```text
Rol: Analista de software que redacta changes OpenSpec listos para implementar.
Contexto: Los usuarios protegidos necesitan agregar contactos de confianza. El directorio vive en la API de GuardianMesh (Cognito + DynamoDB). La invitación se envía por correo, y el contacto debe aceptarla.
Tarea: Crear el change `add-contacts-directory` con `proposal.md` (por qué y qué cambia), `design.md`, `specs/contacts-directory/spec.md` con escenarios verificables, `tasks.md` agrupado y `.openspec.yaml`.
Restricciones técnicas:
- Sin Cognito en el front como fuente de verdad: la identidad se toma del token en el gateway.
- Un contacto solo es válido cuando está aceptado.
- Escenarios de aceptación y de rechazo, y límites explícitos.
- Usar el flujo de OpenSpec del repositorio (no crear estructuras nuevas).
```

---

### `PRM-COM-05` · Validación en dev de `add-contacts-directory`

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-communications` (OpenSpec)
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Registrar la validación del directorio de contactos contra el entorno `dev` de AWS, con evidencia de cada escenario.

**Prompt estructurado:**

```text
Rol: QA de integración para una plataforma serverless en AWS (us-east-1, entorno dev).
Contexto: El directorio de contactos ya está desplegado en dev (gateway Lambda, DynamoDB y Cognito). Los escenarios están en `specs/contacts-directory/spec.md`.
Tarea: Ejecutar o revisar cada escenario contra dev y documentarlo en `validation.md`: qué se probó, resultado, evidencia (código HTTP, respuesta) y qué quedó simulado o pendiente. Actualizar `tasks.md` con el estado.
Restricciones técnicas:
- Distinguir explícitamente lo ejecutado, lo simulado y lo pendiente.
- No marcar como válido un escenario que no se ejecutó.
- No incluir tokens, correos reales ni datos sensibles en la documentación.
```

---

### `PRM-COM-06` · Completar la validación de `add-contacts-directory`

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-communications` (OpenSpec)
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Cerrar los escenarios de validación que faltaban y dejar `tasks.md` consistente con el resultado.

**Prompt estructurado:**

```text
Rol: QA que cierra una validación OpenSpec.
Contexto: `validation.md` ya tiene los escenarios iniciales de `add-contacts-directory` ejecutados en dev, pero faltaban casos.
Tarea: Completar los escenarios faltantes en `validation.md` y reflejar el cierre en `tasks.md`. No cambiar la especificación.
Restricciones técnicas: Solo documentación. Cada resultado debe tener evidencia verificable.
```

---

### `PRM-COM-07` · Crear el change `harden-real-call-risk`

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-communications` (OpenSpec)
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Documentar el paso de la detección de riesgo de demostración (regex, estado en memoria, banderas de simulación) a un modelo real con estado duradero y entrega en tiempo real.

**Prompt estructurado:**

```text
Rol: Arquitecto de seguridad y analista de software.
Contexto: La detección de fraude en `GuardianMesh-api` (`/api/v1/calls/*`) usa expresiones regulares, guarda el estado en la memoria de una Lambda, permite forzar ROJO con banderas `simular_*` del cuerpo, salta el segundo factor con alias `/demo/` y entrega el resultado solo en la respuesta HTTP (el webhook apunta a 127.0.0.1).
Tarea: Crear el change `harden-real-call-risk` con:
- `proposal.md`: problema, cambios por repositorio (API, infra, front) y capacidades nuevas (`call-risk-evaluation`, `call-risk-delivery`).
- `design.md`: decisiones de modelo (Bedrock Converse con respaldo por regex), audio con transcripción por fragmentos, persistencia en DynamoDB con TTL y CMK, entrega por WebSocket.
- `specs/` con escenarios verificables.
- `tasks.md` agrupado.
Restricciones técnicas:
- Solo entorno dev.
- Sin banderas de simulación en el cuerpo de la petición.
- La clave HMAC del desafío sale de Secrets Manager; sin ella las rutas de riesgo responden 503 not_configured.
- Límites de tamaño de cuerpo y audio, evaluaciones por usuario y minuto, y máximo de intentos.
- `contact_id` debe ser un contacto aceptado de quien evalúa.
```

---

### `PRM-COM-08` · Pregunta de seguridad compacta y solo reglas duras tras acertar

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-communications` (OpenSpec)
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Ajustar la especificación del desafío de seguridad: la pregunta debe ser breve y, si el interlocutor la acierta, solo las reglas duras (no las heurísticas) pueden seguir subiendo el riesgo.

**Prompt estructurado:**

```text
Rol: Diseñador de producto y especialista en seguridad en llamadas.
Contexto: Durante una llamada, la app puede hacer una pregunta de seguridad a quien llama. Si la respuesta es correcta, el riesgo no debe seguir subiendo por heurísticas, porque un estafador podría haberla aprendido.
Tarea: Reescribir en `specs/call-risk-evaluation/spec.md` y `specs/call-risk-delivery/spec.md`:
- La pregunta de seguridad como una frase corta y específica.
- Que tras un acierto solo las reglas duras (p. ej., solicitud de datos bancarios o de códigos) puedan elevar el riesgo.
Restricciones técnicas: Solo documentación OpenSpec. Mantener los escenarios de aceptación ya existentes y sus identificadores.
```

---

## Módulo API (`GuardianMesh-api`)

### `PRM-API-01` · Directorio de contactos con invitación por correo

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Implementar en el gateway la lista de contactos del usuario protegido: crear invitaciones por correo, aceptarlas y listar contactos aceptados.

**Prompt estructurado:**

```text
Rol: Ingeniero backend senior en Python 3.12 (FastAPI en Lambda, arquitectura por puertos y adaptadores).
Contexto: GuardianMesh-api es el gateway HTTP detrás de API Gateway, con identidad en Cognito. El change `add-contacts-directory` define el comportamiento.
Tarea: Implementar el directorio de contactos:
- Núcleo `core/contacts.py` con reglas de invitación y de aceptación.
- Adaptador DynamoDB (`dynamodb_contacts.py`) y adaptador de administración de Cognito (`cognito_admin.py`) para buscar usuarios.
- Rutas `contacts_routes.py` conectadas en `http_app.py` y `lambda_handler.py`.
- Adaptador en memoria para pruebas.
Restricciones técnicas:
- El identificador del usuario sale del token verificado, nunca de la petición.
- Solo contactos aceptados pueden usarse para evaluar riesgo.
- Pruebas unitarias del servicio y de contrato para endpoint y adaptadores.
```

---

### `PRM-API-02` · Corregir los logs INFO del Lambda gateway

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Hacer que el Lambda emita sus logs de nivel INFO en CloudWatch, que no aparecían.

**Prompt estructurado:**

```text
Rol: Ingeniero de operaciones serverless que depura observabilidad en AWS Lambda.
Contexto: El Lambda gateway de GuardianMesh (Python 3.12) no emite logs INFO en CloudWatch, por lo que no se puede seguir una petición.
Tarea: Corregir la configuración de logging en `lambda_handler.py` para que los logs INFO lleguen a CloudWatch, y añadir una prueba que lo demuestre.
Restricciones técnicas: No registrar tokens, cabeceras de autorización ni datos personales en los logs. Cambio mínimo.
```

---

### `PRM-API-03` · Detección de fraude real y endurecida en llamadas

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Reemplazar la demo de riesgo por un flujo con modelo real (Bedrock), estado persistente, desafío HMAC, límites, entrega por WebSocket y pruebas de contrato.

**Prompt estructurado:**

```text
Rol: Ingeniero de seguridad y backend senior especializado en detección de fraude telefónico (vishing) con IA generativa.
Contexto: El cambio `harden-real-call-risk` exige que la detección no pueda forzarse desde el cliente, use un modelo real y guarde su estado de forma duradera. Actualmente el riesgo vive en memoria de Lambda y las reglas son regex.
Tarea: Implementar el endurecimiento de extremo a extremo en la API:
- Eliminar `simular_clonacion` y `simular_suplantacion` del cuerpo y los alias `/demo/` que saltan el segundo factor.
- Adaptador `BedrockClienteLLM` (Converse API, Amazon Nova por defecto) conectado al agente de intención, con las regex como respaldo.
- Adaptador de voz para transcribir fragmentos de audio.
- Persistencia de huellas, desafíos y estado del orquestador (histéresis y `desafio_evaluado`) en DynamoDB con TTL y CMK `pii`.
- Desafío con clave HMAC desde Secrets Manager; sin clave, `503 not_configured`.
- Límites: tamaño de cuerpo y de audio, evaluaciones por usuario y minuto, intentos máximos de respuesta.
- `contact_id` debe ser un contacto aceptado de quien evalúa.
- Publicar `risk:update` por la conexión WebSocket de quien evalúa y retirar el webhook a 127.0.0.1.
Restricciones técnicas:
- Solo entorno dev.
- El agente de intención debe funcionar con el respaldo aunque Bedrock falle.
- Pruebas de contrato para Bedrock, DynamoDB, Secrets Manager, notificador WebSocket y endpoint.
- No registrar audio, transcripciones completas ni la clave en los logs.
```

---

### `PRM-API-04` · Solo reglas duras suben el riesgo tras un desafío acertado

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-api`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Cambiar el orquestador para que, tras un acierto en el desafío, las heurísticas no puedan elevar el riesgo, pero sí las reglas duras.

**Prompt estructurado:**

```text
Rol: Ingeniero de software que ajusta la lógica de decisión de un orquestador de riesgo.
Contexto: En `guardianmesh_orchestrator` el riesgo se fusiona de varios agentes. Si quien llama responde bien el desafío de seguridad, las heurísticas no deben seguir subiendo el riesgo, porque podría ser un estafador que aprendió la respuesta.
Tarea: Modificar `estados.py` y `orquestador.py` para que, tras un acierto, solo las reglas duras puedan elevar el riesgo. Actualizar `test_orquestador.py` con el caso de acierto y el de regla dura.
Restricciones técnicas: Sin cambios de API pública. Cubrir con pruebas unitarias los estados antes y después del desafío.
```

---

## Módulo FRONT (`GuardianMesh-front`)

### `PRM-FRO-01` · Cliente de llamadas de audio y directorio de contactos

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Conectar el front a la señalización real: `RTCPeerConnection` de audio, `useCall` con máquina de estados y pantalla de llamada, junto al directorio de contactos.

**Prompt estructurado:**

```text
Rol: Ingeniero frontend senior en React 19, TypeScript y WebRTC.
Contexto: GuardianMesh-front es una PWA y una app Capacitor. La señalización va por WebSocket con eventos `call:*`. El audio es peer a peer con STUN público; no hay TURN.
Tarea: Implementar el cliente de llamadas 1:1:
- `services/calls/signaling.ts` (cliente de señalización) y `services/calls/peer.ts` (RTCPeerConnection, pistas de micrófono).
- Hook `useCall` con estados idle → outgoing/ringing → connecting → active → idle, y `failed` si WebRTC no conecta en 15 s.
- `CallProvider` y `CallScreen` conectados a los estados reales.
- Silenciar desactiva la pista sin renegociar; colgar libera micrófono y conexión.
Restricciones técnicas:
- Ninguna credencial de cliente en el front; configuración por `VITE_*`.
- Pruebas con Vitest y React Testing Library para el hook, el proveedor y el peer.
- No prometer altavoz nativo en web/Android (queda pendiente).
```

---

### `PRM-FRO-02` · App Android con Capacitor y CI que genera el APK

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Empaquetar la PWA como app Android con Capacitor y automatizar la generación del APK en GitHub Actions.

**Prompt estructurado:**

```text
Rol: Ingeniero de DevOps y frontend móvil.
Contexto: La PWA de GuardianMesh debe distribuirse como APK para pruebas en Android sin pasar por la tienda.
Tarea: Añadir el proyecto Android con Capacitor 8 (`android/`, `capacitor.config.ts`) y un workflow `android-release.yml` que compile el APK. Luego extender `ci.yml` para ejecutar el CI en ramas `feature/**`.
Restricciones técnicas:
- Sin secretos en el repositorio; las llaves de firma se gestionan aparte.
- El build debe pasar con las variables `VITE_*` inyectadas por el workflow.
```

---

### `PRM-FRO-03` · APK sobre el cliente de llamadas ya integrado

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Ajustar el workflow del APK para que compile la versión con el cliente de llamadas integrado.

**Prompt estructurado:**

```text
Rol: Ingeniero de CI/CD para aplicaciones híbridas.
Contexto: El APK se generaba antes de integrar el cliente de llamadas, así que no incluía la funcionalidad.
Tarea: Modificar `android-release.yml` y `ci.yml` para que el APK se construya a partir del código con el cliente de llamadas, y corregir los tests de `api.ts` que se rompieron.
Restricciones técnicas: No cambiar la lógica de llamadas. Pasar el lint y los tests antes de publicar.
```

---

### `PRM-FRO-04` · Permiso de micrófono y llave de debug en Android

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Declarar el permiso `RECORD_AUDIO` en Android y fijar la llave de debug para que el APK instale y capture el micrófono.

**Prompt estructurado:**

```text
Rol: Ingeniero de Android que depura permisos de sistema en Capacitor.
Contexto: Las llamadas en el APK fallaban porque el micrófono no se podía usar: falta el permiso en el manifiesto y la llave de debug cambia entre builds.
Tarea: Declarar el permiso de micrófono en `AndroidManifest.xml`, fijar la llave de debug en `android/app/` y ajustar `useCall.ts` y su prueba para cubrir el permiso denegado.
Restricciones técnicas: La llave de debug es solo para pruebas; no se usa para release. Documentar en `README.md`.
```

---

### `PRM-FRO-05` · Semáforo de riesgo real con audio casi en tiempo real

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Mostrar en la llamada el riesgo que devuelve la API, alimentado con fragmentos de audio del micrófono del usuario protegido.

**Prompt estructurado:**

```text
Rol: Ingeniero frontend senior con experiencia en audio en tiempo real y UX de alertas.
Contexto: La API evalúa el riesgo con fragmentos de audio y publica `risk:update` por WebSocket. El semáforo de la llamada aún usaba datos de demostración.
Tarea: Crear `services/callRisk.ts` para enviar fragmentos y recibir el riesgo, ampliar `signaling.ts` con el evento `call:transcript`, y mostrar el semáforo real en `CallProvider` con copy de `riskCopy.ts`. El laboratorio de riesgo queda solo como fuente de entrada en desarrollo.
Restricciones técnicas:
- Mostrar el riesgo solo para el usuario protegido.
- Sin registrar la transcripción en consola.
- Pruebas para `callRisk.ts`, `signaling.ts` y `CallProvider`.
```

---

### `PRM-FRO-06` · Pantalla de llamada con controles fijos y riesgo en la pantalla real

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Rediseñar la pantalla de llamada para que los controles estén siempre visibles y el riesgo, el desafío de seguridad y la alerta a contacto de confianza aparezcan en la pantalla real.

**Prompt estructurado:**

```text
Rol: Diseñador e ingeniero frontend para una app de accesibilidad orientada a personas mayores.
Contexto: Durante una llamada, la persona protegida necesita ver el riesgo sin perder los controles de colgar y silenciar.
Tarea: Reorganizar `CallScreen.tsx` y `call.css` con controles fijos en la parte inferior; integrar `SecurityChallenge.tsx` (pregunta de seguridad), `TrustedContactAlert.tsx` (aviso a contacto de confianza) y el riesgo en `risk.css`. Ajustar `peer.ts` y `useCall.ts` a los estados reales.
Restricciones técnicas:
- Tamaños de toque y contraste accesibles para personas mayores.
- Pruebas en `CallScreen.test.tsx`, `SecurityChallenge.test.tsx` y `TrustedContactAlert.test.tsx`.
- Sin cambios en el contrato de señalización.
```

---

### `PRM-FRO-07` · Hoja de invitar sólida y tarjeta en escritorio

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Corregir la hoja de invitar contactos: fondo sólido sin transparencia y presentación como tarjeta en escritorio.

**Prompt estructurado:**

```text
Rol: Ingeniero frontend con foco en CSS y diseño responsivo.
Contexto: La hoja de invitar se veía transparente sobre el contenido y en escritorio ocupaba todo el ancho.
Tarea: En `ContactsScreen.tsx` y `design-system.css`, dar a la hoja un fondo sólido y, en escritorio, mostrarla como tarjeta centrada.
Restricciones técnicas: Sin dependencias nuevas. Mantener el comportamiento en móvil.
```

---

### `PRM-FRO-08` · Aviso de fin de llamada compacto

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Reducir el aviso que aparece al terminar una llamada para que no tape la pantalla.

**Prompt estructurado:**

```text
Rol: Ingeniero frontend.
Contexto: El aviso de fin de llamada en `CallProvider.tsx` ocupaba demasiado espacio y tapaba la interfaz.
Tarea: Hacerlo compacto en `call.css` y ajustar `CallProvider.test.tsx`.
Restricciones técnicas: No cambiar la lógica de estados de la llamada.
```

---

### `PRM-FRO-09` · Migrar la autenticación del front a Cognito

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-front`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Reemplazar el login anterior por Cognito en la PWA, con sesión en `secureStorage` en Android.

**Prompt estructurado:**

```text
Rol: Ingeniero frontend con experiencia en OIDC y Amazon Cognito.
Contexto: GuardianMesh migra su autenticación a Cognito (User Pool, App Client sin secreto). La app debe conservar la sesión de forma segura en Android.
Tarea: Implementar `auth/providers/cognito.ts` y `platform/secureStorage.ts` con sus pruebas, y conectarlos en `main.tsx`.
Restricciones técnicas: Sin secretos de cliente en el front; configuración solo con `VITE_COGNITO_*`.
```

---

## Módulo INFRA (`GuardianMesh-infra`)

### `PRM-INF-01` · Pipeline CI/CD con gates DevSecOps bloqueantes

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Crear el pipeline de Terraform con validación, escaneo de seguridad y gates que bloquean el despliegue.

**Prompt estructurado:**

```text
Rol: Ingeniero DevSecOps que configura pipelines para infraestructura como código en AWS.
Contexto: GuardianMesh-infra usa Terraform por entornos (`dev`, `prod`) y módulos reutilizables, con región us-east-1.
Tarea: Crear `.github/workflows/ci.yml` y `deploy.yml` con:
- `terraform fmt`, `validate` y `tflint`.
- Escaneo de IaC con Checkov (`.checkov.yaml`).
- Detección de secretos con Gitleaks (`.gitleaks.toml`).
- Lint de YAML con `.yamllint.yaml` y pruebas Python de la configuración.
- OIDC con GitHub en `bootstrap/github-oidc` en vez de llaves de larga duración.
- Dependabot y plantilla de PR.
Restricciones técnicas: Los gates deben bloquear el merge. Sin credenciales en el repositorio. Documentar en `docs/CICD.md`.
```

---

### `PRM-INF-02` · Habilitar USER_SRP_AUTH para la PWA y Android

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Permitir el flujo SRP de Cognito en el cliente de la PWA y de Android.

**Prompt estructurado:**

```text
Rol: Ingeniero de infraestructura especializado en Amazon Cognito.
Contexto: La PWA y la app Android necesitan autenticarse con el flujo USER_SRP_AUTH.
Tarea: Habilitar el flujo en el módulo `modules/cognito` (política y tfvars de dev y prod) y añadir la prueba `test_cognito_pool_policy.py`.
Restricciones técnicas: Solo cambios declarados en Terraform. No crear recursos a mano en la consola.
```

---

### `PRM-INF-03` · Módulo de señalización WebRTC 1:1 (HU-10)

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Declarar en Terraform la infraestructura de la señalización: API WebSocket, Lambda, DynamoDB, EventBridge Scheduler y logs.

**Prompt estructurado:**

```text
Rol: Ingeniero de infraestructura senior en Terraform y AWS serverless.
Contexto: El servicio `guardianmesh-communications` necesita API Gateway WebSocket, Lambda Python 3.12, tablas DynamoDB para llamadas y conexiones, y timeouts de llamada con EventBridge Scheduler. La infraestructura es la única fuente de verdad.
Tarea: Crear `modules/communications` (api.tf, lambda.tf, iam.tf, logs.tf, scheduler.tf, tables.tf, variables.tf, outputs.tf, versions.tf) y su cableado en `environments/dev/communications.tf`. Añadir el script de empaquetado de la Lambda y las pruebas de Terraform.
Restricciones técnicas:
- Permisos de mínimo privilegio por recurso.
- Sin recursos de prod en este cambio.
- Validar con las pruebas del módulo sin depender de credenciales de AWS.
```

---

### `PRM-INF-04` · Permiso de la CMK `pii` a través de DynamoDB

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Corregir el rol de comunicaciones para que pueda leer y escribir datos cifrados con la CMK `pii` cuando accede por DynamoDB.

**Prompt estructurado:**

```text
Rol: Ingeniero de seguridad en AWS KMS e IAM.
Contexto: Las tablas de comunicaciones cifran datos con la CMK `pii`. El rol de la Lambda fallaba al acceder porque la clave no estaba autorizada a través de DynamoDB.
Tarea: Ajustar `modules/communications/iam.tf` con el permiso KMS acotado a la CMK y actualizar la prueba del módulo.
Restricciones técnicas: Mínimo privilegio. Sin `kms:*` ni recursos `*`.
```

---

### `PRM-INF-05` · Tabla de contactos y permisos del gateway

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Declarar la tabla de contactos y dar al gateway los permisos para leerla y escribirla.

**Prompt estructurado:**

```text
Rol: Ingeniero de infraestructura en Terraform y AWS IAM.
Contexto: El directorio de contactos necesita una tabla DynamoDB y que el Lambda gateway pueda consultarla.
Tarea: Añadir la tabla en `modules/communications/tables.tf`, los permisos en `modules/gateway/iam.tf` y las variables de entorno en `modules/gateway/lambda.tf` y `environments/dev/gateway.tf`. Actualizar las pruebas de ambos módulos.
Restricciones técnicas: Permisos solo sobre la tabla declarada. Sin wildcards.
```

---

### `PRM-INF-06` · El zip del Lambda no incluía sus paquetes

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Corregir el script de empaquetado para que el zip del Lambda gateway incluya las dependencias que importa.

**Prompt estructurado:**

```text
Rol: Ingeniero de build y despliegue de Lambda con Python.
Contexto: El Lambda gateway fallaba al iniciar porque el zip no incluía los paquetes que importa.
Tarea: Corregir `scripts/build-lambda-packages.sh` para instalar y empaquetar las dependencias, y cubrirlo con una prueba en `test_pipeline.py`.
Restricciones técnicas: No incluir archivos de desarrollo ni credenciales en el zip. Build reproducible.
```

---

### `PRM-INF-07` · Tabla, secreto y permisos para la detección de fraude real

- **Responsable:** Cristian Silva
- **Repositorio / Capa:** `GuardianMesh-infra`
- **Herramienta y modelo:** Claude Code CLI · Sonnet 5.5 / Haiku 5.5
- **Objetivo técnico:** Declarar la infraestructura que necesita el riesgo real: tabla DynamoDB con TTL y CMK, secreto de la clave HMAC y permisos acotados de Bedrock, Secrets Manager y `ManageConnections`.

**Prompt estructurado:**

```text
Rol: Ingeniero de infraestructura en AWS con foco en seguridad y mínimo privilegio.
Contexto: El cambio `harden-real-call-risk` requiere persistencia duradera de desafíos y estado del orquestador, una clave HMAC en Secrets Manager y acceso a modelos de Bedrock.
Tarea: En Terraform:
- Tabla DynamoDB de riesgo de llamadas con TTL y CMK `pii` en `modules/communications/tables.tf`.
- Secreto de la clave del desafío y su cableado en `data_protection.tf`.
- Permisos en `modules/gateway/iam.tf` para Bedrock (solo los modelos permitidos), Secrets Manager (solo ese secreto) y `execute-api:ManageConnections`.
- Variables de entorno en `modules/gateway/lambda.tf` y `environments/dev/gateway.tf`.
- Pruebas de los tres módulos.
Restricciones técnicas: Solo dev. Sin wildcards en recursos. No aplicar Terraform sin revisión y autorización.
```

---

# Bitácora de Prompts — Miguel Vanegas

- **Responsable:** Miguel Vanegas
- **Repositorios / Capas trabajadas:** `GuardianMesh-front` · `GuardianMesh-api` · `GuardianMesh-communications` · `GuardianMesh-infra` · Documentación / Diseño
- **Herramientas y modelos utilizados:** OpenCode (big-pickle, minimax-m3.1-flash; la sesión del diseño SVG registra kimi-k3.1-pro) y Claude Code CLI (claude-sonnet-5, claude-haiku-5-5, claude-sonnet-5-5)
- **Asignatura:** SWNT 2026-2

---

## Tabla resumen

| ID | Módulo / Archivo | Título técnico | Herramienta y modelo | Entregable real generado |
|---|---|---|---|---|
| PRM-MV-01 | Documentación / Web 3D | Configuración del entorno agéntico y servidores MCP | OpenCode (opencode/big-pickle) | Servidor MCP de Postman agregado a OpenCode; MCP Framelink de Figma configurado, a la espera del token. |
| PRM-MV-02 | Documentación / Web 3D | Análisis del MVP, backlog, arquitectura y brechas | OpenCode (opencode-go/minimax-m3.1-flash) | Revisión del plan MVP (38 HUs) y de los diagramas C4, con brechas identificadas. |
| PRM-MV-03 | Documentación / Web 3D | Diseño móvil Android, design system y flujo de navegación | Claude Code CLI (modelo no registrado) | Carpeta design/ con pantallas y componentes SVG (átomos, moléculas, organismos) y galería HTML. |
| PRM-MV-04 | Documentación / Web 3D | Integración de Jira por MCP | Claude Code CLI (modelo no registrado) | MCP de Atlassian en estado Connected. |
| PRM-MV-05 | Documentación / Web 3D | Épica HU-02/HU-05: registro e inicio de sesión con MFA | Claude Code CLI (modelo no registrado) | openspec/spikes/andrea-auth-mfa/spike.md, openspec/epics/andrea-auth-mfa/epic.md y colección Postman de Supabase Auth. |
| PRM-MV-06 | GuardianMesh-front | Desarrollo TDD de registro, TOTP y aprovisionamiento de Supabase | Claude Code CLI (modelo no registrado) | Proyecto guardianmesh-front, pantallas de registro y enrolamiento TOTP, proyecto Supabase. |
| PRM-MV-07 | GuardianMesh-front | Estrategia de distribución móvil: APK con Capacitor | Claude Code CLI (modelo no registrado) | Decisión registrada: Capacitor para empaquetar React + Vite como APK. |
| PRM-MV-08 | GuardianMesh-front | Aplicación del design system y entorno local | Claude Code CLI (modelo no registrado) | Design system aplicado al front y guía para obtener variables de entorno y vista móvil. |
| PRM-MV-09 | GuardianMesh-front | Goals 3 a 6: sesión, recuperación MFA y API gateway, con auditoría final | OpenCode (opencode-go/minimax-m3.1-flash) | Gap reviews y decision records de los goals 3–6, gateway en guardianmesh-api, auditoría final (290 + 119 pruebas en verde según el registro) y SUPABASE-SETUP.md. |
| PRM-MV-10 | Documentación / Web 3D | Evaluación y épica de migración de Supabase a Cognito | OpenCode (opencode-go/minimax-m3.1-flash) | openspec/epics/cognito-auth-migration/epic.md y sus decisiones. |
| PRM-MV-11 | GuardianMesh-infra | Repositorio IaC y módulo Terraform de Cognito | OpenCode (opencode-go/minimax-m3.1-flash) | Repositorio guardianmesh-infra (commit f4d72f2), módulo Cognito y User Pool desplegado. |
| PRM-MV-12 | GuardianMesh-api | Arquitectura modular del API serverless en Lambda | OpenCode (opencode-go/minimax-m3.1-flash) | openspec/epics/cognito-auth-migration/goals/gateway-architecture-decision.md; gateway modular en Lambda con validación de Cognito (Goals 2 y 3). |
| PRM-MV-13 | Documentación / Web 3D | Conexión a Jira desde OpenCode | OpenCode (opencode-go/minimax-m3.1-flash) | Consulta atendida; sin entregable en repositorio. |
| PRM-MV-14 | Documentación / Web 3D | Sincronización de repositorios y diagnóstico de estado | Claude Code CLI (claude-sonnet-5) | Repositorios actualizados y diagnóstico por repositorio. |
| PRM-MV-15 | GuardianMesh-api | Goal 7: gap review e implementación de recuperación MFA sobre Cognito | Claude Code CLI (claude-sonnet-5) | goal-7/gap-review.md; commits 0262941 (api) y f17d39a (front). |
| PRM-MV-16 | GuardianMesh-infra | Pipeline de despliegue de infraestructura sin credenciales expuestas | Claude Code CLI (claude-sonnet-5) | bootstrap/github-oidc con roles de plan y apply por OIDC y workflow de despliegue. |
| PRM-MV-17 | GuardianMesh-infra | Análisis de costos y recorte de funcionalidades de Cognito | Claude Code CLI (claude-sonnet-5) | Estimación de costos y cambio de user_pool_tier a Essentials (commit 6cc90c8). |
| PRM-MV-18 | GuardianMesh-infra | Explicación y activación del despliegue de development | Claude Code CLI (claude-sonnet-5) | Bootstrap OIDC aplicado y guía de secretos y permisos de GitHub. |
| PRM-MV-19 | GuardianMesh-infra | Depuración de credenciales, OIDC, lint y backend de Terraform | Claude Code CLI (claude-sonnet-5) | Commits 5762e7c, 0a57f92, 8a691f5, 0be6dff, faab9b4 y 6bc9d51: trust OIDC, ruff, WAF y concurrencia. |
| PRM-MV-20 | Documentación / Web 3D | Spike de hosting del frontend y enrutamiento vía API Gateway | Claude Code CLI (claude-sonnet-5) | openspec/spikes/frontend-hosting/spike.md. |
| PRM-MV-21 | GuardianMesh-front | Integración de ramas y resolución de conflictos | Claude Code CLI (claude-sonnet-5) | Cambios integrados y subidos a development. |
| PRM-MV-22 | GuardianMesh-infra | Entrega del correo de verificación y SES | Claude Code CLI (claude-sonnet-5) | Diagnóstico del modo sandbox de SES y del estado de usuarios; correcciones posteriores en permisos y envío. |
| PRM-MV-23 | GuardianMesh-infra | Revisión del cambio solicitado por un compañero: permisos de EventBridge Scheduler | Claude Code CLI (claude-sonnet-5) | Permiso scheduler:* acotado al rol de apply (commit 5d6c872) y verificación del terraform plan. |
| PRM-MV-24 | GuardianMesh-infra | Gestión de usuarios de prueba en Cognito | Claude Code CLI (claude-sonnet-5) | Usuarios de prueba consultados y eliminados a solicitud en varias iteraciones. |
| PRM-MV-25 | GuardianMesh-api | Verificación de email propia en el backend | Claude Code CLI (claude-sonnet-5) | goal-9/spec.md y commits 6089d88, d1a23d9 (infra), c0525e9 (api) y 1ddefe0 (front). Retirada después (ver ficha de eliminación). |
| PRM-MV-26 | GuardianMesh-infra | Depuración del despliegue de la verificación propia | Claude Code CLI (claude-sonnet-5) | Commits 307d093 (permiso del template SES), 15b5537 y ac1cf6d: variable huérfana, permisos y orden de limpieza. |
| PRM-MV-27 | GuardianMesh-api | Disparo del despliegue de infra desde los repositorios de aplicación | Claude Code CLI (claude-sonnet-5) | .github/workflows/notify-infra-deploy.yml (commit 35eb90e en api). |
| PRM-MV-28 | GuardianMesh-api | Depuración de CORS y errores 500 en la verificación | Claude Code CLI (claude-sonnet-5) | Commits e2e90bb (preflight CORS), ec7dac0 (Source de SES), 4cd7290 (kms:Decrypt); redespliegues dirigidos de la Lambda y permiso de invocación. |
| PRM-MV-29 | Documentación / Web 3D | Corrección de la identidad de Git | Claude Code CLI (claude-sonnet-5) | Commits posteriores firmados como miguelvanegas-c. |
| PRM-MV-30 | GuardianMesh-api | Eliminación de la verificación de email y del MFA obligatorio | Claude Code CLI (claude-sonnet-5) | Verificación de email y MFA obligatorio retirados del front y de la infraestructura (commits b17080e y fa5b707 en front; d4a8944 y f3a324c en infra). |
| PRM-MV-31 | GuardianMesh-front | Rutas y navegación de autenticación | Claude Code CLI (claude-sonnet-5) | Commit 4b7cafc y su push. |
| PRM-MV-32 | GuardianMesh-infra | Acceso de colaboradores a la cuenta AWS sin compartir credenciales | Claude Code CLI (claude-sonnet-5) | Usuarios IAM dedicados para los colaboradores (bootstrap/iam-users, sin versionar), sin compartir credenciales raíz. |
| PRM-MV-33 | Documentación / Web 3D | Atribución de autoría de una pantalla | Claude Code CLI (claude-sonnet-5) | Autoría identificada por el historial de Git. |
| PRM-MV-34 | GuardianMesh-front | Sesión AWS, sincronización de repositorios y ejecución del front | Claude Code CLI (claude-sonnet-5) | Sesión iniciada, repos en la última development, instrucciones para el primer ingreso IAM y para correr el front. |
| PRM-MV-35 | GuardianMesh-front | Unificación de las rutas de Carmen en /dashboard | Claude Code CLI (claude-sonnet-5) | Commits 0ad6c7a y 478276e. |
| PRM-MV-36 | Documentación / Web 3D | Primera épica de contactos de confianza (descartada) | Claude Code CLI (claude-sonnet-5) | Épica y avance creados y luego revertidos por completo en api, infra y openspec. |
| PRM-MV-37 | Documentación / Web 3D | Redefinición: contactos de confianza para reporte de fraude | Claude Code CLI (claude-sonnet-5) | Requisito confirmado; épica anterior eliminada. |
| PRM-MV-38 | Documentación / Web 3D | Spike y épica sobre el código actualizado | Claude Code CLI (claude-sonnet-5) | openspec/spikes/trusted-fraud-contacts/spike.md (corregido) y epic.md: 5 goals, 19 puntos. |
| PRM-MV-39 | GuardianMesh-api | Implementación autónoma de contactos de confianza | Claude Code CLI (claude-sonnet-5) | Commits 1b41ac5 (api, tope de 3 y ruta de confianza) y 96c205e (front); pushes y PRs. |
| PRM-MV-40 | GuardianMesh-front | Fallo de resolución Gradle en el build Android | Claude Code CLI (claude-sonnet-5) | Diagnóstico: las versiones existen en los repositorios Maven y la causa apunta a red/CI, no a la configuración. |
| PRM-MV-41 | GuardianMesh-front | Limpieza del árbol de trabajo y dependencia de Capacitor | Claude Code CLI (claude-sonnet-5) | tsconfig.tsbuildinfo restaurado y @capacitor/core instalado. |
| PRM-MV-42 | GuardianMesh-api | Spec backend de notificaciones a contactos de confianza por WSS | Claude Code CLI (claude-haiku-5-5) | openspec/epics/trusted-contact-notifications con 2 goals y gap reviews. |
| PRM-MV-43 | GuardianMesh-api | Desarrollo autónomo del backend de notificaciones | Claude Code CLI (claude-haiku-5-5) | Commit a94ca78 y PR; conflictos resueltos con development. |
| PRM-MV-44 | GuardianMesh-infra | Diagnóstico de bloqueos de Bedrock y Transcribe en la cuenta AWS | Claude Code CLI (claude-haiku-5-5) | Bedrock (Haiku) respondió con la sesión dev; Voxtral probado solo por texto (audio sin probar); Transcribe siguió con SubscriptionRequiredException; respuesta redactada para el compañero. |
| PRM-MV-45 | GuardianMesh-infra | Infraestructura WebSocket e IAM para las notificaciones | Claude Code CLI (claude-haiku-5-5) | Módulo notifications-ws; commits 7e50f67, de2400b y beeae86. |
| PRM-MV-46 | GuardianMesh-infra | Corrección de pipeline de lint y bloqueo de merge | Claude Code CLI (claude-haiku-5-5) | Lint E501 y tflint corregidos; diagnóstico del bloqueo del PR. |
| PRM-MV-47 | GuardianMesh-front | Épica frontend: botón de alerta y recepción en tiempo real | Claude Code CLI (claude-haiku-5-5) | openspec/epics/trusted-contact-notifications-frontend; commits 028669a y 79aabeb. |
| PRM-MV-48 | GuardianMesh-infra | Cobertura completa del flujo e infraestructura de persistencia | Claude Code CLI (claude-haiku-5-5) | Tabla de notificaciones con cifrado de PII y TTL de 30 días (050f0c1); habilitación en dev (6359d56). |
| PRM-MV-49 | GuardianMesh-front | Rebase y conflictos de la épica de notificaciones | Claude Code CLI (claude-haiku-5-5) | Ramas rebasadas, publicadas y lista de lo pendiente por integrar. |
| PRM-MV-50 | GuardianMesh-infra | Diagnóstico de llamadas que no se podían contestar | Claude Code CLI (claude-haiku-5-5) | Diagnóstico con CloudTrail: una actualización manual reemplazó las variables de la Lambda y un apply posterior las restauró (17 variables). |
| PRM-MV-51 | GuardianMesh-infra | Habilitar el botón de notificar en riesgo alto | Claude Code CLI (claude-haiku-5-5) | notifications_enabled = true en dev y variables y permisos del gateway. |
| PRM-MV-52 | GuardianMesh-front | Eliminación del flujo de demostración y los datos simulados | Claude Code CLI (claude-haiku-5-5) | Rama y PR preparados (7ed453c, 1a2d1f7 en front; 4ebf6d4 en api). El cambio de front se descartó después: PR cerrado y ramas eliminadas. |
| PRM-MV-53 | GuardianMesh-api | Depuración de contacto de confianza y notificaciones no visibles | Claude Code CLI (claude-haiku-5-5) | Verificación en DynamoDB, corrección de backend y variables; se detectó que se estaba usando un botón equivocado. |
| PRM-MV-54 | GuardianMesh-front | Centro de notificaciones en la barra superior | Claude Code CLI (claude-haiku-5-5) | Campana con contador y lista de recibidas (80d3ff3); mejora del contacto de confianza (5ff0649). |
| PRM-MV-55 | GuardianMesh-front | Variable del WebSocket en builds web y Android | Claude Code CLI (claude-haiku-5-5) | VITE_NOTIFICATIONS_WS_URL en los builds (ffa6246), PR integrado tras los checks y revisión de la publicación de la APK. |
| PRM-MV-56 | GuardianMesh-front | Mensaje de error persistente con notificaciones cargadas | Claude Code CLI (claude-haiku-5-5) | Commit 13565cb en rama aparte con PR. |
| PRM-MV-57 | Documentación / Web 3D | Spike del historial y detalle de llamadas | Claude Code CLI (claude-haiku-5-5) | openspec/spikes/historial-llamadas-vista-detalle/spike.md y epic.md. |
| PRM-MV-58 | GuardianMesh-api | Implementación multi-repo del historial | Claude Code CLI (claude-haiku-5-5) | Commits 13b38e7 (api), daa0a5c (front), 04502bd (infra) y dcfcf22 (communications), con sus PRs. |
| PRM-MV-59 | GuardianMesh-infra | Rebase apilado y conflictos del historial en infraestructura | Claude Code CLI (claude-haiku-5-5) | Rebase con --onto y conflictos resueltos. |
| PRM-MV-60 | GuardianMesh-infra | Eliminación controlada de un usuario de Cognito y consulta de registros | Claude Code CLI (claude-haiku-5-5) | Usuario localizado en dev; NO se eliminó: se pidió confirmación por tratarse de la cuenta de pruebas con contactos asociados. |
| PRM-MV-61 | GuardianMesh-api | Depuración del historial vacío y registro de llamadas | Claude Code CLI (claude-haiku-5-5) | Revisión de logs y de las llamadas de prueba. |
| PRM-MV-62 | GuardianMesh-communications | Escritura de historial en el servicio de comunicaciones | Claude Code CLI (claude-haiku-5-5) | Escritor de historial (dcfcf22) e integración en infra. |
| PRM-MV-63 | GuardianMesh-api | Error 500 en el listado por nombre del interlocutor | Claude Code CLI (claude-haiku-5-5) | Commit c0b95a9: el lector usa peer_name con respaldo en peer; commit y merge. |
| PRM-MV-64 | GuardianMesh-front | Conflictos del front y botón de llamada perdido | Claude Code CLI (claude-haiku-5-5) | Conflictos de src/App.tsx resueltos y guía para completar el rebase. |
| PRM-MV-65 | GuardianMesh-front | Tarjetas de contactos responsivas | Claude Code CLI (claude-haiku-5-5) | CSS adaptable (incluye ≤380 px); 18 pruebas de Contactos en verde según el asistente; sin verificación visual. |
| PRM-MV-66 | Documentación / Web 3D | Métricas de líneas de código por integrante | Claude Code CLI (claude-haiku-5-5) | Conteo por autor sobre development, ajustado tras varias correcciones. |
| PRM-MV-67 | GuardianMesh-communications | Diagnóstico WebRTC: fallo de conectividad ICE y evaluación de TURN | Claude Code CLI (claude-haiku-5-5) | Diagnóstico y plan de pruebas por red; TURN (gestionado o coturn) quedó como propuesta, sin implementar. |
| PRM-MV-68 | GuardianMesh-api | Endpoint para listar notificaciones recibidas (405) | Claude Code CLI (claude-haiku-5-5) | Commit ca69c18 en development: listado de notificaciones recibidas. |
| PRM-MV-69 | GuardianMesh-front | Pregunta de seguridad ausente con riesgo rojo | Claude Code CLI (claude-haiku-5-5) | Causa explicada: la pregunta se guarda solo en el dispositivo que la configura y requiere un contacto aceptado. |

---

## Listado cronológico de prompts

### `PRM-MV-01` · Configuración del entorno agéntico y servidores MCP

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** OpenCode (opencode/big-pickle)
- **Objetivo técnico:** Preparar la herramienta de trabajo con búsqueda web, Postman y Figma.

**Prompt estructurado:**

```text
Rol: Ingeniero de plataforma de desarrollo asistido por IA.
Contexto: OpenCode con suscripción Go y cuentas normales de Postman y Figma.
Tarea: Iniciar sesión, explicar cómo revisar el consumo de la sesión, instalar búsqueda web, ejecución de código y plugins, y conectar los MCP de Postman y Figma (diagnosticando el error de conexión).
Restricciones: Usar solo opciones disponibles con una cuenta normal; no exponer tokens.
```

---

### `PRM-MV-02` · Análisis del MVP, backlog, arquitectura y brechas

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** OpenCode (opencode-go/minimax-m3.1-flash)
- **Objetivo técnico:** Entender el producto y detectar vacíos antes de desarrollar.

**Prompt estructurado:**

```text
En la carpeta está el contexto del proyecto GuardianMesh (seguridad para llamadas), con todo el backlog, el contexto y parte de la arquitectura. Usa el MCP de Figma para crear un diseño de la aplicación móvil Android, dame recomendaciones, dime qué es la aplicación, explícame cada HU y dime si ves que le falta algo.
```

---

### `PRM-MV-03` · Diseño móvil Android, design system y flujo de navegación

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (modelo no registrado)
- **Objetivo técnico:** Obtener un diseño importable a Figma, moderno y compacto.

**Prompt estructurado:**

```text
Rol: Diseñador UI/UX móvil senior.
Contexto: El plan MVP, los casos de uso y la arquitectura están en la carpeta del proyecto.
Tarea: Crear el diseño de la app móvil Android a partir de esos documentos, explicar cómo abrirlo e importar los flujos en Figma y refinarlo: componentes y botones más pequeños, estética más moderna y un flujo de funcionamiento. Revisar y cancelar el agente si queda bloqueado.
Restricciones: No compartir el diseño públicamente.
```

---

### `PRM-MV-04` · Integración de Jira por MCP

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (modelo no registrado)
- **Objetivo técnico:** Conectar el tablero del proyecto al agente.

**Prompt estructurado:**

```text
Rol: Ingeniero DevOps.
Contexto: Proyecto SCRUM en Jira Cloud; el comando de alta falla (opción --global inexistente, servidor ya existente, sin tools).
Tarea: Configurar el MCP de Atlassian, diagnosticar por qué no expone herramientas, reconfigurarlo con un token nuevo y verificar el tablero.
Restricciones: Verificar que las herramientas queden disponibles.
```

---

### `PRM-MV-05` · Épica HU-02/HU-05: registro e inicio de sesión con MFA

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (modelo no registrado)
- **Objetivo técnico:** Especificar la autenticación, prerrequisito del resto de flujos.

**Prompt estructurado:**

```text
/new-epic
Como Andrea, quiero registrarme e iniciar sesión con MFA, para asegurar el acceso a la app.
Criterios de aceptación: registro e inicio de sesión funcional; MFA habilitado (factor definido por el equipo); manejo de errores y recuperación básica.
Guíate de la arquitectura, el documento del MVP y el diseño de Figma. Primero el spike. Decisiones: usa lo que consideres mejor sin costo, propón la mejor opción de factor MFA y de base de datos para una aplicación móvil; todavía no hemos creado nada.
```

---

### `PRM-MV-06` · Desarrollo TDD de registro, TOTP y aprovisionamiento de Supabase

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (modelo no registrado)
- **Objetivo técnico:** Implementar los Goals 1 y 2 de la épica con una estructura ordenada.

**Prompt estructurado:**

```text
Rol: Desarrollador frontend senior con TDD.
Contexto: Épica andrea-auth-mfa aprobada.
Tarea: Ejecutar /dev-epic: crear la carpeta del front con buena organización, crear el proyecto Supabase desde el navegador con sesión ya iniciada, avanzar por goals, corregir los hallazgos antes de continuar y cancelar y relanzar el agente implementador que quedó bloqueado.
Restricciones: Ciclo rojo, revisión y verde con aprobación por fase; indicar qué pasos dependen del desarrollador.
```

---

### `PRM-MV-07` · Estrategia de distribución móvil: APK con Capacitor

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (modelo no registrado)
- **Objetivo técnico:** Definir cómo entregar una app instalable en Android.

**Prompt estructurado:**

```text
Rol: Arquitecto de aplicaciones móviles.
Contexto: Es mi primer desarrollo móvil y lo construido es una aplicación web.
Tarea: Explicar cómo probar la épica, si funcionará con seguridad en un celular Android y cómo obtener una APK en lugar de una PWA en Chrome.
Restricciones: Ser honesto sobre lo que no está garantizado.
```

---

### `PRM-MV-08` · Aplicación del design system y entorno local

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (modelo no registrado)
- **Objetivo técnico:** Ver la app funcionando y fiel al diseño.

**Prompt estructurado:**

```text
Rol: Desarrollador frontend senior.
Contexto: La app corre pero no muestra nada y faltan la URL y la clave de Supabase.
Tarea: Indicar de dónde obtener las variables, aplicar el design system diseñado y explicar cómo ver la app como en un celular.
Restricciones: Respetar el diseño previo.
```

---

### `PRM-MV-09` · Goals 3 a 6: sesión, recuperación MFA y API gateway, con auditoría final

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** OpenCode (opencode-go/minimax-m3.1-flash)
- **Objetivo técnico:** Completar la épica de autenticación de punta a punta.

**Prompt estructurado:**

```text
Rol: Orquestador de desarrollo con flujo dev-epic.
Contexto: El front va en el gap review del Goal 3; la especificación está en openspec/.
Tarea: Continuar con las fases siguientes hasta completar la épica, incluyendo revisión de código y corrección de defectos, y al final entregar el resultado completo y los pasos manuales en Supabase.
Restricciones: Seguir el flujo agéntico de dev-epic sin detenerse entre goals.
```

---

### `PRM-MV-10` · Evaluación y épica de migración de Supabase a Cognito

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** OpenCode (opencode-go/minimax-m3.1-flash)
- **Objetivo técnico:** Decidir el proveedor de identidad sobre AWS.

**Prompt estructurado:**

```text
Rol: Arquitecto cloud AWS.
Contexto: La autenticación del MVP está sobre Supabase.
Tarea: Evaluar la adaptación a Cognito y AWS frente a mantener Supabase en el MVP, y crear la épica de refactor a Cognito; desarrollarla mientras creo la cuenta de AWS.
Restricciones: Ejecutar el flujo completo de forma autónoma.
```

---

### `PRM-MV-11` · Repositorio IaC y módulo Terraform de Cognito

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** OpenCode (opencode-go/minimax-m3.1-flash)
- **Objetivo técnico:** Gestionar toda la infraestructura como código desde el inicio.

**Prompt estructurado:**

```text
Ya tengo la cuenta de AWS creada; ¿cómo iniciamos sesión desde la consola? En una carpeta aparte crea un repositorio para la IaC, donde primero hagamos todo lo de Cognito, y que en adelante cada cambio se haga desde la IaC. Para la parte de IaC inicia otra épica.
```

---

### `PRM-MV-12` · Arquitectura modular del API serverless en Lambda

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** OpenCode (opencode-go/minimax-m3.1-flash)
- **Objetivo técnico:** Acordar la arquitectura antes de seguir implementando.

**Prompt estructurado:**

```text
Primero dime la estructura completa de lo que quieres hacer, porque ahora veo algo de backend. Quiero buena modularización y una arquitectura escalable en cada cosa. Dime cómo planteas el API: me gustaría que funcionara en una Lambda para que sea serverless. Si lo demás te parece perfecto, sigue goal por goal sin necesitar mi interacción y, cuando termines, dime qué tengo que hacer para que funcione. Verifica que estás siguiendo la arquitectura propuesta.
```

---

### `PRM-MV-13` · Conexión a Jira desde OpenCode

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** OpenCode (opencode-go/minimax-m3.1-flash)
- **Objetivo técnico:** Usar Jira ante la falta de acceso a Azure.

**Prompt estructurado:**

```text
Rol: Ingeniero DevOps.
Contexto: No hay acceso a Azure en este momento.
Tarea: Conectar el agente al MCP de Jira.
Restricciones: Usar Jira como gestor del proyecto.
```

---

### `PRM-MV-14` · Sincronización de repositorios y diagnóstico de estado

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Conocer el punto de partida de cada repositorio.

**Prompt estructurado:**

```text
Rol: Tech lead.
Contexto: Proyecto multi-repo GuardianMesh.
Tarea: Clonar o actualizar development en todos los repos (configurando gh auth) y reportar el estado de cada uno.
Restricciones: Basarse en el código real.
```

---

### `PRM-MV-15` · Goal 7: gap review e implementación de recuperación MFA sobre Cognito

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Alinear el código con la decisión definitiva de usar Cognito.

**Prompt estructurado:**

```text
Rol: Desarrollador backend senior.
Contexto: La decisión final es Cognito; hay que revisar la spec y el estado real del código.
Tarea: Hacer el gap review del Goal 7, ejecutar la fase verde y explicar cómo levantar el módulo Terraform para probarlo.
Restricciones: Mantener Cognito como proveedor.
```

---

### `PRM-MV-16` · Pipeline de despliegue de infraestructura sin credenciales expuestas

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Desplegar en AWS desde CI de forma segura.

**Prompt estructurado:**

```text
Valida tú mismo el Terraform con los comandos. Podemos crear un pipeline para desplegar con mi cuenta de AWS; crea directamente todo lo necesario en el repo. No expongas credenciales ni keys y crea secretos para los datos sensibles. ¿Por qué tenemos que hacerlo en local? Revisa la configuración de perfiles: ya existe uno configurado.
```

---

### `PRM-MV-17` · Análisis de costos y recorte de funcionalidades de Cognito

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Reducir el costo antes de desplegar.

**Prompt estructurado:**

```text
Rol: Arquitecto cloud con enfoque FinOps.
Contexto: Antes de aplicar la infraestructura.
Tarea: Estimar el costo mensual, justificar la elección del plan Plus, explicar qué hace la funcionalidad asociada y por qué el código usa arquitectura hexagonal.
Restricciones: La funcionalidad no parece necesaria: priorizar el ahorro.
```

---

### `PRM-MV-18` · Explicación y activación del despliegue de development

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Desplegar development sin desplegar main.

**Prompt estructurado:**

```text
Rol: Ingeniero DevOps.
Contexto: Pipeline de infra creado; main se desplegará en otra cuenta en el futuro.
Tarea: Explicar el funcionamiento del pipeline, los pasos para desplegar development, el secreto requerido y los permisos de GitHub, y ejecutar y disparar el despliegue.
Restricciones: No desplegar main.
```

---

### `PRM-MV-19` · Depuración de credenciales, OIDC, lint y backend de Terraform

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Desbloquear el primer despliegue.

**Prompt estructurado:**

```text
Rol: Ingeniero de infraestructura senior.
Contexto: Se pegan salidas reales: "No valid credential sources found", "Could not assume role with OIDC: Not authorized to perform sts:AssumeRoleWithWebIdentity", fallo de ruff format, ResourceAlreadyExistsException en log groups y "Backend configuration changed".
Tarea: Diagnosticar cada error, corregirlo, importar los recursos existentes, revisar el workflow y entregar los comandos de commit.
Restricciones: Corregir a partir de la evidencia de cada log.
```

---

### `PRM-MV-20` · Spike de hosting del frontend y enrutamiento vía API Gateway

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Decidir dónde publicar el front.

**Prompt estructurado:**

```text
¿Tenemos algo de front levantado? ¿Qué tenemos que hacer para levantar un front en AWS? También podría levantarlo yo en Vercel, te doy la URL y lo conectamos a un gateway que después vaya al servicio. Creemos una épica para decidir esto.
```

---

### `PRM-MV-21` · Integración de ramas y resolución de conflictos

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Publicar los cambios locales sin perder trabajo ajeno.

**Prompt estructurado:**

```text
Rol: Ingeniero de integración.
Contexto: Hay cambios sin publicar; el front exige pull previo y rebase falla por cambios sin confirmar y conflictos.
Tarea: Actualizar, resolver conflictos y entregar todos los commits necesarios.
Restricciones: No perder cambios locales ni remotos.
```

---

### `PRM-MV-22` · Entrega del correo de verificación y SES

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Los usuarios no podían verificar su cuenta ni volver a registrarse.

**Prompt estructurado:**

```text
Rol: Ingeniero backend/cloud especialista en identidad.
Contexto: El correo de verificación no llega, el login responde "Incorrect email or password" y no hay forma de reintentar con el mismo correo; no tenemos acceso a un DNS.
Tarea: Comprobar registros y envíos, destrabar la verificación o permitir recrear la cuenta, explicar por qué se requiere verificar destinatarios en SES y cómo pedir acceso de producción, y eliminar la vía de recuperación por app autenticadora.
Restricciones: Dar comandos en una sola línea; explicar el porqué de cada paso.
```

---

### `PRM-MV-23` · Revisión del cambio solicitado por un compañero: permisos de EventBridge Scheduler

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Validar un cambio de IAM antes de aplicarlo.

**Prompt estructurado:**

```text
Rol: Revisor de infraestructura y seguridad.
Contexto: Un compañero pide aplicar bootstrap/github-oidc y añadir scheduler:* acotado a recursos guardianmesh-dev-*.
Tarea: Leer el repo actualizado, evaluar si la petición es correcta y por qué, verificar que el plan muestre solo ese cambio, confirmar si corresponde ejecutar los comandos y explicar si el redespliegue del API es automático.
Restricciones: Mínimo privilegio; el plan no debe contener cambios adicionales.
```

---

### `PRM-MV-24` · Gestión de usuarios de prueba en Cognito

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Repetir pruebas de registro desde un estado limpio.

**Prompt estructurado:**

```text
Rol: Operador de la plataforma.
Contexto: Registros fallidos dejan usuarios a medias.
Tarea: Listar los usuarios actuales y eliminar los de prueba cuando se solicite.
Restricciones: Actuar solo sobre el User Pool del proyecto.
```

---

### `PRM-MV-25` · Verificación de email propia en el backend

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Reemplazar la verificación de Cognito.

**Prompt estructurado:**

```text
Quitemos la verificación de Cognito: que el usuario se registre y que nuestro backend se encargue de enviar el correo y de toda la lógica del código de verificación. Crea un Goal 8 y ármalo de una vez: después de la spec pasa directamente al red. Elimina lo que no necesitemos, haz que Cognito no requiera esa verificación y limpia los usuarios. Ejecuta el green.
```

---

### `PRM-MV-26` · Depuración del despliegue de la verificación propia

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Hacer desplegable el cambio en AWS.

**Prompt estructurado:**

```text
Rol: Ingeniero de infraestructura senior.
Contexto: Errores reales: rol de CloudWatch Logs no configurado en API Gateway, scheduler:CreateScheduleGroup denegado, tflint por variable sin uso, kms:ScheduleKeyDeletion y ses:DeleteTemplate denegados, credenciales expiradas, perfil SSO mal usado, plan obsoleto y workflow_dispatch sin el input environment.
Tarea: Verificar el estado de la Lambda y la región, corregir cada error, usar el perfil AWS del proyecto, resolver el rechazo del push y entregar o ejecutar los comandos.
Restricciones: No usar credenciales de otra cuenta.
```

---

### `PRM-MV-27` · Disparo del despliegue de infra desde los repositorios de aplicación

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Que integrar un PR despliegue automáticamente.

**Prompt estructurado:**

```text
Crea un workflow en cada repo para que, al integrar código desde un PR, únicamente se dispare el workflow de despliegue en infra.
```

---

### `PRM-MV-28` · Depuración de CORS y errores 500 en la verificación

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** El registro fallaba y dejaba usuarios incompletos.

**Prompt estructurado:**

```text
Rol: Ingeniero backend de depuración.
Contexto: El navegador reporta CORS y después HTTP 500; se aplican planes con -target y reemplazo de la Lambda del gateway; algunos planes quedan obsoletos.
Tarea: Diagnosticar con logs la causa raíz, evitar soluciones tipo parche, verificar tras cada apply, indicar con qué servicio se envía el correo y por qué no llega.
Restricciones: Recordar que el despliegue es automático; limpiar usuarios a medias.
```

---

### `PRM-MV-29` · Corrección de la identidad de Git

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Los commits salían con una cuenta no deseada.

**Prompt estructurado:**

```text
¿Por qué se están subiendo cosas con otra cuenta? Esa no es la que quiero usar. Configura:
git config --global user.name "miguelvanegas-c"
git config --global user.email "<correo institucional>"
```

---

### `PRM-MV-30` · Eliminación de la verificación de email y del MFA obligatorio

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Simplificar el registro del MVP.

**Prompt estructurado:**

```text
Rol: Desarrollador full stack senior.
Contexto: El envío de correo sigue sin ser confiable y complica el MVP.
Tarea: Evaluar una forma más simple de enviar correo y, si no existe, eliminar la verificación; quitar también el flujo de app autenticadora para que, al registrarse, el usuario entre directo a la pantalla de inicio.
Restricciones: Eliminar el flujo completo en front e infra.
```

---

### `PRM-MV-31` · Rutas y navegación de autenticación

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Hacer del login la puerta de entrada.

**Prompt estructurado:**

```text
Quita el botón "¿Perdiste tu app autenticadora?" y pon un botón de registrarse que lleve a la página de registro. Además, al entrar quiero que me lleve directamente a la ruta de login y no a register. Dame el commit y el push.
```

---

### `PRM-MV-32` · Acceso de colaboradores a la cuenta AWS sin compartir credenciales

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Dar acceso a un compañero sin entregar las credenciales propias.

**Prompt estructurado:**

```text
Rol: Ingeniero de seguridad cloud.
Contexto: Un compañero necesita operar la cuenta.
Tarea: Proponer roles o usuarios IAM, crear uno para el compañero y otro para mí, explicar el inicio de sesión en consola (qué email usar, diferencia entre access key y contraseña).
Restricciones: Un usuario IAM dedicado por colaborador; no compartir credenciales raíz.
```

---

### `PRM-MV-33` · Atribución de autoría de una pantalla

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Saber quién desarrolló un componente.

**Prompt estructurado:**

```text
Rol: Analista de repositorio.
Contexto: Existe una pantalla de Carmen en el front.
Tarea: Indicar quién la desarrolló.
Restricciones: Basarse en git log.
```

---

### `PRM-MV-34` · Sesión AWS, sincronización de repositorios y ejecución del front

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Retomar el trabajo con observabilidad y la versión más reciente.

**Prompt estructurado:**

```text
Rol: Ingeniero DevOps.
Contexto: Retomo el proyecto tras varios días.
Tarea: Iniciar sesión AWS (aws login --profile guardianmesh-dev), explicar el primer ingreso con mi usuario IAM, cerrar sesión cuando lo pida, actualizar development en cada repo y levantar el front.
Restricciones: No imprimir contraseñas en la conversación.
```

---

### `PRM-MV-35` · Unificación de las rutas de Carmen en /dashboard

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Renombrar la pantalla principal sin perder funcionalidad.

**Prompt estructurado:**

```text
Quiero que al entrar a la aplicación la ruta de dashboard sea lo que hoy es la de Carmen; cuando lo tengas haz el commit. Elimina las rutas de Carmen: deja lo mismo de Carmen pero con el nombre dashboard.
```

---

### `PRM-MV-36` · Primera épica de contactos de confianza (descartada)

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Configurar contactos de apoyo ante fraude.

**Prompt estructurado:**

```text
Rol: Arquitecto de software.
Contexto: Consulta sobre el proyecto y las HUs de contacto de apoyo en caso de fraude.
Tarea: Explicar lo que se sabe del proyecto, crear una épica para hasta 5 contactos de confianza y desarrollarla sin parar entre goals; tras detectar que no contemplaba los contactos existentes, deshacer todo lo hecho.
Restricciones: No tocar el gestor de trabajo externo; mantener compatibilidad con los contactos existentes.
```

---

### `PRM-MV-37` · Redefinición: contactos de confianza para reporte de fraude

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Precisar el requisito correcto antes de especificar.

**Prompt estructurado:**

```text
Necesito crear una épica para asignar contactos de confianza. Ya existe la posibilidad de guardar usuarios como contactos; quiero poder configurar contactos como contacto de reporte de fraude, al cual en una épica futura se le enviará una notificación cuando se detecte un fraude. Dime si entendiste qué es lo que quiero. Al configurarlo como de confianza se marca automáticamente para el reporte, y cada usuario puede tener hasta 3. Borra la épica anterior. No hagas nada en el gestor de trabajo externo y recuerda crear una rama para el cambio.
```

---

### `PRM-MV-38` · Spike y épica sobre el código actualizado

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** El primer análisis usó ramas locales desactualizadas.

**Prompt estructurado:**

```text
Rol: Arquitecto de software.
Contexto: Requisito de contactos de confianza confirmado.
Tarea: Ejecutar el spike, actualizar (pull) todos los repos antes de concluir, revisar el código actualizado y, con el spike aprobado, crear la épica.
Restricciones: Verificar contra el código remoto actual.
```

---

### `PRM-MV-39` · Implementación autónoma de contactos de confianza

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Entregar la funcionalidad optimizando tokens.

**Prompt estructurado:**

```text
Rol: Orquestador full stack.
Contexto: Épica trusted-fraud-contacts aprobada.
Tarea: Desarrollarla en una rama propia y entregar commits, pushes y PRs.
Restricciones: Seguir la especificación aprobada; nada en el gestor externo.
```

---

### `PRM-MV-40` · Fallo de resolución Gradle en el build Android

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** El build de la APK no resolvía dependencias.

**Prompt estructurado:**

```text
Rol: Ingeniero Android/CI.
Contexto: Gradle no encuentra guava 33.3.1-jre ni kotlin-stdlib-jdk8 2.2.0 requeridos por google-services 4.4.4.
Tarea: Diagnosticar la causa raíz.
Restricciones: Verificar la disponibilidad real de los artefactos.
```

---

### `PRM-MV-41` · Limpieza del árbol de trabajo y dependencia de Capacitor

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-sonnet-5)
- **Objetivo técnico:** Dejar el front limpio y arrancable.

**Prompt estructurado:**

```text
Rol: Desarrollador frontend.
Contexto: Hay un cambio local no deseado y Vite falla al resolver "@capacitor/core".
Tarea: Descartar el cambio y corregir el import no resuelto.
Restricciones: No alterar código fuente innecesariamente.
```

---

### `PRM-MV-42` · Spec backend de notificaciones a contactos de confianza por WSS

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Avisar al contacto de confianza ante un posible fraude.

**Prompt estructurado:**

```text
Ya podemos asignar un usuario de confianza; necesito el backend para crear una notificación:
1. Solo trabajo de backend por el momento; el front está fuera del alcance.
2. Un endpoint para crear la notificación y que le llegue al otro; se me ocurre por WSS.
3. Crea una spec con dos goals: uno para todo lo necesario para la notificación y otro para que les llegue a los usuarios de confianza.
Actualiza antes todos los repos.
```

---

### `PRM-MV-43` · Desarrollo autónomo del backend de notificaciones

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Implementar ambos goals sin interrupciones.

**Prompt estructurado:**

```text
Rol: Orquestador backend.
Contexto: Spec de notificaciones aprobada.
Tarea: Ejecutar /dev-epic para ambos goals, crear rama, subirla, abrir PR, rebasar con development y resolver conflictos.
Restricciones: Decidir de forma autónoma siguiendo la especificación aprobada; no usar el gestor externo.
```

---

### `PRM-MV-44` · Diagnóstico de bloqueos de Bedrock y Transcribe en la cuenta AWS

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Un compañero no podía probar la detección en tiempo real.

**Prompt estructurado:**

```text
Rol: Ingeniero cloud especialista en servicios de IA.
Contexto: Reporte de un compañero: Bedrock responde "Your account is currently being verified" y Transcribe SubscriptionRequiredException; se plantea Voxtral por Bedrock como plan B; como dueño de la cuenta debo resolverlo.
Tarea: Iniciar sesión, verificar el estado real, habilitar Transcribe si es posible, autenticar al usuario del compañero, aclarar si el plan gratuito de 6 meses cubre Transcribe, indicar exactamente qué debo hacer y redactar una respuesta que cubra todos sus puntos.
Restricciones: Distinguir lo comprobado de lo no confirmado.
```

---

### `PRM-MV-45` · Infraestructura WebSocket e IAM para las notificaciones

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Sin infraestructura el backend no tenía socket desplegado.

**Prompt estructurado:**

```text
Sigue pendiente la infraestructura del Goal 2 (módulo WSS, IAM del gateway y cableado en dev). Si se hace merge ahora, el backend de notificaciones queda sin el socket desplegado. Haz la parte de infra: tienes acceso al repo, así que créala. Cuando termines crea el commit y el PR.
```

---

### `PRM-MV-46` · Corrección de pipeline de lint y bloqueo de merge

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** El PR no podía integrarse.

**Prompt estructurado:**

```text
Rol: Ingeniero CI.
Contexto: Fallan ruff (E501) y tflint (account_id declarada sin uso).
Tarea: Corregir, entregar un commit nuevo y explicar por qué no permite hacer merge.
Restricciones: Sin cambios de lógica.
```

---

### `PRM-MV-47` · Épica frontend: botón de alerta y recepción en tiempo real

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Conectar la interfaz con el backend de notificaciones.

**Prompt estructurado:**

```text
Rol: Arquitecto y desarrollador frontend.
Contexto: El socket ya existe en backend.
Tarea: Revisar si hay un botón de notificación, verificar si falta backend, crear una épica de dos goals para el front, conectar el botón y mostrar la notificación al otro contacto, y desarrollarla.
Restricciones: Comenzar cuando los PRs previos estén integrados.
```

---

### `PRM-MV-48` · Cobertura completa del flujo e infraestructura de persistencia

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Faltaba la tabla para el flujo completo.

**Prompt estructurado:**

```text
Para cubrir todo el caso, ¿qué falta por cubrir y cómo funciona el flujo completo? Cubre la infra; si la tabla no existe, ¿qué se hizo en el backend para crear una notificación? Dame al final todos los commits y PRs necesarios y revisa que todo esté pasando.
```

---

### `PRM-MV-49` · Rebase y conflictos de la épica de notificaciones

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Integrar ramas divergentes.

**Prompt estructurado:**

```text
Rol: Ingeniero de integración.
Contexto: El front y la infra presentan conflictos y cambios sin confirmar.
Tarea: Revisar el front, rebasarlo, resolver conflictos, hacer push e indicar qué más hay que integrar además de la infra.
Restricciones: Conservar ambos conjuntos de cambios.
```

---

### `PRM-MV-50` · Diagnóstico de llamadas que no se podían contestar

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Las llamadas dejaron de funcionar tras un despliegue.

**Prompt estructurado:**

```text
Se rompieron las llamadas, no deja contestar; haz un diagnóstico de qué puede estar pasando y coméntamelo. (Se adjunta el reporte de un compañero: tras el deploy de dev, la Lambda del gateway tiene 11 variables y el estado de Terraform 17.) Inicia sesión en la cuenta AWS de GuardianMesh para tener el panorama completo de la causa.
```

---

### `PRM-MV-51` · Habilitar el botón de notificar en riesgo alto

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** El contacto de confianza no recibía el aviso.

**Prompt estructurado:**

```text
Rol: Ingeniero full stack de depuración.
Contexto: Con riesgo alto no aparece el botón de notificar.
Tarea: Explicar qué ocurre al notificar a un contacto de confianza ante un intento de estafa y corregir lo necesario para que la opción aparezca.
Restricciones: Verificar los recursos reales en AWS.
```

---

### `PRM-MV-52` · Eliminación del flujo de demostración y los datos simulados

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** La llamada real mostraba contenido simulado.

**Prompt estructurado:**

```text
Rol: Desarrollador frontend.
Contexto: Al llamar aparece contenido mockeado.
Tarea: Eliminar todo lo simulado y dejar solo el flujo normal de una llamada en una rama nueva. Posteriormente: descartar los cambios, volver a development, cerrar el PR y eliminar las ramas.
Restricciones: No incluir trabajo local propio ajeno al cambio.
```

---

### `PRM-MV-53` · Depuración de contacto de confianza y notificaciones no visibles

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Las notificaciones no se creaban o no se mostraban.

**Prompt estructurado:**

```text
Rol: Ingeniero full stack de depuración.
Contexto: El botón de confianza parece no funcionar y no se muestran notificaciones.
Tarea: Revisar en las tablas los contactos de confianza del usuario de prueba, comprobar si se creó la notificación y corregir backend y variables.
Restricciones: El botón de confianza solo debe marcar el contacto, sin abrir formularios.
```

---

### `PRM-MV-54` · Centro de notificaciones en la barra superior

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** El contacto necesitaba un lugar donde ver el aviso.

**Prompt estructurado:**

```text
En el front, cuando abro el botón de notificaciones de arriba, ya deberían salir las notificaciones si un compañero decidió enviarlas. No quiero un banner: quiero ver la notificación con su información arriba a la derecha. Revisa si se creó y crea una rama para cada cosa, con sus commits y PRs.
```

---

### `PRM-MV-55` · Variable del WebSocket en builds web y Android

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** El otro usuario seguía sin ver la notificación.

**Prompt estructurado:**

```text
Rol: Ingeniero CI.
Contexto: El arreglo no permitió que el otro usuario viera la notificación.
Tarea: Crear y verificar la variable faltante, integrar el PR cuando pasen los checks y comprobar si se publicó la APK.
Restricciones: Merge solo con checks en verde.
```

---

### `PRM-MV-56` · Mensaje de error persistente con notificaciones cargadas

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Aparecía "no se pudieron cargar los avisos" aunque había avisos.

**Prompt estructurado:**

```text
Rol: Desarrollador frontend.
Contexto: El contacto ve sus dos notificaciones junto con el error de carga.
Tarea: Explicar la causa y corregir el mensaje, en una rama aparte con PR.
Restricciones: Mostrar el error solo cuando no haya avisos que enseñar.
```

---

### `PRM-MV-57` · Spike del historial y detalle de llamadas

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** El tab de historial existía sin backend.

**Prompt estructurado:**

```text
En el front existe una página de historial de llamadas; quiero crear una épica para el backend. Primero haz un /spike y verifica qué estamos registrando de las llamadas para poder mostrarlo: en el tab de historial deben salir las llamadas realizadas de forma general y se debe poder ingresar a cada una para ver más información, según lo que exista.
```

---

### `PRM-MV-58` · Implementación multi-repo del historial

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Entregar listado y detalle de llamadas.

**Prompt estructurado:**

```text
Rol: Orquestador full stack.
Contexto: Spike aprobado.
Tarea: Desarrollar la épica tocando todos los repos necesarios y entregar commits y PRs.
Restricciones: Sin preguntas y sin gestor externo.
```

---

### `PRM-MV-59` · Rebase apilado y conflictos del historial en infraestructura

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** La rama de historial dependía de commits ya integrados.

**Prompt estructurado:**

```text
Rol: Ingeniero de integración.
Contexto: feature/call-history-infra está apilada sobre commits previos.
Tarea: Rebasar sobre origin/development y resolver conflictos.
Restricciones: Publicar con --force-with-lease.
```

---

### `PRM-MV-60` · Eliminación controlada de un usuario de Cognito y consulta de registros

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-infra
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Depurar una cuenta federada de Google.

**Prompt estructurado:**

```text
Rol: Operador cloud.
Contexto: Usuario federado Google en el User Pool; también hay dudas sobre el alta de otro usuario (list-users y logs de pre-sign-up fallan por falta de credenciales).
Tarea: Borrar el usuario de Cognito, confirmar el resultado y verificar si existe; revisar los logs del trigger.
Restricciones: Identificar el pool correcto antes de borrar.
```

---

### `PRM-MV-61` · Depuración del historial vacío y registro de llamadas

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** El historial no cargaba ni acumulaba llamadas.

**Prompt estructurado:**

```text
Rol: Ingeniero backend de depuración.
Contexto: Backend desplegado y front local; GET /api/v1/calls/history responde 200 "from service worker".
Tarea: Revisar logs, verificar por qué no se agregan llamadas, si solo se registran las de riesgo rojo y si las pruebas recientes quedaron guardadas.
Restricciones: Verificar si los PRs ya están integrados.
```

---

### `PRM-MV-62` · Escritura de historial en el servicio de comunicaciones

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-communications
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Desbloquear el goal que dependía de un repo no descargado.

**Prompt estructurado:**

```text
Rol: Desarrollador backend serverless.
Contexto: El Goal 1 estaba bloqueado por no tener el repo.
Tarea: Descargar el repo, implementar el cambio en una rama, agregar un commit al PR ya abierto y verificar si falta integrar algo en infra.
Restricciones: Reutilizar el PR existente.
```

---

### `PRM-MV-63` · Error 500 en el listado por nombre del interlocutor

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Cualquier lista con llamadas devolvía 500.

**Prompt estructurado:**

```text
Rol: Ingeniero backend de depuración.
Contexto: Hay errores en el gateway tras registrar llamadas.
Tarea: Revisar logs, corregir, confirmar y hacer merge.
Restricciones: Compatibilidad con ítems antiguos.
```

---

### `PRM-MV-64` · Conflictos del front y botón de llamada perdido

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** La integración alteró la interfaz.

**Prompt estructurado:**

```text
Rol: Ingeniero de integración frontend.
Contexto: Tras integrar desapareció el botón de llamada y el rebase de la rama del front tiene conflictos y cambios sin confirmar.
Tarea: Explicar la desaparición, resolver conflictos, indicar qué falta por confirmar y completar rebase y push.
Restricciones: Operar sobre la rama del front.
```

---

### `PRM-MV-65` · Tarjetas de contactos responsivas

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Las tarjetas se desbordaban en pantallas pequeñas.

**Prompt estructurado:**

```text
Las cajas donde se muestran los contactos salen mal según el tamaño de la pantalla del celular; ¿puedes hacerlo responsivo?
```

---

### `PRM-MV-66` · Métricas de líneas de código por integrante

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** Documentación / Web 3D
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Medir el aporte de cada integrante.

**Prompt estructurado:**

```text
Rol: Analista de repositorios.
Contexto: Proyecto multi-repo; uso dos identidades de Git.
Tarea: Contar las líneas totales y por integrante, unificando mis dos identidades.
Restricciones: Contar solo development e incluir comunicaciones.
```

---

### `PRM-MV-67` · Diagnóstico WebRTC: fallo de conectividad ICE y evaluación de TURN

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-communications
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** Las llamadas terminaban con reason "failed".

**Prompt estructurado:**

```text
Rol: Especialista en WebRTC.
Contexto: Mensajes de señalización: candidatos ICE srflx y call:ended con reason "failed"; antes funcionaba y se sospecha de la red.
Tarea: Investigar logs en AWS, evaluar la dificultad de la solución y diseñar pruebas (misma red de datos, dos dispositivos con hotspot).
Restricciones: No cambiar código ni infraestructura antes de confirmar la hipótesis.
```

---

### `PRM-MV-68` · Endpoint para listar notificaciones recibidas (405)

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-api
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** La notificación se creaba pero no se podía consultar.

**Prompt estructurado:**

```text
Rol: Desarrollador backend.
Contexto: La consulta devuelve "Method Not Allowed" en API Gateway.
Tarea: Corregir para poder traer las notificaciones; confirmar y publicar.
Restricciones: Publicar endpoint GET de notificaciones y validar respuesta HTTP 200.
```

---

### `PRM-MV-69` · Pregunta de seguridad ausente con riesgo rojo

- **Responsable:** Miguel Vanegas
- **Repositorio / Capa:** GuardianMesh-front
- **Herramienta y modelo:** Claude Code CLI (claude-haiku-5-5)
- **Objetivo técnico:** No aparecía el formulario de verificación.

**Prompt estructurado:**

```text
Rol: Ingeniero full stack de depuración.
Contexto: Con riesgo rojo no aparece el formulario.
Tarea: Explicar la causa y verificar si el contacto de prueba tiene pregunta registrada.
Restricciones: Informar lo que no se puede consultar desde el servidor.
```

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
