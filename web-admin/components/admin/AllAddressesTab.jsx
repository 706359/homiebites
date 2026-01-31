import { useMemo, useState } from 'react';
import { InlineLoader } from '../loaders/LoaderComponents';
import Icon from '../ui/Icon.jsx';

import {
  formatDate,
  formatDateShort,
  parseOrderDate,
} from './utils/dateUtils.js';
import {
  formatCurrency,
  getOrderAmount,
  sortOrdersByOrderId,
} from './utils/orderUtils.js';

const AllAddressesTab = ({
  orders = [],
  loading = false,
  onViewOrders,
  onContact,
  showNotification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSegment, setFilterSegment] = useState('all');
  const [sortBy, setSortBy] = useState('totalSpent');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

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
      customerMap[address].totalSpent += getOrderAmount(order);

      const orderDate = parseOrderDate(order.date || order.order_date || null);

      if (orderDate) {
        if (
          !customerMap[address].lastOrderDate ||
          orderDate > customerMap[address].lastOrderDate
        ) {
          customerMap[address].lastOrderDate = orderDate;
        }
        if (
          !customerMap[address].firstOrderDate ||
          orderDate < customerMap[address].firstOrderDate
        ) {
          customerMap[address].firstOrderDate = orderDate;
        }
      }

      const mode = order.mode || 'Not Set';
      customerMap[address].preferredMode[mode] =
        (customerMap[address].preferredMode[mode] || 0) + 1;

      const paymentMode = order.paymentMode || 'Not Set';
      customerMap[address].paymentModes[paymentMode] =
        (customerMap[address].paymentModes[paymentMode] || 0) + 1;
    });

    const customers = Object.values(customerMap).map((customer) => {
      const avgOrderValue =
        customer.totalOrders > 0
          ? customer.totalSpent / customer.totalOrders
          : 0;

      const preferredMode =
        Object.entries(customer.preferredMode).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0] || 'N/A';
      const preferredModePercent =
        customer.totalOrders > 0
          ? (customer.preferredMode[preferredMode] / customer.totalOrders) * 100
          : 0;

      const preferredPayment =
        Object.entries(customer.paymentModes).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0] || 'N/A';
      const preferredPaymentPercent =
        customer.totalOrders > 0
          ? (customer.paymentModes[preferredPayment] / customer.totalOrders) *
            100
          : 0;

      let segment = 'New';
      if (customer.totalSpent >= 15000) {
        segment = 'Super VIP';
      } else if (customer.totalSpent >= 8000 && customer.totalSpent < 15000) {
        segment = 'VIP';
      } else if (customer.totalSpent >= 2000 && customer.totalSpent < 8000) {
        segment = 'Regular';
      }

      const isInactive =
        customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo;

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

  const filteredCustomers = useMemo(() => {
    let filtered = [...customerStats];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c) =>
        c.address.toLowerCase().includes(query)
      );
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((c) => !c.isInactive);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((c) => c.isInactive);
    }

    if (filterSegment !== 'all') {
      filtered = filtered.filter((c) => c.segment === filterSegment);
    }

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
  }, [
    customerStats,
    searchQuery,
    filterStatus,
    filterSegment,
    sortBy,
    sortOrder,
  ]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

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

  const inactiveCustomers = useMemo(() => {
    return customerStats.filter((c) => c.isInactive);
  }, [customerStats]);

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

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

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
    if (showNotification)
      showNotification('Customer list exported successfully', 'success');
  };

  if (loading) {
    return (
      <div className="admin-content">
        <InlineLoader message="Loading customers..." />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="admin-content">
        <div className="dashboard-card empty-state-center">
          <div className="empty-state">
            <Icon name="users" className="empty-state-icon" />
            <p>No orders found</p>
            <p className="empty-state-text">
              Add some orders to see customer data here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="kitchen-tab">
        <div className="kitchen-tab-stats admin-stats customer-stats-row">
          <div className="stat-card stat-card-accent customer-stat-card">
            <div className="customer-stat-content">
              <h3 className="customer-stat-number">{segments.total}</h3>
              <p className="customer-stat-label">Total Customers</p>
            </div>
          </div>
          <div className="stat-card stat-card-warning customer-stat-card">
            <Icon
              name="crown"
              className="customer-stat-icon customer-stat-icon-green"
            />
            <div className="customer-stat-content">
              <h3 className="customer-stat-number">{segments.superVip}</h3>
              <p className="customer-stat-label">Super VIP (≥₹15k)</p>
            </div>
          </div>
          <div className="stat-card stat-card-warning customer-stat-card">
            <Icon
              name="star"
              className="customer-stat-icon customer-stat-icon-green"
            />
            <div className="customer-stat-content">
              <h3 className="customer-stat-number">{segments.vip}</h3>
              <p className="customer-stat-label">VIP (₹8k-₹15k)</p>
            </div>
          </div>
          <div className="stat-card stat-card-secondary customer-stat-card">
            <Icon
              name="user"
              className="customer-stat-icon customer-stat-icon-light"
            />
            <div className="customer-stat-content">
              <h3 className="customer-stat-number">{segments.regular}</h3>
              <p className="customer-stat-label">Regular Customers</p>
            </div>
          </div>
          <div className="stat-card stat-card-success customer-stat-card">
            <div className="customer-stat-content">
              <h3 className="customer-stat-number">
                ₹ {formatCurrency(segments.totalRevenue)}
              </h3>
              <p className="customer-stat-label">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card filter-bar-card filter-bar-compact customer-tab-filter-card customer-tab-filter-card-single-line">
          <div className="search-input-wrapper search-input-compact search-input-flex">
            <input
              type="text"
              className="input-field search-input-with-icon"
              placeholder="Search by address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input-field filter-select-compact"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            className="input-field filter-select-compact filter-select-segments"
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
          >
            <option value="all">All Segments</option>
            <option value="Super VIP">Super VIP</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
            <option value="New">New</option>
          </select>

          {(searchQuery ||
            filterStatus !== 'all' ||
            filterSegment !== 'all') && (
            <button
              className="btn btn-ghost btn-small"
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterSegment('all');
              }}
              title="Clear Filters"
            >
              <Icon name="xmark" /> Clear
            </button>
          )}

          {inactiveCustomers.length > 0 && (
            <div className="customer-tab-inactive-alert-inline">
              <span className="customer-tab-inactive-alert-icon" aria-hidden>
                <Icon name="triangle-exclamation" size={18} />
              </span>
              <span className="customer-tab-inactive-alert-text">
                {inactiveCustomers.length} customers haven&apos;t ordered in 30+
                days. Consider re-engaging.
              </span>
            </div>
          )}

          <div className="customer-tab-actions-group">
            <div className="view-toggle-compact">
              <button
                className={`btn btn-ghost btn-icon ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <Icon name="table" />
              </button>
              <button
                className={`btn btn-ghost btn-icon ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
                title="Card View"
              >
                <Icon name="th" />
              </button>
            </div>
            {inactiveCustomers.length > 0 && (
              <button
                className="btn btn-special btn-small"
                onClick={() => setFilterStatus('inactive')}
              >
                View List
              </button>
            )}
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="dashboard-card table-container-card table-container-no-padding">
            <div className="orders-table-container table-wrapper table-wrapper-min-height">
              {filteredCustomers.length === 0 ? (
                <div className="empty-state-center">
                  <div className="empty-state">
                    <Icon name="users" className="empty-state-icon" />
                    <p>No customers found</p>
                    <p className="empty-state-text">
                      {orders.length > 0 && customerStats.length === 0
                        ? `Found ${orders.length} orders, but none have valid delivery addresses.`
                        : searchQuery ||
                            filterStatus !== 'all' ||
                            filterSegment !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'No customer data available. Add orders with delivery addresses to see customers here.'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <table className="orders-table table-full-width">
                    <thead>
                      <tr>
                        <th
                          onClick={() => handleSort('address')}
                          className="cursor-pointer select-none"
                        >
                          Address
                          {sortBy === 'address' && (
                            <Icon
                              name={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                              className="ml-6 text-xs"
                            />
                          )}
                        </th>
                        <th
                          onClick={() => handleSort('totalOrders')}
                          className="cursor-pointer select-none"
                        >
                          Orders
                          {sortBy === 'totalOrders' && (
                            <Icon
                              name={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                              className="ml-6 text-xs"
                            />
                          )}
                        </th>
                        <th
                          onClick={() => handleSort('totalSpent')}
                          className="cursor-pointer select-none"
                        >
                          Total Spent
                          {sortBy === 'totalSpent' && (
                            <Icon
                              name={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                              className="ml-6 text-xs"
                            />
                          )}
                        </th>
                        <th
                          onClick={() => handleSort('avgOrderValue')}
                          className="cursor-pointer select-none"
                        >
                          Avg Order
                          {sortBy === 'avgOrderValue' && (
                            <Icon
                              name={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                              className="ml-6 text-xs"
                            />
                          )}
                        </th>
                        <th
                          onClick={() => handleSort('lastOrder')}
                          className="cursor-pointer select-none"
                        >
                          Last Order
                          {sortBy === 'lastOrder' && (
                            <Icon
                              name={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}
                              className="ml-6 text-xs"
                            />
                          )}
                        </th>
                        <th>Segment</th>
                        <th>Preferred Mode</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
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
                            className="cursor-pointer"
                          >
                            <td>
                              <div className="font-semibold text-primary">
                                {customer.address}
                              </div>
                            </td>
                            <td>
                              <span className="font-semibold">
                                {customer.totalOrders}
                              </span>
                            </td>
                            <td>
                              <span className="font-bold text-accent text-sm">
                                ₹ {formatCurrency(customer.totalSpent)}
                              </span>
                            </td>
                            <td>
                              <span className="font-semibold">
                                ₹ {formatCurrency(customer.avgOrderValue)}
                              </span>
                            </td>
                            <td>
                              <span className="text-xs text-secondary">
                                {formatDateDiff(customer.lastOrderDate)}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-small">
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
                              <span className="text-xs">
                                {customer.preferredMode}
                              </span>
                            </td>
                            <td>
                              {customer.isInactive ? (
                                <span className="badge badge-warning badge-small">
                                  Inactive
                                </span>
                              ) : (
                                <span className="badge badge-success badge-small">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="text-center">
                              <div className="action-buttons-cell">
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-icon action-icon-edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCustomer(customer);
                                  }}
                                  title="Edit"
                                  aria-label="View customer"
                                >
                                  <Icon name="pencil" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-icon action-icon-delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (showNotification)
                                      showNotification(
                                        'Customers are derived from orders. Delete orders from All Orders to remove data.',
                                        'info'
                                      );
                                  }}
                                  title="Delete"
                                  aria-label="Info about deleting customer data"
                                >
                                  <Icon name="trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <div>
                        <button
                          className="btn btn-ghost btn-small"
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <Icon name="chevron-left" /> Previous
                        </button>
                        <span className="pagination-info">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="btn btn-ghost btn-small"
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next <Icon name="chevron-right" />
                        </button>
                      </div>
                      <div className="pagination-container">
                        <span>Show:</span>
                        <select
                          className="pagination-select"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <span>per page</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="customer-cards-grid">
            {filteredCustomers.length === 0 ? (
              <div className="dashboard-card grid-col-full empty-state-center">
                <div className="empty-state">
                  <Icon name="users" className="empty-state-icon" />
                  <p>No customers found</p>
                  <p className="empty-state-text">
                    {orders.length > 0 && customerStats.length === 0
                      ? `Found ${orders.length} orders, but none have valid delivery addresses.`
                      : searchQuery ||
                          filterStatus !== 'all' ||
                          filterSegment !== 'all'
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

                const segmentColors = {
                  'Super VIP': {
                    bg: 'rgba(255, 193, 7, 0.12)',
                    border: 'rgba(255, 193, 7, 0.3)',
                    icon: '👑',
                    color: '#ff9800',
                  },
                  VIP: {
                    bg: 'rgba(68, 144, 49, 0.12)',
                    border: 'rgba(68, 144, 49, 0.3)',
                    icon: '🌟',
                    color: '#449031',
                  },
                  Regular: {
                    bg: 'rgba(59, 130, 246, 0.12)',
                    border: 'rgba(59, 130, 246, 0.3)',
                    icon: '📈',
                    color: '#3b82f6',
                  },
                  New: {
                    bg: 'rgba(156, 163, 175, 0.12)',
                    border: 'rgba(156, 163, 175, 0.3)',
                    icon: '👤',
                    color: '#9ca3af',
                  },
                };

                const segmentStyle =
                  segmentColors[customer.segment] || segmentColors.New;

                return (
                  <div
                    key={idx}
                    className="customer-card-enhanced"
                    data-segment={customer.segment}
                    onClick={() => handleViewCustomer(customer)}
                  >
                    <div className="customer-card-enhanced-content">
                      <h3 className="customer-card-enhanced-title">
                        {customer.address}
                      </h3>

                      <div className="customer-card-enhanced-badges">
                        <span className="customer-card-enhanced-segment-badge">
                          <span className="customer-card-enhanced-segment-icon">
                            {segmentIcon}
                          </span>
                          <span className="customer-card-enhanced-segment-label">
                            {customer.segment}
                          </span>
                        </span>
                        {customer.isInactive ? (
                          <span className="customer-card-enhanced-status-badge inactive">
                            <Icon name="clock" />
                            <span>Inactive</span>
                          </span>
                        ) : (
                          <span className="customer-card-enhanced-status-badge active">
                            <Icon name="check-circle" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>

                      <div className="customer-card-enhanced-stats">
                        <div className="customer-card-enhanced-stat-item">
                          <span className="customer-card-enhanced-stat-label">
                            Orders
                          </span>
                          <span className="customer-card-enhanced-stat-value">
                            {customer.totalOrders}
                          </span>
                        </div>
                        <div className="customer-card-enhanced-stat-item highlight">
                          <span className="customer-card-enhanced-stat-label">
                            Spent
                          </span>
                          <span className="customer-card-enhanced-stat-value">
                            ₹ {formatCurrency(customer.totalSpent)}
                          </span>
                        </div>
                        <div className="customer-card-enhanced-stat-item">
                          <span className="customer-card-enhanced-stat-label">
                            Avg
                          </span>
                          <span className="customer-card-enhanced-stat-value">
                            ₹ {formatCurrency(customer.avgOrderValue)}
                          </span>
                        </div>
                      </div>

                      <div className="customer-card-enhanced-meta">
                        <span className="customer-card-enhanced-meta-item">
                          <Icon name="calendar" />
                          {formatDateDiff(customer.lastOrderDate)}
                        </span>
                        <span className="customer-card-enhanced-meta-item">
                          <Icon name="clock" />
                          {customer.preferredMode}
                        </span>
                      </div>
                    </div>

                    <div className="customer-card-enhanced-actions action-buttons-cell">
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon action-icon-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCustomer(customer);
                        }}
                        title="Edit"
                        aria-label="View customer"
                      >
                        <Icon name="pencil" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon action-icon-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showNotification)
                            showNotification(
                              'Customers are derived from orders. Delete orders from All Orders to remove data.',
                              'info'
                            );
                        }}
                        title="Delete"
                        aria-label="Info about deleting customer data"
                      >
                        <Icon name="trash" />
                      </button>
                      {onViewOrders && (
                        <button
                          className="btn btn-ghost btn-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewOrders(customer.address);
                          }}
                          title="View Orders"
                        >
                          <Icon name="list" /> View Orders
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {viewMode === 'cards' && totalPages > 1 && (
          <div className="pagination-controls">
            <div>
              <button
                className="btn btn-ghost btn-small"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <Icon name="chevron-left" /> Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-ghost btn-small"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next <Icon name="chevron-right" />
              </button>
            </div>
          </div>
        )}

        {showCustomerModal && selectedCustomer && (
          <div
            className="modal-overlay"
            onClick={() => setShowCustomerModal(false)}
          >
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="modal-breadcrumb" aria-label="Breadcrumb">
                Customers{' '}
                <span className="modal-breadcrumb-sep" aria-hidden="true">
                  ›
                </span>{' '}
                {selectedCustomer.address}
              </nav>
              <div className="modal-header">
                <h2>{selectedCustomer.address} Customer Details</h2>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon modal-close"
                  onClick={() => setShowCustomerModal(false)}
                  aria-label="Close"
                >
                  <Icon name="times" />
                </button>
              </div>
              <div className="modal-body">
                <div className="filter-bar-flex-col">
                  <div>
                    <h3 className="section-title-mb">Customer Information</h3>
                    <div className="customer-detail-grid">
                      <div>
                        <span className="customer-detail-label">Status:</span>
                        <span className="badge badge-success customer-detail-value-sm">
                          🟢 Active
                        </span>
                      </div>
                      <div>
                        <span className="customer-detail-label">
                          Customer Since:
                        </span>
                        <span className="customer-detail-value">
                          {selectedCustomer.firstOrderDate
                            ? formatDateShort(selectedCustomer.firstOrderDate)
                            : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="customer-detail-label">
                          Total Orders:
                        </span>
                        <span className="customer-detail-value">
                          {selectedCustomer.totalOrders}
                        </span>
                      </div>
                      <div>
                        <span className="customer-detail-label">
                          Total Spent:
                        </span>
                        <span className="customer-detail-value font-bold text-accent">
                          ₹ {formatCurrency(selectedCustomer.totalSpent)}
                        </span>
                      </div>
                      <div>
                        <span className="customer-detail-label">
                          Average Order Value:
                        </span>
                        <span className="customer-detail-value">
                          ₹ {formatCurrency(selectedCustomer.avgOrderValue)}
                        </span>
                      </div>
                      <div>
                        <span className="customer-detail-label">
                          Preferred Mode:
                        </span>
                        <span className="customer-detail-value">
                          {selectedCustomer.preferredMode} (
                          {selectedCustomer.preferredModePercent.toFixed(0)}%)
                        </span>
                      </div>
                      <div>
                        <span className="customer-detail-label">
                          Payment Mode:
                        </span>
                        <span className="customer-detail-value">
                          {selectedCustomer.preferredPayment} (
                          {selectedCustomer.preferredPaymentPercent.toFixed(0)}
                          %)
                        </span>
                      </div>
                      <div>
                        <span className="customer-detail-label">
                          Last Order:
                        </span>
                        <span className="customer-detail-value">
                          {formatDateDiff(selectedCustomer.lastOrderDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="section-title-mb">
                      Order History (Last 10)
                    </h3>
                    <div className="orders-table-container">
                      <table className="orders-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Qty</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortOrdersByOrderId(selectedCustomer.orders || [])
                            .slice(0, 10)
                            .map((order, idx) => {
                              const orderDate = parseOrderDate(
                                order.date || order.order_date || null
                              );
                              const dateStr = formatDate(orderDate);
                              const isPaid =
                                (order.status || '').toLowerCase() === 'paid';

                              return (
                                <tr key={idx}>
                                  <td>{dateStr}</td>
                                  <td>{order.quantity || 1}</td>
                                  <td>
                                    ₹ {formatCurrency(getOrderAmount(order))}
                                  </td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        isPaid
                                          ? 'badge-success'
                                          : 'badge-warning'
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
              <div className="modal-footer">
                <button
                  className="btn btn-small btn-section-link"
                  onClick={() => {
                    setShowCustomerModal(false);
                    if (onViewOrders) onViewOrders(selectedCustomer.address);
                  }}
                >
                  View All Orders{' '}
                  <span className="section-link-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCustomerModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAddressesTab;
