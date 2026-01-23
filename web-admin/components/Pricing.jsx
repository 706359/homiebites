'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../lib/api';
import './Pricing.css';
import SkeletonLoader from './SkeletonLoader';

const PRICING_DATA_KEY = 'homiebites_pricing_data';
const PRICING_CACHE_TIMESTAMP_KEY = 'homiebites_pricing_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

const Pricing = () => {
  const { t } = useLanguage();
  const [pricingItems, setPricingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Process and transform pricing data
  const processPricingData = (data) => {
    if (!data || !Array.isArray(data)) return [];

    return data
      .filter((item) => {
        // Show all active items (not just those with images)
        return item.isActive !== false;
      })
      .map((item) => {
        return {
          id: item._id || item.id,
          name: item.name,
          price: item.price,
          category: item.category || 'Other',
          details:
            item.details &&
            Array.isArray(item.details) &&
            item.details.length > 0
              ? item.details
              : null,
        };
      })
      .sort((a, b) => {
        // Sort by category first, then by name
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });
  };

  // Load pricing items from cache or API
  const loadPricingItems = async (showLoading = false, useCache = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      // Try to load from localStorage first for fast initial render
      if (useCache && typeof window !== 'undefined') {
        try {
          const cachedData = localStorage.getItem(PRICING_DATA_KEY);
          const cacheTimestamp = localStorage.getItem(PRICING_CACHE_TIMESTAMP_KEY);
          
          if (cachedData && cacheTimestamp) {
            const cacheAge = Date.now() - parseInt(cacheTimestamp);
            
            // Use cache if it's less than 5 minutes old
            if (cacheAge < CACHE_DURATION) {
              const parsed = JSON.parse(cachedData);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const processed = processPricingData(parsed);
                if (processed.length > 0) {
                  setPricingItems(processed);
                  if (showLoading) {
                    setLoading(false);
                  }
                  // Still fetch fresh data in background if cache is older than 1 minute
                  if (cacheAge > 60 * 1000) {
                    loadPricingItems(false, false); // Fetch fresh data without showing loading
                  }
                  return;
                }
              }
            }
          }
        } catch (cacheError) {
          // If cache read fails, continue to API fetch
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Pricing] Cache read failed:', cacheError);
          }
        }
      }

      // Fetch from API
      const response = await api.getGallery();

      if (response.success && response.data && Array.isArray(response.data)) {
        const processed = processPricingData(response.data);
        setPricingItems(processed);

        // Save to localStorage for future use
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(PRICING_DATA_KEY, JSON.stringify(response.data));
            localStorage.setItem(PRICING_CACHE_TIMESTAMP_KEY, String(Date.now()));
          } catch (storageError) {
            // Ignore localStorage errors (quota exceeded, etc.)
            if (process.env.NODE_ENV === 'development') {
              console.warn('[Pricing] Failed to save to cache:', storageError);
            }
          }
        }
      } else {
        setPricingItems([]);
      }
    } catch (error) {
      console.error('[Pricing] Error loading pricing items:', error);
      
      // On error, try to use cached data as fallback
      if (typeof window !== 'undefined') {
        try {
          const cachedData = localStorage.getItem(PRICING_DATA_KEY);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const processed = processPricingData(parsed);
              setPricingItems(processed);
            }
          }
        } catch (fallbackError) {
          // If fallback also fails, keep empty state
          setPricingItems([]);
        }
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Fetch pricing items from gallery (same source as Gallery component)
  useEffect(() => {
    let refreshInterval;
    let visibilityInterval;

    // Initial load with loading state - will use cache if available for fast load
    loadPricingItems(true, true);

    // Refresh pricing every 5 minutes to pick up new items automatically
    refreshInterval = setInterval(() => {
      if (!document.hidden) {
        loadPricingItems(false, false); // Always fetch fresh data on interval
      }
    }, CACHE_DURATION);

    // Listen for visibility changes - refresh when tab becomes visible (check cache age)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Check if cache is stale before refreshing
        if (typeof window !== 'undefined') {
          try {
            const cacheTimestamp = localStorage.getItem(PRICING_CACHE_TIMESTAMP_KEY);
            if (cacheTimestamp) {
              const cacheAge = Date.now() - parseInt(cacheTimestamp);
              // Only refresh if cache is older than 2 minutes
              if (cacheAge > 2 * 60 * 1000) {
                loadPricingItems(false, false);
              }
            } else {
              // No cache, fetch fresh data
              loadPricingItems(false, false);
            }
          } catch (e) {
            // If check fails, fetch fresh data
            loadPricingItems(false, false);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for custom events to trigger immediate refresh (from admin panel)
    const handleGalleryUpdate = () => {
      // Clear cache and fetch fresh data when gallery is updated
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(PRICING_DATA_KEY);
          localStorage.removeItem(PRICING_CACHE_TIMESTAMP_KEY);
        } catch (e) {
          // Ignore errors
        }
      }
      loadPricingItems(false, false);
    };

    window.addEventListener('gallery-updated', handleGalleryUpdate);

    // Check for changes in localStorage (cross-tab communication)
    const checkStorageChanges = () => {
      if (typeof window === 'undefined') return;
      try {
        const lastUpdate = localStorage.getItem('gallery-last-update');
        const currentTime = Date.now();
        if (lastUpdate && currentTime - parseInt(lastUpdate) < 10000) {
          // Gallery was updated, clear pricing cache and refresh
          localStorage.removeItem(PRICING_DATA_KEY);
          localStorage.removeItem(PRICING_CACHE_TIMESTAMP_KEY);
          loadPricingItems(false, false);
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
      window.removeEventListener('gallery-updated', handleGalleryUpdate);
    };
  }, []);

  // Group items by category
  const groupedByCategory = useMemo(() => {
    const grouped = {};
    pricingItems.forEach((item) => {
      const category = item.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  }, [pricingItems]);

  // Get category list sorted - Thali and Tiffin first, then alphabetically
  const categories = useMemo(() => {
    const allCategories = Object.keys(groupedByCategory);
    const priorityCategories = ['Thali', 'Tiffin'];
    const otherCategories = allCategories.filter(
      (cat) =>
        !priorityCategories.some(
          (priority) => cat.toLowerCase() === priority.toLowerCase()
        )
    );

    const foundPriority = priorityCategories
      .filter((priority) =>
        allCategories.some(
          (cat) => cat.toLowerCase() === priority.toLowerCase()
        )
      )
      .map((priority) =>
        allCategories.find(
          (cat) => cat.toLowerCase() === priority.toLowerCase()
        )
      );

    const sortedOthers = otherCategories.sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );

    return [...foundPriority, ...sortedOthers];
  }, [groupedByCategory]);

  if (loading) {
    return (
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="pricing-header">
            <span className="pricing-kicker">
              {t('pricing.kicker') || 'Our rates'}
            </span>
            <h2 className="pricing-title">
              {t('pricing.title') || 'Pricing & Menu'}
            </h2>
            <p className="pricing-subtitle">
              {t('pricing.subtitle') ||
                'Fresh meals at affordable prices. Prices are updated automatically.'}
            </p>
          </div>
          <SkeletonLoader type="default" count={6} />
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-container">
        <div className="pricing-header">
          <span className="pricing-kicker">
            {t('pricing.kicker') || 'Our rates'}
          </span>
          <h2 className="pricing-title">
            {t('pricing.title') || 'Pricing & Menu'}
          </h2>
          <p className="pricing-subtitle">
            {t('pricing.subtitle') ||
              'Fresh meals at affordable prices. Prices are updated automatically.'}
          </p>
        </div>

        {pricingItems.length === 0 ? (
          <div className="pricing-empty-state">
            <div className="pricing-empty-icon">
              <i className="fa-solid fa-tags"></i>
            </div>
            <h3 className="pricing-empty-title">
              {t('pricing.noItemsTitle') || 'Pricing Coming Soon'}
            </h3>
            <p className="pricing-empty-message">
              {t('pricing.noItems') ||
                "We're currently updating our pricing. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="pricing-categories">
            {categories.map((category) => {
              const categoryItems = groupedByCategory[category];

              return (
                <div key={category} className="pricing-category-section">
                  <div className="pricing-category-header">
                    <h3 className="pricing-category-title">{category}</h3>
                    <span className="pricing-category-count">
                      ({categoryItems.length} {t('common.items')})
                    </span>
                  </div>
                  <div className="pricing-table">
                    {categoryItems.map((item, index) => (
                      <div key={item.id || index} className="pricing-table-row">
                        <div className="pricing-item-name">
                          <span className="pricing-item-name-text">
                            {item.name}
                          </span>
                          {item.details &&
                            Array.isArray(item.details) &&
                            item.details.length > 0 && (
                              <div className="pricing-item-details">
                                {item.details.map((detail, idx) => (
                                  <span key={idx} className="pricing-detail-tag">
                                    {detail}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                        <div className="pricing-item-price">
                          {item.price ? (
                            <span className="pricing-price-value">
                              ₹{item.price}
                            </span>
                          ) : (
                            <span className="pricing-price-na">
                              {t('pricing.contactForPrice') || 'Contact for price'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pricing-footer">
          <p className="pricing-note">
            {t('pricing.note') ||
              'Prices are subject to change. Home delivery on orders ₹100 and above.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
