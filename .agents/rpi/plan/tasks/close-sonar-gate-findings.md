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
- [x] RPI-005 — Reconsultar SonarCloud después de un análisis nuevo; no afirmar el cierre del gate antes de tener esa evidencia. Requiere commit selectivo, push de una rama y PR para activar el análisis automático.

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

## Evidencia del análisis nuevo (PR #67)

- Rama `fix/sonarcloud-quality-gate-findings`, PR #67: https://github.com/dallay/cli-template/pull/67
- Commits del PR: `9af8c0c` (fix de Sonar), `c17e8a3` (evidencia RPI), `e13a702`
  (`cargo check --locked` en el job `check`, aplicado por CodeRabbit sobre la rama).
- Quality Gate del PR en `e13a702`: `OK`. Condiciones: `new_reliability_rating=1`,
  `new_security_rating=1`, `new_maintainability_rating=1`, `new_duplicated_lines_density=0.0`,
  `new_security_hotspots_reviewed=100.0`; todas en `OK` frente a sus umbrales.
- Búsqueda de issues del PR con estados `OPEN` y `ACCEPTED`: `total=0`. Ninguna de las 6 findings
  originales sigue abierta y ninguna se aceptó como excepción.
- Consulta dirigida por las 5 reglas originales (`githubactions:S8543`, `githubactions:S8549`,
  `docker:S8549`, `javascript:S4036`, `text:S8564`) sobre el PR: `total=0`.
- Check `SonarCloud Code Analysis` del PR: `SUCCESS`.
- CI del PR en `e13a702`: todos los checks en `SUCCESS`, incluidos `check`, `fmt`, `clippy`,
  `test (ubuntu-latest)`, `test (macos-latest)`, `test (windows-latest)` y `npm-wrapper`.

### Code smells residuales

El análisis del PR reporta 2 code smells `docker:S8431` ("use either the version tag or the digest
for the image instead of both") en las líneas 2 y 12 del `Dockerfile`. Son preexistentes en
`main` — aparecen idénticos en el análisis del PR #56, ya mergeado — y no provienen de este
cambio: este PR solo añadió `--locked` a la línea 9. No afectan el Quality Gate
(`new_maintainability_rating=1`) ni el criterio de cierre.

### Gate de `main`

`main` sigue en `ERROR` con `new_security_rating=3` porque aún contiene las 6 findings originales
en código nuevo. La verificación de issues en `main` confirma que las 6 siguen abiertas ahí
(`githubactions:S8543` en `ci.yml` y `release.yml`, `githubactions:S8549` en `release.yml`,
`docker:S8549` en `Dockerfile`, `javascript:S4036` en `check-package.mjs`, `text:S8564` en
`npm/cli-template/package.json`). El merge de este PR es lo que cierra ese gate.

## Estado

Ready — las seis findings están cerradas sin excepciones, verificadas por un análisis nuevo con
Quality Gate `OK` y cero issues `OPEN`/`ACCEPTED`. El PR #67 queda abierto para revisión y merge.
Los cambios de documentación del usuario permanecen sin commitear y fuera del PR.
