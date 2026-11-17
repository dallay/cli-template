# Arreglar workflows fallando en `main`

## Ruta

Delegated direct — yo (Kerrigan) dirigí, diagnostiqué y verifiqué; Junie (`junie-lite`, CLI)
ejecutó toda la edición de código bajo instrucciones acotadas.

## Evidencia del diagnóstico

| Workflow | Run | Síntoma | Causa raíz |
| --- | --- | --- | --- |
| `Release` → `publish-npm-base` | 44089678536 (0.1.6), 44081884652 (0.1.5) | `tsc` salía con código 2: `TS2591 Cannot find name 'node:child_process'` | `npm/cli-template/tsconfig.json` no declaraba `types`, y `typescript@7.0.2` ya no auto-incluye los paquetes de `@types` |
| `Release` → `upload-assets` | 44081884652 (0.1.5) | `Not Found - update-a-release-asset` y assets duplicados | `softprops/action-gh-release` subía los 5 binarios con el mismo basename (`cli-template`), así que se pisaban entre sí |
| `Deploy Docs to GitHub Pages` | 44081245773 | `Failed to create deployment (status: 404)` | El repositorio no tenía GitHub Pages habilitado (`has_pages: false`); el job `build` sí pasaba |

Reproducción local del fallo de TypeScript:

```text
$ npm ci --ignore-scripts && npm run build
src/index.ts(3,25): error TS2591: Cannot find name 'node:child_process'.
...
```

Con `"types": ["node"]` en `compilerOptions`, `npm run build` termina con código 0 y emite
`src/index.js` y `src/index.d.ts`.

## Tareas

- [x] T1 — `npm/cli-template/tsconfig.json`: `"types": ["node"]` en `compilerOptions`.
- [x] T2 — `.github/workflows/release.yml`: renombrar cada binario a `cli-template-<target>[.exe]`
      antes de subirlo al release.
- [x] T3 — `.github/workflows/ci.yml`: job `npm-wrapper` que compila el wrapper de TypeScript.
- [x] T4 — Habilitar GitHub Pages con `build_type=workflow`.
- [x] T5 — `.github/workflows/deploy-docs.yml`: job `pages-check` que salta el deploy con un warning
      cuando Pages no está habilitado; ante cualquier respuesta distinta de 404 falla de forma
      visible, sin ocultar errores reales.

Commits en `main`: `a4d6562`, `58ff722`, `dd35ca1`, `3cd9e46`, `498a426`, `67c7f51`, `1869bfd`.
El commit vacío `498a426` existe solo porque GitHub no entregó los eventos de Actions del primer
push.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Build del wrapper en copia con versiones resueltas | código 0, emite `index.js` + `index.d.ts` |
| `npm pack --dry-run` | 4 archivos, 1.3 kB, sin errores |
| Simulación del renombrado de assets | 5 nombres únicos |
| `actionlint` en los tres workflows tocados | sin avisos nuevos (solo `SC2086` preexistente en `release-summary`) |
| Parseo YAML y grafo de jobs | `deploy` depende de `[build, pages-check]` |
| API de Pages con token real | 200 en este repo, 404 en un repo sin Pages |
| `Deploy Docs` run 44092016939 | success; `https://dallay.github.io/cli-template/` responde 200 |
| `Deploy Docs` run 44098306947 (con guard) | `pages-check`, `build` y `deploy` en success: el guard no bloquea un repo con Pages habilitado |
| `CI` run 44093607400 | success, incluido `npm-wrapper` en los tres sistemas operativos |
| `Release` run 44094561918 (v0.1.7) | success: `upload-assets` y `publish-npm-base` en verde por primera vez |
| Assets de v0.1.7 | 5 binarios con nombres y tamaños distintos |
| Registro npm | `@dallay/cli-template@0.1.7` publicado; el tarball trae `index.js`, `index.d.ts` y `package.json`; `@dallay/cli-template-darwin-arm64@0.1.7` resuelve |

Rust no se tocó, así que no se ejecutó `cargo` local; CI cubrió `fmt`, `clippy`, `check` y `test` en
los tres sistemas operativos.

## Pendientes conocidos

- El `outDir` y el `rootDir` del wrapper apuntan ambos a `src/`, así que el paquete publicado incluye
  `index.ts`. Funciona, pero convendría mover la salida a `dist/`.
- El `sed` sobre `package-lock.json` en `release.yml` y `ci.yml` sigue siendo frágil ante cambios de
  formato del lockfile.
- Las releases v0.1.5 y v0.1.6 quedaron con assets incompletos y no se pueden corregir sin volver a
  subirlos a mano.

## Estado

Completado y verificado en `main`.
