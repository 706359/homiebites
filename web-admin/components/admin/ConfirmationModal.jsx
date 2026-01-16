import { useEffect } from 'react';

const ConfirmationModal = ({
  show,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  useEffect(() => {
    if (!show) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [show, isLoading, onCancel]);

  if (!show) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'fa-exclamation-triangle',
          iconColor: 'var(--admin-danger, #dc2626)',
          iconBg: 'rgba(220, 38, 38, 0.1)',
          confirmBtn: 'btn-special danger',
          btnStyle: null, // Uses .danger modifier
        };
      case 'success':
        return {
          icon: 'fa-check-circle',
          iconColor: 'var(--admin-success, #16a34a)',
          iconBg: 'rgba(22, 163, 74, 0.1)',
          confirmBtn: 'btn-special',
          btnStyle: { '--btn-bg': 'var(--admin-success, #16a34a)', '--btn-bg-hover': '#15803d' },
        };
      case 'info':
        return {
          icon: 'fa-info-circle',
          iconColor: 'var(--admin-accent, #449031)',
          iconBg: 'rgba(68, 144, 49, 0.1)',
          confirmBtn: 'btn-primary',
          btnStyle: null,
        };
      default:
        return {
          icon: 'fa-exclamation-circle',
          iconColor: 'var(--admin-warning, #f59e0b)',
          iconBg: 'rgba(245, 158, 11, 0.1)',
          confirmBtn: 'btn-special',
          btnStyle: { '--btn-bg': 'var(--admin-warning, #f59e0b)', '--btn-bg-hover': '#d97706' },
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className='modal-overlay'>
      <div className='modal-container max-width-540'>
        <div className='modal-header'>
          <div className='flex-center'>
            <div className='modal-icon-box'>
              <i className={`fa-solid ${styles.icon}`}></i>
            </div>
            <h2>{title}</h2>
          </div>
        </div>
        <div className='modal-body'>
          <p className='text-no-margin'>{message}</p>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-ghost' onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            className={`btn ${styles.confirmBtn}`}
            style={styles.btnStyle || undefined}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className='fa-solid fa-spinner fa-spin'></i> Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
