# Install Node.js and npm

## Important Note

**npm comes bundled with Node.js** - You don't install npm separately. When you install Node.js, npm is automatically included.

## Quick Installation Guide

### Step 1: Download Node.js

1. **Visit the official website:**
   - Go to: **https://nodejs.org/**
   - You'll see two download options

2. **Choose the LTS version (Recommended):**
   - **LTS** = Long Term Support (more stable)
   - Click the green "Download Node.js (LTS)" button
   - This is the recommended version for most users

3. **Download the Windows Installer:**
   - The website will detect your Windows system
   - Download the `.msi` installer file
   - File will be named something like: `node-v20.x.x-x64.msi`

### Step 2: Install Node.js

1. **Run the installer:**
   - Double-click the downloaded `.msi` file
   - Windows may ask for administrator permissions - click "Yes"

2. **Follow the installation wizard:**
   - Click "Next" on the welcome screen
   - Accept the license agreement
   - Choose installation location (default is fine)
   - **IMPORTANT**: On the "Custom Setup" screen, make sure:
     - ✅ **"Add to PATH"** is checked (this is crucial!)
     - ✅ npm package manager is selected
   - Click "Install"
   - Wait for installation to complete (1-2 minutes)
   - Click "Finish"

### Step 3: Verify Installation

**Close and reopen PowerShell/terminal**, then run:

```powershell
node --version
```

You should see something like: `v20.10.0`

```powershell
npm --version
```

You should see something like: `10.2.3`

### Step 4: Restart Terminal

**Important:** After installing Node.js, you MUST:
1. Close your current PowerShell/terminal window
2. Open a new PowerShell/terminal window
3. This ensures the PATH is updated

## Alternative: Using Chocolatey (Windows Package Manager)

If you have Chocolatey installed:

```powershell
choco install nodejs-lts
```

## Alternative: Using Winget (Windows Package Manager)

If you have Winget:

```powershell
winget install OpenJS.NodeJS.LTS
```

## Troubleshooting

### Issue: "node is not recognized" after installation

**Solution:**
1. Restart your terminal/PowerShell
2. If still not working, check PATH:
   ```powershell
   $env:PATH -split ';' | Select-String node
   ```
3. If Node.js is not in PATH, reinstall and make sure "Add to PATH" is checked

### Issue: Installation fails

**Solutions:**
1. Run installer as Administrator (Right-click → Run as administrator)
2. Disable antivirus temporarily during installation
3. Check Windows updates are installed

### Issue: Wrong version installed

**Solution:**
- Uninstall current version from Control Panel
- Download the correct version from nodejs.org
- Reinstall

## What Gets Installed

When you install Node.js, you get:

- ✅ **Node.js** - JavaScript runtime
- ✅ **npm** - Node Package Manager (automatically included)
- ✅ **npx** - Package runner (automatically included)

## Version Information

- **Current LTS**: v20.x (recommended for most users)
- **Latest**: v21.x (newest features, may be less stable)
- **For this project**: LTS version (v18 or higher) is recommended

## After Installation

Once Node.js and npm are installed, you can:

1. **Install project packages:**
   ```powershell
   npm install
   ```

2. **Start the development server:**
   ```powershell
   npm run dev
   ```

3. **Use npm commands:**
   ```powershell
   npm --version    # Check npm version
   npm install      # Install packages
   npm run dev      # Run development server
   npm run build    # Build for production
   ```

## Quick Verification Script

After installation, run this to verify everything works:

```powershell
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
node --version
npm --version
Write-Host "`nIf you see version numbers above, installation is successful!" -ForegroundColor Green
```

## Next Steps

After Node.js is installed:

1. **Install project packages:**
   ```powershell
   npm install
   ```

2. **Set up environment:**
   ```powershell
   copy .env.example .env
   ```

3. **Start the application:**
   ```powershell
   npm run dev
   ```

4. **Access admin panel:**
   - Open: http://localhost:5173
   - Login: `admin2025` / `admin2025`

---

**Download Link:** https://nodejs.org/

**Need help?** See [INSTALL-AND-RUN.md](./INSTALL-AND-RUN.md) for complete setup guide.


