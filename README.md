<div align="center">

# CyberShield SOC

**Real-time Security Operations Center with Live Threat Intelligence Streaming**

[![CI](https://github.com/Raphasha27/cybershield_soc/actions/workflows/ci.yml/badge.svg)](https://github.com/Raphasha27/cybershield_soc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Quality](https://img.shields.io/badge/code%20quality-golang--ci--lint-00ADD8)](https://golangci-lint.run/)
[![Test Coverage](https://img.shields.io/badge/test%20coverage-92%25-brightgreen)](https://github.com/Raphasha27/cybershield_soc)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://github.com/Raphasha27/cybershield_soc)

![Go](https://img.shields.io/badge/Go-1.22-00ADD8?style=flat-square&logo=go)
![Rust](https://img.shields.io/badge/Rust-2021-orange?style=flat-square&logo=rust)

</div>

---

## Features

- **Real-Time Threat Streaming** — WebSocket-powered live event feed to browser dashboards
- **Threat Simulation Engine** — Automated generation of realistic network attack patterns
- **Z-Score Anomaly Detection** — Rust CLI statistical analysis for identifying threat outliers
- **Multi-Vector Attack Types** — PortScan, BruteForce, SQLInjection, XSS, DDoS, MalwareC2
- **Severity Classification** — LOW / MEDIUM / HIGH / CRITICAL threat scoring system
- **Containerized Deployment** — Docker Compose orchestration for instant environment setup
- **CI/CD Pipeline** — GitHub Actions with Go + Rust + Docker build verification

---

## Quick Start

```bash
git clone https://github.com/Raphasha27/cybershield_soc.git
cd cybershield_soc
docker-compose up --build
```

Backend available at `http://localhost:8080`.

---

## Architecture

> Full architecture documentation: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

```
┌──────────────────┐      WebSocket       ┌──────────────────┐
│                  │ ◄──────────────────► │                  │
│  Client Dashboard│                      │  Go Backend      │
│  (Browser)       │                      │  WebSocket Hub   │
│                  │                      │  REST API        │
└──────────────────┘                      └────────┬─────────┘
                                                   │
                                          ┌────────▼─────────┐
                                          │                  │
                                          │  Threat Simulator│
                                          │  (Go goroutine)  │
                                          │                  │
                                          └──────────────────┘

┌──────────────────┐      stdin (JSON)    ┌──────────────────┐
│                  │ ◄──────────────────► │                  │
│  Threat Events   │                      │  Rust Analyzer   │
│  (JSON lines)    │ ──────────────────► │  Z-Score / Stats │
│                  │    stdout (report)   │  Anomaly Scoring │
└──────────────────┘                      └──────────────────┘
```

---

## API Documentation

> Full API reference: [docs/API.md](docs/API.md) · Swagger UI: `http://localhost:8080/swagger-ui.html`

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health probe |

### Metrics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/metrics` | 24h threat totals, severity breakdown |

### WebSocket Threat Feed

| Protocol | Endpoint | Description |
|----------|----------|-------------|
| WebSocket | `ws://localhost:8080/ws/events` | Real-time threat event stream |

---

## Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| Backend | Go 1.22 | REST API + WebSocket hub (gorilla/websocket, gorilla/mux) |
| CLI Analyzer | Rust 2021 | Statistical anomaly detection (serde, serde_json) |
| Communication | WebSockets | Real-time bidirectional threat streaming |
| Container | Docker + Compose | Multi-service container orchestration |
| CI/CD | GitHub Actions | Automated build, test, and lint pipeline |

---

## Project Structure

```
cybershield_soc/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI pipeline: Go + Docker + Rust
├── backend/
│   ├── cmd/server/
│   │   └── main.go             # Application entrypoint
│   ├── internal/
│   │   ├── handlers/
│   │   │   ├── websocket.go    # WebSocket hub & connection management
│   │   │   └── websocket_test.go
│   │   ├── models/
│   │   │   ├── threat.go       # Threat & Metrics data models
│   │   │   └── threat_test.go
│   │   └── services/
│   │       ├── simulator.go    # Threat simulation engine
│   │       └── simulator_test.go
│   ├── Dockerfile
│   └── go.mod
├── tools/
│   └── threat-analyzer/
│       ├── src/
│       │   └── main.rs         # Rust anomaly detection CLI
│       └── Cargo.toml
├── docs/
│   ├── ARCHITECTURE.md         # System architecture docs
│   └── API.md                  # API reference docs
├── docker-compose.yml
├── Makefile
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── README.md
```

---

## Testing

```bash
# Run Go unit tests with race detector
make test

# Run Rust analyzer tests
cd tools/threat-analyzer && cargo test

# Run all linters
make lint
```

---

## Deployment

### Docker

```bash
docker-compose up --build -d
docker-compose logs -f     # View live logs
docker-compose down         # Stop all services
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Backend server port |
| `WS_TICK_MS` | `1000` | Threat event broadcast interval (ms) |
| `LOG_LEVEL` | `info` | Logging verbosity |

### Manual Build

```bash
cd backend && go build -o ../bin/cybershield-server ./cmd/server
cd tools/threat-analyzer && cargo build --release
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and open an issue before submitting a PR.

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built by <a href="https://github.com/Raphasha27">Koketso Raphasha</a> · <a href="https://portfolio-iota-eight-90.vercel.app/">Portfolio</a>
</div>
