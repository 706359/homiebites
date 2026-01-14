# Dashboard Complete Checklist

## 📊 CALCULATIONS VERIFICATION

### Revenue Calculations
- [ ] **Total Revenue (Current Month)**
  - [ ] Uses `getTotalRevenue()` function correctly
  - [ ] Handles both `totalAmount` and `total` fields
  - [ ] Falls back to `quantity * unitPrice` when amount is missing
  - [ ] Returns 0 for invalid/null amounts
  - [ ] Format: ₹ symbol with Indian number format (no decimals)

- [ ] **Today's Revenue**
  - [ ] Filters orders correctly for today (00:00:00 to 23:59:59)
  - [ ] Uses `parseOrderDate()` for date parsing
  - [ ] Handles timezone correctly
  - [ ] Shows ₹0 when no orders today

- [ ] **This Week Revenue**
  - [ ] Week starts from Sunday (or Monday based on locale)
  - [ ] Includes all days of current week
  - [ ] Date range calculation is correct

- [ ] **Month-over-Month Growth**
  - [ ] Formula: `((current - last) / last) * 100`
  - [ ] Handles division by zero (last month = 0)
  - [ ] Shows "New ↑" when last month was 0 and current > 0
  - [ ] Shows percentage with + or - sign
  - [ ] Displays ↑ for positive, ↓ for negative

- [ ] **Pending Payments**
  - [ ] Only includes orders with `isPendingStatus()` = true
  - [ ] Statuses: 'Pending', 'Unpaid', 'pending', 'unpaid'
  - [ ] Sums all pending order amounts correctly
  - [ ] Shows count of pending orders
  - [ ] Handles missing/null amounts gracefully

### Order Count Calculations
- [ ] **Total Orders (Current Month)**
  - [ ] Counts all orders in current month
  - [ ] Uses `getFilteredOrdersByDate(orders, 'month', '', '')`
  - [ ] Excludes cancelled orders if needed

- [ ] **Today's Orders**
  - [ ] Count matches filtered orders for today
  - [ ] Updates correctly at midnight

- [ ] **This Week Orders**
  - [ ] Count matches week date range
  - [ ] Includes all days from week start

- [ ] **Unique Customers**
  - [ ] Counts unique addresses correctly
  - [ ] Handles: `deliveryAddress`, `customerAddress`, `address`
  - [ ] Filters out empty/null addresses
  - [ ] Uses `Set` for uniqueness

### Profit Calculations
- [ ] **Profit Stats**
  - [ ] Uses `getProfitStats(revenue, 70, 30)` correctly
  - [ ] Expense percentage: 70% (default)
  - [ ] Profit margin: 30% (default)
  - [ ] Formula: `revenue - (revenue * 0.70) = profit`
  - [ ] Profit margin %: `(profit / revenue) * 100`
  - [ ] Handles zero revenue correctly

- [ ] **Average Order Value**
  - [ ] Formula: `totalRevenue / totalOrders`
  - [ ] Returns 0 when no orders
  - [ ] Rounds to nearest integer
  - [ ] Handles division by zero

### Date Calculations
- [ ] **Date Parsing**
  - [ ] Uses `parseOrderDate()` for all date operations
  - [ ] Handles formats: ISO, DD-MMM-YY, DD-MMM-YYYY
  - [ ] Never uses `createdAt` as fallback for order date
  - [ ] Returns null for invalid dates
  - [ ] Timezone handling is consistent

- [ ] **Month Filtering**
  - [ ] Current month: 1st day 00:00:00 to last day 23:59:59
  - [ ] Last month calculation handles year rollover (Dec → Jan)
  - [ ] Month boundaries are correct

- [ ] **Week Filtering**
  - [ ] Week start: Sunday 00:00:00 (or Monday based on locale)
  - [ ] Week end: Saturday 23:59:59 (or Sunday)
  - [ ] Includes current day

## 🎨 COLORS & THEME VERIFICATION

### Primary Colors
- [ ] **Green (Primary)**
  - [ ] Main: `#449031` (--primary-green)
  - [ ] Light: `#5ba84a` (--green-light)
  - [ ] Dark: `#357825` (--green-dark)
  - [ ] Hover: `#3d8329` (--green-hover)
  - [ ] Used in: Primary buttons, success states, revenue icons

- [ ] **Orange (Secondary)**
  - [ ] Main: `#c45c2d` (--primary-orange)
  - [ ] Light: `#d87045` (--orange-light)
  - [ ] Dark: `#a84a1f` (--orange-dark)
  - [ ] Hover: `#c65a35` (--orange-hover)
  - [ ] Used in: Secondary buttons, accent elements

### Status Colors
- [ ] **Success/Paid**
  - [ ] Color: `#449031` or `--success-green`
  - [ ] Icon: `fa-check-circle` with success color
  - [ ] Text: `.text-success` class
  - [ ] Used in: Paid status, success notifications

- [ ] **Warning/Pending**
  - [ ] Color: `#ff9800` or `--warning-orange`
  - [ ] Icon: `fa-exclamation-triangle` with warning color
  - [ ] Text: `.text-warning` class
  - [ ] Used in: Pending orders, warning states

- [ ] **Error/Danger**
  - [ ] Color: `#cc3333` or `--error-red`
  - [ ] Hover: `#dc2626` (--error-red-hover)
  - [ ] Used in: Delete buttons, error states

- [ ] **Info**
  - [ ] Color: `#2196f3` or `--info-blue`
  - [ ] Used in: Info notifications, informational elements

### Button Colors
- [ ] **Primary Button (`.btn-primary`)**
  - [ ] Background: `--primary-green` (#449031)
  - [ ] Hover: Darker green
  - [ ] Text: White
  - [ ] Shadow: Green shadow

- [ ] **Secondary Button (`.btn-secondary`)**
  - [ ] Background: `--primary-orange` (#c45c2d)
  - [ ] Hover: Darker orange
  - [ ] Text: White

- [ ] **Ghost Button (`.btn-ghost`)**
  - [ ] Background: Transparent
  - [ ] Border: Light gray
  - [ ] Hover: Light background
  - [ ] Text: Primary color

- [ ] **Special Buttons**
  - [ ] WhatsApp: `--whatsapp-green` (#25d366)
  - [ ] Danger: `--error-red` (#cc3333)
  - [ ] Admin: Uses CSS variables

### Stat Card Colors
- [ ] **Revenue Card**
  - [ ] Icon: `fa-rupee-sign` (default color)
  - [ ] Number: Large, bold
  - [ ] Subtitle: Growth percentage with arrow

- [ ] **Orders Card**
  - [ ] Icon: `fa-shopping-cart` with accent color
  - [ ] Number: Large, bold

- [ ] **Pending Card**
  - [ ] Icon: `fa-exclamation-triangle` with warning color
  - [ ] Number: Large, bold
  - [ ] Subtitle: Order count

- [ ] **Customers Card**
  - [ ] Icon: `fa-users` with accent color
  - [ ] Number: Large, bold

## 📏 SPACING VERIFICATION

### Card Spacing
- [ ] **Stat Cards**
  - [ ] Padding: `var(--admin-space-xl, 32px)` on desktop
  - [ ] Padding: `var(--admin-space-lg, 24px)` on tablet
  - [ ] Padding: `var(--admin-space-md, 16px)` on mobile
  - [ ] Gap between cards: `var(--admin-space-lg, 24px)` desktop
  - [ ] Gap between cards: `var(--admin-space-md, 16px)` tablet/mobile
  - [ ] Border radius: `12px` desktop, `10px` tablet, `8px` mobile

- [ ] **Dashboard Cards**
  - [ ] Padding: `var(--admin-space-xl, 32px)` desktop
  - [ ] Padding: `var(--admin-space-lg, 24px)` tablet
  - [ ] Padding: `var(--admin-space-md, 16px)` mobile
  - [ ] Margin bottom: `var(--admin-space-lg, 24px)`
  - [ ] `.dashboard-card-spaced`: Extra padding

### Button Spacing
- [ ] **Button Sizes**
  - [ ] `.btn-small`: Padding `8px 16px`, font-size `14px`
  - [ ] `.btn` (default): Padding `12px 24px`, font-size `16px`
  - [ ] `.btn-large`: Padding `16px 32px`, font-size `18px`
  - [ ] Icon spacing: `mr-6` (6px margin-right) for icons

- [ ] **Button Groups**
  - [ ] Gap between buttons: `gap-8` (8px)
  - [ ] Filter buttons: `gap-8` with `flex-wrap`
  - [ ] Action buttons: Proper spacing in groups

### Form Spacing
- [ ] **Input Fields**
  - [ ] Padding: `12px 16px` desktop
  - [ ] Padding: `14px 16px` mobile (min-height 48px)
  - [ ] Margin bottom: `var(--admin-space-md, 16px)`
  - [ ] Border radius: `8px`

- [ ] **Form Groups**
  - [ ] Gap in form grid: `var(--admin-space-lg, 24px)` desktop
  - [ ] Gap in form grid: `var(--admin-space-md, 16px)` mobile
  - [ ] Label margin bottom: `8px`

### Filter Bar Spacing
- [ ] **Filter Bar**
  - [ ] Padding: `var(--admin-space-md, 16px)`
  - [ ] Margin bottom: `mb-12` (12px) or `mb-16` (16px)
  - [ ] Gap between elements: `gap-8` (8px)
  - [ ] Search input: Proper spacing from buttons

### Table Spacing
- [ ] **Table Cells**
  - [ ] Padding: `12px 16px` desktop
  - [ ] Padding: `10px 12px` mobile
  - [ ] Row gap: Proper spacing between rows

- [ ] **Pagination**
  - [ ] Margin top: `var(--admin-space-lg, 24px)`
  - [ ] Gap between controls: `gap-8` (8px)
  - [ ] Button spacing: Consistent

## 📐 SIZING VERIFICATION

### Font Sizes
- [ ] **Headings**
  - [ ] H1: `var(--admin-font-size-h1)` = `calc(16px * 1.75)` = `28px`
  - [ ] H2: `var(--admin-font-size-h2)` = `calc(16px * 1.375)` = `22px`
  - [ ] H3: `var(--admin-font-size-h3)` = `calc(16px * 1.125)` = `18px`
  - [ ] H4: `var(--admin-font-size-h4)` = `16px`

- [ ] **Body Text**
  - [ ] Body Large: `calc(16px * 0.9375)` = `15px`
  - [ ] Body Default: `calc(16px * 0.875)` = `14px`
  - [ ] Body Small: `calc(16px * 0.8125)` = `13px`
  - [ ] Body XSmall: `calc(16px * 0.75)` = `12px`

- [ ] **Stat Card Numbers**
  - [ ] Large, bold (typically `2rem` or `32px`)
  - [ ] Proper line height for readability

- [ ] **Button Text**
  - [ ] Small: `14px`
  - [ ] Default: `16px`
  - [ ] Large: `18px`

### Icon Sizes
- [ ] **Stat Card Icons**
  - [ ] Size: `2rem` or `32px`
  - [ ] Proper alignment with text

- [ ] **Button Icons**
  - [ ] Size: `1rem` or `16px` (matches button text)
  - [ ] Margin right: `6px` (`.mr-6`)

- [ ] **Table Icons**
  - [ ] Size: `14px` or `16px`
  - [ ] Proper spacing

### Card/Container Sizes
- [ ] **Stat Cards**
  - [ ] Min-width: `280px` desktop
  - [ ] Min-width: `240px` tablet
  - [ ] Full width on mobile
  - [ ] Grid: `repeat(auto-fit, minmax(280px, 1fr))`

- [ ] **Dashboard Cards**
  - [ ] Max-width: `1200px` (centered)
  - [ ] Full width on mobile
  - [ ] Responsive grid

- [ ] **Tables**
  - [ ] Full width container
  - [ ] Responsive: Horizontal scroll on mobile
  - [ ] Column widths: Auto or fixed as needed

### Border Radius
- [ ] **Cards**: `12px` desktop, `10px` tablet, `8px` mobile
- [ ] **Buttons**: `8px` (consistent)
- [ ] **Inputs**: `8px` (consistent)
- [ ] **Icons**: `50%` for circular icons

## 🎯 LAYOUT & STRUCTURE

### Grid Layout
- [ ] **Stat Cards Grid**
  - [ ] Desktop: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
  - [ ] Tablet: `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))`
  - [ ] Mobile: Single column
  - [ ] Gap: `24px` desktop, `16px` tablet/mobile

- [ ] **Form Grid**
  - [ ] Desktop: `grid-template-columns: repeat(2, 1fr)`
  - [ ] Tablet/Mobile: Single column
  - [ ] Gap: `24px` desktop, `16px` mobile

### Responsive Breakpoints
- [ ] **Mobile**: `< 481px`
  - [ ] Single column layouts
  - [ ] Reduced padding
  - [ ] Stacked elements

- [ ] **Tablet**: `481px - 1024px`
  - [ ] 2-column grids where appropriate
  - [ ] Medium padding
  - [ ] Adjusted font sizes

- [ ] **Desktop**: `≥ 1025px`
  - [ ] Multi-column grids
  - [ ] Full padding
  - [ ] Optimal spacing

### Alignment
- [ ] **Text Alignment**
  - [ ] Stat card numbers: Left aligned
  - [ ] Table headers: Left aligned
  - [ ] Table data: Left aligned (numbers can be right)
  - [ ] Buttons: Center aligned text

- [ ] **Vertical Alignment**
  - [ ] Icons aligned with text baseline
  - [ ] Buttons vertically centered
  - [ ] Form inputs aligned

## 🔍 FUNCTIONALITY VERIFICATION

### Filters
- [ ] **Quick Filters (Current Month Tab)**
  - [ ] "All" shows all current month orders
  - [ ] "Today" filters correctly (00:00:00 to 23:59:59)
  - [ ] "Yesterday" filters correctly
  - [ ] "This Week" filters correctly (Sunday to Saturday)
  - [ ] "Pending" shows only pending orders
  - [ ] "Paid" shows only paid orders
  - [ ] Filter counts update correctly
  - [ ] Active filter highlighted (`.btn-primary`)
  - [ ] Resets to page 1 when filter changes

- [ ] **Search Filter**
  - [ ] Searches by address
  - [ ] Searches by order ID
  - [ ] Case insensitive
  - [ ] Real-time filtering
  - [ ] Clears correctly
  - [ ] Works with quick filters

- [ ] **Date Filters**
  - [ ] Month filter works correctly
  - [ ] Custom date range works
  - [ ] Date parsing handles all formats
  - [ ] Timezone handled correctly

### Pagination
- [ ] **Pagination Controls**
  - [ ] Shows correct page numbers
  - [ ] "Previous" disabled on page 1
  - [ ] "Next" disabled on last page
  - [ ] Page numbers clickable
  - [ ] Current page highlighted
  - [ ] Records per page selector works (25, 50, 100)
  - [ ] Shows "X-Y of Z" correctly

### Data Display
- [ ] **Order Table**
  - [ ] All columns visible
  - [ ] Data formatted correctly (dates, currency)
  - [ ] Status badges show correct colors
  - [ ] Icons display correctly
  - [ ] Empty state shows when no orders
  - [ ] Loading state shows during fetch

- [ ] **Stats Cards**
  - [ ] Numbers formatted correctly (Indian format)
  - [ ] Currency shows ₹ symbol
  - [ ] Percentages show + or - sign
  - [ ] Growth arrows (↑ ↓) show correctly
  - [ ] Icons display correctly

### Modals
- [ ] **Order Modal**
  - [ ] Opens correctly
  - [ ] Pre-fills data when editing
  - [ ] Form validation works
  - [ ] Save button works
  - [ ] Cancel button closes modal
  - [ ] Auto-calculates total (quantity × price)

- [ ] **Confirmation Modal**
  - [ ] Shows correct message
  - [ ] Confirm button works
  - [ ] Cancel button closes
  - [ ] Danger type shows red styling

## 📱 RESPONSIVE DESIGN

### Mobile (< 481px)
- [ ] **Layout**
  - [ ] Single column for stat cards
  - [ ] Stacked filter buttons
  - [ ] Full-width search bar
  - [ ] Horizontal scroll for tables
  - [ ] Reduced padding

- [ ] **Touch Targets**
  - [ ] Buttons min-height: `48px`
  - [ ] Inputs min-height: `48px`
  - [ ] Adequate spacing between clickable elements

- [ ] **Typography**
  - [ ] Readable font sizes
  - [ ] Proper line height
  - [ ] No text overflow

### Tablet (481px - 1024px)
- [ ] **Layout**
  - [ ] 2-column grid for stat cards
  - [ ] Wrapped filter buttons
  - [ ] Responsive tables
  - [ ] Medium padding

### Desktop (≥ 1025px)
- [ ] **Layout**
  - [ ] Multi-column grids
  - [ ] Optimal spacing
  - [ ] Full feature set visible
  - [ ] Hover effects work

## 🎨 UI/UX ELEMENTS

### Loading States
- [ ] **PremiumLoader**
  - [ ] Shows during data fetch
  - [ ] Message is clear ("Loading orders...")
  - [ ] Size appropriate (`large` for full page)
  - [ ] Doesn't block interaction unnecessarily

### Empty States
- [ ] **EmptyState Component**
  - [ ] Shows when no orders match filters
  - [ ] Icon displays correctly
  - [ ] Message is helpful
  - [ ] Action button if applicable

### Error States
- [ ] **Error Handling**
  - [ ] Network errors show notification
  - [ ] Validation errors show inline
  - [ ] Error messages are clear
  - [ ] User can recover from errors

### Notifications
- [ ] **Notification System**
  - [ ] Success notifications (green)
  - [ ] Error notifications (red)
  - [ ] Warning notifications (orange)
  - [ ] Info notifications (blue)
  - [ ] Auto-dismiss after duration
  - [ ] Manual dismiss works

## 🔢 DATA ACCURACY

### Order Totals
- [ ] **Amount Calculation**
  - [ ] Uses `totalAmount` if available
  - [ ] Falls back to `total` if `totalAmount` missing
  - [ ] Calculates `quantity × unitPrice` if both missing
  - [ ] Handles null/undefined gracefully
  - [ ] Returns 0 for invalid values

### Date Accuracy
- [ ] **Date Parsing**
  - [ ] Never uses `createdAt` as order date
  - [ ] Uses `parseOrderDate()` consistently
  - [ ] Handles multiple date formats
  - [ ] Returns null for invalid dates
  - [ ] Timezone consistent

### Status Accuracy
- [ ] **Status Checking**
  - [ ] `isPendingStatus()` works correctly
  - [ ] `isPaidStatus()` works correctly
  - [ ] Case insensitive matching
  - [ ] Handles null/undefined status

### Count Accuracy
- [ ] **Order Counts**
  - [ ] Matches filtered array length
  - [ ] Updates when filters change
  - [ ] Excludes invalid orders

## 🧪 EDGE CASES

### Zero Data
- [ ] **No Orders**
  - [ ] Shows 0 for all stats
  - [ ] Empty state displays
  - [ ] No errors in console

### Invalid Data
- [ ] **Missing Fields**
  - [ ] Handles missing `totalAmount`
  - [ ] Handles missing `total`
  - [ ] Handles missing `quantity` or `unitPrice`
  - [ ] Handles missing dates
  - [ ] Handles missing addresses

### Boundary Conditions
- [ ] **Month Boundaries**
  - [ ] First day of month works
  - [ ] Last day of month works
  - [ ] Year rollover (Dec → Jan) works

- [ ] **Week Boundaries**
  - [ ] Sunday (week start) works
  - [ ] Saturday (week end) works

- [ ] **Division by Zero**
  - [ ] Average order value: 0 when no orders
  - [ ] Growth percentage: Handles last month = 0

## ✅ FINAL CHECKS

### Performance
- [ ] **Rendering**
  - [ ] No unnecessary re-renders
  - [ ] Memoization used where needed
  - [ ] Large lists use pagination

### Accessibility
- [ ] **Keyboard Navigation**
  - [ ] Tab order is logical
  - [ ] Enter/Space activates buttons
  - [ ] Focus visible

- [ ] **Screen Readers**
  - [ ] Alt text on images
  - [ ] ARIA labels where needed
  - [ ] Semantic HTML

### Browser Compatibility
- [ ] **Modern Browsers**
  - [ ] Chrome/Edge: Works
  - [ ] Firefox: Works
  - [ ] Safari: Works
  - [ ] Mobile browsers: Works

### Code Quality
- [ ] **No Console Errors**
  - [ ] No JavaScript errors
  - [ ] No React warnings
  - [ ] No linting errors

- [ ] **Consistency**
  - [ ] Uses utility functions consistently
  - [ ] Follows naming conventions
  - [ ] Code is maintainable

---

## 📝 Notes

- All calculations should use utility functions from `utils/calculations.js` and `utils/orderUtils.js`
- All date operations should use `parseOrderDate()` from `utils/dateUtils.js`
- All currency formatting should use `formatCurrency()` from `utils/orderUtils.js`
- All spacing should use CSS variables from `variables.css`
- All colors should use CSS variables from `variables.css` or theme variables
- Button system is locked - only use allowed button classes
- Responsive breakpoints: Mobile < 481px, Tablet 481-1024px, Desktop ≥ 1025px

---

**Last Updated**: 2025-01-13
**Version**: 1.0
