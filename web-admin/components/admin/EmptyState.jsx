const EmptyState = ({
  icon = "fa-inbox",
  title = "No data found",
  message = "Try adjusting your filters",
  onClearFilters,
  onAddOrder,
  clearFiltersLabel = "Clear Filters",
  addOrderLabel = "Add Order",
}) => {
  return (
    <div className="admin-empty-state">
      <i
        className={`fa-solid ${icon}`}
        style={{
          fontSize: "3rem",
          color: "#64748b",
          marginBottom: "1rem",
        }}
      ></i>
      <h3
        style={{
          margin: "0 0 0.5rem 0",
          fontSize: "1.25rem",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        {title}
      </h3>
      {message && (
        <p
          style={{
            margin: "0 0 1.5rem 0",
            fontSize: "0.95rem",
            color: "#64748b",
          }}
        >
          {message}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {onClearFilters && (
          <button className="btn btn-ghost btn-small" onClick={onClearFilters}>
            <i className="fa-solid fa-filter-circle-xmark"></i>{" "}
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
