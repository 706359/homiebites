import ExcelJS from 'exceljs';
import connectDB from '../../../../lib/db.js';
import {
  createErrorResponse,
  isAdmin,
} from '../../../../lib/middleware/auth.js';
import Order from '../../../../lib/models/Order.js';
import { parseOrderDate } from '../../../../components/admin/utils/dateUtils.js';

export async function POST(request) {
  try {
    await connectDB();
    await isAdmin(request);

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let workbook;
    try {
      workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
    } catch (err) {
      console.error('[uploadExcel] Error loading Excel file:', err);
      return Response.json(
        { success: false, error: 'Invalid Excel file' },
        { status: 400 }
      );
    }

    let worksheet = null;
    const allDataSheet = workbook.worksheets.find(
      (ws) => ws.name.toLowerCase().replace(/\s+/g, '') === 'alldata'
    );
    if (allDataSheet) {
      worksheet = allDataSheet;
    } else if (workbook.worksheets.length > 0) {
      worksheet = workbook.worksheets[0];
    }

    if (!worksheet) {
      return Response.json(
        { success: false, error: 'Sheet not found' },
        { status: 400 }
      );
    }

    const jsonData = [];
    let maxColumnCount = 0;

    worksheet.eachRow((row, rowNumber) => {
      const columnCount = row.cellCount;
      if (columnCount > maxColumnCount) {
        maxColumnCount = columnCount;
      }
    });

    worksheet.eachRow((row, rowNumber) => {
      const rowData = [];

      for (let colNumber = 1; colNumber <= maxColumnCount; colNumber++) {
        const cell = row.getCell(colNumber);
        let value = '';

        if (cell.value !== null && cell.value !== undefined) {
          // For date cells, try to get the formatted text first to preserve the exact date
          if (cell.value instanceof Date) {
            // Try to get the formatted text value from Excel to preserve the original date format
            try {
              // ExcelJS provides text property for formatted cell values
              const formattedValue = cell.text;
              // If we have a formatted text value, use it to preserve the exact date as displayed
              if (formattedValue && typeof formattedValue === 'string' && formattedValue.trim()) {
                value = formattedValue.trim();
              } else {
                // Fallback to Date object - will be handled in date parsing
                value = cell.value;
              }
            } catch (e) {
              value = cell.value;
            }
          } else if (typeof cell.value === 'object') {
            if (cell.value.text !== undefined) {
              value = cell.value.text;
            } else if (cell.value.result !== undefined) {
              value = cell.value.result;
            } else if (cell.value.richText) {
              value = cell.value.richText.map((rt) => rt.text).join('');
            } else {
              value = String(cell.value);
            }
          } else {
            value = cell.value;
          }
        }
        rowData.push(value);
      }
      jsonData.push(rowData);
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
        uploadOptions =
          typeof optionsStr === 'string' ? JSON.parse(optionsStr) : optionsStr;
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

          if (
            key.includes('order id') ||
            key.includes('orderid') ||
            key === 'orderid'
          ) {
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
            order.unitPrice =
              parseFloat(String(value || '').replace(/[₹,]/g, '')) || 0;
          } else if (
            key.includes('total amount') ||
            (key.includes('total') && !key.includes('quantity'))
          ) {
            order.totalAmount =
              parseFloat(String(value || '').replace(/[₹,]/g, '')) || 0;
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
          } else if (
            key.includes('name') &&
            (key.includes('customer') || key.includes('client'))
          ) {
            order.customerName = String(value || '');
          } else if (
            key.includes('phone') ||
            key.includes('mobile') ||
            key.includes('contact')
          ) {
            order.customerPhone = String(value || '');
          } else {
            const sanitizedKey = key.replace(/[^a-z0-9]/g, '_');
            if (sanitizedKey) order[sanitizedKey] = value;
          }
        });

        if (!order.deliveryAddress) return;

        if (
          order.date !== undefined &&
          order.date !== null &&
          order.date !== ''
        ) {
          let day = null;
          let month = null;
          let year = null;
          const originalDateValue = order.date;

          // Extract date components directly from string to avoid timezone issues
          if (typeof order.date === 'number') {
            // Excel serial date number
            const excelEpoch = new Date(Date.UTC(1899, 11, 30));
            const days = Math.floor(order.date);
            const adjustedDays = order.date >= 60 ? days - 1 : days;
            const tempDate = new Date(
              excelEpoch.getTime() + adjustedDays * 86400000
            );
            day = tempDate.getUTCDate();
            month = tempDate.getUTCMonth();
            year = tempDate.getUTCFullYear();
          } else if (order.date instanceof Date && !isNaN(order.date.getTime())) {
            // Excel Date objects are typically stored in UTC
            // Use UTC methods to extract the exact date components to avoid timezone shifts
            day = order.date.getUTCDate();
            month = order.date.getUTCMonth();
            year = order.date.getUTCFullYear();
          } else {
            // Parse from string - extract components directly from string format
            const dateStr = String(order.date).trim();
            
            // Try to parse "5-Feb-24" or "5-Feb-2024" format
            if (/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/i.test(dateStr)) {
              const parts = dateStr.split('-');
              day = parseInt(parts[0], 10);
              const monthStr = parts[1].toLowerCase();
              year = parseInt(parts[2], 10);
              
              const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
              month = monthNames.findIndex((m) => monthStr.startsWith(m));
              
              if (year < 100) {
                year = year < 50 ? 2000 + year : 1900 + year;
              }
            }
            // Try to parse "DD/MM/YYYY" or "MM/DD/YYYY" format
            else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
              const parts = dateStr.split('/');
              // Assume DD/MM/YYYY format (Indian format)
              day = parseInt(parts[0], 10);
              month = parseInt(parts[1], 10) - 1;
              year = parseInt(parts[2], 10);
              if (year < 100) {
                year = year < 50 ? 2000 + year : 1900 + year;
              }
            }
            // Try to parse "YYYY-MM-DD" format
            else if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
              const parts = dateStr.split('-');
              year = parseInt(parts[0], 10);
              month = parseInt(parts[1], 10) - 1;
              day = parseInt(parts[2], 10);
            }
            // Fallback: use parseOrderDate and extract components
            else {
              const parsedDate = parseOrderDate(order.date);
              if (parsedDate && !isNaN(parsedDate.getTime())) {
                day = parsedDate.getDate();
                month = parsedDate.getMonth();
                year = parsedDate.getFullYear();
              }
            }
          }

          // Create date using extracted components in Indian timezone context
          if (day !== null && month !== null && year !== null && day > 0 && day <= 31 && month >= 0 && month <= 11) {
            const minDate = new Date(2000, 0, 1);
            const maxDate = new Date(2100, 11, 31);
            const finalDate = new Date(year, month, day, 0, 0, 0, 0);

            if (finalDate >= minDate && finalDate <= maxDate) {
              // Store the date with exact components (no timezone conversion)
              order.date = finalDate;
              order._billingMonth = month + 1;
              order._billingYear = year;
              
              // Debug logging to verify date parsing
              if (process.env.NODE_ENV === 'development') {
                console.log(`[uploadExcel] Parsed date: original="${originalDateValue}", extracted=${year}-${month + 1}-${day}, finalDate=${finalDate.toISOString()}`);
              }
            } else {
              console.error(
                `[uploadExcel] ❌ Date out of range: ${year}-${month + 1}-${day}, original: ${originalDateValue}`
              );
              order.date = undefined;
            }
          } else {
            console.error(
              `[uploadExcel] ❌ Failed to parse date: "${originalDateValue}"`
            );
            order.date = undefined;
          }
        } else {
          console.warn(`[uploadExcel] ⚠️ No date provided, skipping order`);
          return;
        }

        if (!order.date || order.date === undefined) {
          console.warn(
            `[uploadExcel] ⚠️ Skipping order with invalid/missing date`
          );
          return;
        }

        if (typeof order.unitPrice !== 'number' || isNaN(order.unitPrice)) {
          order.unitPrice = 0;
        }
        // Only calculate totalAmount if it's not already set from Excel file
        // This preserves the total amount from the Excel file (even if it's 0)
        if (order.totalAmount === undefined || order.totalAmount === null || isNaN(order.totalAmount)) {
          order.totalAmount = (order.unitPrice || 0) * (order.quantity || 1);
        }
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

        // The date should already be parsed correctly in the previous step
        // Use the date directly from od.date which was set with correct components
        if (!od.date || !(od.date instanceof Date) || isNaN(od.date.getTime())) {
          validationErrors.push({
            index: i + 2,
            error: 'Invalid date format',
          });
          continue;
        }

        // Use the billing month/year that were set during parsing, or extract from the date
        // Extract using local date methods since the date was created with local components
        const billingMonth = od._billingMonth || (od.date.getMonth() + 1);
        const billingYear = od._billingYear || od.date.getFullYear();

        if (!od.deliveryAddress || !od.deliveryAddress.trim()) {
          validationErrors.push({
            index: i + 2,
            error: 'Missing required field: deliveryAddress',
          });
          continue;
        }

        const statusLower = String(od.status || 'DELIVERED').toLowerCase();
        const paymentStatus =
          statusLower === 'paid'
            ? 'Paid'
            : statusLower === 'unpaid'
              ? 'Unpaid'
              : 'Pending';

        // Use stored totalAmount/total if present, otherwise calculate from quantity * unitPrice
        let finalTotalAmount = null;
        if (od.totalAmount !== undefined && od.totalAmount !== null) {
          const parsed = parseFloat(String(od.totalAmount));
          if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0) {
            finalTotalAmount = parsed;
          }
        }
        if (finalTotalAmount === null && od.total !== undefined && od.total !== null) {
          const parsed = parseFloat(String(od.total));
          if (!isNaN(parsed) && isFinite(parsed) && parsed >= 0) {
            finalTotalAmount = parsed;
          }
        }
        // Only calculate if totalAmount/total is not present
        if (finalTotalAmount === null) {
          finalTotalAmount =
            (Number(od.quantity) || 1) *
            (typeof od.unitPrice === 'number' && !isNaN(od.unitPrice)
              ? od.unitPrice
              : 0);
        }

        const finalBillingMonth = od._billingMonth || billingMonth;
        const finalBillingYear = od._billingYear || billingYear;

        const processed = {
          ...(od.orderId && od.orderId.trim()
            ? { orderId: String(od.orderId).trim() }
            : {}),
          date: od.date, // Date already set with correct components
          billingMonth: finalBillingMonth,
          billingYear: finalBillingYear,
          deliveryAddress: String(od.deliveryAddress).trim(),
          quantity: Number(od.quantity) || 1,
          unitPrice:
            typeof od.unitPrice === 'number' && !isNaN(od.unitPrice)
              ? od.unitPrice
              : 0,
          totalAmount: finalTotalAmount,
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

        if (ordersWithIds.length > 0) {
          const existingOrderIds = await Order.find(
            {
              orderId: {
                $in: ordersWithIds.map((o) => o.orderId).filter(Boolean),
              },
            },
            { orderId: 1, _id: 1 }
          );
          const existingIdsSet = new Set(
            existingOrderIds.map((o) => o.orderId)
          );

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

          if (ordersToUpdate.length > 0) {
            for (const orderData of ordersToUpdate) {
              try {
                const calculatedTotal =
                  (orderData.unitPrice || 0) * (orderData.quantity || 1);
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

          if (ordersToInsert.length > 0) {
            try {
              const result = await Order.insertMany(ordersToInsert, {
                ordered: false,
                rawResult: false,
              });
              imported += Array.isArray(result) ? result.length : 0;
            } catch (insertError) {
              console.error(
                '[uploadExcel] Error in bulk insert:',
                insertError.message
              );
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

        if (ordersWithoutIds.length > 0) {
          ordersWithoutIds.forEach((order) => {
            skipped++;
            insertionErrors.push({
              index: processedOrders.indexOf(order) + 2,
              error:
                'Order ID is required. Please provide Order ID in the upload file.',
            });
          });
        }
      } catch (bulkError) {
        console.error(
          '[uploadExcel] ❌ Error processing orders:',
          bulkError.message
        );
        insertionErrors.push({
          index: 0,
          error: `Processing error: ${bulkError.message}`,
        });
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
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(
        error.status,
        error.message || 'Authentication failed'
      );
    }

    console.error('[uploadExcel] ❌ Unexpected error:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to process Excel file',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
