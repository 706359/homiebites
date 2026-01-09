const ProgressBar = ({
  isVisible,
  progress,
  message,
  subMessage,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <div className="progress-bar-overlay">
      <div className="progress-bar-modal">
        <div className="progress-bar-header">
          <h3 className="progress-bar-title">{message || "Processing..."}</h3>
          {subMessage && <p className="progress-bar-subtitle">{subMessage}</p>}
        </div>

        <div className="progress-bar-body">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="progress-bar-percentage">{Math.round(progress)}%</div>
        </div>

        <div className="progress-bar-footer">
          <button
            className="btn btn-secondary btn-small"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
