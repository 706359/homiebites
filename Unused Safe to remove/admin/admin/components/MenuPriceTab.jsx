// Tab: Menu & Price Management
// Allows managing menu items, categories, and pricing

import { useEffect, useMemo, useState } from 'react';
import ConfirmModal from '../ConfirmModal.jsx';
import api from '../lib/api.js';
import { formatCurrency } from '../utils/orderUtils.js';
import PremiumLoader from './PremiumLoader.jsx';

const MenuPriceTab = ({ settings, showNotification, showConfirmation, loading = false }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]); // Store original category structure
  const [categories, setCategories] = useState(['Lunch', 'Dinner', 'Snacks', 'Beverages']);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'category'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Lunch',
    price: 0,
    isAvailable: true,
    imageUrl: '',
  });

  // Load menu items
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoadingMenu(true);
    try {
      // Load menu categories from backend
      const response = await api.getMenu();

      if (response.success && response.data && Array.isArray(response.data)) {
        // Store original categories structure for preserving metadata
        setOriginalCategories(response.data);

        // Flatten categories into individual items with category info
        const flattenedItems = [];
        response.data.forEach((category) => {
          if (category.items && Array.isArray(category.items)) {
            category.items.forEach((item) => {
              flattenedItems.push({
                ...item,
                category: category.category || item.category || 'Lunch',
                categoryId: category.id,
                categoryIcon: category.icon,
                categoryTag: category.tag,
                categoryDescription: category.description,
              });
            });
          }
        });

        setMenuItems(flattenedItems);

        // Extract unique categories for dropdown
        const uniqueCategories = [...new Set(flattenedItems.map((item) => item.category))];
        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
        }
      } else {
        console.warn('[Menu Load] Invalid response structure:', response);
        setMenuItems([]);
        setOriginalCategories([]);
      }
    } catch (error) {
      console.error('[Menu Load] Error loading menu items:', error);
      setMenuItems([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  // Convert flat items array back to categories structure for saving
  const convertItemsToCategories = (items) => {
    const categoriesMap = {};

    // First, preserve original category structure
    originalCategories.forEach((originalCategory) => {
      const categoryName = originalCategory.category;
      if (categoryName) {
        categoriesMap[categoryName] = {
          id: originalCategory.id,
          category: originalCategory.category,
          icon: originalCategory.icon,
          tag: originalCategory.tag,
          description: originalCategory.description,
          items: [],
        };
      }
    });

    // Then, add items to their categories
    items.forEach((item) => {
      const categoryName = item.category || 'Lunch';
      if (!categoriesMap[categoryName]) {
        // Create new category if it doesn't exist
        categoriesMap[categoryName] = {
          id: item.categoryId || Date.now(),
          category: categoryName,
          icon: item.categoryIcon,
          tag: item.categoryTag,
          description: item.categoryDescription || '',
          items: [],
        };
      }

      // Remove category metadata before adding to items array
      const { category, categoryId, categoryIcon, categoryTag, categoryDescription, ...itemData } =
        item;
      categoriesMap[categoryName].items.push(itemData);
    });

    return Object.values(categoriesMap);
  };

  // Sync menu items with images to gallery
  const syncMenuItemsToGallery = async (items) => {
    try {
      // Get current gallery items
      let galleryResponse;
      try {
        galleryResponse = await api.getGallery();
      } catch (error) {
        console.error('[Gallery Sync] Error fetching gallery:', error);
        throw new Error('Failed to fetch gallery: ' + (error.message || 'Unknown error'));
      }

      const existingGalleryItems =
        galleryResponse.success && galleryResponse.data ? galleryResponse.data : [];

      // Filter menu items that have imageUrl and price
      const itemsToSync = items.filter((item) => {
        const hasImage = item.imageUrl && item.imageUrl.trim() !== '';
        const hasPrice = item.price && item.price > 0;
        return hasImage && hasPrice;
      });

      // Create/update gallery items for each menu item
      let created = 0;
      let updated = 0;

      for (const item of itemsToSync) {
        const galleryItemData = {
          name: item.name,
          imageUrl: item.imageUrl,
          alt: item.name,
          caption: item.price ? `${item.name} - ₹${item.price}` : item.name,
          price: item.price,
          category: item.category,
          order: item.order || 0,
          isActive: item.isAvailable !== false,
        };

        // Check if gallery item already exists (by name and category)
        const existingItem = existingGalleryItems.find(
          (gi) => gi.name === item.name && gi.category === item.category
        );

        if (existingItem) {
          // Update existing gallery item
          try {
            const updateResponse = await api.updateGalleryItem(
              existingItem._id || existingItem.id,
              galleryItemData
            );
            updated++;
          } catch (error) {
            console.error('[Gallery Sync] Error updating gallery item', item.name, ':', error);
            throw error;
          }
        } else {
          // Create new gallery item
          try {
            const createResponse = await api.createGalleryItem(galleryItemData);
            created++;
          } catch (error) {
            console.error('[Gallery Sync] Error creating gallery item', item.name, ':', error);
            throw error;
          }
        }
      }

      // Deactivate gallery items that are no longer in menu or don't have images/prices
      const menuItemKeys = new Set(itemsToSync.map((item) => `${item.name}-${item.category}`));

      let deactivated = 0;
      for (const galleryItem of existingGalleryItems) {
        const key = `${galleryItem.name}-${galleryItem.category}`;
        if (!menuItemKeys.has(key) && galleryItem.isActive) {
          await api.updateGalleryItem(galleryItem._id || galleryItem.id, { isActive: false });
          deactivated++;
        }
      }

      // Sync complete

      if (showNotification) {
        showNotification(
          `Gallery synced: ${created} created, ${updated} updated${deactivated > 0 ? `, ${deactivated} deactivated` : ''}`,
          'success'
        );
      }
    } catch (error) {
      console.error('[Gallery Sync] Error syncing menu items to gallery:', error);
      if (showNotification) {
        showNotification(
          'Error syncing to gallery: ' + (error.message || 'Unknown error'),
          'error'
        );
      }
      // Don't throw error - gallery sync is optional, but log it
    }
  };

  // Save menu items to backend
  const saveMenuItemsToBackend = async (items) => {
    try {
      const categories = convertItemsToCategories(items);

      const response = await api.updateMenu(categories);

      if (response && response.success) {
        // Sync menu items with images to gallery
        await syncMenuItemsToGallery(items);

        // Reload menu items after saving to get updated data
        await loadMenuItems();
        return true;
      } else {
        const errorMsg = response?.error || 'Failed to save menu';
        console.error('[Menu Save] Backend returned error:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('[Menu Save] Error saving menu to backend:', error);
      console.error('[Menu Save] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      if (showNotification) {
        showNotification('Error saving menu: ' + (error.message || 'Unknown error'), 'error');
      }
      throw error;
    }
  };

  // Filtered and sorted menu items
  const filteredMenuItems = useMemo(() => {
    let filtered = [...menuItems];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
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
  }, [menuItems, searchQuery, filterCategory, sortBy, sortOrder]);

  // Handle add item
  const handleAddItem = async () => {
    if (!formData.name.trim() || !formData.price || formData.price <= 0) {
      if (showNotification) {
        showNotification('Please fill in all required fields', 'error');
      }
      return;
    }

    const performAdd = async () => {
      try {
        const newItem = {
          id: Date.now(),
          name: formData.name.trim(),
          description: formData.description || '',
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || '',
          isAvailable: formData.isAvailable !== false,
          category: formData.category || 'Lunch',
        };

        const updatedItems = [...menuItems, newItem];
        setMenuItems(updatedItems);

        // Save to backend
        await saveMenuItemsToBackend(updatedItems);

        setShowAddModal(false);
        setFormData({
          name: '',
          description: '',
          category: 'Lunch',
          price: 0,
          isAvailable: true,
          imageUrl: '',
        });

        if (showNotification) {
          showNotification('Menu item added successfully', 'success');
        }
      } catch (error) {
        console.error('Error adding menu item:', error);
        if (showNotification) {
          showNotification('Error adding menu item', 'error');
        }
      }
    };

    if (showConfirmation) {
      showConfirmation({
        title: 'Add Menu Item',
        message: `Are you sure you want to add "${formData.name.trim()}" to the menu?`,
        type: 'info',
        confirmText: 'Add Item',
        onConfirm: performAdd,
      });
    } else {
      await performAdd();
    }
  };

  // Handle edit item
  const handleEditItem = async () => {
    if (!formData.name.trim() || !formData.price || formData.price <= 0) {
      if (showNotification) {
        showNotification('Please fill in all required fields', 'error');
      }
      return;
    }

    const performUpdate = async () => {
      try {
        const updatedItem = {
          ...selectedItem,
          name: formData.name.trim(),
          description: formData.description || '',
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || '',
          isAvailable: formData.isAvailable !== false,
          category: formData.category || selectedItem.category || 'Lunch',
        };

        const updatedItems = menuItems.map((item) =>
          item.id === selectedItem.id ? updatedItem : item
        );
        setMenuItems(updatedItems);

        // Save to backend
        await saveMenuItemsToBackend(updatedItems);

        setShowEditModal(false);
        setSelectedItem(null);
        setFormData({
          name: '',
          description: '',
          category: 'Lunch',
          price: 0,
          isAvailable: true,
          imageUrl: '',
        });

        if (showNotification) {
          showNotification('Menu item updated successfully', 'success');
        }
      } catch (error) {
        console.error('Error updating menu item:', error);
        if (showNotification) {
          showNotification('Error updating menu item', 'error');
        }
      }
    };

    if (showConfirmation) {
      showConfirmation({
        title: 'Update Menu Item',
        message: `Are you sure you want to save changes to "${formData.name.trim()}"?`,
        type: 'info',
        confirmText: 'Save Changes',
        onConfirm: performUpdate,
      });
    } else {
      await performUpdate();
    }
  };

  // Handle delete item
  const handleDeleteItem = async () => {
    try {
      const updatedItems = menuItems.filter((item) => item.id !== selectedItem.id);
      setMenuItems(updatedItems);

      // Save to backend
      await saveMenuItemsToBackend(updatedItems);

      setShowDeleteModal(false);
      setSelectedItem(null);

      if (showNotification) {
        showNotification('Menu item deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      if (showNotification) {
        showNotification('Error deleting menu item', 'error');
      }
    }
  };

  // Handle toggle availability
  const handleToggleAvailability = async (item) => {
    try {
      const updatedItem = { ...item, isAvailable: !item.isAvailable };
      const updatedItems = menuItems.map((i) => (i.id === item.id ? updatedItem : i));
      setMenuItems(updatedItems);

      // Save to backend
      await saveMenuItemsToBackend(updatedItems);

      if (showNotification) {
        showNotification(`Item ${updatedItem.isAvailable ? 'enabled' : 'disabled'}`, 'success');
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
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
      description: item.description || '',
      category: item.category || 'Lunch',
      price: item.price || 0,
      isAvailable: item.isAvailable !== false,
      imageUrl: item.imageUrl || '',
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  if (loading || loadingMenu) {
    return (
      <div className='admin-content'>
        <PremiumLoader message='Loading menu...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* HEADER */}
      <div className='dashboard-header'>
        <div className='action-buttons-group'>
          <button className='btn btn-primary btn-small' onClick={() => setShowAddModal(true)}>
            <i className='fa-solid fa-plus'></i> Add Menu Item
          </button>
          <button
            className='btn btn-secondary btn-small'
            onClick={async () => {
              try {
                if (showNotification) {
                  showNotification('Syncing menu items to gallery...', 'info');
                }
                await syncMenuItemsToGallery(menuItems);
              } catch (error) {
                console.error('Manual sync error:', error);
                if (showNotification) {
                  showNotification('Error syncing to gallery: ' + error.message, 'error');
                }
              }
            }}
            title='Sync all menu items with images to gallery'
          >
            <i className='fa-solid fa-sync'></i> Sync to Gallery
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
              placeholder='Search menu items...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
              <option value='name-asc'>Name (A-Z)</option>
              <option value='name-desc'>Name (Z-A)</option>
              <option value='price-asc'>Price (Low to High)</option>
              <option value='price-desc'>Price (High to Low)</option>
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

      {/* MENU ITEMS GRID */}
      {filteredMenuItems.length === 0 ? (
        <div className='dashboard-card' style={{ textAlign: 'center', padding: '48px' }}>
          <i
            className='fa-solid fa-utensils'
            style={{ fontSize: '64px', color: 'var(--admin-text-light)', marginBottom: '16px' }}
          ></i>
          <h3 style={{ color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>
            No Menu Items
          </h3>
          <p className='margin-bottom-24' style={{ color: 'var(--admin-text-light)' }}>
            {searchQuery || filterCategory
              ? 'No items match your filters'
              : 'Get started by adding your first menu item'}
          </p>
          {!searchQuery && !filterCategory && (
            <button className='btn btn-primary' onClick={() => setShowAddModal(true)}>
              <i className='fa-solid fa-plus'></i> Add Menu Item
            </button>
          )}
        </div>
      ) : (
        <div className='dashboard-grid-layout menu-items-grid'>
          {filteredMenuItems.map((item, index) => (
            <div
              key={item.id}
              className='dashboard-card menu-item-card'
              style={{ position: 'relative', animationDelay: `${index * 0.05}s` }}
            >
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
                  <div
                    className='badge'
                    style={{
                      background:
                        item.category === 'Lunch'
                          ? 'var(--admin-accent-light)'
                          : item.category === 'Dinner'
                            ? 'var(--admin-secondary-light)'
                            : 'var(--admin-glass-border)',
                      color:
                        item.category === 'Lunch'
                          ? 'var(--admin-accent)'
                          : item.category === 'Dinner'
                            ? 'var(--admin-secondary)'
                            : 'var(--admin-text-secondary)',
                      fontSize: '12px',
                      padding: '4px 8px',
                    }}
                  >
                    {item.category}
                  </div>
                </div>
                <div
                  className='badge'
                  style={{
                    background: item.isAvailable
                      ? 'var(--admin-success-light)'
                      : 'var(--admin-danger-light)',
                    color: item.isAvailable ? 'var(--admin-success)' : 'var(--admin-danger)',
                    fontSize: '11px',
                    padding: '4px 8px',
                  }}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>

              {item.description && (
                <p
                  style={{
                    color: 'var(--admin-text-secondary)',
                    fontSize: '14px',
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}
                >
                  {item.description}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--admin-border)',
                }}
              >
                <div>
                  <div
                    style={{ fontSize: '24px', fontWeight: '700', color: 'var(--admin-accent)' }}
                  >
                    {formatCurrency(item.price || 0)}
                  </div>
                </div>
                <div className='action-buttons-group' style={{ gap: '8px' }}>
                  <button
                    className='btn btn-ghost btn-small'
                    onClick={() => handleToggleAvailability(item)}
                    title={item.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                  >
                    <i className={`fa-solid ${item.isAvailable ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <button
                    className='btn btn-secondary btn-small'
                    onClick={() => openEditModal(item)}
                    title='Edit'
                  >
                    <i className='fa-solid fa-edit'></i>
                  </button>
                  <button
                    className='btn btn-danger btn-small'
                    onClick={() => openDeleteModal(item)}
                    title='Delete'
                  >
                    <i className='fa-solid fa-trash'></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className='modal-overlay' onClick={() => setShowAddModal(false)}>
          <div
            className='modal-container'
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <div className='modal-header'>
              <h2>Add Menu Item</h2>
              <button className='modal-close' onClick={() => setShowAddModal(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-grid'>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Item Name *</label>
                  <input
                    type='text'
                    className='input-field'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder='e.g., Lunch Combo'
                    required
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea
                    className='input-field'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder='Item description...'
                    rows={3}
                  />
                </div>
                <div className='form-group'>
                  <label>Category *</label>
                  <select
                    className='input-field'
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label>Price (₹) *</label>
                  <input
                    type='number'
                    className='input-field'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder='0.00'
                    min='0'
                    step='0.01'
                    required
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Image URL</label>
                  <input
                    type='url'
                    className='input-field'
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder='https://example.com/image.jpg'
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <input
                      type='checkbox'
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    />
                    <span>Available for ordering</span>
                  </label>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-ghost' onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className='btn btn-primary' onClick={handleAddItem}>
                <i className='fa-solid fa-plus'></i> Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedItem && (
        <div className='modal-overlay' onClick={() => setShowEditModal(false)}>
          <div
            className='modal-container'
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <div className='modal-header'>
              <h2>Edit Menu Item</h2>
              <button className='modal-close' onClick={() => setShowEditModal(false)}>
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-grid'>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Item Name *</label>
                  <input
                    type='text'
                    className='input-field'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder='e.g., Lunch Combo'
                    required
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea
                    className='input-field'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder='Item description...'
                    rows={3}
                  />
                </div>
                <div className='form-group'>
                  <label>Category *</label>
                  <select
                    className='input-field'
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label>Price (₹) *</label>
                  <input
                    type='number'
                    className='input-field'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder='0.00'
                    min='0'
                    step='0.01'
                    required
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label>Image URL</label>
                  <input
                    type='url'
                    className='input-field'
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder='https://example.com/image.jpg'
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <label
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <input
                      type='checkbox'
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    />
                    <span>Available for ordering</span>
                  </label>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-ghost' onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className='btn btn-primary' onClick={handleEditItem}>
                <i className='fa-solid fa-save'></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedItem && (
        <ConfirmModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteItem}
          title='Delete Menu Item'
          message={`Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`}
          confirmText='Delete'
          confirmType='danger'
        />
      )}
    </div>
  );
};

export default MenuPriceTab;
