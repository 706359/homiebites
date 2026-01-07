// Tab 5: Customers (All Addresses) - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useMemo, useState } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { formatDate, formatDateShort, parseOrderDate } from '../utils/dateUtils.js';
import { formatCurrency } from '../utils/orderUtils.js';

const AllAddressesTab = ({
  orders = [],
  loading = false,
  onViewOrders,
  onContact,
  showNotification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('totalSpent'); // 'totalSpent', 'totalOrders', 'lastOrder'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Calculate customer stats
  const customerStats = useMemo(() => {
    if (!orders || orders.length === 0) {
      console.log('[AllAddressesTab] No orders provided');
      return [];
    }

    console.log('[AllAddressesTab] Processing', orders.length, 'orders');
    if (orders.length > 0) {
      console.log('[AllAddressesTab] Sample order:', {
        orderId: orders[0].orderId || orders[0]._id,
        deliveryAddress: orders[0].deliveryAddress,
        customerAddress: orders[0].customerAddress,
        address: orders[0].address,
        allKeys: Object.keys(orders[0]),
      });
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
        if (idx < 3) {
          console.log('[AllAddressesTab] Order without address:', {
            orderId: order.orderId || order._id,
            keys: Object.keys(order),
            deliveryAddress: order.deliveryAddress,
            customerAddress: order.customerAddress,
            address: order.address,
          });
        }
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
      const orderDate = parseOrderDate(order.createdAt || order.date || order.order_date);

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

      // Determine customer segment
      let segment = 'New';
      if (customer.totalOrders > 20) segment = 'VIP';
      else if (customer.totalOrders >= 5) segment = 'Regular';

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

    console.log('[AllAddressesTab] Orders with addresses:', ordersWithAddresses);
    console.log('[AllAddressesTab] Orders without addresses:', ordersWithoutAddresses);
    console.log('[AllAddressesTab] Total customers found:', customers.length);
    if (customers.length > 0) {
      console.log('[AllAddressesTab] Sample customer:', customers[0]);
    }

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

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'totalOrders':
          return b.totalOrders - a.totalOrders;
        case 'lastOrder':
          if (!a.lastOrderDate && !b.lastOrderDate) return 0;
          if (!a.lastOrderDate) return 1;
          if (!b.lastOrderDate) return -1;
          return b.lastOrderDate - a.lastOrderDate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [customerStats, searchQuery, filterStatus, sortBy]);

  // Customer segments
  const segments = useMemo(() => {
    return {
      vip: customerStats.filter((c) => c.segment === 'VIP').length,
      regular: customerStats.filter((c) => c.segment === 'Regular').length,
      new: customerStats.filter((c) => c.segment === 'New').length,
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
        <div className='dashboard-header'>
          <h2>Customers</h2>
        </div>
        <PremiumLoader message="Loading customers..." size="large" />
      </div>
    );
  }

  // Show message if no orders
  if (!orders || orders.length === 0) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Customers</h2>
          <p>Manage and analyze customer data</p>
        </div>
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
      {/* HEADER */}
      <div className='dashboard-header'>
        <div>
          <h2>Customers</h2>
          <p>Manage and analyze customer data</p>
        </div>
        <div className='action-buttons-group'>
          <button className='btn btn-secondary' onClick={handleExport}>
            <i className='fa-solid fa-download'></i> Export List
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className='action-bar' style={{ marginBottom: '24px' }}>
        <div className='search-input-wrapper'>
          <i className='fa-solid fa-search search-input-icon'></i>
          <input
            type='text'
            className='input-field search-input-with-icon'
            placeholder='Search by address...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className='input-field'
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value='all'>All</option>
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
        </select>
        <select className='input-field' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value='totalSpent'>Sort by: Total Spent</option>
          <option value='totalOrders'>Sort by: Total Orders</option>
          <option value='lastOrder'>Sort by: Last Order</option>
        </select>
      </div>

      {/* CUSTOMER SEGMENTS */}
      <div className='admin-stats' style={{ marginBottom: '24px' }}>
        <div
          className='stat-card'
          style={{
            background: 'var(--admin-accent-light)',
            border: '2px solid var(--admin-accent)',
          }}
        >
          <i
            className='fa-solid fa-star'
            style={{ color: 'var(--admin-accent)', fontSize: '32px' }}
          ></i>
          <div>
            <h3 style={{ color: 'var(--admin-accent)' }}>{segments.vip}</h3>
            <p>🌟 VIP (&gt;20 orders)</p>
          </div>
        </div>
        <div
          className='stat-card'
          style={{
            background: 'var(--admin-success-light)',
            border: '2px solid var(--admin-success)',
          }}
        >
          <i
            className='fa-solid fa-chart-line'
            style={{ color: 'var(--admin-success)', fontSize: '32px' }}
          ></i>
          <div>
            <h3 style={{ color: 'var(--admin-success)' }}>{segments.regular}</h3>
            <p>📈 Regular (5-20)</p>
          </div>
        </div>
        <div
          className='stat-card'
          style={{ background: 'var(--admin-border)', border: '2px solid var(--admin-text-light)' }}
        >
          <i
            className='fa-solid fa-plus-circle'
            style={{ color: 'var(--admin-text-light)', fontSize: '32px' }}
          ></i>
          <div>
            <h3 style={{ color: 'var(--admin-text-light)' }}>{segments.new}</h3>
            <p>🆕 New (&lt;5 orders)</p>
          </div>
        </div>
      </div>

      {/* INACTIVE CUSTOMERS ALERT */}
      {inactiveCustomers.length > 0 && (
        <div
          className='dashboard-card'
          style={{
            background: 'var(--admin-warning-light)',
            border: '2px solid var(--admin-warning)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--admin-warning)', marginBottom: '8px' }}>
                ⚠️ {inactiveCustomers.length} customers haven't ordered in 30+ days
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

      {/* CUSTOMER CARDS GRID */}
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
                  ? `Found ${orders.length} orders, but none have valid delivery addresses. Please check that orders have deliveryAddress, customerAddress, or address fields.`
                  : searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No customer data available. Add orders with delivery addresses to see customers here.'}
              </p>
              {orders.length > 0 && customerStats.length === 0 && orders[0] && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'var(--admin-warning-light)',
                    borderRadius: '8px',
                    textAlign: 'left',
                    maxWidth: '600px',
                    margin: '16px auto 0',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--admin-text)',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Sample order fields:
                  </p>
                  <pre
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--admin-text-secondary)',
                      overflow: 'auto',
                      background: 'var(--admin-glass-bg)',
                      padding: '8px',
                      borderRadius: '4px',
                    }}
                  >
                    {JSON.stringify(Object.keys(orders[0]), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          filteredCustomers.map((customer, idx) => {
            const segmentIcon =
              customer.segment === 'VIP' ? '🌟' : customer.segment === 'Regular' ? '📈' : '👤';
            const segmentLabel =
              customer.segment === 'VIP'
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
                    <h3 style={{ marginBottom: '4px', fontSize: '1.2rem' }}>{customer.address}</h3>
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
                            const dateA = new Date(a.createdAt || a.date || a.order_date);
                            const dateB = new Date(b.createdAt || b.date || b.order_date);
                            return dateB - dateA;
                          })
                          .slice(0, 10)
                          .map((order, idx) => {
                            const orderDate = parseOrderDate(
                              order.createdAt || order.date || order.order_date
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
