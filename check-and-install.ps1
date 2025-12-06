# Faculty Appraisal System - Check and Install Helper
# This script checks prerequisites and guides you through installation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Faculty Appraisal System - Setup Check" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    if ($nodeVersion -and $npmVersion) {
        Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
        Write-Host "[OK] npm: $npmVersion`n" -ForegroundColor Green
        
        # Check if node_modules exists
        if (-not (Test-Path "node_modules")) {
            Write-Host "[!] Dependencies not installed" -ForegroundColor Yellow
            Write-Host "Installing dependencies...`n" -ForegroundColor Yellow
            npm install
            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n[OK] Dependencies installed!`n" -ForegroundColor Green
            } else {
                Write-Host "`n[ERROR] Failed to install dependencies" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "[OK] Dependencies already installed`n" -ForegroundColor Green
        }
        
        # Check .env file
        if (-not (Test-Path ".env")) {
            Write-Host "[!] .env file not found" -ForegroundColor Yellow
            Write-Host "Creating .env file...`n" -ForegroundColor Yellow
            "VITE_BASE_URL=http://localhost:5000" | Out-File -FilePath ".env" -Encoding utf8
            Write-Host "[OK] Created .env file`n" -ForegroundColor Green
            Write-Host "  Edit .env to change backend URL if needed`n" -ForegroundColor Gray
        } else {
            Write-Host "[OK] .env file exists`n" -ForegroundColor Green
        }
        
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Starting development server...`n" -ForegroundColor Green
        Write-Host "The app will be available at: http://localhost:5173`n" -ForegroundColor Cyan
        Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Gray
        Write-Host "========================================`n" -ForegroundColor Cyan
        
        npm run dev
        
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "`nTo install Node.js:" -ForegroundColor Yellow
    Write-Host "1. I've opened https://nodejs.org/ in your browser" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer and check 'Add to PATH'" -ForegroundColor White
    Write-Host "4. Restart PowerShell" -ForegroundColor White
    Write-Host "5. Run this script again: .\check-and-install.ps1`n" -ForegroundColor White
    
    # Try to open Node.js download page
    try {
        Start-Process "https://nodejs.org/"
        Write-Host "[INFO] Opened Node.js download page in your browser`n" -ForegroundColor Cyan
    } catch {
        Write-Host "[INFO] Please visit https://nodejs.org/ to download Node.js`n" -ForegroundColor Cyan
    }
    
    exit 1
}

