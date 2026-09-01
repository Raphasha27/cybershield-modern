# CyberShield SOC — Architecture

## System Overview

CyberShield SOC is a real-time Security Operations Center that streams live threat intelligence to a browser-based dashboard via WebSockets. A Go backend simulates and broadcasts network attack events, while a companion Rust CLI tool performs statistical anomaly detection on threat data using z-score analysis. The system is containerized with Docker and CI-tested with GitHub Actions.

## Architecture Diagram

```
┌──────────────────────┐    WebSocket     ┌──────────────────────┐
│   Browser Dashboard  │◄───────────────►│   Go Backend         │
│   (HTML/JS SPA)      │                 │   WebSocket Hub      │
│                      │    REST API     │   gorilla/mux Router │
└──────────────────────┘◄───────────────►│   CORS Middleware    │
                                         └──────────┬───────────┘
                                                    │
                                         ┌──────────▼───────────┐
                                         │   Threat Simulator   │
                                         │   (Go goroutine)     │
                                         │   Random event gen   │
                                         └──────────────────────┘

┌──────────────────────┐   stdin (JSON)  ┌──────────────────────┐
│   Threat Events      │◄───────────────│   Rust Analyzer      │
│   (JSON lines)       │───────────────►│   Z-Score Detection  │
│                      │  stdout (report)│   Statistical Stats  │
└──────────────────────┘                └──────────────────────┘
```

## Technology Stack

| Component      | Technology                                    | Version |
|----------------|-----------------------------------------------|---------|
| Backend        | Go                                            | 1.22    |
| HTTP Router    | gorilla/mux                                   | 1.8.1   |
| WebSocket      | gorilla/websocket                             | 1.5.3   |
| CORS           | rs/cors                                       | 1.11.1  |
| CLI Analyzer   | Rust                                          | 2021    |
| Serialization  | serde, serde_json                             | —       |
| Container      | Docker, docker-compose                        | 3.9     |
| CI/CD          | GitHub Actions                                | —       |
| Linting        | go vet, cargo clippy                          | —       |

## Directory Structure

```
cybershield_soc/
├── .github/workflows/ci.yml        # CI: Go test + Docker build + Rust check
├── backend/
│   ├── cmd/server/main.go           # Application entrypoint
│   ├── internal/
│   │   ├── handlers/
│   │   │   ├── websocket.go         # WebSocket hub, connection management
│   │   │   └── websocket_test.go
│   │   ├── models/
│   │   │   ├── threat.go            # Threat, Metrics data models
│   │   │   └── threat_test.go
│   │   └── services/
│   │       ├── simulator.go         # Threat simulation engine (goroutine)
│   │       └── simulator_test.go
│   ├── Dockerfile                   # Multi-stage Go build
│   └── go.mod
├── frontend/
│   └── index.html                   # Static SPA dashboard
├── tools/
│   └── threat-analyzer/
│       ├── src/main.rs              # Rust z-score anomaly detector
│       └── Cargo.toml
├── docker-compose.yml               # Service orchestration
├── Makefile                         # Build, lint, test targets
└── README.md
```

## Data Flow

1. **Threat Generation**: A Go goroutine (`simulator.go`) continuously generates synthetic threat events (PortScan, BruteForce, SQLInjection, XSS, DDoS, MalwareC2) with randomized severity levels (LOW → CRITICAL).

2. **WebSocket Broadcast**: The simulator pushes events to the WebSocket hub, which fans out to all connected browser clients in real-time.

3. **REST Metrics**: The `/api/metrics` endpoint aggregates 24-hour threat counts, active alerts, blocked IPs, and severity breakdowns.

4. **Offline Analysis**: The Rust CLI reads JSON-lines threat data from stdin, computes z-scores for anomaly detection, and outputs a statistical report to stdout.

5. **Persistence**: Optional SQLite database for historical threat storage (configured via `DATABASE_URL`).

## Security

- **CORS**: Configured via `rs/cors` middleware — restrict origins in production.
- **WebSocket Authentication**: No auth on WS endpoint by default; add token-based auth for production deployments.
- **No secrets in code**: Environment variables used for `DATABASE_URL` and configuration.
- **Container isolation**: Backend runs as non-root in Docker; ports only exposed internally.
- **Rate limiting**: Not implemented — add reverse proxy (nginx/Caddy) for rate limiting in production.

## Deployment

### Docker (Recommended)

```bash
docker-compose up --build
```

Backend available at `http://localhost:8080`. WebSocket endpoint at `ws://localhost:8080/ws/events`.

### Manual Build

```bash
# Go backend
cd backend && go build -o ../bin/cybershield-server ./cmd/server
../bin/cybershield-server

# Rust analyzer
cd tools/threat-analyzer && cargo build --release
```

### Make Targets

| Target         | Description                          |
|----------------|--------------------------------------|
| `make lint`    | Run go vet on backend                |
| `make test`    | Run tests with race detector         |
| `make build`   | Build Go binary                      |
| `make docker-build` | Build Docker image              |
| `make clean`   | Remove build artifacts               |

## Scaling Considerations

- **Horizontal scaling**: Deploy multiple Go backend instances behind a load balancer; use Redis pub/sub to share WebSocket broadcasts across instances.
- **Event volume**: The simulator generates events at a fixed interval — increase goroutine count or batch events for higher throughput.
- **Database**: SQLite is suitable for single-instance; migrate to PostgreSQL for multi-instance deployments.
- **Rust analyzer**: Stateless CLI — parallelize across multiple cores by splitting input data into chunks.
- **Frontend**: Static files can be served from a CDN; WebSocket connections are stateful and require sticky sessions or shared broadcast layer.

## Decision Records

| Decision | Rationale |
|----------|-----------|
| Go for backend | Goroutines provide lightweight concurrency for WebSocket hub fan-out; gorilla/websocket is the mature Go WebSocket library |
| Rust for CLI | Memory safety without GC overhead; serde provides zero-copy JSON parsing for high-throughput threat data processing |
| SQLite default | Zero-config embedded database for demo/development; PostgreSQL for production |
| WebSocket over SSE | Bidirectional communication needed for future client → server commands; SSE is one-way only |
| Static SPA frontend | No build toolchain required; single index.html with vanilla JS reduces complexity for demo |
| docker-compose 3.9 | Latest stable compose spec; supports health checks and dependency ordering |
