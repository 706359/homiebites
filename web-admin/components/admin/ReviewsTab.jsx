import { useEffect, useMemo, useState } from 'react';
import Icon from '../ui/Icon.jsx';
import api from '../../lib/api-admin.js';
import PremiumLoader from './PremiumLoader.jsx';
import { formatDate, formatDateMonthDay } from './utils/dateUtils.js';

const ReviewsTab = ({
  loading = false,
  showNotification = () => {},
  showConfirmation = null,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending, featured
  const [filterRating, setFilterRating] = useState('all'); // all, 5, 4, 3, 2, 1
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [editingReview, setEditingReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await api.getAllReviews();
      if (response && response.success && Array.isArray(response.data)) {
        setReviews(response.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Silently fail - component will render with empty reviews
      // This allows the tab to open even if backend is not available
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Filter by status
    if (filterStatus === 'approved') {
      filtered = filtered.filter((r) => r.isApproved === true);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter((r) => r.isApproved === false);
    } else if (filterStatus === 'featured') {
      filtered = filtered.filter((r) => r.featured === true);
    }

    // Filter by rating
    if (filterRating !== 'all') {
      const ratingNum = parseInt(filterRating);
      filtered = filtered.filter((r) => r.rating === ratingNum);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.userName && r.userName.toLowerCase().includes(query)) ||
          (r.userEmail && r.userEmail.toLowerCase().includes(query)) ||
          (r.comment && r.comment.toLowerCase().includes(query)) ||
          (r.userLocation && r.userLocation.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || 0);
      const dateB = new Date(b.createdAt || b.updatedAt || 0);
      return dateB - dateA;
    });
  }, [reviews, filterStatus, filterRating, searchQuery]);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    return filteredReviews.slice(start, end);
  }, [filteredReviews, currentPage, recordsPerPage]);

  const totalPages = Math.ceil(filteredReviews.length / recordsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterRating, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: reviews.length,
      approved: reviews.filter((r) => r.isApproved).length,
      pending: reviews.filter((r) => !r.isApproved).length,
      featured: reviews.filter((r) => r.featured).length,
      avgRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
              reviews.length
            ).toFixed(1)
          : '0.0',
      rating5: reviews.filter((r) => r.rating === 5).length,
      rating4: reviews.filter((r) => r.rating === 4).length,
      rating3: reviews.filter((r) => r.rating === 3).length,
      rating2: reviews.filter((r) => r.rating === 2).length,
      rating1: reviews.filter((r) => r.rating === 1).length,
    };
  }, [reviews]);

  const handleApprove = async (reviewId) => {
    try {
      const response = await api.updateReview(reviewId, { isApproved: true });
      if (response && response.success) {
        await loadReviews();
        if (showNotification) {
          showNotification('Review approved successfully', 'success');
        }
      } else {
        throw new Error(response?.error || 'Failed to approve review');
      }
    } catch (error) {
      console.error('Error approving review:', error);
      if (showNotification) {
        showNotification('Failed to approve review', 'error');
      }
    }
  };

  const handleReject = async (reviewId) => {
    if (showConfirmation && typeof showConfirmation === 'function') {
      showConfirmation({
        title: 'Reject Review',
        message: 'Are you sure you want to reject this review?',
        type: 'warning',
        confirmText: 'Reject',
        onConfirm: async () => {
          try {
            const response = await api.updateReview(reviewId, {
              isApproved: false,
            });
            if (response && response.success) {
              await loadReviews();
              if (showNotification) {
                showNotification('Review rejected', 'success');
              }
            } else {
              throw new Error(response?.error || 'Failed to reject review');
            }
          } catch (error) {
            console.error('Error rejecting review:', error);
            if (showNotification) {
              showNotification('Failed to reject review', 'error');
            }
          }
        },
      });
    }
  };

  const handleToggleFeatured = async (reviewId, currentFeatured) => {
    try {
      const response = await api.updateReview(reviewId, {
        featured: !currentFeatured,
      });
      if (response && response.success) {
        await loadReviews();
        if (showNotification) {
          showNotification(
            !currentFeatured
              ? 'Review marked as featured'
              : 'Review unfeatured',
            'success'
          );
        }
      } else {
        throw new Error(response?.error || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      if (showNotification) {
        showNotification('Failed to update review', 'error');
      }
    }
  };

  const handleDelete = async (reviewId) => {
    if (showConfirmation && typeof showConfirmation === 'function') {
      showConfirmation({
        title: 'Delete Review',
        message: 'Are you sure you want to delete this review? This action cannot be undone.',
        type: 'danger',
        confirmText: 'Delete',
        onConfirm: async () => {
          try {
            const response = await api.deleteReview(reviewId);
            if (response && response.success) {
              await loadReviews();
              if (showNotification) {
                showNotification('Review deleted successfully', 'success');
              }
            } else {
              throw new Error(response?.error || 'Failed to delete review');
            }
          } catch (error) {
            console.error('Error deleting review:', error);
            if (showNotification) {
              showNotification('Failed to delete review', 'error');
            }
          }
        },
      });
    }
  };

  const handleEdit = (review) => {
    setEditingReview({ ...review });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;

    try {
      const { _id, ...updates } = editingReview;
      const response = await api.updateReview(_id, updates);
      if (response && response.success) {
        await loadReviews();
        setShowEditModal(false);
        setEditingReview(null);
        if (showNotification) {
          showNotification('Review updated successfully', 'success');
        }
      } else {
        throw new Error(response?.error || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      if (showNotification) {
        showNotification('Failed to update review', 'error');
      }
    }
  };

  const handleExport = () => {
    const csvContent =
      'Name,Email,Phone,Location,Rating,Comment,Featured,Approved,Date\n' +
      filteredReviews
        .map((r) => {
          const date = r.createdAt
            ? formatDate(new Date(r.createdAt))
            : 'N/A';
          return `"${r.userName || ''}","${r.userEmail || ''}","${
            r.userPhone || ''
          }","${r.userLocation || ''}","${r.rating || 0}","${
            (r.comment || '').replace(/"/g, '""')
          }","${r.featured ? 'Yes' : 'No'}","${r.isApproved ? 'Yes' : 'No'}","${date}"`;
        })
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reviews_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    if (showNotification) {
      showNotification('Reviews exported successfully', 'success');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="review-stars-inline">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            className={star <= rating ? 'star-filled' : 'star-empty'}
          />
        ))}
      </div>
    );
  };

  if (loading || loadingReviews) {
    return (
      <div className="admin-content">
        <PremiumLoader message="Loading reviews..." size="large" />
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* Stats Summary */}
      <div className="dashboard-card">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">
            <Icon name="star"/>
            Reviews Overview
          </h2>
        </div>
        <div className="reviews-stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="comments"/>
            </div>
            <div className="stat-card-content">
              <h3>{stats.total}</h3>
              <p>Total Reviews</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="check-circle"/>
            </div>
            <div className="stat-card-content">
              <h3>{stats.approved}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="clock"/>
            </div>
            <div className="stat-card-content">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="star"/>
            </div>
            <div className="stat-card-content">
              <h3>{stats.avgRating}</h3>
              <p>Avg Rating</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">
              <Icon name="heart"/>
            </div>
            <div className="stat-card-content">
              <h3>{stats.featured}</h3>
              <p>Featured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="dashboard-card filter-bar-card">
        <div className="filter-bar-container">
          <div className="search-input-wrapper">
            <Icon name="search" className="search-input-icon"/>
            <input
              type="text"
              className="input-field search-input-with-icon"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-field-group-standard">
            <label className="filter-label-standard">Status</label>
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <div className="filter-field-group-standard">
            <label className="filter-label-standard">Rating</label>
            <select
              className="input-field"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
        <div className="table-info-text">
          Showing {paginatedReviews.length > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0}-
          {Math.min(currentPage * recordsPerPage, filteredReviews.length)} of{' '}
          {filteredReviews.length} reviews
        </div>
      </div>

      {/* Reviews Table */}
      <div className="dashboard-card table-container-card">
        {paginatedReviews.length === 0 ? (
          <div className="empty-state-center">
            <div className="empty-state">
              <Icon name="comments" className="empty-state-icon"/>
              <p>No reviews found</p>
              <p className="empty-state-text">
                {searchQuery || filterStatus !== 'all' || filterRating !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Reviews will appear here once customers submit them'}
              </p>
            </div>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReviews.map((review) => (
                  <tr key={review._id || review.id}>
                    <td>
                      <div className="review-customer-info">
                        <div className="review-customer-name">
                          {review.userName || 'Anonymous'}
                        </div>
                        {review.userEmail && (
                          <div className="review-customer-email">
                            {review.userEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="review-rating-cell">
                        {renderStars(review.rating || 0)}
                        <span className="review-rating-number">
                          {review.rating || 0}/5
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="review-comment-cell">
                        {review.comment || 'No comment'}
                      </div>
                    </td>
                    <td>{review.userLocation || 'N/A'}</td>
                    <td>
                      {review.createdAt
                        ? formatDateMonthDay(new Date(review.createdAt))
                        : 'N/A'}
                    </td>
                    <td>
                      <div className="review-status-badges">
                        {review.isApproved ? (
                          <span className="badge badge-success badge-small">
                            Approved
                          </span>
                        ) : (
                          <span className="badge badge-warning badge-small">
                            Pending
                          </span>
                        )}
                        {review.featured && (
                          <span className="badge badge-primary badge-small">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        {!review.isApproved && (
                          <button
                            className="btn btn-icon action-icon-approve"
                            onClick={() => handleApprove(review._id || review.id)}
                            title="Approve"
                          >
                            <Icon name="check"/>
                          </button>
                        )}
                        {review.isApproved && (
                          <button
                            className="btn btn-icon action-icon-edit"
                            onClick={() => handleReject(review._id || review.id)}
                            title="Reject"
                          >
                            <Icon name="times"/>
                          </button>
                        )}
                        <button
                          className="btn btn-icon action-icon-edit"
                          onClick={() => handleEdit(review)}
                          title="Edit"
                        >
                          <Icon name="pencil"/>
                        </button>
                        <button
                          className={`btn btn-icon ${
                            review.featured
                              ? 'action-icon-featured'
                              : 'action-icon-ghost'
                          }`}
                          onClick={() =>
                            handleToggleFeatured(
                              review._id || review.id,
                              review.featured
                            )
                          }
                          title={review.featured ? 'Unfeature' : 'Feature'}
                        >
                          <Icon name="heart"/>
                        </button>
                        <button
                          className="btn btn-icon action-icon-delete"
                          onClick={() => handleDelete(review._id || review.id)}
                          title="Delete"
                        >
                          <Icon name="trash"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="btn btn-ghost btn-small"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="chevron-left"/> Previous
            </button>
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            <button
              className="btn btn-ghost btn-small"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next <Icon name="chevron-right"/>
            </button>
            <div className="pagination-records">
              <label>Records per page:</label>
              <select
                className="input-field input-field-small"
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingReview && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="modal-container order-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Edit Review</h3>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingReview(null);
                }}
              >
                <Icon name="times"/>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingReview.userName || ''}
                  onChange={(e) =>
                    setEditingReview({
                      ...editingReview,
                      userName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={editingReview.userEmail || ''}
                  onChange={(e) =>
                    setEditingReview({
                      ...editingReview,
                      userEmail: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  className="input-field"
                  min="1"
                  max="5"
                  value={editingReview.rating || 5}
                  onChange={(e) =>
                    setEditingReview({
                      ...editingReview,
                      rating: parseInt(e.target.value) || 5,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  className="input-field"
                  rows="4"
                  value={editingReview.comment || ''}
                  onChange={(e) =>
                    setEditingReview({
                      ...editingReview,
                      comment: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingReview.userLocation || ''}
                  onChange={(e) =>
                    setEditingReview({
                      ...editingReview,
                      userLocation: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label-inline">
                  <input
                    type="checkbox"
                    checked={editingReview.isApproved || false}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        isApproved: e.target.checked,
                      })
                    }
                  />
                  <span>Approved</span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label-inline">
                  <input
                    type="checkbox"
                    checked={editingReview.featured || false}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        featured: e.target.checked,
                      })
                    }
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingReview(null);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
