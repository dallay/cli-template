# Build stage
FROM rust:1-alpine AS builder

RUN apk add --no-cache musl-dev

WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release
RUN rm -rf src

COPY . .
RUN cargo build --release

# Runtime stage
FROM alpine:3.24

RUN apk add --no-cache tini

RUN addgroup -g 1000 -S appgroup && adduser -u 1000 -S appuser -G appgroup

COPY --from=builder /app/target/release/cli-template /usr/local/bin/

USER appuser
ENTRYPOINT ["tini", "--"]
CMD ["cli-template"]
