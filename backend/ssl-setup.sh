#!/bin/bash

# SSL Certificate Setup Script for BarSan Backend
# This script helps set up SSL certificates using Let's Encrypt

set -e

DOMAIN="myhostserver.sytes.net"
EMAIL="admin@myhostserver.sytes.net"

echo "🔒 Setting up SSL certificates for $DOMAIN..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create SSL directory
mkdir -p ssl

# Check if certificates already exist
if [ -f "ssl/fullchain.pem" ] && [ -f "ssl/privkey.pem" ]; then
    print_warning "SSL certificates already exist. Do you want to renew them?"
    read -p "Renew certificates? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Using existing certificates."
        exit 0
    fi
fi

# Option 1: Use Certbot with Docker
print_status "Setting up SSL certificates using Certbot..."

# Create temporary nginx config for ACME challenge
cat > nginx/conf.d/temp.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF

# Create certbot directory
mkdir -p certbot

# Start temporary nginx for ACME challenge
print_status "Starting temporary nginx for ACME challenge..."
docker run --rm -d \
    --name temp_nginx \
    -p 80:80 \
    -v $(pwd)/nginx/conf.d:/etc/nginx/conf.d \
    -v $(pwd)/certbot:/var/www/certbot \
    nginx:alpine

# Wait for nginx to start
sleep 5

# Run Certbot
print_status "Running Certbot to obtain SSL certificates..."
docker run --rm \
    -v $(pwd)/certbot:/var/www/certbot \
    -v $(pwd)/ssl:/etc/letsencrypt/live/$DOMAIN \
    certbot/certbot \
    certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Stop temporary nginx
docker stop temp_nginx

# Copy certificates to ssl directory
if [ -d "ssl/$DOMAIN" ]; then
    cp ssl/$DOMAIN/fullchain.pem ssl/
    cp ssl/$DOMAIN/privkey.pem ssl/
    print_status "✅ SSL certificates obtained successfully!"
else
    print_error "❌ Failed to obtain SSL certificates."
    print_warning "You can create self-signed certificates for testing:"
    echo ""
    echo "openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\"
    echo "  -keyout ssl/privkey.pem \\"
    echo "  -out ssl/fullchain.pem \\"
    echo "  -subj \"/C=TH/ST=Bangkok/L=Bangkok/O=BarSan/CN=$DOMAIN\""
    echo ""
    
    read -p "Create self-signed certificates? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/privkey.pem \
            -out ssl/fullchain.pem \
            -subj "/C=TH/ST=Bangkok/L=Bangkok/O=BarSan/CN=$DOMAIN"
        print_status "✅ Self-signed certificates created!"
    fi
fi

# Remove temporary config
rm -f nginx/conf.d/temp.conf

# Set proper permissions
chmod 600 ssl/privkey.pem
chmod 644 ssl/fullchain.pem

print_status "🎉 SSL setup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your DNS to point $DOMAIN to your server IP"
echo "   2. Run ./deploy.sh to start the services"
echo "   3. Test your SSL: https://$DOMAIN:3001/health"
