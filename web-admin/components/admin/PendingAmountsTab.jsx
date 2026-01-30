import { useEffect, useMemo, useState } from 'react';
import { InlineLoader } from '../loaders/LoaderComponents';
import Icon from '../ui/Icon.jsx';
import { getFilteredOrdersByDate } from './utils/calculations.js';
import { formatDateMonthDay, parseOrderDate } from './utils/dateUtils.js';
import {
  extractOrderIdSequence,
  formatCurrency,
  getOrderAmount,
  getOverdueOrders,
  getTotalRevenue,
  isPaidStatus,
  isPendingStatus,
} from './utils/orderUtils.js';

const PendingAmountsTab = ({
  orders = [],
  loading = false,
  onUpdateOrderStatus,
  onEditOrder,
  onDeleteOrder,
  showNotification,
  settings,
  showConfirmation,
  showOverdueFilter = false,
  onOverdueFilterApplied,
}) => {
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterDaysPending, setFilterDaysPending] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);

  const now = new Date();

  const summaryStats = useMemo(() => {
    const paidOrders = orders.filter((o) =>
      isPaidStatus(o.status, o.paymentStatus)
    );
    const pendingOrders = orders.filter((o) =>
      isPendingStatus(o.status, o.paymentStatus)
    );
    const overdueOrders = getOverdueOrders(orders);
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
  }, [orders]);

  const pendingPayments = useMemo(() => {
    const pending = orders.filter((o) =>
      isPendingStatus(o.status, o.paymentStatus)
    );

    const fortyFiveDaysAgo = new Date(now);
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    fortyFiveDaysAgo.setHours(0, 0, 0, 0);

    let payments = pending
      .map((order) => {
        try {
          const orderDate = parseOrderDate(
            order.date || order.order_date || null
          );
          if (!orderDate) {
            return {
              ...order,
              orderDate: null,
              daysPending: 0,
              isUrgent: false,
              isOverdue: false,
            };
          }
          const daysPending = Math.floor(
            (now - orderDate) / (1000 * 60 * 60 * 24)
          );

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
      payments = payments.filter((p) => p.isUrgent);
    } else if (filterUrgency === 'normal') {
      payments = payments.filter((p) => !p.isUrgent);
    }

    if (filterDaysPending === '0-3') {
      payments = payments.filter(
        (p) => p.daysPending >= 0 && p.daysPending <= 3
      );
    } else if (filterDaysPending === '4-7') {
      payments = payments.filter(
        (p) => p.daysPending >= 4 && p.daysPending <= 7
      );
    } else if (filterDaysPending === '7+') {
      payments = payments.filter((p) => p.daysPending > 7);
    } else if (filterDaysPending === '45+') {
      payments = payments.filter((p) => p.isOverdue);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      payments = payments.filter((p) => {
        const address = (
          p.deliveryAddress ||
          p.customerAddress ||
          p.address ||
          ''
        ).toLowerCase();
        const orderId = (p.orderId || p._id || '').toString().toLowerCase();
        return address.includes(query) || orderId.includes(query);
      });
    }

    return payments;
  }, [orders, now, filterUrgency, filterDaysPending, searchQuery]);

  // Pagination for pending payments
  const totalPages = Math.ceil(pendingPayments.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedPayments = pendingPayments.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterUrgency, filterDaysPending, searchQuery]);

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

      const paidOrders = dayOrders.filter((o) =>
        isPaidStatus(o.status, o.paymentStatus)
      );
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
    const paidOrders = orders.filter((o) =>
      isPaidStatus(o.status, o.paymentStatus)
    );
    if (paidOrders.length === 0) return 0;

    let totalDays = 0;
    paidOrders.forEach((order) => {
      try {
        const orderDate = parseOrderDate(
          order.date || order.order_date || null
        );
        if (!orderDate) return;
        const paidDate = order.paidDate
          ? parseOrderDate(order.paidDate)
          : orderDate;
        if (!paidDate) return;
        const days = Math.floor((paidDate - orderDate) / (1000 * 60 * 60 * 24));
        totalDays += Math.max(0, days);
      } catch (e) {}
    });

    return paidOrders.length > 0
      ? (totalDays / paidOrders.length).toFixed(1)
      : 0;
  }, [orders]);

  const maxTimelineCollection = Math.max(
    ...paymentTimeline.map((t) => t.collection),
    1
  );

  const handleExportPendingPayments = () => {
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    let csvContent =
      'Order ID,Date,Delivery Address,Amount (₹),Days Pending,Status,Payment Mode\n';
    pendingPayments.forEach((p) => {
      const orderDate = p.orderDate ? formatDateMonthDay(p.orderDate) : 'N/A';
      const amount = getOrderAmount(p);
      const status = p.isOverdue
        ? 'Overdue'
        : p.isUrgent
          ? 'Urgent'
          : 'Pending';
      csvContent += `${escapeCSV(p.orderId || p._id || 'N/A')},${escapeCSV(
        orderDate
      )},${escapeCSV(
        p.deliveryAddress || p.customerAddress || p.address || 'N/A'
      )},${escapeCSV(amount.toFixed(2))},${escapeCSV(
        p.daysPending
      )},${escapeCSV(status)},${escapeCSV(p.paymentMode || 'N/A')}\n`;
    });

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pending_payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    if (showNotification)
      showNotification('Pending payments exported successfully', 'success');
  };

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

  const totalPaymentAmount = paymentModePerformance.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  useEffect(() => {
    const setTimelineBarHeights = () => {
      document
        .querySelectorAll('.pending-timeline-bar[data-height]')
        .forEach((bar) => {
          const heightPercent = parseFloat(bar.getAttribute('data-height'));
          bar.style.setProperty('--bar-height', `${heightPercent}%`);
        });
    };

    setTimelineBarHeights();
  }, [paymentTimeline, maxTimelineCollection]);

  useEffect(() => {
    const setPaymentModeBarWidths = () => {
      document
        .querySelectorAll('.pending-payment-mode-bar-fill[data-width]')
        .forEach((bar) => {
          const widthPercent = parseFloat(bar.getAttribute('data-width'));
          bar.style.setProperty('--bar-width', `${widthPercent}%`);
        });
    };

    setPaymentModeBarWidths();
  }, [paymentModePerformance, totalPaymentAmount]);

  const handleMarkAsPaid = async (orderId) => {
    const order = orders.find((o) => (o._id || o.orderId) === orderId);
    const orderInfo = order
      ? `Order ${order.orderId || orderId} for ${
          order.deliveryAddress || order.customerAddress || 'N/A'
        }`
      : `Order ${orderId}`;

    if (showConfirmation && onUpdateOrderStatus) {
      showConfirmation({
        title: 'Mark as Paid',
        message: `Are you sure you want to mark ${orderInfo} as paid?`,
        type: 'info',
        confirmText: 'Mark as Paid',
        onConfirm: async () => {
          try {
            await onUpdateOrderStatus(orderId, 'Paid', true);
            if (showNotification)
              showNotification('Order marked as paid', 'success');
          } catch (error) {
            console.error('Error marking order as paid:', error);
            if (showNotification)
              showNotification('Error updating order', 'error');
          }
        },
      });
    } else if (onUpdateOrderStatus) {
      try {
        await onUpdateOrderStatus(orderId, 'Paid', true);
        if (showNotification)
          showNotification('Order marked as paid', 'success');
      } catch (error) {
        console.error('Error marking order as paid:', error);
        if (showNotification) showNotification('Error updating order', 'error');
      }
    }
  };

  const handleBulkMarkAsPaid = async () => {
    // Mark ALL pending payments, not just urgent ones
    const selectedOrders = pendingPayments;
    const count = selectedOrders.length;

    if (count === 0) {
      if (showNotification)
        showNotification('No pending payments to mark as paid', 'info');
      return;
    }

    if (showConfirmation) {
      showConfirmation({
        title: 'Mark All as Paid',
        message: `Are you sure you want to mark ${count} pending payment${
          count > 1 ? 's' : ''
        } as paid?`,
        type: 'info',
        confirmText: 'Mark All as Paid',
        onConfirm: async () => {
          try {
            let successCount = 0;
            let errorCount = 0;

            for (const order of selectedOrders) {
              try {
                if (onUpdateOrderStatus) {
                  await onUpdateOrderStatus(
                    order._id || order.orderId,
                    'Paid',
                    true
                  );
                  successCount++;
                }
              } catch (error) {
                console.error('Error marking order as paid:', error);
                errorCount++;
              }
            }

            if (errorCount === 0) {
              if (showNotification)
                showNotification(
                  `All ${successCount} payment${successCount > 1 ? 's' : ''} marked as paid`,
                  'success'
                );
            } else {
              if (showNotification)
                showNotification(
                  `${successCount} marked as paid, ${errorCount} failed`,
                  'warning'
                );
            }
          } catch (error) {
            console.error('Error marking orders as paid:', error);
            if (showNotification)
              showNotification('Error updating orders', 'error');
          }
        },
      });
    } else {
      try {
        let successCount = 0;
        let errorCount = 0;

        for (const order of selectedOrders) {
          try {
            if (onUpdateOrderStatus) {
              await onUpdateOrderStatus(
                order._id || order.orderId,
                'Paid',
                true
              );
              successCount++;
            }
          } catch (error) {
            console.error('Error marking order as paid:', error);
            errorCount++;
          }
        }

        if (errorCount === 0) {
          if (showNotification)
            showNotification(
              `All ${successCount} payment${successCount > 1 ? 's' : ''} marked as paid`,
              'success'
            );
        } else {
          if (showNotification)
            showNotification(
              `${successCount} marked as paid, ${errorCount} failed`,
              'warning'
            );
        }
      } catch (error) {
        console.error('Error marking orders as paid:', error);
        if (showNotification)
          showNotification('Error updating orders', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <InlineLoader message="Loading payment data..." />
      </div>
    );
  }

  const totalPendingAmount = pendingPayments.reduce(
    (sum, o) => sum + getOrderAmount(o),
    0
  );

  return (
    <div className="admin-content pending-amounts-tab">
      <div className="kitchen-tab">
        <div className="kitchen-tab-stats">
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="check-circle" />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-value">
                {summaryStats.totalPaidCount.toLocaleString()}
              </div>
              <div className="stat-card-label">Paid</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="clock" />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-value">
                {summaryStats.pendingCount.toLocaleString()}
              </div>
              <div className="stat-card-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="times-circle" className="icon-danger" />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-value">
                {summaryStats.overdueCount.toLocaleString()}
              </div>
              <div className="stat-card-label">Overdue</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="calendar-alt" className="icon-accent" />
            </div>
            <div className="stat-card-content">
              <div className="stat-card-value">
                {pendingPayments.length.toLocaleString()}
              </div>
              <div className="stat-card-label">Showing</div>
            </div>
          </div>
        </div>

        <div className="kitchen-tab-actions">
          <div className="kitchen-tab-actions-left pending-filter-bar-wrap">
            <div className="pending-filter-bar">
              <div className="filter-container pending-filter-container">
                <div className="search-input-wrapper search-input-wrapper-flex">
                  <input
                    type="text"
                    className="input-field search-input-with-icon"
                    placeholder="Search by address or order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search by address or order ID"
                  />
                </div>
                <select
                  className="input-field filter-input-standard filter-select-placeholder"
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                  aria-label="Filter by urgency"
                >
                  <option value="all">All</option>
                  <option value="urgent">Urgent (&gt;7 days)</option>
                  <option value="normal">Normal (≤7 days)</option>
                </select>
                <select
                  className="input-field filter-input-standard filter-select-placeholder"
                  value={filterDaysPending}
                  onChange={(e) => setFilterDaysPending(e.target.value)}
                  aria-label="Filter by days pending"
                >
                  <option value="all">All</option>
                  <option value="0-3">0-3 days</option>
                  <option value="4-7">4-7 days</option>
                  <option value="7+">7+ days</option>
                  <option value="45+">45+ days (Overdue)</option>
                </select>
                {(searchQuery ||
                  filterUrgency !== 'all' ||
                  filterDaysPending !== 'all') && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-small pending-clear-filter-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterUrgency('all');
                      setFilterDaysPending('all');
                    }}
                    title="Clear filters"
                    aria-label="Clear filters"
                  >
                    <Icon name="xmark" className="pending-clear-filter-icon" />
                    Clear filters
                  </button>
                )}
                <div className="action-buttons-group pending-amounts-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={handleExportPendingPayments}
                    disabled={pendingPayments.length === 0}
                    title="Export list to CSV"
                    aria-label="Export to CSV"
                  >
                    <Icon name="download" className="pending-export-icon" />
                    Export CSV
                  </button>
                  <button
                    type="button"
                    className="btn btn-special btn-small"
                    onClick={handleBulkMarkAsPaid}
                    disabled={pendingPayments.length === 0}
                    aria-label="Mark all as paid"
                  >
                    <Icon
                      name="check-circle"
                      className="pending-mark-paid-icon"
                    />
                    Mark All as Paid
                  </button>
                </div>
                {pendingPayments.length > 0 && (
                  <div className="pending-payments-count-info">
                    <span className="pending-payments-summary">
                      {pendingPayments.length} unpaid order
                      {pendingPayments.length !== 1 ? 's' : ''} · ₹
                      {formatCurrency(totalPendingAmount)} total
                    </span>
                    <span className="pending-payments-range">
                      Showing {Math.min(startIndex + 1, pendingPayments.length)}
                      –
                      {Math.min(
                        startIndex + recordsPerPage,
                        pendingPayments.length
                      )}{' '}
                      of {pendingPayments.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <section
          className="pending-list-section"
          aria-labelledby="pending-list-title"
        >
          <h3 id="pending-list-title" className="pending-list-section-title">
            <Icon name="list" className="pending-list-title-icon" />
            Unpaid orders list
          </h3>
          <div className="kitchen-tab-card pending-list-card">
            <div className="orders-table-container">
              <table
                className="orders-table pending-amounts-table"
                role="table"
                aria-label="Unpaid orders"
              >
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Address</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Days</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="pending-table-empty-message">
                        <div className="pending-table-empty-content">
                          <Icon
                            name={
                              searchQuery ||
                              filterUrgency !== 'all' ||
                              filterDaysPending !== 'all'
                                ? 'inbox'
                                : 'check-circle'
                            }
                            className={`pending-table-empty-icon ${!(searchQuery || filterUrgency !== 'all' || filterDaysPending !== 'all') ? 'pending-table-empty-success' : ''}`}
                          />
                          <p className="pending-table-empty-text">
                            {searchQuery ||
                            filterUrgency !== 'all' ||
                            filterDaysPending !== 'all'
                              ? 'No records found for this filter'
                              : 'All payments collected'}
                          </p>
                          {searchQuery ||
                          filterUrgency !== 'all' ||
                          filterDaysPending !== 'all' ? (
                            <>
                              <p className="pending-table-empty-subtext">
                                Try adjusting filters or clear to see all
                                pending
                              </p>
                              <button
                                type="button"
                                className="btn btn-ghost btn-small pending-table-empty-clear-btn"
                                onClick={() => {
                                  setSearchQuery('');
                                  setFilterUrgency('all');
                                  setFilterDaysPending('all');
                                }}
                                aria-label="Clear filters"
                              >
                                <Icon name="filter-circle-xmark" /> Clear
                                filters
                              </button>
                            </>
                          ) : (
                            <p className="pending-table-empty-subtext">
                              No unpaid orders right now
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((order, idx) => {
                      const orderDate = parseOrderDate(
                        order.orderDate ||
                          order.date ||
                          order.order_date ||
                          null
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
                            <div className="pending-payment-date">
                              <span>{dateStr}</span>
                            </div>
                          </td>
                          <td>
                            <div className="pending-payment-address">
                              <span>
                                {order.deliveryAddress ||
                                  order.customerAddress ||
                                  order.address ||
                                  'N/A'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="pending-payment-amount">
                              <span className="pending-payment-amount-symbol">
                                ₹
                              </span>
                              <span className="pending-payment-amount-value">
                                {formatCurrency(getOrderAmount(order))}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`pending-status-badge pending-status-${urgencyLevel}`}
                              title={
                                urgencyLevel === 'overdue'
                                  ? '45+ days old'
                                  : urgencyLevel === 'urgent'
                                    ? 'More than 7 days'
                                    : 'Within 7 days'
                              }
                            >
                              {urgencyLevel === 'overdue'
                                ? 'Overdue'
                                : urgencyLevel === 'urgent'
                                  ? 'Urgent'
                                  : urgencyLevel === 'warning'
                                    ? 'Pending'
                                    : 'Recent'}
                            </span>
                          </td>
                          <td>
                            <div
                              className={`pending-payment-days-badge pending-payment-days-${urgencyLevel}`}
                            >
                              {order.daysPending}{' '}
                              {order.daysPending === 1 ? 'day' : 'days'}
                              {urgencyLevel === 'overdue' && (
                                <span className="overdue-indicator">
                                  {' '}
                                  · 45+
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="pending-payment-order-id">
                              <Icon name="hashtag" />
                              <span className="monospace-text">
                                {order.orderId || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons-cell">
                              <button
                                type="button"
                                className="btn btn-ghost btn-icon action-icon-edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onEditOrder) onEditOrder(order);
                                }}
                                title="Edit"
                                aria-label="Edit"
                              >
                                <Icon name="pencil" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost btn-icon action-icon-delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onDeleteOrder)
                                    onDeleteOrder(order._id || order.orderId);
                                }}
                                title="Delete"
                                aria-label="Delete"
                              >
                                <Icon name="trash" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-special btn-small pending-payment-action-btn"
                                onClick={() =>
                                  handleMarkAsPaid(order._id || order.orderId)
                                }
                                title="Mark as Paid"
                                aria-label="Mark as paid"
                              >
                                <Icon name="check-circle" />
                                <span>Mark Paid</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {pendingPayments.length > 0 && totalPages > 1 && (
              <div className="pagination-controls">
                <div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-small"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <Icon name="chevron-left" /> Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-small"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                  >
                    Next <Icon name="chevron-right" />
                  </button>
                </div>
                <div className="pagination-container">
                  <span>Show:</span>
                  <select
                    className="pagination-select"
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    aria-label="Rows per page"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                  <span>per page</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="dashboard-grid-layout pending-amounts-charts">
          <div className="dashboard-grid-item two-thirds">
            <div className="dashboard-card">
              <h3 className="dashboard-section-title">
                <Icon name="chart-area" className="pending-chart-icon" />
                Daily collection (last 30 days)
              </h3>
              <p className="pending-chart-desc">
                Amount collected each day from paid orders
              </p>
              <div className="pending-timeline-section">
                <div className="pending-timeline-container">
                  {paymentTimeline.map((day, idx) => {
                    const heightPercent =
                      maxTimelineCollection > 0
                        ? Math.min(
                            100,
                            (day.collection / maxTimelineCollection) * 100
                          )
                        : 0;
                    const hasLabel = idx % 5 === 0;
                    return (
                      <div
                        key={idx}
                        className={`pending-timeline-item${hasLabel ? ' has-label' : ''}`}
                        title={`${day.date}: ₹${formatCurrency(day.collection)} (${day.orders} orders)`}
                      >
                        <div
                          className="pending-amounts-timeline-bar pending-timeline-bar"
                          data-height={heightPercent}
                        />
                        {hasLabel && (
                          <span className="pending-timeline-label">
                            {day.date.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="pending-timeline-summary">
                  Avg collection time: {avgCollectionTime} days
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid-item third-width">
            <div className="dashboard-card">
              <h3 className="dashboard-section-title">
                <Icon name="chart-pie" className="pending-chart-icon" />
                Payment mode (all orders)
              </h3>
              <p className="pending-chart-desc">
                Share of revenue by payment method
              </p>
              <div className="pending-payment-mode-section">
                <div className="pending-payment-mode-list">
                  {paymentModePerformance.map((mode, idx) => {
                    const percentage =
                      totalPaymentAmount > 0
                        ? Math.min(
                            100,
                            parseFloat(
                              (
                                (mode.amount / totalPaymentAmount) *
                                100
                              ).toFixed(2)
                            )
                          )
                        : 0;
                    return (
                      <div key={idx}>
                        <div className="pending-payment-mode-header">
                          <span className="pending-payment-mode-label">
                            {mode.mode}
                          </span>
                          <span className="pending-payment-mode-percentage">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="pending-payment-mode-details">
                          ₹{formatCurrency(mode.amount)} ({mode.count} orders)
                        </div>
                        <div className="pending-payment-mode-bar-container">
                          <div
                            className="pending-payment-mode-bar-fill"
                            data-width={percentage}
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
    </div>
  );
};

export default PendingAmountsTab;
