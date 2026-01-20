import { useEffect, useMemo, useState } from 'react';
import SkeletonLoader from './SkeletonLoader.jsx';
import { formatDate, parseOrderDate } from './utils/dateUtils.js';
import {
  extractOrderIdSequence,
  formatBillingMonth,
  formatCurrency,
  isPaidStatus,
  isPendingStatus,
  sortOrdersByOrderId,
} from './utils/orderUtils.js';
import { useDebounce } from './utils/useDebounce.js';

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
  initialDateFilter = null,
}) => {
  // Mobile detection for responsive layout
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 480 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [filtersExpanded, setFiltersExpanded] = useState(!!initialDateFilter);
  const [showFilterWrapper, setShowFilterWrapper] = useState(false);
  const [dateRangeFrom, setDateRangeFrom] = useState(initialDateFilter || '');
  const [dateRangeTo, setDateRangeTo] = useState(initialDateFilter || '');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Load filters from localStorage on mount (defensive: invalid/corrupt data is ignored)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('admin_all_orders_filters');
      if (!raw || typeof raw !== 'string') return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return;
      const filters = parsed;
      if (typeof filters.allOrdersFilterMonth === 'string') setAllOrdersFilterMonth(filters.allOrdersFilterMonth);
      if (typeof filters.allOrdersFilterAddress === 'string') setAllOrdersFilterAddress(filters.allOrdersFilterAddress);
      if (typeof filters.allOrdersFilterPaymentStatus === 'string') setAllOrdersFilterPaymentStatus(filters.allOrdersFilterPaymentStatus);
      if (typeof filters.dateRangeFrom === 'string') setDateRangeFrom(filters.dateRangeFrom);
      if (typeof filters.dateRangeTo === 'string') setDateRangeTo(filters.dateRangeTo);
      if (typeof filters.filterStatus === 'string') setFilterStatus(filters.filterStatus);
      if (typeof filters.filterMode === 'string') setFilterMode(filters.filterMode);
      if (typeof filters.filterPayment === 'string') setFilterPayment(filters.filterPayment);
      if (typeof filters.filterYear === 'string') setFilterYear(filters.filterYear);
      if (typeof filters.filterAddress === 'string') setFilterAddress(filters.filterAddress);
      if (typeof filters.searchQuery === 'string') setSearchQuery(filters.searchQuery);
    } catch {
      // ignore: corrupted or non-JSON; start with default filters
    }
  }, []);

  // Override with initialDateFilter if provided
  useEffect(() => {
    if (initialDateFilter) {
      setDateRangeFrom(initialDateFilter);
      setDateRangeTo(initialDateFilter);
      setFiltersExpanded(true);
    }
  }, [initialDateFilter]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    const filters = {
      allOrdersFilterMonth,
      allOrdersFilterAddress,
      allOrdersFilterPaymentStatus,
      dateRangeFrom,
      dateRangeTo,
      filterStatus,
      filterMode,
      filterPayment,
      filterYear,
      filterAddress,
      searchQuery,
    };
    try {
      localStorage.setItem('admin_all_orders_filters', JSON.stringify(filters));
    } catch (error) {
      console.warn('Failed to save filters to localStorage:', error);
    }
  }, [
    allOrdersFilterMonth,
    allOrdersFilterAddress,
    allOrdersFilterPaymentStatus,
    dateRangeFrom,
    dateRangeTo,
    filterStatus,
    filterMode,
    filterPayment,
    filterYear,
    filterAddress,
    searchQuery,
  ]);

  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredOrders = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    let filtered = [...list];

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
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

    if (allOrdersFilterMonth) {
      filtered = filtered.filter((order) => {
        let month, year;
        if (order.billingMonth && order.billingYear) {
          month = parseInt(order.billingMonth) || new Date().getUTCMonth() + 1;
          year = parseInt(order.billingYear) || new Date().getUTCFullYear();
        } else {
          const orderDate = parseOrderDate(order.date || order.order_date || null);
          if (!orderDate) return false;
          month = orderDate.getUTCMonth() + 1;
          year = orderDate.getUTCFullYear();
        }
        return formatBillingMonth(month, year) === allOrdersFilterMonth;
      });
    }

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

    if (allOrdersFilterPaymentStatus) {
      const statusFilter = allOrdersFilterPaymentStatus.toLowerCase();
      if (statusFilter === 'paid') {
        filtered = filtered.filter((o) => isPaidStatus(o.status, o.paymentStatus));
      } else if (statusFilter === 'pending' || statusFilter === 'unpaid') {
        filtered = filtered.filter((o) => isPendingStatus(o.status, o.paymentStatus));
      }
    }

    if (filterStatus) {
      filtered = filtered.filter((o) => {
        const status = (o.status || '').toLowerCase().trim();
        const filterValue = filterStatus.toLowerCase().trim();

        if (filterValue === 'paid') {
          return isPaidStatus(o.status, o.paymentStatus);
        } else if (filterValue === 'pending' || filterValue === 'unpaid') {
          return isPendingStatus(o.status, o.paymentStatus);
        } else {
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
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter((order) => {
          const orderDate = parseOrderDate(order.date || order.order_date || null);
          return orderDate && orderDate <= toDate;
        });
      }
    }

    if (!sortColumn || sortColumn === 'orderId') {
      const sorted = sortOrdersByOrderId(filtered);
      // sortOrdersByOrderId always sorts descending, so reverse if ascending is requested
      return sortDirection === 'asc' ? sorted.reverse() : sorted;
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
          aVal = Math.max(1, parseInt(a.quantity) || 1);
          bVal = Math.max(1, parseInt(b.quantity) || 1);
          break;
        case 'total': {
          let aTotal = null;
          if (a.totalAmount !== undefined && a.totalAmount !== null) {
            aTotal = parseFloat(a.totalAmount);
          } else if (a.total !== undefined && a.total !== null) {
            aTotal = parseFloat(a.total);
          }
          if (aTotal === null || isNaN(aTotal)) {
            const aQty = Math.max(1, parseInt(a.quantity) || 1);
            const aPrice = parseFloat(a.unitPrice) || 0;
            aTotal = aQty * aPrice;
          }

          let bTotal = null;
          if (b.totalAmount !== undefined && b.totalAmount !== null) {
            bTotal = parseFloat(b.totalAmount);
          } else if (b.total !== undefined && b.total !== null) {
            bTotal = parseFloat(b.total);
          }
          if (bTotal === null || isNaN(bTotal)) {
            const bQty = Math.max(1, parseInt(b.quantity) || 1);
            const bPrice = parseFloat(b.unitPrice) || 0;
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
    debouncedSearchQuery,
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

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / recordsPerPage));
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + recordsPerPage);

  // Reset to page 1 when filters reduce results and current page would be out of bounds
  useEffect(() => {
    if (totalPages >= 1 && currentPage > totalPages && onPageChange) {
      onPageChange(1);
    }
  }, [totalPages, currentPage, onPageChange]);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (allOrdersFilterPaymentStatus) {
      const displayLabel =
        allOrdersFilterPaymentStatus.charAt(0).toUpperCase() +
        allOrdersFilterPaymentStatus.slice(1);
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
    if (!column) return;
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection(column === 'orderId' ? 'desc' : column === 'date' ? 'desc' : 'asc');
    }
  };

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

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set();
    (orders || []).forEach((o) => {
      if (o.status) statuses.add(o.status);
    });
    return Array.from(statuses).sort();
  }, [orders]);

  const uniqueModes = useMemo(() => {
    const modes = new Set();
    (orders || []).forEach((o) => {
      if (o.mode) modes.add(o.mode);
    });
    return Array.from(modes).sort();
  }, [orders]);

  const uniquePaymentModes = useMemo(() => {
    const paymentModes = new Set();
    (orders || []).forEach((o) => {
      if (o.paymentMode) paymentModes.add(o.paymentMode);
    });
    return Array.from(paymentModes).sort();
  }, [orders]);

  const uniqueYears = useMemo(() => {
    const years = new Set();
    (orders || []).forEach((o) => {
      let year;
      if (o.billingYear) {
        year = parseInt(o.billingYear) || new Date().getFullYear();
      } else {
        const orderDate = parseOrderDate(o.date || o.order_date || null);
        if (orderDate) {
          year = orderDate.getFullYear();
        }
      }
      if (year) years.add(year.toString());
    });
    return Array.from(years).sort().reverse();
  }, [orders]);

  const handleExport = () => {
    const csvContent =
      'S.No,Date,Address,Quantity,Price,Total,Mode,Status,Payment,Month,Year,OrderID\n' +
      filteredOrders
        .map((o, idx) => {
          const date = parseOrderDate(o.date || o.order_date || null);

          let month, year;
          if (o.billingMonth && o.billingYear) {
            month = parseInt(o.billingMonth) || new Date().getUTCMonth() + 1;
            year = parseInt(o.billingYear) || new Date().getUTCFullYear();
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
        <div className='dashboard-card table-container-card'>
          <div className='skeleton-action-bar'>
            <div className='skeleton-search-input'></div>
            <div className='skeleton-action-buttons'>
              <div className='skeleton-button'></div>
              <div className='skeleton-button'></div>
              <div className='skeleton-button'></div>
            </div>
          </div>
          <SkeletonLoader type='table' rows={15} cols={10} />
        </div>
      </div>
    );
  }

  return (
    <div className='admin-content'>
      <div className='dashboard-card table-container-card'>
        <div className='action-bar'>
          <div className='search-input-wrapper'>
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
              className='btn btn-ghost btn-small filter-icon-btn'
              onClick={() => setShowFilterWrapper(!showFilterWrapper)}
              title='Filters'
            >
              <i className='fa-solid fa-filter'></i>
              {(allOrdersFilterPaymentStatus ||
                filterStatus ||
                filterMode ||
                filterPayment ||
                filterAddress ||
                dateRangeFrom ||
                dateRangeTo ||
                allOrdersFilterMonth ||
                filterYear) && (
                <span className='filter-badge'>{[
                  allOrdersFilterPaymentStatus,
                  filterStatus,
                  filterMode,
                  filterPayment,
                  filterAddress,
                  dateRangeFrom,
                  dateRangeTo,
                  allOrdersFilterMonth,
                  filterYear,
                ].filter(Boolean).length}</span>
              )}
            </button>
            <button
              className='btn btn-primary btn-small'
              onClick={() => onEditOrder && onEditOrder(null)}
              title='Add Order'
            >
              <i className='fa-solid fa-plus'></i> Add Order
            </button>
            <button className='btn btn-secondary btn-small' onClick={handleExport} title='Export'>
              <i className='fa-solid fa-download'></i> Export
            </button>
          </div>
          <div className='table-info-text'>
            Showing {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredOrders.length)}{' '}
            of {filteredOrders.length} orders
          </div>
        </div>

        {showFilterWrapper && (
        <div className='filter-wrapper-dropdown'>
          <div className='filter-wrapper-header'>
            <h3>Filters</h3>
            <button
              className='btn btn-ghost btn-icon'
              onClick={() => setShowFilterWrapper(false)}
              title='Close'
            >
              <i className='fa-solid fa-times'></i>
            </button>
          </div>
          <div className='filter-wrapper-content'>
            <div className='filter-wrapper-section'>
              <label className='filter-label'>Payment Status</label>
              <div className='premium-select-wrapper'>
                <i className='fa-solid fa-credit-card select-icon'></i>
                <select
                  className='input-field filter-select premium-select'
                  value={allOrdersFilterPaymentStatus}
                  onChange={(e) => {
                    setAllOrdersFilterPaymentStatus(e.target.value);
                    if (setAllOrdersFilterPaymentStatus)
                      setAllOrdersFilterPaymentStatus(e.target.value);

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
                <i className='fa-solid fa-chevron-down dropdown-icon'></i>
              </div>
            </div>

            <div className='filter-wrapper-section'>
              <label className='filter-label'>Status</label>
              <div className='premium-select-wrapper'>
                <i className='fa-solid fa-filter select-icon'></i>
                <select
                  className='input-field filter-select premium-select'
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);

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
                <i className='fa-solid fa-chevron-down dropdown-icon'></i>
              </div>
            </div>

            <div className='filter-wrapper-section'>
              <label className='filter-label'>Mode</label>
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
            </div>

            <div className='filter-wrapper-section'>
              <label className='filter-label'>Payment Mode</label>
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
            </div>

            <div className='filter-wrapper-section'>
              <label className='filter-label'>Date Range</label>
              <div className='filter-input-group'>
                <input
                  type='date'
                  className='input-field filter-input'
                  value={dateRangeFrom}
                  onChange={(e) => setDateRangeFrom(e.target.value)}
                  placeholder='From'
                />
                <span className='filter-date-separator'>to</span>
                <input
                  type='date'
                  className='input-field filter-input'
                  value={dateRangeTo}
                  onChange={(e) => setDateRangeTo(e.target.value)}
                  placeholder='To'
                />
              </div>
            </div>

            <div className='filter-wrapper-section'>
              <label className='filter-label'>Month</label>
              <select
                className='input-field filter-input'
                value={allOrdersFilterMonth || ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setAllOrdersFilterMonth(v);
                  if (setAllOrdersFilterMonth) setAllOrdersFilterMonth(v);
                }}
              >
                <option value=''>All Months</option>
                {uniqueYears.flatMap((year) =>
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                    const val = formatBillingMonth(m, year);
                    if (!val) return null;
                    const short = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1];
                    return (
                      <option key={val} value={val}>
                        {short}&apos;{String(year).slice(-2)}
                      </option>
                    );
                  })
                ).filter(Boolean)}
              </select>
            </div>

            <div className='filter-wrapper-section'>
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

            <div className='filter-wrapper-section'>
              <label className='filter-label'>Address Search</label>
              <div className='search-input-wrapper'>
                <input
                  type='text'
                  className='input-field search-input-with-icon'
                  value={filterAddress}
                  onChange={(e) => setFilterAddress(e.target.value)}
                  placeholder='Search by address...'
                />
              </div>
            </div>

            <div className='filter-wrapper-actions'>
              <button
                className='btn btn-ghost btn-small'
                onClick={() => {
                  setFilterStatus('');
                  setFilterMode('');
                  setFilterPayment('');
                  setFilterAddress('');
                  setDateRangeFrom('');
                  setDateRangeTo('');
                  setFilterYear('');
                  setAllOrdersFilterMonth('');
                  setAllOrdersFilterAddress('');
                  setAllOrdersFilterPaymentStatus('');
                  setSearchQuery('');
                  if (setAllOrdersFilterMonth) setAllOrdersFilterMonth('');
                  if (setAllOrdersFilterAddress) setAllOrdersFilterAddress('');
                  if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus('');
                  // Clear localStorage filters
                  try {
                    localStorage.removeItem('admin_all_orders_filters');
                  } catch (error) {
                    console.warn('Failed to clear filters from localStorage:', error);
                  }
                }}
              >
                <i className='fa-solid fa-xmark'></i> Clear All
              </button>
              <button
                className='btn btn-primary btn-small'
                onClick={() => setShowFilterWrapper(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        )}

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

        <div className='orders-table-container'>
          <table className='orders-table' role='table' aria-label='All orders'>
            <thead>
              <tr>
                <th scope='col' className='sortable-header' aria-sort={sortColumn === null ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort(null)}>
                  S.No {sortColumn === null && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col' className='sortable-header' aria-sort={sortColumn === 'date' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort('date')}>
                  Date {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col' className='sortable-header' aria-sort={sortColumn === 'address' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort('address')}>
                  Address {sortColumn === 'address' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col' className='sortable-header' aria-sort={sortColumn === 'quantity' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort('quantity')}>
                  Qty {sortColumn === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col' className='sortable-header' onClick={() => handleSort(null)}>Price</th>
                <th scope='col' className='sortable-header' aria-sort={sortColumn === 'total' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort('total')}>
                  Total {sortColumn === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col' className='sortable-header col-mode' aria-sort={sortColumn === 'mode' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort('mode')}>
                  Mode {sortColumn === 'mode' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col' className='sortable-header col-status' aria-sort={sortColumn === 'status' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort('status')}>
                  Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col' className='sortable-header col-payment' aria-sort={sortColumn === 'payment' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort('payment')}>
                  Payment {sortColumn === 'payment' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col' className='sortable-header' onClick={() => handleSort(null)}>Month</th>
                <th scope='col' className='sortable-header' onClick={() => handleSort(null)}>Year</th>
                <th scope='col' className='sortable-header col-orderid' aria-sort={sortColumn === 'orderId' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} onClick={() => handleSort('orderId')}>
                  OrderID {sortColumn === 'orderId' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={13} className='empty-state-cell'>
                    <div className='empty-state'>
                      <i className='fa-solid fa-inbox empty-state-icon'></i>
                      <p>No orders found</p>
                      <p className='empty-state-text'>Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, idx) => {
                  const orderDate = parseOrderDate(order.date || order.order_date || null);
                  const dateStr = formatDate(orderDate);

                  let month, year;
                  if (order.billingMonth && order.billingYear) {
                    month = parseInt(order.billingMonth);
                    year = parseInt(order.billingYear);
                  } else if (orderDate) {
                    month = orderDate.getUTCMonth() + 1;
                    year = orderDate.getUTCFullYear();
                  } else {
                    month = null;
                    year = null;
                  }
                  const isPaid = isPaidStatus(order.status, order.paymentStatus);

                  return (
                    <tr
                      key={order._id || order.orderId || idx}
                      className='table-row-clickable'
                      onDoubleClick={() => onEditOrder && onEditOrder(order)}
                    >
                      <td>
                        <div className='order-row-number'>{startIndex + idx + 1}</div>
                      </td>
                      <td>
                        <div className='order-row-date'>
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td>
                        <div className='order-row-address'>
                          <span>
                            {order.deliveryAddress ||
                              order.customerAddress ||
                              order.address ||
                              'N/A'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className='order-row-quantity'>
                          <span>{order.quantity || 1}</span>
                        </div>
                      </td>
                      <td>
                        <div className='order-row-price'>
                          <span className='order-row-price-symbol'>₹</span>
                          <span className='order-row-price-value'>
                            {formatCurrency(order.unitPrice || 0)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className='order-row-total'>
                          <span className='order-row-total-symbol'>₹</span>
                          <span className='order-row-total-value'>
                            {formatCurrency(
                              order.total ||
                                order.totalAmount ||
                                (order.quantity || 1) * (order.unitPrice || 0)
                            )}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className='order-row-mode'>
                          <span className='order-row-mode-badge'>{order.mode || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        {(() => {
                          const normalizedStatus = isPaidStatus(order.status, order.paymentStatus)
                            ? 'Paid'
                            : 'Unpaid';
                          const currentStatus = order.status || 'Unpaid';

                          return (
                            <select
                              className={`status-dropdown-enhanced ${
                                isPaid ? 'status-paid' : 'status-unpaid'
                              }`}
                              value={normalizedStatus}
                              onChange={(e) => {
                                e.stopPropagation();
                                const newStatus = e.target.value;
                                if (newStatus === normalizedStatus) return;

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
                                      onUpdateOrderStatus(
                                        order._id || order.orderId,
                                        newStatus,
                                        true
                                      );
                                    },
                                    onCancelCallback: () => {
                                      selectElement.value = normalizedStatus;
                                    },
                                  });
                                } else if (onUpdateOrderStatus) {
                                  onUpdateOrderStatus(order._id || order.orderId, newStatus, true);
                                } else {
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
                      <td>
                        <div className='order-row-payment-mode'>
                          <span>{order.paymentMode || 'N/A'}</span>
                        </div>
                      </td>
                      <td>{month ? formatBillingMonth(month, year) : 'N/A'}</td>
                      <td>{year || 'N/A'}</td>
                      <td className='monospace-text'>{order.orderId || 'N/A'}</td>
                      <td>
                        <div className='action-buttons-cell'>
                          <button
                            className='btn btn-ghost btn-icon action-icon-edit'
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEditOrder) onEditOrder(order);
                            }}
                            title='Edit'
                          >
                            <i className='fa-solid fa-pencil'></i>
                          </button>
                          <button
                            className='btn btn-ghost btn-icon action-icon-delete'
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
              className='pagination-select'
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
