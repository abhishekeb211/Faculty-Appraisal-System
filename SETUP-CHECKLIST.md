# Automated Loop System - Setup Checklist

Use this checklist to set up and configure the automated continuous deployment and auto-fix loop system.

## ✅ Initial Setup

### 1. Make Scripts Executable (Linux/macOS)

**On Linux/macOS:**
```bash
# Run the setup script
bash scripts/setup-permissions.sh

# Or manually:
chmod +x scripts/*.sh
chmod +x scripts/utils/*.js
```

**On Windows:**
- Scripts should work via Git Bash or WSL
- Node.js scripts work natively: `node scripts/auto-fix.js`

### 2. Test Auto-Fix System

```bash
# Test with dry-run (no changes applied)
npm run auto-fix:dry-run

# Or using Node.js directly
node scripts/auto-fix.js --dry-run --log-level=INFO
```

**Expected Output:**
- Should scan files and show what would be fixed
- No errors should occur
- Check log files in `reports/` directory

### 3. Review Configuration

- [ ] Review `scripts/fix-patterns.json` - Configure auto-fix behavior
- [ ] Review `.gitignore` - Ensure reports and backups are ignored
- [ ] Review `package.json` - Verify scripts are added correctly

## ✅ GitHub Actions Setup

### 4. Configure GitHub Secrets

**For Vercel Deployment:**
- [ ] `VERCEL_TOKEN` - Get from [Vercel Settings > Tokens](https://vercel.com/account/tokens)
- [ ] `VERCEL_ORG_ID` - From Vercel dashboard/organization settings
- [ ] `VERCEL_PROJECT_ID` - From Vercel project settings

**For Netlify Deployment:**
- [ ] `NETLIFY_AUTH_TOKEN` - Generate from [Netlify User Settings](https://app.netlify.com/user/applications)
- [ ] `NETLIFY_SITE_ID` - From Netlify site settings

**For Health Checks:**
- [ ] `DEPLOYMENT_URL` - Your deployed application URL

**How to Add Secrets:**
1. Go to GitHub repository
2. Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret with exact name and value

See `GITHUB-ACTIONS-SETUP.md` for detailed instructions.

### 5. Review Workflow Files

- [ ] `.github/workflows/continuous-deploy.yml` - Deployment workflow
- [ ] `.github/workflows/auto-fix.yml` - Auto-fix on PRs
- [ ] `.github/workflows/continuous-loop.yml` - Scheduled automation

**Customization Options:**
- Modify cron schedule in `continuous-loop.yml`
- Enable/disable deployment steps
- Adjust timeout values
- Customize deployment platform

## ✅ Local Testing

### 6. Test Individual Components

**Auto-Fix:**
```bash
npm run auto-fix:dry-run          # Preview changes
npm run auto-fix                  # Apply fixes
```

**Health Check:**
```bash
npm run health-check              # Basic health check
DEPLOYMENT_URL=https://your-app.com npm run validate-deployment
```

**Status Report:**
```bash
npm run status-report             # Generate HTML/JSON reports
```

**Watch Mode (Development):**
```bash
npm run watch-fix                 # Auto-fix on file changes
```

**Continuous Loop (Local):**
```bash
INTERVAL=3600 npm run loop        # Run loop every hour
```

### 7. Test Build and Deployment Steps

```bash
# Run full validation cycle
npm run lint                      # Check code quality
npm run type-check                # TypeScript validation
npm run test                      # Run tests
npm run build                     # Build application
npm run health-check              # Verify build
```

## ✅ Configuration Customization

### 8. Customize Auto-Fix Patterns

Edit `scripts/fix-patterns.json`:

**Enable/Disable Patterns:**
```json
{
  "patterns": {
    "consoleLogReplacement": {
      "enabled": true,        // Set to false to disable
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
  }
}
```

**Safety Settings:**
```json
{
  "safety": {
    "backupBeforeFix": true,     // Create backups before fixing
    "dryRunMode": false,         // Default mode (use --dry-run flag)
    "maxFilesPerRun": 100,       // Limit files processed
    "excludedPaths": [
      "node_modules",
      "dist",
      "build"
    ]
  }
}
```

### 9. Customize Workflow Schedules

Edit `.github/workflows/continuous-loop.yml`:

```yaml
schedule:
  - cron: '0 * * * *'    # Every hour (current)
  # Options:
  # '0 */2 * * *'       # Every 2 hours
  # '0 0 * * *'         # Daily at midnight
  # '0 9 * * 1-5'       # Weekdays at 9 AM
```

## ✅ Deployment Configuration

### 10. Configure Deployment Platform

**For Vercel:**
- Already configured in `.github/workflows/continuous-deploy.yml`
- Just add the required secrets (see step 4)

**For Netlify:**
- Uncomment Netlify section in `continuous-deploy.yml`
- Add required secrets
- Adjust `publish-dir` if needed

**For Custom Platform:**
- Add custom deployment step in workflow file
- Configure environment variables
- Test deployment manually first

### 11. Configure Health Checks

**Set Deployment URL:**
- Add as GitHub secret: `DEPLOYMENT_URL`
- Or set in workflow file as environment variable

**Customize Health Checks:**
- Edit `scripts/health-check.sh` for basic checks
- Edit `scripts/validate-deployment.sh` for comprehensive validation

## ✅ Verification

### 12. Verify Everything Works

**Local Verification:**
- [ ] Auto-fix runs without errors
- [ ] Health checks pass
- [ ] Status reports generate correctly
- [ ] Build succeeds
- [ ] Tests pass

**GitHub Actions Verification:**
- [ ] Workflows are visible in Actions tab
- [ ] Auto-fix workflow runs on PR creation
- [ ] Continuous loop workflow is scheduled
- [ ] Deployment workflow runs on push to main

**First Deployment:**
- [ ] Monitor Actions tab during first deployment
- [ ] Verify deployment succeeds
- [ ] Check health checks pass
- [ ] Verify deployed application works

## ✅ Documentation Review

- [ ] Read `AUTOMATED-LOOP-GUIDE.md` - Complete user guide
- [ ] Read `AUTO-FIX-DOCUMENTATION.md` - Auto-fix details
- [ ] Read `GITHUB-ACTIONS-SETUP.md` - GitHub setup guide
- [ ] Review this checklist

## 🚀 Quick Start Commands

```bash
# Test auto-fix (dry run)
npm run auto-fix:dry-run

# Apply auto-fixes
npm run auto-fix

# Generate status report
npm run status-report

# Health check
npm run health-check

# Watch mode (development)
npm run watch-fix

# Continuous loop (local)
INTERVAL=3600 npm run loop
```

## 📝 Notes

- All scripts create logs in `reports/` directory
- Backups are stored in `.backups/` (if enabled)
- Status reports are generated as HTML and JSON
- GitHub Actions workflows run automatically based on triggers

## 🔧 Troubleshooting

**If auto-fix doesn't work:**
1. Check Node.js version: `node --version` (should be 20+)
2. Verify dependencies: `npm install`
3. Check configuration: `scripts/fix-patterns.json`
4. Review logs: `reports/*.log`

**If workflows don't run:**
1. Check workflow files are in `.github/workflows/`
2. Verify triggers (push, PR, schedule)
3. Check Actions tab for errors
4. Verify secrets are added correctly

**If deployment fails:**
1. Check workflow logs in Actions tab
2. Verify secrets are correct
3. Check deployment platform status
4. Review deployment step errors

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Last Updated**: December 2024