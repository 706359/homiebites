# Backend Integration Guide

## ✅ Integration Complete

All major features have been migrated to use the backend API with localStorage fallback for offline support.

## What's Integrated

### 1. Menu Data ✅
- **API First**: Fetches from `/api/menu` endpoint
- **Fallback**: Uses localStorage if API unavailable
- **Admin**: Saves to API when admin updates menu
- **Files Updated**:
  - `web/lib/menuData.js` - Async API integration
  - `web/pages/MenuPage.jsx` - Uses async getMenuData
  - `web/components/OrderModal.jsx` - Uses async getMenuData
  - `admin/AdminDashboard.jsx` - Saves menu to API

### 2. Orders ✅
- **User Orders**: Uses `/api/orders` and `/api/orders/my-orders`
- **Admin Orders**: Uses `/api/orders` with filters
- **Fallback**: localStorage for offline support
- **Files Updated**:
  - `web/lib/userAuth.js` - saveOrder() and getUserOrders() use API
  - `web/pages/MenuPage.jsx` - Order creation uses API
  - `web/pages/AccountPage.jsx` - Order fetching uses API
  - `admin/AdminDashboard.jsx` - All order operations use API

### 3. Authentication ✅
- Already using API (`/api/auth/login`, `/api/auth/register`)
- No changes needed

### 4. Reviews ✅
- Already using API (`/api/reviews`)
- No changes needed

## API Endpoints Used

### Menu
- `GET /api/menu` - Get menu (public)
- `PUT /api/menu` - Update menu (admin only)

### Orders
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders/my-orders` - Get user orders (authenticated)
- `GET /api/orders` - Get all orders (admin only, with filters)
- `PUT /api/orders/:id` - Update order (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Reviews
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review

## Production Setup

### 1. Backend Deployment

Deploy backend server to production:
```bash
cd backend/Raavito/HomieBites
npm install
# Set production environment variables
npm start
```

### 2. Environment Variables

Create `web/.env.production`:
```env
VITE_API_URL=https://your-production-api-url.com
VITE_SITE_URL=https://homiebites.com
```

### 3. Backend Environment

Update `backend/.env` for production:
```env
MONGOURI=mongodb://remoteUser:95OztwADZCCVeFzy@sql.infodatixhosting.com:27017/HomieBites?authSource=admin
JWT_SECRET=YBIocj5v7exl45cb
PORT=3001
NODE_ENV=production
```

### 4. CORS Configuration

Ensure backend CORS allows your production domain:
```javascript
app.use(cors({
  origin: ['https://homiebites.com', 'https://www.homiebites.com'],
  credentials: true
}));
```

## Offline Support

All API calls have localStorage fallback:
- **Menu**: Cached in localStorage, works offline
- **Orders**: Saved locally if API unavailable
- **User Data**: Falls back to localStorage

## Error Handling

- API errors are caught and logged
- User sees notification if API unavailable
- Data saved locally as backup
- Automatic retry on next action

## Testing

1. **Test API Connection**:
   - Check browser console for API calls
   - Verify orders appear in MongoDB
   - Check menu updates sync to database

2. **Test Offline Mode**:
   - Disable network
   - Verify app still works
   - Check localStorage fallback

3. **Test Admin Dashboard**:
   - Login as admin
   - Update menu - should sync to API
   - Create/update/delete orders - should sync to API

## Migration Notes

- All components maintain backward compatibility
- localStorage still used as cache/fallback
- No breaking changes to existing functionality
- Gradual migration - works with or without API
