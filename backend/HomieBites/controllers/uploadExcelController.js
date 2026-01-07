import XLSX from 'xlsx';
import Order from '../models/Order.js';

export async function uploadExcel(req, res) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    let workbook;
    try {
      workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    } catch (err) {
      return res.status(400).json({ success: false, error: 'Invalid Excel file' });
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
    if (!worksheet) return res.status(400).json({ success: false, error: 'Sheet not found' });
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    });
    if (!jsonData || jsonData.length < 2) {
      return res.status(400).json({ success: false, error: 'Excel sheet is empty or has no data' });
    }
    const headers = jsonData[0].map((h) => String(h || '').trim());
    const rows = jsonData.slice(1);

    // Parse upload options from request body
    let uploadOptions = {};
    try {
      if (req.body.options) {
        uploadOptions =
          typeof req.body.options === 'string' ? JSON.parse(req.body.options) : req.body.options;
      }
    } catch (e) {
      console.warn('[uploadExcel] Could not parse upload options:', e.message);
    }
    const updateExisting = uploadOptions.updateExisting !== false; // Default to true
    const skipDuplicates = uploadOptions.skipDuplicates !== false; // Default to true

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
          // Extract Order ID if present
          if (key.includes('order id') || key.includes('orderid') || key === 'orderid') {
            order.orderId = String(value || '').trim();
          }
          if (key.includes('date')) order.date = value;
          else if (
            key.includes('delivery address') ||
            (key.includes('address') && !key.includes('billing'))
          )
            order.deliveryAddress = String(value || '').trim();
          else if (key.includes('quantity') || key.includes('qty'))
            order.quantity = Number(value) || 1;
          else if (key.includes('unit price') || (key.includes('price') && !key.includes('total')))
            order.unitPrice = parseFloat(String(value || '').replace(/[₹,]/g, '')) || 0;
          else if (
            key.includes('total amount') ||
            (key.includes('total') && !key.includes('quantity'))
          )
            order.totalAmount = parseFloat(String(value || '').replace(/[₹,]/g, '')) || 0;
          else if (key.includes('status')) order.status = String(value || '');
          else if (
            key.includes('payment mode') ||
            key.includes('payment method') ||
            key === 'payment'
          )
            order.paymentMode = String(value || '');
          else if (key.includes('billing month')) order.billingMonth = String(value || '');
          // Reference Month removed - was only for Excel pivot tables
          else if (key === 'year') order.year = String(value || '');
          else if (key.includes('name') && (key.includes('customer') || key.includes('client')))
            order.customerName = String(value || '');
          else if (key.includes('phone') || key.includes('mobile') || key.includes('contact'))
            order.customerPhone = String(value || '');
          else {
            const sanitizedKey = key.replace(/[^a-z0-9]/g, '_');
            if (sanitizedKey) order[sanitizedKey] = value;
          }
        });
        if (!order.deliveryAddress) return;
        if (order.date) {
          const d = new Date(order.date);
          if (!isNaN(d.getTime())) order.date = d.toISOString();
          else order.date = new Date().toISOString();
        } else {
          order.date = new Date().toISOString();
        }
        // Ensure unitPrice is always present
        if (typeof order.unitPrice !== 'number' || isNaN(order.unitPrice)) {
          order.unitPrice = 0;
        }
        if (!order.totalAmount || order.totalAmount === 0) {
          order.totalAmount = (order.unitPrice || 0) * (order.quantity || 1);
        }
        ordersToImport.push(order);
      } catch (rowErr) {}
    });
    if (ordersToImport.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid orders found in Excel' });
    }

    // Process all orders and prepare for bulk insert
    const processedOrders = [];
    const validationErrors = []; // Errors during validation/processing
    const insertionErrors = []; // Errors during actual database insertion

    for (let i = 0; i < ordersToImport.length; i++) {
      try {
        const od = ordersToImport[i];

        // Parse and validate date
        let orderDate;
        if (od.date) {
          orderDate = new Date(od.date);
          if (isNaN(orderDate.getTime())) {
            validationErrors.push({
              index: i + 2,
              error: 'Invalid date format',
            });
            continue;
          }
        } else {
          orderDate = new Date();
        }

        // Calculate derived fields from validated date
        const billingMonth = orderDate.getMonth() + 1;
        const billingYear = orderDate.getFullYear();

        // Validate required fields
        if (!od.deliveryAddress || !od.deliveryAddress.trim()) {
          validationErrors.push({
            index: i + 2,
            error: 'Missing required field: deliveryAddress',
          });
          continue;
        }

        // Determine payment status from status
        const statusLower = String(od.status || 'DELIVERED').toLowerCase();
        const paymentStatus =
          statusLower === 'paid' ? 'Paid' : statusLower === 'unpaid' ? 'Unpaid' : 'Pending';

        // Ensure billingMonth is a number (1-12)
        const finalBillingMonth = od.billingMonth || od.billing_month;
        const finalBillingYear = od.year || od.billing_year;

        const processed = {
          // Include Order ID if present in Excel, otherwise will be auto-generated by pre-validate hook
          ...(od.orderId && od.orderId.trim() ? { orderId: String(od.orderId).trim() } : {}),
          date: orderDate,
          deliveryAddress: String(od.deliveryAddress).trim(),
          quantity: Number(od.quantity) || 1,
          unitPrice: typeof od.unitPrice === 'number' && !isNaN(od.unitPrice) ? od.unitPrice : 0,
          // totalAmount will be calculated by pre-save hook (quantity * unitPrice)
          status: od.status || 'DELIVERED',
          paymentStatus: paymentStatus,
          paymentMode: od.paymentMode || od.payment_mode || 'Online',
          mode: od.mode || 'Morning',
          // billingMonth and billingYear will be auto-calculated by pre-save hook if not provided
          // But we can set them explicitly if provided in Excel
          ...(finalBillingMonth ? { billingMonth: Number(finalBillingMonth) || billingMonth } : {}),
          ...(finalBillingYear ? { billingYear: Number(finalBillingYear) || billingYear } : {}),
          customerName: od.customerName || od.name || od.deliveryAddress,
          customerPhone: od.customerPhone || '',
          source: 'excel',
          // createdAt and updatedAt will be added by timestamps: true
        };

        processedOrders.push(processed);
      } catch (err) {
        validationErrors.push({ index: i + 2, error: err.message });
      }
    }

    // Check for duplicate Order IDs and handle updates/replacements
    let imported = 0;
    let updated = 0;
    let skipped = 0;

    if (processedOrders.length > 0) {
      try {
        console.log(`[uploadExcel] Processing ${processedOrders.length} orders...`);
        console.log(
          `[uploadExcel] Options: updateExisting=${updateExisting}, skipDuplicates=${skipDuplicates}`
        );

        // Separate orders with Order IDs and without
        const ordersWithIds = [];
        const ordersWithoutIds = [];

        processedOrders.forEach((order) => {
          if (order.orderId && order.orderId.trim()) {
            ordersWithIds.push(order);
          } else {
            ordersWithoutIds.push(order);
          }
        });

        // For orders with Order IDs: Check for duplicates and update/replace
        if (ordersWithIds.length > 0) {
          console.log(`[uploadExcel] Processing ${ordersWithIds.length} orders with Order IDs...`);

          // Get all existing Order IDs from database
          const existingOrderIds = await Order.find(
            { orderId: { $in: ordersWithIds.map((o) => o.orderId).filter(Boolean) } },
            { orderId: 1, _id: 1 }
          );
          const existingIdsSet = new Set(existingOrderIds.map((o) => o.orderId));

          const ordersToUpdate = [];
          const ordersToInsert = [];

          for (const order of ordersWithIds) {
            if (existingIdsSet.has(order.orderId)) {
              // Order ID exists - update existing record
              if (updateExisting) {
                ordersToUpdate.push(order);
              } else if (skipDuplicates) {
                skipped++;
                console.log(`[uploadExcel] Skipping duplicate Order ID: ${order.orderId}`);
              } else {
                ordersToInsert.push(order); // Will create duplicate
              }
            } else {
              // Order ID doesn't exist - insert new record
              ordersToInsert.push(order);
            }
          }

          // Update existing orders
          if (ordersToUpdate.length > 0) {
            console.log(`[uploadExcel] Updating ${ordersToUpdate.length} existing orders...`);
            for (const orderData of ordersToUpdate) {
              try {
                const result = await Order.findOneAndUpdate(
                  { orderId: orderData.orderId },
                  {
                    $set: {
                      date: orderData.date,
                      deliveryAddress: orderData.deliveryAddress,
                      quantity: orderData.quantity,
                      unitPrice: orderData.unitPrice,
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
                if (result) {
                  updated++;
                }
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

          // Insert new orders (without existing Order IDs)
          if (ordersToInsert.length > 0) {
            console.log(`[uploadExcel] Inserting ${ordersToInsert.length} new orders...`);
            try {
              const result = await Order.insertMany(ordersToInsert, {
                ordered: false,
                rawResult: false,
              });
              imported += Array.isArray(result) ? result.length : 0;
            } catch (insertError) {
              console.error('[uploadExcel] Error in bulk insert:', insertError.message);
              // Fallback to individual inserts
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

        // For orders without Order IDs: Insert as new (will auto-generate Order IDs)
        if (ordersWithoutIds.length > 0) {
          console.log(
            `[uploadExcel] Inserting ${ordersWithoutIds.length} orders without Order IDs (will auto-generate)...`
          );
          try {
            const result = await Order.insertMany(ordersWithoutIds, {
              ordered: false,
              rawResult: false,
            });
            imported += Array.isArray(result) ? result.length : 0;
          } catch (insertError) {
            console.error('[uploadExcel] Error inserting orders without IDs:', insertError.message);
            // Fallback to individual inserts
            for (const orderData of ordersWithoutIds) {
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
      } catch (bulkError) {
        console.error('[uploadExcel] ❌ Error processing orders:', bulkError.message);
        console.error('[uploadExcel] Error name:', bulkError.name);
        console.error('[uploadExcel] Error stack:', bulkError.stack);

        insertionErrors.push({
          index: 0,
          error: `Processing error: ${bulkError.message}`,
        });
      }
    }

    // Only count actual insertion errors, not validation errors
    // Validation errors are expected and filtered out before insertion
    const totalErrors = insertionErrors.length;

    console.log(
      `[uploadExcel] Summary: ${imported} imported, ${updated} updated, ${skipped} skipped, ${totalErrors} errors`
    );

    return res.status(201).json({
      success: true,
      data: {
        imported,
        updated,
        skipped,
        total: imported + updated, // Total records processed
        errors: totalErrors,
        validationErrors: validationErrors.length, // Info only
        errorDetails: insertionErrors, // Only actual insertion failures
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
