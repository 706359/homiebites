"use client";

import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNotification } from "../contexts/NotificationContext";
import "./ReviewForm.css";

const ReviewForm = ({ onReviewSubmitted, onClose }) => {
  const { t } = useLanguage();
  const { success, error: showError } = useNotification();

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userLocation: "",
    rating: 5,
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const api = (await import("../lib/api")).default;
      const data = await api.createReview(formData);

      if (data.success) {
        setIsSubmitted(true);
        success(
          t("reviews.submitSuccess") ||
            "Thank you! Your review has been submitted and will be published after admin approval.",
        );
        setFormData({
          userName: "",
          userEmail: "",
          userPhone: "",
          userLocation: "",
          rating: 5,
          comment: "",
        });

        if (onReviewSubmitted) {
          onReviewSubmitted();
        }

        setTimeout(() => {
          setIsSubmitted(false);
          if (onClose) onClose();
        }, 2000);
      } else {
        const errorMsg = data.error || "Failed to submit review";
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Connection error. Please try again.";
      setError(errorMsg);
      showError(errorMsg);
    }

    setLoading(false);
  };

  return (
    <div className="review-form-container">
      <div className="review-form">
        <div className="review-form-header">
          <h3>{t("reviews.submitReview") || "Submit Your Review"}</h3>
          {onClose && (
            <button className="review-form-close" onClick={onClose}>
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>

        {isSubmitted && (
          <div className="review-success">
            <i className="fa-solid fa-check-circle"></i>
            <p>
              {t("reviews.submitSuccess") ||
                "Thank you! Your review has been submitted and will be published after admin approval."}
            </p>
          </div>
        )}

        {error && (
          <div className="review-error">
            <i className="fa-solid fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>{t("common.name")} *</label>
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
            <label>{t("common.email")}</label>
            <input
              type="email"
              value={formData.userEmail}
              onChange={(e) =>
                setFormData({ ...formData, userEmail: e.target.value })
              }
            />
          </div>

          <div className="form-field">
            <label>{t("common.phone")}</label>
            <input
              type="tel"
              value={formData.userPhone}
              onChange={(e) =>
                setFormData({ ...formData, userPhone: e.target.value })
              }
            />
          </div>

          <div className="form-field">
            <label>{t("reviews.location") || "Location (Optional)"}</label>
            <input
              type="text"
              value={formData.userLocation}
              onChange={(e) =>
                setFormData({ ...formData, userLocation: e.target.value })
              }
              placeholder={
                t("reviews.locationPlaceholder") ||
                "e.g., Panchsheel Greens, Tower A1"
              }
            />
          </div>

          <div className="form-field">
            <label>{t("reviews.rating") || "Rating"} *</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rating-star ${formData.rating >= star ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  <i className="fa-solid fa-star"></i>
                </button>
              ))}
              <span className="rating-value">{formData.rating} / 5</span>
            </div>
          </div>

          <div className="form-field">
            <label>{t("reviews.comment") || "Your Review"} *</label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              required
              rows="5"
              placeholder={
                t("reviews.commentPlaceholder") ||
                "Share your experience with HomieBites..."
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading
              ? t("common.submitting") || "Submitting..."
              : t("reviews.submit") || "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
