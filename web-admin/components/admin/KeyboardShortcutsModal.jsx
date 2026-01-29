'use client';

import { useEffect, useRef } from 'react';
import Icon from '../ui/Icon.jsx';
import {
  handleFocusTrapKeydown,
  useModalFocus,
} from './hooks/useModalFocus.js';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], macKeys: ['⌘', 'K'], label: 'Search' },
  { keys: ['Ctrl', 'N'], macKeys: ['⌘', 'N'], label: 'Add new order' },
  { keys: ['Escape'], macKeys: ['Escape'], label: 'Close modal / Cancel' },
];

const KeyboardShortcutsModal = ({ show, onClose }) => {
  const containerRef = useRef(null);
  useModalFocus(show, containerRef);

  useEffect(() => {
    if (!show) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      handleFocusTrapKeydown(e, containerRef.current);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [show, onClose]);

  if (!show) return null;

  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={containerRef}
        className="modal-container keyboard-shortcuts-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
      >
        <div className="modal-header">
          <h2 id="keyboard-shortcuts-title">Keyboard shortcuts</h2>
          <button
            type="button"
            className="btn btn-ghost btn-icon modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="times" />
          </button>
        </div>
        <div className="modal-body">
          <ul
            className="keyboard-shortcuts-list"
            aria-label="Keyboard shortcuts"
          >
            {SHORTCUTS.map(({ keys, macKeys, label }) => (
              <li key={label} className="keyboard-shortcut-item">
                <span className="keyboard-shortcut-label">{label}</span>
                <kbd
                  className="keyboard-shortcut-keys"
                  aria-label={`${label}: ${(isMac ? macKeys : keys).join(' + ')}`}
                >
                  {(isMac ? macKeys : keys).join(' + ')}
                </kbd>
              </li>
            ))}
          </ul>
          <p className="keyboard-shortcuts-hint">
            Press <kbd>?</kbd> anytime to open this help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
