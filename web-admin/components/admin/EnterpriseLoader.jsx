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
  const sizePx = { small: 60, medium: 85, large: 125 }[size] ?? 125;
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
        {/* Outside progress – runs around the square (on top of track) */}
        <svg
          className="enterprise-loader__svg-outside"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="1.5"
            y="1.5"
            width="97"
            height="97"
            rx="10"
            ry="10"
            fill="none"
            strokeWidth="3"
            strokeDasharray="388"
            strokeDashoffset="291"
            className="enterprise-loader__svg-progress-rect"
          />
        </svg>
        <div className="enterprise-loader__logo-wrap" aria-hidden="true">
          <div className="enterprise-loader__logo-blur">
            <img
              src={logoSrc}
              alt=""
              className="enterprise-loader__logo"
              onError={(e) => {
                const wrap = e.target?.closest('.enterprise-loader__logo-wrap');
                const blur = wrap?.querySelector(
                  '.enterprise-loader__logo-blur'
                );
                const clean = wrap?.querySelector(
                  '.enterprise-loader__logo-clean'
                );
                const fallback = wrap?.querySelector(
                  '.enterprise-loader__logo-fallback'
                );
                if (blur) blur.style.display = 'none';
                if (clean) clean.style.display = 'none';
                if (fallback) {
                  fallback.style.display = 'flex';
                  fallback.classList.add(
                    'enterprise-loader__logo-fallback--visible'
                  );
                }
              }}
            />
          </div>
          <div className="enterprise-loader__logo-clean">
            <img src={logoSrc} alt="" className="enterprise-loader__logo" />
          </div>
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
