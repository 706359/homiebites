import { useMemo, useState } from 'react';
import { getFilteredOrdersByDate, getProfitStats } from './utils/calculations.js';
import { parseOrderDate } from './utils/dateUtils.js';
import { formatCurrency, formatNumberIndian, getTotalRevenue, isPendingStatus } from './utils/orderUtils.js';
import PremiumLoader from './PremiumLoader.jsx';

const AnalyticsTab = ({ orders = [], loading = false, onViewDayDetails }) => {
  const [period, setPeriod] = useState('thisMonth'); // 'thisMonth', 'thisYear', 'custom'
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const now = new Date();

  // Get filtered orders based on period
  const periodOrders = useMemo(() => {
    switch (period) {
      case 'thisMonth':
        return getFilteredOrdersByDate(orders, 'month', '', '');
      case 'thisYear':
        return getFilteredOrdersByDate(orders, 'year', '', '');
      case 'custom': {
        if (!customFrom || !customTo) return orders;
        const from = new Date(customFrom);
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        return orders.filter((o) => {
          try {
            // Never use createdAt (today's date) as fallback - only use actual order date
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            return orderDate >= from && orderDate <= to;
          } catch (e) {
            return false;
          }
        });
      }
      default:
        return orders;
    }
  }, [orders, period, customFrom, customTo]);

  // Key Metrics - Only Important Ones
  const keyMetrics = useMemo(() => {
    const totalRevenue = getTotalRevenue(periodOrders);
    const totalOrders = periodOrders.length;
    
    // Calculate growth rate for indicator
    let previousPeriodOrders = [];
    if (period === 'thisMonth') {
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      previousPeriodOrders = orders.filter((o) => {
        try {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          if (!orderDate) return false;
          return (
            orderDate.getMonth() === lastMonth.getMonth() &&
            orderDate.getFullYear() === lastMonth.getFullYear()
          );
        } catch (e) {
          return false;
        }
      });
    } else if (period === 'thisYear') {
      const lastYear = now.getFullYear() - 1;
      previousPeriodOrders = orders.filter((o) => {
        try {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          if (!orderDate) return false;
          return orderDate.getFullYear() === lastYear;
        } catch (e) {
          return false;
        }
      });
    }
    const previousRevenue = getTotalRevenue(previousPeriodOrders);
    const growthRate =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : totalRevenue > 0
          ? Infinity
          : 0;

    // Calculate pending payments
    const pendingOrders = periodOrders.filter((o) => isPendingStatus(o.status));
    const pendingAmount = pendingOrders.reduce((sum, o) => {
      let amount = parseFloat(o.total || o.totalAmount || 0);
      if (isNaN(amount) || amount === 0) {
        const qty = parseFloat(o.quantity || 1);
        const price = parseFloat(o.unitPrice || 0);
        amount = qty * price;
      }
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    // Total customers (unique addresses)
    const uniqueAddresses = new Set(
      periodOrders.map((o) => o.deliveryAddress || o.customerAddress || o.address).filter(Boolean)
    );
    const totalCustomers = uniqueAddresses.size;

    // Average order value
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Calculate profit statistics
    const profitStats = getProfitStats(totalRevenue, 70, 30);

    return {
      totalRevenue,
      totalOrders,
      pendingAmount,
      pendingOrdersCount: pendingOrders.length,
      totalCustomers,
      avgOrderValue,
      growthRate,
      profitStats,
    };
  }, [periodOrders, orders, period, now]);

  // Monthly Revenue Trend (Last 12 Months from most recent order date)
  const monthlyRevenueTrend = useMemo(() => {
    // Find the most recent order date to determine the end date for "last 12 months"
    let mostRecentDate = now;
    const validOrders = orders.filter((o) => {
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      return orderDate !== null;
    });

    if (validOrders.length > 0) {
      const dates = validOrders
        .map((o) => parseOrderDate(o.date || o.order_date || null))
        .filter(Boolean);
      if (dates.length > 0) {
        mostRecentDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      }
    }

    const trend = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(mostRecentDate);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const monthOrders = orders.filter((o) => {
        try {
          // Never use createdAt (today's date) as fallback - only use actual order date
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          if (!orderDate) return false;
          return orderDate >= date && orderDate < nextMonth;
        } catch (e) {
          return false;
        }
      });

      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      trend.push({
        month: monthName,
        revenue: getTotalRevenue(monthOrders),
        orders: monthOrders.length,
      });
    }
    return trend;
  }, [orders]);

  const maxMonthlyRevenue = Math.max(...monthlyRevenueTrend.map((m) => m.revenue), 1);
  const peakMonth = monthlyRevenueTrend.reduce(
    (max, m) => (m.revenue > max.revenue ? m : max),
    monthlyRevenueTrend[0]
  );

  // Top 10 Delivery Areas
  const topAreas = useMemo(() => {
    const areaStats = {};
    periodOrders.forEach((o) => {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (addr) {
        if (!areaStats[addr]) {
          areaStats[addr] = { address: addr, orders: 0, revenue: 0 };
        }
        areaStats[addr].orders++;
        // Try total first, then totalAmount, then calculate from quantity * unitPrice
        let amount = parseFloat(o.total || o.totalAmount || 0);
        if (isNaN(amount) || amount === 0) {
          const qty = parseFloat(o.quantity || 1);
          const price = parseFloat(o.unitPrice || 0);
          amount = qty * price;
        }
        areaStats[addr].revenue += isNaN(amount) ? 0 : amount;
      }
    });
    return Object.values(areaStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [periodOrders]);

  const maxAreaRevenue = Math.max(...topAreas.map((a) => a.revenue), 1);

  // Orders by Day of Week
  const ordersByDay = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayStats = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    periodOrders.forEach((o) => {
      try {
        const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
        if (!orderDate) return;
        const dayName = days[orderDate.getDay()];
        dayStats[dayName]++;
      } catch (e) {
        // Ignore
      }
    });
    return days.map((day) => ({ day, count: dayStats[day] }));
  }, [periodOrders]);

  const maxDayOrders = Math.max(...ordersByDay.map((d) => d.count), 1);

  // Order Frequency Distribution
  const frequencyDistribution = useMemo(() => {
    const customerData = {};
    periodOrders.forEach((o) => {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (addr) {
        if (!customerData[addr]) {
          customerData[addr] = { orders: 0, spent: 0 };
        }
        customerData[addr].orders++;
        const amount = parseFloat(o.total || o.totalAmount || 0);
        if (isNaN(amount)) {
          const qty = parseFloat(o.quantity || 1);
          const price = parseFloat(o.unitPrice || 0);
          customerData[addr].spent += qty * price;
        } else {
          customerData[addr].spent += amount;
        }
      }
    });
    // Customer segmentation based on spending:
    // New: < ₹2,000
    // Regular: ₹2,000 - ₹7,999
    // VIP: ≥ ₹8,000
    // Super VIP: ≥ ₹15,000
    const oneTime = Object.values(customerData).filter((c) => c.orders === 1).length;
    const regular = Object.values(customerData).filter(
      (c) => c.spent >= 2000 && c.spent < 8000
    ).length;
    const vip = Object.values(customerData).filter(
      (c) => c.spent >= 8000 && c.spent < 15000
    ).length;
    const superVip = Object.values(customerData).filter((c) => c.spent >= 15000).length;
    return { oneTime, regular, vip, superVip };
  }, [periodOrders]);

  // Payment Mode Trends
  const paymentTrends = useMemo(() => {
    const trends = {};
    periodOrders.forEach((o) => {
      const mode = o.paymentMode || 'Not Set';
      if (!trends[mode]) {
        trends[mode] = { count: 0, amount: 0 };
      }
      trends[mode].count++;
      // Try total first, then totalAmount, then calculate from quantity * unitPrice
      let amount = parseFloat(o.total || o.totalAmount || 0);
      if (isNaN(amount) || amount === 0) {
        const qty = parseFloat(o.quantity || 1);
        const price = parseFloat(o.unitPrice || 0);
        amount = qty * price;
      }
      trends[mode].amount += isNaN(amount) ? 0 : amount;
    });
    return Object.entries(trends)
      .map(([mode, stats]) => ({ mode, ...stats }))
      .sort((a, b) => b.amount - a.amount);
  }, [periodOrders]);

  const totalPaymentAmount = paymentTrends.reduce((sum, t) => sum + t.amount, 0);

  // Top 7 Days All Time by Revenue
  const top20Days = useMemo(() => {
    const dayStats = {};
    
    // Group orders by date and sum amounts
    orders.forEach((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return;
        
        // Create a date key (YYYY-MM-DD format)
        const dateKey = orderDate.toISOString().split('T')[0];
        
        if (!dayStats[dateKey]) {
          dayStats[dateKey] = {
            date: dateKey,
            dateObj: orderDate,
            revenue: 0,
            orders: 0,
            orderIds: [], // Store order IDs for this day
          };
        }
        
        // Calculate amount for this order
        let amount = parseFloat(o.total || o.totalAmount || 0);
        if (isNaN(amount) || amount === 0) {
          const qty = parseFloat(o.quantity || 1);
          const price = parseFloat(o.unitPrice || 0);
          amount = qty * price;
        }
        
        dayStats[dateKey].revenue += isNaN(amount) ? 0 : amount;
        dayStats[dateKey].orders += 1;
        // Store order ID if available
        if (o.orderId || o._id) {
          dayStats[dateKey].orderIds.push(o.orderId || o._id);
        }
      } catch (e) {
        // Ignore invalid dates
      }
    });
    
    // Convert to array, sort by revenue descending, and take top 7
    return Object.values(dayStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 7)
      .map((day) => ({
        ...day,
        formattedDate: day.dateObj.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        shortDate: day.dateObj.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      }));
  }, [orders]);

  const maxDayRevenue = Math.max(...top20Days.map((d) => d.revenue), 1);

  // Helper function to escape CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Helper function to calculate order amount
  const getOrderAmount = (order) => {
    let amount = parseFloat(order.total || order.totalAmount || 0);
    if (isNaN(amount) || amount === 0) {
      const qty = parseFloat(order.quantity || 1);
      const price = parseFloat(order.unitPrice || 0);
      amount = qty * price;
    }
    return isNaN(amount) ? 0 : amount;
  };

  // Export reports
  const handleExportReport = (type) => {
    let csvContent = '';
    const reportDate = new Date().toISOString().split('T')[0];
    
    if (type === 'monthly') {
      // Monthly Report - Last 12 months
      csvContent = 'Month,Year,Revenue (₹),Orders,Average Order Value (₹)\n';
      monthlyRevenueTrend.forEach((m) => {
        const avgOrderValue = m.orders > 0 ? (m.revenue / m.orders).toFixed(2) : '0.00';
        csvContent += `${escapeCSV(m.month)},${escapeCSV(m.revenue)},${escapeCSV(m.orders)},${escapeCSV(avgOrderValue)}\n`;
      });
    } else if (type === 'quarterly') {
      // Quarterly Report - Last 4 quarters
      csvContent = 'Quarter,Year,Revenue (₹),Orders,Average Order Value (₹)\n';
      const quarters = [];
      
      // Get all unique years from orders
      const years = new Set();
      orders.forEach((o) => {
        try {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          if (orderDate) years.add(orderDate.getFullYear());
        } catch (e) {
          // Ignore
        }
      });
      
      const sortedYears = Array.from(years).sort((a, b) => b - a);
      
      // Process last 4 quarters from most recent year
      const mostRecentYear = sortedYears.length > 0 ? sortedYears[0] : now.getFullYear();
      
      for (let i = 3; i >= 0; i--) {
        const quarterStart = new Date(mostRecentYear, i * 3, 1);
        const quarterEnd = new Date(mostRecentYear, (i + 1) * 3, 0);
        quarterEnd.setHours(23, 59, 59, 999);
        
        const quarterOrders = orders.filter((o) => {
          try {
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            if (!orderDate) return false;
            return orderDate >= quarterStart && orderDate <= quarterEnd;
          } catch (e) {
            return false;
          }
        });
        
        const revenue = getTotalRevenue(quarterOrders);
        const orderCount = quarterOrders.length;
        const avgOrderValue = orderCount > 0 ? (revenue / orderCount).toFixed(2) : '0.00';
        
        quarters.push({
          quarter: `Q${i + 1}`,
          year: mostRecentYear,
          revenue: revenue.toFixed(2),
          orders: orderCount,
          avgOrderValue,
        });
      }
      
      quarters.forEach((q) => {
        csvContent += `${escapeCSV(q.quarter)},${escapeCSV(q.year)},${escapeCSV(q.revenue)},${escapeCSV(q.orders)},${escapeCSV(q.avgOrderValue)}\n`;
      });
    } else if (type === 'annual') {
      // Annual Report - All years
      csvContent = 'Year,Revenue (₹),Orders,Average Order Value (₹),Paid Orders,Unpaid Orders,Paid Amount (₹),Unpaid Amount (₹)\n';
      const years = {};
      
      orders.forEach((o) => {
        try {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          if (!orderDate) return;
          
          const year = orderDate.getFullYear();
          if (!years[year]) {
            years[year] = {
              year,
              revenue: 0,
              orders: 0,
              paidOrders: 0,
              unpaidOrders: 0,
              paidAmount: 0,
              unpaidAmount: 0,
            };
          }
          
          const amount = getOrderAmount(o);
          years[year].revenue += amount;
          years[year].orders++;
          
          const status = (o.status || '').toLowerCase();
          if (status === 'paid') {
            years[year].paidOrders++;
            years[year].paidAmount += amount;
          } else {
            years[year].unpaidOrders++;
            years[year].unpaidAmount += amount;
          }
        } catch (e) {
          // Ignore
        }
      });
      
      Object.values(years)
        .sort((a, b) => b.year - a.year)
        .forEach((y) => {
          const avgOrderValue = y.orders > 0 ? (y.revenue / y.orders).toFixed(2) : '0.00';
          csvContent += `${escapeCSV(y.year)},${escapeCSV(y.revenue.toFixed(2))},${escapeCSV(y.orders)},${escapeCSV(avgOrderValue)},${escapeCSV(y.paidOrders)},${escapeCSV(y.unpaidOrders)},${escapeCSV(y.paidAmount.toFixed(2))},${escapeCSV(y.unpaidAmount.toFixed(2))}\n`;
        });
    }

    // Add BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_report_${reportDate}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Analytics</h2>
        </div>
        <PremiumLoader message='Loading analytics...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      <div className='dashboard-with-sidebar'>
        <div className='dashboard-main-content'>
          {/* TIME PERIOD SELECTOR */}
          <div className='dashboard-card dashboard-card-spaced'>
        <div className='filter-container'>
          <div className='filter-field-group-standard min-width-160'>
            <label className='filter-label-standard'>
              <i className='fa-solid fa-calendar-alt filter-label-icon'></i>
              Time Period
            </label>
            <select
              className='input-field filter-input-standard'
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value='thisMonth'>This Month</option>
              <option value='thisYear'>This Year</option>
              <option value='custom'>Custom Range</option>
            </select>
          </div>
          {period === 'custom' && (
            <>
              <div className='filter-field-group-standard min-width-160'>
                <label className='filter-label-standard'>From Date</label>
                <input
                  type='date'
                  className='input-field filter-input-standard'
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                />
              </div>
              <div className='filter-field-group-standard min-width-160'>
                <label className='filter-label-standard'>To Date</label>
                <input
                  type='date'
                  className='input-field filter-input-standard'
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* KEY METRICS GRID - Only Important Metrics */}
      <div className='admin-stats'>
        <div className='stat-card'>
          <i className='fa-solid fa-rupee-sign'></i>
          <div>
            <h3>₹{formatCurrency(keyMetrics.totalRevenue)}</h3>
            <p>Total Revenue</p>
            {keyMetrics.growthRate !== 0 && (
              <p className='stat-card-subtitle'>
                {keyMetrics.growthRate === Infinity
                  ? 'New ↑'
                  : `${keyMetrics.growthRate >= 0 ? '+' : ''}${keyMetrics.growthRate.toFixed(1)}% ${keyMetrics.growthRate >= 0 ? '↑' : '↓'}`}
              </p>
            )}
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-shopping-cart' style={{ color: 'var(--admin-accent)' }}></i>
          <div>
            <h3>{keyMetrics.totalOrders}</h3>
            <p>Total Orders</p>
            <p className='stat-card-subtitle'>
              {period === 'thisMonth' ? 'Current month' : period === 'thisYear' ? 'This year' : 'Selected period'}
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-exclamation-triangle' style={{ color: 'var(--admin-warning)' }}></i>
          <div>
            <h3>₹{formatCurrency(keyMetrics.pendingAmount)}</h3>
            <p>Pending Payments</p>
            <p className='stat-card-subtitle'>
              {keyMetrics.pendingOrdersCount} {keyMetrics.pendingOrdersCount === 1 ? 'order' : 'orders'}
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-users' style={{ color: 'var(--admin-accent)' }}></i>
          <div>
            <h3>{keyMetrics.totalCustomers}</h3>
            <p>Total Customers</p>
            <p className='stat-card-subtitle'>
              Unique addresses
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-chart-line' style={{ color: 'var(--admin-success)' }}></i>
          <div>
            <h3>₹{formatCurrency(keyMetrics.avgOrderValue)}</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-chart-line stat-card-icon-success'></i>
          <div>
            <h3>₹{formatCurrency(keyMetrics.profitStats.profit)}</h3>
            <p>Profit After Expenses</p>
            <p className='stat-card-subtitle'>
              {keyMetrics.profitStats.profitMarginPercent.toFixed(1)}% margin
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-percent stat-card-icon-secondary'></i>
          <div>
            <h3>{keyMetrics.profitStats.profitMarginPercent.toFixed(1)}%</h3>
            <p>Profit Margin</p>
            <p className='stat-card-subtitle'>
              Target: {keyMetrics.profitStats.targetProfitMargin}%
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className='dashboard-grid-layout'>
        {/* Monthly Revenue Trend */}
        <div className='dashboard-grid-item full-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-chart-line' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Monthly Revenue Trend (Last 12M)
            </h3>
            <div
              style={{
                padding: '16px',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '1rem',
                  minHeight: '200px',
                  marginBottom: '16px',
                }}
              >
                {monthlyRevenueTrend.map((month, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '60px',
                        height: `${(month.revenue / maxMonthlyRevenue) * 180}px`,
                        minHeight: '10px',
                        background: 'var(--admin-accent, #449031)',
                        borderRadius: '8px 8px 0 0',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                      title={`${month.month}: ₹${formatCurrency(month.revenue)} (${
                        month.orders
                      } orders)`}
                    >
                      <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: '600' }}>
                        ₹{formatNumberIndian(month.revenue)}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--admin-text-light)',
                        textAlign: 'center',
                        fontWeight: '500',
                      }}
                    >
                      {month.month}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--admin-text-secondary)',
                  fontSize: '0.9rem',
                }}
              >
                Peak: ₹{formatCurrency(peakMonth.revenue)} ({peakMonth.month})
              </div>
            </div>
          </div>
        </div>

        {/* Top 10 Delivery Areas */}
        <div className='dashboard-grid-item full-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i
                className='fa-solid fa-map-marker-alt'
                style={{ fontSize: '1rem', opacity: 0.7 }}
              ></i>
              Top 10 Delivery Areas
            </h3>
            <div
              style={{
                padding: '16px',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              {topAreas.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px',
                    color: 'var(--admin-text-light)',
                  }}
                >
                  <i className='fa-solid fa-inbox' style={{ fontSize: '48px', opacity: 0.3 }}></i>
                  <p style={{ marginTop: '16px' }}>No delivery areas found</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {topAreas.map((area, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '12px',
                        background: idx % 2 === 0 ? 'transparent' : 'var(--admin-glass-border)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: '600',
                            color: 'var(--admin-text)',
                            fontSize: '0.95rem',
                          }}
                        >
                          {idx + 1}. {area.address}
                        </span>
                        <span
                          style={{
                            fontWeight: '700',
                            color: 'var(--admin-accent)',
                            fontSize: '0.95rem',
                          }}
                        >
                          ₹{formatCurrency(area.revenue)} ({area.orders}{' '}
                          {area.orders === 1 ? 'order' : 'orders'})
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '20px',
                          background: 'var(--admin-glass-border)',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            width: `${maxAreaRevenue > 0 ? (area.revenue / maxAreaRevenue) * 100 : 0}%`,
                            height: '100%',
                            background: 'var(--admin-accent, #449031)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease',
                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Payment Mode Trends */}
        <div className='dashboard-grid-item full-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-credit-card' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Payment Mode Trends
            </h3>
            <div
              style={{
                padding: '16px',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {paymentTrends.map((trend, idx) => {
                  // Calculate percentage: (amount / total) * 100, with accuracy based on total records / 100
                  const percentage =
                    totalPaymentAmount > 0
                      ? Math.min(
                          100,
                          parseFloat(((trend.amount / totalPaymentAmount) * 100).toFixed(2))
                        )
                      : 0;
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                          {trend.mode}
                        </span>
                        <span
                          style={{
                            fontWeight: '700',
                            color: 'var(--admin-accent)',
                            fontSize: '1rem',
                          }}
                        >
                          ₹{formatCurrency(trend.amount)} ({percentage.toFixed(2)}%)
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '28px',
                          background: 'var(--admin-glass-border)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'var(--admin-accent, #449031)',
                            borderRadius: '6px',
                            transition: 'width 0.5s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '0.5rem',
                          }}
                        >
                          {percentage > 15 && (
                            <span
                              style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600' }}
                            >
                              {percentage.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Top 7 Days All Time */}
        <div className='dashboard-grid-item full-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-trophy' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Top 7 Days All Time (By Revenue)
            </h3>
            <div
              style={{
                padding: '16px',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              {top20Days.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px',
                    color: 'var(--admin-text-light)',
                  }}
                >
                  <i className='fa-solid fa-inbox' style={{ fontSize: '48px', opacity: 0.3 }}></i>
                  <p style={{ marginTop: '16px' }}>No orders data available</p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '0.5rem',
                      minHeight: '250px',
                      marginBottom: '16px',
                      overflowX: 'auto',
                      paddingBottom: '8px',
                    }}
                  >
                    {top20Days.map((day, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: '1 1 0',
                          minWidth: '60px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            maxWidth: '80px',
                            height: `${(day.revenue / maxDayRevenue) * 200}px`,
                            minHeight: '10px',
                            background:
                              idx < 3
                                ? 'var(--admin-accent, #449031)'
                                : 'var(--admin-accent, #449031)',
                            borderRadius: '8px 8px 0 0',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: '0.5rem',
                            cursor: 'pointer',
                            boxShadow:
                              idx < 3
                                ? '0 4px 12px rgba(68, 144, 49, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                          }}
                          onClick={() => {
                            if (onViewDayDetails) {
                              onViewDayDetails(day.date);
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(68, 144, 49, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow =
                              idx < 3
                                ? '0 4px 12px rgba(68, 144, 49, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)';
                          }}
                          title={`Click to view orders for ${day.formattedDate}: ₹${formatCurrency(day.revenue)} (${day.orders} ${day.orders === 1 ? 'order' : 'orders'})`}
                        >
                          {idx < 3 && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'var(--admin-warning, #f59e0b)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                              }}
                            >
                              {idx + 1}
                            </span>
                          )}
                          <span
                            style={{
                              color: 'white',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              textAlign: 'center',
                              lineHeight: '1.2',
                            }}
                          >
                            ₹{formatNumberIndian(day.revenue)}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--admin-text-light)',
                              textAlign: 'center',
                              fontWeight: '500',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {day.shortDate}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              color: 'var(--admin-text-secondary)',
                              textAlign: 'center',
                            }}
                          >
                            {day.orders} {day.orders === 1 ? 'order' : 'orders'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'var(--admin-glass-border)',
                      borderRadius: '8px',
                      marginTop: '16px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--admin-text-secondary)',
                          fontWeight: '500',
                        }}
                      >
                        Total Revenue (Top 7 Days):
                      </span>
                      <span
                        style={{
                          fontSize: '1.1rem',
                          color: 'var(--admin-accent)',
                          fontWeight: '700',
                          marginLeft: '8px',
                        }}
                      >
                        ₹{formatCurrency(top20Days.reduce((sum, d) => sum + d.revenue, 0))}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--admin-text-secondary)',
                          fontWeight: '500',
                        }}
                      >
                        Peak Day:
                      </span>
                      <span
                        style={{
                          fontSize: '1rem',
                          color: 'var(--admin-text)',
                          fontWeight: '600',
                          marginLeft: '8px',
                        }}
                      >
                        {top20Days[0]?.formattedDate} (₹{formatCurrency(top20Days[0]?.revenue || 0)})
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>

    </div>
  );
};

export default AnalyticsTab;
