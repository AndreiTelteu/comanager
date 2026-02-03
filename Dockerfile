FROM oven/bun:1 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ ./
RUN bun run build

FROM golang:1.25 AS backend
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
COPY --from=frontend /app/internal/embed/frontend/dist ./internal/embed/frontend/dist
RUN go build -o /app/bin/server ./cmd/server

FROM ubuntu:22.04
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV LISTEN_HOST=0.0.0.0
ENV LISTEN_PORT=8080
COPY --from=backend /app/bin/server /app/server
RUN mkdir -p /app/data /app/projects
EXPOSE 8080
CMD ["/app/server"]
