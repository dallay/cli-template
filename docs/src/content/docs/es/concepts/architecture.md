---
title: "Arquitectura"
description: "Entiende la estructura del proyecto y las decisiones de diseño."
---

Esta página explica la arquitectura de **{{CARGO_NAME}}** y las decisiones de diseño detrás de la plantilla.

## Estructura del Proyecto

```
{{REPO_NAME}}/
├── Cargo.toml              # Manifiesto del paquete
├── src/
│   ├── main.rs             # Punto de entrada CLI y parsing de Clap
│   └── lib.rs              # Lógica de negocio reutilizable
├── npm/                    # Wrapper npm para distribución multiplataforma
├── Dockerfile              # Construcción Docker multi-etapa
├── Makefile                # Comandos de desarrollo
├── justfile                # Comandos Just
├── lefthook.yml            # Configuración de hooks de Git
├── .github/
│   └── workflows/          # Flujos de CI/CD
└── docs/                   # Sitio de documentación Starlight
```

## Principios de Diseño

### Separación de Responsabilidades

- **`src/main.rs`** — Contiene todo el parsing de Clap, manejo de argumentos CLI y el punto de entrada `main()`. Este archivo es el límite entre la interfaz CLI y la lógica de la aplicación.
- **`src/lib.rs`** — Contiene lógica de negocio reutilizable que puede ser probada con unit tests de forma independiente de la capa CLI.

### Runtime Asíncrono

La aplicación utiliza [Tokio](https://tokio.rs/) como su runtime asíncrono. La macro `#[tokio::main]` en `main()` proporciona un runtime multi-hilo por defecto, permitiendo operaciones concurrentes.

### Logging Estructurado

[tracing](https://github.com/tokio-rs/tracing) se utiliza para logging estructurado y jerárquico. Los niveles de registro pueden controlarse en tiempo de ejecución mediante la variable de entorno `RUST_LOG`:

```bash
RUST_LOG=debug {{CARGO_NAME}} greet --name "Mundo"
```

## Dependencias

| Dependencia        | Propósito                                |
|--------------------|------------------------------------------|
| `clap`             | Parsing tipo-safe de argumentos CLI      |
| `serde` / `serde_json` | Serialización y deserialización       |
| `tokio`            | Runtime asíncrono                        |
| `tracing`          | Logging estructurado                     |
| `tracing-subscriber` | Configuración y filtrado de logging    |

## Perfiles de Construcción

El perfil de release está optimizado para distribución:

```toml
[profile.release]
lto = true        # Optimización en tiempo de enlace
strip = true      # Eliminar símbolos del binario
opt-level = 3     # Optimización máxima
```

## Canales de Distribución

| Canal        | Descripción                                      |
|--------------|--------------------------------------------------|
| **Cargo**    | Distribución principal vía `cargo install`       |
| **npm**      | Wrapper multiplataforma con binarios precompilados |
| **Docker**   | Imagen de contenedor multi-etapa basada en Alpine |
| **GitHub Releases** | Binarios precompilados para todas las plataformas |

## Arquitectura Docker

El `Dockerfile` utiliza una construcción multi-etapa:

1. **Etapa Builder** — El toolchain completo de Rust compila el binario de release.
2. **Etapa Runtime** — Una imagen Alpine mínima copia solo el binario final.

Esto produce una imagen final pequeña (~10-15 MB) sin dependencias de construcción.

## Wrapper npm

El directorio `npm/` contiene un wrapper en TypeScript que:

1. Detecta la plataforma y arquitectura del usuario.
2. Descarga el binario precompilado apropiado desde GitHub Releases.
3. Crea un script shell que invoca el binario.

Esto permite `npm install -g` como método de instalación multiplataforma.
