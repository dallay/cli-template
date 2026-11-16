---
title: "Architecture"
description: "Understand the project structure and design decisions."
---

This page explains the architecture of **{{CARGO_NAME}}** and the design decisions behind the template.

## Project Structure

```
{{REPO_NAME}}/
├── Cargo.toml              # Package manifest
├── src/
│   ├── main.rs             # CLI entry point and Clap parsing
│   └── lib.rs              # Reusable business logic
├── npm/                    # npm wrapper for cross-platform distribution
├── Dockerfile              # Multi-stage Docker build
├── Makefile                # Development commands
├── justfile                # Just commands
├── lefthook.yml            # Git hooks configuration
├── .github/
│   └── workflows/          # CI/CD workflows
└── docs/                   # Starlight documentation site
```

## Design Principles

### Separation of Concerns

- **`src/main.rs`** — Contains all Clap parsing, CLI argument handling, and the `main()` entry point. This file is the boundary between the CLI interface and the application logic.
- **`src/lib.rs`** — Contains reusable business logic that can be unit-tested independently of the CLI layer.

### Async Runtime

The application uses [Tokio](https://tokio.rs/) as its async runtime. The `#[tokio::main]` macro on `main()` provides a multi-threaded runtime by default, enabling concurrent operations.

### Structured Logging

[tracing](https://github.com/tokio-rs/tracing) is used for structured, hierarchical logging. Log levels can be controlled at runtime via the `RUST_LOG` environment variable:

```bash
RUST_LOG=debug {{CARGO_NAME}} greet --name "World"
```

## Dependencies

| Dependency         | Purpose                              |
|--------------------|--------------------------------------|
| `clap`             | Type-safe CLI argument parsing       |
| `serde` / `serde_json` | Serialization and deserialization |
| `tokio`            | Async runtime                        |
| `tracing`          | Structured logging                   |
| `tracing-subscriber` | Logging configuration and filtering |

## Build Profiles

The release profile is optimized for distribution:

```toml
[profile.release]
lto = true        # Link-time optimization
strip = true      # Strip symbols from binary
opt-level = 3     # Maximum optimization
```

## Distribution Channels

| Channel    | Description                                    |
|------------|------------------------------------------------|
| **Cargo**  | Primary distribution via `cargo install`       |
| **npm**    | Cross-platform wrapper with pre-built binaries |
| **Docker** | Multi-stage Alpine-based container image       |
| **GitHub Releases** | Pre-built binaries for all platforms |

## Docker Architecture

The `Dockerfile` uses a multi-stage build:

1. **Builder stage** — Full Rust toolchain compiles the release binary.
2. **Runtime stage** — Minimal Alpine image copies only the final binary.

This produces a small final image (~10-15 MB) with no build dependencies.

## npm Wrapper

The `npm/` directory contains a TypeScript wrapper that:

1. Detects the user's platform and architecture.
2. Downloads the appropriate pre-built binary from GitHub Releases.
3. Creates a thin shell script that invokes the binary.

This enables `npm install -g` as a cross-platform installation method.
