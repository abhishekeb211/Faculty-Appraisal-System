# Automated Continuous Loop System - User Guide

## Overview

The Automated Continuous Loop System provides a fully automated validation, fixing, testing, building, and deployment cycle. It runs continuously to ensure code quality, automatically fixes issues where possible, and deploys when all checks pass.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Automated Continuous Loop System                │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────┐ │
│  │  Check   │───▶│  Auto-   │───▶│  Test    │───▶│Deploy│ │
│  │  Code    │    │  Fix     │    │  & Build │    │      │ │
│  └──────────┘    └──────────┘    └──────────┘    └──────┘ │
│       ▲                                                   │ │
│       │                                                   ▼ │
│  ┌────┴──────────┐                            ┌──────────┐│
│  │  Health       │◀───────────────────────────│ Validate ││
│  │  Monitor      │                            │Deployment││
│  └───────────────┘                            └──────────┘│
│       │                                                   │
│       └─────────────────── Loop ─────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Local Continuous Loop

Run the continuous loop locally:

```bash
# Basic usage
./scripts/continuous-loop.sh

# Custom interval (in seconds)
INTERVAL=3600 ./scripts/continuous-loop.sh

# With auto-deploy enabled
AUTO_DEPLOY=true INTERVAL=1800 ./scripts/continuous-loop.sh
```

### Watch Mode (Development)

For development with automatic fixes on file save:

```bash
./scripts/watch-and-fix.sh
```

### One-Time Auto-Fix

Run auto-fix once:

```bash
# Using shell script
./scripts/auto-fix.sh

# Using Node.js script directly
node scripts/auto-fix.js

# Dry run mode (see what would be fixed)
./scripts/auto-fix.sh --dry-run
```

## Configuration

### Environment Variables

Configure the loop behavior using environment variables:

```bash
# Loop interval in seconds (default: 3600 = 1 hour)
INTERVAL=1800

# Enable/disable auto-fix (default: true)
AUTO_FIX=true

# Enable/disable auto-deployment (default: false)
AUTO_DEPLOY=false

# Enable/disable tests (default: true)
RUN_TESTS=true

# Enable/disable health checks (default: true)
HEALTH_CHECK=true

# Enable error notifications (default: false)
NOTIFY_ON_ERROR=false

# Deployment URL for health checks
DEPLOYMENT_URL=https://your-app.com

# Health check endpoint
HEALTH_CHECK_URL=https://your-app.com/health
```

### Fix Patterns Configuration

Edit `scripts/fix-patterns.json` to configure auto-fix behavior:

```json
{
  "patterns": {
    "consoleLogReplacement": {
      "enabled": true,
      "fileExtensions": [".js", ".jsx", ".ts", ".tsx"]
    },
    "codeFormatting": {
      "enabled": true,
      "tools": ["prettier"]
    },
    "linting": {
      "enabled": true,
      "autoFix": true
    }
  },
  "safety": {
    "backupBeforeFix": true,
    "dryRunMode": false,
    "maxFilesPerRun": 100
  }
}
```

## Loop Flow

1. **Code Quality Check**: Runs ESLint and other quality checks
2. **Auto-Fix**: Automatically fixes issues where possible
3. **Testing**: Runs test suite
4. **Building**: Builds the application
5. **Deployment**: Deploys if on main/master branch and all checks pass
6. **Health Check**: Validates deployment health
7. **Wait**: Waits for configured interval
8. **Loop**: Returns to step 1

## Scripts Reference

### Auto-Fix Scripts

- **`scripts/auto-fix.sh`** - Main auto-fix script (Bash)
- **`scripts/auto-fix.ps1`** - Auto-fix script for PowerShell (Windows)
- **`scripts/auto-fix.js`** - Intelligent auto-fix utility (Node.js)

**Options:**
- `--dry-run` / `-d`: Preview changes without applying
- `--log-level=LEVEL`: Set log level (ERROR, WARN, INFO, DEBUG)

### Continuous Loop

- **`scripts/continuous-loop.sh`** - Main continuous loop orchestrator

**Environment Variables:**
- `INTERVAL`: Wait time between loops (seconds)
- `AUTO_FIX`: Enable auto-fix (true/false)
- `AUTO_DEPLOY`: Enable auto-deploy (true/false)
- `RUN_TESTS`: Run tests (true/false)
- `HEALTH_CHECK`: Run health checks (true/false)

### Health Checks

- **`scripts/health-check.sh`** - Basic deployment health checker
- **`scripts/validate-deployment.sh`** - Comprehensive deployment validation

**Environment Variables:**
- `DEPLOYMENT_URL`: URL to check
- `HEALTH_CHECK_URL`: Health endpoint URL
- `MAX_RETRIES`: Number of retry attempts (default: 3)
- `TIMEOUT`: Request timeout in seconds (default: 30)

### Monitoring

- **`scripts/monitor-health.sh`** - Continuous health monitoring
- **`scripts/generate-status-report.sh`** - Generate status reports

**Environment Variables:**
- `MONITOR_INTERVAL`: Check interval in seconds (default: 300)
- `LOG_FILE`: Custom log file path
- `METRICS_FILE`: Metrics JSON file path

### Watch Mode

- **`scripts/watch-and-fix.sh`** - File watcher with auto-fix

**Requirements:**
- macOS: Install `fswatch` via Homebrew: `brew install fswatch`
- Linux: Install `inotify-tools`: `sudo apt-get install inotify-tools`

## GitHub Actions

### Continuous Loop Workflow

Runs automatically every hour to validate and auto-fix code.

**Trigger:**
- Scheduled: Every hour (cron: `0 * * * *`)
- Manual: Via workflow_dispatch

**Location:** `.github/workflows/continuous-loop.yml`

### Auto-Fix Workflow

Automatically fixes code quality issues on pull requests.

**Trigger:**
- Pull request: opened, synchronized, reopened
- Manual: Via workflow_dispatch

**Location:** `.github/workflows/auto-fix.yml`

### Continuous Deployment Workflow

Deploys to production after validation passes.

**Trigger:**
- Push to main/master branch
- Manual: Via workflow_dispatch

**Location:** `.github/workflows/continuous-deploy.yml`

## Status Reports

Status reports are generated automatically and saved to the `reports/` directory:

- **HTML Reports**: Visual status dashboard
- **JSON Reports**: Machine-readable status data

View reports:
```bash
# Open latest HTML report
open reports/status-report-*.html

# Or on Linux
xdg-open reports/status-report-*.html
```

## Safety Features

### Dry Run Mode

Test fixes without applying:
```bash
./scripts/auto-fix.sh --dry-run
```

### Backup Before Fix

Backups are created automatically (configurable in `fix-patterns.json`):
- Location: `.backups/` directory
- Format: Preserves directory structure

### Manual Approval

Require approval for major fixes (configure in `fix-patterns.json`):
```json
{
  "safety": {
    "requireApproval": true
  }
}
```

### Rollback Capability

Automatic rollback on deployment failure (configure in deployment scripts).

## Troubleshooting

### Scripts Not Executable

On Linux/macOS, make scripts executable:
```bash
chmod +x scripts/*.sh
```

### File Watcher Not Working

Install required dependencies:
- **macOS**: `brew install fswatch`
- **Linux**: `sudo apt-get install inotify-tools`

### Auto-Fix Not Working

1. Check Node.js and npm are installed: `node --version && npm --version`
2. Verify dependencies: `npm install`
3. Check configuration: `scripts/fix-patterns.json`
4. Run in dry-run mode to see what would be fixed

### Continuous Loop Stopped

1. Check log files in `reports/` directory
2. Verify environment variables are set correctly
3. Check for errors in the status file: `reports/loop-status.json`

### Deployment Health Check Failing

1. Verify `DEPLOYMENT_URL` is set correctly
2. Check if the deployment is actually live
3. Review health check logs
4. Test endpoint manually: `curl $DEPLOYMENT_URL`

## Best Practices

1. **Start with Dry Run**: Always test with `--dry-run` first
2. **Review Changes**: Check auto-fixes before committing
3. **Configure Safely**: Enable features gradually
4. **Monitor Logs**: Regularly check log files
5. **Set Appropriate Intervals**: Don't run loops too frequently
6. **Use Watch Mode for Development**: Faster feedback during development
7. **Review GitHub Actions**: Check workflow runs regularly

## Integration with CI/CD

The system integrates seamlessly with:

- **GitHub Actions**: Workflows configured automatically
- **Vercel**: Deployment step included
- **Netlify**: Deployment step included (commented out)
- **Custom Platforms**: Easy to extend

## Customization

### Adding Custom Fix Patterns

Edit `scripts/auto-fix.js` to add custom fix patterns:

```javascript
customFixPattern(filePath) {
  // Your custom fix logic
}
```

### Adding Custom Health Checks

Edit `scripts/health-check.sh` to add custom checks:

```bash
custom_health_check() {
  # Your custom check
}
```

### Custom Deployment Logic

Edit deployment scripts to add custom deployment steps.

## Support

For issues or questions:
1. Check the logs in `reports/` directory
2. Review configuration files
3. Check GitHub Actions workflow runs
4. Review this documentation

---

**Last Updated**: December 2024  
**Maintained By**: Development Team