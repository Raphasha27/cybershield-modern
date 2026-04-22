# CyberShield Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                    (http://localhost:4200)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                    ANGULAR FRONTEND (Port 4200)                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Login Component │  │ Dashboard Comp   │  │ Auth Guard   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  API Service     │  │  Auth Service    │                    │
│  │  (HTTP Client)   │  │  (Session Mgmt)  │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
                    (Authorization: Bearer <JWT>)
┌─────────────────────────────────────────────────────────────────┐
│                  EXPRESS.JS API (Port 3000)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              MIDDLEWARE LAYER                            │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │  │
│  │  │ CORS Handler │ │ Rate Limiter │ │ Auth Checker │    │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ROUTE HANDLERS                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ /auth    │ │/incidents│ │ /threats │ │/dashboard│   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SERVICE LAYER                               │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │  │
│  │  │ AuthService  │ │IncidentSvc   │ │ ThreatSvc    │    │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘    │  │
│  │  ┌──────────────┐ ┌──────────────┐                      │  │
│  │  │DashboardSvc  │ │ AuditService │                      │  │
│  │  └──────────────┘ └──────────────┘                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              DATA ACCESS LAYER                           │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │  │
│  │  │ UserModel    │ │IncidentModel │ │ ThreatModel  │    │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘    │  │
│  │  ┌──────────────┐ ┌──────────────┐                      │  │
│  │  │ AlertModel   │ │ AuditLogModel│                      │  │
│  │  └──────────────┘ └──────────────┘                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ MongoDB Protocol
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ users        │ │ incidents    │ │ threats      │            │
│  │ collection   │ │ collection   │ │ collection   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│  ┌──────────────┐ ┌──────────────┐                             │
│  │ alerts       │ │ audit_logs   │                             │
│  │ collection   │ │ collection   │                             │
│  └──────────────┘ └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

```
User Input (Email/Password)
         ↓
   Login Component
         ↓
   API Service (POST /auth/login)
         ↓
   Express Route Handler
         ↓
   Auth Service
         ↓
   MongoDB (User lookup)
         ↓
   Bcrypt Password Comparison
         ↓
   JWT Token Generation
         ↓
   Response with Token
         ↓
   Auth Service (Store token)
         ↓
   Dashboard Component
```

### Incident Creation Flow

```
User Input (Title, Description, etc.)
         ↓
   Dashboard Component
         ↓
   API Service (POST /incidents)
         ↓
   Auth Middleware (Verify JWT)
         ↓
   Authorization Middleware (Check Role)
         ↓
   Express Route Handler
         ↓
   Incident Service
         ↓
   MongoDB (Save Incident)
         ↓
   Alert Service (Generate Alert if Critical)
         ↓
   Audit Logger (Log Action)
         ↓
   Response with Incident ID
         ↓
   Dashboard Updates
```

### Dashboard Metrics Flow

```
User Requests Dashboard
         ↓
   Dashboard Component (ngOnInit)
         ↓
   API Service (GET /dashboard/metrics)
         ↓
   Auth Middleware (Verify JWT)
         ↓
   Express Route Handler
         ↓
   Dashboard Service
         ↓
   MongoDB Queries (Parallel)
         ├─ Count incidents by status
         ├─ Count incidents by severity
         ├─ Count active threats
         ├─ Get recent incidents
         └─ Get recent alerts
         ↓
   Aggregate Results
         ↓
   Response with Metrics
         ↓
   Dashboard Component (Display)
```

## Component Interaction

### Frontend Components

```
AppComponent (Root)
    ↓
    ├─ RouterOutlet
    │   ├─ LoginComponent
    │   │   ├─ AuthService
    │   │   └─ ApiService
    │   │
    │   └─ DashboardComponent
    │       ├─ AuthService
    │       ├─ ApiService
    │       └─ AuthGuard (Protection)
    │
    └─ Services
        ├─ AuthService
        │   └─ ApiService
        └─ ApiService
            └─ HttpClient
```

### Backend Services

```
Express App
    ↓
    ├─ Middleware
    │   ├─ CORS
    │   ├─ Rate Limiter
    │   ├─ Helmet
    │   └─ Auth Middleware
    │
    ├─ Routes
    │   ├─ /auth
    │   │   └─ AuthService
    │   ├─ /incidents
    │   │   ├─ IncidentService
    │   │   ├─ AuditService
    │   │   └─ AlertService
    │   ├─ /threats
    │   │   └─ ThreatService
    │   └─ /dashboard
    │       └─ DashboardService
    │
    └─ Database
        ├─ User Model
        ├─ Incident Model
        ├─ Threat Model
        ├─ Alert Model
        └─ AuditLog Model
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: HTTPS/TLS (Production)                           │
│  ├─ Encrypts data in transit                               │
│  └─ Prevents man-in-the-middle attacks                     │
│                                                              │
│  Layer 2: CORS & Helmet                                    │
│  ├─ Restricts cross-origin requests                        │
│  └─ Sets security headers                                  │
│                                                              │
│  Layer 3: Rate Limiting                                    │
│  ├─ Prevents brute force attacks                           │
│  └─ Limits requests per IP/user                            │
│                                                              │
│  Layer 4: Authentication (JWT)                             │
│  ├─ Verifies user identity                                 │
│  ├─ Token expiration (24 hours)                            │
│  └─ Secure token signing (HS256)                           │
│                                                              │
│  Layer 5: Authorization (RBAC)                             │
│  ├─ Role-based access control                              │
│  ├─ Admin, Analyst, Viewer roles                           │
│  └─ Resource-level permissions                             │
│                                                              │
│  Layer 6: Input Validation                                 │
│  ├─ Sanitizes user input                                   │
│  ├─ Prevents SQL injection                                 │
│  └─ Prevents XSS attacks                                   │
│                                                              │
│  Layer 7: Password Security                                │
│  ├─ Bcrypt hashing (10+ salt rounds)                       │
│  ├─ Constant-time comparison                               │
│  └─ Minimum 12 characters required                         │
│                                                              │
│  Layer 8: Audit Logging                                    │
│  ├─ Logs all user actions                                  │
│  ├─ Tracks changes and access                              │
│  └─ Enables forensic analysis                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Users Collection
```
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  passwordHash: String (bcrypt),
  role: String (Admin|Analyst|Viewer),
  status: String (Active|Disabled|Deleted),
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  deletedAt: Date
}
```

### Incidents Collection
```
{
  _id: ObjectId,
  title: String,
  description: String,
  severity: String (Critical|High|Medium|Low|Info),
  status: String (Open|In Progress|Resolved|Closed),
  type: String,
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date,
  closedAt: Date,
  tags: [String]
}
```

### Threats Collection
```
{
  _id: ObjectId,
  classification: String,
  description: String,
  severity: String (Critical|High|Medium|Low|Info),
  status: String (Active|Investigated|Resolved),
  detectedAt: Date,
  detectionSource: String,
  investigatedAt: Date,
  investigatedBy: ObjectId (ref: User),
  investigationNotes: String,
  relatedIncidents: [ObjectId] (ref: Incident),
  createdAt: Date,
  updatedAt: Date
}
```

### Alerts Collection
```
{
  _id: ObjectId,
  type: String (Incident|Threat|System),
  title: String,
  message: String,
  severity: String (Critical|High|Medium|Low|Info),
  recipientId: ObjectId (ref: User),
  relatedResourceId: ObjectId,
  isRead: Boolean,
  isArchived: Boolean,
  createdAt: Date,
  readAt: Date,
  archivedAt: Date
}
```

### AuditLogs Collection
```
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  action: String,
  resourceType: String,
  resourceId: ObjectId,
  previousValues: Object,
  newValues: Object,
  ipAddress: String,
  userAgent: String,
  status: String (Success|Failure),
  errorMessage: String,
  createdAt: Date
}
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              LOAD BALANCER (NGINX)                   │  │
│  │              (HTTPS/TLS Termination)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                    ↓                    ↓                    │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │  FRONTEND (CDN)          │  │  BACKEND CLUSTER         │ │
│  │  ├─ Static Assets        │  │  ├─ Node.js Instance 1   │ │
│  │  ├─ Angular App          │  │  ├─ Node.js Instance 2   │ │
│  │  └─ Cached Content       │  │  └─ Node.js Instance N   │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                         ↓                    │
│                  ┌──────────────────────────────────────┐   │
│                  │  MONGODB CLUSTER (Replica Set)      │   │
│                  │  ├─ Primary Node                     │   │
│                  │  ├─ Secondary Node 1                 │   │
│                  │  └─ Secondary Node 2                 │   │
│                  └──────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MONITORING & LOGGING                    │  │
│  │  ├─ Application Monitoring (New Relic/DataDog)      │  │
│  │  ├─ Log Aggregation (ELK Stack)                     │  │
│  │  ├─ Error Tracking (Sentry)                         │  │
│  │  └─ Alerting (PagerDuty)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              BACKUP & DISASTER RECOVERY              │  │
│  │  ├─ Automated MongoDB Backups                        │  │
│  │  ├─ Cross-region Replication                         │  │
│  │  └─ Point-in-time Recovery                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

### Frontend
- Lazy loading of routes
- OnPush change detection
- Tree-shaking for production builds
- Minification and compression

### Backend
- Connection pooling for MongoDB
- Caching frequently accessed data
- Pagination for large datasets
- Index optimization on MongoDB

### Database
- Indexes on frequently queried fields
- Sharding for horizontal scaling
- Query optimization
- Regular maintenance

## Scalability

### Horizontal Scaling
- Multiple backend instances behind load balancer
- MongoDB replica sets for high availability
- CDN for static assets
- Session management via JWT (stateless)

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching layer (Redis)
- Database connection pooling

---

This architecture provides a secure, scalable, and maintainable foundation for the CyberShield incident management platform.
