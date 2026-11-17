# Endurecer el empaquetado del wrapper npm

## Ruta

Delegated direct — Kerrigan diseña y verifica; Junie (`junie-lite`, CLI) escribe el código con
instrucciones literales.

## Problemas a resolver

1. `outDir` y `rootDir` apuntan ambos a `src/`, así que el paquete publicado incluye `index.ts` y el
   `dist` real no existe.
2. El release y el CI manipulan `package.json` y `package-lock.json` con `sed`, que se rompe en
   cuanto cambie el formato del lockfile.

## Evidencia recogida

Con las cinco dependencias opcionales apuntando a una versión inexistente, `npm install
--package-lock-only` escribe un lockfile del que npm **omite** esos paquetes, y después `npm ci`
falla:

```text
npm error `npm ci` can only install packages when your package.json and package-lock.json
npm error Missing: @dallay/cli-template-darwin-arm64@ from lock file
```

Esa es la causa real de que el lockfile necesitara `sed`. Un lockfile con placeholders no puede
satisfacer `npm ci` nunca.

Variantes medidas:

| Variante | Resultado |
| --- | --- |
| `npm pkg set` + `install --package-lock-only` + `ci`, versión existente en el registro | funciona |
| igual, versión inexistente (`0.0.0-dev`) | `npm ci` falla: lockfile inconsistente |
| sin lockfile, `npm install --ignore-scripts` | funciona en ambos casos (dev y release) |

## Decisión

- Eliminar `package-lock.json` y `pnpm-lock.yaml` del wrapper. Todas las dependencias directas están
  pinneadas exactas y el paquete publicado solo lleva `dist/`, así que el lockfile no aporta nada a
  los consumidores y sí rompe `npm ci`.
- `package.json` queda con valores válidos (`0.0.0`) para que un dev pueda instalar de inmediato.
- La versión real se inyecta solo en el release con `npm pkg set`, sin `sed`.
- `tsconfig.json` emite a `dist/`; `main`, `types`, `bin` y `files` apuntan ahí.
- Nuevo `scripts/check-package.mjs` que valida el contenido del tarball; se ejecuta en CI y en
  `prepublishOnly`.

## Tareas

- [ ] T1 — `npm/cli-template/tsconfig.json`: `outDir` a `./dist`; `.gitignore`: ignorar
      `npm/cli-template/dist/`.
- [ ] T2 — `npm/cli-template/package.json`: versión `0.0.0`, sin placeholders, rutas a `dist`,
      `files: ["dist"]`, scripts `check:package` y `prepublishOnly`.
- [ ] T3 — `npm/cli-template/scripts/check-package.mjs`: nuevo script de validación del tarball.
- [ ] T4 — `.github/workflows/release.yml`: sustituir los tres `sed` por `npm pkg set`.
- [ ] T5 — `.github/workflows/ci.yml`: quitar los `sed` y añadir `check:package`.
- [ ] T6 — Eliminar `npm/cli-template/package-lock.json` y `npm/cli-template/pnpm-lock.yaml`.

## Verificación prevista

- Flujo de desarrollo: `npm install --ignore-scripts && npm run build && npm run check:package`.
- Flujo de release simulado: `npm pkg set` a una versión existente, instalar, compilar, empaquetar.
- El gate debe fallar (código 1) si falta `dist/index.js` o si aparece `src/` en el tarball, y pasar
  con el layout correcto. Ya validado antes de escribir el archivo final.
- `actionlint` y parseo YAML de los workflows.
- Publicación real: release nuevo y descarga del tarball publicado.

## Estado

En progreso.
