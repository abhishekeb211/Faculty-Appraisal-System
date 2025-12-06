# Quick Start - Install and Run Locally

## Step 1: Install Node.js (REQUIRED)

Node.js is not currently installed on your system. You need to install it first.

### Download and Install Node.js

1. **Visit**: https://nodejs.org/
2. **Download**: Click on the **LTS version** (Long Term Support) - Recommended
   - For Windows: Download the `.msi` installer
   - Current LTS: v20.x or v18.x
3. **Install**:
   - Run the downloaded installer
   - Click "Next" through the setup wizard
   - **IMPORTANT**: Make sure "Add to PATH" is checked
   - Complete the installation
4. **Restart** your terminal/PowerShell after installation

### Verify Installation

After installing Node.js, open a **NEW** terminal/PowerShell window and run:

```powershell
node --version
npm --version
```

You should see version numbers (e.g., `v20.10.0` and `10.2.3`)

## Step 2: Install Project Packages

Once Node.js is installed, navigate to the project folder and run:

```powershell
cd C:\Users\Abhis\Documents\GitHub\Faculty-Appraisal-System
npm install
```

This will install all required packages (takes 2-5 minutes).

## Step 3: Configure Environment

Create a `.env` file in the project root:

```powershell
# Copy the example file
copy .env.example .env

# Edit .env file (use Notepad or any text editor)
notepad .env
```

Set the backend API URL:
```
VITE_BASE_URL=http://localhost:5000
```

**Note**: Make sure your backend API server is running on port 5000, or change the URL to match your backend.

## Step 4: Run the Development Server

```powershell
npm run dev
```

The application will start and you'll see:
```
  VITE v6.1.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 5: Open in Browser

Open your web browser and navigate to:
```
http://localhost:5173
```

You should see the Faculty Appraisal System login page.

## Default Admin Login

- **Username**: `admin2025`
- **Password**: `admin2025`

## Troubleshooting

### If npm install fails:
```powershell
# Clear cache and retry
npm cache clean --force
npm install
```

### If port 5173 is already in use:
```powershell
# Use a different port
npm run dev -- --port 3000
```

### If backend connection fails:
- Make sure your backend API server is running
- Check that `VITE_BASE_URL` in `.env` matches your backend URL
- Verify backend CORS is configured to allow `http://localhost:5173`

## Complete Command Sequence

Once Node.js is installed, run these commands in order:

```powershell
# 1. Navigate to project (if not already there)
cd C:\Users\Abhis\Documents\GitHub\Faculty-Appraisal-System

# 2. Install packages
npm install

# 3. Create .env file (if .env.example exists)
if (Test-Path .env.example) { Copy-Item .env.example .env }

# 4. Edit .env file - set VITE_BASE_URL=http://localhost:5000
notepad .env

# 5. Start development server
npm run dev
```

## Next Steps

- See [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions
- See [README.md](./README.md) for project overview
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

---

**Important**: You must install Node.js first before proceeding with the project setup!


