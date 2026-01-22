import ExcelJS from 'exceljs';
import connectDB from '../../../../lib/db.js';
import {
  createErrorResponse,
  isAdmin,
} from '../../../../lib/middleware/auth.js';
import Order from '../../../../lib/models/Order.js';

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
          if (cell.value instanceof Date) {
            value = cell.value;
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
          let parsedDate = null;
          const originalDateValue = order.date;

          if (typeof order.date === 'number') {
            const excelEpoch = new Date(Date.UTC(1899, 11, 30));
            const days = Math.floor(order.date);

            const adjustedDays = order.date >= 60 ? days - 1 : days;

            parsedDate = new Date(
              excelEpoch.getTime() + adjustedDays * 86400000
            );
          } else if (
            order.date instanceof Date &&
            !isNaN(order.date.getTime())
          ) {
            const localYear = order.date.getFullYear();
            const localMonth = order.date.getMonth();
            const localDay = order.date.getDate();

            parsedDate = new Date(
              Date.UTC(localYear, localMonth, localDay, 0, 0, 0, 0)
            );
          } else {
            const dateStr = String(order.date).trim();

            if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
              parsedDate = new Date(dateStr + 'T00:00:00Z');
            } else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
              const parts = dateStr.split('/');
              const part1 = parseInt(parts[0]);
              const part2 = parseInt(parts[1]);
              let year = parseInt(parts[2]);

              if (year < 100) {
                year = year < 50 ? 2000 + year : 1900 + year;
              }

              if (part1 <= 12 && part2 <= 31) {
                parsedDate = new Date(
                  Date.UTC(year, part1 - 1, part2, 0, 0, 0, 0)
                );
              } else if (part2 <= 12 && part1 <= 31) {
                parsedDate = new Date(
                  Date.UTC(year, part2 - 1, part1, 0, 0, 0, 0)
                );
              } else {
                parsedDate = new Date(
                  Date.UTC(year, part1 - 1, part2, 0, 0, 0, 0)
                );
              }
            } else if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(dateStr)) {
              const parts = dateStr.split('-');
              let year = parseInt(parts[2]);
              const yearFull =
                year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;

              parsedDate = new Date(
                Date.UTC(
                  yearFull,
                  parseInt(parts[1]) - 1,
                  parseInt(parts[0]),
                  0,
                  0,
                  0,
                  0
                )
              );
            } else if (/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/i.test(dateStr)) {
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
              const monthIndex = monthNames.findIndex((m) =>
                monthStr.startsWith(m)
              );
              if (monthIndex !== -1 && day > 0 && day <= 31) {
                if (year < 100) {
                  year = year < 50 ? 2000 + year : 1900 + year;
                }
                parsedDate = new Date(
                  Date.UTC(year, monthIndex, day, 0, 0, 0, 0)
                );
              }
            } else {
              parsedDate = new Date(dateStr);
            }
          }

          if (parsedDate && !isNaN(parsedDate.getTime())) {
            const minDate = new Date(2000, 0, 1);
            const maxDate = new Date(2100, 11, 31);

            if (parsedDate >= minDate && parsedDate <= maxDate) {
              const utcYear = parsedDate.getUTCFullYear();
              const utcMonth = parsedDate.getUTCMonth();
              const utcDay = parsedDate.getUTCDate();

              order.date = new Date(
                Date.UTC(utcYear, utcMonth, utcDay, 0, 0, 0, 0)
              );

              order._billingMonth = utcMonth + 1;
              order._billingYear = utcYear;
            } else {
              console.error(
                `[uploadExcel] ❌ Date out of range: ${parsedDate.toISOString()}, original: ${originalDateValue}`
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
          if (od.date instanceof Date) {
            orderDate = od.date;
          } else if (typeof od.date === 'string') {
            orderDate = new Date(od.date + 'T00:00:00Z');
          } else {
            orderDate = new Date(od.date);
          }

          if (isNaN(orderDate.getTime())) {
            validationErrors.push({
              index: i + 2,
              error: 'Invalid date format',
            });
            continue;
          }
        } else {
          validationErrors.push({ index: i + 2, error: 'Date is required' });
          continue;
        }

        const billingMonth = od._billingMonth || orderDate.getUTCMonth() + 1;
        const billingYear = od._billingYear || orderDate.getUTCFullYear();

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

        const calculatedTotalAmount =
          (Number(od.quantity) || 1) *
          (typeof od.unitPrice === 'number' && !isNaN(od.unitPrice)
            ? od.unitPrice
            : 0);

        const finalBillingMonth = od._billingMonth || billingMonth;
        const finalBillingYear = od._billingYear || billingYear;

        const processed = {
          ...(od.orderId && od.orderId.trim()
            ? { orderId: String(od.orderId).trim() }
            : {}),
          date: od.date,
          billingMonth: finalBillingMonth,
          billingYear: finalBillingYear,
          deliveryAddress: String(od.deliveryAddress).trim(),
          quantity: Number(od.quantity) || 1,
          unitPrice:
            typeof od.unitPrice === 'number' && !isNaN(od.unitPrice)
              ? od.unitPrice
              : 0,
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
