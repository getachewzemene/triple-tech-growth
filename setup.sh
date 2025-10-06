#!/bin/bash

# Production Setup Script for Triple Technologies
# This script helps automate the initial production setup

set -e

echo "==================================="
echo "Triple Technologies - Setup Script"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Error: Do not run this script as root${NC}"
   exit 1
fi

echo "1. Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v) found${NC}"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker $(docker -v | cut -d' ' -f3 | cut -d',' -f1) found${NC}"
else
    echo -e "${YELLOW}! Docker not found (optional for Docker deployment)${NC}"
fi

# Check Docker Compose (optional)
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose $(docker-compose -v | cut -d' ' -f4 | cut -d',' -f1) found${NC}"
else
    echo -e "${YELLOW}! Docker Compose not found (optional for Docker deployment)${NC}"
fi

echo ""
echo "2. Setting up environment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}Creating .env.production from template...${NC}"
    cp .env.production.example .env.production
    echo -e "${GREEN}✓ .env.production created${NC}"
    echo -e "${YELLOW}! Please edit .env.production and fill in your actual values${NC}"
else
    echo -e "${GREEN}✓ .env.production already exists${NC}"
fi

echo ""
echo "3. Installing dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo "4. Generating Prisma client..."
if command -v npx &> /dev/null; then
    npx prisma generate
    echo -e "${GREEN}✓ Prisma client generated${NC}"
else
    echo -e "${YELLOW}! Skipping Prisma generation (npx not found)${NC}"
fi

echo ""
echo "5. Building application..."
npm run build
echo -e "${GREEN}✓ Application built successfully${NC}"

echo ""
echo "6. Creating necessary directories..."
mkdir -p logs
mkdir -p nginx/ssl
echo -e "${GREEN}✓ Directories created${NC}"

echo ""
echo "==================================="
echo "Setup Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env.production with your production values:"
echo "   nano .env.production"
echo ""
echo "2. Choose a deployment method:"
echo ""
echo "   A) Docker Compose (Recommended):"
echo "      - Setup SSL certificates (see nginx/README.md)"
echo "      - npm run docker:up"
echo ""
echo "   B) PM2 Process Manager:"
echo "      - npm install -g pm2"
echo "      - npm run pm2:start"
echo ""
echo "   C) Direct Node.js:"
echo "      - npm run start:prod"
echo ""
echo "3. Verify health endpoint:"
echo "   curl http://localhost:3000/api/health"
echo ""
echo "4. Review deployment documentation:"
echo "   - DEPLOYMENT.md"
echo "   - PRODUCTION-CHECKLIST.md"
echo "   - PRODUCTION-SETUP.md"
echo ""
echo "For help: support@tripletechnologies.com"
echo ""
