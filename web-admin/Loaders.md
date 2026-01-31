# HommieBites Loader System Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Component Reference](#component-reference)
4. [Usage Patterns](#usage-patterns)
5. [Styling System](#styling-system)
6. [Accessibility](#accessibility)
7. [Performance Considerations](#performance-considerations)
8. [Migration Guide](#migration-guide)

---

## System Overview

The HommieBites Loader System is a comprehensive, enterprise-grade loading UI framework that provides consistent loading states across both public-facing pages and administrative dashboards. The system is built on three core principles:

1. **Universal Design**: Single `EnterpriseLoader` component with logo-in-square-frame design used across all contexts
2. **Contextual Variants**: Three display modes (fullpage, overlay, inline) for different loading scenarios
3. **Progressive Enhancement**: From simple spinners to sophisticated skeleton loaders with progress tracking

### Key Features

- **Unified Visual Language**: Square frame with animated border progress indicator
- **Accessibility First**: ARIA labels, reduced motion support, semantic HTML
- **Flexible API**: Multiple component types for different use cases
- **Performance Optimized**: Minimal re-renders, CSS animations, efficient skeletons
- **Theming Support**: CSS custom properties with fallbacks for public pages

---

## Architecture

### Component Hierarchy

```
LoaderComponents.jsx (Main API)
├── EnterpriseLoader (Core visual component)
│   ├── FullPageLoader (Wrapper)
│   ├── OverlayLoader (Wrapper)
│   └── InlineLoader (Wrapper)
├── CompactSpinner (Small areas)
├── SkeletonLoader (Content placeholders)
│   ├── AdminSkeletonLoader (Tables, cards, stats)
│   └── PublicSkeleton (Gallery, FAQ, default)
├── LoadingButton (Button states)
├── LoadingWrapper (Conditional rendering)
├── ProgressLoader (Determinate progress)
├── Spinner (Standalone spinners)
└── useLoader (Hook for async operations)
```

### File Structure

```
/components
  /admin
    ├── EnterpriseLoader.jsx      # Core loader component
    ├── CompactSpinner.jsx         # Small spinner component
    └── SkeletonLoader.jsx         # Admin skeleton patterns
  LoaderComponents.jsx             # Public API & wrappers

/styles
  ├── loader.css                   # EnterpriseLoader & CompactSpinner styles
  └── LoaderStyles.css             # Wrapper containers (hb- prefix)
```

### CSS Prefix Convention

- **`enterprise-loader-`**: Core loader component classes
- **`compact-spinner-`**: Compact spinner classes
- **`hb-loader-`**: Wrapper container classes (HommieBites prefix)
- **`hb-spinner-`**: Standalone spinner classes
- **`skeleton-`**: Skeleton loader pattern classes

---

## Component Reference

### 1. FullPageLoader

**Purpose**: Initial page load, major navigation transitions

**Usage**:

```jsx
import { FullPageLoader } from '@/components/LoaderComponents';

<FullPageLoader
  show={isInitializing}
  logoSrc="/logo.png"
  title="Loading Dashboard"
  subtitle="Initializing kitchen command center..."
/>;
```

**Props**:

- `show` (boolean, default: `true`): Controls visibility
- `logoSrc` (string, default: `'/logo.png'`): Logo image URL
- `title` (string, default: `'Loading Dashboard'`): Main label for screen readers
- `subtitle` (string, optional): Additional context for screen readers

**Behavior**:

- Fixed position covering entire viewport
- Z-index: 10000
- Background: Secondary theme color
- Fade-in animation (0.3s)
- Large size (120px frame)

**Best Practices**:

- Use for initial app/page load only
- Always provide descriptive title/subtitle for accessibility
- Remove from DOM when loading completes (don't just hide)

---

### 2. OverlayLoader

**Purpose**: Background operations, data refresh, form submissions

**Usage**:

```jsx
import { OverlayLoader } from '@/components/LoaderComponents';

<OverlayLoader show={isSyncing} message="Syncing inventory data..." />;
```

**Props**:

- `show` (boolean, default: `false`): Controls visibility
- `message` (string, default: `'Loading...'`): Accessible label

**Behavior**:

- Fixed position with backdrop blur
- Z-index: 9999
- Semi-transparent dark background (50% opacity)
- Prevents interaction with underlying content
- Medium size (80px frame)

**Best Practices**:

- Use for operations that block user interaction
- Keep message specific and action-oriented
- Consider timeout limits to prevent indefinite loading states

---

### 3. InlineLoader

**Purpose**: Tab content, sections, lazy-loaded components

**Usage**:

```jsx
import { InlineLoader } from '@/components/LoaderComponents';

<InlineLoader message="Loading menu items..." logoSrc="/logo.png" />;
```

**Props**:

- `message` (string, default: `'Loading...'`): Accessible label
- `spinnerType` (string, default: `'bars'`): Legacy prop (ignored)
- `logoSrc` (string, default: `'/logo.png'`): Logo image URL

**Behavior**:

- Inline block display
- Minimum height: 50vh
- Centered within container
- Large size (120px frame)

**Best Practices**:

- Use within content areas, not full-page overlays
- Ensure parent container has defined height
- Pair with skeleton loaders for better UX on slow connections

---

### 4. CompactLoader

**Purpose**: Buttons, small UI areas, inline status indicators

**Usage**:

```jsx
import { CompactLoader } from '@/components/LoaderComponents';

<CompactLoader message="Saving..." size="medium" />;
```

**Props**:

- `message` (string, default: `'Loading...'`): Label text and aria-label
- `size` (string, default: `'medium'`): Visual size (affects padding, not spinner)

**Behavior**:

- Inline-flex display with padding and border
- Shows circular spinner + label text
- 16px spinner size
- White background with border

**Best Practices**:

- Use for small, localized loading states
- Keep message concise (1-2 words)
- Consider `LoadingButton` component instead for button states

---

### 5. LoadingButton

**Purpose**: Button loading states with integrated spinner

**Usage**:

```jsx
import { LoadingButton } from '@/components/LoaderComponents';

<LoadingButton
  loading={isSubmitting}
  loadingText="Submitting..."
  onClick={handleSubmit}
  type="submit"
  className="btn-primary"
>
  Submit Order
</LoadingButton>;
```

**Props**:

- `loading` (boolean, default: `false`): Loading state
- `loadingText` (string, default: `'Loading...'`): Text shown during loading
- `children` (ReactNode): Button content when not loading
- `disabled` (boolean): Additional disabled state
- `type` (string, default: `'button'`): Button type attribute
- `className` (string): CSS classes
- `onClick` (function): Click handler
- `...rest`: All other button attributes

**Behavior**:

- Replaces children with `CompactSpinner` when loading
- Automatically disables when loading
- Sets `aria-busy` and `aria-disabled` appropriately

**Best Practices**:

- Always provide descriptive `loadingText`
- Don't nest inside forms without proper type handling
- Combine with form validation before setting loading state

---

### 6. SkeletonLoader

**Purpose**: Content placeholders during data fetching

**Usage**:

```jsx
import { SkeletonLoader } from '@/components/LoaderComponents';

// Table skeleton
<SkeletonLoader type="table" rows={10} cols={9} />

// Card grid skeleton
<SkeletonLoader type="card" items={6} />

// Stat cards skeleton
<SkeletonLoader type="stat" items={4} />

// Public page variants
<SkeletonLoader type="gallery" count={8} />
<SkeletonLoader type="faq" count={5} />
```

**Props**:

- `type` (string, default: `'table'`): Skeleton pattern type
  - Admin types: `'table'`, `'card'`, `'stat'`
  - Public types: `'default'`, `'gallery'`, `'faq'`, `'card'`
- `rows` (number, default: `10`): Table rows
- `cols` (number, default: `9`): Table columns
- `items` (number, default: `6`): Number of cards/stats
- `lines` (number, default: `3`): Generic line count
- `count` (number): Public skeleton item count

**Pattern Types**:

**Table** (`type="table"`):

- Header row with column cells
- Body rows with data cells
- Configurable rows × cols grid
- CSS: `.skeleton-table-*` classes

**Card** (`type="card"`):

- Card container with header/body
- Multiple text lines of varying width
- Responsive grid layout
- CSS: `.skeleton-card-*` classes

**Stat** (`type="stat"`):

- Icon placeholder
- Label and value placeholders
- Horizontal layout
- CSS: `.skeleton-stat-*` classes

**Gallery** (`type="gallery"`):

- Image placeholder
- Caption lines
- Grid layout
- CSS: `.skeleton-gallery-*` classes

**FAQ** (`type="faq"`):

- Question line placeholders
- List layout
- CSS: `.skeleton-faq-*` classes

**Best Practices**:

- Match skeleton structure to actual content layout
- Use realistic counts (rows, items) based on typical data
- Combine with progressive loading for large datasets
- Avoid skeletons for very fast operations (<300ms)

---

### 7. LoadingWrapper

**Purpose**: Conditional rendering with automatic loader selection

**Usage**:

```jsx
import { LoadingWrapper } from '@/components/LoaderComponents';

<LoadingWrapper
  loading={isLoading}
  loaderType="skeleton"
  loaderProps={{ type: 'table', rows: 15, cols: 8 }}
>
  <DataTable data={tableData} />
</LoadingWrapper>;
```

**Props**:

- `loading` (boolean, default: `false`): Loading state
- `loaderType` (string, default: `'inline'`): Loader component to use
  - `'skeleton'`: SkeletonLoader
  - `'overlay'`: OverlayLoader
  - `'inline'`: InlineLoader (default)
- `loaderProps` (object, default: `{}`): Props passed to selected loader
- `children` (ReactNode): Content to show when not loading

**Loader Type Configurations**:

```jsx
// Skeleton loader
<LoadingWrapper
  loading={loading}
  loaderType="skeleton"
  loaderProps={{ type: 'card', items: 6 }}
>
  {content}
</LoadingWrapper>

// Overlay loader
<LoadingWrapper
  loading={loading}
  loaderType="overlay"
  loaderProps={{ message: 'Processing...' }}
>
  {content}
</LoadingWrapper>

// Inline loader (default)
<LoadingWrapper
  loading={loading}
  loaderProps={{ message: 'Loading data...' }}
>
  {content}
</LoadingWrapper>
```

**Best Practices**:

- Use `skeleton` type for content that has predictable structure
- Use `overlay` for blocking operations
- Use `inline` for simple content areas
- Ensure children render properly when `loading=false`

---

### 8. ProgressLoader

**Purpose**: Determinate progress indication (file uploads, multi-step processes)

**Usage**:

```jsx
import { ProgressLoader } from '@/components/LoaderComponents';

<ProgressLoader
  message="Uploading images..."
  progress={uploadProgress}
  logoSrc="/logo.png"
/>;
```

**Props**:

- `message` (string, default: `'Loading...'`): Accessible label
- `progress` (number, optional): 0-100 percentage value
- `logoSrc` (string, default: `'/logo.png'`): Logo image URL

**Behavior**:

- Shows EnterpriseLoader with progress bar below
- Progress bar only visible when `progress` is 0-100
- Animated fill transition (0.3s ease-out)
- Displays percentage label below bar

**Best Practices**:

- Use for operations with measurable progress
- Update progress frequently (every 5-10%) for smooth animation
- Provide specific messages ("Uploading 3 of 10 files...")
- Handle edge cases (0%, 100%, network errors)

---

### 9. Spinner

**Purpose**: Standalone spinner without container styling

**Usage**:

```jsx
import { Spinner } from '@/components/LoaderComponents';

<Spinner type="circular" size="medium" />
<Spinner type="dual" size="large" />
<Spinner type="dots" size="small" />
```

**Props**:

- `type` (string, default: `'circular'`): Spinner animation style
  - `'circular'`: Single border spinner
  - `'dual'`: Dual-ring spinner (visually identical to circular)
  - `'dots'`: Three bouncing dots
- `size` (string, default: `'medium'`): Spinner size
  - `'small'`: 16px
  - `'medium'`: 24px
  - `'large'`: 32px

**Behavior**:

- Inline-block display
- No padding or background
- Pure CSS animations
- Respects `prefers-reduced-motion`

**Best Practices**:

- Use `circular` for most cases (standard loading indicator)
- Use `dots` for subtle, non-intrusive loading states
- Avoid `dual` (functionally identical to `circular`)
- Wrap in semantic container with aria-label for accessibility

---

### 10. useLoader Hook

**Purpose**: Manage loading state for async operations

**Usage**:

```jsx
import { useLoader } from '@/components/LoaderComponents';

function MyComponent() {
  const { loading, setLoading, withLoader } = useLoader(false);

  const fetchData = async () => {
    const result = await withLoader(async () => {
      const response = await fetch('/api/data');
      return response.json();
    });
    // result contains the returned data
  };

  return (
    <div>
      {loading ? <InlineLoader /> : <DataDisplay />}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

**Return Value**:

- `loading` (boolean): Current loading state
- `setLoading` (function): Manually set loading state
- `withLoader` (function): Wrap async function to auto-manage loading

**Parameters**:

- `initialState` (boolean, default: `false`): Initial loading state

**withLoader Behavior**:

- Sets loading to `true` before executing function
- Executes provided async function
- Returns function result
- Sets loading to `false` in finally block (even on error)
- Does nothing if non-function passed

**Best Practices**:

- Use `withLoader` for consistent loading state management
- Handle errors separately (withLoader doesn't catch)
- Combine with error state management for production use
- Consider debouncing rapid successive calls

---

### 11. Table Row Loader

**Purpose**: Loading individual table rows during updates or lazy loading

**Implementation**:

```jsx
function TableRowLoader({ colSpan = 9 }) {
  return (
    <tr className="table-row-loader">
      <td colSpan={colSpan}>
        <div className="table-row-loader__content">
          <Spinner type="circular" size="small" />
          <span>Loading row data...</span>
        </div>
      </td>
    </tr>
  );
}

// CSS
.table-row-loader__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  color: var(--admin-text-secondary);
  font-size: var(--admin-fs-sm);
}
```

**Usage**:

```jsx
<table>
  <tbody>
    {data.map((row) => (
      <TableRow key={row.id} data={row} />
    ))}
    {isLoadingMore && <TableRowLoader colSpan={9} />}
  </tbody>
</table>
```

**Best Practices**:

- Use for infinite scroll or "load more" functionality
- Match `colSpan` to actual table column count
- Keep spinner small to avoid disrupting table layout
- Show in last row position for natural reading flow

---

### 12. Infinite Scroll Loader

**Purpose**: Load more content indicator at bottom of scrollable lists

**Implementation**:

```jsx
function InfiniteScrollLoader({
  hasMore = true,
  loading = false,
  onLoadMore,
  message = 'Loading more items...',
}) {
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div ref={observerRef} className="infinite-scroll-loader">
      {loading ? (
        <CompactLoader message={message} />
      ) : (
        <button onClick={onLoadMore} className="load-more-btn">
          Load More
        </button>
      )}
    </div>
  );
}
```

**CSS**:

```css
.infinite-scroll-loader {
  display: flex;
  justify-content: center;
  padding: var(--admin-space-xl) 0;
  margin-top: var(--admin-space-lg);
  border-top: 1px solid var(--admin-border);
}

.load-more-btn {
  padding: var(--admin-space-sm) var(--admin-space-lg);
  background: var(--admin-bg);
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.load-more-btn:hover {
  background: var(--admin-bg-secondary);
}
```

---

### 13. Chart/Graph Loader

**Purpose**: Loading state for data visualizations and charts

**Implementation**:

```jsx
function ChartLoader({
  type = 'bar', // 'bar' | 'line' | 'pie' | 'donut'
  height = 300,
  message = 'Loading chart data...',
}) {
  return (
    <div
      className="chart-loader"
      style={{ height: `${height}px` }}
      role="status"
      aria-label={message}
    >
      <div className="chart-loader__container">
        <Spinner type="circular" size="medium" />
        <p className="chart-loader__message">{message}</p>
      </div>

      {/* Skeleton chart placeholder */}
      <div className="chart-loader__skeleton" aria-hidden="true">
        {type === 'bar' && <BarChartSkeleton />}
        {type === 'line' && <LineChartSkeleton />}
        {type === 'pie' && <PieChartSkeleton />}
      </div>
    </div>
  );
}

function BarChartSkeleton() {
  return (
    <div className="skeleton-chart skeleton-chart--bar">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="skeleton-chart__bar"
          style={{ height: `${Math.random() * 60 + 20}%` }}
        />
      ))}
    </div>
  );
}

function LineChartSkeleton() {
  return (
    <div className="skeleton-chart skeleton-chart--line">
      <div className="skeleton-chart__grid" />
      <svg
        className="skeleton-chart__line-path"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 L20,60 L40,70 L60,40 L80,50 L100,30"
          fill="none"
          stroke="var(--admin-border)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
```

**CSS**:

```css
.chart-loader {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--admin-bg);
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  overflow: hidden;
}

.chart-loader__container {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--admin-space-sm);
}

.chart-loader__message {
  font-size: var(--admin-fs-sm);
  color: var(--admin-text-secondary);
  margin: 0;
}

.chart-loader__skeleton {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  z-index: 1;
}

.skeleton-chart--bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  padding: var(--admin-space-lg);
  height: 100%;
}

.skeleton-chart__bar {
  flex: 1;
  max-width: 40px;
  background: var(--admin-border);
  border-radius: 4px 4px 0 0;
  margin: 0 4px;
}

.skeleton-chart--line {
  position: relative;
  width: 100%;
  height: 100%;
  padding: var(--admin-space-lg);
}

.skeleton-chart__grid {
  position: absolute;
  inset: var(--admin-space-lg);
  background-image:
    repeating-linear-gradient(
      0deg,
      var(--admin-border) 0,
      var(--admin-border) 1px,
      transparent 1px,
      transparent 20%
    ),
    repeating-linear-gradient(
      90deg,
      var(--admin-border) 0,
      var(--admin-border) 1px,
      transparent 1px,
      transparent 20%
    );
}

.skeleton-chart__line-path {
  position: absolute;
  inset: var(--admin-space-lg);
  width: calc(100% - var(--admin-space-lg) * 2);
  height: calc(100% - var(--admin-space-lg) * 2);
}
```

---

### 14. Drawer/Modal Loader

**Purpose**: Loading content within side panels and modal dialogs

**Implementation**:

```jsx
function DrawerLoader({ message = 'Loading...', compact = false }) {
  if (compact) {
    return (
      <div className="drawer-loader drawer-loader--compact">
        <Spinner type="circular" size="small" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="drawer-loader">
      <EnterpriseLoader variant="inline" size="medium" ariaLabel={message} />
    </div>
  );
}

function ModalLoader({
  message = 'Loading...',
  type = 'spinner', // 'spinner' | 'skeleton'
}) {
  if (type === 'skeleton') {
    return (
      <div className="modal-loader">
        <SkeletonLoader type="default" lines={5} />
      </div>
    );
  }

  return (
    <div className="modal-loader">
      <InlineLoader message={message} />
    </div>
  );
}
```

**CSS**:

```css
.drawer-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: var(--admin-space-xl);
}

.drawer-loader--compact {
  flex-direction: row;
  gap: var(--admin-space-sm);
  min-height: auto;
  padding: var(--admin-space-md);
  color: var(--admin-text-secondary);
  font-size: var(--admin-fs-sm);
}

.modal-loader {
  padding: var(--admin-space-xl);
  min-height: 200px;
}
```

---

### 15. Search/Filter Loader

**Purpose**: Real-time search and filter result loading indicators

**Implementation**:

```jsx
function SearchLoader({
  visible = false,
  inline = true,
  message = 'Searching...',
}) {
  if (!visible) return null;

  if (inline) {
    return (
      <div className="search-loader search-loader--inline">
        <Spinner type="dots" size="small" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="search-loader">
      <CompactLoader message={message} size="small" />
    </div>
  );
}

function FilterLoader({ count = 3 }) {
  return (
    <div className="filter-loader">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="filter-loader__item">
          <div className="filter-loader__skeleton" />
        </div>
      ))}
    </div>
  );
}
```

**CSS**:

```css
.search-loader {
  display: flex;
  justify-content: center;
  padding: var(--admin-space-md);
}

.search-loader--inline {
  display: inline-flex;
  align-items: center;
  gap: var(--admin-space-xs);
  padding: var(--admin-space-xs) var(--admin-space-sm);
  font-size: var(--admin-fs-sm);
  color: var(--admin-text-secondary);
}

.filter-loader {
  display: flex;
  gap: var(--admin-space-sm);
  padding: var(--admin-space-md);
}

.filter-loader__item {
  flex: 1;
  min-height: 40px;
  background: var(--admin-bg-secondary);
  border-radius: 8px;
  overflow: hidden;
}

.filter-loader__skeleton {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--admin-bg-secondary) 25%,
    var(--admin-border) 50%,
    var(--admin-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

---

### 16. Notification/Toast Loader

**Purpose**: Background sync and notification loading indicators

**Implementation**:

```jsx
function NotificationLoader({
  message = 'Syncing...',
  position = 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  visible = false,
}) {
  if (!visible) return null;

  return (
    <div className={`notification-loader notification-loader--${position}`}>
      <Spinner type="circular" size="small" />
      <span>{message}</span>
    </div>
  );
}

function SyncIndicator({ syncing = false }) {
  return (
    <div
      className={`sync-indicator ${syncing ? 'sync-indicator--active' : ''}`}
    >
      {syncing ? (
        <>
          <Spinner type="dots" size="small" />
          <span>Syncing...</span>
        </>
      ) : (
        <>
          <svg
            className="sync-indicator__icon"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          </svg>
          <span>Synced</span>
        </>
      )}
    </div>
  );
}
```

**CSS**:

```css
.notification-loader {
  position: fixed;
  z-index: 9998;
  display: flex;
  align-items: center;
  gap: var(--admin-space-sm);
  padding: var(--admin-space-sm) var(--admin-space-md);
  background: var(--admin-bg);
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: var(--admin-fs-sm);
  color: var(--admin-text-secondary);
  animation: slide-in 0.3s ease-out;
}

.notification-loader--top-right {
  top: var(--admin-space-lg);
  right: var(--admin-space-lg);
}

.notification-loader--top-left {
  top: var(--admin-space-lg);
  left: var(--admin-space-lg);
}

.notification-loader--bottom-right {
  bottom: var(--admin-space-lg);
  right: var(--admin-space-lg);
}

.notification-loader--bottom-left {
  bottom: var(--admin-space-lg);
  left: var(--admin-space-lg);
}

@keyframes slide-in {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.sync-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--admin-fs-xs);
  transition: all 0.2s;
}

.sync-indicator--active {
  background: var(--admin-bg-secondary);
  color: var(--admin-accent);
}

.sync-indicator__icon {
  width: 12px;
  height: 12px;
  color: var(--admin-accent);
}
```

---

### 17. Widget/Card Refresh Loader

**Purpose**: Individual card/widget refresh states in dashboards

**Implementation**:

```jsx
function WidgetLoader({ loading = false, children, height = 'auto' }) {
  return (
    <div className="widget-loader" style={{ minHeight: height }}>
      {loading && (
        <div className="widget-loader__overlay">
          <Spinner type="circular" size="small" />
        </div>
      )}
      <div
        className={`widget-loader__content ${loading ? 'widget-loader__content--loading' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

function CardRefreshLoader({ onRefresh, loading = false }) {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className="card-refresh-loader"
      aria-label="Refresh card data"
    >
      <svg
        className={`card-refresh-loader__icon ${loading ? 'card-refresh-loader__icon--spinning' : ''}`}
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
        <path
          fillRule="evenodd"
          d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
        />
      </svg>
    </button>
  );
}
```

**CSS**:

```css
.widget-loader {
  position: relative;
  width: 100%;
}

.widget-loader__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  z-index: 10;
  border-radius: 8px;
}

.widget-loader__content--loading {
  opacity: 0.5;
  pointer-events: none;
}

.card-refresh-loader {
  padding: 6px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--admin-text-secondary);
  transition: all 0.2s;
}

.card-refresh-loader:hover:not(:disabled) {
  background: var(--admin-bg-secondary);
  color: var(--admin-accent);
}

.card-refresh-loader:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-refresh-loader__icon {
  width: 16px;
  height: 16px;
  display: block;
}

.card-refresh-loader__icon--spinning {
  animation: spin-refresh 1s linear infinite;
}

@keyframes spin-refresh {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

---

### 18. Export/Download Loader

**Purpose**: File generation and download progress indication

**Implementation**:

```jsx
function ExportLoader({
  exporting = false,
  progress = null,
  fileName = 'export',
  format = 'CSV',
}) {
  return (
    <div
      className={`export-loader ${exporting ? 'export-loader--active' : ''}`}
    >
      {exporting ? (
        <>
          <Spinner type="circular" size="small" />
          <div className="export-loader__content">
            <span className="export-loader__message">
              Generating {format} file...
            </span>
            {progress !== null && (
              <div className="export-loader__progress">
                <div
                  className="export-loader__progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <svg
            className="export-loader__icon"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
          <span>Export {format}</span>
        </>
      )}
    </div>
  );
}

function DownloadProgressModal({
  visible = false,
  fileName = '',
  progress = 0,
  speed = '0 KB/s',
  onCancel,
}) {
  if (!visible) return null;

  return (
    <div className="download-progress-modal">
      <div className="download-progress-modal__content">
        <div className="download-progress-modal__header">
          <h3>Downloading</h3>
          <button onClick={onCancel} className="download-progress-modal__close">
            ×
          </button>
        </div>

        <div className="download-progress-modal__body">
          <div className="download-progress-modal__file">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
            </svg>
            <div>
              <p className="download-progress-modal__filename">{fileName}</p>
              <p className="download-progress-modal__speed">{speed}</p>
            </div>
          </div>

          <div className="download-progress-modal__progress">
            <div
              className="download-progress-modal__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="download-progress-modal__percentage">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}
```

**CSS**:

```css
.export-loader {
  display: inline-flex;
  align-items: center;
  gap: var(--admin-space-sm);
  padding: var(--admin-space-sm) var(--admin-space-md);
  background: var(--admin-bg);
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  font-size: var(--admin-fs-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.export-loader:hover:not(.export-loader--active) {
  background: var(--admin-bg-secondary);
  border-color: var(--admin-accent);
}

.export-loader--active {
  cursor: not-allowed;
  background: var(--admin-bg-secondary);
}

.export-loader__icon {
  width: 16px;
  height: 16px;
}

.export-loader__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.export-loader__message {
  color: var(--admin-text-secondary);
}

.export-loader__progress {
  width: 120px;
  height: 4px;
  background: var(--admin-border);
  border-radius: 2px;
  overflow: hidden;
}

.export-loader__progress-bar {
  height: 100%;
  background: var(--admin-accent);
  transition: width 0.3s ease-out;
}

.download-progress-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.download-progress-modal__content {
  background: var(--admin-bg);
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.download-progress-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--admin-space-md) var(--admin-space-lg);
  border-bottom: 1px solid var(--admin-border);
}

.download-progress-modal__header h3 {
  margin: 0;
  font-size: var(--admin-fs-lg);
  font-weight: 600;
}

.download-progress-modal__close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--admin-text-secondary);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.download-progress-modal__close:hover {
  background: var(--admin-bg-secondary);
}

.download-progress-modal__body {
  padding: var(--admin-space-lg);
}

.download-progress-modal__file {
  display: flex;
  gap: var(--admin-space-md);
  margin-bottom: var(--admin-space-lg);
}

.download-progress-modal__file svg {
  width: 40px;
  height: 40px;
  color: var(--admin-accent);
  flex-shrink: 0;
}

.download-progress-modal__filename {
  font-weight: 500;
  margin: 0 0 4px 0;
  word-break: break-all;
}

.download-progress-modal__speed {
  margin: 0;
  font-size: var(--admin-fs-sm);
  color: var(--admin-text-secondary);
}

.download-progress-modal__progress {
  width: 100%;
  height: 8px;
  background: var(--admin-bg-secondary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--admin-space-sm);
}

.download-progress-modal__progress-bar {
  height: 100%;
  background: var(--admin-accent);
  transition: width 0.3s ease-out;
}

.download-progress-modal__percentage {
  text-align: right;
  margin: 0;
  font-size: var(--admin-fs-sm);
  font-weight: 600;
  color: var(--admin-accent);
}
```

---

### 19. Lazy Image Loader

**Purpose**: Progressive image loading with placeholder

**Implementation**:

```jsx
function LazyImage({
  src,
  alt,
  className = '',
  placeholder = 'blur', // 'blur' | 'skeleton' | 'spinner'
  aspectRatio = '16/9',
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const img = imgRef.current;
          img.src = src;
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div
      className={`lazy-image ${loaded ? 'lazy-image--loaded' : ''}`}
      style={{ aspectRatio }}
    >
      {!loaded && !error && (
        <div className="lazy-image__placeholder">
          {placeholder === 'spinner' && (
            <Spinner type="circular" size="small" />
          )}
          {placeholder === 'skeleton' && (
            <div className="lazy-image__skeleton" />
          )}
          {placeholder === 'blur' && <div className="lazy-image__blur" />}
        </div>
      )}

      <img
        ref={imgRef}
        alt={alt}
        className={`lazy-image__img ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />

      {error && (
        <div className="lazy-image__error">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
          </svg>
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
}
```

**CSS**:

```css
.lazy-image {
  position: relative;
  width: 100%;
  background: var(--admin-bg-secondary);
  overflow: hidden;
  border-radius: 8px;
}

.lazy-image__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--admin-bg-secondary);
}

.lazy-image__skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--admin-bg-secondary) 25%,
    var(--admin-border) 50%,
    var(--admin-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.lazy-image__blur {
  width: 100%;
  height: 100%;
  background: var(--admin-border);
  filter: blur(20px);
  transform: scale(1.1);
}

.lazy-image__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.lazy-image--loaded .lazy-image__img {
  opacity: 1;
}

.lazy-image__error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--admin-space-sm);
  color: var(--admin-text-secondary);
  font-size: var(--admin-fs-sm);
}

.lazy-image__error svg {
  width: 32px;
  height: 32px;
  opacity: 0.5;
}
```

---

### 20. Batch Operation Loader

**Purpose**: Bulk actions with multi-step progress indication

**Implementation**:

```jsx
function BatchOperationLoader({
  visible = false,
  operation = 'Processing',
  total = 0,
  completed = 0,
  current = '',
  onCancel,
}) {
  if (!visible) return null;

  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="batch-operation-loader">
      <div className="batch-operation-loader__content">
        <div className="batch-operation-loader__header">
          <h3>{operation}</h3>
          <button onClick={onCancel} className="batch-operation-loader__cancel">
            Cancel
          </button>
        </div>

        <div className="batch-operation-loader__progress">
          <div className="batch-operation-loader__stats">
            <span>
              {completed} of {total} completed
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="batch-operation-loader__bar">
            <div
              className="batch-operation-loader__bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {current && (
          <div className="batch-operation-loader__current">
            <Spinner type="circular" size="small" />
            <span>Processing: {current}</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

**CSS**:

```css
.batch-operation-loader {
  position: fixed;
  bottom: var(--admin-space-lg);
  right: var(--admin-space-lg);
  z-index: 9998;
  background: var(--admin-bg);
  border: 1px solid var(--admin-border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 400px;
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.batch-operation-loader__content {
  padding: var(--admin-space-lg);
}

.batch-operation-loader__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--admin-space-md);
}

.batch-operation-loader__header h3 {
  margin: 0;
  font-size: var(--admin-fs-base);
  font-weight: 600;
}

.batch-operation-loader__cancel {
  background: none;
  border: 1px solid var(--admin-border);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: var(--admin-fs-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.batch-operation-loader__cancel:hover {
  background: var(--admin-bg-secondary);
  border-color: var(--admin-accent);
  color: var(--admin-accent);
}

.batch-operation-loader__progress {
  margin-bottom: var(--admin-space-md);
}

.batch-operation-loader__stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--admin-space-xs);
  font-size: var(--admin-fs-sm);
  color: var(--admin-text-secondary);
}

.batch-operation-loader__bar {
  width: 100%;
  height: 8px;
  background: var(--admin-bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.batch-operation-loader__bar-fill {
  height: 100%;
  background: var(--admin-accent);
  transition: width 0.3s ease-out;
}

.batch-operation-loader__current {
  display: flex;
  align-items: center;
  gap: var(--admin-space-sm);
  padding: var(--admin-space-sm);
  background: var(--admin-bg-secondary);
  border-radius: 6px;
  font-size: var(--admin-fs-sm);
  color: var(--admin-text-secondary);
}
```

---

## Usage Patterns

### Pattern 1: Initial Page Load

```jsx
'use client';
import { useState, useEffect } from 'react';
import { FullPageLoader } from '@/components/LoaderComponents';

export default function DashboardPage() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function initialize() {
      await Promise.all([
        loadUserData(),
        loadPreferences(),
        loadDashboardData(),
      ]);
      setIsInitializing(false);
    }
    initialize();
  }, []);

  if (isInitializing) {
    return (
      <FullPageLoader
        show={true}
        title="Loading Dashboard"
        subtitle="Preparing your workspace..."
      />
    );
  }

  return <DashboardContent />;
}
```

---

### Pattern 2: Data Fetching with Skeleton

```jsx
'use client';
import { useState, useEffect } from 'react';
import { SkeletonLoader } from '@/components/LoaderComponents';

export default function ProductList() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await fetch('/api/products').then((r) => r.json());
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <SkeletonLoader type="card" items={6} />;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

### Pattern 3: Form Submission

```jsx
'use client';
import { useState } from 'react';
import { LoadingButton, OverlayLoader } from '@/components/LoaderComponents';

export default function OrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowOverlay(true);
        // Show success message, redirect, etc.
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* form fields */}

        <LoadingButton
          loading={isSubmitting}
          loadingText="Submitting Order..."
          type="submit"
          className="btn-primary"
        >
          Place Order
        </LoadingButton>
      </form>

      <OverlayLoader show={showOverlay} message="Processing your order..." />
    </>
  );
}
```

---

### Pattern 4: File Upload with Progress

```jsx
'use client';
import { useState } from 'react';
import { ProgressLoader } from '@/components/LoaderComponents';

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload(file) {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        setProgress(Math.round(percent));
      }
    });

    xhr.addEventListener('load', () => {
      setUploading(false);
      setProgress(100);
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />

      {uploading && (
        <ProgressLoader
          message={`Uploading... ${progress}%`}
          progress={progress}
        />
      )}
    </div>
  );
}
```

---

### Pattern 5: Tab Navigation

```jsx
'use client';
import { useState } from 'react';
import { InlineLoader } from '@/components/LoaderComponents';

export default function TabbedInterface() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tabData, setTabData] = useState({});
  const [loadingTab, setLoadingTab] = useState(null);

  async function loadTabData(tabName) {
    if (tabData[tabName]) return; // Already loaded

    setLoadingTab(tabName);
    const data = await fetch(`/api/tabs/${tabName}`).then((r) => r.json());
    setTabData((prev) => ({ ...prev, [tabName]: data }));
    setLoadingTab(null);
  }

  function handleTabChange(tabName) {
    setActiveTab(tabName);
    loadTabData(tabName);
  }

  return (
    <div>
      <TabNavigation active={activeTab} onChange={handleTabChange} />

      <div className="tab-content">
        {loadingTab === activeTab ? (
          <InlineLoader message={`Loading ${activeTab}...`} />
        ) : (
          <TabContent data={tabData[activeTab]} />
        )}
      </div>
    </div>
  );
}
```

---

### Pattern 6: useLoader Hook Pattern

```jsx
'use client';
import { useLoader } from '@/components/LoaderComponents';
import { InlineLoader } from '@/components/LoaderComponents';

export default function DataManager() {
  const { loading, withLoader } = useLoader();

  const fetchAndProcess = async () => {
    const result = await withLoader(async () => {
      const data = await fetch('/api/data').then((r) => r.json());
      const processed = await processData(data);
      return processed;
    });

    // Use result
    console.log(result);
  };

  return (
    <div>
      <button onClick={fetchAndProcess} disabled={loading}>
        Fetch Data
      </button>

      {loading && <InlineLoader message="Processing data..." />}
    </div>
  );
}
```

---

### Pattern 7: Infinite Scroll with Table

```jsx
'use client';
import { useState, useEffect } from 'react';
import { InfiniteScrollLoader, TableRowLoader } from '@/components/LoaderComponents';

export default function InfiniteTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading) return;

    setLoading(true);
    const newData = await fetch(`/api/data?page=${page}`).then(r => r.json());

    setData(prev => [...prev, ...newData.items]);
    setHasMore(newData.hasMore);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.status}</td>
          </tr>
        ))}
        {loading && <TableRowLoader colSpan={3} />}
      </tbody>
    </table>

    <InfiniteScrollLoader
      hasMore={hasMore}
      loading={loading}
      onLoadMore={loadMore}
    />
  );
}
```

---

### Pattern 8: Dashboard with Widget Loaders

```jsx
'use client';
import { useState } from 'react';
import {
  WidgetLoader,
  CardRefreshLoader,
  ChartLoader,
} from '@/components/LoaderComponents';

export default function Dashboard() {
  const [widgets, setWidgets] = useState({
    sales: { loading: true, data: null },
    revenue: { loading: true, data: null },
    chart: { loading: true, data: null },
  });

  const refreshWidget = async (widgetName) => {
    setWidgets((prev) => ({
      ...prev,
      [widgetName]: { ...prev[widgetName], loading: true },
    }));

    const data = await fetch(`/api/widgets/${widgetName}`).then((r) =>
      r.json()
    );

    setWidgets((prev) => ({
      ...prev,
      [widgetName]: { loading: false, data },
    }));
  };

  return (
    <div className="dashboard-grid">
      {/* Sales Widget */}
      <div className="widget-card">
        <div className="widget-header">
          <h3>Total Sales</h3>
          <CardRefreshLoader
            onRefresh={() => refreshWidget('sales')}
            loading={widgets.sales.loading}
          />
        </div>
        <WidgetLoader loading={widgets.sales.loading} height="200px">
          <div className="widget-content">
            <h2>${widgets.sales.data?.total || 0}</h2>
            <p className="widget-change">
              {widgets.sales.data?.change || '0%'} from last month
            </p>
          </div>
        </WidgetLoader>
      </div>

      {/* Chart Widget */}
      <div className="widget-card widget-card--wide">
        <div className="widget-header">
          <h3>Revenue Chart</h3>
          <CardRefreshLoader
            onRefresh={() => refreshWidget('chart')}
            loading={widgets.chart.loading}
          />
        </div>
        {widgets.chart.loading ? (
          <ChartLoader type="line" height={300} message="Loading chart..." />
        ) : (
          <RevenueChart data={widgets.chart.data} />
        )}
      </div>
    </div>
  );
}
```

---

### Pattern 9: Real-time Search with Filter

```jsx
'use client';
import { useState, useEffect } from 'react';
import { SearchLoader, FilterLoader } from '@/components/LoaderComponents';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState([]);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function search() {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setSearching(true);
      const data = await fetch(`/api/search?q=${debouncedQuery}`).then((r) =>
        r.json()
      );
      setResults(data);
      setSearching(false);
    }

    search();
  }, [debouncedQuery]);

  useEffect(() => {
    async function loadFilters() {
      const data = await fetch('/api/filters').then((r) => r.json());
      setFilters(data);
      setLoadingFilters(false);
    }
    loadFilters();
  }, []);

  return (
    <div>
      <div className="search-header">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />
        <SearchLoader visible={searching} inline message="Searching..." />
      </div>

      {loadingFilters ? (
        <FilterLoader count={4} />
      ) : (
        <div className="filters">
          {filters.map((filter) => (
            <FilterButton key={filter.id} {...filter} />
          ))}
        </div>
      )}

      <div className="results">
        {results.map((item) => (
          <ResultCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

---

### Pattern 10: File Export with Progress

```jsx
'use client';
import { useState } from 'react';
import {
  ExportLoader,
  DownloadProgressModal,
} from '@/components/LoaderComponents';

export default function DataExport() {
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(null);

  const handleExport = async (format) => {
    setExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/export', {
        method: 'POST',
        body: JSON.stringify({ format }),
      });

      clearInterval(interval);
      setExportProgress(100);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-${Date.now()}.${format.toLowerCase()}`;

        // Track download progress
        setDownloading(true);
        setExporting(false);

        a.click();

        // Simulate download progress (real implementation would use xhr)
        let progress = 0;
        const downloadInterval = setInterval(() => {
          progress += 15;
          setDownloadProgress(progress);
          if (progress >= 100) {
            clearInterval(downloadInterval);
            setTimeout(() => setDownloading(false), 1000);
          }
        }, 100);

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
      setExportProgress(null);
    }
  };

  return (
    <div className="export-controls">
      <ExportLoader
        exporting={exporting}
        progress={exportProgress}
        format="CSV"
        onClick={() => !exporting && handleExport('csv')}
      />

      <ExportLoader
        exporting={exporting}
        progress={exportProgress}
        format="Excel"
        onClick={() => !exporting && handleExport('xlsx')}
      />

      <DownloadProgressModal
        visible={downloading}
        fileName="export-data.csv"
        progress={downloadProgress}
        speed={`${Math.round(downloadProgress * 10)} KB/s`}
        onCancel={() => setDownloading(false)}
      />
    </div>
  );
}
```

---

### Pattern 11: Batch Operations

```jsx
'use client';
import { useState } from 'react';
import { BatchOperationLoader } from '@/components/LoaderComponents';

export default function BulkActions() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [batchOperation, setBatchOperation] = useState({
    active: false,
    operation: '',
    total: 0,
    completed: 0,
    current: '',
  });

  const handleBulkDelete = async () => {
    setBatchOperation({
      active: true,
      operation: 'Deleting Items',
      total: selectedItems.length,
      completed: 0,
      current: '',
    });

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];

      setBatchOperation((prev) => ({
        ...prev,
        current: item.name,
        completed: i,
      }));

      await fetch(`/api/items/${item.id}`, { method: 'DELETE' });

      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setBatchOperation((prev) => ({
      ...prev,
      completed: selectedItems.length,
      current: '',
    }));

    // Cleanup
    setTimeout(() => {
      setBatchOperation({
        active: false,
        operation: '',
        total: 0,
        completed: 0,
        current: '',
      });
      setSelectedItems([]);
    }, 1500);
  };

  const handleBulkUpdate = async (updates) => {
    setBatchOperation({
      active: true,
      operation: 'Updating Items',
      total: selectedItems.length,
      completed: 0,
      current: '',
    });

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];

      setBatchOperation((prev) => ({
        ...prev,
        current: item.name,
        completed: i,
      }));

      await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setBatchOperation((prev) => ({
      ...prev,
      completed: selectedItems.length,
      current: '',
    }));

    setTimeout(() => {
      setBatchOperation({
        active: false,
        operation: '',
        total: 0,
        completed: 0,
        current: '',
      });
      setSelectedItems([]);
    }, 1500);
  };

  return (
    <div>
      <div className="bulk-actions">
        {selectedItems.length > 0 && (
          <>
            <button onClick={handleBulkDelete}>
              Delete Selected ({selectedItems.length})
            </button>
            <button onClick={() => handleBulkUpdate({ status: 'archived' })}>
              Archive Selected
            </button>
          </>
        )}
      </div>

      <BatchOperationLoader
        visible={batchOperation.active}
        operation={batchOperation.operation}
        total={batchOperation.total}
        completed={batchOperation.completed}
        current={batchOperation.current}
        onCancel={() => {
          setBatchOperation({
            active: false,
            operation: '',
            total: 0,
            completed: 0,
            current: '',
          });
        }}
      />

      {/* Your data table/list here */}
    </div>
  );
}
```

---

### Pattern 12: Lazy Loading Images in Gallery

```jsx
'use client';
import { LazyImage } from '@/components/LoaderComponents';

export default function ImageGallery({ images }) {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={image.id} className="gallery-item">
          <LazyImage
            src={image.url}
            alt={image.title}
            placeholder="skeleton"
            aspectRatio="1/1"
          />
          <div className="gallery-item-info">
            <h4>{image.title}</h4>
            <p>{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// With different placeholder styles
export function ProductGallery({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          {/* Blur effect placeholder */}
          <LazyImage
            src={product.image}
            alt={product.name}
            placeholder="blur"
            aspectRatio="4/3"
          />

          {/* Spinner placeholder */}
          <LazyImage
            src={product.thumbnail}
            alt={product.name}
            placeholder="spinner"
            aspectRatio="1/1"
            className="product-thumbnail"
          />

          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### Pattern 13: Modal/Drawer with Loading States

```jsx
'use client';
import { useState, useEffect } from 'react';
import {
  DrawerLoader,
  ModalLoader,
  SkeletonLoader,
} from '@/components/LoaderComponents';

export function ProductDrawer({ productId, isOpen, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      fetch(`/api/products/${productId}`)
        .then((r) => r.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        });
    }
  }, [isOpen, productId]);

  return (
    <div className={`drawer ${isOpen ? 'drawer--open' : ''}`}>
      <div className="drawer-header">
        <h2>Product Details</h2>
        <button onClick={onClose}>×</button>
      </div>

      <div className="drawer-content">
        {loading ? (
          <DrawerLoader message="Loading product details..." />
        ) : (
          <ProductDetails product={product} />
        )}
      </div>
    </div>
  );
}

export function EditModal({ itemId, isOpen, onClose }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && itemId) {
      setLoading(true);
      fetch(`/api/items/${itemId}`)
        .then((r) => r.json())
        .then((data) => {
          setFormData(data);
          setLoading(false);
        });
    }
  }, [isOpen, itemId]);

  return (
    <div className={`modal ${isOpen ? 'modal--open' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Item</h2>
          <button onClick={onClose}>×</button>
        </div>

        {loading ? (
          <ModalLoader type="skeleton" />
        ) : (
          <form>{/* form fields */}</form>
        )}
      </div>
    </div>
  );
}
```

---

### Pattern 14: Background Sync Indicator

```jsx
'use client';
import { useState, useEffect } from 'react';
import {
  NotificationLoader,
  SyncIndicator,
} from '@/components/LoaderComponents';

export default function DashboardLayout({ children }) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    // Auto-sync every 30 seconds
    const interval = setInterval(async () => {
      setSyncing(true);

      try {
        await fetch('/api/sync', { method: 'POST' });
        setLastSync(new Date());
      } catch (error) {
        console.error('Sync failed:', error);
      } finally {
        setSyncing(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <SyncIndicator syncing={syncing} />
          {lastSync && (
            <span className="last-sync">
              Last synced: {lastSync.toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      <NotificationLoader
        visible={syncing}
        message="Syncing data..."
        position="top-right"
      />

      <main>{children}</main>
    </div>
  );
}
```

---

## Styling System

### CSS Custom Properties

The loader system uses CSS custom properties with fallbacks for maximum compatibility:

```css
/* Admin Dashboard Variables */
--admin-bg-secondary: #f9fafb;
--admin-bg: #ffffff;
--admin-text-primary: #111827;
--admin-text-secondary: #6b7280;
--admin-accent: #449031;
--admin-border: #e5e7eb;

/* Spacing */
--admin-space-xs: 8px;
--admin-space-sm: 12px;
--admin-space-md: 16px;
--admin-space-lg: 20px;
--admin-space-xl: 24px;

/* Typography */
--admin-fs-label: 0.875rem;
--admin-fs-base: 1rem;
--admin-fs-2xl: 1.5rem;

/* Animation */
--admin-duration-fast: 0.2s;
--admin-duration-normal: 0.3s;
--admin-ease: ease;
--admin-ease-out: ease-out;
```

### Theming Pattern

```css
/* Override in your theme stylesheet */
:root {
  --admin-accent: #2563eb; /* Blue instead of green */
  --admin-bg-secondary: #f8fafc;
}

/* Dark mode example */
@media (prefers-color-scheme: dark) {
  :root {
    --admin-bg-secondary: #1f2937;
    --admin-bg: #111827;
    --admin-text-primary: #f9fafb;
    --admin-text-secondary: #9ca3af;
    --admin-border: #374151;
  }
}
```

### Animation Classes

```css
/* Fade in animation for fullpage/overlay loaders */
@keyframes enterprise-loader-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Progress rotation animation */
@keyframes enterprise-loader-run {
  to {
    transform: rotate(360deg);
  }
}

/* Compact spinner rotation */
@keyframes compact-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Standalone spinner rotation */
@keyframes hb-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Dots bounce animation */
@keyframes hb-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
```

### Reduced Motion Support

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .enterprise-loader__frame::after {
    animation: none;
    opacity: 0.5; /* Show static indicator */
  }

  .compact-spinner__spinner {
    animation: none;
    border-top-color: var(--admin-accent);
    border-right-color: var(--admin-accent);
  }

  .hb-spinner-circular,
  .hb-spinner-dual {
    animation: none;
    opacity: 0.8;
  }

  .hb-spinner-dots span {
    animation: none;
  }

  .hb-progress-bar-fill,
  .enterprise-loader__progress-fill {
    transition: none;
  }
}
```

---

## Accessibility

### ARIA Attributes

All loader components implement comprehensive ARIA support:

```jsx
// FullPageLoader, OverlayLoader, InlineLoader
<div
  role="status"
  aria-live="polite"
  aria-label={ariaLabel}
  aria-busy={!showProgressBar}
>
  {/* loader content */}
</div>

// Progress bar
<div
  role="progressbar"
  aria-valuenow={Math.round(progress)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`${ariaLabel} ${Math.round(progress)}%`}
>
  {/* progress fill */}
</div>

// LoadingButton
<button
  aria-busy={loading}
  aria-disabled={disabled || loading}
>
  {/* button content */}
</button>
```

### Screen Reader Considerations

**Best Practices**:

1. **Descriptive Labels**: Always provide context-specific messages

   ```jsx
   // Good
   <InlineLoader message="Loading inventory items from database..." />

   // Bad
   <InlineLoader message="Loading..." />
   ```

2. **Progress Updates**: Include percentage in progress labels

   ```jsx
   <ProgressLoader
     message={`Uploading ${currentFile} of ${totalFiles}`}
     progress={percentComplete}
   />
   ```

3. **State Changes**: Use `aria-live="polite"` for non-critical updates

   ```jsx
   <div role="status" aria-live="polite" aria-label="Data refreshed">
   ```

4. **Hide Decorative Elements**: Use `aria-hidden` for visual-only elements
   ```jsx
   <div className="enterprise-loader__logo-wrap" aria-hidden="true">
   ```

### Keyboard Navigation

Loading states should not trap keyboard focus:

```jsx
// Prevent focus on loading overlay
<div className="hb-loader-overlay" inert>
  <OverlayLoader show={true} />
</div>

// Maintain focus on button during loading
<LoadingButton loading={isSubmitting}>
  Submit
</LoadingButton>
```

### Color Contrast

All loader components meet WCAG AA standards:

- Text contrast ratio: 4.5:1 minimum
- Border/accent color contrast: 3:1 minimum
- Progress indicators use theme accent color with sufficient contrast

---

## Performance Considerations

### Rendering Optimization

**Conditional Rendering**: Remove components from DOM when not needed

```jsx
// Good - removes from DOM
{
  loading && <FullPageLoader />;
}

// Bad - keeps in DOM with display:none
<FullPageLoader show={loading} />;
```

**Memoization**: Prevent unnecessary re-renders

```jsx
import { memo } from 'react';

const MemoizedSkeletonLoader = memo(SkeletonLoader);

// Only re-renders when props change
<MemoizedSkeletonLoader type="table" rows={10} cols={9} />;
```

### Animation Performance

**CSS vs JavaScript**: All animations use CSS for hardware acceleration

```css
/* Good - GPU accelerated */
.enterprise-loader__frame::after {
  animation: enterprise-loader-run 1s linear infinite;
}

/* Avoid - main thread animation */
setInterval(() => {
  element.style.transform = `rotate(${rotation}deg)`;
}, 16);
```

**Will-change Optimization**: Applied sparingly for complex animations

```css
.enterprise-loader__frame::after {
  will-change: transform;
}
```

### Bundle Size

**Component Size Analysis**:

- EnterpriseLoader: ~2KB (component + styles)
- CompactSpinner: ~1KB
- SkeletonLoader: ~1.5KB
- Total system: ~8KB gzipped

**Tree Shaking**: Import only what you need

```jsx
// Good - imports only FullPageLoader
import { FullPageLoader } from '@/components/LoaderComponents';

// Bad - imports entire module
import LoaderComponents from '@/components/LoaderComponents';
const { FullPageLoader } = LoaderComponents;
```

### Loading State Timing

**Debounce Fast Operations**: Avoid flash of loading state

```jsx
const [loading, setLoading] = useState(false);
const [showLoader, setShowLoader] = useState(false);

useEffect(() => {
  if (loading) {
    // Only show loader if operation takes >300ms
    const timer = setTimeout(() => setShowLoader(true), 300);
    return () => clearTimeout(timer);
  } else {
    setShowLoader(false);
  }
}, [loading]);

return showLoader ? <InlineLoader /> : <Content />;
```

**Progressive Loading**: Load critical content first

```jsx
const [criticalData, setCriticalData] = useState(null);
const [supplementaryData, setSupplementaryData] = useState(null);

useEffect(() => {
  // Load critical data immediately
  loadCriticalData().then(setCriticalData);

  // Load supplementary data after
  loadSupplementaryData().then(setSupplementaryData);
}, []);

return (
  <>
    {criticalData ? <MainContent /> : <SkeletonLoader type="card" />}
    {supplementaryData ? <Sidebar /> : <CompactLoader />}
  </>
);
```

---

## Migration Guide

### From Legacy Loaders

If you're migrating from an older loading system:

#### Step 1: Identify Current Loader Usage

```jsx
// Old pattern
<div className="spinner-container">
  <div className="spinner"></div>
  <p>Loading...</p>
</div>
```

#### Step 2: Map to New Components

| Old Pattern           | New Component                 |
| --------------------- | ----------------------------- |
| Full-page spinner     | `FullPageLoader`              |
| Modal/overlay spinner | `OverlayLoader`               |
| Section spinner       | `InlineLoader`                |
| Button spinner        | `LoadingButton`               |
| Table placeholder     | `SkeletonLoader type="table"` |

#### Step 3: Update Imports

```jsx
// Before
import Spinner from '@/components/Spinner';
import LoadingSpinner from '@/components/LoadingSpinner';

// After
import { InlineLoader, LoadingButton } from '@/components/LoaderComponents';
```

#### Step 4: Update Component Usage

```jsx
// Before
<LoadingSpinner show={loading} message="Please wait..." />

// After
<InlineLoader message="Please wait..." />
```

#### Step 5: Update Styles

Remove old loader CSS and import new system:

```jsx
// layout.jsx
import '@/styles/loader.css'; // Core styles
import '@/styles/LoaderStyles.css'; // Wrapper styles
```

### Breaking Changes

**v1 to v2 Migration**:

1. **spinnerType prop removed**: No longer used in InlineLoader

   ```jsx
   // Before
   <InlineLoader spinnerType="bars" />

   // After
   <InlineLoader /> // Always uses EnterpriseLoader
   ```

2. **Default export changed**: Now exports object instead of components

   ```jsx
   // Before
   import { FullPageLoader } from '@/components/LoaderComponents';

   // After (still works)
   import { FullPageLoader } from '@/components/LoaderComponents';

   // New alternative
   import Loaders from '@/components/LoaderComponents';
   <Loaders.FullPageLoader />;
   ```

3. **SkeletonLoader API**: Public types now require `count` prop

   ```jsx
   // Before
   <SkeletonLoader type="gallery" items={8} />

   // After
   <SkeletonLoader type="gallery" count={8} />
   ```

### Gradual Migration Strategy

**Phase 1: Add New System (2 weeks)**

- Install new loader components alongside old ones
- Update new features to use new loaders
- No changes to existing code

**Phase 2: High-Traffic Pages (2 weeks)**

- Migrate homepage, dashboard, checkout
- Test thoroughly in production
- Monitor performance metrics

**Phase 3: Administrative Pages (2 weeks)**

- Migrate admin panels, forms
- Update all SkeletonLoader instances

**Phase 4: Cleanup (1 week)**

- Remove old loader components
- Remove old CSS files
- Update documentation

---

## Common Issues & Solutions

### Issue: Logo Not Loading

**Symptom**: Square frame shows "HB" fallback instead of logo

**Solutions**:

1. Verify logo path is correct and accessible
2. Check image file exists in `/public/logo.png`
3. Verify image format (PNG, JPG, SVG supported)
4. Check console for 404 errors

```jsx
// Add error logging
<EnterpriseLoader
  logoSrc="/logo.png"
  onError={(e) => console.error('Logo failed to load:', e)}
/>
```

### Issue: Loader Not Centered

**Symptom**: InlineLoader appears aligned to left/top

**Solution**: Ensure parent container has defined dimensions

```jsx
// Bad - no height defined
<div>
  <InlineLoader />
</div>

// Good - explicit height
<div style={{ minHeight: '400px' }}>
  <InlineLoader />
</div>
```

### Issue: Progress Not Updating

**Symptom**: Progress bar stuck at 0% or not animating

**Solutions**:

1. Ensure progress value is number between 0-100
2. Check for decimal values (rounded internally)
3. Verify state updates are triggering re-renders

```jsx
// Debug progress updates
console.log('Progress value:', progress, typeof progress);

<ProgressLoader progress={progress} message={`Progress: ${progress}%`} />;
```

### Issue: Z-index Conflicts

**Symptom**: Loader appears behind other elements

**Solution**: Check z-index hierarchy in your app

```css
/* Verify these z-indices don't conflict */
.hb-loader-fullpage {
  z-index: 10000;
}
.hb-loader-overlay {
  z-index: 9999;
}

/* If you have higher z-indices, adjust accordingly */
.custom-modal {
  z-index: 10001;
} /* Above fullpage loader */
```

### Issue: Skeleton Doesn't Match Content

**Symptom**: Skeleton layout differs from actual content

**Solution**: Match skeleton structure precisely

```jsx
// Your actual content structure
<div className="product-grid"> {/* 3 columns */}
  {products.map(...)}
</div>

// Matching skeleton
<SkeletonLoader type="card" items={6} /> {/* 2 rows × 3 cols = 6 */}

// Adjust CSS grid to match
.skeleton-card-container {
  grid-template-columns: repeat(3, 1fr);
}
```

---

## Best Practices Summary

### Do's ✅

1. **Provide descriptive ARIA labels** for all loaders
2. **Use skeleton loaders** for predictable content structures
3. **Debounce fast operations** to avoid loading flashes
4. **Remove loaders from DOM** when not needed (don't just hide)
5. **Match skeleton structure** to actual content layout
6. **Use appropriate loader type** for context (fullpage vs inline vs overlay)
7. **Test with reduced motion** enabled
8. **Implement timeout limits** for long operations
9. **Show progress** for long operations when possible
10. **Combine loaders** with error states for robust UX

### Don'ts ❌

1. **Don't use FullPageLoader** for minor operations
2. **Don't show multiple overlays** simultaneously
3. **Don't use generic messages** ("Loading..." instead of "Loading products...")
4. **Don't forget keyboard accessibility** during loading states
5. **Don't block interactions** unnecessarily with overlay loaders
6. **Don't use skeletons** for very fast operations (<300ms)
7. **Don't nest loaders** (loader inside another loader)
8. **Don't ignore error states** (show only loading, no error handling)
9. **Don't hardcode dimensions** that break responsive layouts
10. **Don't use JavaScript animations** when CSS will suffice

---

## API Quick Reference

```jsx
// ============ CORE LOADERS ============

// Full Page Loader
<FullPageLoader show={bool} logoSrc={string} title={string} subtitle={string} />

// Overlay Loader
<OverlayLoader show={bool} message={string} />

// Inline Loader
<InlineLoader message={string} logoSrc={string} />

// Compact Loader
<CompactLoader message={string} size="small|medium|large" />

// Loading Button
<LoadingButton loading={bool} loadingText={string} {...buttonProps}>
  {children}
</LoadingButton>

// Skeleton Loader
<SkeletonLoader
  type="table|card|stat|gallery|faq|default"
  rows={number}
  cols={number}
  items={number}
  count={number}
/>

// Loading Wrapper
<LoadingWrapper
  loading={bool}
  loaderType="inline|overlay|skeleton"
  loaderProps={object}
>
  {children}
</LoadingWrapper>

// Progress Loader
<ProgressLoader message={string} progress={number} logoSrc={string} />

// Spinner
<Spinner type="circular|dual|dots" size="small|medium|large" />

// useLoader Hook
const { loading, setLoading, withLoader } = useLoader(initialState);

// ============ SPECIALIZED LOADERS ============

// Table Row Loader
<TableRowLoader colSpan={number} />

// Infinite Scroll Loader
<InfiniteScrollLoader
  hasMore={bool}
  loading={bool}
  onLoadMore={function}
  message={string}
/>

// Chart Loader
<ChartLoader
  type="bar|line|pie|donut"
  height={number}
  message={string}
/>

// Drawer Loader
<DrawerLoader message={string} compact={bool} />

// Modal Loader
<ModalLoader message={string} type="spinner|skeleton" />

// Search Loader
<SearchLoader visible={bool} inline={bool} message={string} />

// Filter Loader
<FilterLoader count={number} />

// Notification Loader
<NotificationLoader
  message={string}
  position="top-right|top-left|bottom-right|bottom-left"
  visible={bool}
/>

// Sync Indicator
<SyncIndicator syncing={bool} />

// Widget Loader
<WidgetLoader loading={bool} height={string}>
  {children}
</WidgetLoader>

// Card Refresh Loader
<CardRefreshLoader onRefresh={function} loading={bool} />

// Export Loader
<ExportLoader
  exporting={bool}
  progress={number}
  fileName={string}
  format={string}
/>

// Download Progress Modal
<DownloadProgressModal
  visible={bool}
  fileName={string}
  progress={number}
  speed={string}
  onCancel={function}
/>

// Lazy Image
<LazyImage
  src={string}
  alt={string}
  placeholder="blur|skeleton|spinner"
  aspectRatio={string}
  className={string}
/>

// Batch Operation Loader
<BatchOperationLoader
  visible={bool}
  operation={string}
  total={number}
  completed={number}
  current={string}
  onCancel={function}
/>
```

---

## Complete Loader Checklist

Use this checklist to ensure you've covered all loading scenarios in your dashboard:

### Initial Loading States

- [ ] Full page initial load (FullPageLoader)
- [ ] Section/tab content loading (InlineLoader)
- [ ] Modal/drawer content loading (ModalLoader, DrawerLoader)

### Data Operations

- [ ] Table data fetching (SkeletonLoader type="table")
- [ ] Card grid loading (SkeletonLoader type="card")
- [ ] Individual row updates (TableRowLoader)
- [ ] Infinite scroll / pagination (InfiniteScrollLoader)

### User Actions

- [ ] Form submissions (LoadingButton)
- [ ] Bulk operations (BatchOperationLoader)
- [ ] File uploads (ProgressLoader)
- [ ] File exports/downloads (ExportLoader, DownloadProgressModal)
- [ ] Widget refresh (WidgetLoader, CardRefreshLoader)

### Real-time Features

- [ ] Search results (SearchLoader)
- [ ] Filter loading (FilterLoader)
- [ ] Background sync (NotificationLoader, SyncIndicator)
- [ ] Live data updates (NotificationLoader)

### Content Loading

- [ ] Images (LazyImage)
- [ ] Charts/graphs (ChartLoader)
- [ ] Gallery items (SkeletonLoader type="gallery")

### Blocking Operations

- [ ] Background tasks (OverlayLoader)
- [ ] Processing operations (OverlayLoader)
- [ ] Navigation transitions (FullPageLoader)

---

## Implementation Checklist

When implementing the loader system in your project:

### Setup Phase

- [ ] Import loader styles in root layout
- [ ] Verify CSS custom properties are defined
- [ ] Test with reduced motion preferences
- [ ] Check z-index hierarchy

### Development Phase

- [ ] Use appropriate loader for each scenario
- [ ] Provide descriptive ARIA labels
- [ ] Implement error states alongside loading states
- [ ] Add timeout limits for long operations
- [ ] Test keyboard navigation

### Optimization Phase

- [ ] Debounce fast operations (<300ms)
- [ ] Use skeleton loaders for predictable content
- [ ] Implement progressive loading for large datasets
- [ ] Remove loaders from DOM when not needed
- [ ] Monitor bundle size impact

### Testing Phase

- [ ] Test all loading states visually
- [ ] Verify screen reader announcements
- [ ] Test with slow network throttling
- [ ] Check reduced motion behavior
- [ ] Test error recovery flows
- [ ] Verify mobile responsiveness

---

## Additional Resources

### File Locations

- **Components**: `/components/LoaderComponents.jsx`
- **Core Components**: `/components/admin/EnterpriseLoader.jsx`, `CompactSpinner.jsx`, `SkeletonLoader.jsx`
- **Styles**: `/styles/loader.css`, `/styles/LoaderStyles.css`

### Related Documentation

- Accessibility Guidelines: WCAG 2.1 AA compliance
- Animation Performance: CSS Hardware Acceleration best practices
- React Performance: Component optimization patterns

### Support

For issues or questions:

1. Check Common Issues section above
2. Review component source code for implementation details
3. Test with browser DevTools for debugging
4. Verify CSS custom properties are properly defined

---

**Last Updated**: January 2026
**Version**: 2.0
**Compatibility**: React 18+, Next.js 13+
