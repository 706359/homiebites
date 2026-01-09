# Master Orders Model Implementation Plan

## 🎯 Goal

Implement a clean, single-source-of-truth orders model that eliminates derived data storage and ensures all tabs read from one master table.

## 📋 Current Issues

- ❌ Derived fields stored (S No., Total Amount, Billing Month, Reference Month, Year)
- ❌ Potential for data inconsistency
- ❌ Duplicate data storage
- ❌ Manual entry of calculated fields

## ✅ Target Model

### Master Orders Table Structure

```sql
orders
------
id (PK, auto-increment)
order_date (DATE) - Required
delivery_address (TEXT) - Required
quantity (INT) - Required, default 1
unit_price (DECIMAL) - Required
total_amount (DECIMAL) - AUTO-CALCULATED (quantity * unit_price)
status (ENUM: Paid / Unpaid / Pending / Delivered) - Required
payment_mode (ENUM: Cash / Online / UPI / Card) - Required
billing_month (INT) - AUTO-CALCULATED from order_date
billing_year (INT) - AUTO-CALCULATED from order_date
source (ENUM: excel / manual) - Required
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Composite Unique Key

- `(order_date, delivery_address)` - Prevents duplicates

## 🔄 Implementation Steps

### Phase 1: Data Model Updates

1. ✅ Create `orderUtils.js` helper functions for:
   - `calculateTotalAmount(quantity, unitPrice)`
   - `extractBillingMonth(orderDate)`
   - `extractBillingYear(orderDate)`
   - `formatBillingMonth(month, year)` - for display only
   - `formatReferenceMonth(month, year)` - for display only

2. ✅ Update order creation logic:
   - Remove manual `totalAmount` input
   - Auto-calculate `totalAmount` on save
   - Auto-calculate `billing_month` and `billing_year` from `order_date`
   - Never store `billingMonth` or `referenceMonth` as strings

### Phase 2: Excel Upload Logic

1. ✅ Update `convertExcelToOrders()` to:
   - Parse date correctly
   - Extract only: date, address, quantity, unit_price, status, payment_mode
   - Calculate derived fields (total_amount, billing_month, billing_year)
   - Set `source = 'excel'`

2. ✅ Implement smart update/insert logic:
   - Use `(order_date + delivery_address)` as composite key
   - If exists → UPDATE
   - If not → INSERT
   - Never DELETE old data
   - Show preview before save (new/updated/invalid)

### Phase 3: Order Entry Form

1. ✅ Simplify form fields:
   - Date (default: today)
   - Delivery Address (with autocomplete)
   - Quantity (default: 1)
   - Unit Price (auto-fill from last order for same address)
   - Total Amount (read-only, auto-calculated)
   - Status (dropdown)
   - Payment Mode (dropdown)

2. ✅ Add smart suggestions:
   - Address autocomplete from previous orders
   - Unit price auto-fill from last order for same address
   - Keyboard-friendly navigation

### Phase 4: Display Updates

1. ✅ Update All Orders Data tab:
   - Show: Date | Address | Qty | Unit Price | Total | Status | Payment Mode
   - Hide: billing_month, billing_year, source (backend only)
   - Calculate S No. on display (UI only)

2. ✅ Update all other tabs to read from master orders:
   - Stats tabs calculate from orders table
   - Summary reports derive from orders
   - No separate tables needed

### Phase 5: Edit Functionality

1. ✅ Edit mode:
   - Click row → opens same form in edit mode
   - Save → updates same record (no duplicates)
   - Stats auto-refresh

## 🚫 Hard Rules (DO NOT BREAK)

1. ✅ All stats read from `orders` table only
2. ✅ Excel + manual entries go through same logic
3. ✅ Derived fields NEVER entered manually
4. ✅ No duplicate order rows (enforced by composite key)
5. ✅ No hard delete (soft delete or archive only)

## 📊 Files to Update

1. `admin/utils/orderUtils.js` - Add calculation helpers
2. `admin/utils/excelUtils.js` - Update conversion logic
3. `admin/AdminDashboard.jsx` - Update form and save logic
4. `admin/components/OrdersTab.jsx` - Update display columns
5. Backend API (if exists) - Update schema

## 🧪 Testing Checklist

- [ ] New order entry calculates total correctly
- [ ] Excel upload updates existing orders
- [ ] Excel upload creates new orders
- [ ] Address autocomplete works
- [ ] Unit price auto-fill works
- [ ] Edit updates same record (no duplicates)
- [ ] All stats tabs show correct data
- [ ] Derived fields never stored
- [ ] Composite key prevents duplicates
