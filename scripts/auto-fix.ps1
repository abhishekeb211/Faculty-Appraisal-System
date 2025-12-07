# Auto-Fix Script for PowerShell - Windows-compatible version
# Comprehensive auto-fix script for common code quality issues

param(
    [switch]$DryRun,
    [switch]$Force,
    [string]$LogFile
)

$ErrorActionPreference = "Stop"

# Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

if (-not $LogFile) {
    $Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $LogFile = Join-Path $ProjectRoot "reports\auto-fix-$Timestamp.log"
}

# Create reports directory if it doesn't exist
$ReportsDir = Split-Path -Parent $LogFile
if (-not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir -Force | Out-Null
}

function Write-Log {
    param(
        [string]$Level,
        [string]$Message,
        [string]$Color = "White"
    )
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] [$Level] $Message"
    
    Write-Host $LogMessage -ForegroundColor $Color
    Add-Content -Path $LogFile -Value $LogMessage
}

function Write-LogInfo {
    param([string]$Message)
    Write-Log "INFO" $Message "Cyan"
}

function Write-LogSuccess {
    param([string]$Message)
    Write-Log "SUCCESS" $Message "Green"
}

function Write-LogWarn {
    param([string]$Message)
    Write-Log "WARN" $Message "Yellow"
}

function Write-LogError {
    param([string]$Message)
    Write-Log "ERROR" $Message "Red"
}

function Write-LogSection {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host ""
    Add-Content -Path $LogFile -Value "`n============================================================`n$Title`n============================================================`n"
}

Set-Location $ProjectRoot

Write-LogSection "Auto-Fix System"
Write-LogInfo "Starting auto-fix$(if ($DryRun) { " (DRY RUN MODE)" } else { "" })..."

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-LogInfo "Node.js version: $nodeVersion"
} catch {
    Write-LogError "Node.js is not installed. Please install Node.js to use auto-fix."
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-LogInfo "npm version: $npmVersion"
} catch {
    Write-LogError "npm is not installed. Please install npm to use auto-fix."
    exit 1
}

# Run the Node.js auto-fix utility
Write-LogInfo "Running intelligent auto-fix utility..."

$AutoFixArgs = @()
if ($DryRun) {
    $AutoFixArgs += "--dry-run"
}
$AutoFixArgs += "--log-level=INFO"

try {
    $AutoFixPath = Join-Path $ScriptDir "auto-fix.js"
    & node $AutoFixPath $AutoFixArgs
    if ($LASTEXITCODE -ne 0) {
        Write-LogWarn "Auto-fix utility completed with warnings"
    } else {
        Write-LogSuccess "Auto-fix utility completed successfully"
    }
} catch {
    Write-LogError "Error running auto-fix utility: $_"
}

# Run Prettier if available
Write-LogInfo "Running Prettier auto-formatting..."
if ($DryRun) {
    Write-LogInfo "[DRY RUN] Would run: npx prettier --write `"src/**/*.{js,jsx,ts,tsx}`""
} else {
    try {
        & npx prettier --write "src/**/*.{js,jsx,ts,tsx}" 2>&1 | Tee-Object -FilePath $LogFile -Append
        Write-LogSuccess "Prettier formatting completed"
    } catch {
        Write-LogWarn "Prettier completed with warnings: $_"
    }
}

# Run ESLint auto-fix if available
Write-LogInfo "Running ESLint auto-fix..."
if ($DryRun) {
    Write-LogInfo "[DRY RUN] Would run: npx eslint --fix `"src/**/*.{js,jsx,ts,tsx}`""
} else {
    try {
        & npx eslint --fix "src/**/*.{js,jsx,ts,tsx}" 2>&1 | Tee-Object -FilePath $LogFile -Append
        Write-LogSuccess "ESLint auto-fix completed"
    } catch {
        Write-LogWarn "ESLint completed (some issues may remain unfixable): $_"
    }
}

# Type check if TypeScript
if (Test-Path "tsconfig.json") {
    Write-LogInfo "Running TypeScript type check..."
    if ($DryRun) {
        Write-LogInfo "[DRY RUN] Would run: npm run type-check"
    } else {
        try {
            & npm run type-check 2>&1 | Tee-Object -FilePath $LogFile -Append
            Write-LogSuccess "TypeScript type check passed"
        } catch {
            Write-LogWarn "TypeScript type check found issues (non-blocking): $_"
        }
    }
}

Write-LogSection "Auto-Fix Complete"
Write-LogSuccess "Auto-fix process completed. Check log: $LogFile"