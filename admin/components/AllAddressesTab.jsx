const AllAddressesTab = ({
  orders,
  filteredCustomers,
  paginatedCustomers,
  currentPage,
  recordsPerPage,
  customerSearchQuery,
  customerSort,
  customerTotalPages,
  onSearchChange,
  onSortChange,
  onPageChange,
  onRecordsPerPageChange,
}) => {
  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <h2>All Addresses</h2>
      </div>

      <div className='orders-filters'>
        <div className='filter-group search-group'>
          <i className='fa-solid fa-search'></i>
          <input
            type='text'
            placeholder='Search by address or name...'
            value={customerSearchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onPageChange(1);
            }}
            className='search-input'
          />
        </div>
        <div className='filter-group'>
          <label>Sort by:</label>
          <select
            value={customerSort}
            onChange={(e) => {
              onSortChange(e.target.value);
              onPageChange(1);
            }}
            className='filter-select custom-dropdown'
          >
            <option value='totalAmount'>Total Amount (High to Low)</option>
            <option value='totalOrders'>Total Orders (High to Low)</option>
            <option value='lastOrder'>Last Order (Recent First)</option>
          </select>
        </div>
      </div>

      {filteredCustomers.length > 0 && (
        <div className='orders-summary'>
          <span>Total Addresses: {filteredCustomers.length}</span>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredCustomers.length > 0 && (
        <div className='pagination-controls'>
          <div className='pagination-info'>
            <label>Show:</label>
            <select
              value={recordsPerPage}
              onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
              className='records-per-page-select'
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={200}>200</option>
            </select>
            <span>records per page</span>
          </div>
          <div className='pagination-info'>
            Showing {(currentPage - 1) * recordsPerPage + 1} to{' '}
            {Math.min(currentPage * recordsPerPage, filteredCustomers.length)} of{' '}
            {filteredCustomers.length} addresses
          </div>
        </div>
      )}

      <div className='orders-table-container excel-table-container'>
        {filteredCustomers.length === 0 ? (
          <div className='no-data admin-empty-state'>
            <p>No addresses found</p>
          </div>
        ) : (
          <table className='orders-table excel-data-table'>
            <thead>
              <tr>
                <th>Address</th>
                <th>Total Lifetime Orders</th>
                <th>Last Order</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer, index) => {
                if (!customer) return null;

                const now = new Date();
                // Use current month for active/inactive check (aligns with billing cycle)
                const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const addressOrders = orders.filter((o) => {
                  const addr = o.deliveryAddress || o.customerAddress || o.address;
                  return addr === customer.address;
                });

                // Check if address has orders in current month
                const currentMonthOrders = addressOrders.filter((o) => {
                  try {
                    const orderDate = new Date(o.createdAt || o.date || o.order_date);
                    return orderDate >= currentMonthStart;
                  } catch (e) {
                    return false;
                  }
                });

                const isActive = currentMonthOrders.length > 0;

                // Get last order date
                const lastOrderDate =
                  addressOrders.length > 0
                    ? addressOrders.reduce((latest, order) => {
                        try {
                          const orderDate = new Date(
                            order.createdAt || order.date || order.order_date
                          );
                          return !latest || orderDate > latest ? orderDate : latest;
                        } catch (e) {
                          return latest;
                        }
                      }, null)
                    : null;

                // Format last order date
                const formatLastOrderDate = (date) => {
                  if (!date) return 'Never';
                  const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24));
                  if (daysAgo === 0) return 'Today';
                  if (daysAgo === 1) return 'Yesterday';
                  if (daysAgo < 30) return `${daysAgo} days ago`;
                  const monthsAgo = Math.floor(daysAgo / 30);
                  if (monthsAgo === 1) return '1 month ago';
                  if (monthsAgo < 12) return `${monthsAgo} months ago`;
                  const yearsAgo = Math.floor(monthsAgo / 12);
                  return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
                };

                let notes = customer.notes || '';
                if (!notes && addressOrders.length > 0) {
                  const paymentModes = new Set(
                    addressOrders.map((o) => o.paymentMode).filter(Boolean)
                  );
                  const avgOrderValue =
                    addressOrders.length > 0
                      ? Math.round(
                          addressOrders.reduce(
                            (sum, o) => sum + parseFloat(o.total || o.totalAmount || 0),
                            0
                          ) / addressOrders.length
                        )
                      : 0;
                  const notesParts = [];
                  if (paymentModes.size > 0) {
                    notesParts.push(`Payment: ${Array.from(paymentModes).join(', ')}`);
                  }
                  if (avgOrderValue > 0) {
                    notesParts.push(`Avg: ₹${avgOrderValue}`);
                  }
                  notes = notesParts.join(' | ') || 'No notes';
                }
                if (!notes) notes = 'No notes';

                return (
                  <tr key={customer.address || index}>
                    <td className='address-cell'>
                      <strong>{customer.address || 'Unknown'}</strong>
                    </td>
                    <td className='order-amount-cell'>{customer.totalOrders || 0}</td>
                    <td className='order-date-cell excel-text-cell'>
                      {formatLastOrderDate(lastOrderDate)}
                    </td>
                    <td className='order-address-cell excel-text-cell'>{notes}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan='5' className='table-footer'>
                  <strong>
                    Page {currentPage} of {customerTotalPages} | Total: {filteredCustomers.length}{' '}
                    addresses
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Pagination Navigation */}
      {filteredCustomers.length > 0 && customerTotalPages > 1 && (
        <div className='pagination-navigation'>
          <button
            className='btn btn-ghost'
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title='First Page'
          >
            <i className='fa-solid fa-angle-double-left'></i>
          </button>
          <button
            className='btn btn-ghost'
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title='Previous Page'
          >
            <i className='fa-solid fa-angle-left'></i>
          </button>
          <div className='page-numbers'>
            {Array.from({ length: customerTotalPages }, (_, i) => i + 1).map((pageNum) => {
              if (
                pageNum === 1 ||
                pageNum === customerTotalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-ghost ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => onPageChange(pageNum)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === customerTotalPages}
            title='Next Page'
          >
            <i className='fa-solid fa-angle-right'></i>
          </button>
          <button
            className='btn btn-ghost'
            onClick={() => onPageChange(customerTotalPages)}
            disabled={currentPage === customerTotalPages}
            title='Last Page'
          >
            <i className='fa-solid fa-angle-double-right'></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default AllAddressesTab;
