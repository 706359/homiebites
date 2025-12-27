import './AdminDashboard.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
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
        return 'var(--admin-danger)';
      case 'success':
        return 'var(--admin-success)';
      case 'info':
        return 'var(--admin-accent)';
      default:
        return 'var(--admin-warning)';
    }
  };

  return (
    <div className='confirm-modal-overlay' onClick={handleBackdropClick}>
      <div className='confirm-modal'>
        <div className='confirm-modal-header'>
          <button className='confirm-modal-close' onClick={onClose}>
            <i className='fa-solid fa-times'></i>
          </button>
          <div className='confirm-modal-icon-wrapper' style={{ background: `${getIconColor()}15`, borderColor: `${getIconColor()}30` }}>
            <i className={`fa-solid ${getIcon()}`} style={{ color: getIconColor() }}></i>
          </div>
        </div>
        
        <div className='confirm-modal-body'>
          <h3 className='confirm-modal-title'>{title}</h3>
          <p className='confirm-modal-message'>{message}</p>
        </div>

        <div className='confirm-modal-footer'>
          <button className='confirm-modal-btn confirm-modal-btn-cancel' onClick={onClose}>
            <i className='fa-solid fa-times'></i>
            <span>{cancelText}</span>
          </button>
          <button 
            className={`confirm-modal-btn confirm-modal-btn-confirm confirm-modal-btn-${type}`}
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
