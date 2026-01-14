import { useEffect, useMemo, useState } from 'react';
import { getFilteredOrdersByDate } from './utils/calculations.js';
import { formatDateMonthDay, parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  getTotalRevenue,
  isPaidStatus,
  isPendingStatus,
  extractOrderIdSequence,
} from './utils/orderUtils.js';
import PremiumLoader from './PremiumLoader.jsx';

const PendingAmountsTab = ({
  orders = [],
  loading = false,
  onUpdateOrderStatus,
  showNotification,
  settings,
  showConfirmation,
  showOverdueFilter = false,
  onOverdueFilterApplied,
}) => {

  
  const [filterUrgency, setFilterUrgency] = useState('all'); 
  const [filterDaysPending, setFilterDaysPending] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();

  
  const summaryStats = useMemo(() => {
    const paidOrders = orders.filter((o) => isPaidStatus(o.status));
    const pendingOrders = orders.filter((o) => isPendingStatus(o.status));

    
    const fortyFiveDaysAgo = new Date(now);
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    fortyFiveDaysAgo.setHours(0, 0, 0, 0); 
    const overdueOrders = pendingOrders.filter((o) => {
      try {
        
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return false;
        
        const orderDateMidnight = new Date(orderDate);
        orderDateMidnight.setHours(0, 0, 0, 0);
        return orderDateMidnight < fortyFiveDaysAgo;
      } catch (e) {
        return false;
      }
    });

    
    const currentMonthOrders = getFilteredOrdersByDate(orders, 'month', '', '');
    const currentMonthRevenue = getTotalRevenue(currentMonthOrders);

    return {
      totalPaid: getTotalRevenue(paidOrders),
      totalPaidCount: paidOrders.length,
      pending: getTotalRevenue(pendingOrders),
      pendingCount: pendingOrders.length,
      overdue: getTotalRevenue(overdueOrders),
      overdueCount: overdueOrders.length,
      thisMonth: currentMonthRevenue,
      thisMonthCount: currentMonthOrders.length,
    };
  }, [orders, now]);

  
  const pendingPayments = useMemo(() => {
    const pending = orders.filter((o) => isPendingStatus(o.status));
    
    const fortyFiveDaysAgo = new Date(now);
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    fortyFiveDaysAgo.setHours(0, 0, 0, 0);

    let payments = pending
      .map((order) => {
        try {
          const orderDate = parseOrderDate(order.date || order.order_date || null);
          if (!orderDate) {
            return {
              ...order,
              orderDate: null,
              daysPending: 0,
              isUrgent: false,
              isOverdue: false,
            };
          }
          const daysPending = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
          
          const orderDateMidnight = new Date(orderDate);
          orderDateMidnight.setHours(0, 0, 0, 0);
          const isOverdue = orderDateMidnight < fortyFiveDaysAgo;
          return {
            ...order,
            orderDate,
            daysPending,
            isUrgent: daysPending > 7,
            isOverdue, 
          };
        } catch (e) {
          return {
            ...order,
            orderDate: null,
            daysPending: 0,
            isUrgent: false,
            isOverdue: false,
          };
        }
      })
      .sort((a, b) => {
        if (b.daysPending !== a.daysPending) {
          return b.daysPending - a.daysPending;
        }
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
      });

    
    if (filterUrgency === 'urgent') {
      
      payments = payments.filter((p) => p.isOverdue);
    } else if (filterUrgency === 'normal') {
      payments = payments.filter((p) => !p.isOverdue);
    }

    if (filterDaysPending === '0-3') {
      payments = payments.filter((p) => p.daysPending >= 0 && p.daysPending <= 3);
    } else if (filterDaysPending === '4-7') {
      payments = payments.filter((p) => p.daysPending >= 4 && p.daysPending <= 7);
    } else if (filterDaysPending === '7+') {
      
      payments = payments.filter((p) => p.daysPending > 7);
    } else if (filterDaysPending === '45+') {
      
      payments = payments.filter((p) => p.isOverdue);
    }

    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      payments = payments.filter((p) => {
        const address = (p.deliveryAddress || p.customerAddress || p.address || '').toLowerCase();
        const orderId = (p.orderId || p._id || '').toString().toLowerCase();
        return address.includes(query) || orderId.includes(query);
      });
    }

    return payments;
  }, [orders, now, filterUrgency, filterDaysPending, searchQuery]);

  
  useEffect(() => {
    if (showOverdueFilter) {
      setFilterDaysPending('45+');
      setFilterUrgency('urgent');
      
      if (onOverdueFilterApplied) {
        onOverdueFilterApplied();
      }
    }
  }, [showOverdueFilter, onOverdueFilterApplied]);

  
  const paymentTimeline = useMemo(() => {
    const timeline = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayOrders = orders.filter((o) => {
        try {
          
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          return orderDate >= date && orderDate < nextDay;
        } catch (e) {
          return false;
        }
      });

      const paidOrders = dayOrders.filter((o) => isPaidStatus(o.status));
      const collectionRevenue = getTotalRevenue(paidOrders);

      timeline.push({
        date: formatDateMonthDay(date),
        fullDate: date,
        collection: collectionRevenue,
        orders: paidOrders.length,
      });
    }
    return timeline;
  }, [orders, now]);

  
  const avgCollectionTime = useMemo(() => {
    const paidOrders = orders.filter((o) => isPaidStatus(o.status));
    if (paidOrders.length === 0) return 0;

    let totalDays = 0;
    paidOrders.forEach((order) => {
      try {
        const orderDate = parseOrderDate(order.date || order.order_date || null);
        if (!orderDate) return;
        const paidDate = order.paidDate ? parseOrderDate(order.paidDate) : orderDate; 
        if (!paidDate) return;
        const days = Math.floor((paidDate - orderDate) / (1000 * 60 * 60 * 24));
        totalDays += Math.max(0, days);
      } catch (e) {
        
      }
    });

    return paidOrders.length > 0 ? (totalDays / paidOrders.length).toFixed(1) : 0;
  }, [orders]);

  const maxTimelineCollection = Math.max(...paymentTimeline.map((t) => t.collection), 1);

  
  const paymentModePerformance = useMemo(() => {
    const modeStats = {};
    orders.forEach((o) => {
      const mode = o.paymentMode || 'Not Set';
      if (!modeStats[mode]) {
        modeStats[mode] = { count: 0, amount: 0 };
      }
      modeStats[mode].count++;
      
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
      
      modeStats[mode].amount += isNaN(amount) ? 0 : amount;
    });
    return Object.entries(modeStats)
      .map(([mode, stats]) => ({ mode, ...stats }))
      .sort((a, b) => b.amount - a.amount);
  }, [orders]);

  const totalPaymentAmount = paymentModePerformance.reduce((sum, p) => sum + p.amount, 0);

  
  const handleMarkAsPaid = async (orderId) => {
    const order = orders.find((o) => (o._id || o.orderId) === orderId);
    const orderInfo = order
      ? `Order ${order.orderId || orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}`
      : `Order ${orderId}`;

    if (showConfirmation && onUpdateOrderStatus) {
      showConfirmation({
        title: 'Mark as Paid',
        message: `Are you sure you want to mark ${orderInfo} as paid?`,
        type: 'info',
        confirmText: 'Mark as Paid',
        onConfirm: async () => {
          await onUpdateOrderStatus(orderId, 'Paid');
          if (showNotification) showNotification('Order marked as paid', 'success');
        },
      });
    } else if (onUpdateOrderStatus) {
      await onUpdateOrderStatus(orderId, 'Paid');
      if (showNotification) showNotification('Order marked as paid', 'success');
    }
  };

  const handleBulkMarkAsPaid = async () => {
    const selectedOrders = pendingPayments.filter((p) => p.isUrgent);
    const count = selectedOrders.length;

    if (count === 0) {
      if (showNotification) showNotification('No urgent orders selected', 'info');
      return;
    }

    if (showConfirmation) {
      showConfirmation({
        title: 'Mark All Urgent as Paid',
        message: `Are you sure you want to mark ${count} urgent order${count > 1 ? 's' : ''} as paid?`,
        type: 'info',
        confirmText: 'Mark All as Paid',
        onConfirm: async () => {
          try {
            for (const order of selectedOrders) {
              if (onUpdateOrderStatus) {
                await onUpdateOrderStatus(order._id || order.orderId, 'Paid');
              }
            }
            if (showNotification) showNotification('All urgent orders marked as paid', 'success');
          } catch (error) {
            console.error('Error marking orders as paid:', error);
            if (showNotification) showNotification('Error updating orders', 'error');
          }
        },
      });
    } else {
      try {
        for (const order of selectedOrders) {
          if (onUpdateOrderStatus) {
            await onUpdateOrderStatus(order._id || order.orderId, 'Paid');
          }
        }
        if (showNotification) showNotification('All urgent orders marked as paid', 'success');
      } catch (error) {
        console.error('Error marking orders as paid:', error);
        if (showNotification) showNotification('Error updating orders', 'error');
      }
    }
  };


  if (loading) {
    return (
      <div className='admin-content'>
        <PremiumLoader message='Loading payment data...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>

      {}
      <div className='admin-stats'>
        <div className='stat-card'>
          <i className='fa-solid fa-check-circle' style={{ color: 'var(--admin-success)' }}></i>
          <div>
            <h3>₹{formatCurrency(summaryStats.totalPaid)}</h3>
            <p>Total Paid</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {summaryStats.totalPaidCount} orders
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i
            className='fa-solid fa-exclamation-triangle'
            style={{ color: 'var(--admin-warning)' }}
          ></i>
          <div>
            <h3>₹{formatCurrency(summaryStats.pending)}</h3>
            <p>Pending</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {summaryStats.pendingCount} orders
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-times-circle' style={{ color: 'var(--admin-danger)' }}></i>
          <div>
            <h3>₹{formatCurrency(summaryStats.overdue)}</h3>
            <p>Overdue</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {summaryStats.overdueCount} orders
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-calendar-alt' style={{ color: 'var(--admin-accent)' }}></i>
          <div>
            <h3>₹{formatCurrency(summaryStats.thisMonth)}</h3>
            <p>This Month</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {summaryStats.thisMonthCount} orders
            </p>
          </div>
        </div>
      </div>

      {}
      <div className='dashboard-card margin-bottom-24'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div
            className='filter-container'
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              flexWrap: 'wrap',
              flex: '1 1 auto',
              justifyContent: 'flex-end',
            }}
          >
            {}
            <div className='search-input-wrapper search-input-wrapper-flex'>
              <i className='fa-solid fa-search search-input-icon'></i>
              <input
                type='text'
                className='input-field search-input-with-icon'
                placeholder='Search by address or order ID...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='filter-field-group-standard min-width-140'>
              <label className='filter-label-standard'>Urgency</label>
              <select
                className='input-field filter-input-standard'
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
              >
                <option value='all'>All</option>
                <option value='urgent'>Urgent (&gt;7 days)</option>
                <option value='normal'>Normal (≤7 days)</option>
              </select>
            </div>
            <div className='filter-field-group-standard min-width-140'>
              <label className='filter-label-standard'>Days Pending</label>
              <select
                className='input-field filter-input-standard'
                value={filterDaysPending}
                onChange={(e) => setFilterDaysPending(e.target.value)}
              >
                <option value='all'>All</option>
                <option value='0-3'>0-3 days</option>
                <option value='4-7'>4-7 days</option>
                <option value='7+'>7+ days</option>
                <option value='45+'>45+ days (Overdue)</option>
              </select>
            </div>
            {(searchQuery || filterUrgency !== 'all' || filterDaysPending !== 'all') && (
              <button
                className='btn btn-ghost btn-small'
                onClick={() => {
                  setSearchQuery('');
                  setFilterUrgency('all');
                  setFilterDaysPending('all');
                }}
                style={{ 
                  fontSize: '13px', 
                  padding: '10px 16px',
                  whiteSpace: 'nowrap',
                  height: 'fit-content'
                }}
                title='Clear all filters'
              >
                <i className='fa-solid fa-xmark' style={{ marginRight: '6px' }}></i>
                Clear
              </button>
            )}
            {}
            <div className='action-buttons-group'>
              <button className='btn btn-success btn-small' onClick={handleBulkMarkAsPaid}>
                <i className='fa-solid fa-check-circle' style={{ marginRight: '6px' }}></i>
                Mark All as Paid
              </button>
            </div>
          </div>
        </div>

        {pendingPayments.length === 0 ? (
          <div className='empty-state' style={{ padding: '48px', textAlign: 'center' }}>
            <i
              className='fa-solid fa-check-circle'
              style={{ fontSize: '64px', color: 'var(--admin-success)', marginBottom: '16px' }}
            ></i>
            <p>No pending payments</p>
            <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
              All orders are paid!
            </p>
          </div>
        ) : (
          <div className='orders-table-container'>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Days Pending</th>
                  <th>Order ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((order, idx) => {
                  const orderDate = parseOrderDate(
                    
                    order.orderDate || order.date || order.order_date || null
                  );
                  const dateStr = formatDateMonthDay(orderDate);

                  const urgencyLevel =
                    order.daysPending > 45
                      ? 'overdue'
                      : order.daysPending > 7
                        ? 'urgent'
                        : order.daysPending > 3
                          ? 'warning'
                          : 'normal';

                  return (
                    <tr
                      key={order._id || order.orderId || idx}
                      className={`pending-payment-row pending-payment-row-${urgencyLevel}`}
                    >
                      <td>
                        <div className='pending-payment-date'>
                          <i className='fa-solid fa-calendar'></i>
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td>
                        <div className='pending-payment-address'>
                          <i className='fa-solid fa-location-dot'></i>
                          <span>{order.deliveryAddress || order.customerAddress || order.address || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className='pending-payment-amount'>
                          <span className='pending-payment-amount-symbol'>₹</span>
                          <span className='pending-payment-amount-value'>
                            {formatCurrency(order.total || order.totalAmount || 0)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={`pending-payment-days-badge pending-payment-days-${urgencyLevel}`}>
                          <i
                            className={`fa-solid ${
                              urgencyLevel === 'overdue'
                                ? 'fa-exclamation-triangle'
                                : urgencyLevel === 'urgent'
                                  ? 'fa-clock'
                                  : urgencyLevel === 'warning'
                                    ? 'fa-hourglass-half'
                                    : 'fa-check'
                            }`}
                          ></i>
                          <span>
                            {order.daysPending} {order.daysPending === 1 ? 'day' : 'days'}
                          </span>
                          {urgencyLevel === 'overdue' && <span className='overdue-indicator'>OVERDUE</span>}
                        </div>
                      </td>
                      <td>
                        <div className='pending-payment-order-id'>
                          <i className='fa-solid fa-hashtag'></i>
                          <span className='monospace-text'>{order.orderId || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className='btn btn-success btn-small pending-payment-action-btn'
                          onClick={() => handleMarkAsPaid(order._id || order.orderId)}
                          title='Mark as Paid'
                        >
                          <i className='fa-solid fa-check-circle'></i>
                          <span>Mark Paid</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {}
      <div className='dashboard-grid-layout'>
        {}
        <div className='dashboard-grid-item two-thirds'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-chart-area' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Payment Collection Timeline (30 days)
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
                  gap: '0.5rem',
                  minHeight: '200px',
                  marginBottom: '16px',
                }}
              >
                {paymentTimeline.map((day, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    title={`${day.date}: ₹${formatCurrency(day.collection)} (${day.orders} orders)`}
                  >
                    <div
                      className="pending-amounts-timeline-bar"
                      style={{
                        width: '100%',
                        height: `${(day.collection / maxTimelineCollection) * 180}px`,
                        minHeight: '4px',
                        background: 'var(--admin-success, #16a34a)',
                        borderRadius: '4px 4px 0 0',
                      }}
                    />
                    {idx % 5 === 0 && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--admin-text-light)',
                          fontWeight: '500',
                        }}
                      >
                        {day.date.split(' ')[0]}
                      </span>
                    )}
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
                Avg collection time: {avgCollectionTime} days
              </div>
            </div>
          </div>
        </div>

        {}
        <div className='dashboard-grid-item third-width'>
          <div className='dashboard-card'>
            <h3 className='dashboard-section-title'>
              <i className='fa-solid fa-chart-pie' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
              Payment Mode Breakdown
            </h3>
            <div
              style={{
                padding: '16px',
                borderTop: '2px solid var(--admin-border)',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {paymentModePerformance.map((mode, idx) => {
                  
                  const percentage =
                    totalPaymentAmount > 0
                      ? Math.min(
                          100,
                          parseFloat(((mode.amount / totalPaymentAmount) * 100).toFixed(2))
                        )
                      : 0;
                  return (
                    <div key={idx}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                          {mode.mode}
                        </span>
                        <span
                          style={{
                            fontWeight: '700',
                            color: 'var(--admin-accent)',
                            fontSize: '1rem',
                          }}
                        >
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--admin-text-secondary)',
                          marginBottom: '4px',
                        }}
                      >
                        ₹{formatCurrency(mode.amount)} ({mode.count} orders)
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '20px',
                          background: 'var(--admin-glass-border)',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'var(--admin-accent, #449031)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease',
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
      </div>

    </div>
  );
};

export default PendingAmountsTab;
