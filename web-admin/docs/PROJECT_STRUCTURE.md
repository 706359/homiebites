# HomieBites Web Admin — Project Structure

Full project structure documentation for the HomieBites web admin and public site.

---

## 1. Overview

| Property       | Value                                      |
| -------------- | ------------------------------------------ |
| **Project**    | HomieBites Web (homiebites-web)            |
| **Version**    | 1.0.0                                      |
| **Framework**  | Next.js 16 (App Router)                    |
| **Runtime**    | Node.js, React 19                          |
| **Database**   | MongoDB (Mongoose)                         |
| **Deployment** | Vercel-ready, standalone output, port 5050 |

**Purpose:** Premium tiffin service site (public pages) + admin dashboard for orders, menu, gallery, settings, and analytics.

---

## 2. Tech Stack

| Layer             | Technology                                                                        |
| ----------------- | --------------------------------------------------------------------------------- |
| **Frontend**      | React 19, Next.js 16 (App Router), PostCSS, utilities.css + module CSS            |
| **Backend / API** | Next.js Route Handlers (App Router `/app/api/*`)                                  |
| **Database**      | MongoDB via Mongoose 8                                                            |
| **Auth**          | JWT (`homiebites_token`), `homiebites_admin`, `homiebites_user` in `localStorage` |
| **Email**         | Nodemailer, SendGrid (`@sendgrid/mail`)                                           |
| **Excel**         | ExcelJS (orders import/export)                                                    |
| **i18n**          | Custom `LanguageContext` + `shared/locales` (en, hi)                              |
| **PWA**           | Admin: `admin-manifest.json`, `admin-sw.js` (scope `/admin/`)                     |

**Also present (legacy/optional):** Vite 7, `vite.config.js` (e.g. alternative build). Primary run is `next dev` / `next build` / `next start`.

---

## 3. Root Directory Layout

```
web-admin/
├── .cursorrules          # Cursor AI rules: buttons, CSS, borders, backups, etc.
├── .gitignore
├── next.config.js        # Next.js config, standalone, images, @/ alias, env
├── vite.config.js        # Vite (optional): @/ alias, port 5050, dist
├── postcss.config.js     # postcss-import, autoprefixer
├── vercel.json           # Vercel: nextjs, rewrites /admin, security headers
├── web.config             # IIS / Windows hosting (if used)
├── package.json
├── package-lock.json
├── INLINE_STYLES_CONVERSION_REPORT.json
│
├── app/                   # Next.js App Router (pages + API)
├── components/            # React components (public + admin)
├── contexts/              # React contexts (Language, Notification)
├── hooks/                 # Global hooks (smoothScroll, reveal, keyboard)
├── lib/                   # DB, API clients, models, middleware, services
├── shared/                # i18n, shared CSS variables
├── styles/                # Global CSS (globals, chatbot)
├── public/                # Static assets, manifests, PWA, images
├── scripts/               # DB, admin, CSS validation, commit-msg
├── docs/                  # Internal docs (CSS, dashboard, audits)
├── pages/                 # Legacy (OffersPage.css only; app/ is primary)
└── Documents/             # Build/artifact dir (e.g. .next), typically gitignored
```

---

## 4. App Router — `app/`

### 4.1 Layouts & Wrappers

| File                   | Role                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `app/layout.jsx`       | Root: metadata, SEO, OG, manifest, fonts (Baloo 2, Font Awesome), `ClientLayout`                                         |
| `app/ClientLayout.jsx` | `LanguageProvider` → `NotificationProvider`, `FontSettingsLoader`, `LanguageHandler`, `ScrollToTop`, `HashScrollHandler` |
| `app/admin/layout.jsx` | Admin-only: swap manifest to `admin-manifest.json`, register `admin-sw.js` (scope `/admin/`)                             |
| `app/error.jsx`        | Global error UI (Header, Footer, try-again, go-home, dev error details)                                                  |
| `app/loading.jsx`      | Global loading: `PremiumLoader`                                                                                          |
| `app/not-found.jsx`    | 404: Header, Footer, go-home, view-menu                                                                                  |

### 4.2 Public Pages

| Route     | File                  | Purpose                                                                                                 |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`       | `app/page.jsx`        | Home: Header, Hero, Features, SpecialOffer, Gallery, Testimonials, FAQ, About, Contact, Footer, Chatbot |
| `/menu`   | `app/menu/page.jsx`   | Menu page                                                                                               |
| `/offers` | `app/offers/page.jsx` | Offers page                                                                                             |
| `/faq`    | `app/faq/page.jsx`    | FAQ page                                                                                                |
| `/search` | `app/search/page.jsx` | Search                                                                                                  |
| `/login`  | `app/login/page.jsx`  | Login                                                                                                   |

### 4.3 Admin Pages

| Route                           | File                                        | Purpose                                                          |
| ------------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `/admin`                        | `app/admin/page.jsx`                        | Admin landing / redirect (often to login or dashboard)           |
| `/admin/dashboard`              | `app/admin/dashboard/page.jsx`              | Main dashboard: `AdminDashboard` (tabs, Sidebar, TopNav, modals) |
| `/admin/forgot-password`        | `app/admin/forgot-password/page.jsx`        | Forgot password                                                  |
| `/admin/change-password`        | `app/admin/change-password/page.jsx`        | Change password (`ChangePasswordForm`)                           |
| `/admin/reset-password/[token]` | `app/admin/reset-password/[token]/page.jsx` | Reset password with token (`ResetPasswordForm`)                  |

**Admin CSS (co-located):**

- `app/admin/change-password/change-password.css`
- `app/admin/reset-password/[token]/reset-password.css`

---

## 5. API Routes — `app/api/`

All under `app/api/`; handlers use `route.js` and export `GET`, `POST`, `PUT`, `PATCH`, `DELETE` as needed.

### 5.1 Auth — `app/api/auth/`

| Path                               | Methods | Purpose                         |
| ---------------------------------- | ------- | ------------------------------- |
| `/api/auth/login`                  | POST    | Admin/user login, JWT           |
| `/api/auth/register`               | POST    | User registration               |
| `/api/auth/verify`                 | GET     | Token verification              |
| `/api/auth/verify-otp`             | POST    | OTP verification                |
| `/api/auth/verify-identity`        | POST    | Identity (email, PAN, etc.)     |
| `/api/auth/forgot-password`        | POST    | Forgot password flow            |
| `/api/auth/reset-password`         | POST    | Reset password (no token)       |
| `/api/auth/reset-password/[token]` | POST    | Reset password with token       |
| `/api/auth/change-password`        | POST    | Change password (authenticated) |
| `/api/auth/users`                  | GET     | List users                      |

**Env:** `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_MOBILE`, `ADMIN_ID`, `ADMIN_PAN_CARD`, `FRONTEND_URL`.

### 5.2 Orders — `app/api/orders/`

| Path                             | Methods     | Purpose                          |
| -------------------------------- | ----------- | -------------------------------- |
| `/api/orders`                    | GET, POST   | List orders, create order        |
| `/api/orders/[id]`               | PUT, DELETE | Update, delete order             |
| `/api/orders/manual`             | POST        | Create manual order              |
| `/api/orders/my-orders`          | GET         | Current user’s orders            |
| `/api/orders/upload-excel`       | POST        | Excel import                     |
| `/api/orders/bulk-import`        | POST        | Bulk import                      |
| `/api/orders/cleanup-duplicates` | POST        | Remove duplicates                |
| `/api/orders/clear-all`          | DELETE      | Clear all orders (use with care) |

### 5.3 Gallery — `app/api/gallery/`

| Path                       | Methods     | Purpose        |
| -------------------------- | ----------- | -------------- |
| `/api/gallery`             | GET, POST   | List, create   |
| `/api/gallery/[id]`        | PUT, DELETE | Update, delete |
| `/api/gallery/bulk-update` | PUT         | Bulk update    |

### 5.4 Reviews — `app/api/reviews/`

| Path                | Methods     | Purpose        |
| ------------------- | ----------- | -------------- |
| `/api/reviews`      | GET, POST   | List, create   |
| `/api/reviews/[id]` | PUT, DELETE | Update, delete |

### 5.5 Menu, Offers, Settings

| Path                 | Methods          | Purpose               |
| -------------------- | ---------------- | --------------------- |
| `/api/menu`          | GET, PUT, DELETE | Menu CRUD             |
| `/api/offers`        | GET, PUT         | Offers get/update     |
| `/api/settings`      | GET, PUT         | Settings              |
| `/api/settings/full` | GET              | Full settings payload |

### 5.6 Health

| Path          | Methods | Purpose                                               |
| ------------- | ------- | ----------------------------------------------------- |
| `/api/health` | GET     | Health: MongoDB, `NODE_ENV`, `MONGOURI`, `JWT_SECRET` |

**Common env across API:** `MONGOURI`, `JWT_SECRET`; some routes use `API_KEY`, `ALLOWED_ORIGINS`, `ADMIN_*`, `SMTP_*`, `FRONTEND_URL`.

---

## 6. Components — `components/`

### 6.1 Public / Marketing

| Component             | CSS                     | Role                                     |
| --------------------- | ----------------------- | ---------------------------------------- |
| `Header`              | Header.css              | Nav, logo, order CTA                     |
| `Hero`                | Hero.css                | Hero section, order CTA                  |
| `Features`            | Features.css            | Feature blocks                           |
| `SpecialOffer`        | SpecialOffer.css        | Promo/offer block                        |
| `Gallery`             | Gallery.css             | Image gallery (uses `/api/gallery`)      |
| `Testimonials`        | Testimonials.css        | Testimonials                             |
| `FAQ`                 | FAQ.css                 | FAQ accordion                            |
| `About`               | About.css               | About section                            |
| `Contact`             | Contact.css             | Contact                                  |
| `Footer`              | Footer.css              | Footer, links                            |
| `Chatbot`             | —                       | Chatbot (styles in `styles/chatbot.css`) |
| `OrderModal`          | OrderModal.css          | Order modal (public)                     |
| `ReviewForm`          | ReviewForm.css          | Review form                              |
| `ErrorBoundary`       | —                       | Error boundary                           |
| `FontSettingsLoader`  | —                       | Loads user font-size prefs from API      |
| `LanguageSwitcher`    | —                       | Language toggle                          |
| `NotificationWrapper` | NotificationWrapper.css | Toast/notification wrapper               |
| `PremiumLoader`       | —                       | Loading spinner                          |

### 6.2 Admin — `components/admin/`

| Component                      | CSS                     | Role                                                                                                                                                      |
| ------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AdminDashboard`               | —                       | Main container: tabs, Sidebar, TopNav, OrderModal, CSVUploadModal, ConfirmationModal, `useFastDataSync`                                                   |
| `AdminLogin`                   | AdminLogin.css          | Admin login form                                                                                                                                          |
| `AdminForgotPassword`          | AdminForgotPassword.css | Forgot password form                                                                                                                                      |
| `Sidebar`                      | in styles               | Nav: dashboard, allOrdersData, currentMonthOrders, analytics, customers, reports, pendingAmounts, menuPrice, notifications, settings (from `adminConfig`) |
| `TopNav`                       | —                       | Top bar, order/CSV actions, etc.                                                                                                                          |
| `DashboardTab`                 | —                       | Dashboard summary/stats                                                                                                                                   |
| `AllOrdersDataTab`             | —                       | All-orders table, filters, Excel                                                                                                                          |
| `CurrentMonthOrdersTab`        | —                       | Current month orders                                                                                                                                      |
| `AllAddressesTab`              | —                       | Addresses (Customers)                                                                                                                                     |
| `AnalyticsTab`                 | AnalyticsTab.css        | Analytics/charts                                                                                                                                          |
| `ReportsTab`                   | —                       | Reports                                                                                                                                                   |
| `PendingAmountsTab`            | —                       | Pending amounts                                                                                                                                           |
| `MenuPriceTab`                 | —                       | Menu and pricing                                                                                                                                          |
| `NotificationsTab`             | —                       | Notifications                                                                                                                                             |
| `SettingsTab`                  | —                       | Settings                                                                                                                                                  |
| `OrderModal`                   | —                       | Create/edit order (admin)                                                                                                                                 |
| `CSVUploadModal`               | csv-upload-modal.css    | Excel upload                                                                                                                                              |
| `ConfirmationModal`            | —                       | Confirm/cancel dialogs                                                                                                                                    |
| `EmptyState`                   | —                       | Empty state UI                                                                                                                                            |
| `SkeletonLoader`               | —                       | Loading skeletons                                                                                                                                         |
| `ErrorBoundary`                | —                       | Admin error boundary                                                                                                                                      |
| `ImportantNotificationsBanner` | —                       | Banner for important notifications                                                                                                                        |
| `InstallPrompt`                | —                       | PWA install prompt                                                                                                                                        |
| `NotificationWrapper`          | —                       | Admin notifications                                                                                                                                       |
| `PremiumLoader`                | —                       | Admin loading                                                                                                                                             |

**Admin config:** `components/admin/utils/adminConfig.js` — `adminFeatures` (dashboard, excelViewer, orders, analytics, customers, reports, pendingAmounts, notifications, settings, menuPrice) with `name`, `icon`, `enabled`.

### 6.3 Admin — Subfolders

| Path                         | Contents                                                                                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/admin/contexts/` | `NotificationContext.jsx`                                                                                                                                                                            |
| `components/admin/hooks/`    | `useAdminData.js`, `useFastDataSync.js`, `useOptimisticData.js`                                                                                                                                      |
| `components/admin/utils/`    | `adminConfig.js`, `calculations.js`, `dataSyncManager.js`, `dateUtils.js`, `errorTracker.js`, `notificationMessages.js`, `orderUtils.js`, `sidebarFontSizeFix.js`, `themeFixer.js`, `useDebounce.js` |
| `components/admin/styles/`   | Admin CSS (see Section 8)                                                                                                                                                                            |

---

## 7. Styles — `components/admin/styles/`

| File                                | Role                                                                                                             |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `index.css`                         | Variables (`:root`), font-size scale, and dashboard layout (`.admin-dashboard`, `.admin-main`, `.admin-content`) |
| `adminStyles.js`                    | Loads `index.css` + all modules via JS import                                                                    |
| `modules/sidebar.css`               | Sidebar component                                                                                                |
| `modules/topnav.css`                | Top navigation                                                                                                   |
| `modules/modals.css`                | Admin-specific modals                                                                                            |
| `modules/tables.css`                | Tables and action bars                                                                                           |
| `modules/filters.css`               | Filter components                                                                                                |
| `modules/forms.css`                 | Form styles                                                                                                      |
| `modules/cards.css`                 | Stat cards                                                                                                       |
| `modules/badges.css`                | Badge styles                                                                                                     |
| `modules/empty-states.css`          | Empty state styles                                                                                               |
| `modules/notifications.css`         | Notification styles                                                                                              |
| `modules/inputs.css`                | Search inputs and selects                                                                                        |
| `modules/utilities.css`             | Skeleton loaders, animations, utilities                                                                          |
| `modules/dashboard.css`             | Dashboard-specific styles                                                                                        |
| `modules/pending-amounts.css`       | Pending amounts tab styles                                                                                       |
| `modules/menu-price.css`            | Menu price tab styles                                                                                            |
| `modules/notifications-grid.css`    | Notifications grid styles                                                                                        |
| `modules/settings.css`              | Settings tab styles                                                                                              |
| `modules/csv-upload-modal.css`      | CSV upload modal                                                                                                 |
| `modules/analytics-tab.css`         | Analytics tab styles                                                                                             |
| `modules/admin-login.css`           | Admin login page styles                                                                                          |
| `modules/admin-forgot-password.css` | Admin forgot password page styles                                                                                |

**Structure:** `index.css` holds variables and layout; `adminStyles.js` imports it and all modules (no CSS `@import`). No `admin-core.css` or `admin-components.css`.

---

## 8. Global Styles

| File                          | Role                             |
| ----------------------------- | -------------------------------- |
| `styles/globals.css`          | Global resets, utilities, layout |
| `styles/chatbot.css`          | Chatbot                          |
| `shared/styles/shared.css`    | Shared layout/component base     |
| `shared/styles/variables.css` | CSS variables                    |

**Loading order (from `app/layout.jsx`):** `shared/styles/shared.css` → `styles/globals.css`.

---

## 9. Lib — `lib/`

### 9.1 Core

| File                    | Role                                                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `db.js`                 | `connectDB()` — Mongoose connect with `MONGOURI`, cached connection                                                                                       |
| `api.js`                | Public/customer API client: `api.request()`, `api.get/post/put/delete`, `NEXT_PUBLIC_API_URL` / `API_URL` / `VITE_API_URL`, Bearer `homiebites_token`     |
| `api-admin.js`          | Admin API client: `retryAsync`, `api.request()`, FormData and JSON, `homiebites_token`                                                                    |
| `auth-admin.js`         | `login` (deprecated), `logout`, `isAuthenticated`, `requireAuth`; keys `homiebites_admin`, `homiebites_user`, `homiebites_token`, `homiebites_token_meta` |
| `menuData.js`           | Default menu (Full Tiffin, Mix & Match, Khichdi, etc.) and helpers; can sync with `/api/menu`                                                             |
| `offersData.js`         | Offers data and helpers                                                                                                                                   |
| `businessConstants.js`  | Business rules/constants                                                                                                                                  |
| `formValidation.js`     | Form validation helpers                                                                                                                                   |
| `globalErrorHandler.js` | `setupGlobalErrorHandlers` for unhandled rejections/errors                                                                                                |
| `password.js`           | `lib/utils/password.js` — hash/compare (bcrypt)                                                                                                           |

### 9.2 Models — `lib/models/`

| Model      | Collection / Purpose                                                                                                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `User`     | Users; name, email, username, password, role, 2FA, reset/verify tokens, etc.                                                                                                                                    |
| `Order`    | `orders`; orderId, date, user, deliveryAddress, quantity, unitPrice, totalAmount, paymentStatus, paymentMode, mode, status, source (manual/excel/api), billingMonth/Year, notes, priceOverride, dateNeedsReview |
| `Menu`     | Menu items/categories                                                                                                                                                                                           |
| `Offers`   | Offers                                                                                                                                                                                                          |
| `Gallery`  | Gallery images                                                                                                                                                                                                  |
| `Review`   | Reviews                                                                                                                                                                                                         |
| `Settings` | App/business settings                                                                                                                                                                                           |

### 9.3 Middleware — `lib/middleware/`

| File                 | Role                                    |
| -------------------- | --------------------------------------- |
| `auth.js`            | JWT verify; `JWT_SECRET`                |
| `inputValidation.js` | Request body/query validation           |
| `security.js`        | `API_KEY` check, `ALLOWED_ORIGINS` CORS |

### 9.4 Services & Utils

| Path                           | Role                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| `lib/services/emailService.js` | Nodemailer/SMTP or SendGrid; `SMTP_*`, `ENABLE_EMAIL_IN_DEV` |
| `lib/utils/password.js`        | Password hashing (bcrypt)                                    |

---

## 10. Contexts — `contexts/`

| Context               | File                      | Role                                                         |
| --------------------- | ------------------------- | ------------------------------------------------------------ |
| `LanguageContext`     | `LanguageContext.jsx`     | `LanguageProvider`, `useLanguage`, `t()`, language `en`/`hi` |
| `NotificationContext` | `NotificationContext.jsx` | `NotificationProvider`, `useNotification`, toasts            |

---

## 11. Hooks — `hooks/`

| Hook                   | File                      | Role                             |
| ---------------------- | ------------------------- | -------------------------------- |
| `useSmoothScroll`      | `useSmoothScroll.js`      | Smooth scroll behavior           |
| `useRevealAnimation`   | `useRevealAnimation.js`   | Scroll reveal/animations         |
| `useKeyboardAvoidance` | `useKeyboardAvoidance.js` | Keyboard avoidance (e.g. mobile) |

---

## 12. Shared — `shared/`

| Path                          | Role                      |
| ----------------------------- | ------------------------- |
| `shared/locales/en.json`      | English i18n              |
| `shared/locales/hi.json`      | Hindi i18n                |
| `shared/utils/i18n.js`        | i18n helpers              |
| `shared/styles/shared.css`    | Shared base styles        |
| `shared/styles/variables.css` | Design tokens / variables |

---

## 13. Public — `public/`

| Path                                            | Role                         |
| ----------------------------------------------- | ---------------------------- |
| `manifest.json`                                 | PWA manifest (public)        |
| `admin-manifest.json`                           | PWA manifest (admin)         |
| `admin-sw.js`                                   | Service worker for `/admin/` |
| `logo.png`                                      | Logo                         |
| `robots.txt`                                    | Crawler rules                |
| `sitemap.xml`                                   | Sitemap                      |
| `hero.jpeg`, `food.jpeg`, `veg-thali.png`, etc. | Food/hero images             |

---

## 14. Scripts — `scripts/`

| Script                       | Role                                                                   |
| ---------------------------- | ---------------------------------------------------------------------- |
| `setupAdmin.js`              | Create/ensure admin user; uses `MONGOURI`/`MONGODB_URI`/`MONGO_URI`    |
| `resetAdminPassword.js`      | Reset admin password                                                   |
| `checkAdmin.js`              | Verify admin exists                                                    |
| `generate-admin-hash.js`     | Generate admin password hash                                           |
| `check-db-calculations.js`   | Validate DB-derived calculations                                       |
| `verify-calculations.js`     | Verify order/amount calculations                                       |
| `validate-css.js`            | CSS validation (run in `validate-css`, `validate-css:all`, `prebuild`) |
| `generate-commit-message.sh` | Used by `npm run push`                                                 |

---

## 15. Docs — `docs/`

| File                                  | Purpose               |
| ------------------------------------- | --------------------- |
| `ADMIN_DASHBOARD_CSS_IMPROVEMENTS.md` | CSS changes for admin |
| `ADMIN_DASHBOARD_IMPROVEMENTS.md`     | Dashboard product/UX  |
| `CSS_FIXES_SUMMARY.md`                | CSS fix log           |
| `CSS_SCOPING_FIX.md`                  | Scoping approach      |
| `DASHBOARD_DESIGN_AUDIT_PLAN.md`      | Audit plan            |
| `DASHBOARD_DESIGN_AUDIT_REPORT.md`    | Audit report          |
| `DEEP_REVIEW_CHECKLIST.md`            | Review checklist      |
| `PROJECT_STRUCTURE.md`                | This file             |

---

## 16. Configuration

### 16.1 `next.config.js`

- `reactStrictMode: true`
- `images.remotePatterns`: localhost, 127.0.0.1
- `env`: `API_URL`, `VITE_API_URL`, `NEXT_PUBLIC_API_URL`
- `output: 'standalone'`
- `turbopack.resolveAlias`: `@` → project root

### 16.2 `package.json` Scripts

| Script             | Command                                                                                | Purpose                                |
| ------------------ | -------------------------------------------------------------------------------------- | -------------------------------------- |
| `dev`              | `next dev -p 5050`                                                                     | Development server on port 5050        |
| `build`            | `next build`                                                                           | Production build                       |
| `start`            | `next start -p 5050`                                                                   | Run production on 5050                 |
| `stop`             | `lsof -ti:5050 \| xargs kill -9 2>/dev/null \|\| echo 'No process found on port 5050'` | Kill process on 5050                   |
| `lint`             | `next lint`                                                                            | ESLint                                 |
| `test`             | `jest`                                                                                 | Run tests                              |
| `test:watch`       | `jest --watch`                                                                         | Run tests in watch mode                |
| `test:coverage`    | `jest --coverage`                                                                      | Run tests with coverage                |
| `vite:dev`         | `vite`                                                                                 | Vite dev (optional)                    |
| `vite:build`       | `vite build`                                                                           | Vite build (optional)                  |
| `vite:preview`     | `vite preview`                                                                         | Vite preview                           |
| `push`             | `git add . && git commit -m "$(./scripts/generate-commit-message.sh)" && git push`     | Commit with generated message and push |
| `validate-css`     | `node scripts/validate-css.js`                                                         | CSS validation                         |
| `validate-css:all` | `node scripts/validate-css.js`                                                         | Full CSS validation                    |
| `prebuild`         | `npm run validate-css:all`                                                             | Runs before `build`                    |
| `clean`            | `rm -rf .next`                                                                         | Remove `.next`                         |

### 16.3 `vercel.json`

- Framework: `nextjs`
- Rewrites: `/admin/:path*` → `/admin/:path*`
- Headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`

---

## 17. Environment Variables

| Variable                                          | Used In                                | Purpose                        |
| ------------------------------------------------- | -------------------------------------- | ------------------------------ |
| `MONGOURI`                                        | `lib/db.js`, API, scripts              | MongoDB connection             |
| `MONGODB_URI`, `MONGO_URI`                        | scripts                                | Fallback for MongoDB           |
| `JWT_SECRET`                                      | `lib/middleware/auth.js`, auth API     | JWT signing                    |
| `NEXT_PUBLIC_API_URL`                             | `lib/api.js`, client                   | Public API base URL            |
| `API_URL`                                         | `next.config`, `lib/api.js`            | API base (server)              |
| `VITE_API_URL`                                    | `next.config`, `lib/api.js`            | Vite/legacy API base           |
| `NEXT_PUBLIC_SITE_URL`, `VITE_SITE_URL`           | `app/layout.jsx`                       | Canonical and OG URL           |
| `ADMIN_EMAIL`                                     | auth, forgot-password, verify-identity | Admin contact                  |
| `ADMIN_MOBILE`                                    | forgot-password                        | Admin mobile                   |
| `ADMIN_ID`, `ADMIN_PAN_CARD`                      | verify-identity                        | Identity checks                |
| `FRONTEND_URL`                                    | forgot-password                        | Reset link base                |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`           | `emailService.js`                      | SMTP config                    |
| `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_APP_PASSWORD` | `emailService.js`                      | SMTP auth                      |
| `SMTP_FROM`                                       | `emailService.js`                      | From address                   |
| `ENABLE_EMAIL_IN_DEV`                             | `emailService.js`                      | Send email in development      |
| `API_KEY`                                         | `lib/middleware/security.js`           | Optional API key               |
| `ALLOWED_ORIGINS`                                 | `lib/middleware/security.js`           | CORS origins (comma-separated) |

---

## 18. Design & Conventions (from `.cursorrules`)

- **Buttons:** Only: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-public`, `.btn-special` (modifiers: `.whatsapp`, `.danger`, `.admin`). Sizes: `.btn-small`, `.btn-large`, `.btn-full`, `.btn-icon`, `.btn-qty`. No new `.btn-*` variants.
- **CSS:** No inline styles; only classes. Check for duplicate classes before adding. No new CSS file without confirmation.
- **Borders:** All borders must be exactly 1px maximum (`1.5px`, `2px`, `3px`, `4px`, `5px`, etc. are forbidden). This includes dashed borders (`border: 1px dashed`).
- **`!important`:** Avoid; use specificity. Exception: dedicated font-size hierarchy file if it exists.
- **Alignment:** Fix only where broken; no global overrides of `display` that break layouts.
- **Backups:** Use `.backups/`; `*.bak`, `*.bak2`; `.backups/` is gitignored.
- **Quality:** Prefer robust error handling, loading states, and clear structure over minimal implementations.

**Design Compliance:** All CSS files have been audited and comply with border width rules (1px max). Inline styles have been removed in favor of CSS classes.

---

## 19. Build & Run

```bash
# Install
npm install

# Dev (Next.js, port 5050)
npm run dev

# Production
npm run build
npm start

# Optional: Vite
npm run vite:dev
npm run vite:build
```

Ensure `.env` (or `.env.local`) has at least `MONGOURI`, `JWT_SECRET`, and `NEXT_PUBLIC_API_URL` (or `API_URL`) as required by the routes and `lib` modules you use.

---

## 20. Quick Reference — Sidebar Tabs → Components

| Sidebar `tabKey`     | Component               |
| -------------------- | ----------------------- |
| `dashboard`          | `DashboardTab`          |
| `allOrdersData`      | `AllOrdersDataTab`      |
| `currentMonthOrders` | `CurrentMonthOrdersTab` |
| `analytics`          | `AnalyticsTab`          |
| `customers`          | `AllAddressesTab`       |
| `reports`            | `ReportsTab`            |
| `pendingAmounts`     | `PendingAmountsTab`     |
| `menuPrice`          | `MenuPriceTab`          |
| `notifications`      | `NotificationsTab`      |
| `settings`           | `SettingsTab`           |

---

_Last updated from codebase: app router, `app/api`, `components`, `lib`, `shared`, `scripts`, `docs`, `public`, configs, and `.cursorrules`._
