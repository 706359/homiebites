export function formatCurrency(amount) {
  const n = Number(amount);
  if (isNaN(n)) return '₹0';
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
}

export function isPendingStatus(status, paymentStatus) {
  const s = (status || '').toLowerCase();
  const p = (paymentStatus || '').toLowerCase();
  if (p === 'paid') return false;
  if (s === 'paid' || s === 'delivered') return false;
  return s === 'unpaid' || s === 'pending' || p === 'pending' || !s || !p;
}

export function getOrderAmount(order) {
  if (order.totalAmount != null && !isNaN(Number(order.totalAmount)))
    return Number(order.totalAmount);
  if (order.total != null && !isNaN(Number(order.total))) return Number(order.total);
  const q = Math.max(1, parseInt(order.quantity, 10) || 1);
  const p = parseFloat(order.unitPrice) || 0;
  return q * p;
}

export function getTotalRevenue(orders) {
  return (orders || []).reduce((sum, o) => sum + getOrderAmount(o), 0);
}

export function parseOrderDate(v) {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v.getTime())) return v;
  if (typeof v === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(v)) return new Date(v);
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
