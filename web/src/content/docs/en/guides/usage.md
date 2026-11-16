---
title: "Usage"
description: "Learn how to use {{CARGO_NAME}} commands and options."
---

This page covers the available commands and their usage patterns.

## Command Structure

{{CARGO_NAME}} uses a subcommand-based structure:

```bash
{{CARGO_NAME}} <COMMAND> [OPTIONS]
```

## Available Commands

### `version`

Display version and system information:

```bash
{{CARGO_NAME}} version
```

**Output:**

```
Name: {{CARGO_NAME}}
Version: 0.1.0
Author: {{AUTHOR}}
Target triple: x86_64
OS: macos
```

### `greet`

Greet someone by name:

```bash
{{CARGO_NAME}} greet --name "World"
```

**Options:**

| Flag     | Short | Description                 | Required |
|----------|-------|-----------------------------|----------|
| `--name` | `-n`  | Name of the person to greet | Yes      |

**Output:**

```
Hello, World!
```

## Global Options

| Flag        | Short | Description               |
|-------------|-------|---------------------------|
| `--help`    | `-h`  | Print help information    |
| `--version` | `-V`  | Print version information |

## Environment Variables

| Variable   | Description               | Default |
|------------|---------------------------|---------|
| `RUST_LOG` | Control tracing log level | `info`  |

Example:

```bash
RUST_LOG=debug {{CARGO_NAME}} greet --name "World"
```

## Exit Codes

| Code | Description   |
|------|---------------|
| `0`  | Success       |
| `1`  | General error |

## Tips

- Use `{{CARGO_NAME}} --help` to see all available commands.
- Use `{{CARGO_NAME}} <command> --help` for command-specific help.
- Set `RUST_LOG=debug` for verbose output during troubleshooting.
