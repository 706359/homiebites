// Tab 2: All Orders Data - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useMemo, useState } from 'react';
import { formatDate, parseOrderDate } from '../utils/dateUtils.js';
import {
  formatBillingMonth,
  formatCurrency,
  isPaidStatus,
  isPendingStatus,
} from '../utils/orderUtils.js';

const AllOrdersDataTab = ({
  orders = [],
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
  recordsPerPage = 25,
  onPageChange,
  onRecordsPerPageChange,
  loadOrders,
  showConfirmation,
}) => {
  // State for filters panel
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

  // Sorting state
  const [sortColumn, setSortColumn] = useState(null);
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
          const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
          if (!orderDate) return false;
          month = orderDate.getMonth() + 1;
          year = orderDate.getFullYear();
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
          const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
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
          const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
          return orderDate && orderDate >= fromDate;
        });
      }
    }

    if (dateRangeTo) {
      const toDate = parseOrderDate(dateRangeTo);
      if (toDate) {
        toDate.setHours(23, 59, 59, 999); // End of day
        filtered = filtered.filter((order) => {
          const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);
          return orderDate && orderDate <= toDate;
        });
      }
    }

    // Sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal, bVal;

        switch (sortColumn) {
          case 'date':
            aVal = parseOrderDate(a.createdAt || a.date || a.order_date);
            bVal = parseOrderDate(b.createdAt || b.date || b.order_date);
            aVal = aVal ? aVal.getTime() : 0;
            bVal = bVal ? bVal.getTime() : 0;
            break;
          case 'address':
            aVal = (a.deliveryAddress || a.customerAddress || a.address || '').toLowerCase();
            bVal = (b.deliveryAddress || b.customerAddress || b.address || '').toLowerCase();
            break;
          case 'quantity':
            aVal = parseInt(a.quantity || 1);
            bVal = parseInt(b.quantity || 1);
            break;
          case 'total':
            aVal = parseFloat(a.total || a.totalAmount || 0);
            bVal = parseFloat(b.total || b.totalAmount || 0);
            break;
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
          default:
            return 0;
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

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
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
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
      case 'month':
        setAllOrdersFilterMonth('');
        if (setAllOrdersFilterMonth) setAllOrdersFilterMonth('');
        break;
      case 'year':
        setFilterYear('');
        break;
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
            const date = parseOrderDate(o.createdAt || o.date || o.order_date);
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

  const confirmBulkAction = async () => {
    const selectedOrderIds = Array.from(selectedRows).map(
      (idx) => filteredOrders[idx]._id || filteredOrders[idx].orderId
    );

    try {
      if (bulkAction === 'delete') {
        // Handle bulk delete
        for (const id of selectedOrderIds) {
          if (onDeleteOrder) await onDeleteOrder(id);
        }
        if (showNotification) showNotification('Selected orders deleted successfully', 'success');
      } else if (bulkAction === 'paid' || bulkAction === 'pending') {
        // Handle bulk status update
        for (const id of selectedOrderIds) {
          if (onUpdateOrderStatus) {
            await onUpdateOrderStatus(id, bulkAction === 'paid' ? 'paid' : 'pending');
          }
        }
        if (showNotification)
          showNotification(`Selected orders marked as ${bulkAction}`, 'success');
      } else if (bulkAction === 'export') {
        // Handle bulk export
        const selectedOrders = Array.from(selectedRows).map((idx) => filteredOrders[idx]);
        const csvContent =
          'Date,Address,Quantity,Amount,Mode,Status\n' +
          selectedOrders
            .map((o) => {
              const date = parseOrderDate(o.createdAt || o.date || o.order_date);
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
      setSelectedRows(new Set());
      setSelectAll(false);
      setShowBulkActionsModal(false);
      if (loadOrders) loadOrders();
    } catch (error) {
      console.error('Bulk action error:', error);
      if (showNotification) showNotification('Error performing bulk action', 'error');
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
            month = date.getMonth() + 1;
            year = date.getFullYear();
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
      {/* HEADER */}
      <div className='dashboard-header'>
        <div>
          <h2>All Orders Data</h2>
          <p>View and manage all orders</p>
        </div>
      </div>

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
            className='btn btn-danger btn-small'
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

      {/* FILTERS PANEL (Collapsible) */}
      <div className='dashboard-card' style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 className='dashboard-section-title' style={{ marginBottom: 0 }}>
            <i className='fa-solid fa-filter' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
            Filters
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className='btn btn-ghost btn-small' onClick={clearAllFilters}>
              Clear All
            </button>
            <button
              className='btn btn-ghost btn-small'
              onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
              <i className={`fa-solid fa-chevron-${filtersExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        {filtersExpanded && (
          <div className='form-grid'>
            <div className='form-group'>
              <label>Date Range</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type='date'
                  className='input-field'
                  value={dateRangeFrom}
                  onChange={(e) => setDateRangeFrom(e.target.value)}
                  placeholder='From'
                />
                <input
                  type='date'
                  className='input-field'
                  value={dateRangeTo}
                  onChange={(e) => setDateRangeTo(e.target.value)}
                  placeholder='To'
                />
              </div>
            </div>

            <div className='form-group'>
              <label>Status</label>
              <select
                className='input-field'
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value=''>All</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Mode</label>
              <select
                className='input-field'
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
              >
                <option value=''>All</option>
                {uniqueModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Payment</label>
              <select
                className='input-field'
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
              >
                <option value=''>All</option>
                {uniquePaymentModes.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Month</label>
              <select
                className='input-field'
                value={allOrdersFilterMonth || ''}
                onChange={(e) => {
                  setAllOrdersFilterMonth(e.target.value);
                  if (setAllOrdersFilterMonth) setAllOrdersFilterMonth(e.target.value);
                }}
              >
                <option value=''>All</option>
                <option value="Jan'25">Jan'25</option>
                <option value="Feb'25">Feb'25</option>
                <option value="Mar'25">Mar'25</option>
                <option value="Apr'25">Apr'25</option>
                <option value="May'25">May'25</option>
                <option value="Jun'25">Jun'25</option>
                <option value="Jul'25">Jul'25</option>
                <option value="Aug'25">Aug'25</option>
                <option value="Sep'25">Sep'25</option>
                <option value="Oct'25">Oct'25</option>
                <option value="Nov'25">Nov'25</option>
                <option value="Dec'25">Dec'25</option>
              </select>
            </div>

            <div className='form-group'>
              <label>Year</label>
              <select
                className='input-field'
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value=''>All</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Address</label>
              <input
                type='text'
                className='input-field'
                value={filterAddress}
                onChange={(e) => setFilterAddress(e.target.value)}
                placeholder='Search address...'
              />
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE FILTERS DISPLAY */}
      {activeFilters.length > 0 && (
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: '600', color: 'var(--admin-text-secondary)' }}>Applied:</span>
          {activeFilters.map((filter, idx) => (
            <span
              key={idx}
              className='badge badge-info'
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                cursor: 'pointer',
              }}
              onClick={() => removeFilter(filter)}
            >
              {filter.label}
              <i className='fa-solid fa-times' style={{ fontSize: '0.75rem' }}></i>
            </span>
          ))}
        </div>
      )}

      {/* BULK ACTIONS BAR */}
      {selectedRows.size > 0 && (
        <div
          className='action-bar'
          style={{
            background: 'var(--admin-accent-light)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <span style={{ fontWeight: '600', color: 'var(--admin-accent)' }}>
            {selectedRows.size} selected
          </span>
          <div className='action-buttons-group'>
            <button className='btn btn-success btn-small' onClick={() => handleBulkAction('paid')}>
              Mark as Paid
            </button>
            <button
              className='btn btn-warning btn-small'
              onClick={() => handleBulkAction('pending')}
            >
              Mark as Pending
            </button>
            <button className='btn btn-danger btn-small' onClick={() => handleBulkAction('delete')}>
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
      <div className='dashboard-card'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type='checkbox'
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span style={{ fontWeight: '600' }}>Select All</span>
            </label>
          </div>
          <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem' }}>
            Showing {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredOrders.length)}{' '}
            of {filteredOrders.length} orders
          </div>
        </div>

        <div className='orders-table-container'>
          <table className='orders-table'>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type='checkbox'
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th onClick={() => handleSort(null)} style={{ cursor: 'pointer' }}>
                  S.No {sortColumn === null && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                  Date {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                  Address {sortColumn === 'address' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                  Qty {sortColumn === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort(null)} style={{ cursor: 'pointer' }}>
                  Price
                </th>
                <th onClick={() => handleSort('total')} style={{ cursor: 'pointer' }}>
                  Total {sortColumn === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('mode')} style={{ cursor: 'pointer' }}>
                  Mode {sortColumn === 'mode' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('payment')} style={{ cursor: 'pointer' }}>
                  Payment {sortColumn === 'payment' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort(null)} style={{ cursor: 'pointer' }}>
                  Month
                </th>
                <th onClick={() => handleSort(null)} style={{ cursor: 'pointer' }}>
                  Year
                </th>
                <th onClick={() => handleSort(null)} style={{ cursor: 'pointer' }}>
                  OrderID
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={14} style={{ textAlign: 'center', padding: '48px' }}>
                    <div className='empty-state'>
                      <i className='fa-solid fa-inbox empty-state-icon'></i>
                      <p>No orders found</p>
                      <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, idx) => {
                  const orderDate = parseOrderDate(
                    order.createdAt || order.date || order.order_date
                  );
                  const dateStr = formatDate(orderDate);
                  // Use billingMonth/billingYear from order if available, otherwise extract from date
                  let month, year;
                  if (order.billingMonth && order.billingYear) {
                    month = parseInt(order.billingMonth);
                    year = parseInt(order.billingYear);
                  } else if (orderDate) {
                    month = orderDate.getMonth() + 1;
                    year = orderDate.getFullYear();
                  } else {
                    month = null;
                    year = null;
                  }
                  const isSelected = selectedRows.has(startIndex + idx);
                  const isPaid = isPaidStatus(order.status);

                  return (
                    <tr
                      key={order._id || order.orderId || idx}
                      className={isSelected ? 'table-row-selected' : ''}
                      onDoubleClick={() => onEditOrder && onEditOrder(order)}
                      style={{ cursor: 'pointer' }}
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
                      <td>₹{formatCurrency(order.total || order.totalAmount || 0)}</td>
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
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {order.orderId || 'N/A'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
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
              <option value={200}>200</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      </div>

      {/* MODALS */}
    </div>
  );
};

export default AllOrdersDataTab;
