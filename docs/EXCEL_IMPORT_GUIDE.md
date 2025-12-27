# Excel Import Guide

**Date**: 2025-01-27  
**Status**: ✅ **Excel Import Implemented**

---

## Overview

The Admin Dashboard now supports importing orders from both **JSON** and **Excel** (.xlsx, .xls) files.

---

## Supported File Formats

- ✅ **JSON** (`.json`) - Array of order objects
- ✅ **Excel** (`.xlsx`, `.xls`) - Spreadsheet with order data

---

## Excel File Format

### Required Columns

Your Excel file should have a **header row** followed by data rows. The system automatically maps columns based on header names (case-insensitive).

### Column Mapping

| Excel Header | Maps To | Description |
|--------------|---------|-------------|
| `id` | `order.id` | Order ID |
| `name`, `customer name` | `order.customerName` | Customer name |
| `phone`, `phone number` | `order.customerPhone` | Customer phone |
| `address`, `delivery address` | `order.deliveryAddress` | Delivery address |
| `total`, `amount` | `order.total` | Order total (number) |
| `date` | `order.date` | Order date |
| `status` | `order.status` | Order status |
| `items` | `order.items` | Order items (JSON string or array) |

### Example Excel Format

| id | customer name | phone | delivery address | total | date | status |
|----|---------------|-------|-----------------|-------|------|--------|
| ORD001 | John Doe | 1234567890 | 123 Main St | 500 | 2025-01-27 | pending |
| ORD002 | Jane Smith | 0987654321 | 456 Oak Ave | 750 | 2025-01-27 | confirmed |

---

## How to Import

1. **Go to Admin Dashboard** → Orders tab
2. **Click "Import Orders"** button
3. **Select your file** (JSON or Excel)
4. **Wait for import** - The system will:
   - Parse the file
   - Validate the data
   - Import to API (if available)
   - Fallback to localStorage if API fails
5. **See success notification** with number of imported orders

---

## Import Process

### Step 1: File Detection
- System detects file type by extension
- Supports `.json`, `.xlsx`, `.xls`

### Step 2: File Parsing
- **JSON**: Parsed directly with `JSON.parse()`
- **Excel**: 
  - Read as ArrayBuffer
  - Parsed using SheetJS (xlsx library)
  - First sheet is used
  - First row treated as headers

### Step 3: Data Mapping
- Excel headers mapped to order fields
- Empty rows filtered out
- Data validated

### Step 4: Import
- Tries API first (if authenticated)
- Falls back to localStorage
- Merges with existing orders

---

## Error Handling

### Common Errors

1. **"Unsupported file format"**
   - **Cause**: File extension not `.json`, `.xlsx`, or `.xls`
   - **Solution**: Save file with correct extension

2. **"Excel file must have at least a header row and one data row"**
   - **Cause**: Excel file is empty or has only headers
   - **Solution**: Add at least one data row

3. **"Invalid file format. File must contain an array of orders."**
   - **Cause**: JSON file doesn't contain an array
   - **Solution**: Ensure JSON is an array: `[{...}, {...}]`

4. **"No orders found in file."**
   - **Cause**: All rows filtered out (missing required fields)
   - **Solution**: Ensure rows have `customerName` or `id`

---

## Technical Details

### Library Used
- **SheetJS (xlsx)** - For Excel parsing
- Installed via: `npm install xlsx`
- CDN fallback available if npm package fails

### Code Location
- **File**: `admin/AdminDashboard.jsx`
- **Function**: `handleImportOrders()`
- **Line**: ~908

### File Input
```jsx
<input
  type='file'
  accept='.json,.xlsx,.xls'
  onChange={handleImportOrders}
/>
```

---

## Best Practices

1. **Use Headers**: Always include a header row in Excel files
2. **Required Fields**: Include at least `customerName` or `id` in each row
3. **Data Types**: 
   - Numbers for `total`
   - Dates for `date`
   - Strings for text fields
4. **Test First**: Import a small file first to verify format
5. **Backup**: Export existing orders before importing

---

## Example Excel Template

Create an Excel file with these columns (exact format):

```
| S No. | Date       | Delivery Address | Quantity | Unit Price | Total Amount | Status   | Payment Mode | Billing Month | Reference Month | Year |
|-------|------------|------------------|----------|------------|--------------|----------|--------------|---------------|-----------------|------|
| 1     | 2025-01-27 | 123 Main St      | 2        | 250        | 500          | pending  | Cash         | January       | January         | 2025 |
| 2     | 2025-01-28 | 456 Oak Ave      | 3        | 250        | 750          | confirmed| Online       | January       | January         | 2025 |
```

**Important Notes**:
- First row must be headers (exactly as shown above)
- Date format: YYYY-MM-DD or Excel date format
- Status: lowercase (pending, confirmed, delivered, cancelled)
- Quantity and prices should be numbers
- Empty rows will be filtered out

---

## Troubleshooting

### Excel Import Not Working

1. **Check file format**: Ensure it's `.xlsx` or `.xls`
2. **Check headers**: First row must contain column names
3. **Check data**: At least one data row required
4. **Check browser console**: Look for error messages
5. **Try JSON**: Test with JSON format first to verify import works

### Import Fails Silently

1. **Check notifications**: Look for error messages
2. **Check console**: Open browser DevTools → Console
3. **Check network**: API import requires network connection
4. **Check localStorage**: Import may succeed but not show if localStorage is full

---

## Future Enhancements

Potential improvements:
- [ ] CSV file support
- [ ] Multiple sheet selection
- [ ] Column mapping UI
- [ ] Import preview before confirmation
- [ ] Duplicate detection
- [ ] Import validation rules

---

**Last Updated**: 2025-01-27  
**Status**: ✅ **Working**
