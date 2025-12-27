import { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium', // 'small', 'medium', 'large', 'full'
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${className}`}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role='dialog'
      aria-modal='true'
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={`modal-wrapper modal-${size}`} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div className='modal-header'>
            {title && <h2 className='modal-title'>{title}</h2>}
            {showCloseButton && (
              <button className='modal-close-btn' onClick={onClose} aria-label='Close modal'>
                <i className='fa-solid fa-xmark'></i>
              </button>
            )}
          </div>
        )}
        <div className='modal-content'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
