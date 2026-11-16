---
title: "Referencia de la CLI"
description: "Referencia completa de todos los comandos y banderas de {{CARGO_NAME}}."
---

Esta página proporciona la referencia completa de todos los comandos, subcomandos y banderas disponibles.

## Sinopsis

```bash
{{CARGO_NAME}} [OPCIONES] [COMANDO]
```

## Opciones Globales

| Banderas      | Corta | Descripción                    |
|---------------|-------|--------------------------------|
| `--help`      | `-h`  | Imprimir información de ayuda  |
| `--version`   | `-V`  | Imprimir información de versión |

## Comandos

### `version`

Muestra información de versión y sistema.

```bash
{{CARGO_NAME}} version
```

**Descripción:** Imprime el nombre del paquete, versión, autor, arquitectura objetivo y sistema operativo.

**Ejemplo de salida:**

```
Name: {{CARGO_NAME}}
Version: 0.1.0
Author: {{AUTHOR}}
Target triple: x86_64
OS: macos
```

### `greet`

Saluda a alguien por su nombre.

```bash
{{CARGO_NAME}} greet --name <NOMBRE>
```

**Opciones:**

| Banderas    | Corta | Descripción                    | Requerida |
|-------------|-------|--------------------------------|-----------|
| `--name`    | `-n`  | Nombre de la persona a saludar | Sí        |

**Ejemplos:**

```bash
{{CARGO_NAME}} greet --name "Mundo"
{{CARGO_NAME}} greet -n "Alice"
```

**Salida:**

```
Hello, Mundo!
```

## Variables de Entorno

| Variable     | Descripción                          | Predeterminado |
|--------------|--------------------------------------|----------------|
| `RUST_LOG`   | Controlar el nivel de registro de tracing. Acepta `trace`, `debug`, `info`, `warn`, `error`. | `info` |

## Códigos de Salida

| Código | Descripción     |
|--------|-----------------|
| `0`    | Éxito           |
| `1`    | Error general   |

## Salida de Ayuda

Ejecuta `{{CARGO_NAME}} --help` para ver la ayuda generada automáticamente:

```
A Rust CLI template project

Usage: {{CARGO_NAME}} [COMMAND]

Commands:
  version  Display version and system information
  greet    Greets someone by name
  help     Print this message or the help of the given subcommand(s)

Options:
  -h, --help     Print help
  -V, --version  Print version
```
