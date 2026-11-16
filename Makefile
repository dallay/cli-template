SHELL := /usr/bin/env bash

# Project name (change to match your binary)
BINARY := cli-template

# Tools
CARGO := cargo
DOCKER := docker

.PHONY: help all setup build release test lint clippy fmt check clean \
        docker-build docker-run docker-clean run hooks-install \
        docs-dev docs-build docs-preview

help:
	@echo "Makefile for {{PROJECT_NAME}}"
	@echo ""
	@echo "Targets:"
	@echo "  make setup           -> install dev dependencies, hooks, and docs symlink"
	@echo "  make build           -> cargo build (debug)"
	@echo "  make release         -> cargo build --release (optimized)"
	@echo "  make run             -> cargo run"
	@echo "  make test            -> cargo test"
	@echo "  make lint            -> cargo clippy (strict, no warnings)"
	@echo "  make clippy          -> same as lint"
	@echo "  make fmt             -> cargo fmt (format all files)"
	@echo "  make check           -> fmt --check + clippy + test (full CI locally)"
	@echo "  make docker-build    -> build Docker image"
	@echo "  make docker-run      -> run Docker container"
	@echo "  make docker-clean    -> remove Docker image"
	@echo "  make hooks-install   -> install lefthook git hooks"
	@echo "  make docs-link       -> create symlink to docs content"
	@echo "  make docs-dev        -> start docs dev server (Starlight)"
	@echo "  make docs-build      -> build docs site"
	@echo "  make docs-preview    -> preview built docs site"
	@echo "  make clean           -> remove target/ and build artifacts"
	@echo ""
	@echo "Examples:"
	@echo "  make setup"
	@echo "  make check"
	@echo "  make release"

all: setup build

## — Setup —

setup: hooks-install docs-link
	@echo "Setup complete."

hooks-install:
	@echo "Installing lefthook git hooks..."
	@if command -v lefthook >/dev/null 2>&1; then \
		lefthook install; \
	else \
		echo "lefthook not found. Install with: cargo install lefthook"; \
	fi

docs-link:
	@echo "Creating docs symlink..."
	@if [ -d "docs/src/content/docs" ]; then \
		if [ -L "docs-link" ] || [ -d "docs-link" ]; then \
			rm -rf docs-link; \
		fi; \
		ln -s docs/src/content/docs docs-link && echo "✅ docs-link -> docs/src/content/docs"; \
	else \
		echo "⚠️  docs/src/content/docs not found, skipping symlink"; \
	fi

## — Build —

build:
	@echo "Building (debug)..."
	$(CARGO) build

release:
	@echo "Building (release, optimized)..."
	$(CARGO) build --release

run:
	@echo "Running..."
	$(CARGO) run

## — Quality —

test:
	@echo "Running tests..."
	$(CARGO) test

lint: clippy

clippy:
	@echo "Running clippy (strict)..."
	$(CARGO) clippy --all-targets --all-features -- -D warnings

fmt:
	@echo "Formatting code..."
	$(CARGO) fmt --all

check: fmt lint test
	@echo ""
	@echo "✅ All checks passed!"

## — Docker —

docker-build:
	@echo "Building Docker image..."
	$(DOCKER) build -t $(BINARY):latest .

docker-run:
	@echo "Running Docker container..."
	$(DOCKER) run --rm $(BINARY):latest

docker-clean:
	@echo "Removing Docker image..."
	-$(DOCKER) rmi $(BINARY):latest 2>/dev/null || true

## — Docs —

docs-dev:
	@echo "Starting docs dev server..."
	cd docs && npm install && npm run dev

docs-build:
	@echo "Building docs site..."
	cd docs && npm install && npm run build

docs-preview:
	@echo "Previewing docs site..."
	cd docs && npm install && npm run preview

## — Cleanup —

clean:
	@echo "Cleaning artifacts..."
	$(CARGO) clean
	@echo "Done."
