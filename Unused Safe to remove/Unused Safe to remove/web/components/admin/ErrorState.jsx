const ErrorState = ({
  icon = "fa-exclamation-triangle",
  title = "Something went wrong",
  message = "An error occurred while loading data",
  onRetry,
  onContactSupport,
}) => {
  return (
    <div className="admin-error-state">
      <i
        className={`fa-solid ${icon}`}
        style={{
          fontSize: "3rem",
          color: "#ef4444",
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
        {onRetry && (
          <button className="btn btn-primary btn-small" onClick={onRetry}>
            <i className="fa-solid fa-rotate-right"></i> Try Again
          </button>
        )}
        {onContactSupport && (
          <button
            className="btn btn-secondary btn-small"
            onClick={onContactSupport}
          >
            <i className="fa-solid fa-headset"></i> Contact Support
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
