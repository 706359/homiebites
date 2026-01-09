'use client';

import { useEffect, useState } from 'react';

const KeyboardShortcuts = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { key: 'G + D', description: 'Go to Dashboard' },
        { key: 'G + O', description: 'Go to Orders' },
        { key: 'G + A', description: 'Go to Analytics' },
        { key: 'G + C', description: 'Go to Customers' },
        { key: 'G + S', description: 'Go to Settings' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { key: 'N', description: 'New Order' },
        { key: 'U', description: 'Upload CSV' },
        { key: '/', description: 'Focus Search' },
        { key: 'Esc', description: 'Close Modal/Dialog' },
      ],
    },
    {
      category: 'Table Operations',
      items: [
        { key: '↑ ↓', description: 'Navigate rows' },
        { key: 'Enter', description: 'Select row' },
        { key: 'Ctrl + F', description: 'Find in table' },
        { key: 'Ctrl + S', description: 'Export table' },
      ],
    },
    {
      category: 'General',
      items: [
        { key: '?', description: 'Show shortcuts (this dialog)' },
        { key: 'Ctrl + K', description: 'Command palette' },
        { key: 'Ctrl + /', description: 'Toggle sidebar' },
      ],
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-keyboard" style={{ marginRight: '12px' }}></i>
            Keyboard Shortcuts
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gap: '32px' }}>
            {shortcuts.map((category, idx) => (
              <div key={idx}>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--admin-text-primary)',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {category.category}
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--admin-bg-secondary)',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--admin-accent-light)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ color: 'var(--admin-text-secondary)', fontSize: '14px' }}>
                        {item.description}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {item.key.split(' + ').map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            style={{
                              padding: '4px 8px',
                              background: 'var(--admin-bg)',
                              border: '1px solid var(--admin-border)',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                              color: 'var(--admin-text-primary)',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '32px',
              padding: '16px',
              background: 'var(--admin-accent-light)',
              borderRadius: '8px',
              border: '1px solid var(--admin-accent)',
            }}
          >
            <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', margin: 0 }}>
              <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
              Tip: Press <kbd style={{ padding: '2px 6px', background: 'var(--admin-bg)', borderRadius: '4px' }}>?</kbd> anytime to
              open this dialog
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;

