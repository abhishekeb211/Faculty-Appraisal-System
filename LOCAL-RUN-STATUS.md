# Local Run Status Check

## Current Status

### ❌ Prerequisites Missing

1. **Node.js is NOT installed**
   - Command `node --version` failed
   - Required: Node.js v18 or higher
   - Download: https://nodejs.org/ (LTS version recommended)

2. **npm is NOT installed**
   - Command `npm --version` failed
   - npm comes with Node.js installation

3. **Dependencies NOT installed**
   - `node_modules/` directory does not exist
   - Need to run `npm install` after Node.js is installed

4. **Environment file missing**
   - `.env` file does not exist
   - Need to create with `VITE_BASE_URL=http://localhost:5000`

### ✅ Project Structure

- ✅ `package.json` exists
- ✅ `vite.config.js` exists
- ✅ Source code in `src/` directory
- ✅ Setup scripts available (`setup.ps1`, `run.ps1`)

## Steps to Run Locally

### Step 1: Install Node.js (REQUIRED)

1. Visit: **https://nodejs.org/**
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. **Important**: Check "Add to PATH" during installation
5. **Restart PowerShell** after installation

**Verify installation:**
```powershell
node --version
npm --version
```

You should see version numbers (e.g., `v20.10.0` and `10.2.3`)

### Step 2: Install Project Dependencies

After Node.js is installed, run:

```powershell
npm install
```

This will:
- Install all 28+ dependencies
- Create `node_modules/` folder
- Take 2-5 minutes (first time)

### Step 3: Create Environment File

Create a `.env` file in the project root:

```powershell
# Create .env file
@"
VITE_BASE_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8
```

Or manually create `.env` with:
```
VITE_BASE_URL=http://localhost:5000
```

**Note**: Change `localhost:5000` if your backend runs on a different port/URL.

### Step 4: Start Development Server

**Option A: Using the run script (Recommended)**
```powershell
.\run.ps1
```

**Option B: Manual start**
```powershell
npm run dev
```

**Option C: Using setup script first**
```powershell
.\setup.ps1
npm run dev
```

### Step 5: Access the Application

After starting, you'll see:
```
VITE v6.1.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open in browser: **http://localhost:5173**

## Default Login Credentials

- **Admin Username**: `admin2025`
- **Admin Password**: `admin2025`

## Quick Command Sequence

Once Node.js is installed, run these in order:

```powershell
# 1. Install packages
npm install

# 2. Create .env file
@"
VITE_BASE_URL=http://localhost:5000
"@ | Out-File -FilePath ".env" -Encoding utf8

# 3. Start development server
npm run dev
```

## Troubleshooting

### Port 5173 already in use
```powershell
npm run dev -- --port 3000
```

### Backend connection fails
- Verify backend API server is running
- Check `VITE_BASE_URL` in `.env` matches backend URL
- Verify backend CORS allows `http://localhost:5173`

### Module not found errors
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Project Information

- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.1.0
- **Styling**: Tailwind CSS 4.0.5
- **Development Port**: 5173
- **Backend Port**: 5000 (default, configurable)

## Next Steps

1. ✅ Install Node.js from https://nodejs.org/
2. ✅ Run `npm install` to install dependencies
3. ✅ Create `.env` file with backend URL
4. ✅ Ensure backend API server is running
5. ✅ Run `npm run dev` or `.\run.ps1`
6. ✅ Open http://localhost:5173 in browser

---

**Status**: ⚠️ **Cannot run locally yet** - Node.js installation required first

