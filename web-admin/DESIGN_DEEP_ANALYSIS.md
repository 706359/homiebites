# DEEP DESIGN ANALYSIS

## Dashboard Mobile (< 480px) & Web Laptop (1920px)

**Date:** January 14, 2026  
**Focus:** Detailed component-by-component analysis with pixel-perfect recommendations

---

## 🎯 SCOPE

### Dashboard - Mobile View (< 480px)

**Devices:** iPhone SE (375px), iPhone 16 pro (?px), Samsung A12 (412px)  
**Target:** Usable, readable, touch-friendly interface  
**Priority:** Stats visibility, table navigation, form interactions

### Web - Laptop (1920px)

**Devices:** 14" laptop (1920x1080), 15" laptop (1920x1200), 16" laptop (2560x1600)  
**Target:** Professional, spacious, full information visibility  
**Priority:** Content hierarchy, visual balance, navigation clarity

---

## PART 1: DASHBOARD MOBILE ANALYSIS (< 480px)

### Current State Review

**DashboardTab.jsx Layout:**

```
Mobile Layout (375px):
─────────────────────────
│ [Stat Card #1]        │  ← 7 stat cards
│ [Stat Card #2]        │  ← Single column
│ [Stat Card #3]        │  ← Each ~75px tall
│ [Stat Card #4]        │
│ [Stat Card #5]        │
│ [Stat Card #6]        │
│ [Stat Card #7]        │
│ [Chart Container]     │  ← Full width
│ [Bar Chart]           │  ← 180px bar height
│ [Chart Legend]        │
└─────────────────────────┘
```

**Issues Identified:**

#### 🔴 CRITICAL: Stat Card Layout Issues

**Problem 1: Horizontal Overflow on Stats**

- Stat cards: `display: flex; flex-direction: row;` (icon left, text right)
- Container width: 100% (375px total)
- Card padding: 14px
- Icon width: ~24px
- Text area: ~320px

**Reality at 375px:**

```
Available: 375px
- Sidebar margin: 0 (hidden)
- Content padding: 12px × 2 = 24px
- Card container: 351px
- Card padding: 14px × 2 = 28px
- Actual text area: 323px
```

**Text Content:**

- Icon: 20px
- Gap: 12px
- Number: "₹374,345" = ~60px width
- Label: "Total Revenue" = ~100px width
- Subtitle: "New ↑" = ~40px width

**Result:** Text fits BUT no breathing room. Fonts feel tight.

**Current CSS:**

```css
.stat-card {
  padding: 14px !important; /* TOO MUCH on mobile */
  flex-direction: row;
  align-items: center;
  gap: 12px !important;
  width: 100%;
  max-width: 100%;
}
```

**Fix Needed:**

```css
/* Mobile: Reduce padding, adjust layout */
.stat-card {
  padding: 12px;
  flex-direction: row;
  align-items: flex-start; /* Top align for better spacing */
  gap: 10px;
  width: 100%;
}

.stat-card i {
  min-width: 20px;
  margin-top: 2px; /* Align icon with first line of text */
  font-size: 1.2em;
}

.stat-card div {
  flex: 1;
  min-width: 0; /* Allow text truncation if needed */
}

.stat-card h3 {
  margin: 0 0 2px 0;
  font-size: 1.4rem; /* From clamp(1.25rem, 3vw, 2rem) */
  word-break: break-word;
}

.stat-card p {
  margin: 2px 0;
  font-size: 0.9rem;
}

.stat-card-subtitle {
  font-size: 0.8rem;
  color: #666;
}
```

---

#### 🟡 MEDIUM: Stat Card Spacing in Container

**Current structure:**

```jsx
<div className='admin-stats'>
  <div className='stat-card'></div>  ← gap between?
  <div className='stat-card'></div>
  <!-- ... 7 total ... -->
</div>
```

**CSS needed:**

```css
.admin-stats {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Vertical gap between cards */
  margin-bottom: 16px;
}

/* Mobile: First card slightly larger */
.stat-card:first-child {
  border-top: 3px solid var(--primary-green);
}
```

---

#### 🔴 CRITICAL: Chart Rendering on Mobile

**Current State:**

- Chart container: 180px height
- Chart bars: Rendered at "180px" height
- Mobile container: ~330px width
- Monthly revenue chart: 12 bars showing year-over-year

**Issue:** Chart too tall, too compressed horizontally

**Current Code:**

```jsx
const barHeight = maxRevenue > 0 ? (data.revenue / maxRevenue) * 180 : 0;
```

**Problem Analysis:**

```
Desktop (1920px):
- Chart width: ~900px
- Bar width: ~60px each
- 12 months fit comfortably

Mobile (375px):
- Chart width: ~330px
- Bar width: ~27px each  ← TOO NARROW
- Bars look like thin lines
- Bar labels illegible
```

**Solution:**

```jsx
// Detect mobile and adjust
const isMobile = window?.innerWidth < 480;
const chartHeight = isMobile ? 120 : 180; // Reduce height
const maxBarsToShow = isMobile ? 4 : 12; // Show last 4 months only

// Responsive bar width
const barWidth = isMobile ? '20px' : '50px';
```

**CSS:**

```css
.bar-chart-item {
  min-width: 25px;
  width: auto;
  flex: 1;
}

.chart-bars-container {
  display: flex;
  gap: 4px;
  height: 120px; /* Mobile height */
  align-items: flex-end;
}

.chart-year-entry {
  flex: 1;
  min-width: 20px;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
}

.bar-label {
  font-size: 11px;
  margin-top: 4px;
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

#### 🟡 MEDIUM: Tab Navigation Issues

**AllOrdersDataTab - Table Display**

**Current:**

- Pure HTML `<table>` rendering
- Columns: Order ID, Customer, Amount, Status, Actions
- Mobile: Horizontal scroll (bad UX)

**Mobile Reality:**

```
375px width:
- Order ID col: 50px
- Customer: 80px  ← TEXT TRUNCATED
- Amount: 60px
- Status: 50px
- Actions: 60px (3 buttons)
TOTAL: 300px (but overlapping/truncated)
```

**Issue:** Users can't read customer names, actions overlap

**RECOMMENDED SOLUTION: Mobile Card Layout**

```jsx
// Mobile: Card layout
// Desktop: Table layout

const AllOrdersDataTab = ({ orders }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className='orders-mobile-container'>
        {orders.map(order => (
          <div key={order._id} className='order-card-mobile'>
            <div className='order-card-header'>
              <span className='order-id'>#{order.orderId}</span>
              <span className={`status-badge status-${order.status}`}>
                {order.status}
              </span>
            </div>
            <div className='order-card-body'>
              <div className='order-detail'>
                <span className='detail-label'>Customer:</span>
                <span className='detail-value'>{order.customerName}</span>
              </div>
              <div className='order-detail'>
                <span className='detail-label'>Amount:</span>
                <span className='detail-value'>₹{order.totalAmount}</span>
              </div>
              <div className='order-detail'>
                <span className='detail-label'>Date:</span>
                <span className='detail-value'>{formatDate(order.date)}</span>
              </div>
            </div>
            <div className='order-card-actions'>
              <button className='btn-small btn-edit'>Edit</button>
              <button className='btn-small btn-delete'>Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: Keep existing table layout
  return <table><!-- existing --></table>;
};
```

**CSS for Mobile Card:**

```css
.orders-mobile-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
}

.order-card-mobile {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background: white;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.order-id {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.status-Paid {
  background: #d4edda;
  color: #155724;
}

.status-badge.status-Pending {
  background: #fff3cd;
  color: #856404;
}

.order-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.order-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.detail-value {
  font-size: 0.95rem;
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 8px;
}

.order-card-actions {
  display: flex;
  gap: 8px;
}

.btn-small {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.85rem;
  height: auto;
  min-height: 36px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background: #4caf50;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}
```

---

#### 🔴 CRITICAL: Sidebar Impact on Content

**Current:**

- Sidebar: `position: fixed; left: -280px; transition: left 0.3s ease;`
- When open: `left: 0;` (sidebar visible)
- Content: Gets overlay, can't interact

**Issue:** When sidebar opens, overlay blocks all taps

**Current Code:**

```css
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.sidebar-overlay.show {
  display: block;
}
```

**This is CORRECT - overlay should block interaction.**

**Better approach needed:**

```jsx
// Close sidebar when user taps overlay
const handleOverlayClick = () => {
  setSidebarOpen(false);
};

<div className='sidebar-overlay show' onClick={handleOverlayClick} />;
```

---

#### 🟡 MEDIUM: Top Navigation Spacing

**Current:**

- Height: 56px ✓ (Good for mobile touch)
- Padding: 0 12px ✓
- Gap: 8px → Should be 12px
- Title: No ellipsis handling

**Issue:** When multiple buttons present, text gets squeezed

**CSS Fix:**

```css
.admin-top-nav {
  height: 56px;
  padding: 0 12px;
  gap: 12px; /* Increase from 8px */
  min-height: 56px;
}

.top-nav-title {
  font-size: 1rem; /* Slightly smaller on mobile */
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.top-nav-subtitle {
  display: none; /* Hide on mobile */
}

@media (min-width: 480px) {
  .top-nav-subtitle {
    display: block;
    font-size: 0.85rem;
    color: #666;
  }
}
```

---

#### 🟡 MEDIUM: Form (OrderModal) on Mobile

**Current:**

```jsx
// Modal appears full-width and full-height on mobile
.modal-container {
  width: 100vw;
  height: 100dvh;
  max-width: 100vw;
  max-height: 100dvh;
}

.modal-body {
  padding: 8px 12px;
  max-height: calc(100vh - 200px);
}
```

**Issues:**

- Padding: 8px too tight
- Form fields: `min-height: 44px` ✓ (Good)
- Gap between fields: 12px → sometimes feels cramped

**Needed:**

```css
@media (max-width: 480px) {
  .modal-container {
    border-radius: 16px 16px 0 0; /* Bottom sheet style */
    max-height: 90vh;
    margin-top: auto;
  }

  .modal-body {
    padding: 12px;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
  }

  .form-group {
    margin-bottom: 12px;
  }

  label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 12px;
    min-height: 44px;
    font-size: 16px; /* Prevents auto-zoom on iOS */
    border: 1px solid #ddd;
    border-radius: 6px;
  }

  button {
    width: 100%;
    height: 44px;
    font-size: 1rem;
    margin-top: 8px;
  }
}
```

---

### Mobile Dashboard Summary

**Dimensions at 375px:**

```
Total width: 375px
Usable: 351px (after 12px padding each side)

Stat cards: 351px wide × 68px tall (icon + text + padding)
Chart: 351px wide × 120px tall
Table (card): 351px wide × variable
Modal: 375px wide × 90vh tall
```

**Priority Fixes (Mobile):**

1. ✅ Stat card padding: 14px → 12px
2. ✅ Stat card gap: 8px → 10px
3. ✅ Chart height: 180px → 120px
4. ✅ Table → Card layout conversion
5. ✅ Modal bottom sheet style
6. ✅ Tab navigation responsiveness

---

## PART 2: WEB LAPTOP ANALYSIS (1920px)

### Current State Review

**Typical 1920px Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Nav) - Fixed at top                                  │
├─────────────────────────────────────────────────────────────┤
│ Hero Section                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │         HomieBites 🍛                                    │ │
│ │    Homemade Delicacies Delivered Fresh Daily            │ │
│ │                                                          │ │
│ │    [Order on WhatsApp]  [Call]                          │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Features Section (3-4 columns)                               │
├─────────────────────────────────────────────────────────────┤
│ Special Offers                                               │
├─────────────────────────────────────────────────────────────┤
│ Gallery / Testimonials / FAQ / Contact                       │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                       │
└─────────────────────────────────────────────────────────────┘
```

---

#### 🟡 MEDIUM: Hero Section Spacing

**Current CSS:**

```css
.hero-section {
  min-height: 90vh;
  padding-top: 140px;
}

.hero-content {
  max-width: 1200px;
  padding: var(--space-6); /* ~24px */
}

.hero-content h1 {
  font-size: clamp(2rem, 6vw, 4.5rem);
}
```

**Analysis at 1920px:**

```
Viewport: 1920px
Hero content max-width: 1200px
Horizontal padding: (1920 - 1200) / 2 = 360px each side ✓ Good

Hero height: 90vh ≈ 816px (at 1080p)
Padding-top: 140px
Actual content area: 676px

At 1920px, 6vw = 115px (feels good)
```

**Current state is GOOD**, but verification needed:

**Recommend:**

```css
.hero-section {
  min-height: 90vh;
  max-height: 100vh; /* Cap at viewport height */
  padding-top: 80px; /* 140px too much on desktop */
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6); /* More vertical space on desktop */
}

.hero-content h1 {
  font-size: clamp(2rem, 6vw, 4.5rem);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
```

---

#### 🟡 MEDIUM: Hero Buttons Layout

**Current:**

```css
.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4); /* ~16px */
  flex-wrap: wrap;
}

.btn-large {
  padding: ...;
  font-size: ...;
}
```

**Analysis:**

```
At 1920px:
Available width for buttons: ~1200px - (2 × 24px) = 1152px
Button 1 width: ~200px (estimate)
Button 2 width: ~200px (estimate)
Gap: 16px
Total: 416px → plenty of space ✓

Buttons stay side-by-side ✓ Good
```

**Current state is ACCEPTABLE**, but improvement:

```css
.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-6); /* Increase to 24px */
  flex-wrap: wrap;
  margin-top: var(--space-8);
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.1rem;
  min-width: 200px;
}
```

---

#### 🟡 MEDIUM: Features Section Layout

**Purpose:** Showcase key features in columns

**Typical grid:** 3-4 columns on desktop

**Current CSS (assumed):**

```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
```

**At 1920px:**

```
Max-width: 1200px
(1920 - 1200) / 2 = 360px padding each side ✓

3 columns:
- Each column: (1200 - 2×24px gap) / 3 ≈ 376px
- Good for feature cards with icon + text
```

**Needs verification - recommend:**

```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8); /* 32px */
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-8);
}

.feature-card {
  padding: var(--space-8); /* 32px */
  border-radius: 12px;
  text-align: center;
}

.feature-card h3 {
  font-size: 1.4rem;
  margin-bottom: var(--space-4);
}

.feature-card p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}
```

---

#### 🟡 MEDIUM: Special Offers Section

**Purpose:** Draw attention to time-limited offers

**Current layout (assumed):** Full-width with background color/image

**At 1920px - Recommendations:**

```css
.special-offer-section {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  padding: var(--space-12); /* 64px vertical */
  color: white;
  text-align: center;
}

.offer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.offer-title {
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
  font-weight: 700;
}

.offer-description {
  font-size: 1.2rem;
  margin-bottom: var(--space-8);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.offer-cta {
  display: inline-block;
  padding: 14px 32px;
  background: white;
  color: #ff6b35;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.offer-cta:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

---

#### 🟡 MEDIUM: Gallery/Testimonials Section

**At 1920px:**

- Gallery: Can show 4-6 items per row comfortably
- Testimonials: 3-4 cards per row

**Current (assumed):**

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

**Recommendation at 1920px:**

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-8);
  max-width: 1400px;
  margin: 0 auto;
}

.testimonial-card {
  padding: var(--space-8);
  border-radius: 12px;
  background: #f5f5f5;
  border-left: 4px solid var(--primary-green);
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: var(--space-4);
  color: #333;
  font-style: italic;
}

.testimonial-author {
  font-weight: 600;
  color: #666;
}
```

---

#### 🟡 MEDIUM: Typography Hierarchy

**At 1920px, recommended font sizes:**

```css
h1 {
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1.2;
}

h2 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.3;
}

h3 {
  font-size: clamp(1.2rem, 3vw, 2rem);
  line-height: 1.4;
}

p,
span {
  font-size: 1rem;
  line-height: 1.6;
}

.small-text {
  font-size: 0.9rem;
  line-height: 1.5;
}
```

**At max-width: 1920px:**

- H1: ~4rem = 64px (good for hero)
- H2: ~3rem = 48px (section titles)
- H3: ~2rem = 32px (sub-sections)
- P: 1rem = 16px (body text)

---

#### 🟡 MEDIUM: Spacing System at Desktop

**Recommended desktop spacing:**

```css
:root {
  /* Desktop padding/margin */
  --space-desktop-xs: 8px;
  --space-desktop-sm: 12px;
  --space-desktop-md: 16px;
  --space-desktop-lg: 24px;
  --space-desktop-xl: 32px;
  --space-desktop-2xl: 48px;
  --space-desktop-3xl: 64px;

  /* Section padding */
  --section-padding-desktop: 64px;
}

section {
  padding: var(--section-padding-desktop) var(--space-desktop-lg);
}

@media (max-width: 768px) {
  section {
    padding: 32px 16px;
  }
}

@media (max-width: 480px) {
  section {
    padding: 24px 12px;
  }
}
```

---

#### 🟡 MEDIUM: Header/Navigation on Desktop

**At 1920px:**

- Logo size: 40-50px
- Nav items: 16-18px font
- Spacing between nav items: 24px
- Header height: 80-100px

**Recommendation:**

```css
header {
  height: 80px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

nav {
  display: flex;
  gap: 32px;
}

nav a {
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav a:hover {
  color: var(--primary-green);
}
```

---

#### 🟡 MEDIUM: Content Max-Width

**Currently:** 1200px (good starting point)

**Recommendation:**

```
- Hero section: 1200px (current) ✓
- Feature section: 1400px (wider)
- Gallery: 1400px (wider)
- Forms: 800px (narrower, better readability)
- Blog/articles: 900px (optimal reading width)
```

**CSS:**

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-desktop-lg);
}

.container-wide {
  max-width: 1400px;
}

.container-narrow {
  max-width: 900px;
}

.container-form {
  max-width: 600px;
}
```

---

### Desktop (1920px) Layout Summary

**Visual Hierarchy:**

```
1920px viewport:

Header (80px, fixed)
  └─ Logo (40px) + Nav items (16px) + Spacing (32px)

Hero Section (800px height)
  └─ Max-width: 1200px content
  └─ H1: 64px, H2: 36px, Buttons: 16px

Sections (64px top/bottom padding)
  └─ Grid layouts with 32px gap
  └─ Card-based: 300-350px width each

Footer (dense info layout)
  └─ 4 columns layout at 1920px
```

**Key Numbers:**

- Content max-width: 1200-1400px
- Section padding: 64px vertical
- Element gap: 24-32px
- Font sizes: 16px-64px (scaled)
- Button height: 48px (slightly larger than mobile)

---

## PART 3: IMPLEMENTATION PLAN

### IMMEDIATE ACTIONS

**Dashboard Mobile (< 480px) - HIGH PRIORITY**

**File: `/components/admin/DashboardTab.jsx`**

1. Reduce stat card padding: 14px → 12px
2. Add responsive chart height
3. Implement mobile card layout for tables

**File: `/components/admin/styles/responsive.css`**

1. Fix top-nav width calculation
2. Adjust stat card spacing
3. Add chart responsive sizing

**File: `/components/admin/AllOrdersDataTab.jsx`**

1. Add mobile card layout alternative
2. Desktop table layout fallback

---

**Web Laptop (1920px) - MEDIUM PRIORITY**

**File: `/components/Hero.jsx` & `Hero.css`**

1. Verify padding-top (140px might be too much)
2. Ensure buttons gap is sufficient (24px)

**File: `/components/Features.jsx` & `Features.css`**

1. Verify grid layout (3-4 columns)
2. Ensure proper spacing

**File: `/styles/global.css` or similar**

1. Establish desktop spacing system
2. Define section padding constants

---

### SUCCESS CRITERIA

**Mobile Dashboard:**

- ✅ No horizontal scroll on 375px
- ✅ Stat card text readable
- ✅ Charts display in 120px height
- ✅ Touch targets all ≥ 44px
- ✅ Tables converted to cards
- ✅ Forms bottom-sheet style

**Desktop Web (1920px):**

- ✅ Hero section spacious, not cramped
- ✅ Content properly centered
- ✅ Buttons clearly spaced
- ✅ Typography hierarchy obvious
- ✅ No wasted space (but not crowded)
- ✅ Professional appearance

---

## MEASUREMENT SPECIFICATIONS

### Mobile (375px) - Final Metrics

```
Stat Card:
  Width: 351px (375 - 12×2 padding)
  Height: 68px
  Padding: 12px
  Gap to next card: 8px
  Font sizes: H3=22px, P=14px, Sub=11px

Chart:
  Width: 351px
  Height: 120px
  Bar count: 4-6 (not 12)

Table as Card:
  Width: 351px
  Card padding: 12px
  Detail row gap: 8px
  Button min-height: 36px
```

### Desktop (1920px) - Final Metrics

```
Hero:
  Content width: 1200px
  Padding horizontal: 360px (auto)
  Padding vertical: 32px
  H1 size: 64px
  Button width: 200px+
  Gap between buttons: 24px

Sections:
  Max-width: 1200-1400px
  Padding: 64px vertical, 32px horizontal
  Grid gap: 32px
  Card width: 300-350px
```

---

**READY FOR IMPLEMENTATION**

Next steps: Begin with Dashboard Mobile fixes, then Desktop Web optimization.
