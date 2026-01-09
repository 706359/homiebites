# Excel Date Format Guide for HomieBites

## ✅ RECOMMENDED Date Formats

### **Best Option: YYYY-MM-DD (ISO Format)**
Format your Date column in Excel as: **YYYY-MM-DD**

**Examples:**
- `2025-01-15` (January 15, 2025)
- `2024-02-05` (February 5, 2024)
- `2024-03-10` (March 10, 2024)

**How to set this in Excel:**
1. Select the Date column
2. Right-click → Format Cells
3. Choose "Custom" category
4. Enter format: `yyyy-mm-dd`
5. Click OK

### **Alternative: Excel Date Cell Type**
1. Select the Date column
2. Right-click → Format Cells
3. Choose "Date" category
4. Select any date format (e.g., "3/14/2012" or "14-Mar-2012")
5. Excel will automatically convert it to a proper date

## ✅ Other Supported Formats

The system also supports these formats (but YYYY-MM-DD is most reliable):

- **DD-MMM-YYYY**: `15-Jan-2025`, `5-Feb-2024`
- **DD/MM/YYYY**: `15/01/2025`, `05/02/2024`
- **MM/DD/YYYY**: `01/15/2025`, `02/05/2024`
- **DD-MM-YYYY**: `15-01-2025`, `05-02-2024`

## ❌ Common Issues

### Problem: Dates showing as today's date
**Solution:** Make sure your Date column is formatted as a Date type in Excel, not as Text.

### Problem: Dates showing as numbers (like 45320)
**Solution:** This is Excel's serial number format. Format the cell as Date type in Excel.

### Problem: Wrong dates (month/day swapped)
**Solution:** Use YYYY-MM-DD format to avoid ambiguity.

## 📋 Sample Excel Template

```
Order ID    | Date       | Delivery Address | Quantity | Unit Price | Mode   | Status | Payment Mode
------------|------------|------------------|----------|------------|--------|--------|-------------
HB-Jan'25-15-000001 | 2025-01-15 | A3-1206        | 2        | 100        | Lunch  | Paid   | Online
HB-Jan'25-15-000002 | 2025-01-20 | B2-405         | 3        | 100        | Dinner | Pending| Cash
HB-Jan'25-14-000001 | 2024-02-05 | C1-789         | 2        | 100        | Lunch  | Paid   | UPI
```

## 🔍 Quick Check

Before uploading, verify:
1. ✅ Date column is formatted as Date type (not Text)
2. ✅ Dates are in YYYY-MM-DD format (recommended)
3. ✅ No dates are showing as numbers
4. ✅ Dates are reasonable (between 2000-2100)

## 💡 Pro Tip

**Easiest method:** 
1. Type dates in Excel as: `2025-01-15` (with dashes)
2. Excel will recognize it as a date
3. Format the column as Date if needed
4. Upload - it will work perfectly!

