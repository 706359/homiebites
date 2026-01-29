import Icon from '../ui/Icon.jsx';

const EmptyState = ({
  icon = 'inbox',
  title = 'No data found',
  message = 'Try adjusting your filters',
  onClearFilters,
  onAddOrder,
  clearFiltersLabel = 'Clear Filters',
  addOrderLabel = 'Add Order',
}) => {
  return (
    <div className="admin-empty-state">
      <Icon name={icon} className="empty-state-icon-large" />
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
      <div className="empty-state-actions">
        {onClearFilters && (
          <button className="btn btn-ghost btn-small" onClick={onClearFilters}>
            <Icon name="filter-circle-xmark" /> {clearFiltersLabel}
          </button>
        )}
        {onAddOrder && (
          <button className="btn btn-primary btn-small" onClick={onAddOrder}>
            <Icon name="plus" /> {addOrderLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
