# COMPONENT SPECIFICATION DOCUMENT

## Pixel-Perfect Changes for Mobile & Desktop

**Date:** January 14, 2026  
**Status:** Ready for Implementation

---

## 1. MOBILE DASHBOARD STAT CARDS (< 480px)

### Current State

```jsx
// DashboardTab.jsx ~line 470
<div className='stat-card'>
  <i className='fa-solid fa-rupee-sign'></i>
  <div>
    <h3>₹{formatCurrency(allTimeRevenue)}</h3>
    <p>Total Revenue</p>
    <p className='stat-card-subtitle'>...</p>
  </div>
</div>
```

### Current CSS (responsive.css)

```css
.stat-card {
  padding: 14px !important;
  flex-direction: row;
  align-items: center;
  gap: 12px !important;
  width: 100%;
  max-width: 100%;
}
```

### CHANGE 1: Stat Card Padding & Spacing

**File:** `/components/admin/styles/responsive.css`  
**Section:** Mobile stats styling

**BEFORE:**

```css
.stat-card {
  padding: 14px !important;
  flex-direction: row;
  align-items: center;
  gap: 12px !important;
}
```

**AFTER:**

```css
.stat-card {
  padding: 12px !important;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px !important;
  margin-bottom: 8px;
}

.stat-card i {
  min-width: 20px;
  font-size: 1.2em;
  margin-top: 2px;
  flex-shrink: 0;
}

.stat-card div {
  flex: 1;
  min-width: 0;
}

.stat-card h3 {
  font-size: 1.4rem;
  margin: 0 0 2px 0;
  word-break: break-word;
  line-height: 1.2;
}

.stat-card p {
  margin: 2px 0;
  font-size: 0.9rem;
}

.stat-card-subtitle {
  font-size: 0.8rem;
  color: #666;
  margin: 2px 0 0 0;
}
```

**Reason:** Reduces padding from 14px → 12px for better fit, adjusts alignment and spacing

---

### CHANGE 2: Admin Stats Container Spacing

**File:** `/components/admin/styles/responsive.css`  
**Section:** Mobile dashboard section

**ADD after stat-card styles:**

```css
.admin-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.admin-stats .stat-card:first-child {
  border-top: 3px solid var(--primary-green);
  border-radius: 8px;
}
```

**Reason:** Ensures consistent spacing between stat cards, visual hierarchy

---

### CHANGE 3: Chart Responsive Height

**File:** `/components/admin/DashboardTab.jsx`  
**Location:** Chart rendering section (~line 520-560)

**Current Code (approximate):**

```jsx
const barHeight = maxRevenue > 0 ? (data.revenue / maxRevenue) * 180 : 0;
```

**CHANGE to:**

```jsx
// Add at top of component
const chartHeight = typeof window !== 'undefined' && window.innerWidth < 480 ? 120 : 180;

// Then in chart rendering
const barHeight = maxRevenue > 0 ? (data.revenue / maxRevenue) * chartHeight : 0;

// Also adjust bar display - show fewer months on mobile
const monthsToShow = typeof window !== 'undefined' && window.innerWidth < 480 ? 4 : 12;
const filteredMonthlyData = monthlyRevenueData.slice(-monthsToShow);
```

**CSS in responsive.css:**

```css
.chart-container {
  max-height: 200px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.bar-chart-item {
  min-width: 30px;
  width: auto;
}

.chart-bars-container {
  display: flex;
  gap: 4px;
  height: 120px; /* Mobile height */
  align-items: flex-end;
  padding-bottom: 8px;
}

.bar {
  flex: 1;
  min-width: 20px;
  border-radius: 4px 4px 0 0;
}

.bar-label {
  font-size: 11px;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Reason:** Charts unreadable at 180px height on 375px width. Reducing to 120px and showing only last 4 months improves clarity

---

## 2. MOBILE TABLE CONVERSION (< 480px)

### Current State

AllOrdersDataTab.jsx displays HTML table - not responsive

### Solution: Add Mobile Card Layout

**File:** `/components/admin/AllOrdersDataTab.jsx`  
**Location:** Main render function

**Add at top of component:**

```jsx
import { useState, useEffect } from 'react';

const AllOrdersDataTab = ({ orders = [], setActiveTab, setEditingOrder }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();

    const resizeListener = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  // ... existing code ...

  // Mobile view
  if (isMobile) {
    return (
      <div className='orders-mobile-container'>
        {sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <div key={order._id} className='order-card-mobile'>
              <div className='order-card-header'>
                <span className='order-id-badge'>#{order.orderId}</span>
                <span className={`status-badge status-${order.status?.replace(/\s+/g, '-')}`}>
                  {order.status}
                </span>
              </div>
              <div className='order-card-body'>
                <div className='order-detail-row'>
                  <span className='detail-label'>Customer:</span>
                  <span className='detail-value'>{order.customerName || 'N/A'}</span>
                </div>
                <div className='order-detail-row'>
                  <span className='detail-label'>Amount:</span>
                  <span className='detail-value'>₹{formatCurrency(order.totalAmount || 0)}</span>
                </div>
                <div className='order-detail-row'>
                  <span className='detail-label'>Payment:</span>
                  <span className='detail-value'>{order.paymentStatus || 'N/A'}</span>
                </div>
                <div className='order-detail-row'>
                  <span className='detail-label'>Date:</span>
                  <span className='detail-value'>{formatDate(order.date)}</span>
                </div>
              </div>
              <div className='order-card-actions'>
                <button
                  className='btn-card-action btn-edit'
                  onClick={() => {
                    setEditingOrder(order);
                    // Show modal
                  }}
                >
                  Edit
                </button>
                <button
                  className='btn-card-action btn-delete'
                  onClick={() => handleDelete(order._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className='empty-orders'>No orders found</div>
        )}
      </div>
    );
  }

  // Desktop view - existing table code
  return <div className='orders-desktop-container'>{/* Existing table */}</div>;
};
```

**Add CSS to `responsive.css`:**

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
  background: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.order-id-badge {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.status-Paid {
  background: #d4edda;
  color: #155724;
}

.status-badge.status-Pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.status-Cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.detail-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  min-width: 80px;
}

.detail-value {
  font-size: 0.95rem;
  color: #333;
  text-align: right;
  flex: 1;
  font-weight: 500;
  word-break: break-word;
}

.order-card-actions {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.btn-card-action {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.85rem;
  height: 36px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: #4caf50;
  color: white;
}

.btn-edit:active {
  background: #45a049;
  transform: scale(0.98);
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:active {
  background: #da190b;
  transform: scale(0.98);
}

.empty-orders {
  text-align: center;
  padding: 32px 12px;
  color: #999;
  font-size: 0.95rem;
}
```

**Reason:** Tables are unreadable on mobile. Card layout shows essential data clearly

---

## 3. DESKTOP WEB - HERO SECTION (1920px)

### Current State

```css
.hero-section {
  min-height: 90vh;
  padding-top: 140px;
}

.hero-content {
  max-width: 1200px;
  padding: var(--space-6);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}
```

### CHANGE 4: Hero Padding Optimization

**File:** `/components/Hero.css`

**BEFORE:**

```css
.hero-section {
  padding-top: 140px;
}
```

**AFTER:**

```css
.hero-section {
  padding-top: 80px; /* Reduced from 140px */
}

@media (min-width: 1200px) {
  .hero-section {
    padding-top: 100px;
  }
}

@media (min-width: 1920px) {
  .hero-section {
    padding-top: 120px;
  }
}
```

**CSS Addition:**

```css
.hero-content {
  padding: var(--space-8) var(--space-6); /* Increase vertical padding */
}

@media (min-width: 1200px) {
  .hero-content {
    padding: var(--space-10) var(--space-8);
  }
}
```

**Reason:** 140px looks too spacey at 1920px. Better proportion with responsive padding

---

### CHANGE 5: Hero Buttons Spacing

**File:** `/components/Hero.css`

**BEFORE:**

```css
.hero-actions {
  gap: var(--space-4);
  flex-wrap: wrap;
}
```

**AFTER:**

```css
.hero-actions {
  gap: var(--space-4); /* 16px mobile */
  flex-wrap: wrap;
  margin-top: var(--space-6);
}

@media (min-width: 768px) {
  .hero-actions {
    gap: var(--space-6); /* 24px tablet */
    margin-top: var(--space-8);
  }
}

@media (min-width: 1200px) {
  .hero-actions {
    gap: var(--space-8); /* 32px desktop */
    margin-top: var(--space-10);
  }
}

.btn-large {
  min-width: 160px;
  padding: 12px 24px;
}

@media (min-width: 768px) {
  .btn-large {
    min-width: 200px;
    padding: 14px 32px;
    font-size: 1rem;
  }
}

@media (min-width: 1200px) {
  .btn-large {
    min-width: 240px;
    padding: 16px 40px;
    font-size: 1.1rem;
    height: 48px;
  }
}
```

**Reason:** Buttons need more breathing room at desktop, proportional to screen size

---

## 4. DESKTOP WEB - TOP NAV SPACING (1920px)

### Current State (responsive.css)

```css
.admin-top-nav {
  padding: 0 12px;
  gap: 8px;
}

@media (min-width: 768px) {
  /* No changes */
}
```

### CHANGE 6: Top Nav Responsive Spacing

**File:** `/components/admin/styles/responsive.css`

**AFTER mobile section (@media max-width: 480px), ADD:**

```css
/* Tablet (480px - 768px) */
@media (min-width: 480px) and (max-width: 768px) {
  .admin-top-nav {
    padding: 0 16px;
    gap: 12px;
    height: 60px;
    min-height: 60px;
  }

  .top-nav-title {
    font-size: 1.1rem;
  }

  .top-nav-subtitle {
    display: block;
    font-size: 0.85rem;
    color: var(--admin-text-secondary, #666);
  }

  .hamburger-btn {
    display: none; /* Sidebar visible by default on tablet */
  }
}

/* Desktop (768px+) */
@media (min-width: 768px) {
  .admin-top-nav {
    padding: 0 20px;
    gap: 16px;
    height: 64px;
    min-height: 64px;
  }

  .top-nav-title {
    font-size: 1.25rem;
  }

  .top-nav-subtitle {
    display: block;
    font-size: 0.9rem;
    color: var(--admin-text-secondary, #666);
  }

  .hamburger-btn {
    display: none;
  }

  .admin-sidebar {
    position: static;
    width: 280px;
    height: 100%;
    transition: none;
    box-shadow: none;
  }

  .admin-main {
    display: flex;
    flex: 1;
  }
}
```

**Reason:** Desktop nav needs more breathing room, increased padding and gap

---

## 5. MODAL BOTTOM SHEET STYLE (Mobile)

### Current State (responsive.css)

```css
.modal-container {
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  height: 100dvh;
  margin: 0;
  border-radius: 0;
}
```

### CHANGE 7: Mobile Modal Bottom Sheet

**File:** `/components/admin/styles/responsive.css`

**CHANGE existing modal-container:**

```css
.modal-container {
  width: 100vw;
  max-width: 100vw;
  height: auto;
  max-height: 90vh;
  margin: 0;
  margin-top: auto;
  border-radius: 16px 16px 0 0; /* Bottom sheet style */
  border: none;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
}

.modal-overlay {
  padding: 0;
  align-items: flex-end;
  justify-content: flex-end;
}

.modal-header {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.modal-body {
  padding: 12px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.modal-footer {
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
  flex-wrap: nowrap;
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
  font-size: 16px; /* Prevents iOS auto-zoom */
  padding: 12px;
  min-height: 44px;
  width: 100%;
}

button {
  min-height: 44px;
  width: 100%;
  margin: 4px 0;
  font-size: 0.95rem;
}
```

**Reason:** Bottom sheet is modern mobile UX pattern, easier to close with gesture

---

## SUMMARY TABLE

| Component       | File                 | Change                  | Mobile | Desktop | Impact   |
| --------------- | -------------------- | ----------------------- | ------ | ------- | -------- |
| Stat Cards      | responsive.css       | Padding 14px→12px       | ✅     | -       | Critical |
| Stat Cards      | responsive.css       | Gap 12px→10px           | ✅     | -       | Critical |
| Admin Stats     | responsive.css       | Add container gap       | ✅     | -       | High     |
| Chart Height    | DashboardTab.jsx     | 180px→120px             | ✅     | -       | Critical |
| Table→Card      | AllOrdersDataTab.jsx | Mobile card layout      | ✅     | -       | Critical |
| Hero Padding    | Hero.css             | Reduce 140px            | -      | ✅      | Medium   |
| Hero Button Gap | Hero.css             | Increase gap            | ✅     | ✅      | Medium   |
| Top Nav         | responsive.css       | Add desktop media query | -      | ✅      | Medium   |
| Modal           | responsive.css       | Bottom sheet style      | ✅     | -       | High     |

---

**NEXT STEPS:** Implementation in priority order
