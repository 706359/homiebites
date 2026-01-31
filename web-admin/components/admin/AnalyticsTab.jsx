import { useEffect, useMemo, useRef, useState } from 'react';
import { InlineLoader } from '../loaders/LoaderComponents';
import Icon from '../ui/Icon.jsx';
import {
  getFilteredOrdersByDate,
  getProfitStats,
} from './utils/calculations.js';
import { parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  formatNumberIndian,
  getOrderAmount,
  getTotalRevenue,
  isPendingStatus,
} from './utils/orderUtils.js';

const AnalyticsTab = ({ orders = [], loading = false, onViewDayDetails }) => {
  const [period, setPeriod] = useState('thisMonth');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [topAreasRange, setTopAreasRange] = useState('all');
  const [paymentModeRange, setPaymentModeRange] = useState('all');

  const now = new Date();
  const analyticsContainerRef = useRef(null);

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
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      prevMonthEnd.setHours(23, 59, 59, 999);
      previousPeriodOrders = orders.filter((o) => {
        try {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          if (!orderDate) return false;
          return orderDate >= prevMonthStart && orderDate <= prevMonthEnd;
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
    // Cap growth rate at 999% to prevent Infinity breaking UI
    const growthRate =
      previousRevenue > 0
        ? Math.min(
            ((totalRevenue - previousRevenue) / previousRevenue) * 100,
            999
          )
        : totalRevenue > 0
          ? 999
          : 0;

    const pendingOrders = periodOrders.filter((o) =>
      isPendingStatus(o.status, o.paymentStatus)
    );
    const pendingAmount = pendingOrders.reduce((sum, o) => {
      // Use centralized getOrderAmount function
      const amount = getOrderAmount(o);
      return sum + amount;
    }, 0);

    const uniqueAddresses = new Set(
      periodOrders
        .map(
          (o) =>
            o.deliveryAddress ||
            o.customerAddress ||
            o.address ||
            o['Delivery Address'] ||
            o.delivery_address
        )
        .filter(Boolean)
    );
    const totalCustomers = uniqueAddresses.size;

    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

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

      const monthName = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      trend.push({
        month: monthName,
        revenue: getTotalRevenue(monthOrders),
        orders: monthOrders.length,
      });
    }
    return trend;
  }, [orders]);

  const maxMonthlyRevenue = Math.max(
    ...monthlyRevenueTrend.map((m) => m.revenue),
    1
  );
  const peakMonth = monthlyRevenueTrend.reduce(
    (max, m) => (m.revenue > max.revenue ? m : max),
    monthlyRevenueTrend[0]
  );

  const topAreasYears = useMemo(() => {
    const years = new Set();
    orders.forEach((o) => {
      try {
        const d = parseOrderDate(o.date || o.order_date || null);
        if (d) years.add(d.getFullYear());
      } catch (e) {}
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [orders]);

  useEffect(() => {
    if (topAreasRange !== 'all') {
      const y = parseInt(topAreasRange, 10);
      if (isNaN(y) || !topAreasYears.includes(y)) setTopAreasRange('all');
    }
  }, [topAreasYears, topAreasRange]);

  useEffect(() => {
    if (paymentModeRange !== 'all') {
      const y = parseInt(paymentModeRange, 10);
      if (isNaN(y) || !topAreasYears.includes(y)) setPaymentModeRange('all');
    }
  }, [topAreasYears, paymentModeRange]);

  const paymentModeOrders = useMemo(() => {
    if (paymentModeRange === 'all') return orders;
    const y = parseInt(paymentModeRange, 10);
    if (isNaN(y)) return orders;
    return orders.filter((o) => {
      try {
        const d = parseOrderDate(o.date || o.order_date || null);
        return d && d.getFullYear() === y;
      } catch (e) {
        return false;
      }
    });
  }, [orders, paymentModeRange]);

  const topAreasOrders = useMemo(() => {
    if (topAreasRange === 'all') return orders;
    const y = parseInt(topAreasRange, 10);
    if (isNaN(y)) return orders;
    return orders.filter((o) => {
      try {
        const d = parseOrderDate(o.date || o.order_date || null);
        return d && d.getFullYear() === y;
      } catch (e) {
        return false;
      }
    });
  }, [orders, topAreasRange]);

  const topAreas = useMemo(() => {
    const areaStats = {};
    topAreasOrders.forEach((o) => {
      const addr =
        o.deliveryAddress ||
        o.customerAddress ||
        o.address ||
        o['Delivery Address'] ||
        o.delivery_address;
      if (addr) {
        if (!areaStats[addr]) {
          areaStats[addr] = { address: addr, orders: 0, revenue: 0 };
        }
        areaStats[addr].orders++;

        // Use centralized getOrderAmount function
        const amount = getOrderAmount(o);
        areaStats[addr].revenue += amount;
      }
    });
    return Object.values(areaStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [topAreasOrders]);

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
      } catch (e) {}
    });
    return days.map((day) => ({ day, count: dayStats[day] }));
  }, [periodOrders]);

  const maxDayOrders = Math.max(...ordersByDay.map((d) => d.count), 1);

  const frequencyDistribution = useMemo(() => {
    const customerData = {};
    periodOrders.forEach((o) => {
      const addr =
        o.deliveryAddress ||
        o.customerAddress ||
        o.address ||
        o['Delivery Address'] ||
        o.delivery_address;
      if (addr) {
        if (!customerData[addr]) {
          customerData[addr] = { orders: 0, spent: 0 };
        }
        customerData[addr].orders++;

        // Use centralized getOrderAmount function
        const amount = getOrderAmount(o);
        customerData[addr].spent += amount;
      }
    });

    const oneTime = Object.values(customerData).filter(
      (c) => c.orders === 1
    ).length;
    const regular = Object.values(customerData).filter(
      (c) => c.spent >= 2000 && c.spent < 8000
    ).length;
    const vip = Object.values(customerData).filter(
      (c) => c.spent >= 8000 && c.spent < 15000
    ).length;
    const superVip = Object.values(customerData).filter(
      (c) => c.spent >= 15000
    ).length;
    return { oneTime, regular, vip, superVip };
  }, [periodOrders]);

  const paymentTrends = useMemo(() => {
    const trends = {};
    paymentModeOrders.forEach((o) => {
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
  }, [paymentModeOrders]);

  const totalPaymentAmount = paymentTrends.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const deliveryAddressAnalytics = useMemo(() => {
    const addressData = {};
    const getAddr = (o) =>
      o.deliveryAddress ||
      o.customerAddress ||
      o.address ||
      o['Delivery Address'] ||
      o.delivery_address ||
      '';

    // Derive years from actual order dates instead of hardcoding
    const allYears = new Set();
    orders.forEach((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (orderDate) {
          allYears.add(orderDate.getFullYear());
        }
      } catch (e) {
        // Log error but continue processing
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Analytics] Error parsing order date:', e, o);
        }
      }
    });

    // Get the 3 most recent years with data
    const sortedYears = Array.from(allYears).sort((a, b) => b - a);
    const year3 = sortedYears[0] || now.getFullYear();
    const year2 = sortedYears[1] || year3 - 1;
    const year1 = sortedYears[2] || year2 - 1;
    const years = [year1, year2, year3];

    let processedCount = 0;
    orders.forEach((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return;

        const addr = getAddr(o);
        if (!addr || !String(addr).trim()) return;

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

        // Use validated getOrderAmount function
        const amount = getOrderAmount(o);
        if (isNaN(amount) || amount < 0) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              '[Analytics] Invalid amount for order:',
              o,
              'amount:',
              amount
            );
          }
          return; // Skip invalid orders
        }

        addressData[addr].yearly[year] += amount;

        addressData[addr].monthly[year][month] += amount;

        addressData[addr].grandTotal += amount;
      } catch (e) {
        // Improved error handling: log with context and continue processing
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Analytics] Error processing order:', {
            error: e,
            orderId: o._id || o.id,
            orderDate: o.date || o.order_date,
            address: getAddr(o),
          });
        }
        // Don't add invalid data - skip this order
        return;
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(
        '[Analytics] Processed orders:',
        processedCount,
        'out of',
        orders.length
      );
    }

    const currentMonth = now.getMonth();

    const result = Object.values(addressData).map((data) => {
      const y1 = data.yearly[year1] || 0;
      const y2 = data.yearly[year2] || 0;
      const y3 = data.yearly[year3] || 0;

      // Cap trend calculations at 999% to prevent Infinity
      const trendY1toY2 =
        y1 > 0 ? Math.min(((y2 - y1) / y1) * 100, 999) : y2 > 0 ? 999 : 0;
      const trendY2toY3 =
        y2 > 0 ? Math.min(((y3 - y2) / y2) * 100, 999) : y3 > 0 ? 999 : 0;

      // Fix gap calculation: Compare year3 months with same month in year2 (not Dec year2)
      const monthlyGaps = [];
      if (data.monthly[year3]) {
        for (let month = 0; month <= currentMonth; month++) {
          const currentMonthValue = data.monthly[year3][month] || 0;
          // Compare with same month in previous year (year2), not December
          const previousYearSameMonth =
            data.monthly[year2] && data.monthly[year2][month]
              ? data.monthly[year2][month]
              : 0;
          const gap = currentMonthValue - previousYearSameMonth;
          monthlyGaps.push({
            month,
            value: currentMonthValue,
            gap: gap,
            previousYearValue: previousYearSameMonth,
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

    // Memoize sort to prevent creating new arrays on every render
    const sortedData = [...result].sort((a, b) => {
      let valueA = 0;
      let valueB = 0;

      if (sortColumn === 'year1') {
        valueA = Number(a.yearly[year1]) || 0;
        valueB = Number(b.yearly[year1]) || 0;
      } else if (sortColumn === 'year2') {
        valueA = Number(a.yearly[year2]) || 0;
        valueB = Number(b.yearly[year2]) || 0;
      } else if (sortColumn === 'year3') {
        valueA = Number(a.yearly[year3]) || 0;
        valueB = Number(b.yearly[year3]) || 0;
      } else if (sortColumn === 'grandTotal') {
        valueA = Number(a.grandTotal) || 0;
        valueB = Number(b.grandTotal) || 0;
      } else {
        // Default sort by year3, then grandTotal
        const year3A = Number(a.yearly[year3]) || 0;
        const year3B = Number(b.yearly[year3]) || 0;
        if (year3B !== year3A) {
          return year3B - year3A;
        }
        return (Number(b.grandTotal) || 0) - (Number(a.grandTotal) || 0);
      }

      if (sortDirection === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Delivery Address Analytics:', {
        totalAddresses: sortedData.length,
        sampleData: sortedData.slice(0, 3),
        years: { year1, year2, year3 },
      });
    }
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
        const avgOrderValue =
          m.orders > 0 ? (m.revenue / m.orders).toFixed(2) : '0.00';
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
        } catch (e) {}
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);

      const mostRecentYear =
        sortedYears.length > 0 ? sortedYears[0] : now.getFullYear();

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
        const avgOrderValue =
          orderCount > 0 ? (revenue / orderCount).toFixed(2) : '0.00';

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
        } catch (e) {}
      });

      Object.values(years)
        .sort((a, b) => b.year - a.year)
        .forEach((y) => {
          const avgOrderValue =
            y.orders > 0 ? (y.revenue / y.orders).toFixed(2) : '0.00';
          csvContent += `${escapeCSV(y.year)},${escapeCSV(y.revenue.toFixed(2))},${escapeCSV(
            y.orders
          )},${escapeCSV(avgOrderValue)},${escapeCSV(y.paidOrders)},${escapeCSV(
            y.unpaidOrders
          )},${escapeCSV(y.paidAmount.toFixed(2))},${escapeCSV(y.unpaidAmount.toFixed(2))}\n`;
        });
    }

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_report_${reportDate}.csv`;
    link.click();
  };

  // Optimized: Single MutationObserver watching only analytics containers
  useEffect(() => {
    const updateChartElements = () => {
      const container = analyticsContainerRef.current;
      if (!container) return;

      // Update revenue trend bar heights (12M chart)
      container
        .querySelectorAll('.revenue-trend-bar[data-height]')
        .forEach((bar) => {
          const heightPercent = parseFloat(bar.getAttribute('data-height'));
          if (isNaN(heightPercent)) return;
          const track = bar.closest('.revenue-trend-track');
          const containerHeight = track ? track.offsetHeight || 200 : 200;
          const height = (heightPercent / 100) * containerHeight;
          bar.style.setProperty('--bar-height', `${height}px`);
          bar.style.height = 'var(--bar-height)';
        });

      // Update progress bars
      container
        .querySelectorAll('.progress-bar-fill[data-width]')
        .forEach((bar) => {
          const widthPercent = bar.getAttribute('data-width');
          if (widthPercent && !isNaN(parseFloat(widthPercent))) {
            bar.style.setProperty('--bar-width', `${widthPercent}%`);
            bar.style.width = 'var(--bar-width)';
          }
        });
    };

    // Wait for ref to be attached and DOM to be ready
    let observer = null;
    let timeoutId = null;
    let retryId = null;

    const setupObserver = () => {
      const container = analyticsContainerRef.current;
      if (!container) {
        // Retry if container not ready yet
        retryId = setTimeout(setupObserver, 50);
        return;
      }

      // Initial update
      updateChartElements();

      observer = new MutationObserver((mutations) => {
        const hasRelevantChanges = mutations.some((mutation) => {
          const target = mutation.target;
          return (
            target.classList?.contains('revenue-trend-bar') ||
            target.classList?.contains('progress-bar-fill') ||
            target.closest('.revenue-trend-chart, .progress-bar-container')
          );
        });

        if (hasRelevantChanges) {
          updateChartElements();
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-height', 'data-width'],
      });
    };

    // Start setup after DOM is ready
    timeoutId = setTimeout(setupObserver, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (retryId) clearTimeout(retryId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [monthlyRevenueTrend, periodOrders, paymentTrends, topAreas]);

  if (loading) {
    return (
      <div className="admin-content">
        <InlineLoader message="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="admin-content" ref={analyticsContainerRef}>
      <div className="kitchen-tab">
        <section
          className="dashboard-section-block"
          aria-labelledby="analytics-period"
        >
          <h2 id="analytics-period" className="dashboard-section-heading">
            Period
          </h2>
          <div className="kitchen-tab-actions">
            <div className="kitchen-tab-actions-left">
              <div className="period-selector-group">
                <select
                  className="input-field period-select"
                  value={period}
                  onChange={(e) => {
                    setPeriod(e.target.value);
                    if (e.target.value !== 'custom') {
                      setCustomFrom('');
                      setCustomTo('');
                    }
                  }}
                  aria-label="Analytics period"
                >
                  <option value="thisMonth">This Month</option>
                  <option value="thisYear">This Year</option>
                  <option value="custom">Custom Range</option>
                  <option value="all">All Time</option>
                </select>
                {period === 'custom' && (
                  <div className="date-range-inputs">
                    <input
                      type="date"
                      className="input-field"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      placeholder="From"
                      aria-label="Date from"
                    />
                    <span className="date-range-separator" aria-hidden="true">
                      to
                    </span>
                    <input
                      type="date"
                      className="input-field"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      placeholder="To"
                      aria-label="Date to"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          className="dashboard-section-block"
          aria-labelledby="analytics-key-metrics"
        >
          <h2 id="analytics-key-metrics" className="dashboard-section-heading">
            Key metrics
          </h2>
          <div className="kitchen-tab-stats admin-stats">
            <div className="stat-card">
              <Icon name="rupee-sign" />
              <div>
                <h3>₹ {formatCurrency(keyMetrics.totalRevenue)}</h3>
                <p>Total Revenue</p>
                {keyMetrics.growthRate !== 0 && (
                  <p className="stat-card-subtitle">
                    {keyMetrics.growthRate >= 999
                      ? 'New ↑'
                      : `${keyMetrics.growthRate >= 0 ? '+' : ''}${keyMetrics.growthRate.toFixed(
                          1
                        )}% ${keyMetrics.growthRate >= 0 ? '↑' : '↓'}`}
                  </p>
                )}
              </div>
            </div>
            <div className="stat-card">
              <Icon name="shopping-cart" className="icon-color-accent" />
              <div>
                <h3>{keyMetrics.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <Icon
                name="exclamation-triangle"
                className="icon-color-warning"
              />
              <div>
                <h3>₹ {formatCurrency(keyMetrics.pendingAmount)}</h3>
                <p>Pending Payments</p>
                <p className="stat-card-subtitle">
                  {keyMetrics.pendingOrdersCount}{' '}
                  {keyMetrics.pendingOrdersCount === 1 ? 'order' : 'orders'}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <Icon name="users" className="icon-color-accent" />
              <div>
                <h3>{keyMetrics.totalCustomers}</h3>
                <p>Total Customers</p>
                <p className="stat-card-subtitle">Unique addresses</p>
              </div>
            </div>
            <div className="stat-card">
              <Icon name="chart-line" className="icon-color-success" />
              <div>
                <h3>₹ {formatCurrency(keyMetrics.avgOrderValue)}</h3>
                <p>Avg Order Value</p>
              </div>
            </div>
            <div className="stat-card">
              <Icon name="chart-line" className="stat-card-icon-success" />
              <div>
                <h3>₹ {formatCurrency(keyMetrics.profitStats.profit)}</h3>
                <p>Profit After Expenses</p>
                <p className="stat-card-subtitle">
                  {keyMetrics.profitStats.profitMarginPercent.toFixed(1)}%
                  margin
                </p>
              </div>
            </div>
            <div className="stat-card">
              <Icon name="percent" className="stat-card-icon-secondary" />
              <div>
                <h3>
                  {keyMetrics.profitStats.profitMarginPercent.toFixed(1)}%
                </h3>
                <p>Profit Margin</p>
                <p className="stat-card-subtitle">
                  Target: {keyMetrics.profitStats.targetProfitMargin}%
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="dashboard-section-block"
          aria-labelledby="analytics-charts"
        >
          <h2 id="analytics-charts" className="dashboard-section-heading">
            Charts & insights
          </h2>
          <div className="dashboard-grid-layout dashboard-grid-layout-charts">
            <div className="dashboard-grid-item full-width">
              <div className="dashboard-card revenue-trend-card revenue-trend-12m">
                <h3 className="revenue-trend-title">
                  <Icon
                    name="chart-line"
                    className="revenue-trend-title-icon"
                  />
                  Monthly Revenue Trend (Last 12M)
                </h3>
                <div className="revenue-trend-body">
                  <div className="revenue-trend-chart">
                    {monthlyRevenueTrend && monthlyRevenueTrend.length > 0 ? (
                      <>
                        <div
                          className="revenue-trend-y-axis-12m"
                          aria-hidden="true"
                        >
                          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                            <div key={pct} className="revenue-trend-y-tick-12m">
                              ₹
                              {formatCurrency(
                                Math.round(pct * maxMonthlyRevenue)
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="revenue-trend-bars-row">
                          {monthlyRevenueTrend.map((month, idx) => {
                            const barHeightPercent =
                              maxMonthlyRevenue > 0
                                ? (month.revenue / maxMonthlyRevenue) * 100
                                : 0;
                            const isPeak =
                              month.month === peakMonth.month &&
                              month.revenue === peakMonth.revenue;
                            const rev = month.revenue;
                            const barColorClass =
                              month.revenue <= 0
                                ? 'revenue-trend-bar--empty'
                                : isPeak
                                  ? 'revenue-trend-bar--peak'
                                  : rev < 10000
                                    ? 'revenue-trend-bar--red'
                                    : rev < 15000
                                      ? 'revenue-trend-bar--orange'
                                      : 'revenue-trend-bar--avg';
                            return (
                              <div key={idx} className="revenue-trend-col">
                                <div className="revenue-trend-track">
                                  <div
                                    className={`revenue-trend-bar ${barColorClass}`}
                                    data-height={barHeightPercent.toFixed(2)}
                                    title={`${month.month}: ₹${formatCurrency(month.revenue)} (${
                                      month.orders
                                    } orders)${isPeak ? ' (Peak)' : ''}`}
                                  />
                                </div>
                                <div className="revenue-trend-bar-value-wrap">
                                  {month.revenue > 0 && (
                                    <span className="revenue-trend-bar-value">
                                      ₹ {formatNumberIndian(month.revenue)}
                                    </span>
                                  )}
                                </div>
                                <span className="revenue-trend-month">
                                  {month.month}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="revenue-trend-empty">
                        No revenue data available
                      </div>
                    )}
                  </div>
                  {monthlyRevenueTrend && monthlyRevenueTrend.length > 0 && (
                    <div className="revenue-trend-summary">
                      Peak:{' '}
                      <span className="revenue-trend-summary-value">
                        ₹ {formatCurrency(peakMonth.revenue)}
                      </span>
                      <span className="revenue-trend-summary-month">
                        ({peakMonth.month})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Top 10 Delivery Areas – full width, card grid design */}
            <div className="dashboard-grid-item full-width">
              <div className="dashboard-card analytics-top-areas-full">
                <div className="section-header-with-select analytics-top-areas-full-header">
                  <h3 className="dashboard-section-title m-0">
                    <Icon name="map-marker-alt" className="icon-opacity" />
                    Top 10 Delivery Areas
                  </h3>
                  <select
                    className="top-areas-range-select"
                    value={topAreasRange}
                    onChange={(e) => setTopAreasRange(e.target.value)}
                    aria-label="Filter by time range"
                  >
                    <option value="all">All time</option>
                    {topAreasYears.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="analytics-top-areas-full-body">
                  {topAreas.length === 0 ? (
                    <div className="analytics-empty-state-inline">
                      <Icon
                        name="inbox"
                        className="analytics-empty-icon-large"
                      />
                      <p className="analytics-empty-text">
                        No delivery areas found
                      </p>
                    </div>
                  ) : (
                    <div className="analytics-top-areas-grid">
                      {topAreas.map((area, idx) => (
                        <div key={idx} className="analytics-top-areas-card">
                          <div className="analytics-top-areas-card-rank">
                            {idx + 1}
                          </div>
                          <div className="analytics-top-areas-card-content">
                            <div className="analytics-top-areas-card-header">
                              <span className="analytics-top-areas-card-name">
                                {area.address}
                              </span>
                              <span className="analytics-top-areas-card-revenue">
                                ₹ {formatCurrency(area.revenue)}
                              </span>
                            </div>
                            <div className="analytics-top-areas-bar-wrap">
                              <div
                                className="analytics-top-areas-bar-fill"
                                style={{
                                  width:
                                    maxAreaRevenue > 0
                                      ? `${(area.revenue / maxAreaRevenue) * 100}%`
                                      : '0%',
                                }}
                              />
                            </div>
                            <p className="analytics-top-areas-card-meta">
                              {area.orders}{' '}
                              {area.orders === 1 ? 'order' : 'orders'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Mode Trends – full width, below Top 10 */}
            <div className="dashboard-grid-item full-width">
              <div className="dashboard-card">
                <div className="section-header-with-select">
                  <h3 className="dashboard-section-title m-0">
                    <Icon name="credit-card" className="icon-opacity" />
                    Payment Mode Trends
                  </h3>
                  <select
                    className="top-areas-range-select"
                    value={paymentModeRange}
                    onChange={(e) => setPaymentModeRange(e.target.value)}
                    aria-label="Filter Payment Mode Trends by time range"
                  >
                    <option value="all">All time</option>
                    {topAreasYears.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chart-container-padding">
                  <div className="flex-col gap-12">
                    {paymentTrends.map((trend, idx) => {
                      const percentage =
                        totalPaymentAmount > 0
                          ? Math.min(
                              100,
                              parseFloat(
                                (
                                  (trend.amount / totalPaymentAmount) *
                                  100
                                ).toFixed(2)
                              )
                            )
                          : 0;
                      return (
                        <div key={idx} className="flex-col gap-6">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-primary">
                              {trend.mode}
                            </span>
                            <span className="font-bold text-accent text-lg">
                              ₹ {formatCurrency(trend.amount)} (
                              {percentage.toFixed(2)}%)
                            </span>
                          </div>
                          <div className="progress-bar-container progress-bar-container-alt analytics-progress-bar-container-alt">
                            <div
                              className="progress-bar-fill"
                              data-width={percentage.toFixed(2)}
                            />
                            {percentage > 15 && (
                              <div className="progress-bar-label-container">
                                <span className="progress-bar-label">
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid-item full-width">
              <div className="dashboard-card">
                <h3 className="dashboard-section-title">
                  <Icon name="map-marker-alt" className="icon-opacity" />
                  Delivery Address Analytics (Yearly & Monthly)
                </h3>
                <div className="analytics-chart-container">
                  {!deliveryAddressAnalytics ||
                  !deliveryAddressAnalytics.data ||
                  deliveryAddressAnalytics.data.length === 0 ? (
                    <div className="analytics-empty-state">
                      <Icon name="inbox" className="analytics-empty-icon" />
                      <p className="mt-16">
                        No delivery address data available
                      </p>
                    </div>
                  ) : (
                    <div className="analytics-delivery-table-wrapper">
                      <table className="analytics-delivery-table">
                        <thead>
                          <tr>
                            <th
                              className="analytics-th-sno"
                              scope="col"
                              aria-label="Serial number"
                            >
                              S No.
                            </th>
                            <th className="analytics-th-sticky" scope="col">
                              Delivery Address
                            </th>
                            <th
                              className="analytics-th-right analytics-th-year analytics-th-sortable"
                              onClick={() => {
                                if (sortColumn === 'year1') {
                                  setSortDirection(
                                    sortDirection === 'asc' ? 'desc' : 'asc'
                                  );
                                } else {
                                  setSortColumn('year1');
                                  setSortDirection('desc');
                                }
                              }}
                              scope="col"
                              aria-sort={
                                sortColumn === 'year1'
                                  ? sortDirection === 'asc'
                                    ? 'ascending'
                                    : 'descending'
                                  : undefined
                              }
                            >
                              {deliveryAddressAnalytics?.year1 || 'Year 1'}
                              {sortColumn === 'year1' && (
                                <span className="analytics-th-sort-indicator">
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </th>
                            <th
                              className="analytics-th-right analytics-th-year analytics-th-sortable"
                              onClick={() => {
                                if (sortColumn === 'year2') {
                                  setSortDirection(
                                    sortDirection === 'asc' ? 'desc' : 'asc'
                                  );
                                } else {
                                  setSortColumn('year2');
                                  setSortDirection('desc');
                                }
                              }}
                              scope="col"
                              aria-sort={
                                sortColumn === 'year2'
                                  ? sortDirection === 'asc'
                                    ? 'ascending'
                                    : 'descending'
                                  : undefined
                              }
                            >
                              {deliveryAddressAnalytics?.year2 || 'Year 2'}
                              {sortColumn === 'year2' && (
                                <span className="analytics-th-sort-indicator">
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </th>
                            <th
                              className="analytics-th-right analytics-th-year analytics-th-sortable"
                              onClick={() => {
                                if (sortColumn === 'year3') {
                                  setSortDirection(
                                    sortDirection === 'asc' ? 'desc' : 'asc'
                                  );
                                } else {
                                  setSortColumn('year3');
                                  setSortDirection('desc');
                                }
                              }}
                              scope="col"
                              aria-sort={
                                sortColumn === 'year3'
                                  ? sortDirection === 'asc'
                                    ? 'ascending'
                                    : 'descending'
                                  : undefined
                              }
                            >
                              {deliveryAddressAnalytics?.year3 || 'Year 3'}
                              {sortColumn === 'year3' && (
                                <span>
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </th>
                            <th
                              className="analytics-th-right analytics-th-grand-total"
                              scope="col"
                            >
                              Grand Total
                            </th>
                            <th className="analytics-th-center" scope="col">
                              Trend
                            </th>
                            <th
                              className="analytics-th-center analytics-th-monthly"
                              scope="col"
                            >
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
                            const previousYearValue =
                              data.monthlyGaps && data.monthlyGaps.length > 0
                                ? data.monthlyGaps[0].previousYearValue || 0
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

                            const monthNames = [
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ];

                            return (
                              <tr key={idx}>
                                <td className="analytics-td-sno">{idx + 1}</td>
                                <td className="analytics-td-address">
                                  {data.address}
                                </td>
                                <td
                                  className={`analytics-td-right ${
                                    data.yearly[year1] > 0
                                      ? 'analytics-td-year'
                                      : 'analytics-td-year-empty'
                                  }`}
                                >
                                  {data.yearly[year1] > 0
                                    ? `₹${formatCurrency(data.yearly[year1])}`
                                    : '—'}
                                </td>
                                <td
                                  className={`analytics-td-right ${
                                    data.yearly[year2] > 0
                                      ? 'analytics-td-year'
                                      : 'analytics-td-year-empty'
                                  }`}
                                >
                                  {data.yearly[year2] > 0
                                    ? `₹${formatCurrency(data.yearly[year2])}`
                                    : '—'}
                                </td>
                                <td
                                  className={`analytics-td-right ${
                                    data.yearly[year3] > 0
                                      ? 'analytics-td-year'
                                      : 'analytics-td-year-empty'
                                  }`}
                                >
                                  {data.yearly[year3] > 0
                                    ? `₹${formatCurrency(data.yearly[year3])}`
                                    : '—'}
                                </td>
                                <td className="analytics-td-grand-total">
                                  ₹ {formatCurrency(data.grandTotal)}
                                </td>
                                <td className="analytics-td-trend">
                                  <span
                                    className={`analytics-trend-icon ${
                                      totalGap > 0
                                        ? 'analytics-trend-icon-up'
                                        : totalGap < 0
                                          ? 'analytics-trend-icon-down'
                                          : 'analytics-trend-icon-neutral'
                                    }`}
                                  >
                                    {trendIcon}
                                  </span>
                                </td>
                                <td className="analytics-td-monthly">
                                  <div className="analytics-monthly-breakdown">
                                    {data.monthly[year1] && (
                                      <div className="analytics-monthly-year-row">
                                        {data.monthly[year1].map(
                                          (monthVal, mIdx) => (
                                            <span
                                              key={`${year1}-${mIdx}`}
                                              className={`analytics-monthly-value ${
                                                monthVal > 0
                                                  ? 'analytics-monthly-value-positive'
                                                  : 'analytics-monthly-value-empty'
                                              }`}
                                              title={`${monthNames[mIdx]}: ₹${formatCurrency(
                                                monthVal
                                              )}`}
                                            >
                                              {monthVal > 0
                                                ? formatCurrency(monthVal)
                                                : '—'}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    )}
                                    {data.monthly[year2] && (
                                      <div className="analytics-monthly-year-row">
                                        {data.monthly[year2].map(
                                          (monthVal, mIdx) => (
                                            <span
                                              key={`${year2}-${mIdx}`}
                                              className={`analytics-monthly-value ${
                                                monthVal > 0
                                                  ? 'analytics-monthly-value-positive'
                                                  : 'analytics-monthly-value-empty'
                                              }`}
                                              title={`${monthNames[mIdx]}: ₹${formatCurrency(
                                                monthVal
                                              )}`}
                                            >
                                              {monthVal > 0
                                                ? formatCurrency(monthVal)
                                                : '—'}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    )}
                                    {data.monthly[year3] && (
                                      <div className="analytics-monthly-year3-container">
                                        <div className="analytics-monthly-year-row">
                                          {data.monthly[year3].map(
                                            (monthVal, mIdx) => {
                                              // Calculate gap: current month vs same month previous year
                                              const monthGap =
                                                data.monthlyGaps &&
                                                data.monthlyGaps[mIdx]
                                                  ? data.monthlyGaps[mIdx].gap
                                                  : monthVal -
                                                    (data.monthlyGaps?.[mIdx]
                                                      ?.previousYearValue || 0);
                                              const isPositiveGap =
                                                monthGap >= 0;

                                              return (
                                                <span
                                                  key={`${year3}-${mIdx}`}
                                                  className={`analytics-monthly-value ${
                                                    monthVal > 0 &&
                                                    mIdx <= currentMonth
                                                      ? isPositiveGap
                                                        ? 'analytics-monthly-value-year3-positive'
                                                        : 'analytics-monthly-value-year3-negative'
                                                      : monthVal > 0
                                                        ? 'analytics-monthly-value-positive'
                                                        : 'analytics-monthly-value-empty'
                                                  }`}
                                                  title={
                                                    monthNames[mIdx] +
                                                    ' ' +
                                                    year3 +
                                                    ': ₹' +
                                                    formatCurrency(monthVal) +
                                                    (mIdx <= currentMonth
                                                      ? ' (Gap vs Dec ' +
                                                        year2 +
                                                        ': ' +
                                                        (isPositiveGap
                                                          ? '+'
                                                          : '') +
                                                        '₹' +
                                                        formatCurrency(
                                                          Math.abs(monthGap)
                                                        ) +
                                                        ')'
                                                      : '')
                                                  }
                                                >
                                                  {monthVal > 0
                                                    ? formatCurrency(monthVal)
                                                    : '—'}
                                                </span>
                                              );
                                            }
                                          )}
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsTab;
