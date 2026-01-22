'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';
import OrderModal from '../components/OrderModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Error({ error, reset }) {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">
            <i className="fa-solid fa-circle-exclamation"></i>
          </div>
          <h1 className="error-title">
            {t('error.title') || 'Something went wrong!'}
          </h1>
          <p className="error-description">
            {t('error.description') ||
              'We encountered an unexpected error. Please try again.'}
          </p>
          <div className="error-actions">
            <button onClick={reset} className="btn btn-primary">
              {t('error.tryAgain') || 'Try Again'}
            </button>
            <Link href="/" className="btn btn-ghost">
              {t('error.goHome') || 'Go to Homepage'}
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>{t('error.errorDetails') || 'Error Details'}</summary>
              <pre className="error-stack">{error.message}</pre>
            </details>
          )}
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
}
