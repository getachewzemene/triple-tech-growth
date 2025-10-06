# Production Architecture

This document describes the production architecture for Triple Technologies.

## 🏗️ System Architecture

### Production Deployment (Docker Compose)

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS (443)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • SSL/TLS Termination                             │     │
│  │  • HTTP → HTTPS Redirect                           │     │
│  │  • Security Headers                                │     │
│  │  • Rate Limiting (10 req/s)                        │     │
│  │  • Gzip Compression                                │     │
│  │  • Static Asset Caching                            │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (3000)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Application (Node.js)                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Middleware Layer                                  │     │
│  │  • Security Headers (CSP, HSTS)                    │     │
│  │  • Rate Limiting                                   │     │
│  │  • CORS Management                                 │     │
│  │  • Request Logging                                 │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  API Routes                                        │     │
│  │  • /api/health - Health checks                     │     │
│  │  • /api/auth/* - Authentication                    │     │
│  │  • /api/courses/* - Course management              │     │
│  │  • /api/admin/* - Admin operations                 │     │
│  │  • /api/playback/* - Video streaming               │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  App Routes (Server Components)                    │     │
│  │  • / - Homepage                                    │     │
│  │  • /training - Training catalog                    │     │
│  │  • /courses - Course listing                       │     │
│  │  • /admin - Admin dashboard                        │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
                  ▼                 ▼
┌─────────────────────────┐ ┌──────────────────────────────┐
│   PostgreSQL Database   │ │   External Services          │
│                         │ │                              │
│  • User Data            │ │  • AWS S3 (Video Storage)    │
│  • Course Data          │ │  • CloudFront (CDN)          │
│  • Enrollments          │ │  • Stripe (Payments)         │
│  • Sessions             │ │  • SendGrid/SES (Email)      │
│  • Audit Logs           │ │  • Sentry (Error Tracking)   │
└─────────────────────────┘ └──────────────────────────────┘
```

## 🔄 Request Flow

### 1. User Request Flow

```
User Browser
    │
    ▼ HTTPS Request
┌───────────────────────┐
│  Nginx (Port 443)     │
│  • Check Rate Limit   │
│  • Add Security Hdrs  │
│  • Compress Response  │
└───────┬───────────────┘
        │ Proxy to :3000
        ▼
┌───────────────────────┐
│  Next.js Middleware   │
│  • Security Headers   │
│  • Request Logging    │
└───────┬───────────────┘
        │
        ▼
┌───────────────────────┐
│  Route Handler        │
│  • Validate Request   │
│  • Process Business   │
│  • Query Database     │
└───────┬───────────────┘
        │
        ▼
    Response
```

### 2. Video Playback Flow

```
User Request
    │
    ▼
Video Player Component
    │
    ▼ POST /api/playback/token
Next.js API Route
    │
    ├─► Validate User Session
    ├─► Check Course Enrollment
    ├─► Generate JWT Token (90s)
    └─► Create Watermark Data
    │
    ▼ Return Token
Video Player
    │
    ▼ Request manifest with token
/api/player/manifest
    │
    ├─► Validate JWT Token
    ├─► Generate CloudFront URLs
    └─► Return Manifest
    │
    ▼
CloudFront CDN
    │
    ▼ Signed URL
S3 Bucket (Video Storage)
```

## 🐳 Docker Compose Setup

### Container Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                    (app-network)                         │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────┐  │
│  │  Nginx         │  │  Next.js App   │  │ Postgres │  │
│  │  Container     │  │  Container     │  │ Container│  │
│  │                │  │                │  │          │  │
│  │  Port: 80,443  │  │  Port: 3000    │  │ Port:    │  │
│  │                │◄─┤                │◄─┤ 5432     │  │
│  └────────────────┘  └────────────────┘  └──────────┘  │
│         │                    │                  │        │
│         │                    │                  │        │
└─────────┼────────────────────┼──────────────────┼────────┘
          │                    │                  │
          │                    │                  │
     Host Port 80/443     Health Check        Volume
                            :3000/api/health  postgres-data
```

### Volume Management

```
┌──────────────────────────────────┐
│  Docker Volumes                   │
│                                   │
│  postgres-data                    │
│  ├─ /var/lib/postgresql/data     │
│  └─ Persistent database storage   │
│                                   │
│  nginx/ssl (Host Mount)           │
│  ├─ /etc/nginx/ssl                │
│  └─ SSL certificates              │
│                                   │
│  nginx/conf.d (Host Mount)        │
│  ├─ /etc/nginx/conf.d             │
│  └─ Nginx configuration           │
└──────────────────────────────────┘
```

## ⚙️ PM2 Cluster Mode

### Process Management

```
PM2 Process Manager
    │
    ├─► Master Process
    │   └─► Monitors Workers
    │
    ├─► Worker 1 (CPU Core 1)
    │   └─► Next.js Instance
    │
    ├─► Worker 2 (CPU Core 2)
    │   └─► Next.js Instance
    │
    ├─► Worker 3 (CPU Core 3)
    │   └─► Next.js Instance
    │
    └─► Worker N (CPU Core N)
        └─► Next.js Instance

All Workers Share:
• Port 3000 (Load Balanced)
• PostgreSQL Connection Pool
• Redis Cache (if enabled)
```

## 🔒 Security Layers

### Defense in Depth

```
Layer 1: Network
    ├─ Firewall Rules
    ├─ DDoS Protection
    └─ Rate Limiting (Nginx)

Layer 2: Transport
    ├─ TLS 1.2+ Only
    ├─ Strong Ciphers
    └─ HSTS Header

Layer 3: Application (Nginx)
    ├─ Security Headers
    ├─ Request Validation
    └─ Rate Limiting

Layer 4: Application (Next.js)
    ├─ Middleware Security
    ├─ CSP Headers
    ├─ CORS Management
    └─ Input Validation

Layer 5: Authentication
    ├─ JWT Tokens
    ├─ Session Management
    ├─ Password Hashing
    └─ API Key Validation

Layer 6: Authorization
    ├─ Role-Based Access
    ├─ Resource Ownership
    └─ Admin Routes Protection

Layer 7: Data
    ├─ Encrypted at Rest
    ├─ Encrypted in Transit
    └─ SQL Injection Protection
```

## 📊 Monitoring Stack

### Observability Architecture

```
Application
    │
    ├─► Structured Logs
    │   ├─ Console (Development)
    │   ├─ File System (Production)
    │   └─ Log Aggregation Service
    │
    ├─► Health Checks
    │   ├─ /api/health
    │   ├─ Database Connection
    │   ├─ External Services
    │   └─ Load Balancer Checks
    │
    ├─► Error Tracking
    │   ├─ Sentry (Optional)
    │   ├─ Error Context
    │   └─ User Session Info
    │
    └─► Performance Metrics
        ├─ Response Times
        ├─ Database Queries
        ├─ Cache Hit Rate
        └─ Resource Usage

Alerting
    ├─ High Error Rate
    ├─ Slow Response Times
    ├─ Database Issues
    └─ Service Downtime
```

## 🚀 Deployment Flow

### CI/CD Pipeline

```
GitHub Push
    │
    ▼
┌────────────────────────┐
│  GitHub Actions        │
│                        │
│  1. Lint & Type Check  │
│  2. Run Tests          │
│  3. Build Application  │
│  4. Security Scan      │
│  5. Build Docker Image │
│  6. Push to Registry   │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Production Server     │
│                        │
│  1. Pull New Image     │
│  2. Run Migrations     │
│  3. Health Check       │
│  4. Rolling Update     │
│  5. Verify Deployment  │
└────────────────────────┘
```

## 📁 File Structure

### Production Files Organization

```
triple-tech-growth/
├── app/                        # Next.js app directory
│   ├── api/
│   │   ├── health/            # Health check endpoint ✓
│   │   ├── auth/              # Authentication
│   │   ├── courses/           # Course management
│   │   └── playback/          # Video streaming
│   └── (routes)/              # Page routes
│
├── lib/                        # Shared utilities
│   ├── middleware/
│   │   ├── rateLimit.ts       # Rate limiting ✓
│   │   └── cors.ts            # CORS config ✓
│   ├── logger.ts              # Logging system ✓
│   ├── sentry.ts              # Error tracking ✓
│   └── auth.ts                # Authentication
│
├── nginx/                      # Nginx configuration
│   ├── nginx.conf             # Main config ✓
│   ├── conf.d/
│   │   └── default.conf       # Site config ✓
│   ├── ssl/                   # SSL certificates
│   └── README.md              # Setup guide ✓
│
├── docs/                       # Production docs
│   ├── DEPLOYMENT.md          # Deployment guide ✓
│   ├── PRODUCTION-CHECKLIST.md # Checklist ✓
│   ├── PRODUCTION-SETUP.md    # Setup overview ✓
│   └── CHANGES-SUMMARY.md     # Changes log ✓
│
├── docker-compose.yml          # Production setup ✓
├── docker-compose.dev.yml      # Dev database ✓
├── ecosystem.config.js         # PM2 config ✓
├── middleware.ts               # Global middleware ✓
├── .env.production.example     # Env template ✓
├── setup.sh                    # Setup script ✓
└── .github/workflows/ci.yml    # CI/CD pipeline ✓
```

## 🔧 Configuration Management

### Environment Variables Flow

```
Development
    └─► .env.local
        └─► Local database
        └─► Test credentials

Staging
    └─► .env.staging
        └─► Staging database
        └─► Test credentials

Production
    └─► .env.production
        └─► Production database
        └─► Real credentials
        └─► Encrypted secrets
```

## 📈 Scaling Strategy

### Horizontal Scaling

```
Load Balancer
    │
    ├─► App Server 1 (PM2 Cluster)
    │   ├─ Worker 1
    │   ├─ Worker 2
    │   └─ Worker N
    │
    ├─► App Server 2 (PM2 Cluster)
    │   ├─ Worker 1
    │   ├─ Worker 2
    │   └─ Worker N
    │
    └─► App Server N (PM2 Cluster)
        ├─ Worker 1
        ├─ Worker 2
        └─ Worker N

Shared Services:
    ├─ PostgreSQL (Primary + Replicas)
    ├─ Redis (Cluster)
    └─ S3/CloudFront (Distributed)
```

## 🎯 Performance Optimization

### Caching Strategy

```
Browser Cache
    │ Static Assets (1 year)
    │ Images, CSS, JS
    ▼
CDN (CloudFront)
    │ Edge Cache (24 hours)
    │ Compressed Assets
    ▼
Nginx Cache
    │ Reverse Proxy Cache
    │ Static Content
    ▼
Application Cache
    │ Redis/Memory
    │ API Responses
    ▼
Database
    │ Query Results
    │ Connection Pool
```

---

**Note**: This architecture is designed for production deployment with high availability, security, and performance in mind.

For implementation details, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - How to deploy
- [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md) - What to check
- [PRODUCTION-SETUP.md](./PRODUCTION-SETUP.md) - What's included
