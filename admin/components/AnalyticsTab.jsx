// Tab 4: Analytics - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useMemo, useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { getFilteredOrdersByDate } from '../utils/calculations.js';
import { parseOrderDate } from '../utils/dateUtils.js';
import { formatCurrency, getTotalRevenue } from '../utils/orderUtils.js';

const AnalyticsTab = ({ orders = [], loading = false }) => {
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
      case 'custom':
        if (!customFrom || !customTo) return orders;
        const from = new Date(customFrom);
        const to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        return orders.filter((o) => {
          try {
            const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
            return orderDate >= from && orderDate <= to;
          } catch (e) {
            return false;
          }
        });
      default:
        return orders;
    }
  }, [orders, period, customFrom, customTo]);

  // Key Metrics
  const keyMetrics = useMemo(() => {
    const totalRevenue = getTotalRevenue(periodOrders);

    // Calculate growth rate (simplified - compare with previous period)
    let previousPeriodOrders = [];
    if (period === 'thisMonth') {
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      previousPeriodOrders = orders.filter((o) => {
        try {
          const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
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
          const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
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

    // Calculate retention rate (simplified - customers who ordered more than once)
    const customerOrders = {};
    periodOrders.forEach((o) => {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (addr) {
        if (!customerOrders[addr]) customerOrders[addr] = 0;
        customerOrders[addr]++;
      }
    });
    const returningCustomers = Object.values(customerOrders).filter((count) => count > 1).length;
    const totalCustomers = Object.keys(customerOrders).length;
    const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;
    const churnRate = 100 - retentionRate;

    return {
      totalRevenue,
      growthRate,
      retentionRate,
      churnRate,
    };
  }, [periodOrders, orders, period, now]);

  // Monthly Revenue Trend (Last 12 Months)
  const monthlyRevenueTrend = useMemo(() => {
    const trend = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const monthOrders = orders.filter((o) => {
        try {
          const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
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
  }, [orders, now]);

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
        areaStats[addr].revenue += parseFloat(o.total || o.totalAmount || 0);
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
    const customerOrders = {};
    periodOrders.forEach((o) => {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (addr) {
        if (!customerOrders[addr]) customerOrders[addr] = 0;
        customerOrders[addr]++;
      }
    });
    const oneTime = Object.values(customerOrders).filter((count) => count === 1).length;
    const regular = Object.values(customerOrders).filter((count) => count > 1 && count <= 5).length;
    const vip = Object.values(customerOrders).filter((count) => count > 20).length;
    return { oneTime, regular, vip };
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
      trends[mode].amount += parseFloat(o.total || o.totalAmount || 0);
    });
    return Object.entries(trends)
      .map(([mode, stats]) => ({ mode, ...stats }))
      .sort((a, b) => b.amount - a.amount);
  }, [periodOrders]);

  const totalPaymentAmount = paymentTrends.reduce((sum, t) => sum + t.amount, 0);

  // Export reports
  const handleExportReport = (type) => {
    let csvContent = '';
    if (type === 'monthly') {
      csvContent =
        'Month,Revenue,Orders\n' +
        monthlyRevenueTrend.map((m) => `${m.month},${m.revenue},${m.orders}`).join('\n');
    } else if (type === 'quarterly') {
      // Quarterly aggregation
      const quarters = [];
      for (let i = 3; i >= 0; i--) {
        const quarterStart = new Date(now.getFullYear(), i * 3, 1);
        const quarterEnd = new Date(now.getFullYear(), (i + 1) * 3, 0);
        const quarterOrders = orders.filter((o) => {
          try {
            const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
            return orderDate >= quarterStart && orderDate <= quarterEnd;
          } catch (e) {
            return false;
          }
        });
        quarters.push({
          quarter: `Q${i + 1} ${now.getFullYear()}`,
          revenue: getTotalRevenue(quarterOrders),
          orders: quarterOrders.length,
        });
      }
      csvContent =
        'Quarter,Revenue,Orders\n' +
        quarters.map((q) => `${q.quarter},${q.revenue},${q.orders}`).join('\n');
    } else if (type === 'annual') {
      const years = {};
      orders.forEach((o) => {
        try {
          const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
          if (!orderDate) return;
          const year = orderDate.getFullYear();
          if (!years[year]) years[year] = { year, revenue: 0, orders: 0 };
          years[year].revenue += parseFloat(o.total || o.totalAmount || 0);
          years[year].orders++;
        } catch (e) {
          // Ignore
        }
      });
      csvContent =
        'Year,Revenue,Orders\n' +
        Object.values(years)
          .map((y) => `${y.year},${y.revenue},${y.orders}`)
          .join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Analytics</h2>
        </div>
        <PremiumLoader message="Loading analytics..." size="large" />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* HEADER */}
      <div className='dashboard-header'>
        <div>
          <h2>Analytics</h2>
          <p>Business insights and performance metrics</p>
        </div>
      </div>

      {/* TIME PERIOD SELECTOR */}
      <div className='action-bar' style={{ marginBottom: '24px' }}>
        <select className='input-field' value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value='thisMonth'>This Month</option>
          <option value='thisYear'>This Year</option>
          <option value='custom'>Custom Range</option>
        </select>
        {period === 'custom' && (
          <>
            <input
              type='date'
              className='input-field'
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              placeholder='From'
            />
            <input
              type='date'
              className='input-field'
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              placeholder='To'
            />
          </>
        )}
      </div>

      {/* KEY METRICS GRID */}
      <div className='admin-stats'>
        <div className='stat-card'>
          <i className='fa-solid fa-rupee-sign'></i>
          <div>
            <h3>₹{formatCurrency(keyMetrics.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-chart-line' style={{ color: 'var(--admin-success)' }}></i>
          <div>
            <h3>
              {keyMetrics.growthRate === Infinity
                ? 'New'
                : `${keyMetrics.growthRate >= 0 ? '+' : ''}${keyMetrics.growthRate.toFixed(1)}%`}
            </h3>
            <p>Growth Rate</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {keyMetrics.growthRate >= 0 ? '↑' : '↓'}
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-users' style={{ color: 'var(--admin-accent)' }}></i>
          <div>
            <h3>{keyMetrics.retentionRate.toFixed(1)}%</h3>
            <p>Retention Rate</p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-user-slash' style={{ color: 'var(--admin-danger)' }}></i>
          <div>
            <h3>{keyMetrics.churnRate.toFixed(1)}%</h3>
            <p>Churn Rate</p>
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
                        ₹{Math.round(month.revenue / 1000)}k
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
                      {month.month.split(' ')[0]}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topAreas.map((area, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                        {idx + 1}. {area.address}
                      </span>
                      <span
                        style={{
                          fontWeight: '700',
                          color: 'var(--admin-accent)',
                          fontSize: '1rem',
                        }}
                      >
                        ₹{formatCurrency(area.revenue)} ({area.orders} orders)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '24px',
                        background: 'var(--admin-glass-border)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(area.revenue / maxAreaRevenue) * 100}%`,
                          height: '100%',
                          background: 'var(--admin-accent, #449031)',
                          borderRadius: '12px',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders by Day */}
        <div className='dashboard-grid-item half-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i
                className='fa-solid fa-calendar-week'
                style={{ fontSize: '1rem', opacity: 0.7 }}
              ></i>
              Orders by Day
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
                  gap: '0.75rem',
                  minHeight: '150px',
                }}
              >
                {ordersByDay.map((day, idx) => (
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
                        height: `${(day.count / maxDayOrders) * 140}px`,
                        minHeight: '10px',
                        background: 'var(--admin-accent)',
                        borderRadius: '4px 4px 0 0',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '0.25rem',
                        cursor: 'pointer',
                      }}
                      title={`${day.day}: ${day.count} orders`}
                    >
                      <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: '600' }}>
                        {day.count}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--admin-text-light)',
                        fontWeight: '500',
                      }}
                    >
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Frequency Distribution */}
        <div className='dashboard-grid-item half-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-user-group' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Order Frequency Distribution
            </h3>
            <div
              style={{
                padding: '16px',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>🆕 One-time</span>
                  <span
                    style={{ fontWeight: '700', color: 'var(--admin-accent)', fontSize: '1.1rem' }}
                  >
                    {frequencyDistribution.oneTime} customers
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                    📈 Regular (&gt;5)
                  </span>
                  <span
                    style={{ fontWeight: '700', color: 'var(--admin-accent)', fontSize: '1.1rem' }}
                  >
                    {frequencyDistribution.regular} customers
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                    🌟 VIP (&gt;20)
                  </span>
                  <span
                    style={{ fontWeight: '700', color: 'var(--admin-accent)', fontSize: '1.1rem' }}
                  >
                    {frequencyDistribution.vip} customers
                  </span>
                </div>
              </div>
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
      </div>

      {/* DOWNLOADABLE REPORTS */}
      <div className='dashboard-card'>
        <h3 className='dashboard-section-title'>
          <i className='fa-solid fa-download' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
          Downloadable Reports
        </h3>
        <div className='action-buttons-group' style={{ marginTop: '16px' }}>
          <button className='btn btn-secondary' onClick={() => handleExportReport('monthly')}>
            <i className='fa-solid fa-file-alt'></i> Monthly Summary
          </button>
          <button className='btn btn-secondary' onClick={() => handleExportReport('quarterly')}>
            <i className='fa-solid fa-chart-bar'></i> Quarterly Report
          </button>
          <button className='btn btn-secondary' onClick={() => handleExportReport('annual')}>
            <i className='fa-solid fa-chart-line'></i> Annual Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
