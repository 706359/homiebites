// Tab 2: All Orders Data - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useMemo, useState } from 'react';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  formatBillingMonth,
  formatCurrency,
  isPaidStatus,
  isPendingStatus,
} from './utils/orderUtils.js';
import PremiumLoader from './PremiumLoader.jsx';

const AllOrdersDataTab = ({
  orders = [],
  settings: _settings,
  excelFileName: _excelFileName,
  allOrdersFilterMonth,
  setAllOrdersFilterMonth,
  allOrdersFilterAddress,
  setAllOrdersFilterAddress,
  allOrdersFilterPaymentStatus,
  setAllOrdersFilterPaymentStatus,
  onLoadExcelFile,
  onClearExcelData: _onClearExcelData,
  onClearAllData,
  onEditOrder,
  onDeleteOrder,
  onUpdateOrderStatus,
  showNotification,
  loading = false,
  currentPage = 1,
  recordsPerPage = 25,
  onPageChange,
  onRecordsPerPageChange,
  loadOrders,
  showConfirmation,
}) => {
  // State for filters panel - collapsed by default
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [dateRangeFrom, setDateRangeFrom] = useState('');
  const [dateRangeTo, setDateRangeTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selection state
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Sorting state - default to orderId descending (newest to oldest)
  const [sortColumn, setSortColumn] = useState('orderId');
  const [sortDirection, setSortDirection] = useState('desc');

  // Modal states removed - using showConfirmation from parent

  // Filtered orders based on all filters
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search filter
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

    // Month filter
    if (allOrdersFilterMonth) {
      filtered = filtered.filter((order) => {
        // Use billingMonth from order if available, otherwise extract from date
        let month, year;
        if (order.billingMonth && order.billingYear) {
          month = parseInt(order.billingMonth);
          year = parseInt(order.billingYear);
        } else {
          // Never use createdAt (today's date) as fallback - only use actual order date
          const orderDate = parseOrderDate(order.date || order.order_date || null);
          if (!orderDate) return false;
          month = orderDate.getUTCMonth() + 1;
          year = orderDate.getUTCFullYear();
        }
        return formatBillingMonth(month, year) === allOrdersFilterMonth;
      });
    }

    // Address filter
    if (allOrdersFilterAddress && allOrdersFilterAddress.trim()) {
      filtered = filtered.filter((order) => {
        const address = (
          order.deliveryAddress ||
          order.customerAddress ||
          order.address ||
          ''
        ).toLowerCase();
        return address.includes(allOrdersFilterAddress.toLowerCase());
      });
    }

    // Payment status filter
    if (allOrdersFilterPaymentStatus) {
      const statusFilter = allOrdersFilterPaymentStatus.toLowerCase();
      if (statusFilter === 'paid') {
        filtered = filtered.filter((o) => isPaidStatus(o.status));
      } else if (statusFilter === 'pending' || statusFilter === 'unpaid') {
        filtered = filtered.filter((o) => isPendingStatus(o.status));
      }
    }

    // Additional filters
    if (filterStatus) {
      filtered = filtered.filter((o) => {
        const status = (o.status || '').toLowerCase();
        return status === filterStatus.toLowerCase();
      });
    }

    if (filterMode) {
      filtered = filtered.filter((o) => {
        const mode = (o.mode || '').toLowerCase();
        return mode === filterMode.toLowerCase();
      });
    }

    if (filterPayment) {
      filtered = filtered.filter((o) => {
        const payment = (o.paymentMode || '').toLowerCase();
        return payment === filterPayment.toLowerCase();
      });
    }

    if (filterYear) {
      filtered = filtered.filter((order) => {
        // Use billingYear from order if available, otherwise extract from date
        let year;
        if (order.billingYear) {
          year = parseInt(order.billingYear);
        } else {
          // Never use createdAt (today's date) as fallback - only use actual order date
          const orderDate = parseOrderDate(order.date || order.order_date || null);
          if (orderDate) {
            year = orderDate.getFullYear();
          }
        }
        return year && year.toString() === filterYear;
      });
    }

    if (filterAddress.trim()) {
      filtered = filtered.filter((order) => {
        const address = (
          order.deliveryAddress ||
          order.customerAddress ||
          order.address ||
          ''
        ).toLowerCase();
        return address.includes(filterAddress.toLowerCase());
      });
    }

    // Date range filter
    if (dateRangeFrom) {
      const fromDate = parseOrderDate(dateRangeFrom);
      if (fromDate) {
        filtered = filtered.filter((order) => {
          // Never use createdAt (today's date) as fallback - only use actual order date
          const orderDate = parseOrderDate(order.date || order.order_date || null);
          return orderDate && orderDate >= fromDate;
        });
      }
    }

    if (dateRangeTo) {
      const toDate = parseOrderDate(dateRangeTo);
      if (toDate) {
        toDate.setHours(23, 59, 59, 999); // End of day
        filtered = filtered.filter((order) => {
          // Never use createdAt (today's date) as fallback - only use actual order date
          const orderDate = parseOrderDate(order.date || order.order_date || null);
          return orderDate && orderDate <= toDate;
        });
      }
    }

    // Sorting - always sort, default to date descending then orderId descending
    filtered.sort((a, b) => {
      let aVal, bVal;
      let aSecondaryVal, bSecondaryVal;

      switch (sortColumn) {
        case 'date': {
          // Never use createdAt (today's date) as fallback - only use actual order date
          aVal = parseOrderDate(a.date || a.order_date || null);
          bVal = parseOrderDate(b.date || b.order_date || null);
          aVal = aVal ? aVal.getTime() : 0;
          bVal = bVal ? bVal.getTime() : 0;
          // Secondary sort by orderId sequence number when dates are equal
          const extractSequence = (orderId) => {
            if (!orderId) return 0;
            const match = orderId.toString().match(/HB-\w+'?\d{2}-\d{2}-(\d+)$/);
            return match && match[1] ? parseInt(match[1], 10) : 0;
          };
          aSecondaryVal = extractSequence(a.orderId);
          bSecondaryVal = extractSequence(b.orderId);
          // If sequence numbers are same or missing, fall back to lexicographic sort
          if (aSecondaryVal === 0 && bSecondaryVal === 0) {
            aSecondaryVal = (a.orderId || '').toString();
            bSecondaryVal = (b.orderId || '').toString();
          }
          break;
        }
        case 'orderId': {
          // Parse Order ID to extract date and sequence (format: HB-Feb'24-21-000001)
          const parseOrderIdDate = (orderIdStr) => {
            if (!orderIdStr) return { date: 0, sequence: 0 };
            const str = orderIdStr.toString();
            // Match: HB-Month'YY-DD-SequenceNumber
            const match = str.match(/HB-(\w+)'?(\d{2})-(\d{2})-(\d+)$/);
            if (!match) {
              return { date: 0, sequence: 0 };
            }

            const monthStr = match[1].toLowerCase();
            const year2Digit = parseInt(match[2], 10);
            const day = parseInt(match[3], 10);
            const sequence = parseInt(match[4], 10);

            // Convert 2-digit year to 4-digit (assume 2000-2099)
            const year = year2Digit < 50 ? 2000 + year2Digit : 1900 + year2Digit;

            // Month abbreviations to number
            const monthMap = {
              jan: 0,
              feb: 1,
              mar: 2,
              apr: 3,
              may: 4,
              jun: 5,
              jul: 6,
              aug: 7,
              sep: 8,
              oct: 9,
              nov: 10,
              dec: 11,
            };

            const month = monthMap[monthStr] !== undefined ? monthMap[monthStr] : 0;
            const date = new Date(year, month, day);
            return {
              date: date.getTime(),
              sequence: sequence,
            };
          };

          const aParsed = parseOrderIdDate(a.orderId);
          const bParsed = parseOrderIdDate(b.orderId);

          // Primary sort by date from Order ID
          aVal = aParsed.date;
          bVal = bParsed.date;

          // If date parsing failed, fall back to order date field
          if (aVal === 0) {
            const aOrderDate = parseOrderDate(a.date || a.order_date || null);
            aVal = aOrderDate ? aOrderDate.getTime() : 0;
          }
          if (bVal === 0) {
            const bOrderDate = parseOrderDate(b.date || b.order_date || null);
            bVal = bOrderDate ? bOrderDate.getTime() : 0;
          }

          // Secondary sort by sequence number
          aSecondaryVal = aParsed.sequence;
          bSecondaryVal = bParsed.sequence;
          break;
        }
        case 'address':
          aVal = (a.deliveryAddress || a.customerAddress || a.address || '').toLowerCase();
          bVal = (b.deliveryAddress || b.customerAddress || b.address || '').toLowerCase();
          break;
        case 'quantity':
          aVal = parseInt(a.quantity || 1);
          bVal = parseInt(b.quantity || 1);
          break;
        case 'total': {
          // Try total first, then totalAmount, then calculate from quantity * unitPrice
          let aTotal = parseFloat(a.total || a.totalAmount || 0);
          if (isNaN(aTotal) || aTotal === 0) {
            const aQty = parseFloat(a.quantity || 1);
            const aPrice = parseFloat(a.unitPrice || 0);
            aTotal = aQty * aPrice;
          }
          let bTotal = parseFloat(b.total || b.totalAmount || 0);
          if (isNaN(bTotal) || bTotal === 0) {
            const bQty = parseFloat(b.quantity || 1);
            const bPrice = parseFloat(b.unitPrice || 0);
            bTotal = bQty * bPrice;
          }
          aVal = isNaN(aTotal) ? 0 : aTotal;
          bVal = isNaN(bTotal) ? 0 : bTotal;
          break;
        }
        case 'mode':
          aVal = (a.mode || '').toLowerCase();
          bVal = (b.mode || '').toLowerCase();
          break;
        case 'status':
          aVal = (a.status || '').toLowerCase();
          bVal = (b.status || '').toLowerCase();
          break;
        case 'payment':
          aVal = (a.paymentMode || '').toLowerCase();
          bVal = (b.paymentMode || '').toLowerCase();
          break;
        default: {
          // Default sort: date descending, then orderId sequence ascending (000001, 000002, etc.)
          aVal = parseOrderDate(a.date || a.order_date || null);
          bVal = parseOrderDate(b.date || b.order_date || null);
          aVal = aVal ? aVal.getTime() : 0;
          bVal = bVal ? bVal.getTime() : 0;
          // Secondary sort by orderId sequence number (ascending)
          const extractSequence = (orderId) => {
            if (!orderId) return 0;
            const match = orderId.toString().match(/HB-\w+'?\d{2}-\d{2}-(\d+)$/);
            return match && match[1] ? parseInt(match[1], 10) : 0;
          };
          aSecondaryVal = extractSequence(a.orderId);
          bSecondaryVal = extractSequence(b.orderId);
          // If sequence numbers are same or missing, fall back to lexicographic sort
          if (aSecondaryVal === 0 && bSecondaryVal === 0) {
            aSecondaryVal = (a.orderId || '').toString();
            bSecondaryVal = (b.orderId || '').toString();
          }
          break;
        }
      }

      // Primary sort
      if (aVal < bVal) {
        const primaryResult = sortDirection === 'asc' ? -1 : 1;
        return primaryResult;
      }
      if (aVal > bVal) {
        const primaryResult = sortDirection === 'asc' ? 1 : -1;
        return primaryResult;
      }

      // Secondary sort (when primary values are equal)
      // For date sorting, secondary sort (sequence numbers) should be ascending (increasing order)
      // For orderId sorting, secondary sort (sequence numbers) should be ascending (oldest to newest)
      // For other columns, use the same direction as primary sort
      if (aSecondaryVal !== undefined && bSecondaryVal !== undefined) {
        let secondaryDirection;
        if (sortColumn === 'date' || sortColumn === null) {
          // When sorting by date (or default), sequence numbers should be ascending (000001, 000002, 000003...)
          // This ensures orders on the same date are sorted: 000001, then 000002, then 000003, etc.
          secondaryDirection = 'asc';
        } else if (sortColumn === 'orderId') {
          // When sorting by orderId, sequence numbers should be descending (newest to oldest)
          // This ensures reverse chronological order: 000100, then 000010, then 000001, etc.
          secondaryDirection = 'desc';
        } else {
          // For other columns, use same direction as primary
          secondaryDirection = sortDirection;
        }
        if (aSecondaryVal < bSecondaryVal) {
          return secondaryDirection === 'asc' ? -1 : 1;
        }
        if (aSecondaryVal > bSecondaryVal) {
          return secondaryDirection === 'asc' ? 1 : -1;
        }
      }

      return 0;
    });

    return filtered;
  }, [
    orders,
    searchQuery,
    allOrdersFilterMonth,
    allOrdersFilterAddress,
    allOrdersFilterPaymentStatus,
    filterStatus,
    filterMode,
    filterPayment,
    filterYear,
    filterAddress,
    dateRangeFrom,
    dateRangeTo,
    sortColumn,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + recordsPerPage);

  // Active filters array
  const activeFilters = useMemo(() => {
    const filters = [];
    if (allOrdersFilterPaymentStatus)
      filters.push({
        key: 'status',
        label: `Status: ${allOrdersFilterPaymentStatus}`,
        value: allOrdersFilterPaymentStatus,
      });
    if (filterMode) filters.push({ key: 'mode', label: `Mode: ${filterMode}`, value: filterMode });
    if (allOrdersFilterMonth)
      filters.push({
        key: 'month',
        label: `Date: ${allOrdersFilterMonth}`,
        value: allOrdersFilterMonth,
      });
    if (filterYear) filters.push({ key: 'year', label: `Year: ${filterYear}`, value: filterYear });
    if (dateRangeFrom || dateRangeTo) {
      const range = `${dateRangeFrom || 'Start'} - ${dateRangeTo || 'End'}`;
      filters.push({
        key: 'daterange',
        label: `Date Range: ${range}`,
        value: { from: dateRangeFrom, to: dateRangeTo },
      });
    }
    return filters;
  }, [
    allOrdersFilterPaymentStatus,
    filterMode,
    allOrdersFilterMonth,
    filterYear,
    dateRangeFrom,
    dateRangeTo,
  ]);

  // Handle sort
  const handleSort = (column) => {
    if (!column) return; // Ignore clicks on non-sortable columns
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      // Default to descending for orderId (newest to oldest), descending for date, ascending for others
      setSortDirection(column === 'orderId' ? 'desc' : column === 'date' ? 'desc' : 'asc');
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(new Set(paginatedOrders.map((_, idx) => startIndex + idx)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Handle row select
  const handleRowSelect = (index, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(startIndex + index);
    } else {
      newSelected.delete(startIndex + index);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === paginatedOrders.length);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilterStatus('');
    setFilterMode('');
    setFilterPayment('');
    setFilterYear('');
    setFilterAddress('');
    setDateRangeFrom('');
    setDateRangeTo('');
    setAllOrdersFilterMonth('');
    setAllOrdersFilterAddress('');
    setAllOrdersFilterPaymentStatus('');
    if (setAllOrdersFilterMonth) setAllOrdersFilterMonth('');
    if (setAllOrdersFilterAddress) setAllOrdersFilterAddress('');
    if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus('');
  };

  // Remove active filter
  const removeFilter = (filter) => {
    switch (filter.key) {
      case 'status':
        setAllOrdersFilterPaymentStatus('');
        if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus('');
        break;
      case 'mode':
        setFilterMode('');
        break;
      case 'month': {
        setAllOrdersFilterMonth('');
        if (setAllOrdersFilterMonth) setAllOrdersFilterMonth('');
        break;
      }
      case 'year': {
        setFilterYear('');
        break;
      }
      case 'daterange':
        setDateRangeFrom('');
        setDateRangeTo('');
        break;
    }
  };

  // Bulk actions with confirmation
  const handleBulkAction = async (action) => {
    const selectedOrderIds = Array.from(selectedRows).map(
      (idx) => filteredOrders[idx]._id || filteredOrders[idx].orderId
    );
    if (selectedOrderIds.length === 0) return;

    const count = selectedOrderIds.length;
    const selectedOrders = Array.from(selectedRows).map((idx) => filteredOrders[idx]);

    if (action === 'delete') {
      if (showConfirmation) {
        showConfirmation({
          title: 'Delete Selected Orders',
          message: `Are you sure you want to delete ${count} selected order${
            count > 1 ? 's' : ''
          }? This action cannot be undone.`,
          type: 'danger',
          confirmText: 'Delete',
          onConfirm: async () => {
            try {
              for (const id of selectedOrderIds) {
                if (onDeleteOrder) await onDeleteOrder(id);
              }
              setSelectedRows(new Set());
              setSelectAll(false);
              if (showNotification)
                showNotification('Selected orders deleted successfully', 'success');
              if (loadOrders) loadOrders();
            } catch (error) {
              console.error('Error deleting orders:', error);
              if (showNotification) showNotification('Error deleting orders', 'error');
            }
          },
        });
      }
    } else if (action === 'paid' || action === 'pending') {
      const status = action === 'paid' ? 'Paid' : 'Pending';
      if (showConfirmation) {
        showConfirmation({
          title: `Mark as ${status}`,
          message: `Are you sure you want to mark ${count} selected order${
            count > 1 ? 's' : ''
          } as ${status.toLowerCase()}?`,
          type: 'info',
          confirmText: `Mark as ${status}`,
          onConfirm: async () => {
            try {
              for (const id of selectedOrderIds) {
                if (onUpdateOrderStatus) {
                  await onUpdateOrderStatus(id, action === 'paid' ? 'Paid' : 'Unpaid');
                }
              }
              setSelectedRows(new Set());
              setSelectAll(false);
              if (showNotification)
                showNotification(`Selected orders marked as ${status.toLowerCase()}`, 'success');
              if (loadOrders) loadOrders();
            } catch (error) {
              console.error('Error updating order status:', error);
              if (showNotification) showNotification('Error updating order status', 'error');
            }
          },
        });
      }
    } else if (action === 'export') {
      // Export doesn't need confirmation, just do it
      const csvContent =
        'Date,Address,Quantity,Amount,Mode,Status\n' +
        selectedOrders
          .map((o) => {
            // Never use createdAt (today's date) as fallback - only use actual order date
            const date = parseOrderDate(o.date || o.order_date || null);
            return `"${date ? formatDate(date) : ''}","${
              o.deliveryAddress || o.customerAddress || o.address || 'N/A'
            }","${o.quantity || 1}","${o.total || o.totalAmount || 0}","${o.mode || 'N/A'}","${
              o.status || 'N/A'
            }"`;
          })
          .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `selected_orders_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      if (showNotification) showNotification('Selected orders exported successfully', 'success');
    }
  };

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set();
    orders.forEach((o) => {
      if (o.status) statuses.add(o.status);
    });
    return Array.from(statuses).sort();
  }, [orders]);

  const uniqueModes = useMemo(() => {
    const modes = new Set();
    orders.forEach((o) => {
      if (o.mode) modes.add(o.mode);
    });
    return Array.from(modes).sort();
  }, [orders]);

  const uniquePaymentModes = useMemo(() => {
    const paymentModes = new Set();
    orders.forEach((o) => {
      if (o.paymentMode) paymentModes.add(o.paymentMode);
    });
    return Array.from(paymentModes).sort();
  }, [orders]);

  const uniqueYears = useMemo(() => {
    const years = new Set();
    orders.forEach((o) => {
      // Use billingYear from order if available, otherwise extract from date
      let year;
      if (o.billingYear) {
        year = parseInt(o.billingYear);
      } else {
        const orderDate = parseOrderDate(o.createdAt || o.date || o.order_date);
        if (orderDate) {
          year = orderDate.getFullYear();
        }
      }
      if (year) years.add(year.toString());
    });
    return Array.from(years).sort().reverse();
  }, [orders]);

  // Export all filtered
  const handleExport = () => {
    const csvContent =
      'S.No,Date,Address,Quantity,Price,Total,Mode,Status,Payment,Month,Year,OrderID\n' +
      filteredOrders
        .map((o, idx) => {
          const date = parseOrderDate(o.createdAt || o.date || o.order_date);
          // Use billingMonth/billingYear from order if available, otherwise extract from date
          let month, year;
          if (o.billingMonth && o.billingYear) {
            month = parseInt(o.billingMonth);
            year = parseInt(o.billingYear);
          } else if (date) {
            month = date.getUTCMonth() + 1;
            year = date.getUTCFullYear();
          } else {
            month = null;
            year = null;
          }
          return `${idx + 1},"${date ? date.toLocaleDateString() : ''}","${
            o.deliveryAddress || o.customerAddress || o.address || 'N/A'
          }","${o.quantity || 1}","${o.unitPrice || 0}","${o.total || o.totalAmount || 0}","${
            o.mode || 'N/A'
          }","${o.status || 'N/A'}","${o.paymentMode || 'N/A'}","${
            month ? formatBillingMonth(month, year) : 'N/A'
          }","${year || 'N/A'}","${o.orderId || 'N/A'}"`;
        })
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `all_orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    if (showNotification) showNotification('Orders exported successfully', 'success');
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>All Orders Data</h2>
        </div>
        <PremiumLoader message='Loading orders...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* TOP ACTION BAR */}
      <div className='action-bar'>
        <div className='search-input-wrapper'>
          <i className='fa-solid fa-search search-input-icon'></i>
          <input
            type='text'
            className='input-field search-input-with-icon'
            placeholder='Search orders...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='action-buttons-group'>
          <button
            className='btn btn-secondary btn-small'
            onClick={onLoadExcelFile}
            title='Upload CSV'
          >
            <i className='fa-solid fa-upload'></i> Upload CSV
          </button>
          <button
            className='btn btn-primary btn-small'
            onClick={() => onEditOrder && onEditOrder(null)}
            title='Add Order'
          >
            <i className='fa-solid fa-plus'></i> Add Order
          </button>
          <button
            className='btn btn-special danger btn-small'
            onClick={async () => {
              if (showConfirmation && onClearAllData) {
                showConfirmation({
                  title: 'Delete All Orders',
                  message:
                    'Are you sure you want to delete ALL orders? This action cannot be undone and will permanently delete all order data.',
                  type: 'danger',
                  confirmText: 'Delete All',
                  onConfirm: async () => {
                    // Pass skipConfirmation=true since we already showed confirmation
                    await onClearAllData(true);
                  },
                });
              } else if (onClearAllData) {
                // Direct clear without confirmation
                await onClearAllData(true);
              }
            }}
            title='Delete All'
          >
            <i className='fa-solid fa-trash'></i> Delete All
          </button>
          <button className='btn btn-secondary btn-small' onClick={handleExport} title='Export'>
            <i className='fa-solid fa-download'></i> Export
          </button>
        </div>
      </div>

      {/* COMPACT FILTER BAR */}
      <div className='dashboard-card filter-bar-card'>
        <div className='filter-bar-container'>
          {/* Quick Filters - Always Visible */}
          <div className='filter-bar-quick-filters'>
            <select
              className='input-field filter-select'
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              title='Filter by Status'
            >
              <option value=''>All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              className='input-field filter-select'
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              title='Filter by Mode'
            >
              <option value=''>All Modes</option>
              {uniqueModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>

            <select
              className='input-field filter-select'
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              title='Filter by Payment'
            >
              <option value=''>All Payment</option>
              {uniquePaymentModes.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className={`btn btn-ghost btn-small filter-toggle-btn ${filtersExpanded ? 'active' : ''}`}
            >
              <i className='fa-solid fa-filter filter-toggle-icon'></i>
              More Filters
              <i
                className={`fa-solid fa-chevron-${filtersExpanded ? 'up' : 'down'} filter-toggle-chevron`}
              ></i>
            </button>
          </div>

          {/* Clear Filters - Outside quick filters for better layout */}
          {(filterStatus ||
            filterMode ||
            filterPayment ||
            filterAddress ||
            dateRangeFrom ||
            dateRangeTo ||
            allOrdersFilterMonth ||
            filterYear) && (
            <button className='btn btn-ghost btn-small filter-clear-btn' onClick={clearAllFilters}>
              <i className='fa-solid fa-xmark filter-clear-icon'></i>
              Clear
            </button>
          )}
        </div>

        {/* Advanced Filters - Collapsible */}
        {filtersExpanded && (
          <div className='advanced-filters-container'>
            <div className='filter-field-group date-range'>
              <label className='filter-label'>Date Range</label>
              <div className='filter-input-group'>
                <input
                  type='date'
                  className='input-field filter-input'
                  value={dateRangeFrom}
                  onChange={(e) => setDateRangeFrom(e.target.value)}
                />
                <input
                  type='date'
                  className='input-field filter-input'
                  value={dateRangeTo}
                  onChange={(e) => setDateRangeTo(e.target.value)}
                />
              </div>
            </div>

            <div className='filter-field-group month'>
              <label className='filter-label'>Month</label>
              <select
                className='input-field filter-input'
                value={allOrdersFilterMonth || ''}
                onChange={(e) => {
                  setAllOrdersFilterMonth(e.target.value);
                  if (setAllOrdersFilterMonth) setAllOrdersFilterMonth(e.target.value);
                }}
              >
                <option value=''>All Months</option>
                {uniqueYears.flatMap((year) => {
                  const yearStr = String(year).slice(-2);
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
                  return monthNames.map((month) => (
                    <option key={`${month}'${yearStr}`} value={`${month}'${yearStr}`}>
                      {month}&apos;{yearStr}
                    </option>
                  ));
                })}
              </select>
            </div>

            <div className='filter-field-group year'>
              <label className='filter-label'>Year</label>
              <select
                className='input-field filter-input'
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value=''>All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className='filter-field-group address'>
              <label className='filter-label'>Address Search</label>
              <input
                type='text'
                className='input-field filter-input'
                value={filterAddress}
                onChange={(e) => setFilterAddress(e.target.value)}
                placeholder='Search by address...'
              />
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE FILTERS DISPLAY */}
      {activeFilters.length > 0 && (
        <div className='active-filters-container'>
          <span className='active-filters-label'>Applied:</span>
          {activeFilters.map((filter, idx) => (
            <span
              key={idx}
              className='badge badge-info active-filter-badge'
              onClick={() => removeFilter(filter)}
            >
              {filter.label}
              <i className='fa-solid fa-times'></i>
            </span>
          ))}
        </div>
      )}

      {/* BULK ACTIONS BAR */}
      {selectedRows.size > 0 && (
        <div className='action-bar bulk-actions-bar'>
          <span className='bulk-actions-label'>{selectedRows.size} selected</span>
          <div className='action-buttons-group'>
            <button className='btn btn-success btn-small' onClick={() => handleBulkAction('paid')}>
              Mark as Paid
            </button>
            <button
              className='btn btn-secondary btn-small'
              onClick={() => handleBulkAction('pending')}
            >
              Mark as Pending
            </button>
            <button
              className='btn btn-special danger btn-small'
              onClick={() => handleBulkAction('delete')}
            >
              Delete Selected
            </button>
            <button
              className='btn btn-secondary btn-small'
              onClick={() => handleBulkAction('export')}
            >
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* DATA TABLE */}
      <div className='dashboard-card table-container-card'>
        <div className='table-header-container'>
          <div>
            <label className='select-all-container'>
              <input
                type='checkbox'
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span className='select-all-label'>Select All</span>
            </label>
          </div>
          <div className='table-info-text'>
            Showing {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredOrders.length)}{' '}
            of {filteredOrders.length} orders
          </div>
        </div>

        <div className='orders-table-container table-wrapper'>
          <table className='orders-table table-full-width'>
            <thead>
              <tr>
                <th className='table-checkbox-header'>
                  <input
                    type='checkbox'
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className='sortable-header' onClick={() => handleSort(null)}>
                  S.No {sortColumn === null && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className='sortable-header' onClick={() => handleSort('date')}>
                  Date {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className='sortable-header' onClick={() => handleSort('address')}>
                  Address {sortColumn === 'address' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className='sortable-header' onClick={() => handleSort('quantity')}>
                  Qty {sortColumn === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className='sortable-header' onClick={() => handleSort(null)}>
                  Price
                </th>
                <th className='sortable-header' onClick={() => handleSort('total')}>
                  Total {sortColumn === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className='sortable-header' onClick={() => handleSort('mode')}>
                  Mode {sortColumn === 'mode' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className='sortable-header' onClick={() => handleSort('status')}>
                  Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className='sortable-header' onClick={() => handleSort('payment')}>
                  Payment {sortColumn === 'payment' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className='sortable-header' onClick={() => handleSort(null)}>
                  Month
                </th>
                <th className='sortable-header' onClick={() => handleSort(null)}>
                  Year
                </th>
                <th className='sortable-header' onClick={() => handleSort('orderId')}>
                  OrderID {sortColumn === 'orderId' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={14} className='empty-state-cell'>
                    <div className='empty-state'>
                      <i className='fa-solid fa-inbox empty-state-icon'></i>
                      <p>No orders found</p>
                      <p className='empty-state-text'>Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, idx) => {
                  // Never use createdAt (today's date) as fallback - only use actual order date
                  const orderDate = parseOrderDate(order.date || order.order_date || null);
                  const dateStr = formatDate(orderDate);
                  // Use billingMonth/billingYear from order if available, otherwise extract from date
                  let month, year;
                  if (order.billingMonth && order.billingYear) {
                    month = parseInt(order.billingMonth);
                    year = parseInt(order.billingYear);
                  } else if (orderDate) {
                    // Use UTC methods to match how dates are stored in MongoDB
                    month = orderDate.getUTCMonth() + 1;
                    year = orderDate.getUTCFullYear();
                  } else {
                    month = null;
                    year = null;
                  }
                  const isSelected = selectedRows.has(startIndex + idx);
                  const isPaid = isPaidStatus(order.status);

                  return (
                    <tr
                      key={order._id || order.orderId || idx}
                      className={`table-row-clickable ${isSelected ? 'table-row-selected' : ''}`}
                      onDoubleClick={() => onEditOrder && onEditOrder(order)}
                    >
                      <td>
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(idx, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td>{startIndex + idx + 1}</td>
                      <td>{dateStr}</td>
                      <td>
                        {order.deliveryAddress || order.customerAddress || order.address || 'N/A'}
                      </td>
                      <td>{order.quantity || 1}</td>
                      <td>₹{formatCurrency(order.unitPrice || 0)}</td>
                      <td>
                        ₹
                        {formatCurrency(
                          order.total ||
                            order.totalAmount ||
                            (order.quantity || 1) * (order.unitPrice || 0)
                        )}
                      </td>
                      <td>{order.mode || 'N/A'}</td>
                      <td>
                        <select
                          className={`status-dropdown ${isPaid ? 'status-paid' : 'status-unpaid'}`}
                          value={isPaid ? 'Paid' : 'Unpaid'}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newStatus = e.target.value;
                            const currentStatus = isPaid ? 'Paid' : 'Unpaid';
                            if (newStatus === currentStatus) return;

                            // Store the select element to reset if cancelled
                            const selectElement = e.target;

                            if (showConfirmation && onUpdateOrderStatus) {
                              showConfirmation({
                                title: 'Update Order Status',
                                message: `Are you sure you want to change the status of Order ${
                                  order.orderId || order._id
                                } from "${currentStatus}" to "${newStatus}"?`,
                                type: 'info',
                                confirmText: 'Update Status',
                                onConfirm: () => {
                                  // Pass skipConfirmation=true since we already showed confirmation
                                  onUpdateOrderStatus(order._id || order.orderId, newStatus, true);
                                },
                                onCancelCallback: () => {
                                  // Reset select to current value if cancelled
                                  selectElement.value = currentStatus;
                                },
                              });
                            } else if (onUpdateOrderStatus) {
                              // Direct update without confirmation
                              onUpdateOrderStatus(order._id || order.orderId, newStatus, true);
                            } else {
                              // Reset if no handler
                              selectElement.value = currentStatus;
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value='Paid'>Paid</option>
                          <option value='Unpaid'>Unpaid</option>
                        </select>
                      </td>
                      <td>{order.paymentMode || 'N/A'}</td>
                      <td>{month ? formatBillingMonth(month, year) : 'N/A'}</td>
                      <td>{year || 'N/A'}</td>
                      <td className='monospace-text'>{order.orderId || 'N/A'}</td>
                      <td>
                        <div className='action-buttons-cell'>
                          <button
                            className='action-icon-btn action-icon-edit'
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEditOrder) onEditOrder(order);
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
                })
              )}
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
            <span className='pagination-info'>
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
          <div className='pagination-container'>
            <span>Show:</span>
            <select
              className='input-field pagination-select'
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
              <option value={200}>200</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrdersDataTab;
