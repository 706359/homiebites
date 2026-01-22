const EmptyState = ({
  icon = 'fa-inbox',
  title = 'No data found',
  message = 'Try adjusting your filters',
  onClearFilters,
  onAddOrder,
  clearFiltersLabel = 'Clear Filters',
  addOrderLabel = 'Add Order',
}) => {
  return (
    <div className="admin-empty-state">
      <i className={`fa-solid ${icon} empty-state-icon-large`}></i>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
      <div className="empty-state-actions">
        {onClearFilters && (
          <button className="btn btn-ghost btn-small" onClick={onClearFilters}>
            <i className="fa-solid fa-filter-circle-xmark"></i>{' '}
            {clearFiltersLabel}
          </button>
        )}
        {onAddOrder && (
          <button className="btn btn-primary btn-small" onClick={onAddOrder}>
            <i className="fa-solid fa-plus"></i> {addOrderLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
