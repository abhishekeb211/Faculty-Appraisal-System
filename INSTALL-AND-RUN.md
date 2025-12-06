# Complete Installation and Run Guide

This guide will walk you through installing and running the Faculty Appraisal System locally.

## Prerequisites Check

Before starting, ensure you have:

- [ ] **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- [ ] **npm** (comes with Node.js)
- [ ] **Backend API Server** (running on port 5000 or configure accordingly)

## Quick Installation (3 Steps)

### Step 1: Install Node.js (If Not Installed)

1. Visit: https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. **Important**: Check "Add to PATH" during installation
5. Restart your terminal/PowerShell

**Verify installation:**
```powershell
node --version
npm --version
```

### Step 2: Install Project Packages

Open PowerShell in the project directory and run:

```powershell
npm install
```

**What this does:**
- Downloads and installs all 28+ dependencies
- Creates `node_modules/` folder
- Takes 2-5 minutes (first time)

**If you encounter errors:**
```powershell
# Clear cache and retry
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

### Step 3: Configure Environment

1. **Create .env file:**
   ```powershell
   copy .env.example .env
   ```

2. **Edit .env file:**
   ```powershell
   notepad .env
   ```

3. **Set your backend URL:**
   ```
   VITE_BASE_URL=http://localhost:5000
   ```
   
   Change `localhost:5000` if your backend runs on a different port/URL.

## Running the Application

### Option 1: Using the Run Script (Easiest)

```powershell
.\run.ps1
```

This script will:
- Check if Node.js is installed
- Check if packages are installed (runs setup if needed)
- Create .env if missing
- Start the development server

### Option 2: Manual Start

```powershell
npm run dev
```

### Option 3: Using Setup Script First

```powershell
# Run setup (installs packages, creates .env)
.\setup.ps1

# Then start the server
npm run dev
```

## Access the Application

After starting the server, you'll see:

```
  VITE v6.1.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open in browser:**
- Local: http://localhost:5173
- Network: Use the network URL shown (for access from other devices)

## Default Login Credentials

### Admin Access:
- **Username**: `admin2025`
- **Password**: `admin2025`

### Regular Users:
- Use credentials provided by your system administrator
- Or create users through the admin panel

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |

## Troubleshooting

### Issue: "npm is not recognized"

**Solution**: Node.js is not installed or not in PATH
1. Install Node.js from https://nodejs.org/
2. Restart PowerShell
3. Verify: `node --version`

### Issue: Port 5173 already in use

**Solution**: Use a different port
```powershell
npm run dev -- --port 3000
```

### Issue: Cannot connect to backend API

**Solutions**:
1. Verify backend server is running
2. Check `VITE_BASE_URL` in `.env` matches backend URL
3. Verify backend CORS allows `http://localhost:5173`
4. Check backend server logs for errors

### Issue: "Module not found" errors

**Solution**: Reinstall packages
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue: Styles not loading

**Solutions**:
1. Restart the development server
2. Clear browser cache (Ctrl+Shift+Delete)
3. Verify Tailwind CSS configuration

### Issue: Build fails

**Solution**: Check for errors and fix
```powershell
npm run lint
npm run build
```

## Project Structure After Installation

```
Faculty-Appraisal-System/
├── node_modules/          # Installed packages (created after npm install)
├── dist/                  # Production build (created after npm run build)
├── .env                   # Your environment config (create from .env.example)
├── .env.example           # Environment template
├── package.json           # Dependencies list
├── package-lock.json      # Locked dependency versions
├── src/                   # Source code
└── public/                # Static assets
```

## Next Steps After Running

1. **Login**: Use admin credentials or create a user
2. **Explore**: Navigate through different user roles
3. **Configure**: Set up departments, users, and roles
4. **Test**: Submit test forms and verify workflow

## Development Workflow

1. **Make changes** to files in `src/`
2. **Save files** - Vite automatically reloads (Hot Module Replacement)
3. **Check browser** - Changes appear instantly
4. **Check console** - For any errors or warnings

## Stopping the Server

Press `Ctrl + C` in the terminal to stop the development server.

## Production Build

To create a production build:

```powershell
npm run build
```

The optimized files will be in the `dist/` folder, ready for deployment.

## Getting Help

- Check [README.md](./README.md) for project overview
- See [INSTALLATION.md](./INSTALLATION.md) for detailed setup
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- See [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md) for technical details

## Checklist

Before running, ensure:

- [ ] Node.js is installed (`node --version` works)
- [ ] npm is installed (`npm --version` works)
- [ ] Packages are installed (`node_modules/` exists)
- [ ] `.env` file exists and is configured
- [ ] Backend API server is running
- [ ] Backend CORS is configured correctly

---

**Ready to start?** Run `.\run.ps1` or `npm run dev` to begin!


