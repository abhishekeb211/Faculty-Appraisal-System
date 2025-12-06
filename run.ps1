# Faculty Appraisal System - Run Script
# This script will start the development server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Faculty Appraisal System" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/`n" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "✗ Packages not installed!" -ForegroundColor Red
    Write-Host "Running setup first...`n" -ForegroundColor Yellow
    & .\setup.ps1
    if ($LASTEXITCODE -ne 0) {
        exit 1
    }
    Write-Host "`n"
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠ Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env file...`n" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
    } else {
        @"
VITE_BASE_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8
    }
    Write-Host "✓ Created .env file" -ForegroundColor Green
    Write-Host "  Please edit .env and set your backend API URL`n" -ForegroundColor Yellow
}

Write-Host "Starting development server...`n" -ForegroundColor Yellow
Write-Host "The app will be available at: http://localhost:5173`n" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Gray

# Start the development server
npm run dev


