import { useEffect, useMemo, useState } from 'react';
import EmptyState from './EmptyState.jsx';
import OrderModal from './OrderModal.jsx';
import PremiumLoader from './PremiumLoader.jsx';
import { getFilteredOrdersByDate } from './utils/calculations.js';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  formatCurrency,
  getTotalRevenue,
  isPaidStatus,
  isPendingStatus,
  sortOrdersByOrderId,
} from './utils/orderUtils.js';
import { usePreserveScroll } from './hooks/usePreserveScroll.js';

const CurrentMonthOrdersTab = ({
  orders = [],
  onAddOrder,
  onEditOrder,
  onUpdateOrder,
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
  const currentMonthName = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const [quickFilter, setQuickFilter] = useState('all');
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

  useEffect(() => {
    const handleKeyDown = (e) => {
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

  const currentMonthOrders = useMemo(() => {
    return getFilteredOrdersByDate(orders, 'month', '', '');
  }, [orders]);

  const currentMonthStats = useMemo(() => {
    const revenue = getTotalRevenue(currentMonthOrders);
    const total = currentMonthOrders.length;
    const pending = currentMonthOrders.filter((o) =>
      isPendingStatus(o.status, o.paymentStatus)
    );
    const pendingAmount = pending.reduce((sum, o) => {
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

      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthOrders = orders.filter((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        return (
          orderDate.getMonth() === lastMonth &&
          orderDate.getFullYear() === lastMonthYear
        );
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

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const filteredOrders = useMemo(() => {
    let filtered = [...currentMonthOrders];

    switch (quickFilter) {
      case 'today':
        filtered = filtered.filter((o) => {
          try {
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
            const orderDate = parseOrderDate(o.date || o.order_date || null);
            return orderDate >= thisWeekStart;
          } catch (e) {
            return false;
          }
        });
        break;
      case 'pending':
        filtered = filtered.filter((o) =>
          isPendingStatus(o.status, o.paymentStatus)
        );
        break;
      case 'paid':
        filtered = filtered.filter((o) =>
          isPaidStatus(o.status, o.paymentStatus)
        );
        break;
      default:
        break;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const address = (
          order.deliveryAddress ||
          order.customerAddress ||
          order.address ||
          ''
        ).toLowerCase();
        const orderId = (order.orderId || '').toLowerCase();
        return address.includes(query) || orderId.includes(query);
      });
    }

    return sortOrdersByOrderId(filtered);
  }, [
    currentMonthOrders,
    quickFilter,
    searchQuery,
    today,
    tomorrow,
    yesterday,
    thisWeekStart,
  ]);

  const quickFilterCounts = useMemo(() => {
    const todayOrders = currentMonthOrders.filter((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        return orderDate >= today && orderDate < tomorrow;
      } catch (e) {
        return false;
      }
    });

    const yesterdayOrders = currentMonthOrders.filter((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        return orderDate >= yesterday && orderDate < today;
      } catch (e) {
        return false;
      }
    });

    const thisWeekOrders = currentMonthOrders.filter((o) => {
      try {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        return orderDate >= thisWeekStart;
      } catch (e) {
        return false;
      }
    });

    const pendingOrders = currentMonthOrders.filter((o) =>
      isPendingStatus(o.status, o.paymentStatus)
    );
    const paidOrders = currentMonthOrders.filter((o) =>
      isPaidStatus(o.status, o.paymentStatus)
    );

    return {
      all: currentMonthOrders.length,
      today: todayOrders.length,
      yesterday: yesterdayOrders.length,
      thisWeek: thisWeekOrders.length,
      pending: pendingOrders.length,
      paid: paidOrders.length,
    };
  }, [currentMonthOrders, today, tomorrow, yesterday, thisWeekStart]);

  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // Preserve scroll position during auto-refresh to prevent flickering
  usePreserveScroll(orders.length, '.orders-table-container');

  const handleNewOrderChange = (field, value) => {
    const updated = { ...newOrder, [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      const qty =
        field === 'quantity'
          ? parseInt(value) || 1
          : parseInt(updated.quantity) || 1;
      const price =
        field === 'unitPrice'
          ? parseFloat(value) || 0
          : parseFloat(updated.unitPrice) || 0;
      updated.total = qty * price;
    }

    setNewOrder(updated);
  };

  const handleSaveOrder = async () => {
    try {
      if (onAddOrder) {
        await onAddOrder(newOrder);
        if (showNotification)
          showNotification('Order added successfully', 'success');
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

  const recentAddresses = useMemo(() => {
    const addresses = new Set();
    currentMonthOrders.forEach((o) => {
      const addr = o.deliveryAddress || o.customerAddress || o.address;
      if (addr) addresses.add(addr);
    });
    return Array.from(addresses).slice(0, 10);
  }, [currentMonthOrders]);

  const handleExport = () => {
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    let csvContent =
      'Order ID,Date,Delivery Address,Quantity,Unit Price (₹),Total Amount (₹),Mode,Status,Payment Mode\n';
    filteredOrders.forEach((o) => {
      const orderDate = parseOrderDate(o.date || o.order_date || null);
      const dateStr = orderDate ? formatDate(orderDate) : 'N/A';
      const orderId = o.orderId || o._id || 'N/A';
      const address =
        o.deliveryAddress || o.customerAddress || o.address || 'N/A';
      const quantity = o.quantity || 1;
      const unitPrice = parseFloat(o.unitPrice || 0).toFixed(2);
      const totalAmount = getOrderAmount(o).toFixed(2);
      const mode = o.mode || 'N/A';
      const status = o.status || 'N/A';
      const paymentMode = o.paymentMode || 'N/A';

      csvContent += `${escapeCSV(orderId)},${escapeCSV(dateStr)},${escapeCSV(
        address
      )},${escapeCSV(quantity)},${escapeCSV(unitPrice)},${escapeCSV(totalAmount)},${escapeCSV(
        mode
      )},${escapeCSV(status)},${escapeCSV(paymentMode)}\n`;
    });

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `current_month_orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    if (showNotification)
      showNotification('Current month orders exported successfully', 'success');
  };

  if (loading) {
    return (
      <div className="admin-content">
        <PremiumLoader message="Loading orders..." size="large" />
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="admin-stats">
        <div className="stat-card">
          <i className="fa-solid fa-coins"></i>
          <div>
            <h3>₹{formatCurrency(currentMonthStats.revenue)}</h3>
            <p>This Month Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-shopping-cart"></i>
          <div>
            <h3>{currentMonthStats.total}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-exclamation-triangle icon-color-warning"></i>
          <div>
            <h3>₹{formatCurrency(currentMonthStats.pendingAmount)}</h3>
            <p>Pending Payments</p>
            <p className="stat-card-subtitle">
              {currentMonthStats.pendingCount} orders
            </p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-chart-line icon-color-success"></i>
          <div>
            <h3>
              {currentMonthStats.growth === Infinity
                ? 'New'
                : `${currentMonthStats.growth >= 0 ? '+' : ''}${currentMonthStats.growth.toFixed(
                    1
                  )}%`}
            </h3>
            <p>
              vs Last Month{' '}
              {currentMonthStats.growth !== Infinity && (
                <span className="stat-card-arrow">
                  {currentMonthStats.growth >= 0 ? '↑' : '↓'}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-card dashboard-card-spaced">
        <div className="filter-bar-flex">
          <div className="flex flex-wrap gap-8">
            <button
              className={`btn ${quickFilter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-small`}
              onClick={() => {
                setQuickFilter('all');
                if (onPageChange) onPageChange(1);
              }}
            >
              All ({quickFilterCounts.all})
            </button>
            <button
              className={`btn ${quickFilter === 'today' ? 'btn-primary' : 'btn-ghost'} btn-small`}
              onClick={() => {
                setQuickFilter('today');
                if (onPageChange) onPageChange(1);
              }}
            >
              <i className="fa-solid fa-calendar-day mr-6"></i>
              Today ({quickFilterCounts.today})
            </button>
            <button
              className={`btn ${quickFilter === 'yesterday' ? 'btn-primary' : 'btn-ghost'} btn-small`}
              onClick={() => {
                setQuickFilter('yesterday');
                if (onPageChange) onPageChange(1);
              }}
            >
              <i className="fa-solid fa-calendar mr-6"></i>
              Yesterday ({quickFilterCounts.yesterday})
            </button>
            <button
              className={`btn ${quickFilter === 'thisWeek' ? 'btn-primary' : 'btn-ghost'} btn-small`}
              onClick={() => {
                setQuickFilter('thisWeek');
                if (onPageChange) onPageChange(1);
              }}
            >
              <i className="fa-solid fa-calendar-week mr-6"></i>
              This Week ({quickFilterCounts.thisWeek})
            </button>
          </div>

          <div className="flex flex-wrap gap-8">
            <button
              className={`btn ${quickFilter === 'pending' ? 'btn-primary' : 'btn-ghost'} btn-small`}
              onClick={() => {
                setQuickFilter('pending');
                if (onPageChange) onPageChange(1);
              }}
            >
              <i className="fa-solid fa-exclamation-triangle mr-6"></i>
              Pending ({quickFilterCounts.pending})
            </button>
            <button
              className={`btn ${quickFilter === 'paid' ? 'btn-primary' : 'btn-ghost'} btn-small`}
              onClick={() => {
                setQuickFilter('paid');
                if (onPageChange) onPageChange(1);
              }}
            >
              <i className="fa-solid fa-check-circle mr-6"></i>
              Paid ({quickFilterCounts.paid})
            </button>
          </div>

          <div>
            <input
              type="text"
              className="input-field search-input-with-icon"
              placeholder="Search by address, order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-16">
          <div className="text-secondary text-base">
            Showing {startIndex + 1}-
            {Math.min(startIndex + recordsPerPage, filteredOrders.length)} of{' '}
            {filteredOrders.length} orders
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            icon="fa-inbox"
            title="No orders found"
            message="Try adjusting your filters or add a new order"
            addOrderLabel="Add New Order"
            onAddOrder={() => setShowAddOrderModal(true)}
          />
        ) : (
          <>
            <div className="orders-table-container">
              <table className="orders-table">
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
                      order.date || order.order_date || null
                    );
                    const dateStr = formatDate(orderDate);
                    const isPaid = isPaidStatus(
                      order.status,
                      order.paymentStatus
                    );

                    // Use stable key to prevent remounting and flickering
                    const orderKey = order._id || order.orderId || `order-${idx}`;
                    
                    return (
                      <tr
                        key={orderKey}
                        onDoubleClick={() => {
                          setEditingOrder(order);
                          setShowAddOrderModal(true);
                        }}
                        className="cursor-pointer"
                      >
                        <td>{startIndex + idx + 1}</td>
                        <td>{dateStr}</td>
                        <td>
                          {order.deliveryAddress ||
                            order.customerAddress ||
                            order.address ||
                            'N/A'}
                        </td>
                        <td>{order.quantity || 1}</td>
                        <td>₹{formatCurrency(order.unitPrice || 0)}</td>
                        <td>
                          ₹
                          {formatCurrency(
                            order.total || order.totalAmount || 0
                          )}
                        </td>
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
                                onUpdateOrderStatus(
                                  order._id || order.orderId,
                                  e.target.value
                                );
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                          </select>
                        </td>
                        <td>{order.paymentMode || 'N/A'}</td>
                        <td className="monospace-text">
                          {order.orderId || 'N/A'}
                        </td>
                        <td>
                          <div className="flex gap-8">
                            <button
                              className="btn btn-ghost btn-icon action-icon-edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingOrder(order);
                                setShowAddOrderModal(true);
                              }}
                              title="Edit"
                            >
                              <i className="fa-solid fa-pencil"></i>
                            </button>
                            <button
                              className="btn btn-ghost btn-icon action-icon-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onDeleteOrder)
                                  onDeleteOrder(order._id || order.orderId);
                              }}
                              title="Delete"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pagination-controls">
              <div>
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fa-solid fa-chevron-left"></i> Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className="btn btn-ghost btn-small"
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
              <div className="pagination-container">
                <span>Show:</span>
                <select
                  className="pagination-select"
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
              ? async (orderId, cleanOrderData) => {
                  if (onUpdateOrder) {
                    try {
                      await onUpdateOrder(orderId, cleanOrderData, true);
                      setShowAddOrderModal(false);
                      setEditingOrder(null);
                      if (loadOrders) loadOrders();
                    } catch (error) {
                      console.error('Error updating order:', error);
                    }
                  }
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
