# GitHub Actions Setup Guide

This guide will help you configure GitHub Actions secrets and customize the automated deployment workflows.

## Required Secrets

### For Vercel Deployment

If you're using Vercel for deployment, you'll need to add these secrets to your GitHub repository:

1. **VERCEL_TOKEN**
   - Go to [Vercel Settings > Tokens](https://vercel.com/account/tokens)
   - Create a new token or use an existing one
   - Copy the token
   - Add to GitHub: Settings > Secrets and variables > Actions > New repository secret
   - Name: `VERCEL_TOKEN`
   - Value: Your Vercel token

2. **VERCEL_ORG_ID**
   - Go to your Vercel dashboard
   - Check your organization settings or project settings
   - The Org ID is usually visible in your project settings or API responses
   - Add to GitHub: Settings > Secrets and variables > Actions > New repository secret
   - Name: `VERCEL_ORG_ID`
   - Value: Your Vercel organization ID

3. **VERCEL_PROJECT_ID**
   - Go to your Vercel project settings
   - The Project ID is visible in your project settings
   - Or check the `.vercel/project.json` file (if it exists)
   - Add to GitHub: Settings > Secrets and variables > Actions > New repository secret
   - Name: `VERCEL_PROJECT_ID`
   - Value: Your Vercel project ID

### For Netlify Deployment

If you're using Netlify, uncomment the Netlify deployment section in `.github/workflows/continuous-deploy.yml` and add:

1. **NETLIFY_AUTH_TOKEN**
   - Go to [Netlify User Settings > Applications > Personal access tokens](https://app.netlify.com/user/applications)
   - Generate a new access token
   - Add to GitHub: Settings > Secrets and variables > Actions > New repository secret
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: Your Netlify auth token

2. **NETLIFY_SITE_ID**
   - Go to your Netlify site settings
   - The Site ID is visible in Site settings > General
   - Add to GitHub: Settings > Secrets and variables > Actions > New repository secret
   - Name: `NETLIFY_SITE_ID`
   - Value: Your Netlify site ID

### For Health Checks

1. **DEPLOYMENT_URL**
   - The URL where your application is deployed
   - Example: `https://your-app.vercel.app` or `https://your-app.netlify.app`
   - Add to GitHub: Settings > Secrets and variables > Actions > New repository secret
   - Name: `DEPLOYMENT_URL`
   - Value: Your deployment URL

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (in the repository navigation)
3. Click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Enter the secret name and value
6. Click **Add secret**

## Workflow Configuration

### Continuous Deployment Workflow

The workflow (`.github/workflows/continuous-deploy.yml`) will automatically:
- Run on pushes to `main` or `master` branch
- Validate code (lint, type check, tests)
- Build the application
- Deploy to your configured platform
- Validate deployment health

**To enable deployment:**
1. Add the required secrets (see above)
2. The workflow will automatically use them

**To disable automatic deployment:**
- Remove or comment out the deployment steps in the workflow file

### Auto-Fix Workflow

The auto-fix workflow (`.github/workflows/auto-fix.yml`) will:
- Run on pull requests automatically
- Fix code quality issues
- Commit fixes back to the PR branch

**Permissions required:**
- `contents: write` - To commit fixes
- `pull-requests: write` - To comment on PRs

These are already configured in the workflow file.

### Continuous Loop Workflow

The continuous loop workflow (`.github/workflows/continuous-loop.yml`) will:
- Run every hour (scheduled)
- Auto-fix code issues
- Validate code quality
- Generate status reports

**To modify the schedule:**
Edit the cron expression in `.github/workflows/continuous-loop.yml`:
```yaml
schedule:
  - cron: '0 * * * *'  # Every hour at minute 0
```

Cron format: `minute hour day month weekday`
- `0 * * * *` = Every hour
- `0 */2 * * *` = Every 2 hours
- `0 0 * * *` = Daily at midnight
- `0 9 * * 1-5` = Weekdays at 9 AM

## Testing the Setup

1. **Test Auto-Fix Locally:**
   ```bash
   npm run auto-fix:dry-run
   ```

2. **Test Health Check:**
   ```bash
   npm run health-check
   ```

3. **Test Deployment Workflow:**
   - Create a test branch
   - Make a small change
   - Push to trigger the workflow
   - Check Actions tab in GitHub

## Troubleshooting

### Deployment Not Working

1. **Check Secrets:**
   - Verify all required secrets are added
   - Check secret names match exactly (case-sensitive)
   - Verify secret values are correct

2. **Check Workflow Logs:**
   - Go to Actions tab in GitHub
   - Click on the failed workflow run
   - Check error messages in the logs

3. **Check Deployment Platform:**
   - Verify your deployment platform is accessible
   - Check platform status page
   - Verify API tokens are valid

### Auto-Fix Not Running

1. **Check Permissions:**
   - Ensure workflow has `contents: write` permission
   - Check if branch protection rules are blocking commits

2. **Check Workflow Triggers:**
   - Verify workflow is triggered on PR events
   - Check if workflow is enabled in repository settings

### Health Check Failing

1. **Check Deployment URL:**
   - Verify `DEPLOYMENT_URL` secret is set correctly
   - Ensure the URL is accessible
   - Check if the URL requires authentication

2. **Check Timeout Settings:**
   - Increase timeout in health check script if needed
   - Check network connectivity

## Customization

### Custom Deployment Steps

Edit `.github/workflows/continuous-deploy.yml` to add custom deployment steps:

```yaml
- name: Custom Deployment Step
  run: |
    # Your custom deployment commands
    echo "Deploying..."
```

### Custom Health Checks

Edit `scripts/health-check.sh` to add custom health check logic.

### Custom Auto-Fix Patterns

Edit `scripts/fix-patterns.json` to customize what gets auto-fixed.

## Security Best Practices

1. **Never commit secrets:**
   - Always use GitHub Secrets
   - Don't hardcode tokens in workflow files
   - Don't log secrets in workflow outputs

2. **Use minimal permissions:**
   - Only grant necessary permissions to workflows
   - Review workflow permissions regularly

3. **Rotate tokens regularly:**
   - Update Vercel/Netlify tokens periodically
   - Remove unused secrets

4. **Review workflow changes:**
   - Always review workflow file changes
   - Use branch protection rules
   - Require reviews for workflow changes

## Next Steps

1. ✅ Add required secrets to GitHub
2. ✅ Test workflows manually (via workflow_dispatch)
3. ✅ Push to main branch to trigger deployment
4. ✅ Monitor first deployment in Actions tab
5. ✅ Verify health checks are working
6. ✅ Review and customize configuration files

---

**Last Updated**: December 2024  
**Maintained By**: Development Team