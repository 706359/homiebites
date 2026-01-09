# Backend Folder - Migrated to Web App

## Why This Folder Was Moved

The `backend/` folder contains the **old Express.js backend server** that has been **fully migrated** into the web app as **Next.js API routes**.

## Migration Details

### What Was Migrated:

1. **API Routes** → `web/app/api/`
   - All Express routes migrated to Next.js API routes
   - Auth routes: `/api/auth/*`
   - Orders routes: `/api/orders/*`
   - Menu, Offers, Reviews, Gallery, Settings routes

2. **Database Models** → `web/lib/models/`
   - Order.js
   - User.js
   - Menu.js
   - Offers.js
   - Review.js
   - Gallery.js
   - Settings.js

3. **Database Connection** → `web/lib/db.js`
   - MongoDB connection using mongoose
   - Cached connection for Next.js

4. **Middleware** → `web/lib/middleware/auth.js`
   - Authentication middleware
   - Admin check functions

5. **Controllers** → Integrated into API routes
   - All controller logic moved into Next.js API route handlers

## Current Architecture

**Before (Old):**
```
backend/ (Express server on port 3001)
  └── API endpoints

web/ (Next.js frontend on port 3000)
  └── Calls backend API
```

**After (Current):**
```
web/ (Next.js full-stack on port 3000)
  ├── Frontend (React components)
  └── API Routes (Next.js API routes)
      └── All backend functionality
```

## Verification

The web app **does NOT import anything** from the `backend/` folder. All functionality is now in:
- `web/app/api/` - API routes
- `web/lib/models/` - Database models
- `web/lib/db.js` - Database connection
- `web/lib/middleware/` - Auth middleware

## Notes

- The backend folder was running on **port 3001** (separate server)
- The web app now runs everything on **port 3000** (Next.js handles both frontend and API)
- All API routes are accessible at `/api/*` when running the web app
- No separate backend server is needed anymore

## If You Need to Restore

If for some reason you need the old Express backend:

```bash
mv "Unused Safe to remove/backend" ./backend
cd backend && npm install
npm start  # Runs on port 3001
```

But this should **NOT be necessary** as everything is now in the web app.

