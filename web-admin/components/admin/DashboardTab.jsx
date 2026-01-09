import { getFilteredOrdersByDate, getProfitStats } from './utils/calculations.js';
import { formatDate, formatDateShort, parseOrderDate } from './utils/dateUtils.js';
import { formatCurrency, formatNumberIndian, getTotalRevenue, isPendingStatus, sortOrdersByOrderId } from './utils/orderUtils.js';
import PremiumLoader from './PremiumLoader.jsx';

const DashboardTab = ({ orders, setActiveTab, settings, loading = false }) => {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // CURRENT MONTH ORDERS
  const currentMonthOrders = getFilteredOrdersByDate(orders, 'month', '', '');
  const currentMonthTotal = currentMonthOrders.length;
  const currentMonthRevenue = getTotalRevenue(currentMonthOrders);

  // PROFIT STATISTICS (30% margin after expenses)
  const profitStats = getProfitStats(currentMonthRevenue, 70, 30);

  // Calculate unpaid amount - ensure we handle both total and totalAmount fields correctly
  const currentMonthUnpaidAmount = currentMonthOrders
    .filter((o) => isPendingStatus(o.status))
    .reduce((sum, o) => {
      // Try total first, then totalAmount, then calculate from quantity * unitPrice
      let amount = parseFloat(o.total || o.totalAmount || 0);
      if (isNaN(amount) || amount === 0) {
        // Fallback: calculate from quantity * unitPrice if total is missing
        const qty = parseFloat(o.quantity || 1);
        const price = parseFloat(o.unitPrice || 0);
        amount = qty * price;
      }
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  const unpaidOrdersCount = currentMonthOrders.filter((o) => isPendingStatus(o.status)).length;

  // TOTAL CUSTOMERS (unique addresses)
  const allUniqueAddresses = new Set(
    orders.map((o) => o.deliveryAddress || o.customerAddress || o.address).filter(Boolean)
  ).size;

  // MONTH-OVER-MONTH GROWTH
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthOrders = orders.filter((o) => {
    try {
      // Never use createdAt (today's date) as fallback - only use actual order date
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
    } catch (e) {
      return false;
    }
  });
  const lastMonthRevenue = getTotalRevenue(lastMonthOrders);
  const monthOverMonthGrowth =
    lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : currentMonthRevenue > 0
        ? Infinity
        : 0;
  const isNewGrowth = lastMonthRevenue === 0 && currentMonthRevenue > 0;

  // SECONDARY STATS
  // Today's Revenue
  const todayOrders = orders.filter((o) => {
    try {
      // Never use createdAt (today's date) as fallback - only use actual order date
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      return orderDate >= today && orderDate < tomorrow;
    } catch (e) {
      return false;
    }
  });
  const todayOrdersCount = todayOrders.length;
  const todayRevenue = getTotalRevenue(todayOrders);

  // This Week Revenue
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  const thisWeekOrders = orders.filter((o) => {
    try {
      // Never use createdAt (today's date) as fallback - only use actual order date
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      return orderDate >= thisWeekStart;
    } catch (e) {
      return false;
    }
  });
  const thisWeekRevenue = getTotalRevenue(thisWeekOrders);
  const thisWeekOrdersCount = thisWeekOrders.length;

  // Avg Order Value
  const currentMonthAvgOrderValue =
    currentMonthTotal > 0 ? Math.round(currentMonthRevenue / currentMonthTotal) : 0;

  // Cancel Rate
  const cancelledOrders = orders.filter((o) => {
    const status = (o.status || '').toLowerCase();
    return status === 'cancelled' || status === 'cancel';
  });
  const cancelRate = orders.length > 0 ? (cancelledOrders.length / orders.length) * 100 : 0;

  // CHARTS DATA
  // Revenue Trend (Last 6 Months)
  const last6MonthsRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now);
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

    // Format as "Feb 2025" (month abbreviation + year)
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const revenue = getTotalRevenue(monthOrders);
    last6MonthsRevenue.push({
      month: monthName,
      revenue: revenue,
      orders: monthOrders.length,
    });
  }
  

  // Orders by Mode (Lunch vs Dinner)
  const ordersByMode = {
    Lunch: 0,
    Dinner: 0,
    'Not Set': 0,
  };
  currentMonthOrders.forEach((o) => {
    const mode = o.mode || 'Not Set';
    ordersByMode[mode] = (ordersByMode[mode] || 0) + 1;
  });

  // Daily Orders This Month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = currentMonthEnd.getDate();
  const dailyOrdersData = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayOrders = currentMonthOrders.filter((o) => {
      try {
        // Never use createdAt (today's date) as fallback - only use actual order date
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
  

  // Payment Mode Split
  const paymentModeStats = {};
  currentMonthOrders.forEach((o) => {
    const mode = o.paymentMode || 'Not Set';
    if (!paymentModeStats[mode]) {
      paymentModeStats[mode] = { count: 0, amount: 0 };
    }
    paymentModeStats[mode].count++;
    // Try total first, then totalAmount, then calculate from quantity * unitPrice
    let amount = parseFloat(o.total || o.totalAmount || 0);
    if (isNaN(amount) || amount === 0) {
      const qty = parseFloat(o.quantity || 1);
      const price = parseFloat(o.unitPrice || 0);
      amount = qty * price;
    }
    paymentModeStats[mode].amount += isNaN(amount) ? 0 : amount;
  });

  // RECENT ORDERS (Last 10) - sorted by orderId (newest first)
  const recentOrders = sortOrdersByOrderId(orders).slice(0, 10);

  // MONTH LOCK STATUS
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

  // LOADING STATE
  if (loading) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Dashboard</h2>
        </div>
        <PremiumLoader message='Loading dashboard data...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      <div className='dashboard-with-sidebar'>
        <div className='dashboard-main-content'>
          {/* KEY METRICS - Only Important Ones */}
      <div className='admin-stats'>
        <div className='stat-card'>
          <i className='fa-solid fa-rupee-sign'></i>
          <div>
            <h3>₹{formatCurrency(currentMonthRevenue)}</h3>
            <p>Total Revenue</p>
            <p className='stat-card-subtitle'>
              {isNewGrowth
                ? 'New ↑'
                : `${monthOverMonthGrowth >= 0 ? '+' : ''}${monthOverMonthGrowth.toFixed(1)}% ${monthOverMonthGrowth >= 0 ? '↑' : '↓'}`}
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-shopping-cart' style={{ color: 'var(--admin-accent)' }}></i>
          <div>
            <h3>{currentMonthTotal}</h3>
            <p>Total Orders</p>
            <p className='stat-card-subtitle'>
              Current month
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-exclamation-triangle stat-card-icon-warning'></i>
          <div>
            <h3>₹{formatCurrency(currentMonthUnpaidAmount)}</h3>
            <p>Pending Payments</p>
            <p className='stat-card-subtitle'>
              {unpaidOrdersCount} {unpaidOrdersCount === 1 ? 'order' : 'orders'}
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-users' style={{ color: 'var(--admin-accent)' }}></i>
          <div>
            <h3>{allUniqueAddresses}</h3>
            <p>Total Customers</p>
            <p className='stat-card-subtitle'>
              Unique addresses
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-chart-line stat-card-icon-success'></i>
          <div>
            <h3>₹{formatCurrency(currentMonthAvgOrderValue)}</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-chart-line stat-card-icon-success'></i>
          <div>
            <h3>₹{formatCurrency(profitStats.profit)}</h3>
            <p>Profit After Expenses</p>
            <p className='stat-card-subtitle'>
              {profitStats.profitMarginPercent.toFixed(1)}% margin
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-percent stat-card-icon-secondary'></i>
          <div>
            <h3>{profitStats.profitMarginPercent.toFixed(1)}%</h3>
            <p>Profit Margin</p>
            <p className='stat-card-subtitle'>
              Target: {profitStats.targetProfitMargin}%
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION - Essential Visualizations Only */}
      <div className='dashboard-grid-layout'>
        {/* Revenue Trend (Last 6 Months) */}
        <div className='dashboard-grid-item two-thirds'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-chart-line' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Revenue Trend (Last 6 Months)
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '1rem',
                minHeight: '200px',
                padding: '1rem',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              {last6MonthsRevenue.length > 0 ? (
                (() => {
                  const maxRevenue = Math.max(...last6MonthsRevenue.map((m) => m.revenue), 1);
                  return last6MonthsRevenue.map((month, idx) => {
                    const barHeight = maxRevenue > 0 ? (month.revenue / maxRevenue) * 180 : 0;
                    return (
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
                            maxWidth: '80px',
                            height: `${Math.max(barHeight, 10)}px`,
                            minHeight: '10px',
                            background: month.revenue > 0 ? 'var(--admin-accent, #449031)' : 'var(--admin-border, #e2e8f0)',
                            borderRadius: '8px 8px 0 0',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingBottom: month.revenue > 0 ? '0.5rem' : '0',
                            cursor: 'pointer',
                            position: 'relative',
                            boxShadow: month.revenue > 0 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                            transition: 'all 0.2s ease',
                          }}
                          title={`${month.month}: ₹${formatCurrency(month.revenue)} (${
                            month.orders
                          } orders)`}
                          onMouseEnter={(e) => {
                            if (month.revenue > 0) {
                              e.currentTarget.style.transform = 'scaleY(1.05)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scaleY(1)';
                            e.currentTarget.style.boxShadow = month.revenue > 0 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none';
                          }}
                        >
                          {month.revenue > 0 && (
                            <span
                              style={{
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                              }}
                            >
                              ₹{formatNumberIndian(month.revenue)}
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--admin-text-light)',
                            textAlign: 'center',
                            lineHeight: '1.2',
                            fontWeight: '500',
                          }}
                        >
                          {month.month}
                        </span>
                      </div>
                    );
                  });
                })()
              ) : (
                <div className='empty-state-text'>
                  No revenue data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Mode Split */}
        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-chart-bar' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Payment Mode Split
            </h3>
            <div
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              {Object.entries(paymentModeStats)
                .sort(([, a], [, b]) => b.count - a.count)
                .map(([mode, stats]) => {
                  const totalCount = Object.values(paymentModeStats).reduce(
                    (sum, s) => sum + s.count,
                    0
                  );
                  const percentage =
                    totalCount > 0
                      ? Math.min(100, parseFloat(((stats.count / totalCount) * 100).toFixed(2)))
                      : 0;
                  return (
                    <div
                      key={mode}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
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
                          }}
                        >
                          {mode}
                        </span>
                        <span
                          style={{
                            fontWeight: '700',
                            color: 'var(--admin-accent)',
                            fontSize: '1rem',
                          }}
                        >
                          {stats.count}
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '28px',
                          background: 'var(--admin-glass-border)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: `var(--admin-accent, #449031)`,
                            borderRadius: '6px',
                            transition: 'width 0.5s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '0.5rem',
                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {percentage > 15 && (
                            <span
                              style={{
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                              }}
                            >
                              {percentage.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--admin-text-light)',
                        }}
                      >
                        ₹{formatCurrency(stats.amount)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

          {/* RECENT ORDERS TABLE */}
          {recentOrders.length > 0 && (
            <div className='dashboard-section'>
              <div className='recent-orders-header'>
                <h3 className='dashboard-section-title' style={{ marginBottom: 0 }}>
                  <i
                    className='fa-solid fa-clock-rotate-left'
                    style={{ fontSize: '1rem', opacity: 0.7 }}
                  ></i>
                  Recent Orders (Last 10)
                </h3>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => setActiveTab('allOrdersData')}
                >
                  View All Orders →
                </button>
              </div>
              <div className='dashboard-card'>
                <div className='recent-orders-table-container'>
                  <table className='recent-orders-table'>
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
                          // Never use createdAt (today's date) as fallback - only use actual order date
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
