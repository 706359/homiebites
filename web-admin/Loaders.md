# HommieBites Loader System — As Implemented

This document describes the loader system **exactly as it exists** in the project. Paths, APIs, and usage match the codebase.

---

## Project structure

```
Project Root (Next.js App Router)
│
├── app/
│   ├── layout.jsx          ← Imports loader.css + LoaderStyles.css
│   ├── loading.jsx         ← Uses FullPageLoader (route loading UI)
│   ├── page.jsx            ← Suspense fallbacks use InlineLoader
│   ├── pricing/page.jsx    ← Suspense fallback: InlineLoader
│   └── offers/page.jsx     ← InlineLoader when isLoading
│
├── components/
│   ├── loaders/
│   │   ├── LoaderComponents.jsx   ← All loader components + useLoader
│   │   └── LoaderStyles.css       ← hb-* classes only
│   └── admin/
│       ├── EnterpriseLoader.jsx   ← Used by FullPageLoader, OverlayLoader, InlineLoader, ProgressLoader
│       ├── CompactSpinner.jsx     ← Used by LoadingButton, CompactLoader
│       ├── SkeletonLoader.jsx     ← Table/card/stat skeletons (used via LoaderComponents)
│       └── styles/modules/loader.css  ← .enterprise-loader, .compact-spinner, .admin-loader-progress-*
│
├── public/
│   └── logo.png            ← Default logoSrc for loaders
│
└── styles/
    └── globals.css         ← Skeleton styles for public types: .skeleton-default, .skeleton-gallery, etc.
```

**No `src/` folder.** Loaders live under `components/loaders/` and `components/admin/`.

---

## CSS loading

- **`app/layout.jsx`** imports (in order):
  1. `../components/admin/styles/modules/loader.css`
  2. `../components/loaders/LoaderStyles.css`
- **LoaderStyles.css** defines only `hb-` prefixed wrapper/container classes and spinner/skeleton/progress classes. The actual fullpage/inline/overlay visuals come from **EnterpriseLoader** and **loader.css**.

---

## LoaderComponents.jsx — Exports

All from `components/loaders/LoaderComponents.jsx`. Default export is an object with the same names.

| Export           | Purpose                                                                          |
| ---------------- | -------------------------------------------------------------------------------- |
| `FullPageLoader` | Initial route / dashboard load (logo in square, progress ring)                   |
| `OverlayLoader`  | Refresh/sync overlay (same visual, overlay)                                      |
| `InlineLoader`   | Tabs, sections, Suspense fallbacks (same visual, inline)                         |
| `CompactLoader`  | Small areas; uses CompactSpinner                                                 |
| `LoadingButton`  | Buttons that show spinner + loading text when loading                            |
| `LoadingWrapper` | Wraps children; when loading shows skeleton, overlay, or inline per `loaderType` |
| `SkeletonLoader` | Table/card/stat (admin) or default/gallery/faq/card with count (public)          |
| `ProgressLoader` | Determinate progress with EnterpriseLoader                                       |
| `Spinner`        | Standalone circular/dual/dots (hb-spinner-\*)                                    |
| `useLoader`      | Hook: `{ loading, setLoading, withLoader }`                                      |

---

## Component APIs (as implemented)

### FullPageLoader

```jsx
<FullPageLoader
  show={true} // default: true
  logoSrc="/logo.png" // default: '/logo.png'
  title="Loading Dashboard" // default: 'Loading Dashboard'
  subtitle="Initializing..." // default: 'Initializing kitchen command center...'
/>
```

- Uses **EnterpriseLoader** with `variant="fullpage"`, `size="large"`.
- Wrapper class: `hb-loader-fullpage`.

---

### OverlayLoader

```jsx
<OverlayLoader
  show={refreshing} // default: false
  message="Refreshing data..." // default: 'Loading...'
/>
```

- Uses **EnterpriseLoader** with `variant="overlay"`, `size="medium"`.
- Wrapper class: `hb-loader-overlay`.

---

### InlineLoader

```jsx
<InlineLoader
  message="Loading..." // default: 'Loading...'
  spinnerType="bars" // accepted but visual is always EnterpriseLoader
  logoSrc="/logo.png" // default: '/logo.png'
/>
```

- Uses **EnterpriseLoader** with `variant="inline"`, `size="large"`.
- Wrapper class: `hb-loader-inline`.

---

### CompactLoader

```jsx
<CompactLoader
  message="Loading..." // default: 'Loading...'
  size="medium" // default: 'medium'
/>
```

- Uses **CompactSpinner** (admin). Wrapper class: `hb-loader-compact`.

---

### LoadingButton

```jsx
<LoadingButton
  loading={false}           // default: false
  loadingText="Loading..."  // default: 'Loading...'
  disabled={false}
  type="button"
  className=""
  onClick={...}
  // ...rest passed to <button>
>
  {children}   // shown when not loading
</LoadingButton>
```

- When `loading` is true: renders **CompactSpinner** with `label={loadingText}`; button is disabled and `aria-busy`.

---

### LoadingWrapper

```jsx
<LoadingWrapper
  loading={false}
  loaderType="inline" // 'inline' | 'skeleton' | 'overlay'
  loaderProps={{}} // for skeleton: type, rows, cols, items, lines, count
  // for overlay/inline: message, spinnerType
>
  {children}
</LoadingWrapper>
```

- If `!loading`, renders `children`.
- If `loaderType === 'skeleton'`: `SkeletonLoaderWrapper` with `loaderProps` (type, rows, cols, items, lines, count).
- If `loaderType === 'overlay'`: `OverlayLoader show={true}` with `loaderProps.message`.
- Else: `InlineLoader` with `loaderProps.message`, `loaderProps.spinnerType`.

---

### SkeletonLoader (SkeletonLoaderWrapper)

```jsx
<SkeletonLoader
  type="table" // 'table' | 'card' | 'stat' | 'default' | 'gallery' | 'faq'
  rows={10} // table
  cols={9} // table
  items={6} // card / stat
  lines={3} // fallback table
  count={6} // for type default/gallery/faq/card (public skeletons)
/>
```

- **Admin types** (`table`, `card`, `stat`): use **AdminSkeletonLoader** from `components/admin/SkeletonLoader.jsx` (rows, cols, items).
- **Public types** (`default`, `gallery`, `faq`, and `card` when `count` is set): use **PublicSkeleton** (markup in LoaderComponents; styles in `globals.css`: `.skeleton-default`, `.skeleton-gallery`, etc.).

---

### ProgressLoader

```jsx
<ProgressLoader
  message="Loading..."
  progress={null} // 0–100 for determinate, null for indeterminate
  logoSrc="/logo.png"
/>
```

- Uses **EnterpriseLoader** with `progress` prop when `progress != null` and in range 0–100.
- Wrapper class: `hb-loader-inline`.

---

### Spinner

```jsx
<Spinner
  type="circular" // 'circular' | 'dual' | 'dots'
  size="medium" // 'small' | 'medium' | 'large' → 16 | 24 | 32 px
/>
```

- Uses classes: `hb-spinner-circular`, `hb-spinner-dual`, or `hb-spinner-dots` from **LoaderStyles.css**.

---

### useLoader

```jsx
const { loading, setLoading, withLoader } = useLoader((initialState = false));

// Wrap any async function; loading is true during execution
await withLoader(async () => {
  const data = await fetch('/api/data').then((r) => r.json());
  setData(data);
});
```

---

## Key CSS classes (LoaderStyles.css)

- Containers: `.hb-loader-fullpage`, `.hb-loader-overlay`, `.hb-loader-inline`, `.hb-loader-compact`
- Spinners: `.hb-spinner-circular`, `.hb-spinner-dual`, `.hb-spinner-dots`
- Skeleton wrapper: `.hb-skeleton-loader`
- Progress: `.hb-progress-bar-fill`

Loader visuals (logo + progress ring) come from **loader.css** (`.enterprise-loader`, etc.) and **CompactSpinner** styles.

---

## Where loaders are used in the project

| Location                                                 | Loader                                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `app/loading.jsx`                                        | FullPageLoader                                                                 |
| `components/admin/AdminDashboard.jsx`                    | FullPageLoader (Suspense), InlineLoader (OrderModal, CSVUploadModal fallbacks) |
| `components/admin/TopNav.jsx`                            | OverlayLoader (refresh), Spinner (refresh button)                              |
| All admin tabs (DashboardTab, AnalyticsTab, etc.)        | InlineLoader when `loading`                                                    |
| `components/admin/ConfirmationModal.jsx`                 | LoadingButton                                                                  |
| `components/admin/AllOrdersDataTab.jsx`                  | SkeletonLoader (type="table", rows, cols)                                      |
| `components/admin/AdminLogin.jsx`                        | LoadingButton (submit)                                                         |
| `components/admin/AdminForgotPassword.jsx`               | Spinner (submit when loading)                                                  |
| `components/admin/OrderModal.jsx` (admin)                | Spinner ("Saving...")                                                          |
| `components/admin/MenuPriceTab.jsx`                      | InlineLoader (tab), Spinner (toggle availability)                              |
| `components/Pricing.jsx`, `components/Gallery.jsx`       | SkeletonLoader (type default/gallery, count)                                   |
| `components/Testimonials.jsx`                            | InlineLoader when loading                                                      |
| `components/OrderModal.jsx` (public)                     | InlineLoader when loading items                                                |
| `app/offers/page.jsx`                                    | InlineLoader when isLoading                                                    |
| `app/page.jsx`                                           | InlineLoader (Suspense fallbacks for lazy sections)                            |
| `app/pricing/page.jsx`                                   | InlineLoader (Suspense fallback)                                               |
| `app/admin/reset-password/[token]/ResetPasswordForm.jsx` | LoadingButton                                                                  |
| `app/admin/change-password/ChangePasswordForm.jsx`       | LoadingButton                                                                  |
| `components/ReviewForm.jsx`                              | LoadingButton                                                                  |

**Icon.jsx:** `<Icon name="spinner" />` renders the universal **Spinner** from LoaderComponents (no Lucide loader).

---

## Import examples

```jsx
// Single loader
import { FullPageLoader } from '../components/loaders/LoaderComponents';
import { InlineLoader } from './loaders/LoaderComponents';

// Multiple
import {
  FullPageLoader,
  OverlayLoader,
  InlineLoader,
  LoadingButton,
  LoadingWrapper,
  SkeletonLoader,
  Spinner,
  useLoader,
} from '../loaders/LoaderComponents';

// Default object
import Loaders from '../loaders/LoaderComponents';
const { FullPageLoader, useLoader } = Loaders;
```

CSS is already imported in `app/layout.jsx`; no need to import LoaderStyles.css in individual components.

---

## Logo path

- Default in components: `logoSrc="/logo.png"` (file in `public/logo.png`).
- Override by passing `logoSrc` to FullPageLoader, InlineLoader, or ProgressLoader.

---

**END OF DOCUMENT**

This file describes the loader system as implemented. No structural or API changes—only accurate documentation of the current codebase.
