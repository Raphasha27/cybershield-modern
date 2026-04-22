# Design Document: Cybersecurity Incident Management Platform

## Overview

The Cybersecurity Incident Management Platform is a full-stack web application built with Angular (frontend), Node.js/Express (backend), and MongoDB (database). The system provides a secure, scalable architecture for managing security incidents and threats in real-time.

**Architecture Pattern**: Layered architecture with clear separation of concerns:
- **Presentation Layer**: Angular dashboard with responsive UI
- **API Layer**: RESTful Express.js API with middleware for authentication, validation, and error handling
- **Business Logic Layer**: Service layer handling core functionality
- **Data Access Layer**: MongoDB repositories with data persistence
- **Cross-cutting Concerns**: Authentication, authorization, audit logging, rate limiting

**Key Design Principles**:
- Security-first: All inputs validated, outputs encoded, sensitive data encrypted
- Scalability: Stateless API design enabling horizontal scaling
- Maintainability: Clear separation of concerns, consistent patterns
- Reliability: Comprehensive error handling, data consistency guarantees
- Auditability: All actions logged for compliance

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Angular)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Incidents   │  │   Threats    │      │
│  │  Component   │  │  Component   │  │  Component   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway & Middleware                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ CORS Handler │  │ Rate Limiter │  │ Auth Middleware│    │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Express.js API Routes                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /auth        │  │ /incidents   │  │ /threats     │      │
│  │ /users       │  │ /alerts      │  │ /dashboard   │      │
│  │ /audit-logs  │  │ /api-docs    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ AuthService  │  │IncidentSvc   │  │ ThreatSvc    │      │
│  │ UserService  │  │ AlertService │  │ DashboardSvc │      │
│  │ AuditService │  │ ValidationSvc│  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Access Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ UserRepo     │  │IncidentRepo  │  │ ThreatRepo   │      │
│  │ AlertRepo    │  │ AuditLogRepo │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Database                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ users        │  │ incidents    │  │ threats      │      │
│  │ alerts       │  │ audit_logs   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Authentication Service

**Responsibility**: Manage user authentication, JWT token generation and validation

**Key Methods**:
```typescript
interface IAuthService {
  login(email: string, password: string): Promise<{ token: string; user: User }>;
  logout(token: string): Promise<void>;
  validateToken(token: string): Promise<User | null>;
  refreshToken(token: string): Promise<string>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}
```

**Security Measures**:
- Passwords hashed with bcrypt (10+ salt rounds)
- JWT tokens signed with HS256 algorithm
- Token expiration: 24 hours
- Refresh token mechanism for extended sessions
- Constant-time password comparison to prevent timing attacks

### Authorization Service

**Responsibility**: Enforce role-based access control (RBAC)

**Key Methods**:
```typescript
interface IAuthorizationService {
  hasPermission(user: User, resource: string, action: string): boolean;
  requireRole(requiredRoles: Role[]): Middleware;
  requirePermission(resource: string, action: string): Middleware;
}
```

**Role Definitions**:
- **Admin**: Full access to all resources and administrative functions
- **Analyst**: Access to incident management, threat monitoring, and dashboards
- **Viewer**: Read-only access to incidents and dashboards

### Incident Service

**Responsibility**: Manage incident lifecycle (create, read, update, delete)

**Key Methods**:
```typescript
interface IIncidentService {
  createIncident(data: CreateIncidentDTO): Promise<Incident>;
  getIncident(id: string): Promise<Incident>;
  listIncidents(filters: IncidentFilters, pagination: Pagination): Promise<PaginatedResult<Incident>>;
  updateIncident(id: string, data: UpdateIncidentDTO): Promise<Incident>;
  deleteIncident(id: string): Promise<void>;
  searchIncidents(query: string): Promise<Incident[]>;
}
```

**Incident Status Flow**:
```
Open → In Progress → Resolved → Closed
  ↓         ↓            ↓
  └─────────┴────────────┘ (can revert to Open)
```

### Threat Service

**Responsibility**: Monitor and manage detected threats

**Key Methods**:
```typescript
interface IThreatService {
  createThreat(data: CreateThreatDTO): Promise<Threat>;
  getThreat(id: string): Promise<Threat>;
  listThreats(filters: ThreatFilters): Promise<Threat[]>;
  updateThreatStatus(id: string, status: ThreatStatus): Promise<Threat>;
  investigateThreat(id: string, notes: string): Promise<Threat>;
}
```

### Alert Service

**Responsibility**: Generate and manage alerts for incidents and threats

**Key Methods**:
```typescript
interface IAlertService {
  createAlert(data: CreateAlertDTO): Promise<Alert>;
  getAlerts(userId: string, filters: AlertFilters): Promise<Alert[]>;
  markAsRead(alertId: string): Promise<Alert>;
  archiveAlert(alertId: string): Promise<void>;
  notifyUsers(alert: Alert, recipients: User[]): Promise<void>;
}
```

### Dashboard Service

**Responsibility**: Aggregate metrics and statistics for dashboard display

**Key Methods**:
```typescript
interface IDashboardService {
  getMetrics(userId: string): Promise<DashboardMetrics>;
  getIncidentStats(): Promise<IncidentStatistics>;
  getThreatStats(): Promise<ThreatStatistics>;
  getRecentIncidents(limit: number): Promise<Incident[]>;
  getRecentAlerts(userId: string, limit: number): Promise<Alert[]>;
}
```

### User Service

**Responsibility**: Manage user accounts and permissions

**Key Methods**:
```typescript
interface IUserService {
  createUser(data: CreateUserDTO): Promise<User>;
  getUser(id: string): Promise<User>;
  listUsers(pagination: Pagination): Promise<PaginatedResult<User>>;
  updateUser(id: string, data: UpdateUserDTO): Promise<User>;
  deleteUser(id: string): Promise<void>;
  updateUserRole(id: string, role: Role): Promise<User>;
  disableUser(id: string): Promise<void>;
}
```

### Audit Logger Service

**Responsibility**: Log all system actions for compliance and forensics

**Key Methods**:
```typescript
interface IAuditLoggerService {
  logAction(action: AuditAction): Promise<AuditLog>;
  getAuditLogs(filters: AuditLogFilters, pagination: Pagination): Promise<PaginatedResult<AuditLog>>;
  logIncidentCreation(incident: Incident, userId: string): Promise<void>;
  logIncidentUpdate(incidentId: string, changes: Record<string, any>, userId: string): Promise<void>;
  logUserLogin(userId: string): Promise<void>;
  logUserLogout(userId: string): Promise<void>;
}
```

### Input Validation Service

**Responsibility**: Validate and sanitize all user inputs

**Key Methods**:
```typescript
interface IInputValidationService {
  validateEmail(email: string): boolean;
  validatePassword(password: string): ValidationResult;
  validateIncidentData(data: CreateIncidentDTO): ValidationResult;
  sanitizeInput(input: string): string;
  validateSeverityLevel(level: string): boolean;
  validateIncidentStatus(status: string): boolean;
}
```

**Validation Rules**:
- Email: RFC 5322 compliant format
- Password: Minimum 12 characters, uppercase, lowercase, numbers, special characters
- Incident title: 1-255 characters, no SQL injection patterns
- Incident description: 1-5000 characters, no XSS patterns
- Severity levels: Critical, High, Medium, Low, Info only

### Rate Limiter Middleware

**Responsibility**: Prevent abuse through request rate limiting

**Configuration**:
- General rate limit: 100 requests per minute per IP
- Authentication rate limit: 10 failed attempts per 15 minutes
- API rate limit: 1000 requests per hour per user

**Implementation**: Token bucket algorithm with Redis backing (or in-memory for single instance)

### CORS Handler Middleware

**Responsibility**: Configure cross-origin resource sharing

**Configuration**:
- Allowed origins: Configurable via environment variables
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization
- Credentials: Allowed for same-origin requests
- Max age: 86400 seconds (24 hours)

## Data Models

### User Model

```typescript
interface User {
  _id: ObjectId;
  email: string;                    // Unique, indexed
  name: string;
  passwordHash: string;             // Bcrypt hash
  role: 'Admin' | 'Analyst' | 'Viewer';
  status: 'Active' | 'Disabled' | 'Deleted';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  deletedAt?: Date;                 // For soft deletes
}
```

### Incident Model

```typescript
interface Incident {
  _id: ObjectId;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  type: string;                     // e.g., "Breach", "Malware", "Unauthorized Access"
  createdBy: ObjectId;              // Reference to User
  assignedTo?: ObjectId;            // Reference to User
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  tags: string[];
  attachments?: string[];           // File paths or URLs
}
```

### Threat Model

```typescript
interface Threat {
  _id: ObjectId;
  classification: string;           // e.g., "Malware", "Vulnerability", "Intrusion Attempt"
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  status: 'Active' | 'Investigated' | 'Resolved';
  detectedAt: Date;
  detectionSource: string;          // e.g., "IDS", "Antivirus", "Manual"
  investigatedAt?: Date;
  investigatedBy?: ObjectId;        // Reference to User
  investigationNotes?: string;
  relatedIncidents: ObjectId[];     // References to Incidents
  createdAt: Date;
  updatedAt: Date;
}
```

### Alert Model

```typescript
interface Alert {
  _id: ObjectId;
  type: 'Incident' | 'Threat' | 'System';
  title: string;
  message: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  recipientId: ObjectId;            // Reference to User
  relatedResourceId: ObjectId;      // Reference to Incident or Threat
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  readAt?: Date;
  archivedAt?: Date;
}
```

### Audit Log Model

```typescript
interface AuditLog {
  _id: ObjectId;
  userId: ObjectId;                 // Reference to User
  action: string;                   // e.g., "CREATE_INCIDENT", "UPDATE_USER_ROLE"
  resourceType: string;             // e.g., "Incident", "User", "Threat"
  resourceId: ObjectId;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  status: 'Success' | 'Failure';
  errorMessage?: string;
  createdAt: Date;
}
```

### Dashboard Metrics Model

```typescript
interface DashboardMetrics {
  totalIncidents: number;
  incidentsByStatus: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  incidentsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  activeThreats: number;
  threatsByClassification: Record<string, number>;
  recentIncidents: Incident[];
  recentAlerts: Alert[];
  averageResolutionTime: number;    // In hours
}
```

## API Endpoints Specification

### Authentication Endpoints

```
POST /api/v1/auth/login
  Request: { email: string, password: string }
  Response: { token: string, user: User }
  Status: 200 OK | 401 Unauthorized | 400 Bad Request

POST /api/v1/auth/logout
  Headers: Authorization: Bearer <token>
  Response: { message: string }
  Status: 200 OK | 401 Unauthorized

POST /api/v1/auth/refresh
  Headers: Authorization: Bearer <token>
  Response: { token: string }
  Status: 200 OK | 401 Unauthorized

POST /api/v1/auth/change-password
  Headers: Authorization: Bearer <token>
  Request: { oldPassword: string, newPassword: string }
  Response: { message: string }
  Status: 200 OK | 400 Bad Request | 401 Unauthorized
```

### Incident Endpoints

```
POST /api/v1/incidents
  Headers: Authorization: Bearer <token>
  Request: CreateIncidentDTO
  Response: Incident
  Status: 201 Created | 400 Bad Request | 401 Unauthorized | 403 Forbidden

GET /api/v1/incidents
  Headers: Authorization: Bearer <token>
  Query: ?status=Open&severity=Critical&page=1&limit=20
  Response: PaginatedResult<Incident>
  Status: 200 OK | 401 Unauthorized

GET /api/v1/incidents/:id
  Headers: Authorization: Bearer <token>
  Response: Incident
  Status: 200 OK | 404 Not Found | 401 Unauthorized

PUT /api/v1/incidents/:id
  Headers: Authorization: Bearer <token>
  Request: UpdateIncidentDTO
  Response: Incident
  Status: 200 OK | 400 Bad Request | 404 Not Found | 401 Unauthorized | 403 Forbidden

DELETE /api/v1/incidents/:id
  Headers: Authorization: Bearer <token>
  Response: { message: string }
  Status: 200 OK | 404 Not Found | 401 Unauthorized | 403 Forbidden

GET /api/v1/incidents/search?q=query
  Headers: Authorization: Bearer <token>
  Response: Incident[]
  Status: 200 OK | 401 Unauthorized
```

### Threat Endpoints

```
GET /api/v1/threats
  Headers: Authorization: Bearer <token>
  Query: ?status=Active&severity=Critical
  Response: Threat[]
  Status: 200 OK | 401 Unauthorized

GET /api/v1/threats/:id
  Headers: Authorization: Bearer <token>
  Response: Threat
  Status: 200 OK | 404 Not Found | 401 Unauthorized

PUT /api/v1/threats/:id/investigate
  Headers: Authorization: Bearer <token>
  Request: { notes: string }
  Response: Threat
  Status: 200 OK | 400 Bad Request | 404 Not Found | 401 Unauthorized
```

### Alert Endpoints

```
GET /api/v1/alerts
  Headers: Authorization: Bearer <token>
  Query: ?isRead=false&page=1&limit=20
  Response: PaginatedResult<Alert>
  Status: 200 OK | 401 Unauthorized

PUT /api/v1/alerts/:id/read
  Headers: Authorization: Bearer <token>
  Response: Alert
  Status: 200 OK | 404 Not Found | 401 Unauthorized

PUT /api/v1/alerts/:id/archive
  Headers: Authorization: Bearer <token>
  Response: Alert
  Status: 200 OK | 404 Not Found | 401 Unauthorized
```

### Dashboard Endpoints

```
GET /api/v1/dashboard/metrics
  Headers: Authorization: Bearer <token>
  Response: DashboardMetrics
  Status: 200 OK | 401 Unauthorized
```

### User Management Endpoints

```
POST /api/v1/users
  Headers: Authorization: Bearer <token>
  Request: CreateUserDTO
  Response: User
  Status: 201 Created | 400 Bad Request | 409 Conflict | 401 Unauthorized | 403 Forbidden

GET /api/v1/users
  Headers: Authorization: Bearer <token>
  Query: ?page=1&limit=20
  Response: PaginatedResult<User>
  Status: 200 OK | 401 Unauthorized | 403 Forbidden

GET /api/v1/users/:id
  Headers: Authorization: Bearer <token>
  Response: User
  Status: 200 OK | 404 Not Found | 401 Unauthorized

PUT /api/v1/users/:id
  Headers: Authorization: Bearer <token>
  Request: UpdateUserDTO
  Response: User
  Status: 200 OK | 400 Bad Request | 404 Not Found | 401 Unauthorized | 403 Forbidden

PUT /api/v1/users/:id/role
  Headers: Authorization: Bearer <token>
  Request: { role: Role }
  Response: User
  Status: 200 OK | 400 Bad Request | 404 Not Found | 401 Unauthorized | 403 Forbidden

DELETE /api/v1/users/:id
  Headers: Authorization: Bearer <token>
  Response: { message: string }
  Status: 200 OK | 404 Not Found | 401 Unauthorized | 403 Forbidden
```

### Audit Log Endpoints

```
GET /api/v1/audit-logs
  Headers: Authorization: Bearer <token>
  Query: ?userId=xxx&action=CREATE_INCIDENT&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=50
  Response: PaginatedResult<AuditLog>
  Status: 200 OK | 401 Unauthorized | 403 Forbidden
```

### API Documentation Endpoint

```
GET /api/v1/docs
  Response: OpenAPI 3.0 specification (JSON)
  Status: 200 OK

GET /api/v1/docs/swagger
  Response: Swagger UI HTML
  Status: 200 OK
```

## Error Handling Strategy

**Standard Error Response Format**:
```typescript
interface ErrorResponse {
  error: {
    code: string;                    // e.g., "VALIDATION_ERROR", "UNAUTHORIZED"
    message: string;                 // User-friendly message
    details?: Record<string, any>;   // Additional context
    timestamp: Date;
    requestId: string;               // For debugging
  };
}
```

**HTTP Status Codes**:
- 400 Bad Request: Invalid input, validation errors
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Resource already exists (e.g., duplicate email)
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Unexpected server error
- 503 Service Unavailable: Database or external service unavailable

**Error Logging**:
- All errors logged with context (user ID, request ID, stack trace)
- Sensitive information (passwords, tokens) never logged
- Error logs retained for 90 days for forensic analysis

## Security Implementation

### Authentication Flow

```
1. User submits credentials (email, password)
2. System validates email format
3. System retrieves user from database
4. System compares password with stored hash (bcrypt)
5. If match: Generate JWT token (HS256, 24-hour expiration)
6. Return token and user info to client
7. Client stores token in secure storage (httpOnly cookie or secure localStorage)
8. Client includes token in Authorization header for subsequent requests
```

### Authorization Flow

```
1. Request arrives with Authorization header containing JWT
2. Middleware extracts and validates JWT signature
3. Middleware decodes JWT to get user ID and role
4. Middleware checks if user role has permission for requested resource/action
5. If authorized: Request proceeds to handler
6. If unauthorized: Return 403 Forbidden
```

### Password Security

- Minimum 12 characters
- Must include uppercase, lowercase, numbers, special characters
- Hashed with bcrypt (10+ salt rounds)
- Constant-time comparison to prevent timing attacks
- Password reset tokens valid for 1 hour only
- All existing tokens invalidated on password change

### Input Sanitization

- All string inputs trimmed and validated
- SQL injection prevention: Parameterized queries (MongoDB native)
- XSS prevention: HTML entity encoding on output
- CSRF protection: SameSite cookie attribute, CSRF tokens for state-changing operations

### Data Encryption

- Sensitive data at rest: Encrypted using AES-256 (if needed)
- Data in transit: HTTPS/TLS 1.2+ enforced
- Database credentials: Stored in environment variables, never in code

## Testing Strategy

### Unit Testing Approach

**Scope**: Individual service methods and utility functions

**Examples**:
- Authentication service: Login with valid/invalid credentials, token validation
- Incident service: Create incident with valid/invalid data, update status transitions
- Validation service: Email format validation, password strength validation
- Authorization service: Role-based permission checks

**Framework**: Jest with mocking for dependencies

**Coverage Target**: 80% code coverage minimum

### Property-Based Testing Approach

**Scope**: Universal properties that should hold across all inputs

**Properties to Test**:
- Incident creation round-trip: Creating and retrieving an incident returns the same data
- Incident status transitions: Valid status transitions are allowed, invalid ones rejected
- Audit log immutability: Audit logs cannot be modified after creation
- User role permissions: Users with specific roles can only access allowed resources
- Alert generation: Alerts are generated for all incidents above severity threshold
- Password validation: All passwords meeting requirements are accepted, others rejected
- Input sanitization: Sanitized inputs prevent SQL injection and XSS attacks

**Framework**: fast-check (JavaScript/TypeScript property-based testing library)

**Configuration**: Minimum 100 iterations per property test

### Integration Testing Approach

**Scope**: Multiple components working together

**Examples**:
- End-to-end incident workflow: Create → Update → Resolve → Close
- Authentication and authorization: Login → Access protected resource → Logout
- Audit logging: Perform action → Verify audit log entry created
- Alert generation: Create incident → Verify alert generated and sent

**Framework**: Jest with test database (MongoDB in-memory or test instance)

### Test Organization

```
src/
├── services/
│   ├── auth.service.ts
│   ├── auth.service.test.ts
│   ├── auth.service.property.test.ts
│   ├── incident.service.ts
│   ├── incident.service.test.ts
│   └── incident.service.property.test.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── auth.middleware.test.ts
│   └── rate-limiter.middleware.test.ts
└── routes/
    ├── incidents.routes.ts
    └── incidents.routes.integration.test.ts
```

