# Old Data Conversion Guide

**Date**: 2025-01-27  
**Status**: ✅ **Converter Script Created**

---

## Overview

Your old order data is stored in `docs/old data.md` as space-separated text. This guide explains how to convert it to Excel format for import into the Admin Dashboard.

---

## Data Format

**File**: `docs/old data.md`  
**Format**: Space-separated text  
**Records**: ~2,790 orders  
**Columns**: 11 fields

### Column Structure

| Column           | Description         | Example                  |
| ---------------- | ------------------- | ------------------------ |
| S No.            | Serial number       | 1, 2, 3...               |
| Date             | Order date (M/D/YY) | 2/5/24, 12/23/25         |
| Delivery Address | Customer address    | A3-1206, C1-604 Haritima |
| Quantity         | Order quantity      | 1, 2, 10                 |
| Unit Price       | Price per unit      | 100, 150, 70             |
| Total Amount     | Total order amount  | 200, 150, 3600           |
| Status           | Order status        | Paid, Unpaid             |
| Payment Mode     | Payment method      | Online, Cash             |
| Billing Month    | Billing month       | February'24, December    |
| Reference Month  | Reference month     | 2(Feb'24), 12 - Dec'25   |
| Year             | Year                | 2024, 2025               |

---

## Conversion Methods

### Method 1: Automated Script (Recommended) ✅

**Script**: `scripts/convert-old-data-to-excel.js`

**Usage**:

```bash
cd /Users/shivramrana/Documents/HomieBites
node scripts/convert-old-data-to-excel.js
```

**Output**: `docs/old-data-import.xlsx`

**What it does**:

- Reads `docs/old data.md`
- Parses space-separated values
- Handles addresses with spaces
- Converts dates
- Creates Excel file with proper formatting

---

### Method 2: Manual Conversion

1. **Open `docs/old data.md`** in a text editor
2. **Copy all data** (including header row)
3. **Open Excel** (or Google Sheets)
4. **Paste data** into first cell
5. **Use "Text to Columns"**:
   - Data → Text to Columns
   - Delimited → Space
   - Finish
6. **Verify columns** are split correctly
7. **Save as `.xlsx`** format

---

## Importing to Admin Dashboard

### Step 1: Prepare Excel File

- ✅ File extension: `.xlsx` or `.xls`
- ✅ First row: Headers (exactly as shown above)
- ✅ Data rows: At least one row of data
- ✅ No merged cells in header row

### Step 2: Import

1. Go to **Admin Dashboard** → **Orders** tab
2. Click **"Import Orders"** button
3. Select your Excel file (`old-data-import.xlsx`)
4. Wait for import to complete
5. Check success notification

### Step 3: Verify

- Check Orders list shows imported orders
- Verify dates are correct
- Check addresses are complete
- Confirm totals match

---

## Troubleshooting

### Issue: "Excel file must have at least a header row and one data row"

**Cause**: File is empty or only has headers  
**Solution**: Ensure data rows exist below headers

### Issue: Dates not parsing correctly

**Cause**: Date format not recognized  
**Solution**:

- Dates should be in M/D/YY format (e.g., 2/5/24)
- Or use standard Excel date format
- Converter handles M/D/YY format automatically

### Issue: Addresses split incorrectly

**Cause**: Addresses with spaces being split  
**Solution**:

- Converter script handles this automatically
- If manual conversion, merge address columns after splitting

### Issue: "No orders found in file"

**Cause**: All rows filtered out  
**Solution**:

- Ensure each row has `Delivery Address` or `S No.`
- Check for empty rows
- Verify column headers match exactly

---

## Data Statistics

- **Total Records**: ~2,790 orders
- **Date Range**: February 2024 - December 2025
- **File Size**: ~150 KB (text) → ~200 KB (Excel)

---

## Notes

1. **Large Import**: Importing 2,790 orders may take a few minutes
2. **API Import**: If API is available, orders will be imported to database
3. **LocalStorage Fallback**: If API fails, orders saved to localStorage
4. **Duplicate Check**: System doesn't check for duplicates - may create duplicate orders
5. **Date Conversion**: Dates in M/D/YY format are automatically converted

---

## Next Steps After Import

1. **Verify Data**: Check a few orders to ensure data is correct
2. **Check Analytics**: View analytics to see imported data
3. **Clean Up**: Remove test/duplicate orders if needed
4. **Backup**: Export orders after import for backup

---

**Last Updated**: 2025-01-27  
**Status**: ✅ **Ready for Conversion**
