<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,100:00ffcc&height=200&section=header&text=CyberShield%20SOC&fontSize=50&fontColor=ffffff&fontAlignY=40&desc=Mission-Critical%20Security%20Operations%20Center%20Dashboard&descAlignY=65" width="100%"/>

  [![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white&style=for-the-badge)](https://angular.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://typescriptlang.org)
  [![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?logo=chartdotjs&logoColor=white&style=for-the-badge)](https://chartjs.org)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
</div>

## Overview

**CyberShield SOC** is a mission-critical Security Operations Center dashboard built with Angular 21. Features heuristic threat detection, real-time monitoring visualizations, and a glassmorphic UI design system. Designed for SOC analysts to monitor, detect, and respond to security incidents.

## Features

- **Real-Time Threat Dashboard** — Live security event monitoring with Chart.js visualizations
- **Heuristic Detection Engine** — Pattern-based anomaly detection and alerting
- **Incident Management** — Ticket creation, assignment, and resolution tracking
- **Asset Inventory** — Network asset discovery and vulnerability mapping
- **Glassmorphic UI** — Premium dark-mode interface with cyberpunk aesthetic

## Quick Start

```bash
git clone https://github.com/Raphasha27/cybershield_soc.git
cd cybershield_soc
npm install
npm start
```

Navigate to [http://localhost:4200](http://localhost:4200).

## Build

```bash
npm run build
```

The build artifacts are output to the `dist/` directory.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 21, TypeScript 5.9 |
| **Charts** | Chart.js + ng2-charts |
| **Backend** | Node.js (Express) |
| **Container** | Docker & Docker Compose |

## Project Structure

```
cybershield_soc/
├── src/                    # Angular application source
├── server/                 # Node.js backend server
├── public/                 # Static assets
├── angular.json            # Angular CLI configuration
└── docker-compose.yml      # Container orchestration
```

## License

MIT License. See [LICENSE](LICENSE) for details.

---

© 2026 **Kirov Dynamics Technology** | Built by **Koketso Raphasha (Raphasha27)**
