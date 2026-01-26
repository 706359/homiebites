import { useEffect, useRef, useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { getProfitStats } from './utils/calculations.js';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  extractOrderIdSequence,
  formatCurrency,
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
        .querySelectorAll('.chart-bar[data-height]')
        .forEach((bar) => {
          const heightPercent = parseFloat(bar.getAttribute('data-height'));
          const container = bar.closest('.chart-bars-container');
          if (container) {
            const raw = container.offsetHeight || 180;
            const containerHeight = Math.min(raw, 220);
            const height = (heightPercent / 100) * containerHeight;
            bar.style.setProperty('--bar-height', `${height}px`);
            bar.style.height = 'var(--bar-height)';
          }
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

  // Chart height: 120px on mobile, 180px on desktop
  const chartHeight = isMobile ? 120 : 180;
  // Early return if loading to avoid unnecessary calculations
  if (loading) {
    return (
      <div className="admin-content" ref={dashboardContainerRef}>
        <PremiumLoader message="Loading dashboard data..." size="large" />
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

  // Calculate payment mode data for all 12 months with year-over-year comparison
  const monthlyPaymentModeData = [];
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const monthData = {
      monthIndex: monthIndex,
      monthName: monthNames[monthIndex],
      years: {},
    };

    // Calculate payment mode amounts for each year for this month
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

      // Calculate Cash and Online amounts for this month
      const cashAmount = monthOrders
        .filter((o) => {
          const mode = (o.paymentMode || '').toLowerCase();
          return mode === 'cash';
        })
        .reduce((sum, o) => {
          let amount = null;
          if (
            o.totalAmount !== undefined &&
            o.totalAmount !== null &&
            o.totalAmount !== 0
          ) {
            amount = parseFloat(o.totalAmount);
          } else if (
            o.total !== undefined &&
            o.total !== null &&
            o.total !== 0
          ) {
            amount = parseFloat(o.total);
          }
          if (amount === null || isNaN(amount) || amount === 0) {
            const qty = parseFloat(o.quantity || 1);
            const price = parseFloat(o.unitPrice || 0);
            amount = Math.round(qty * price);
          }
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      const onlineAmount = monthOrders
        .filter((o) => {
          const mode = (o.paymentMode || '').toLowerCase();
          return mode === 'online';
        })
        .reduce((sum, o) => {
          let amount = null;
          if (
            o.totalAmount !== undefined &&
            o.totalAmount !== null &&
            o.totalAmount !== 0
          ) {
            amount = parseFloat(o.totalAmount);
          } else if (
            o.total !== undefined &&
            o.total !== null &&
            o.total !== 0
          ) {
            amount = parseFloat(o.total);
          }
          if (amount === null || isNaN(amount) || amount === 0) {
            const qty = parseFloat(o.quantity || 1);
            const price = parseFloat(o.unitPrice || 0);
            amount = Math.round(qty * price);
          }
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      // Always include year entry, even if no orders (for consistent chart display)
      monthData.years[year] = {
        cash: cashAmount,
        online: onlineAmount,
      };
    });

    monthlyPaymentModeData.push(monthData);
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
          <i className="fa-solid fa-chart-line dashboard-empty-state-icon"></i>
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
              <i className="fa-solid fa-rupee-sign"></i>
              <div>
                <h3>₹{formatCurrency(allTimeRevenue)}</h3>
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
              <i className="fa-solid fa-shopping-cart icon-color-accent"></i>
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
              <i className="fa-solid fa-exclamation-triangle stat-card-icon-warning"></i>
              <div>
                <h3>₹{formatCurrency(allTimeUnpaidAmount)}</h3>
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
              <i className="fa-solid fa-users icon-color-accent"></i>
              <div>
                <h3>{allUniqueAddresses}</h3>
                <p>Total Customers</p>
                <p className="stat-card-subtitle">Unique addresses</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fa-solid fa-chart-line stat-card-icon-success"></i>
              <div>
                <h3>₹{formatCurrency(allTimeAvgOrderValue)}</h3>
                <p>Avg Order Value</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fa-solid fa-chart-line stat-card-icon-success"></i>
              <div>
                <h3>₹{formatCurrency(profitStats.profit)}</h3>
                <p>Profit After Expenses</p>
                <p className="stat-card-subtitle">
                  {profitStats.profitMarginPercent.toFixed(1)}% margin
                </p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fa-solid fa-percent stat-card-icon-secondary"></i>
              <div>
                <h3>{profitStats.profitMarginPercent.toFixed(1)}%</h3>
                <p>Profit Margin</p>
                <p className="stat-card-subtitle">
                  Target: {profitStats.targetProfitMargin}%
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-charts-container">
            <div className="dashboard-chart-full-width">
              <div className="dashboard-card widget">
                <h3 className="dashboard-section-title">
                  <i className="fa-solid fa-chart-line icon-opacity"></i>
                  Revenue Trend (Year-over-Year Comparison)
                </h3>
                <div className="chart-container">
                  {monthlyRevenueData.length > 0 ? (
                    (() => {
                      // Find max revenue across all months and years for scaling
                      const maxRevenue = Math.max(
                        ...monthlyRevenueData.flatMap((m) =>
                          Object.values(m.years).map((y) => y.revenue)
                        ),
                        1
                      );

                      return monthlyRevenueData.map((monthData, idx) => {
                        // Ensure all years from sortedYears are included, even if no data
                        const yearEntries = sortedYears.map(year => {
                          const data = monthData.years[year] || { revenue: 0, orders: 0 };
                          return [year.toString(), data];
                        }).sort(([a], [b]) => parseInt(a) - parseInt(b));

                        return (
                          <div
                            key={idx}
                            className={`bar-chart-item ${
                              yearEntries.length > 1
                                ? 'bar-chart-item-multi-year'
                                : 'bar-chart-item-single-year'
                            }`}
                          >
                            <div className="chart-bars-container">
                              {yearEntries.map(([year, data]) => {
                                const barHeightPercent =
                                  maxRevenue > 0
                                    ? (data.revenue / maxRevenue) * 100
                                    : 0;
                                const isCurrentYear =
                                  parseInt(year) === now.getFullYear();
                                const isLastYear =
                                  parseInt(year) === now.getFullYear() - 1;

                                return (
                                  <div
                                    key={year}
                                    className={`chart-year-entry ${
                                      yearEntries.length > 1
                                        ? 'chart-year-entry-multi'
                                        : 'chart-year-entry-single'
                                    }`}
                                  >
                                    <div
                                      className={`chart-bar ${
                                        data.revenue > 0
                                          ? ''
                                          : 'chart-bar-empty'
                                      } ${
                                        isCurrentYear
                                          ? 'chart-bar-current-year'
                                          : isLastYear
                                            ? 'chart-bar-last-year'
                                            : 'chart-bar-other-year'
                                      }`}
                                      data-height={barHeightPercent.toFixed(2)}
                                      title={`${monthData.monthName} ${year}: ₹${formatCurrency(
                                        data.revenue
                                      )} (${data.orders} orders)`}
                                    ></div>
                                    {yearEntries.length > 1 && (
                                      <span className="text-xs text-light chart-year-label">
                                        {year.toString().slice(-2)}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-xs text-light text-center font-medium chart-month-label">
                              {monthData.monthName}
                            </span>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="dashboard-empty-state">
                      <i className="fa-solid fa-chart-line dashboard-empty-state-icon"></i>
                      <p className="empty-state-text">
                        No revenue data available
                      </p>
                      <p className="dashboard-empty-text">
                        Start adding orders to see your revenue trends
                      </p>
                    </div>
                  )}
                </div>
                {sortedYears.length > 1 && (
                  <div className="chart-legend-container">
                    {sortedYears.map((year) => {
                      const isCurrentYear = year === now.getFullYear();
                      const isLastYear = year === now.getFullYear() - 1;
                      return (
                        <div key={year} className="chart-legend-item">
                          <div
                            className={`chart-legend-color ${
                              isCurrentYear
                                ? 'chart-legend-color-current'
                                : isLastYear
                                  ? 'chart-legend-color-last'
                                  : 'chart-legend-color-other'
                            }`}
                          />
                          <span>{year}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-chart-full-width">
              <div className="dashboard-card widget">
                <h3 className="dashboard-section-title">
                  <i className="fa-solid fa-chart-bar icon-opacity"></i>
                  Payment Mode Trend (Year-over-Year Comparison)
                </h3>
                <div className="chart-container">
                  {monthlyPaymentModeData.length > 0 ? (
                    (() => {
                      // Find max amount across all months, years, and payment modes for scaling
                      const maxAmount = Math.max(
                        ...monthlyPaymentModeData.flatMap((m) =>
                          Object.values(m.years).flatMap((y) => [
                            y.cash || 0,
                            y.online || 0,
                          ])
                        ),
                        1
                      );

                      return monthlyPaymentModeData.map((monthData, idx) => {
                        // Ensure all years from sortedYears are included, even if no data
                        const yearEntries = sortedYears.map(year => {
                          const data = monthData.years[year] || { cash: 0, online: 0 };
                          return [year.toString(), data];
                        }).sort(([a], [b]) => parseInt(a) - parseInt(b));

                        return (
                          <div
                            key={idx}
                            className={`bar-chart-item ${
                              yearEntries.length > 1
                                ? 'bar-chart-item-multi-year'
                                : 'bar-chart-item-single-year'
                            }`}
                          >
                            <div className="chart-bars-container">
                              {yearEntries.map(([year, data]) => {
                                const cashHeightPercent =
                                  maxAmount > 0
                                    ? ((data.cash || 0) / maxAmount) * 100
                                    : 0;
                                const onlineHeightPercent =
                                  maxAmount > 0
                                    ? ((data.online || 0) / maxAmount) * 100
                                    : 0;
                                const isCurrentYear =
                                  parseInt(year) === now.getFullYear();
                                const isLastYear =
                                  parseInt(year) === now.getFullYear() - 1;
                                const yearMod = isCurrentYear
                                  ? 'current'
                                  : isLastYear
                                    ? 'last'
                                    : 'other';

                                return (
                                  <div
                                    key={year}
                                    className={`chart-year-entry ${
                                      yearEntries.length > 1
                                        ? 'chart-year-entry-multi'
                                        : 'chart-year-entry-single'
                                    }`}
                                  >
                                    <div className="chart-payment-mode-group">
                                      <div
                                        className={`chart-bar ${
                                          (data.cash || 0) > 0
                                            ? `chart-bar-${yearMod}-cash`
                                            : 'chart-bar-empty'
                                        }`}
                                        data-height={cashHeightPercent.toFixed(
                                          2
                                        )}
                                        title={`${
                                          monthData.monthName
                                        } ${year} - Cash: ₹${formatCurrency(data.cash || 0)}`}
                                      ></div>
                                      <div
                                        className={`chart-bar ${
                                          (data.online || 0) > 0
                                            ? `chart-bar-${yearMod}-online`
                                            : 'chart-bar-empty'
                                        }`}
                                        data-height={onlineHeightPercent.toFixed(
                                          2
                                        )}
                                        title={`${
                                          monthData.monthName
                                        } ${year} - Online: ₹${formatCurrency(data.online || 0)}`}
                                      ></div>
                                    </div>
                                    {yearEntries.length > 1 && (
                                      <span className="text-xs text-light chart-year-label">
                                        {year.toString().slice(-2)}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-xs text-light text-center font-medium chart-month-label">
                              {monthData.monthName}
                            </span>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="dashboard-empty-state">
                      <i className="fa-solid fa-chart-bar dashboard-empty-state-icon"></i>
                      <p className="empty-state-text">
                        No payment mode data available
                      </p>
                      <p className="dashboard-empty-text">
                        Payment data will appear here once orders are added
                      </p>
                    </div>
                  )}
                </div>
                {sortedYears.length > 1 && (
                  <div className="chart-legend-container">
                    {sortedYears.map((year) => {
                      const isCurrentYear = year === now.getFullYear();
                      const isLastYear = year === now.getFullYear() - 1;
                      return (
                        <div key={year} className="chart-legend-item">
                          <div
                            className={`chart-legend-color ${
                              isCurrentYear
                                ? 'chart-legend-color-current'
                                : isLastYear
                                  ? 'chart-legend-color-last'
                                  : 'chart-legend-color-other'
                            }`}
                          />
                          <span>{year}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="chart-legend-container dashboard-chart-legend">
                  <div className="chart-legend-item">
                    <div className="chart-legend-color chart-legend-color-cash"></div>
                    <span>Cash</span>
                  </div>
                  <div className="chart-legend-item">
                    <div className="chart-legend-color chart-legend-color-online"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {recentOrders.length > 0 && (
            <div className="dashboard-section">
              <div className="recent-orders-header">
                <h3 className="dashboard-section-title m-0">
                  <i className="fa-solid fa-clock-rotate-left icon-opacity"></i>
                  Recent Orders (Last 10)
                </h3>
                <button
                  className="btn btn-ghost btn-small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (setActiveTab) {
                      setActiveTab('allOrdersData');
                    }
                  }}
                >
                  View All Orders →
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
                            <td>
                              ₹
                              {formatCurrency(
                                order.total ||
                                  order.totalAmount ||
                                  (order.quantity || 1) * (order.unitPrice || 0)
                              )}
                            </td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
