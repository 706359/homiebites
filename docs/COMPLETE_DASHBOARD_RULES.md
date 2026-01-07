# Complete Admin Dashboard - Implementation Rules

## 📋 Overview

This document defines the exact specifications and rules for implementing ALL tabs in the HomieBites Admin Dashboard according to CURRENT_MONTH_ENHANCEMENT_PLAN.md.

---

## 🎯 Tab 1: Dashboard (Home)

### Layout Structure Rules

#### Top Stats Cards (4 columns) - MUST display:

1. **Total Revenue** - Current month revenue
   - Value: ₹45,600
   - Subtitle: +12% ↑ (month-over-month growth)
2. **Total Orders** - Current month order count
   - Value: 234
   - Subtitle: +8% ↑ (month-over-month growth)
3. **Pending Payments** - Unpaid amount
   - Value: ₹2,400
   - Subtitle: 12 orders (count of pending orders)
4. **Total Customers** - Unique addresses
   - Value: 156
   - Subtitle: +5 new (new customers this month)

#### Secondary Stats Cards (4 columns) - MUST display:

1. **Today's Revenue** - Today's total revenue
   - Value: ₹1,800
   - Subtitle: 9 orders
2. **This Week Revenue** - Week's total revenue
   - Value: ₹8,500
   - Subtitle: 45 orders
3. **Avg Order Value** - Average order value
   - Value: ₹195
   - Subtitle: (no subtitle)
4. **Cancel Rate** - Cancellation percentage
   - Value: 2.5%
   - Subtitle: 6 orders (cancelled orders count)

#### Charts Section (2 columns) - MUST display:

1. **Revenue Trend (6 months)** - Line chart
   - Left column (two-thirds width)
   - Shows last 6 months revenue trend
2. **Orders by Mode** - Pie chart
   - Right column (one-third width)
   - Shows Lunch: 65%, Dinner: 35%
3. **Daily Orders This Month** - Area chart
   - Left column (two-thirds width)
   - Shows daily order count for current month
4. **Payment Mode Split** - Bar chart
   - Right column (one-third width)
   - Shows Online: 180, Cash: 40, UPI: 14

#### Recent Activity Table - MUST display:

- Table with columns: Date, Address, Quantity, Amount, Mode, Status
- Shows last 10 orders
- Has "[View All Orders →]" link at bottom

#### Quick Actions Panel - MUST display:

- [+ Add New Order] button
- [📤 Export Data] button
- [💰 Pending Payments] button
- [📊 Generate Report] button

### API Endpoints Required:

- GET /api/dashboard/stats
- GET /api/dashboard/charts/revenue-trend
- GET /api/dashboard/charts/orders-by-mode
- GET /api/dashboard/recent-orders

---

## 🎯 Tab 2: All Orders Data

### Layout Rules

#### Top Action Bar - MUST display:

- [🔍 Search orders...] - Search input
- [📤 Upload CSV] - Upload button
- [➕ Add Order] - Add order button
- [🗑️ Delete All] - Delete all button (with confirmation)
- [📥 Export] - Export button

#### Filters Panel (Collapsible) - MUST include:

- Date Range: [From] [To] date pickers
- Status: [All ▼] dropdown
- Mode: [All ▼] dropdown
- Payment: [All ▼] dropdown
- Month: [All ▼] dropdown
- Year: [All ▼] dropdown
- Address: [Search...] input
- [Clear All] button

#### Active Filters Display - MUST show:

- Chips for each active filter: [Status: Paid ✕] [Mode: Lunch ✕] [Date: Jan 2025 ✕]
- Click ✕ to remove filter

#### Data Table - MUST include:

- Checkbox column for selection
- Columns: S.No, Date, Address, Qty, Price, Total, Mode, Status, Payment, Month, Year, OrderID, Actions
- "Select All" checkbox in header
- "Showing 1-25 of 234 orders" text
- Pagination controls
- "Show: [25 ▼] per page" selector

#### Bulk Actions Bar - MUST appear when rows selected:

- Shows "[12 selected]" count
- [Mark as Paid] button
- [Mark as Pending] button
- [Delete Selected] button
- [Export Selected] button

#### Table Features - MUST support:

- Click column headers to sort (↑↓ indicators)
- Double-click row to open edit modal
- Right-click for context menu
- Drag column borders to resize
- Sticky header on scroll

### API Endpoints Required:

- GET /api/orders?page=1&limit=25&status=Paid&search=A3
- POST /api/orders/bulk-delete
- PUT /api/orders/bulk-update
- GET /api/orders/export?filters=...

---

## 🎯 Tab 3: Current Month Data

### Layout Rules

#### Header - MUST display:

- "Current Month: [Month Name] [Year]" (e.g., "Current Month: January 2025")
- [Add New Order] button aligned right

#### Stats Row - MUST display 4 cards:

1. **This Month Revenue** - ₹15,600
2. **Total Orders** - 78
3. **Pending Payments** - ₹1,200
4. **vs Last Month** - +15% ↑ (with color-coded trend)

#### Quick Filters - MUST display:

- [All (78)] - Shows count in parentheses
- [Today (9)] - Shows today's count
- [Yesterday (8)] - Shows yesterday's count
- [This Week (45)] - Shows this week's count
- [Pending (6)] - Shows pending count
- [Paid (72)] - Shows paid count

#### Add Order Form - See OrderModal rules below

#### Data Table - Same as All Orders but filtered to current month

### API Endpoints Required:

- GET /api/orders/current-month
- POST /api/orders/manual (for adding new order)
- GET /api/orders/stats/current-month
- GET /api/orders/addresses/recent (for autocomplete)

---

## 🎯 Tab 4: Analytics

### Layout Rules

#### Time Period Selector - MUST display:

- [This Month ▼] dropdown
- [This Year ▼] dropdown
- [Custom Range] button

#### Key Metrics Grid - MUST display 4 cards:

1. **Total Revenue** - ₹145,600
2. **Growth Rate** - +12.5%
3. **Retention Rate** - 85%
4. **Churn Rate** - 15%

#### Charts Section - MUST include:

1. **Monthly Revenue Trend (Last 12M)** - Line chart with data points
   - Shows peak: ₹18,500 (Dec 2024)
2. **Top 10 Delivery Areas** - Horizontal bar chart
   - Shows: 1. A3-1206 ₹12,400 (62 orders), 2. B2-405 ₹8,900 (45 orders)
3. **Orders by Day** - Bar chart (Mon: 45, Tue: 38, etc.)
4. **Orders by Hour** - Heatmap (11AM-1PM: Peak, 6PM-8PM: Peak)
5. **Order Frequency Distribution** - Scatter plot
   - Shows: One-time: 45, Regular (>5): 30, VIP (>20): 8
6. **Payment Mode Trends** - Stacked area chart
   - Shows: Online growing 📈, Cash declining 📉

#### Downloadable Reports - MUST display:

- [📄 Monthly Summary] button
- [📊 Quarterly Report] button
- [📈 Annual Report] button

### API Endpoints Required:

- GET /api/analytics/revenue-trend?period=12months
- GET /api/analytics/top-areas
- GET /api/analytics/order-patterns
- GET /api/analytics/customer-behavior
- GET /api/analytics/payment-trends

---

## 🎯 Tab 5: Customers

### Layout Rules

#### Header - MUST display:

- "Total Customers: 156"
- [➕ Add Customer] button
- [📤 Export List] button

#### Search & Filter - MUST include:

- [🔍 Search by address...] input
- [Active ▼] dropdown filter
- [Sort by: Total Spent ▼] dropdown

#### Customer Cards Grid - MUST display:

- Grid layout (2 columns)
- Each card shows:
  - Address (e.g., A3-1206)
  - Customer type badge (👤 Regular Customer / 👤 VIP Customer)
  - Total Orders: 28
  - Total Spent: ₹5,600
  - Avg Order: ₹200
  - Last Order: 2 days ago
  - Preferred: Lunch
  - [View Orders] button
  - [Contact] button

#### Customer Details Modal - MUST show on click:

- Status: 🟢 Active
- Customer Since: Feb 2024
- Total Orders: 28
- Total Spent: ₹5,600
- Average Order Value: ₹200
- Preferred Mode: Lunch (75%)
- Payment Mode: Online (90%)
- Last Order: 2 days ago
- Order History (Last 10) table
- [View All Orders] button
- [Send Message] button

#### Customer Segments - MUST display:

- 🌟 VIP (>20 orders): 8 customers
- 📈 Regular (5-20): 30 customers
- 🆕 New (<5 orders): 118 customers

#### Inactive Customers Alert - MUST display:

- "⚠️ 12 customers haven't ordered in 30+ days"
- [View List] button
- [Send Win-back Message] button

### API Endpoints Required:

- GET /api/customers?search=A3&sort=total_spent
- GET /api/customers/:address/details
- GET /api/customers/:address/orders
- GET /api/customers/segments
- GET /api/customers/inactive

---

## 🎯 Tab 6: Reports

### Layout Rules

#### Report Types Grid - MUST display:

- 6 report type cards in 2x3 grid:
  1. 📊 Sales Report [Generate]
  2. 💰 Payment Report [Generate]
  3. 📅 Monthly Statement [Generate]
  4. 🏠 Area-wise Report [Generate]
  5. 👥 Customer Report [Generate]
  6. 📈 Growth Report [Generate]

#### Report Generator - MUST include:

- Report Type: [Sales Report ▼] dropdown
- Date Range: [From] [To] date pickers
- Filters checkboxes:
  - ☑️ Include Charts
  - ☑️ Include Summary
  - ☐ Group by Area
  - ☐ Group by Mode
- Format: ⚪ PDF ⚪ Excel ⚪ CSV radio buttons
- [📄 Preview] button
- [📥 Download] button

#### Scheduled Reports Table - MUST display:

- Columns: Report, Schedule, Format, Action
- Rows show scheduled reports with edit/delete buttons
- [➕ Add Scheduled Report] button

#### Report History Table - MUST display:

- Columns: Date, Report Type, Period, Download
- Shows last 30 days of reports
- Download button for each report

### API Endpoints Required:

- POST /api/reports/generate
- GET /api/reports/templates
- GET /api/reports/history
- POST /api/reports/schedule
- DELETE /api/reports/schedule/:id

---

## 🎯 Tab 7: Payment Management

### Layout Rules

#### Summary Cards - MUST display 4 cards:

1. **Total Paid** - ₹143,200 (222 orders)
2. **Pending** - ₹2,400 (12 orders)
3. **Overdue** - ₹800 (4 orders)
4. **This Month** - ₹15,600 (78 orders)

#### Pending Payments Table - MUST display:

- Columns: Date, Address, Amount, Days Pending, Order ID, Action
- Shows urgent indicator (⚠️) for >5 days
- [Remind] button for each row
- [Mark All as Paid] button
- [Send Bulk Reminder] button

#### Payment Timeline Chart - MUST display:

- Area chart showing daily collection (30 days)
- Shows "Avg collection time: 2.3 days"

#### Payment Mode Performance - MUST display:

- Donut chart showing:
  - Online: 76% (₹108,832)
  - Cash: 20% (₹28,640)
  - UPI: 4% (₹5,728)

#### Send Reminder Modal - MUST include:

- To: [Address]
- Amount: ₹[amount]
- Order: [OrderID]
- Message Template: [Friendly Reminder ▼] dropdown
- Message preview text
- Send via checkboxes: ☑️ SMS ☑️ WhatsApp ☐ Email
- [Cancel] [📤 Send] buttons

### API Endpoints Required:

- GET /api/payments/pending
- GET /api/payments/overdue
- POST /api/payments/mark-paid/:orderId
- POST /api/payments/send-reminder
- GET /api/payments/stats

---

## 🎯 Tab 8: Settings

### Layout Rules - Tabs within Settings

#### Tab 8.1: General Settings

**Business Information Section:**

- Business Name: [Input]
- Contact: [Input]
- Email: [Input]
- Address: [Input]
- [💾 Save Changes] button

**Pricing Configuration Section:**

- Default Unit Price: [₹ Input]
- Lunch Price: [₹ Input]
- Dinner Price: [₹ Input]
- Minimum Order Qty: [Input]
- [💾 Update Pricing] button

#### Tab 8.2: Order Settings

- Order ID Prefix: [HB-] input
- Auto-generate Order ID: ☑️ checkbox
- Allow Duplicate Address: ☑️ checkbox
- Require Payment Confirmation: ☐ checkbox
- Status Options list with [➕ Add Status] button
- [💾 Save Settings] button

#### Tab 8.3: Notifications

- Email Notifications checkboxes
- SMS Notifications checkboxes
- [💾 Save Preferences] button

#### Tab 8.4: Data Management

- Last Backup: [Date/Time] display
- [💾 Backup Now] button
- [📥 Download Backup] button
- [♻️ Restore from Backup] button
- Auto Backup: ☑️ Daily at [Time] selector
- ⚠️ Danger Zone section
- [🗑️ Clear All Data] button (with confirmation)

#### Tab 8.5: User Profile

- Name: [Input]
- Email: [Input]
- Phone: [Input]
- Change Password section:
  - Current Password: [Input]
  - New Password: [Input]
  - Confirm Password: [Input]
- [💾 Update Profile] button

#### Tab 8.6: Theme Settings

- Theme: ⚪ Light ⚪ Dark ⚪ Auto radio buttons
- Primary Color: [🎨 Color picker]
- Font Size: [Medium ▼] dropdown
- [💾 Apply Theme] button

### API Endpoints Required:

- GET /api/settings
- PUT /api/settings/business
- PUT /api/settings/pricing
- PUT /api/settings/notifications
- POST /api/settings/backup
- POST /api/settings/restore
- PUT /api/user/profile
- PUT /api/user/password

---

## 🎯 Tab 9: Notifications

### Layout Rules

#### Header - MUST display:

- "Notifications (8 unread)"
- [Mark All as Read] button
- [⚙️ Settings] button

#### Filter Tabs - MUST display:

- [All (45)] tab
- [Unread (8)] tab
- [Payments (12)] tab
- [Orders (25)] tab
- [System (8)] tab

#### Notification List - MUST display:

- Each notification shows:
  - Icon (🔴 for unread, ⚪ for read)
  - Title and timestamp
  - Description/details
  - Action buttons (if applicable)
- Types:
  - New Order Received
  - Payment Overdue
  - Daily Summary Generated
  - Low Order Day Warning

#### Notification Settings Modal - MUST include:

- Notify me about checkboxes
- Delivery method checkboxes (In-app, Email, SMS)
- [Cancel] [💾 Save] buttons

### API Endpoints Required:

- GET /api/notifications?filter=unread
- PUT /api/notifications/:id/read
- PUT /api/notifications/mark-all-read
- GET /api/notifications/settings
- PUT /api/notifications/settings

---

## 🌐 Global Features (All Tabs)

### Top Navigation Bar - MUST display:

- [☰] Menu toggle
- "HomieBites Admin" title
- [🔍 Search...] global search
- [🔔 8] notification bell with count
- [👤] user profile dropdown

### Sidebar Navigation - MUST display:

- 📊 Dashboard
- 📋 All Orders
- 📅 Current Month
- 📈 Analytics
- 👥 Customers
- 📄 Reports
- 💰 Payments (or Pending Amounts)
- 🔔 Notifications
- ⚙️ Settings
- [🚪 Logout] button at bottom

### Global Search (Ctrl+K) - MUST include:

- Search input: "🔍 Search everywhere..."
- Recent Searches section
- Quick Actions section
- Opens as modal/overlay

### Loading States - MUST display:

- Skeleton UI with shimmer effect
- "⏳ Loading orders..." message

### Empty States - MUST display:

- Icon (📦)
- "No orders found" message
- "Try adjusting your filters" suggestion
- [Clear Filters] button
- [Add Order] button

### Error States - MUST display:

- Icon (⚠️)
- "Something went wrong" message
- [Try Again] button
- [Contact Support] button

---

## 📝 OrderModal Form Rules (Used in Multiple Tabs)

### Form Structure - MUST follow exact order:

1. **Date\*** - Date picker with 📅 icon, default: Today
2. **Delivery Address\*** - Text input with 🏠 icon, autocomplete dropdown
3. **Quantity\*** - Number input with 🔢 icon, min: 1, max: 50
4. **Unit Price\*** - Number input with ₹ icon, min: 10, max: 1000
5. **Total Amount** - Read-only, shows "🔒 Auto", auto-calculated
6. **Mode\*** - Radio buttons: ⚪ Lunch ⚪ Dinner
7. **Status\*** - Radio buttons: ⚪ Paid ⚪ Pending
8. **Payment Mode\*** - Dropdown: Online, Cash, UPI
9. **Order ID** - Display only, format: HB-Jan'25-15-XXXXXX, shows "(Auto-generated)"

### Validation Rules:

- Real-time validation with error messages below fields
- Date: Cannot be future date
- Address: Min 3 chars, pattern: `/^[A-Z0-9\-\/\s]+$/i`
- Quantity: 1-50 range
- Unit Price: ₹10-₹1000 range
- Total Amount: Auto-validated
- All required fields marked with \*

### Duplicate Detection:

- Checks same address on same day
- Shows warning with confirmation dialog

### Smart Defaults:

- Date: Today
- Mode: Lunch (if time < 3 PM), else Dinner
- Status: Pending
- Payment Mode: Online

### Keyboard Shortcuts:

- Ctrl+S / Cmd+S: Save order
- Esc: Close form

---

## 🚫 Forbidden Actions

**DO NOT:**

- Skip validation on any form
- Allow future dates in date pickers
- Allow manual OrderID entry (must be auto-generated)
- Allow editing Total Amount (must be auto-calculated)
- Skip duplicate detection warnings
- Use different OrderID format than specified
- Skip loading/empty/error states
- Use inline styles for colors (use CSS variables)
- Create new button variants (follow 5-button system)

---

## ✅ Validation Checklist

Before marking any tab as complete:

- [ ] All required stats cards display correctly
- [ ] All charts render properly
- [ ] All filters work correctly
- [ ] All tables have proper pagination
- [ ] All forms have validation
- [ ] All modals open/close correctly
- [ ] All API endpoints are implemented
- [ ] Loading states work
- [ ] Empty states work
- [ ] Error states work
- [ ] Mobile responsive design works
- [ ] Keyboard shortcuts work
- [ ] Export functionality works

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
**Coverage:** All 9 Tabs + Global Features
