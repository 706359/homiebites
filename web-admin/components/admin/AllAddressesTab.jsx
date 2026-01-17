import { useMemo, useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';

import { formatDate, formatDateShort, parseOrderDate } from './utils/dateUtils.js';
import { formatCurrency, sortOrdersByOrderId } from './utils/orderUtils.js';

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

      let orderTotal = null;
      if (order.totalAmount !== undefined && order.totalAmount !== null) {
        orderTotal = parseFloat(order.totalAmount);
      } else if (order.total !== undefined && order.total !== null) {
        orderTotal = parseFloat(order.total);
      }

      if (orderTotal === null || isNaN(orderTotal)) {
        const qty = parseFloat(order.quantity || 1);
        const price = parseFloat(order.unitPrice || 0);
        orderTotal = qty * price;
      }

      customerMap[address].totalSpent += isNaN(orderTotal) ? 0 : orderTotal;

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

      const mode = order.mode || 'Not Set';
      customerMap[address].preferredMode[mode] =
        (customerMap[address].preferredMode[mode] || 0) + 1;

      const paymentMode = order.paymentMode || 'Not Set';
      customerMap[address].paymentModes[paymentMode] =
        (customerMap[address].paymentModes[paymentMode] || 0) + 1;
    });

    const customers = Object.values(customerMap).map((customer) => {
      const avgOrderValue =
        customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

      const preferredMode =
        Object.entries(customer.preferredMode).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
      const preferredModePercent =
        customer.totalOrders > 0
          ? (customer.preferredMode[preferredMode] / customer.totalOrders) * 100
          : 0;

      const preferredPayment =
        Object.entries(customer.paymentModes).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
      const preferredPaymentPercent =
        customer.totalOrders > 0
          ? (customer.paymentModes[preferredPayment] / customer.totalOrders) * 100
          : 0;

      let segment = 'New';
      if (customer.totalSpent >= 15000) {
        segment = 'Super VIP';
      } else if (customer.totalSpent >= 8000 && customer.totalSpent < 15000) {
        segment = 'VIP';
      } else if (customer.totalSpent >= 2000 && customer.totalSpent < 8000) {
        segment = 'Regular';
      }

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

  const filteredCustomers = useMemo(() => {
    let filtered = [...customerStats];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c) => c.address.toLowerCase().includes(query));
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
  }, [customerStats, searchQuery, filterStatus, filterSegment, sortBy, sortOrder]);

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
    if (showNotification) showNotification('Customer list exported successfully', 'success');
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <PremiumLoader message='Loading customers...' size='large' />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className='admin-content'>
        <div className='dashboard-card empty-state-center'>
          <div className='empty-state'>
            <i className='fa-solid fa-users empty-state-icon'></i>
            <p>No orders found</p>
            <p className='empty-state-text'>Add some orders to see customer data here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {}
      <div className='admin-stats customer-stats-row'>
        {}
        <div className='stat-card stat-card-gradient-accent customer-stat-card'>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>{segments.total}</h3>
            <p className='customer-stat-label'>Total Customers</p>
          </div>
        </div>
        {}
        <div className='stat-card stat-card-gradient-warning customer-stat-card'>
          <i className='fa-solid fa-crown customer-stat-icon customer-stat-icon-green'></i>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>{segments.superVip}</h3>
            <p className='customer-stat-label'>Super VIP (≥₹15k)</p>
          </div>
        </div>
        {}
        <div className='stat-card stat-card-gradient-warning customer-stat-card'>
          <i className='fa-solid fa-star customer-stat-icon customer-stat-icon-green'></i>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>{segments.vip}</h3>
            <p className='customer-stat-label'>VIP (₹8k-₹15k)</p>
          </div>
        </div>
        {}
        <div className='stat-card stat-card-gradient-secondary customer-stat-card'>
          <i className='fa-solid fa-user customer-stat-icon customer-stat-icon-light'></i>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>{segments.regular}</h3>
            <p className='customer-stat-label'>Regular Customers</p>
          </div>
        </div>
        {}
        <div className='stat-card stat-card-gradient-success customer-stat-card'>
          <div className='customer-stat-content'>
            <h3 className='customer-stat-number'>₹{formatCurrency(segments.totalRevenue)}</h3>
            <p className='customer-stat-label'>Total Revenue</p>
          </div>
        </div>
      </div>

      {}
      <div className='dashboard-card filter-bar-card filter-bar-compact'>
        <div className='filter-bar-container-compact'>
          {}
          <div className='search-input-wrapper search-input-compact search-input-flex'>
            <i className='fa-solid fa-search search-input-icon'></i>
            <input
              type='text'
              className='input-field search-input-with-icon'
              placeholder='Search by address...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {}
          <select
            className='input-field filter-select-compact'
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value='all'>All Status</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
          </select>

          {}
          <select
            className='input-field filter-select-compact'
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
          >
            <option value='all'>All Segments</option>
            <option value='VIP'>VIP</option>
            <option value='Regular'>Regular</option>
            <option value='New'>New</option>
          </select>

          {}
          <div className='view-toggle-compact'>
            <button
              className={`btn btn-ghost btn-icon-compact ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title='Table View'
            >
              <i className='fa-solid fa-table'></i>
            </button>
            <button
              className={`btn btn-ghost btn-icon-compact ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title='Card View'
            >
              <i className='fa-solid fa-th'></i>
            </button>
          </div>

          {}
          <button
            className='btn btn-secondary btn-small btn-compact'
            onClick={handleExport}
            title='Export'
          >
            <i className='fa-solid fa-download'></i> Export
          </button>

          {}
          {(searchQuery || filterStatus !== 'all' || filterSegment !== 'all') && (
            <button
              className='btn btn-ghost btn-small btn-compact'
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterSegment('all');
              }}
              title='Clear Filters'
            >
              <i className='fa-solid fa-xmark'></i> Clear
            </button>
          )}
        </div>
      </div>

      {}
      {inactiveCustomers.length > 0 && (
        <div className='dashboard-card margin-bottom-24'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-warning mb-8'>
                ⚠️ {inactiveCustomers.length} customers haven&apos;t ordered in 30+ days
              </h3>
              <p className='text-base'>Consider reaching out to re-engage these customers</p>
            </div>
            <div className='action-buttons-group'>
              <button
                className='btn btn-special btn-small'
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

      {}
      {viewMode === 'table' ? (
        <div className='dashboard-card table-container-card table-container-no-padding'>
          <div className='orders-table-container table-wrapper table-wrapper-min-height'>
            {filteredCustomers.length === 0 ? (
              <div className='empty-state-center'>
                <div className='empty-state'>
                  <i className='fa-solid fa-users empty-state-icon'></i>
                  <p>No customers found</p>
                  <p className='empty-state-text'>
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
                <table className='orders-table table-full-width'>
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSort('address')}
                        className='cursor-pointer select-none'
                      >
                        Address
                        {sortBy === 'address' && (
                          <i
                            className={`fa-solid fa-arrow-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ml-6 text-xs`}
                          ></i>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('totalOrders')}
                        className='cursor-pointer select-none'
                      >
                        Orders
                        {sortBy === 'totalOrders' && (
                          <i
                            className={`fa-solid fa-arrow-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ml-6 text-xs`}
                          ></i>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('totalSpent')}
                        className='cursor-pointer select-none'
                      >
                        Total Spent
                        {sortBy === 'totalSpent' && (
                          <i
                            className={`fa-solid fa-arrow-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ml-6 text-xs`}
                          ></i>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('avgOrderValue')}
                        className='cursor-pointer select-none'
                      >
                        Avg Order
                        {sortBy === 'avgOrderValue' && (
                          <i
                            className={`fa-solid fa-arrow-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ml-6 text-xs`}
                          ></i>
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('lastOrder')}
                        className='cursor-pointer select-none'
                      >
                        Last Order
                        {sortBy === 'lastOrder' && (
                          <i
                            className={`fa-solid fa-arrow-${
                              sortOrder === 'asc' ? 'up' : 'down'
                            } ml-6 text-xs`}
                          ></i>
                        )}
                      </th>
                      <th>Segment</th>
                      <th>Preferred Mode</th>
                      <th>Status</th>
                      <th className='text-center'>Actions</th>
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
                          className='cursor-pointer'
                        >
                          <td>
                            <div className='font-semibold text-primary'>{customer.address}</div>
                          </td>
                          <td>
                            <span className='font-semibold'>{customer.totalOrders}</span>
                          </td>
                          <td>
                            <span className='font-bold text-accent text-sm'>
                              ₹{formatCurrency(customer.totalSpent)}
                            </span>
                          </td>
                          <td>
                            <span className='font-semibold'>
                              ₹{formatCurrency(customer.avgOrderValue)}
                            </span>
                          </td>
                          <td>
                            <span className='text-xs text-secondary'>
                              {formatDateDiff(customer.lastOrderDate)}
                            </span>
                          </td>
                          <td>
                            <span className='badge badge-small'>
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
                            <span className='text-xs'>{customer.preferredMode}</span>
                          </td>
                          <td>
                            {customer.isInactive ? (
                              <span className='badge badge-warning badge-small'>Inactive</span>
                            ) : (
                              <span className='badge badge-success badge-small'>Active</span>
                            )}
                          </td>
                          <td className='text-center'>
                            <button
                              className='btn btn-primary btn-small badge-small'
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onViewOrders) onViewOrders(customer.address);
                              }}
                            >
                              <i className='fa-solid fa-list'></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {}
                {totalPages > 1 && (
                  <div className='pagination-controls'>
                    <div>
                      <button
                        className='btn btn-ghost btn-small'
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <i className='fa-solid fa-chevron-left'></i> Previous
                      </button>
                      <span className='pagination-info'>
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
                    <div className='pagination-container'>
                      <span>Show:</span>
                      <select
                        className='input-field pagination-select'
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
        <div className='customer-cards-grid'>
          {filteredCustomers.length === 0 ? (
            <div className='dashboard-card grid-col-full empty-state-center'>
              <div className='empty-state'>
                <i className='fa-solid fa-users empty-state-icon'></i>
                <p>No customers found</p>
                <p className='empty-state-text'>
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

              const segmentColors = {
                'Super VIP': {
                  bg: 'linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%)',
                  border: 'rgba(255, 193, 7, 0.3)',
                  icon: '👑',
                  color: '#ff9800',
                },
                VIP: {
                  bg: 'linear-gradient(135deg, rgba(68, 144, 49, 0.15) 0%, rgba(68, 144, 49, 0.08) 100%)',
                  border: 'rgba(68, 144, 49, 0.3)',
                  icon: '🌟',
                  color: '#449031',
                },
                Regular: {
                  bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
                  border: 'rgba(59, 130, 246, 0.3)',
                  icon: '📈',
                  color: '#3b82f6',
                },
                New: {
                  bg: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 100%)',
                  border: 'rgba(156, 163, 175, 0.3)',
                  icon: '👤',
                  color: '#9ca3af',
                },
              };

              const segmentStyle = segmentColors[customer.segment] || segmentColors.New;

              return (
                <div
                  key={idx}
                  className='customer-card-enhanced'
                  onClick={() => handleViewCustomer(customer)}
                >
                  <div className='customer-card-enhanced-header'>
                    <div className='customer-card-enhanced-segment-badge'>
                      <span className='customer-card-enhanced-segment-icon'>{segmentIcon}</span>
                      <span className='customer-card-enhanced-segment-label'>
                        {customer.segment}
                      </span>
                    </div>
                    {customer.isInactive ? (
                      <span className='customer-card-enhanced-status-badge inactive'>
                        <i className='fa-solid fa-clock'></i>
                        <span>Inactive</span>
                      </span>
                    ) : (
                      <span className='customer-card-enhanced-status-badge active'>
                        <i className='fa-solid fa-check-circle'></i>
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <div className='customer-card-enhanced-body'>
                    <h3 className='customer-card-enhanced-title'>{customer.address}</h3>

                    <div className='customer-card-enhanced-stats'>
                      <div className='customer-card-enhanced-stat-item'>
                        <div className='customer-card-enhanced-stat-icon'>
                          <i className='fa-solid fa-shopping-cart'></i>
                        </div>
                        <div className='customer-card-enhanced-stat-content'>
                          <span className='customer-card-enhanced-stat-label'>Total Orders</span>
                          <span className='customer-card-enhanced-stat-value'>
                            {customer.totalOrders}
                          </span>
                        </div>
                      </div>

                      <div className='customer-card-enhanced-stat-item highlight'>
                        <div className='customer-card-enhanced-stat-icon'>
                          <i className='fa-solid fa-rupee-sign'></i>
                        </div>
                        <div className='customer-card-enhanced-stat-content'>
                          <span className='customer-card-enhanced-stat-label'>Total Spent</span>
                          <span className='customer-card-enhanced-stat-value'>
                            ₹{formatCurrency(customer.totalSpent)}
                          </span>
                        </div>
                      </div>

                      <div className='customer-card-enhanced-stat-item'>
                        <div className='customer-card-enhanced-stat-icon'>
                          <i className='fa-solid fa-chart-line'></i>
                        </div>
                        <div className='customer-card-enhanced-stat-content'>
                          <span className='customer-card-enhanced-stat-label'>Avg Order</span>
                          <span className='customer-card-enhanced-stat-value'>
                            ₹{formatCurrency(customer.avgOrderValue)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='customer-card-enhanced-footer'>
                      <div className='customer-card-enhanced-meta'>
                        <div className='customer-card-enhanced-meta-item'>
                          <i className='fa-solid fa-calendar'></i>
                          <span>Last: {formatDateDiff(customer.lastOrderDate)}</span>
                        </div>
                        <div className='customer-card-enhanced-meta-item'>
                          <i className='fa-solid fa-clock'></i>
                          <span>{customer.preferredMode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='customer-card-enhanced-actions'>
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

      {}
      {viewMode === 'cards' && totalPages > 1 && (
        <div className='pagination-controls'>
          <div>
            <button
              className='btn btn-ghost btn-small'
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <i className='fa-solid fa-chevron-left'></i> Previous
            </button>
            <span className='pagination-info'>
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
        </div>
      )}

      {}
      {showCustomerModal && selectedCustomer && (
        <div className='modal-overlay' onClick={() => setShowCustomerModal(false)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>{selectedCustomer.address} Customer Details</h2>
              <button
                className='btn btn-ghost btn-icon modal-close'
                onClick={() => setShowCustomerModal(false)}
              >
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body'>
              <div className='filter-bar-flex-col'>
                {}
                <div>
                  <h3 className='section-title-mb'>Customer Information</h3>
                  <div className='customer-detail-grid'>
                    <div>
                      <span className='customer-detail-label'>Status:</span>
                      <span className='badge badge-success customer-detail-value-sm'>
                        🟢 Active
                      </span>
                    </div>
                    <div>
                      <span className='customer-detail-label'>Customer Since:</span>
                      <span className='customer-detail-value'>
                        {selectedCustomer.firstOrderDate
                          ? formatDateShort(selectedCustomer.firstOrderDate)
                          : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className='customer-detail-label'>Total Orders:</span>
                      <span className='customer-detail-value'>{selectedCustomer.totalOrders}</span>
                    </div>
                    <div>
                      <span className='customer-detail-label'>Total Spent:</span>
                      <span className='customer-detail-value font-bold text-accent'>
                        ₹{formatCurrency(selectedCustomer.totalSpent)}
                      </span>
                    </div>
                    <div>
                      <span className='customer-detail-label'>Average Order Value:</span>
                      <span className='customer-detail-value'>
                        ₹{formatCurrency(selectedCustomer.avgOrderValue)}
                      </span>
                    </div>
                    <div>
                      <span className='customer-detail-label'>Preferred Mode:</span>
                      <span className='customer-detail-value'>
                        {selectedCustomer.preferredMode} (
                        {selectedCustomer.preferredModePercent.toFixed(0)}%)
                      </span>
                    </div>
                    <div>
                      <span className='customer-detail-label'>Payment Mode:</span>
                      <span className='customer-detail-value'>
                        {selectedCustomer.preferredPayment} (
                        {selectedCustomer.preferredPaymentPercent.toFixed(0)}%)
                      </span>
                    </div>
                    <div>
                      <span className='customer-detail-label'>Last Order:</span>
                      <span className='customer-detail-value'>
                        {formatDateDiff(selectedCustomer.lastOrderDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {}
                <div>
                  <h3 className='section-title-mb'>Order History (Last 10)</h3>
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
                        {sortOrdersByOrderId(selectedCustomer.orders || [])
                          .slice(0, 10)
                          .map((order, idx) => {
                            const orderDate = parseOrderDate(
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
