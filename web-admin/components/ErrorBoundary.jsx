'use client';

import Link from 'next/link';
import { Component } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error safely without throwing
    try {
      console.error('Error caught by boundary:', error, errorInfo);

      // Dispatch custom event for window-level error handler
      if (typeof window !== 'undefined') {
        const errorEvent = new CustomEvent('react-error', {
          detail: { error, errorInfo },
          bubbles: true,
          cancelable: true,
        });
        window.dispatchEvent(errorEvent);
      }

      // Log to error reporting service in production (if configured)
      if (process.env.NODE_ENV === 'production') {
        // You can integrate with error reporting services like Sentry here
        // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
      }
    } catch (logError) {
      // Even error logging failed, don't crash
      console.error('Error logging failed:', logError);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <LanguageProvider>
          <ErrorFallback
            error={this.state.error}
            resetError={() => this.setState({ hasError: false, error: null })}
          />
        </LanguageProvider>
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, resetError }) {
  // Get translations directly since we're inside LanguageProvider
  const getTranslation = (key, fallback) => {
    // Simple fallback translations
    const translations = {
      'error.title': 'Something went wrong!',
      'error.description': 'We encountered an unexpected error. Please try again.',
      'error.tryAgain': 'Try Again',
      'error.goHome': 'Go to Homepage',
      'error.errorDetails': 'Error Details',
    };
    return translations[key] || fallback || key;
  };

  return (
    <div className='error-container'>
      <div className='error-content'>
        <div className='error-icon'>
          <i className='fa-solid fa-circle-exclamation'></i>
        </div>
        <h1 className='error-title'>{getTranslation('error.title')}</h1>
        <p className='error-description'>{getTranslation('error.description')}</p>
        <div className='error-actions'>
          <button onClick={resetError} className='btn btn-primary'>
            {getTranslation('error.tryAgain')}
          </button>
          <Link href='/' className='btn btn-ghost'>
            {getTranslation('error.goHome')}
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className='error-details'>
            <summary>{getTranslation('error.errorDetails')}</summary>
            <pre className='error-stack'>{error.message || String(error)}</pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default ErrorBoundaryClass;
