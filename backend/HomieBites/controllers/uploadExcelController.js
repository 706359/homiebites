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
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    if (!jsonData || jsonData.length < 2) {
      return res.status(400).json({ success: false, error: 'Excel sheet is empty or has no data' });
    }
    const headers = jsonData[0].map((h) => String(h || '').trim());
    const rows = jsonData.slice(1);
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
          else if (key.includes('reference month')) order.referenceMonth = String(value || '');
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
    const imported = [];
    const errors = [];
    for (let i = 0; i < ordersToImport.length; i++) {
      try {
        const od = ordersToImport[i];
        const processed = {
          ...od,
          status: od.status || 'DELIVERED',
          paymentMode: od.paymentMode || od.payment_mode || 'Online',
          billingMonth: od.billingMonth || od.billing_month || '',
          referenceMonth: od.referenceMonth || od.reference_month || '',
          year:
            od.year || od.billing_year || (od.date ? String(new Date(od.date).getFullYear()) : ''),
          totalAmount: od.totalAmount || od.total || 0,
          customerName: od.customerName || od.name || od.deliveryAddress,
          customerPhone: od.customerPhone || '',
          unitPrice: typeof od.unitPrice === 'number' ? od.unitPrice : 0,
          source: 'excel',
        };
        const created = await Order.create(processed);
        imported.push(created);
      } catch (err) {
        errors.push({ index: i, error: err.message });
      }
    }
    return res.status(201).json({
      success: true,
      data: { imported: imported.length, errors: errors.length, orders: imported, errors },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
