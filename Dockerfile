# Build stage
FROM rust:1-alpine@sha256:2cccd8b212b37dad15a555589c1b6787da4ab913fe24d8a9b2d99d3498869409 AS builder

RUN apk add --no-cache musl-dev

WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release
RUN rm -rf src

COPY . .
RUN cargo build --release

# Runtime stage
FROM alpine:3.24@sha256:f59abe656b692d901e184be3445e084786602108599d2a51d229c0f5a48c71bf

RUN apk add --no-cache tini

RUN addgroup -g 1000 -S appgroup && adduser -u 1000 -S appuser -G appgroup

COPY --from=builder /app/target/release/cli-template /usr/local/bin/

USER appuser
ENTRYPOINT ["tini", "--"]
CMD ["cli-template"]
