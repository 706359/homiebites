# HommieBites Admin – React Loader Integration Guide

## Package contents

1. **LoaderComponents.jsx** – `components/loaders/LoaderComponents.jsx` (all React loader components – Loaders.md API)
2. **LoaderStyles.css** – `components/loaders/LoaderStyles.css` (hb- prefix; loaded in root layout)
3. **Loader CSS** – `components/admin/styles/modules/loader.css` (loaded via adminStyles.js + root layout)
4. **react-integration-guide.md** – this file

---

## Quick start

### 1. CSS

Admin loader styles are already loaded when you use the admin layout (`/admin`). They come from `adminStyles.js` → `loader.css`. **No extra CSS import** is needed inside admin pages.

**Scope:** Loader CSS is scoped under `.admin-dashboard`. When you use loaders inside the main admin dashboard (tabs, modals, Suspense fallbacks), they are already inside an element with class `admin-dashboard`, so styles apply correctly.

### 2. Import components

```jsx
import {
  FullPageLoader,
  OverlayLoader,
  InlineLoader,
  CompactLoader,
  SkeletonLoader,
  LoadingButton,
  LoadingWrapper,
  useLoader,
  ProgressLoader,
} from '../components/loaders/LoaderComponents';

// Or default object:
import Loaders from '../components/loaders/LoaderComponents';
const { FullPageLoader, useLoader } = Loaders;
```

---

## Usage examples

### 1. Full page loader (initial load)

```jsx
import { FullPageLoader } from '../components/loaders/LoaderComponents';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData().then(() => setLoading(false));
  }, []);

  return (
    <>
      <FullPageLoader
        show={loading}
        logoSrc="/logo.png"
        title="Loading Dashboard"
        subtitle="Initializing kitchen command center..."
      />
      {!loading && <div className="dashboard">{/* content */}</div>}
    </>
  );
}
```

### 2. Overlay loader (refresh / sync)

```jsx
import { OverlayLoader } from '../components/loaders/LoaderComponents';

function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/refresh').then((r) => r.json());
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <OverlayLoader show={refreshing} message="Refreshing data..." />
      <div className="dashboard">
        <button onClick={handleRefresh}>Refresh</button>
        {/* content */}
      </div>
    </>
  );
}
```

### 3. Tab content with inline loader

```jsx
import { InlineLoader } from '../components/loaders/LoaderComponents';

function TabContent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const orders = await fetch('/api/orders').then((r) => r.json());
      setData(orders);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      {loading ? (
        <InlineLoader message="Loading orders..." spinnerType="bars" />
      ) : (
        <div>
          {data && data.map((order) => <div key={order.id}>{order.name}</div>)}
        </div>
      )}
      <button onClick={loadOrders}>Load Orders</button>
    </div>
  );
}
```

### 4. LoadingWrapper

```jsx
import { LoadingWrapper } from '../components/loaders/LoaderComponents';

function OrdersTable() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <LoadingWrapper
      loading={loading}
      loaderType="skeleton"
      loaderProps={{ type: 'table' }}
    >
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>${order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LoadingWrapper>
  );
}
```

### 5. Loading button

```jsx
import { LoadingButton } from '../components/loaders/LoaderComponents';

function OrderForm() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      alert('Order saved!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LoadingButton
        loading={saving}
        loadingText="Saving..."
        type="submit"
        className="btn-primary"
      >
        Save Order
      </LoadingButton>
    </form>
  );
}
```

### 6. useLoader hook

```jsx
import { useLoader } from '../components/loaders/LoaderComponents';

function InventoryPage() {
  const [items, setItems] = useState([]);
  const { loading, withLoader } = useLoader();

  const loadInventory = async () => {
    await withLoader(async () => {
      const data = await fetch('/api/inventory').then((r) => r.json());
      setItems(data);
    });
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      )}
      <button onClick={loadInventory}>Load Inventory</button>
    </div>
  );
}
```

### 7. Progress loader (uploads)

```jsx
import { ProgressLoader } from '../components/loaders/LoaderComponents';

function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (file) => {
    setUploading(true);
    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
    });
    xhr.addEventListener('load', () => {
      setUploading(false);
      setProgress(0);
    });
    xhr.open('POST', '/api/upload');
    xhr.send(new FormData({ file }));
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {uploading && (
        <ProgressLoader message="Uploading file" progress={progress} />
      )}
    </div>
  );
}
```

---

## Component props reference

| Component          | Props                                                                                | Notes                            |
| ------------------ | ------------------------------------------------------------------------------------ | -------------------------------- |
| **FullPageLoader** | `show`, `logoSrc`, `title`, `subtitle`                                               | Title/subtitle used for a11y     |
| **OverlayLoader**  | `show`, `message`                                                                    | Renders only when `show`         |
| **InlineLoader**   | `message`, `spinnerType`, `logoSrc`                                                  | Uses logo-in-square loader       |
| **CompactLoader**  | `message`                                                                            | CompactSpinner with label        |
| **SkeletonLoader** | `type` ('default'\|'table'\|'card'), `lines`, `rows`, `cols`, `items`                | Maps to admin SkeletonLoader     |
| **LoadingWrapper** | `loading`, `loaderType` ('inline'\|'skeleton'\|'overlay'), `loaderProps`, `children` | Shows loader or children         |
| **LoadingButton**  | `loading`, `loadingText`, `children`, `disabled`, `type`, `className`, `onClick`, …  | Button with spinner when loading |
| **ProgressLoader** | `message`, `progress` (0–100 or null), `logoSrc`                                     | Logo + progress bar              |
| **useLoader**      | `(initialLoading?)` → `{ loading, setLoading, withLoader }`                          | Hook for loading state           |

---

## Best practices

1. **Full page** – Use `FullPageLoader` for initial app/dashboard load.
2. **Overlay** – Use `OverlayLoader` for refresh/sync so the rest of the UI stays visible but dimmed.
3. **Inline** – Use `InlineLoader` or `LoadingWrapper` with `loaderType="inline"` inside tabs/sections.
4. **Skeleton** – Use `LoadingWrapper` with `loaderType="skeleton"` and `loaderProps={{ type: 'table' }}` for tables/lists.
5. **Buttons** – Use `LoadingButton` for submit/save so users see a clear loading state.
6. **Async** – Use `useLoader().withLoader(async () => { … })` to tie loading state to async work.

---

## Customization

- All loaders use the **EnterpriseLoader** (logo in square, progress runs around). Logo path: `logoSrc` (default `/logo.png`).
- Loader CSS: `components/loaders/LoaderStyles.css` (hb- prefix) + `components/admin/styles/modules/loader.css` (enterprise loader). Both loaded in root layout; admin layout also loads loader.css.

---

## Common issues

1. **Loader not visible** – Loader CSS is unscoped; ensure `loader.css` and `LoaderStyles.css` are loaded (root layout). Admin layout also loads loader.css.
2. **Logo missing** – Pass `logoSrc="/logo.png"` or your logo path.
3. **Loader never hides** – Use `try/finally` and call `setLoading(false)` in `finally`.

---

Happy coding.
