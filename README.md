# CyberShield SOC - Security Operations Center

[![CI](https://github.com/Raphasha27/cybershield_soc/actions/workflows/ci.yml/badge.svg)](https://github.com/Raphasha27/cybershield_soc/actions)
[![CodeQL](https://github.com/Raphasha27/cybershield_soc/actions/workflows/security-scan.yml/badge.svg)](https://github.com/Raphasha27/cybershield_soc/actions)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://docker.com)
[![Angular](https://img.shields.io/badge/Angular-19-red)](https://angular.io)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Mission-critical Security Operations Center dashboard with heuristic threat detection and glassmorphic UI. Built for Kirov Dynamics Threat Detection & Response platform.

## Features
- **Real-time Threat Detection** - Heuristic analysis engine
- **SOC Dashboard** - Glassmorphic UI with live metrics
- **Alert Management** - Prioritized security event queue
- **Incident Response** - Automated playbook execution
- **Compliance Reporting** - Audit-ready documentation

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Angular 19, TypeScript, SCSS |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Cache | Redis |
| Container | Docker, Docker Compose |
| Proxy | Nginx |

## Quick Start
```bash
# Development
npm install
npx ng serve

# Production with Docker
docker compose up -d
```

## Security Features
- Input sanitization and validation
- CORS policies configured
- Rate limiting on API endpoints
- Session management with JWT
- Automated dependency scanning via Dependabot

## Architecture
```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│  Angular UI │────▶│  Express API │────▶│PostgreSQL│
│  (Frontend) │     │  (Backend)   │     │ (State)  │
└─────────────┘     └──────────────┘     └──────────┘
       │                    │
       ▼                    ▼
┌─────────────┐     ┌──────────────┐
│   Nginx     │     │    Redis     │
│  (CDN/SSL)  │     │   (Cache)    │
└─────────────┘     └──────────────┘
```
