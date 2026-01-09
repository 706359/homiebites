# Single Server Setup Guide

The Express server now serves both the API and the admin dashboard, so you only need to run one server.

## Setup Steps

### 1. Build the Admin Dashboard

First, build the admin dashboard:

```bash
cd admin
npm run build
```

This will create the `admin/dist` folder with all the static files.

### 2. Start the Express Server

From the project root:

```bash
cd backend
npm start
```

Or for development with auto-reload:

```bash
cd backend
npm run dev
```

The server will:
- Serve API routes at `/api/*`
- Serve the admin dashboard at all other routes
- Run on port 3001 (or PORT from .env)

### 3. Access the Dashboard

Open your browser and go to:
- **Admin Dashboard**: `http://localhost:3001/admin/login`
- **API Health Check**: `http://localhost:3001/api/health`

## How It Works

1. **API Routes** (`/api/*`) are handled first by Express routes
2. **Static Files** (JS, CSS, images) are served from `admin/dist`
3. **React Router** handles client-side routing via a catch-all route that serves `index.html`

## Development vs Production

### Development Mode
- Run `npm run dev` in the `admin` folder for hot-reload development
- The admin dev server runs on port 3002
- API calls go to port 3001 (backend server)
- Use two servers during development for faster iteration

### Production Mode
- Build the admin dashboard: `cd admin && npm run build`
- Start only the Express server: `cd backend && npm start`
- Everything runs on port 3001
- API calls use relative URLs (`/api/*`)

## Troubleshooting

### "Admin Dashboard Not Built" Message

If you see this message, the `admin/dist` folder doesn't exist. Run:

```bash
cd admin
npm run build
```

### API Routes Not Working

Make sure API routes start with `/api/`. The server prioritizes API routes over static files.

### React Router Routes Not Working

All non-API routes should serve `index.html` for React Router to handle. If routes aren't working, check that the catch-all route is properly configured in `server.js`.

## File Structure

```
backend/
  └── HomieBites/
      └── server.js          # Serves API + Admin Dashboard

admin/
  └── dist/                  # Built admin dashboard (created by npm run build)
      ├── index.html
      ├── assets/
      └── ...
```

## Environment Variables

The server uses these environment variables:

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Allowed CORS origin (optional)
- Other MongoDB and JWT variables as needed

