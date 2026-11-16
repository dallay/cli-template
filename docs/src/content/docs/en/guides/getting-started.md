---
title: "Getting Started"
description: "Install and run {{CARGO_NAME}} for the first time."
---

This guide walks you through installing **{{CARGO_NAME}}** and running your first command.

## Prerequisites

- **Rust 1.70+** (stable) — required only if building from source.
- **Node.js 18+** — required only if using the npm wrapper.

## Installation

### Option 1: Cargo (Recommended for Rust Users)

```bash
cargo install {{CARGO_NAME}}
```

### Option 2: npm (Cross-Platform)

```bash
npm install -g {{NPM_SCOPE}}/{{CARGO_NAME}}
```

The npm wrapper automatically downloads the pre-built binary for your platform.

### Option 3: Docker

```bash
docker pull {{DOCKERHUB_USER}}/{{REPO_NAME}}:latest
```

### Option 4: Build from Source

```bash
git clone https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}.git
cd {{REPO_NAME}}
cargo build --release
```

The binary will be available at `target/release/{{CARGO_NAME}}`.

## Verify Installation

```bash
{{CARGO_NAME}} --version
```

## First Command

Run the help command to see available subcommands:

```bash
{{CARGO_NAME}} --help
```

Try the `greet` command:

```bash
{{CARGO_NAME}} greet --name "World"
```

Expected output:

```
Hello, World!
```

## Next Steps

- Learn about all available commands in the [Usage](./usage) guide.
- Understand the project structure in the [Architecture](../concepts/architecture) page.
- Read the complete [CLI Reference](../reference/cli).
