# CyberShield SOC - Real-Time Security Operations Center

![Go](https://img.shields.io/badge/Go-1.22-00ADD8?style=for-the-badge&logo=go)
![WebSockets](https://img.shields.io/badge/WebSockets-Real%20Time-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A high-performance Security Operations Center (SOC) dashboard built with a **Golang backend** and WebSockets for real-time threat intelligence streaming.

## Features
- **Real-Time Threat Streaming:** WebSocket integration (/ws/events) for pushing live attacks to the dashboard.
- **Threat Simulation Engine:** Built-in Go routine that simulates realistic network attacks (DDoS, SQLi, Brute Force).
- **RESTful Metrics API:** /api/metrics endpoint providing 24h threat aggregates and severity breakdowns.
- **Containerized:** Docker & docker-compose ready.

## Architecture
`
[Browser Dashboard] <--(WebSockets)--> [Go Backend] <--(Internal Channel)--> [Threat Simulator Engine]
`

## Quick Start (Docker)
1. Clone the repository
2. Run docker-compose up --build -d
3. Backend runs on http://localhost:8080

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/metrics | Retrieve SOC metrics and statistics |
| WS | /ws/events | Connect to live threat feed |
