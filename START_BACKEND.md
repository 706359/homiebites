# How to Start Backend Server

## Quick Start

1. **Open a terminal and navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Start the backend server:**

   ```bash
   node server.js
   ```

   Or if you prefer npm:

   ```bash
   npm start
   ```

3. **You should see:**

   ```
   Connected to MongoDB
   HomieBites backend server running on port 3001
   ```

4. **Verify it's running:**
   - Open browser: http://localhost:3001/api/health
   - Should see: `{"status":"ok","message":"Backend server is running",...}`

## Important Notes

- **Backend must run on port 3001** (frontend expects this)
- **Backend must be running** before accessing admin dashboard
- **MongoDB must be connected** (check your `.env` file in `backend/` directory)

## Troubleshooting

### If you see "MongoDB connection error":

- Check your `backend/.env` file has `MONGOURI=...` set correctly
- Ensure MongoDB is running/accessible

### If port 3001 is already in use:

- Stop the process using port 3001
- Or change `PORT=3001` in `backend/.env` (but update frontend `.env` too)

### To run backend and frontend together:

```bash
# From root directory
npm run dev:full
```

Or in separate terminals:

- Terminal 1: `cd backend && node server.js`
- Terminal 2: `cd web && npm run dev`
