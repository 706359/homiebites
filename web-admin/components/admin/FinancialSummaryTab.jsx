import { useMemo, useState } from 'react';
import { InlineLoader } from '../loaders/LoaderComponents';
import Icon from '../ui/Icon.jsx';
import {
  getFilteredOrdersByDate,
  getProfitStats,
} from './utils/calculations.js';
import {
  formatDate,
  formatDateMonthDay,
  parseOrderDate,
} from './utils/dateUtils.js';
import {
  formatCurrency,
  getOrderAmount,
  getTotalRevenue,
  isPaidStatus,
  isPendingStatus,
} from './utils/orderUtils.js';

const FinancialSummaryTab = ({
  orders = [],
  loading = false,
  settings = {},
  showNotification = () => {},
}) => {
  const [period, setPeriod] = useState('month'); // today, week, month, year, custom, all
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [expensePercentage, setExpensePercentage] = useState(70);
  const [targetProfitMargin, setTargetProfitMargin] = useState(30);

  const filteredOrders = useMemo(() => {
    if (period === 'custom') {
      return getFilteredOrdersByDate(orders, 'custom', customFrom, customTo);
    }
    return getFilteredOrdersByDate(orders, period, '', '');
  }, [orders, period, customFrom, customTo]);

  const financialData = useMemo(() => {
    const now = new Date();
    const paidOrders = filteredOrders.filter((o) =>
      isPaidStatus(o.status, o.paymentStatus)
    );
    const pendingOrders = filteredOrders.filter((o) =>
      isPendingStatus(o.status, o.paymentStatus)
    );

    const totalRevenue = getTotalRevenue(filteredOrders);
    const paidRevenue = getTotalRevenue(paidOrders);
    const pendingRevenue = getTotalRevenue(pendingOrders);

    // Payment method breakdown
    const paymentMethods = {};
    filteredOrders.forEach((order) => {
      const method = order.paymentMode || 'Not Set';
      if (!paymentMethods[method]) {
        paymentMethods[method] = {
          method,
          count: 0,
          revenue: 0,
          paidCount: 0,
          paidRevenue: 0,
          pendingCount: 0,
          pendingRevenue: 0,
        };
      }
      const amount = getOrderAmount(order);
      paymentMethods[method].count++;
      paymentMethods[method].revenue += amount;
      if (isPaidStatus(order.status, order.paymentStatus)) {
        paymentMethods[method].paidCount++;
        paymentMethods[method].paidRevenue += amount;
      } else {
        paymentMethods[method].pendingCount++;
        paymentMethods[method].pendingRevenue += amount;
      }
    });

    // Profit calculations
    const profitStats = getProfitStats(
      totalRevenue,
      expensePercentage,
      targetProfitMargin
    );

    // Daily breakdown for the period
    const dailyBreakdown = {};
    filteredOrders.forEach((order) => {
      const orderDate = parseOrderDate(order.date || order.order_date || null);
      if (!orderDate) return;
      const dateKey = orderDate.toISOString().split('T')[0];
      if (!dailyBreakdown[dateKey]) {
        dailyBreakdown[dateKey] = {
          date: dateKey,
          orders: 0,
          revenue: 0,
          paidRevenue: 0,
          pendingRevenue: 0,
        };
      }
      const amount = getOrderAmount(order);
      dailyBreakdown[dateKey].orders++;
      dailyBreakdown[dateKey].revenue += amount;
      if (isPaidStatus(order.status, order.paymentStatus)) {
        dailyBreakdown[dateKey].paidRevenue += amount;
      } else {
        dailyBreakdown[dateKey].pendingRevenue += amount;
      }
    });

    const dailyData = Object.values(dailyBreakdown).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      totalOrders: filteredOrders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      avgOrderValue:
        filteredOrders.length > 0
          ? Math.round(totalRevenue / filteredOrders.length)
          : 0,
      paymentMethods: Object.values(paymentMethods),
      profitStats,
      dailyData: dailyData.slice(0, 30), // Last 30 days
    };
  }, [filteredOrders, expensePercentage, targetProfitMargin]);

  const handleExport = () => {
    const csvContent =
      'Date,Orders,Total Revenue (₹),Paid Revenue (₹),Pending Revenue (₹),Avg Order Value (₹)\n' +
      financialData.dailyData
        .map((day) => {
          const avgValue =
            day.orders > 0 ? (day.revenue / day.orders).toFixed(2) : '0.00';
          return `"${formatDate(new Date(day.date))}","${day.orders}","${day.revenue.toFixed(2)}","${day.paidRevenue.toFixed(2)}","${day.pendingRevenue.toFixed(2)}","${avgValue}"`;
        })
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financial_summary_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    if (showNotification) {
      showNotification('Financial summary exported successfully', 'success');
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <InlineLoader message="Loading financial data..." />
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="kitchen-tab">
        <div className="kitchen-tab-actions">
          <div className="kitchen-tab-actions-left">
            <div className="filter-field-group-standard">
              <label className="filter-label-standard">Period</label>
              <select
                className="input-field"
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  if (e.target.value !== 'custom') {
                    setCustomFrom('');
                    setCustomTo('');
                  }
                }}
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {period === 'custom' && (
              <>
                <div className="filter-field-group-standard">
                  <label className="filter-label-standard">From</label>
                  <input
                    type="date"
                    className="input-field"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                  />
                </div>
                <div className="filter-field-group-standard">
                  <label className="filter-label-standard">To</label>
                  <input
                    type="date"
                    className="input-field"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="kitchen-tab-stats financial-stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-card-icon">
              <Icon name="indian-rupee-sign" />
            </div>
            <div className="stat-card-content">
              <h3>₹ {formatCurrency(financialData.totalRevenue)}</h3>
              <p>Total Revenue</p>
              <p className="stat-card-subtitle">
                {financialData.totalOrders} orders
              </p>
            </div>
          </div>
          <div className="stat-card stat-card-success">
            <div className="stat-card-icon">
              <Icon name="check-circle" />
            </div>
            <div className="stat-card-content">
              <h3>₹ {formatCurrency(financialData.paidRevenue)}</h3>
              <p>Paid Revenue</p>
              <p className="stat-card-subtitle">
                {financialData.paidOrders} orders
              </p>
            </div>
          </div>
          <div className="stat-card stat-card-warning">
            <div className="stat-card-icon">
              <Icon name="clock" />
            </div>
            <div className="stat-card-content">
              <h3>₹ {formatCurrency(financialData.pendingRevenue)}</h3>
              <p>Pending Revenue</p>
              <p className="stat-card-subtitle">
                {financialData.pendingOrders} orders
              </p>
            </div>
          </div>
          <div className="stat-card stat-card-info">
            <div className="stat-card-icon">
              <Icon name="calculator" />
            </div>
            <div className="stat-card-content">
              <h3>₹ {formatCurrency(financialData.avgOrderValue)}</h3>
              <p>Avg Order Value</p>
            </div>
          </div>
        </div>

        {/* Profit & Expenses */}
        <div className="kitchen-tab-card">
          <div className="kitchen-tab-body-inner">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">
                <Icon name="chart-line" />
                Profit & Expenses Analysis
              </h2>
            </div>
            <div className="profit-breakdown-grid">
              <div className="profit-card">
                <div className="profit-card-header">
                  <Icon name="money-bill-wave" />
                  <span>Revenue</span>
                </div>
                <div className="profit-card-value">
                  ₹ {formatCurrency(financialData.profitStats.revenue)}
                </div>
              </div>
              <div className="profit-card">
                <div className="profit-card-header">
                  <Icon name="arrow-down" />
                  <span>Expenses ({expensePercentage}%)</span>
                </div>
                <div className="profit-card-value profit-card-expense">
                  ₹ {formatCurrency(financialData.profitStats.expenses)}
                </div>
              </div>
              <div className="profit-card profit-card-highlight">
                <div className="profit-card-header">
                  <Icon name="arrow-up" />
                  <span>Profit</span>
                </div>
                <div className="profit-card-value profit-card-profit">
                  ₹ {formatCurrency(financialData.profitStats.profit)}
                </div>
                <div className="profit-card-margin">
                  {financialData.profitStats.profitMarginPercent.toFixed(1)}%
                  margin
                </div>
              </div>
              <div className="profit-card">
                <div className="profit-card-header">
                  <Icon name="bullseye" />
                  <span>Target Profit ({targetProfitMargin}%)</span>
                </div>
                <div className="profit-card-value">
                  ₹ {formatCurrency(financialData.profitStats.targetProfit)}
                </div>
                <div className="profit-card-diff">
                  {financialData.profitStats.profit >=
                  financialData.profitStats.targetProfit
                    ? '✓ Target Achieved'
                    : `₹${formatCurrency(
                        financialData.profitStats.targetProfit -
                          financialData.profitStats.profit
                      )} to reach target`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="dashboard-card">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">
              <Icon name="credit-card" />
              Payment Method Breakdown
            </h2>
          </div>
          <div className="payment-methods-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Total Orders</th>
                  <th>Total Revenue</th>
                  <th>Paid Orders</th>
                  <th>Paid Revenue</th>
                  <th>Pending Orders</th>
                  <th>Pending Revenue</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {financialData.paymentMethods
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((method, idx) => {
                    const percentage =
                      financialData.totalRevenue > 0
                        ? (
                            (method.revenue / financialData.totalRevenue) *
                            100
                          ).toFixed(1)
                        : '0.0';
                    return (
                      <tr key={idx}>
                        <td>
                          <strong>{method.method}</strong>
                        </td>
                        <td>{method.count}</td>
                        <td>₹ {formatCurrency(method.revenue)}</td>
                        <td>{method.paidCount}</td>
                        <td>₹ {formatCurrency(method.paidRevenue)}</td>
                        <td>{method.pendingCount}</td>
                        <td>₹ {formatCurrency(method.pendingRevenue)}</td>
                        <td>
                          <div className="percentage-bar-container">
                            <div
                              className="percentage-bar"
                              style={{ width: `${percentage}%` }}
                            ></div>
                            <span>{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="dashboard-card">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">
              <Icon name="calendar-day" />
              Daily Breakdown (Last 30 Days)
            </h2>
          </div>
          <div className="daily-breakdown-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders</th>
                  <th>Total Revenue</th>
                  <th>Paid Revenue</th>
                  <th>Pending Revenue</th>
                  <th>Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {financialData.dailyData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state-cell">
                      No data available for the selected period
                    </td>
                  </tr>
                ) : (
                  financialData.dailyData.map((day, idx) => {
                    const avgValue =
                      day.orders > 0 ? Math.round(day.revenue / day.orders) : 0;
                    return (
                      <tr key={idx}>
                        <td>{formatDateMonthDay(new Date(day.date))}</td>
                        <td>{day.orders}</td>
                        <td>₹ {formatCurrency(day.revenue)}</td>
                        <td>₹ {formatCurrency(day.paidRevenue)}</td>
                        <td>₹ {formatCurrency(day.pendingRevenue)}</td>
                        <td>₹ {formatCurrency(avgValue)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryTab;
