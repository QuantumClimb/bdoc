# BdocUI Migration Guide

Complete guide for migrating the BdocUI project to another machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step-by-Step Migration](#step-by-step-migration)
3. [Environment Setup](#environment-setup)
4. [Verification Checklist](#verification-checklist)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

**Required Software (install on target machine):**
- **Node.js** v18+ (LTS recommended) - [Download](https://nodejs.org/)
- **npm** v9+ (comes with Node.js)
- **Git** (optional, for version control) - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

**Verify installations:**
```powershell
node --version      # Should be v18+
npm --version       # Should be v9+
```

---

## Step-by-Step Migration

### 1. Copy Project Files

**Option A: Using File Explorer (Easiest)**
- Copy entire `BdocUI` folder to target machine
- Choose destination path (e.g., `C:\Projects\BdocUI` or `C:\HDD\NeonApps\BdocUI`)

**Option B: Using Git (Recommended)**
```powershell
cd C:\Projects  # or your target directory
git clone <repository-url>
```

**Option C: Using Compression**
- Zip entire `BdocUI` folder on source machine
- Transfer `.zip` file to target machine
- Extract to desired location

### 2. Navigate to Project Directory

```powershell
cd "C:\path\to\BdocUI"  # Replace with your actual path
```

### 3. Install Dependencies

```powershell
npm install
```

⏱️ **This may take 2-5 minutes.** You'll see:
```
added XXX packages in Xm Xs
```

### 4. Create Environment File

Create `.env` file in project root with these variables:

```env
# API Configuration
REACT_APP_API_BASE=/api
REACT_APP_BACKEND_URL=https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net
REACT_APP_VIEWER_ORIGIN=https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net
REACT_APP_VIEWER_PATH=/static/invoices/index.html

# Superset Configuration
REACT_APP_SUPERSET_DOMAIN=https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net
REACT_APP_SUPERSET_TOKEN_URL=/api/superset/token

# App Configuration
REACT_APP_APP_TITLE=BDoc Invoice Dashboard
REACT_APP_LOG_LEVEL=info

# Environment
NODE_ENV=development
```

### 5. Start Development Server

```powershell
npm start
```

✅ **Expected output:**
```
Compiled successfully!

You can now view bdocui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### 6. Verify in Browser

1. Open browser to `http://localhost:3000`
2. You should see the **BDoc Login Page**
3. Login with any email/password combination
4. Verify **Navbar** displays correctly with all icons
5. Navigate to **Dashboard** and **Invoices** pages
6. Verify **Footer** appears at bottom

---

## Environment Setup

### .env File Location
```
BdocUI/
├── .env              ← Create here (in root)
├── .env.example      ← Reference file (already included)
├── public/
├── src/
└── package.json
```

### Environment Variables Reference

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `REACT_APP_API_BASE` | Local API base path | `/api` | `/api` |
| `REACT_APP_BACKEND_URL` | Backend/Superset server | Azure URL | `https://...centralindia-01.azurewebsites.net` |
| `REACT_APP_VIEWER_ORIGIN` | Iframe origin (CORS) | Backend URL | Same as backend |
| `REACT_APP_VIEWER_PATH` | Invoice viewer path | `/static/invoices/index.html` | `/static/invoices/index.html` |
| `REACT_APP_SUPERSET_DOMAIN` | Superset embed domain | Backend URL | Same as backend |
| `REACT_APP_SUPERSET_TOKEN_URL` | Token fetch endpoint | `/api/superset/token` | `/api/superset/token` |
| `REACT_APP_APP_TITLE` | Browser/app title | `BDoc Invoice Dashboard` | Custom title |
| `REACT_APP_LOG_LEVEL` | Console log level | `info` | `debug\|info\|warn\|error` |
| `NODE_ENV` | Node environment | `development` | `development\|production` |

### Custom Backend Configuration

**For different backend servers:**
```env
# For local backend
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_VIEWER_ORIGIN=http://localhost:5000

# For staging
REACT_APP_BACKEND_URL=https://staging-bdoc.example.com
REACT_APP_VIEWER_ORIGIN=https://staging-bdoc.example.com

# For production
REACT_APP_BACKEND_URL=https://bdoc.example.com
REACT_APP_VIEWER_ORIGIN=https://bdoc.example.com
```

---

## Verification Checklist

After migration, verify these items:

### ✅ Development Server
- [ ] `npm start` runs without errors
- [ ] Browser opens to `http://localhost:3000`
- [ ] No console errors (F12 → Console tab)
- [ ] App compiles with "Compiled successfully!" message

### ✅ Login Page
- [ ] Login page displays correctly
- [ ] Can enter email and password
- [ ] Can click "Login" button
- [ ] Successfully logs in (mock authentication)
- [ ] Footer NOT visible on login page

### ✅ Navbar (After Login)
- [ ] Navbar displays with black background
- [ ] **14 Elements visible:**
  - Logo + Title (left side)
  - Home, Dashboard, Documents, Components Demo (nav)
  - Edit, Save, Redo, Refresh (edit tools)
  - Search input (always visible)
  - Notifications (bell), Help, Settings, Logout, User menu (right side)
- [ ] All icons display correctly (yellow color)
- [ ] Active page highlighted in yellow
- [ ] Dropdown menus work (click outside to close)

### ✅ Dashboard Page
- [ ] Displays full-width Superset iframe
- [ ] No stat cards or extra UI elements
- [ ] Footer visible at bottom
- [ ] Responsive on mobile

### ✅ Invoices Page
- [ ] Displays full-width invoice viewer iframe
- [ ] Footer visible at bottom
- [ ] Responsive on mobile

### ✅ Footer
- [ ] Displays dark background at bottom
- [ ] Shows copyright year
- [ ] Shows version (v1.0.0)
- [ ] Links display (Privacy Policy, Terms, Support)
- [ ] Hover effects work (yellow on hover)

### ✅ File Structure
Verify these key folders exist:
```
BdocUI/
├── src/
│   ├── components/
│   │   ├── common/          (5 components)
│   │   ├── templates/       (5 templates including FooterTemplate)
│   │   └── layout/
│   ├── pages/               (4 example pages)
│   ├── hooks/               (4 custom hooks)
│   ├── utils/               (4 utility modules)
│   ├── App.jsx
│   └── index.jsx
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── docs/                    (documentation)
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .env                     (create this)
└── .env.example             (reference)
```

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution:** Node.js not installed or not in PATH
```powershell
# Verify installation
node --version

# If not found, install from https://nodejs.org/
```

### Issue: "Port 3000 already in use"
**Solution:** Kill existing process or use different port
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# OR use different port
$env:PORT=3001
npm start
```

### Issue: "Module not found" errors
**Solution:** Reinstall dependencies
```powershell
# Remove node_modules and reinstall
rm -r node_modules
npm install
npm start
```

### Issue: Icons show as circles instead of icons
**Solution:** Bootstrap Icons CSS not imported
- Check `src/index.css` contains:
  ```css
  @import "bootstrap-icons/font/bootstrap-icons.css";
  ```
- If missing, add it after `@tailwind utilities;`
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Iframes not loading (blank dashboard/invoices)
**Solution:** Backend URL not configured correctly
1. Verify `.env` file exists with correct `REACT_APP_BACKEND_URL`
2. Test backend URL in browser:
   ```
   https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net/static/invoices/index.html
   ```
3. Check browser console (F12) for CORS errors
4. Verify backend server is running and accessible

### Issue: Compilation errors
**Solution:** Clear build cache
```powershell
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -r node_modules

# Reinstall
npm install

# Start fresh
npm start
```

### Issue: "Cannot find module '@superset-ui/embedded-sdk'"
**Solution:** Dependencies not fully installed
```powershell
npm install --legacy-peer-deps

# OR specific package
npm install @superset-ui/embedded-sdk
```

---

## Production Build

Once verified, create optimized production build:

```powershell
npm run build
```

This creates an optimized `build/` folder ready for deployment to:
- Azure Static Web Apps
- AWS S3
- Netlify
- Other hosting services

---

## Next Steps

After successful migration:

1. **Copy Image Assets** (optional, for branding):
   ```powershell
   # Copy from docaimain/public
   cp "C:\HDD\NeonApps\BDoc\docaimain\public\favicon.ico" ".\public\"
   cp "C:\HDD\NeonApps\BDoc\docaimain\public\Beeicon.png" ".\public\"
   ```

2. **Connect Real Backend APIs**:
   - See `docs/ARCHITECTURE.md` for integration points
   - Update authentication logic in `src/pages/LoginPageExample.jsx`
   - Configure real Superset token endpoint

3. **Implement Business Logic**:
   - Search functionality in navbar
   - Notification system
   - Settings page
   - Export/reporting features

4. **Testing**:
   - Cross-browser testing
   - Mobile responsive testing
   - Performance testing
   - Security testing

---

## Support Files

Reference these documentation files included in the project:

| File | Purpose |
|------|---------|
| `README.md` | Quick start guide |
| `ARCHITECTURE.md` | System architecture & patterns |
| `ENV_SETUP.md` | Detailed environment configuration |
| `REDESIGN_PLAN.md` | Strategic overview & roadmap |
| `NAVBAR_COMPLETE.md` | Navbar implementation details |
| `NAVBAR_QUICK_REFERENCE.md` | Quick navbar element reference |
| `ASSET_SETUP.md` | Image assets setup |
| `IMPLEMENTATION_CHECKLIST.md` | Developer workflow guide |

---

## Quick Start Command Summary

```powershell
# 1. Navigate to project
cd "C:\path\to\BdocUI"

# 2. Create .env file (copy from .env.example)
# 3. Install dependencies
npm install

# 4. Start development server
npm start

# 5. Open in browser
# http://localhost:3000

# 6. Login with any email/password
# 7. Verify all pages display correctly
```

---

## Additional Resources

- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **React Router:** https://reactrouter.com
- **Bootstrap Icons:** https://icons.getbootstrap.com
- **Superset SDK:** https://superset.apache.org/docs/using-superset/intro

---

**Last Updated:** November 17, 2025  
**Project Version:** v1.0.0
