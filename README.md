# CyberShield - Cybersecurity Incident Management Platform

A full-stack web application for managing security incidents and threats in real-time.

## Project Structure

```
cybershield-modern/
├── src/                          # Angular frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/           # Login component
│   │   │   └── dashboard/       # Dashboard component
│   │   ├── services/
│   │   │   ├── api.service.ts   # API communication
│   │   │   └── auth.service.ts  # Authentication
│   │   ├── guards/
│   │   │   └── auth.guard.ts    # Route protection
│   │   └── app.routes.ts        # Route configuration
│   └── main.ts
├── server/                       # Node.js/Express backend
│   ├── src/
│   │   ├── models/              # MongoDB schemas
│   │   ├── services/            # Business logic
│   │   ├── routes/              # API endpoints
│   │   ├── middleware/          # Auth, validation
│   │   ├── config/              # Database config
│   │   ├── types/               # TypeScript types
│   │   └── index.ts             # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── .kiro/specs/                 # Project specifications
│   └── cybersecurity-incident-platform/
│       ├── requirements.md      # Detailed requirements
│       └── design.md            # Architecture & design
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Run setup script:

```bash
# Windows PowerShell
.\setup.ps1

# Or manually:
npm install
cd server && npm install && cd ..
```

### Configuration

1. Create `.env` file in the `server` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

2. Ensure MongoDB is running locally or update `MONGODB_URI` with your MongoDB Atlas connection string.

### Running the Application

**Terminal 1 - Frontend (Angular):**

```bash
npm start
```

Frontend runs on `http://localhost:4200`

**Terminal 2 - Backend (Node.js/Express):**

```bash
npm run server
```

Backend runs on `http://localhost:3000`

### Default Credentials

After first run, create a user via the register endpoint or use:

```bash
# Login endpoint
POST http://localhost:3000/api/v1/auth/login
{
  "email": "admin@cybershield.com",
  "password": "SecurePassword123!"
}
```

## Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin, Analyst, Viewer)
- Secure password hashing with bcrypt
- Token expiration and refresh

### Incident Management

- Create, read, update, delete incidents
- Filter by status and severity
- Assign incidents to analysts
- Track resolution time
- Audit logging

### Threat Monitoring

- Real-time threat detection
- Threat classification and severity levels
- Investigation tracking
- Related incident linking

### Dashboard

- Real-time metrics and statistics
- Incident overview by status and severity
- Recent incidents and alerts
- Active threat count

### Security Features

- CORS protection
- Rate limiting (100 req/min)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Helmet.js security headers

## API Endpoints

### Authentication

```
POST   /api/v1/auth/login          - User login
POST   /api/v1/auth/logout         - User logout
POST   /api/v1/auth/register       - User registration
```

### Incidents

```
GET    /api/v1/incidents           - List incidents
POST   /api/v1/incidents           - Create incident
GET    /api/v1/incidents/:id       - Get incident details
PUT    /api/v1/incidents/:id       - Update incident
DELETE /api/v1/incidents/:id       - Delete incident
```

### Threats

```
GET    /api/v1/threats             - List threats
GET    /api/v1/threats/:id         - Get threat details
PUT    /api/v1/threats/:id/investigate - Investigate threat
```

### Dashboard

```
GET    /api/v1/dashboard/metrics   - Get dashboard metrics
```

## Technology Stack

### Frontend

- Angular 21
- TypeScript
- RxJS
- Standalone components

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

### Development

- TypeScript
- Jest for testing
- Helmet for security headers
- CORS for cross-origin requests

## Project Specifications

Detailed requirements and design documentation are available in:

- `.kiro/specs/cybersecurity-incident-platform/requirements.md` - Complete requirements
- `.kiro/specs/cybersecurity-incident-platform/design.md` - Architecture and design

## Security Considerations

- All passwords are hashed with bcrypt (10+ salt rounds)
- JWT tokens expire after 24 hours
- Rate limiting prevents brute force attacks
- CORS is configured for localhost development
- Input validation on all endpoints
- Audit logging for compliance

## Development

### Building

```bash
# Frontend
npm run build

# Backend
npm run server:build
```

### Testing

```bash
# Frontend
npm test

# Backend
npm run test --cwd server
```

## Deployment

For production deployment:

1. Update environment variables in `.env`
2. Set `NODE_ENV=production`
3. Use a production MongoDB instance
4. Configure CORS for your domain
5. Use HTTPS/TLS
6. Set strong JWT_SECRET

## License

MIT

## Support

For issues or questions, refer to the specification documents in `.kiro/specs/`.
