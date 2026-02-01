import { useEffect, useRef, useState } from 'react';
import { InlineLoader } from '../loaders/LoaderComponents';
import Icon from '../ui/Icon.jsx';
import { getProfitStats } from './utils/calculations.js';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  extractOrderIdSequence,
  formatCurrency,
  getOrderAmount,
  getTotalRevenue,
  isPendingStatus,
} from './utils/orderUtils.js';

const DashboardTab = ({ orders, setActiveTab, settings, loading = false }) => {
  const dashboardContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 480 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allTimeOrders = Array.isArray(orders) ? orders : [];

  useEffect(() => {
    const setChartBarHeights = () => {
      const root = dashboardContainerRef.current;
      (root || document)
        .querySelectorAll('.revenue-trend-bar[data-height]')
        .forEach((bar) => {
          const heightPercent = parseFloat(bar.getAttribute('data-height'));
          const track = bar.closest('.revenue-trend-track');
          const containerHeight = track ? track.offsetHeight || 200 : 200;
          const height = (heightPercent / 100) * containerHeight;
          bar.style.setProperty('--bar-height', `${height}px`);
          bar.style.height = 'var(--bar-height)';
        });
    };
    setChartBarHeights();
    const observer = new MutationObserver(setChartBarHeights);
    const el = dashboardContainerRef.current;
    if (el) observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [allTimeOrders, loading]);

  useEffect(() => {
    const setProgressBarWidths = () => {
      const root = dashboardContainerRef.current;
      (root || document)
        .querySelectorAll('.progress-bar-fill[data-width]')
        .forEach((bar) => {
          const widthPercent = bar.getAttribute('data-width');
          bar.style.setProperty('--bar-width', `${widthPercent}%`);
          bar.style.width = 'var(--bar-width)';
        });
    };
    setProgressBarWidths();
    const observer = new MutationObserver(setProgressBarWidths);
    const el = dashboardContainerRef.current;
    if (el) observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [loading, allTimeOrders.length]);

  // Early return if loading to avoid unnecessary calculations
  if (loading) {
    return (
      <div className="admin-content" ref={dashboardContainerRef}>
        <InlineLoader message="Loading dashboard data..." />
      </div>
    );
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Use raw orders array directly for all-time calculations to ensure no orders are excluded
  const allTimeTotal = allTimeOrders.length;

  const allTimeRevenue = getTotalRevenue(allTimeOrders);
  const profitStats = getProfitStats(allTimeRevenue, 70, 30);

  const pendingOrders = allTimeOrders.filter(
    (o) => o && isPendingStatus(o.status, o.paymentStatus)
  );
  const allTimeUnpaidAmount = getTotalRevenue(pendingOrders);
  const unpaidOrdersCount = pendingOrders.length;

  const allUniqueAddresses = new Set(
    orders
      .map((o) => o.deliveryAddress || o.customerAddress || o.address)
      .filter(Boolean)
  ).size;

  const currentYear = now.getFullYear();
  const lastYear = currentYear - 1;
  const thisYearOrders = orders.filter((o) => {
    try {
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      if (!orderDate) return false;
      return orderDate.getFullYear() === currentYear;
    } catch (e) {
      return false;
    }
  });
  const lastYearOrders = orders.filter((o) => {
    try {
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      if (!orderDate) return false;
      return orderDate.getFullYear() === lastYear;
    } catch (e) {
      return false;
    }
  });
  const thisYearRevenue = getTotalRevenue(thisYearOrders);
  const lastYearRevenue = getTotalRevenue(lastYearOrders);
  const yearOverYearGrowth =
    lastYearRevenue > 0
      ? ((thisYearRevenue - lastYearRevenue) / lastYearRevenue) * 100
      : thisYearRevenue > 0
        ? 999
        : 0;
  const isNewGrowth = lastYearRevenue === 0 && thisYearRevenue > 0;

  const todayOrders = orders.filter((o) => {
    try {
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      if (!orderDate) return false;
      return orderDate >= today && orderDate < tomorrow;
    } catch (e) {
      return false;
    }
  });
  const todayOrdersCount = todayOrders.length;
  const todayRevenue = getTotalRevenue(todayOrders);

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  const thisWeekOrders = orders.filter((o) => {
    try {
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      if (!orderDate) return false;
      return orderDate >= thisWeekStart;
    } catch (e) {
      return false;
    }
  });
  const thisWeekRevenue = getTotalRevenue(thisWeekOrders);
  const thisWeekOrdersCount = thisWeekOrders.length;

  const allTimeAvgOrderValue =
    allTimeTotal > 0 ? Math.round(allTimeRevenue / allTimeTotal) : 0;

  const cancelledOrders = orders.filter((o) => {
    const status = (o.status || '').toLowerCase();
    return status === 'cancelled' || status === 'cancel';
  });
  const cancelRate =
    orders.length > 0 ? (cancelledOrders.length / orders.length) * 100 : 0;

  // Get all unique years from orders, and always include current year
  const yearsInData = new Set();
  orders.forEach((o) => {
    try {
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      if (orderDate) {
        yearsInData.add(orderDate.getFullYear());
      }
    } catch (e) {}
  });
  // Always include current year even if no data exists yet
  yearsInData.add(currentYear);
  // Also include last year for comparison
  if (yearsInData.size > 0) {
    yearsInData.add(lastYear);
  }
  const sortedYears = Array.from(yearsInData).sort((a, b) => a - b);

  // Calculate revenue for all 12 months with year-over-year comparison
  const monthlyRevenueData = [];
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

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const monthData = {
      monthIndex: monthIndex,
      monthName: monthNames[monthIndex],
      years: {},
    };

    // Calculate revenue for each year for this month
    sortedYears.forEach((year) => {
      const date = new Date(year, monthIndex, 1);
      date.setHours(0, 0, 0, 0);
      const nextMonth = new Date(year, monthIndex + 1, 1);

      const monthOrders = orders.filter((o) => {
        try {
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          if (!orderDate) return false;
          return orderDate >= date && orderDate < nextMonth;
        } catch (e) {
          return false;
        }
      });

      // Always include year entry, even if no orders (for consistent chart display)
      monthData.years[year] = {
        revenue: getTotalRevenue(monthOrders),
        orders: monthOrders.length,
      };
    });

    monthlyRevenueData.push(monthData);
  }

  const ordersByMode = {
    Lunch: 0,
    Dinner: 0,
    'Not Set': 0,
  };
  allTimeOrders.forEach((o) => {
    const mode = o.mode || 'Not Set';
    ordersByMode[mode] = (ordersByMode[mode] || 0) + 1;
  });

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = currentMonthEnd.getDate();
  const dailyOrdersData = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayOrders = allTimeOrders.filter((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return false;
        return orderDate >= date && orderDate < nextDay;
      } catch (e) {
        return false;
      }
    });

    dailyOrdersData.push({
      day,
      orders: dayOrders.length,
      revenue: getTotalRevenue(dayOrders),
    });
  }
  const maxDailyOrders = Math.max(...dailyOrdersData.map((d) => d.orders), 1);

  const thisMonthRevenue = dailyOrdersData.reduce((s, d) => s + d.revenue, 0);
  const thisMonthOrdersCount = dailyOrdersData.reduce(
    (s, d) => s + d.orders,
    0
  );
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  lastMonthEnd.setHours(23, 59, 59, 999);
  const lastMonthOrders = orders.filter((o) => {
    try {
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      if (!orderDate) return false;
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    } catch (e) {
      return false;
    }
  });
  const lastMonthRevenue = getTotalRevenue(lastMonthOrders);
  const monthOverMonthGrowth =
    lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0
        ? 100
        : 0;

  const monthlyRevenueLast12 = (() => {
    let mostRecentDate = new Date();
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
    const anchor = new Date(mostRecentDate);
    anchor.setDate(1);
    anchor.setHours(0, 0, 0, 0);
    for (let i = 11; i >= 0; i--) {
      const date = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1, 0, 0, 0, 0);
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0);
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
  })();
  const maxMonthlyRev12 =
    monthlyRevenueLast12.length > 0
      ? Math.max(...monthlyRevenueLast12.map((m) => m.revenue), 1)
      : 1;
  const peakMonth12 =
    monthlyRevenueLast12.length > 0
      ? monthlyRevenueLast12.reduce((max, m) =>
          m.revenue > max.revenue ? m : max
        )
      : { month: '-', revenue: 0 };

  const paymentModeStats = {};
  allTimeOrders.forEach((o) => {
    const mode = o.paymentMode || 'Not Set';
    if (!paymentModeStats[mode]) {
      paymentModeStats[mode] = { count: 0, amount: 0 };
    }
    paymentModeStats[mode].count++;

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

    paymentModeStats[mode].amount += isNaN(amount) ? 0 : amount;
  });

  // Sort by date (newest first), then by orderId as fallback
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = parseOrderDate(a.date || a.order_date || null);
      const dateB = parseOrderDate(b.date || b.order_date || null);

      // If both have dates, sort by date (newest first)
      if (dateA && dateB) {
        const timeDiff = dateB.getTime() - dateA.getTime();
        if (timeDiff !== 0) return timeDiff;
      }

      // If one has a date and the other doesn't, prioritize the one with a date
      if (dateA && !dateB) return -1;
      if (!dateA && dateB) return 1;

      // If dates are equal or both missing, fall back to orderId sorting
      const seqA = extractOrderIdSequence(a.orderId);
      const seqB = extractOrderIdSequence(b.orderId);
      if (seqA > 0 && seqB > 0) {
        return seqB - seqA;
      }
      const idA = (a.orderId || '').toString();
      const idB = (b.orderId || '').toString();
      if (idA && idB) {
        return idB.localeCompare(idA);
      }
      return 0;
    })
    .slice(0, 10);

  const getMonthLockStatus = () => {
    if (!settings || !settings.monthLockedTill) {
      return { status: 'OPEN', lockedTill: null };
    }
    try {
      const lockedDate = new Date(settings.monthLockedTill);
      const currentDate = new Date();
      if (lockedDate > currentDate) {
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
        const month = monthNames[lockedDate.getMonth()];
        const year = lockedDate.getFullYear();
        return { status: 'LOCKED', lockedTill: `${month} ${year}` };
      }
    } catch (e) {}
    return { status: 'OPEN', lockedTill: null };
  };
  const monthLockStatus = getMonthLockStatus();

  // Show message if no orders after loading completes
  if (!loading && allTimeOrders.length === 0) {
    return (
      <div className="admin-content" ref={dashboardContainerRef}>
        <div className="dashboard-empty-state">
          <Icon name="chart-line" className="dashboard-empty-state-icon" />
          <h2>No Orders Found</h2>
          <p className="dashboard-empty-text">
            No orders are currently loaded. Please check:
          </p>
          <ul className="dashboard-empty-list">
            <li>Is the backend API running?</li>
            <li>Are you authenticated as admin?</li>
            <li>Check the browser console for API errors</li>
          </ul>
          <button
            className="btn btn-primary dashboard-empty-button"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content" ref={dashboardContainerRef}>
      <div className="dashboard-with-sidebar">
        <div className="dashboard-main-content">
          <section
            className="dashboard-section-block"
            aria-labelledby="dashboard-key-metrics"
          >
            <h2
              id="dashboard-key-metrics"
              className="dashboard-section-heading"
            ></h2>
            <div
              className="admin-stats"
              key={`stats-${allTimeTotal}-${allTimeRevenue}-${allTimeUnpaidAmount}`}
            >
              <div
                className="stat-card stat-card-primary stat-card-clickable"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (setActiveTab) {
                    setActiveTab('analytics');
                  }
                }}
                title="Click to view detailed analytics"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (setActiveTab) {
                      setActiveTab('analytics');
                    }
                  }
                }}
              >
                <Icon name="rupee-sign" />
                <div>
                  <h3>₹ {formatCurrency(allTimeRevenue)}</h3>
                  <p>Total Revenue</p>
                  <p
                    className={`stat-card-subtitle ${
                      isNewGrowth
                        ? 'stat-card-subtitle-success'
                        : yearOverYearGrowth >= 0
                          ? 'stat-card-subtitle-success'
                          : 'stat-card-subtitle-danger'
                    }`}
                  >
                    {isNewGrowth
                      ? 'New ↑'
                      : `${yearOverYearGrowth >= 0 ? '+' : ''}${yearOverYearGrowth.toFixed(1)}% ${
                          yearOverYearGrowth >= 0 ? '↑' : '↓'
                        } vs last year`}
                  </p>
                </div>
              </div>
              <div
                className="stat-card stat-card-clickable"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (setActiveTab) {
                    setActiveTab('allOrdersData');
                  }
                }}
                title="Click to view all orders"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (setActiveTab) {
                      setActiveTab('allOrdersData');
                    }
                  }
                }}
              >
                <Icon name="shopping-cart" className="icon-color-accent" />
                <div>
                  <h3>{allTimeTotal}</h3>
                  <p>Total Orders</p>
                  <p className="stat-card-subtitle">All time</p>
                </div>
              </div>
              <div
                className="stat-card stat-card-clickable"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (setActiveTab) {
                    setActiveTab('pendingAmounts');
                  }
                }}
                title="Click to view pending payments"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (setActiveTab) {
                      setActiveTab('pendingAmounts');
                    }
                  }
                }}
              >
                <Icon
                  name="exclamation-triangle"
                  className="stat-card-icon-warning"
                />
                <div>
                  <h3>₹ {formatCurrency(allTimeUnpaidAmount)}</h3>
                  <p>Pending Payments</p>
                  <p className="stat-card-subtitle">
                    {unpaidOrdersCount}{' '}
                    {unpaidOrdersCount === 1 ? 'order' : 'orders'}
                  </p>
                </div>
              </div>
              <div
                className="stat-card stat-card-clickable"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (setActiveTab) {
                    setActiveTab('customers');
                  }
                }}
                title="Click to view all customers"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (setActiveTab) {
                      setActiveTab('customers');
                    }
                  }
                }}
              >
                <Icon name="users" className="icon-color-accent" />
                <div>
                  <h3>{allUniqueAddresses}</h3>
                  <p>Total Customers</p>
                  <p className="stat-card-subtitle">Unique addresses</p>
                </div>
              </div>
              <div className="stat-card">
                <Icon name="chart-line" className="stat-card-icon-success" />
                <div>
                  <h3>₹ {formatCurrency(allTimeAvgOrderValue)}</h3>
                  <p>Avg Order Value</p>
                </div>
              </div>
              <div className="stat-card">
                <Icon name="chart-line" className="stat-card-icon-success" />
                <div>
                  <h3>₹ {formatCurrency(profitStats.profit)}</h3>
                  <p>Profit After Expenses</p>
                  <p className="stat-card-subtitle">
                    {profitStats.profitMarginPercent.toFixed(1)}% margin
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            className="dashboard-section-block"
            aria-labelledby="dashboard-at-a-glance"
          >
            <h2
              id="dashboard-at-a-glance"
              className="dashboard-section-heading"
            ></h2>
            <div
              className="dashboard-quick-stats"
              aria-label="Today, week, month, pending"
            >
              <div className="dashboard-quick-stat">
                <span className="dashboard-quick-stat-label">Today</span>
                <span className="dashboard-quick-stat-value">
                  ₹ {formatCurrency(todayRevenue)}
                </span>
                <span className="dashboard-quick-stat-meta">
                  {todayOrdersCount} orders
                </span>
              </div>
              <div className="dashboard-quick-stat">
                <span className="dashboard-quick-stat-label">This week</span>
                <span className="dashboard-quick-stat-value">
                  ₹ {formatCurrency(thisWeekRevenue)}
                </span>
                <span className="dashboard-quick-stat-meta">
                  {thisWeekOrdersCount} orders
                </span>
              </div>
              <div className="dashboard-quick-stat">
                <span className="dashboard-quick-stat-label">This month</span>
                <span className="dashboard-quick-stat-value">
                  ₹ {formatCurrency(thisMonthRevenue)}
                </span>
                <span
                  className={`dashboard-quick-stat-meta ${
                    monthOverMonthGrowth >= 0
                      ? 'dashboard-quick-stat-meta--up'
                      : 'dashboard-quick-stat-meta--down'
                  }`}
                >
                  {thisMonthOrdersCount} orders
                  {lastMonthRevenue >= 0 && (
                    <>
                      {' · '}
                      {monthOverMonthGrowth >= 0 ? '+' : ''}
                      {monthOverMonthGrowth.toFixed(0)}% vs last month
                    </>
                  )}
                </span>
              </div>
              <div
                className="dashboard-quick-stat dashboard-quick-stat--pending"
                onClick={(e) => {
                  e.preventDefault();
                  if (setActiveTab) setActiveTab('pendingAmounts');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && setActiveTab) {
                    e.preventDefault();
                    setActiveTab('pendingAmounts');
                  }
                }}
                title="View pending payments"
              >
                <span className="dashboard-quick-stat-label">Pending</span>
                <span className="dashboard-quick-stat-value">
                  ₹ {formatCurrency(allTimeUnpaidAmount)}
                </span>
                <span className="dashboard-quick-stat-meta">
                  {unpaidOrdersCount} orders
                </span>
              </div>
            </div>
          </section>

          <section
            className="dashboard-section-block"
            aria-labelledby="dashboard-trends"
          >
            <h2 id="dashboard-trends" className="dashboard-section-heading">
              Trends
            </h2>
            <div className="dashboard-charts-container">
              <div className="dashboard-chart-full-width">
                <div className="dashboard-card revenue-trend-card revenue-trend-12m">
                  <h3 className="revenue-trend-title">
                    <Icon
                      name="chart-line"
                      className="revenue-trend-title-icon"
                    />
                    Monthly Revenue (Last 12M)
                  </h3>
                  <div className="revenue-trend-body">
                    <div className="revenue-trend-chart">
                      {monthlyRevenueLast12.length > 0 ? (
                        <>
                          <div
                            className="revenue-trend-y-axis-12m"
                            aria-hidden="true"
                          >
                            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                              <div
                                key={pct}
                                className="revenue-trend-y-tick-12m"
                              >
                                ₹
                                {formatCurrency(
                                  Math.round(pct * maxMonthlyRev12)
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="revenue-trend-bars-row">
                            {monthlyRevenueLast12.map((month, idx) => {
                              const barHeightPercent =
                                maxMonthlyRev12 > 0
                                  ? (month.revenue / maxMonthlyRev12) * 100
                                  : 0;
                              const isPeak =
                                month.month === peakMonth12.month &&
                                month.revenue === peakMonth12.revenue;
                              const rev = month.revenue;
                              const barColorClass =
                                rev <= 0
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
                                      title={`${month.month}: ₹${formatCurrency(month.revenue)} (${month.orders} orders)${isPeak ? ' (Peak)' : ''}`}
                                    />
                                  </div>
                                  <div className="revenue-trend-bar-value-wrap">
                                    {rev > 0 && (
                                      <span className="revenue-trend-bar-value">
                                        ₹ {formatCurrency(month.revenue)}
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
                          No revenue data
                        </div>
                      )}
                    </div>
                    {monthlyRevenueLast12.length > 0 &&
                      peakMonth12.revenue > 0 && (
                        <div className="revenue-trend-summary">
                          Peak:{' '}
                          <span className="revenue-trend-summary-value">
                            ₹ {formatCurrency(peakMonth12.revenue)}
                          </span>
                          <span className="revenue-trend-summary-month">
                            ({peakMonth12.month})
                          </span>
                        </div>
                      )}
                    {setActiveTab && (
                      <button
                        type="button"
                        className="btn btn-small btn-section-link revenue-trend-cta"
                        onClick={() => setActiveTab('analytics')}
                      >
                        See full analytics{' '}
                        <span className="section-link-arrow" aria-hidden="true">
                          →
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Revenue YoY: unique vertical grouped bar chart + year progress strip */}
              <div className="dashboard-chart-full-width">
                <div className="dashboard-card widget revenue-yoy-card">
                  {/* Year progress strip: visual “how far through the year” */}
                  {monthlyRevenueData.length > 0 && (
                    <div
                      className="revenue-yoy-progress-strip"
                      aria-hidden="true"
                    >
                      <div className="revenue-yoy-progress-strip-inner">
                        {monthNames.map((name, i) => {
                          const isPast =
                            i < now.getMonth() ||
                            (i === now.getMonth() && now.getDate() >= 15);
                          return (
                            <span
                              key={name}
                              className={`revenue-yoy-progress-segment ${
                                isPast
                                  ? 'revenue-yoy-progress-segment-filled'
                                  : ''
                              }`}
                              title={`${name} ${now.getFullYear()}`}
                            />
                          );
                        })}
                      </div>
                      <span className="revenue-yoy-progress-label">
                        {now.getMonth() + 1}/12 months
                      </span>
                    </div>
                  )}
                  <div className="revenue-yoy-header">
                    <h3 className="dashboard-section-title m-0">
                      <Icon name="chart-line" className="icon-opacity" />
                      Revenue (Year-over-Year)
                    </h3>
                    {sortedYears.length > 1 &&
                      monthlyRevenueData.length > 0 && (
                        <div className="revenue-yoy-legend">
                          {sortedYears.map((year) => {
                            const isCurrentYear = year === now.getFullYear();
                            const isLastYear = year === now.getFullYear() - 1;
                            return (
                              <div
                                key={year}
                                className="revenue-yoy-legend-item"
                              >
                                <span
                                  className={`revenue-yoy-legend-dot ${
                                    isCurrentYear
                                      ? 'revenue-yoy-legend-current'
                                      : isLastYear
                                        ? 'revenue-yoy-legend-last'
                                        : 'revenue-yoy-legend-other'
                                  }`}
                                />
                                <span>{year}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                  <div className="revenue-yoy-body">
                    {monthlyRevenueData.length > 0 ? (
                      <>
                        <div className="revenue-yoy-chart">
                          <div className="revenue-yoy-y-axis">
                            {(() => {
                              const maxRev = Math.max(
                                ...monthlyRevenueData.flatMap((m) =>
                                  Object.values(m.years).map((y) => y.revenue)
                                ),
                                1
                              );
                              const steps = [1, 0.75, 0.5, 0.25, 0];
                              return steps.map((pct, i) => (
                                <div key={i} className="revenue-yoy-y-tick">
                                  ₹ {formatCurrency(Math.round(pct * maxRev))}
                                </div>
                              ));
                            })()}
                          </div>
                          <div className="revenue-yoy-bars-container">
                            {monthlyRevenueData.map((monthData, idx) => {
                              const maxRevenue = Math.max(
                                ...monthlyRevenueData.flatMap((m) =>
                                  Object.values(m.years).map((y) => y.revenue)
                                ),
                                1
                              );
                              const yearEntries = sortedYears
                                .map((year) => ({
                                  year,
                                  ...(monthData.years[year] || {
                                    revenue: 0,
                                    orders: 0,
                                  }),
                                }))
                                .sort((a, b) => a.year - b.year);
                              const currentYearRev =
                                monthData.years[now.getFullYear()]?.revenue ??
                                0;
                              const lastYearRev =
                                monthData.years[now.getFullYear() - 1]
                                  ?.revenue ?? 0;
                              const growthPct =
                                lastYearRev > 0
                                  ? ((currentYearRev - lastYearRev) /
                                      lastYearRev) *
                                    100
                                  : currentYearRev > 0
                                    ? 100
                                    : null;

                              return (
                                <div
                                  key={idx}
                                  className="revenue-yoy-month-group"
                                  title={`${monthData.monthName}: ${yearEntries
                                    .map(
                                      (e) =>
                                        `${e.year} ₹ ${formatCurrency(e.revenue)}`
                                    )
                                    .join(', ')}`}
                                >
                                  <div className="revenue-yoy-month-bars">
                                    {yearEntries.map(
                                      ({ year, revenue, orders }) => {
                                        const heightPct =
                                          maxRevenue > 0
                                            ? (revenue / maxRevenue) * 100
                                            : 0;
                                        const isCurrentYear =
                                          year === now.getFullYear();
                                        const isLastYear =
                                          year === now.getFullYear() - 1;
                                        return (
                                          <div
                                            key={year}
                                            className="revenue-yoy-bar-wrap"
                                            title={`${monthData.monthName} ${year}: ₹ ${formatCurrency(revenue)} (${orders} orders)`}
                                          >
                                            <div
                                              className={`revenue-yoy-bar ${
                                                isCurrentYear
                                                  ? 'revenue-yoy-bar-current'
                                                  : isLastYear
                                                    ? 'revenue-yoy-bar-last'
                                                    : 'revenue-yoy-bar-other'
                                              }`}
                                              style={{
                                                height: `${heightPct}%`,
                                              }}
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                  <div className="revenue-yoy-month-label">
                                    {monthData.monthName}
                                  </div>
                                  {growthPct !== null &&
                                    sortedYears.length >= 2 && (
                                      <div
                                        className={`revenue-yoy-growth ${
                                          growthPct >= 0
                                            ? 'revenue-yoy-growth-up'
                                            : 'revenue-yoy-growth-down'
                                        }`}
                                        title={`YoY: ${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(1)}%`}
                                      >
                                        {growthPct >= 0 ? '+' : ''}
                                        {growthPct.toFixed(0)}%
                                      </div>
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="revenue-trend-empty">
                        <Icon
                          name="chart-line"
                          className="revenue-trend-empty-icon"
                        />
                        <p className="revenue-trend-empty-title">
                          No revenue data available
                        </p>
                        <p className="revenue-trend-empty-desc">
                          Start adding orders to see your revenue trends
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {recentOrders.length > 0 && (
            <section
              className="dashboard-section-block"
              aria-labelledby="dashboard-recent-orders"
            >
              <h2
                id="dashboard-recent-orders"
                className="dashboard-section-heading"
              >
                Recent activity
              </h2>
              <div className="dashboard-section">
                <div className="recent-orders-header">
                  <h3 className="dashboard-section-title recent-orders-title">
                    <Icon name="clock-rotate-left" className="icon-opacity" />
                    Recent Orders (Last 10)
                  </h3>
                  <button
                    type="button"
                    className="btn btn-small btn-section-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (setActiveTab) {
                        setActiveTab('allOrdersData');
                      }
                    }}
                  >
                    View All Orders{' '}
                    <span className="section-link-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
                <div className="dashboard-card widget">
                  <div className="recent-orders-table-container">
                    <table className="recent-orders-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Address</th>
                          <th>Quantity</th>
                          <th>Amount</th>
                          <th>Mode</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order, idx) => {
                          const orderDate = parseOrderDate(
                            order.date || order.order_date || null
                          );
                          const dateStr = formatDate(orderDate);
                          const status = (order.status || '').toLowerCase();
                          const isPaid = status === 'paid';
                          return (
                            <tr key={idx}>
                              <td>{dateStr}</td>
                              <td>
                                {order.deliveryAddress ||
                                  order.customerAddress ||
                                  order.address ||
                                  'N/A'}
                              </td>
                              <td>{order.quantity || 1}</td>
                              <td>₹ {formatCurrency(getOrderAmount(order))}</td>
                              <td>{order.mode || 'N/A'}</td>
                              <td>
                                <span
                                  className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`}
                                >
                                  {order.status || 'No Status'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
