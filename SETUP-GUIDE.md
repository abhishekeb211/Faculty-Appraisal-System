# Setup Guide - Required Packages

This guide will help you install all required packages for the Faculty Appraisal System.

## Prerequisites

Before installing packages, ensure you have **Node.js** and **npm** installed:

### Check if Node.js is installed:
```bash
node --version
npm --version
```

If these commands don't work, you need to install Node.js first.

### Install Node.js (if not installed)

1. **Download Node.js**:
   - Visit: https://nodejs.org/
   - Download the **LTS version** (recommended: v20.x or higher)
   - Run the installer and follow the setup wizard
   - Make sure to check "Add to PATH" during installation

2. **Verify Installation**:
   ```bash
   node --version  # Should show v18.x or higher
   npm --version   # Should show v9.x or higher
   ```

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd Faculty-Appraisal-System
```

### Step 2: Install All Packages

Run this single command to install all required packages:

```bash
npm install
```

This command will:
- Read `package.json`
- Download and install all **dependencies** (runtime packages)
- Download and install all **devDependencies** (development tools)
- Create `node_modules/` folder with all packages
- Generate `package-lock.json` file

### Step 3: Verify Installation

After installation completes, verify by checking:

```bash
# Check if node_modules exists
dir node_modules  # Windows
# or
ls node_modules  # Linux/Mac

# Check package count (optional)
npm list --depth=0
```

## Required Packages Breakdown

### Production Dependencies (Runtime)

These packages are required for the application to run:

| Package | Version | Purpose |
|---------|---------|---------|
| **react** | ^19.0.0 | React UI framework |
| **react-dom** | ^19.0.0 | React DOM rendering |
| **react-router-dom** | ^7.1.5 | Client-side routing |
| **axios** | ^1.7.9 | HTTP client for API calls |
| **tailwindcss** | ^4.0.5 | CSS framework |
| **@tailwindcss/vite** | ^4.0.5 | Tailwind Vite plugin |
| **framer-motion** | ^12.5.0 | Animation library |
| **lucide-react** | ^0.475.0 | Icon library |
| **react-icons** | ^5.5.0 | Additional icons |
| **react-hot-toast** | ^2.5.2 | Toast notifications |
| **react-toastify** | ^11.0.3 | Toast notifications (alternative) |
| **react-spinners** | ^0.15.0 | Loading spinners |
| **js-cookie** | ^3.0.5 | Cookie management |
| **@react-three/fiber** | ^9.1.0 | 3D graphics (if used) |
| **@react-three/drei** | ^10.0.4 | 3D helpers (if used) |
| **three** | ^0.174.0 | 3D library (if used) |
| **gsap** | ^3.12.7 | Animation library |

### Development Dependencies (Build Tools)

These packages are only needed during development:

| Package | Version | Purpose |
|---------|---------|---------|
| **vite** | ^6.1.0 | Build tool and dev server |
| **@vitejs/plugin-react** | ^4.3.4 | Vite React plugin |
| **eslint** | ^9.20.0 | Code linting |
| **@eslint/js** | ^9.19.0 | ESLint JavaScript config |
| **eslint-plugin-react** | ^7.37.4 | React ESLint rules |
| **eslint-plugin-react-hooks** | ^5.0.0 | React Hooks linting |
| **eslint-plugin-react-refresh** | ^0.4.18 | React refresh linting |
| **prettier** | ^3.5.0 | Code formatting |
| **postcss** | ^8.5.1 | CSS processing |
| **autoprefixer** | ^10.4.20 | CSS vendor prefixes |
| **globals** | ^15.14.0 | ESLint globals |
| **@types/react** | ^19.0.8 | TypeScript types for React |
| **@types/react-dom** | ^19.0.3 | TypeScript types for React DOM |
| **shadcn-ui** | ^0.9.4 | UI component library (if used) |

## Installation Time

- **First time**: 2-5 minutes (depending on internet speed)
- **Subsequent**: Faster if `package-lock.json` exists

## Troubleshooting

### Issue: npm command not found

**Solution**: Install Node.js from https://nodejs.org/

### Issue: Permission errors (Linux/Mac)

**Solution**: Use `sudo` or fix npm permissions:
```bash
sudo npm install
# OR
npm install --unsafe-perm
```

### Issue: Network timeout errors

**Solution**: 
1. Check internet connection
2. Clear npm cache: `npm cache clean --force`
3. Try again: `npm install`

### Issue: Package conflicts

**Solution**: 
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Linux/Mac
rm -rf node_modules package-lock.json
npm install
```

### Issue: Out of memory errors

**Solution**: Increase Node.js memory limit:
```bash
set NODE_OPTIONS=--max-old-space-size=4096  # Windows
export NODE_OPTIONS=--max-old-space-size=4096  # Linux/Mac
npm install
```

## Alternative Package Managers

If you prefer other package managers:

### Using Yarn:
```bash
yarn install
```

### Using pnpm:
```bash
pnpm install
```

## After Installation

Once packages are installed:

1. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**:
   Edit `.env` and set:
   ```
   VITE_BASE_URL=http://localhost:5000
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Package Size

- **Total packages**: ~500+ packages (including dependencies)
- **Disk space**: ~200-300 MB (node_modules folder)
- **Installation size**: Varies by system

## Updating Packages

To update packages later:

```bash
# Check for outdated packages
npm outdated

# Update all packages (use with caution)
npm update

# Update specific package
npm install package-name@latest
```

## Verification Checklist

After installation, verify:

- [ ] `node_modules/` folder exists
- [ ] `package-lock.json` file exists
- [ ] No error messages in terminal
- [ ] Can run `npm run dev` successfully
- [ ] Application starts without errors

---

**Next Steps**: 
- See [INSTALLATION.md](./INSTALLATION.md) for complete setup instructions
- See [README.md](./README.md) for project overview


