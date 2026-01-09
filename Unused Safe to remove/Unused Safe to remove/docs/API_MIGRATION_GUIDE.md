# API Migration Guide - Next.js API Routes

## Overview

This guide explains the API migration strategy for Next.js. We've created Next.js API routes as **optional proxies** to the Express backend, while keeping direct API calls for dynamic features.

---

## Architecture Decision

### Current Setup (Hybrid Approach)

1. **Direct API Calls** (Current - Recommended)
   - Client components call Express backend directly
   - Works well for dynamic/interactive features
   - No additional proxy layer

2. **Next.js API Routes** (Optional - Available)
   - Created as proxies to Express backend
   - Can be used for Server Components
   - Useful for hiding backend URL or adding middleware

3. **Server Components** (Optional - For SEO)
   - Can fetch data on server for initial render
   - Better SEO and performance
   - Example: `MenuPageClient.jsx` pattern

---

## API Routes Created

### Web App (`web/app/api/`)

- `/api/menu` - Menu data (GET)
- `/api/offers` - Offers data (GET)
- `/api/reviews` - Reviews data (GET)
- `/api/orders` - Orders CRUD (GET, POST)

### Admin Dashboard (`admin/app/api/`)

- `/api/orders` - Orders CRUD (GET, POST, PUT, DELETE)

---

## Usage Patterns

### Pattern 1: Direct API Calls (Current - Recommended)

**Client Component:**
```jsx
'use client';

import { useEffect, useState } from 'react';
import { getMenuData } from '../../lib/menuData';

export default function MenuPage() {
  const [menuData, setMenuData] = useState([]);
  
  useEffect(() => {
    const loadMenu = async () => {
      const data = await getMenuData();
      setMenuData(data);
    };
    loadMenu();
  }, []);
  
  // ... rest of component
}
```

**Pros:**
- ✅ Simple and direct
- ✅ Works with existing code
- ✅ No proxy overhead
- ✅ localStorage caching works

**Cons:**
- ❌ Backend URL exposed to client
- ❌ No server-side rendering

---

### Pattern 2: Next.js API Routes (Optional)

**Client Component using API Route:**
```jsx
'use client';

import { useEffect, useState } from 'react';

export default function MenuPage() {
  const [menuData, setMenuData] = useState([]);
  
  useEffect(() => {
    const loadMenu = async () => {
      const response = await fetch('/api/menu');
      const data = await response.json();
      if (data.success) {
        setMenuData(data.data);
      }
    };
    loadMenu();
  }, []);
  
  // ... rest of component
}
```

**Pros:**
- ✅ Backend URL hidden from client
- ✅ Can add middleware/validation
- ✅ Can use in Server Components

**Cons:**
- ❌ Additional proxy layer
- ❌ Slightly more complex

---

### Pattern 3: Server Components (For SEO)

**Server Component:**
```jsx
// app/menu/page.jsx (Server Component)
import MenuPageClient from './MenuPageClient';
import { getMenuDataServer } from '../../lib/serverApi';

export default async function MenuPage() {
  // Fetch on server
  const menuData = await getMenuDataServer();
  
  // Pass to client component
  return <MenuPageClient initialMenuData={menuData} />;
}
```

**Client Component:**
```jsx
// app/menu/MenuPageClient.jsx
'use client';

export default function MenuPageClient({ initialMenuData }) {
  const [menuData, setMenuData] = useState(initialMenuData);
  
  // Use initial data, fetch updates client-side if needed
  // ... rest of component
}
```

**Pros:**
- ✅ Server-side rendering (better SEO)
- ✅ Faster initial page load
- ✅ Data fetched before page renders

**Cons:**
- ❌ More complex setup
- ❌ Requires splitting client/server code

---

## Recommendation

### Keep Current Approach (Direct API Calls)

**Why:**
1. ✅ Already working well
2. ✅ Simpler architecture
3. ✅ localStorage caching works
4. ✅ Dynamic updates work seamlessly
5. ✅ Admin dashboard needs real-time data

### Use Next.js API Routes When:

1. **Hiding Backend URL** - In production, hide Express backend URL
2. **Adding Middleware** - Rate limiting, request validation
3. **Server Components** - For SEO-important pages (menu, offers)
4. **Caching Strategy** - Different caching for different endpoints

### Use Server Components When:

1. **SEO Critical Pages** - Menu, Offers pages
2. **Static Content** - Content that doesn't change often
3. **Initial Load Performance** - Faster first paint

---

## Migration Status

### ✅ Completed

- ✅ Next.js API routes created (`/api/menu`, `/api/offers`, `/api/reviews`, `/api/orders`)
- ✅ Server API client created (`lib/serverApi.js`)
- ✅ Example Server Component pattern (`MenuPageClient.jsx`)

### 📝 Optional Next Steps

1. **Convert Menu Page to Server Component** (for SEO)
   - Rename `page-server.jsx` → `page.jsx`
   - Update component to use Server Component pattern

2. **Convert Offers Page to Server Component** (for SEO)
   - Similar pattern as menu page

3. **Use API Routes in Production**
   - Set `NEXT_PUBLIC_USE_API_ROUTES=true`
   - Update API client to use routes

---

## Configuration

### Enable API Routes (Optional)

**Environment Variable:**
```env
# .env.local
NEXT_PUBLIC_USE_API_ROUTES=true
```

**Update API Client:**
```javascript
// lib/api.js
const useApiRoutes = process.env.NEXT_PUBLIC_USE_API_ROUTES === 'true';
const baseUrl = useApiRoutes ? '' : resolvedApiUrl; // Use relative URLs
```

---

## Current Status

**✅ Migration Complete - Hybrid Approach**

- Direct API calls: ✅ Working (current)
- Next.js API routes: ✅ Available (optional)
- Server Components: ✅ Pattern ready (optional)

**Recommendation:** Keep current direct API approach unless you need:
- Better SEO (use Server Components)
- Hidden backend URL (use API routes)
- Server-side caching (use API routes)

---

**Last Updated:** 2024  
**Status:** ✅ Complete - Optional enhancements available

