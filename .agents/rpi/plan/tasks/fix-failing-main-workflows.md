# Arreglar workflows fallando en `main`

## Ruta

Delegated direct — yo (Kerrigan) dirigí, diagnostiqué y verifiqué; Junie (`junie-lite`, CLI)
ejecutó la edición de código bajo instrucciones acotadas.

## Evidencia del diagnóstico

| Workflow | Run | Síntoma | Causa raíz |
| --- | --- | --- | --- |
| `Release` → `publish-npm-base` | 44089678536 (0.1.6), 44081884652 (0.1.5) | `tsc` sale con código 2: `TS2591 Cannot find name 'node:child_process'` | `npm/cli-template/tsconfig.json` no declara `types`, y `typescript@7.0.2` ya no auto-incluye los paquetes de `@types` |
| `Release` → `upload-assets` | 44081884652 (0.1.5) | `Not Found - update-a-release-asset` y assets duplicados | `softprops/action-gh-release` subía los 5 binarios con el mismo basename (`cli-template`), así que se pisaban entre sí |
| `Deploy Docs to GitHub Pages` | 44081245773 | `Failed to create deployment (status: 404)` | El repositorio no tenía GitHub Pages habilitado (`has_pages: false`); el job `build` sí pasaba |

Reproducción local confirmada del fallo de TypeScript:

```text
$ npm ci --ignore-scripts && npm run build
src/index.ts(3,25): error TS2591: Cannot find name 'node:child_process'.
...
```

Con `"types": ["node"]` añadido a `compilerOptions`, `npm run build` termina con código 0 y emite
`src/index.js` y `src/index.d.ts`.

Consecuencia colateral visible: las releases v0.1.5 y v0.1.6 solo tienen 1 y 2 assets,
respectivamente, en lugar de 5 binarios con nombres distintos. Además, `@dallay/cli-template` nunca
se ha publicado en npm (`404`); `publish-npm-base` fallaba desde el primer intento.

## Tareas

- [x] T1 — `npm/cli-template/tsconfig.json`: añadir `"types": ["node"]` en `compilerOptions`.
- [x] T2 — `.github/workflows/release.yml`: renombrar cada binario descargado a
      `cli-template-<target>[.exe]` antes de subirlo al release, para que no colisionen.
- [x] T3 — `.github/workflows/ci.yml`: añadir el job `npm-wrapper` que compila el wrapper de
      TypeScript, para que este fallo no vuelva a pasar desapercibido.
- [x] T4 — Infraestructura: habilitar GitHub Pages con `build_type=workflow`.

Commits: `a4d6562`, `58ff722`, `dd35ca1`, `3cd9e46` y `498a426` (este último solo para re-disparar
los eventos, que GitHub no entregó al primer push).

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Build del wrapper en copia con versiones resueltas | código 0, emite `index.js` + `index.d.ts` |
| `npm pack --dry-run` | 4 archivos, 1.3 kB, sin errores |
| Simulación del renombrado de assets | 5 nombres únicos (`cli-template-<target>[.exe]`) |
| `actionlint` sobre `ci.yml` y `release.yml` | sin avisos nuevos (solo `SC2086` preexistente en `release-summary`) |
| Parseo YAML de ambos workflows | jobs correctos |
| `Deploy Docs to GitHub Pages` (run 44092016939) | success; `https://dallay.github.io/cli-template/` responde 200 |
| `CI` push 498a426 (run 44093607400) | success, incluido `npm-wrapper` |
| `Release` push 498a426 | success; release-please abrió PR #65 (`0.1.7`) |

Rust no se tocó, así que no se ejecutó `cargo` local; CI cubrió `fmt`, `clippy`, `check` y `test` en
los tres sistemas operativos.

## Riesgos y pendientes

- PR #65 (`chore(main): release 0.1.7`) está bloqueado por el ruleset de `main` (requiere 1
  aprobación). Al fusionarlo se publicará en crates.io, npm y Docker Hub, y `publish-npm-base`
  tendrá su primera publicación real.
- Este repositorio es una plantilla: los repos generados desde él no heredan la configuración de
  Pages, así que `deploy-docs` volverá a fallar con 404 hasta habilitarlo o hasta añadir un guard.

## Estado

Implementado, verificado y en `main`. Pendiente decisión del usuario sobre el merge del PR #65.
