import { useEffect, useRef } from 'react';

import Icon from '../ui/Icon.jsx';
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const containerRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const handleKey = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key === 'Enter' && !isLoading && onConfirm) {
        e.preventDefault();
        onConfirm();
        return;
      }
      if (e.key !== 'Tab') return;
      const el = containerRef.current;
      if (!el) return;
      const focusables = Array.from(el.querySelectorAll(FOCUSABLE));
      if (focusables.length < 2) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [show, isLoading, onCancel, onConfirm]);

  // Focus first focusable when opened
  useEffect(() => {
    if (show && containerRef.current) {
      const first = containerRef.current.querySelector(FOCUSABLE);
      if (first) {
        const t = requestAnimationFrame(() => {
          first.focus();
        });
        return () => cancelAnimationFrame(t);
      }
    }
  }, [show]);

  if (!show) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'exclamation-triangle',
          iconColor: 'var(--admin-danger, #dc2626)',
          iconBg: 'rgba(220, 38, 38, 0.1)',
          confirmBtn: 'btn-special danger',
        };
      case 'success':
        return {
          icon: 'check-circle',
          iconColor: 'var(--admin-success, #16a34a)',
          iconBg: 'rgba(22, 163, 74, 0.1)',
          confirmBtn: 'btn-primary',
        };
      case 'info':
        return {
          icon: 'info-circle',
          iconColor: 'var(--admin-accent, #449031)',
          iconBg: 'rgba(68, 144, 49, 0.1)',
          confirmBtn: 'btn-primary',
        };
      default:
        return {
          icon: 'exclamation-circle',
          iconColor: 'var(--admin-warning, #f59e0b)',
          iconBg: 'rgba(245, 158, 11, 0.1)',
          confirmBtn: 'btn-secondary',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="modal-overlay">
      <div
        ref={containerRef}
        className="modal-container max-width-540"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-message"
      >
        <div className="modal-header">
          <div className="flex-center">
            <div className="modal-icon-box">
              <Icon name={styles.icon} />
            </div>
            <h2 id="confirmation-modal-title">{title}</h2>
          </div>
        </div>
        <div className="modal-body">
          <p id="confirmation-modal-message" className="text-no-margin">
            {message}
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
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
                <Icon name="spinner" spin /> Processing...
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
