# Stage 1: Build
FROM rust:alpine AS builder

RUN apk add --no-cache musl-dev pkgconfig openssl-dev curl

WORKDIR /app

COPY Cargo.toml Cargo.lock* ./
COPY migration/Cargo.toml ./migration/

# キャッシュ用にダミーソースをビルド
RUN mkdir -p src migration/src && \
    echo "fn main() {}" > src/main.rs && \
    echo "pub use sea_orm_migration::prelude::*; pub struct Migrator; #[async_trait::async_trait] impl sea_orm_migration::MigratorTrait for Migrator { fn migrations() -> Vec<Box<dyn sea_orm_migration::MigrationTrait>> { vec![] } }" > migration/src/lib.rs && \
    echo "fn main() {}" > migration/src/main.rs && \
    cargo build --release 2>/dev/null || true

COPY src ./src
COPY migration/src ./migration/src

RUN touch src/main.rs migration/src/lib.rs migration/src/main.rs && \
    cargo build --release

# Stage 2: Runtime
FROM alpine:3.19

RUN apk add --no-cache ca-certificates libgcc

COPY --from=builder /app/target/release/backend /usr/local/bin/backend

EXPOSE 3001

CMD ["backend"]
