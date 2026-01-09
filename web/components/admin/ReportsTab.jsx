// Tab 6: Reports - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useState } from 'react';
import { formatDate, formatDateMonthDay, parseOrderDate } from './utils/dateUtils.js';
import PremiumLoader from './PremiumLoader.jsx';

const ReportsTab = ({ orders = [], loading = false, showNotification }) => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reportDateFrom, setReportDateFrom] = useState('');
  const [reportDateTo, setReportDateTo] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [groupByArea, setGroupByArea] = useState(false);
  const [groupByMode, setGroupByMode] = useState(false);
  const [reportFormat, setReportFormat] = useState('csv'); // 'pdf', 'excel', 'csv'
  const [showGenerator, setShowGenerator] = useState(false);

  // Scheduled reports (mock data - would come from API)
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: 'Daily Sales',
      schedule: 'Daily 9AM',
      format: 'Email',
    },
    {
      id: 2,
      name: 'Weekly Summary',
      schedule: 'Mon 10AM',
      format: 'PDF',
    },
    {
      id: 3,
      name: 'Monthly',
      schedule: '1st 8AM',
      format: 'Excel',
    },
  ]);

  // Report history (mock data - would come from API)
  const [reportHistory, setReportHistory] = useState([
    {
      id: 1,
      date: '15-Jan-2025',
      type: 'Sales Report',
      period: "Dec'24",
    },
    {
      id: 2,
      date: '01-Jan-2025',
      type: 'Monthly Statement',
      period: "Dec'24",
    },
  ]);

  // Generate report
  const handleGenerateReport = () => {
    if (!selectedReportType) {
      if (showNotification) showNotification('Please select a report type', 'warning');
      return;
    }

    // Filter orders by date range
    let filteredOrders = [...orders];
    if (reportDateFrom) {
      const from = parseOrderDate(reportDateFrom);
      if (from) {
        from.setHours(0, 0, 0, 0);
        filteredOrders = filteredOrders.filter((o) => {
          // Never use createdAt (today's date) as fallback - only use actual order date
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          return orderDate && orderDate >= from;
        });
      }
    }
    if (reportDateTo) {
      const to = parseOrderDate(reportDateTo);
      if (to) {
        to.setHours(23, 59, 59, 999);
        filteredOrders = filteredOrders.filter((o) => {
          // Never use createdAt (today's date) as fallback - only use actual order date
          const orderDate = parseOrderDate(o.date || o.order_date || null);
          return orderDate && orderDate <= to;
        });
      }
    }

    // Generate CSV (simplified)
    let csvContent = '';
    if (groupByArea) {
      // Group by area
      const areaStats = {};
      filteredOrders.forEach((o) => {
        const addr = o.deliveryAddress || o.customerAddress || o.address || 'Unknown';
        if (!areaStats[addr]) {
          areaStats[addr] = { address: addr, orders: 0, revenue: 0 };
        }
        areaStats[addr].orders++;
        areaStats[addr].revenue += parseFloat(o.total || o.totalAmount || 0);
      });
      csvContent =
        'Area,Orders,Revenue\n' +
        Object.values(areaStats)
          .map((a) => `${a.address},${a.orders},${a.revenue}`)
          .join('\n');
    } else if (groupByMode) {
      // Group by mode
      const modeStats = {};
      filteredOrders.forEach((o) => {
        const mode = o.mode || 'Not Set';
        if (!modeStats[mode]) {
          modeStats[mode] = { mode, orders: 0, revenue: 0 };
        }
        modeStats[mode].orders++;
        modeStats[mode].revenue += parseFloat(o.total || o.totalAmount || 0);
      });
      csvContent =
        'Mode,Orders,Revenue\n' +
        Object.values(modeStats)
          .map((m) => `${m.mode},${m.orders},${m.revenue}`)
          .join('\n');
    } else {
      // Standard report
      csvContent =
        'Date,Address,Quantity,Amount,Mode,Status,PaymentMode\n' +
        filteredOrders
          .map((o) => {
            // Never use createdAt (today's date) as fallback - only use actual order date
          const orderDate = parseOrderDate(o.date || o.order_date || null);
            const dateStr = formatDate(orderDate);
            return `"${dateStr}","${
              o.deliveryAddress || o.customerAddress || o.address || 'N/A'
            }","${o.quantity || 1}","${o.total || o.totalAmount || 0}","${o.mode || 'N/A'}","${
              o.status || 'N/A'
            }","${o.paymentMode || 'N/A'}"`;
          })
          .join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedReportType.toLowerCase().replace(/\s+/g, '_')}_${
      new Date().toISOString().split('T')[0]
    }.csv`;
    link.click();

    // Add to history
    const period =
      reportDateFrom && reportDateTo
        ? `${formatDate(reportDateFrom)} - ${formatDate(reportDateTo)}`
        : 'All Time';
    setReportHistory([
      {
        id: reportHistory.length + 1,
        date: formatDateMonthDay(new Date()),
        type: selectedReportType,
        period,
      },
      ...reportHistory,
    ]);

    if (showNotification) showNotification('Report generated successfully', 'success');
    setShowGenerator(false);
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <PremiumLoader message='Loading reports...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>

      {/* REPORT TYPES */}
      <div className='dashboard-grid-layout' style={{ marginBottom: '32px' }}>
        <div className='dashboard-grid-item third-width'>
          <div
            className='dashboard-card'
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              setSelectedReportType('Sales Report');
              setShowGenerator(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i
              className='fa-solid fa-chart-bar'
              style={{ fontSize: '48px', color: 'var(--admin-accent)', marginBottom: '16px' }}
            ></i>
            <h3 style={{ marginBottom: '8px' }}>Sales Report</h3>
            <button className='btn btn-primary btn-small'>Generate</button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div
            className='dashboard-card'
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              setSelectedReportType('Payment Report');
              setShowGenerator(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i
              className='fa-solid fa-money-bill-wave'
              style={{ fontSize: '48px', color: 'var(--admin-success)', marginBottom: '16px' }}
            ></i>
            <h3 style={{ marginBottom: '8px' }}>Payment Report</h3>
            <button className='btn btn-primary btn-small'>Generate</button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div
            className='dashboard-card'
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              setSelectedReportType('Monthly Statement');
              setShowGenerator(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i
              className='fa-solid fa-calendar-alt'
              style={{ fontSize: '48px', color: 'var(--admin-secondary)', marginBottom: '16px' }}
            ></i>
            <h3 style={{ marginBottom: '8px' }}>Monthly Statement</h3>
            <button className='btn btn-primary btn-small'>Generate</button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div
            className='dashboard-card'
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              setSelectedReportType('Area-wise Report');
              setGroupByArea(true);
              setShowGenerator(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i
              className='fa-solid fa-map-marker-alt'
              style={{ fontSize: '48px', color: 'var(--admin-accent)', marginBottom: '16px' }}
            ></i>
            <h3 style={{ marginBottom: '8px' }}>Area-wise Report</h3>
            <button className='btn btn-primary btn-small'>Generate</button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div
            className='dashboard-card'
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              setSelectedReportType('Customer Report');
              setShowGenerator(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i
              className='fa-solid fa-users'
              style={{ fontSize: '48px', color: 'var(--admin-accent)', marginBottom: '16px' }}
            ></i>
            <h3 style={{ marginBottom: '8px' }}>Customer Report</h3>
            <button className='btn btn-primary btn-small'>Generate</button>
          </div>
        </div>

        <div className='dashboard-grid-item third-width'>
          <div
            className='dashboard-card'
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              setSelectedReportType('Growth Report');
              setShowGenerator(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i
              className='fa-solid fa-chart-line'
              style={{ fontSize: '48px', color: 'var(--admin-success)', marginBottom: '16px' }}
            ></i>
            <h3 style={{ marginBottom: '8px' }}>Growth Report</h3>
            <button className='btn btn-primary btn-small'>Generate</button>
          </div>
        </div>
      </div>

      {/* REPORT GENERATOR MODAL */}
      {showGenerator && (
        <div className='modal-overlay' onClick={() => setShowGenerator(false)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Generate Report</h2>
              <button className='modal-close' onClick={() => setShowGenerator(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>Report Type</label>
                  <select
                    className='input-field'
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                  >
                    <option value=''>Select Report Type</option>
                    <option value='Sales Report'>Sales Report</option>
                    <option value='Payment Report'>Payment Report</option>
                    <option value='Monthly Statement'>Monthly Statement</option>
                    <option value='Area-wise Report'>Area-wise Report</option>
                    <option value='Customer Report'>Customer Report</option>
                    <option value='Growth Report'>Growth Report</option>
                  </select>
                </div>

                <div className='form-group'>
                  <label>Date Range</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type='date'
                      className='input-field'
                      value={reportDateFrom}
                      onChange={(e) => setReportDateFrom(e.target.value)}
                      placeholder='From'
                    />
                    <input
                      type='date'
                      className='input-field'
                      value={reportDateTo}
                      onChange={(e) => setReportDateTo(e.target.value)}
                      placeholder='To'
                    />
                  </div>
                </div>

                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Filters</label>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginTop: '8px',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={includeCharts}
                        onChange={(e) => setIncludeCharts(e.target.checked)}
                      />
                      <span>Include Charts</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={includeSummary}
                        onChange={(e) => setIncludeSummary(e.target.checked)}
                      />
                      <span>Include Summary</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={groupByArea}
                        onChange={(e) => {
                          setGroupByArea(e.target.checked);
                          if (e.target.checked) setGroupByMode(false);
                        }}
                      />
                      <span>Group by Area</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={groupByMode}
                        onChange={(e) => {
                          setGroupByMode(e.target.checked);
                          if (e.target.checked) setGroupByArea(false);
                        }}
                      />
                      <span>Group by Mode</span>
                    </label>
                  </div>
                </div>

                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Format</label>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='radio'
                        name='format'
                        value='pdf'
                        checked={reportFormat === 'pdf'}
                        onChange={(e) => setReportFormat(e.target.value)}
                      />
                      <span>PDF</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='radio'
                        name='format'
                        value='excel'
                        checked={reportFormat === 'excel'}
                        onChange={(e) => setReportFormat(e.target.value)}
                      />
                      <span>Excel</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='radio'
                        name='format'
                        value='csv'
                        checked={reportFormat === 'csv'}
                        onChange={(e) => setReportFormat(e.target.value)}
                      />
                      <span>CSV</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-ghost' onClick={() => setShowGenerator(false)}>
                Cancel
              </button>
              <button className='btn btn-secondary' onClick={handleGenerateReport}>
                <i className='fa-solid fa-file-alt'></i> Preview
              </button>
              <button className='btn btn-primary' onClick={handleGenerateReport}>
                <i className='fa-solid fa-download'></i> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULED REPORTS */}
      <div className='dashboard-card margin-bottom-24'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 className='dashboard-section-title' style={{ marginBottom: 0 }}>
            <i className='fa-solid fa-clock' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
            Automated Reports
          </h3>
          <button className='btn btn-primary btn-small'>
            <i className='fa-solid fa-plus'></i> Add Scheduled Report
          </button>
        </div>
        <div className='orders-table-container'>
          <table className='orders-table'>
            <thead>
              <tr>
                <th>Report</th>
                <th>Schedule</th>
                <th>Format</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {scheduledReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td>{report.schedule}</td>
                  <td>{report.format}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className='action-icon-btn action-icon-edit' title='Edit'>
                        <i className='fa-solid fa-pencil'></i>
                      </button>
                      <button className='action-icon-btn action-icon-delete' title='Delete'>
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REPORT HISTORY */}
      <div className='dashboard-card'>
        <h3 className='dashboard-section-title'>
          <i className='fa-solid fa-history' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
          Recent Reports (Last 30 days)
        </h3>
        <div className='orders-table-container'>
          <table className='orders-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Report Type</th>
                <th>Period</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {reportHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '48px' }}>
                    <div className='empty-state'>
                      <i className='fa-solid fa-inbox empty-state-icon'></i>
                      <p>No reports generated yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reportHistory.map((report) => (
                  <tr key={report.id}>
                    <td>{report.date}</td>
                    <td>{report.type}</td>
                    <td>{report.period}</td>
                    <td>
                      <button className='action-icon-btn' title='Download'>
                        <i className='fa-solid fa-download'></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
