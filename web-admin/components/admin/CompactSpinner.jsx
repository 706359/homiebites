'use client';

import React from 'react';

/**
 * Compact loader for buttons and small areas (e.g. "Saving...", "Processing").
 * Uses admin design tokens.
 *
 * @param {object} props
 * @param {string} [props.label=''] – Optional text next to spinner
 * @param {string} [props.ariaLabel='Loading'] – Accessible label
 */
export default function CompactSpinner({ label = '', ariaLabel = 'Loading' }) {
  return (
    <div
      className="compact-spinner"
      role="status"
      aria-live="polite"
      aria-label={ariaLabel || label || 'Loading'}
    >
      <div className="compact-spinner__spinner" aria-hidden="true" />
      {label ? <span className="compact-spinner__label">{label}</span> : null}
    </div>
  );
}
