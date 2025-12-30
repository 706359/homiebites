/**
 * Excel file utilities and conversion functions
 * MASTER ORDERS MODEL: Only store source fields, derive the rest
 */

import {
  calculateTotalAmount,
  extractBillingMonth,
  extractBillingYear,
  findOrderByKey,
} from './orderUtils.js';

/**
 * Convert Excel data to orders format (use Excel as source of truth)
 * MASTER ORDERS MODEL: Auto-calculates derived fields, never stores them as strings
 */
export const convertExcelToOrders = (excelDataObj, sheetName = null, existingOrders = []) => {
  try {
    if (!excelDataObj || typeof excelDataObj !== 'object') {
      console.warn('convertExcelToOrders: Invalid excelDataObj');
      return [];
    }

    // Validate existingOrders
    if (!Array.isArray(existingOrders)) {
      console.warn('convertExcelToOrders: existingOrders is not an array, using empty array');
      existingOrders = [];
    }

    const ordersList = [];
    let sheetsToProcess = sheetName ? [sheetName] : Object.keys(excelDataObj);

    // Prefer an "All Data" sheet if present (case-insensitive match), else filter sheets
    if (!sheetName) {
      const allDataSheet = Object.keys(excelDataObj).find(
        (s) =>
          String(s || '')
            .toLowerCase()
            .replace(/\s+/g, '') === 'alldata'
      );

      if (allDataSheet) {
        sheetsToProcess = [allDataSheet];
      } else {
        // Filter sheets to only process actual order data sheets (not pivot/summary sheets)
        sheetsToProcess = sheetsToProcess.filter((s) => {
          const lowerName = String(s || '').toLowerCase();
          return (
            lowerName.includes('tiffin data') ||
            (lowerName.includes('data') &&
              !lowerName.includes('pivot') &&
              !lowerName.includes('summary'))
          );
        });

        // If no specific data sheets found, try to find sheets that look like they contain order data
        if (sheetsToProcess.length === 0) {
          sheetsToProcess = Object.keys(excelDataObj).filter((sheetName) => {
            const sheetData = excelDataObj[sheetName];
            if (!sheetData || !Array.isArray(sheetData) || sheetData.length < 2) return false;

            // Check if first row looks like headers for order data
            const headers = sheetData[0] || [];
            const headerStr = headers.join(' ').toLowerCase();
            return (
              headerStr.includes('date') &&
              (headerStr.includes('address') || headerStr.includes('delivery'))
            );
          });
        }
      }
    }

    // Limit processing to prevent memory exhaustion
    const maxSheets = 10;
    const sheetsToProcessLimited = sheetsToProcess.slice(0, maxSheets);
    if (sheetsToProcess.length > maxSheets) {
      console.warn(
        `Processing ${maxSheets} of ${sheetsToProcess.length} sheets to prevent memory issues`
      );
    }

    sheetsToProcessLimited.forEach((sheet) => {
      const sheetData = excelDataObj[sheet];
      if (!sheetData || !Array.isArray(sheetData) || sheetData.length < 2) {
        return;
      }

      // Limit rows to process to prevent memory issues (max 10,000 rows per sheet)
      const maxRows = 10000;
      const rowsToProcess = sheetData.length > maxRows ? sheetData.slice(0, maxRows) : sheetData;
      if (sheetData.length > maxRows) {
        console.warn(
          `Processing ${maxRows} of ${sheetData.length} rows in sheet "${sheet}" to prevent memory issues`
        );
      }

      const headers = rowsToProcess[0] || [];
      if (headers.length === 0) {
        return;
      }

      // Detect pivot/summary format (HomieBites.com.xlsx format)
      const row0 = rowsToProcess[0] || [];
      const row1 = rowsToProcess[1] || [];
      const hasFYHeader = row0.some((cell) => String(cell || '').includes('FY-'));
      const hasAddressHeader =
        String(row1[0] || '')
          .toLowerCase()
          .trim() === 'address';
      const hasMonthColumns = row1.some((cell, idx) => {
        if (idx === 0) return false;
        const cellStr = String(cell || '').trim();
        return /^\d{2}'?\d{2}$/.test(cellStr) || /^\d{1,2}'?\d{2}$/.test(cellStr);
      });

      const usePivotFormat = hasFYHeader && hasAddressHeader && hasMonthColumns;

      if (usePivotFormat) {
        // Parse pivot format
        const fyMatch = String(row0.find((cell) => String(cell || '').includes('FY-')) || '').match(
          /FY-(\d{4})\/(\d{2})/
        );
        const baseYear = fyMatch ? parseInt(fyMatch[1]) : new Date().getFullYear();

        for (let rowIndex = 2; rowIndex < rowsToProcess.length; rowIndex++) {
          try {
            const row = rowsToProcess[rowIndex] || [];
            if (!row || row.length === 0) continue;

            const address = String(row[0] || '').trim();
            if (!address || address.toLowerCase() === 'grand total' || address === '') {
              continue;
            }

            let customerName = address;
            try {
              const addressParts = address.split(/\s+/);
              if (addressParts.length > 1) {
                const possibleName = addressParts[addressParts.length - 1];
                if (possibleName && !/^\d+/.test(possibleName)) {
                  customerName = possibleName;
                }
              }
            } catch (nameError) {
              // Keep default customerName = address
            }

            const maxCols = Math.min(row1.length, row.length);
            for (let colIndex = 1; colIndex < maxCols; colIndex++) {
              try {
                const headerStr = String(row1[colIndex] || '').trim();
                if (headerStr.toLowerCase() === 'grand total') {
                  break;
                }

                const monthMatch = headerStr.match(/(\d{1,2})'?(\d{2})/);
                if (!monthMatch) continue;

                const month = parseInt(monthMatch[1]) - 1;
                const yearSuffix = parseInt(monthMatch[2]);
                const year = yearSuffix < 50 ? 2000 + yearSuffix : 1900 + yearSuffix;

                const cellValue = row[colIndex];
                const amount = parseFloat(cellValue) || 0;
                if (amount <= 0) continue;

                const orderDate = new Date(year, month, 1);
                const dateISO = orderDate.toISOString().split('T')[0]; // YYYY-MM-DD format

                // MASTER ORDERS MODEL: Auto-calculate derived fields
                const quantity = 1;
                const unitPrice = amount;
                const totalAmount = calculateTotalAmount(quantity, unitPrice);
                const billingMonth = extractBillingMonth(orderDate);
                const billingYear = extractBillingYear(orderDate);

                // Check if order with same (date + address) exists (smart update/insert)
                const existingOrder = findOrderByKey(existingOrders, dateISO, address);
                // Excel should NEVER generate IDs - backend will generate when synced
                // For localStorage: use existing ID if found, otherwise temporary ID (will be replaced by backend)
                const tempId = existingOrder
                  ? existingOrder.id || existingOrder.orderId || existingOrder._id
                  : `TEMP-EXCEL-${Date.now()}-${rowIndex}-${colIndex}`;

                const order = {
                  // Primary key - Temporary ID for localStorage (backend will generate proper ID on sync)
                  id: tempId,

                  // Source fields (what gets stored)
                  order_date: dateISO,
                  delivery_address: address,
                  quantity: quantity,
                  unit_price: unitPrice,
                  status: 'Paid', // Default for imported data
                  payment_mode: 'Online', // Default for imported data
                  source: 'excel',

                  // Auto-calculated fields (derived, not stored as source)
                  total_amount: totalAmount,
                  billing_month: billingMonth, // INT (1-12)
                  billing_year: billingYear, // INT (YYYY)

                  // Timestamps
                  created_at: existingOrder ? existingOrder.created_at : new Date().toISOString(),
                  updated_at: new Date().toISOString(),

                  // Backward compatibility fields (for existing UI)
                  date: dateISO,
                  customerAddress: address,
                  customerName: address,
                  name: address,
                  total: totalAmount,
                  totalAmount: totalAmount,
                  items: [
                    {
                      name: `Order for ${address}`,
                      quantity: quantity,
                      price: unitPrice,
                    },
                  ],
                };

                // Limit total orders to prevent memory exhaustion (max 50,000 orders)
                if (ordersList.length < 50000) {
                  ordersList.push(order);
                } else if (ordersList.length === 50000) {
                  console.warn(
                    'Reached maximum order limit (50,000), stopping processing to prevent memory issues'
                  );
                  break;
                }
              } catch (colError) {
                console.warn(`Error processing column ${colIndex}:`, colError);
              }
            }
            // Break outer loop if limit reached
            if (ordersList.length >= 50000) break;
          } catch (rowError) {
            console.warn(`Error processing row ${rowIndex}:`, rowError);
          }
        }
      } else {
        // Standard tabular format - MASTER ORDERS MODEL
        for (let i = 1; i < rowsToProcess.length; i++) {
          try {
            const row = rowsToProcess[i];
            if (!row || row.length === 0) continue;

            // Skip empty rows
            const hasData = row.some(
              (cell) => cell !== null && cell !== undefined && String(cell).trim() !== ''
            );
            if (!hasData) continue;

            // Extract data from row
            let orderDate = null;
            let deliveryAddress = '';
            let quantity = 1;
            let unitPrice = 0;
            let status = 'Paid'; // Default
            let paymentMode = 'Online'; // Default
            let billingMonth = null; // Will be read from Excel or auto-calculated
            let referenceMonth = ''; // Will be read from Excel
            let billingYear = null; // Will be read from Excel or auto-calculated

            headers.forEach((header, colIdx) => {
              const headerStr = String(header || '')
                .toLowerCase()
                .trim();
              const value = row[colIdx];

              if (headerStr.includes('date') && !headerStr.includes('delivery')) {
                // Parse date - support various formats
                if (value) {
                  try {
                    if (value instanceof Date) {
                      orderDate = value;
                    } else if (typeof value === 'number') {
                      // Excel date serial number - adjust for off-by-one error in source data
                      const excelEpoch = new Date(1899, 11, 30);
                      orderDate = new Date(
                        excelEpoch.getTime() + (value + 1) * 24 * 60 * 60 * 1000
                      );
                    } else {
                      // String date
                      const dateStr = String(value).trim();
                      // Support M/D/YY format
                      if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/)) {
                        const parts = dateStr.split('/');
                        const month = parseInt(parts[0]) - 1;
                        const day = parseInt(parts[1]);
                        let year = parseInt(parts[2]);
                        if (year < 100) year += year < 50 ? 2000 : 1900;
                        orderDate = new Date(year, month, day);
                      } else {
                        orderDate = new Date(dateStr);
                      }
                    }
                    if (isNaN(orderDate.getTime())) {
                      orderDate = null;
                    }
                  } catch (dateError) {
                    console.warn(`Invalid date in row ${i}:`, value);
                    orderDate = null;
                  }
                }
              } else if (headerStr.includes('delivery address') || headerStr.includes('address')) {
                deliveryAddress = String(value || '').trim();
              } else if (headerStr.includes('quantity') || headerStr.includes('qty')) {
                quantity = parseInt(value) || 1;
              } else if (headerStr.includes('unit price') || headerStr.includes('price')) {
                unitPrice = parseFloat(value) || 0;
              } else if (headerStr.includes('status')) {
                const statusStr = String(value || '')
                  .toLowerCase()
                  .trim();
                if (['paid', 'unpaid', 'pending'].includes(statusStr)) {
                  status = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
                }
              } else if (headerStr === 'payment mode' || headerStr === 'payment mode ') {
                // Exact match for 'Payment Mode' or 'Payment Mode ' header
                const modeStr = String(value || '')
                  .toLowerCase()
                  .trim();
                if (['cash', 'online', 'upi'].includes(modeStr)) {
                  paymentMode = modeStr.charAt(0).toUpperCase() + modeStr.slice(1);
                } else if (modeStr) {
                  paymentMode = modeStr.charAt(0).toUpperCase() + modeStr.slice(1);
                }
              } else if (headerStr === 'billing month' || headerStr === 'billing month ') {
                // Read billing month from Excel column
                const monthStr = String(value || '').trim();
                if (monthStr) {
                  // Try to parse as "February'24" format or just month name
                  const monthMatch = monthStr.match(/^([A-Za-z]+)'?(\d{2})?$/);
                  if (monthMatch) {
                    const monthName = monthMatch[1].toLowerCase();
                    const monthNames = [
                      'january',
                      'february',
                      'march',
                      'april',
                      'may',
                      'june',
                      'july',
                      'august',
                      'september',
                      'october',
                      'november',
                      'december',
                    ];
                    const monthIndex = monthNames.indexOf(monthName);
                    if (monthIndex !== -1) {
                      billingMonth = monthIndex + 1; // 1-12
                      if (monthMatch[2]) {
                        billingYear =
                          parseInt(monthMatch[2]) < 50
                            ? 2000 + parseInt(monthMatch[2])
                            : 1900 + parseInt(monthMatch[2]);
                      }
                    }
                  }
                }
              } else if (headerStr === 'reference month' || headerStr === 'reference month ') {
                // Read reference month from Excel column
                referenceMonth = String(value || '').trim();
              } else if (headerStr === 'year' || headerStr === 'year ') {
                // Read year from Excel column
                const yearStr = String(value || '').trim();
                if (yearStr) {
                  billingYear = parseInt(yearStr) || null;
                }
              }
            });

            // MASTER ORDERS MODEL: Ignore rows with missing required data
            if (!orderDate || !deliveryAddress || quantity <= 0 || unitPrice <= 0) {
              console.warn(
                `Skipping row ${i}: Missing required data (date: ${orderDate}, address: "${deliveryAddress}", qty: ${quantity}, price: ${unitPrice})`
              );
              continue;
            }

            const dateISO = orderDate.toISOString().split('T')[0]; // YYYY-MM-DD

            // Check if order with same (date + address) exists (smart update/insert)
            const existingOrder = findOrderByKey(existingOrders, dateISO, deliveryAddress);

            // Excel should NEVER generate IDs - backend will generate when synced
            // For localStorage: use existing ID if found, otherwise temporary ID (will be replaced by backend)
            const tempId = existingOrder
              ? existingOrder.id || existingOrder.orderId || existingOrder._id
              : `TEMP-EXCEL-${Date.now()}-${i}`;

            // Create MASTER ORDERS MODEL order object
            const order = {
              // Primary key - Temporary ID for localStorage (backend will generate proper ID on sync)
              id: tempId,

              // Source fields (what gets stored)
              order_date: dateISO,
              delivery_address: deliveryAddress,
              quantity: quantity,
              unit_price: unitPrice,
              status: status,
              payment_mode: paymentMode,
              source: 'excel',

              // Auto-calculated fields (derived, not stored as source) - use Excel values if available
              total_amount: calculateTotalAmount(quantity, unitPrice),
              billing_month: billingMonth || extractBillingMonth(orderDate), // INT (1-12)
              billing_year: billingYear || extractBillingYear(orderDate), // INT (YYYY)
              reference_month: referenceMonth || '', // String like "2(Feb'24)"

              // Timestamps
              created_at: existingOrder ? existingOrder.created_at : new Date().toISOString(),
              updated_at: new Date().toISOString(),

              // Backward compatibility fields (for existing UI)
              date: dateISO,
              customerAddress: deliveryAddress,
              customerName: deliveryAddress,
              name: deliveryAddress,
              total: calculateTotalAmount(quantity, unitPrice),
              totalAmount: calculateTotalAmount(quantity, unitPrice),
              paymentMode: paymentMode, // Backward compatibility
              billingMonth: billingMonth || extractBillingMonth(orderDate), // Backward compatibility
              referenceMonth: referenceMonth || '', // Backward compatibility
              year: billingYear || extractBillingYear(orderDate), // Backward compatibility
              items: [
                {
                  name: `Order for ${deliveryAddress}`,
                  quantity: quantity,
                  price: unitPrice,
                },
              ],
            };

            // Limit total orders to prevent memory exhaustion (max 50,000 orders)
            if (ordersList.length < 50000) {
              ordersList.push(order);
            } else {
              console.warn(
                'Reached maximum order limit (50,000), stopping processing to prevent memory issues'
              );
              break; // Exit loop
            }
          } catch (rowError) {
            console.warn(`Error processing row ${i}:`, rowError);
          }
        }
      }
    });

    return ordersList;
  } catch (error) {
    console.error('Error converting Excel to orders:', error);
    return [];
  }
};

/**
 * Detect column types for Excel data
 */
export const detectColumnTypes = (jsonData) => {
  const columnTypeMap = {};

  if (jsonData.length < 2) {
    return columnTypeMap;
  }

  const headers = jsonData[0] || [];

  headers.forEach((header, colIdx) => {
    const headerStr = String(header || '').toLowerCase();

    // Check header names for type hints
    if (
      headerStr.includes('date') ||
      headerStr.includes('time') ||
      headerStr.includes('created') ||
      headerStr.includes('delivered')
    ) {
      columnTypeMap[colIdx] = 'date';
    } else if (
      headerStr.includes('amount') ||
      headerStr.includes('price') ||
      headerStr.includes('total') ||
      headerStr.includes('revenue') ||
      headerStr.includes('cost') ||
      headerStr.includes('₹') ||
      headerStr.includes('rs') ||
      headerStr.includes('rupee')
    ) {
      columnTypeMap[colIdx] = 'number';
    } else if (
      headerStr.includes('quantity') ||
      headerStr.includes('qty') ||
      headerStr.includes('count')
    ) {
      columnTypeMap[colIdx] = 'number';
    } else {
      // Check sample data (first 5 rows)
      let hasNumber = false;
      let hasDate = false;

      for (let i = 1; i < Math.min(6, jsonData.length); i++) {
        const cellValue = jsonData[i][colIdx];
        if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
          // Check if it's a number
          if (!isNaN(parseFloat(cellValue)) && isFinite(cellValue)) {
            hasNumber = true;
          }
          // Check if it's a date string
          const dateStr = String(cellValue);
          if (
            dateStr.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/) ||
            dateStr.match(/\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/)
          ) {
            hasDate = true;
          }
        }
      }

      if (hasDate) {
        columnTypeMap[colIdx] = 'date';
      } else if (hasNumber) {
        columnTypeMap[colIdx] = 'number';
      } else {
        columnTypeMap[colIdx] = 'text';
      }
    }
  });

  return columnTypeMap;
};
