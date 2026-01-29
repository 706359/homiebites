# Admin Spacing & Layout (Best Space Management)

Single source of truth for **padding**, **margin**, and **layout gaps** across the admin dashboard.

## Spacing scale (`:root` in `components/admin/styles/index.css`)

| Variable | Value | Use |
|----------|--------|-----|
| `--admin-space-3xs` | 2px | Tight inline gaps, icon-to-text |
| `--admin-space-2xs` | 4px | Micro gaps, label-to-value |
| `--admin-space-2xs-mid` | 6px | Small gaps, legend items |
| `--admin-space-xs` | 8px | Compact padding, small gaps |
| `--admin-space-sm` | 12px | Default small padding/gap |
| `--admin-space-md` | 16px | Default medium padding/gap |
| `--admin-space-lg` | 20px | Card padding, section spacing |
| `--admin-space-xl` | 24px | Content padding, section gaps |
| `--admin-space-2xl` | 32px | Large padding, section blocks |
| `--admin-space-3xl` | 40px | Modal/empty state padding |
| `--admin-space-4xl` | 48px | Hero/empty state padding |

## Usage

- **Padding:** `padding: var(--admin-space-xl, 24px);`
- **Margin:** `margin-bottom: var(--admin-space-md, 16px);`
- **Gap (flex/grid):** `gap: var(--admin-space-sm, 12px);`

Use the fallback (e.g. `24px`) so styles still work if the variable is missing.

## Layouts

- **Content area:** `.admin-content` uses `--admin-space-xl` (24px) padding; smaller on laptop/mobile via vars.
- **Section blocks:** `.dashboard-section-block` uses `--admin-space-md` gap; `.dashboard-section-heading` uses `--admin-space-xs` margin.
- **Kitchen tab:** `.kitchen-tab` gap, `.kitchen-tab-actions` padding, `.kitchen-tab-body-inner` padding all use spacing vars.
- **Cards:** `.stat-card`, `.dashboard-card` padding and gap use vars.
- **Tables:** `.action-bar`, `.pagination-controls` padding and margin use vars; `.kitchen-tab .action-bar { margin-bottom: 0 }` to avoid double spacing.

## Principles

1. **One scale** – Prefer spacing vars over raw `px` for padding, margin, and gap.
2. **Layouts** – Use flex/grid `gap` instead of margin between siblings where possible.
3. **No double spacing** – When a parent has `gap`, avoid `margin-bottom` on children (e.g. `.kitchen-tab > * { margin: 0 }`; `.kitchen-tab .action-bar { margin-bottom: 0 }`; `.kitchen-tab .table-container-card { margin-bottom: 0 }`).
4. **Single vertical rhythm** – `.kitchen-tab` uses `gap: var(--admin-space-lg)`; first child of `.admin-content` has `margin-top: 0`. Filter container inside `.kitchen-tab-actions` uses `padding: 0` to avoid stacking with the bar’s padding.
