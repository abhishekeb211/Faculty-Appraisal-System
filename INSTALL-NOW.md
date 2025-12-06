# ⚠️ Cannot Run - Node.js Required

## Current Status
❌ **Node.js is not installed** - This is required to run the project.

## Quick Fix (5 minutes)

### Step 1: Install Node.js
1. **Download**: https://nodejs.org/
2. **Choose**: LTS version (recommended)
3. **Install**: Run the installer
   - ✅ Check "Add to PATH" during installation
4. **Restart**: Close and reopen PowerShell

### Step 2: Verify Installation
Open a **NEW** PowerShell window and run:
```powershell
node --version
npm --version
```
You should see version numbers.

### Step 3: Run the Project
After Node.js is installed, come back to this directory and run:
```powershell
cd C:\Users\Abhis\Documents\GitHub\Faculty-Appraisal-System
.\run.ps1
```

Or manually:
```powershell
npm install
npm run dev
```

## What Happens After Installation

Once Node.js is installed, the `run.ps1` script will:
1. ✅ Check Node.js installation
2. ✅ Install dependencies (if needed)
3. ✅ Create .env file (if missing)
4. ✅ Start the development server
5. ✅ Open http://localhost:5173

---

**Next Step**: Install Node.js from https://nodejs.org/ then run `.\run.ps1`

