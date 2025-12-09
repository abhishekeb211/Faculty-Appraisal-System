# Direct Deployment Script for Faculty Appraisal System
# This script builds and deploys the application directly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Faculty Appraisal System - Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Step 2: Install dependencies if needed
Write-Host "[2/4] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✓ Dependencies ready" -ForegroundColor Green
Write-Host ""

# Step 3: Build production bundle
Write-Host "[3/4] Building production bundle..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "dist")) {
    Write-Host "ERROR: Build output 'dist' folder not found!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy to Vercel
Write-Host "[4/4] Deploying to Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "If this is your first time, you'll need to:" -ForegroundColor Cyan
Write-Host "  1. Log in to Vercel (opens browser)" -ForegroundColor Cyan
Write-Host "  2. Link your project (or create new)" -ForegroundColor Cyan
Write-Host "  3. Set environment variables if needed" -ForegroundColor Cyan
Write-Host ""

# Deploy to production
vercel --prod
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Deploy manually at https://vercel.com/new" -ForegroundColor Yellow
    Write-Host "Or use: vercel (for preview deployment)" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is now live!" -ForegroundColor Cyan
Write-Host ""
