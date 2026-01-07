import PremiumLoader from './PremiumLoader.jsx';
import { getFilteredOrdersByDate } from '../utils/calculations.js';
import { formatDate, formatDateShort, parseOrderDate } from '../utils/dateUtils.js';
import { formatCurrency, getTotalRevenue, isPendingStatus } from '../utils/orderUtils.js';

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
  const currentMonthUnpaidAmount = currentMonthOrders
    .filter((o) => isPendingStatus(o.status))
    .reduce((sum, o) => {
      const total = parseFloat(o.total || o.totalAmount || 0);
      return sum + (isNaN(total) ? 0 : total);
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
      const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
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
      const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
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
      const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
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
        const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
        return orderDate >= date && orderDate < nextMonth;
      } catch (e) {
        return false;
      }
    });

    const monthName = formatDateShort(date);
    last6MonthsRevenue.push({
      month: monthName,
      revenue: getTotalRevenue(monthOrders),
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
        const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
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
    paymentModeStats[mode].amount += parseFloat(o.total || o.totalAmount || 0);
  });

  // RECENT ORDERS (Last 10)
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || a.order_date);
      const dateB = new Date(b.createdAt || b.date || b.order_date);
      return dateB - dateA;
    })
    .slice(0, 10);

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
        <PremiumLoader message="Loading dashboard data..." size="large" />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* DASHBOARD HEADER */}
      <div className='dashboard-header'>
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your business metrics</p>
        </div>
        <div
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background:
              monthLockStatus.status === 'LOCKED'
                ? 'var(--admin-warning-light)'
                : 'var(--admin-success-light)',
            border: `2px solid ${
              monthLockStatus.status === 'LOCKED' ? 'var(--admin-warning)' : 'var(--admin-success)'
            }`,
            fontSize: '0.875rem',
            fontWeight: '600',
            color:
              monthLockStatus.status === 'LOCKED' ? 'var(--admin-warning)' : 'var(--admin-success)',
          }}
        >
          {monthLockStatus.status === 'LOCKED' ? '🔒' : '🟢'} Current Month:{' '}
          {monthLockStatus.status}
          {monthLockStatus.lockedTill && ` (till ${monthLockStatus.lockedTill})`}
        </div>
      </div>

      {/* TOP STATS CARDS (4 columns) - Total Revenue, Total Orders, Pending Payments, Total Customers */}
      <div className='admin-stats'>
        <div className='stat-card'>
          <i className='fa-solid fa-rupee-sign'></i>
          <div>
            <h3>₹{formatCurrency(currentMonthRevenue)}</h3>
            <p>Total Revenue</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {isNewGrowth
                ? 'New'
                : `${monthOverMonthGrowth >= 0 ? '+' : ''}${monthOverMonthGrowth.toFixed(1)}%`}{' '}
              {monthOverMonthGrowth >= 0 ? '↑' : '↓'}
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-shopping-cart'></i>
          <div>
            <h3>{currentMonthTotal}</h3>
            <p>Total Orders</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              Current month
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i
            className='fa-solid fa-exclamation-triangle'
            style={{ color: 'var(--admin-warning)' }}
          ></i>
          <div>
            <h3>₹{formatCurrency(currentMonthUnpaidAmount)}</h3>
            <p>Pending Payments</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {unpaidOrdersCount} orders
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-users'></i>
          <div>
            <h3>{allUniqueAddresses}</h3>
            <p>Total Customers</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              Unique addresses
            </p>
          </div>
        </div>
      </div>

      {/* SECONDARY STATS CARDS (4 columns) - Today's Revenue, This Week Revenue, Avg Order Value, Cancel Rate */}
      <div className='admin-stats'>
        <div className='stat-card'>
          <i className='fa-solid fa-calendar-day' style={{ color: 'var(--admin-accent)' }}></i>
          <div>
            <h3>₹{formatCurrency(todayRevenue)}</h3>
            <p>Today's Revenue</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {todayOrdersCount} orders
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-calendar-week' style={{ color: 'var(--admin-secondary)' }}></i>
          <div>
            <h3>₹{formatCurrency(thisWeekRevenue)}</h3>
            <p>This Week Revenue</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {thisWeekOrdersCount} orders
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-chart-line' style={{ color: 'var(--admin-success)' }}></i>
          <div>
            <h3>₹{formatCurrency(currentMonthAvgOrderValue)}</h3>
            <p>Avg Order Value</p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-times-circle' style={{ color: 'var(--admin-danger)' }}></i>
          <div>
            <h3>{cancelRate.toFixed(1)}%</h3>
            <p>Cancel Rate</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {cancelledOrders.length} orders
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION (2 columns) */}
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
              {last6MonthsRevenue.map((month, idx) => {
                const maxRevenue = Math.max(...last6MonthsRevenue.map((m) => m.revenue), 1);
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
                        height: `${(month.revenue / maxRevenue) * 180}px`,
                        minHeight: '10px',
                        background: 'var(--admin-accent, #449031)',
                        borderRadius: '8px 8px 0 0',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '0.5rem',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                      title={`${month.month}: ₹${formatCurrency(month.revenue)} (${
                        month.orders
                      } orders)`}
                    >
                      <span
                        style={{
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        ₹{Math.round(month.revenue / 1000)}k
                      </span>
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
                      {month.month.split(' ')[0]}
                      <br />
                      {month.month.split(' ')[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders by Mode (Lunch vs Dinner) */}
        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-chart-pie' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Orders by Mode
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
              {Object.entries(ordersByMode)
                .filter(([mode]) => mode !== 'Not Set' || ordersByMode[mode] > 0)
                .map(([mode, count]) => {
                  const total = Object.values(ordersByMode).reduce((sum, c) => sum + c, 0);
                  // Calculate percentage: (count / total) * 100, with accuracy based on total records / 100
                  const percentage =
                    total > 0 ? Math.min(100, parseFloat(((count / total) * 100).toFixed(2))) : 0;
                  const isLunch = mode === 'Lunch';
                  const isDinner = mode === 'Dinner';
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
                            fontSize: '1.1rem',
                          }}
                        >
                          {count} ({percentage.toFixed(2)}%)
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '24px',
                          background: 'var(--admin-glass-border)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: isLunch
                              ? 'var(--admin-success, #449031)'
                              : isDinner
                              ? 'var(--admin-accent, #449031)'
                              : 'var(--admin-border, #e2e8f0)',
                            borderRadius: '12px',
                            transition: 'width 0.5s ease',
                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* DAILY ORDERS & PAYMENT MODE SPLIT - Side by Side */}
      <div className='dashboard-grid-layout'>
        {/* Daily Orders This Month - Area Chart */}
        <div className='dashboard-grid-item two-thirds'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-chart-area' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Daily Orders This Month
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '0.5rem',
                minHeight: '200px',
                padding: '1rem',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              {dailyOrdersData.map((dayData, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                  title={`Day ${dayData.day}: ${dayData.orders} orders, ₹${formatCurrency(
                    dayData.revenue
                  )}`}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${(dayData.orders / maxDailyOrders) * 180}px`,
                      minHeight: '4px',
                      background: 'var(--admin-accent, #449031)',
                      borderRadius: '4px 4px 0 0',
                      opacity: dayData.orders > 0 ? 1 : 0.3,
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.target.style.opacity = dayData.orders > 0 ? 1 : 0.3)}
                  />
                  {dayData.day % 5 === 0 || dayData.day === 1 || dayData.day === daysInMonth ? (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--admin-text-light)',
                        fontWeight: '500',
                      }}
                    >
                      {dayData.day}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--admin-text-light)',
              }}
            >
              Daily order count for current month
            </div>
          </div>
        </div>

        {/* Payment Mode Split - Bar Chart */}
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
                  // Calculate percentage: (count / total) * 100, with accuracy based on total records / 100
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

      {/* RECENT ORDERS TABLE & QUICK ACTIONS - Side by Side */}
      <div className='dashboard-grid-layout'>
        {/* RECENT ORDERS TABLE */}
        {recentOrders.length > 0 && (
          <div className='dashboard-grid-item two-thirds'>
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
                          order.createdAt || order.date || order.order_date
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
                            <td>₹{formatCurrency(order.total || order.totalAmount || 0)}</td>
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
          </div>
        )}

        {/* QUICK ACTIONS PANEL */}
        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-section'>
            <h3 className='dashboard-section-title'>
              <i
                className='fa-solid fa-bolt'
                style={{ fontSize: '1rem', opacity: 0.7, color: 'var(--admin-accent)' }}
              ></i>
              Quick Actions
            </h3>
            <div className='quick-actions-panel'>
              <button
                className='btn btn-primary btn-small btn-full'
                onClick={() => setActiveTab('currentMonthOrders')}
                title='Add New Order'
              >
                <i className='fa-solid fa-plus'></i> Add New Order
              </button>
              <button
                className='btn btn-secondary btn-small btn-full'
                onClick={() => {
                  const csvContent =
                    'Date,Address,Quantity,Amount,Mode,Status\n' +
                    orders
                      .slice(0, 100)
                      .map((o) => {
                        const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
                        return `"${formatDate(orderDate)}","${
                          o.deliveryAddress || o.customerAddress || o.address || 'N/A'
                        }","${o.quantity || 1}","${o.total || o.totalAmount || 0}","${
                          o.mode || 'N/A'
                        }","${o.status || 'N/A'}"`;
                      })
                      .join('\n');
                  const blob = new Blob([csvContent], {
                    type: 'text/csv;charset=utf-8;',
                  });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                }}
                title='Export Data'
              >
                <i className='fa-solid fa-download'></i> Export Data
              </button>
              <button
                className='btn btn-secondary btn-small btn-full'
                onClick={() => setActiveTab('pendingAmounts')}
                title='View Pending Payments'
              >
                <i className='fa-solid fa-money-bill-wave'></i> Pending Payments
              </button>
              <button
                className='btn btn-ghost btn-small btn-full'
                onClick={() => setActiveTab('reports')}
                title='Generate Report'
              >
                <i className='fa-solid fa-chart-bar'></i> Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
