// Reusable Downloadable Reports component
// Displays Monthly Summary, Quarterly Report, and Annual Report buttons

const DownloadableReports = ({ onExportReport }) => {
  const handleExportReport = (type) => {
    if (onExportReport) {
      onExportReport(type);
    }
  };

  return (
    <div className='dashboard-card' style={{ marginBottom: '24px' }}>
      <h3 className='dashboard-section-title'>
        <i className='fa-solid fa-download' style={{ fontSize: '1rem', opacity: 0.7 }}></i>
        Downloadable Reports
      </h3>
      <div className='action-buttons-group' style={{ marginTop: '16px' }}>
        <button className='btn btn-secondary' onClick={() => handleExportReport('monthly')}>
          <i className='fa-solid fa-file-alt'></i> Monthly Summary
        </button>
        <button className='btn btn-secondary' onClick={() => handleExportReport('quarterly')}>
          <i className='fa-solid fa-chart-bar'></i> Quarterly Report
        </button>
        <button className='btn btn-secondary' onClick={() => handleExportReport('annual')}>
          <i className='fa-solid fa-chart-line'></i> Annual Report
        </button>
      </div>
    </div>
  );
};

export default DownloadableReports;


