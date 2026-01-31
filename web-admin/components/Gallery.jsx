'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../lib/api';
import './Gallery.css';
import { SkeletonLoader } from './loaders/LoaderComponents';
import Icon from './ui/Icon.jsx';

const Gallery = () => {
  const { t } = useLanguage();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null); // Only one category can be expanded at a time
  const [itemsPerRow, setItemsPerRow] = useState(4); // Default: show one row (4 items on desktop)
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  // Fetch gallery items from backend
  useEffect(() => {
    let refreshInterval;
    let visibilityInterval;

    const loadGalleryItems = async (showLoading = false, useCache = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        // Try to load from cache first for fast initial render
        if (useCache && typeof window !== 'undefined') {
          try {
            const cachedData = localStorage.getItem('homiebites_gallery_data');
            const cacheTimestamp = localStorage.getItem(
              'homiebites_gallery_data_timestamp'
            );

            if (cachedData && cacheTimestamp) {
              const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
              const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

              // Use cache if it's less than 5 minutes old
              if (cacheAge < CACHE_DURATION) {
                try {
                  const parsed = JSON.parse(cachedData);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    // Process cached data
                    const items = parsed
                      .filter((item) => {
                        return (
                          item.isActive !== false &&
                          item.imageUrl &&
                          item.imageUrl.trim() !== ''
                        );
                      })
                      .map((item) => {
                        let imageUrl = item.imageUrl;
                        if (
                          imageUrl &&
                          !imageUrl.startsWith('/') &&
                          !imageUrl.startsWith('http://') &&
                          !imageUrl.startsWith('https://')
                        ) {
                          imageUrl = '/' + imageUrl;
                        }
                        return {
                          id: item._id || item.id,
                          name: item.name,
                          price: item.price,
                          category: item.category || 'Other',
                          imageUrl: imageUrl,
                          details: item.details || null,
                        };
                      });

                    if (items.length > 0) {
                      setGalleryItems(items);
                      if (showLoading) {
                        setLoading(false);
                      }
                      // Still fetch fresh data in background if cache is older than 1 minute
                      if (cacheAge > 60 * 1000) {
                        loadGalleryItems(false, false); // Fetch fresh data without showing loading
                      }
                      return;
                    }
                  }
                } catch (parseError) {
                  // If cache parse fails, continue to API fetch
                  if (process.env.NODE_ENV === 'development') {
                    console.warn('[Gallery] Cache parse failed:', parseError);
                  }
                }
              }
            }
          } catch (cacheError) {
            // If cache read fails, continue to API fetch
            if (process.env.NODE_ENV === 'development') {
              console.warn('[Gallery] Cache read failed:', cacheError);
            }
          }
        }

        // Fetch from API
        const response = await api.getGallery();

        if (process.env.NODE_ENV === 'development') {
          console.log('[Gallery] Fetched items from backend:', {
            success: response?.success,
            itemsCount: response?.data?.length || 0,
            activeItems:
              response?.data?.filter((i) => i.isActive !== false && i.imageUrl)
                .length || 0,
          });
        }

        if (response.success && response.data && Array.isArray(response.data)) {
          // Save to cache
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(
                'homiebites_gallery_data',
                JSON.stringify(response.data)
              );
              localStorage.setItem(
                'homiebites_gallery_data_timestamp',
                String(Date.now())
              );
            } catch (storageError) {
              if (process.env.NODE_ENV === 'development') {
                console.warn(
                  '[Gallery] Failed to save to cache:',
                  storageError
                );
              }
            }
          }

          // Map backend data to gallery format and filter only active items with images
          const items = response.data
            .filter((item) => {
              // Only show active items with valid image URLs
              const isValid =
                item.isActive !== false &&
                item.imageUrl &&
                item.imageUrl.trim() !== '';
              if (!isValid && process.env.NODE_ENV === 'development') {
                console.log('[Gallery] Filtered out item:', {
                  name: item.name,
                });
              }
              return isValid;
            })
            .map((item) => {
              // Ensure imageUrl is properly formatted
              let imageUrl = item.imageUrl;
              if (
                imageUrl &&
                !imageUrl.startsWith('/') &&
                !imageUrl.startsWith('http://') &&
                !imageUrl.startsWith('https://')
              ) {
                imageUrl = '/' + imageUrl;
              }

              // Log if imageUrl is missing
              if (
                (!imageUrl || imageUrl.trim() === '') &&
                process.env.NODE_ENV === 'development'
              ) {
                console.warn('[Gallery] Item missing imageUrl:', {
                  name: item.name,
                });
              }

              return {
                id: item._id || item.id,
                name: item.name,
                price: item.price,
                imageUrl: imageUrl || null, // Explicitly set to null if missing
                category: item.category,
                details:
                  item.details &&
                  Array.isArray(item.details) &&
                  item.details.length > 0
                    ? item.details
                    : null, // Only include details if they exist
                alt: item.alt || item.name || 'Gallery item',
                caption:
                  item.caption ||
                  (item.price ? `${item.name} - ₹${item.price}` : item.name),
              };
            });

          if (process.env.NODE_ENV === 'development') {
            console.log(
              '[Gallery] Displaying',
              items.length,
              'items in gallery'
            );
          }

          // Always update state to ensure images refresh properly
          setGalleryItems(items);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Gallery] Invalid response format:', response);
          }
          setGalleryItems([]);
        }
      } catch (error) {
        console.error('[Gallery] Error loading gallery items:', error);
        // Don't clear items on error, keep showing existing items
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    // Initial load with loading state - will use cache if available for fast load
    loadGalleryItems(true, true);

    // Refresh gallery every 5 minutes (cache duration) to pick up new items automatically
    refreshInterval = setInterval(
      () => {
        // Only refresh if tab is visible to avoid unnecessary API calls
        if (!document.hidden) {
          loadGalleryItems(false, false); // Always fetch fresh data on interval
        }
      },
      5 * 60 * 1000
    );

    // Also listen for visibility changes - refresh if cache is stale
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Check if cache is stale before refreshing
        if (typeof window !== 'undefined') {
          try {
            const cacheTimestamp = localStorage.getItem(
              'homiebites_gallery_data_timestamp'
            );
            if (cacheTimestamp) {
              const cacheAge = Date.now() - parseInt(cacheTimestamp, 10);
              // Only refresh if cache is older than 2 minutes
              if (cacheAge > 2 * 60 * 1000) {
                loadGalleryItems(false, false);
              }
            } else {
              // No cache, fetch fresh data
              loadGalleryItems(false, false);
            }
          } catch (e) {
            // If check fails, fetch fresh data
            loadGalleryItems(false, false);
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
          localStorage.removeItem('homiebites_gallery_data');
          localStorage.removeItem('homiebites_gallery_data_timestamp');
        } catch (e) {
          // Ignore errors
        }
      }
      if (process.env.NODE_ENV === 'development') {
        console.log(
          '[Gallery] Received gallery update event, refreshing immediately...'
        );
      }
      loadGalleryItems(false, false);
    };

    window.addEventListener('gallery-updated', handleGalleryUpdate);

    // Also check for changes in localStorage (cross-tab communication)
    const checkStorageChanges = () => {
      if (typeof window === 'undefined') return;
      try {
        const lastUpdate = localStorage.getItem('gallery-last-update');
        const currentTime = Date.now();
        if (lastUpdate && currentTime - parseInt(lastUpdate) < 10000) {
          // Gallery was updated in last 10 seconds, refresh
          if (process.env.NODE_ENV === 'development') {
            console.log(
              '[Gallery] Detected recent update via localStorage, refreshing...'
            );
          }
          loadGalleryItems(false);
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

  const openModal = (item) => {
    setSelectedImage(item);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    // Restore body scroll when modal is closed
    document.body.style.overflow = '';
  };

  // Touch event handlers for swipe to close
  const onTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isSwipeDown = distance < -50; // Swipe down to close
    if (isSwipeDown) {
      closeModal();
    }
    // Reset touch positions
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
        document.body.style.overflow = '';
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [selectedImage]);

  // Available images in public folder
  const publicImages = [
    'Amritsarichhole.png',
    'Curd.jpg',
    'DeliciousAaluParatha.jpg',
    'DesiThali.jpeg',
    'food.jpeg',
    'FullTiffin.jpg',
    'hero.jpeg',
    'kadhipakora.jpg',
    'kalachana.jpg',
    'lobhiya.jpg',
    'lokikofte.jpg',
    'MoondDalKhichdi.jpg',
    'rajma.jpg',
    'RotiSabji.png',
    'veg-thali.png',
    'VegThali.png',
  ];

  // Convert item name to image filename format
  // Removes spaces, special chars, converts to lowercase for matching
  const normalizeName = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      .trim();
  };

  // Find matching image from public folder based on item name
  const findImageByName = (itemName) => {
    if (!itemName) return null;

    const normalizedName = normalizeName(itemName);

    // Try to find exact or partial match
    for (const image of publicImages) {
      const imageName = normalizeName(image.replace(/\.(jpg|jpeg|png)$/i, ''));

      // Check if item name contains image name or vice versa
      if (
        imageName.includes(normalizedName) ||
        normalizedName.includes(imageName)
      ) {
        return '/' + image;
      }

      // Check for common food name variations first (more specific)
      const commonMatches = {
        chhole: 'Amritsarichhole.png',
        chole: 'Amritsarichhole.png',
        chana: 'kalachana.jpg',
        dal: 'MoondDalKhichdi.jpg',
        khichdi: 'MoondDalKhichdi.jpg',
        paratha: 'DeliciousAaluParatha.jpg',
        aloo: 'DeliciousAaluParatha.jpg',
        thali: 'DesiThali.jpeg',
        rajma: 'rajma.jpg',
        roti: 'RotiSabji.png',
        sabji: 'RotiSabji.png',
        pakora: 'kadhipakora.jpg',
        kadhi: 'kadhipakora.jpg',
        lobhiya: 'lobhiya.jpg',
        kofta: 'lokikofte.jpg',
        koofte: 'lokikofte.jpg',
        curd: 'Curd.jpg',
        dahi: 'Curd.jpg',
        tiffin: 'FullTiffin.jpg',
        full: 'FullTiffin.jpg',
      };

      for (const [key, imageFile] of Object.entries(commonMatches)) {
        if (normalizedName.includes(key)) {
          return '/' + imageFile;
        }
      }
    }

    return null;
  };

  // Get image source - use the imageUrl from database directly
  // Gallery items should already have imageUrl saved from sync
  const getImageSrc = (item) => {
    // Use the imageUrl that was saved to the database (from menu sync)
    if (item.imageUrl && item.imageUrl.trim() !== '') {
      const imageUrl = item.imageUrl.trim();
      // If it starts with /, it's from public folder - use as is
      // If it starts with http:// or https://, it's external URL - use as is
      // Otherwise, assume it's from public folder and add /
      if (imageUrl.startsWith('/')) {
        return imageUrl;
      } else if (
        imageUrl.startsWith('http://') ||
        imageUrl.startsWith('https://')
      ) {
        return imageUrl;
      } else {
        // Assume it's a public folder image, add leading slash
        return '/' + imageUrl;
      }
    }

    // Fallback: if somehow imageUrl is missing, try to find from name (shouldn't happen if sync worked)
    if (item.name) {
      const matchedImage = findImageByName(item.name);
      if (matchedImage) {
        console.warn(
          '[Gallery] Item missing imageUrl, auto-matched from name:',
          item.name,
          '→',
          matchedImage
        );
        return matchedImage;
      }
    }

    // Last resort: default placeholder
    console.warn(
      '[Gallery] Item missing imageUrl and no match found:',
      item.name,
      '→ using default'
    );
    return '/food.jpeg';
  };

  // Map items to main categories (Breakfast, Lunch, Dinner, Lunch & Dinner) and subcategories
  // Items are categorized by their category field, which should be one of: Breakfast, Lunch, Dinner, Lunch & Dinner
  // Subcategories are determined by package names like "Mix & Match Tiffin", "Full Tiffin", etc.
  const categorizedItems = useMemo(() => {
    const mainCategories = ['Breakfast', 'Lunch', 'Dinner', 'Lunch & Dinner'];
    const result = {
      Breakfast: {},
      Lunch: {},
      Dinner: {},
      'Lunch & Dinner': {},
    };

    // Common subcategory patterns to detect from item names
    const subcategoryPatterns = [
      {
        keywords: ['mix', 'match', '&'],
        name: 'Mix & Match Tiffin',
      },
      {
        keywords: ['full', 'tiffin'],
        name: 'Full Tiffin',
      },
      {
        keywords: ['khichdi'],
        name: 'Khichdi Tiffin',
      },
      {
        keywords: ['roti', 'paratha'],
        name: 'Rotis & Parathas',
      },
      {
        keywords: ['thali'],
        name: 'Full Tiffin',
      },
      {
        keywords: ['steel', 'tiffin', 'zambo', 'zumbo'],
        name: 'Full Tiffin',
      },
      {
        keywords: ['add', 'curd', 'dahi'],
        name: 'Add-ons',
      },
      {
        keywords: ['pickup'],
        name: 'Pickup Option',
      },
    ];

    galleryItems.forEach((item) => {
      // Get the main category (Breakfast, Lunch, Dinner, or Lunch & Dinner)
      const itemCategory = (item.category || '').trim();
      const mainCategory = mainCategories.find(
        (cat) => cat.toLowerCase() === itemCategory.toLowerCase()
      );

      // Only include items that belong to Breakfast, Lunch, Dinner, or Lunch & Dinner
      if (mainCategory) {
        // Determine subcategory from item name
        const itemName = (item.name || '').toLowerCase();
        let subcategory = 'Other';

        // Check for common package/subcategory names in item name
        for (const pattern of subcategoryPatterns) {
          const matches = pattern.keywords.every((keyword) =>
            itemName.includes(keyword)
          );
          if (matches) {
            subcategory = pattern.name;
            break;
          }
        }

        // If no pattern matched, check if category field contains subcategory info
        if (subcategory === 'Other') {
          // Check if category has format "MainCategory - SubCategory"
          const categoryParts = itemCategory.split(' - ');
          if (categoryParts.length > 1) {
            subcategory = categoryParts[1].trim();
          } else if (
            itemCategory &&
            !mainCategories.some(
              (cat) => cat.toLowerCase() === itemCategory.toLowerCase()
            )
          ) {
            // If category is not a main category, it might be a subcategory
            // But we only want items with main categories, so skip this
            return;
          }
        }

        // Initialize subcategory if it doesn't exist
        if (!result[mainCategory][subcategory]) {
          result[mainCategory][subcategory] = [];
        }

        result[mainCategory][subcategory].push(item);
      }
    });

    return result;
  }, [galleryItems]);

  // Get main categories that have items
  const mainCategories = useMemo(() => {
    return ['Breakfast', 'Lunch', 'Dinner', 'Lunch & Dinner'].filter(
      (cat) =>
        categorizedItems[cat] && Object.keys(categorizedItems[cat]).length > 0
    );
  }, [categorizedItems]);

  // Calculate items per row based on viewport width
  useEffect(() => {
    const calculateItemsPerRow = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setItemsPerRow(2); // Mobile: 2 columns
      } else if (width <= 768) {
        setItemsPerRow(3); // Tablet: 3 columns
      } else {
        setItemsPerRow(4); // Desktop: 4 columns
      }
    };

    calculateItemsPerRow();
    window.addEventListener('resize', calculateItemsPerRow);
    return () => window.removeEventListener('resize', calculateItemsPerRow);
  }, []);

  const toggleCategory = (category) => {
    // If clicking the same category, collapse it. Otherwise, expand this one and collapse others
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  if (loading) {
    return (
      <section id="gallery" className="gallery-section">
        <div className="section-container">
          <div className="gallery-header">
            <span className="gallery-kicker">
              {t('gallery.kicker') || 'Food gallery'}
            </span>
            <h2 className="gallery-title">{t('gallery.title')}</h2>
          </div>
          <SkeletonLoader type="gallery" count={8} />
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="gallery-section">
      <div className="section-container">
        <div className="gallery-header">
          <span className="gallery-kicker">
            {t('gallery.kicker') || 'Food gallery'}
          </span>
          <h2 className="gallery-title">{t('gallery.title')}</h2>
          <p className="gallery-subtitle">{t('gallery.subtitle')}</p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-icon">
              <Icon name="images" />
            </div>
            <h3 className="gallery-empty-title">
              {t('gallery.noItemsTitle') || 'No Items Available'}
            </h3>
            <p className="gallery-empty-message">
              {t('gallery.noItems') ||
                "We're currently updating our gallery with fresh, delicious meals. Check back soon to see our latest offerings!"}
            </p>
          </div>
        ) : (
          <div className="gallery-categories">
            {mainCategories.map((mainCategory) => {
              const subcategories = Object.keys(categorizedItems[mainCategory]);
              const totalItems = Object.values(
                categorizedItems[mainCategory]
              ).reduce((sum, items) => sum + items.length, 0);
              const isExpanded = expandedCategory === mainCategory;

              return (
                <div key={mainCategory} className="gallery-category-section">
                  <div className="gallery-category-header">
                    <h3 className="gallery-category-title">{mainCategory}</h3>
                    <span className="gallery-category-count">
                      ({totalItems} {t('common.items')})
                    </span>
                  </div>

                  {isExpanded ? (
                    // Show all subcategories when expanded
                    subcategories.map((subcategory) => {
                      const subcategoryItems =
                        categorizedItems[mainCategory][subcategory];
                      return (
                        <div
                          key={subcategory}
                          className="gallery-subcategory-section"
                        >
                          <h4 className="gallery-subcategory-title">
                            {subcategory}
                          </h4>
                          <div className="gallery-grid">
                            {subcategoryItems.map((item, index) => (
                              <div
                                key={`gallery-item-${item.id || index}-${item.name || 'item'}-${index}`}
                                className="gallery-item"
                                onClick={() => openModal(item)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View ${item.name}${item.price ? ` - ₹${item.price}` : ''}`}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openModal(item);
                                  }
                                }}
                              >
                                <img
                                  key={`gallery-img-${item.id || index}-${
                                    item.imageUrl || 'no-img'
                                  }-${index}`}
                                  src={getImageSrc(item)}
                                  alt={
                                    item.alt ||
                                    `${item.name}${item.price ? ` - ₹${item.price}` : ''}` ||
                                    'Gallery item'
                                  }
                                  loading="lazy"
                                  width="220"
                                  height="165"
                                  onError={(e) => {
                                    const placeholder = '/food.jpeg';
                                    const currentSrc =
                                      e.target.src.split('?')[0];
                                    if (
                                      !currentSrc.endsWith(placeholder) &&
                                      !e.target.src.includes(placeholder)
                                    ) {
                                      console.warn(
                                        '[Gallery Image] Failed to load:',
                                        currentSrc,
                                        'for item:',
                                        item.name,
                                        '- Using fallback'
                                      );
                                      e.target.src = placeholder;
                                    }
                                  }}
                                />
                                <div className="gallery-caption">
                                  <div className="gallery-item-name">
                                    {item.name}
                                  </div>
                                  {item.price && (
                                    <div className="gallery-item-price">
                                      ₹ {item.price}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Show limited items from all subcategories when collapsed
                    <>
                      <div className="gallery-grid">
                        {Object.values(categorizedItems[mainCategory])
                          .flat()
                          .slice(0, itemsPerRow)
                          .map((item, index) => (
                            <div
                              key={`gallery-item-${item.id || index}-${item.name || 'item'}-${index}`}
                              className="gallery-item"
                              onClick={() => openModal(item)}
                              role="button"
                              tabIndex={0}
                              aria-label={`View ${item.name}${item.price ? ` - ₹${item.price}` : ''}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  openModal(item);
                                }
                              }}
                            >
                              <img
                                key={`gallery-img-${item.id || index}-${
                                  item.imageUrl || 'no-img'
                                }-${index}`}
                                src={getImageSrc(item)}
                                alt={
                                  item.alt ||
                                  `${item.name}${item.price ? ` - ₹${item.price}` : ''}` ||
                                  'Gallery item'
                                }
                                loading="lazy"
                                width="220"
                                height="165"
                                onError={(e) => {
                                  const placeholder = '/food.jpeg';
                                  const currentSrc = e.target.src.split('?')[0];
                                  if (
                                    !currentSrc.endsWith(placeholder) &&
                                    !e.target.src.includes(placeholder)
                                  ) {
                                    console.warn(
                                      '[Gallery Image] Failed to load:',
                                      currentSrc,
                                      'for item:',
                                      item.name,
                                      '- Using fallback'
                                    );
                                    e.target.src = placeholder;
                                  }
                                }}
                              />
                              <div className="gallery-caption">
                                <div className="gallery-item-name">
                                  {item.name}
                                </div>
                                {item.price && (
                                  <div className="gallery-item-price">
                                    ₹ {item.price}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                      {totalItems > itemsPerRow && (
                        <div className="gallery-category-footer">
                          <button
                            className="btn btn-ghost btn-small"
                            onClick={() => toggleCategory(mainCategory)}
                            aria-label={
                              isExpanded
                                ? t('gallery.showLess')
                                : t('gallery.viewAll')
                            }
                          >
                            {isExpanded ? (
                              <>
                                <Icon name="chevron-up" />
                                {t('gallery.showLess')}
                              </>
                            ) : (
                              <>
                                {t('gallery.viewAll')} ({totalItems}{' '}
                                {t('common.items')})
                                <Icon name="chevron-down" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {selectedImage && (
          <div
            className="gallery-modal"
            onClick={closeModal}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="gallery-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gallery-modal-image-wrapper">
                <img
                  src={getImageSrc(selectedImage)}
                  alt={
                    selectedImage.alt || selectedImage.name || 'Gallery item'
                  }
                  key={`modal-img-${selectedImage.id}-${selectedImage.imageUrl || 'no-img'}`}
                  loading="eager"
                />
              </div>
              <div className="gallery-modal-info">
                <div className="gallery-modal-caption">
                  <div className="gallery-modal-name">{selectedImage.name}</div>
                  {selectedImage.price && (
                    <div className="gallery-modal-price">
                      ₹ {selectedImage.price}
                    </div>
                  )}
                </div>
                {selectedImage.details &&
                  Array.isArray(selectedImage.details) &&
                  selectedImage.details.length > 0 && (
                    <div className="gallery-modal-details">
                      <h3 className="gallery-modal-details-title">Details</h3>
                      <ul className="gallery-modal-details-list">
                        {selectedImage.details.map((detail, idx) => (
                          <li key={idx} className="gallery-modal-detail-item">
                            <Icon name="check" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
