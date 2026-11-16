---
title: "Uso"
description: "Aprende a usar los comandos y opciones de {{CARGO_NAME}}."
---

Esta página cubre los comandos disponibles y sus patrones de uso.

## Estructura de Comandos

{{CARGO_NAME}} utiliza una estructura basada en subcomandos:

```bash
{{CARGO_NAME}} <COMANDO> [OPCIONES]
```

## Comandos Disponibles

### `version`

Muestra información de versión y sistema:

```bash
{{CARGO_NAME}} version
```

**Salida:**

```
Name: {{CARGO_NAME}}
Version: 0.1.0
Author: {{AUTHOR}}
Target triple: x86_64
OS: macos
```

### `greet`

Saluda a alguien por su nombre:

```bash
{{CARGO_NAME}} greet --name "Mundo"
```

**Opciones:**

| Banderas | Corta | Descripción                    | Requerida |
|----------|-------|--------------------------------|-----------|
| `--name` | `-n`  | Nombre de la persona a saludar | Sí        |

**Salida:**

```
Hello, Mundo!
```

## Opciones Globales

| Banderas    | Corta | Descripción                     |
|-------------|-------|---------------------------------|
| `--help`    | `-h`  | Imprimir información de ayuda   |
| `--version` | `-V`  | Imprimir información de versión |

## Variables de Entorno

| Variable   | Descripción                               | Predeterminado |
|------------|-------------------------------------------|----------------|
| `RUST_LOG` | Controlar el nivel de registro de tracing | `info`         |

Ejemplo:

```bash
RUST_LOG=debug {{CARGO_NAME}} greet --name "Mundo"
```

## Códigos de Salida

| Código | Descripción   |
|--------|---------------|
| `0`    | Éxito         |
| `1`    | Error general |

## Consejos

- Usa `{{CARGO_NAME}} --help` para ver todos los comandos disponibles.
- Usa `{{CARGO_NAME}} <comando> --help` para ayuda específica de un comando.
- Establece `RUST_LOG=debug` para salida detallada durante la solución de problemas.
