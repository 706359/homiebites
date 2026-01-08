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
    const loadGalleryItems = async () => {
      try {
        const response = await api.getGallery();
        
        if (response.success && response.data && Array.isArray(response.data)) {
          // Map backend data to gallery format
          const items = response.data.map((item) => ({
            id: item._id || item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            category: item.category,
            alt: item.alt || item.name || 'Gallery item',
            caption: item.caption || (item.price ? `${item.name} - ₹${item.price}` : item.name),
          }));
          
          setGalleryItems(items);
        } else {
          setGalleryItems([]);
        }
      } catch (error) {
        console.error('Error loading gallery items:', error);
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryItems();
  }, []);

  const openModal = (item) => setSelectedImage(item);
  const closeModal = () => setSelectedImage(null);

  // Get image source with fallback
  const getImageSrc = (item) => {
    if (item.imageUrl && item.imageUrl.trim() !== '') {
      return item.imageUrl;
    }
    // Default placeholder if no imageUrl
    return 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg';
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
            {galleryItems.map((item) => (
              <div
                key={item.id}
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
                  src={getImageSrc(item)}
                  alt={item.alt}
                  loading='lazy'
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.target.src = 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg';
                  }}
                />
                <div className='gallery-caption'>
                  <div className='gallery-item-name'>{item.name}</div>
                  {item.price && (
                    <div className='gallery-item-price'>₹{item.price}</div>
                  )}
                </div>
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
              <img src={getImageSrc(selectedImage)} alt={selectedImage.alt} />
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
