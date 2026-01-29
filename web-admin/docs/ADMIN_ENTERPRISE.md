# Admin Dashboard – Enterprise Approach

Single reference for how the admin dashboard is built to an enterprise-level standard: typography, layout, design, accessibility, and what’s next.

---

## 1. Typography (single source of truth)

- **Doc:** [ADMIN_TYPOGRAPHY.md](./ADMIN_TYPOGRAPHY.md)
- **Control:** Settings → Appearance → Font size (16–19px). All admin text scales from this.
- **Variables:** `--admin-fs-h1` … `--admin-fs-caption`, `--admin-fs-2xs` … `--admin-fs-display` in `components/admin/styles/index.css`.
- **Rule:** No hardcoded `px`/raw `rem` for text; only `var(--admin-fs-*)`. Exception: 16px on inputs to prevent iOS zoom (documented in code).

---

## 2. Layout (kitchen-tab pattern)

- **Pattern:** Stats row → Actions/filters bar → Content card(s).
- **Classes:** `kitchen-tab`, `kitchen-tab-stats`, `kitchen-tab-actions`, `kitchen-tab-card`, `kitchen-tab-body-inner`, `kitchen-tab-empty`.
- **Defined in:** `components/admin/styles/modules/kitchen-tab-layout.css`.
- **Tabs using it:** Today’s Orders, Current Month, All Orders, All Addresses, Offers, Reports, Pending Amounts, Reviews, Analytics, Financial Summary, Menu & Price, Notifications. Dashboard and Settings use their own layouts.

---

## 3. Design (cards, tables, buttons)

- **Cards:** `stat-card`, `kitchen-tab-card`, `dashboard-card`; hierarchy via `--admin-fs-h1/h2/h3`, `--admin-fs-body`, `--admin-fs-label`, `--admin-fs-caption`.
- **Tables:** Shared table styles; action columns use `action-icon-edit` (green) and `action-icon-delete` (red). See `components/admin/styles/modules/tables.css`, `utilities.css`.
- **No gradients:** All gradients removed; solid colors only. Skeleton loaders use solid backgrounds.

---

## 4. Website vs admin font

- **Website (public):** Fixed font stack `--font-website` (system fonts). Not controlled by admin Settings.
- **Admin:** Font family from Settings → Appearance applied only on `/admin` routes via `--font-primary`. See [FontSettingsLoader](../../components/FontSettingsLoader.jsx) and `shared/styles/variables.css`.

---

## 5. Accessibility (enterprise a11y)

- **Skip link:** “Skip to main content” at top of admin; visible on focus; targets `#admin-main-content`. WCAG 2.1.
- **Main landmark:** `admin-main` is a `<main id="admin-main-content" role="main">`.
- **Focus:** Buttons, links, inputs, selects, textareas get a visible focus ring (`:focus-visible`) in admin. See `components/admin/styles/index.css`.
- **Modal focus:** ConfirmationModal, SessionTimeoutModal, OrderModal, and CSVUploadModal trap focus (Tab cycles inside), return focus to trigger on close, and support Escape to close. Reusable hook: `components/admin/hooks/useModalFocus.js` (useModalFocus, handleFocusTrapKeydown).
- **Icon-only buttons:** Edit, Delete, Close, and similar icon-only controls have `aria-label` (e.g. "Edit order", "Close") for screen readers.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` shortens transitions in admin (index.css, sidebar, analytics).

---

## 6. Security, errors, performance (existing)

- **Doc:** [ENTERPRISE_STANDARDS.md](./ENTERPRISE_STANDARDS.md)
- **In place:** Session management, error boundary, monitoring, lazy loading, optimistic updates, auth. CSRF/security middleware in `lib/middleware/`.

---

## 7. Done vs next (enterprise checklist)

| Area             | Done                                                                                        | Next (optional)     |
| ---------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| Typography       | ✅ Single source, scale, hierarchy                                                          | –                   |
| Layout           | ✅ Kitchen-tab on all data tabs                                                             | –                   |
| Design           | ✅ Cards, tables, no gradients                                                              | –                   |
| Font split       | ✅ Website fixed, admin from Settings                                                       | –                   |
| Skip link        | ✅                                                                                          | –                   |
| Focus visible    | ✅                                                                                          | –                   |
| Modal focus trap | ✅ ConfirmationModal, SessionTimeoutModal, OrderModal, CSVUploadModal (hook: useModalFocus) | –                   |
| Reduced motion   | ✅                                                                                          | –                   |
| Session / auth   | ✅                                                                                          | –                   |
| Error boundary   | ✅                                                                                          | –                   |
| Lazy load        | ✅                                                                                          | –                   |
| TypeScript       | –                                                                                           | Add for type safety |
| Tests            | –                                                                                           | Unit + E2E          |
| Virtual scroll   | –                                                                                           | Large tables        |
| WCAG AA audit    | –                                                                                           | Full audit + fix    |

---

## 8. Where things live

| What                  | Where                                                    |
| --------------------- | -------------------------------------------------------- |
| Typography variables  | `components/admin/styles/index.css`                      |
| Typography doc        | `docs/ADMIN_TYPOGRAPHY.md`                               |
| Kitchen-tab layout    | `components/admin/styles/modules/kitchen-tab-layout.css` |
| Skip link + focus     | `components/admin/styles/index.css`                      |
| Modal focus hook      | `components/admin/hooks/useModalFocus.js`                |
| Admin dashboard shell | `components/admin/AdminDashboard.jsx`                    |
| Enterprise checklist  | `docs/ENTERPRISE_STANDARDS.md`                           |

This doc is the single entry point for “how is the admin built at enterprise level?” and what to do next.

---

## 9. Recommendations for best-in-class (add or refine)

Ideas to make the dashboard even better as a reference for others—enterprise-level UI/UX.

### Add (high impact)

| Recommendation                 | Why                                                                                                                                                                                                                                 | Effort |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Keyboard shortcuts help**    | Ctrl+K (search) and Ctrl+N (new order) already exist in TopNav but aren't discoverable. Add a "?" key or a "Shortcuts" link/icon that opens a small modal listing all shortcuts.                                                    | Low    |
| **Consistent empty states**    | You have a reusable `EmptyState` component (icon, title, message, Clear filters, Add order). Use it everywhere a tab has "no data" so copy and primary actions (e.g. "Clear filters", "Add order") are consistent.                  | Medium |
| **Skeletons on all data tabs** | AllOrdersDataTab and DashboardTab use skeletons/loaders; other tabs may use a spinner or nothing. Use `SkeletonLoader` (or equivalent) on every tab that shows tables/lists so loading feels consistent and fast.                   | Medium |
| **Compact / density toggle**   | Enterprise users often want denser tables. You already have `filter-bar-compact`, `reports-table-compact`. Add an optional "Compact view" in Settings → Appearance that applies to all tables (e.g. smaller padding, tighter rows). | Medium |

### Add (nice to have)

| Recommendation                                 | Why                                                                                                                                                                                | Effort     |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Document title + live region on tab switch** | On tab change, set `document.title` to e.g. "Orders – HomieBites Admin" and announce the new tab with `aria-live="polite"` so screen-reader users get context without extra steps. | Low        |
| **Breadcrumbs for deep flows**                 | For flows like Report → Preview or Customer → Details modal, a one-line breadcrumb (e.g. "Reports > Preview") improves orientation. Optional; only if you add more nested views.   | Low–medium |

### Remove or simplify

| Recommendation                      | Why                                                                                                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **One term per concept**            | Audit "Clear", "Reset", "Clear filters", "Clear all" across tabs. Pick one term per action (e.g. "Clear filters" for filter chips, "Reset" for form reset) and use it consistently to reduce cognitive load. |
| **Avoid duplicate primary actions** | If a tab has both a top "Add order" and an empty-state "Add order", keep one primary and make the other secondary or remove it so the main CTA is obvious.                                                   |

### Summary

- **Quick wins:** Shortcuts help (? key), document title + live region on tab switch.
- **Biggest UX lift:** Consistent empty states with primary actions + skeletons on all data tabs.
- **Enterprise polish:** Compact/density toggle; consistent "Clear"/"Reset" wording.

### Implemented (Section 9)

| Item                                            | Status                                                                                                                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard shortcuts help                         | Done: `?` key + Shortcuts button (key icon) in TopNav; `KeyboardShortcutsModal.jsx` lists Ctrl+K, Ctrl+N, Escape.                                                               |
| Document title + live region on tab switch      | Done: `document.title` set to `{tab title} – HomieBites Admin`; `.admin-live-region` with `aria-live="polite"` announces "Viewing {tab title}".                                 |
| Compact / density toggle                        | Done: Settings → Appearance → "Compact view (tables)"; persists as `compactTables`; class `admin-compact-tables` on dashboard root; tighter table/card padding in `tables.css`. |
| Breadcrumbs for deep flows                      | Done: Report Preview modal shows "Reports › Preview: {type}"; Customer Details modal shows "Customers › {address}".                                                             |
| One term per concept                            | Done: All Orders filter bar button uses "Clear filters" (was "Clear All") for filter context.                                                                                   |
| Consistent empty states / Skeletons on all tabs | Optional: Use `EmptyState` and `SkeletonLoader` on remaining tabs as needed.                                                                                                    |
| Avoid duplicate primary actions                 | Optional: Audit per tab if desired.                                                                                                                                             |
