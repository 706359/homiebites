# Dashboard Audit — Implementation Plan

**Source:** DASHBOARD_FULL_AUDIT_REPORT.md  
**Created:** January 2025

---

## Phase 1: Critical & Quick Wins ✅

| # | Task | Files | Status |
|---|------|-------|--------|
| 1.1 | **API base URL** — Use `NEXT_PUBLIC_API_URL` when set; document in .env.example | `lib/api-admin.js` | ✅ |
| 1.2 | **Duplicate NODE_ENV** — Remove inner `if (process.env.NODE_ENV === 'development')` in AdminDashboard | `AdminDashboard.jsx` | ✅ |
| 1.3 | **onCancelCallback** — Verified: already invoked in `onCancel`; no change | — | ✅ |

---

## Phase 2: orderUtils — Centralize Order Amount & Overdue Logic ✅

| # | Task | Files | Status |
|---|------|-------|--------|
| 2.1 | Add `getOrderAmount(order)` to orderUtils | `orderUtils.js` | ✅ |
| 2.2 | Add `getOverdueOrders(orders)` (pending, orderDate &lt; 45d ago) | `orderUtils.js` | ✅ |
| 2.3 | Refactor: DashboardTab, AnalyticsTab, PendingAmountsTab, ReportsTab, ImportantNotificationsBanner, AllAddressesTab to use `getOrderAmount` | 6 files | ✅ |
| 2.4 | Refactor: PendingAmountsTab, ImportantNotificationsBanner to use `getOverdueOrders` | 2 files | ✅ |

---

## Phase 3: Cleanup — Debug Attrs, Naming, No-Ops ✅

| # | Task | Files | Status |
|---|------|-------|--------|
| 3.1 | Remove `data-revenue` and `data-expected` from DashboardTab stat cards | `DashboardTab.jsx` | ✅ |
| 3.2 | MenuPriceTab: use `ConfirmationModal` (fix import alias) | `MenuPriceTab.jsx` | ✅ |
| 3.3 | AllOrdersDataTab: remove `onClearExcelData` prop | `AllOrdersDataTab.jsx`, `AdminDashboard.jsx` | ✅ |
| 3.4 | CSVUploadModal: simplify `onUploadSuccess` callback in AdminDashboard | `AdminDashboard.jsx` | ✅ |
| 3.5 | Remove debug `console.log` block in AdminDashboard `renderActiveTab` | `AdminDashboard.jsx` | ✅ |

---

## Phase 4: Backup/Restore, Reports, html.admin-active ✅

| # | Task | Files | Status |
|---|------|-------|--------|
| 4.1 | **Backup:** Export orders + settings to JSON and trigger download | `AdminDashboard.jsx`, Settings Data section | ✅ |
| 4.2 | **Restore:** File picker → parse JSON → `api.bulkImportOrders` + `api.updateSettings` (with confirmation) | `AdminDashboard.jsx`, Settings Data section | ✅ |
| 4.3 | ReportsTab: label Scheduled reports & Report history as "Coming soon" | `ReportsTab.jsx` | ✅ |
| 4.4 | `html.admin-active`: add on layout mount, remove on unmount | `app/admin/layout.jsx` | ✅ |

---

## Phase 5: Deferred (Later)

| # | Task | Files | Status |
|---|------|-------|--------|
| 5.1 | **adminConfig `users` → `pendingAmounts`** — Rename key in adminConfig and Sidebar | `adminConfig.js`, `Sidebar.jsx` | ✅ |
| 5.2 | **Sidebar: duplicate Logout** — Show footer Logout only when collapsed; dropdown Logout when expanded | `Sidebar.jsx` | ✅ |
| 5.3 | **Sidebar: `suppressHydrationWarning`** — Remove from `admin-sidebar` (no hydration mismatch) | `Sidebar.jsx` | ✅ |
| 5.4 | **ConfirmationModal A11y** — Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` | `ConfirmationModal.jsx` | ✅ |
| 5.5 | **Debug `console.log`** — Remove per-render log in MenuPriceTab; useAdminData, AnalyticsTab, AdminLogin already guarded | `MenuPriceTab.jsx` | ✅ |

- **Spacing/type scale** — Design-tokens refactor (per DASHBOARD_DESIGN_AUDIT_REPORT).
- **OrderModal date formats** — Standardize DD/MM/YYYY vs ISO.
- **Notification settings in NotificationsTab** — Persist via `api.updateSettings({ notificationPrefs })` when backend supports.
- **A11y (broader)** — Focus trap, more modals; ensure Escape/Enter behave consistently.
- **E2E tests** — Login, tab switch, add order, report.

---

## Order of Execution

1. **Phase 1** (1.1, 1.2) — API URL, NODE_ENV cleanup.  
2. **Phase 2** (2.1–2.4) — orderUtils + refactors.  
3. **Phase 3** (3.1–3.5) — Debug attrs, ConfirmModal, no-ops, console.  
4. **Phase 4** (4.1–4.4) — Backup/Restore, Reports, admin-active.

---

*Updates: Mark status as ✅ when done.*
