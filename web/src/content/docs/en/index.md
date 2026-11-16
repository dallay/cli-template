---
title: "{{PROJECT_NAME}}"
description: "Documentation for {{PROJECT_NAME}} — a Rust CLI template project."
---

Welcome to the **{{PROJECT_NAME}}** documentation. This is a Rust CLI tool built with [Clap](https://github.com/clap-rs/clap) and [Tokio](https://tokio.rs/), designed as a template for building production-ready command-line applications.

## Quick Links

- **Getting Started** — install and run your first command.
- **Usage** — learn about available commands and options.
- **Architecture** — understand the project structure and design decisions.
- **CLI Reference** — complete reference for all commands and flags.
- **Contributing** — how to contribute to this project.

## Key Features

- **Cross-platform** — runs on macOS, Linux, and Windows.
- **Fast** — written in Rust for maximum performance.
- **Type-safe CLI** — powered by Clap derive macros.
- **Async runtime** — built on Tokio for concurrent operations.
- **Structured logging** — tracing with environment-based filtering.
- **Docker support** — multi-stage Alpine-based container image.
- **npm distribution** — TypeScript wrapper for cross-platform installation.

## Installation

```bash
# Via Cargo
cargo install {{CARGO_NAME}}

# Via npm
npm install -g {{NPM_SCOPE}}/{{CARGO_NAME}}
```

See the [Getting Started](./guides/getting-started) guide for more details.
