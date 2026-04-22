# CyberShield - Quick Start (5 Minutes)

## Prerequisites
- Node.js 18+
- MongoDB (local or Docker)

## Step 1: Install (2 min)

```powershell
npm install
cd server && npm install && cd ..
```

## Step 2: Configure (1 min)

Create `server/.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRATION=24h
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

## Step 3: Start MongoDB (1 min)

**Option A - Docker (Recommended):**
```powershell
docker-compose up -d
```

**Option B - Local MongoDB:**
```powershell
mongod
```

## Step 4: Run Application (1 min)

**Terminal 1 - Frontend:**
```powershell
npm start
```
→ Opens http://localhost:4200

**Terminal 2 - Backend:**
```powershell
npm run server
```
→ Runs on http://localhost:3000

## Step 5: Use the App

1. Go to http://localhost:4200
2. Click "Register here"
3. Create account with:
   - Email: `test@cybershield.com`
   - Name: `Test User`
   - Password: `SecurePassword123!`
4. Login and view dashboard

## Common Commands

```powershell
# Frontend
npm start              # Dev server on :4200
npm run build          # Production build
npm test               # Run tests

# Backend
npm run server         # Dev server on :3000
npm run server:build   # Build TypeScript
npm run test --cwd server  # Run tests

# Database
docker-compose up -d   # Start MongoDB + Mongo Express
docker-compose down    # Stop containers
```

## API Quick Test

```powershell
# Register
$body = @{email="test@cybershield.com"; name="Test"; password="SecurePassword123!"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/register" -Method POST -ContentType "application/json" -Body $body

# Login
$body = @{email="test@cybershield.com"; password="SecurePassword123!"} | ConvertTo-Json
$res = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body
$token = ($res.Content | ConvertFrom-Json).token

# Get Dashboard
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/dashboard/metrics" -Headers $headers
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000/4200 in use | Change PORT in `.env` or kill process |
| MongoDB connection error | Run `docker-compose up -d` or `mongod` |
| Module not found | Run `npm install` again |
| CORS error | Check `CORS_ORIGIN` in `.env` |

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:3000 |
| MongoDB Express | http://localhost:8081 |
| Health Check | http://localhost:3000/health |

## Default Roles

- **Admin**: Full access to all features
- **Analyst**: Can manage incidents and threats
- **Viewer**: Read-only access

## Next Steps

1. Create incidents from dashboard
2. Monitor threats
3. Check audit logs
4. Review specifications in `.kiro/specs/`

## Documentation

- `README.md` - Full documentation
- `STARTUP.md` - Detailed setup guide
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `.kiro/specs/` - Requirements & design

---

**You're all set! The application is ready to use.** 🚀
