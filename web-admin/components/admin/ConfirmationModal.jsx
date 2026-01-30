import { useEffect, useRef } from 'react';

import { LoadingButton } from '../loaders/LoaderComponents';
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
  const previousFocusRef = useRef(/** @type {HTMLElement | null} */ (null));

  useEffect(() => {
    if (!show) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

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

  // Return focus to trigger when closed (enterprise a11y)
  useEffect(() => {
    if (!show && previousFocusRef.current) {
      const prev = previousFocusRef.current;
      previousFocusRef.current = null;
      requestAnimationFrame(() => {
        if (prev && typeof prev.focus === 'function') prev.focus();
      });
    }
  }, [show]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

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
    <div
      className="modal-overlay confirmation-modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={containerRef}
        className="modal-container max-width-540 confirmation-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-message"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header confirmation-modal-header">
          <div className="flex-center">
            <div
              className="modal-icon-box confirmation-modal-icon-box"
              aria-hidden="true"
            >
              <Icon name={styles.icon} />
            </div>
            <h2
              id="confirmation-modal-title"
              className="confirmation-modal-title"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close confirmation-modal-close"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Close"
            title="Close"
          >
            <Icon name="times" />
          </button>
        </div>
        <div className="modal-body confirmation-modal-body">
          <p id="confirmation-modal-message" className="text-no-margin">
            {message}
          </p>
        </div>
        <div className="modal-footer confirmation-modal-footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isLoading}
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <LoadingButton
            type="button"
            className={`btn ${styles.confirmBtn}`}
            onClick={onConfirm}
            disabled={isLoading}
            loading={isLoading}
            loadingText="Processing..."
            aria-label={confirmText}
          >
            {confirmText}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
