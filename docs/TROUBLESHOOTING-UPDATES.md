# Troubleshooting: Updates Not Showing

## Quick Fixes

### 1. Hard Refresh Browser
**Windows/Linux:**
- `Ctrl + Shift + R` or `Ctrl + F5`

**Mac:**
- `Cmd + Shift + R` or `Cmd + Option + R`

### 2. Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click on the refresh button
3. Select "Empty Cache and Hard Reload"

### 3. Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd web
npm run dev
```

### 4. Clear Next.js Cache
```bash
cd web
rm -rf .next
npm run dev
```

### 5. Check if Server is Running
Make sure both servers are running:
- **Web**: http://localhost:3000
- **Backend**: http://localhost:3001

## Common Issues

### CSS Not Updating
- Next.js caches CSS files
- Try hard refresh (Cmd/Ctrl + Shift + R)
- Or restart the dev server

### Component Changes Not Showing
- Check browser console for errors
- Make sure file is saved
- Check if component is being imported correctly

### API Changes Not Working
- Restart backend server
- Check if backend is running on port 3001
- Check browser console for API errors

## Verification Steps

1. **Check Terminal Output**
   - Look for compilation errors
   - Check if files are being watched

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Check File Changes**
   - Make sure files are actually saved
   - Check file timestamps

## Force Update All

```bash
# From project root
cd web
rm -rf .next node_modules/.cache
npm run dev
```

---

**If still not working, check:**
- File paths are correct
- Imports are correct
- No syntax errors
- Server is actually running

