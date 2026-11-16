# Project name (change to match your binary)
BINARY := "cli-template"

help:
    @echo "Justfile for cli-template"
    @echo ""
    @echo "Targets:"
    @echo "  just setup           -> install dev dependencies, hooks, and docs symlink"
    @echo "  just build           -> cargo build (debug)"
    @echo "  just release         -> cargo build --release (optimized)"
    @echo "  just run             -> cargo run"
    @echo "  just test            -> cargo test"
    @echo "  just lint            -> cargo clippy (strict, no warnings)"
    @echo "  just fmt             -> cargo fmt (format all files)"
    @echo "  just check           -> fmt --check + clippy + test (full CI locally)"
    @echo "  just docker-build    -> build Docker image"
    @echo "  just docker-run      -> run Docker container"
    @echo "  just docker-clean    -> remove Docker image"
    @echo "  just hooks-install   -> install lefthook git hooks"
    @echo "  just docs       -> create symlink to docs content"
    @echo "  just clean           -> remove target/ and build artifacts"
    @echo ""
    @echo "Examples:"
    @echo "  just setup"
    @echo "  just check"
    @echo "  just release"

## — Setup —

setup: hooks-install docs
    @echo "Setup complete."

hooks-install:
    @echo "Installing lefthook git hooks..."
    @if command -v lefthook >/dev/null 2>&1; then lefthook install; else echo "lefthook not found. Install with: cargo install lefthook"; fi

docs:
    @echo "Creating docs symlink..."
    @if [ -d "docs/src/content/docs" ]; then \
        if [ -L "docs" ] || [ -d "docs" ]; then \
            rm -rf docs; \
        fi; \
        ln -s docs/src/content/docs docs && echo "✅ docs -> docs/src/content/docs"; \
    else \
        echo "⚠️  docs/src/content/docs not found, skipping symlink"; \
    fi

## — Build —

build:
    @echo "Building (debug)..."
    cargo build

release:
    @echo "Building (release, optimized)..."
    cargo build --release

run:
    @echo "Running..."
    cargo run

## — Quality —

test:
    @echo "Running tests..."
    cargo test

lint:
    @echo "Running clippy (strict)..."
    cargo clippy --all-targets --all-features -- -D warnings

fmt:
    @echo "Formatting code..."
    cargo fmt --all

check: fmt lint test
    @echo ""
    @echo "✅ All checks passed!"

## — Docker —

docker-build:
    @echo "Building Docker image..."
    docker build -t {{ BINARY }}:latest .

docker-run:
    @echo "Running Docker container..."
    docker run --rm {{ BINARY }}:latest

docker-clean:
    @echo "Removing Docker image..."
    -docker rmi {{ BINARY }}:latest 2>/dev/null || true

## — Cleanup —

clean:
    @echo "Cleaning artifacts..."
    cargo clean
    @echo "Done."
