# Verify Node.js and npm Installation
# Run this script after installing Node.js to verify everything is working

Write-Host "`n╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Verifying Node.js and npm Installation              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "✗ Node.js not found!" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "`nChecking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ npm installed: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "✗ npm not found!" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    $allGood = $false
}

# Final result
Write-Host "`n" -NoNewline
if ($allGood) {
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ Installation verified successfully!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Green
    
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Install project packages: npm install" -ForegroundColor White
    Write-Host "2. Create .env file: copy .env.example .env" -ForegroundColor White
    Write-Host "3. Start server: npm run dev`n" -ForegroundColor White
} else {
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "❌ Installation not complete!" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Red
    
    Write-Host "Please install Node.js:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Make sure 'Add to PATH' is checked" -ForegroundColor Yellow
    Write-Host "5. Restart PowerShell after installation`n" -ForegroundColor White
    
    Write-Host "See INSTALL-NODEJS.md for detailed instructions.`n" -ForegroundColor Cyan
}


