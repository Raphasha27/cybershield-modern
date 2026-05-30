<div align="center">

![CyberShield SOC Banner](https://capsule-render.vercel.app/api?type=waving&color=0:0a0f1e,100:ff0055&height=200&section=header&text=CyberShield%20SOC&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Real-Time%20Security%20Operations%20Center%20Dashboard&descAlignY=58&descSize=18)

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-ff0055?style=for-the-badge)](LICENSE)

</div>

---

## 🛡️ Description

**CyberShield SOC** is a production-grade **Security Operations Center dashboard** built for security analysts who need a single pane of glass across their entire threat landscape. It solves the problem of alert fatigue and fragmented tooling by aggregating real-time threat intelligence, log streams, and incident workflows into one unified, dark-mode-first interface.

Whether you're triaging a ransomware alert at 2 AM or running a post-incident review, CyberShield SOC gives your team the speed and context to act decisively.

> **Live Demo:** [https://cybershield-soc.vercel.app](https://cybershield-soc.vercel.app) *(replace with actual URL)*

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔴 **Real-Time Threat Detection** | Live WebSocket feed of IOCs, anomaly scores, and CVE matches across monitored assets |
| 🎫 **Incident Management** | Full incident lifecycle — open, triage, escalate, resolve — with audit trail |
| 📋 **Log Analysis** | Structured log ingestion with full-text search, filtering, and timeline visualisation |
| 🔗 **SIEM Integration** | Plug-and-play connectors for Splunk, Elastic SIEM, and Microsoft Sentinel |
| 🏢 **Multi-Tenant Architecture** | Isolated workspaces per organisation with RBAC and SSO support |
| 🌑 **Dark Mode First** | Designed for low-light SOC environments; fully accessible colour palette |

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph Client["🖥️ Browser Client"]
        A["Angular 19 SPA\n(Components, Services, NgRx Store)"]
    end

    subgraph API["⚙️ Node.js API Server"]
        B["Express REST API"]
        C["WebSocket Gateway\n(Socket.io)"]
        D["Auth Middleware\n(JWT + RBAC)"]
        B --> D
        C --> D
    end

    subgraph Sources["📡 Event Sources"]
        E["SIEM Connectors\n(Splunk / Elastic / Sentinel)"]
        F["Log Streams\n(Syslog / CloudWatch)"]
        G["Threat Intel Feeds\n(IOC / CVE / OSINT)"]
    end

    subgraph Data["🗄️ Data Layer"]
        H[("PostgreSQL\nIncidents & Audit")]
        I[("Redis\nSessions & Cache")]
    end

    A -- "HTTP / REST" --> B
    A -- "WS" --> C
    B --> H
    B --> I
    C --> I
    E --> C
    F --> C
    G --> B
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Angular CLI: `npm install -g @angular/cli`

### 1. Clone & Install

```bash
git clone https://github.com/your-org/cybershield-soc.git
cd cybershield-soc

# Install all dependencies (root + server)
npm install
cd server && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values (see Environment Variables table below)
```

### 3. Start the Backend

```bash
node server/index.js
# API available at http://localhost:3000
```

### 4. Start the Angular Frontend

```bash
npm start
# App available at http://localhost:4200
```

### 5. Build for Production

```bash
npm run build
# Output: dist/cybershield-soc/browser/
```

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Port the Node.js API server listens on |
| `JWT_SECRET` | **Yes** | — | Secret key used to sign and verify JWT tokens |
| `DB_CONNECTION_STRING` | **Yes** | — | PostgreSQL connection URI (e.g. `postgresql://user:pass@host:5432/dbname`) |
| `SIEM_API_KEY` | **Yes** | — | API key for the SIEM integration (Splunk / Elastic / Sentinel) |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection URL for session caching |
| `NODE_ENV` | No | `development` | Set to `production` for production deployments |

> ⚠️ **Never commit `.env` to source control.** Use your CI/CD provider's secret store for production values.

---

## 🗺️ Roadmap

- [x] Real-time threat feed via WebSocket
- [x] Incident creation, triage, and resolution workflow
- [x] Structured log ingestion and search
- [x] JWT authentication with role-based access control
- [x] Dark mode UI
- [ ] Mobile-responsive SOC view for on-call engineers
- [ ] AI-assisted alert triage (LLM summarisation of incident context)
- [ ] SOAR playbook automation engine
- [ ] Threat hunting query builder (KQL / SPL)
- [ ] Exportable PDF incident reports
- [ ] Two-factor authentication (TOTP / WebAuthn)
- [ ] Public API with OpenAPI 3.1 spec

---

## 📁 Project Structure

```
cybershield-soc/
├── src/                    # Angular application source
│   ├── app/
│   │   ├── core/           # Auth, guards, interceptors
│   │   ├── features/       # Dashboard, Incidents, Logs, Threats
│   │   ├── shared/         # Reusable components & pipes
│   │   └── store/          # NgRx state management
│   ├── assets/
│   └── environments/
├── server/                 # Node.js API backend
│   ├── index.js            # Entry point
│   ├── routes/             # REST endpoints
│   ├── middleware/         # Auth, rate-limiting
│   └── services/           # SIEM connectors, log parsers
├── nginx.conf              # Production Nginx configuration
├── vercel.json             # Vercel deployment config + security headers
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) and ensure all tests pass before submitting.

---

## 📄 License & Author

**MIT License** — see [LICENSE](LICENSE) for full text.

<div align="center">

Built with ❤️ by **Koketso Raphasha**

© 2026 **Kirov Dynamics Technology** — All rights reserved.

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:ff0055,100:0a0f1e&height=100&section=footer)

</div>
