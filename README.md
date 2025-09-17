# TripleAcademy Secure Video Platform

A production-ready, secure video course platform built with Next.js, featuring DRM-like protection, forensic watermarking, and defense-in-depth security measures.

## ⚠️ Important Security Notice

**No system can fully prevent determined screen recording attempts.** This platform implements defense-in-depth strategies to deter casual piracy and provide forensic evidence:

- **Physical cameras** can always record screens
- **OS-level screen recorders** may bypass browser protections  
- **Hardware capture cards** can intercept video signals
- **Rooted/jailbroken devices** may circumvent app-level protections

This platform provides:
- ✅ **Strong deterrence** against casual downloading/sharing
- ✅ **Forensic watermarking** for leak tracing and legal enforcement
- ✅ **Access control** and session management
- ✅ **Enterprise DRM integration** (optional)
- ✅ **Native app protections** for mobile platforms

## 🚀 Features

### Core Security Features
- **Short-lived playback tokens** (90 seconds) with JWT validation
- **Dynamic visible watermarks** with TripleAcademy branding + user info
- **Burned-in forensic watermarks** during video transcoding
- **CloudFront signed URLs** with 5-minute expiry
- **User agent binding** and IP tracking
- **Concurrent stream limiting** (max 2 sessions per user)
- **Rate limiting** on token requests
- **Screen recording detection** (browser-level)

### Video Platform Features
- **Admin course upload** with drag & drop, pause/resume
- **Multi-format support** (MP4, WebM, MOV, AVI up to 1.5GB)
- **Adaptive bitrate streaming** (HLS/DASH ready)
- **Shaka Player integration** with EME for DRM
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

### 4. Admin Access

Default admin credentials (change in production):
- Username: `admin` 
- Password: `triple123`

Access admin panel at: `http://localhost:3000/admin/login`

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

- [Complete Setup Guide](./docs/setup.md)
- [FFmpeg Transcoding Examples](./docs/ffmpeg-transcoding.md)
- [Native App Protection](./docs/native-app-protection.md)
- [API Documentation](./docs/api.md)
- [Security Best Practices](./docs/security.md)

## 🧪 Testing

```bash
# Run tests
npm run test

# Build for production
npm run build
```

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


