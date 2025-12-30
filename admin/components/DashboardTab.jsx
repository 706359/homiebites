import { getFilteredOrdersByDate } from '../utils/calculations.js';
import { formatCurrency, getTotalRevenue } from '../utils/orderUtils.js';

const DashboardTab = ({ orders, setActiveTab, settings, loading = false }) => {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // TODAY SECTION
  const todayOrders = orders.filter((o) => {
    try {
      const orderDate = new Date(o.createdAt || o.date || o.order_date);
      return orderDate >= today && orderDate < tomorrow;
    } catch (e) {
      return false;
    }
  });

  const todayOrdersCount = todayOrders.length;
  const todayQuantity = todayOrders.reduce((sum, o) => {
    const qty = parseInt(o.quantity || 1);
    return sum + qty;
  }, 0);

  // Today paid collection
  const todayPaidCollection = todayOrders
    .filter((o) => {
      const status = (o.status || '').toLowerCase();
      return status === 'paid';
    })
    .reduce((sum, o) => {
      const total = parseFloat(o.total || o.totalAmount || 0);
      return sum + (isNaN(total) ? 0 : total);
    }, 0);

  // Today unpaid amount
  const todayUnpaidAmount = todayOrders
    .filter((o) => {
      const status = (o.status || '').toLowerCase();
      return status === 'unpaid';
    })
    .reduce((sum, o) => {
      const total = parseFloat(o.total || o.totalAmount || 0);
      return sum + (isNaN(total) ? 0 : total);
    }, 0);

  // CURRENT MONTH SECTION
  const currentMonthOrders = getFilteredOrdersByDate(orders, 'month', '', '');
  const currentMonthTotal = currentMonthOrders.length;
  const currentMonthRevenue = getTotalRevenue(currentMonthOrders);

  // Current month paid revenue
  const currentMonthPaidRevenue = currentMonthOrders
    .filter((o) => {
      const status = (o.status || '').toLowerCase();
      return status === 'paid';
    })
    .reduce((sum, o) => {
      const total = parseFloat(o.total || o.totalAmount || 0);
      return sum + (isNaN(total) ? 0 : total);
    }, 0);

  // Current month unpaid amount
  const currentMonthUnpaidAmount = currentMonthOrders
    .filter((o) => {
      const status = (o.status || '').toLowerCase();
      return status === 'unpaid';
    })
    .reduce((sum, o) => {
      const total = parseFloat(o.total || o.totalAmount || 0);
      return sum + (isNaN(total) ? 0 : total);
    }, 0);

  // Status breakdown
  const paidOrdersCount = currentMonthOrders.filter(
    (o) => (o.status || '').toLowerCase() === 'paid'
  ).length;
  const unpaidOrdersCount = currentMonthOrders.filter(
    (o) => (o.status || '').toLowerCase() === 'unpaid'
  ).length;
  const ordersWithoutStatus = currentMonthOrders.filter(
    (o) => !o.status || (o.status || '').trim() === ''
  ).length;

  // Payment mode breakdown
  const paymentModeStats = {};
  currentMonthOrders.forEach((o) => {
    const mode = o.paymentMode || 'Not Set';
    if (!paymentModeStats[mode]) {
      paymentModeStats[mode] = { count: 0, amount: 0 };
    }
    paymentModeStats[mode].count++;
    paymentModeStats[mode].amount += parseFloat(o.total || o.totalAmount || 0);
  });

  // Top addresses by order count
  const addressOrderCount = {};
  currentMonthOrders.forEach((o) => {
    const addr = o.deliveryAddress || o.customerAddress || o.address;
    if (addr) {
      addressOrderCount[addr] = (addressOrderCount[addr] || 0) + 1;
    }
  });
  const topAddresses = Object.entries(addressOrderCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([addr, count]) => ({ address: addr, count }));

  // Recent orders (last 10)
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || a.order_date);
      const dateB = new Date(b.createdAt || b.date || b.order_date);
      return dateB - dateA;
    })
    .slice(0, 10);

  // Avg order value (current month)
  const currentMonthAvgOrderValue =
    currentMonthTotal > 0 ? Math.round(currentMonthRevenue / currentMonthTotal) : 0;

  // ALERTS SECTION
  // Pending > 7 days
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const pendingOver7Days = orders.filter((o) => {
    try {
      const orderDate = new Date(o.createdAt || o.date || o.order_date);
      const status = (o.status || '').toLowerCase();
      // Only include orders that explicitly have unpaid status
      return orderDate < sevenDaysAgo && status === 'unpaid';
    } catch (e) {
      return false;
    }
  });

  // Inactive addresses (>3 days)
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(now.getDate() - 3);
  threeDaysAgo.setHours(0, 0, 0, 0);

  const addressLastOrder = {};
  orders.forEach((o) => {
    try {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (!addr) return;
      const orderDate = new Date(o.createdAt || o.date || o.order_date);
      if (!addressLastOrder[addr] || orderDate > addressLastOrder[addr]) {
        addressLastOrder[addr] = orderDate;
      }
    } catch (e) {}
  });

  const inactiveAddresses = Object.entries(addressLastOrder)
    .filter(([addr, lastOrderDate]) => lastOrderDate < threeDaysAgo)
    .map(([addr]) => addr);

  // Price override alerts (orders where unitPrice doesn't match default from settings)
  const defaultUnitPrice = settings?.defaultUnitPrice || 0;
  const priceOverrideAlerts = orders.filter((o) => {
    try {
      if (!o.unitPrice || o.unitPrice === 0) return false;
      const storedPrice = parseFloat(o.unitPrice);
      // Check if stored price differs from default unit price
      return defaultUnitPrice > 0 && Math.abs(storedPrice - defaultUnitPrice) > 0.01;
    } catch (e) {
      return false;
    }
  });

  // Active addresses (addresses with orders in current month - aligns with billing cycle)
  const currentMonthOrdersForAddresses = getFilteredOrdersByDate(orders, 'month', '', '');
  const activeAddresses = new Set(
    currentMonthOrdersForAddresses
      .map((o) => o.deliveryAddress || o.customerAddress || o.address)
      .filter(Boolean)
  ).size;

  // Last 7 days trend data
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt || o.date || o.order_date);
      return orderDate >= date && orderDate < nextDay;
    });

    last7Days.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      orders: dayOrders.length,
      revenue: getTotalRevenue(dayOrders),
    });
  }

  const maxOrders = Math.max(...last7Days.map((d) => d.orders), 1);
  const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1);

  // Month Lock Status
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

  // Show loading state
  if (loading) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Dashboard</h2>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div
            className='loader-spinner'
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid var(--admin-border)',
              borderTop: '4px solid var(--admin-accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
          <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='admin-content'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h2>Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Month Lock Status */}
          <div
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              background:
                monthLockStatus.status === 'LOCKED'
                  ? 'var(--admin-warning-light)'
                  : 'var(--admin-success-light)',
              border: `2px solid ${monthLockStatus.status === 'LOCKED' ? 'var(--admin-warning)' : 'var(--admin-success)'}`,
              fontSize: '0.9rem',
              fontWeight: '600',
              color:
                monthLockStatus.status === 'LOCKED'
                  ? 'var(--admin-warning)'
                  : 'var(--admin-success)',
            }}
          >
            {monthLockStatus.status === 'LOCKED' ? '🔒' : '🟢'} Current Month:{' '}
            {monthLockStatus.status}
            {monthLockStatus.lockedTill && ` (till ${monthLockStatus.lockedTill})`}
          </div>
          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className='btn btn-primary btn-small'
              onClick={() => setActiveTab('currentMonthOrders')}
              title='Add New Order'
            >
              <i className='fa-solid fa-plus'></i> Add Order
            </button>
            <button
              className='btn btn-secondary btn-small'
              onClick={() => setActiveTab('pendingAmounts')}
              title='View Pending Amounts'
            >
              <i className='fa-solid fa-money-bill-wave'></i> Pending
            </button>
            <button
              className='btn btn-ghost btn-small'
              onClick={() => setActiveTab('summary')}
              title='View Monthly Summary'
            >
              <i className='fa-solid fa-table'></i> Summary
            </button>
          </div>
        </div>
      </div>

      {/* TODAY SECTION */}
      <div className='dashboard-section'>
        <h3
          style={{
            marginBottom: '1rem',
            color: 'var(--admin-accent)',
            fontSize: '1.1rem',
            fontWeight: '600',
          }}
        >
          Today
        </h3>
        <div className='admin-stats'>
          <div className='stat-card'>
            <i className='fa-solid fa-calendar-day'></i>
            <div>
              <h3>{todayOrdersCount}</h3>
              <p>Today Orders</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-box'></i>
            <div>
              <h3>{todayQuantity}</h3>
              <p>Today Quantity</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-check-circle' style={{ color: 'var(--admin-success)' }}></i>
            <div>
              <h3>₹{formatCurrency(todayPaidCollection)}</h3>
              <p>Today Paid</p>
            </div>
          </div>
          <div className='stat-card'>
            <i
              className='fa-solid fa-exclamation-triangle'
              style={{ color: 'var(--admin-warning)' }}
            ></i>
            <div>
              <h3>₹{formatCurrency(todayUnpaidAmount)}</h3>
              <p>Today Unpaid</p>
            </div>
          </div>
        </div>
      </div>

      {/* CURRENT MONTH SECTION */}
      <div className='dashboard-section'>
        <h3
          style={{
            marginBottom: '1rem',
            color: 'var(--admin-accent)',
            fontSize: '1.1rem',
            fontWeight: '600',
          }}
        >
          Current Month
        </h3>
        <div className='admin-stats'>
          <div className='stat-card'>
            <i className='fa-solid fa-shopping-cart'></i>
            <div>
              <h3>{currentMonthTotal}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-rupee-sign'></i>
            <div>
              <h3>₹{formatCurrency(currentMonthRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-check-circle' style={{ color: 'var(--admin-success)' }}></i>
            <div>
              <h3>₹{formatCurrency(currentMonthPaidRevenue)}</h3>
              <p>Paid Revenue</p>
            </div>
          </div>
          <div className='stat-card'>
            <i
              className='fa-solid fa-exclamation-triangle'
              style={{ color: 'var(--admin-warning)' }}
            ></i>
            <div>
              <h3>₹{formatCurrency(currentMonthUnpaidAmount)}</h3>
              <p>Unpaid Amount</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-chart-line'></i>
            <div>
              <h3>₹{formatCurrency(currentMonthAvgOrderValue)}</h3>
              <p>Avg Order Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* ALERTS SECTION */}
      {(pendingOver7Days.length > 0 ||
        inactiveAddresses.length > 0 ||
        priceOverrideAlerts.length > 0) && (
        <div className='dashboard-section'>
          <h3
            style={{
              marginBottom: '1rem',
              color: 'var(--admin-danger)',
              fontSize: '1.1rem',
              fontWeight: '600',
            }}
          >
            Alerts
          </h3>
          <div className='dashboard-alerts'>
            {pendingOver7Days.length > 0 && (
              <div
                className='alert-card'
                style={{
                  padding: '1.25rem',
                  background: 'var(--admin-danger-light)',
                  border: '3px solid var(--admin-danger)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <i
                    className='fa-solid fa-exclamation-circle'
                    style={{ color: 'var(--admin-danger)', fontSize: '1.5rem' }}
                  ></i>
                  <div>
                    <strong style={{ color: 'var(--admin-danger)', fontSize: '1.2rem' }}>
                      Pending &gt; 7 days
                    </strong>
                    <p
                      style={{
                        margin: '0.5rem 0 0 0',
                        color: 'var(--admin-text)',
                        fontSize: '1rem',
                      }}
                    >
                      {pendingOver7Days.length} order{pendingOver7Days.length !== 1 ? 's' : ''} with
                      pending amount over 7 days old
                    </p>
                    <p
                      style={{
                        margin: '0.5rem 0 0 0',
                        fontSize: '1.1rem',
                        color: 'var(--admin-danger)',
                        fontWeight: '700',
                      }}
                    >
                      Total: ₹
                      {formatCurrency(
                        pendingOver7Days.reduce(
                          (sum, o) => sum + parseFloat(o.total || o.totalAmount || 0),
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {inactiveAddresses.length > 0 && (
              <div
                className='alert-card'
                style={{
                  padding: '1.25rem',
                  background: 'var(--admin-warning-light)',
                  border: '3px solid var(--admin-warning)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <i
                    className='fa-solid fa-map-marker-alt'
                    style={{ color: 'var(--admin-warning)', fontSize: '1.5rem' }}
                  ></i>
                  <div>
                    <strong style={{ color: 'var(--admin-warning)', fontSize: '1.2rem' }}>
                      Inactive Addresses (&gt;3 days)
                    </strong>
                    <p
                      style={{
                        margin: '0.5rem 0 0 0',
                        color: 'var(--admin-text)',
                        fontSize: '1rem',
                      }}
                    >
                      {inactiveAddresses.length} address{inactiveAddresses.length !== 1 ? 'es' : ''}{' '}
                      with no orders in last 3 days
                    </p>
                  </div>
                </div>
              </div>
            )}

            {priceOverrideAlerts.length > 0 && (
              <div
                className='alert-card'
                style={{
                  padding: '1.25rem',
                  background: 'var(--admin-accent-light)',
                  border: '3px solid var(--admin-accent)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <i
                    className='fa-solid fa-tag'
                    style={{ color: 'var(--admin-accent)', fontSize: '1.5rem' }}
                  ></i>
                  <div>
                    <strong style={{ color: 'var(--admin-accent)', fontSize: '1.2rem' }}>
                      Price Override Alerts
                    </strong>
                    <p
                      style={{
                        margin: '0.5rem 0 0 0',
                        color: 'var(--admin-text)',
                        fontSize: '1rem',
                      }}
                    >
                      {priceOverrideAlerts.length} order
                      {priceOverrideAlerts.length !== 1 ? 's' : ''} with custom unit prices this
                      month
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STATUS BREAKDOWN */}
      <div className='dashboard-section'>
        <h3
          style={{
            marginBottom: '1rem',
            color: 'var(--admin-accent)',
            fontSize: '1.1rem',
            fontWeight: '600',
          }}
        >
          Status Breakdown (Current Month)
        </h3>
        <div className='admin-stats'>
          <div
            className='stat-card'
            style={{
              background: 'var(--admin-success-light)',
              border: '2px solid var(--admin-success)',
            }}
          >
            <i className='fa-solid fa-check-circle' style={{ color: 'var(--admin-success)' }}></i>
            <div>
              <h3 style={{ color: 'var(--admin-success)' }}>{paidOrdersCount}</h3>
              <p>Paid Orders</p>
              <p
                style={{
                  fontSize: '0.85rem',
                  marginTop: '0.25rem',
                  color: 'var(--admin-text-light)',
                }}
              >
                ₹{formatCurrency(currentMonthPaidRevenue)}
              </p>
            </div>
          </div>
          <div
            className='stat-card'
            style={{
              background: 'var(--admin-warning-light)',
              border: '2px solid var(--admin-warning)',
            }}
          >
            <i
              className='fa-solid fa-exclamation-triangle'
              style={{ color: 'var(--admin-warning)' }}
            ></i>
            <div>
              <h3 style={{ color: 'var(--admin-warning)' }}>{unpaidOrdersCount}</h3>
              <p>Unpaid Orders</p>
              <p
                style={{
                  fontSize: '0.85rem',
                  marginTop: '0.25rem',
                  color: 'var(--admin-text-light)',
                }}
              >
                ₹{formatCurrency(currentMonthUnpaidAmount)}
              </p>
            </div>
          </div>
          {ordersWithoutStatus > 0 && (
            <div
              className='stat-card'
              style={{
                background: 'var(--admin-border)',
                border: '2px solid var(--admin-text-light)',
              }}
            >
              <i
                className='fa-solid fa-question-circle'
                style={{ color: 'var(--admin-text-light)' }}
              ></i>
              <div>
                <h3 style={{ color: 'var(--admin-text-light)' }}>{ordersWithoutStatus}</h3>
                <p>No Status</p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    marginTop: '0.25rem',
                    color: 'var(--admin-text-light)',
                  }}
                >
                  Please update status
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT MODE STATISTICS */}
      {Object.keys(paymentModeStats).length > 0 && (
        <div className='dashboard-section'>
          <h3
            style={{
              marginBottom: '1rem',
              color: 'var(--admin-accent)',
              fontSize: '1.1rem',
              fontWeight: '600',
            }}
          >
            Payment Mode Breakdown
          </h3>
          <div className='dashboard-card'>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {Object.entries(paymentModeStats)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([mode, stats]) => (
                  <div
                    key={mode}
                    style={{
                      padding: '1rem',
                      background: 'var(--admin-glass-bg)',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-glass-border)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <strong style={{ color: 'var(--admin-text)' }}>{mode}</strong>
                      <span style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
                        {stats.count} orders
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: 'var(--admin-accent)',
                      }}
                    >
                      ₹{formatCurrency(stats.amount)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TOP ADDRESSES */}
      {topAddresses.length > 0 && (
        <div className='dashboard-section'>
          <h3
            style={{
              marginBottom: '1rem',
              color: 'var(--admin-accent)',
              fontSize: '1.1rem',
              fontWeight: '600',
            }}
          >
            Top 10 Addresses (Current Month)
          </h3>
          <div className='dashboard-card'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topAddresses.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: idx < 3 ? 'var(--admin-accent-light)' : 'transparent',
                    borderRadius: '6px',
                    border:
                      idx < 3 ? '1px solid var(--admin-accent)' : '1px solid var(--admin-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: idx < 3 ? 'var(--admin-accent)' : 'var(--admin-border)',
                        color: idx < 3 ? 'white' : 'var(--admin-text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{ color: 'var(--admin-text)', fontWeight: idx < 3 ? '600' : '500' }}
                    >
                      {item.address}
                    </span>
                  </div>
                  <span style={{ color: 'var(--admin-accent)', fontWeight: '700' }}>
                    {item.count} orders
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RECENT ORDERS */}
      {recentOrders.length > 0 && (
        <div className='dashboard-section'>
          <h3
            style={{
              marginBottom: '1rem',
              color: 'var(--admin-accent)',
              fontSize: '1.1rem',
              fontWeight: '600',
            }}
          >
            Recent Orders (Last 10)
          </h3>
          <div className='dashboard-card'>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentOrders.map((order, idx) => {
                const orderDate = new Date(order.createdAt || order.date || order.order_date);
                const dateStr = orderDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const status = (order.status || '').toLowerCase();
                const isPaid = status === 'paid';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: 'var(--admin-glass-overlay)',
                      borderRadius: '6px',
                      border: '1px solid var(--admin-glass-border)',
                    }}
                  >
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--admin-text)', fontWeight: '600' }}>
                          {order.deliveryAddress || order.customerAddress || order.address || 'N/A'}
                        </span>
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: isPaid
                              ? 'var(--admin-success-light)'
                              : 'var(--admin-warning-light)',
                            color: isPaid ? 'var(--admin-success)' : 'var(--admin-warning)',
                            border: `1px solid ${isPaid ? 'var(--admin-success)' : 'var(--admin-warning)'}`,
                          }}
                        >
                          {order.status || 'No Status'}
                        </span>
                      </div>
                      <span style={{ color: 'var(--admin-text-light)', fontSize: '0.85rem' }}>
                        {dateStr} • Qty: {order.quantity || 1} •{' '}
                        {order.paymentMode || 'No Payment Mode'}
                      </span>
                    </div>
                    <span
                      style={{
                        color: 'var(--admin-accent)',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                      }}
                    >
                      ₹{formatCurrency(order.total || order.totalAmount || 0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Addresses Summary */}
      <div className='stat-card' style={{ marginTop: '1rem' }}>
        <i className='fa-solid fa-map-marker-alt'></i>
        <div>
          <h3>{activeAddresses}</h3>
          <p>Active Addresses (Current Month)</p>
        </div>
      </div>

      {/* Last 7 Days Trend Chart */}
      <div
        className='dashboard-card'
        style={{ marginTop: '1.5rem', minHeight: 'auto', overflow: 'visible' }}
      >
        <h3>Last 7 Days Trend</h3>
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
          {last7Days.map((day, idx) => (
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
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '60px',
                    height: `${(day.orders / maxOrders) * 150}px`,
                    minHeight: '10px',
                    background: 'var(--admin-accent)',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '0.25rem',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  title={`${day.date}: ${day.orders} orders, ₹${formatCurrency(day.revenue)} revenue`}
                >
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600' }}>
                    {day.orders}
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '60px',
                    height: `${(day.revenue / maxRevenue) * 150}px`,
                    minHeight: '10px',
                    background: 'var(--admin-secondary)',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '0.25rem',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  title={`${day.date}: ₹${formatCurrency(day.revenue)} revenue`}
                >
                  <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: '600' }}>
                    ₹{Math.round(day.revenue / 1000)}k
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--admin-text-light)',
                  textAlign: 'center',
                  lineHeight: '1.2',
                }}
              >
                {day.date.split(' ')[0]}
                <br />
                {day.date.split(' ').slice(1).join(' ')}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '1rem',
            fontSize: '0.85rem',
            color: 'var(--admin-text-light)',
          }}
        >
          <span>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                background: 'var(--admin-accent)',
                borderRadius: '2px',
                marginRight: '0.5rem',
              }}
            ></span>
            Orders
          </span>
          <span>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                background: 'var(--admin-secondary)',
                borderRadius: '2px',
                marginRight: '0.5rem',
              }}
            ></span>
            Revenue (₹100s)
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
