'use client';

import { Component } from 'react';

import Icon from '../ui/Icon.jsx';
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error tracker if available
    if (typeof window !== 'undefined' && window.errorTracker) {
      try {
        window.errorTracker.captureError(error, {
          type: 'react_error_boundary',
          componentStack: errorInfo?.componentStack,
        });
      } catch (trackError) {
        console.error('[ErrorBoundary] Error tracking failed:', trackError);
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="admin-error-state">
          <div className="error-boundary-container">
            <div className="error-boundary-icon-wrapper">
              <Icon name="exclamation-triangle" className="error-boundary-icon"/>
            </div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              {this.props.errorMessage ||
                'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'}
            </p>
            <div className="error-boundary-actions">
              <button className="btn btn-primary" onClick={this.handleReset}>
                <Icon name="rotate-right"/> Try Again
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <Icon name="refresh"/> Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <pre>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
