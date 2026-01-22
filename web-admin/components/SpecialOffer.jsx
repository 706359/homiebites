'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getFormattedPhone,
  getPhoneLink,
  getWhatsAppLink,
} from '../lib/businessConstants';
import api from '../lib/api';
import './SpecialOffer.css';

const SpecialOffer = () => {
  const { t } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOffer, setActiveOffer] = useState(null);

  useEffect(() => {
    let refreshInterval;
    let visibilityInterval;

    const loadOffers = async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
        const response = await api.getOffers();

        if (process.env.NODE_ENV === 'development') {
          console.log('[SpecialOffer] Fetched offers:', {
            success: response?.success,
            offersCount: response?.data?.length || 0,
          });
        }

        if (response.success && response.data && Array.isArray(response.data)) {
          // Filter active offers
          const now = new Date();
          const active = response.data.filter((offer) => {
            if (!offer.isActive) return false;
            if (offer.endDate && new Date(offer.endDate) < now) return false;
            if (!offer.title || offer.title.trim() === '') return false;
            return true;
          });

          setOffers(active);
          // Use the first active offer, or null if none
          setActiveOffer(active.length > 0 ? active[0] : null);
        } else {
          setOffers([]);
          setActiveOffer(null);
        }
      } catch (error) {
        console.error('[SpecialOffer] Error loading offers:', error);
        setOffers([]);
        setActiveOffer(null);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    // Initial load
    loadOffers(true);

    // Refresh every 60 seconds
    refreshInterval = setInterval(() => {
      if (!document.hidden) {
        loadOffers(false);
      }
    }, 60000);

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden && process.env.NODE_ENV === 'development') {
        console.log('[SpecialOffer] Tab became visible, refreshing...');
        loadOffers(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for custom events to trigger immediate refresh (from admin panel)
    const handleOffersUpdate = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          '[SpecialOffer] Received offers update event, refreshing immediately...'
        );
      }
      loadOffers(false);
    };

    window.addEventListener('offersDataUpdated', handleOffersUpdate);

    // Check for changes in localStorage (cross-tab communication)
    const checkStorageChanges = () => {
      if (typeof window === 'undefined') return;
      try {
        const lastUpdate = localStorage.getItem('offers-last-update');
        const currentTime = Date.now();
        if (lastUpdate && currentTime - parseInt(lastUpdate) < 10000) {
          if (process.env.NODE_ENV === 'development') {
            console.log(
              '[SpecialOffer] Detected recent update via localStorage, refreshing...'
            );
          }
          loadOffers(false);
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    };

    visibilityInterval = setInterval(checkStorageChanges, 2000);

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
      if (visibilityInterval) clearInterval(visibilityInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('offersDataUpdated', handleOffersUpdate);
    };
  }, []);

  const handleGetDeal = () => {
    const message = activeOffer?.whatsappMessage || t('specialOffer.whatsappMessage');
    window.open(getWhatsAppLink(message), '_blank', 'noopener');
  };

  // Use offer data if available, otherwise fall back to translations
  const offerTitle = activeOffer?.title || t('specialOffer.title');
  const offerDescription = activeOffer?.description || t('specialOffer.text');
  const offerDiscount = activeOffer?.discount || t('specialOffer.discount');
  const offerKicker = activeOffer?.badge || t('specialOffer.intro') || 'For busy professionals and families';
  const ctaText = activeOffer?.ctaText || t('common.orderOnWhatsApp');

  return (
    <section className="offer-section">
      <div className="section-container">
        <div className="offer-header">
          {offerKicker && (
            <span className="offer-kicker">{offerKicker}</span>
          )}
          <h2 className="offer-title">{offerTitle}</h2>
          <p className="offer-text">
            {offerDescription}{' '}
            {offerDiscount && (
              <>
                <strong>{offerDiscount}</strong>{' '}
                {t('specialOffer.onTotal')}
              </>
            )}
          </p>
          {activeOffer?.terms && Array.isArray(activeOffer.terms) && activeOffer.terms.length > 0 && (
            <ul className="offer-terms">
              {activeOffer.terms
                .filter((term) => term && term.trim() !== '')
                .map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
            </ul>
          )}
        </div>
        <div className="offer-actions">
          <a
            href={getWhatsAppLink(activeOffer?.whatsappMessage || '')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-small"
            onClick={handleGetDeal}
          >
            <i className="fa-brands fa-whatsapp"></i> {ctaText}
          </a>
          <a href={getPhoneLink()} className="btn btn-secondary btn-small">
            <i className="fa-solid fa-phone"></i> {t('common.call')}{' '}
            {getFormattedPhone()}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
