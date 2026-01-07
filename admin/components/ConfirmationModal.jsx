import { useEffect } from 'react';

const ConfirmationModal = ({
  show,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'info', 'success'
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  // Handle Escape key
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
          confirmBtn: 'btn-danger',
        };
      case 'success':
        return {
          icon: 'fa-check-circle',
          iconColor: 'var(--admin-success, #449031)',
          iconBg: 'rgba(68, 144, 49, 0.1)',
          confirmBtn: 'btn-success',
        };
      case 'info':
        return {
          icon: 'fa-info-circle',
          iconColor: 'var(--admin-accent, #449031)',
          iconBg: 'rgba(68, 144, 49, 0.1)',
          confirmBtn: 'btn-primary',
        };
      default: // warning
        return {
          icon: 'fa-exclamation-circle',
          iconColor: 'var(--admin-warning, #f59e0b)',
          iconBg: 'rgba(245, 158, 11, 0.1)',
          confirmBtn: 'btn-warning',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="modal-overlay" onClick={!isLoading ? onCancel : undefined}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: styles.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <i
                className={`fa-solid ${styles.icon}`}
                style={{ fontSize: '24px', color: styles.iconColor }}
              ></i>
            </div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{title}</h2>
          </div>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6', color: 'var(--admin-text, #1a202c)' }}>
            {message}
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (onCancelCallback) onCancelCallback();
              if (onCancel) onCancel();
            }}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${styles.confirmBtn}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Processing...
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

