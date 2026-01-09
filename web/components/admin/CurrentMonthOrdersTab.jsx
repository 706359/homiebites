// Tab 3: Current Month Data - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useEffect, useMemo, useState } from 'react';
import { getFilteredOrdersByDate } from './utils/calculations.js';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  getTotalRevenue,
  isPaidStatus,
  isPendingStatus,
} from './utils/orderUtils.js';
import EmptyState from './EmptyState.jsx';
import OrderModal from './OrderModal.jsx';
import PremiumLoader from './PremiumLoader.jsx';

const CurrentMonthOrdersTab = ({
  orders = [],
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  onUpdateOrderStatus,
  currentPage = 1,
  recordsPerPage = 25,
  onPageChange,
  onRecordsPerPageChange,
  loading = false,
  loadOrders,
  showNotification,
  settings,
}) => {
  const now = new Date();
  const currentMonthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Quick filter state
  const [quickFilter, setQuickFilter] = useState('all'); // 'all', 'today', 'yesterday', 'thisWeek', 'pending', 'paid'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [newOrder, setNewOrder] = useState({
    date: new Date().toISOString().split('T')[0],
    deliveryAddress: '',
    quantity: 1,
    unitPrice: settings?.defaultUnitPrice || 100,
    total: settings?.defaultUnitPrice || 100,
    mode: 'Lunch',
    status: 'Pending',
    paymentMode: 'Online',
  });

  // Keyboard shortcut for new order (Ctrl+N / Cmd+N) and custom event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle if not typing in an input/textarea/select
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === 'n' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
      ) {
        e.preventDefault();
        setShowAddOrderModal(true);
      }
    };

    const handleOpenModalEvent = () => {
      setShowAddOrderModal(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openNewOrderModal', handleOpenModalEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openNewOrderModal', handleOpenModalEvent);
    };
  }, []);

  // Get current month orders
  const currentMonthOrders = useMemo(() => {
    return getFilteredOrdersByDate(orders, 'month', '', '');
  }, [orders]);

  // Calculate stats
  const currentMonthStats = useMemo(() => {
    const revenue = getTotalRevenue(currentMonthOrders);
    const total = currentMonthOrders.length;
    const pending = currentMonthOrders.filter((o) => isPendingStatus(o.status));
    const pendingAmount = pending.reduce((sum, o) => {
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

    // Calculate month-over-month growth
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
    const growth =
      lastMonthRevenue > 0
        ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : revenue > 0
          ? Infinity
          : 0;

    return {
      revenue,
      total,
      pendingCount: pending.length,
      pendingAmount,
      growth,
    };
  }, [currentMonthOrders, orders, now]);

  // Quick filter dates
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  // Filter orders based on quick filter
  const filteredOrders = useMemo(() => {
    let filtered = [...currentMonthOrders];

    switch (quickFilter) {
      case 'today':
        filtered = filtered.filter((o) => {
          try {
            // Never use createdAt (today's date) as fallback - only use actual order date
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            return orderDate >= today && orderDate < tomorrow;
          } catch (e) {
            return false;
          }
        });
        break;
      case 'yesterday':
        filtered = filtered.filter((o) => {
          try {
            // Never use createdAt (today's date) as fallback - only use actual order date
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            return orderDate >= yesterday && orderDate < today;
          } catch (e) {
            return false;
          }
        });
        break;
      case 'thisWeek':
        filtered = filtered.filter((o) => {
          try {
            // Never use createdAt (today's date) as fallback - only use actual order date
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            return orderDate >= thisWeekStart;
          } catch (e) {
            return false;
          }
        });
        break;
      case 'pending':
        filtered = filtered.filter((o) => isPendingStatus(o.status));
        break;
      case 'paid':
        filtered = filtered.filter((o) => isPaidStatus(o.status));
        break;
      default:
        // 'all' - no filter
        break;
    }

    return filtered;
  }, [currentMonthOrders, quickFilter, searchQuery, today, tomorrow, yesterday, thisWeekStart]);

  // Quick filter counts
  const quickFilterCounts = useMemo(() => {
    const todayOrders = currentMonthOrders.filter((o) => {
      try {
        // Never use createdAt (today's date) as fallback - only use actual order date
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        return orderDate >= today && orderDate < tomorrow;
      } catch (e) {
        return false;
      }
    });

    const yesterdayOrders = currentMonthOrders.filter((o) => {
      try {
        // Never use createdAt (today's date) as fallback - only use actual order date
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        return orderDate >= yesterday && orderDate < today;
      } catch (e) {
        return false;
      }
    });

    const thisWeekOrders = currentMonthOrders.filter((o) => {
      try {
        // Never use createdAt (today's date) as fallback - only use actual order date
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        return orderDate >= thisWeekStart;
      } catch (e) {
        return false;
      }
    });

    const pendingOrders = currentMonthOrders.filter((o) => isPendingStatus(o.status));
    const paidOrders = currentMonthOrders.filter((o) => isPaidStatus(o.status));

    return {
      all: currentMonthOrders.length,
      today: todayOrders.length,
      yesterday: yesterdayOrders.length,
      thisWeek: thisWeekOrders.length,
      pending: pendingOrders.length,
      paid: paidOrders.length,
    };
  }, [currentMonthOrders, today, tomorrow, yesterday, thisWeekStart]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + recordsPerPage);

  // Handle new order change
  const handleNewOrderChange = (field, value) => {
    const updated = { ...newOrder, [field]: value };

    // Auto-calculate total when quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? parseInt(value) || 1 : parseInt(updated.quantity) || 1;
      const price =
        field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(updated.unitPrice) || 0;
      updated.total = qty * price;
    }

    setNewOrder(updated);
  };

  // Handle save order
  const handleSaveOrder = async () => {
    try {
      if (onAddOrder) {
        await onAddOrder(newOrder);
        if (showNotification) showNotification('Order added successfully', 'success');
        setShowAddOrderModal(false);
        setNewOrder({
          date: new Date().toISOString().split('T')[0],
          deliveryAddress: '',
          quantity: 1,
          unitPrice: settings?.defaultUnitPrice || 100,
          total: settings?.defaultUnitPrice || 100,
          mode: 'Lunch',
          status: 'Pending',
          paymentMode: 'Online',
        });
        if (loadOrders) loadOrders();
      }
    } catch (error) {
      console.error('Error saving order:', error);
      if (showNotification) showNotification('Error saving order', 'error');
    }
  };

  // Get recent addresses for autocomplete
  const recentAddresses = useMemo(() => {
    const addresses = new Set();
    currentMonthOrders.forEach((o) => {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (addr) addresses.add(addr);
    });
    return Array.from(addresses).slice(0, 10);
  }, [currentMonthOrders]);

  if (loading) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Current Month Orders</h2>
        </div>
        <PremiumLoader message='Loading orders...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* STATS ROW */}
      <div className='admin-stats'>
        <div className='stat-card'>
          <i className='fa-solid fa-rupee-sign'></i>
          <div>
            <h3>₹{formatCurrency(currentMonthStats.revenue)}</h3>
            <p>This Month Revenue</p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-shopping-cart'></i>
          <div>
            <h3>{currentMonthStats.total}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className='stat-card'>
          <i
            className='fa-solid fa-exclamation-triangle'
            style={{ color: 'var(--admin-warning)' }}
          ></i>
          <div>
            <h3>₹{formatCurrency(currentMonthStats.pendingAmount)}</h3>
            <p>Pending Payments</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {currentMonthStats.pendingCount} orders
            </p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-chart-line' style={{ color: 'var(--admin-success)' }}></i>
          <div>
            <h3>
              {currentMonthStats.growth === Infinity
                ? 'New'
                : `${currentMonthStats.growth >= 0 ? '+' : ''}${currentMonthStats.growth.toFixed(
                    1
                  )}%`}
            </h3>
            <p>vs Last Month</p>
            <p
              style={{
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                color: 'var(--admin-text-light)',
              }}
            >
              {currentMonthStats.growth >= 0 ? '↑' : '↓'}
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & ACTION BAR */}
      <div className='dashboard-card dashboard-card-spaced'>
        {/* Quick Filter Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <button
            className={`btn ${quickFilter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-small`}
            onClick={() => {
              setQuickFilter('all');
              if (onPageChange) onPageChange(1);
            }}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            All ({quickFilterCounts.all})
          </button>
          <button
            className={`btn ${quickFilter === 'today' ? 'btn-primary' : 'btn-ghost'} btn-small`}
            onClick={() => {
              setQuickFilter('today');
              if (onPageChange) onPageChange(1);
            }}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <i className='fa-solid fa-calendar-day' style={{ marginRight: '6px' }}></i>
            Today ({quickFilterCounts.today})
          </button>
          <button
            className={`btn ${quickFilter === 'yesterday' ? 'btn-primary' : 'btn-ghost'} btn-small`}
            onClick={() => {
              setQuickFilter('yesterday');
              if (onPageChange) onPageChange(1);
            }}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <i className='fa-solid fa-calendar' style={{ marginRight: '6px' }}></i>
            Yesterday ({quickFilterCounts.yesterday})
          </button>
          <button
            className={`btn ${quickFilter === 'thisWeek' ? 'btn-primary' : 'btn-ghost'} btn-small`}
            onClick={() => {
              setQuickFilter('thisWeek');
              if (onPageChange) onPageChange(1);
            }}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <i className='fa-solid fa-calendar-week' style={{ marginRight: '6px' }}></i>
            This Week ({quickFilterCounts.thisWeek})
          </button>
          <button
            className={`btn ${quickFilter === 'pending' ? 'btn-primary' : 'btn-ghost'} btn-small`}
            onClick={() => {
              setQuickFilter('pending');
              if (onPageChange) onPageChange(1);
            }}
            style={{
              fontSize: '13px',
              padding: '8px 16px',
              color: quickFilter === 'pending' ? 'var(--admin-warning)' : undefined,
            }}
          >
            <i className='fa-solid fa-exclamation-triangle' style={{ marginRight: '6px' }}></i>
            Pending ({quickFilterCounts.pending})
          </button>
          <button
            className={`btn ${quickFilter === 'paid' ? 'btn-primary' : 'btn-ghost'} btn-small`}
            onClick={() => {
              setQuickFilter('paid');
              if (onPageChange) onPageChange(1);
            }}
            style={{
              fontSize: '13px',
              padding: '8px 16px',
              color: quickFilter === 'paid' ? 'var(--admin-success)' : undefined,
            }}
          >
            <i className='fa-solid fa-check-circle' style={{ marginRight: '6px' }}></i>
            Paid ({quickFilterCounts.paid})
          </button>
        </div>

        {/* Search and Actions */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className='search-input-wrapper' style={{ flex: 1, minWidth: '250px' }}>
            <i className='fa-solid fa-search search-input-icon'></i>
            <input
              type='text'
              className='input-field search-input-with-icon'
              placeholder='Search by address, order ID...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='action-buttons-group'>
            <button
              className='btn btn-secondary btn-small'
              title='Upload CSV'
              onClick={() => {
                // TODO: Open CSV upload modal
                if (showNotification) showNotification('CSV upload coming soon', 'info');
              }}
            >
              <i className='fa-solid fa-upload'></i> Upload CSV
            </button>
            <button
              className='btn btn-secondary btn-small'
              title='Export Month'
              onClick={() => {
                const csvContent =
                  'Date,Address,Quantity,Amount,Mode,Status,Payment\n' +
                  filteredOrders
                    .map((o) => {
                      // Never use createdAt (today's date) as fallback - only use actual order date
                      const date = new Date(o.date || o.order_date || 0);
                      const orderDate = parseOrderDate(o.date || o.order_date || null);
                      return `"${formatDate(orderDate)}","${
                        o.deliveryAddress || o.customerAddress || o.address || 'N/A'
                      }","${o.quantity || 1}","${o.total || o.totalAmount || 0}","${
                        o.mode || 'N/A'
                      }","${o.status || 'N/A'}","${o.paymentMode || 'N/A'}"`;
                    })
                    .join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `current_month_export_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
                if (showNotification)
                  showNotification('Month data exported successfully', 'success');
              }}
            >
              <i className='fa-solid fa-download'></i> Export Month
            </button>
            <button
              className='btn btn-ghost btn-small'
              title='Refresh'
              onClick={() => loadOrders && loadOrders()}
            >
              <i className='fa-solid fa-refresh'></i> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className='dashboard-card'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem' }}>
            Showing {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredOrders.length)}{' '}
            of {filteredOrders.length} orders
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            icon='fa-solid fa-inbox'
            title='No orders found'
            message='Try adjusting your filters or add a new order'
            actionLabel='Add New Order (Ctrl+N)'
            onAction={() => setShowAddOrderModal(true)}
          />
        ) : (
          <>
            <div className='orders-table-container'>
              <table className='orders-table'>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>OrderID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, idx) => {
                    const orderDate = parseOrderDate(
                      // Never use createdAt (today's date) as fallback - only use actual order date
                      order.date || order.order_date || null
                    );
                    const dateStr = formatDate(orderDate);
                    const isPaid = isPaidStatus(order.status);

                    return (
                      <tr
                        key={order._id || order.orderId || idx}
                        onDoubleClick={() => {
                          setEditingOrder(order);
                          setShowAddOrderModal(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{startIndex + idx + 1}</td>
                        <td>{dateStr}</td>
                        <td>
                          {order.deliveryAddress || order.customerAddress || order.address || 'N/A'}
                        </td>
                        <td>{order.quantity || 1}</td>
                        <td>₹{formatCurrency(order.unitPrice || 0)}</td>
                        <td>₹{formatCurrency(order.total || order.totalAmount || 0)}</td>
                        <td>{order.mode || 'N/A'}</td>
                        <td>
                          <select
                            className={`status-dropdown ${
                              isPaid ? 'status-paid' : 'status-unpaid'
                            }`}
                            value={isPaid ? 'Paid' : 'Unpaid'}
                            onChange={(e) => {
                              e.stopPropagation();
                              if (onUpdateOrderStatus) {
                                onUpdateOrderStatus(order._id || order.orderId, e.target.value);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value='Paid'>Paid</option>
                            <option value='Unpaid'>Unpaid</option>
                          </select>
                        </td>
                        <td>{order.paymentMode || 'N/A'}</td>
                        <td className='monospace-text'>{order.orderId || 'N/A'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className='action-icon-btn action-icon-edit'
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingOrder(order);
                                setShowAddOrderModal(true);
                              }}
                              title='Edit'
                            >
                              <i className='fa-solid fa-pencil'></i>
                            </button>
                            <button
                              className='action-icon-btn action-icon-delete'
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onDeleteOrder) onDeleteOrder(order._id || order.orderId);
                              }}
                              title='Delete'
                            >
                              <i className='fa-solid fa-trash'></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className='pagination-controls'>
              <div>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className='fa-solid fa-chevron-left'></i> Previous
                </button>
                <span style={{ margin: '0 16px', fontWeight: '600' }}>
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next <i className='fa-solid fa-chevron-right'></i>
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Show:</span>
                <select
                  className='input-field'
                  style={{ width: '80px', padding: '6px 8px' }}
                  value={recordsPerPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (onRecordsPerPageChange) onRecordsPerPageChange(value);
                    if (onPageChange) onPageChange(1);
                  }}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>per page</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ADD ORDER MODAL */}
      {showAddOrderModal && (
        <OrderModal
          show={showAddOrderModal}
          editingOrder={editingOrder}
          newOrder={newOrder}
          orders={orders}
          addressSuggestions={recentAddresses}
          showAddressSuggestions={showAddressSuggestions}
          onClose={() => {
            setShowAddOrderModal(false);
            setEditingOrder(null);
            setNewOrder({
              date: new Date().toISOString().split('T')[0],
              deliveryAddress: '',
              quantity: 1,
              unitPrice: settings?.defaultUnitPrice || 100,
              total: settings?.defaultUnitPrice || 100,
              mode: 'Lunch',
              status: 'Pending',
              paymentMode: 'Online',
            });
          }}
          onSave={
            editingOrder
              ? async () => {
                  if (onEditOrder) {
                    await onEditOrder(editingOrder._id || editingOrder.orderId, editingOrder);
                    if (showNotification) showNotification('Order updated successfully', 'success');
                  }
                  setShowAddOrderModal(false);
                  setEditingOrder(null);
                  if (loadOrders) loadOrders();
                }
              : handleSaveOrder
          }
          onNewOrderChange={handleNewOrderChange}
          onEditingOrderChange={(field, value) => {
            setEditingOrder({ ...editingOrder, [field]: value });
          }}
          setAddressSuggestions={setAddressSuggestions}
          setShowAddressSuggestions={setShowAddressSuggestions}
        />
      )}
    </div>
  );
};

export default CurrentMonthOrdersTab;
