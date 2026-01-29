# Admin Dashboard Typography System

Enterprise-grade typography for the admin dashboard. All font sizes scale from a **single source of truth** (Settings → Appearance → Font size) so the product behaves like a big-company application: consistent hierarchy, accessibility, and user control.

---

## 1. Single source of truth

- **Root:** `html.admin-active { font-size: var(--admin-base-font-size, 18px); }`
- **Controlled by:** Settings tab → Appearance → Font size (16px, 17px, 18px, 19px).
- **Implementation:** All admin font sizes use **rem-based CSS variables** (`--admin-fs-*`). Because they are in `rem`, they scale automatically when the root font size changes. No hardcoded `px` or raw `rem` for text.

---

## 2. Type scale (numeric)

Defined in `components/admin/styles/index.css` under `:root`. Use these for stats, badges, buttons, and any size that isn’t a semantic heading/body.

| Variable              | rem    | Approx @16px | Use case                  |
| --------------------- | ------ | ------------ | ------------------------- |
| `--admin-fs-2xs`      | 0.625  | 10px         | Tiny badges, tags         |
| `--admin-fs-xs`       | 0.6875 | 11px         | Captions, hints           |
| `--admin-fs-sm`       | 0.75   | 12px         | Labels, table headers     |
| `--admin-fs-sm-mid`   | 0.8125 | 13px         | Small UI text             |
| `--admin-fs-base`     | 0.875  | 14px         | Body / primary text       |
| `--admin-fs-base-mid` | 0.9375 | 15px         | Slightly larger body      |
| `--admin-fs-md`       | 1      | 16px         | Buttons, inputs           |
| `--admin-fs-lg`       | 1.125  | 18px         | Section titles            |
| `--admin-fs-xl`       | 1.25   | 20px         | Page title                |
| `--admin-fs-2xl`      | 1.5    | 24px         | Large headings            |
| `--admin-fs-2xl-mid`  | 1.75   | 28px         | Hero numbers              |
| `--admin-fs-3xl`      | 2      | 32px         | Display                   |
| `--admin-fs-display`  | 3      | 48px         | Big numbers, empty states |

---

## 3. Semantic hierarchy (preferred for headings and text)

Use these so section titles, body, and labels stay consistent and scalable.

| Variable             | Maps to | Use for                                      |
| -------------------- | ------- | -------------------------------------------- |
| `--admin-fs-h1`      | xl      | Page title (e.g. top nav title)              |
| `--admin-fs-h2`      | lg      | Section title (e.g. "Monthly Revenue Trend") |
| `--admin-fs-h3`      | md      | Card / subsection title                      |
| `--admin-fs-body`    | base    | Body text                                    |
| `--admin-fs-label`   | sm      | Labels, table headers                        |
| `--admin-fs-caption` | xs      | Captions, hints, secondary text              |

---

## 4. Rules (big-company standard)

1. **Do not** set `font-size` in `px` or raw `rem` (e.g. `0.8rem`, `1.25rem`) for admin UI text. Always use `var(--admin-fs-*)` or hierarchy variables.
2. **Exception:** Inputs on mobile may use `16px` where required to prevent iOS zoom on focus; this is intentional and documented in code.
3. **Headings:** Prefer `--admin-fs-h1`, `--admin-fs-h2`, `--admin-fs-h3` so section titles and card titles stay consistent and scale with Settings.
4. **Body/labels:** Use `--admin-fs-body`, `--admin-fs-label`, `--admin-fs-caption` for paragraphs, labels, and captions.
5. **Buttons/inputs:** Use `--admin-fs-md` (or scale variables) so they respect the user’s font size preference.
6. **New styles:** When adding or editing admin CSS, use only the variables above. The single source of truth is `components/admin/styles/index.css`; module files should not redefine the scale.

---

## 5. Where it’s defined

- **Variables and scale:** `components/admin/styles/index.css` (top block and `:root`).
- **Root font size:** Set by the Settings tab and applied to `html.admin-active`.
- **Usage:** All admin module CSS use **only** `var(--admin-fs-*)` or hierarchy variables (no fallbacks like `var(--admin-fs-sm, 0.75rem)` in modules—single source of truth). Raw rem/px for text have been removed. The only hardcoded `font-size` is `16px` on inputs in mobile media queries to prevent iOS zoom (documented in code).

---

## 6. Result

- One control (Settings → Font size) drives the whole admin typography.
- Clear hierarchy (page title → section → card → body → label → caption).
- Accessible and consistent with enterprise expectations.
- Easy to maintain: change the scale or root in one place.
