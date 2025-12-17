'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ReviewForm from './ReviewForm';

const Testimonials = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch live reviews from API
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const api = (await import('../lib/api')).default;
      const data = await api.getReviews(true, 10);
      
      if (data.success) {
        // If we have live reviews, use them; otherwise use fallback
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          // Fallback to default testimonials
          setReviews([
            {
              _id: 1,
              comment: t('testimonials.review1'),
              userName: 'Rahul Sharma',
              userLocation: 'Panchsheel Greens',
              rating: 5,
            },
            {
              _id: 2,
              comment: t('testimonials.review2'),
              userName: 'Priya Gupta',
              userLocation: 'Tower B2',
              rating: 5,
            },
            {
              _id: 3,
              comment: t('testimonials.review3'),
              userName: 'Vikram Singh',
              userLocation: 'A1 Tower',
              rating: 5,
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Fallback to default testimonials on error
      setReviews([
        {
          _id: 1,
          comment: t('testimonials.review1'),
          userName: 'Rahul Sharma',
          userLocation: 'Panchsheel Greens',
          rating: 5,
        },
        {
          _id: 2,
          comment: t('testimonials.review2'),
          userName: 'Priya Gupta',
          userLocation: 'Tower B2',
          rating: 5,
        },
        {
          _id: 3,
          comment: t('testimonials.review3'),
          userName: 'Vikram Singh',
          userLocation: 'A1 Tower',
          rating: 5,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  const handleReviewSubmitted = () => {
    loadReviews(); // Reload reviews after submission
  };

  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fa-solid fa-star ${star <= rating ? 'active' : ''}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <h2 className="section-heading">{t('testimonials.title')}</h2>
          <p>{t('common.loading') || 'Loading...'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-container">
        <div className="testimonials-header">
          <h2 className="section-heading">{t('testimonials.title')}</h2>
          <button 
            className="btn btn-primary btn-small"
            onClick={() => setShowReviewForm(true)}
          >
            <i className="fa-solid fa-pen"></i> {t('reviews.writeReview') || 'Write a Review'}
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review._id || review.id} className="review-card">
                <div className="review-card-header">
                  <div className="author-avatar">
                    {(review.userName || review.name || 'Customer').charAt(0).toUpperCase()}
                  </div>
                  <div className="review-author-info">
                    <strong>{review.userName || review.name || 'Customer'}</strong>
                    {review.userLocation || review.location ? (
                      <span>{review.userLocation || review.location}</span>
                    ) : null}
                  </div>
                </div>
                <div className="review-card-body">
                  {renderStars(review.rating || 5)}
                  <p className="review-comment">{review.comment || review.text}</p>
                </div>
                <div className="review-card-footer">
                  <span className="review-date">
                    {review.createdAt 
                      ? new Date(review.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <p>{t('reviews.noReviews') || 'No reviews yet. Be the first to review!'}</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowReviewForm(true)}
            >
              {t('reviews.writeReview') || 'Write a Review'}
            </button>
          </div>
        )}
      </div>

      {showReviewForm && (
        <div className="review-form-overlay" onClick={() => setShowReviewForm(false)}>
          <div className="review-form-wrapper" onClick={(e) => e.stopPropagation()}>
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
