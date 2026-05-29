# CyberShield - Deployment Guide

## Deployment Options

Choose your deployment platform:

1. **Vercel** (Frontend) + **Railway/Render** (Backend) - Easiest
2. **Heroku** (Full Stack) - Simple
3. **AWS** (EC2/ECS) - Scalable
4. **DigitalOcean** (App Platform) - Affordable
5. **Docker** (Self-hosted) - Full control

---

## Option 1: Vercel + Railway (Recommended - Easiest)

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "CyberShield deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Framework: Angular
   - Build Command: `npm run build`
   - Output Directory: `dist/cybershield-modern`
   - Click "Deploy"

3. **Update API URL**
   - After deployment, update `src/app/services/api.service.ts`
   - Change `apiUrl` to your backend URL
   - Redeploy

### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository
   - Select `server` directory as root
   - Add environment variables:
     ```
     PORT=3000
     MONGODB_URI=<your-mongodb-atlas-uri>
     JWT_SECRET=<strong-random-key>
     JWT_EXPIRATION=24h
     NODE_ENV=production
     CORS_ORIGIN=<your-vercel-frontend-url>
     ```
   - Click "Deploy"

3. **Add MongoDB**
   - In Railway dashboard, click "Add"
   - Select "MongoDB"
   - Copy connection string to `MONGODB_URI`

4. **Get Backend URL**
   - Railway provides a public URL
   - Update frontend `api.service.ts` with this URL

---

## Option 2: Heroku (Simple)

### Prerequisites
- Heroku CLI installed
- GitHub account

### Deploy Backend

1. **Create Heroku App**
   ```bash
   heroku login
   heroku create cybershield-backend
   ```

2. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set JWT_EXPIRATION=24h
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-url.com
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy Frontend

1. **Build Angular App**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Drag and drop `dist/cybershield-modern` folder
   - Or connect GitHub for automatic deployments

3. **Update API URL**
   - Set environment variable in Netlify
   - Redeploy

---

## Option 3: AWS Deployment

### Using AWS Elastic Beanstalk

1. **Install AWS CLI**
   ```bash
   aws configure
   ```

2. **Create Elastic Beanstalk App**
   ```bash
   eb init -p node.js-18 cybershield
   eb create cybershield-env
   ```

3. **Set Environment Variables**
   ```bash
   eb setenv MONGODB_URI=<your-uri>
   eb setenv JWT_SECRET=<your-secret>
   eb setenv NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### Using AWS S3 + CloudFront (Frontend)

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://cybershield-frontend
   ```

3. **Upload Files**
   ```bash
   aws s3 sync dist/cybershield-modern s3://cybershield-frontend --delete
   ```

4. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Enable HTTPS
   - Set default root object to `index.html`

---

## Option 4: DigitalOcean App Platform

### Deploy Backend

1. **Create DigitalOcean Account**
   - Go to https://digitalocean.com
   - Create account

2. **Create App**
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Select `server` directory
   - Add environment variables:
     ```
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-secret>
     NODE_ENV=production
     CORS_ORIGIN=<your-frontend-url>
     ```
   - Click "Deploy"

3. **Add Database**
   - Create managed MongoDB cluster
   - Update `MONGODB_URI`

### Deploy Frontend

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy to DigitalOcean Spaces**
   - Create Space (CDN)
   - Upload `dist/cybershield-modern`
   - Enable CDN

---

## Option 5: Docker (Self-Hosted)

### Build Docker Images

1. **Create Dockerfile for Backend**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY server/package*.json ./
   RUN npm install
   COPY server/src ./src
   COPY server/tsconfig.json ./
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Create Dockerfile for Frontend**
   ```dockerfile
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist/cybershield-modern /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Build Images**
   ```bash
   docker build -t cybershield-backend:latest -f Dockerfile.backend .
   docker build -t cybershield-frontend:latest -f Dockerfile.frontend .
   ```

4. **Push to Docker Hub**
   ```bash
   docker tag cybershield-backend:latest your-username/cybershield-backend:latest
   docker push your-username/cybershield-backend:latest
   
   docker tag cybershield-frontend:latest your-username/cybershield-frontend:latest
   docker push your-username/cybershield-frontend:latest
   ```

5. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

---

## Production Environment Setup

### 1. Environment Variables

Create `server/.env.production`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cybershield
JWT_SECRET=<generate-strong-random-key>
JWT_EXPIRATION=24h
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### 2. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update `MONGODB_URI`

### 3. SSL/TLS Certificate

- Use Let's Encrypt (free)
- Or purchase from certificate authority
- Configure in reverse proxy (nginx/Apache)

### 4. Reverse Proxy (nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 5. Monitoring & Logging

- **Application Monitoring**: New Relic, DataDog
- **Log Aggregation**: ELK Stack, Splunk
- **Error Tracking**: Sentry
- **Alerting**: PagerDuty, Opsgenie

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL certificate ready
- [ ] Domain configured
- [ ] Monitoring setup

### Deployment
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `npm run server:build`
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Verify database connection
- [ ] Test API endpoints
- [ ] Test authentication
- [ ] Verify CORS configuration

### Post-Deployment
- [ ] Monitor application logs
- [ ] Check error tracking
- [ ] Verify backups
- [ ] Test all features
- [ ] Monitor performance
- [ ] Set up alerts

---

## Scaling Strategies

### Horizontal Scaling
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    image: cybershield-backend:latest
    deploy:
      replicas: 3
    environment:
      - PORT=3000
      - MONGODB_URI=${MONGODB_URI}
    ports:
      - "3000-3002:3000"

  mongodb:
    image: mongo:7.0
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Caching Layer (Redis)
```bash
docker run -d -p 6379:6379 redis:latest
```

### Database Replication
- Use MongoDB replica sets
- Configure automatic failover
- Enable sharding for large datasets

---

## Troubleshooting Deployment

### Issue: CORS Errors
**Solution**: Update `CORS_ORIGIN` in environment variables to match frontend URL

### Issue: Database Connection Failed
**Solution**: 
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Issue: 502 Bad Gateway
**Solution**:
- Check backend is running
- Verify port configuration
- Check reverse proxy configuration

### Issue: Slow Performance
**Solution**:
- Enable caching (Redis)
- Optimize database queries
- Use CDN for static assets
- Implement pagination

### Issue: High Memory Usage
**Solution**:
- Increase server resources
- Implement connection pooling
- Optimize queries
- Use horizontal scaling

---

## Backup & Disaster Recovery

### Database Backups
```bash
# Automated daily backups
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/cybershield" \
  --out ./backups/$(date +%Y%m%d)
```

### Restore from Backup
```bash
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net" \
  ./backups/20240215
```

### Application Backups
- Store in S3 or similar
- Backup configuration files
- Backup SSL certificates
- Test restore procedures

---

## Security Hardening

### 1. Update Dependencies
```bash
npm audit fix
npm update
```

### 2. Enable HTTPS
- Use Let's Encrypt
- Configure HSTS headers
- Enable certificate pinning

### 3. Database Security
- Enable authentication
- Use strong passwords
- Enable encryption at rest
- Enable encryption in transit
- Regular backups

### 4. Application Security
- Keep secrets in environment variables
- Use strong JWT secret
- Enable rate limiting
- Implement WAF rules
- Regular security audits

### 5. Infrastructure Security
- Use VPC/private networks
- Configure firewalls
- Enable DDoS protection
- Regular patching
- Security monitoring

---

## Performance Optimization

### Frontend
- Enable gzip compression
- Minify CSS/JS
- Lazy load routes
- Use CDN
- Cache static assets

### Backend
- Enable connection pooling
- Implement caching
- Optimize queries
- Use pagination
- Monitor performance

### Database
- Create indexes
- Optimize queries
- Enable sharding
- Regular maintenance
- Monitor metrics

---

## Monitoring & Alerts

### Key Metrics to Monitor
- Application uptime
- Response time
- Error rate
- Database performance
- Memory usage
- CPU usage
- Disk space

### Alert Thresholds
- Error rate > 1%
- Response time > 2s
- CPU > 80%
- Memory > 85%
- Disk > 90%

---

## Support & Documentation

For deployment help:
1. Check platform-specific documentation
2. Review troubleshooting section
3. Check application logs
4. Monitor error tracking service
5. Contact platform support

---

## Next Steps

1. Choose deployment platform
2. Follow platform-specific guide
3. Configure environment variables
4. Deploy application
5. Verify functionality
6. Set up monitoring
7. Configure backups
8. Document deployment

**Your CyberShield application is ready for production deployment!** 🚀
