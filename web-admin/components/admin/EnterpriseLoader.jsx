'use client';

import React from 'react';

/**
 * Universal loader: logo in square frame, progress runs around it.
 * Variants: inline (tabs/sections), fullpage (initial load), overlay (refresh/background).
 *
 * @param {object} props
 * @param {string} [props.ariaLabel='Loading'] – Accessible label (no visible text)
 * @param {'small'|'medium'|'large'} [props.size='large'] – Logo/frame size
 * @param {'inline'|'fullpage'|'overlay'} [props.variant='inline'] – inline | fullpage | overlay
 * @param {number|null} [props.progress=null] – 0–100 for optional progress bar below
 * @param {string} [props.logoSrc='/logo.png'] – Logo URL
 */
export default function EnterpriseLoader({
  ariaLabel = 'Loading',
  size = 'large',
  variant = 'inline',
  progress = null,
  logoSrc = '/logo.png',
}) {
  const sizePx = { small: 56, medium: 80, large: 120 }[size] ?? 120;
  const showProgressBar =
    progress != null &&
    typeof progress === 'number' &&
    progress >= 0 &&
    progress <= 100;

  const className = [
    'enterprise-loader',
    variant !== 'inline' ? `enterprise-loader--${variant}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      aria-busy={!showProgressBar}
    >
      <div
        className="enterprise-loader__frame"
        style={{ '--loader-size': `${sizePx}px` }}
      >
        <div className="enterprise-loader__logo-wrap" aria-hidden="true">
          <img
            src={logoSrc}
            alt=""
            className="enterprise-loader__logo"
            onError={(e) => {
              const img = e.target;
              const fallback = img?.nextElementSibling;
              if (img) img.style.display = 'none';
              if (fallback) {
                fallback.style.display = 'flex';
                fallback.classList.add('enterprise-loader__logo-fallback--visible');
              }
            }}
          />
          <div
            className="enterprise-loader__logo-fallback"
            aria-hidden="true"
            style={{ display: 'none' }}
          >
            <span>HB</span>
          </div>
        </div>
      </div>

      {showProgressBar && (
        <div className="enterprise-loader__progress-wrap">
          <div
            className="enterprise-loader__progress-track"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${ariaLabel} ${Math.round(progress)}%`}
          >
            <div
              className="enterprise-loader__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span
            className="enterprise-loader__progress-label"
            aria-hidden="true"
          >
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}
