[![CI](https://github.com/Raphasha27/cybershield_soc/actions/workflows/ci.yml/badge.svg)](https://github.com/Raphasha27/cybershield_soc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# CyberShield SOC

### Real-time Security Operations Center with Threat Intelligence

![Go](https://img.shields.io/badge/Go-1.22-00ADD8?style=flat-square&logo=go)
![Rust](https://img.shields.io/badge/Rust-2021-orange?style=flat-square&logo=rust)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

---

## Overview

CyberShield SOC is a real-time Security Operations Center that streams live threat intelligence to a browser dashboard via WebSockets. A Go backend simulates and broadcasts network attack events, while a companion Rust CLI tool performs statistical anomaly detection on threat data using z-score analysis. The entire system is containerized and CI-tested.

## Architecture

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

## Tech Stack

| Component     | Technology                        |
|---------------|-----------------------------------|
| Backend       | Go 1.22, gorilla/websocket, gorilla/mux |
| CLI Analyzer  | Rust 2021, serde, serde_json       |
| Communication | WebSockets (real-time), REST (metrics) |
| Container     | Docker, docker-compose             |
| CI/CD         | GitHub Actions                     |

## Quick Start

### Docker

```bash
git clone https://github.com/Raphasha27/cybershield_soc.git
cd cybershield_soc
docker-compose up --build
```

Backend available at `http://localhost:8080`.

### Manual Build

**Go backend:**

```bash
cd backend
go mod download
go build -o ../bin/cybershield-server ./cmd/server
../bin/cybershield-server
```

**Rust analyzer:**

```bash
cd tools/threat-analyzer
cargo build --release
echo '{"id":"THR-1","type":"DDoS","severity":"HIGH","source_ip":"10.0.0.1","timestamp":"2024-01-01T00:00:00Z","status":"ACTIVE"}' | cargo run
```

### Using Make

```bash
make lint       # Run go vet
make test       # Run tests with race detector
make build      # Build Go binary
make docker-build  # Build Docker image
make clean      # Remove build artifacts
```

## Directory Structure

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
├── docker-compose.yml
├── Makefile
└── README.md
```

## API Reference

### Health Check

```
GET /api/health
Response: {"status": "ok"}
```

### Metrics

```
GET /api/metrics
Response: {
  "total_threats_24h": 1247,
  "active_alerts": 23,
  "blocked_ips": 89,
  "severity_breakdown": {
    "CRITICAL": 3,
    "HIGH": 12,
    "MEDIUM": 45,
    "LOW": 187
  }
}
```

### WebSocket Threat Feed

```
WebSocket: ws://localhost:8080/ws/events
```

Connect to receive real-time threat events as JSON:

```json
{
  "id": "THR-1718450400000000000",
  "type": "DDoS",
  "severity": "HIGH",
  "source_ip": "192.168.1.105",
  "timestamp": "2024-06-15T12:00:00Z",
  "status": "ACTIVE"
}
```

**Event Types:** `PortScan`, `BruteForce`, `SQLInjection`, `XSS`, `DDoS`, `MalwareC2`

**Severity Levels:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

## License

MIT

<!-- 2026-08-31 17:04:18 -->
