import { useMemo, useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { getFilteredOrdersByDate, getProfitStats } from './utils/calculations.js';
import { parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  formatNumberIndian,
  getTotalRevenue,
  isPendingStatus,
} from './utils/orderUtils.js';
import './AnalyticsTab.css';

const AnalyticsTab = ({ orders = [], loading = false, onViewDayDetails }) => {
  const [period, setPeriod] = useState('thisMonth'); 
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [sortColumn, setSortColumn] = useState(null); 
  const [sortDirection, setSortDirection] = useState('desc'); 

  const now = new Date();

  
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
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            if (!orderDate) return false;
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

  
  const keyMetrics = useMemo(() => {
    const totalRevenue = getTotalRevenue(periodOrders);
    const totalOrders = periodOrders.length;

    
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

    const pendingOrders = periodOrders.filter((o) => isPendingStatus(o.status));
    const pendingAmount = pendingOrders.reduce((sum, o) => {
      let amount = null;

      if (o.totalAmount !== undefined && o.totalAmount !== null) {
        amount = parseFloat(o.totalAmount);
      } else if (o.total !== undefined && o.total !== null) {
        amount = parseFloat(o.total);
      }

      if (amount === null || isNaN(amount)) {
        const qty = parseFloat(o.quantity || 1);
        const price = parseFloat(o.unitPrice || 0);
        amount = qty * price;
      }

      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    
    const uniqueAddresses = new Set(
      periodOrders.map((o) => o.deliveryAddress || o.customerAddress || o.address).filter(Boolean)
    );
    const totalCustomers = uniqueAddresses.size;

    
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    
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

  
  const monthlyRevenueTrend = useMemo(() => {
    
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

  
  const topAreas = useMemo(() => {
    const areaStats = {};
    periodOrders.forEach((o) => {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (addr) {
        if (!areaStats[addr]) {
          areaStats[addr] = { address: addr, orders: 0, revenue: 0 };
        }
        areaStats[addr].orders++;

        let amount = null;
        if (o.totalAmount !== undefined && o.totalAmount !== null) {
          amount = parseFloat(o.totalAmount);
        } else if (o.total !== undefined && o.total !== null) {
          amount = parseFloat(o.total);
        }

        if (amount === null || isNaN(amount)) {
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

  
  const ordersByDay = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayStats = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    periodOrders.forEach((o) => {
      try {
        
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return;
        const dayName = days[orderDate.getDay()];
        dayStats[dayName]++;
      } catch (e) {
        
      }
    });
    return days.map((day) => ({ day, count: dayStats[day] }));
  }, [periodOrders]);

  const maxDayOrders = Math.max(...ordersByDay.map((d) => d.count), 1);

  
  const frequencyDistribution = useMemo(() => {
    const customerData = {};
    periodOrders.forEach((o) => {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (addr) {
        if (!customerData[addr]) {
          customerData[addr] = { orders: 0, spent: 0 };
        }
        customerData[addr].orders++;

        let amount = null;
        if (o.totalAmount !== undefined && o.totalAmount !== null) {
          amount = parseFloat(o.totalAmount);
        } else if (o.total !== undefined && o.total !== null) {
          amount = parseFloat(o.total);
        }

        if (amount === null || isNaN(amount)) {
          const qty = parseFloat(o.quantity || 1);
          const price = parseFloat(o.unitPrice || 0);
          amount = qty * price;
        }

        customerData[addr].spent += isNaN(amount) ? 0 : amount;
      }
    });
    
    
    
    
    
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

  
  const paymentTrends = useMemo(() => {
    const trends = {};
    periodOrders.forEach((o) => {
      const mode = o.paymentMode || 'Not Set';
      if (!trends[mode]) {
        trends[mode] = { count: 0, amount: 0 };
      }
      trends[mode].count++;

      let amount = null;
      if (o.totalAmount !== undefined && o.totalAmount !== null) {
        amount = parseFloat(o.totalAmount);
      } else if (o.total !== undefined && o.total !== null) {
        amount = parseFloat(o.total);
      }

      if (amount === null || isNaN(amount)) {
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

  
  const top20Days = useMemo(() => {
    const dayStats = {};

    
    orders.forEach((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return;

        
        const dateKey = orderDate.toISOString().split('T')[0];

        if (!dayStats[dateKey]) {
          dayStats[dateKey] = {
            date: dateKey,
            dateObj: orderDate,
            revenue: 0,
            orders: 0,
            orderIds: [], 
          };
        }

        let amount = null;
        if (o.totalAmount !== undefined && o.totalAmount !== null) {
          amount = parseFloat(o.totalAmount);
        } else if (o.total !== undefined && o.total !== null) {
          amount = parseFloat(o.total);
        }

        if (amount === null || isNaN(amount)) {
          const qty = parseFloat(o.quantity || 1);
          const price = parseFloat(o.unitPrice || 0);
          amount = qty * price;
        }

        dayStats[dateKey].revenue += isNaN(amount) ? 0 : amount;
        dayStats[dateKey].orders += 1;
        
        if (o.orderId || o._id) {
          dayStats[dateKey].orderIds.push(o.orderId || o._id);
        }
      } catch (e) {
        
      }
    });

    
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

  
  const getOrderAmount = (order) => {
    let amount = null;

    if (order.totalAmount !== undefined && order.totalAmount !== null) {
      amount = parseFloat(order.totalAmount);
    } else if (order.total !== undefined && order.total !== null) {
      amount = parseFloat(order.total);
    }

    if (amount === null || isNaN(amount)) {
      const qty = parseFloat(order.quantity || 1);
      const price = parseFloat(order.unitPrice || 0);
      amount = qty * price;
    }

    return isNaN(amount) ? 0 : amount;
  };

  
  const deliveryAddressAnalytics = useMemo(() => {
    const addressData = {};
    const currentYear = now.getFullYear();
    const year1 = currentYear - 2;
    const year2 = currentYear - 1;
    const year3 = currentYear;
    const years = [year1, year2, year3];

    
    const allYears = new Set();
    orders.forEach((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (orderDate) {
          allYears.add(orderDate.getFullYear());
        }
      } catch (e) {
        
      }
    });

    
    let processedCount = 0;
    orders.forEach((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return;

        const addr = o.deliveryAddress || o.customerAddress || o.address;
        if (!addr) return;
        
        processedCount++;

        const year = orderDate.getFullYear();
        const month = orderDate.getMonth(); 

        if (!addressData[addr]) {
          addressData[addr] = {
            address: addr,
            yearly: {},
            monthly: {},
            grandTotal: 0,
          };
        }

        
        if (!addressData[addr].yearly[year]) {
          addressData[addr].yearly[year] = 0;
        }
        if (!addressData[addr].monthly[year]) {
          addressData[addr].monthly[year] = Array(12).fill(0);
        }

        let amount = getOrderAmount(o);

        
        addressData[addr].yearly[year] += amount;

        
        addressData[addr].monthly[year][month] += amount;

        
        addressData[addr].grandTotal += amount;
      } catch (e) {
        
        console.warn('[Analytics] Error processing order:', e, o);
      }
    });
    
    console.log('[Analytics] Processed orders:', processedCount, 'out of', orders.length);

    
    
    const currentMonth = now.getMonth(); 
    const dec2025 = 11; 
    
    const result = Object.values(addressData).map((data) => {
      const y1 = data.yearly[year1] || 0;
      const y2 = data.yearly[year2] || 0;
      const y3 = data.yearly[year3] || 0;

      
      const trendY1toY2 = y1 > 0 ? ((y2 - y1) / y1) * 100 : (y2 > 0 ? Infinity : 0);
      const trendY2toY3 = y2 > 0 ? ((y3 - y2) / y2) * 100 : (y3 > 0 ? Infinity : 0);

      
      const monthlyGaps = [];
      const dec2025Value = (data.monthly[year2] && data.monthly[year2][dec2025]) ? data.monthly[year2][dec2025] : 0;
      
      if (data.monthly[year3]) {
        for (let month = 0; month <= currentMonth; month++) {
          const currentMonthValue = data.monthly[year3][month] || 0;
          const gap = currentMonthValue - dec2025Value;
          monthlyGaps.push({
            month,
            value: currentMonthValue,
            gap: gap,
            dec2025Value: dec2025Value,
          });
        }
      }

      
      const totalGap = monthlyGaps.reduce((sum, mg) => sum + mg.gap, 0);

      return {
        ...data,
        years: { year1, year2, year3 },
        trends: {
          [`${year1}-${year2}`]: trendY1toY2,
          [`${year2}-${year3}`]: trendY2toY3,
        },
        gaps: {
          [`${year1}-${year2}`]: y2 - y1,
          [`${year2}-${year3}`]: y3 - y2,
        },
        monthlyGaps: monthlyGaps,
        totalGap: totalGap, 
      };
    });

    
    const sortedData = result.sort((a, b) => {
      let valueA, valueB;
      
      if (sortColumn === 'year1') {
        valueA = a.yearly[year1] || 0;
        valueB = b.yearly[year1] || 0;
      } else if (sortColumn === 'year2') {
        valueA = a.yearly[year2] || 0;
        valueB = b.yearly[year2] || 0;
      } else if (sortColumn === 'year3') {
        valueA = a.yearly[year3] || 0;
        valueB = b.yearly[year3] || 0;
      } else if (sortColumn === 'grandTotal') {
        valueA = a.grandTotal || 0;
        valueB = b.grandTotal || 0;
      } else {
        
        const year3A = a.yearly[year3] || 0;
        const year3B = b.yearly[year3] || 0;
        if (year3B !== year3A) {
          return year3B - year3A; 
        }
        return b.grandTotal - a.grandTotal; 
      }
      
      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
    console.log('[Analytics] Delivery Address Analytics:', {
      totalAddresses: sortedData.length,
      sampleData: sortedData.slice(0, 3),
      years: { year1, year2, year3 },
    });
    return { data: sortedData, year1, year2, year3 };
  }, [orders, now, sortColumn, sortDirection]);

  
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  
  const handleExportReport = (type) => {
    let csvContent = '';
    const reportDate = new Date().toISOString().split('T')[0];

    if (type === 'monthly') {
      
      csvContent = 'Month,Year,Revenue (₹),Orders,Average Order Value (₹)\n';
      monthlyRevenueTrend.forEach((m) => {
        const avgOrderValue = m.orders > 0 ? (m.revenue / m.orders).toFixed(2) : '0.00';
        csvContent += `${escapeCSV(m.month)},${escapeCSV(m.revenue)},${escapeCSV(
          m.orders
        )},${escapeCSV(avgOrderValue)}\n`;
      });
    } else if (type === 'quarterly') {
      
      csvContent = 'Quarter,Year,Revenue (₹),Orders,Average Order Value (₹)\n';
      const quarters = [];

      
      const years = new Set();
      orders.forEach((o) => {
        try {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          if (orderDate) years.add(orderDate.getFullYear());
        } catch (e) {
          
        }
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);

      
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
        csvContent += `${escapeCSV(q.quarter)},${escapeCSV(q.year)},${escapeCSV(
          q.revenue
        )},${escapeCSV(q.orders)},${escapeCSV(q.avgOrderValue)}\n`;
      });
    } else if (type === 'annual') {
      
      csvContent =
        'Year,Revenue (₹),Orders,Average Order Value (₹),Paid Orders,Unpaid Orders,Paid Amount (₹),Unpaid Amount (₹)\n';
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
          
        }
      });

      Object.values(years)
        .sort((a, b) => b.year - a.year)
        .forEach((y) => {
          const avgOrderValue = y.orders > 0 ? (y.revenue / y.orders).toFixed(2) : '0.00';
          csvContent += `${escapeCSV(y.year)},${escapeCSV(y.revenue.toFixed(2))},${escapeCSV(
            y.orders
          )},${escapeCSV(avgOrderValue)},${escapeCSV(y.paidOrders)},${escapeCSV(
            y.unpaidOrders
          )},${escapeCSV(y.paidAmount.toFixed(2))},${escapeCSV(y.unpaidAmount.toFixed(2))}\n`;
        });
    }

    
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
        <PremiumLoader message='Loading analytics...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      <div className='dashboard-with-sidebar'>
        <div className='dashboard-main-content'>
          {}
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
                      : `${keyMetrics.growthRate >= 0 ? '+' : ''}${keyMetrics.growthRate.toFixed(
                          1
                        )}% ${keyMetrics.growthRate >= 0 ? '↑' : '↓'}`}
                  </p>
                )}
              </div>
            </div>
            <div className='stat-card'>
              <i className='fa-solid fa-shopping-cart icon-color-accent'></i>
              <div>
                <h3>{keyMetrics.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className='stat-card'>
              <i
                className='fa-solid fa-exclamation-triangle'
                className='icon-color-warning'
              ></i>
              <div>
                <h3>₹{formatCurrency(keyMetrics.pendingAmount)}</h3>
                <p>Pending Payments</p>
                <p className='stat-card-subtitle'>
                  {keyMetrics.pendingOrdersCount}{' '}
                  {keyMetrics.pendingOrdersCount === 1 ? 'order' : 'orders'}
                </p>
              </div>
            </div>
            <div className='stat-card'>
              <i className='fa-solid fa-users icon-color-accent'></i>
              <div>
                <h3>{keyMetrics.totalCustomers}</h3>
                <p>Total Customers</p>
                <p className='stat-card-subtitle'>Unique addresses</p>
              </div>
            </div>
            <div className='stat-card'>
              <i className='fa-solid fa-chart-line icon-color-success'></i>
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

          {}
          <div className='dashboard-grid-layout'>
            {}
            <div className='dashboard-grid-item full-width'>
              <div className='dashboard-card'>
                <h3 className='dashboard-section-title'>
                  <i
                    className='fa-solid fa-chart-line'
                    className='icon-opacity'
                  ></i>
                  Monthly Revenue Trend (Last 12M)
                </h3>
                <div className='chart-container-padding'>
                  <div className='chart-container mb-16'>
                    {monthlyRevenueTrend.map((month, idx) => (
                      <div
                        key={idx}
                        className='bar-chart-item'
                      >
                        <div
                          className='chart-bar chart-bar-small'
                          style={{
                            height: `${(month.revenue / maxMonthlyRevenue) * 180}px`,
                          }}
                          title={`${month.month}: ₹${formatCurrency(month.revenue)} (${
                            month.orders
                          } orders)`}
                        >
                          <span className='chart-bar-label-small'>
                            ₹{formatNumberIndian(month.revenue)}
                          </span>
                        </div>
                        <span className='chart-bar-label'>
                          {month.month}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className='chart-summary'>
                    Peak: ₹{formatCurrency(peakMonth.revenue)} ({peakMonth.month})
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className='dashboard-grid-item full-width'>
              <div className='dashboard-card'>
                <h3 className='dashboard-section-title'>
                  <i
                    className='fa-solid fa-map-marker-alt'
                    className='icon-opacity'
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
                      <i
                        className='fa-solid fa-inbox'
                        style={{ fontSize: '48px', opacity: 0.3 }}
                      ></i>
                      <p style={{ marginTop: '16px' }}>No delivery areas found</p>
                    </div>
                  ) : (
                    <div className='flex-col gap-12'>
                      {topAreas.map((area, idx) => (
                        <div
                          key={idx}
                          className={`area-item ${idx % 2 === 0 ? 'area-item-even' : 'area-item-odd'}`}
                        >
                          <div className='area-header'>
                            <span className='area-name'>
                              {idx + 1}. {area.address}
                            </span>
                            <span className='area-revenue'>
                              ₹{formatCurrency(area.revenue)} ({area.orders}{' '}
                              {area.orders === 1 ? 'order' : 'orders'})
                            </span>
                          </div>
                          <div className='progress-bar-container' style={{ height: '20px', borderRadius: '10px' }}>
                            <div
                              className='progress-bar-fill'
                              style={{
                                width: `${
                                  maxAreaRevenue > 0 ? (area.revenue / maxAreaRevenue) * 100 : 0
                                }%`,
                                borderRadius: '10px',
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

            {}
            <div className='dashboard-grid-item full-width'>
              <div className='dashboard-card'>
                <h3 className='dashboard-section-title'>
                  <i
                    className='fa-solid fa-credit-card'
                    className='icon-opacity'
                  ></i>
                  Payment Mode Trends
                </h3>
                <div className='chart-container-padding'>
                  <div className='flex-col gap-12'>
                    {paymentTrends.map((trend, idx) => {
                      
                      const percentage =
                        totalPaymentAmount > 0
                          ? Math.min(
                              100,
                              parseFloat(((trend.amount / totalPaymentAmount) * 100).toFixed(2))
                            )
                          : 0;
                      return (
                        <div
                          key={idx}
                          className='flex-col gap-6'
                        >
                          <div className='flex justify-between items-center'>
                            <span className='font-semibold text-primary'>
                              {trend.mode}
                            </span>
                            <span className='font-bold text-accent text-lg'>
                              ₹{formatCurrency(trend.amount)} ({percentage.toFixed(2)}%)
                            </span>
                          </div>
                          <div className='progress-bar-container progress-bar-container-alt'
                            style={{
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
                                  className='progress-bar-label'
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

            {}
            <div className='dashboard-grid-item full-width'>
              <div className='dashboard-card'>
                <h3 className='dashboard-section-title'>
                  <i className='fa-solid fa-map-marker-alt icon-opacity'></i>
                  Delivery Address Analytics (Yearly & Monthly)
                </h3>
                <div className='analytics-chart-container'>
                  {!deliveryAddressAnalytics || !deliveryAddressAnalytics.data || deliveryAddressAnalytics.data.length === 0 ? (
                    <div className='analytics-empty-state'>
                      <i className='fa-solid fa-inbox analytics-empty-icon'></i>
                      <p className='mt-16'>No delivery address data available</p>
                    </div>
                  ) : (
                    <div className='analytics-delivery-table-wrapper'>
                      <table className='analytics-delivery-table'>
                        <thead>
                          <tr>
                            <th className='analytics-th-sticky'>
                              Delivery Address
                            </th>
                            <th 
                              className='analytics-th-right analytics-th-sortable' 
                              onClick={() => {
                                if (sortColumn === 'year1') {
                                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                } else {
                                  setSortColumn('year1');
                                  setSortDirection('desc');
                                }
                              }}
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                              {deliveryAddressAnalytics?.year1 || 'Year 1'}
                              {sortColumn === 'year1' && (
                                <span style={{ marginLeft: '4px' }}>
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </th>
                            <th 
                              className='analytics-th-right analytics-th-sortable' 
                              onClick={() => {
                                if (sortColumn === 'year2') {
                                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                } else {
                                  setSortColumn('year2');
                                  setSortDirection('desc');
                                }
                              }}
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                              {deliveryAddressAnalytics?.year2 || 'Year 2'}
                              {sortColumn === 'year2' && (
                                <span style={{ marginLeft: '4px' }}>
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </th>
                            <th 
                              className='analytics-th-right analytics-th-year analytics-th-sortable' 
                              onClick={() => {
                                if (sortColumn === 'year3') {
                                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                } else {
                                  setSortColumn('year3');
                                  setSortDirection('desc');
                                }
                              }}
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                              {deliveryAddressAnalytics?.year3 || 'Year 3'}
                              {sortColumn === 'year3' && (
                                <span style={{ marginLeft: '4px' }}>
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </th>
                            <th className='analytics-th-right analytics-th-grand-total'>
                              Grand Total
                            </th>
                            <th className='analytics-th-center'>Trend</th>
                            <th className='analytics-th-center analytics-th-monthly'>
                              Monthly Breakdown
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveryAddressAnalytics?.data?.map((data, idx) => {
                            const { year1, year2, year3 } = data.years;
                            const currentMonth = now.getMonth();
                            const trendKey1 = `${year1}-${year2}`;
                            const trendKey2 = `${year2}-${year3}`;
                            const trendY1toY2 = data.trends[trendKey1];
                            const trendY2toY3 = data.trends[trendKey2];
                            
                            
                            const totalGap = data.totalGap || 0;
                            const dec2025Value = data.monthlyGaps && data.monthlyGaps.length > 0 
                              ? data.monthlyGaps[0].dec2025Value 
                              : 0;

                            
                            let trendIcon = '—';
                            let trendColor = 'var(--admin-text-secondary)';
                            if (totalGap > 0) {
                              trendIcon = '▲';
                              trendColor = 'var(--admin-success)';
                            } else if (totalGap < 0) {
                              trendIcon = '▼';
                              trendColor = 'var(--admin-danger)';
                            }

                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            
                            return (
                              <tr key={idx}>
                                <td className='analytics-td-address'>
                                  {data.address}
                                </td>
                                <td className={`analytics-td-right ${data.yearly[year1] > 0 ? 'analytics-td-year' : 'analytics-td-year-empty'}`}>
                                  {data.yearly[year1] > 0 ? `₹${formatCurrency(data.yearly[year1])}` : '—'}
                                </td>
                                <td className={`analytics-td-right ${data.yearly[year2] > 0 ? 'analytics-td-year' : 'analytics-td-year-empty'}`}>
                                  {data.yearly[year2] > 0 ? `₹${formatCurrency(data.yearly[year2])}` : '—'}
                                </td>
                                <td className={`analytics-td-right ${data.yearly[year3] > 0 ? 'analytics-td-year' : 'analytics-td-year-empty'}`}>
                                  {data.yearly[year3] > 0 ? `₹${formatCurrency(data.yearly[year3])}` : '—'}
                                </td>
                                <td className='analytics-td-grand-total'>
                                  ₹{formatCurrency(data.grandTotal)}
                                </td>
                                <td className='analytics-td-trend'>
                                  <span className={`analytics-trend-icon ${totalGap > 0 ? 'analytics-trend-icon-up' : totalGap < 0 ? 'analytics-trend-icon-down' : 'analytics-trend-icon-neutral'}`}>
                                    {trendIcon}
                                  </span>
                                </td>
                                <td className='analytics-td-monthly'>
                                  <div className='analytics-monthly-breakdown'>
                                    {}
                                    {data.monthly[year1] && (
                                      <div className='analytics-monthly-year-row'>
                                        <span className='analytics-monthly-year-label'>{year1}:</span>
                                        {data.monthly[year1].map((monthVal, mIdx) => (
                                          <span
                                            key={`${year1}-${mIdx}`}
                                            className={`analytics-monthly-value ${monthVal > 0 ? 'analytics-monthly-value-positive' : 'analytics-monthly-value-empty'}`}
                                            title={`${monthNames[mIdx]}: ₹${formatCurrency(monthVal)}`}
                                          >
                                            {monthVal > 0 ? formatCurrency(monthVal) : '—'}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    {}
                                    {data.monthly[year2] && (
                                      <div className='analytics-monthly-year-row'>
                                        <span className='analytics-monthly-year-label'>{year2}:</span>
                                        {data.monthly[year2].map((monthVal, mIdx) => (
                                          <span
                                            key={`${year2}-${mIdx}`}
                                            className={`analytics-monthly-value ${monthVal > 0 ? 'analytics-monthly-value-positive' : 'analytics-monthly-value-empty'}`}
                                            title={`${monthNames[mIdx]}: ₹${formatCurrency(monthVal)}`}
                                          >
                                            {monthVal > 0 ? formatCurrency(monthVal) : '—'}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    {}
                                    {data.monthly[year3] && (
                                      <div className='analytics-monthly-year3-container'>
                                        <div className='analytics-monthly-year-row'>
                                          <span className='analytics-monthly-year-label'>{year3}:</span>
                                          {data.monthly[year3].map((monthVal, mIdx) => {
                                            
                                            const monthGap = data.monthlyGaps && data.monthlyGaps[mIdx] 
                                              ? data.monthlyGaps[mIdx].gap 
                                              : (monthVal - dec2025Value);
                                            const isPositiveGap = monthGap >= 0;
                                            
                                            return (
                                              <span
                                                key={`${year3}-${mIdx}`}
                                                className={`analytics-monthly-value ${monthVal > 0 && mIdx <= currentMonth
                                                  ? (isPositiveGap ? 'analytics-monthly-value-year3-positive' : 'analytics-monthly-value-year3-negative')
                                                  : monthVal > 0
                                                  ? 'analytics-monthly-value-positive'
                                                  : 'analytics-monthly-value-empty'
                                                }`}
                                                title={`${monthNames[mIdx]} ${year3}: ₹${formatCurrency(monthVal)}${mIdx <= currentMonth ? ` (Gap vs Dec ${year2}: ${isPositiveGap ? '+' : ''}₹${formatCurrency(Math.abs(monthGap))})` : ''}`}
                                              >
                                                {monthVal > 0 ? formatCurrency(monthVal) : '—'}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {}
            <div className='dashboard-grid-item full-width'>
              <div className='dashboard-card'>
                <h3 className='dashboard-section-title'>
                  <i className='fa-solid fa-trophy icon-opacity'></i>
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
                      <i
                        className='fa-solid fa-inbox'
                        style={{ fontSize: '48px', opacity: 0.3 }}
                      ></i>
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
                              className="analytics-day-card"
                              onClick={() => {
                                if (onViewDayDetails) {
                                  onViewDayDetails(day.date);
                                }
                              }}
                              title={`Click to view orders for ${
                                day.formattedDate
                              }: ₹${formatCurrency(day.revenue)} (${day.orders} ${
                                day.orders === 1 ? 'order' : 'orders'
                              })`}
                            >
                              {idx < 3 && (
                                <span
                                  className='rank-badge'
                                  style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'var(--admin-warning, #f59e0b)',
                                  }}
                                >
                                  {idx + 1}
                                </span>
                              )}
                              <span className='chart-bar-value'>
                                ₹{formatNumberIndian(day.revenue)}
                              </span>
                            </div>
                            <div className='chart-bar-date'>
                              <span className='chart-bar-date-label'>
                                {day.shortDate}
                              </span>
                              <span className='chart-bar-date-sublabel'>
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
                            {top20Days[0]?.formattedDate} (₹
                            {formatCurrency(top20Days[0]?.revenue || 0)})
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
