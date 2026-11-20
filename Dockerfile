# Build stage
FROM rust:1-alpine@sha256:8d0e82abfdf9a38071e07cabc5afba4ddbe077631a80e4e742a760c38beadc33 AS builder

RUN apk add --no-cache musl-dev=1.2.6-r3

WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
COPY src ./src
RUN cargo build --release --locked

# Runtime stage
FROM alpine:3.24@sha256:f59abe656b692d901e184be3445e084786602108599d2a51d229c0f5a48c71bf

RUN apk add --no-cache tini=0.19.0-r3 && \
    addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

COPY --from=builder /app/target/release/cli-template /usr/local/bin/

USER appuser
ENTRYPOINT ["tini", "--"]
CMD ["cli-template"]
