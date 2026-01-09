'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../lib/api';
import PremiumLoader from './PremiumLoader';
import './Gallery.css';

const Gallery = () => {
  const { t } = useLanguage();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch gallery items from backend
  useEffect(() => {
    let refreshInterval;
    let visibilityInterval;
    
    const loadGalleryItems = async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
        const response = await api.getGallery();
        
        console.log('[Gallery] Fetched items from backend:', {
          success: response?.success,
          itemsCount: response?.data?.length || 0,
          activeItems: response?.data?.filter((i) => i.isActive !== false && i.imageUrl).length || 0,
          allItems: response?.data?.map((i) => ({
            name: i.name,
            isActive: i.isActive,
            hasImage: !!i.imageUrl,
            imageUrl: i.imageUrl,
            hasDetails: !!(i.details && i.details.length > 0),
            detailsCount: i.details?.length || 0,
            details: i.details,
          })),
        });
        
        if (response.success && response.data && Array.isArray(response.data)) {
          // Map backend data to gallery format and filter only active items with images
          const items = response.data
            .filter((item) => {
              // Only show active items with valid image URLs
              const isValid = (
                item.isActive !== false &&
                item.imageUrl &&
                item.imageUrl.trim() !== ''
              );
              if (!isValid) {
                console.log('[Gallery] Filtered out item:', {
                  name: item.name,
                  isActive: item.isActive,
                  hasImage: !!item.imageUrl,
                });
              }
              return isValid;
            })
            .map((item) => {
              // Ensure imageUrl is properly formatted
              let imageUrl = item.imageUrl;
              if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                imageUrl = '/' + imageUrl;
              }
              
              // Log if imageUrl is missing
              if (!imageUrl || imageUrl.trim() === '') {
                console.warn('[Gallery] Item missing imageUrl:', {
                  name: item.name,
                  id: item._id || item.id,
                  fullItem: item,
                });
              }
              
              return {
                id: item._id || item.id,
                name: item.name,
                price: item.price,
                imageUrl: imageUrl || null, // Explicitly set to null if missing
                category: item.category,
                details: (item.details && Array.isArray(item.details) && item.details.length > 0) 
                  ? item.details 
                  : null, // Only include details if they exist
                alt: item.alt || item.name || 'Gallery item',
                caption: item.caption || (item.price ? `${item.name} - ₹${item.price}` : item.name),
              };
            });
          
          console.log('[Gallery] Displaying', items.length, 'items in gallery');
          
          // Always update state to ensure images refresh properly
          setGalleryItems(items);
        } else {
          console.warn('[Gallery] Invalid response format:', response);
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

    // Initial load with loading state
    loadGalleryItems(true);
    
    // Refresh gallery every 5 seconds to pick up new items automatically
    refreshInterval = setInterval(() => {
      // Only refresh if tab is visible to avoid unnecessary API calls
      if (!document.hidden) {
        loadGalleryItems(false);
      }
    }, 5000);
    
    // Also listen for visibility changes - refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[Gallery] Tab became visible, refreshing...');
        loadGalleryItems(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for custom events to trigger immediate refresh (from admin panel)
    const handleGalleryUpdate = () => {
      console.log('[Gallery] Received gallery update event, refreshing immediately...');
      loadGalleryItems(false);
    };
    
    window.addEventListener('gallery-updated', handleGalleryUpdate);
    
    // Also check for changes in localStorage (cross-tab communication)
    const checkStorageChanges = () => {
      try {
        const lastUpdate = localStorage.getItem('gallery-last-update');
        const currentTime = Date.now();
        if (lastUpdate && currentTime - parseInt(lastUpdate) < 10000) {
          // Gallery was updated in last 10 seconds, refresh
          console.log('[Gallery] Detected recent update via localStorage, refreshing...');
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

  const openModal = (item) => setSelectedImage(item);
  const closeModal = () => setSelectedImage(null);

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
      if (imageName.includes(normalizedName) || normalizedName.includes(imageName)) {
        return '/' + image;
      }
      
      // Check for common food name variations first (more specific)
      const commonMatches = {
        'chhole': 'Amritsarichhole.png',
        'chole': 'Amritsarichhole.png',
        'chana': 'kalachana.jpg',
        'dal': 'MoondDalKhichdi.jpg',
        'khichdi': 'MoondDalKhichdi.jpg',
        'paratha': 'DeliciousAaluParatha.jpg',
        'aloo': 'DeliciousAaluParatha.jpg',
        'thali': 'DesiThali.jpeg',
        'rajma': 'rajma.jpg',
        'roti': 'RotiSabji.png',
        'sabji': 'RotiSabji.png',
        'pakora': 'kadhipakora.jpg',
        'kadhi': 'kadhipakora.jpg',
        'lobhiya': 'lobhiya.jpg',
        'kofta': 'lokikofte.jpg',
        'koofte': 'lokikofte.jpg',
        'curd': 'Curd.jpg',
        'dahi': 'Curd.jpg',
        'tiffin': 'FullTiffin.jpg',
        'full': 'FullTiffin.jpg',
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
      } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
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
        console.warn('[Gallery] Item missing imageUrl, auto-matched from name:', item.name, '→', matchedImage);
        return matchedImage;
      }
    }
    
    // Last resort: default placeholder
    console.warn('[Gallery] Item missing imageUrl and no match found:', item.name, '→ using default');
    return '/food.jpeg';
  };

  if (loading) {
    return (
      <section id='gallery' className='gallery-section'>
        <div className='section-container'>
          <h2 className='section-heading'>{t('gallery.title')}</h2>
          <PremiumLoader message={t('common.loading') || 'Loading gallery...'} size='medium' />
        </div>
      </section>
    );
  }

  return (
    <section id='gallery' className='gallery-section'>
      <div className='section-container'>
        <h2 className='section-heading'>{t('gallery.title')}</h2>
        <p className='section-subtitle'>{t('gallery.subtitle')}</p>

        {galleryItems.length === 0 ? (
          <div className='gallery-empty-state'>
            <div className='gallery-empty-icon'>
              <i className='fa-solid fa-images'></i>
            </div>
            <h3 className='gallery-empty-title'>{t('gallery.noItemsTitle') || 'No Items Available'}</h3>
            <p className='gallery-empty-message'>{t('gallery.noItems') || 'We\'re currently updating our gallery with fresh, delicious meals. Check back soon to see our latest offerings!'}</p>
          </div>
        ) : (
          <div className='gallery-grid'>
            {galleryItems.map((item, index) => (
              <div
                key={`gallery-item-${item.id || index}-${item.name || 'item'}-${index}`}
                className='gallery-item'
                onClick={() => openModal(item)}
                role='button'
                tabIndex={0}
                aria-label={`View ${item.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(item);
                  }
                }}
              >
                <img
                  key={`gallery-img-${item.id || index}-${item.imageUrl || 'no-img'}-${index}`}
                  src={getImageSrc(item)}
                  alt={item.alt || item.name || 'Gallery item'}
                  loading='lazy'
                  onError={(e) => {
                    // Fallback to placeholder from public folder if image fails to load
                    const placeholder = '/food.jpeg';
                    const currentSrc = e.target.src.split('?')[0]; // Remove query params if any
                    if (!currentSrc.endsWith(placeholder) && !e.target.src.includes(placeholder)) {
                      console.warn('[Gallery Image] Failed to load:', currentSrc, 'for item:', item.name, '- Using fallback');
                      e.target.src = placeholder;
                    }
                  }}
                />
                <div className='gallery-caption'>
                  <div className='gallery-item-name'>{item.name}</div>
                  {item.price && (
                    <div className='gallery-item-price'>₹{item.price}</div>
                  )}
                </div>
                {/* Only show details overlay if item has actual details */}
                {item.details && Array.isArray(item.details) && item.details.length > 0 && (
                  <div className='gallery-details'>
                    <ul className='gallery-details-list'>
                      {item.details.map((detail, idx) => (
                        <li key={idx} className='gallery-detail-item'>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div className='gallery-modal' onClick={closeModal}>
            <div className='gallery-modal-content' onClick={(e) => e.stopPropagation()}>
              <button
                className='gallery-modal-close'
                onClick={closeModal}
                aria-label='Close gallery modal'
              >
                &times;
              </button>
              <img 
                src={getImageSrc(selectedImage)}
                alt={selectedImage.alt || selectedImage.name || 'Gallery item'} 
                key={`modal-img-${selectedImage.id}-${selectedImage.imageUrl || 'no-img'}`}
              />
              <div className='gallery-modal-caption'>
                <div className='gallery-modal-name'>{selectedImage.name}</div>
                {selectedImage.price && (
                  <div className='gallery-modal-price'>₹{selectedImage.price}</div>
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
