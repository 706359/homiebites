import { useMemo, useState } from 'react';
import { formatCurrency } from '../utils/orderUtils.js';

const PendingAmountsTab = ({
  orders,
  getUnpaidByAddress,
  onUpdateOrderStatus,
  onViewOrders,
  showNotification,
}) => {
  const [statusFilter, setStatusFilter] = useState('unpaid'); // 'all', 'paid', 'unpaid'

  // Ensure orders is an array and getUnpaidByAddress is a function
  const safeOrders = Array.isArray(orders) ? orders : [];
  const allUnpaidData = typeof getUnpaidByAddress === 'function' ? getUnpaidByAddress() : [];

  // Filter unpaid data based on status filter
  const unpaidData = useMemo(() => {
    if (statusFilter === 'unpaid') {
      // Default: 'unpaid' - show only addresses with pending amounts
      return allUnpaidData.filter((item) => item.unpaid > 0);
    }

    if (statusFilter === 'paid') {
      // For "paid", calculate all addresses from orders and filter for those with no unpaid amount
      const addressData = {};

      safeOrders.forEach((order) => {
        const address =
          order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
        const amount = parseFloat(order.totalAmount || order.total || 0);
        const status = (order.status || order.paymentStatus || '').toLowerCase().trim();
        const isPaid = status === 'paid' || status === 'delivered';

        if (!addressData[address]) {
          addressData[address] = { unpaid: 0, grandTotal: 0 };
        }

        addressData[address].grandTotal += isNaN(amount) ? 0 : amount;

        if (!isPaid && !isNaN(amount)) {
          addressData[address].unpaid += amount;
        }
      });

      // Return addresses with unpaid = 0 but grandTotal > 0 (all orders paid)
      return Object.entries(addressData)
        .map(([address, data]) => ({ address, ...data }))
        .filter((item) => item.unpaid === 0 && item.grandTotal > 0)
        .sort((a, b) => b.grandTotal - a.grandTotal);
    }

    // 'all' - show all addresses (both paid and unpaid)
    // Calculate all addresses from orders
    const addressData = {};

    safeOrders.forEach((order) => {
      const address = order.deliveryAddress || order.customerAddress || order.address || 'Unknown';
      const amount = parseFloat(order.totalAmount || order.total || 0);
      const status = (order.status || order.paymentStatus || '').toLowerCase().trim();
      const isPaid = status === 'paid' || status === 'delivered';

      if (!addressData[address]) {
        addressData[address] = { unpaid: 0, grandTotal: 0 };
      }

      addressData[address].grandTotal += isNaN(amount) ? 0 : amount;

      if (!isPaid && !isNaN(amount)) {
        addressData[address].unpaid += amount;
      }
    });

    return Object.entries(addressData)
      .map(([address, data]) => ({ address, ...data }))
      .sort((a, b) => b.unpaid - a.unpaid || b.grandTotal - a.grandTotal);
  }, [allUnpaidData, statusFilter, safeOrders]);

  const totalPending = Array.isArray(unpaidData)
    ? unpaidData.reduce((sum, item) => sum + (parseFloat(item.unpaid) || 0), 0)
    : 0;

  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <h2>Pending Amounts</h2>
      </div>

      {/* Filters */}
      <div className='orders-filters'>
        <div className='filter-group'>
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='filter-select custom-dropdown'
          >
            <option value='unpaid'>Unpaid Only</option>
            <option value='paid'>Paid Only</option>
            <option value='all'>All Addresses</option>
          </select>
        </div>
      </div>

      <div className='admin-stats'>
        <div className='stat-card'>
          <i className='fa-solid fa-money-bill-wave'></i>
          <div>
            <h3>₹{formatCurrency(totalPending)}</h3>
            <p>Total Pending Amount</p>
          </div>
        </div>
        <div className='stat-card'>
          <i className='fa-solid fa-map-marker-alt'></i>
          <div>
            <h3>{unpaidData.length}</h3>
            <p>
              {statusFilter === 'unpaid'
                ? 'Addresses with Pending'
                : statusFilter === 'paid'
                  ? 'Addresses (Paid)'
                  : 'Total Addresses'}
            </p>
          </div>
        </div>
      </div>

      <div className='orders-table-container excel-table-container'>
        {unpaidData.length === 0 ? (
          <div className='no-data admin-empty-state'>
            <p>No pending amounts</p>
          </div>
        ) : (
          <table className='orders-table excel-data-table'>
            <thead>
              <tr>
                <th>Address</th>
                <th>Total Pending Amount</th>
                <th>Pending Order Count</th>
                <th>Oldest Pending Date</th>
                <th>Last Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unpaidData.map((item, index) => {
                const addressOrders = safeOrders
                  .filter((o) => {
                    const addr = o.deliveryAddress || o.customerAddress || o.address;
                    return addr === item.address;
                  })
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0)
                  );

                const unpaidOrdersForAddr = addressOrders.filter((o) => {
                  const status = (o.status || o.paymentStatus || '').toLowerCase().trim();
                  return status !== 'paid' && status !== 'delivered';
                });

                const paidOrdersForAddr = addressOrders.filter((o) => {
                  const status = (o.status || o.paymentStatus || '').toLowerCase().trim();
                  return status === 'paid' || status === 'delivered';
                });

                const oldestPendingDate =
                  unpaidOrdersForAddr.length > 0
                    ? new Date(unpaidOrdersForAddr[0].createdAt || unpaidOrdersForAddr[0].date)
                    : null;

                const lastPaymentDate =
                  paidOrdersForAddr.length > 0
                    ? new Date(
                        paidOrdersForAddr[paidOrdersForAddr.length - 1].createdAt ||
                          paidOrdersForAddr[paidOrdersForAddr.length - 1].date
                      )
                    : null;

                const pendingOrderCount = unpaidOrdersForAddr.length;

                return (
                  <tr key={item.address || index}>
                    <td className='order-address-cell'>
                      <strong>{item.address}</strong>
                    </td>
                    <td className='order-amount-cell text-danger text-bold'>
                      ₹{formatCurrency(item.unpaid)}
                    </td>
                    <td className='order-quantity-cell text-center text-semibold'>
                      {pendingOrderCount}
                    </td>
                    <td className='order-date-cell'>
                      {oldestPendingDate ? oldestPendingDate.toLocaleDateString() : 'N/A'}
                    </td>
                    <td className='order-date-cell'>
                      {lastPaymentDate ? lastPaymentDate.toLocaleDateString() : 'N/A'}
                    </td>
                    <td className='order-actions-cell'>
                      <div className='order-actions-group'>
                        <button
                          className='btn btn-primary'
                          onClick={() => {
                            const pendingOrderIds = unpaidOrdersForAddr
                              .map((o) => o.id)
                              .filter(Boolean);
                            if (
                              pendingOrderIds.length > 0 &&
                              window.confirm(
                                `Mark ${pendingOrderIds.length} pending order(s) for ${item.address} as paid?`
                              )
                            ) {
                              pendingOrderIds.forEach((orderId) => {
                                try {
                                  onUpdateOrderStatus(orderId, 'Paid');
                                } catch (err) {
                                  console.error('Error marking order as paid:', err);
                                }
                              });
                              showNotification(
                                `Marked ${pendingOrderIds.length} order(s) as paid for ${item.address}`,
                                'success'
                              );
                            }
                          }}
                          title='Mark Paid'
                        >
                          <i className='fa-solid fa-check'></i> Mark Paid
                        </button>
                        <button
                          className='btn btn-secondary'
                          onClick={() => onViewOrders(item.address)}
                          title='View Related Orders'
                        >
                          <i className='fa-solid fa-list'></i> View Orders
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className='table-footer'>
                  <strong>Total</strong>
                </td>
                <td className='table-footer-amount'>
                  ₹{formatCurrency(unpaidData.reduce((sum, item) => sum + item.unpaid, 0))}
                </td>
                <td className='table-footer text-center'>
                  <strong>
                    {unpaidData.reduce((sum, item) => {
                      const addr = item.address;
                      const unpaidCount = safeOrders.filter((o) => {
                        const oAddr = o.deliveryAddress || o.customerAddress || o.address;
                        const status = (o.status || o.paymentStatus || '').toLowerCase().trim();
                        return oAddr === addr && status !== 'paid' && status !== 'delivered';
                      }).length;
                      return sum + unpaidCount;
                    }, 0)}
                  </strong>
                </td>
                <td colSpan='3'></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingAmountsTab;
