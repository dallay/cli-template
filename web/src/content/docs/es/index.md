---
title: "{{PROJECT_NAME}}"
description: "Documentación de {{PROJECT_NAME}} — una plantilla de CLI en Rust."
---

Bienvenido a la documentación de **{{PROJECT_NAME}}**. Esta es una herramienta de línea de comandos
escrita en [Rust](https://www.rust-lang.org/), construida
con [Clap](https://github.com/clap-rs/clap) y [Tokio](https://tokio.rs/), diseñada como una
plantilla para crear aplicaciones de consola listas para producción.

## Enlaces Rápidos

- [Primeros pasos](./guides/getting-started/) — instala y ejecuta tu primer comando.
- [Uso](./guides/usage/) — conoce los comandos y opciones disponibles.
- [Arquitectura](./concepts/architecture/) — entiende la estructura del proyecto y las decisiones de
  diseño.
- [Referencia de la CLI](./reference/cli/) — referencia completa de todos los comandos y banderas.
- [Contribuir](./contributing/contributing/) — cómo contribuir a este proyecto.

## Características Principales

- **Multiplataforma** — funciona en macOS, Linux y Windows.
- **Rápida** — escrita en Rust para máximo rendimiento.
- **CLI tipo-safe** — impulsada por macros derive de Clap.
- **Runtime asíncrono** — construida sobre Tokio para operaciones concurrentes.
- **Logging estructurado** — tracing con filtrado basado en entorno.
- **Soporte Docker** — imagen de contenedor multi-etapa basada en Alpine.
- **Distribución npm** — wrapper TypeScript para instalación multiplataforma.

## Instalación

```bash
# Vía Cargo
cargo install {{CARGO_NAME}}

# Vía npm
npm install -g {{NPM_SCOPE}}/{{CARGO_NAME}}
```

Consulta la guía de [Primeros pasos](./guides/getting-started) para más detalles.
