# Arreglar workflows fallando en `main`

## Ruta

Delegated direct — yo (Kerrigan) dirijo, diagnostico y verifico; Junie (`junie-lite`, CLI)
ejecuta la edición de código bajo instrucciones acotadas.

## Evidencia del diagnóstico

| Workflow | Run | Síntoma | Causa raíz |
| --- | --- | --- | --- |
| `Release` → `publish-npm-base` | 44089678536 (0.1.6), 44081884652 (0.1.5) | `tsc` sale con código 2: `TS2591 Cannot find name 'node:child_process'` | `npm/cli-template/tsconfig.json` no declara `types`, y `typescript@7.0.2` ya no auto-incluye los paquetes de `@types` |
| `Release` → `upload-assets` | 44081884652 (0.1.5) | `Not Found - update-a-release-asset` y assets duplicados | `softprops/action-gh-release` sube los 5 binarios con el mismo basename (`cli-template`), así que se pisan entre sí |
| `Deploy Docs to GitHub Pages` | 44081245773 | `Failed to create deployment (status: 404)` | El repositorio no tiene GitHub Pages habilitado (`has_pages: false`); el job `build` sí pasa |

Reproducción local confirmada del fallo de TypeScript:

```text
$ npm ci --ignore-scripts && npm run build
src/index.ts(3,25): error TS2591: Cannot find name 'node:child_process'.
...
```

Con `"types": ["node"]` añadido a `compilerOptions`, `npm run build` termina con código 0 y emite
`src/index.js` y `src/index.d.ts`.

Consecuencia colateral ya visible: las releases v0.1.5 y v0.1.6 solo tienen 1 y 2 assets,
respectivamente, en lugar de 5 binarios con nombres distintos.

## Tareas

- [ ] T1 — `npm/cli-template/tsconfig.json`: añadir `"types": ["node"]` en `compilerOptions`.
- [ ] T2 — `.github/workflows/release.yml`: renombrar cada binario descargado a
      `cli-template-<target>[.exe]` antes de subirlo al release, para que no colisionen.
- [ ] T3 — `.github/workflows/ci.yml`: añadir un job que compile el wrapper npm de TypeScript, para
      que este fallo no vuelva a pasar desapercibido.
- [ ] T4 — Infraestructura: habilitar GitHub Pages con `build_type=workflow`.

## Verificación

- `npm run build` en una copia con las versiones resueltas → código 0.
- `npm pack --dry-run` → contiene `src/index.js` y `src/index.d.ts`.
- `cargo fmt --all -- --check`, `cargo clippy --all-targets --all-features -- -D warnings`,
  `cargo test --all-features` → sin cambios de Rust, se ejecutan igual como control.
- `actionlint` sobre los workflows modificados (si está disponible).
- Revisión de diff completa: como el modelo delegado es débil, cada línea se audita.

## Estado

En progreso.
