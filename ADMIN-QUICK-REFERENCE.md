# 🔐 Admin Quick Reference Card

## Admin Login Credentials

```
Username: admin2025
Password: admin2025
```

## Quick Start (After Node.js is Installed)

```powershell
# 1. Install packages
npm install

# 2. Create .env
copy .env.example .env

# 3. Start server
npm run dev

# 4. Open browser
# http://localhost:5173
```

## Admin Access URL

After starting the server:
- **Local:** http://localhost:5173
- **Login:** Use admin credentials above
- **Admin Panel:** Automatically redirects after login

## Admin Features

| Feature | Route | Description |
|---------|-------|-------------|
| Add Faculty | `/admin/add-faculty` | Create new faculty accounts |
| Faculty List | `/admin/faculty-list` | View/manage all faculty |
| Summary | `/admin/summary` | System statistics |
| Verification Team | `/admin/verification-team` | Manage verification team |
| Assign to Verification | `/admin/assign-faculty-to-verification-team` | Assign faculty |
| Assign Dean | `/admin/assign-dean-to-department` | Assign deans |

## One-Command Setup

```powershell
.\setup.ps1
```

Then:
```powershell
npm run dev
```

Login with: `admin2025` / `admin2025`

---

**Full Guide:** See [ADMIN-ACCESS-GUIDE.md](./ADMIN-ACCESS-GUIDE.md)


