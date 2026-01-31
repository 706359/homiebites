'use client';

import React, { useCallback, useRef, useState } from 'react';
import CompactSpinner from '../admin/CompactSpinner';
import EnterpriseLoader from '../admin/EnterpriseLoader';
import AdminSkeletonLoader from '../admin/SkeletonLoader';

/**
 * HommieBites Loader System – Loaders.md API
 * All loaders use EnterpriseLoader (logo in square, progress runs around).
 * CSS: LoaderStyles.css (hb- prefix) + admin loader.css (loaded in layout).
 */

// Public skeleton (default, gallery, faq, card with count) – styles in globals.css
function PublicSkeleton({ type = 'default', count = 1 }) {
  if (type === 'gallery') {
    return (
      <div className="skeleton-gallery">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-gallery-item">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'faq') {
    return (
      <div className="skeleton-faq">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-faq-item">
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'card') {
    return (
      <div className="skeleton-cards">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="skeleton-default">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-line"></div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full Page Loader (initial load)
// ---------------------------------------------------------------------------
export function FullPageLoader({
  show = true,
  logoSrc = '/logo.png',
  title = 'Loading Dashboard',
  subtitle = 'Initializing kitchen command center...',
}) {
  if (!show) return null;
  const ariaLabel = subtitle ? `${title}. ${subtitle}` : title;
  return (
    <div
      className="hb-loader-fullpage"
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      <EnterpriseLoader
        variant="fullpage"
        size="large"
        logoSrc={logoSrc}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overlay Loader (refresh, sync)
// ---------------------------------------------------------------------------
export function OverlayLoader({ show = false, message = 'Loading...' }) {
  const overlayRef = useRef(null);
  if (!show) return null;
  return (
    <div
      ref={(el) => {
        overlayRef.current = el;
        if (el) el.setAttribute('inert', '');
      }}
      className="hb-loader-overlay"
      role="status"
      aria-live="polite"
      aria-label={message}
      aria-busy="true"
    >
      <EnterpriseLoader
        variant="overlay"
        size="medium"
        ariaLabel={message}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Loader (tabs, sections)
// ---------------------------------------------------------------------------
export function InlineLoader({
  message = 'Loading...',
  spinnerType = 'bars',
  logoSrc = '/logo.png',
}) {
  return (
    <div
      className="hb-loader-inline"
      role="status"
      aria-live="polite"
      aria-label={message}
      aria-busy="true"
    >
      <EnterpriseLoader
        variant="inline"
        size="large"
        ariaLabel={message}
        logoSrc={logoSrc}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compact Loader (buttons, small areas)
// ---------------------------------------------------------------------------
export function CompactLoader({ message = 'Loading...', size = 'medium' }) {
  const sizeClass =
    size === 'small'
      ? 'hb-loader-compact--small'
      : size === 'large'
        ? 'hb-loader-compact--large'
        : 'hb-loader-compact--medium';
  return (
    <div
      className={`hb-loader-compact ${sizeClass}`}
      role="status"
      aria-label={message}
    >
      <CompactSpinner label={message} ariaLabel={message} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading Button
// ---------------------------------------------------------------------------
export function LoadingButton({
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <CompactSpinner label={loadingText} ariaLabel={loadingText} />
      ) : (
        children
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Skeleton Loader (re-export with Loaders.md API)
// ---------------------------------------------------------------------------
export function SkeletonLoaderWrapper({
  type = 'table',
  lines = 3,
  rows = 10,
  cols = 9,
  items = 6,
  count,
}) {
  const usePublicSkeleton =
    type === 'default' ||
    type === 'gallery' ||
    type === 'faq' ||
    (type === 'card' && count != null);
  if (usePublicSkeleton) {
    const publicCount =
      type === 'default' ? count ?? lines ?? items ?? 1 : count ?? items ?? 1;
    return (
      <div className="hb-skeleton-loader">
        <PublicSkeleton type={type} count={publicCount} />
      </div>
    );
  }
  if (type === 'table') {
    return (
      <div className="hb-skeleton-loader">
        <AdminSkeletonLoader type="table" rows={rows} cols={cols} />
      </div>
    );
  }
  if (type === 'card') {
    return (
      <div className="hb-skeleton-loader">
        <AdminSkeletonLoader type="card" items={items} />
      </div>
    );
  }
  if (type === 'stat') {
    return (
      <div className="hb-skeleton-loader">
        <AdminSkeletonLoader type="stat" items={items} />
      </div>
    );
  }
  return (
    <div className="hb-skeleton-loader">
      <AdminSkeletonLoader type="table" rows={lines} cols={4} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading Wrapper
// ---------------------------------------------------------------------------
export function LoadingWrapper({
  loading = false,
  loaderType = 'inline',
  loaderProps = {},
  children,
}) {
  if (!loading) return <>{children}</>;

  if (loaderType === 'skeleton') {
    const { type = 'table', rows, cols, items, lines, count } = loaderProps;
    return (
      <SkeletonLoaderWrapper
        type={type}
        rows={rows}
        cols={cols}
        items={items}
        lines={lines}
        count={count}
      />
    );
  }

  if (loaderType === 'overlay') {
    return (
      <>
        {children}
        <OverlayLoader
          show={true}
          message={loaderProps.message || 'Loading...'}
        />
      </>
    );
  }

  return (
    <InlineLoader
      message={loaderProps.message || 'Loading...'}
      spinnerType={loaderProps.spinnerType || 'bars'}
    />
  );
}

// ---------------------------------------------------------------------------
// useLoader hook
// ---------------------------------------------------------------------------
export function useLoader(initialState = false) {
  const [loading, setLoading] = useState(initialState);

  const withLoader = useCallback(async (asyncFn) => {
    if (typeof asyncFn !== 'function') return;
    setLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, setLoading, withLoader };
}

// ---------------------------------------------------------------------------
// Progress Loader (determinate progress)
// ---------------------------------------------------------------------------
export function ProgressLoader({
  message = 'Loading...',
  progress = null,
  logoSrc = '/logo.png',
}) {
  const showProgress = progress != null && progress >= 0 && progress <= 100;
  return (
    <div
      className="hb-loader-inline"
      role="status"
      aria-live="polite"
      aria-label={message}
      aria-busy={!showProgress}
    >
      <EnterpriseLoader
        variant="inline"
        size="medium"
        ariaLabel={message}
        logoSrc={logoSrc}
        progress={showProgress ? progress : null}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spinner (standalone: circular, dual, dots)
// ---------------------------------------------------------------------------
export function Spinner({ type = 'circular', size = 'medium' }) {
  const sizePx = size === 'small' ? 16 : size === 'large' ? 32 : 24;
  if (type === 'dots') {
    return (
      <span className="hb-spinner-dots" role="status" aria-label="Loading">
        <span />
        <span />
        <span />
      </span>
    );
  }
  const className = type === 'dual' ? 'hb-spinner-dual' : 'hb-spinner-circular';
  return (
    <span
      className={className}
      role="status"
      aria-label="Loading"
      style={{ width: sizePx, height: sizePx }}
    />
  );
}

// ---------------------------------------------------------------------------
// Named exports per Loaders.md; default = object
// ---------------------------------------------------------------------------
export { SkeletonLoaderWrapper as SkeletonLoader };
export default {
  FullPageLoader,
  OverlayLoader,
  InlineLoader,
  CompactLoader,
  LoadingButton,
  LoadingWrapper,
  SkeletonLoader: SkeletonLoaderWrapper,
  ProgressLoader,
  Spinner,
  useLoader,
};
