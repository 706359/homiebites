# HomieBites Admin Dashboard — Full Audit Report

**Date:** January 2025
**Scope:** Admin dashboard: routes, layout, components, tabs, modals, APIs, styles, hooks, and UX.
**Based on:** Codebase review (app/admin, components/admin, lib, app/api).

---

## 1. Executive Summary

The HomieBites admin dashboard is a **Next.js 16 (App Router)** SPA for order management, analytics, customers, reports, menu, notifications, and settings. It uses **lazy-loaded tabs**, **optimistic updates** for orders, **modular CSS**, and **token-based auth** with redirects. The structure is clear; there are opportunities in **API base URL**, **duplicate logic**, **design-tokens consistency**, and **backup/restore** implementation.

---

## 2. Route & Layout Structure

### 2.1 Routes

| Route                           | Page                                        | Purpose                                                                 |
| ------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `/admin`                        | `app/admin/page.jsx`                        | Login; redirects to `/admin/dashboard` if `homiebites_admin === 'true'` |
| `/admin/dashboard`              | `app/admin/dashboard/page.jsx`              | Main dashboard (AdminDashboard)                                         |
| `/admin/change-password`        | `app/admin/change-password/page.jsx`        | Change password form                                                    |
| `/admin/forgot-password`        | `app/admin/forgot-password/page.jsx`        | Forgot password                                                         |
| `/admin/reset-password/[token]` | `app/admin/reset-password/[token]/page.jsx` | Reset password with token                                               |

### 2.2 Dashboard Page (`/admin/dashboard`)

- **Wrappers:** `ErrorBoundary` → `NotificationProvider` → `FontSettingsLoader` → `AdminDashboard` → `NotificationWrapper`
- **Auth:** On mount, checks `homiebites_token`, `homiebites_admin`, and optional `homiebites_token_meta.expiresAt`; redirects to `/admin` if invalid/expired.
- **Imports:** `styles/globals.css` only; admin-specific CSS is loaded via `app/admin/layout.jsx` → `adminStyles.js`.

### 2.3 Admin Layout (`app/admin/layout.jsx`)

- **CSS:** Imports `components/admin/styles/adminStyles.js` (which pulls `index.css` + all modules).
- **Font:** On `/admin*`, applies saved `homiebites_font_size` via `parseFontSize` / `applyAdminFontSize`; on leave, `clearAdminFontSize`.
- **PWA:** Swaps `link[rel="manifest"]` to `/admin-manifest.json` and registers `/admin-sw.js` with scope `/admin/` when on `/admin*`.

---

## 3. Main Shell: AdminDashboard.jsx

### 3.1 Role

- **Shell:** Sidebar, TopNav, overlay, `admin-main` content area.
- **State:** `activeTab`, `sidebarOpen`, `sidebarCollapsed`, `showOrderModal`, `showCSVUploadModal`, `editingOrder`, `confirmationModal`, `newOrder`, address-suggestion state, pagination, filters, `dismissedNotifications`, `showOverdueFilter`, `dateFilterForOrders`, `isMounted`.
- **Data:** `useFastDataSync()` → orders, settings, loading, loaders (orders, menu, offers, users, settings), `currentUser`, `fastDelete`, `fastUpdate`, `fastCreate`, `cancelAll`.

### 3.2 Tabs (from `getTabInfo` + `renderActiveTab`)

| Tab Key              | Title                | Subtitle                                        | Notes                                                                 |
| -------------------- | -------------------- | ----------------------------------------------- | --------------------------------------------------------------------- |
| `dashboard`          | Dashboard            | Overview of your business metrics               | KPI cards, revenue/payment charts, recent orders                      |
| `allOrdersData`      | All Orders Data      | View and manage all orders                      | Filters, pagination, Excel load, clear-all, edit/delete/status        |
| `currentMonthOrders` | Current Month Orders | Manage orders for the current billing month     | Add/Edit/Delete, `OrderModal`, month lock                             |
| `analytics`          | Analytics            | Business insights and performance metrics       | Period (month/year/custom), day-details → All Orders                  |
| `customers`          | Customers            | Manage and analyze customer data                | AllAddressesTab, view orders by address                               |
| `reports`            | Reports              | Generate and manage business reports            | Excel/CSV, date range, clear-all                                      |
| `pendingAmounts`     | Payment Management   | Track and manage payment collections            | Overdue/urgent, Mark paid, Send reminder                              |
| `settings`           | Settings             | Configure your application settings             | 6 sub-tabs: General, Orders, Notifications, Data, Profile, Appearance |
| `notifications`      | Notifications        | Stay updated with your business activities      | Overdue/pending/recent, view order, mark paid, reminders              |
| `menuPrice`          | Menu & Price         | Manage your menu items, categories, and pricing | CRUD menu, categories, `api.getMenu` / `api.updateMenu`               |

### 3.3 Modals & Global UI

- **OrderModal:** Add/Edit order; address suggestions, date, quantity, unitPrice, total, mode, status, paymentMode, notes; uses `performOrderUpdate` / `handleAddOrder`.
- **CSVUploadModal:** Excel/CSV upload; calls `loadOrders` on success.
- **ConfirmationModal:** Title, message, type (warning/danger/info/success), onConfirm/onCancel; Escape to cancel when not loading.
- **ImportantNotificationsBanner:** Overdue and urgent payments; links to Pending Amounts; dismissible, persisted in `homiebites_dismissed_notifications`.
- **InstallPrompt:** PWA install (lazy).
- **Sidebar overlay:** `sidebar-overlay` toggled by `sidebarOpen`.

### 3.4 Theme & Appearance (AdminDashboard)

- **On mount (client):** Reads `homiebites_primary_color`, `homiebites_secondary_color`, `homiebites_font_size`, `homiebites_font_family`; applies to `:root` and `.admin-dashboard`; always uses `light-theme`; runs `autoFixThemeOnLoad` after short delay.
- **On `settings` change:** Syncs `primaryColor`, `secondaryColor`, `fontSize`, `fontFamily` to localStorage and DOM; loads Google Font link when needed.

### 3.5 Handlers (summary)

- **Orders:** `handleAddOrder`, `performOrderUpdate`, `handleEditOrder`, `handleDeleteOrder`, `handleUpdateOrderStatus`, `handleViewOrder`.
- **Settings:** `handleUpdateSettings` (delegates to `api.updateSettings` and shows contextual success messages).
- **Data:** `handleBackup`, `handleRestore` (currently show notifications only; no real backup/restore implementation found).
- **Clear-all:** `handleClearAllData` → `api.clearAllOrders` with confirmation.
- **Navigation:** `handleViewCustomerOrders` (sets address filter + `allOrdersData`), `handleViewPendingAmounts` (sets overdue filter + `pendingAmounts`), `handleDismissNotification`.
- **Logout:** `handleLogout` → `logout()` then `window.location.href = '/admin'`.

---

## 4. Sidebar & TopNav

### 4.1 Sidebar (`Sidebar.jsx`)

- **Visibility:** `admin-sidebar` with `.open` (mobile) and `.collapsed` (icon-only). Widths: 260px / 80px (via `admin-main` margin).
- **Nav:** Built from `adminConfig.adminFeatures`; only `enabled: true`; maps to `dashboard`, `allOrdersData`, `currentMonthOrders`, `analytics`, `customers`, `reports`, `pendingAmounts`, `menuPrice`, `notifications`, `settings`. Logo: `/logo.png` with fallback text "HomieBites"; click → `dashboard`.
- **Footer:** Collapse button, profile dropdown (Settings, Logout), and a separate Logout button. Profile shows `currentUser?.name` or "Admin"; initials avatar.

### 4.2 TopNav (`TopNav.jsx`)

- **Left:** Hamburger (toggle sidebar), tab title and subtitle from `tabInfo`.
- **Center:** Optional `tabAction` (e.g. "Add New Order" for Current Month).
- **Right:** Refresh (calls `onRefresh`), Add New Order (→ `currentMonthOrders` + `openNewOrderModal`), Search (⌘K / Ctrl+K), Notifications (badge with `unreadNotifications`, max 99).
- **Search modal:** Global search; recent searches in `homiebites_recent_searches`; keyword-based tab routing (order, customer, payment/pending, report); Quick Actions (Add order, Generate report, Analytics, Pending payments). Escape to close.

---

## 5. Tab Components (High-Level)

### 5.1 DashboardTab

- **Loading:** `InlineLoader` (universal loader) when `loading`.
- **Empty:** "No Orders Found" with reload and API/auth checklist.
- **Stats (clickable):** Total Revenue (→ Analytics), Total Orders (→ All Orders), Pending Payments (→ Pending Amounts), Total Customers (→ Customers), Avg Order Value, Profit After Expenses, Profit Margin. Uses `getProfitStats(allTimeRevenue, 70, 30)` and `isPendingStatus` for unpaid.
- **Charts:** Revenue Trend (year-over-year bars), Payment Mode Trend (Cash/Online, year-over-year); both use `data-height` and `MutationObserver` for bar sizing.
- **Recent Orders:** Last 10; "View All Orders" → `allOrdersData`.

### 5.2 AllOrdersDataTab

- **Filters (persisted in `admin_all_orders_filters`):** Month, Address, Payment Status, date range, Status, Mode, Payment, Year, Address text, Search; `useDebounce` for search. `initialDateFilter` from Analytics “view day”.
- **Table:** Sortable, pagination (`recordsPerPage`, `currentPage`). Actions: Edit, Delete, Update status. Excel load (→ `onLoadExcelFile`), Clear all (→ `onClearAllData`). Responsive (`isMobile`).
- **Empty:** `EmptyState` when no orders.

### 5.3 CurrentMonthOrdersTab

- **Scope:** Current calendar month via `getFilteredOrdersByDate(..., 'month', '', '')`.
- **Quick filter, search, pagination.** Add Order (opens `OrderModal`; listens `openNewOrderModal` and Ctrl/Cmd+N). Edit/Update/Delete/Status.
- **Month lock:** Uses `settings.monthLockedTill` (logic present in `getTabInfo` / Dashboard; add/edit may be gated in OrderModal/Settings).

### 5.4 AnalyticsTab

- **Period:** This month, This year, Custom (from/to). **Metrics:** Revenue, growth vs prior period, orders, pending amount, customers, avg order value, cancel rate.
- **Tables:** Daily breakdown (click date → `onViewDayDetails` → `allOrdersData` with `dateFilterForOrders`), Top areas, Payment mode.
- **Charts:** Revenue and payment-mode visuals. `getOrderAmount` centralizes amount calculation.

### 5.5 AllAddressesTab (Customers)

- **Data:** `customerStats` from orders: address, totalOrders, totalSpent, lastOrderDate, preferredMode, paymentModes, firstOrderDate. Handles multiple address field names.
- **Filters:** Search, Status (all/paid/pending), Segment, Sort (totalSpent, etc.), View (table/cards). Pagination. `onViewOrders(address)` → All Orders with address filter.

### 5.6 ReportsTab

- **Report types, date range, options:** Include charts, summary, group by area/mode, format (CSV/Excel). **Scheduled reports** and **Report history** are local state (no API).
- **Generation:** `handleGenerateReport` builds CSV/Excel (ExcelJS) from filtered orders. **Sales Report**, **Monthly Statement**, etc. Export and `showNotification` on success.

### 5.7 PendingAmountsTab

- **Summary:** totalPaid, pending, overdue (45+ days), thisMonth. **Filters:** Urgency, days pending, search.
- **List:** Sorted by days pending; Mark paid (`onUpdateOrderStatus`), Send reminder (`onSendReminder`). `showOverdueFilter` pre-applies overdue filter.

### 5.8 SettingsTab

- **Sub-tabs:** General, Orders, Notifications, Data, Profile, Appearance (from `settingsTabs`).
- **General:** Business info (name, contact, email, address), Pricing (default unit, lunch, dinner, min qty). Save → `onUpdateSettings({ businessInfo })`, `({ pricing })`.
- **Orders:** Order ID prefix, auto-generate, allow duplicate address, require payment confirmation, status options. Save → `({ orderSettings })`.
- **Notifications:** Email/SMS toggles (daily summary, new order, payment received, low-order warning, reminders, confirmations). Save → `({ notificationPrefs })`.
- **Data:** Auto backup, backup time; Backup/Restore buttons (`onBackup`, `onRestore`). **Note:** Backup/Restore only trigger notifications; no file/API implementation in reviewed code.
- **Profile:** Name, email, phone, current/new/confirm password. Save → `({ userProfile })`; password change goes through auth API.
- **Appearance:** Font family (FONT_OPTIONS: Baloo 2, Inter, Poppins, etc.), Font size (with `applyAdminFontSize` and `adminFontSizeChanged`). Save → `({ themeSettings: { fontFamily, fontSize } })`. Primary/secondary color are in `handleUpdateSettings` in AdminDashboard when `themeSettings` includes `primaryColor`/`secondaryColor`.

### 5.9 NotificationsTab

- **Sources:** Overdue (45+ days) and urgent (7+ days) pending; recent orders (7 days). Renders as list with `getTimeAgo`, type-specific icons and actions.
- **Actions:** View order, Mark as paid, Send reminder. Filter (all/payment/order), read state (local). **Settings modal:** toggles for notification types/delivery (in-app, email, SMS); local state only.

### 5.10 MenuPriceTab

- **Data:** `api.getMenu()` → categories with items; flattened for table. Categories include defaults (Breakfast, Lunch, Dinner).
- **CRUD:** Add/Edit/Delete item modals; `api.updateMenu(menuData)`. Search, filter by category, sort. `showConfirmation` for delete.

---

## 6. Modals & Shared Components

### 6.1 OrderModal

- **Modes:** `editingOrder` (edit) vs `newOrder` (add). **Fields:** date, deliveryAddress (with suggestion dropdown), quantity, unitPrice, total, mode, status, paymentMode, notes. Date: `DD/MM/YYYY` or ISO; order ID preview for new.
- **Behavior:** Duplicate-address warning, validation, `useAutoKeyboardAvoidance`. Save → `onSave` (Edit: `handleEditOrder` with confirmation; Add: `handleAddOrder`). Address suggestions from `orders`; debounced typing.

### 6.2 ConfirmationModal

- **Props:** `show`, `title`, `message`, `confirmText`, `cancelText`, `type` (warning/danger/info/success), `onConfirm`, `onCancel`, `isLoading`. Escape closes when not loading.
- **Styles:** `getTypeStyles()` for icon, colors, and confirm button class.

### 6.3 CSVUploadModal

- **Flow:** File picker → upload → `api.uploadExcelFile` or equivalent → `loadOrders` on success, `onClose`. `showNotification` for errors.

### 6.4 Other

- **Universal loaders:** `FullPageLoader`, `InlineLoader`, `OverlayLoader`, `LoadingButton`, `SkeletonLoader` from `components/loaders/LoaderComponents`; used as Suspense fallback and in-tab loading.
- **SkeletonLoader:** Table/content skeletons (admin + public types).
- **EmptyState:** Reusable empty UX.
- **ErrorBoundary:** Class component; `componentDidCatch`; optional `window.errorTracker`; fallback UI with Try Again and Refresh; dev-only error details.

---

## 7. Data Layer

### 7.1 useAdminData

- **State:** menuData, offersData, orders, users, newsletterSubscriptions, settings, notifications, currentUser, loading.
- **Loaders:** `loadMenuData`, `loadOffersData`, `loadOrders`, `loadUsers`, `loadSettings`. Auth: `homiebites_token` and `homiebites_admin`; on failure or 401, sets empty orders and may redirect. `loadOrders` uses `api.getAllOrders({}, { hardRefresh })` and `sortOrdersByOrderId`. Settings from `api.getSettings` or `api.getFullSettings`; user from `homiebites_user` or `/api/auth/verify` (or similar).

### 7.2 useFastDataSync

- **Wraps:** `useAdminData` and `useOptimisticData` (orders). **Optimistic:** `fastDelete`, `fastUpdate`, `fastCreate`; each triggers `api` and then `syncDebounced` to `api.getAllOrders` to refresh `adminData.orders` and optimistic list. `cancelAll` for cleanup on unmount; also `dataSyncManager.cancelAllRequests()`.

### 7.3 dataSyncManager

- **Role:** Centralizes in-flight request cancellation (e.g. on tab switch or unmount). `AdminDashboard` runs `dataSyncManager.cleanup()` in `useEffect` cleanup with `cancelAll`.

---

## 8. API Layer

### 8.1 lib/api-admin.js

- **Base URL:** `resolvedApiUrl` is `''`; requests use relative paths (e.g. `/api/orders`, `/api/auth/login`). Next.js `rewrites` or same-origin `fetch` resolve these. **No `NEXT_PUBLIC_*` or `API_URL` used in the file** for `resolvedApiUrl`; if a separate backend host is needed, this must be set.
- **Auth:** `Authorization: Bearer ${token}` from `homiebites_token`. 401/403: clears token/admin/user and redirects to `/admin` when on `/admin` or home.
- **Helpers:** `retryAsync` (3 attempts, exponential backoff; skips retry on auth/validation). `request()` handles JSON, HTML-error detection, optional `hardRefresh` (cache: no-store). Tracks `monitoringService.trackAPI` when available.

### 8.2 Endpoints Used by Dashboard

| Area     | Endpoints                                                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | `/api/auth/login`, `forgot-password`, `verify-otp`, `verify-identity`, `reset-password`, `verify`, `users`                                          |
| Orders   | `/api/orders` (GET, POST), `/api/orders/[id]` (PUT, DELETE), `/api/orders/manual`, `bulk-import`, `cleanup-duplicates`, `clear-all`, `upload-excel` |
| Menu     | `/api/menu` (GET, PUT, DELETE)                                                                                                                      |
| Settings | `/api/settings`, `/api/settings/full` (GET, PUT)                                                                                                    |
| Others   | `/api/offers`, `/api/reviews`, `/api/gallery`, `/api/health`                                                                                        |

---

## 9. Styles (CSS)

### 9.1 Load Order

`adminStyles.js` imports in order:

1. `index.css` — variables, layout, resets, `html.admin-active`, `.admin-dashboard`, `.admin-main`, `.admin-content`, button/input overrides.
2. `modules/sidebar.css`, `topnav.css`, `modals.css`, `tables.css`, `filters.css`, `forms.css`, `cards.css`, `badges.css`, `empty-states.css`, `notifications.css`, `inputs.css`, `utilities.css`, `dashboard.css`, `pending-amounts.css`, `menu-price.css`, `notifications-grid.css`, `settings.css`, `csv-upload-modal.css`, `analytics-tab.css`, `admin-login.css`, `admin-forgot-password.css`.

### 9.2 Variables (index.css)

- **Surfaces:** `--admin-bg`, `--admin-bg-secondary`, `--admin-bg-tertiary`, `--admin-glass-*`.
- **Text:** `--admin-text`, `--admin-text-primary`, `--admin-text-secondary`, `--admin-text-light`, `--admin-text-muted`.
- **Borders:** `--admin-border`, `--admin-border-light`.
- **Accent:** `--admin-accent`, `--admin-accent-light`, `--admin-accent-hover`; `--admin-secondary`, `--admin-secondary-light`, `--admin-secondary-hover`, `--admin-secondary-active`.
- **Semantics:** `--admin-success`, `--admin-warning`, `--admin-danger`, `--admin-info` and `-light`/`-hover`/`-dark` variants.
- **Type:** `--admin-fs-2xs` … `--admin-fs-display` (rem). `--admin-base-font-size` (from Settings) applied on `html.admin-active`.
- **Font:** `--font-primary` (from Settings or 'Baloo 2').

### 9.3 Layout

- **`.admin-dashboard`:** `box-sizing`, margin/padding reset, `height: 100vh`, flex row, `overflow-x: hidden`, `--admin-fs-base`, `--font-primary`.
- **`.admin-main`:** `margin-left: 260px` (80px when `.sidebar-collapsed`), `min-width: 0`, flex column, `--admin-bg-secondary`.
- **`.admin-content`:** `padding: 24px` (16px at `max-width: 480px`), scroll, `min-height: 0`.

### 9.4 File Sizes (lines, approximate)

| File                        | Lines      |
| --------------------------- | ---------- |
| index.css                   | 228        |
| sidebar.css                 | 676        |
| analytics-tab.css           | 782        |
| dashboard.css               | 602        |
| tables.css                  | 490        |
| modals.css                  | 404        |
| settings.css                | 421        |
| admin-login.css             | 418        |
| topnav.css                  | 358        |
| filters.css                 | 319        |
| notifications.css           | 319        |
| pending-amounts.css         | 212        |
| forms.css                   | 152        |
| menu-price.css              | 149        |
| inputs.css                  | 259        |
| cards.css                   | 168        |
| csv-upload-modal.css        | 258        |
| admin-forgot-password.css   | 344        |
| notifications-grid.css      | 104        |
| empty-states.css            | 61         |
| badges.css                  | 39         |
| utilities.css               | 91         |
| **Total (index + modules)** | **~6,854** |

---

## 10. Utilities & Config

### 10.1 adminConfig (adminFeatures)

- **Keys:** `dashboard`, `excelViewer` (→ allOrdersData), `orders` (→ currentMonthOrders), `analytics`, `customers`, `reports`, `pendingAmounts`, `notifications`, `settings`, `menuPrice`. All `enabled: true`; allows feature flags if some are turned off.

### 10.2 Utils (high level)

- **calculations:** `getProfitStats`, `getFilteredOrdersByDate`.
- **dateUtils:** `parseOrderDate`, `formatDate`, `formatDateMonthDay`, etc.
- **orderUtils:** `formatCurrency`, `getTotalRevenue`, `isPendingStatus`, `isPaidStatus`, `sortOrdersByOrderId`, `extractOrderIdSequence`, `formatBillingMonth`, `extractBillingMonth/Year`, `calculateTotalAmount`, `getLastOrderForAddress`.
- **fontSize:** `parseFontSize`, `applyAdminFontSize`, `roundToStep`, `ADMIN_FONT_SIZE_*`, `clearAdminFontSize`.
- **themeFixer:** `autoFixThemeOnLoad`.
- **sidebarFontSizeFix:** Sidebar-specific font-size handling.
- **notificationMessages:** `getNotificationMessage`, `getNotificationDuration`.
- **dataSyncManager:** Request cancellation.
- **errorTracker:** Optional `window.errorTracker` integration.
- **useDebounce:** Debounced value for search/filters.

---

## 11. Auth & Security

- **Token:** `homiebites_token` (Bearer). **Admin flag:** `homiebites_admin === 'true'`. **User:** `homiebites_user` (JSON). **Meta:** `homiebites_token_meta` with `expiresAt` on dashboard page.
- **Redirects:** No token or admin → `/admin`. Expired `expiresAt` → clear storage and `/admin`. 401/403 in `api.request` → clear and redirect when on `/admin` or `/`.
- **Headers (next.config.js):** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 12. Issues & Recommendations

### 12.1 Critical

| #   | Issue                                               | Location                                                                                                                     | Recommendation                                                                                                                |
| --- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | **API base URL empty**                              | `lib/api-admin.js`: `resolvedApiUrl = ''`                                                                                    | If backend is on another origin, set `resolvedApiUrl` from `NEXT_PUBLIC_API_URL` or `API_URL` and document in `.env.example`. |
| 2   | **Backup/Restore not implemented**                  | `handleBackup`, `handleRestore` in AdminDashboard; Settings Data tab                                                         | Implement export/import (e.g. JSON or Excel) and/or backend endpoints; wire buttons to real logic.                            |
| 3   | **Duplicate `process.env.NODE_ENV` checks**         | e.g. AdminDashboard `if (process.env.NODE_ENV === 'development') { if (process.env.NODE_ENV === 'development') {`            | Remove inner duplicate.                                                                                                       |
| 4   | **ConfirmationModal `onCancelCallback` never used** | AdminDashboard sets `onCancelCallback` in `confirmationModal`; `onCancel` only runs `setConfirmationModal(..., show: false)` | Either call `onCancelCallback` from `onCancel` or remove `onCancelCallback`.                                                  |

### 12.2 High

| #   | Issue                                                           | Location                                                                                                   | Recommendation                                                                                          |
| --- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 5   | **`getOrderAmount`-style logic repeated**                       | DashboardTab, AnalyticsTab, PendingAmountsTab, ReportsTab, ImportantNotificationsBanner, AllAddressesTab   | Extract to `orderUtils.getOrderAmount(order)` and reuse.                                                |
| 6   | **45-day overdue / 7-day urgent repeated**                      | PendingAmountsTab, NotificationsTab, ImportantNotificationsBanner, `unreadNotifications` in AdminDashboard | Extract to e.g. `orderUtils.getOverdueUrgentCounts(orders)` or a small module.                          |
| 7   | **Scheduled reports & Report history are mock**                 | ReportsTab `scheduledReports`, `reportHistory`                                                             | Either remove, or implement with API and persistence.                                                   |
| 8   | **Notification settings in NotificationsTab are local only**    | `notificationSettings` state, Settings modal                                                               | Persist via `api.updateSettings({ notificationPrefs })` or a dedicated endpoint and load from settings. |
| 9   | **`MenuPriceTab` uses `ConfirmModal` import**                   | `import ConfirmModal from './ConfirmationModal.jsx'`                                                       | Align name: use `ConfirmationModal` everywhere.                                                         |
| 10  | **DashboardTab `data-revenue` / `data-expected` on stat cards** | e.g. `data-revenue={allTimeRevenue} data-expected='374345'`                                                | Remove test/debug attributes or move to tests.                                                          |

### 12.3 Medium

| #   | Issue                                                  | Location                                                                                 | Recommendation                                                                                                      |
| --- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 11  | **Spacing/type scale**                                 | Per DASHBOARD_DESIGN_AUDIT_REPORT.md: 49 padding, 13 margin, 12 gap, 16 font-size values | Adopt a small scale (e.g. 4,8,12,16,24) and rem/design tokens; refactor in passes.                                  |
| 12  | **`html.admin-active`**                                | index.css, `clearAdminFontSize`                                                          | Ensure `admin-active` is added/removed on enter/leave `/admin` so font-size and overflow rules apply only in admin. |
| 13  | **OrderModal date formats**                            | DD/MM/YYYY vs ISO; `persistedDateRef`, `datePickerRef`                                   | Standardize on one format in state and `parseOrderDate`; simplify refs.                                             |
| 14  | **`onClearExcelData` no-op**                           | AllOrdersDataTab: `onClearExcelData={() => {}}`                                          | Implement (e.g. clear imported Excel-backed view) or remove prop.                                                   |
| 15  | **`CSVUploadModal` `onUploadSuccess={(_data) => {}}`** | AdminDashboard                                                                           | Use `_data` if needed (e.g. to show import summary) or remove parameter.                                            |
| 16  | **Debug `console.log` in production**                  | e.g. `DashboardTab`, `useAdminData`, `MenuPriceTab`                                      | ✅ Done: removed per-render log in MenuPriceTab; useAdminData, AnalyticsTab, AdminLogin already guarded.            |

### 12.4 Low / Nice-to-have

| #   | Issue                                       | Location                                        | Recommendation                                                                                                                                         |
| --- | ------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 17  | **Sidebar `users` key for Pending Amounts** | adminConfig: `users` → `pendingAmounts`         | ✅ Done: renamed to `pendingAmounts` in adminConfig and Sidebar.                                                                                       |
| 18  | **Profile dropdown duplicate Logout**       | Sidebar: dropdown Logout + footer Logout button | ✅ Done: footer Logout only when collapsed; dropdown Logout when expanded.                                                                             |
| 19  | **`suppressHydrationWarning` on Sidebar**   | `admin-sidebar` div                             | ✅ Done: removed (no hydration mismatch).                                                                                                              |
| 20  | **Accessibility**                           | Modals, Confirmations, tables                   | ✅ Done (ConfirmationModal): `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`. Remainder: focus trap, other modals, tables. |

---

## 13. Positive Highlights

- **Lazy loading:** Tabs and heavy modals are `lazy()` with `Suspense` and `InlineLoader`/`FullPageLoader`, improving initial load.
- **Optimistic updates:** `fastCreate`/`fastUpdate`/`fastDelete` with background sync and `dataSyncManager` improve perceived performance and cancellation on navigation.
- **Modular CSS:** `adminStyles.js` + index + modules give clear separation; variables support theming and font scaling.
- **Error handling:** `ErrorBoundary` at page and dashboard level; `api.request` handles 401/403 and retries; `errorTracker` hook.
- **Responsiveness:** `isMobile` in Dashboard, AllOrders, and similar; `admin-content` and `admin-main` padding at 480px; touch targets in index.css.
- **Feature flags:** `adminFeatures` allows turning tabs off without removing code.
- **PWA:** Admin-specific manifest and service worker scope.
- **Keyboard:** Ctrl/Cmd+K (search), Ctrl/Cmd+N (new order), Escape in modals; `useAutoKeyboardAvoidance` in forms/modals.

---

## 14. Suggested Next Steps

1. **API base URL:** Set and document `NEXT_PUBLIC_API_URL` / `API_URL`; use in `api-admin.js` when non-empty.
2. **Backup/Restore:** Define format (JSON/Excel) and implement export/import; add API if needed; connect Settings Data tab.
3. **Order amount and overdue/urgent:** Centralize in `orderUtils` (and optionally a tiny `notifications` helper) and refactor all tabs/banners.
4. **Cleanup:** Remove duplicate `NODE_ENV` checks, `data-expected`/`data-revenue`, and no-op callbacks; fix `onCancelCallback` and `ConfirmModal` naming.
5. **Reports and notification settings:** Either implement with API and sync to Settings, or clearly label as “Coming soon” and hide.
6. **Design tokens:** Plan spacing/type/component-height scale and migrate high-traffic components (per DASHBOARD_DESIGN_AUDIT_REPORT.md).
7. **A11y:** Audit modals, confirmations, and tables; add ARIA and focus management.
8. **E2E:** Add tests for login → dashboard, main tab switches, add/edit order, and at least one report generation path.

---

## 15. Document History

| Version | Date     | Changes                                                                                                     |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| 1.0     | Jan 2025 | Initial full audit: routes, layout, shell, tabs, modals, data, API, styles, utils, issues, recommendations. |

---

_End of report._
