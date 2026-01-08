// Tab: Gallery Management
// Allows managing gallery items displayed on the website

import { useEffect, useMemo, useState } from 'react';
import ConfirmModal from '../ConfirmModal.jsx';
import api from '../lib/api.js';
import PremiumLoader from './PremiumLoader.jsx';

const GalleryTab = ({ showNotification, loading = false }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('order'); // 'name', 'price', 'category', 'order'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    alt: '',
    caption: '',
    price: '',
    category: '',
    order: 0,
    isActive: true,
  });

  // Load gallery items
  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    setLoadingGallery(true);
    try {
      const response = await api.getGallery();

      if (response.success && response.data && Array.isArray(response.data)) {
        setGalleryItems(response.data);
      } else {
        setGalleryItems([]);
      }
    } catch (error) {
      console.error('Error loading gallery items:', error);
      setGalleryItems([]);
      if (showNotification) {
        showNotification('Error loading gallery items', 'error');
      }
    } finally {
      setLoadingGallery(false);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(galleryItems.map((item) => item.category).filter(Boolean))];
    return cats.sort();
  }, [galleryItems]);

  // Filtered and sorted gallery items
  const filteredGalleryItems = useMemo(() => {
    let filtered = [...galleryItems];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.caption?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'price':
          aVal = parseFloat(a.price || 0);
          bVal = parseFloat(b.price || 0);
          break;
        case 'category':
          aVal = (a.category || '').toLowerCase();
          bVal = (b.category || '').toLowerCase();
          break;
        case 'order':
          aVal = a.order || 0;
          bVal = b.order || 0;
          break;
        default: // 'name'
          aVal = (a.name || '').toLowerCase();
          bVal = (b.name || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return filtered;
  }, [galleryItems, searchQuery, filterCategory, sortBy, sortOrder]);

  // Handle add item
  const handleAddItem = async () => {
    if (!formData.name.trim() || !formData.imageUrl.trim()) {
      if (showNotification) {
        showNotification('Name and Image URL are required', 'error');
      }
      return;
    }

    try {
      const newItem = {
        name: formData.name.trim(),
        imageUrl: formData.imageUrl.trim(),
        alt: formData.alt.trim() || formData.name.trim(),
        caption: formData.caption.trim() || '',
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.category.trim() || null,
        order: parseInt(formData.order) || 0,
        isActive: formData.isActive !== false,
      };

      await api.createGalleryItem(newItem);

      setShowAddModal(false);
      setFormData({
        name: '',
        imageUrl: '',
        alt: '',
        caption: '',
        price: '',
        category: '',
        order: 0,
        isActive: true,
      });

      await loadGalleryItems();

      if (showNotification) {
        showNotification('Gallery item added successfully', 'success');
      }
    } catch (error) {
      console.error('Error adding gallery item:', error);
      if (showNotification) {
        showNotification('Error adding gallery item', 'error');
      }
    }
  };

  // Handle edit item
  const handleEditItem = async () => {
    if (!formData.name.trim() || !formData.imageUrl.trim()) {
      if (showNotification) {
        showNotification('Name and Image URL are required', 'error');
      }
      return;
    }

    try {
      const updatedItem = {
        name: formData.name.trim(),
        imageUrl: formData.imageUrl.trim(),
        alt: formData.alt.trim() || formData.name.trim(),
        caption: formData.caption.trim() || '',
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.category.trim() || null,
        order: parseInt(formData.order) || 0,
        isActive: formData.isActive !== false,
      };

      await api.updateGalleryItem(selectedItem._id || selectedItem.id, updatedItem);

      setShowEditModal(false);
      setSelectedItem(null);
      setFormData({
        name: '',
        imageUrl: '',
        alt: '',
        caption: '',
        price: '',
        category: '',
        order: 0,
        isActive: true,
      });

      await loadGalleryItems();

      if (showNotification) {
        showNotification('Gallery item updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating gallery item:', error);
      if (showNotification) {
        showNotification('Error updating gallery item', 'error');
      }
    }
  };

  // Handle delete item
  const handleDeleteItem = async () => {
    try {
      await api.deleteGalleryItem(selectedItem._id || selectedItem.id);

      setShowDeleteModal(false);
      setSelectedItem(null);
      await loadGalleryItems();

      if (showNotification) {
        showNotification('Gallery item deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      if (showNotification) {
        showNotification('Error deleting gallery item', 'error');
      }
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (item) => {
    try {
      const updatedItem = { ...item, isActive: !item.isActive };
      await api.updateGalleryItem(item._id || item.id, { isActive: updatedItem.isActive });
      await loadGalleryItems();

      if (showNotification) {
        showNotification(`Item ${updatedItem.isActive ? 'activated' : 'deactivated'}`, 'success');
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
      if (showNotification) {
        showNotification('Error updating item', 'error');
      }
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      imageUrl: item.imageUrl || '',
      alt: item.alt || '',
      caption: item.caption || '',
      price: item.price || '',
      category: item.category || '',
      order: item.order || 0,
      isActive: item.isActive !== false,
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  if (loading || loadingGallery) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Gallery Management</h2>
        </div>
        <PremiumLoader message='Loading gallery items...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* HEADER */}
      <div className='dashboard-header'>
        <div>
          <h2>Gallery Management</h2>
          <p>Manage gallery items displayed on the website</p>
        </div>
        <div className='action-buttons-group'>
          <button className='btn btn-primary btn-small' onClick={() => setShowAddModal(true)}>
            <i className='fa-solid fa-plus'></i> Add Gallery Item
          </button>
        </div>
      </div>

      {/* FILTER & ACTION BAR */}
      <div className='dashboard-card dashboard-card-spaced'>
        <div className='filter-container'>
          <div className='search-input-wrapper search-input-wrapper-flex'>
            <i className='fa-solid fa-search search-input-icon'></i>
            <input
              type='text'
              className='input-field search-input-with-icon'
              placeholder='Search gallery items...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {categories.length > 0 && (
            <div className='filter-field-group-standard min-width-140'>
              <label className='filter-label-standard'>Category</label>
              <select
                className='input-field filter-input-standard'
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value=''>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className='filter-field-group-standard min-width-160'>
            <label className='filter-label-standard'>Sort By</label>
            <select
              className='input-field filter-input-standard'
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
              }}
            >
              <option value='order-asc'>Order (Low-High)</option>
              <option value='order-desc'>Order (High-Low)</option>
              <option value='name-asc'>Name (A-Z)</option>
              <option value='name-desc'>Name (Z-A)</option>
              <option value='price-asc'>Price (Low-High)</option>
              <option value='price-desc'>Price (High-Low)</option>
              <option value='category-asc'>Category (A-Z)</option>
              <option value='category-desc'>Category (Z-A)</option>
            </select>
          </div>
          {(searchQuery || filterCategory) && (
            <button
              className='btn btn-ghost btn-small'
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('');
              }}
              style={{ fontSize: '13px', padding: '10px 16px' }}
            >
              <i className='fa-solid fa-xmark' style={{ marginRight: '6px' }}></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* GALLERY ITEMS GRID */}
      {filteredGalleryItems.length === 0 ? (
        <div className='dashboard-card' style={{ textAlign: 'center', padding: '48px' }}>
          <i
            className='fa-solid fa-images'
            style={{ fontSize: '64px', color: 'var(--admin-text-light)', marginBottom: '16px' }}
          ></i>
          <h3 style={{ color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>
            No Gallery Items
          </h3>
          <p className='margin-bottom-24' style={{ color: 'var(--admin-text-light)' }}>
            {searchQuery || filterCategory
              ? 'No items match your filters'
              : 'Get started by adding your first gallery item'}
          </p>
          {!searchQuery && !filterCategory && (
            <button className='btn btn-primary' onClick={() => setShowAddModal(true)}>
              <i className='fa-solid fa-plus'></i> Add Gallery Item
            </button>
          )}
        </div>
      ) : (
        <div
          className='dashboard-grid-layout'
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}
        >
          {filteredGalleryItems.map((item) => (
            <div
              key={item._id || item.id}
              className='dashboard-card'
              style={{ position: 'relative' }}
            >
              {/* Image Preview */}
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  background: 'var(--admin-glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.alt || item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: item.imageUrl ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    color: 'var(--admin-text-light)',
                  }}
                >
                  <i className='fa-solid fa-image' style={{ fontSize: '48px' }}></i>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '4px', fontSize: '18px', fontWeight: '600' }}>
                    {item.name}
                  </h3>
                  {item.category && (
                    <div
                      className='badge'
                      style={{
                        background: 'var(--admin-accent-light)',
                        color: 'var(--admin-accent)',
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                      }}
                    >
                      {item.category}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn btn-ghost btn-icon`}
                    onClick={() => handleToggleActive(item)}
                    title={item.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <i className={`fa-solid ${item.isActive ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                </div>
              </div>

              {item.caption && (
                <p
                  style={{
                    color: 'var(--admin-text-secondary)',
                    fontSize: '14px',
                    marginBottom: '8px',
                    lineHeight: '1.4',
                  }}
                >
                  {item.caption}
                </p>
              )}

              {item.price && (
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--admin-accent)',
                    marginBottom: '12px',
                  }}
                >
                  ₹{item.price}
                </div>
              )}

              {item.order !== undefined && (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--admin-text-light)',
                    marginBottom: '12px',
                  }}
                >
                  Order: {item.order}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className='btn btn-secondary btn-small' onClick={() => openEditModal(item)}>
                  <i className='fa-solid fa-edit'></i> Edit
                </button>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => openDeleteModal(item)}
                  style={{ color: 'var(--admin-danger)' }}
                >
                  <i className='fa-solid fa-trash'></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <ConfirmModal
          show={showAddModal}
          title='Add Gallery Item'
          onClose={() => {
            setShowAddModal(false);
            setFormData({
              name: '',
              imageUrl: '',
              alt: '',
              caption: '',
              price: '',
              category: '',
              order: 0,
              isActive: true,
            });
          }}
          onConfirm={handleAddItem}
          confirmText='Add Item'
          cancelText='Cancel'
          type='info'
        >
          <div style={{ padding: '24px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Name *
              </label>
              <input
                type='text'
                className='input-field'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Item name'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Image URL *
              </label>
              <input
                type='url'
                className='input-field'
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder='https://example.com/image.jpg'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Alt Text
              </label>
              <input
                type='text'
                className='input-field'
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder='Image alt text (defaults to name)'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Caption
              </label>
              <input
                type='text'
                className='input-field'
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder='Display caption'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Price (₹)
              </label>
              <input
                type='number'
                className='input-field'
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder='Optional price'
                min='0'
                step='0.01'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Category
              </label>
              <input
                type='text'
                className='input-field'
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder='Optional category'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Order
              </label>
              <input
                type='number'
                className='input-field'
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder='Display order'
                min='0'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Active (visible on website)</span>
              </label>
            </div>
          </div>
        </ConfirmModal>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <ConfirmModal
          show={showEditModal}
          title='Edit Gallery Item'
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
            setFormData({
              name: '',
              imageUrl: '',
              alt: '',
              caption: '',
              price: '',
              category: '',
              order: 0,
              isActive: true,
            });
          }}
          onConfirm={handleEditItem}
          confirmText='Update Item'
          cancelText='Cancel'
          type='info'
        >
          <div style={{ padding: '24px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Name *
              </label>
              <input
                type='text'
                className='input-field'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Item name'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Image URL *
              </label>
              <input
                type='url'
                className='input-field'
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder='https://example.com/image.jpg'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Alt Text
              </label>
              <input
                type='text'
                className='input-field'
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder='Image alt text'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Caption
              </label>
              <input
                type='text'
                className='input-field'
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder='Display caption'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Price (₹)
              </label>
              <input
                type='number'
                className='input-field'
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder='Optional price'
                min='0'
                step='0.01'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Category
              </label>
              <input
                type='text'
                className='input-field'
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder='Optional category'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Order
              </label>
              <input
                type='number'
                className='input-field'
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder='Display order'
                min='0'
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span>Active (visible on website)</span>
              </label>
            </div>
          </div>
        </ConfirmModal>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <ConfirmModal
          show={showDeleteModal}
          title='Delete Gallery Item'
          message={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          onConfirm={handleDeleteItem}
          confirmText='Delete'
          cancelText='Cancel'
          type='danger'
        />
      )}
    </div>
  );
};

export default GalleryTab;
