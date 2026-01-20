# HomieBites Admin (Expo)

Native mobile admin app for HomieBites. Uses the same API as the web-admin (Next.js).

## Setup

1. **API URL**  
   Set `EXPO_PUBLIC_API_URL` to your HomieBites backend:
   - **Production:** `https://your-homiebites.vercel.app` (or your deployed web-admin URL)
   - **Local iOS simulator:** `http://localhost:5050`
   - **Local Android emulator:** `http://10.0.2.2:5050`

   Create a `.env` in the `mobile` folder:
   ```
   EXPO_PUBLIC_API_URL=https://your-homiebites.vercel.app
   ```
   It is loaded automatically when you run `npx expo start`.  
   Or set in the shell: `EXPO_PUBLIC_API_URL=https://... npx expo start`

2. **Install and run**
   ```bash
   npm install
   npx expo start
   ```
   Then press `i` for iOS or `a` for Android.

## Features

- **Login** — Email/password; requires admin role
- **Dashboard** — Total revenue, order count, pending amount
- **Orders** — List with pull-to-refresh
- **Add Order** — Create order (date, address, qty, price, mode, status, payment)
- **Settings** — Profile, API URL, Logout

## Backend

Point `EXPO_PUBLIC_API_URL` at your HomieBites web-admin (or any deployment exposing the same `/api/*` routes).
