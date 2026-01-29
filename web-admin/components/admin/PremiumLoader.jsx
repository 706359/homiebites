import React from 'react';

/**
 * Enterprise loader: optional progress bar, a11y, spacing from admin design tokens.
 * @param {string} message - Shown below the logo (always for medium/large unless showText false)
 * @param {'small'|'medium'|'large'} size - Logo and container size
 * @param {boolean} showText - If false, message is hidden (default true for medium/large)
 * @param {number|null} progress - 0–100 for determinate progress bar; omit for indeterminate
 */
const PremiumLoader = ({
  message = 'Loading...',
  size = 'large',
  showText = true,
  progress = null,
}) => {
  const sizeMap = { small: 48, medium: 67, large: 180 };
  const px = sizeMap[size] ?? 180;
  const showMessage = showText && message;
  const showProgressBar =
    progress != null && typeof progress === 'number' && progress >= 0 && progress <= 100;

  return (
    <div
      className="premium-loader-container admin-loader"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="premium-loader-wrapper">
        <div
          className="premium-loader-logo-container"
          style={{ width: px, height: px, minWidth: px, minHeight: px }}
          aria-hidden="true"
        >
          <img
            src="/logo.png"
            alt=""
            className="premium-loader-logo"
            onError={(e) => {
              const t = e.target;
              if (t && t.nextElementSibling) {
                t.style.display = 'none';
                t.nextElementSibling.style.display = 'flex';
              }
            }}
          />
          <div
            className="premium-loader-logo-fallback"
            style={{ display: 'none', width: '100%', height: '100%' }}
            aria-hidden="true"
          >
            <span>HB</span>
          </div>
        </div>
      </div>

      {showMessage && (
        <p className="premium-loader-text admin-loader-message">{message}</p>
      )}

      {showProgressBar && (
        <div className="admin-loader-progress-wrap">
          <div
            className="admin-loader-progress-track"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${message} ${Math.round(progress)}%`}
          >
            <div
              className="admin-loader-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="admin-loader-progress-label" aria-hidden="true">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default PremiumLoader;
