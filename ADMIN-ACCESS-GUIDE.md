# Admin Access Guide - Run Locally with Admin Permissions

This guide will help you run the Faculty Appraisal System locally with full admin access.

## 🎯 Quick Admin Setup

### Prerequisites
- Node.js must be installed (see Step 1 below)

## Step-by-Step: Run with Admin Access

### Step 1: Install Node.js (REQUIRED)

**If Node.js is not installed:**

1. **Download Node.js:**
   - Visit: https://nodejs.org/
   - Click "Download Node.js (LTS)" - Recommended version
   - Download the Windows Installer (.msi)

2. **Install Node.js:**
   - Run the downloaded installer
   - Click "Next" through the setup
   - **IMPORTANT**: Make sure "Add to PATH" is checked
   - Complete the installation

3. **Restart PowerShell:**
   - Close and reopen PowerShell/terminal
   - This ensures PATH is updated

4. **Verify Installation:**
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers (e.g., `v20.10.0` and `10.2.3`)

### Step 2: Install Project Packages

**Option A - Automated Setup:**
```powershell
.\setup.ps1
```

**Option B - Manual:**
```powershell
npm install
```

Wait 2-5 minutes for packages to install.

### Step 3: Configure Environment

```powershell
# Create .env file from template
copy .env.example .env

# Edit .env file
notepad .env
```

**Set the backend URL:**
```
VITE_BASE_URL=http://localhost:5000
```

**Note:** Make sure your backend API server is running on port 5000, or change the URL accordingly.

### Step 4: Start Development Server

```powershell
npm run dev
```

**OR use the quick start script:**
```powershell
.\run.ps1
```

You should see:
```
  VITE v6.1.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

### Step 5: Access Admin Panel

1. **Open Browser:**
   - Navigate to: **http://localhost:5173**

2. **Login with Admin Credentials:**
   - **Username:** `admin2025`
   - **Password:** `admin2025`

3. **You'll be redirected to Admin Panel**

## 🔐 Admin Credentials

### Default Admin Login:
```
Username: admin2025
Password: admin2025
```

**⚠️ Security Note:** Change these credentials in production!

## 👑 Admin Permissions & Features

Once logged in as admin, you have access to:

### 1. User Management
- **Add Faculty** (`/admin/add-faculty`)
  - Create new faculty members
  - Set user roles and departments
  - Assign designations

- **Faculty List** (`/admin/faculty-list`)
  - View all faculty members
  - Edit user information
  - Delete users
  - Manage user accounts

### 2. Department Management
- **Assign Dean to Department** (`/admin/assign-dean-to-department`)
  - Assign deans to specific departments
  - Manage department-dean relationships

### 3. Verification Team Management
- **Verification Team** (`/admin/verification-team`)
  - View verification team members
  - Manage verification committee

- **Assign Faculty to Verification Team** (`/admin/assign-faculty-to-verification-team`)
  - Add faculty to verification committee
  - Remove faculty from verification team

### 4. System Overview
- **Summary** (`/admin/summary`)
  - Department-wise statistics
  - Faculty submission status
  - System-wide analytics

## 📍 Admin Routes

All admin routes are accessible without authentication (special admin access):

| Route | Feature |
|-------|---------|
| `/admin` | Admin dashboard (redirects to add-faculty) |
| `/admin/add-faculty` | Add new faculty members |
| `/admin/faculty-list` | View and manage all faculty |
| `/admin/summary` | System summary and statistics |
| `/admin/verification-team` | Manage verification team |
| `/admin/assign-faculty-to-verification-team` | Assign faculty to verification |
| `/admin/assign-dean-to-department` | Assign deans to departments |

## 🚀 Quick Start Commands

**Complete setup and run:**
```powershell
# 1. Install packages (if not done)
npm install

# 2. Create .env (if not exists)
if (-not (Test-Path .env)) { copy .env.example .env }

# 3. Start server
npm run dev
```

**Then:**
1. Open http://localhost:5173
2. Login with: `admin2025` / `admin2025`
3. Access admin panel

## 🔧 Admin Panel Features

### User Management Features:
- ✅ Create new faculty accounts
- ✅ Edit existing user information
- ✅ Delete user accounts
- ✅ View all users in system
- ✅ Filter users by department
- ✅ Search users

### System Configuration:
- ✅ Assign deans to departments
- ✅ Manage verification teams
- ✅ View system statistics
- ✅ Monitor submission status

## 🛡️ Admin Security

### Current Implementation:
- Admin login is hardcoded in `src/components/LoginPage.jsx`
- Username: `admin2025`
- Password: `admin2025`

### For Production:
**⚠️ IMPORTANT:** Change admin credentials before deploying to production!

**To change admin credentials:**
1. Open `src/components/LoginPage.jsx`
2. Find the admin check (around line 38):
   ```javascript
   if (userId === "admin2025" && password === "admin2025") {
     navigate("/admin");
     return;
   }
   ```
3. Change the username and password
4. Consider moving to backend authentication for better security

## 📊 Admin Dashboard Overview

After logging in as admin, you'll see:

1. **Navigation Menu:**
   - Add Faculty
   - Faculty List
   - Summary
   - Verification Team
   - Assign Faculty to Verification Team
   - Assign Dean to Department

2. **Main Content Area:**
   - Current page content
   - Forms and data tables
   - Action buttons

## 🐛 Troubleshooting Admin Access

### Issue: Cannot login as admin

**Check:**
1. Username is exactly: `admin2025`
2. Password is exactly: `admin2025`
3. No extra spaces before/after

**Solution:** Check `src/components/LoginPage.jsx` for current admin credentials

### Issue: Admin panel not loading

**Check:**
1. Backend API is running
2. `VITE_BASE_URL` in `.env` is correct
3. No console errors in browser (F12)

### Issue: Admin routes not accessible

**Solution:** Admin routes should work without backend authentication. If they don't:
1. Check browser console for errors
2. Verify you're using the correct URL
3. Check network tab for failed requests

## 📝 Admin Workflow Example

1. **Login** → Use admin credentials
2. **Add Faculty** → Create new faculty accounts
3. **Assign Roles** → Set user roles and departments
4. **Configure System** → Set up verification teams and deans
5. **Monitor** → View summary and statistics

## 🎯 Next Steps After Admin Login

1. **Add Faculty Members:**
   - Go to `/admin/add-faculty`
   - Fill in faculty details
   - Assign department and role

2. **Set Up Departments:**
   - Assign deans to departments
   - Configure department structure

3. **Configure Verification:**
   - Set up verification teams
   - Assign faculty to verification committee

4. **Monitor System:**
   - Check summary for system status
   - View faculty list and their status

## 🔄 Complete Setup Script

Run this to set up and start with admin access:

```powershell
# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found! Install from https://nodejs.org/" -ForegroundColor Red
    exit
}

# Install packages (if needed)
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing packages..." -ForegroundColor Yellow
    npm install
}

# Create .env (if needed)
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file - please edit it!" -ForegroundColor Yellow
}

# Start server
Write-Host "Starting server..." -ForegroundColor Green
Write-Host "Admin Login: admin2025 / admin2025" -ForegroundColor Cyan
Write-Host "URL: http://localhost:5173" -ForegroundColor Cyan
npm run dev
```

## ✅ Checklist for Admin Access

Before accessing admin panel:

- [ ] Node.js installed and verified
- [ ] Packages installed (`npm install` completed)
- [ ] `.env` file created and configured
- [ ] Backend API server running (if using backend features)
- [ ] Development server started (`npm run dev`)
- [ ] Browser opened to http://localhost:5173
- [ ] Admin credentials ready: `admin2025` / `admin2025`

---

**Ready to start?** Install Node.js, then run `npm run dev` and login with admin credentials!

For detailed installation, see [INSTALL-AND-RUN.md](./INSTALL-AND-RUN.md)


