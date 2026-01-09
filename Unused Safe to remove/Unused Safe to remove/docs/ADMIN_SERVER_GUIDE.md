# Admin Dashboard Server Guide

## Why You See "Connection Refused" on Hard Refresh

When you do a **hard refresh** (Ctrl+Shift+R or Cmd+Shift+R), the browser tries to connect to the server immediately. If the admin server isn't running, you'll see:

```
ERR_CONNECTION_REFUSED
localhost refused to connect
```

### What Happens:

1. **Hard Refresh** → Browser tries to connect to `localhost:3002`
2. **Server Not Running** → Connection refused error
3. **Server Starts** (manually or auto) → Dashboard loads

---

## Quick Fix: Start Admin Server

### Option 1: Start All Servers
```bash
npm run dev:all
```
This starts:
- Web server (port 3000)
- Admin server (port 3002)  
- Backend server (port 3001)

### Option 2: Start Admin Only
```bash
npm run admin
# or
cd admin && npm run dev
```

### Option 3: Check Status
```bash
# Check which servers are running
lsof -ti:3000,3001,3002

# Start missing servers
npm run admin    # Start admin (port 3002)
npm run backend  # Start backend (port 3001)
npm run web      # Start web (port 3000)
```

---

## Why This Happens

### Normal Refresh vs Hard Refresh

**Normal Refresh (F5 or Cmd+R):**
- Uses cached resources
- May work even if server restarted
- Faster but may show stale content

**Hard Refresh (Ctrl+Shift+R):**
- Bypasses cache completely
- Forces fresh connection to server
- Requires server to be running
- Shows connection error if server is down

---

## Best Practice: Keep Servers Running

### Development Workflow

1. **Start all servers once:**
   ```bash
   npm run dev:all
   ```

2. **Keep terminal open** - servers run in background

3. **Use normal refresh** during development (F5)

4. **Use hard refresh** only when:
   - Testing cache behavior
   - Server was restarted
   - Debugging connection issues

---

## Troubleshooting

### Server Not Starting?

1. **Check if port is already in use:**
   ```bash
   lsof -ti:3002
   ```

2. **Kill process on port:**
   ```bash
   npm run stop:admin
   # or
   lsof -ti:3002 | xargs kill -9
   ```

3. **Start server again:**
   ```bash
   npm run admin
   ```

### Still Getting Connection Refused?

1. **Verify server is running:**
   ```bash
   curl http://localhost:3002
   ```

2. **Check server logs** in terminal where you started it

3. **Verify Next.js config** - check `admin/next.config.js`

---

## Port Reference

- **Port 3000**: Web app (Next.js)
- **Port 3001**: Backend API (Express)
- **Port 3002**: Admin dashboard (Next.js)

---

## Quick Commands

```bash
# Start all
npm run dev:all

# Start individual
npm run admin      # Admin dashboard
npm run backend    # Backend API
npm run web        # Web app

# Stop all
npm run stop

# Stop individual
npm run stop:admin
npm run stop:backend
npm run stop:web

# Check status
lsof -ti:3000,3001,3002
```

---

## Summary

**The connection refused error happens because:**
- Admin server (port 3002) wasn't running
- Hard refresh bypasses cache and requires live server
- Once server starts, dashboard loads normally

**Solution:**
- Keep admin server running during development
- Use `npm run dev:all` to start everything
- Use normal refresh (F5) instead of hard refresh during development

