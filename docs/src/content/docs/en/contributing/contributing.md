---
title: "Contributing"
description: "How to contribute to {{PROJECT_NAME}}."
---

We welcome contributions to **{{PROJECT_NAME}}**! This guide explains how to get started.

## Code of Conduct

This project follows a [Code of Conduct](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/blob/main/CODE_OF_CONDUCT.md). Please read and follow it.

## Development Setup

### Prerequisites

- **Rust 1.70+** (stable)
- **Make** (optional, for convenience commands)
- **lefthook** (for git hooks)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}.git
cd {{REPO_NAME}}

# Full setup (install hooks + build)
make setup

# Run all checks
make check
```

### Build Commands

```bash
# Build debug binary
cargo build

# Build release binary
cargo build --release

# Run the CLI
cargo run -- --help
```

### Lint and Format

```bash
# Format code
cargo fmt --all

# Run Clippy
cargo clippy --all-targets --all-features -- -D warnings
```

### Testing

```bash
# Run all tests
cargo test --all-features

# Run a specific test
cargo test test_name -- --exact
```

## Git Hooks

This project uses [lefthook](https://github.com/evilmartians/lefthook) for pre-commit hooks:

```bash
# Install lefthook
cargo install lefthook
lefthook install
```

## Pull Request Process

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-feature`).
3. Make your changes.
4. Run `make check` to ensure all checks pass.
5. Commit with a descriptive message.
6. Push to your fork and open a Pull Request.

## Reporting Issues

- Use the [GitHub Issues](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/issues) page.
- Include steps to reproduce the issue.
- Include your OS and Rust version.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/blob/main/LICENSE).
