const ConfirmModal = ({
  isOpen,
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  confirmType,
}) => {
  // Support both isOpen and show props for backward compatibility
  const isVisible = isOpen !== undefined ? isOpen : show;
  // Support both type and confirmType props
  const modalType = confirmType || type;
  
  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (modalType) {
      case "danger":
        return "fa-exclamation-triangle";
      case "success":
        return "fa-check-circle";
      case "info":
        return "fa-info-circle";
      default:
        return "fa-question-circle";
    }
  };

  const getIconColor = () => {
    switch (modalType) {
      case "danger":
        return "var(--admin-danger)";
      case "success":
        return "var(--admin-success)";
      case "info":
        return "var(--admin-accent)";
      default:
        return "var(--admin-warning)";
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleBackdropClick}>
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <button
            className="confirm-modal-close btn btn-icon"
            onClick={onClose}
          >
            <i className="fa-solid fa-times"></i>
          </button>
          <div
            className={`confirm-modal-icon-wrapper confirm-modal-icon-${modalType}`}
            data-icon-color={getIconColor()}
          >
            <i className={`fa-solid ${getIcon()}`}></i>
          </div>
        </div>

        <div className="confirm-modal-body">
          <h3 className="confirm-modal-title">{title}</h3>
          <p className="confirm-modal-message">{message}</p>
        </div>

        <div className="confirm-modal-footer">
          <button
            className="confirm-modal-btn btn btn-ghost confirm-modal-btn-cancel"
            onClick={onClose}
          >
            <i className="fa-solid fa-times"></i>
            <span>{cancelText}</span>
          </button>
          <button
            className={`confirm-modal-btn btn btn-primary confirm-modal-btn-confirm confirm-modal-btn-${modalType}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <i className="fa-solid fa-check"></i>
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
