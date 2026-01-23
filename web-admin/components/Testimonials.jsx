'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ReviewForm from './ReviewForm';
import './Testimonials.css';

const Testimonials = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Fetch live reviews from API
  useEffect(() => {
    loadReviews();
  }, []);

  // Close expanded card when clicking outside
  useEffect(() => {
    if (expandedCardId === null) return;

    const handleClickOutside = (e) => {
      const card = e.target.closest('.review-card');
      if (!card || card.dataset.reviewId !== expandedCardId) {
        setExpandedCardId(null);
      }
    };

    // Use capture phase for better reliability
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [expandedCardId]);

  const loadReviews = async () => {
    try {
      const api = (await import('../lib/api')).default;
      // Fetch all approved reviews (not just featured ones)
      const data = await api.getReviews(false, 10);

      if (data.success) {
        // API returns { success: true, data: [...] }
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setReviews(data.data);
        } else {
          // No reviews yet - wait for first real review
          setReviews([]);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // No reviews on error - wait for first real review
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    loadReviews(); // Reload reviews after submission
  };

  const renderStars = (rating) => {
    return (
      <div className="review-stars" data-rating={rating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fa-solid fa-star ${star <= rating ? 'active' : ''}`}
          />
        ))}
      </div>
    );
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

  if (loading) {
    return (
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <div className="testimonials-header">
            <span className="testimonials-kicker">
              {t('testimonials.kicker') || 'Reviews'}
            </span>
            <h2 className="testimonials-title">{t('testimonials.title')}</h2>
          </div>
          <div className="testimonials-actions">
            <button
              className="btn btn-primary btn-small"
              onClick={() => setShowReviewForm(true)}
            >
              <i className="fa-solid fa-pen"></i>{' '}
              {t('reviews.writeReview') || 'Write a Review'}
            </button>
          </div>
          <p className="testimonials-loading">
            {t('common.loading') || 'Loading...'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-container">
        <div className="testimonials-header">
          <span className="testimonials-kicker">
            {t('testimonials.kicker') || 'Reviews'}
          </span>
          <h2 className="testimonials-title">{t('testimonials.title')}</h2>
        </div>
        <div className="testimonials-actions">
          <button
            className="btn btn-primary btn-small"
            onClick={() => setShowReviewForm(true)}
          >
            <i className="fa-solid fa-pen"></i>{' '}
            {t('reviews.writeReview') || 'Write a Review'}
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="reviews-grid">
            {reviews.map((review) => {
              const rating = review.rating || 5;
              const reviewId = review._id || review.id;
              const isExpanded = expandedCardId === reviewId;
              return (
              <div
                key={reviewId}
                className={`review-card ${review.featured ? 'review-card-featured' : ''} ${isExpanded ? 'review-card-expanded' : ''}`}
                data-rating={rating}
                data-review-id={reviewId}
                onClick={(e) => {
                  // Only handle click on mobile (below 480px)
                  // Check if we're on mobile by checking window width or using a class
                  if (window.innerWidth <= 480) {
                    if (isExpanded) {
                      setExpandedCardId(null);
                    } else {
                      setExpandedCardId(reviewId);
                    }
                  }
                }}
              >
                <div className="review-card-header">
                  <div className="author-avatar">
                    {(review.userName || review.name || 'Customer')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  {review.featured && (
                    <span className="review-featured-badge" title="Featured Review">
                      <i className="fa-solid fa-star"></i>
                    </span>
                  )}
                </div>
                <div className="review-card-body">
                  <div className="review-author-name">
                    <strong>
                      {review.userName || review.name || 'Customer'}
                    </strong>
                  </div>
                  {review.userLocation || review.location ? (
                    <div className="review-location">
                      <i className="fa-solid fa-location-dot"></i>{' '}
                      {review.userLocation || review.location}
                    </div>
                  ) : null}
                  <div className="review-rating-section">
                    {renderStars(review.rating || 5)}
                    <span className="review-rating-number">
                      {review.rating || 5}/5
                    </span>
                  </div>
                  <p className="review-comment">
                    {review.comment || review.text}
                  </p>
                  <div className="review-date">
                    <i className="fa-solid fa-calendar"></i>{' '}
                    {review.createdAt ? formatDate(review.createdAt) : ''}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="no-reviews">
            <div className="no-reviews-icon-wrapper">
              <i className="fa-solid fa-star"></i>
            </div>
            <h3 className="no-reviews-title">
              {t('reviews.noReviewsTitle') ||
                'Be the First to Share Your Experience!'}
            </h3>
            <p className="no-reviews-message">
              {t('reviews.noReviews') ||
                'No reviews yet. Be the first to review!'}
            </p>
          </div>
        )}
      </div>

      {showReviewForm && (
        <div
          className="review-form-overlay"
          onClick={() => setShowReviewForm(false)}
        >
          <div
            className="review-form-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <ReviewForm
              onReviewSubmitted={handleReviewSubmitted}
              onClose={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
