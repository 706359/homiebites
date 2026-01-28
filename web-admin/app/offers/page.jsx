'use client';

import Link from 'next/link';
import Icon from '../../components/ui/Icon.jsx';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { getOffersData } from '../../lib/offersData';
import '../../pages/OffersPage.css';
import '../../styles/globals.css';

export default function OffersPage() {
  const { t } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await getOffersData();

        const validOffers = data.filter((offer) => {
          const hasValidTitle =
            offer.title &&
            offer.title.trim() !== '' &&
            !offer.title.toLowerCase().includes('test') &&
            !offer.title.toLowerCase().includes('saved via');

          const isActive = offer.isActive !== false;

          const notExpired =
            !offer.endDate || new Date(offer.endDate) >= new Date();

          return hasValidTitle && isActive && notExpired;
        });
        setOffers(validOffers);
      } catch (error) {
        console.error('Error loading offers:', error);
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    };

    try {
      loadOffers().catch((err) => {
        console.error('loadOffers promise rejected:', err);
        setIsLoading(false);
        setOffers([]);
      });
    } catch (err) {
      console.error('loadOffers threw synchronously:', err);
      setIsLoading(false);
      setOffers([]);
    }
  }, []);

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  const handleGetDeal = () => {
    // Open order form instead of direct WhatsApp
    openOrderModal();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return String(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  if (isLoading) {
    return (
      <>
        <Header onOrderClick={openOrderModal} />
        <div className="offers-page">
          <div className="offers-container">
            <div className="offers-loading-state">
              <p>{t('common.loading') || 'Loading...'}</p>
            </div>
          </div>
        </div>
        <Footer onOrderClick={openOrderModal} />
      </>
    );
  }

  if (offers.length === 0) {
    return (
      <>
        <Header onOrderClick={openOrderModal} />
        <div className="offers-page">
          <div className="offers-container">
            <h1 className="offers-title">
              {t('offers.title') || 'Special Offers & Discounts'}
            </h1>
            <div className="no-offers-container">
              <Icon name="tag" className="no-offers-icon"/>
              <h2 className="no-offers-title">
                {t('offers.noOffersTitle') || 'No Active Offers'}
              </h2>
              <p className="no-offers-text">
                {t('offers.noOffers') ||
                  "We currently don't have any active offers. Check back soon for exciting deals and special discounts!"}
              </p>
              <div className="no-offers-actions">
                <a href="/#gallery" className="btn btn-primary">
                  <Icon name="images"/> View Gallery
                </a>
                <Link href="/" className="btn btn-secondary">
                  <Icon name="home"/> Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer onOrderClick={openOrderModal} />
      </>
    );
  }

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className="offers-page">
        <div className="offers-container">
          <h1 className="offers-title">
            {t('offers.title') || 'Special Offers & Discounts'}
          </h1>
          <p className="offers-subtitle">
            {t('offers.subtitle') ||
              'Discover our latest deals and special offers'}
          </p>

          <div className="offers-grid">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                {offer.badge && (
                  <div className="offer-badge">{offer.badge}</div>
                )}
                <div className="offer-card-header">
                  <h2 className="offer-card-title">{offer.title}</h2>
                  {offer.discount && (
                    <div className="offer-discount">{offer.discount}</div>
                  )}
                </div>
                {offer.description && (
                  <p className="offer-description">{offer.description}</p>
                )}
                {offer.terms && offer.terms.length > 0 && (
                  <div className="offer-terms">
                    <h3>{t('offers.terms') || 'Terms & Conditions:'}</h3>
                    <ul>
                      {offer.terms.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(offer.startDate || offer.endDate) && (
                  <div className="offer-dates">
                    {offer.startDate && (
                      <div>
                        <strong>{t('offers.starts') || 'Starts:'}</strong>{' '}
                        {formatDate(offer.startDate)}
                      </div>
                    )}
                    {offer.endDate && (
                      <div>
                        <strong>{t('offers.ends') || 'Ends:'}</strong>{' '}
                        {formatDate(offer.endDate)}
                      </div>
                    )}
                  </div>
                )}
                <button
                  className="btn btn-primary offer-cta-btn"
                  onClick={() => handleGetDeal(offer)}
                >
                  <Icon name="whatsapp"/>{' '}
                  {offer.ctaText || t('offers.getDeal') || 'Get This Deal'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
}
