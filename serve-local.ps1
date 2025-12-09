# Serve Production Build Locally
# This script builds and serves the production bundle on localhost

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Faculty Appraisal System - Local Production Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build
Write-Host "[1/2] Building production bundle..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green
Write-Host ""

# Step 2: Serve
Write-Host "[2/2] Starting local production server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:4173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run preview
