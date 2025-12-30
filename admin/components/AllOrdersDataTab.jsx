import { useMemo, useState, useEffect } from 'react';
import api from '../../web/lib/api.js';
import {
  extractBillingMonth,
  extractBillingYear,
  formatBillingMonth,
  formatCurrency,
} from '../utils/orderUtils.js';

// Optimized date parsing helper with caching
const parseOrderDate = (() => {
  const cache = new Map();
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

  return (dateValue) => {
    if (!dateValue) return null;

    // Check cache first
    if (cache.has(dateValue)) {
      return cache.get(dateValue);
    }

    let date = new Date(dateValue);

    // If parsing fails, try parsing as DD-MMM-YY format (e.g., "31-Dec-25")
    if (isNaN(date.getTime()) && typeof dateValue === 'string') {
      const dateStr = dateValue.trim();
      const dateMatch = dateStr.match(/(\d{1,2})-([A-Za-z]{3})-(\d{2,4})/i);
      if (dateMatch) {
        const day = parseInt(dateMatch[1], 10);
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

    const result = isNaN(date.getTime()) ? null : date;
    // Cache result (limit cache size to prevent memory issues)
    if (cache.size > 10000) {
      cache.clear();
    }
    cache.set(dateValue, result);
    return result;
  };
})();

const AllOrdersDataTab = ({
  orders,
  settings,
  excelFileName,
  allOrdersFilterMonth,
  setAllOrdersFilterMonth,
  allOrdersFilterAddress,
  setAllOrdersFilterAddress,
  allOrdersFilterPaymentStatus,
  setAllOrdersFilterPaymentStatus,
  onLoadExcelFile,
  onClearExcelData,
  onClearAllData,
  onEditOrder,
  onDeleteOrder,
  onUpdateOrderStatus,
  showNotification,
  loading = false,
  currentPage = 1,
  recordsPerPage = 50, // Default to 50 for better visibility
  onPageChange,
  onRecordsPerPageChange,
  loadOrders,
}) => {
  // Bulk update state
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtered orders for All Orders Data tab - OPTIMIZED
  // Sort by date DESC (latest date on top, oldest at bottom)
  const allOrdersFiltered = useMemo(() => {
    try {
      // Ensure orders is an array
      const safeOrders = Array.isArray(orders) ? orders : [];
      if (safeOrders.length === 0) {
        console.log('[AllOrdersDataTab] No orders to filter');
        return [];
      }

      // Debug: Log filter values
      console.log('[AllOrdersDataTab] Filtering orders:', {
        month: allOrdersFilterMonth || '(none)',
        address: allOrdersFilterAddress || '(none)',
        status: allOrdersFilterPaymentStatus || '(none)',
        totalOrders: safeOrders.length,
        addressFilterActive: !!(allOrdersFilterAddress && allOrdersFilterAddress.trim()),
      });

      // Fast filtering with early returns
      const filtered = safeOrders.filter((order) => {
        if (!order) return false;

        // Payment status filter first (fastest check)
        if (allOrdersFilterPaymentStatus && allOrdersFilterPaymentStatus.trim() !== '') {
          const status = (order.status || '').toLowerCase().trim();
          const filterStatus = allOrdersFilterPaymentStatus.toLowerCase().trim();
          if (filterStatus === 'paid') {
            if (status !== 'paid' && status !== 'delivered') return false;
          } else if (filterStatus === 'pending') {
            if (status === 'paid' || status === 'delivered') return false;
          } else if (filterStatus === 'unpaid') {
            if (status === 'paid' || status === 'delivered') return false;
          } else {
            if (status !== filterStatus) return false;
          }
        }

        // Address filter (fast string check)
        if (allOrdersFilterAddress && allOrdersFilterAddress.trim() !== '') {
          const searchAddr = allOrdersFilterAddress.trim().toLowerCase();
          // Try multiple possible address field names
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

          // If address is empty or doesn't include search term, exclude this order
          if (!addr || !addr.includes(searchAddr)) {
            return false;
          }
        }

        // Month filter (slower, so do it last)
        if (allOrdersFilterMonth && allOrdersFilterMonth.trim() !== '') {
          const orderDateValue =
            order.order_date ||
            order.createdAt ||
            order.date ||
            order.orderDate ||
            order.created_at;
          if (!orderDateValue) return false;

          const d = parseOrderDate(orderDateValue);
          if (!d || isNaN(d.getTime())) return false;

          const month = d.getMonth() + 1;
          const year = d.getFullYear();
          const orderMonthKey = `${year}-${String(month).padStart(2, '0')}`;
          if (orderMonthKey !== allOrdersFilterMonth.trim()) return false;
        }

        return true;
      });

      // Sort by date descending (newest first, oldest last)
      // Pre-parse dates for sorting to avoid repeated parsing
      const ordersWithDates = filtered.map((order) => {
        const dateValue =
          order.order_date || order.createdAt || order.date || order.orderDate || order.created_at;
        return {
          order,
          date: parseOrderDate(dateValue),
        };
      });

      const sorted = ordersWithDates.sort((a, b) => {
        // If dates are invalid, put them at the end
        if (!a.date || isNaN(a.date.getTime())) return 1;
        if (!b.date || isNaN(b.date.getTime())) return -1;
        // Sort descending (newest first = latest to oldest)
        return b.date.getTime() - a.date.getTime();
      });

      const result = sorted.map((item) => item.order);

      // Debug: Log filtered results count
      console.log('[AllOrdersDataTab] Filtered results:', {
        totalOrders: safeOrders.length,
        filteredCount: result.length,
        difference: safeOrders.length - result.length,
        activeFilters: {
          month: allOrdersFilterMonth || 'none',
          address: allOrdersFilterAddress || 'none',
          status: allOrdersFilterPaymentStatus || 'none',
        },
      });

      return result;
    } catch (error) {
      console.error('Error filtering/sorting orders:', error);
      return orders; // Return all orders on error
    }
  }, [orders, allOrdersFilterMonth, allOrdersFilterAddress, allOrdersFilterPaymentStatus]);

  // Pagination - CRITICAL for performance with large datasets
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(allOrdersFiltered.length / recordsPerPage));
  }, [allOrdersFiltered.length, recordsPerPage]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return allOrdersFiltered.slice(startIndex, endIndex);
  }, [allOrdersFiltered, currentPage, recordsPerPage]);

  // Maintain current page when filters change - only adjust if out of bounds
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages && onPageChange) {
      // Current page is out of bounds, go to last valid page
      onPageChange(totalPages);
    }
    // If currentPage is valid (within bounds), we keep it - no change needed
  }, [totalPages, currentPage, onPageChange]); // Adjust page only if out of bounds after filter changes

  // Get unique months for filter dropdown - FIXED: Use Map to prevent duplicates
  const allOrdersUniqueMonths = useMemo(() => {
    const monthsMap = new Map(); // Use Map with monthKey as key to prevent duplicates
    orders.forEach((o) => {
      // Try multiple date fields
      const orderDate = o.order_date || o.createdAt || o.date || o.orderDate || o.created_at;
      if (orderDate) {
        try {
          const d = parseOrderDate(orderDate);
          if (d && !isNaN(d.getTime())) {
            const month = d.getMonth() + 1;
            const year = d.getFullYear();
            const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

            // Only add if not already in map (prevents duplicates)
            if (!monthsMap.has(monthKey)) {
              const monthDisplay = formatBillingMonth(month, year);
              monthsMap.set(monthKey, { value: monthKey, label: monthDisplay, month, year });
            }
          }
        } catch (e) {
          // Silently skip invalid dates
        }
      }
    });

    // Convert Map values to array and sort (most recent first)
    return Array.from(monthsMap.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [orders]);

  // Get month lock status
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

  const lockStatus = getMonthLockStatus();

  // Bulk update status for filtered orders (defined after allOrdersFiltered)
  const handleBulkUpdateStatus = async () => {
    if (!bulkUpdateStatus) {
      showNotification && showNotification('Please select a status to update', 'warning');
      return;
    }

    if (allOrdersFiltered.length === 0) {
      showNotification && showNotification('No orders found to update', 'warning');
      return;
    }

    const confirmMessage = `Are you sure you want to update status to "${bulkUpdateStatus}" for ${allOrdersFiltered.length} filtered order(s)?`;
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

      // Show notification with longer duration for bulk operations
      showNotification &&
        showNotification(
          `🔄 Updating ${allOrdersFiltered.length} orders... This may take a moment.`,
          'info',
          15000
        );

      // Update each order via API with progress tracking for large batches
      let completedCount = 0;
      const totalCount = allOrdersFiltered.length;
      const progressMilestones = [0.25, 0.5, 0.75]; // Show progress at 25%, 50%, 75%
      let nextMilestoneIndex = 0;

      const updatePromises = allOrdersFiltered.map(async (order, index) => {
        try {
          const orderId = order._id || order.id;
          if (!orderId) return null;

          await api.updateOrder(orderId, {
            ...order,
            status: bulkUpdateStatus,
          });

          completedCount++;
          // Show progress milestones for large batches (only at 25%, 50%, 75%)
          if (
            totalCount > 500 &&
            nextMilestoneIndex < progressMilestones.length &&
            completedCount >= Math.floor(totalCount * progressMilestones[nextMilestoneIndex]) &&
            showNotification
          ) {
            const percentage = Math.floor((completedCount / totalCount) * 100);
            showNotification(
              `🔄 Progress: ${percentage}% (${completedCount}/${totalCount} orders)`,
              'info',
              4000
            );
            nextMilestoneIndex++;
          }

          return orderId;
        } catch (err) {
          console.warn(`Failed to update order ${order.orderId}:`, err);
          completedCount++;
          return null;
        }
      });

      const results = await Promise.all(updatePromises);
      const successful = results.filter((id) => id !== null).length;
      const failed = results.length - successful;

      if (successful > 0) {
        // Show success notification with longer duration
        showNotification &&
          showNotification(
            `✅ Successfully updated ${successful} order(s)${failed > 0 ? `. ${failed} failed.` : ''}`,
            'success',
            10000
          );

        // Reset bulk update status
        setBulkUpdateStatus('');

        // Wait a bit to ensure notification is visible before reloading
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Reload orders to reflect changes
        if (loadOrders) {
          await loadOrders();
        }
      } else {
        showNotification &&
          showNotification(
            '❌ Failed to update orders. Please try again.',
            'error',
            8000
          );
      }
    } catch (error) {
      console.error('Bulk update error:', error);
      showNotification &&
        showNotification(
          '❌ Error updating orders: ' + (error.message || 'Unknown error'),
          'error',
          8000
        );
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state
  // Ensure loading is defined (fallback to false if undefined)
  const isLoading = loading !== undefined ? loading : false;
  if (isLoading) {
    return (
      <div className='admin-content'>
        <div className='orders-header'>
          <div>
            <h2>All Orders Data (Master Table)</h2>
          </div>
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

  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <div>
          <h2>All Orders Data (Master Table)</h2>
          {/* Month Lock Status Indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              background:
                lockStatus.status === 'LOCKED'
                  ? 'var(--admin-warning-light)'
                  : 'var(--admin-success-light)',
              border: `2px solid ${
                lockStatus.status === 'LOCKED' ? 'var(--admin-warning)' : 'var(--admin-success)'
              }`,
              fontSize: '0.9rem',
              fontWeight: '600',
              color:
                lockStatus.status === 'LOCKED' ? 'var(--admin-warning)' : 'var(--admin-success)',
            }}
          >
            {lockStatus.status === 'LOCKED' ? '🔒' : '🟢'} Month Editable:
            {lockStatus.status === 'OPEN' ? ' YES' : ` NO (Locked till ${lockStatus.lockedTill})`}
          </div>
        </div>
        <div className='orders-actions'>
          {excelFileName && (
            <span
              className='excel-file-badge'
              style={{ marginRight: '1rem', color: 'var(--admin-text-light)' }}
            >
              <i className='fa-solid fa-file-excel'></i> {excelFileName} ({orders.length} orders)
            </span>
          )}
          <label className='btn btn-primary'>
            <i className='fa-solid fa-upload'></i> {excelFileName ? 'Reload' : 'Load'} Excel File
            <input
              type='file'
              accept='.xlsx,.xls'
              onChange={onLoadExcelFile}
              style={{ display: 'none' }}
            />
          </label>
          {excelFileName && (
            <button className='btn btn-ghost' onClick={onClearExcelData} title='Clear Excel Data'>
              <i className='fa-solid fa-trash'></i> Clear
            </button>
          )}
          {orders.length > 0 && onClearAllData && (
            <button
              className='btn btn-special danger'
              onClick={async () => {
                if (
                  window.confirm(
                    `⚠️ WARNING: This will permanently delete ALL ${orders.length} orders from the backend.\n\nThis action cannot be undone. Are you absolutely sure?`
                  )
                ) {
                  await onClearAllData();
                }
              }}
              title='Clear All Orders Data (Permanent)'
            >
              <i className='fa-solid fa-trash-alt'></i> Clear All Data
            </button>
          )}
        </div>
      </div>

      {orders && Array.isArray(orders) && orders.length > 0 ? (
        <div className='excel-viewer-container'>
          <div className='excel-file-info'>
            <h3>
              <i className='fa-solid fa-list'></i> All Orders Data ({orders.length} total orders
              {allOrdersFiltered.length !== orders.length
                ? `, ${allOrdersFiltered.length} matching filters`
                : ''}
              {paginatedOrders.length < allOrdersFiltered.length
                ? ` - showing ${(currentPage - 1) * recordsPerPage + 1}-${Math.min(currentPage * recordsPerPage, allOrdersFiltered.length)}`
                : ''}
              )
            </h3>
            {/* Filter status indicator */}
            {(allOrdersFilterMonth || allOrdersFilterAddress || allOrdersFilterPaymentStatus) && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--admin-accent)',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <span>Active filters:</span>
                {allOrdersFilterMonth && (
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'var(--admin-accent-light)',
                      borderRadius: '4px',
                    }}
                  >
                    Month:{' '}
                    {allOrdersUniqueMonths.find((m) => m.value === allOrdersFilterMonth)?.label ||
                      allOrdersFilterMonth}
                  </span>
                )}
                {allOrdersFilterAddress && (
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'var(--admin-accent-light)',
                      borderRadius: '4px',
                    }}
                  >
                    Address: {allOrdersFilterAddress}
                  </span>
                )}
                {allOrdersFilterPaymentStatus && (
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'var(--admin-accent-light)',
                      borderRadius: '4px',
                    }}
                  >
                    Status: {allOrdersFilterPaymentStatus}
                  </span>
                )}
              </div>
            )}
            {excelFileName && (
              <span>
                Source: <strong>{excelFileName}</strong>
              </span>
            )}
          </div>

          {/* Filters */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              background: 'var(--admin-bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--admin-border)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Filter by Month
              </label>
              <select
                className='custom-dropdown'
                value={allOrdersFilterMonth}
                onChange={(e) => {
                  setAllOrdersFilterMonth(e.target.value);
                  // Page will be maintained automatically by useEffect if still valid
                }}
              >
                <option value=''>All Months</option>
                {allOrdersUniqueMonths.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Filter by Address
              </label>
              <input
                type='text'
                value={allOrdersFilterAddress}
                onChange={(e) => {
                  setAllOrdersFilterAddress(e.target.value);
                  // Page will be maintained automatically by useEffect if still valid
                }}
                placeholder='Search address...'
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '4px',
                  background: 'var(--admin-bg)',
                }}
              />
            </div>
            <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Filter by Payment Status
              </label>
              <select
                className='custom-dropdown'
                value={allOrdersFilterPaymentStatus}
                onChange={(e) => {
                  setAllOrdersFilterPaymentStatus(e.target.value);
                  // Page will be maintained automatically by useEffect if still valid
                }}
              >
                <option value=''>All Statuses</option>
                <option value='paid'>Paid</option>
                <option value='unpaid'>Unpaid</option>
              </select>
            </div>
            {/* Bulk Update Status */}
            <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Bulk Update Status
                {allOrdersFiltered.length > 0 && (
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      background: 'var(--admin-accent-light)',
                      color: 'var(--admin-accent)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {allOrdersFiltered.length} order{allOrdersFiltered.length !== 1 ? 's' : ''}
                  </span>
                )}
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
                  disabled={!bulkUpdateStatus || isUpdating || allOrdersFiltered.length === 0}
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
          {(allOrdersFilterMonth || allOrdersFilterAddress || allOrdersFilterPaymentStatus) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  flex: '0 0 auto',
                }}
              >
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => {
                    setAllOrdersFilterMonth('');
                    setAllOrdersFilterAddress('');
                    setAllOrdersFilterPaymentStatus('');
                    // Page will be maintained automatically by useEffect if still valid
                  }}
                >
                  <i className='fa-solid fa-times'></i> Clear Filters
                </button>
              </div>
            )}

          {/* Pagination Controls - CRITICAL for performance */}
          {allOrdersFiltered.length > 0 && (
            <div className='pagination-controls' style={{ marginBottom: '1rem' }}>
              <div className='pagination-info'>
                <label>Show:</label>
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    const newPerPage = Number(e.target.value);
                    if (onRecordsPerPageChange) onRecordsPerPageChange(newPerPage);
                    // Page will be maintained automatically by useEffect if still valid
                  }}
                  className='records-per-page-select'
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
                <span>records per page</span>
              </div>
              <div className='pagination-info'>
                Showing {(currentPage - 1) * recordsPerPage + 1} to{' '}
                {Math.min(currentPage * recordsPerPage, allOrdersFiltered.length)} of{' '}
                {allOrdersFiltered.length} orders
              </div>
            </div>
          )}

          {/* Orders Data Table - READ-ONLY */}
          <div className='excel-sheet-content'>
            <div className='excel-sheet-header'>
              <div>
                <h4>
                  <strong>Master Orders Table (READ-ONLY)</strong>
                </h4>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--admin-text-light)',
                    display: 'block',
                    marginTop: '0.25rem',
                  }}
                >
                  Editing master data affects all reports. Use Actions column to modify orders.
                </span>
              </div>
            </div>

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
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, idx) => {
                    try {
                      const orderDate = order.createdAt || order.date;
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

                      // Get Order ID - never generate in frontend (backend generates IDs)
                      // If no ID exists, order hasn't been synced to backend yet
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
                      const notes = order.notes || order.Notes || '-';
                      const createdAt = order.createdAt || order.created_at || order.created || '-';
                      const updatedAt =
                        order.updatedAt || order.updated_at || order.updated || createdAt;

                      let unitPrice = 0;
                      try {
                        if (
                          order.unitPrice !== undefined &&
                          order.unitPrice !== null &&
                          !isNaN(parseFloat(order.unitPrice)) &&
                          parseFloat(order.unitPrice) > 0
                        ) {
                          unitPrice = parseFloat(order.unitPrice);
                        } else if (
                          order.unit_price !== undefined &&
                          order.unit_price !== null &&
                          !isNaN(parseFloat(order.unit_price)) &&
                          parseFloat(order.unit_price) > 0
                        ) {
                          unitPrice = parseFloat(order.unit_price);
                        } else if (
                          order.price !== undefined &&
                          order.price !== null &&
                          !isNaN(parseFloat(order.price)) &&
                          parseFloat(order.price) > 0
                        ) {
                          unitPrice = parseFloat(order.price);
                        } else {
                          const quantity = parseInt(order.quantity || 1);
                          const totalAmount = parseFloat(
                            order.total || order.totalAmount || order.total_amount || 0
                          );
                          if (!isNaN(totalAmount) && totalAmount > 0 && quantity > 0) {
                            unitPrice = totalAmount / quantity;
                          }
                        }
                      } catch (e) {
                        console.warn('Error calculating unit price:', e);
                      }

                      // Check if order's month is locked
                      const isMonthLocked = (() => {
                        if (!settings || !settings.monthLockedTill) return false;
                        try {
                          const lockedDate = new Date(settings.monthLockedTill);
                          const orderDateObj = orderDate ? new Date(orderDate) : null;
                          if (!orderDateObj || isNaN(orderDateObj.getTime())) return false;
                          return orderDateObj <= lockedDate;
                        } catch (e) {
                          return false;
                        }
                      })();

                      // Calculate actual row number (accounting for pagination)
                      const actualRowNumber = (currentPage - 1) * recordsPerPage + idx + 1;

                      // Determine row class based on order status
                      // Check both status and paymentStatus fields, handle various formats
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
                        <tr key={order.id || order.orderId || idx} className={rowClassName}>
                          <td className='excel-row-number'>{actualRowNumber}</td>
                          <td className='excel-date-cell'>{dateStr}</td>
                          <td className='excel-text-cell'>
                            {order.deliveryAddress || order.customerAddress || order.address || '-'}
                          </td>
                          <td className='excel-number-cell'>{order.quantity || 1}</td>
                          <td className='excel-number-cell'>₹{formatCurrency(unitPrice)}</td>
                          <td className='excel-number-cell'>
                            <strong>
                              ₹
                              {formatCurrency(
                                order.total || order.totalAmount || order.total_amount || 0
                              )}
                            </strong>
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
                                  if (onUpdateOrderStatus && !isMonthLocked) {
                                    onUpdateOrderStatus(order.id || order.orderId || order._id, 'Paid');
                                  }
                                }}
                                disabled={isMonthLocked}
                                style={{
                                  minWidth: '70px',
                                  fontSize: '0.85rem',
                                  padding: '0.5rem 0.75rem',
                                }}
                                title={isMonthLocked ? 'Cannot change status: Month is locked' : 'Mark as Paid'}
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
                                  if (onUpdateOrderStatus && !isMonthLocked) {
                                    onUpdateOrderStatus(order.id || order.orderId || order._id, 'Unpaid');
                                  }
                                }}
                                disabled={isMonthLocked}
                                style={{
                                  minWidth: '70px',
                                  fontSize: '0.85rem',
                                  padding: '0.5rem 0.75rem',
                                }}
                                title={isMonthLocked ? 'Cannot change status: Month is locked' : 'Mark as Unpaid'}
                              >
                                Unpaid
                              </button>
                            </div>
                          </td>
                          <td className='excel-text-cell'>
                            {order.paymentMode || order.payment_mode || '-'}
                          </td>
                          <td className='excel-text-cell'>{monthDisplay || '-'}</td>
                          <td
                            className='excel-text-cell order-id-cell'
                            style={{
                              wordBreak: 'break-all',
                            }}
                            title={orderId}
                          >
                            {orderId || '-'}
                          </td>
                          <td className='excel-date-cell'>
                            {updatedAt !== '-'
                              ? (() => {
                                  try {
                                    const d = new Date(updatedAt);
                                    return !isNaN(d.getTime())
                                      ? d.toLocaleDateString('en-IN')
                                      : updatedAt;
                                  } catch (e) {
                                    return updatedAt;
                                  }
                                })()
                              : '-'}
                          </td>
                          <td className='order-actions-cell'>
                            <div className='order-actions-group'>
                              <button
                                className='btn'
                                onClick={() => {
                                  if (isMonthLocked) {
                                    showNotification(
                                      'Cannot edit orders from a locked month',
                                      'warning'
                                    );
                                    return;
                                  }
                                  onEditOrder(order);
                                }}
                                title={
                                  isMonthLocked
                                    ? 'Cannot edit: Month is locked'
                                    : 'Edit Order (affects all reports)'
                                }
                                disabled={isMonthLocked}
                              >
                                <i className='fa-solid fa-edit'></i>
                              </button>
                              <button
                                className='btn'
                                onClick={() => {
                                  if (isMonthLocked) {
                                    showNotification(
                                      'Cannot delete orders from a locked month',
                                      'warning'
                                    );
                                    return;
                                  }
                                  if (
                                    window.confirm(
                                      `Delete order ${orderId}?\n\n⚠️ Warning: This will affect all reports including Dashboard, Summary, and Analytics.`
                                    )
                                  ) {
                                    onDeleteOrder(order.id || order._id || orderId);
                                  }
                                }}
                                title={
                                  isMonthLocked
                                    ? 'Cannot delete: Month is locked'
                                    : 'Delete Order (affects all reports)'
                                }
                                disabled={isMonthLocked}
                              >
                                <i className='fa-solid fa-trash'></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    } catch (rowError) {
                      console.warn(`Error rendering order row ${idx}:`, rowError);
                      return null;
                    }
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Navigation */}
            {allOrdersFiltered.length > recordsPerPage && totalPages > 1 && (
              <div className='pagination-navigation' style={{ marginTop: '1.5rem' }}>
                <button
                  className='btn btn-ghost'
                  onClick={() => onPageChange && onPageChange(1)}
                  disabled={currentPage === 1}
                  title='First Page'
                >
                  <i className='fa-solid fa-angle-double-left'></i>
                </button>
                <button
                  className='btn btn-ghost'
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
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
                          onClick={() => onPageChange && onPageChange(pageNum)}
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
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title='Next Page'
                >
                  <i className='fa-solid fa-angle-right'></i>
                </button>
                <button
                  className='btn btn-ghost'
                  onClick={() => onPageChange && onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  title='Last Page'
                >
                  <i className='fa-solid fa-angle-double-right'></i>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='excel-viewer-empty'>
          <div className='empty-state'>
            <i
              className='fa-solid fa-file-excel'
              style={{
                fontSize: '4rem',
                color: 'var(--admin-accent)',
                marginBottom: '1rem',
              }}
            ></i>
            <h3>No Orders Data Available</h3>
            <p>
              {excelFileName ? (
                'No orders found in Excel file. Please upload a valid Excel file with orders data.'
              ) : orders && orders.length === 0 ? (
                <>
                  <strong>No orders found in backend.</strong>
                  <br />
                  <br />
                  <strong>Troubleshooting:</strong>
                  <br />
                  1. Ensure the backend server is running: <code>cd backend && node server.js</code>
                  <br />
                  2. Make sure you're logged in with a valid token (try logging in via the API login
                  page)
                  <br />
                  3. Check the browser console for API errors
                  <br />
                  <br />
                  You can also add orders manually or upload an Excel file (.xlsx or .xls) to import
                  orders in bulk.
                </>
              ) : (
                'Loading orders from backend...'
              )}
            </p>
            {!excelFileName && (
              <label className='btn btn-primary' style={{ marginTop: 'var(--admin-margin-base)', display: 'inline-block' }}>
                <i className='fa-solid fa-upload'></i> Upload Excel File (Optional)
                <input
                  type='file'
                  accept='.xlsx,.xls'
                  onChange={onLoadExcelFile}
                  style={{ display: 'none' }}
                />
              </label>
            )}
            {excelFileName && (
              <label className='btn btn-primary' style={{ marginTop: 'var(--admin-margin-base)', display: 'inline-block' }}>
                <i className='fa-solid fa-upload'></i> Choose Excel File
                <input
                  type='file'
                  accept='.xlsx,.xls'
                  onChange={onLoadExcelFile}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrdersDataTab;
