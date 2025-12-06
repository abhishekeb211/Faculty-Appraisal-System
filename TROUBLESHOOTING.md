# Troubleshooting Guide

Comprehensive troubleshooting guide for the Faculty Appraisal System. This document covers common issues, error solutions, and debugging procedures.

## 📋 Table of Contents

- [Installation Issues](#installation-issues)
- [Development Server Issues](#development-server-issues)
- [Build Issues](#build-issues)
- [API Connection Issues](#api-connection-issues)
- [Authentication Issues](#authentication-issues)
- [Runtime Errors](#runtime-errors)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)
- [Environment Variable Issues](#environment-variable-issues)
- [Debugging Checklist](#debugging-checklist)

## Installation Issues

### Issue: npm install fails

**Symptoms:**
- Error messages about missing dependencies
- Permission denied errors
- Network timeout errors
- Package version conflicts

**Solutions:**

**Windows:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall with admin privileges if needed
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

**If still failing:**
- Check Node.js version: `node --version` (should be 18+)
- Try using `npm ci` instead of `npm install`
- Check internet connection
- Try using a different npm registry: `npm config set registry https://registry.npmjs.org/`

---

### Issue: Node.js version mismatch

**Symptoms:**
- Errors about unsupported Node.js version
- Build failures with version-specific errors

**Solutions:**
1. Check current version: `node --version`
2. Install Node.js 18+ or 20 LTS from [nodejs.org](https://nodejs.org/)
3. Use nvm (Node Version Manager) to switch versions:
   ```bash
   nvm install 20
   nvm use 20
   ```

---

### Issue: Permission errors on installation

**Symptoms:**
- EACCES errors
- Permission denied when installing packages

**Solutions:**

**Linux/macOS:**
```bash
# Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Or use sudo (not recommended)
sudo npm install
```

**Windows:**
- Run PowerShell/CMD as Administrator
- Or fix npm permissions in npm config

---

### Issue: Package not found errors

**Symptoms:**
- `Error: Cannot find module 'xyz'`
- Module resolution errors

**Solutions:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# If specific package fails, try installing it separately
npm install <package-name> --save
```

## Development Server Issues

### Issue: Port 5173 already in use

**Symptoms:**
- Error: `Port 5173 is in use`
- Server won't start

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

# Or use fuser
fuser -k 5173/tcp
```

---

### Issue: Development server not starting

**Symptoms:**
- Server starts but immediately crashes
- No output in terminal
- HMR (Hot Module Replacement) not working

**Solutions:**
1. Check for syntax errors in code
2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```
3. Check `vite.config.js` for configuration errors
4. Verify all dependencies are installed correctly
5. Check terminal for error messages

---

### Issue: Hot Module Replacement (HMR) not working

**Symptoms:**
- Changes not reflecting in browser
- Full page reload required
- Console shows HMR errors

**Solutions:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart development server
4. Check browser console for errors
5. Verify Vite HMR is enabled in `vite.config.js`

## Build Issues

### Issue: Build fails with module errors

**Symptoms:**
- `Error: Cannot find module`
- Import/export errors
- Type errors

**Solutions:**
```bash
# Run linter to identify issues
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Clear build cache
rm -rf dist node_modules/.vite

# Rebuild
npm run build
```

---

### Issue: Build succeeds but app doesn't work

**Symptoms:**
- Build completes without errors
- App shows blank page or errors in production

**Solutions:**
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Check that `dist/index.html` exists
4. Verify all assets are included in build
5. Test with `npm run preview` locally first

---

### Issue: Large bundle size

**Symptoms:**
- Build output is very large
- Slow page loads

**Solutions:**
1. Check for duplicate dependencies
2. Use code splitting (lazy loading)
3. Remove unused dependencies
4. Analyze bundle: `npm run build -- --analyze` (if configured)
5. Check for large assets/images

## API Connection Issues

### Issue: Cannot connect to backend API

**Symptoms:**
- CORS errors in browser console
- Network errors
- 404 errors for API endpoints
- Connection refused errors

**Solutions:**

1. **Verify backend server is running:**
   ```bash
   # Check if backend is accessible
   curl http://localhost:5000/health
   # Or open in browser
   ```

2. **Check VITE_BASE_URL in .env:**
   ```env
   VITE_BASE_URL=http://localhost:5000
   ```
   - Ensure no trailing slash
   - Use correct protocol (http/https)
   - Match backend server URL exactly

3. **Verify CORS configuration on backend:**
   - Backend must allow requests from frontend origin
   - Check backend CORS settings

4. **Check network connectivity:**
   - Ensure both frontend and backend are on same network
   - Check firewall settings
   - Verify ports are not blocked

5. **Browser console debugging:**
   ```javascript
   // Check if environment variable is loaded
   console.log(import.meta.env.VITE_BASE_URL);
   
   // Test API connection
   fetch(`${import.meta.env.VITE_BASE_URL}/health`)
     .then(r => console.log('API connected:', r.ok))
     .catch(e => console.error('API error:', e));
   ```

---

### Issue: CORS errors

**Symptoms:**
- Browser console shows: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- Preflight request fails

**Solutions:**
1. **Backend must allow CORS:**
   ```javascript
   // Example backend CORS configuration
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));
   ```

2. **For development, use proxy in vite.config.js:**
   ```javascript
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:5000',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, '')
         }
       }
     }
   });
   ```

3. **Check backend CORS headers:**
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Methods`
   - `Access-Control-Allow-Headers`

---

### Issue: API returns 401 Unauthorized

**Symptoms:**
- All API calls return 401
- User appears logged out

**Solutions:**
1. Check if userData exists in localStorage:
   ```javascript
   console.log(localStorage.getItem('userData'));
   ```
2. Verify authentication token is being sent (if backend uses tokens)
3. Check if session expired
4. Try logging in again
5. Clear localStorage and re-authenticate

---

### Issue: API returns 404 Not Found

**Symptoms:**
- Specific endpoints return 404
- Endpoint doesn't exist

**Solutions:**
1. Verify endpoint URL is correct
2. Check backend API documentation
3. Ensure backend server has the endpoint implemented
4. Check for typos in endpoint paths
5. Verify department/user IDs in URL are correct

## Authentication Issues

### Issue: Cannot log in

**Symptoms:**
- Login form doesn't submit
- Error messages on login
- Redirect doesn't work

**Solutions:**
1. **Check backend API is running**
2. **Verify credentials:**
   - Admin: `admin2025` / `admin2025`
   - Regular users: Check with backend admin
3. **Check browser console for errors**
4. **Verify VITE_BASE_URL is set correctly**
5. **Check network tab for failed requests**
6. **Clear localStorage and try again:**
   ```javascript
   localStorage.clear();
   ```

---

### Issue: User gets logged out unexpectedly

**Symptoms:**
- User data disappears
- Redirected to login page
- Session lost

**Solutions:**
1. Check if localStorage is being cleared
2. Verify browser settings (private mode, cookies disabled)
3. Check for code that calls `logout()`
4. Verify userData structure in localStorage
5. Check for browser extensions that clear storage

---

### Issue: userRole is undefined

**Symptoms:**
- `userRole` is undefined in components
- Role-based routing fails

**Solutions:**
1. **Verify AuthContext provides userRole:**
   ```javascript
   const { userRole } = useAuth();
   console.log('User Role:', userRole);
   ```
2. **Check userData structure:**
   ```javascript
   const userData = JSON.parse(localStorage.getItem('userData'));
   console.log('User Data:', userData);
   // Should have 'role' or 'desg' property
   ```
3. **Ensure AuthContext is updated** (see recent fixes)
4. **Check if userData exists before accessing role**

## Runtime Errors

### Issue: "Cannot read property of undefined"

**Symptoms:**
- Console errors about undefined properties
- App crashes on certain actions

**Solutions:**
1. **Add null checks:**
   ```javascript
   const userData = userData?.property || defaultValue;
   ```
2. **Use optional chaining:**
   ```javascript
   const value = data?.nested?.property;
   ```
3. **Check data structure before accessing**
4. **Add error boundaries in React components**

---

### Issue: Styles not loading

**Symptoms:**
- Unstyled components
- Missing CSS classes
- Tailwind classes not working

**Solutions:**
1. **Verify Tailwind configuration:**
   - Check `tailwind.config.js` exists
   - Verify content paths include `src/**/*.{js,jsx}`
2. **Check Vite config:**
   - Ensure `@tailwindcss/vite` plugin is included
3. **Restart development server**
4. **Clear browser cache**
5. **Verify `index.css` imports Tailwind:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

---

### Issue: Components not rendering

**Symptoms:**
- Blank page
- Components don't appear
- React errors in console

**Solutions:**
1. **Check browser console for errors**
2. **Verify React is imported correctly**
3. **Check component exports:**
   ```javascript
   export default ComponentName;
   ```
4. **Verify routes are configured correctly**
5. **Check for circular dependencies**
6. **Verify all imports are correct**

---

### Issue: State not updating

**Symptoms:**
- UI doesn't reflect state changes
- State appears stuck

**Solutions:**
1. **Check if state setter is being called**
2. **Verify React hooks are used correctly**
3. **Check for state mutations (should use immutable updates)**
4. **Verify Context Provider is wrapping components**
5. **Check for multiple state updates in same render**

## Performance Issues

### Issue: Slow page loads

**Symptoms:**
- Long initial load time
- Slow navigation between pages

**Solutions:**
1. **Implement code splitting:**
   ```javascript
   const Component = lazy(() => import('./Component'));
   ```
2. **Optimize images:**
   - Use WebP format
   - Compress images
   - Use lazy loading
3. **Check bundle size:**
   ```bash
   npm run build
   # Check dist folder size
   ```
4. **Remove unused dependencies**
5. **Enable production build optimizations**

---

### Issue: Memory leaks

**Symptoms:**
- Browser becomes slow over time
- High memory usage

**Solutions:**
1. **Clean up event listeners:**
   ```javascript
   useEffect(() => {
     const handler = () => {};
     window.addEventListener('event', handler);
     return () => window.removeEventListener('event', handler);
   }, []);
   ```
2. **Clear intervals/timeouts:**
   ```javascript
   useEffect(() => {
     const timer = setInterval(() => {}, 1000);
     return () => clearInterval(timer);
   }, []);
   ```
3. **Unsubscribe from subscriptions**
4. **Use React DevTools Profiler to identify leaks**

## Browser Compatibility

### Issue: App doesn't work in certain browsers

**Symptoms:**
- Features broken in specific browsers
- Console shows compatibility errors

**Solutions:**
1. **Check browser support:**
   - Chrome/Edge: Full support
   - Firefox: Full support
   - Safari: May need polyfills
   - IE11: Not supported
2. **Add polyfills for older browsers:**
   ```bash
   npm install core-js
   ```
3. **Check for browser-specific APIs**
4. **Test in multiple browsers**
5. **Use feature detection:**
   ```javascript
   if ('feature' in window) {
     // Use feature
   }
   ```

## Environment Variable Issues

### Issue: VITE_BASE_URL is undefined

**Symptoms:**
- `import.meta.env.VITE_BASE_URL` is undefined
- API calls fail

**Solutions:**
1. **Verify .env file exists in root directory**
2. **Check variable name starts with VITE_:**
   ```env
   VITE_BASE_URL=http://localhost:5000
   ```
3. **Restart development server after changing .env**
4. **Check for typos in variable name**
5. **Verify .env file is not in .gitignore incorrectly**
6. **For production builds, set variables in build environment**

---

### Issue: Environment variables not updating

**Symptoms:**
- Changes to .env don't take effect
- Old values still used

**Solutions:**
1. **Restart development server** (required for Vite)
2. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   ```
3. **Verify .env file syntax** (no spaces around =)
4. **Check for multiple .env files** (.env.local takes precedence)

## Debugging Checklist

### General Debugging Steps

1. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Verify environment:**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   ```

3. **Check configuration files:**
   - `package.json` - Dependencies
   - `vite.config.js` - Build configuration
   - `.env` - Environment variables
   - `tailwind.config.js` - Styling configuration

4. **Clear caches:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Clear Vite cache
   rm -rf node_modules/.vite
   
   # Clear browser cache
   # Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   ```

5. **Verify dependencies:**
   ```bash
   # Check for outdated packages
   npm outdated
   
   # Check for security vulnerabilities
   npm audit
   ```

6. **Test in isolation:**
   - Create minimal test case
   - Isolate the problematic feature
   - Check if issue persists in new project

7. **Check logs:**
   - Terminal output
   - Browser console
   - Network requests
   - Backend server logs

### Common Error Messages and Solutions

| Error Message | Solution |
|--------------|----------|
| `Cannot find module` | Run `npm install` |
| `Port already in use` | Change port or kill process |
| `CORS error` | Configure backend CORS |
| `VITE_BASE_URL is undefined` | Check .env file |
| `userRole is undefined` | Check AuthContext implementation |
| `Styles not loading` | Restart dev server, check Tailwind config |
| `Build fails` | Run `npm run lint`, fix errors |

### Getting Help

If issues persist:

1. **Check documentation:**
   - [README.md](./README.md)
   - [INSTALLATION.md](./INSTALLATION.md)
   - [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md)

2. **Collect information:**
   - Error messages
   - Browser console logs
   - Network request details
   - Steps to reproduce

3. **Check for known issues:**
   - Review [PROJECT-NOTES.md](./PROJECT-NOTES.md)
   - Check GitHub issues (if applicable)

4. **Verify setup:**
   - All prerequisites installed
   - Backend server running
   - Environment variables configured
   - Dependencies installed

---

**Last Updated**: Current Date  
**Maintained By**: Development Team

For additional help, refer to the main [README.md](./README.md) or project documentation.

