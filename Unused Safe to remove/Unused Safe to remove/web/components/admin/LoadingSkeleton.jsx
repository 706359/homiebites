const LoadingSkeleton = ({ type = "table", rows = 5, columns = 5 }) => {
  if (type === "table") {
    return (
      <div className="loading-skeleton-table">
        <div className="skeleton-header">
          {Array.from({ length: columns }).map((_, idx) => (
            <div key={idx} className="skeleton-cell skeleton-header-cell"></div>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="skeleton-row">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div key={colIdx} className="skeleton-cell"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="loading-skeleton-cards">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="skeleton-card">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="loading-skeleton-default">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="skeleton-line"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
