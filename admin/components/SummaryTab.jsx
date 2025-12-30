import { useMemo, useState } from 'react';
import { formatBillingMonth, formatCurrency } from '../utils/orderUtils.js';

const SummaryTab = ({
  orders,
  summaryReport,
  currentPage,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
}) => {
  // Default to current month
  const now = new Date();
  const currentMonthKey = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  // Get available months from summary report
  const availableMonths = useMemo(() => {
    if (!summaryReport || !summaryReport.months) return [];
    return summaryReport.months.sort().reverse(); // Most recent first
  }, [summaryReport]);

  // Flatten summary data to show Month + Address rows (filtered by selected month)
  const flattenedData = useMemo(() => {
    if (!summaryReport || !summaryReport.data || !summaryReport.months) return [];

    const flattened = [];
    summaryReport.data.forEach((row) => {
      // Filter by selected month only
      const month = selectedMonth === 'all' ? summaryReport.months : [selectedMonth];
      month.forEach((monthKey) => {
        const monthOrders = orders.filter((o) => {
          const addr = o.deliveryAddress || o.customerAddress || o.address;
          if (addr !== row.address) return false;

          let orderMonth, orderYear;
          if (o.billingMonth && o.billingYear) {
            orderMonth = o.billingMonth;
            orderYear = o.billingYear;
          } else {
            try {
              const orderDate = new Date(o.createdAt || o.date || o.order_date);
              orderMonth = orderDate.getMonth() + 1;
              orderYear = orderDate.getFullYear();
            } catch (e) {
              return false;
            }
          }

          const monthKey = `${String(orderMonth).padStart(2, '0')}-${orderYear}`;
          const monthKeyAlt = formatBillingMonth(orderMonth, orderYear);
          return (
            monthKey === month || monthKeyAlt === month || month.includes(orderYear.toString())
          );
        });

        if (monthOrders.length > 0 || row.monthlyTotals[month]) {
          const monthTotal = row.monthlyTotals[month] || 0;
          const monthPaid = monthOrders
            .filter((o) => {
              const status = (o.status || '').toLowerCase();
              return status === 'paid' || status === 'delivered';
            })
            .reduce((sum, o) => sum + parseFloat(o.totalAmount || o.total || 0), 0);

          const monthPending = monthOrders
            .filter((o) => {
              const status = (o.status || '').toLowerCase();
              return status !== 'paid' && status !== 'delivered';
            })
            .reduce((sum, o) => sum + parseFloat(o.totalAmount || o.total || 0), 0);

          flattened.push({
            month,
            address: row.address,
            totalOrders: monthOrders.length,
            totalAmount: monthTotal,
            paidAmount: monthPaid,
            pendingAmount: monthPending,
          });
        }
      });
    });
    return flattened;
  }, [summaryReport, orders, selectedMonth]);

  const totalPages = Math.max(1, Math.ceil(flattenedData.length / recordsPerPage));
  const paginatedData = flattenedData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const grandTotalPaid = orders
    .filter((o) => {
      const status = (o.status || '').toLowerCase();
      return status === 'paid' || status === 'delivered';
    })
    .reduce((sum, o) => sum + parseFloat(o.totalAmount || o.total || 0), 0);

  const grandTotalPending = orders
    .filter((o) => {
      const status = (o.status || '').toLowerCase();
      return status !== 'paid' && status !== 'delivered';
    })
    .reduce((sum, o) => sum + parseFloat(o.totalAmount || o.total || 0), 0);

  if (!summaryReport || !summaryReport.data) {
    return (
      <div className='admin-content'>
        <div className='orders-header'>
          <h2>Summary - Address-wise Monthly Totals</h2>
        </div>
        <p className='no-data'>Error loading summary data. Please try again.</p>
      </div>
    );
  }

  if (summaryReport.data.length > 5000) {
    return (
      <div className='admin-content'>
        <div className='orders-header'>
          <h2>Summary - Address-wise Monthly Totals</h2>
        </div>
        <div className='error-message'>
          <p>Summary report contains too many addresses ({summaryReport.data.length}).</p>
          <p>Please use filters to reduce the dataset size.</p>
        </div>
      </div>
    );
  }

  // Calculate totals for selected month only
  const selectedMonthTotals = useMemo(() => {
    if (!flattenedData.length)
      return { totalAddresses: 0, totalAmount: 0, totalPaid: 0, totalPending: 0 };
    const filtered = flattenedData.filter(
      (item) => item.month === selectedMonth || selectedMonth === 'all'
    );
    return {
      totalAddresses: new Set(filtered.map((item) => item.address)).size,
      totalAmount: filtered.reduce((sum, item) => sum + item.totalAmount, 0),
      totalPaid: filtered.reduce((sum, item) => sum + item.paidAmount, 0),
      totalPending: filtered.reduce((sum, item) => sum + item.pendingAmount, 0),
    };
  }, [flattenedData, selectedMonth]);

  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <h2>Summary - Address-wise Monthly Totals</h2>
      </div>

      {/* Month Filter - MANDATORY */}
      <div className='orders-filters'>
        <div className='filter-group'>
          <label>Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              onPageChange(1); // Reset to first page when month changes
            }}
            className='filter-select custom-dropdown'
          >
            <option value='all'>All Months</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='summary-info'>
        <span>Total Addresses: {selectedMonthTotals.totalAddresses}</span>
        <span>
          Grand Total: ₹
          {formatCurrency(
            selectedMonth === 'all' ? summaryReport.grandTotal : selectedMonthTotals.totalAmount
          )}
        </span>
      </div>

      {flattenedData.length > 0 && (
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
            {Math.min(currentPage * recordsPerPage, flattenedData.length)} of {flattenedData.length}{' '}
            rows
          </div>
        </div>
      )}

      <div className='orders-table-container excel-table-container'>
        {flattenedData.length === 0 ? (
          <div className='no-data admin-empty-state'>
            <p>No data available</p>
          </div>
        ) : (
          <table className='orders-table excel-data-table'>
            <thead>
              <tr>
                <th>Month</th>
                <th>Address</th>
                <th>Total Orders</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={`${item.month}-${item.address}-${index}`}>
                  <td className='excel-date-cell'>{item.month}</td>
                  <td className='address-cell'>
                    <strong>{item.address}</strong>
                  </td>
                  <td className='order-quantity-cell'>{item.totalOrders}</td>
                  <td className='amount-cell'>
                    <strong>₹{formatCurrency(item.totalAmount)}</strong>
                  </td>
                  <td className='amount-cell'>
                    <strong>₹{formatCurrency(item.paidAmount)}</strong>
                  </td>
                  <td className={`amount-cell ${item.pendingAmount > 0 ? 'text-danger' : ''}`}>
                    <strong>₹{formatCurrency(item.pendingAmount)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className='summary-total-row'>
                <td colSpan='2'>
                  <strong>Grand Total</strong>
                </td>
                <td className='order-quantity-cell'>
                  <strong>{orders.length}</strong>
                </td>
                <td className='grand-total-cell'>
                  <strong>₹{formatCurrency(summaryReport.grandTotal)}</strong>
                </td>
                <td className='month-total-cell'>
                  <strong>₹{formatCurrency(grandTotalPaid)}</strong>
                </td>
                <td className='month-total-cell text-danger'>
                  <strong>₹{formatCurrency(grandTotalPending)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Pagination Navigation */}
      {flattenedData.length > 0 && totalPages > 1 && (
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
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
            disabled={currentPage === totalPages}
            title='Next Page'
          >
            <i className='fa-solid fa-angle-right'></i>
          </button>
          <button
            className='btn btn-ghost'
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title='Last Page'
          >
            <i className='fa-solid fa-angle-double-right'></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;
