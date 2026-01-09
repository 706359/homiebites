# Files Moved - Not Needed for localhost:3000

This folder contains all files and directories that are **NOT** needed for running the web app on **localhost:3000**.

## What Was Moved

### Complete Directories Moved:
- **`admin/`** - Admin dashboard (runs on port 3002, separate from web app)
- **`scripts/`** - Utility scripts (not needed for running the app)
- **`docs/`** - Documentation files
- **`.vscode/`** - VS Code settings

### Individual Files Moved:
- `.eslintrc.json` - ESLint config
- `.stylelintrc.json` - Stylelint config
- `.DS_Store` - macOS system file

### Previously Moved Files:
- All unused files from the initial scan
- Old/unused components and utilities
- Test files and scripts

## What Remains (For localhost:3000)

The following are kept in the project root for the web app:

- **`web/`** - Web application (Next.js, runs on port 3000)
  - Contains the frontend and admin dashboard (merged)
  - Uses Next.js App Router
  
- **`backend/`** - Backend API server (separate service, runs on port 3001)
  - MongoDB-based REST API
  - Used by the web app for data operations
  - Must remain outside web folder as it's a separate service
  - Migration history: Full backend was migrated with admin, then admin was merged into web
  
- **`shared/`** - Shared resources (styles, utils, locales)
  - Used by both web and potentially other services
  
- **`package.json`** - Root package configuration
- **`package-lock.json`** - Dependency lock file
- **`.git/`** - Git repository
- **`.gitignore`** - Git ignore rules
- **`.cursorrules`** - Cursor AI rules
- **`node_modules/`** - Dependencies
- **`.env*`** - Environment files

## Testing

After moving these files, test the web app:

```bash
# Start the web app
npm run dev

# Or from web directory
cd web && npm run dev
```

The app should run on **http://localhost:3000**

## Restoring Files

If you need to restore any files:

```bash
# Restore entire admin directory
mv "Unused Safe to remove/admin" ./admin

# Restore scripts
mv "Unused Safe to remove/scripts" ./scripts

# Restore specific file
mv "Unused Safe to remove/path/to/file.js" ./path/to/file.js
```

## Architecture Notes

- **Web App (localhost:3000)**: 
  - Next.js application with merged admin dashboard
  - Uses backend API for data operations
  
- **Backend (localhost:3001)**:
  - Separate Express.js service
  - Must remain in root directory (not inside web/)
  - Provides REST API endpoints
  - Migration: Backend was migrated with admin, then admin was merged into web
  
- **Admin Dashboard**:
  - Previously ran on port 3002 (now moved to "Unused Safe to remove")
  - Has been merged into the web app (port 3000)
  
- **Shared Resources**:
  - Kept because used by web app (styles, utils, locales)
  
- All documentation has been moved as it's not needed for running the app

