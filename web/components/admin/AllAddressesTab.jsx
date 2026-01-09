// Tab 5: Customers (All Addresses) - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useMemo, useState } from 'react';
import { formatDate, formatDateShort, parseOrderDate } from './utils/dateUtils.js';
import { formatCurrency } from './utils/orderUtils.js';
import PremiumLoader from './PremiumLoader.jsx';

const AllAddressesTab = ({
  orders = [],
  loading = false,
  onViewOrders,
  onContact,
  showNotification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [filterSegment, setFilterSegment] = useState('all'); // 'all', 'Super VIP', 'VIP', 'Regular', 'New'
  const [sortBy, setSortBy] = useState('totalSpent'); // 'totalSpent', 'totalOrders', 'lastOrder'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [viewMode, setViewMode] = useState('table'); // 'table', 'cards'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Calculate customer stats
  const customerStats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }


    const customerMap = {};
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let ordersWithAddresses = 0;
    let ordersWithoutAddresses = 0;

    orders.forEach((order, idx) => {
      // Try multiple possible field names for address
      const address =
        order.deliveryAddress ||
        order.customerAddress ||
        order.address ||
        order['Delivery Address'] ||
        order['delivery_address'] ||
        order['customer_address'];

      if (!address || !address.trim()) {
        ordersWithoutAddresses++;
        return;
      }

      ordersWithAddresses++;

      if (!customerMap[address]) {
        customerMap[address] = {
          address,
          orders: [],
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: null,
          preferredMode: {},
          paymentModes: {},
          firstOrderDate: null,
        };
      }

      customerMap[address].orders.push(order);
      customerMap[address].totalOrders++;
      const orderTotal = parseFloat(order.total || order.totalAmount || 0);
      customerMap[address].totalSpent += isNaN(orderTotal) ? 0 : orderTotal;

      // Parse order date with better error handling
      // Never use createdAt (today's date) as fallback - only use actual order date
      const orderDate = parseOrderDate(order.date || order.order_date || null);

      if (orderDate) {
        if (!customerMap[address].lastOrderDate || orderDate > customerMap[address].lastOrderDate) {
          customerMap[address].lastOrderDate = orderDate;
        }
        if (
          !customerMap[address].firstOrderDate ||
          orderDate < customerMap[address].firstOrderDate
        ) {
          customerMap[address].firstOrderDate = orderDate;
        }
      }

      // Preferred mode
      const mode = order.mode || 'Not Set';
      customerMap[address].preferredMode[mode] =
        (customerMap[address].preferredMode[mode] || 0) + 1;

      // Payment mode
      const paymentMode = order.paymentMode || 'Not Set';
      customerMap[address].paymentModes[paymentMode] =
        (customerMap[address].paymentModes[paymentMode] || 0) + 1;
    });

    // Convert to array and calculate additional stats
    const customers = Object.values(customerMap).map((customer) => {
      const avgOrderValue =
        customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

      // Get preferred mode
      const preferredMode =
        Object.entries(customer.preferredMode).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
      const preferredModePercent =
        customer.totalOrders > 0
          ? (customer.preferredMode[preferredMode] / customer.totalOrders) * 100
          : 0;

      // Get preferred payment mode
      const preferredPayment =
        Object.entries(customer.paymentModes).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
      const preferredPaymentPercent =
        customer.totalOrders > 0
          ? (customer.paymentModes[preferredPayment] / customer.totalOrders) * 100
          : 0;

      // Determine customer segment based on spending
      // New: < ₹2,000
      // Regular: ₹2,000 - ₹7,999
      // VIP: ₹8,000 - ₹14,999
      // Super VIP: ≥ ₹15,000
      let segment = 'New';
      if (customer.totalSpent >= 15000) {
        segment = 'Super VIP';
      } else if (customer.totalSpent >= 8000 && customer.totalSpent < 15000) {
        segment = 'VIP';
      } else if (customer.totalSpent >= 2000 && customer.totalSpent < 8000) {
        segment = 'Regular';
      }

      // Determine if inactive (no order in 30+ days)
      const isInactive = customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo;

      return {
        ...customer,
        avgOrderValue,
        preferredMode,
        preferredModePercent,
        preferredPayment,
        preferredPaymentPercent,
        segment,
        isInactive,
      };
    });

    return customers;
  }, [orders]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...customerStats];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c) => c.address.toLowerCase().includes(query));
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter((c) => !c.isInactive);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((c) => c.isInactive);
    }

    // Segment filter
    if (filterSegment !== 'all') {
      filtered = filtered.filter((c) => c.segment === filterSegment);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'totalSpent':
          comparison = b.totalSpent - a.totalSpent;
          break;
        case 'totalOrders':
          comparison = b.totalOrders - a.totalOrders;
          break;
        case 'lastOrder':
          if (!a.lastOrderDate && !b.lastOrderDate) comparison = 0;
          else if (!a.lastOrderDate) comparison = 1;
          else if (!b.lastOrderDate) comparison = -1;
          else comparison = b.lastOrderDate - a.lastOrderDate;
          break;
        case 'address':
          comparison = a.address.localeCompare(b.address);
          break;
        case 'avgOrderValue':
          comparison = b.avgOrderValue - a.avgOrderValue;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [customerStats, searchQuery, filterStatus, filterSegment, sortBy, sortOrder]);

  // Pagination
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Customer segments and totals
  const segments = useMemo(() => {
    return {
      superVip: customerStats.filter((c) => c.segment === 'Super VIP').length,
      vip: customerStats.filter((c) => c.segment === 'VIP').length,
      regular: customerStats.filter((c) => c.segment === 'Regular').length,
      new: customerStats.filter((c) => c.segment === 'New').length,
      total: customerStats.length,
      totalRevenue: customerStats.reduce((sum, c) => sum + c.totalSpent, 0),
    };
  }, [customerStats]);

  // Inactive customers
  const inactiveCustomers = useMemo(() => {
    return customerStats.filter((c) => c.isInactive);
  }, [customerStats]);

  // Format date difference
  const formatDateDiff = (date) => {
    if (!date) return 'Never';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'Never';
      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return 'Today';
      if (days === 1) return '1 day ago';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      return `${Math.floor(days / 30)} months ago`;
    } catch (e) {
      console.warn('Error formatting date diff:', e);
      return 'Never';
    }
  };

  // Handle view customer details
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // Export customer list
  const handleExport = () => {
    const csvContent =
      'Address,Total Orders,Total Spent,Avg Order Value,Last Order,Segment\n' +
      filteredCustomers
        .map(
          (c) =>
            `"${c.address}","${c.totalOrders}","${c.totalSpent}","${c.avgOrderValue.toFixed(2)}","${
              c.lastOrderDate ? formatDate(c.lastOrderDate) : 'Never'
            }","${c.segment}"`
        )
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    if (showNotification) showNotification('Customer list exported successfully', 'success');
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <PremiumLoader message='Loading customers...' size='large' />
      </div>
    );
  }

  // Show message if no orders
  if (!orders || orders.length === 0) {
    return (
      <div className='admin-content'>
        <div className='dashboard-card' style={{ textAlign: 'center', padding: '48px' }}>
          <div className='empty-state'>
            <i className='fa-solid fa-users empty-state-icon'></i>
            <p>No orders found</p>
            <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
              Add some orders to see customer data here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* ENHANCED STATS SUMMARY */}
      <div
        className='admin-stats customer-stats-row'
        style={{
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'nowrap',
          gap: '16px',
          overflowX: 'auto',
        }}
      >
        {/* Total Customers - Accent/Green Theme */}
        <div className='stat-card stat-card-gradient-accent customer-stat-card'>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>{segments.total}</h3>
            <p className='customer-stat-label'>Total Customers</p>
          </div>
        </div>
        {/* Super VIP Customers - Premium/Gold Theme */}
        <div className='stat-card stat-card-gradient-warning customer-stat-card'>
          <i className='fa-solid fa-crown customer-stat-icon customer-stat-icon-green'></i>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>{segments.superVip}</h3>
            <p className='customer-stat-label'>Super VIP (≥₹15k)</p>
          </div>
        </div>
        {/* VIP Customers - Warning/Orange Theme */}
        <div className='stat-card stat-card-gradient-warning customer-stat-card'>
          <i className='fa-solid fa-star customer-stat-icon customer-stat-icon-green'></i>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>{segments.vip}</h3>
            <p className='customer-stat-label'>VIP (₹8k-₹15k)</p>
          </div>
        </div>
        {/* Regular Customers - Secondary/Brown-Rust Theme */}
        <div className='stat-card stat-card-gradient-secondary customer-stat-card'>
          <i className='fa-solid fa-user customer-stat-icon customer-stat-icon-light'></i>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>{segments.regular}</h3>
            <p className='customer-stat-label'>Regular Customers</p>
          </div>
        </div>
        {/* Total Revenue - Success/Green Theme */}
        <div className='stat-card stat-card-gradient-success customer-stat-card'>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>₹{formatCurrency(segments.totalRevenue)}</h3>
            <p className='customer-stat-label'>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* COMPACT FILTER & SEARCH BAR */}
      <div className='dashboard-card filter-bar-card'>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Search */}
          <div className='search-input-wrapper' style={{ flex: 1, minWidth: '200px' }}>
            <i className='fa-solid fa-search search-input-icon'></i>
            <input
              type='text'
              className='input-field search-input-with-icon'
              placeholder='Search by address...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '13px', padding: '6px 10px' }}
            />
          </div>

          {/* Status Filter */}
          <select
            className='input-field'
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minWidth: '120px', fontSize: '13px', padding: '6px 10px' }}
          >
            <option value='all'>All Status</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
          </select>

          {/* Segment Filter */}
          <select
            className='input-field'
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            style={{ minWidth: '120px', fontSize: '13px', padding: '6px 10px' }}
          >
            <option value='all'>All Segments</option>
            <option value='VIP'>VIP</option>
            <option value='Regular'>Regular</option>
            <option value='New'>New</option>
          </select>

          {/* View Toggle */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              border: '1px solid var(--admin-border)',
              borderRadius: '6px',
              padding: '2px',
            }}
          >
            <button
              className={`btn btn-ghost btn-small ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                background: viewMode === 'table' ? 'var(--admin-accent-light)' : 'transparent',
                color: viewMode === 'table' ? 'var(--admin-accent)' : 'var(--admin-text)',
                border: 'none',
              }}
            >
              <i className='fa-solid fa-table'></i>
            </button>
            <button
              className={`btn btn-ghost btn-small ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                background: viewMode === 'cards' ? 'var(--admin-accent-light)' : 'transparent',
                color: viewMode === 'cards' ? 'var(--admin-accent)' : 'var(--admin-text)',
                border: 'none',
              }}
            >
              <i className='fa-solid fa-th'></i>
            </button>
          </div>

          {/* Export Button */}
          <button
            className='btn btn-secondary btn-small'
            onClick={handleExport}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            <i className='fa-solid fa-download'></i> Export
          </button>

          {/* Clear Filters */}
          {(searchQuery || filterStatus !== 'all' || filterSegment !== 'all') && (
            <button
              className='btn btn-ghost btn-small'
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterSegment('all');
              }}
              style={{ fontSize: '12px', padding: '6px 10px' }}
            >
              <i className='fa-solid fa-xmark' style={{ marginRight: '4px', fontSize: '11px' }}></i>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* INACTIVE CUSTOMERS ALERT */}
      {inactiveCustomers.length > 0 && (
        <div
          className='dashboard-card margin-bottom-24'
          style={{
            background: 'var(--admin-warning-light)',
            border: '2px solid var(--admin-warning)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--admin-warning)', marginBottom: '8px' }}>
                ⚠️ {inactiveCustomers.length} customers haven&apos;t ordered in 30+ days
              </h3>
              <p style={{ color: 'var(--admin-text)', fontSize: '0.9rem' }}>
                Consider reaching out to re-engage these customers
              </p>
            </div>
            <div className='action-buttons-group'>
              <button
                className='btn btn-warning btn-small'
                onClick={() => {
                  setFilterStatus('inactive');
                }}
              >
                View List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className='dashboard-card' style={{ padding: 0, overflow: 'hidden' }}>
          <div className='orders-table-container' style={{ minHeight: '400px' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <div className='empty-state'>
                  <i className='fa-solid fa-users empty-state-icon'></i>
                  <p>No customers found</p>
                  <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
                    {orders.length > 0 && customerStats.length === 0
                      ? `Found ${orders.length} orders, but none have valid delivery addresses.`
                      : searchQuery || filterStatus !== 'all' || filterSegment !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'No customer data available. Add orders with delivery addresses to see customers here.'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <table className='orders-table' style={{ width: '100%', display: 'table' }}>
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSort('address')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Address
                        {sortBy === 'address' && (
                          <i
                            className={`fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                            style={{ marginLeft: '6px', fontSize: '10px' }}
                          ></i>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('totalOrders')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Orders
                        {sortBy === 'totalOrders' && (
                          <i
                            className={`fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                            style={{ marginLeft: '6px', fontSize: '10px' }}
                          ></i>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('totalSpent')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Total Spent
                        {sortBy === 'totalSpent' && (
                          <i
                            className={`fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                            style={{ marginLeft: '6px', fontSize: '10px' }}
                          ></i>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('avgOrderValue')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Avg Order
                        {sortBy === 'avgOrderValue' && (
                          <i
                            className={`fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                            style={{ marginLeft: '6px', fontSize: '10px' }}
                          ></i>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('lastOrder')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Last Order
                        {sortBy === 'lastOrder' && (
                          <i
                            className={`fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                            style={{ marginLeft: '6px', fontSize: '10px' }}
                          ></i>
                        )}
                      </th>
                      <th>Segment</th>
                      <th>Preferred Mode</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCustomers.map((customer, idx) => {
                      const segmentColor =
                        customer.segment === 'Super VIP'
                          ? 'var(--admin-warning)'
                          : customer.segment === 'VIP'
                            ? 'var(--admin-accent)'
                            : customer.segment === 'Regular'
                              ? 'var(--admin-success)'
                              : 'var(--admin-text-secondary)';
                      return (
                        <tr
                          key={idx}
                          onClick={() => handleViewCustomer(customer)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div style={{ fontWeight: '600', color: 'var(--admin-text-primary)' }}>
                              {customer.address}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: '600' }}>{customer.totalOrders}</span>
                          </td>
                          <td>
                            <span
                              style={{
                                fontWeight: '700',
                                color: 'var(--admin-accent)',
                                fontSize: '14px',
                              }}
                            >
                              ₹{formatCurrency(customer.totalSpent)}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: '600' }}>
                              ₹{formatCurrency(customer.avgOrderValue)}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}
                            >
                              {formatDateDiff(customer.lastOrderDate)}
                            </span>
                          </td>
                          <td>
                            <span
                              className='badge'
                              style={{
                                background: segmentColor + '20',
                                color: segmentColor,
                                fontSize: '11px',
                                fontWeight: '600',
                                padding: '4px 8px',
                              }}
                            >
                              {customer.segment === 'Super VIP'
                                ? '👑'
                                : customer.segment === 'VIP'
                                  ? '🌟'
                                  : customer.segment === 'Regular'
                                    ? '📈'
                                    : '👤'}{' '}
                              {customer.segment}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '12px' }}>{customer.preferredMode}</span>
                          </td>
                          <td>
                            {customer.isInactive ? (
                              <span className='badge badge-warning' style={{ fontSize: '11px' }}>
                                Inactive
                              </span>
                            ) : (
                              <span className='badge badge-success' style={{ fontSize: '11px' }}>
                                Active
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className='btn btn-primary btn-small'
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onViewOrders) onViewOrders(customer.address);
                              }}
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                              <i className='fa-solid fa-list'></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      borderTop: '1px solid var(--admin-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
                        Show:
                      </span>
                      <select
                        className='input-field'
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        style={{ fontSize: '12px', padding: '4px 8px', minWidth: '80px' }}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>
                        of {filteredCustomers.length} customers
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className='btn btn-ghost btn-small'
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        <i className='fa-solid fa-chevron-left'></i>
                      </button>
                      <span style={{ fontSize: '13px', color: 'var(--admin-text)' }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className='btn btn-ghost btn-small'
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        <i className='fa-solid fa-chevron-right'></i>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* CARD VIEW */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredCustomers.length === 0 ? (
            <div
              className='dashboard-card'
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}
            >
              <div className='empty-state'>
                <i className='fa-solid fa-users empty-state-icon'></i>
                <p>No customers found</p>
                <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>
                  {orders.length > 0 && customerStats.length === 0
                    ? `Found ${orders.length} orders, but none have valid delivery addresses.`
                    : searchQuery || filterStatus !== 'all' || filterSegment !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'No customer data available. Add orders with delivery addresses to see customers here.'}
                </p>
              </div>
            </div>
          ) : (
            paginatedCustomers.map((customer, idx) => {
              const segmentIcon =
                customer.segment === 'Super VIP'
                  ? '👑'
                  : customer.segment === 'VIP'
                    ? '🌟'
                    : customer.segment === 'Regular'
                      ? '📈'
                      : '👤';
              const segmentLabel =
                customer.segment === 'Super VIP'
                  ? 'Super VIP Customer'
                  : customer.segment === 'VIP'
                    ? 'VIP Customer'
                    : customer.segment === 'Regular'
                      ? 'Regular Customer'
                      : 'New Customer';

              return (
                <div
                  key={idx}
                  className='dashboard-card'
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onClick={() => handleViewCustomer(customer)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h3 style={{ marginBottom: '4px', fontSize: '1.2rem' }}>
                        {customer.address}
                      </h3>
                      <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem' }}>
                        {segmentIcon} {segmentLabel}
                      </p>
                    </div>
                    {customer.isInactive && (
                      <span className='badge badge-warning' style={{ fontSize: '0.75rem' }}>
                        Inactive
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Total Orders:</span>
                      <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                        {customer.totalOrders}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Total Spent:</span>
                      <span
                        style={{
                          fontWeight: '700',
                          color: 'var(--admin-accent)',
                          fontSize: '1.1rem',
                        }}
                      >
                        ₹{formatCurrency(customer.totalSpent)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Avg Order:</span>
                      <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                        ₹{formatCurrency(customer.avgOrderValue)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Last Order:</span>
                      <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                        {formatDateDiff(customer.lastOrderDate)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Preferred:</span>
                      <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>
                        {customer.preferredMode}
                      </span>
                    </div>
                  </div>

                  <div className='action-buttons-group' style={{ marginTop: '16px' }}>
                    <button
                      className='btn btn-primary btn-small btn-full'
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onViewOrders) onViewOrders(customer.address);
                      }}
                    >
                      <i className='fa-solid fa-list'></i> View Orders
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Card View Pagination */}
      {viewMode === 'cards' && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '24px',
          }}
        >
          <button
            className='btn btn-ghost btn-small'
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <i className='fa-solid fa-chevron-left'></i> Previous
          </button>
          <span style={{ fontSize: '14px', color: 'var(--admin-text)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className='btn btn-ghost btn-small'
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next <i className='fa-solid fa-chevron-right'></i>
          </button>
        </div>
      )}

      {/* CUSTOMER DETAILS MODAL */}
      {showCustomerModal && selectedCustomer && (
        <div className='modal-overlay' onClick={() => setShowCustomerModal(false)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>{selectedCustomer.address} Customer Details</h2>
              <button className='modal-close' onClick={() => setShowCustomerModal(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body'>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Customer Info */}
                <div>
                  <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '700' }}>
                    Customer Information
                  </h3>
                  <div
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}
                  >
                    <div>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Status:</span>
                      <span
                        className='badge badge-success'
                        style={{ marginLeft: '8px', fontSize: '0.85rem' }}
                      >
                        🟢 Active
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Customer Since:</span>
                      <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                        {selectedCustomer.firstOrderDate
                          ? formatDateShort(selectedCustomer.firstOrderDate)
                          : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Total Orders:</span>
                      <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                        {selectedCustomer.totalOrders}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Total Spent:</span>
                      <span
                        style={{
                          marginLeft: '8px',
                          fontWeight: '700',
                          color: 'var(--admin-accent)',
                        }}
                      >
                        ₹{formatCurrency(selectedCustomer.totalSpent)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>
                        Average Order Value:
                      </span>
                      <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                        ₹{formatCurrency(selectedCustomer.avgOrderValue)}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Preferred Mode:</span>
                      <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                        {selectedCustomer.preferredMode} (
                        {selectedCustomer.preferredModePercent.toFixed(0)}%)
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Payment Mode:</span>
                      <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                        {selectedCustomer.preferredPayment} (
                        {selectedCustomer.preferredPaymentPercent.toFixed(0)}%)
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Last Order:</span>
                      <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                        {formatDateDiff(selectedCustomer.lastOrderDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div>
                  <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '700' }}>
                    Order History (Last 10)
                  </h3>
                  <div className='orders-table-container'>
                    <table className='orders-table'>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Qty</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.orders
                          .sort((a, b) => {
                            // Never use createdAt (today's date) as fallback - only use actual order date
                            const dateA = new Date(a.date || a.order_date || 0);
                            const dateB = new Date(b.date || b.order_date || 0);
                            return dateB - dateA;
                          })
                          .slice(0, 10)
                          .map((order, idx) => {
                            const orderDate = parseOrderDate(
                              // Never use createdAt (today's date) as fallback - only use actual order date
                              order.date || order.order_date || null
                            );
                            const dateStr = formatDate(orderDate);
                            const isPaid = (order.status || '').toLowerCase() === 'paid';

                            return (
                              <tr key={idx}>
                                <td>{dateStr}</td>
                                <td>{order.quantity || 1}</td>
                                <td>₹{formatCurrency(order.total || order.totalAmount || 0)}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      isPaid ? 'badge-success' : 'badge-warning'
                                    }`}
                                  >
                                    {order.status || 'No Status'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button
                className='btn btn-secondary'
                onClick={() => {
                  setShowCustomerModal(false);
                  if (onViewOrders) onViewOrders(selectedCustomer.address);
                }}
              >
                View All Orders
              </button>
              <button className='btn btn-primary' onClick={() => setShowCustomerModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAddressesTab;
