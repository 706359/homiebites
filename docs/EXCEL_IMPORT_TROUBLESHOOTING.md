# Excel Import Troubleshooting Guide

**Date**: 2025-01-27

---

## Common Errors and Solutions

### 1. "Failed to parse Excel file"
**Cause**: File is corrupted or not a valid Excel file  
**Solution**: 
- Open the file in Excel and save it again
- Ensure file extension is `.xlsx` or `.xls`
- Try exporting to a new Excel file

### 2. "Excel file has no sheets"
**Cause**: Excel file is empty or corrupted  
**Solution**: 
- Open file in Excel and verify it has data
- Ensure at least one sheet exists
- Re-save the file

### 3. "Excel file must have at least a header row and one data row"
**Cause**: File only has headers, no data rows  
**Solution**: 
- Add at least one row of data below the headers
- Ensure data rows are not empty

### 4. "Failed to load Excel library"
**Cause**: xlsx package not installed or CDN unavailable  
**Solution**: 
```bash
cd web
npm install xlsx
```

### 5. Date parsing errors
**Cause**: Date format not recognized  
**Solution**: 
- Use standard date formats: YYYY-MM-DD, MM/DD/YYYY, or Excel date format
- Ensure dates are in a single column
- Avoid merged cells in date column

### 6. "No orders found in file"
**Cause**: All rows filtered out (missing required fields)  
**Solution**: 
- Ensure each row has either `Delivery Address` or `S No.`
- Check for empty rows
- Verify column headers match exactly

---

## Debugging Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Check for red error text

2. **Verify File Format**
   - Open file in Excel
   - Check first row has headers
   - Verify at least one data row exists
   - Save file as `.xlsx` format

3. **Check Column Headers**
   - Headers should match exactly (case-insensitive):
     - `S No.` or `Serial No.`
     - `Date`
     - `Delivery Address`
     - `Quantity`
     - `Unit Price`
     - `Total Amount`
     - `Status`
     - `Payment Mode`
     - `Billing Month`
     - `Reference Month`
     - `Year`

4. **Test with Small File**
   - Create a test file with 2-3 rows
   - Import test file first
   - If test works, issue is with data format

---

## File Format Checklist

- [ ] File extension is `.xlsx` or `.xls`
- [ ] First row contains headers
- [ ] At least one data row exists
- [ ] No merged cells in header row
- [ ] Dates are in proper format
- [ ] Numbers are actual numbers (not text)
- [ ] Required columns present: `Delivery Address` or `S No.`

---

## Still Having Issues?

1. **Check Error Message**: Copy the exact error message
2. **Check Console**: Look for detailed error in browser console
3. **Test File**: Try importing a simple 2-row test file
4. **File Size**: Very large files (>10MB) may cause issues

---

**Last Updated**: 2025-01-27
