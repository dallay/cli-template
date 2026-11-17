# Endurecer el empaquetado del wrapper npm

## Ruta

Delegated direct — Kerrigan diseñó, midió y verificó; Junie (`junie-lite`, CLI) escribió el código
con instrucciones literales.

## Problemas resueltos

1. `outDir` y `rootDir` apuntaban ambos a `src/`, así que el paquete publicado incluía `index.ts` y
   nunca contenía un build real.
2. El release y el CI manipulaban `package.json` y `package-lock.json` con `sed`, que se rompe en
   cuanto cambia el formato del lockfile.

## Evidencia recogida

Con las cinco dependencias opcionales apuntando a una versión inexistente, `npm install
--package-lock-only` escribe un lockfile del que npm **omite** esos paquetes, y después `npm ci`
falla:

```text
npm error `npm ci` can only install packages when your package.json and package-lock.json
npm error Missing: @dallay/cli-template-darwin-arm64@ from lock file
```

Esa es la causa real de que el lockfile necesitara `sed`: un lockfile con placeholders no puede
satisfacer `npm ci` nunca.

Variantes medidas:

| Variante | Resultado |
| --- | --- |
| `npm pkg set` + `install --package-lock-only` + `ci`, versión existente en el registro | funciona |
| igual, versión inexistente (`0.0.0-dev`) | `npm ci` falla: lockfile inconsistente |
| sin lockfile, `npm install --ignore-scripts` | funciona en ambos casos (dev y release) |

## Decisión

- Eliminar `package-lock.json` y `pnpm-lock.yaml` del wrapper. Las dependencias directas están
  pinneadas exactas y el paquete publicado solo lleva `dist/`, así que el lockfile no aporta nada a
  los consumidores y sí rompe `npm ci`.
- `package.json` queda con valores válidos (`0.0.0`) para que un dev pueda instalar de inmediato.
- La versión real se inyecta solo en el release con `npm pkg set`, sin `sed`.
- `tsconfig.json` emite a `dist/`; `main`, `types`, `bin` y `files` apuntan ahí.
- `scripts/check-package.mjs` valida el contenido del tarball; se ejecuta en CI y en
  `prepublishOnly`.

## Tareas

- [x] T1 — `tsconfig.json` emite a `./dist`; `.gitignore` ignora `npm/cli-template/dist/`.
- [x] T2 — `package.json`: versión `0.0.0` sin placeholders, rutas a `dist`, `files: ["dist"]`,
      scripts `check:package` y `prepublishOnly`.
- [x] T3 — `scripts/check-package.mjs`: validación del tarball.
- [x] T4 — `release.yml`: los tres `sed` sustituidos por `npm pkg set`.
- [x] T5 — `ci.yml`: sin `sed`, con `check:package`.
- [x] T6 — Lockfiles del wrapper eliminados y añadidos a `.gitignore` con su explicación.

Commits: `d2a5417`, `e780651`, `bece8bc`, `f262882`. Release `4c98756`.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Flujo de desarrollo local | `npm install --ignore-scripts` → `npm run build` → `npm run check:package` en verde |
| Flujo de release local (idéntico al workflow) | `npm pkg set` → install → build → `check:package` en verde |
| Binario compilado | `node dist/index.js --version` → `cli-template 0.1.7` |
| Gate en rojo (falta `dist/`) | sale con código 1 y nombra los archivos que faltan |
| Gate en rojo (`src/` filtrado) | sale con código 1 y lista los archivos filtrados |
| Gate en verde | `Package layout OK: dist/index.d.ts, dist/index.js, package.json` |
| `prepublishOnly` | aborta un `npm publish` real (probado con un paquete de prueba y token anulado) |
| `actionlint` en los tres workflows | sin avisos nuevos (solo `SC2086` preexistente en `release-summary`) |
| `CI` push `4c98756` | success en los tres sistemas operativos, `npm-wrapper` incluido |
| `Release` run 44103739202 | success; log confirma `npm pkg set`, `Package layout OK` y `+ @dallay/cli-template@0.1.8` |
| Assets de v0.1.8 | 5 binarios con nombres y tamaños distintos |
| Tarball publicado | 3 archivos: `dist/index.js`, `dist/index.d.ts`, `package.json`. Cero `index.ts` |
| `package.json` publicado | `main`, `types` y `bin` apuntan a `dist/`; las 5 opcionales en `0.1.8` |
| Instalación real desde npm | `npm install @dallay/cli-template@0.1.8` resuelve `cli-template` + el paquete de plataforma; `./node_modules/.bin/cli-template --version` → `cli-template 0.1.8` |

## Nota operativa

El registro de npm tarda entre 3 y 6 minutos en propagar tanto el metadato como el tarball. Durante
esa ventana el índice ya lista la versión pero el tarball devuelve 404. Es propagación de CDN, no un
fallo de publicación: el log del job muestra `+ @dallay/cli-template@0.1.8`.

## Pendientes conocidos

- El wrapper ya no tiene lockfile versionado, así que `npm install` en el paquete base no es
  reproducible bit a bit. Es una consecuencia directa de que las dependencias opcionales solo
  existan después de un release.
- La versión `0.0.0-stage` que aparece en el registro de npm viene de una publicación anterior y no
  se limpió.

## Estado

Completado, publicado y verificado en `main` con la release v0.1.8.
