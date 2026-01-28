# CSS Architecture (Enterprise Loading)

## Load order

### 1. Root layout (`app/layout.jsx`) — every page

| Order | File                                            | Purpose                                                                                                              |
| ----- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1     | `shared/styles/variables.css`                   | Tokens (`--font-primary`, `--admin-*`, colors). Loaded first so all downstream CSS can use them.                     |
| 2     | (none)                                           | Icons: Lucide React via `components/ui/Icon.jsx` (no global icon CSS).                                                |
| 3     | `shared/styles/shared.css`                      | Shared components, section styles. Uses `variables.css` (loaded in root; no `@import` in shared).                    |
| 4     | `styles/globals.css`                            | Buttons, inputs, modals, premium-loader base, **and** `.admin-dashboard` loader overrides (to avoid FOUC on /admin). |

### 2. Admin layout (`app/admin/layout.jsx`) — /admin/\* only

| Order | Entry            | Purpose                                                                                            |
| ----- | ---------------- | -------------------------------------------------------------------------------------------------- |
| 1     | `adminStyles.js` | Single JS entry; imports `index.css` then all modules. No CSS `@import` (avoids Turbopack issues). |

**adminStyles.js** imports, in order:

1. `index.css` — `:root` admin vars, font-size scale, `.admin-dashboard` layout, resets, img rule, exclusions for loader
2. `modules/sidebar.css`, `topnav.css`, `modals.css`, `tables.css`, `filters.css`, `forms.css`, `cards.css`, `badges.css`, `empty-states.css`, `notifications.css`, `inputs.css`, `utilities.css`
3. `modules/dashboard.css`, `pending-amounts.css`, `menu-price.css`, `notifications-grid.css`, `settings.css`, `csv-upload-modal.css`, `analytics-tab.css`, `admin-login.css`, `admin-forgot-password.css`

## Rules

- **variables.css**
  - Loaded from root only. Defines `--font-primary`, `--admin-*`, colors.
  - `shared.css` does not `@import` it; root imports variables before shared.

- **globals.css**
  - Shared: buttons, inputs, modals, premium-loader base.
  - Exception: `.admin-dashboard .premium-loader-*` overrides live here so they apply with the first CSS payload and prevent a loader size flash on /admin refresh.

- **admin (index + modules)**
  - Loaded only on /admin via `adminStyles.js` in `app/admin/layout.jsx`.
  - `index.css`: vars, layout, `:where()` resets (with `.premium-loader-container` excluded), `img:not(.premium-loader-logo)`.

- **No CSS `@import` for app styles**
  - All app CSS is pulled in via JS `import` so the bundler (including Turbopack) handles it reliably.
  - `shared.css` may still `@import` external URLs (e.g. fonts).

## Fonts

- `--font-primary` is set in `variables.css` and by `FontSettingsLoader` / `AdminDashboard` / `AdminLogin`.
- `.admin-dashboard` uses `font-family: var(--font-primary, 'Baloo 2', sans-serif)`.

## Resets and overrides

- **`.admin-dashboard :where(*):not(.premium-loader-container):not(.premium-loader-container *)`**
  - `margin: 0; padding: 0` with zero specificity from `:where()` so component styles win. Loader is excluded so `globals.css` loader styles apply.

- **`.admin-dashboard img:not(.premium-loader-logo)`**
  - `max-width: 100%; height: auto; display: block` for content images. Loader logo is excluded so `globals.css` and admin loader rules control it.

---

## Design & sizing standards

### ✅ In place

| Area                       | Implementation                                                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Design tokens**          | `variables.css`: `--space-*`, `--font-size-*`, `--border-radius-*`, `--font-primary`; admin uses `--admin-*` for colors.                  |
| **Base & type scale**      | 16px base; admin font-size: 14/16/18/20 via `--font-size-sm/base/lg/xl`. `line-height: 1.6` on `.admin-dashboard`.                        |
| **Touch targets**          | Buttons/inputs: `min-height: 44px` (WCAG 2.5.5) in inputs and in `@media (max-width: 480px)` for `.admin-dashboard` interactive elements. |
| **Focus**                  | `:focus-visible` on `.btn`; `:focus` / `:focus-within` on inputs, selects, filters, tables, settings.                                     |
| **Reduced motion**         | `@media (prefers-reduced-motion: reduce)` on admin loader (animation off); `analytics-tab.css` uses it for charts.                        |
| **Resets**                 | `:where()` for margin/padding so component styles override; `box-sizing: border-box` on `.admin-dashboard` and descendants.               |
| **Spacing (admin layout)** | `.admin-content` uses `var(--space-6)` / `var(--space-4)` in media.                                                                       |

### 🔶 Optional improvements

- **Admin modules**: Use fixed `px` or your `--admin-fs-*` type scale where it fits; `variables.css` no longer defines `--space-*` / `--font-size-*` / `--border-radius-*`.
- **`.btn` !important**: Used to enforce a shared button contract; keep as is unless you adopt a different override strategy.
- **Duplicate `--admin-*`**: Defined in both `variables.css` and `admin/index.css`; could be centralized in one file if you refactor tokens.
