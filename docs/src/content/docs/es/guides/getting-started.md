---
title: "Primeros pasos"
description: "Instala y ejecuta {{CARGO_NAME}} por primera vez."
---

Esta guía te lleva a través de la instalación de **{{CARGO_NAME}}** y la ejecución de tu primer comando.

## Requisitos Previos

- **Rust 1.70+** (estable) — requerido solo si compilas desde el código fuente.
- **Node.js 18+** — requerido solo si usas el wrapper de npm.

## Instalación

### Opción 1: Cargo (Recomendado para Usuarios de Rust)

```bash
cargo install {{CARGO_NAME}}
```

### Opción 2: npm (Multiplataforma)

```bash
npm install -g {{NPM_SCOPE}}/{{CARGO_NAME}}
```

El wrapper de npm descarga automáticamente el binario precompilado para tu plataforma.

### Opción 3: Docker

```bash
docker pull {{DOCKERHUB_USER}}/{{REPO_NAME}}:latest
```

### Opción 4: Compilar desde el Código Fuente

```bash
git clone https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}.git
cd {{REPO_NAME}}
cargo build --release
```

El binario estará disponible en `target/release/{{CARGO_NAME}}`.

## Verificar la Instalación

```bash
{{CARGO_NAME}} --version
```

## Primer Comando

Ejecuta el comando de ayuda para ver los subcomandos disponibles:

```bash
{{CARGO_NAME}} --help
```

Prueba el comando `greet`:

```bash
{{CARGO_NAME}} greet --name "Mundo"
```

Salida esperada:

```
Hello, Mundo!
```

## Próximos Pasos

- Aprende sobre todos los comandos disponibles en la guía de [Uso](./usage/).
- Entiende la estructura del proyecto en la página de [Arquitectura](../../concepts/architecture/).
- Lee la [Referencia de la CLI](../../reference/cli/) completa.
