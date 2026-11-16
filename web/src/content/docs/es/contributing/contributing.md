---
title: "Contribuir"
description: "Cómo contribuir a {{PROJECT_NAME}}."
---

¡Damos la bienvenida a las contribuciones a **{{PROJECT_NAME}}**! Esta guía explica cómo comenzar.

## Código de Conducta

Este proyecto sigue un [Código de Conducta](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/blob/main/CODE_OF_CONDUCT.md). Por favor, léelo y cúmplalo.

## Configuración de Desarrollo

### Requisitos Previos

- **Rust 1.70+** (estable)
- **Make** (opcional, para comandos de conveniencia)
- **lefthook** (para hooks de Git)

### Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}.git
cd {{REPO_NAME}}

# Configuración completa (instalar hooks + compilar)
make setup

# Ejecutar todas las verificaciones
make check
```

### Comandos de Construcción

```bash
# Compilar binario de depuración
cargo build

# Compilar binario de release
cargo build --release

# Ejecutar la CLI
cargo run -- --help
```

### Lint y Formato

```bash
# Formatear código
cargo fmt --all

# Ejecutar Clippy
cargo clippy --all-targets --all-features -- -D warnings
```

### Pruebas

```bash
# Ejecutar todas las pruebas
cargo test --all-features

# Ejecutar una prueba específica
cargo test test_name -- --exact
```

## Hooks de Git

Este proyecto utiliza [lefthook](https://github.com/evilmartians/lefthook) para hooks de pre-commit:

```bash
# Instalar lefthook
cargo install lefthook
lefthook install
```

## Proceso de Pull Request

1. Haz un fork del repositorio.
2. Crea una rama de funcionalidad (`git checkout -b feature/mi-funcionalidad`).
3. Realiza tus cambios.
4. Ejecuta `make check` para asegurarte de que todas las verificaciones pasen.
5. Haz commit con un mensaje descriptivo.
6. Haz push a tu fork y abre un Pull Request.

## Reportar Problemas

- Usa la página de [Issues de GitHub](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/issues).
- Incluye los pasos para reproducir el problema.
- Incluye tu sistema operativo y versión de Rust.

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la [Licencia MIT](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/blob/main/LICENSE).
