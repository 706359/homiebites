/**
 * Next.js API Route: Upload Excel File
 * Migrated from Express backend - Full implementation matching backend/HomieBites/controllers/uploadExcelController.js
 */
import * as XLSX from 'xlsx';
import connectDB from '../../../../lib/db.js';
import { createErrorResponse, isAdmin } from '../../../../lib/middleware/auth.js';
import Order from '../../../../lib/models/Order.js';

export async function POST(request) {
  try {
    await connectDB();
    await isAdmin(request);

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let workbook;
    try {
      workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    } catch (err) {
      return Response.json({ success: false, error: 'Invalid Excel file' }, { status: 400 });
    }

    const sheetNameCandidates = workbook.SheetNames || [];
    let sheetName = sheetNameCandidates.find(
      (s) =>
        String(s || '')
          .toLowerCase()
          .replace(/\s+/g, '') === 'alldata'
    );
    if (!sheetName) sheetName = sheetNameCandidates[0];
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      return Response.json({ success: false, error: 'Sheet not found' }, { status: 400 });
    }

    // Parse with cellDates: true to get Date objects directly from Excel
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      raw: false, // Convert dates to strings/Date objects
      cellDates: true, // Get Date objects for date cells
    });

    if (!jsonData || jsonData.length < 2) {
      return Response.json(
        { success: false, error: 'Excel sheet is empty or has no data' },
        { status: 400 }
      );
    }

    const headers = jsonData[0].map((h) => String(h || '').trim());
    const rows = jsonData.slice(1);

    let uploadOptions = {};
    try {
      const optionsStr = formData.get('options');
      if (optionsStr) {
        uploadOptions = typeof optionsStr === 'string' ? JSON.parse(optionsStr) : optionsStr;
      }
    } catch (e) {
      console.warn('[uploadExcel] Could not parse upload options:', e.message);
    }

    const updateExisting = uploadOptions.updateExisting !== false;
    const skipDuplicates = uploadOptions.skipDuplicates === true;
    const autoGenerateOrderIds = uploadOptions.autoGenerateOrderIds !== false;

    const ordersToImport = [];
    rows.forEach((row) => {
      try {
        const order = {};
        headers.forEach((header, colIdx) => {
          const key = String(header || '')
            .toLowerCase()
            .trim();
          const value = row[colIdx];
          if (!key) return;

          if (key.includes('order id') || key.includes('orderid') || key === 'orderid') {
            order.orderId = String(value || '').trim();
          } else if (
            key === 'date' ||
            key === 'order date' ||
            key === 'delivery date' ||
            (key.includes('date') &&
              !key.includes('billing') &&
              !key.includes('created') &&
              !key.includes('updated'))
          ) {
            order.date = value;
          } else if (
            key.includes('delivery address') ||
            (key.includes('address') && !key.includes('billing'))
          ) {
            order.deliveryAddress = String(value || '').trim();
          } else if (key.includes('quantity') || key.includes('qty')) {
            order.quantity = Number(value) || 1;
          } else if (
            key.includes('unit price') ||
            (key.includes('price') && !key.includes('total'))
          ) {
            order.unitPrice = parseFloat(String(value || '').replace(/[₹,]/g, '')) || 0;
          } else if (
            key.includes('total amount') ||
            (key.includes('total') && !key.includes('quantity'))
          ) {
            order.totalAmount = parseFloat(String(value || '').replace(/[₹,]/g, '')) || 0;
          } else if (key.includes('status')) {
            order.status = String(value || '');
          } else if (
            key.includes('payment mode') ||
            key.includes('payment method') ||
            key === 'payment'
          ) {
            order.paymentMode = String(value || '');
          } else if (key.includes('billing month')) {
            order.billingMonth = String(value || '');
          } else if (key === 'year') {
            order.year = String(value || '');
          } else if (key.includes('name') && (key.includes('customer') || key.includes('client'))) {
            order.customerName = String(value || '');
          } else if (key.includes('phone') || key.includes('mobile') || key.includes('contact')) {
            order.customerPhone = String(value || '');
          } else {
            const sanitizedKey = key.replace(/[^a-z0-9]/g, '_');
            if (sanitizedKey) order[sanitizedKey] = value;
          }
        });

        if (!order.deliveryAddress) return;

        // FIX 2: Handle Excel serial numbers properly
        if (order.date !== undefined && order.date !== null && order.date !== '') {
          let parsedDate = null;
          const originalDateValue = order.date;

          // Handle Excel serial number (numeric value)
          if (typeof order.date === 'number') {
            // Excel dates are stored as days since 1900-01-01
            // But Excel incorrectly treats 1900 as a leap year
            const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Dec 30, 1899
            const days = Math.floor(order.date);

            // Excel's 1900 leap year bug: dates >= 60 need adjustment
            const adjustedDays = order.date >= 60 ? days - 1 : days;

            parsedDate = new Date(excelEpoch.getTime() + adjustedDays * 86400000);
          }
          // If it's already a Date object (from Excel with cellDates: true)
          else if (order.date instanceof Date && !isNaN(order.date.getTime())) {
            // Excel Date objects are typically date-only (no time component)
            // Extract local date components to avoid timezone conversion issues
            const localYear = order.date.getFullYear();
            const localMonth = order.date.getMonth();
            const localDay = order.date.getDate();
            // Create a UTC date from local date components (treat as date-only)
            parsedDate = new Date(Date.UTC(localYear, localMonth, localDay, 0, 0, 0, 0));
          }
          // Otherwise try parsing as string
          else {
            const dateStr = String(order.date).trim();

            // ISO format (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
              parsedDate = new Date(dateStr + 'T00:00:00Z'); // Z indicates UTC
            }
            // M/D/YY, M/D/YYYY, MM/DD/YY, MM/DD/YYYY (US format - most common in Excel)
            else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
              const parts = dateStr.split('/');
              const part1 = parseInt(parts[0]);
              const part2 = parseInt(parts[1]);
              let year = parseInt(parts[2]);

              // Handle 2-digit year (YY -> YYYY)
              if (year < 100) {
                year = year < 50 ? 2000 + year : 1900 + year;
              }

              // US format: M/D/YY or MM/DD/YYYY (first part is month, second is day)
              // This is the standard Excel US date format
              if (part1 <= 12 && part2 <= 31) {
                // MM/DD/YYYY or M/D/YY format (US)
                parsedDate = new Date(Date.UTC(year, part1 - 1, part2, 0, 0, 0, 0));
              } else if (part2 <= 12 && part1 <= 31) {
                // DD/MM/YYYY format (international)
                parsedDate = new Date(Date.UTC(year, part2 - 1, part1, 0, 0, 0, 0));
              } else {
                // Ambiguous - default to US format MM/DD/YYYY
                parsedDate = new Date(Date.UTC(year, part1 - 1, part2, 0, 0, 0, 0));
              }
            }
            // DD-MM-YYYY or DD-MM-YY
            else if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(dateStr)) {
              const parts = dateStr.split('-');
              let year = parseInt(parts[2]);
              const yearFull = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
              // Assume DD-MM-YYYY format (international)
              parsedDate = new Date(
                Date.UTC(yearFull, parseInt(parts[1]) - 1, parseInt(parts[0]), 0, 0, 0, 0)
              );
            }
            // DD-MMM-YY or DD-MMM-YYYY
            else if (/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/i.test(dateStr)) {
              const parts = dateStr.split('-');
              const day = parseInt(parts[0], 10);
              const monthStr = parts[1].toLowerCase();
              let year = parseInt(parts[2], 10);
              const monthNames = [
                'jan',
                'feb',
                'mar',
                'apr',
                'may',
                'jun',
                'jul',
                'aug',
                'sep',
                'oct',
                'nov',
                'dec',
              ];
              const monthIndex = monthNames.findIndex((m) => monthStr.startsWith(m));
              if (monthIndex !== -1 && day > 0 && day <= 31) {
                if (year < 100) {
                  year = year < 50 ? 2000 + year : 1900 + year;
                }
                parsedDate = new Date(Date.UTC(year, monthIndex, day, 0, 0, 0, 0));
              }
            } else {
              // Try standard Date parsing as fallback
              parsedDate = new Date(dateStr);
            }
          }

          // Validate and store as YYYY-MM-DD string
          if (parsedDate && !isNaN(parsedDate.getTime())) {
            const minDate = new Date(2000, 0, 1);
            const maxDate = new Date(2100, 11, 31);

            if (parsedDate >= minDate && parsedDate <= maxDate) {
              // Store as Date object (Mongoose expects Date type)
              // Create UTC date to avoid timezone conversion issues
              const utcYear = parsedDate.getUTCFullYear();
              const utcMonth = parsedDate.getUTCMonth(); // 0-indexed
              const utcDay = parsedDate.getUTCDate();

              order.date = new Date(Date.UTC(utcYear, utcMonth, utcDay, 0, 0, 0, 0));

              // Store billing month and year directly from UTC date (1-indexed month)
              order._billingMonth = utcMonth + 1;
              order._billingYear = utcYear;
            } else {
              console.error(
                `[uploadExcel] ❌ Date out of range: ${parsedDate.toISOString()}, original: ${originalDateValue}`
              );
              order.date = undefined; // Skip invalid dates
            }
          } else {
            console.error(`[uploadExcel] ❌ Failed to parse date: "${originalDateValue}"`);
            // Set to undefined so order will be skipped in validation - never use today's date
            order.date = undefined;
          }
        } else {
          console.warn(`[uploadExcel] ⚠️ No date provided, skipping order`);
          return;
        }

        // Skip orders with invalid or missing dates - never use today's date
        if (!order.date || order.date === undefined) {
          console.warn(`[uploadExcel] ⚠️ Skipping order with invalid/missing date`);
          return; // Skip this order
        }

        if (typeof order.unitPrice !== 'number' || isNaN(order.unitPrice)) {
          order.unitPrice = 0;
        }
        order.totalAmount = (order.unitPrice || 0) * (order.quantity || 1);
        ordersToImport.push(order);
      } catch (rowErr) {
        console.error('[uploadExcel] Row error:', rowErr);
      }
    });

    if (ordersToImport.length === 0) {
      return Response.json(
        { success: false, error: 'No valid orders found in Excel' },
        { status: 400 }
      );
    }

    const processedOrders = [];
    const validationErrors = [];
    const insertionErrors = [];

    for (let i = 0; i < ordersToImport.length; i++) {
      try {
        const od = ordersToImport[i];

        let orderDate;
        if (od.date) {
          // Date should already be a Date object from parsing step
          if (od.date instanceof Date) {
            orderDate = od.date;
          } else if (typeof od.date === 'string') {
            // Fallback: parse ISO date string (YYYY-MM-DD) as UTC
            orderDate = new Date(od.date + 'T00:00:00Z');
          } else {
            orderDate = new Date(od.date);
          }

          if (isNaN(orderDate.getTime())) {
            validationErrors.push({ index: i + 2, error: 'Invalid date format' });
            continue;
          }
        } else {
          validationErrors.push({ index: i + 2, error: 'Date is required' });
          continue;
        }

        // Use stored billing month/year if available (from parsed date), otherwise calculate from orderDate using UTC
        const billingMonth = od._billingMonth || orderDate.getUTCMonth() + 1;
        const billingYear = od._billingYear || orderDate.getUTCFullYear();

        if (!od.deliveryAddress || !od.deliveryAddress.trim()) {
          validationErrors.push({ index: i + 2, error: 'Missing required field: deliveryAddress' });
          continue;
        }

        const statusLower = String(od.status || 'DELIVERED').toLowerCase();
        const paymentStatus =
          statusLower === 'paid' ? 'Paid' : statusLower === 'unpaid' ? 'Unpaid' : 'Pending';

        const calculatedTotalAmount =
          (Number(od.quantity) || 1) *
          (typeof od.unitPrice === 'number' && !isNaN(od.unitPrice) ? od.unitPrice : 0);

        // Always set billingMonth and billingYear from correctly parsed date
        // Use stored values from upload parsing if available, otherwise use calculated values
        const finalBillingMonth = od._billingMonth || billingMonth;
        const finalBillingYear = od._billingYear || billingYear;

        const processed = {
          ...(od.orderId && od.orderId.trim() ? { orderId: String(od.orderId).trim() } : {}),
          date: od.date, // Date object (Mongoose will store as Date)
          billingMonth: finalBillingMonth,
          billingYear: finalBillingYear,
          deliveryAddress: String(od.deliveryAddress).trim(),
          quantity: Number(od.quantity) || 1,
          unitPrice: typeof od.unitPrice === 'number' && !isNaN(od.unitPrice) ? od.unitPrice : 0,
          totalAmount: calculatedTotalAmount,
          status: od.status || 'DELIVERED',
          paymentStatus: paymentStatus,
          paymentMode: od.paymentMode || od.payment_mode || 'Online',
          mode: od.mode || 'Morning',
          customerName: od.customerName || od.name || od.deliveryAddress,
          customerPhone: od.customerPhone || '',
          source: 'excel',
        };

        processedOrders.push(processed);
      } catch (err) {
        validationErrors.push({ index: i + 2, error: err.message });
      }
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    if (processedOrders.length > 0) {
      try {
        const ordersWithIds = [];
        const ordersWithoutIds = [];

        processedOrders.forEach((order) => {
          if (order.orderId && order.orderId.trim()) {
            ordersWithIds.push(order);
          } else {
            ordersWithoutIds.push(order);
          }
        });

        // Process orders with IDs
        if (ordersWithIds.length > 0) {
          const existingOrderIds = await Order.find(
            { orderId: { $in: ordersWithIds.map((o) => o.orderId).filter(Boolean) } },
            { orderId: 1, _id: 1 }
          );
          const existingIdsSet = new Set(existingOrderIds.map((o) => o.orderId));

          const ordersToUpdate = [];
          const ordersToInsert = [];

          for (const order of ordersWithIds) {
            if (existingIdsSet.has(order.orderId)) {
              if (updateExisting) {
                ordersToUpdate.push(order);
              } else if (skipDuplicates) {
                skipped++;
              } else {
                ordersToInsert.push(order);
              }
            } else {
              ordersToInsert.push(order);
            }
          }

          // Update existing
          if (ordersToUpdate.length > 0) {
            for (const orderData of ordersToUpdate) {
              try {
                const calculatedTotal = (orderData.unitPrice || 0) * (orderData.quantity || 1);
                const result = await Order.findOneAndUpdate(
                  { orderId: orderData.orderId },
                  {
                    $set: {
                      date: orderData.date,
                      deliveryAddress: orderData.deliveryAddress,
                      quantity: orderData.quantity,
                      unitPrice: orderData.unitPrice,
                      totalAmount: calculatedTotal,
                      status: orderData.status,
                      paymentStatus: orderData.paymentStatus,
                      paymentMode: orderData.paymentMode,
                      mode: orderData.mode,
                      billingMonth: orderData.billingMonth,
                      billingYear: orderData.billingYear,
                      customerName: orderData.customerName,
                      customerPhone: orderData.customerPhone,
                      source: orderData.source || 'excel',
                      updatedAt: new Date(),
                    },
                  },
                  { new: true, runValidators: true }
                );
                if (result) updated++;
              } catch (updateError) {
                console.error(
                  `[uploadExcel] Error updating order ${orderData.orderId}:`,
                  updateError.message
                );
                insertionErrors.push({
                  index: processedOrders.indexOf(orderData) + 2,
                  error: `Update failed: ${updateError.message}`,
                });
              }
            }
          }

          // Insert new with IDs
          if (ordersToInsert.length > 0) {
            try {
              const result = await Order.insertMany(ordersToInsert, {
                ordered: false,
                rawResult: false,
              });
              imported += Array.isArray(result) ? result.length : 0;
            } catch (insertError) {
              console.error('[uploadExcel] Error in bulk insert:', insertError.message);
              for (const orderData of ordersToInsert) {
                try {
                  await Order.create(orderData);
                  imported++;
                } catch (individualError) {
                  insertionErrors.push({
                    index: processedOrders.indexOf(orderData) + 2,
                    error: individualError.message,
                  });
                }
              }
            }
          }
        }

        // Insert orders without IDs
        if (ordersWithoutIds.length > 0) {
          // NOTE: Order IDs must be provided in the upload file - we don't auto-generate them
          // Skip orders without IDs and report as errors
          ordersWithoutIds.forEach((order) => {
            skipped++;
            insertionErrors.push({
              index: processedOrders.indexOf(order) + 2,
              error: 'Order ID is required. Please provide Order ID in the upload file.',
            });
          });

          // Orders without IDs have been skipped and reported as errors above
          // No need to insert anything - all orders must have Order IDs from the upload file
        }
      } catch (bulkError) {
        console.error('[uploadExcel] ❌ Error processing orders:', bulkError.message);
        insertionErrors.push({ index: 0, error: `Processing error: ${bulkError.message}` });
      }
    }

    const totalErrors = insertionErrors.length;

    return Response.json(
      {
        success: true,
        data: {
          imported,
          updated,
          skipped,
          total: imported + updated,
          errors: totalErrors,
          validationErrors: validationErrors.length,
          errorDetails: insertionErrors,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle authentication/authorization errors
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(error.status, error.message || 'Authentication failed');
    }

    console.error('[uploadExcel] ❌ Unexpected error:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to process Excel file',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
