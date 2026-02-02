import connectDB from '../../../../lib/db.js';
import {
  createErrorResponse,
  isAdmin,
} from '../../../../lib/middleware/auth.js';
import Order from '../../../../lib/models/Order.js';
import { parseOrderDate } from '../../../../components/admin/utils/dateUtils.js';

/**
 * Google Sheet sync: admin-only. isAdmin(request) enforces JWT; GOOGLE_SHEET_ID
 * is read server-side from env only (never sent to client). Sheet must be
 * "Anyone with the link can view" for CSV export to work; keep that link
 * private so only your server can use it.
 */

/** Parse a single CSV line respecting quoted fields (handles commas inside quotes). */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (inQuotes) {
      current += c;
    } else if (c === ',') {
      result.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

/** Map header + row to order object (same semantics as upload-excel). */
function rowToOrder(headers, row) {
  const order = {};
  headers.forEach((header, colIdx) => {
    const key = String(header || '').toLowerCase().trim();
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
    } else if (key.includes('mode')) {
      order.mode = String(value || 'Morning');
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
    }
  });
  return order;
}

/** Parse date from sheet value (string or number) into Date; set order._billingMonth/Year. */
function parseOrderDateFromSheet(order) {
  if (
    order.date === undefined ||
    order.date === null ||
    order.date === ''
  ) {
    return false;
  }
  let day = null;
  let month = null;
  let year = null;
  const dateStr = String(order.date).trim();

  if (/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/i.test(dateStr)) {
    const parts = dateStr.split('-');
    day = parseInt(parts[0], 10);
    const monthNames = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    ];
    month = monthNames.findIndex((m) =>
      parts[1].toLowerCase().startsWith(m)
    );
    year = parseInt(parts[2], 10);
    if (year < 100) year = year < 50 ? 2000 + year : 1900 + year;
  } else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
    const parts = dateStr.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
    if (year < 100) year = year < 50 ? 2000 + year : 1900 + year;
  } else if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const parts = dateStr.split(/[T\s]/)[0].split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  } else {
    const parsed = parseOrderDate(order.date);
    if (parsed && !isNaN(parsed.getTime())) {
      day = parsed.getDate();
      month = parsed.getMonth();
      year = parsed.getFullYear();
    }
  }

  if (
    day === null ||
    month === null ||
    year === null ||
    day < 1 ||
    day > 31 ||
    month < 0 ||
    month > 11
  ) {
    return false;
  }
  const finalDate = new Date(year, month, day, 0, 0, 0, 0);
  if (
    isNaN(finalDate.getTime()) ||
    finalDate < new Date(2000, 0, 1) ||
    finalDate > new Date(2100, 11, 31)
  ) {
    return false;
  }
  order.date = finalDate;
  order._billingMonth = month + 1;
  order._billingYear = year;
  return true;
}

export async function POST(request) {
  try {
    await connectDB();
    await isAdmin(request);

    const sheetId =
      process.env.GOOGLE_SHEET_ID ||
      (request.headers.get('content-type')?.includes('application/json')
        ? (await request.json().catch(() => ({}))).sheetId
        : null);
    const gid = process.env.GOOGLE_SHEET_GID || '0';

    if (!sheetId || !sheetId.trim()) {
      return Response.json(
        {
          success: false,
          error:
            'Google Sheet not configured. Set GOOGLE_SHEET_ID in .env (or send sheetId in request body).',
        },
        { status: 400 }
      );
    }

    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId.trim()}/export?format=csv&gid=${gid}`;
    const fetchTimeoutMs = 8000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetchTimeoutMs);
    let res;
    try {
      res = await fetch(csvUrl, {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/csv,text/plain,*/*',
        },
      });
      clearTimeout(timeoutId);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.error('[syncGoogleSheet] Fetch error:', fetchErr);
      const isTimeout = fetchErr?.name === 'AbortError';
      return Response.json(
        {
          success: false,
          error: isTimeout
            ? 'Google Sheet took too long to respond. Try again.'
            : 'Could not fetch Google Sheet. Check that the sheet is published (link sharing) or ID is correct.',
        },
        { status: 502 }
      );
    }

    if (!res.ok) {
      const hint =
        res.status === 401
          ? ' Share the sheet: click Share → set “General access” to “Anyone with the link” → Viewer → Done.'
          : '';
      return Response.json(
        {
          success: false,
          error: `Google Sheet returned ${res.status}. Ensure the sheet is shared (Anyone with the link can view) or use the correct Sheet ID.${hint}`,
        },
        { status: 502 }
      );
    }

    const text = await res.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) {
      return Response.json(
        { success: false, error: 'Sheet has no data rows (need header + at least one row).' },
        { status: 400 }
      );
    }

    const headers = parseCSVLine(lines[0]).map((h) => String(h || '').trim());
    const rows = lines.slice(1).map((l) => parseCSVLine(l));

    const ordersToImport = [];
    for (const row of rows) {
      const order = rowToOrder(headers, row);
      if (!order.deliveryAddress) continue;
      if (!parseOrderDateFromSheet(order)) continue;
      if (typeof order.unitPrice !== 'number' || isNaN(order.unitPrice)) {
        order.unitPrice = 0;
      }
      if (
        order.totalAmount === undefined ||
        order.totalAmount === null ||
        isNaN(order.totalAmount)
      ) {
        order.totalAmount = (order.unitPrice || 0) * (order.quantity || 1);
      }
      ordersToImport.push(order);
    }

    if (ordersToImport.length === 0) {
      return Response.json(
        { success: false, error: 'No valid orders found in the sheet (need date, delivery address, and optional order ID).' },
        { status: 400 }
      );
    }

    const statusLower = (s) => String(s || 'DELIVERED').toLowerCase();
    const paymentStatus = (s) =>
      statusLower(s) === 'paid'
        ? 'Paid'
        : statusLower(s) === 'unpaid'
          ? 'Unpaid'
          : 'Pending';

    const processedOrders = ordersToImport
      .filter((od) => od.date && !isNaN(od.date.getTime()) && od.deliveryAddress?.trim())
      .map((od) => ({
        ...(od.orderId?.trim() ? { orderId: String(od.orderId).trim() } : {}),
        date: od.date,
        billingMonth: od._billingMonth ?? od.date.getMonth() + 1,
        billingYear: od._billingYear ?? od.date.getFullYear(),
        deliveryAddress: String(od.deliveryAddress).trim(),
        quantity: Number(od.quantity) || 1,
        unitPrice:
          typeof od.unitPrice === 'number' && !isNaN(od.unitPrice)
            ? od.unitPrice
            : 0,
        totalAmount:
          od.totalAmount != null && !isNaN(parseFloat(od.totalAmount))
            ? parseFloat(od.totalAmount)
            : (od.unitPrice || 0) * (od.quantity || 1),
        status: od.status || 'DELIVERED',
        paymentStatus: paymentStatus(od.status),
        paymentMode: od.paymentMode || od.payment_mode || 'Online',
        mode: od.mode || 'Morning',
        customerName: od.customerName || od.name || od.deliveryAddress,
        customerPhone: od.customerPhone || '',
        source: 'google_sheet',
      }))
      .filter((o) => o.orderId && o.orderId.trim());

    if (processedOrders.length === 0) {
      return Response.json(
        { success: false, error: 'No rows with Order ID. Add an Order ID column and values so rows can be synced.' },
        { status: 400 }
      );
    }

    const BULK_CHUNK = 1000;
    const ops = [];
    for (const orderData of processedOrders) {
      const totalToSet =
        orderData.totalAmount != null && !isNaN(parseFloat(orderData.totalAmount))
          ? parseFloat(orderData.totalAmount)
          : (orderData.unitPrice || 0) * (orderData.quantity || 1);
      const doc = {
        orderId: orderData.orderId,
        date: orderData.date,
        deliveryAddress: orderData.deliveryAddress,
        quantity: orderData.quantity,
        unitPrice: orderData.unitPrice,
        totalAmount: totalToSet,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        paymentMode: orderData.paymentMode,
        mode: orderData.mode,
        billingMonth: orderData.billingMonth,
        billingYear: orderData.billingYear,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        source: 'google_sheet',
      };
      const now = new Date();
      ops.push({
        updateOne: {
          filter: { orderId: orderData.orderId },
          update: {
            $set: { ...doc, updatedAt: now },
            $setOnInsert: { createdAt: now },
          },
          upsert: true,
        },
      });
    }

    let imported = 0;
    let updated = 0;
    const insertionErrors = [];
    for (let i = 0; i < ops.length; i += BULK_CHUNK) {
      const chunk = ops.slice(i, i + BULK_CHUNK);
      try {
        const result = await Order.bulkWrite(chunk, {
          ordered: false,
          bypassDocumentValidation: false,
        });
        imported += result.upsertedCount ?? 0;
        updated += result.modifiedCount ?? 0;
        if (result.writeErrors?.length) {
          for (const err of result.writeErrors) {
            const orderId = chunk[err.index]?.updateOne?.filter?.orderId;
            insertionErrors.push({ orderId, error: err.errmsg });
          }
        }
      } catch (e) {
        insertionErrors.push({ error: e.message });
      }
    }

    return Response.json({
      success: true,
      data: {
        imported,
        updated,
        total: imported + updated,
        errors: insertionErrors.length,
        errorDetails: insertionErrors,
      },
    });
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      return createErrorResponse(
        error.status,
        error.message || 'Authentication failed'
      );
    }
    console.error('[syncGoogleSheet] Error:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'Sync failed',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: error.status || 500 }
    );
  }
}
