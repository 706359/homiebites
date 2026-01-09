# Current Month Orders Tab - Implementation Rules

## 📋 Overview

This document defines the exact specifications and rules for implementing Tab 3: Current Month Data according to CURRENT_MONTH_ENHANCEMENT_PLAN.md.

---

## 🎯 Layout Structure Rules

### Header Section

- **MUST** display: "Current Month: [Month Name] [Year]" (e.g., "Current Month: January 2025")
- **MUST** have [Add New Order] button aligned to the right
- **MUST** extract month name from current date dynamically

### Stats Row Rules

**MUST** display exactly 4 stat cards in a single row:

1. **This Month Revenue** - Total revenue for current month
2. **Total Orders** - Count of orders in current month
3. **Pending Payments** - Sum of unpaid orders amount
4. **vs Last Month** - Percentage change with trend indicator (↑/↓)

**Card Format:**

- Each card MUST show the main value prominently
- vs Last Month card MUST show:
  - Green color and ↑ icon if positive growth
  - Red color and ↓ icon if negative growth
  - Percentage formatted to 1 decimal place (e.g., +15.0%)

### Quick Filters Rules

**MUST** display filter buttons in this exact order:

1. **All** - Shows all orders (with count in parentheses)
2. **Today** - Shows today's orders (with count)
3. **Yesterday** - Shows yesterday's orders (with count)
4. **This Week** - Shows orders from start of week (with count)
5. **Pending** - Shows only pending/unpaid orders (with count)
6. **Paid** - Shows only paid orders (with count)

**Button States:**

- Active filter MUST be highlighted (btn-primary)
- Inactive filters MUST use btn-ghost
- Count MUST update dynamically based on filtered results
- Count MUST be displayed in parentheses: `[All (78)]`

---

## 📝 Add Order Form Rules

### Modal Structure

- **MUST** open as modal/drawer overlay
- **MUST** have close button (✕) in top right
- **MUST** prevent closing on outside click without warning if form has unsaved changes
- **MUST** display title: "Add New Order" (or "Edit Order" when editing)

### Form Fields (In Exact Order)

1. **Date\*** (Required)
   - Type: Date picker
   - Default: Today's date pre-filled
   - Icon: 📅
   - Format: DD/MM/YYYY (e.g., 15/01/2025)
   - Validation: Cannot select future date

2. **Delivery Address\*** (Required)
   - Type: Text input with autocomplete dropdown
   - Icon: 🏠
   - Label: "Recent: [Dropdown ▼]"
   - MUST show recent/frequent addresses in dropdown
   - MUST filter addresses as user types
   - MUST auto-fill unit price when address selected

3. **Quantity\*** (Required)
   - Type: Number input
   - Icon: 🔢
   - Default: 1
   - Validation: Must be > 0, max 50

4. **Unit Price\*** (Required)
   - Type: Number input with ₹ symbol
   - Icon: ₹
   - Default: Last used price for address (if available)
   - Validation: Must be > 0, max 1000

5. **Total Amount** (Auto-calculated, Read-only)
   - MUST display: "₹ [amount] 🔒 Auto"
   - MUST auto-calculate: Quantity × Unit Price
   - MUST update in real-time when quantity or unit price changes
   - MUST be locked/read-only (user cannot edit)

6. **Mode\*** (Required)
   - Type: Radio buttons
   - Options: ⚪ Lunch ⚪ Dinner
   - Default: Lunch (if time < 3 PM), else Dinner

7. **Status\*** (Required)
   - Type: Radio buttons
   - Options: ⚪ Paid ⚪ Pending
   - Default: Pending

8. **Payment Mode\*** (Required)
   - Type: Dropdown select
   - Options: Online, Cash, UPI
   - Default: Online

9. **Order ID** (Display only)
   - MUST display: "HB-[Month'Year]-[Day]-[SequenceNo]"
   - Example: "HB-Jan'25-15-000079"
   - MUST show "(Auto-generated)" label
   - Format: `HB-{MonthAbbr}'{YY}-{DD}-{6-digit-sequence}`

### Form Validation Rules

**Real-time Validation:**

- All required fields MUST show error messages below field if invalid
- Error messages MUST appear immediately on blur/change
- Form submission MUST be disabled if validation fails

**Field-Specific Rules:**

- `deliveryAddress`: Required, minLength: 3, pattern: `/^[A-Z0-9\-\/\s]+$/i`
- `quantity`: Required, min: 1, max: 50
- `unitPrice`: Required, min: 10, max: 1000
- `totalAmount`: MUST equal quantity × unitPrice (auto-validated)
- `date`: Cannot be future date

**Duplicate Detection:**

- MUST check if same address has order on same day
- If duplicate found, MUST show warning:
  ```
  ⚠️ Warning: [Address] already has an order today ([Mode])
  Do you want to add another order?
  [Yes, Add] [No, Cancel]
  ```

### Form Behavior Rules

**On Open:**

- Form MUST reset to default values
- Date MUST be pre-filled with today
- Mode MUST be smart-defaulted based on current time
- Status MUST default to "Pending"
- Payment Mode MUST default to "Online"

**On Save:**

- MUST show loading state: "[⏳ Saving...]"
- On success: Show "[✓ Order Added!]" for 2 seconds
- MUST reset form after successful save
- MUST close modal after successful save
- Table MUST auto-refresh with new order at top
- Newly added order MUST highlight in green for 3 seconds
- MUST auto-scroll to new row

**On Cancel/Close:**

- If form has unsaved changes, MUST show warning:
  ```
  You have unsaved changes. Are you sure you want to close?
  [Cancel] [Close Anyway]
  ```
- If no changes, close immediately

**Keyboard Shortcuts:**

- `Ctrl + N` - Open Add Order form
- `Ctrl + S` - Save order (when form open)
- `Esc` - Close form

---

## 🔢 OrderID Generation Rules

### Format Specification

**MUST** follow exact format: `HB-{MonthAbbr}'{YY}-{DD}-{SequenceNo}`

**Example:** `HB-Jan'25-15-000079`

**Components:**

1. **Prefix**: `HB-` (fixed)
2. **Month**: 3-letter abbreviation (Jan, Feb, Mar, etc.)
3. **Year**: 2-digit year (`'25` for 2025)
4. **Day**: 2-digit day (`15`)
5. **Sequence**: 6-digit zero-padded sequence number (`000079`)

### Generation Logic

- Sequence number MUST reset each day (starts at 000001)
- Sequence MUST increment for each order created on same day
- MUST check database for existing orders on same day
- Sequence MUST be: `(today's order count) + 1`
- MUST pad sequence to 6 digits with leading zeros

**Backend Implementation:**

```javascript
// Pseudo-code
const date = new Date(orderDate);
const month = date.toLocaleString("en-US", { month: "short" }); // "Jan"
const year = date.getFullYear().toString().slice(-2); // "25"
const day = date.getDate().toString().padStart(2, "0"); // "15"

// Get today's order count
const todayCount = await Order.countDocuments({
  date: { $gte: startOfDay, $lte: endOfDay },
});

const sequence = (todayCount + 1).toString().padStart(6, "0"); // "000079"
const orderId = `HB-${month}'${year}-${day}-${sequence}`;
```

---

## 🔄 Data Sync Rules

### Order Creation Flow

1. User fills form → Frontend validates
2. Form submitted → POST /api/orders/manual
3. Backend generates OrderID and saves
4. Backend returns saved order with all fields
5. Frontend adds to local state (optimistic update)
6. Table refreshes automatically
7. Stats cards update automatically
8. If error → Rollback + show error toast

### Auto-refresh Rules

- Table MUST refresh after order creation
- Stats cards MUST update immediately
- New order MUST appear at top of table
- Pagination MUST reset to page 1 if needed

---

## 🎨 UI/UX Rules

### Button States

**Add Order Button:**

- Normal: `[+ Add New Order]`
- Loading: `[⏳ Saving...]`
- Success: `[✓ Order Added!]` (2 seconds, then back to normal)

### Table Row Highlight

- Newly added order MUST highlight in green background
- Highlight MUST fade after 3 seconds
- MUST auto-scroll to new row if not visible

### Mobile Responsive Rules

- Form MUST be full-screen modal on mobile
- Fields MUST stack vertically (one per row)
- Buttons MUST be large and touch-friendly
- Date picker MUST be optimized for mobile
- Number inputs MUST show numeric keypad

---

## 🔌 API Endpoint Rules

### POST /api/orders/manual

**Request Body:**

```json
{
  "date": "2025-01-15",
  "deliveryAddress": "A3-1206",
  "quantity": 2,
  "unitPrice": 100,
  "totalAmount": 200,
  "mode": "Lunch",
  "status": "Pending",
  "paymentMode": "Online"
}
```

**Response:**

```json
{
  "success": true,
  "order": {
    "orderId": "HB-Jan'25-15-000079",
    "sNo": 79,
    "date": "2025-01-15",
    "deliveryAddress": "A3-1206",
    "quantity": 2,
    "unitPrice": 100,
    "totalAmount": 200,
    "mode": "Lunch",
    "status": "Pending",
    "paymentMode": "Online",
    "billingMonth": "Jan'25",
    "year": 2025,
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

**Backend MUST:**

- Auto-generate OrderID using specified format
- Auto-calculate totalAmount (quantity × unitPrice)
- Auto-set billingMonth and billingYear from date
- Auto-increment sNo (highest sNo + 1)
- Validate all required fields
- Return error if validation fails

---

## ✅ Validation Checklist

Before marking as complete, verify:

- [ ] Header shows "Current Month: [Month] [Year]"
- [ ] Stats row has exactly 4 cards
- [ ] vs Last Month card shows correct percentage and color
- [ ] Quick filters show correct counts in parentheses
- [ ] Add Order form has all fields in correct order
- [ ] Total Amount auto-calculates and is read-only
- [ ] OrderID displays in correct format
- [ ] Duplicate detection works
- [ ] Form validation works for all fields
- [ ] Keyboard shortcuts work (Ctrl+N, Ctrl+S, Esc)
- [ ] Mobile responsive design works
- [ ] Backend API generates OrderID correctly
- [ ] Table refreshes after order creation
- [ ] New order highlights in green

---

## 🚫 Forbidden Actions

**DO NOT:**

- Allow manual OrderID entry (must be auto-generated)
- Allow editing Total Amount (must be auto-calculated)
- Allow future dates
- Skip duplicate detection warning
- Skip form validation
- Use different OrderID format
- Show form without required field indicators (\*)
- Allow form submission with invalid data

---

## 📚 Related Files

- `admin/components/CurrentMonthOrdersTab.jsx` - Main component
- `admin/components/OrderModal.jsx` - Form modal component
- `backend/HomieBites/controllers/ordersController.js` - Backend controller
- `backend/HomieBites/models/Order.js` - Order model
- `backend/HomieBites/routes/orders.js` - API routes

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
