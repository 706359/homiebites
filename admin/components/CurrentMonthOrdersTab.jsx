import { useMemo, useState } from 'react';
import api from '../../web/lib/api.js';
import { getFilteredOrdersByDate } from '../utils/calculations.js';
import {
  formatCurrency,
  getLastUnitPriceForAddress,
  getTotalRevenue,
  extractBillingMonth,
  extractBillingYear,
  formatBillingMonth,
} from '../utils/orderUtils.js';

const CurrentMonthOrdersTab = ({
  orders = [],
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  onUpdateOrderStatus,
  currentPage = 1,
  recordsPerPage = 20,
  onPageChange,
  onRecordsPerPageChange,
  loading = false,
  loadOrders,
  showNotification,
}) => {
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [addressFilter, setAddressFilter] = useState('');
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  // Debug logging
  if (typeof window !== 'undefined' && window.location.search.includes('debug')) {
    console.log('CurrentMonthOrdersTab rendered', {
      ordersCount: Array.isArray(orders) ? orders.length : 'not array',
      currentPage,
      recordsPerPage,
    });
  }

  // Ensure orders is always an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Safe handler functions with fallbacks
  const safeOnAddOrder = onAddOrder || (() => console.warn('onAddOrder not provided'));
  const safeOnEditOrder = onEditOrder || (() => console.warn('onEditOrder not provided'));
  const safeOnDeleteOrder = onDeleteOrder || (() => console.warn('onDeleteOrder not provided'));
  const safeOnUpdateOrderStatus =
    onUpdateOrderStatus || (() => console.warn('onUpdateOrderStatus not provided'));
  const safeOnPageChange = onPageChange || (() => console.warn('onPageChange not provided'));
  const safeOnRecordsPerPageChange =
    onRecordsPerPageChange || (() => console.warn('onRecordsPerPageChange not provided'));

  // Filter to current month only - MUST BE DEFINED FIRST
  // Sort by date DESC (latest date on top, oldest at bottom)
  const filteredOrders = useMemo(() => {
    try {
      if (!safeOrders || safeOrders.length === 0) return [];
      let filtered = getFilteredOrdersByDate(safeOrders, 'month', '', '');

      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter((order) => {
          const status = (order.status || '').toLowerCase().trim();
          const filterStatus = statusFilter.toLowerCase().trim();
          if (filterStatus === 'paid') {
            return status === 'paid';
          } else if (filterStatus === 'unpaid') {
            return status === 'unpaid';
          } else {
            return status === filterStatus;
          }
        });
      }

      // Apply address filter
      if (addressFilter && addressFilter.trim() !== '') {
        const searchAddr = addressFilter.trim().toLowerCase();
        filtered = filtered.filter((order) => {
          const addr = (
            order.deliveryAddress ||
            order.customerAddress ||
            order.address ||
            order.delivery_address ||
            order.customer_address ||
            ''
          )
            .toString()
            .trim()
            .toLowerCase();
          return addr && addr.includes(searchAddr);
        });
      }

      // Sort by date descending (newest first, oldest last)
      return filtered.sort((a, b) => {
        // Helper function to parse date with support for DD-MMM-YY format
        const parseDate = (dateValue) => {
          if (!dateValue) return null;
          let date = new Date(dateValue);

          // If parsing fails, try parsing as DD-MMM-YY format (e.g., "31-Dec-25")
          if (isNaN(date.getTime()) && typeof dateValue === 'string') {
            const dateStr = dateValue.trim();
            const dateMatch = dateStr.match(/(\d{1,2})-([A-Za-z]{3})-(\d{2,4})/i);
            if (dateMatch) {
              const day = parseInt(dateMatch[1], 10);
              const monthNames = [
                'jan',
                'feb',
                'mar',
                'apr',
                'may',
                'jun',
                'jul',
                'aug',
                'sep',
                'oct',
                'nov',
                'dec',
              ];
              const month = monthNames.indexOf(dateMatch[2].toLowerCase());
              let year = parseInt(dateMatch[3], 10);
              // Handle 2-digit years: 25 -> 2025, 24 -> 2024
              if (year < 100) {
                year = year < 50 ? 2000 + year : 1900 + year;
              }
              if (month >= 0 && day > 0 && day <= 31 && year > 1900) {
                date = new Date(year, month, day);
              }
            }
          }
          return date;
        };

        const dateA = parseDate(
          a.order_date || a.createdAt || a.date || a.orderDate || a.created_at
        );
        const dateB = parseDate(
          b.order_date || b.createdAt || b.date || b.orderDate || b.created_at
        );

        // If dates are invalid, put them at the end
        if (!dateA || isNaN(dateA.getTime())) return 1;
        if (!dateB || isNaN(dateB.getTime())) return -1;

        // Sort descending (newest first = latest to oldest)
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Error filtering orders:', error);
      return [];
    }
  }, [safeOrders, statusFilter, addressFilter]);

  // Get unique addresses for filter dropdown
  const uniqueAddresses = useMemo(() => {
    const addresses = new Set();
    safeOrders.forEach((order) => {
      const addr = order.deliveryAddress || order.customerAddress || order.address;
      if (addr) addresses.add(addr);
    });
    return Array.from(addresses).sort();
  }, [safeOrders]);

  // Bulk update status for filtered orders
  const handleBulkUpdateStatus = async () => {
    if (!bulkUpdateStatus) {
      showNotification && showNotification('Please select a status to update', 'warning');
      return;
    }

    if (filteredOrders.length === 0) {
      showNotification && showNotification('No orders found to update', 'warning');
      return;
    }

    const confirmMessage = `Are you sure you want to update status to "${bulkUpdateStatus}" for ${filteredOrders.length} filtered order(s)?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('homiebites_token');
      if (!token) {
        showNotification && showNotification('Please login to update orders', 'error');
        setIsUpdating(false);
        return;
      }

      showNotification && showNotification(`Updating ${filteredOrders.length} orders...`, 'info');

      // Update each order via API
      const updatePromises = filteredOrders.map(async (order) => {
        try {
          const orderId = order._id || order.id;
          if (!orderId) return null;

          await api.updateOrder(orderId, {
            ...order,
            status: bulkUpdateStatus,
          });
          return orderId;
        } catch (err) {
          console.warn(`Failed to update order ${order.orderId}:`, err);
          return null;
        }
      });

      const results = await Promise.all(updatePromises);
      const successCount = results.filter((r) => r !== null).length;

      // Reload orders from backend
      if (loadOrders) {
        await loadOrders();
      }

      showNotification &&
        showNotification(
          `Successfully updated ${successCount} of ${filteredOrders.length} orders to "${bulkUpdateStatus}"!`,
          successCount === filteredOrders.length ? 'success' : 'warning'
        );

      // Reset bulk update status
      setBulkUpdateStatus('');
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      showNotification && showNotification('Error updating orders: ' + error.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / recordsPerPage));
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, recordsPerPage]);

  // Current month stats
  const monthStats = useMemo(() => {
    const totalQuantity = filteredOrders.reduce((sum, o) => {
      const qty = parseInt(o.quantity || 1);
      return sum + (isNaN(qty) ? 1 : qty);
    }, 0);
    const revenue = getTotalRevenue(filteredOrders);
    const pendingAmount = filteredOrders
      .filter((o) => {
        const status = (o.status || '').toLowerCase();
        return status === 'unpaid';
      })
      .reduce((sum, o) => {
        const total = parseFloat(o.total || o.totalAmount || 0);
        return sum + (isNaN(total) ? 0 : total);
      }, 0);
    const avgOrderValue =
      filteredOrders.length > 0 ? Math.round(revenue / filteredOrders.length) : 0;

    return {
      total: filteredOrders.length,
      quantity: totalQuantity,
      revenue: revenue,
      pendingAmount: pendingAmount,
      avgOrderValue: avgOrderValue,
    };
  }, [filteredOrders]);

  // Calculate unit price helper
  const getUnitPrice = (order) => {
    try {
      if (
        order.unitPrice !== undefined &&
        order.unitPrice !== null &&
        !isNaN(parseFloat(order.unitPrice)) &&
        parseFloat(order.unitPrice) > 0
      ) {
        return parseFloat(order.unitPrice);
      }
      const totalAmount = parseFloat(order.total || order.totalAmount || order.total_amount || 0);
      const quantity = parseInt(order.quantity || 1);
      if (!isNaN(totalAmount) && totalAmount > 0 && quantity > 0) {
        return totalAmount / quantity;
      }
      if (order.deliveryAddress) {
        const lastPrice = getLastUnitPriceForAddress(
          safeOrders,
          order.deliveryAddress || order.customerAddress || order.address
        );
        if (lastPrice && lastPrice > 0) return lastPrice;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  };

  // Format date helper
  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '-';
      const pad = (n) => n.toString().padStart(2, '0');
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
      return `${pad(date.getDate())}-${monthNames[date.getMonth()]}-${date.getFullYear()}`;
    } catch (e) {
      return '-';
    }
  };

  // Debug logging
  console.log('[CurrentMonthOrdersTab] Component rendering', {
    ordersLength: safeOrders.length,
    filteredLength: filteredOrders.length,
    currentPage,
    recordsPerPage,
    hasHandlers: {
      onAddOrder: !!onAddOrder,
      onEditOrder: !!onEditOrder,
      onDeleteOrder: !!onDeleteOrder,
    },
  });

  // Show loading state
  if (loading) {
    return (
      <div className='admin-content' data-testid='current-month-orders-tab'>
        <div className='orders-header'>
          <h2>Current Month Orders</h2>
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
          <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  // Ensure component always renders something
  try {
    return (
      <div className='admin-content' data-testid='current-month-orders-tab'>
        <div className='orders-header'>
          <h2>Current Month Orders</h2>
          <div className='orders-actions'>
            <button className='btn btn-primary' onClick={safeOnAddOrder}>
              <i className='fa-solid fa-plus'></i> Add Order
            </button>
          </div>
        </div>

        {/* Current Month Stats */}
        <div className='admin-stats'>
          <div className='stat-card'>
            <i className='fa-solid fa-shopping-cart'></i>
            <div>
              <h3>{monthStats.total}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-boxes'></i>
            <div>
              <h3>{monthStats.quantity}</h3>
              <p>Total Quantity</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-rupee-sign'></i>
            <div>
              <h3>₹{formatCurrency(monthStats.revenue)}</h3>
              <p>Revenue</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-clock'></i>
            <div>
              <h3>₹{formatCurrency(monthStats.pendingAmount)}</h3>
              <p>Pending Amount</p>
            </div>
          </div>
          <div className='stat-card'>
            <i className='fa-solid fa-chart-line'></i>
            <div>
              <h3>₹{formatCurrency(monthStats.avgOrderValue)}</h3>
              <p>Avg Order Value</p>
            </div>
          </div>
        </div>

        {/* Filters and Bulk Update Section */}
        <div
          style={{
            background: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--admin-accent)' }}>
              Filters & Bulk Update
            </h3>
            {filteredOrders.length > 0 && (
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  background: 'var(--admin-accent-light)',
                  color: 'var(--admin-accent)',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}
              >
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            {/* Status Filter */}
            <div className='form-group' style={{ margin: 0 }}>
              <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
                Filter by Status
              </label>
              <select
                className='custom-dropdown'
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  onPageChange && onPageChange(1); // Reset to first page
                }}
              >
                <option value='all'>All Status</option>
                <option value='paid'>Paid</option>
                <option value='unpaid'>Unpaid</option>
              </select>
            </div>

            {/* Address Filter */}
            <div className='form-group' style={{ margin: 0 }}>
              <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
                Filter by Address
              </label>
              <input
                type='text'
                value={addressFilter}
                onChange={(e) => {
                  setAddressFilter(e.target.value);
                  onPageChange && onPageChange(1); // Reset to first page
                }}
                placeholder='Search address...'
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '4px',
                  background: 'var(--admin-bg)',
                  color: 'var(--admin-text)',
                }}
              />
            </div>

            {/* Bulk Update Status */}
            <div className='form-group' style={{ margin: 0 }}>
              <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
                Bulk Update Status
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  className='custom-dropdown'
                  value={bulkUpdateStatus}
                  onChange={(e) => setBulkUpdateStatus(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value=''>Select Status...</option>
                  <option value='Paid'>Paid</option>
                  <option value='Unpaid'>Unpaid</option>
                </select>
                <button
                  className='btn btn-primary'
                  onClick={handleBulkUpdateStatus}
                  disabled={!bulkUpdateStatus || isUpdating || filteredOrders.length === 0}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {isUpdating ? (
                    <>
                      <i className='fa-solid fa-spinner fa-spin'></i> Updating...
                    </>
                  ) : (
                    <>
                      <i className='fa-solid fa-check-double'></i> Update All
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(statusFilter !== 'all' || addressFilter.trim() !== '') && (
            <button
              className='btn btn-ghost btn-small'
              onClick={() => {
                setStatusFilter('all');
                setAddressFilter('');
                onPageChange && onPageChange(1);
              }}
              style={{ fontSize: '0.85rem' }}
            >
              <i className='fa-solid fa-times'></i> Clear Filters
            </button>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > 0 && (
          <div className='pagination-controls'>
            <div className='pagination-info'>
              <label>Show:</label>
              <select
                value={recordsPerPage}
                onChange={(e) => safeOnRecordsPerPageChange(Number(e.target.value))}
                className='records-per-page-select'
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={200}>200</option>
              </select>
              <span>records per page</span>
            </div>
            <div className='pagination-info'>
              Showing {(currentPage - 1) * recordsPerPage + 1} to{' '}
              {Math.min(currentPage * recordsPerPage, filteredOrders.length)} of{' '}
              {filteredOrders.length} orders
            </div>
          </div>
        )}

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className='no-data' style={{ padding: '2rem' }}>
            <i
              className='fa-solid fa-inbox'
              style={{ fontSize: '3rem', color: 'var(--admin-text-light)', marginBottom: '1rem' }}
            ></i>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No orders found for the current month.
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--admin-text-light)',
                marginTop: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              Total orders in system: {safeOrders.length}
            </p>
            <button
              className='btn btn-primary'
              onClick={safeOnAddOrder}
              style={{ marginTop: '1rem' }}
            >
              <i className='fa-solid fa-plus'></i> Add New Order
            </button>
          </div>
        ) : (
          <div className='excel-sheet-content'>
            <div className='orders-table-container excel-table-container'>
              <table className='orders-table excel-data-table'>
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment Mode</th>
                    <th>Month/Year</th>
                    <th>Order ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, index) => {
                    if (!order) return null;
                    try {
                      const quantity = parseInt(order.quantity || 1);
                      const unitPrice = getUnitPrice(order);
                      const totalAmount = quantity * unitPrice;

                      const orderDate = order.createdAt || order.date || order.orderDate;
                      let dateStr = '-';
                      if (orderDate) {
                        try {
                          const date = new Date(orderDate);
                          if (!isNaN(date.getTime())) {
                            dateStr = date.toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            });
                          }
                        } catch (e) {
                          dateStr = String(orderDate).split('T')[0];
                        }
                      }

                      const orderId = order.orderId || order.order_id || order.id || 'N/A';
                      const billingMonth =
                        order.billingMonth ||
                        order.billing_month ||
                        (orderDate ? extractBillingMonth(new Date(orderDate)) : null);
                      const billingYear =
                        order.billingYear ||
                        order.billing_year ||
                        (orderDate ? extractBillingYear(new Date(orderDate)) : null);
                      const monthDisplay =
                        billingMonth && billingYear
                          ? formatBillingMonth(billingMonth, billingYear)
                          : '-';

                      // Determine row class based on order status
                      const statusValue = order.status || order.paymentStatus || '';
                      const orderStatus = String(statusValue).toLowerCase().trim();
                      const rowClassName = 
                        orderStatus === 'unpaid' || 
                        orderStatus === 'pending' || 
                        (orderStatus !== 'paid' && orderStatus !== 'delivered' && statusValue !== '')
                          ? 'row-unpaid' 
                          : orderStatus === 'paid' || orderStatus === 'delivered' 
                          ? 'row-paid' 
                          : '';

                      return (
                        <tr key={order.id || order.orderId || index} className={rowClassName}>
                          <td className='excel-row-number'>
                            {(currentPage - 1) * recordsPerPage + index + 1}
                          </td>
                          <td className='excel-date-cell'>{dateStr}</td>
                          <td className='excel-text-cell'>
                            {order.deliveryAddress || order.customerAddress || order.address || '-'}
                          </td>
                          <td className='excel-number-cell'>{quantity}</td>
                          <td className='excel-number-cell'>₹{formatCurrency(unitPrice)}</td>
                          <td className='excel-number-cell'>
                            <strong>₹{formatCurrency(totalAmount)}</strong>
                          </td>
                          <td className='order-status-cell'>
                            <div
                              style={{
                                display: 'flex',
                                gap: '0.5rem',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <button
                                className={`btn btn-small ${
                                  (order.status || order.paymentStatus || '').toLowerCase() === 'paid'
                                    ? 'btn-primary'
                                    : 'btn-ghost'
                                }`}
                                onClick={() => {
                                  if (safeOnUpdateOrderStatus) {
                                    safeOnUpdateOrderStatus(order.id || order._id, 'Paid');
                                  }
                                }}
                                style={{
                                  minWidth: '70px',
                                  fontSize: '0.85rem',
                                  padding: '0.5rem 0.75rem',
                                }}
                                title='Mark as Paid'
                              >
                                Paid
                              </button>
                              <button
                                className={`btn btn-small ${
                                  (order.status || order.paymentStatus || '').toLowerCase() === 'unpaid'
                                    ? 'btn-special danger'
                                    : 'btn-ghost'
                                }`}
                                onClick={() => {
                                  if (safeOnUpdateOrderStatus) {
                                    safeOnUpdateOrderStatus(order.id || order._id, 'Unpaid');
                                  }
                                }}
                                style={{
                                  minWidth: '70px',
                                  fontSize: '0.85rem',
                                  padding: '0.5rem 0.75rem',
                                }}
                                title='Mark as Unpaid'
                              >
                                Unpaid
                              </button>
                            </div>
                          </td>
                          <td className='excel-text-cell'>{order.paymentMode || order.payment_mode || '-'}</td>
                          <td className='excel-text-cell'>{monthDisplay}</td>
                          <td
                            className='excel-text-cell order-id-cell'
                            style={{
                              wordBreak: 'break-all',
                            }}
                            title={orderId}
                          >
                            {orderId}
                          </td>
                          <td className='order-actions-cell'>
                            <div className='order-actions-group'>
                              <button
                                className='action-icon-btn action-icon-edit'
                                onClick={() => safeOnEditOrder(order)}
                                title='Edit Order'
                              >
                                <i className='fa-solid fa-edit'></i>
                              </button>
                              <button
                                className='action-icon-btn action-icon-delete'
                                onClick={() => safeOnDeleteOrder(order.id)}
                                title='Delete Order'
                              >
                                <i className='fa-solid fa-trash'></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    } catch (rowError) {
                      console.warn(`Error rendering order row ${index}:`, rowError);
                      return null;
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Navigation */}
        {filteredOrders.length > 0 && totalPages > 1 && (
          <div className='pagination-navigation'>
            <button
              className='btn btn-ghost'
              onClick={() => safeOnPageChange(1)}
              disabled={currentPage === 1}
              title='First Page'
            >
              <i className='fa-solid fa-angle-double-left'></i>
            </button>
            <button
              className='btn btn-ghost'
              onClick={() => safeOnPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title='Previous Page'
            >
              <i className='fa-solid fa-angle-left'></i>
            </button>
            <div className='page-numbers'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-ghost ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => safeOnPageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return (
                    <span key={pageNum} className='page-ellipsis'>
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <button
              className='btn btn-ghost'
              onClick={() => safeOnPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title='Next Page'
            >
              <i className='fa-solid fa-angle-right'></i>
            </button>
            <button
              className='btn btn-ghost'
              onClick={() => safeOnPageChange(totalPages)}
              disabled={currentPage === totalPages}
              title='Last Page'
            >
              <i className='fa-solid fa-angle-double-right'></i>
            </button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering CurrentMonthOrdersTab:', error);
    return (
      <div className='admin-content'>
        <div className='orders-header'>
          <h2>Current Month Orders</h2>
          <div className='orders-actions'>
            <button className='btn btn-primary' onClick={safeOnAddOrder}>
              <i className='fa-solid fa-plus'></i> Add Order
            </button>
          </div>
        </div>
        <div className='no-data' style={{ padding: '2rem', textAlign: 'center' }}>
          <i
            className='fa-solid fa-exclamation-triangle'
            style={{ fontSize: '3rem', color: 'var(--admin-warning)', marginBottom: '1rem' }}
          ></i>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Error loading orders. Please refresh the page.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-light)', marginTop: '0.5rem' }}>
            {error.message || 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
};

export default CurrentMonthOrdersTab;
