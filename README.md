# {{PROJECT_NAME}}

[![CI](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/actions/workflows/ci.yml/badge.svg)](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/actions/workflows/ci.yml)
[![Release](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/actions/workflows/release.yml/badge.svg)](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/Docs-Starlight-blue.svg)](https://{{REPO_OWNER}}.github.io/{{REPO_NAME}}/)
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

Download the latest binary
from [GitHub Releases](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/releases).

## Documentation

Read the full documentation at <https://{{REPO_OWNER}}.github.io/{{REPO_NAME}}/>.

The documentation site is built with [Starlight](https://starlight.astro.build/) and supports
English and Spanish.

### Local Development

```bash
cd docs
npm install
npm run dev
```

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
- [Make](https://www.gnu.org/software/make/) or [Just](https://just.systems/)

This project includes both a `Makefile` and a `justfile` with the same commands. Use whichever you prefer — `make <command>` or `just <command>`.

### Quick Start

```bash
# Full setup (install hooks + build)
make setup    # or: just setup

# Run all checks (fmt + clippy + test)
make check    # or: just check

# Build release binary
make release  # or: just release
```

### Build Commands

| Command | Description |
|---------|-------------|
| `make setup` / `just setup` | Install dev dependencies and git hooks |
| `make build` / `just build` | Build debug binary |
| `make release` / `just release` | Build optimized release binary |
| `make run` / `just run` | Run the CLI |
| `make test` / `just test` | Run all tests |
| `make lint` / `just lint` | Run clippy with strict warnings |
| `make fmt` / `just fmt` | Format all Rust code |
| `make check` / `just check` | Run fmt + lint + test (full CI locally) |
| `make docker-build` / `just docker-build` | Build Docker image |
| `make docker-run` / `just docker-run` | Run Docker container |
| `make clean` / `just clean` | Remove build artifacts |

Run `make help` or `just help` for the full list of commands.

### Git Hooks

This project uses [lefthook](https://github.com/evilmartians/lefthook) for git hooks.

```bash
# Install lefthook
cargo install lefthook
lefthook install
```

Or simply run `make hooks-install` or `just hooks-install`.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

{{AUTHOR}} <{{AUTHOR_EMAIL}}>

## Placeholder Guide

When using this template, replace the following placeholders:

| Placeholder          | Description                 | Example             |
|----------------------|-----------------------------|---------------------|
| `{{PROJECT_NAME}}`   | Human-readable project name | "My CLI Tool"       |
| `{{CARGO_NAME}}`     | Binary/crate name           | "mytool"            |
| `{{NPM_SCOPE}}`      | npm scope                   | "@dallay"           |
| `{{AUTHOR}}`         | Author name                 | "Yuniel Acosta"     |
| `{{AUTHOR_EMAIL}}`   | Author email                | "email@example.com" |
| `{{REPO_OWNER}}`     | GitHub owner                | "dallay"            |
| `{{REPO_NAME}}`      | Repository name             | "my-tool"           |
| `{{DOCKERHUB_USER}}` | Docker Hub username         | "yacosta738"        |
| `{{DESCRIPTION}}`    | Short description           | "A CLI tool for..." |

The documentation site resolves its tokens at build time from `template.config.json`,
`Cargo.toml`, `npm/cli-template/package.json`, and the `GITHUB_REPOSITORY` environment
variable. The file `template.config.json` holds the three values that cannot be derived
automatically: `projectName`, `author`, and `dockerhubUser`. When building docs locally
with `make docs-build`, the working tree is restored automatically afterwards. If you use
`make docs-dev`, run `make docs-restore` when you are done to restore the template tokens.

## Optional Components

This template includes everything. You can remove components you don't need:

- **npm distribution**: Remove `npm/` directory and `publish-npm-*` jobs from `release.yml`
- **Docker**: Remove `Dockerfile`, `.dockerignore`, and `publish-docker` job from `release.yml`
- **crates.io**: Remove `publish-crates` job from `release.yml`
- **Documentation site**: Remove `web` directory and `deploy-docs.yml` workflow
- **Community workflows**: Remove workflows from `.github/workflows/` that you don't need
