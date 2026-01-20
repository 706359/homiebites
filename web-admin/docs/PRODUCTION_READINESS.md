# Production Readiness – Admin Dashboard

**Last checked:** Build passes (`npm run build`), CSS validation passes.

**Fixes applied:** JWT_SECRET/env runtime checks (no prod fallback), FRONTEND_URL/ADMIN_* prod fallbacks removed, `/api/health` minimal in prod, Login and auth `console.*` guarded, rate limiting on auth routes, client `console.*` guarded (MenuPriceTab, AdminLogin), `security.js` `ALLOWED_ORIGINS` fallback fixed, `isPendingStatus` usage with `paymentStatus` where needed.

---

## Must fix before production

### 1. **Secrets and env – no defaults in production**

| Where | Issue | Action |
|-------|--------|--------|
| `lib/middleware/auth.js` | `JWT_SECRET = process.env.JWT_SECRET \|\| 'homiebites_secret'` | **Set `JWT_SECRET`** in production (e.g. 32+ random bytes). Remove or avoid fallback in prod. |
| `app/api/auth/login/route.js` | Same `JWT_SECRET` fallback | Same as above. |
| `app/api/auth/verify-otp/route.js` | Same `JWT_SECRET` fallback | Same as above. |
| `app/api/auth/verify-identity/route.js` | `JWT_SECRET` + `ADMIN_EMAIL` default `'706359@gmail.com'` | Set `JWT_SECRET`, `ADMIN_EMAIL` (and `ADMIN_ID`, `ADMIN_PAN_CARD` if used). |
| `app/api/auth/forgot-password/route.js` | `ADMIN_EMAIL` `'706359@gmail.com'`, `ADMIN_MOBILE` `'8958111112'`, **`FRONTEND_URL` `'http://localhost:3000'`** | Set **`FRONTEND_URL`** to your real app URL (e.g. `https://yoursite.com`) or reset links will point to localhost. Set `ADMIN_EMAIL` and `ADMIN_MOBILE` for your admin. |

### 2. **`MONGOURI`**

- Required; no fallback. Ensure `MONGOURI` (or `MONGODB_URI` / `MONGO_URI` where used) is set in production.

### 3. **`.env` and `.gitignore`**

- `.gitignore` has `.env*.local` but not `.env`. **Confirm `.env` is not committed** (add `.env` to `.gitignore` if it can contain secrets).
- Keep a `.env.example` with *keys only* (no real values) and document required variables.

---

## Should fix (soon after launch)

### 4. **`/api/health` information**

- Returns `hasMongoURI`, `hasJWTSecret`, `nodeEnv`. Reduces info disclosure if you:
  - Restrict `/api/health` to internal/ops only, or
  - Return a minimal `{ status: "healthy" \| "unhealthy" }` in production.

### 5. **Login API logging**

- `app/api/auth/login/route.js` logs **email, userId, isMatch, hasPassword, attempts**, etc. with `console.log`/`console.warn`/`console.error` in all environments.
- **Action:** Guard with `process.env.NODE_ENV === 'development'` or send to a server-side logger that is disabled or redacted in production. Avoid logging passwords (even length is somewhat sensitive).

### 6. **Console in client code**

- `useAdminData`, `MenuPriceTab`, `AnalyticsTab`, `AdminLogin`, and others use `console.log`/`console.warn`/`console.error` that run in production.
- **Action:** Remove or wrap in `NODE_ENV === 'development'`, or replace with a logging util that is no-op in production.

### 7. **Rate limiting**

- `lib/middleware/security.js` has `rateLimit` and `secureAPI`, but **no API route uses them**.
- **Action:** Apply rate limiting (and optionally `secureAPI`) to auth endpoints: `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/register`, `/api/auth/verify-otp`, etc. Login’s own lock after 5 failed attempts is good; rate limiting adds protection against abuse and DDoS.

### 8. **CORS / `ALLOWED_ORIGINS`**

- If `validateOrigin` / `secureAPI` are used and `ALLOWED_ORIGINS` is unset, the fallback may only allow `http://localhost...`, which can block production.
- **Action:** If you rely on this middleware, set `ALLOWED_ORIGINS` in production to your real origins (e.g. `https://yoursite.com`). If you do not use it, ensure Next.js or your host CORS configuration is correct for production.

---

## Nice to have

### 9. **Automated tests**

- Jest is configured; there are no `*.test.js` / `*.spec.js` or `__tests__` files.
- **Action:** Add tests for: login flow, critical API routes (orders, settings, backup/restore), and any core client logic.

### 10. **`FRONTEND_URL` / `NEXT_PUBLIC_SITE_URL`**

- `app/layout.jsx` uses `NEXT_PUBLIC_SITE_URL` or `VITE_SITE_URL` for metadata. Set these in production for correct canonical and OG URLs.

---

## In good shape

| Area | Status |
|------|--------|
| **Build** | `npm run build` and `validate-css:all` pass. |
| **Auth** | `isAdmin` used on sensitive routes; JWT in `Authorization`; login lockout after 5 failed attempts. |
| **Security headers** | `next.config.js`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy. `vercel.json`: X-XSS-Protection, X-Content-Type-Options, X-Frame-Options. |
| **Database** | `MONGOURI` required; no unsafe fallback. `connectDB` used in API routes. |
| **Backup / restore** | Backup downloads JSON; Restore uses file picker, `_restore` for flat settings, `loadSettings` from API, bulk-import with `billingYear` and robust date handling. |
| **Responsive / mobile** | 480px breakpoint, 44px touch targets, `100dvh`/`100vh`, `safe-area-inset`, `-webkit-overflow-scrolling: touch`, `prefers-reduced-motion`. |
| **Error handling** | `createErrorResponse`, try/catch in routes; `details`/stack only in development. |
| **Output** | `output: 'standalone'` for deployment. |

---

## Pre-deploy checklist

- [ ] Set `JWT_SECRET` (strong, random; no `homiebites_secret` in prod).
- [ ] Set `MONGOURI` (or equivalent) for production DB.
- [ ] Set `FRONTEND_URL` to production URL (e.g. `https://homiebites.com`).
- [ ] Set `ADMIN_EMAIL`, `ADMIN_MOBILE` (and `ADMIN_ID`, `ADMIN_PAN_CARD` if used).
- [ ] Confirm `.env` is not in the repo; `.env.example` documents all required keys.
- [ ] (Recommended) Restrict or slim down `/api/health` in production.
- [ ] (Recommended) Guard or remove sensitive `console.*` in login and other auth routes.
- [ ] (Recommended) Add rate limiting to auth routes.

---

## Summary

**Is the dashboard 100% production-ready?**  
**Not yet.** It is close, but **you must**:

1. Set **`JWT_SECRET`** in production (no default secret).
2. Set **`FRONTEND_URL`** so password reset and similar links work.
3. Set **`MONGOURI`** (or equivalent) and ensure **`.env`** is not committed.

After that, the app can run in production. Addressing **Should fix** items (logging, rate limiting, health, console) will harden it and improve operations.
