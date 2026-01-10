import { useEffect, useMemo, useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  formatBillingMonth,
  formatCurrency,
  isPaidStatus,
  isPendingStatus,
  sortOrdersByOrderId,
} from './utils/orderUtils.js';

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
  initialDateFilter = null, // YYYY-MM-DD format
}) => {
  // State for filters panel - expanded if date filter is provided
  const [filtersExpanded, setFiltersExpanded] = useState(!!initialDateFilter);
  const [dateRangeFrom, setDateRangeFrom] = useState(initialDateFilter || '');
  const [dateRangeTo, setDateRangeTo] = useState(initialDateFilter || '');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Update date filters when initialDateFilter prop changes
  useEffect(() => {
    if (initialDateFilter) {
      setDateRangeFrom(initialDateFilter);
      setDateRangeTo(initialDateFilter);
      setFiltersExpanded(true);
      // Clear the filter after a short delay to allow parent to reset it
      // This prevents the filter from persisting when switching tabs
    }
  }, [initialDateFilter]);

  // Selection state
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [sortColumn, setSortColumn] = useState('orderId');
  const [sortDirection, setSortDirection] = useState('desc');

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

    // Payment status filter - check both status and paymentStatus fields
    if (allOrdersFilterPaymentStatus) {
      const statusFilter = allOrdersFilterPaymentStatus.toLowerCase();
      if (statusFilter === 'paid') {
        filtered = filtered.filter((o) => isPaidStatus(o.status, o.paymentStatus));
      } else if (statusFilter === 'pending' || statusFilter === 'unpaid') {
        filtered = filtered.filter((o) => isPendingStatus(o.status, o.paymentStatus));
      }
    }

    // Additional filters - check both status and paymentStatus fields
    if (filterStatus) {
      filtered = filtered.filter((o) => {
        const status = (o.status || '').toLowerCase().trim();
        const filterValue = filterStatus.toLowerCase().trim();
        
        // Use helper functions for paid/pending/unpaid for better matching
        // Pass both status and paymentStatus for accurate filtering
        if (filterValue === 'paid') {
          return isPaidStatus(o.status, o.paymentStatus);
        } else if (filterValue === 'pending' || filterValue === 'unpaid') {
          return isPendingStatus(o.status, o.paymentStatus);
        } else {
          // For other statuses, do exact match (case-insensitive)
          return status === filterValue;
        }
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
          const orderDate = parseOrderDate(order.date || order.order_date || null);
          return orderDate && orderDate <= toDate;
        });
      }
    }

    if (!sortColumn || sortColumn === 'orderId') {
      return sortOrdersByOrderId(filtered);
    }

    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortColumn) {
        case 'date': {
          aVal = parseOrderDate(a.date || a.order_date || null);
          bVal = parseOrderDate(b.date || b.order_date || null);
          aVal = aVal ? aVal.getTime() : 0;
          bVal = bVal ? bVal.getTime() : 0;
          break;
        }
        case 'orderId': {
          const seqA = extractOrderIdSequence(a.orderId);
          const seqB = extractOrderIdSequence(b.orderId);
          aVal = seqA;
          bVal = seqB;
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
          let aTotal = null;
          if (a.totalAmount !== undefined && a.totalAmount !== null) {
            aTotal = parseFloat(a.totalAmount);
          } else if (a.total !== undefined && a.total !== null) {
            aTotal = parseFloat(a.total);
          }
          if (aTotal === null || isNaN(aTotal)) {
            aTotal = parseFloat(a.quantity || 1) * parseFloat(a.unitPrice || 0);
          }
          
          let bTotal = null;
          if (b.totalAmount !== undefined && b.totalAmount !== null) {
            bTotal = parseFloat(b.totalAmount);
          } else if (b.total !== undefined && b.total !== null) {
            bTotal = parseFloat(b.total);
          }
          if (bTotal === null || isNaN(bTotal)) {
            bTotal = parseFloat(b.quantity || 1) * parseFloat(b.unitPrice || 0);
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
          const seqA = extractOrderIdSequence(a.orderId);
          const seqB = extractOrderIdSequence(b.orderId);
          aVal = seqA;
          bVal = seqB;
          break;
        }
      }

      if (aVal < bVal) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortDirection === 'asc' ? 1 : -1;
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

  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + recordsPerPage);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (allOrdersFilterPaymentStatus) {
      const displayLabel = allOrdersFilterPaymentStatus.charAt(0).toUpperCase() + allOrdersFilterPaymentStatus.slice(1);
      filters.push({
        key: 'paymentStatus',
        label: `Payment Status: ${displayLabel}`,
        value: allOrdersFilterPaymentStatus,
      });
    }
    if (filterStatus) {
      filters.push({
        key: 'status',
        label: `Status: ${filterStatus}`,
        value: filterStatus,
      });
    }
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
    filterStatus,
    filterMode,
    allOrdersFilterMonth,
    filterYear,
    dateRangeFrom,
    dateRangeTo,
  ]);

  const handleSort = (column) => {
    if (!column) return; // Ignore clicks on non-sortable columns
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection(column === 'orderId' ? 'desc' : column === 'date' ? 'desc' : 'asc');
    }
  };

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
      case 'paymentStatus':
        setAllOrdersFilterPaymentStatus('');
        if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus('');
        break;
      case 'status':
        setFilterStatus('');
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
      default:
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
      // Normalize status for bulk operations - use 'Unpaid' for pending (consistent with UI dropdowns)
      const normalizedStatus = action === 'paid' ? 'Paid' : 'Unpaid';
      const statusLabel = action === 'paid' ? 'Paid' : 'Unpaid';
      
      if (showConfirmation) {
        showConfirmation({
          title: `Mark as ${statusLabel}`,
          message: `Are you sure you want to mark ${count} selected order${
            count > 1 ? 's' : ''
          } as ${statusLabel.toLowerCase()}?`,
          type: 'info',
          confirmText: `Mark as ${statusLabel}`,
          onConfirm: async () => {
            try {
              // Update all selected orders with normalized status
              // Skip confirmation for bulk operations (already confirmed above)
              for (const id of selectedOrderIds) {
                if (onUpdateOrderStatus) {
                  await onUpdateOrderStatus(id, normalizedStatus, true);
                }
              }
              setSelectedRows(new Set());
              setSelectAll(false);
              if (showNotification)
                showNotification(`Selected orders marked as ${statusLabel.toLowerCase()}`, 'success');
              // Refresh to ensure filters work correctly with updated data
              if (loadOrders) {
                setTimeout(() => {
                  loadOrders();
                }, 300);
              }
            } catch (error) {
              console.error('Error updating order status:', error);
              if (showNotification) showNotification('Error updating order status', 'error');
              // Refresh on error to get accurate state
              if (loadOrders) loadOrders();
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
            {/* Payment Status Filter - Groups Paid vs Unpaid */}
            <select
              className='input-field filter-select'
              value={allOrdersFilterPaymentStatus}
              onChange={(e) => {
                setAllOrdersFilterPaymentStatus(e.target.value);
                if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus(e.target.value);
                // Clear the specific status filter when using payment status filter
                if (e.target.value) {
                  setFilterStatus('');
                }
              }}
              title='Filter by Payment Status'
            >
              <option value=''>All Payment Status</option>
              <option value='paid'>Paid</option>
              <option value='unpaid'>Unpaid</option>
              <option value='pending'>Pending</option>
            </select>

            <select
              className='input-field filter-select'
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                // Clear payment status filter when using specific status filter
                if (e.target.value) {
                  setAllOrdersFilterPaymentStatus('');
                  if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus('');
                }
              }}
              title='Filter by Exact Status'
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
              title='Filter by Payment Mode'
            >
              <option value=''>All Payment Modes</option>
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
          {selectedRows.size > 0 && (
            <div className='bulk-actions-bar-inline'>
              <span className='bulk-actions-label'>{selectedRows.size} selected</span>
              <div className='action-buttons-group'>
                <button
                  className='btn btn-success btn-small'
                  onClick={() => handleBulkAction('paid')}
                >
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
          {/* Clear Filters - Outside quick filters for better layout */}
          {(allOrdersFilterPaymentStatus ||
            filterStatus ||
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
            {/* BULK ACTIONS BAR - Inline with Select All */}
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
                  const isPaid = isPaidStatus(order.status, order.paymentStatus);

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
                        {(() => {
                          // Normalize status to 'Paid' or 'Unpaid' for the dropdown
                          const normalizedStatus = isPaidStatus(order.status, order.paymentStatus) ? 'Paid' : 'Unpaid';
                          const currentStatus = order.status || 'Unpaid';

                          return (
                            <select
                              className={`status-dropdown ${isPaid ? 'status-paid' : 'status-unpaid'}`}
                              value={normalizedStatus}
                              onChange={(e) => {
                                e.stopPropagation();
                                const newStatus = e.target.value;
                                if (newStatus === normalizedStatus) return;

                                // Store the select element to reset if cancelled
                                const selectElement = e.target;

                                if (showConfirmation && onUpdateOrderStatus) {
                                  showConfirmation({
                                    title: 'Update Order Status',
                                    message: `Are you sure you want to change the status of Order ${
                                      order.orderId || order._id
                                    } from "${normalizedStatus}" to "${newStatus}"?`,
                                    type: 'info',
                                    confirmText: 'Update Status',
                                    onConfirm: () => {
                                      // Pass skipConfirmation=true since we already showed confirmation
                                      onUpdateOrderStatus(
                                        order._id || order.orderId,
                                        newStatus,
                                        true
                                      );
                                    },
                                    onCancelCallback: () => {
                                      // Reset select to current value if cancelled
                                      selectElement.value = normalizedStatus;
                                    },
                                  });
                                } else if (onUpdateOrderStatus) {
                                  // Direct update without confirmation
                                  onUpdateOrderStatus(order._id || order.orderId, newStatus, true);
                                } else {
                                  // Reset if no handler
                                  selectElement.value = normalizedStatus;
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value='Paid'>Paid</option>
                              <option value='Unpaid'>Unpaid</option>
                            </select>
                          );
                        })()}
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
