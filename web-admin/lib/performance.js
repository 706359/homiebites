/**
 * Performance Utilities
 *
 * Utilities for performance optimization, lazy loading, and code splitting
 */

/**
 * Debounce function to limit function calls
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load image with intersection observer
 */
export function lazyLoadImage(imgElement, src) {
  if (!imgElement || !('IntersectionObserver' in window)) {
    // Fallback: load immediately
    if (imgElement) imgElement.src = src;
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  imageObserver.observe(imgElement);
}

/**
 * Preload critical resources
 */
export function preloadResource(href, as = 'script', crossorigin = false) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Prefetch resource for faster navigation
 */
export function prefetchResource(href) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Measure function execution time
 */
export function measurePerformance(name, fn) {
  if (typeof performance === 'undefined') {
    return fn();
  }

  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Check if device is mobile
 */
export function isMobile() {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if connection is slow
 */
export function isSlowConnection() {
  if (typeof navigator === 'undefined' || !navigator.connection) return false;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  return (
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g'
  );
}

/**
 * Optimize images based on device
 */
export function getOptimizedImageUrl(baseUrl, width = null) {
  if (!baseUrl) return baseUrl;

  // If width is specified, use Next.js Image Optimization API
  if (width && baseUrl.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(baseUrl)}&w=${width}&q=75`;
  }

  return baseUrl;
}
