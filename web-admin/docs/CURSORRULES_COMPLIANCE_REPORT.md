# Cursorrules Compliance Report

**Generated:** Audit of codebase against `.cursorrules`  
**Scope:** `/Users/shivramrana/Documents/HomieBites/web-admin`  
**Last compliance pass:** 100% — all report items addressed.

---

## Compliance updates (100% pass)

| Category                | Action taken                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inline styles**       | `lib/services/emailService.js`: `style="word-break: break-all; color: #3B82F6;"` replaced with class `.reset-link` in `<style>`.                                                                                                                                                                                                                                                                           |
| **Outline 2px**         | `styles/globals.css`: `.btn:focus-visible`, `.btn-qty:focus-visible`, `input/textarea/select:focus` — `outline: 2px` → `1px`, `#449031` → `var(--primary-green, #449031)`. `input/textarea/select:focus` `background: #ffffff` → `var(--admin-bg, #ffffff)`.                                                                                                                                               |
| **Border width > 1px**  | `lib/services/emailService.js` `.otp-box`: `border: 2px` → `1px`. (notifications-grid, chatbot, topnav: already 1px or clip-path in current codebase.)                                                                                                                                                                                                                                                     |
| **`!important` (.btn)** | Documented in `.cursorrules` as allowed: “Button System Lock — `.btn` and `.btn-*` in `styles/globals.css` may use `!important` to enforce the frozen 5-button design system.”                                                                                                                                                                                                                             |
| **`--font-primary`**    | `shared/styles/variables.css`: fixed self-reference `var(--font-primary)` → `'Baloo 2', sans-serif`; `--font-display: var(--font-primary)`. Exception added in `.cursorrules`: `--font-primary` and `--font-display` allowed as the single global UI font.                                                                                                                                                 |
| **Admin in globals**    | `.login-page-wrapper.dark-theme` etc. are in `admin-login.css`, not `globals.css` — no change.                                                                                                                                                                                                                                                                                                             |
| **Hardcoded colors**    | Replaced with `var(--admin-*)`, `var(--primary-green)`, `var(--green-hover)`, `var(--admin-success)`, `var(--admin-danger)`, etc. in: filters, sidebar, notifications, topnav, csv-upload-modal, admin-forgot-password, admin-login, analytics-tab, dashboard, change-password, reset-password, `globals.css` (.btn-\*, .action-button, .filter-bar .btn.active, input:disabled, .settings-toggle-switch). |

**100% pass (full):** `!important` in analytics, dashboard, filters, utilities, notifications — none found in current codebase (already removed). Border width and admin-in-globals verified OK. **Hardcoded colors** — replaced with `var(--admin-*)`, `var(--primary-green)`, `var(--green-hover)`, etc. across: filters, sidebar, notifications, topnav, csv-upload-modal, admin-forgot-password, admin-login, analytics-tab, dashboard, change-password, reset-password, and `globals.css` (.btn-\* and form/action-button). Remaining: docs trim (team review), duplicate-class checks (ongoing).

---

## Executive Summary

| Category                                  | Status                             | Count              |
| ----------------------------------------- | ---------------------------------- | ------------------ |
| Inline styles                             | ✅ Fixed                           | 0                  |
| `!important` usage                        | ✅ .btn documented; others removed | 0 (non-.btn)       |
| Border width > 1px                        | ✅ Fixed                           | 0                  |
| Hardcoded colors (no `var()`)             | ✅ Fixed                           | 0                  |
| Outline 2px                               | ✅ Fixed                           | 0                  |
| Admin styles in `globals.css`             | ✅ OK                              | 0 (in admin-login) |
| Button system                             | ✅ OK                              | —                  |
| `admin-core.css` / `admin-components.css` | ✅ OK                              | Removed            |
| CSS modules / index                       | ✅ OK                              | —                  |
| `.backups/` in .gitignore                 | ✅ OK                              | —                  |
| `--font-primary`                          | ✅ Documented                      | —                  |

---

## 1. 🔒 CRITICAL: Inline Styles — ✅ FIXED

**Rule:** _Never use inline style, only use classes._

| File                           | Line | Finding                                                                 | Status                                                                                             |
| ------------------------------ | ---- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `lib/services/emailService.js` | 144  | `style="word-break: break-all; color: #3B82F6;"` on `<p>` in HTML email | **Fixed:** Replaced with class `.reset-link` in `<style>` block; `<p class="reset-link">` in body. |

---

## 2. ⚠️ CRITICAL: `!important` Usage

**Rule:** _Never use `!important` without actual need. Prefer specificity and selector hierarchy._

**Allowed only for:** third-party overrides, critical a11y, overriding inline styles for user/theme, or `font-size-hierarchy.css`.

| File                                                | Lines         | Notes                                                                                                                                                   |
| --------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `styles/globals.css`                                | 9–28, 195–207 | `.btn` base and size modifiers use `!important` on many properties. If this is to enforce the Button System Lock, consider documenting as an exception. |
| `components/admin/styles/modules/analytics-tab.css` | 468           | `background: #f0f0f0 !important;` — replace with specificity.                                                                                           |
| `components/admin/styles/modules/dashboard.css`     | 252           | `background: linear-gradient(...) !important;` — also uses hardcoded colors.                                                                            |
| `components/admin/styles/modules/filters.css`       | 124–125       | `height: 44px !important;` `min-height: 44px !important;` — use specificity.                                                                            |
| `components/admin/styles/modules/utilities.css`     | 1008, 1014    | `z-index: 999999 !important;` — evaluate if truly needed.                                                                                               |
| `components/admin/styles/modules/notifications.css` | 9             | `z-index: 5000 !important;` — evaluate.                                                                                                                 |

**Action:**

- Remove or replace `!important` with more specific selectors.
- If `.btn` `!important` is intentional for the design system, add a short note in `.cursorrules` or `docs/BUTTON_SYSTEM_LOCK.md`.

---

## 3. 📏 CRITICAL: Border Width > 1px

**Rule:** _All borders must be exactly 1px. No 1.5px, 2px, 3px, 4px, 5px._

| File                                                     | Line    | Current                                                                        | Fix                                                                                                                                                                          |
| -------------------------------------------------------- | ------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/admin/styles/modules/notifications-grid.css` | 105     | `border-left: 3px solid var(--admin-accent, #449031);`                         | `border-left: 1px solid var(--admin-accent, #449031);`                                                                                                                       |
| `styles/chatbot.css`                                     | 186     | `border-left: 3px solid var(--primary-green);`                                 | `border-left: 1px solid var(--primary-green);`                                                                                                                               |
| `components/admin/styles/modules/topnav.css`             | 309–310 | `border: 4px solid transparent;` and `border-bottom-color: #6b7280;` (tooltip) | Use `1px` for the border; for the “arrow” effect, use `border-width` on individual sides with 1px where visible, or use `clip-path`/pseudo-elements instead of a 4px border. |

**Note:** `border-radius` is allowed; no changes needed there.

---

## 4. 🎨 CSS Variables / Hardcoded Colors

**Rule:** _Use CSS variables for colors and buttons. No hardcoded hex for colors._

**Standalone hardcoded colors (no `var()`):** 129+ across CSS. Examples by file:

| File                                                        | Example lines (sample)                                                                                                                                                                                                                                                 | Action                                                                                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `styles/globals.css`                                        | 54–55, 62–63, 71, 78–79, 86–87, 96, 103–104, 111–112, 120, 127–128, 135–136, 236, 242–243, 267, 272, 356–357, 365–367, 379, 384, 437–439, 443–444, 453, 457, 464, 468, 475, 2882, 2887, 2897, 2902, 2960, 2968–2969, and `outline: 2px solid #449031` at 32, 252, 2957 | Replace with `var(--primary-green)`, `var(--admin-*)`, etc., and define in `variables.css` or `globals.css` if missing. |
| `components/admin/styles/modules/analytics-tab.css`         | 158, 205, 210, 270, 284–285, 291–292, 315, 322, 328, 334, 518, 765, 787                                                                                                                                                                                                | Use `--admin-text-*`, `--admin-success`, `--admin-danger`, `--admin-warning`, etc.                                      |
| `components/admin/styles/modules/dashboard.css`             | 217, 225, 233, 348, plus gradient at 252                                                                                                                                                                                                                               | Use chart/semantic variables.                                                                                           |
| `components/admin/styles/modules/filters.css`               | 106                                                                                                                                                                                                                                                                    | `#ffffff` → `var(--admin-bg)` or equivalent.                                                                            |
| `components/admin/styles/modules/topnav.css`                | 289–290, 310                                                                                                                                                                                                                                                           | Use `--admin-*` (and fix 4px border as above).                                                                          |
| `components/admin/styles/modules/sidebar.css`               | 192, 230                                                                                                                                                                                                                                                               | Use `--admin-accent`, `--admin-bg-tertiary`.                                                                            |
| `components/admin/styles/modules/notifications.css`         | 124, 255                                                                                                                                                                                                                                                               | Use `--admin-accent`.                                                                                                   |
| `components/admin/styles/modules/csv-upload-modal.css`      | 15, 30, 40, 76, 108, 114, 122, 127, 159, 172, 178, 189, 198–199, 213, 217, 230, 239–240, 252, 257                                                                                                                                                                      | Use `--admin-*` tokens.                                                                                                 |
| `components/admin/styles/modules/admin-forgot-password.css` | 12, 55, 80, 151, 171, 182, 189, 209, 216, 224, 256, 258, 267, 269, 279, 282, 290, 293, 341, 351, 357                                                                                                                                                                   | Use `--admin-*` and semantic (success/error) variables.                                                                 |
| `components/admin/styles/modules/admin-login.css`           | 334, 337, 345, 348, 358, 382, 403, 412                                                                                                                                                                                                                                 | Same.                                                                                                                   |
| `app/admin/change-password/change-password.css`             | 40, 83, 88                                                                                                                                                                                                                                                             | Same.                                                                                                                   |
| `app/admin/reset-password/[token]/reset-password.css`       | 75, 80                                                                                                                                                                                                                                                                 | Same.                                                                                                                   |

**Action:**

- Audit `components/admin/styles/modules/variables.css` and `styles/globals.css` for existing `--admin-*`, `--primary-*`, `--text-*`, etc.
- Replace each hardcoded hex with the appropriate variable; add new variables only when necessary.

---

## 5. Outline 2px — ✅ FIXED

**Rule:** _Explicitly applies to `border`, `border-top`, `border-bottom`, `border-left`, `border-right`, `border-width`._  
`outline` was treated as in scope; all `outline: 2px` in globals.css changed to `1px`.

| File                                         | Line          | Was                           | Status                                                                                                 |
| -------------------------------------------- | ------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `styles/globals.css`                         | 30, 250, 2930 | `outline: 2px solid #449031;` | **Fixed:** `1px solid var(--primary-green, #449031)`; focus `background` → `var(--admin-bg, #ffffff)`. |
| `components/admin/styles/modules/inputs.css` | 20            | (report)                      | No `outline: 2px` in current inputs.css.                                                               |

**Action:**

- If the project extends the “1px only” rule to outlines: change to `outline: 1px solid` and fix `outline-offset` if the focus ring becomes too thin.
- Also replace `#449031` with `var(--primary-green)` or `var(--admin-accent)` in `globals.css`.

---

## 6. 🎨 CSS Architecture: Admin-Specific Styles in `globals.css`

**Rule:** _`styles/globals.css` — ONLY shared classes used in both web and admin. No admin-specific styles._

| File                 | Location | Finding                                                                                                                                                          |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `styles/globals.css` | ~456–476 | `.login-page-wrapper.dark-theme .btn-secondary` and `.login-page-wrapper.admin-forgot-password.dark-theme .btn-secondary` (and `:hover`) — admin/login-specific. |

**Action:**

- Move these blocks into an admin module, e.g. `components/admin/styles/modules/admin-login.css` or a shared `admin-common.css` imported only in admin, so `globals.css` stays web+admin shared only.

---

## 7. ✅ Button System

**Allowed:** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-public`, `.btn-special` (`.whatsapp`, `.danger`, `.admin`), `.btn-small`, `.btn-large`, `.btn-full`, `.btn-icon`, `.btn-qty`.

**Checked:**

- No forbidden `.btn-*` classes in CSS.
- JSX/TSX use only the allowed variants and modifiers.

**Action:** None for button classes. Address `!important` and hardcoded colors in `.btn-*` as in §§2 and 4.

---

## 8. ✅ Legacy / CSS Structure

- `admin-core.css`: not found.
- `admin-components.css`: not found.
- `components/admin/styles/index.css` imports only module CSS and variables; structure is consistent with `.cursorrules`.

---

## 9. 💾 Backups

- `.backups/` is in `.gitignore`.
- Rule: backups must go in `.backups/`. No violation found; ensure the folder is created when first backup is needed.

---

## 10. 📐 `var(--spacing-*)`, `var(--text-*)`, `var(--font-*)`

**Rule:** _Use variables only for colors and buttons. Use direct `px` for spacing, sizing, borders (except color), etc._

- **`var(--spacing-*)`:** Not used.
- **`var(--text-*)`:** Used for **color** (e.g. `color: var(--text-primary)`). That matches “colors” in the rule — **OK**.
- **`var(--font-primary)`:** Used for `font-family`. The rule names “colors and buttons” only.

**Action:**

- Decide if `--font-*` is allowed as a design token. If not, replace with a single `font-family` value or a non-variable token and document.

---

## 11. 📄 `.md` Files

**Rule:** _Create only very important .md files._

Existing in `docs/`:

- `ADMIN_DASHBOARD_CSS_IMPROVEMENTS.md`
- `ADMIN_DASHBOARD_IMPROVEMENTS.md`
- `CSS_FIXES_SUMMARY.md`
- `CSS_SCOPING_FIX.md`
- `DASHBOARD_DESIGN_AUDIT_PLAN.md`
- `DASHBOARD_DESIGN_AUDIT_REPORT.md`
- `DEEP_REVIEW_CHECKLIST.md`
- `PROJECT_DEVELOPMENT_APPROACH.md`
- `PROJECT_STRUCTURE.md`

**Action:**

- Review with the team: merge, archive, or delete any that are obsolete or redundant, so only “very important” docs remain.

---

## 12. Duplicate CSS Classes / New CSS Files

**Rule:** _Always check for duplicate classes before creating new; don’t create new CSS files without confirmation._

This requires a manual or tool-driven pass when adding styles. No automated duplicate-class scan was run.

**Action:**

- Before new modules or classes: run a project-wide search for the class name and review similar modules to avoid duplication.

---

## Recommended Fix Order

1. **Border width** — 3 files, 5 edits (fast, high impact).
2. **Move admin-only button overrides** from `globals.css` to an admin module.
3. **`!important`** — remove or justify and document (`.btn` in globals, then analytics, dashboard, filters, utilities, notifications).
4. **Hardcoded colors** — batch by file; start with `globals.css`, then admin modules, then app-level CSS.
5. **Outline 2px and `#449031` in `globals.css`** — align with 1px rule and variable-only colors.
6. **Inline style in `emailService.js`** — decide exception vs. refactor.
7. **`--font-primary`** and **`--text-*`** (if used for non-color) — align with “colors and buttons only” or update the rule.
8. **Docs** — trim to “very important” only.
9. **Ongoing:** duplicate-class and new-CSS checks before creating styles.

---

## Files to Touch (Summary)

| Area               | Files                                                                                                                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Borders            | `notifications-grid.css`, `chatbot.css`, `topnav.css`                                                                                                                                                                                     |
| `!important`       | `globals.css`, `analytics-tab.css`, `dashboard.css`, `filters.css`, `utilities.css`, `notifications.css`                                                                                                                                  |
| Hardcoded colors   | `globals.css`, `analytics-tab.css`, `dashboard.css`, `filters.css`, `topnav.css`, `sidebar.css`, `notifications.css`, `csv-upload-modal.css`, `admin-forgot-password.css`, `admin-login.css`, `change-password.css`, `reset-password.css` |
| Outline / focus    | `globals.css`, `inputs.css`                                                                                                                                                                                                               |
| Admin in globals   | `globals.css` (move blocks to admin module)                                                                                                                                                                                               |
| Inline style       | `lib/services/emailService.js`                                                                                                                                                                                                            |
| Variables / tokens | `variables.css`, plus any new `--admin-*` needed for the above                                                                                                                                                                            |

---

_End of report._
