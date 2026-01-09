// Tab 7: Payment Management (Pending Payments) - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useEffect, useMemo, useState } from 'react';
import { getFilteredOrdersByDate } from './utils/calculations.js';
import { formatDateMonthDay, parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  getTotalRevenue,
  isPaidStatus,
  isPendingStatus,
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTemplate, setReminderTemplate] = useState('friendly');
  const [sendViaSMS, setSendViaSMS] = useState(true);
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true);
  const [sendViaEmail, setSendViaEmail] = useState(false);

  // Filter state
  const [filterUrgency, setFilterUrgency] = useState('all'); // 'all', 'urgent', 'normal'
  const [filterDaysPending, setFilterDaysPending] = useState('all'); // 'all', '0-3', '4-7', '7+'
  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const paidOrders = orders.filter((o) => isPaidStatus(o.status));
    const pendingOrders = orders.filter((o) => isPendingStatus(o.status));

    // Overdue orders (pending > 45 days)
    const fortyFiveDaysAgo = new Date(now);
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    fortyFiveDaysAgo.setHours(0, 0, 0, 0); // Set to midnight for consistent date comparison
    const overdueOrders = pendingOrders.filter((o) => {
      try {
        // Never use createdAt (today's date) as fallback - only use actual order date
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (!orderDate) return false;
        // Normalize orderDate to midnight for comparison
        const orderDateMidnight = new Date(orderDate);
        orderDateMidnight.setHours(0, 0, 0, 0);
        return orderDateMidnight < fortyFiveDaysAgo;
      } catch (e) {
        return false;
      }
    });

    // Current month stats
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

  // Pending payments list
  const pendingPayments = useMemo(() => {
    const pending = orders.filter((o) => isPendingStatus(o.status));
    // Calculate fortyFiveDaysAgo to match notification logic exactly
    const fortyFiveDaysAgo = new Date(now);
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    fortyFiveDaysAgo.setHours(0, 0, 0, 0);

    let payments = pending
      .map((order) => {
        try {
          // Never use createdAt (today's date) as fallback - only use actual order date
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
          // Use same logic as notification: normalize dates to midnight and compare
          const orderDateMidnight = new Date(orderDate);
          orderDateMidnight.setHours(0, 0, 0, 0);
          const isOverdue = orderDateMidnight < fortyFiveDaysAgo;
          return {
            ...order,
            orderDate,
            daysPending,
            isUrgent: daysPending > 7,
            isOverdue, // Match notification logic exactly
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
      .sort((a, b) => b.daysPending - a.daysPending); // Sort by days pending (most urgent first)

    // Apply filters
    if (filterUrgency === 'urgent') {
      // Use isOverdue to match notification logic exactly
      payments = payments.filter((p) => p.isOverdue);
    } else if (filterUrgency === 'normal') {
      payments = payments.filter((p) => !p.isOverdue);
    }

    if (filterDaysPending === '0-3') {
      payments = payments.filter((p) => p.daysPending >= 0 && p.daysPending <= 3);
    } else if (filterDaysPending === '4-7') {
      payments = payments.filter((p) => p.daysPending >= 4 && p.daysPending <= 7);
    } else if (filterDaysPending === '7+') {
      // Filter for orders > 7 days (but not necessarily overdue)
      payments = payments.filter((p) => p.daysPending > 7);
    } else if (filterDaysPending === '45+') {
      // Use isOverdue to match notification logic exactly (> 45 days)
      payments = payments.filter((p) => p.isOverdue);
    }

    // Search filter
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

  // Auto-filter to overdue when opened from notification
  useEffect(() => {
    if (showOverdueFilter) {
      setFilterDaysPending('45+');
      setFilterUrgency('urgent');
      // Reset the flag after applying filters
      if (onOverdueFilterApplied) {
        onOverdueFilterApplied();
      }
    }
  }, [showOverdueFilter, onOverdueFilterApplied]);

  // Payment collection timeline (last 30 days)
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
          // Never use createdAt (today's date) as fallback - only use actual order date
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

  // Calculate average collection time
  const avgCollectionTime = useMemo(() => {
    const paidOrders = orders.filter((o) => isPaidStatus(o.status));
    if (paidOrders.length === 0) return 0;

    let totalDays = 0;
    paidOrders.forEach((order) => {
      try {
        const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
        if (!orderDate) return;
        const paidDate = order.paidDate ? parseOrderDate(order.paidDate) : orderDate; // If paidDate exists, use it
        if (!paidDate) return;
        const days = Math.floor((paidDate - orderDate) / (1000 * 60 * 60 * 24));
        totalDays += Math.max(0, days);
      } catch (e) {
        // Ignore
      }
    });

    return paidOrders.length > 0 ? (totalDays / paidOrders.length).toFixed(1) : 0;
  }, [orders]);

  const maxTimelineCollection = Math.max(...paymentTimeline.map((t) => t.collection), 1);

  // Payment mode performance
  const paymentModePerformance = useMemo(() => {
    const modeStats = {};
    orders.forEach((o) => {
      const mode = o.paymentMode || 'Not Set';
      if (!modeStats[mode]) {
        modeStats[mode] = { count: 0, amount: 0 };
      }
      modeStats[mode].count++;
      modeStats[mode].amount += parseFloat(o.total || o.totalAmount || 0);
    });
    return Object.entries(modeStats)
      .map(([mode, stats]) => ({ mode, ...stats }))
      .sort((a, b) => b.amount - a.amount);
  }, [orders]);

  const totalPaymentAmount = paymentModePerformance.reduce((sum, p) => sum + p.amount, 0);

  // Handle mark as paid
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

  // Handle bulk mark as paid
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

  // Handle send reminder
  const handleSendReminder = () => {
    if (!selectedOrder) return;
    // In a real app, this would send via SMS/WhatsApp/Email
    if (showNotification) {
      showNotification(
        `Reminder sent to ${
          selectedOrder.deliveryAddress || selectedOrder.customerAddress || selectedOrder.address
        }`,
        'success'
      );
    }
    setShowReminderModal(false);
    setSelectedOrder(null);
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

      {/* FILTER BAR */}
      <div className='dashboard-card dashboard-card-spaced'>
        <div className='filter-container'>
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
              style={{ fontSize: '13px', padding: '10px 16px' }}
            >
              <i className='fa-solid fa-xmark' style={{ marginRight: '6px' }}></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY CARDS */}
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

      {/* PENDING PAYMENTS TABLE */}
      <div className='dashboard-card margin-bottom-24'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 className='dashboard-section-title' style={{ marginBottom: 0 }}>
            <i
              className='fa-solid fa-exclamation-triangle'
              style={{ fontSize: '1rem', opacity: 0.7, color: 'var(--admin-danger)' }}
            ></i>
            Pending Payments {pendingPayments.filter((p) => p.isUrgent).length > 0 && '(Urgent)'}
          </h3>
          <div className='action-buttons-group'>
            <button className='btn btn-success btn-small' onClick={handleBulkMarkAsPaid}>
              Mark All as Paid
            </button>
            <button className='btn btn-secondary btn-small'>Send Bulk Reminder</button>
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
                    // Never use createdAt (today's date) as fallback - only use actual order date
                    order.orderDate || order.date || order.order_date || null
                  );
                  const dateStr = formatDateMonthDay(orderDate);

                  return (
                    <tr
                      key={order._id || order.orderId || idx}
                      style={{
                        background: order.isUrgent ? 'var(--admin-danger-light)' : 'transparent',
                      }}
                    >
                      <td>{dateStr}</td>
                      <td>
                        {order.deliveryAddress || order.customerAddress || order.address || 'N/A'}
                      </td>
                      <td style={{ fontWeight: '700', color: 'var(--admin-accent)' }}>
                        ₹{formatCurrency(order.total || order.totalAmount || 0)}
                      </td>
                      <td>
                        <span
                          className={`badge ${order.isUrgent ? 'badge-danger' : 'badge-warning'}`}
                        >
                          {order.daysPending} days {order.isUrgent && '⚠️'}
                        </span>
                      </td>
                      <td className='monospace-text'>{order.orderId || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className='btn btn-success btn-small'
                            onClick={() => handleMarkAsPaid(order._id || order.orderId)}
                            title='Mark as Paid'
                          >
                            <i className='fa-solid fa-check'></i> Paid
                          </button>
                          <button
                            className='btn btn-secondary btn-small'
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReminderModal(true);
                            }}
                            title='Send Reminder'
                          >
                            <i className='fa-solid fa-bell'></i> Remind
                          </button>
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

      {/* CHARTS SECTION */}
      <div className='dashboard-grid-layout'>
        {/* Payment Collection Timeline */}
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
                      style={{
                        width: '100%',
                        height: `${(day.collection / maxTimelineCollection) * 180}px`,
                        minHeight: '4px',
                        background: 'var(--admin-success, #449031)',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                      onMouseLeave={(e) => (e.target.style.opacity = '1')}
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

        {/* Payment Mode Performance */}
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
                  // Calculate percentage: (amount / total) * 100, with accuracy based on total records / 100
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

      {/* SEND REMINDER MODAL */}
      {showReminderModal && selectedOrder && (
        <div className='modal-overlay' onClick={() => setShowReminderModal(false)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Send Payment Reminder</h2>
              <button className='modal-close' onClick={() => setShowReminderModal(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>To</label>
                  <input
                    type='text'
                    className='input-field'
                    value={
                      selectedOrder.deliveryAddress ||
                      selectedOrder.customerAddress ||
                      selectedOrder.address ||
                      'N/A'
                    }
                    readOnly
                  />
                </div>
                <div className='form-group'>
                  <label>Amount</label>
                  <input
                    type='text'
                    className='input-field'
                    value={`₹${formatCurrency(
                      selectedOrder.total || selectedOrder.totalAmount || 0
                    )}`}
                    readOnly
                  />
                </div>
                <div className='form-group'>
                  <label>Order</label>
                  <input
                    type='text'
                    className='input-field'
                    value={selectedOrder.orderId || 'N/A'}
                    readOnly
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Message Template</label>
                  <select
                    className='input-field'
                    value={reminderTemplate}
                    onChange={(e) => setReminderTemplate(e.target.value)}
                  >
                    <option value='friendly'>Friendly Reminder</option>
                    <option value='urgent'>Urgent Reminder</option>
                    <option value='final'>Final Notice</option>
                  </select>
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Message Preview</label>
                  <div
                    style={{
                      padding: '16px',
                      background: 'var(--admin-glass-bg)',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-glass-border)',
                      minHeight: '80px',
                    }}
                  >
                    {reminderTemplate === 'friendly' && (
                      <p>
                        Hi, this is a friendly reminder for your pending payment of ₹
                        {formatCurrency(selectedOrder.total || selectedOrder.totalAmount || 0)} for
                        order {selectedOrder.orderId || 'N/A'}.
                      </p>
                    )}
                    {reminderTemplate === 'urgent' && (
                      <p>
                        Urgent: Your payment of ₹
                        {formatCurrency(selectedOrder.total || selectedOrder.totalAmount || 0)} for
                        order {selectedOrder.orderId || 'N/A'} is overdue. Please settle at your
                        earliest convenience.
                      </p>
                    )}
                    {reminderTemplate === 'final' && (
                      <p>
                        Final Notice: Your payment of ₹
                        {formatCurrency(selectedOrder.total || selectedOrder.totalAmount || 0)} for
                        order {selectedOrder.orderId || 'N/A'} is long overdue. Please contact us
                        immediately.
                      </p>
                    )}
                  </div>
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Send via</label>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginTop: '8px',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={sendViaSMS}
                        onChange={(e) => setSendViaSMS(e.target.checked)}
                      />
                      <span>SMS</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={sendViaWhatsApp}
                        onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                      />
                      <span>WhatsApp</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={sendViaEmail}
                        onChange={(e) => setSendViaEmail(e.target.checked)}
                      />
                      <span>Email</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-ghost' onClick={() => setShowReminderModal(false)}>
                Cancel
              </button>
              <button
                className='btn btn-primary'
                onClick={handleSendReminder}
                disabled={!sendViaSMS && !sendViaWhatsApp && !sendViaEmail}
              >
                <i className='fa-solid fa-paper-plane'></i> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingAmountsTab;
