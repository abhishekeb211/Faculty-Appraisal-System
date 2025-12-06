# Faculty Appraisal System - Setup Script
# This script will install packages and set up the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Faculty Appraisal System - Setup" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    Write-Host "✓ npm found: $npmVersion`n" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "`nPlease install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download and install the LTS version" -ForegroundColor White
    Write-Host "3. Restart PowerShell and run this script again`n" -ForegroundColor White
    exit 1
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "✗ package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory.`n" -ForegroundColor Yellow
    exit 1
}

# Step 1: Install packages
Write-Host "Step 1: Installing packages..." -ForegroundColor Yellow
Write-Host "This may take 2-5 minutes...`n" -ForegroundColor Gray

try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Packages installed successfully!`n" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Package installation failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`n✗ Error installing packages: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Create .env file
Write-Host "Step 2: Setting up environment file..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
} elseif (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
    Write-Host "  Please edit .env and set VITE_BASE_URL=http://localhost:5000" -ForegroundColor Yellow
} else {
    # Create basic .env file
    @"
# Faculty Appraisal System - Environment Variables
VITE_BASE_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✓ Created .env file" -ForegroundColor Green
    Write-Host "  Please edit .env and set your backend API URL" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file and set VITE_BASE_URL to your backend API URL" -ForegroundColor White
Write-Host "2. Make sure your backend API server is running" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. Open http://localhost:5173 in your browser`n" -ForegroundColor White

Write-Host "To start the development server, run:" -ForegroundColor Cyan
Write-Host "  npm run dev`n" -ForegroundColor Green


