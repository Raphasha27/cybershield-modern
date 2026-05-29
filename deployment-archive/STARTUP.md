# CyberShield - Startup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally (or MongoDB Atlas connection string)

## Step 1: Install Dependencies

Open PowerShell in the project root and run:

```powershell
npm install
```

Then install backend dependencies:

```powershell
cd server
npm install
cd ..
```

## Step 2: Configure Backend

Create a `.env` file in the `server` directory:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

## Step 3: Start MongoDB

If using local MongoDB:

```powershell
mongod
```

Or use MongoDB Atlas by updating `MONGODB_URI` in `.env`

## Step 4: Start the Application

**Open Terminal 1 - Frontend:**

```powershell
npm start
```

Frontend will be available at: `http://localhost:4200`

**Open Terminal 2 - Backend:**

```powershell
npm run server
```

Backend will be available at: `http://localhost:3000`

## Step 5: Access the Application

1. Open browser to `http://localhost:4200`
2. You'll be redirected to login page
3. Register a new account or use test credentials

## Test the API

### Register a new user:

```powershell
$body = @{
    email = "test@cybershield.com"
    name = "Test User"
    password = "SecurePassword123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Login:

```powershell
$body = @{
    email = "test@cybershield.com"
    password = "SecurePassword123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

### Get Dashboard Metrics:

```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/dashboard/metrics" `
  -Method GET `
  -Headers $headers
```

## Troubleshooting

### Port already in use

If port 3000 or 4200 is already in use:

- Frontend: Change in `angular.json` (serve.options.port)
- Backend: Change `PORT` in `.env`

### MongoDB connection error

- Ensure MongoDB is running: `mongod`
- Or update `MONGODB_URI` in `.env` with your MongoDB Atlas connection string

### Module not found errors

Run `npm install` again in both root and `server` directories

### CORS errors

Ensure `CORS_ORIGIN` in `.env` matches your frontend URL (default: `http://localhost:4200`)

## Next Steps

1. Create incidents through the dashboard
2. Monitor threats in real-time
3. Manage user roles and permissions
4. Review audit logs for compliance

For detailed documentation, see:
- `README.md` - Full project documentation
- `.kiro/specs/cybersecurity-incident-platform/requirements.md` - Requirements
- `.kiro/specs/cybersecurity-incident-platform/design.md` - Architecture
