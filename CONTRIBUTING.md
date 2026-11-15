# Contributing to {{PROJECT_NAME}}

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#report-bugs-using-github-issues)
- [Suggesting Enhancements](#suggest-enhancements-using-github-issues)
- [Your First Code Contribution](#your-first-code-contribution)
- [Improving The Documentation](#improve-the-documentation)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](README.md).

Before you ask a question, it is best to search for existing [Issues](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/issues/new).
- Provide as much context as you can about what you're running into.

## I Want To Contribute

### Legal Matters

When you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.

### Report Bugs using GitHub Issues

If you find a bug, please [open an issue](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/issues/new?template=bug_report.md) with a clear description and steps to reproduce.

### Suggest Enhancements using GitHub Issues

Enhancement suggestions are tracked as [GitHub Issues](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/issues). Feel free to [open an issue](https://github.com/{{REPO_OWNER}}/{{REPO_NAME}}/issues/new?template=feature_request.md) with a clear description of the feature.

### Your First Code Contribution

#### Development Setup

1. Fork the repository
2. Clone your fork locally
3. Install Rust using [rustup](https://rustup.rs/)
4. Install development dependencies:

```bash
cargo build
cargo test
```

#### Make Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes following the existing code style
3. Run tests: `cargo test`
4. Run linters: `cargo clippy -- -D warnings`
5. Format code: `cargo fmt`
6. Commit using [Conventional Commits](https://www.conventionalcommits.org/)

#### Submit a Pull Request

1. Push your changes: `git push origin feature/your-feature-name`
2. Open a Pull Request on GitHub
3. Fill in the PR template with a description of your changes
4. Wait for CI to pass and for a review

### Improve the Documentation

This project follows the same documentation conventions. If you notice any typos or missing information, feel free to submit a pull request with the fix.

## Git Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Use the following prefixes:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `build:` Changes to build configuration
- `ci:` Changes to CI configuration
- `chore:` Other changes
