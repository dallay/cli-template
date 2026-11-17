# Cerrar findings del Quality Gate de SonarCloud

## Ruta

Delegated direct — Junie (`junie --model=junie-lite`) implementa los cambios acotados; Kerrigan revisa y valida de forma independiente. No se usarán excepciones `Accepted`.

## Hallazgos verificados

SonarCloud reporta 6 issues `OPEN` en el código nuevo y 0 `ACCEPTED`:

- `githubactions:S8543`: `npm install` en `.github/workflows/ci.yml` y `.github/workflows/release.yml`.
- `githubactions:S8549`: `cargo build` sin `--locked` en `.github/workflows/release.yml`.
- `docker:S8549`: `cargo build` sin `--locked` en `Dockerfile`.
- `javascript:S4036`: `execFileSync("npm", ...)` depende de `PATH` en `npm/cli-template/scripts/check-package.mjs`.
- `text:S8564`: falta lockfile para `npm/cli-template/package.json`.

## Decisión

Quitar del manifiesto versionado las cinco `optionalDependencies` placeholder `0.0.0`; versionar `package-lock.json`; usar `npm ci --ignore-scripts`. En release, instalar con `npm ci` antes de inyectar la versión y las cinco dependencias de plataforma. Añadir una guarda de publicación que rechace el paquete base si falta cualquiera de esas dependencias o su versión no coincide. Invocar el CLI de npm mediante rutas absolutas, sin resolución por `PATH`.

## Tareas

- [x] RPI-001 — Aplicar `--locked` a las dos compilaciones Rust señaladas.
- [x] RPI-002 — Quitar placeholders, generar el lockfile; cambiar las instalaciones de CI/release a `npm ci` y ordenar release antes de inyectar metadatos.
- [x] RPI-003 — Eliminar dependencia de `PATH` en la comprobación del tarball y proteger la publicación con las cinco dependencias de plataforma.
- [x] RPI-004 — Revisar diff y ejecutar verificaciones Rust, npm, Docker y de workflows.
- [ ] RPI-005 — Reconsultar SonarCloud después de un análisis nuevo; no afirmar el cierre del gate antes de tener esa evidencia. Requiere commit selectivo, push de una rama y PR para activar el análisis automático.

## Criterios de aceptación

- Las cinco dependencias de plataforma aparecen en el manifiesto publicado con la versión del release; la guarda falla claramente si faltan o difieren.
- `npm ci --ignore-scripts`, build y comprobación del tarball funcionan con el manifiesto y lockfile versionados.
- Las compilaciones Docker y de release usan `--locked`.
- No queda resolución de `npm` por `PATH` en `check-package.mjs`.
- Ninguna finding se acepta como excepción; el análisis actualizado no reporta estas 6 como abiertas.

## Evidencia inicial

- SonarCloud: Quality Gate `ERROR`; `new_security_rating=3`, umbral `1`.
- Búsqueda del proyecto: 6 `OPEN`, 0 `ACCEPTED`; las 6 están en el periodo de código nuevo.
- `cargo build --locked --release` local: éxito.
- Prueba aislada: `npm ci` funciona antes de inyectar dependencias; `npm publish --dry-run` funciona después de inyectarlas aunque el lockfile versionado ya no refleje los metadatos de release.
- `npm pack --dry-run --json` excluye `package-lock.json` del tarball probado.

## Hallazgo lateral: la plantilla de `npm/cli-template/package.json` en release-please es inerte

`release-please-config.json` declara `extra-files` con una entrada de tipo plantilla para
`npm/cli-template/package.json`. Esa entrada no se aplica y no produce error:

- `release-please@17.6.0` (versión que resuelve `^17.6.0` en `release-please-action@v5`) y el
  bundle `dist/index.js` de esa acción contienen el `default: throw new Error('unsupported extraFile
  type: undefined')` para entradas sin `type`.
- La estrategia `rust` sobrescribe `buildUpdates` y no invoca `extraFileUpdates`
  (`strategies/rust.js`: 0 referencias). Por eso la plantilla nunca se procesa y el `throw` nunca se
  alcanza.
- Consecuencia observada: el `package.json` publicado en `@dallay/cli-template@0.1.8` conserva
  `main: dist/index.js`, `files: ["dist"]` y los scripts reales, es decir, el manifiesto versionado
  más la inyección de `release.yml`, no la plantilla.

Consecuencia para este cambio: `npm ci --ignore-scripts` en `release.yml` opera sobre el manifiesto
versionado (`version: 0.0.0`, sin `optionalDependencies`), que sí coincide con el `package-lock.json`
versionado. La inyección de versión y de las cinco dependencias de plataforma ocurre después de la
instalación, por lo que el lockfile no necesita reflejar los metadatos de release.

Riesgo residual: si alguien cambia `release-type` a `node`, la plantilla entraría en vigor y
publicaría un paquete roto (`src` en vez de `dist`). Queda como recomendación fuera del alcance de
este cambio.

## Estado

Working — implementación y validación local completas. Falta el análisis SonarCloud nuevo
(RPI-005), que requiere commit selectivo, push de una rama y PR.
