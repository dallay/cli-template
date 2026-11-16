---
title: "CLI Reference"
description: "Complete reference for all {{CARGO_NAME}} commands and flags."
---

This page provides the complete reference for all available commands, subcommands, and flags.

## Synopsis

```bash
{{CARGO_NAME}} [OPTIONS] [COMMAND]
```

## Global Options

| Flag        | Short | Description               |
|-------------|-------|---------------------------|
| `--help`    | `-h`  | Print help information    |
| `--version` | `-V`  | Print version information |

## Commands

### `version`

Display version and system information.

```bash
{{CARGO_NAME}} version
```

**Description:** Prints the package name, version, author, target architecture, and operating
system.

**Example output:**

```
Name: {{CARGO_NAME}}
Version: 0.1.0
Author: {{AUTHOR}}
Target triple: x86_64
OS: macos
```

### `greet`

Greet someone by name.

```bash
{{CARGO_NAME}} greet --name <NAME>
```

**Options:**

| Flag     | Short | Description                 | Required |
|----------|-------|-----------------------------|----------|
| `--name` | `-n`  | Name of the person to greet | Yes      |

**Examples:**

```bash
{{CARGO_NAME}} greet --name "World"
{{CARGO_NAME}} greet -n "Alice"
```

**Output:**

```
Hello, World!
```

## Environment Variables

| Variable   | Description                                                                       | Default |
|------------|-----------------------------------------------------------------------------------|---------|
| `RUST_LOG` | Control the tracing log level. Accepts `trace`, `debug`, `info`, `warn`, `error`. | `info`  |

## Exit Codes

| Code | Description   |
|------|---------------|
| `0`  | Success       |
| `1`  | General error |

## Help Output

Run `{{CARGO_NAME}} --help` to see the auto-generated help:

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
