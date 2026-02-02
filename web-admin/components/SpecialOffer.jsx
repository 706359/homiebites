'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../lib/api';
import {
  getFormattedPhone,
  getPhoneLink,
  getWhatsAppLink,
} from '../lib/businessConstants';
import './SpecialOffer.css';
import Icon from './ui/Icon.jsx';

const SpecialOffer = ({ onOrderClick }) => {
  const { t } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOffer, setActiveOffer] = useState(null);

  useEffect(() => {
    let refreshInterval;
    let visibilityInterval;

    const loadOffers = async (showLoading = false, useCache = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        // Try to load from cache first for fast initial render
        if (useCache && typeof window !== 'undefined') {
          try {
            const cachedData = localStorage.getItem('homiebites_offers_data');
            const cacheTimestamp = localStorage.getItem(
              'homiebites_offers_data_timestamp'
            );

            if (cachedData && cacheTimestamp) {
              const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
              const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

              // Use cache if it's less than 5 minutes old
              if (cacheAge < CACHE_DURATION) {
                try {
                  const parsed = JSON.parse(cachedData);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    // Filter active offers from cache
                    const now = new Date();
                    const active = parsed.filter((offer) => {
                      if (!offer.isActive) return false;
                      if (offer.endDate && new Date(offer.endDate) < now)
                        return false;
                      if (!offer.title || offer.title.trim() === '')
                        return false;
                      return true;
                    });

                    if (active.length > 0 || parsed.length > 0) {
                      setOffers(active);
                      setActiveOffer(active.length > 0 ? active[0] : null);
                      if (showLoading) {
                        setLoading(false);
                      }
                      // Still fetch fresh data in background if cache is older than 1 minute
                      if (cacheAge > 60 * 1000) {
                        loadOffers(false, false); // Fetch fresh data without showing loading
                      }
                      return;
                    }
                  }
                } catch (parseError) {
                  // If cache parse fails, continue to API fetch
                  if (process.env.NODE_ENV === 'development') {
                    console.warn(
                      '[SpecialOffer] Cache parse failed:',
                      parseError
                    );
                  }
                }
              }
            }
          } catch (cacheError) {
            // If cache read fails, continue to API fetch
            if (process.env.NODE_ENV === 'development') {
              console.warn('[SpecialOffer] Cache read failed:', cacheError);
            }
          }
        }

        // Fetch from API
        const response = await api.getOffers();

        if (process.env.NODE_ENV === 'development') {
          console.log('[SpecialOffer] Fetched offers:', {
            success: response?.success,
            offersCount: response?.data?.length || 0,
          });
        }

        if (response.success && response.data && Array.isArray(response.data)) {
          // Save to cache
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(
                'homiebites_offers_data',
                JSON.stringify(response.data)
              );
              localStorage.setItem(
                'homiebites_offers_data_timestamp',
                String(Date.now())
              );
            } catch (storageError) {
              if (process.env.NODE_ENV === 'development') {
                console.warn(
                  '[SpecialOffer] Failed to save to cache:',
                  storageError
                );
              }
            }
          }

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

    // Initial load - will use cache if available for fast load
    loadOffers(true, true);

    // Refresh every 5 minutes (cache duration)
    refreshInterval = setInterval(
      () => {
        if (!document.hidden) {
          loadOffers(false, false); // Always fetch fresh data on interval
        }
      },
      5 * 60 * 1000
    );

    // Listen for visibility changes - refresh if cache is stale
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Check if cache is stale before refreshing
        if (typeof window !== 'undefined') {
          try {
            const cacheTimestamp = localStorage.getItem(
              'homiebites_offers_data_timestamp'
            );
            if (cacheTimestamp) {
              const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
              // Only refresh if cache is older than 2 minutes
              if (cacheAge > 2 * 60 * 1000) {
                loadOffers(false, false);
              }
            } else {
              // No cache, fetch fresh data
              loadOffers(false, false);
            }
          } catch (e) {
            // If check fails, fetch fresh data
            loadOffers(false, false);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for custom events to trigger immediate refresh (from admin panel)
    const handleOffersUpdate = () => {
      // Clear cache and fetch fresh data when offers are updated
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('homiebites_offers_data');
          localStorage.removeItem('homiebites_offers_data_timestamp');
        } catch (e) {
          // Ignore errors
        }
      }
      if (process.env.NODE_ENV === 'development') {
        console.log(
          '[SpecialOffer] Received offers update event, refreshing immediately...'
        );
      }
      loadOffers(false, false);
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

  const handleGetDeal = (e) => {
    e.preventDefault();
    if (onOrderClick) {
      onOrderClick();
    } else {
      // Fallback to WhatsApp if onOrderClick not provided
      const message =
        activeOffer?.whatsappMessage || t('specialOffer.whatsappMessage');
      window.open(getWhatsAppLink(message), '_blank', 'noopener');
    }
  };

  // Use offer data if available, otherwise fall back to translations
  const offerTitle = activeOffer?.title || t('specialOffer.title');
  const offerDescription = activeOffer?.description || t('specialOffer.text');
  const offerDiscount = activeOffer?.discount || t('specialOffer.discount');
  const offerKicker =
    activeOffer?.badge ||
    t('specialOffer.intro') ||
    'For busy professionals and families';
  const ctaText = activeOffer?.ctaText || t('common.orderOnWhatsApp');

  // Only append discount line when it exists and isn't already in the description (avoids "50/- off Flat 50/- on first Order... Flat 50/- on your total bill")
  const descriptionIncludesDiscount =
    offerDiscount &&
    offerDescription &&
    offerDescription
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .includes(offerDiscount.toLowerCase().replace(/\s+/g, ' '));
  const showDiscountSuffix = offerDiscount && !descriptionIncludesDiscount;

  return (
    <section className="offer-section" aria-labelledby="offer-title">
      <div className="offer-section-inner">
        <div className="offer-card">
          <div className="offer-header">
            {offerKicker && <span className="offer-kicker">{offerKicker}</span>}
            <h2 id="offer-title" className="offer-title">
              {offerTitle}
            </h2>
            <p className="offer-text">
              {offerDescription}
              {showDiscountSuffix && (
                <>
                  {' '}
                  <strong>{offerDiscount}</strong> {t('specialOffer.onTotal')}
                </>
              )}
            </p>
            {activeOffer?.terms &&
              Array.isArray(activeOffer.terms) &&
              activeOffer.terms.length > 0 && (
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
            <button
              onClick={handleGetDeal}
              className="btn btn-primary offer-cta-primary"
              type="button"
            >
              <Icon name="whatsapp" /> {ctaText}
            </button>
            <a
              href={getPhoneLink()}
              className="btn btn-secondary offer-cta-secondary"
            >
              <Icon name="phone" /> {t('common.call')} {getFormattedPhone()}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
