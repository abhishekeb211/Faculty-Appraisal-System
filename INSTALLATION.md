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

```powershell
# Copy the example environment file
copy .env.example .env

# Edit .env file (use Notepad, VS Code, or any text editor)
notepad .env
```

Set the backend API URL:
```
VITE_BASE_URL=http://localhost:5000
```

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

### Step 2: Access the Application

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. You should see the splash screen, then the login page

### Step 3: Test Login

1. Use admin credentials:
   - Username: `admin2025`
   - Password: `admin2025`
2. You should be redirected to the admin panel

### Step 4: Verify API Connection

1. Ensure your backend API server is running
2. Check browser console (F12) for any API connection errors
3. Verify `VITE_BASE_URL` matches your backend server URL

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

## Next Steps

After successful installation:

1. **Read the [Deployment Guide](./DEPLOYMENT.md)** for production setup
2. **Review [System Architecture](./SYSTEM-ARCHITECTURE.md)** for technical details
3. **Check [Project Notes](./PROJECT-NOTES.md)** for development guidelines

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console for error messages
3. Check backend server logs
4. Verify all prerequisites are installed correctly
5. Consult the project documentation files

---

**Note**: This is a frontend application. For full functionality, ensure the backend API server is running and properly configured. Refer to the backend repository documentation for backend setup instructions.

