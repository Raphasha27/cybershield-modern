# CyberShield SOC – Enterprise Suite

A full-stack **Security Operations Center (SOC)** platform for real-time incident management, threat monitoring, and enterprise vulnerability visibility. Built with Angular and Node.js.

![Dashboard](https://img.shields.io/badge/Dashboard-Enterprise%20Suite-00d4ff?style=flat)
![Angular](https://img.shields.io/badge/Angular-21-dd0031?style=flat&logo=angular)
![Node](https://img.shields.io/badge/Node-18+-339933?style=flat&logo=node.js)

---

## Live Demo

**Live Demo:** After you enable GitHub Pages (see [Deploy to GitHub Pages](#deploy-to-github-pages)), your app will be at:

**`https://<your-github-username>.github.io/cybershield-soc/`**

*(Recommended repository name: **`cybershield-soc`**. Rename your repo to that for a clean URL; the deployment uses the repo name automatically.)*

Use the demo credentials (or any email/password) to open the dashboard; the app uses mock login and sample data.

---

## Overview

CyberShield provides a single pane of glass for security teams to:

- **Monitor** incidents, threats, and network activity in real time  
- **Respond** with role-based access and audit trails  
- **Visualize** metrics, trends, and global vulnerability scans  
- **Scale** with the Enterprise Suite dashboard and AI-assisted insights  

The dashboard features a dark, high-contrast UI with cyan accents, live charts, and an enterprise-grade layout suitable for SOC environments.

---

## Project Structure

```
cybershield-modern/
├── src/                          # Angular frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/            # Login & auth UI
│   │   │   └── dashboard/        # SOC Dashboard (Enterprise Suite)
│   │   ├── services/
│   │   │   ├── api.service.ts    # API communication
│   │   │   ├── auth.service.ts   # Authentication
│   │   │   └── security.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts     # Route protection
│   │   └── app.routes.ts         # Route configuration
│   └── main.ts
├── server/                       # Node.js/Express backend
│   ├── src/
│   │   ├── models/               # MongoDB schemas (User, Incident, Threat, etc.)
│   │   ├── services/             # Business logic
│   │   ├── routes/               # API endpoints (auth, incidents, threats, dashboard)
│   │   ├── middleware/           # Auth, validation
│   │   ├── config/               # Database config
│   │   ├── types/                # TypeScript types
│   │   └── index.ts              # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── .kiro/specs/                  # Project specifications
│   └── cybersecurity-incident-platform/
│       ├── requirements.md
│       └── design.md
├── package.json
└── README.md
```

---

## Dashboard (Enterprise Suite)

The post-login dashboard is a **Real-time Security Operations Center Enterprise Suite** UI with:

### Key metrics (KPI cards)

- **Security Score** – overall score (0–100) with trend and progress bar  
- **Total Incidents** – count and week-over-week trend  
- **Active Threats** – count with “Requires attention” indicator  
- **Servers Online** – e.g. 14/14, “All operational”  
- **Network Activity** – percentage and “Managed loads”  

### Enterprise features (SOC-style)

- **Global search** – filter incidents by ID, type, severity, status, or threats  
- **Auto-refresh** – 30s / 1m / 5m / Paused  
- **Notifications dropdown** – alerts with severity and time  
- **Theme toggle** – dark / light mode (persisted)  
- **Compliance** – PCI-DSS, SOC 2, ISO 27001 status and scores  
- **Activity log** – recent events (firewall, backups, incidents)  
- **Export CSV** – download current incident list  

### Panels

- **AI Threat Prediction** – certainty percentage and short summary (e.g. phishing detection/mitigation)  
- **Speakers Online** – count with Annotation Time and Snooze actions  
- **Upgrade Scope** – CTA to expand capabilities  

### Visualizations

- **Threat Activity Trend** – line chart (Chart.js) with 0–20 scale  
- **Employee & Manager Protection** – Secure, Access, Realtime, Firewall (with alert), Antivirus, Backup  
- **Recent Incidents** – table with ID, Type, Severity, Status, Time, Threats + “View all” link  
- **Live Alerts** – highlighted bar with red bell icon  
- **Enterprise Vulnerability Scan** – world map with highlighted regions and scan points; document scan, database, and MODE ON controls  

### UI/UX

- Dark (default) and light theme with cyan accents  
- Cascading green binary background  
- Staggered entrance animations  
- Footer with “Last updated” and version  
- Focus styles for keyboard accessibility  

---

## Quick Start

### Prerequisites

- **Node.js** 18+  
- **npm** 9+  
- **MongoDB** (local or Atlas)  

### Installation

```bash
# Clone (if applicable)
git clone <repo-url>
cd cybershield-modern

# Install dependencies
npm install
cd server && npm install && cd ..
```

### Configuration

Create a `.env` file in the `server` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

Use your own MongoDB URI (e.g. MongoDB Atlas) and a strong `JWT_SECRET` in production.

### Running the application

**Terminal 1 – Frontend (Angular):**

```bash
npm start
```

Runs at **http://localhost:4200**

**Terminal 2 – Backend (Node.js/Express):**

```bash
npm run server
```

Runs at **http://localhost:3000**

### Default / test credentials

Use your registered user or create one via the API:

```bash
# Example login
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@cybershield.com",
  "password": "SecurePassword123!"
}
```

---

## Features

### Authentication & authorization

- JWT-based authentication  
- Role-based access (Admin, Analyst, Viewer)  
- Bcrypt password hashing  
- Token expiration and refresh  

### Incident management

- Create, read, update, delete incidents  
- Filter by status and severity  
- Assign to analysts  
- Resolution time tracking  
- Audit logging  

### Threat monitoring

- Real-time threat detection  
- Severity and classification  
- Investigation tracking  
- Link to related incidents  

### Dashboard (Enterprise Suite)

- Real-time KPIs and trends  
- Threat activity line chart  
- Employee & manager protection status  
- Recent incidents table with Threats column  
- Live Alerts indicator  
- Enterprise vulnerability scan (world map + controls)  
- AI threat prediction and speakers panels  
- Upgrade Scope CTA  

### Security

- CORS configuration  
- Rate limiting (e.g. 100 req/min)  
- Input validation and sanitization  
- Helmet.js security headers  
- XSS and injection mitigations  

---

## API Endpoints

### Authentication

| Method | Endpoint                     | Description        |
|--------|------------------------------|--------------------|
| POST   | `/api/v1/auth/login`         | User login         |
| POST   | `/api/v1/auth/logout`       | User logout       |
| POST   | `/api/v1/auth/register`     | User registration  |

### Incidents

| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/v1/incidents`       | List incidents       |
| POST   | `/api/v1/incidents`       | Create incident      |
| GET    | `/api/v1/incidents/:id`   | Get incident         |
| PUT    | `/api/v1/incidents/:id`   | Update incident      |
| DELETE | `/api/v1/incidents/:id`   | Delete incident      |

### Threats

| Method | Endpoint                              | Description           |
|--------|---------------------------------------|-----------------------|
| GET    | `/api/v1/threats`                     | List threats          |
| GET    | `/api/v1/threats/:id`                 | Get threat            |
| PUT    | `/api/v1/threats/:id/investigate`    | Investigate threat    |

### Dashboard

| Method | Endpoint                     | Description           |
|--------|------------------------------|-----------------------|
| GET    | `/api/v1/dashboard/metrics`  | Dashboard metrics     |

---

## Technology Stack

| Layer     | Technologies                                      |
|----------|----------------------------------------------------|
| Frontend | Angular 21, TypeScript, RxJS, Chart.js, ng2-charts, standalone components |
| Backend  | Node.js, Express, MongoDB (Mongoose), JWT, bcrypt  |
| Dev      | TypeScript, Vitest, Helmet, CORS                   |

---

## Development

### Build

```bash
# Frontend
npm run build

# Backend
npm run server:build
```

### Tests

```bash
# Frontend
npm test

# Backend (from repo root)
npm run test --prefix server
```

---

## Deploy to GitHub Pages (Live Demo)

The repo includes a workflow that builds the Angular app and deploys it to GitHub Pages.

### One-time setup

1. In your GitHub repo go to **Settings → Pages**.  
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.  
3. Ensure the default branch (e.g. `main`) is the one the workflow uses.

### Deploy

- **Automatic:** Push to `main`; the **Deploy to GitHub Pages** workflow runs and publishes the app.  
- **Manual:** **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

### Live demo URL

After the first successful run, the app is available at:

**`https://<your-github-username>.github.io/cybershield-soc/`**

Use the recommended repo name **`cybershield-soc`** for this URL. The workflow uses your repository name automatically, so after you rename the repo, the next push will deploy with the new name—no code changes needed.

### Local build for GitHub Pages

```bash
npm run build:gh-pages
```

Output is in `dist/cybershield-soc/browser/`. Copy that folder to any static host.

---

## Deployment (production backend)

For production (Node/MongoDB):

1. Set `NODE_ENV=production`.  
2. Use a production MongoDB instance and secure `MONGODB_URI`.  
3. Set a strong, unique `JWT_SECRET`.  
4. Configure CORS for your frontend origin.  
5. Serve the app over **HTTPS/TLS**.  
6. Build the Angular app and serve static assets (e.g. via Express or a CDN).  

---

## Project specifications

Detailed requirements and design:

- `.kiro/specs/cybersecurity-incident-platform/requirements.md`  
- `.kiro/specs/cybersecurity-incident-platform/design.md`  

---

## License

MIT  

---

## Support

For issues or questions, see the specs in `.kiro/specs/` or open an issue in the repository.
