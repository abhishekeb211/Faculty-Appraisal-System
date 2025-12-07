# Installation Guide

This guide provides step-by-step instructions for setting up the Faculty Appraisal System on your local machine or server.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Windows Installation](#windows-installation)
- [Linux Installation](#linux-installation)
- [macOS Installation](#macos-installation)
- [Environment Setup](#environment-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing the Faculty Appraisal System, ensure you have the following software installed:

### Required Software

| Software | Minimum Version | Recommended Version | Purpose |
|----------|----------------|---------------------|---------|
| Node.js | 18.0.0 | 20.x LTS | JavaScript runtime |
| npm | 9.0.0 | 10.x | Package manager |
| Git | 2.30.0 | Latest | Version control |

### Optional Software

- **VS Code** or any modern code editor
- **Backend API Server** (separate repository) - Required for full functionality

### Checking Installed Versions

**Windows (PowerShell/CMD):**
```powershell
node --version
npm --version
git --version
```

**Linux/macOS (Terminal):**
```bash
node --version
npm --version
git --version
```

## Windows Installation

### Step 1: Install Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the Windows Installer (.msi) for the LTS version
3. Run the installer and follow the setup wizard
4. Ensure "Add to PATH" is checked during installation
5. Restart your terminal/PowerShell after installation

### Step 2: Verify Installation

Open PowerShell or Command Prompt and verify:
```powershell
node --version
npm --version
```

### Step 3: Clone the Repository

```powershell
git clone <repository-url>
cd Faculty-Appraisal-System
```

### Step 4: Install Dependencies

```powershell
npm install
```

This may take 2-5 minutes depending on your internet connection.

### Step 5: Configure Environment

Create a `.env` file in the project root:

```powershell
# Create .env file (if .env.example exists, copy it)
if (Test-Path .env.example) {
    copy .env.example .env
} else {
    # Create new .env file
    @"
# Backend API Base URL
VITE_BASE_URL=http://localhost:5000
"@ | Out-File -FilePath .env -Encoding utf8
}

# Edit .env file (use Notepad, VS Code, or any text editor)
notepad .env
```

Set the backend API URL:
```env
# Backend API Base URL
# Development: http://localhost:5000
# Production: https://api.yourdomain.com
VITE_BASE_URL=http://localhost:5000
```

**Note**: If `.env.example` doesn't exist (it may be gitignored), create `.env` manually with the content above.

### Step 6: Start Development Server

```powershell
npm run dev
```

The application will be available at `http://localhost:5173`

## Linux Installation

### Step 1: Install Node.js

**Ubuntu/Debian:**
```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

**Using NodeSource (Recommended for latest versions):**
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Fedora/RHEL:**
```bash
sudo dnf install nodejs npm
```

### Step 2: Clone the Repository

```bash
git clone <repository-url>
cd Faculty-Appraisal-System
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file
nano .env
# or
vim .env
```

Set the backend API URL:
```
VITE_BASE_URL=http://localhost:5000
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## macOS Installation

### Step 1: Install Node.js

**Using Homebrew (Recommended):**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

**Using Official Installer:**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the macOS Installer (.pkg)
3. Run the installer and follow the setup wizard
4. Verify installation in Terminal

### Step 2: Clone the Repository

```bash
git clone <repository-url>
cd Faculty-Appraisal-System
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file
nano .env
# or use any text editor
open -a TextEdit .env
```

Set the backend API URL:
```
VITE_BASE_URL=http://localhost:5000
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API Base URL
VITE_BASE_URL=http://localhost:5000

# For production, use your production API URL
# VITE_BASE_URL=https://api.yourdomain.com
```

### Environment File Structure

```
.env.example          # Template file (committed to repo)
.env                  # Your local configuration (NOT committed)
```

**Important**: Never commit your `.env` file to version control. It may contain sensitive information.

## Verification

### Step 1: Check Development Server

After running `npm run dev`, you should see:
```
  VITE v6.1.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**If you see errors:**
- Check Node.js version: `node --version` (should be 18+)
- Verify all dependencies installed: `npm list --depth=0`
- Check for port conflicts

### Step 2: Access the Application

1. Open your web browser (Chrome, Firefox, Edge, or Safari)
2. Navigate to `http://localhost:5173`
3. You should see:
   - Splash screen (for ~3.5 seconds)
   - Login page

**If login page doesn't appear:**
- Check browser console (F12) for errors
- Verify development server is running
- Try hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Step 3: Verify Environment Variables

1. Check that `.env` file exists in project root
2. Verify `VITE_BASE_URL` is set:
   ```bash
   # Windows PowerShell
   Get-Content .env
   
   # Linux/macOS
   cat .env
   ```
3. Should contain: `VITE_BASE_URL=http://localhost:5000` (or your backend URL)

**Note**: After changing `.env`, restart the development server.

### Step 4: Test Login

1. **Admin Login Test:**
   - Username: `admin2025`
   - Password: `admin2025`
   - Should redirect to `/admin` route

2. **Regular User Login Test:**
   - Use valid user credentials from backend
   - Should redirect to `/dashboard`
   - Check browser console for any errors

**If login fails:**
- Verify backend API is running
- Check `VITE_BASE_URL` in `.env` matches backend URL
- Check browser Network tab for failed requests
- Verify CORS is configured on backend

### Step 5: Verify API Connection

1. **Check Backend Server:**
   ```bash
   # Test backend health (adjust URL as needed)
   curl http://localhost:5000/health
   # Or open in browser
   ```

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for API connection errors
   - Check Network tab for failed requests

3. **Test API Endpoint:**
   ```javascript
   // In browser console
   fetch(`${import.meta.env.VITE_BASE_URL}/users`)
     .then(r => console.log('API connected:', r.ok))
     .catch(e => console.error('API error:', e));
   ```

### Step 6: Verify Component Rendering

1. **After Login:**
   - Check that sidebar appears (if not external user)
   - Verify navbar shows user information
   - Check that dashboard loads correctly

2. **Test Navigation:**
   - Click sidebar menu items
   - Verify routes change correctly
   - Check that components load without errors

### Step 7: Verify Form Functionality

1. Navigate to a form (e.g., `/teaching` for Part A)
2. Check that form loads existing data (if any)
3. Try filling out a field
4. Verify form validation works
5. Check browser console for errors

### Step 8: Complete Verification Checklist

- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] Login page appears
- [ ] Admin login works
- [ ] Environment variables are set correctly
- [ ] Backend API is accessible
- [ ] No CORS errors in console
- [ ] Components render correctly
- [ ] Navigation works
- [ ] Forms load and function
- [ ] No console errors

### Common Verification Issues

**Issue**: Environment variable not working
- **Check**: Restart dev server after changing `.env`
- **Verify**: Variable name starts with `VITE_`
- **Test**: `console.log(import.meta.env.VITE_BASE_URL)` in component

**Issue**: API connection fails
- **Check**: Backend server is running
- **Verify**: `VITE_BASE_URL` matches backend URL exactly
- **Test**: Open backend URL in browser directly

**Issue**: Components not rendering
- **Check**: Browser console for React errors
- **Verify**: All dependencies installed correctly
- **Test**: Clear browser cache and hard refresh

## Troubleshooting

### Issue: `npm install` fails

**Symptoms:**
- Error messages about missing dependencies
- Permission denied errors
- Network timeout errors

**Solutions:**

**Windows:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

**Linux/macOS:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 5173 already in use

**Symptoms:**
- Error: `Port 5173 is in use`

**Solutions:**

**Option 1: Use a different port**
```bash
npm run dev -- --port 3000
```

**Option 2: Kill the process using port 5173**

**Windows:**
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/macOS:**
```bash
# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9
```

### Issue: Module not found errors

**Symptoms:**
- `Error: Cannot find module 'xyz'`
- Import errors in console

**Solutions:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind CSS styles not loading

**Symptoms:**
- Unstyled components
- Missing CSS classes

**Solutions:**
1. Verify `tailwind.config.js` exists and is properly configured
2. Check `vite.config.js` includes Tailwind plugin
3. Restart the development server
4. Clear browser cache

### Issue: Backend API connection fails

**Symptoms:**
- CORS errors in browser console
- Network errors
- 404 errors for API endpoints

**Solutions:**
1. Verify backend server is running
2. Check `VITE_BASE_URL` in `.env` file
3. Ensure backend CORS is configured to allow your frontend origin
4. Check backend server logs for errors

### Issue: Build fails

**Symptoms:**
- `npm run build` produces errors
- Type errors or syntax errors

**Solutions:**
```bash
# Run linter to identify issues
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Check for TypeScript/ESLint errors
# Review error messages and fix accordingly
```

## Post-Installation Configuration

### Optional: Configure Development Port

If port 5173 is in use, you can change it:

**Option 1: Command line**
```bash
npm run dev -- --port 3000
```

**Option 2: Update vite.config.js**
```javascript
export default defineConfig({
  server: {
    port: 3000
  },
  // ... other config
});
```

### Optional: Enable Network Access

To access from other devices on your network:

```bash
npm run dev -- --host
```

This will expose the dev server on your local network IP.

### Optional: Configure Proxy

If you need to proxy API requests, update `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

## Next Steps

After successful installation:

1. **Read the [Local Deployment Review](./LOCAL-DEPLOYMENT-REVIEW.md)** for architecture, design & security assessment
2. **Read the [Deployment Guide](./DEPLOYMENT.md)** for production setup
3. **Review [System Architecture](./SYSTEM-ARCHITECTURE.md)** for technical details
4. **Check [API Documentation](./API-DOCUMENTATION.md)** for endpoint reference
5. **Read [Troubleshooting Guide](./TROUBLESHOOTING.md)** for common issues
6. **Review [Project Notes](./PROJECT-NOTES.md)** for development guidelines

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console for error messages
3. Check backend server logs
4. Verify all prerequisites are installed correctly
5. Consult the project documentation files

---

**Note**: This is a frontend application. For full functionality, ensure the backend API server is running and properly configured. Refer to the backend repository documentation for backend setup instructions.

