'use client';

import { useState } from 'react';
import Icon from '../components/ui/Icon.jsx';
import Link from 'next/link';
import Footer from '../components/Footer';
import Header from '../components/Header';
import OrderModal from '../components/OrderModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <Icon name="triangle-exclamation"/>
          </div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">
            {t('error.notFound') || 'Page Not Found'}
          </h2>
          <p className="not-found-description">
            {t('error.notFoundDescription') ||
              'The page you are looking for does not exist or has been moved.'}
          </p>
          <div className="not-found-actions">
            <Link href="/" className="btn btn-primary">
              {t('error.goHome') || 'Go to Homepage'}
            </Link>
            <Link href="/menu" className="btn btn-ghost">
              {t('error.viewMenu') || 'View Menu'}
            </Link>
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
}
