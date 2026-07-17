# 🔐 CyberShield SOC Dashboard

[![CI](https://github.com/Raphasha27/cybershield_soc/actions/workflows/ci.yml/badge.svg)](https://github.com/Raphasha27/cybershield_soc/actions/workflows/ci.yml)

<div align="center">

![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Security](https://img.shields.io/badge/Security-SOC-ff4757?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)

**Real-time Security Operations Center dashboard with threat detection and glassmorphic UI**

[Features](#features) · [Screenshots](#screenshots) · [Quick Start](#quick-start) · [Architecture](#architecture)

</div>

---

## 🎯 Overview

CyberShield SOC is a **Security Operations Center dashboard** designed for real-time threat monitoring, alert triage, and incident management. Built with a premium glassmorphic dark UI, it provides security analysts with an intuitive interface for managing threats across an enterprise environment.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔴 **Real-time Alerts** | Live threat feed with severity classification (Critical/High/Medium/Low) |
| 📊 **Threat Analytics** | Visual dashboards for attack patterns, geolocation, and vector analysis |
| 🗺️ **Attack Map** | Global real-time visualisation of active threat sources |
| 🤖 **AI Triage** | ML-assisted alert categorisation and false-positive reduction |
| 📋 **Incident Management** | Full incident lifecycle — detect, contain, eradicate, recover |
| 🔍 **Log Correlation** | SIEM-style event correlation across multiple data sources |
| 🏷️ **MITRE ATT&CK** | Technique tagging aligned to MITRE ATT&CK framework |
| 💎 **Glassmorphic UI** | Premium dark-mode interface with blur effects and micro-animations |

---

## 🖥️ Screenshots

> *Dark glassmorphic SOC dashboard with real-time threat feeds, alert panels, and analytics charts*

---

## 🚀 Quick Start

```bash
git clone https://github.com/Raphasha27/cybershield_soc.git
cd cybershield_soc

# Install Python backend dependencies
pip install -r requirements.txt

# Start the backend API
python app.py

# Open index.html in browser or use Live Server
open index.html
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           CyberShield SOC UI             │
│   (HTML/CSS/JS — Glassmorphic Dark)      │
└────────────────┬────────────────────────┘
                 │ REST API
┌────────────────▼────────────────────────┐
│         Python FastAPI Backend           │
│  • Threat ingestion & normalisation      │
│  • ML-based anomaly detection            │
│  • Alert correlation engine              │
│  • MITRE ATT&CK mapping                  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Threat Intelligence Sources          │
│  • Simulated SIEM event streams          │
│  • IP reputation feeds                   │
│  • CVE/NVD vulnerability data            │
└─────────────────────────────────────────┘
```

---

## 🗺️ Roadmap

- [ ] WebSocket live alert streaming
- [ ] SOAR playbook automation
- [ ] Elastic Stack (ELK) integration
- [ ] Multi-tenant support
- [ ] Mobile-responsive analyst view

---

## 🤝 Contributing

Issues and PRs are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built by <a href="https://github.com/Raphasha27">Koketso Raphasha</a> · <a href="https://portfolio-iota-eight-90.vercel.app/">Portfolio</a>
</div>
