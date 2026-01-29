import { useEffect, useState } from 'react';
import { useAutoKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance.js';
import api from '../../lib/api-admin.js';
import Icon from '../ui/Icon.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import PremiumLoader from './PremiumLoader.jsx';

const OffersTab = ({
  showNotification,
  showConfirmation,
  loading = false,
  loadOffersData,
}) => {
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useAutoKeyboardAvoidance({
    containerSelector: '.modal-container, .admin-content',
    inputSelector: 'input, textarea, select',
  });

  const [formData, setFormData] = useState({
    title: '',
    type: 'Percentage',
    value: 0,
    description: '',
    discount: '',
    badge: '',
    terms: [''],
    startDate: '',
    endDate: '',
    whatsappMessage: '',
    ctaText: '',
    isActive: true,
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoadingOffers(true);
    try {
      const response = await api.getOffers();
      if (response.success && response.data && Array.isArray(response.data)) {
        setOffers(response.data);
      } else {
        setOffers([]);
      }
    } catch (error) {
      console.error('Error loading offers:', error);
      showNotification('Failed to load offers', 'error');
      setOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleAddOffer = () => {
    setFormData({
      title: '',
      type: 'Percentage',
      value: 0,
      description: '',
      discount: '',
      badge: '',
      terms: [''],
      startDate: '',
      endDate: '',
      whatsappMessage: '',
      ctaText: '',
      isActive: true,
    });
    setShowAddModal(true);
  };

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setFormData({
      title: offer.title || '',
      type: offer.type || 'Percentage',
      value: offer.value || 0,
      description: offer.description || '',
      discount: offer.discount || '',
      badge: offer.badge || '',
      terms:
        Array.isArray(offer.terms) && offer.terms.length > 0
          ? offer.terms
          : [''],
      startDate: offer.startDate
        ? new Date(offer.startDate).toISOString().split('T')[0]
        : '',
      endDate: offer.endDate
        ? new Date(offer.endDate).toISOString().split('T')[0]
        : '',
      whatsappMessage: offer.whatsappMessage || '',
      ctaText: offer.ctaText || '',
      isActive: offer.isActive !== false,
    });
    setShowEditModal(true);
  };

  const handleDeleteOffer = async () => {
    if (!selectedOffer) return;

    try {
      const updatedOffers = offers.filter(
        (o) => o._id !== selectedOffer._id && o.id !== selectedOffer.id
      );
      await api.updateOffers(updatedOffers);
      setOffers(updatedOffers);
      setShowDeleteModal(false);
      setSelectedOffer(null);
      showNotification('Offer deleted successfully', 'success');
      if (loadOffersData) {
        loadOffersData();
      }
      // Trigger update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('offersDataUpdated'));
        if (typeof window !== 'undefined') {
          localStorage.setItem('offers-last-update', Date.now().toString());
        }
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      showNotification('Failed to delete offer', 'error');
    }
  };

  const handleSaveOffer = async (isEdit = false) => {
    if (!formData.title.trim()) {
      showNotification('Title is required', 'error');
      return;
    }

    try {
      let updatedOffers;
      if (isEdit && selectedOffer) {
        updatedOffers = offers.map((offer) => {
          if (
            offer._id === selectedOffer._id ||
            offer.id === selectedOffer.id
          ) {
            return {
              ...formData,
              _id: selectedOffer._id || selectedOffer.id,
              id: selectedOffer.id || selectedOffer._id,
            };
          }
          return offer;
        });
      } else {
        const newOffer = {
          ...formData,
          terms: formData.terms.filter((term) => term.trim() !== ''),
        };
        updatedOffers = [...offers, newOffer];
      }

      await api.updateOffers(updatedOffers);
      setOffers(updatedOffers);
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedOffer(null);
      showNotification(
        isEdit ? 'Offer updated successfully' : 'Offer added successfully',
        'success'
      );
      if (loadOffersData) {
        loadOffersData();
      }
      // Trigger update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('offersDataUpdated'));
        if (typeof window !== 'undefined') {
          localStorage.setItem('offers-last-update', Date.now().toString());
        }
      }
    } catch (error) {
      console.error('Error saving offer:', error);
      showNotification('Failed to save offer', 'error');
    }
  };

  const handleAddTerm = () => {
    setFormData({
      ...formData,
      terms: [...formData.terms, ''],
    });
  };

  const handleRemoveTerm = (index) => {
    setFormData({
      ...formData,
      terms: formData.terms.filter((_, i) => i !== index),
    });
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...formData.terms];
    newTerms[index] = value;
    setFormData({
      ...formData,
      terms: newTerms,
    });
  };

  const activeOffers = offers.filter((offer) => {
    if (!offer.isActive) return false;
    if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
    return true;
  });

  const expiredOffers = offers.filter((offer) => {
    if (offer.endDate && new Date(offer.endDate) < new Date()) return true;
    return false;
  });

  if (loading || loadingOffers) {
    return (
      <div className="admin-content">
        <PremiumLoader message="Loading offers..." />
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="kitchen-tab">
        <div className="kitchen-tab-stats">
          <div className="stat-card">
            <Icon name="tag" />
            <div>
              <h3>{offers.length}</h3>
              <p>{offers.length === 1 ? 'Offer' : 'Offers'} total</p>
            </div>
          </div>
          <div className="stat-card stat-card-success">
            <Icon name="check-circle" />
            <div>
              <h3>{activeOffers.length}</h3>
              <p>Active</p>
            </div>
          </div>
          <div className="stat-card stat-card-warning">
            <Icon name="clock" />
            <div>
              <h3>{expiredOffers.length}</h3>
              <p>Expired</p>
            </div>
          </div>
        </div>

        <div className="kitchen-tab-actions">
          <div className="kitchen-tab-actions-left">
            <span className="table-info-text">
              {offers.length} {offers.length === 1 ? 'offer' : 'offers'}
            </span>
          </div>
          <div className="kitchen-tab-actions-right">
            <button className="btn btn-primary" onClick={handleAddOffer}>
              <Icon name="plus" /> Add New Offer
            </button>
          </div>
        </div>

        <div className="kitchen-tab-card">
          {offers.length === 0 ? (
            <div className="kitchen-tab-empty">
              <Icon name="tag" className="kitchen-tab-empty-icon" aria-hidden />
              <h3 className="kitchen-tab-empty-title">No offers yet</h3>
              <p className="kitchen-tab-empty-desc">
                Create your first special offer to attract more customers
              </p>
              <button className="btn btn-primary" onClick={handleAddOffer}>
                <Icon name="plus" /> Add Your First Offer
              </button>
            </div>
          ) : (
            <div className="offers-list-wrapper">
              <div className="offers-list">
                {offers.map((offer, index) => {
                  const isExpired =
                    offer.endDate && new Date(offer.endDate) < new Date();
                  const isInactive = !offer.isActive;

                  return (
                    <div
                      key={offer._id || offer.id || index}
                      className={`offer-card ${isExpired ? 'offer-expired' : ''} ${
                        isInactive ? 'offer-inactive' : ''
                      }`}
                    >
                      <div className="offer-card-header">
                        <div className="offer-card-title-section">
                          <h3 className="offer-card-title">{offer.title}</h3>
                          {offer.badge && (
                            <span className="offer-badge">{offer.badge}</span>
                          )}
                          {isExpired && (
                            <span className="offer-status-badge offer-status-expired">
                              Expired
                            </span>
                          )}
                          {isInactive && (
                            <span className="offer-status-badge offer-status-inactive">
                              Inactive
                            </span>
                          )}
                          {!isExpired && offer.isActive && (
                            <span className="offer-status-badge offer-status-active">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="offer-card-actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleEditOffer(offer)}
                            title="Edit offer"
                          >
                            <Icon name="pencil" />
                          </button>
                          <button
                            className="btn-icon btn-icon-danger"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setShowDeleteModal(true);
                            }}
                            title="Delete offer"
                          >
                            <Icon name="trash" />
                          </button>
                        </div>
                      </div>

                      <div className="offer-card-body">
                        {offer.description && (
                          <p className="offer-description">
                            {offer.description}
                          </p>
                        )}

                        <div className="offer-details">
                          <div className="offer-detail-item">
                            <span className="offer-detail-label">
                              Discount:
                            </span>
                            <span className="offer-detail-value">
                              {offer.type === 'Percentage'
                                ? `${offer.value}%`
                                : `₹${offer.value}`}
                              {offer.discount && ` - ${offer.discount}`}
                            </span>
                          </div>

                          {offer.startDate && (
                            <div className="offer-detail-item">
                              <span className="offer-detail-label">
                                Start Date:
                              </span>
                              <span className="offer-detail-value">
                                {new Date(offer.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {offer.endDate && (
                            <div className="offer-detail-item">
                              <span className="offer-detail-label">
                                End Date:
                              </span>
                              <span className="offer-detail-value">
                                {new Date(offer.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          {offer.terms && offer.terms.length > 0 && (
                            <div className="offer-detail-item">
                              <span className="offer-detail-label">Terms:</span>
                              <ul className="offer-terms-list">
                                {offer.terms.map((term, idx) => (
                                  <li key={idx}>{term}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Offer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-container offer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Add New Offer</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <Icon name="times" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Monthly Subscription Discount"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step={formData.type === 'Percentage' ? '1' : '10'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Discount Text</label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  placeholder="e.g., 20% off on total"
                />
              </div>

              <div className="form-group">
                <label>Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData({ ...formData, badge: e.target.value })
                  }
                  placeholder="e.g., Limited Time"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  placeholder="Offer description..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Terms & Conditions</label>
                {formData.terms.map((term, index) => (
                  <div key={index} className="form-term-row">
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleTermChange(index, e.target.value)}
                      placeholder={`Term ${index + 1}`}
                    />
                    {formData.terms.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        onClick={() => handleRemoveTerm(index)}
                      >
                        <Icon name="times" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={handleAddTerm}
                >
                  <Icon name="plus" /> Add Term
                </button>
              </div>

              <div className="form-group">
                <label>WhatsApp Message</label>
                <textarea
                  value={formData.whatsappMessage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsappMessage: e.target.value,
                    })
                  }
                  rows="2"
                  placeholder="Message to send when user clicks WhatsApp button"
                />
              </div>

              <div className="form-group">
                <label>CTA Text</label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaText: e.target.value })
                  }
                  placeholder="e.g., Get This Deal Now"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <span>Active (Show on website)</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveOffer(false)}
              >
                <Icon name="save" /> Add Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="modal-container offer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Edit Offer</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <Icon name="times" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Monthly Subscription Discount"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step={formData.type === 'Percentage' ? '1' : '10'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Discount Text</label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  placeholder="e.g., 20% off on total"
                />
              </div>

              <div className="form-group">
                <label>Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData({ ...formData, badge: e.target.value })
                  }
                  placeholder="e.g., Limited Time"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  placeholder="Offer description..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Terms & Conditions</label>
                {formData.terms.map((term, index) => (
                  <div key={index} className="form-term-row">
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleTermChange(index, e.target.value)}
                      placeholder={`Term ${index + 1}`}
                    />
                    {formData.terms.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        onClick={() => handleRemoveTerm(index)}
                      >
                        <Icon name="times" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={handleAddTerm}
                >
                  <Icon name="plus" /> Add Term
                </button>
              </div>

              <div className="form-group">
                <label>WhatsApp Message</label>
                <textarea
                  value={formData.whatsappMessage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsappMessage: e.target.value,
                    })
                  }
                  rows="2"
                  placeholder="Message to send when user clicks WhatsApp button"
                />
              </div>

              <div className="form-group">
                <label>CTA Text</label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaText: e.target.value })
                  }
                  placeholder="e.g., Get This Deal Now"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <span>Active (Show on website)</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveOffer(true)}
              >
                <Icon name="save" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedOffer && (
        <ConfirmationModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteOffer}
          title="Delete Offer"
          message={`Are you sure you want to delete "${selectedOffer.title}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmType="danger"
        />
      )}
    </div>
  );
};

export default OffersTab;
