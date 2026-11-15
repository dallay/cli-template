# {{PROJECT_NAME}}

[![CI](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/actions/workflows/ci.yml/badge.svg)](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/actions/workflows/ci.yml)
[![Release](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/actions/workflows/release.yml/badge.svg)](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/blob/main/LICENSE)
[![Crates.io](https://img.shields.io/crates/v/{{CARGO_NAME}}.svg)](https://crates.io/crates/{{CARGO_NAME}})
[![npm version](https://img.shields.io/npm/v/{{NPM_SCOPE}}/{{CARGO_NAME}}.svg)](https://www.npmjs.com/package/{{NPM_SCOPE}}/{{CARGO_NAME}})

{{DESCRIPTION}}

## Installation

### Cargo

```bash
cargo install {{CARGO_NAME}}
```

### npm

```bash
npm install -g {{NPM_SCOPE}}/{{CARGO_NAME}}
```

### Docker

```bash
docker pull {{DOCKERHUB_USER}}/{{REPO_NAME}}:latest
```

### GitHub Release

Download the latest binary from [GitHub Releases](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/releases).

## Usage

```bash
{{CARGO_NAME}} --help
```

## Build from Source

```bash
git clone https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}.git
cd {{REPO_NAME}}
cargo build --release
```

The binary will be in `target/release/{{CARGO_NAME}}`.

## Development

### Prerequisites

- Rust 1.70+ (stable)
- cargo

### Setup

```bash
# Install dependencies
cargo build

# Run tests
cargo test

# Run clippy
cargo clippy --all-targets --all-features -- -D warnings

# Format code
cargo fmt --all
```

### Git Hooks

This project uses [lefthook](https://github.com/evilmartians/lefthook) for git hooks.

```bash
# Install lefthook
cargo install lefthook
lefthook install
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

{{AUTHOR}} <{{AUTHOR_EMAIL}}>

## Placeholder Guide

When using this template, replace the following placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{PROJECT_NAME}}` | Human-readable project name | "My CLI Tool" |
| `{{CARGO_NAME}}` | Binary/crate name | "mytool" |
| `{{NPM_SCOPE}}` | npm scope | "@dallay" |
| `{{AUTHOR}}` | Author name | "Yuniel Acosta" |
| `{{AUTHOR_EMAIL}}` | Author email | "email@example.com" |
| `{{REPO_OWNER}}` | GitHub owner | "dallay" |
| `{{REPO_NAME}}` | Repository name | "my-tool" |
| `{{DOCKERHUB_USER}}` | Docker Hub username | "yacosta738" |
| `{{DESCRIPTION}}` | Short description | "A CLI tool for..." |

## Optional Components

This template includes everything. You can remove components you don't need:

- **npm distribution**: Remove `npm/` directory and `publish-npm-*` jobs from `release.yml`
- **Docker**: Remove `Dockerfile`, `.dockerignore`, and `publish-docker` job from `release.yml`
- **crates.io**: Remove `publish-crates` job from `release.yml`
- **Community workflows**: Remove workflows from `.github/workflows/` that you don't need
