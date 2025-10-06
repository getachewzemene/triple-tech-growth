# Production Deployment Guide

This guide covers deploying Triple Technologies to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Methods](#deployment-methods)
4. [Post-Deployment](#post-deployment)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- Node.js 18+ (LTS recommended)
- PostgreSQL 15+
- Docker & Docker Compose (for containerized deployment)
- PM2 (for process management)
- Nginx (for reverse proxy)
- SSL certificates (Let's Encrypt recommended)

### Required Services

- AWS Account (S3, CloudFront)
- Domain name with DNS access
- Email service (SendGrid, AWS SES, or SMTP)
- Payment processor (Stripe)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/getachewzemene/triple-tech-growth.git
cd triple-tech-growth
```

### 2. Configure Environment Variables

Copy the production environment template:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and fill in all required values:

- **Database credentials**: Update PostgreSQL connection string
- **NextAuth secret**: Generate with `openssl rand -base64 32`
- **AWS credentials**: Add your AWS access keys and S3 bucket
- **CloudFront**: Configure CDN settings
- **Payment**: Add Stripe production keys
- **Email**: Configure SMTP or email service

### 3. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

## Deployment Methods

### Method 1: Docker Compose (Recommended)

Docker Compose provides a complete production environment with PostgreSQL, Nginx, and the Next.js app.

#### Step 1: Build and Start Services

```bash
# Build the Docker images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

#### Step 2: Configure SSL

For SSL certificates, you can use Let's Encrypt:

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d tripletechnologies.com -d www.tripletechnologies.com

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/tripletechnologies.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/tripletechnologies.com/privkey.pem nginx/ssl/key.pem

# Restart nginx
docker-compose restart nginx
```

#### Step 3: Auto-renewal Setup

```bash
# Add cron job for certificate renewal
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet && docker-compose restart nginx
```

### Method 2: PM2 Process Manager

PM2 is ideal for running the app on a VPS without Docker.

#### Step 1: Install Dependencies

```bash
npm install
npm run build
```

#### Step 2: Install PM2

```bash
npm install -g pm2
```

#### Step 3: Start the Application

```bash
# Start with ecosystem config
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Step 4: Configure Nginx

Install and configure Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt-get install nginx

# Copy configuration
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/conf.d/default.conf /etc/nginx/conf.d/

# Update server_name in config
sudo nano /etc/nginx/conf.d/default.conf

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Method 3: Vercel (Serverless)

Vercel is a managed platform optimized for Next.js:

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Deploy

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Step 3: Configure Environment Variables

Add all production environment variables in the Vercel dashboard.

### Method 4: Docker Container (Manual)

#### Build and Run

```bash
# Build the image
docker build -t triple-technologies .

# Run the container
docker run -d \
  --name triple-tech-app \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  triple-technologies
```

## Post-Deployment

### 1. Verify Health Check

```bash
curl https://tripletechnologies.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Test Core Functionality

- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] Course enrollment functions
- [ ] Video playback works
- [ ] Admin dashboard accessible
- [ ] API endpoints respond correctly

### 3. Configure DNS

Point your domain to the server:

```
A Record: tripletechnologies.com → your-server-ip
A Record: www.tripletechnologies.com → your-server-ip
```

### 4. Setup Monitoring

Configure monitoring services:

- **Application monitoring**: Sentry or similar
- **Server monitoring**: DataDog, New Relic, or Prometheus
- **Uptime monitoring**: UptimeRobot or Pingdom

## Monitoring & Maintenance

### Health Checks

The application exposes a health endpoint at `/api/health`:

```bash
# Check application health
curl https://tripletechnologies.com/api/health
```

### Logs

#### Docker Compose

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

#### PM2

```bash
# View logs
pm2 logs triple-technologies

# Monitor in real-time
pm2 monit

# View specific log files
tail -f logs/pm2-out.log
tail -f logs/pm2-error.log
```

### Database Backups

#### Automated Backups

```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgres"
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U tripletech tripleacademy | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
EOF

chmod +x backup-db.sh

# Add to cron
(crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup-db.sh") | crontab -
```

### Updates and Rollbacks

#### Rolling Update

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart (Docker)
docker-compose build app
docker-compose up -d app

# Or with PM2
npm install
npm run build
pm2 reload ecosystem.config.js
```

#### Rollback

```bash
# Docker: rollback to previous image
docker-compose down
docker-compose up -d

# PM2: restore previous deployment
git checkout <previous-commit>
npm install
npm run build
pm2 reload ecosystem.config.js
```

### Performance Optimization

1. **Enable Redis caching** (optional):
   ```bash
   docker-compose up -d redis
   ```

2. **Configure CDN** for static assets via CloudFront

3. **Database optimization**:
   - Regular VACUUM operations
   - Index optimization
   - Query performance analysis

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs app
# or
pm2 logs

# Verify environment variables
docker-compose exec app env | grep DATABASE_URL

# Check port availability
sudo netstat -tlnp | grep 3000
```

### Database Connection Issues

```bash
# Test database connection
docker-compose exec postgres psql -U tripletech -d tripleacademy

# Check database status
docker-compose ps postgres

# Verify DATABASE_URL
echo $DATABASE_URL
```

### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Test SSL configuration
sudo nginx -t

# Renew certificates manually
sudo certbot renew
```

### High Memory Usage

```bash
# Check container resources (Docker)
docker stats

# PM2 memory limits
pm2 restart ecosystem.config.js

# Optimize Node.js memory
NODE_OPTIONS="--max-old-space-size=2048" pm2 restart all
```

### Performance Issues

```bash
# Enable Node.js profiling
NODE_ENV=production node --prof node_modules/next/dist/bin/next start

# Check database slow queries
# (Connect to PostgreSQL and enable logging)

# Monitor application
pm2 monit
```

## Security Checklist

- [ ] All environment variables are secured
- [ ] SSL/TLS certificates are valid
- [ ] Database credentials are strong
- [ ] AWS credentials have minimal permissions
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] CORS is properly configured
- [ ] Regular security updates are applied
- [ ] Backups are automated and tested
- [ ] Monitoring and alerts are configured

## Support

For deployment issues or questions:

- Email: support@tripletechnologies.com
- Documentation: See `/docs` folder
- Security issues: security@tripletechnologies.com

---

**Note**: This deployment guide assumes a Linux-based server. Adjust commands as needed for your environment.
