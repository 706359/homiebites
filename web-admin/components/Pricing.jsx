'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../lib/api';
import './Pricing.css';
import SkeletonLoader from './SkeletonLoader';

const Pricing = () => {
  const { t } = useLanguage();
  const [pricingItems, setPricingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pricing items from gallery (same source as Gallery component)
  useEffect(() => {
    let refreshInterval;
    let visibilityInterval;

    const loadPricingItems = async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
        const response = await api.getGallery();

        if (response.success && response.data && Array.isArray(response.data)) {
          // Map backend data to pricing format - show all active items (with or without images)
          const items = response.data
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

          setPricingItems(items);
        } else {
          setPricingItems([]);
        }
      } catch (error) {
        console.error('[Pricing] Error loading pricing items:', error);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    // Initial load with loading state
    loadPricingItems(true);

    // Refresh pricing every 60 seconds to pick up new items automatically
    refreshInterval = setInterval(() => {
      if (!document.hidden) {
        loadPricingItems(false);
      }
    }, 60000);

    // Listen for visibility changes - refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadPricingItems(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for custom events to trigger immediate refresh (from admin panel)
    const handleGalleryUpdate = () => {
      loadPricingItems(false);
    };

    window.addEventListener('gallery-updated', handleGalleryUpdate);

    // Check for changes in localStorage (cross-tab communication)
    const checkStorageChanges = () => {
      if (typeof window === 'undefined') return;
      try {
        const lastUpdate = localStorage.getItem('gallery-last-update');
        const currentTime = Date.now();
        if (lastUpdate && currentTime - parseInt(lastUpdate) < 10000) {
          loadPricingItems(false);
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
