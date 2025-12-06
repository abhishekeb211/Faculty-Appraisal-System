# Deployment Guide

This guide covers deployment options for the Faculty Appraisal System, from local development to production environments.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
  - [Vercel](#vercel-recommended)
  - [Netlify](#netlify)
  - [AWS Amplify](#aws-amplify)
  - [Docker](#docker)
  - [Traditional Server](#traditional-server)
- [Environment Configuration](#environment-configuration)
- [CI/CD Setup](#cicd-setup)
- [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (if applicable)
- [ ] Code is linted and formatted (`npm run lint`)
- [ ] Environment variables are configured
- [ ] Backend API is deployed and accessible
- [ ] CORS is properly configured on backend
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in production build
- [ ] All assets load correctly
- [ ] API endpoints are accessible

## Build Process

### Production Build

```bash
# Install dependencies
npm install

# Create production build
npm run build
```

The build process:
1. Compiles React components
2. Optimizes assets (minification, tree-shaking)
3. Generates static files in `dist/` directory
4. Creates optimized bundles for production

### Build Output

```
dist/
├── index.html          # Entry HTML file
├── assets/
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── index-[hash].css   # Compiled CSS
│   └── [other assets]     # Images, fonts, etc.
```

### Build Optimization

The Vite build automatically:
- Minifies JavaScript and CSS
- Tree-shakes unused code
- Code-splits for optimal loading
- Compresses assets
- Generates source maps (for debugging)

## Deployment Options

### Vercel (Recommended)

Vercel is optimized for React and Vite applications with zero-configuration deployment.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Deploy

```bash
# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

#### Step 3: Configure Environment Variables

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add `VITE_BASE_URL` with your production API URL

#### Step 4: Automatic Deployments

Connect your Git repository:
1. Import project from GitHub/GitLab/Bitbucket
2. Vercel automatically deploys on every push
3. Preview deployments for pull requests

#### Vercel Configuration File (`vercel.json`)

Optional configuration file:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Build Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 3: Deploy

```bash
# Login
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

#### Step 4: Environment Variables

Set in Netlify dashboard:
- Site settings → Environment variables
- Add `VITE_BASE_URL`

### AWS Amplify

#### Step 1: Connect Repository

1. Go to AWS Amplify Console
2. Click "New App" → "Host web app"
3. Connect your Git repository

#### Step 2: Build Settings

Amplify auto-detects Vite, but you can customize:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Step 3: Environment Variables

Add in Amplify Console:
- App settings → Environment variables
- Add `VITE_BASE_URL`

### Docker

#### Step 1: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Step 2: Create Nginx Configuration

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 3: Build and Run

```bash
# Build Docker image
docker build -t faculty-appraisal-system .

# Run container
docker run -p 8080:80 \
  -e VITE_BASE_URL=https://api.yourdomain.com \
  faculty-appraisal-system
```

#### Step 4: Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "8080:80"
    environment:
      - VITE_BASE_URL=${VITE_BASE_URL}
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

### Traditional Server

#### Step 1: Build Locally

```bash
npm run build
```

#### Step 2: Upload Files

Upload the `dist/` directory contents to your web server:
- Via FTP/SFTP
- Via SCP
- Via rsync

```bash
# Example with rsync
rsync -avz dist/ user@server:/var/www/html/
```

#### Step 3: Web Server Configuration

**Apache (`.htaccess`):**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment Configuration

### Development Environment

`.env.development`:
```env
VITE_BASE_URL=http://localhost:5000
```

### Production Environment

`.env.production`:
```env
VITE_BASE_URL=https://api.yourdomain.com
```

### Environment-Specific Builds

Vite automatically uses the correct `.env` file:
- Development: `.env.development`
- Production: `.env.production`
- Local: `.env.local` (highest priority, not committed)

### Platform-Specific Configuration

**Vercel:**
- Set in dashboard: Settings → Environment Variables
- Or use `vercel env` CLI command

**Netlify:**
- Set in dashboard: Site settings → Environment variables
- Or use `netlify env:set` CLI command

**AWS Amplify:**
- Set in console: App settings → Environment variables

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_BASE_URL: ${{ secrets.VITE_BASE_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:20
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  script:
    - echo "Deploy to production"
    # Add your deployment commands
  only:
    - main
```

## Troubleshooting

### Issue: Build Fails

**Symptoms:**
- Build errors during `npm run build`
- Module not found errors

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: 404 Errors on Routes

**Symptoms:**
- Direct URL access returns 404
- Refresh on sub-route fails

**Solutions:**
- Ensure server is configured for SPA routing (see server configs above)
- Verify `index.html` is served for all routes

### Issue: Environment Variables Not Working

**Symptoms:**
- `import.meta.env.VITE_BASE_URL` is undefined
- API calls fail

**Solutions:**
- Ensure variables start with `VITE_` prefix
- Rebuild after changing environment variables
- Check platform-specific environment variable settings

### Issue: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API requests blocked

**Solutions:**
- Configure CORS on backend to allow your frontend domain
- Check `VITE_BASE_URL` matches backend URL
- Verify backend CORS headers

### Issue: Assets Not Loading

**Symptoms:**
- Images/icons missing
- CSS not applied

**Solutions:**
- Check asset paths in build output
- Verify base path configuration
- Check server MIME types

## Performance Optimization

### Build Optimization

Already optimized by Vite:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

### Runtime Optimization

- Lazy load routes
- Optimize images
- Enable compression (gzip/brotli)
- Use CDN for static assets

### Monitoring

- Set up error tracking (Sentry, etc.)
- Monitor API response times
- Track user analytics
- Monitor build performance

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Store securely, use environment variables
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure backend CORS properly
5. **Content Security Policy**: Add CSP headers
6. **Dependencies**: Regularly update and audit

## Post-Deployment

1. **Verify Functionality**: Test all features
2. **Check Performance**: Monitor load times
3. **Test on Multiple Browsers**: Ensure compatibility
4. **Monitor Errors**: Set up error tracking
5. **Update Documentation**: Document deployment process

---

For local setup, see [INSTALLATION.md](./INSTALLATION.md). For architecture details, see [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md).

