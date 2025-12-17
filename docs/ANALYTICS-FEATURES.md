# Analytics Features in Admin Dashboard

## Overview

The Admin Dashboard now includes comprehensive analytics features that match your Google Sheets data structure.

## Table Structure

Your Google Sheet "TIFFIN DATA 2025" should have these headers:

| S No. | Date | Delivery Address | Qty. | Unit Price | Total Amount | Status | Payment Mode | Billing Month | Reference Month | Elapsed Days | Year |
|-------|------|------------------|------|------------|--------------|--------|--------------|---------------|-----------------|--------------|------|

## Analytics Features

### 1. Monthly Breakdown by Address

Shows monthly totals for each delivery address across all 12 months of 2025.

**Features:**
- Monthly columns: 01-Jan'25, 02-Feb'25, ... 12-Dec'25
- Grand Total column for each address
- Sorted by Grand Total (highest first)
- Empty cells for months with no orders

**How it works:**
- Parses `Billing Month` or `Reference Month` to determine the month
- Groups orders by delivery address
- Sums `Total Amount` for each month

### 2. Top 25 Addresses

Displays the top 25 delivery addresses by total order amount.

**Features:**
- Ranked list (1-25)
- Delivery address
- Grand Total amount
- Sorted by total amount (descending)

### 3. Unpaid Amounts by Address

Shows unpaid orders grouped by delivery address.

**Features:**
- Delivery Address
- Unpaid amount (orders with status ≠ "Paid" or "Delivered")
- Grand Total (all orders for that address)
- Grand Total row at bottom
- Sorted by unpaid amount (highest first)

**Status Logic:**
- Unpaid: Status is NOT "paid" or "delivered"
- Includes: "pending", "confirmed", "preparing", "cancelled", etc.

### 4. Yearly Comparison (2024 vs 2025)

Compares order totals between 2024 and 2025 for each address.

**Features:**
- Delivery Address
- 2024 total
- 2025 total
- Grand Total (2024 + 2025)
- Trend indicator:
  - ▲ (up arrow) = 2025 > 2024
  - ▼ (down arrow) = 2025 < 2024
  - - (dash) = 2025 = 2024
- Gap column (2025 - 2024)
  - Green for positive
  - Red for negative

**How it works:**
- Uses `Year` column from orders
- Groups by delivery address
- Calculates totals for each year
- Determines trend based on comparison

## Accessing Analytics

1. **Login to Admin Dashboard:**
   - Go to: `http://localhost:5173/admin`
   - Username: `adminHomieBites`
   - Password: `Bless@@##12$$`

2. **Navigate to Analytics:**
   - Click "Analytics" in the left sidebar
   - Or use the sidebar menu

3. **View Reports:**
   - Scroll down to see all analytics sections
   - Each section updates automatically when orders are synced

## Data Sync

### Sync from Google Sheets

1. Go to **Orders** tab in admin dashboard
2. Click **"Sync from Sheets"**
3. All orders from "TIFFIN DATA 2025" sheet will be imported
4. Analytics will update automatically

### Auto-Sync

- New orders from website/app automatically sync to Google Sheets
- Analytics recalculate in real-time

## Notes

- **Empty cells** in monthly breakdown indicate no orders for that month
- **Unpaid** includes all non-paid/non-delivered orders
- **Yearly comparison** only shows addresses with data in 2024 or 2025
- **Top 25** shows exactly 25 addresses (or fewer if less than 25 exist)
- All amounts are in ₹ (Indian Rupees)

## Troubleshooting

**"No data" in analytics:**
- Make sure orders are synced from Google Sheets
- Check that orders have proper `Delivery Address` values
- Verify `Status` and `Year` columns are populated

**Monthly breakdown empty:**
- Check `Billing Month` or `Reference Month` format
- Should be like: "01 - Jan'25" or "2(Feb'24)"
- Or ensure `Date` column is in DD/MM/YYYY format

**Yearly comparison not working:**
- Verify `Year` column has values "2024" or "2025"
- Check that orders have valid year data

## Future Enhancements

- Export analytics to Excel/CSV
- Filter by date range
- Search addresses
- Print reports
- Email reports

