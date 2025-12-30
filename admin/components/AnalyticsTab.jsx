import { formatCurrency, getTotalRevenue } from '../utils/orderUtils.js';

const AnalyticsTab = ({ orders }) => {
  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <h2>Analytics (Lean Reports Only)</h2>
      </div>

      {/* 1. Monthly Revenue Trend */}
      <div className='analytics-section' style={{ marginBottom: 'var(--admin-margin-xl)' }}>
        <h3>Monthly Revenue Trend</h3>
        <div className='analytics-chart-section'>
          {(() => {
            const monthlyRevenue = {};
            orders.forEach((o) => {
              try {
                const orderDate = new Date(o.createdAt || o.date || o.order_date);
                if (isNaN(orderDate.getTime())) return;
                const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
                const amount = parseFloat(o.total || o.totalAmount || 0);
                monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + amount;
              } catch (e) {}
            });
            const sortedMonths = Object.keys(monthlyRevenue).sort();
            const maxRevenue = Math.max(...Object.values(monthlyRevenue), 1);

            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '0.5rem',
                  minHeight: '200px',
                  padding: '1rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                }}
              >
                {sortedMonths.slice(-12).map((monthKey) => {
                  const [year, month] = monthKey.split('-');
                  const monthName = new Date(
                    parseInt(year),
                    parseInt(month) - 1
                  ).toLocaleDateString('en-US', {
                    month: 'short',
                  });
                  const revenue = monthlyRevenue[monthKey];
                  return (
                    <div
                      key={monthKey}
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
                          height: `${(revenue / maxRevenue) * 180}px`,
                          minHeight: '10px',
                          background: 'var(--admin-accent)',
                          borderRadius: '4px 4px 0 0',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          paddingBottom: '0.25rem',
                        }}
                      >
                        <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: '600' }}>
                          ₹{Math.round(revenue / 1000)}k
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>
                        {monthName}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

      {/* 2. Orders by Address */}
      <div className='analytics-section' style={{ marginBottom: 'var(--admin-margin-xl)' }}>
        <h3>Orders by Address</h3>
        <div className='orders-table-container excel-table-container'>
          <table className='orders-table excel-data-table'>
            <thead>
              <tr>
                <th>Address</th>
                <th>Total Orders</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const addressStats = {};
                orders.forEach((o) => {
                  const addr = o.deliveryAddress || o.customerAddress || o.address;
                  if (!addr) return;
                  if (!addressStats[addr]) {
                    addressStats[addr] = { orders: 0, revenue: 0 };
                  }
                  addressStats[addr].orders++;
                  addressStats[addr].revenue += parseFloat(o.total || o.totalAmount || 0);
                });
                return Object.entries(addressStats)
                  .sort((a, b) => b[1].revenue - a[1].revenue)
                  .map(([addr, stats]) => (
                    <tr key={addr}>
                      <td className='address-cell'>
                        <strong>{addr}</strong>
                      </td>
                      <td className='order-quantity-cell'>{stats.orders}</td>
                      <td className='order-amount-cell'>
                        <strong>₹{formatCurrency(stats.revenue)}</strong>
                      </td>
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Paid vs Pending */}
      <div className='analytics-section' style={{ marginBottom: 'var(--admin-margin-xl)' }}>
        <h3>Paid vs Pending</h3>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            padding: '2rem',
            background: 'var(--admin-card-bg)',
            borderRadius: '8px',
            border: '1px solid var(--admin-border)',
          }}
        >
          {(() => {
            const paid = orders
              .filter((o) => {
                const status = (o.status || '').toLowerCase();
                return status === 'paid' || status === 'delivered';
              })
              .reduce((sum, o) => sum + parseFloat(o.total || o.totalAmount || 0), 0);
            const pending = orders
              .filter((o) => {
                const status = (o.status || '').toLowerCase();
                return status !== 'paid' && status !== 'delivered';
              })
              .reduce((sum, o) => sum + parseFloat(o.total || o.totalAmount || 0), 0);
            const total = paid + pending;
            const paidPercent = total > 0 ? (paid / total) * 100 : 0;
            const pendingPercent = total > 0 ? (pending / total) * 100 : 0;

            return (
              <>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: 'var(--admin-success)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    ₹{formatCurrency(paid)}
                  </div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--admin-text-light)' }}>
                    Paid ({paidPercent.toFixed(1)}%)
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '20px',
                      background: 'var(--admin-border)',
                      borderRadius: '10px',
                      marginTop: '1rem',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${paidPercent}%`,
                        height: '100%',
                        background: 'var(--admin-success)',
                        transition: 'width 0.3s',
                      }}
                    ></div>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: 'var(--admin-danger)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    ₹{formatCurrency(pending)}
                  </div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--admin-text-light)' }}>
                    Pending ({pendingPercent.toFixed(1)}%)
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '20px',
                      background: 'var(--admin-border)',
                      borderRadius: '10px',
                      marginTop: '1rem',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pendingPercent}%`,
                        height: '100%',
                        background: 'var(--admin-danger)',
                        transition: 'width 0.3s',
                      }}
                    ></div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* 4. Average Order Value */}
      <div className='analytics-section' style={{ marginBottom: 'var(--admin-margin-xl)' }}>
        <h3>Average Order Value (AOV)</h3>
        <div
          style={{
            padding: '2rem',
            background: 'var(--admin-card-bg)',
            borderRadius: '8px',
            border: '1px solid var(--admin-border)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: 'var(--admin-accent)',
              marginBottom: '0.5rem',
            }}
          >
            ₹{formatCurrency(orders.length > 0 ? getTotalRevenue(orders) / orders.length : 0)}
          </div>
          <div style={{ fontSize: '1.1rem', color: 'var(--admin-text-light)' }}>
            Based on {orders.length} total orders
          </div>
        </div>
      </div>

      {/* 5. Top 5 Addresses by Revenue */}
      <div className='analytics-section' style={{ marginBottom: 'var(--admin-margin-xl)' }}>
        <h3>Top 5 Addresses by Revenue</h3>
        <div className='orders-table-container excel-table-container'>
          <table className='orders-table excel-data-table'>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Address</th>
                <th>Total Revenue</th>
                <th>Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const addressStats = {};
                orders.forEach((o) => {
                  const addr = o.deliveryAddress || o.customerAddress || o.address;
                  if (!addr) return;
                  if (!addressStats[addr]) {
                    addressStats[addr] = { orders: 0, revenue: 0 };
                  }
                  addressStats[addr].orders++;
                  addressStats[addr].revenue += parseFloat(o.total || o.totalAmount || 0);
                });
                return Object.entries(addressStats)
                  .sort((a, b) => b[1].revenue - a[1].revenue)
                  .slice(0, 5)
                  .map(([addr, stats], index) => (
                    <tr key={addr}>
                      <td className='order-sno-cell excel-row-number'>#{index + 1}</td>
                      <td className='address-cell'>
                        <strong>{addr}</strong>
                      </td>
                      <td className='order-amount-cell'>
                        <strong>₹{formatCurrency(stats.revenue)}</strong>
                      </td>
                      <td className='order-quantity-cell'>{stats.orders}</td>
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
