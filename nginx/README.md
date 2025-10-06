# Nginx Configuration Guide

This directory contains Nginx configuration files for production deployment.

## Directory Structure

```
nginx/
├── nginx.conf           # Main Nginx configuration
├── conf.d/
│   └── default.conf    # Site-specific configuration
├── ssl/                # SSL certificates (not in git)
│   ├── cert.pem       # SSL certificate
│   └── key.pem        # Private key
└── README.md          # This file
```

## SSL Certificate Setup

### Option 1: Let's Encrypt (Recommended)

Let's Encrypt provides free SSL certificates with automatic renewal.

#### Using Certbot

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone \
  -d tripletechnologies.com \
  -d www.tripletechnologies.com

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/tripletechnologies.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/tripletechnologies.com/privkey.pem nginx/ssl/key.pem

# Set proper permissions
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem

# Start Nginx
sudo systemctl start nginx
```

#### Automatic Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Set up auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Or add to crontab
sudo crontab -e
# Add: 0 0,12 * * * certbot renew --quiet --deploy-hook "docker-compose restart nginx"
```

### Option 2: Self-Signed Certificate (Development Only)

For local testing only. **Never use in production!**

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=ET/ST=Addis Ababa/L=Addis Ababa/O=Triple Technologies/CN=tripletechnologies.com"
```

### Option 3: Commercial Certificate

If using a commercial SSL certificate:

1. Purchase certificate from a trusted CA (DigiCert, Comodo, etc.)
2. Generate a CSR (Certificate Signing Request):
   ```bash
   openssl req -new -newkey rsa:2048 -nodes \
     -keyout nginx/ssl/key.pem \
     -out request.csr
   ```
3. Submit CSR to your CA
4. Download the certificate files
5. Copy to `nginx/ssl/cert.pem` (full chain)
6. Ensure `nginx/ssl/key.pem` contains your private key

## Configuration

### Update Domain Names

Edit `nginx/conf.d/default.conf` and replace:
- `tripletechnologies.com` with your domain
- `www.tripletechnologies.com` with your www subdomain

### SSL Certificate Paths

Ensure the paths in `nginx/conf.d/default.conf` match your certificate locations:

```nginx
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
```

### Test Configuration

Before applying changes:

```bash
# Test Nginx configuration
sudo nginx -t

# Or with Docker
docker-compose exec nginx nginx -t
```

### Reload Configuration

After making changes:

```bash
# Reload Nginx
sudo systemctl reload nginx

# Or with Docker
docker-compose restart nginx
```

## Security Best Practices

### SSL Configuration

The configuration includes:
- TLS 1.2 and 1.3 only (no older versions)
- Strong cipher suites
- HSTS (HTTP Strict Transport Security)
- OCSP stapling
- Perfect Forward Secrecy

### Security Headers

The following headers are automatically added:
- `Strict-Transport-Security`: Forces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: XSS protection
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Controls browser features

### Rate Limiting

Rate limiting zones are configured:
- General: 10 requests/second with burst of 20
- API: 5 requests/second with burst of 10
- Connection limit: 10 concurrent connections per IP

## Performance Optimization

### Caching

Static assets are cached for 1 year:
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.ico`
- Fonts: `.woff`, `.woff2`, `.ttf`, `.eot`
- Styles: `.css`
- Scripts: `.js`
- Vectors: `.svg`

### Compression

Gzip compression is enabled for:
- Text files
- JSON
- JavaScript
- CSS
- XML
- Fonts
- SVG

### HTTP/2

HTTP/2 is enabled for better performance:
```nginx
listen 443 ssl http2;
```

## Troubleshooting

### Certificate Issues

```bash
# Check certificate validity
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Check certificate expiration
openssl x509 -in nginx/ssl/cert.pem -noout -enddate

# Verify certificate chain
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt nginx/ssl/cert.pem
```

### SSL Test

Test your SSL configuration:
```bash
# Using OpenSSL
openssl s_client -connect tripletechnologies.com:443 -servername tripletechnologies.com

# Using curl
curl -vI https://tripletechnologies.com
```

Online tools:
- https://www.ssllabs.com/ssltest/
- https://www.whynopadlock.com/

### Common Issues

#### "Certificate and private key do not match"

```bash
# Compare certificate and key
openssl x509 -noout -modulus -in nginx/ssl/cert.pem | openssl md5
openssl rsa -noout -modulus -in nginx/ssl/key.pem | openssl md5
# These should produce the same hash
```

#### "Permission denied" on certificate files

```bash
# Fix permissions
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem
sudo chown root:root nginx/ssl/*.pem
```

#### Mixed content warnings

Ensure all resources are loaded over HTTPS:
- Images: `https://...`
- Scripts: `https://...`
- Stylesheets: `https://...`
- API calls: `https://...`

## Docker Compose Integration

The Nginx service in `docker-compose.yml` mounts these files:

```yaml
volumes:
  - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
  - ./nginx/ssl:/etc/nginx/ssl:ro
  - ./nginx/conf.d:/etc/nginx/conf.d:ro
```

Ensure certificate files exist before starting:

```bash
# Check files
ls -l nginx/ssl/

# Start services
docker-compose up -d nginx
```

## Monitoring

### Access Logs

```bash
# View access logs
docker-compose logs -f nginx

# Or on host
sudo tail -f /var/log/nginx/access.log
```

### Error Logs

```bash
# View error logs
docker-compose logs nginx | grep error

# Or on host
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Expiry

Set up monitoring for certificate expiration:

```bash
# Check certificate expiration
openssl x509 -enddate -noout -in nginx/ssl/cert.pem

# Create monitoring script
cat > check-cert-expiry.sh << 'EOF'
#!/bin/bash
CERT="/path/to/nginx/ssl/cert.pem"
DAYS_THRESHOLD=30

EXPIRY_DATE=$(openssl x509 -enddate -noout -in "$CERT" | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

if [ $DAYS_LEFT -lt $DAYS_THRESHOLD ]; then
  echo "Warning: SSL certificate expires in $DAYS_LEFT days!"
  # Send alert (email, Slack, etc.)
fi
EOF

chmod +x check-cert-expiry.sh

# Add to cron
(crontab -l 2>/dev/null; echo "0 0 * * * /path/to/check-cert-expiry.sh") | crontab -
```

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [Nginx Security Headers](https://www.nginx.com/blog/http-strict-transport-security-hsts-and-nginx/)
