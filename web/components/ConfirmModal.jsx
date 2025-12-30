import './ConfirmModal.css';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return 'fa-exclamation-triangle';
      case 'success':
        return 'fa-check-circle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-question-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'var(--primary-orange)';
      case 'success':
        return 'var(--primary-green)';
      case 'info':
        return 'var(--primary-green)';
      default:
        return 'var(--primary-orange)';
    }
  };

  return (
    <div className='confirm-modal-overlay' onClick={handleBackdropClick}>
      <div className='confirm-modal'>
        <div className='confirm-modal-header'>
          <button className='confirm-modal-close btn btn-icon' onClick={onClose}>
            <i className='fa-solid fa-times'></i>
          </button>
          <div
            className='confirm-modal-icon-wrapper'
            data-type={type}
          >
            <i className={`fa-solid ${getIcon()} confirm-modal-icon`}></i>
          </div>
        </div>

        <div className='confirm-modal-body'>
          <h3 className='confirm-modal-title'>{title}</h3>
          <p className='confirm-modal-message'>{message}</p>
        </div>

        <div className='confirm-modal-footer'>
          <button
            className='confirm-modal-btn btn btn-ghost confirm-modal-btn-cancel'
            onClick={onClose}
          >
            <i className='fa-solid fa-times'></i>
            <span>{cancelText}</span>
          </button>
          <button
            className={`confirm-modal-btn btn btn-primary confirm-modal-btn-confirm confirm-modal-btn-${type}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <i className='fa-solid fa-check'></i>
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
