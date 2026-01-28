'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { useAutoKeyboardAvoidance } from '../hooks/useKeyboardAvoidance';
import './ReviewForm.css';
import Icon from './ui/Icon.jsx';

const ReviewForm = ({ onReviewSubmitted, onClose }) => {
  const { t } = useLanguage();
  const { success, error: showError } = useNotification();

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    userLocation: '',
    rating: 5,
    comment: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Enable keyboard avoidance for mobile
  useAutoKeyboardAvoidance({
    containerSelector: 'form',
    inputSelector: 'input, textarea, select',
  });

  // Check for existing review when name and phone are filled
  useEffect(() => {
    const checkExisting = async () => {
      if (
        formData.userName &&
        formData.userPhone &&
        formData.userPhone.length >= 10
      ) {
        try {
          const api = (await import('../lib/api')).default;
          const result = await api.checkExistingReview(
            formData.userName,
            formData.userPhone
          );
          if (result.success && result.exists) {
            setExistingReview(result.data);
          } else {
            setExistingReview(null);
          }
        } catch (err) {
          // Silently fail - don't show error for check
          setExistingReview(null);
        }
      } else {
        setExistingReview(null);
      }
    };

    const timeoutId = setTimeout(checkExisting, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.userName, formData.userPhone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate low rating comments
    if (
      (formData.rating === 1 || formData.rating === 2) &&
      (!formData.comment || formData.comment.trim().length < 20)
    ) {
      setError(
        'For low ratings, please provide a detailed comment explaining your experience (minimum 20 characters).'
      );
      return;
    }

    // Check if review exists and show confirmation
    if (existingReview && !pendingSubmit) {
      setShowConfirmDialog(true);
      return;
    }

    setLoading(true);
    setPendingSubmit(false);

    try {
      const api = (await import('../lib/api')).default;
      const data = await api.createReview(formData);

      if (data.success) {
        setIsSubmitted(true);
        const message = data.isUpdate
          ? t('reviews.updateSuccess') ||
            'Your review has been updated successfully. It will be published after admin approval.'
          : t('reviews.submitSuccess') ||
            'Thank you! Your review has been submitted and will be published after admin approval.';
        success(message);
        setFormData({
          userName: '',
          userEmail: '',
          userPhone: '',
          userLocation: '',
          rating: 5,
          comment: '',
        });
        setExistingReview(null);
        setShowConfirmDialog(false);

        if (onReviewSubmitted) {
          onReviewSubmitted();
        }

        setTimeout(() => {
          setIsSubmitted(false);
          if (onClose) onClose();
        }, 2000);
      } else {
        const errorMsg = data.error || 'Failed to submit review';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Connection error. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    }

    setLoading(false);
  };

  const handleConfirmUpdate = () => {
    setPendingSubmit(true);
    setShowConfirmDialog(false);
    // Trigger submit again
    const form = document.querySelector('.review-form form');
    if (form) {
      form.requestSubmit();
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmDialog(false);
    setPendingSubmit(false);
  };

  return (
    <div className="review-form-container">
      <div className="review-form">
        <div className="review-form-header">
          <h3>{t('reviews.submitReview') || 'Submit Your Review'}</h3>
          {onClose && (
            <button
              className="review-form-close"
              onClick={onClose}
              aria-label="Close review form"
              type="button"
            >
              <Icon name="times" aria-hidden="true" />
            </button>
          )}
        </div>

        {isSubmitted && (
          <div className="review-success">
            <Icon name="check-circle" />
            <p>
              {t('reviews.submitSuccess') ||
                'Thank you! Your review has been submitted and will be published after admin approval.'}
            </p>
          </div>
        )}

        {error && (
          <div className="review-error">
            <Icon name="exclamation-circle" />
            <p>{error}</p>
          </div>
        )}

        {showConfirmDialog && existingReview && (
          <div className="review-confirm-dialog">
            <div className="review-confirm-content">
              <div className="review-confirm-icon">
                <Icon name="exclamation-triangle" />
              </div>
              <h4>Review Already Exists</h4>
              <p>
                You have already submitted a review with this name and phone
                number. Your previous review had a rating of{' '}
                <strong>{existingReview.rating}/5</strong>.
              </p>
              <p>
                Do you want to update your existing review with the new details?
              </p>
              <div className="review-confirm-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelUpdate}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmUpdate}
                >
                  Yes, Update Review
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>{t('common.name')} *</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-field">
            <label>{t('common.email')}</label>
            <input
              type="email"
              value={formData.userEmail}
              onChange={(e) =>
                setFormData({ ...formData, userEmail: e.target.value })
              }
            />
          </div>

          <div className="form-field">
            <label>{t('common.phone')}</label>
            <input
              type="tel"
              value={formData.userPhone}
              onChange={(e) =>
                setFormData({ ...formData, userPhone: e.target.value })
              }
            />
          </div>

          <div className="form-field">
            <label>{t('reviews.location') || 'Location (Optional)'}</label>
            <input
              type="text"
              value={formData.userLocation}
              onChange={(e) =>
                setFormData({ ...formData, userLocation: e.target.value })
              }
              placeholder={
                t('reviews.locationPlaceholder') ||
                'e.g., Panchsheel Greens, Tower A1'
              }
            />
          </div>

          <div className="form-field">
            <label>{t('reviews.rating') || 'Rating'} *</label>
            <div className="rating-input" data-rating={formData.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rating-star ${formData.rating >= star ? 'active' : ''}`}
                  data-star-value={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  <Icon name="star" />
                </button>
              ))}
              <span className="rating-value">{formData.rating} / 5</span>
            </div>
          </div>

          <div className="form-field">
            <label>
              {t('reviews.comment') || 'Your Review'} *
              {(formData.rating === 1 || formData.rating === 2) && (
                <span className="comment-requirement">
                  {' '}
                  (Minimum 20 characters required for low ratings)
                </span>
              )}
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              required
              rows="5"
              minLength={formData.rating <= 2 ? 20 : 0}
              placeholder={
                formData.rating <= 2
                  ? 'Please provide detailed feedback explaining your experience (minimum 20 characters)...'
                  : t('reviews.commentPlaceholder') ||
                    'Share your experience with HomieBites...'
              }
            />
            {(formData.rating === 1 || formData.rating === 2) &&
              formData.comment && (
                <div className="comment-length-indicator">
                  {formData.comment.trim().length < 20 ? (
                    <span className="comment-warning">
                      {20 - formData.comment.trim().length} more characters
                      required
                    </span>
                  ) : (
                    <span className="comment-success">✓ Sufficient length</span>
                  )}
                </div>
              )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading
              ? t('common.submitting') || 'Submitting...'
              : t('reviews.submit') || 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
