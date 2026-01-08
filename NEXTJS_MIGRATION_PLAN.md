# Next.js Migration Plan - 100% Complete Conversion

## 📋 Executive Summary

This document outlines the complete migration strategy to convert the HomieBites platform from React/Vite to Next.js. The migration will affect both the **web application** and **admin dashboard**, converting them to Next.js 14+ with App Router architecture.

---

## 🎯 Migration Goals

1. **Convert Web App** (Port 3000) from Vite/React to Next.js App Router
2. **Convert Admin Dashboard** (Port 3002) from Vite/React to Next.js App Router
3. **Maintain 100% feature parity** - All existing functionality must work
4. **Improve Performance** - Leverage Next.js SSR, SSG, and ISR
5. **Better SEO** - Server-side rendering for public pages
6. **Unified Architecture** - Single framework for both apps
7. **Preserve PWA Features** - Admin dashboard PWA functionality

---

## 📊 Current Architecture Analysis

### Web Application (`/web`)
- **Framework**: React 18.2.0 + Vite 5.0.8
- **Routing**: React Router DOM v7.10.1
- **Styling**: Tailwind CSS v4.1.18
- **Entry**: `main.jsx` → `App.jsx`
- **Routes**: 11 pages (Home, Menu, Search, FAQ, Offers, Admin routes, etc.)
- **Port**: 3000

### Admin Dashboard (`/admin`)
- **Framework**: React 18.2.0 + Vite 5.0.8
- **Routing**: React Router DOM v7.10.1
- **Styling**: Tailwind CSS v4.1.18 + Custom CSS
- **PWA**: vite-plugin-pwa enabled
- **Entry**: `main.jsx` → `App.jsx`
- **Routes**: 3 routes (Login, Forgot Password, Dashboard)
- **Port**: 3002

### Backend (`/backend`)
- **Status**: ✅ No changes needed (Express/Node.js)
- **Port**: 3001

---

## 🏗️ Target Architecture

```
HomieBites/
├── web/                    # Next.js Web App (App Router)
│   ├── app/                # Next.js App Router
│   │   ├── layout.jsx      # Root layout
│   │   ├── page.jsx        # Home page
│   │   ├── menu/
│   │   ├── search/
│   │   ├── faq/
│   │   ├── offers/
│   │   ├── admin/          # Admin routes
│   │   └── api/            # API routes (if needed)
│   ├── components/         # React components
│   ├── lib/                # Utilities & API clients
│   ├── styles/             # Global styles
│   └── public/             # Static assets
│
├── admin/                  # Next.js Admin Dashboard (App Router)
│   ├── app/                # Next.js App Router
│   │   ├── layout.jsx      # Root layout
│   │   ├── page.jsx        # Login redirect
│   │   ├── login/
│   │   ├── forgot-password/
│   │   ├── dashboard/      # Main dashboard
│   │   └── api/            # API routes (if needed)
│   ├── components/         # Dashboard components
│   ├── lib/                # Utilities & API clients
│   ├── styles/             # Dashboard styles
│   └── public/             # Static assets
│
├── backend/                 # Express API (No changes)
└── shared/                  # Shared resources (No changes)
```

---

## 📝 Migration Phases

### **Phase 1: Preparation & Setup** (Day 1-2)

#### 1.1 Install Next.js Dependencies
```bash
# Web App
cd web
npm install next@latest react@latest react-dom@latest
npm install -D @next/eslint-config-next

# Admin Dashboard
cd ../admin
npm install next@latest react@latest react-dom@latest
npm install -D @next/eslint-config-next
```

#### 1.2 Create Next.js Configuration Files
- `web/next.config.js`
- `admin/next.config.js`
- Update `package.json` scripts

#### 1.3 Backup Current Implementation
- Create `web/vite-backup/` directory
- Create `admin/vite-backup/` directory
- Copy all current files to backup

---

### **Phase 2: Web App Migration** (Day 3-7)

#### 2.1 Project Structure Setup
- [ ] Create `web/app/` directory structure
- [ ] Create root `layout.jsx` with providers
- [ ] Create root `page.jsx` (HomePage)
- [ ] Set up Tailwind CSS in Next.js
- [ ] Configure PostCSS for Tailwind

#### 2.2 Route Migration
Convert React Router routes to Next.js file-based routing:

| Current Route | Next.js Path | Component |
|--------------|--------------|-----------|
| `/` | `app/page.jsx` | HomePage |
| `/menu` | `app/menu/page.jsx` | MenuPage |
| `/search` | `app/search/page.jsx` | SearchPage |
| `/faq` | `app/faq/page.jsx` | FAQPage |
| `/offers` | `app/offers/page.jsx` | OffersPage |
| `/privacy` | `app/privacy/page.jsx` | PrivacyPolicyPage |
| `/terms` | `app/terms/page.jsx` | TermsOfServicePage |
| `/disclaimer` | `app/disclaimer/page.jsx` | LegalDisclaimerPage |
| `/admin` | `app/admin/page.jsx` | AdminPage |
| `/admin/forgot-password` | `app/admin/forgot-password/page.jsx` | AdminForgotPasswordPage |
| `/admin/dashboard` | `app/admin/dashboard/page.jsx` | AdminDashboardPage |
| `*` (404) | `app/not-found.jsx` | NotFoundPage |
| Error | `app/error.jsx` | ErrorPage |

#### 2.3 Component Migration
- [ ] Migrate all components from `components/` (no changes needed)
- [ ] Update imports to use Next.js conventions
- [ ] Convert client components with `'use client'` directive
- [ ] Keep server components where possible

#### 2.4 Context & Providers Migration
- [ ] `LanguageContext` → Move to `app/layout.jsx` or `app/providers.jsx`
- [ ] `NotificationContext` → Move to `app/layout.jsx` or `app/providers.jsx`
- [ ] Update all context usage

#### 2.5 API & Data Fetching
- [ ] Review `lib/api.js` - keep as client-side API client
- [ ] Consider creating Next.js API routes for server-side operations
- [ ] Use Server Components for initial data fetching where possible
- [ ] Use `fetch` with Next.js caching for static data

#### 2.6 Styling Migration
- [ ] Move `styles/globals.css` to `app/globals.css`
- [ ] Update Tailwind config for Next.js
- [ ] Import shared styles from `../shared/styles/`
- [ ] Test all Tailwind classes work correctly

#### 2.7 Special Features
- [ ] Scroll to top on route change → Use Next.js router events
- [ ] Hash navigation → Handle in `useEffect` or middleware
- [ ] Error boundaries → Use Next.js `error.jsx`
- [ ] Loading states → Use Next.js `loading.jsx`

---

### **Phase 3: Admin Dashboard Migration** (Day 8-12)

#### 3.1 Project Structure Setup
- [ ] Create `admin/app/` directory structure
- [ ] Create root `layout.jsx` with NotificationProvider
- [ ] Set up authentication middleware
- [ ] Configure Tailwind CSS
- [ ] Set up PWA configuration for Next.js

#### 3.2 Route Migration
Convert React Router routes to Next.js:

| Current Route | Next.js Path | Component |
|--------------|--------------|-----------|
| `/` | `app/page.jsx` | Redirect to `/login` |
| `/admin` | `app/page.jsx` | Redirect to `/login` |
| `/admin/login` | `app/login/page.jsx` | AdminLogin |
| `/admin/forgot-password` | `app/forgot-password/page.jsx` | AdminForgotPassword |
| `/admin/dashboard` | `app/dashboard/page.jsx` | AdminDashboard |

#### 3.3 Authentication System
- [ ] Create `middleware.js` for route protection
- [ ] Implement server-side auth checks
- [ ] Handle token validation
- [ ] Redirect logic for authenticated/unauthenticated users

#### 3.4 Component Migration
- [ ] Migrate `AdminDashboard.jsx` → `app/dashboard/page.jsx`
- [ ] Migrate all dashboard components
- [ ] Update all imports
- [ ] Add `'use client'` directives where needed

#### 3.5 PWA Migration
- [ ] Install `next-pwa` or use Next.js built-in PWA support
- [ ] Migrate PWA manifest configuration
- [ ] Update service worker configuration
- [ ] Test PWA installation and offline functionality

#### 3.6 Styling Migration
- [ ] Move all CSS files to appropriate locations
- [ ] Update `styles/index.css` imports
- [ ] Ensure all Tailwind components work
- [ ] Test glassmorphism effects

---

### **Phase 4: Configuration & Build** (Day 13-14)

#### 4.1 Next.js Configuration
```javascript
// web/next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // Environment variables
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
  },
}

// admin/next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  // PWA configuration
  // ... PWA settings
}
```

#### 4.2 Package.json Scripts Update
```json
// web/package.json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  }
}

// admin/package.json
{
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002",
    "lint": "next lint"
  }
}
```

#### 4.3 Root Package.json Update
```json
{
  "scripts": {
    "dev": "cd web && npm run dev",
    "web": "cd web && npm run dev",
    "web:build": "cd web && npm run build",
    "web:start": "cd web && npm start",
    "admin": "cd admin && npm run dev",
    "admin:build": "cd admin && npm run build",
    "admin:start": "cd admin && npm start",
    "backend": "cd backend && npm start",
    "dev:full": "concurrently \"npm run web\" \"npm run backend\"",
    "dev:all": "concurrently \"npm run web\" \"npm run admin\" \"npm run backend\""
  }
}
```

#### 4.4 Environment Variables
- [ ] Create `.env.local` files for both apps
- [ ] Document required environment variables
- [ ] Update `.gitignore` for Next.js files

---

### **Phase 5: Testing & Optimization** (Day 15-17)

#### 5.1 Functional Testing
- [ ] Test all routes work correctly
- [ ] Test authentication flows
- [ ] Test API integrations
- [ ] Test form submissions
- [ ] Test error handling
- [ ] Test loading states

#### 5.2 Performance Testing
- [ ] Measure page load times
- [ ] Test SSR performance
- [ ] Optimize images (Next.js Image component)
- [ ] Test bundle sizes
- [ ] Implement code splitting

#### 5.3 SEO Testing
- [ ] Verify meta tags
- [ ] Test server-side rendering
- [ ] Check sitemap generation
- [ ] Test robots.txt

#### 5.4 PWA Testing (Admin)
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Test service worker updates
- [ ] Test push notifications (if applicable)

---

### **Phase 6: Cleanup & Documentation** (Day 18-19)

#### 6.1 Remove Old Files
- [ ] Delete `vite.config.js`
- [ ] Delete `index.html`
- [ ] Delete `main.jsx` (if not needed)
- [ ] Remove Vite dependencies
- [ ] Remove React Router DOM

#### 6.2 Update Documentation
- [ ] Update README.md
- [ ] Update setup instructions
- [ ] Document new architecture
- [ ] Create migration notes

#### 6.3 Final Verification
- [ ] Run full test suite
- [ ] Verify production build
- [ ] Test deployment process
- [ ] Update CI/CD if applicable

---

## 🔧 Technical Implementation Details

### File Structure Examples

#### Web App - Root Layout
```jsx
// web/app/layout.jsx
import { LanguageProvider } from '@/contexts/LanguageContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import '../styles/globals.css'
import '../../shared/styles/shared.css'

export const metadata = {
  title: 'HomieBites - Premium Tiffin Service',
  description: 'Fresh, healthy, and delicious tiffin service',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
```

#### Web App - Home Page
```jsx
// web/app/page.jsx
import HomePage from '@/pages/HomePage'

export default function Home() {
  return <HomePage />
}
```

#### Admin Dashboard - Root Layout
```jsx
// admin/app/layout.jsx
import { NotificationProvider } from '@/contexts/NotificationContext'
import '../styles/index.css'

export const metadata = {
  title: 'HomieBites Admin Dashboard',
  description: 'Admin dashboard for managing orders',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
```

#### Admin Dashboard - Protected Route
```jsx
// admin/app/dashboard/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboard from '@/AdminDashboard'

export default function DashboardPage() {
  const router = useRouter()
  
  useEffect(() => {
    const token = localStorage.getItem('homiebites_token')
    const admin = localStorage.getItem('homiebites_admin')
    
    if (!token || admin !== 'true') {
      router.push('/login')
    }
  }, [router])
  
  return <AdminDashboard />
}
```

### Middleware for Authentication
```javascript
// admin/middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('homiebites_token')
  const admin = request.cookies.get('homiebites_admin')
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token || admin?.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/login' && token && admin?.value === 'true') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}
```

---

## 📦 Dependencies Migration

### Remove (Vite/React Router)
```json
{
  "dependencies": {
    // Remove these:
    "react-router-dom": "^7.10.1"
  },
  "devDependencies": {
    // Remove these:
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

### Add (Next.js)
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@next/eslint-config-next": "^14.2.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

### Keep (Unchanged)
```json
{
  "dependencies": {
    "xlsx": "^0.18.5"  // Keep if used
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18"
  }
}
```

---

## 🚨 Potential Challenges & Solutions

### Challenge 1: Client-Side Only Code
**Issue**: Some components use browser-only APIs (localStorage, window, etc.)
**Solution**: 
- Use `'use client'` directive
- Move to `useEffect` hooks
- Use Next.js `dynamic` import with `ssr: false`

### Challenge 2: React Router Hooks
**Issue**: `useNavigate`, `useLocation`, `useParams` don't exist in Next.js
**Solution**:
- Replace with Next.js `useRouter`, `usePathname`, `useSearchParams`
- Update all navigation calls

### Challenge 3: PWA Configuration
**Issue**: Admin dashboard uses vite-plugin-pwa
**Solution**:
- Use `next-pwa` package
- Or implement custom service worker
- Migrate manifest.json configuration

### Challenge 4: API Calls
**Issue**: Current API calls are client-side only
**Solution**:
- Keep client-side API calls for dynamic data
- Use Server Components for initial data
- Create API routes if server-side operations needed

### Challenge 5: Build Output
**Issue**: Vite outputs to `dist/`, Next.js to `.next/`
**Solution**:
- Update deployment scripts
- Update CI/CD configurations
- Update .gitignore

---

## ✅ Migration Checklist

### Web App
- [ ] Install Next.js dependencies
- [ ] Create app directory structure
- [ ] Migrate root layout
- [ ] Migrate all 11 routes
- [ ] Migrate all components
- [ ] Migrate contexts and providers
- [ ] Update API calls
- [ ] Migrate styles
- [ ] Test all functionality
- [ ] Remove Vite files
- [ ] Update documentation

### Admin Dashboard
- [ ] Install Next.js dependencies
- [ ] Create app directory structure
- [ ] Migrate root layout
- [ ] Migrate all 3 routes
- [ ] Implement authentication middleware
- [ ] Migrate all components
- [ ] Migrate PWA configuration
- [ ] Migrate styles
- [ ] Test all functionality
- [ ] Remove Vite files
- [ ] Update documentation

### Root Project
- [ ] Update package.json scripts
- [ ] Update README.md
- [ ] Test `dev:all` command
- [ ] Test production builds
- [ ] Update deployment docs

---

## 📈 Success Metrics

1. **Functionality**: 100% feature parity
2. **Performance**: 
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3s
   - Lighthouse score > 90
3. **SEO**: All pages server-rendered
4. **Bundle Size**: Similar or smaller than Vite build
5. **Build Time**: Comparable to Vite build

---

## 🎯 Timeline Estimate

- **Total Duration**: 19 days
- **Phase 1 (Prep)**: 2 days
- **Phase 2 (Web)**: 5 days
- **Phase 3 (Admin)**: 5 days
- **Phase 4 (Config)**: 2 days
- **Phase 5 (Testing)**: 3 days
- **Phase 6 (Cleanup)**: 2 days

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Migrating from React Router](https://nextjs.org/docs/app/building-your-application/routing/migrating)
- [Next.js PWA](https://github.com/shadowwalker/next-pwa)

---

## 🔄 Rollback Plan

If migration encounters critical issues:

1. Keep Vite backups in `vite-backup/` directories
2. Revert git commits
3. Restore package.json dependencies
4. Restore vite.config.js files
5. Test original functionality

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation

