# Welcome to Triple Technologies

## Project info

## ⚠️ Important Security Notice
**No system can fully prevent determined screen recording attempts.** This platform implements defense-in-depth strategies to deter casual piracy and provide forensic evidence:

- **Physical cameras** can always record screens
- **OS-level screen recorders** may bypass browser protections
- **Hardware capture cards** can intercept video signals


- ✅ **Strong deterrence** against casual downloading/sharing
- ✅ **Native app protections** for mobile platforms


### Core Security Features
- **Short-lived playback tokens** (90 seconds) with JWT validation
- **Dynamic visible watermarks** with TripleAcademy branding + user info
- **CloudFront signed URLs** with 5-minute expiry
- **User agent binding** and IP tracking
- **Rate limiting** on token requests

### Video Platform Features

- **Admin course upload** with drag & drop, pause/resume
- **Encrypted HLS** fallback (AES-128)
- **Multipart upload** for large files with resume capability

### Enterprise Features (Optional)

- **Widevine/PlayReady/FairPlay DRM** integration
- **Hardware-level video protection**
- **Advanced forensic watermarking**
- **Professional transcoding pipelines**

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- AWS account with S3 and CloudFront
- (Optional) DRM provider account (Mux, BuyDRM, AWS MediaPackage)
- (Optional) FFmpeg for video transcoding

## 🛠️ Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env.local
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🔒 Security Configuration

See the complete README documentation in the docs folder for:

- AWS S3 and CloudFront setup
- Database configuration with Prisma
- Environment variables configuration
- Security headers and rate limiting
- Video transcoding pipeline setup
- Native app protection implementation
- Production deployment checklist

## 📄 Documentation

### Development
- [Complete Setup Guide](./docs/setup.md)
- [FFmpeg Transcoding Examples](./docs/ffmpeg-transcoding.md)
- [Native App Protection](./docs/native-app-protection.md)
- [API Documentation](./docs/api.md)
- [Security Best Practices](./docs/security.md)

### Production
- **[Production Setup Overview](./PRODUCTION-SETUP.md)** ⭐
- **[Deployment Guide](./DEPLOYMENT.md)** - Complete deployment instructions
- **[Production Checklist](./PRODUCTION-CHECKLIST.md)** - Pre-deployment checklist
- [Nginx Configuration](./nginx/README.md)

## 🧪 Testing

```bash
# Run tests
npm run test

# Build for production
npm run build

# Check application health
npm run health
```

## 🚀 Production Deployment

### Quick Setup

```bash
# Run automated setup
./setup.sh
```

### Deployment Options

**Docker Compose (Recommended)**
```bash
npm run docker:build
npm run docker:up
```

**PM2 Process Manager**
```bash
npm install -g pm2
npm run pm2:start
```

**Direct Node.js**
```bash
npm run start:prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📞 Support

For technical support or security questions:

- Email: support@tripletechnologies.com
- Security Issues: security@tripletechnologies.com

---

**⚠️ Security Disclaimer**: This platform implements industry-standard video protection measures but cannot guarantee 100% prevention of screen recording by determined actors. Use in conjunction with legal terms, monitoring, and content protection strategies appropriate for your use case.

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **React 19** - Latest React features
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching
