/**
 * Monitoring and Analytics Service
 * 
 * This module provides centralized monitoring, error tracking, and analytics.
 * Can be extended to integrate with services like Sentry, Google Analytics, etc.
 */

class MonitoringService {
  constructor() {
    this.isInitialized = false;
    this.errorQueue = [];
    this.performanceMetrics = [];
  }

  /**
   * Initialize monitoring service
   */
  init() {
    if (this.isInitialized) return;

    // Track page views
    if (typeof window !== 'undefined') {
      this.trackPageView();
      
      // Track performance metrics
      this.trackPerformance();
      
      // Track errors
      this.setupErrorTracking();
    }

    this.isInitialized = true;
  }

  /**
   * Track page view
   */
  trackPageView(path = null) {
    if (typeof window === 'undefined') return;

    const pagePath = path || window.location.pathname;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Page view:', pagePath);
    }

    // TODO: Integrate with Google Analytics, Mixpanel, etc.
    // Example: gtag('config', 'GA_MEASUREMENT_ID', { page_path: pagePath });
  }

  /**
   * Track custom events
   */
  trackEvent(eventName, eventData = {}) {
    if (typeof window === 'undefined') return;

    const event = {
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Event:', event);
    }

    // TODO: Send to analytics service
    // Example: gtag('event', eventName, eventData);
  }

  /**
   * Track errors
   */
  trackError(error, context = {}) {
    const errorData = {
      message: error?.message || String(error),
      stack: error?.stack,
      name: error?.name,
      context,
      timestamp: new Date().toISOString(),
      path: typeof window !== 'undefined' ? window.location.pathname : 'server',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    };

    // Add to queue
    this.errorQueue.push(errorData);

    // Log to console
    console.error('[Error Tracking]', errorData);

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: context });
  }

  /**
   * Track performance metrics
   */
  trackPerformance() {
    if (typeof window === 'undefined') return;

    // Wait for page load
    if (document.readyState === 'complete') {
      this.capturePerformanceMetrics();
    } else {
      window.addEventListener('load', () => {
        this.capturePerformanceMetrics();
      });
    }
  }

  /**
   * Capture performance metrics
   */
  capturePerformanceMetrics() {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      const metrics = {
        dns: navigation.dnsEnd - navigation.dnsStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
      };

      this.performanceMetrics.push(metrics);

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Performance]', metrics);
      }

      // TODO: Send to performance monitoring service
      // Example: sendToAnalytics('performance', metrics);
    } catch (error) {
      console.error('[Performance Tracking Error]', error);
    }
  }

  /**
   * Setup error tracking
   */
  setupErrorTracking() {
    if (typeof window === 'undefined') return;

    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.trackError(event.error || event.message, {
        type: 'unhandled_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason, {
        type: 'unhandled_rejection',
      });
    });
  }

  /**
   * Track API calls
   */
  trackAPI(endpoint, method, duration, status, error = null) {
    const apiCall = {
      endpoint,
      method,
      duration,
      status,
      error: error?.message,
      timestamp: new Date().toISOString(),
    };

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Tracking]', apiCall);
    }

    // TODO: Send to monitoring service
    // Track slow API calls (> 1 second)
    if (duration > 1000) {
      console.warn('[Slow API]', apiCall);
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    if (this.performanceMetrics.length === 0) return null;

    const latest = this.performanceMetrics[this.performanceMetrics.length - 1];
    return {
      loadTime: latest.load,
      domTime: latest.dom,
      firstContentfulPaint: latest.firstContentfulPaint,
    };
  }
}

// Create singleton instance
const monitoringService = new MonitoringService();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  monitoringService.init();
}

export default monitoringService;
