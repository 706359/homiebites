# Folder Renamed: web → web-admin

## Action Taken

The `web/` folder has been renamed to `web-admin/` to better reflect that it contains both the web application and admin dashboard functionality.

## Changes Made

### Folder Rename
- **From:** `/web/`
- **To:** `/web-admin/`

### Updated Files

1. **`package.json`** - All scripts updated:
   - `"dev": "cd web-admin && npm run dev"`
   - `"web": "cd web-admin && npm run dev"`
   - `"web:build": "cd web-admin && npm run build"`
   - `"web:start": "cd web-admin && npm start"`
   - `"admin": "cd web-admin && npm run dev"`
   - `"admin:build": "cd web-admin && npm run build"`
   - `"admin:start": "cd web-admin && npm start"`
   - `"dev:full": "cd web-admin && npm run dev"`
   - `"dev:all": "cd web-admin && npm run dev"`

## Why This Name?

The folder is named `web-admin` because it contains:
- **Web application** (customer-facing website)
- **Admin dashboard** (integrated admin functionality)
- **API routes** (Next.js API routes for both web and admin)

All running on **localhost:3000**.

## Running the App

All commands remain the same from the root:

```bash
npm run dev          # Runs web-admin
npm run web          # Runs web-admin
npm run admin        # Runs web-admin
npm run build        # Builds web-admin
```

Or from the folder:

```bash
cd web-admin && npm run dev
```

## Verification

✅ Folder renamed successfully
✅ All package.json scripts updated
✅ No broken references
✅ App structure intact

