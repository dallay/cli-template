SHELL := /usr/bin/env bash

# Project name (change to match your binary)
BINARY := cli-template

# Tools
CARGO := cargo
DOCKER := docker

# Repository slug (owner/name) used to resolve the documentation placeholders.
# Override it with `make docs-build REPO_SLUG=owner/name` when there is no
# usable "origin" remote.
ORIGIN_URL := $(shell git remote get-url origin 2>/dev/null)
REPO_SLUG ?= $(patsubst %.git,%,$(patsubst git@github.com:%,%,$(patsubst https://github.com/%,%,$(ORIGIN_URL))))

.PHONY: help all setup build release test lint clippy fmt check clean \
        docker-build docker-run docker-clean run hooks-install \
        docs-dev docs-build docs-preview docs-restore

help:
	@echo "Makefile for {{PROJECT_NAME}}"
	@echo ""
	@echo "Targets:"
	@echo "  make setup           -> install dev dependencies and hooks"
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
	@echo "  make docs-dev        -> start docs dev server (resolves placeholders)"
	@echo "  make docs-build      -> build docs site (resolves then restores)"
	@echo "  make docs-preview    -> preview built docs site"
	@echo "  make docs-restore    -> restore template tokens after docs-dev"
	@echo "  make clean           -> remove target/ and build artifacts"
	@echo ""
	@echo "Examples:"
	@echo "  make setup"
	@echo "  make check"
	@echo "  make release"

all: setup build

## — Setup —

setup: hooks-install
	@echo "Setup complete."

hooks-install:
	@echo "Installing lefthook git hooks..."
	@if command -v lefthook >/dev/null 2>&1; then \
		lefthook install; \
	else \
		echo "lefthook not found. Install with: cargo install lefthook"; \
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
	@echo "Starting docs dev server (resolving placeholders)..."
	@test -n "$(REPO_SLUG)" || { echo "Cannot resolve the repository slug from the 'origin' remote. Use: make docs-dev REPO_SLUG=owner/name"; exit 1; }
	cd web && npm ci && GITHUB_REPOSITORY=$(REPO_SLUG) node scripts/resolve-placeholders.mjs && npm run dev
	@echo ""
	@echo "When done, run: make docs-restore"

docs-build:
	@echo "Building docs site..."
	@test -n "$(REPO_SLUG)" || { echo "Cannot resolve the repository slug from the 'origin' remote. Use: make docs-build REPO_SLUG=owner/name"; exit 1; }
	cd web && npm ci && GITHUB_REPOSITORY=$(REPO_SLUG) node scripts/resolve-placeholders.mjs && \
		{ npm run build; status=$$?; node scripts/resolve-placeholders.mjs --restore; exit $$status; }

docs-preview:
	@echo "Previewing docs site..."
	cd web && npm run preview

docs-restore:
	@echo "Restoring template tokens..."
	cd web && node scripts/resolve-placeholders.mjs --restore

## — Cleanup —

clean:
	@echo "Cleaning artifacts..."
	$(CARGO) clean
	@echo "Done."
