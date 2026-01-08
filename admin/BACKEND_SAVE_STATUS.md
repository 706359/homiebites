# Backend Save Status - Settings & Admin Details

## ✅ Current Status: Settings ARE Saved to Backend

### Settings Storage ✅

**Location**: MongoDB - `Settings` collection (single document)

**Backend Endpoint**: `PUT /api/settings` (Admin only, requires authentication)

**What Gets Saved**:

1. **Business Information** ✅
   - `businessName` - Business name
   - `contact` - Contact number
   - `email` - Business email
   - `address` - Business address

2. **Pricing Settings** ✅
   - `defaultUnitPrice` - Default unit price
   - `lunchPrice` - Lunch price
   - `dinnerPrice` - Dinner price
   - `minimumOrderQty` - Minimum order quantity

3. **Order Settings** ✅
   - `orderIdPrefix` - Order ID prefix (default: "HB-")
   - `autoGenerateOrderId` - Auto-generate order IDs
   - `allowDuplicateAddress` - Allow duplicate addresses
   - `requirePaymentConfirmation` - Require payment confirmation
   - `statusOptions` - Available status options array

4. **Notification Preferences** ✅
   - `emailDailySummary` - Email daily summary
   - `emailNewOrderAlert` - Email new order alerts
   - `emailPaymentReceived` - Email payment received
   - `emailLowOrderDayWarning` - Email low order day warnings
   - `smsPaymentReminders` - SMS payment reminders
   - `smsOrderConfirmations` - SMS order confirmations

5. **Data Settings** ✅
   - `autoBackup` - Automatic backup enabled
   - `autoBackupTime` - Automatic backup time (HH:MM format)

6. **Admin Profile** ✅
   - `userName` - Admin name
   - `userEmail` - Admin email
   - `userPhone` - Admin phone
   - **Note**: Password is handled separately via auth routes

7. **Theme Settings** ✅
   - `fontFamily` - Font family (applies to website)
   - `fontSize` - Font size (small, medium, large, extra-large)
   - `primaryColor` - Primary color (hex code)
   - `theme` - Theme (light, dark, auto)

### Implementation Details

**Frontend Flow**:
1. User updates settings in `SettingsTab.jsx`
2. Calls `onUpdateSettings()` → `handleUpdateSettings()` in `AdminDashboard.jsx`
3. Makes API call: `api.updateSettings(newSettings)`
4. Backend saves to MongoDB via `Settings` model
5. Success notification shown to user

**Backend Flow**:
1. Receives PUT request at `/api/settings`
2. Authenticates admin user (middleware: `authenticate`, `isAdmin`)
3. Gets existing settings document (creates if doesn't exist)
4. Updates fields based on request body
5. Saves to MongoDB
6. Returns updated settings

**Code Locations**:
- Frontend API: `admin/lib/api.js` → `updateSettings()`
- Frontend Handler: `admin/AdminDashboard.jsx` → `handleUpdateSettings()`
- Backend Route: `backend/HomieBites/routes/settings.js` → `PUT /`
- Backend Model: `backend/HomieBites/models/Settings.js`

---

## ⚠️ Admin Details Storage

### Current Implementation

**Admin Profile Details** are stored in **Settings model**:
- `userName` - Admin name
- `userEmail` - Admin email  
- `userPhone` - Admin phone

**Admin Authentication** is handled separately:
- User model: `backend/HomieBites/models/User.js`
- Login credentials stored in User collection
- JWT token for authentication
- `currentUser` comes from authentication token

### ⚠️ Potential Issue

**Admin profile details** (name, email, phone) are stored in **Settings model**, not in **User model**.

**Recommendation**:
- Consider storing admin profile in User model for better separation
- Settings should be business settings, not user profile
- User profile should be in User model with proper relationships

---

## 📊 Data Flow Summary

### Settings Save Flow ✅
```
SettingsTab → AdminDashboard.handleUpdateSettings() 
→ api.updateSettings() 
→ PUT /api/settings 
→ Settings Model (MongoDB)
```

### Settings Load Flow ✅
```
useFastDataSync() hook 
→ GET /api/settings/full 
→ Settings Model (MongoDB)
→ AdminDashboard state
```

### Admin Profile Flow ⚠️
```
SettingsTab (Profile tab) 
→ AdminDashboard.handleUpdateSettings() 
→ api.updateSettings({ userProfile }) 
→ PUT /api/settings 
→ Settings Model (userName, userEmail, userPhone)
```

**Note**: Admin authentication uses User model, but profile details are in Settings model.

---

## ✅ Verification Checklist

- [x] Settings are saved to backend MongoDB
- [x] Settings persist across sessions
- [x] Settings are loaded on app start
- [x] All setting categories are saved (Business, Pricing, Orders, Notifications, Data, Profile, Theme)
- [x] Backend API endpoint exists and works
- [x] Authentication required for settings updates
- [x] Error handling implemented
- [x] Success notifications shown

---

## 🔧 Recommendations

1. **Separate Admin Profile from Settings**:
   - Move `userName`, `userEmail`, `userPhone` to User model
   - Create `/api/user/profile` endpoint for profile updates
   - Keep Settings model for business settings only

2. **Add Password Update Endpoint**:
   - Currently password update is mentioned but not fully implemented
   - Should use separate secure endpoint with proper validation

3. **Add Settings Validation**:
   - Validate settings before saving
   - Add constraints (e.g., prices must be positive)
   - Add data type validation

4. **Add Settings History**:
   - Track settings changes over time
   - Add audit log for settings modifications

5. **Improve Error Handling**:
   - Add more specific error messages
   - Handle network errors gracefully
   - Add retry logic for failed saves

---

## 📝 Notes

- Settings model uses `strict: false` to allow additional fields
- Only one settings document exists (singleton pattern)
- Theme settings apply to website, not just admin dashboard
- Some settings are also cached in localStorage for performance

---

**Last Updated**: Current Date
**Status**: ✅ Settings ARE saved to backend
**Action Required**: Consider separating admin profile from settings

