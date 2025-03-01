# Use a recent Rust image as the builder.
FROM rust:1.85-bullseye as builder
WORKDIR /app

# Copy source code and build in release mode.
COPY . .
RUN cargo build --release

# Use a minimal base image for runtime.
FROM debian:bullseye-slim

# Install CA certificates.
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the built binary from the builder stage.
COPY --from=builder /app/target/release/ai-text-editor-backend /usr/local/bin/ai-text-editor-backend

EXPOSE 8080

CMD ["ai-text-editor-backend"]