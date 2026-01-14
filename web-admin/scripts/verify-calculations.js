import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CSV file
const csvPath = path.join(__dirname, '..', 'HomieBites All records.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

// Parse CSV (skip header)
const orders = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  if (parts.length >= 8) {
    const totalAmount = parseFloat(parts[5]) || 0; // Column 6 (0-indexed: 5)
    const status = parts[7]?.trim() || ''; // Column 8 (0-indexed: 7)
    const quantity = parseFloat(parts[3]) || 1; // Column 4
    const unitPrice = parseFloat(parts[4]) || 0; // Column 5
    
    orders.push({
      totalAmount,
      status,
      quantity,
      unitPrice,
      total: totalAmount, // Also check 'total' field
    });
  }
}

console.log(`Total orders in CSV: ${orders.length}\n`);

// Replicate getTotalRevenue logic
function getTotalRevenue(ordersList) {
  return ordersList.reduce((sum, order) => {
    if (!order) return sum;
    
    let amount = null;
    
    if (order.totalAmount !== undefined && order.totalAmount !== null && order.totalAmount !== 0) {
      amount = parseFloat(order.totalAmount);
    } else if (order.total !== undefined && order.total !== null && order.total !== 0) {
      amount = parseFloat(order.total);
    }
    
    if (amount === null || isNaN(amount) || amount === 0) {
      const qty = parseFloat(order.quantity || 1);
      const price = parseFloat(order.unitPrice || 0);
      amount = Math.round(qty * price);
    }
    
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
}

// Replicate isPendingStatus logic
function isPendingStatus(status, paymentStatus = null) {
  if (paymentStatus) {
    const ps = String(paymentStatus).toLowerCase().trim();
    if (ps === 'pending' || ps === 'unpaid') return true;
    if (ps === 'paid') return false;
  }
  
  if (!status) return true;
  const s = String(status).toLowerCase().trim();
  return s === 'pending' || s === 'unpaid';
}

// Calculate total revenue
const totalRevenue = getTotalRevenue(orders);
console.log(`Total Revenue (using code logic): ${totalRevenue}`);
console.log(`Expected Total Revenue: 374345`);
console.log(`Difference: ${374345 - totalRevenue}\n`);

// Calculate pending amount
const pendingOrders = orders.filter(o => isPendingStatus(o.status));
const pendingAmount = pendingOrders.reduce((sum, o) => {
  if (!o) return sum;
  
  let amount = null;
  
  if (o.totalAmount !== undefined && o.totalAmount !== null && o.totalAmount !== 0) {
    amount = parseFloat(o.totalAmount);
  } else if (o.total !== undefined && o.total !== null && o.total !== 0) {
    amount = parseFloat(o.total);
  }
  
  if (amount === null || isNaN(amount) || amount === 0) {
    const qty = parseFloat(o.quantity || 1);
    const price = parseFloat(o.unitPrice || 0);
    amount = Math.round(qty * price);
  }
  
  return sum + (isNaN(amount) ? 0 : amount);
}, 0);

console.log(`Pending Orders Count: ${pendingOrders.length}`);
console.log(`Pending Amount (using code logic): ${pendingAmount}`);
console.log(`Expected Pending Amount: 7858`);
console.log(`Difference: ${7858 - pendingAmount}\n`);

// Debug: Show orders with totalAmount = 0
const zeroAmountOrders = orders.filter(o => o.totalAmount === 0);
console.log(`Orders with totalAmount = 0: ${zeroAmountOrders.length}`);
if (zeroAmountOrders.length > 0) {
  console.log('Sample orders with totalAmount = 0:');
  zeroAmountOrders.slice(0, 5).forEach((o, i) => {
    const calculated = Math.round((o.quantity || 1) * (o.unitPrice || 0));
    console.log(`  Order ${i + 1}: qty=${o.quantity}, price=${o.unitPrice}, calculated=${calculated}`);
  });
}

// Debug: Show status distribution
const statusCounts = {};
orders.forEach(o => {
  const s = (o.status || '').toLowerCase().trim();
  statusCounts[s] = (statusCounts[s] || 0) + 1;
});
console.log('\nStatus distribution:');
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});
