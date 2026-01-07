// Tab: Menu & Price Management
// Allows managing menu items, categories, and pricing

import { useState, useEffect, useMemo } from 'react';
import PremiumLoader from './PremiumLoader.jsx';
import { formatCurrency } from '../utils/orderUtils.js';
import ConfirmModal from '../ConfirmModal.jsx';
import api from '../lib/api.js';

const MenuPriceTab = ({
  settings,
  showNotification,
  loading = false,
}) => {
  const [menuItems, setMenuItems] = useState([]);
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
      const token = localStorage.getItem('homiebites_token');
      const response = await fetch(`${api.baseURL}/api/menu-items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.data || data || []);
      } else {
        // If API doesn't exist, use default items
        setMenuItems(getDefaultMenuItems());
      }
    } catch (error) {
      console.warn('Menu API not available, using default items:', error);
      setMenuItems(getDefaultMenuItems());
    } finally {
      setLoadingMenu(false);
    }
  };

  // Default menu items (fallback)
  const getDefaultMenuItems = () => {
    const stored = localStorage.getItem('homiebites_menu_items');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 1, name: 'Lunch Combo', description: 'Delicious lunch combo', category: 'Lunch', price: settings?.lunchPrice || 100, isAvailable: true },
      { id: 2, name: 'Dinner Special', description: 'Special dinner meal', category: 'Dinner', price: settings?.dinnerPrice || 100, isAvailable: true },
    ];
  };

  // Save menu items to localStorage (fallback)
  const saveMenuItems = (items) => {
    localStorage.setItem('homiebites_menu_items', JSON.stringify(items));
  };

  // Filtered and sorted menu items
  const filteredMenuItems = useMemo(() => {
    let filtered = [...menuItems];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter(item => item.category === filterCategory);
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

    try {
      const token = localStorage.getItem('homiebites_token');
      const newItem = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
      };

      // Try API first
      try {
        const response = await fetch(`${api.baseURL}/api/menu-items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(newItem),
        });

        if (response.ok) {
          const data = await response.json();
          setMenuItems([...menuItems, data.data || newItem]);
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const updatedItems = [...menuItems, newItem];
        setMenuItems(updatedItems);
        saveMenuItems(updatedItems);
      }

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

  // Handle edit item
  const handleEditItem = async () => {
    if (!formData.name.trim() || !formData.price || formData.price <= 0) {
      if (showNotification) {
        showNotification('Please fill in all required fields', 'error');
      }
      return;
    }

    try {
      const token = localStorage.getItem('homiebites_token');
      const updatedItem = {
        ...selectedItem,
        ...formData,
        price: parseFloat(formData.price),
      };

      // Try API first
      try {
        const response = await fetch(`${api.baseURL}/api/menu-items/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatedItem),
        });

        if (response.ok) {
          const data = await response.json();
          setMenuItems(menuItems.map(item => item.id === selectedItem.id ? (data.data || updatedItem) : item));
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const updatedItems = menuItems.map(item => item.id === selectedItem.id ? updatedItem : item);
        setMenuItems(updatedItems);
        saveMenuItems(updatedItems);
      }

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

  // Handle delete item
  const handleDeleteItem = async () => {
    try {
      const token = localStorage.getItem('homiebites_token');

      // Try API first
      try {
        const response = await fetch(`${api.baseURL}/api/menu-items/${selectedItem.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setMenuItems(menuItems.filter(item => item.id !== selectedItem.id));
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const updatedItems = menuItems.filter(item => item.id !== selectedItem.id);
        setMenuItems(updatedItems);
        saveMenuItems(updatedItems);
      }

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
      const token = localStorage.getItem('homiebites_token');
      const updatedItem = { ...item, isAvailable: !item.isAvailable };

      // Try API first
      try {
        const response = await fetch(`${api.baseURL}/api/menu-items/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatedItem),
        });

        if (response.ok) {
          const data = await response.json();
          setMenuItems(menuItems.map(i => i.id === item.id ? (data.data || updatedItem) : i));
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const updatedItems = menuItems.map(i => i.id === item.id ? updatedItem : i);
        setMenuItems(updatedItems);
        saveMenuItems(updatedItems);
      }

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
        <div className='dashboard-header'>
          <h2>Menu & Price</h2>
        </div>
        <PremiumLoader message="Loading menu..." size="large" />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* HEADER */}
      <div className='dashboard-header'>
        <div>
          <h2>Menu & Price</h2>
          <p>Manage your menu items, categories, and pricing</p>
        </div>
        <div className='action-buttons-group'>
          <button className='btn btn-primary btn-small' onClick={() => setShowAddModal(true)}>
            <i className='fa-solid fa-plus'></i> Add Menu Item
          </button>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className='action-bar'>
        <div className='search-input-wrapper'>
          <i className='fa-solid fa-search search-input-icon'></i>
          <input
            type='text'
            className='input-field search-input-with-icon'
            placeholder='Search menu items...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='action-buttons-group'>
          <select
            className='input-field'
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value=''>All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className='input-field'
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by);
              setSortOrder(order);
            }}
            style={{ minWidth: '150px' }}
          >
            <option value='name-asc'>Name (A-Z)</option>
            <option value='name-desc'>Name (Z-A)</option>
            <option value='price-asc'>Price (Low-High)</option>
            <option value='price-desc'>Price (High-Low)</option>
            <option value='category-asc'>Category (A-Z)</option>
            <option value='category-desc'>Category (Z-A)</option>
          </select>
        </div>
      </div>

      {/* MENU ITEMS GRID */}
      {filteredMenuItems.length === 0 ? (
        <div className='dashboard-card' style={{ textAlign: 'center', padding: '48px' }}>
          <i className='fa-solid fa-utensils' style={{ fontSize: '64px', color: 'var(--admin-text-light)', marginBottom: '16px' }}></i>
          <h3 style={{ color: 'var(--admin-text-secondary)', marginBottom: '8px' }}>No Menu Items</h3>
          <p style={{ color: 'var(--admin-text-light)', marginBottom: '24px' }}>
            {searchQuery || filterCategory ? 'No items match your filters' : 'Get started by adding your first menu item'}
          </p>
          {!searchQuery && !filterCategory && (
            <button className='btn btn-primary' onClick={() => setShowAddModal(true)}>
              <i className='fa-solid fa-plus'></i> Add Menu Item
            </button>
          )}
        </div>
      ) : (
        <div className='dashboard-grid-layout' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredMenuItems.map((item) => (
            <div key={item.id} className='dashboard-card' style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '4px', fontSize: '18px', fontWeight: '600' }}>{item.name}</h3>
                  <div className='badge' style={{ 
                    background: item.category === 'Lunch' ? 'var(--admin-accent-light)' : 
                               item.category === 'Dinner' ? 'var(--admin-secondary-light)' : 
                               'var(--admin-glass-border)',
                    color: item.category === 'Lunch' ? 'var(--admin-accent)' : 
                           item.category === 'Dinner' ? 'var(--admin-secondary)' : 
                           'var(--admin-text-secondary)',
                    fontSize: '12px',
                    padding: '4px 8px',
                  }}>
                    {item.category}
                  </div>
                </div>
                <div className='badge' style={{
                  background: item.isAvailable ? 'var(--admin-success-light)' : 'var(--admin-danger-light)',
                  color: item.isAvailable ? 'var(--admin-success)' : 'var(--admin-danger)',
                  fontSize: '11px',
                  padding: '4px 8px',
                }}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>

              {item.description && (
                <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', marginBottom: '12px', lineHeight: '1.5' }}>
                  {item.description}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--admin-border)' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--admin-accent)' }}>
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
          <div className='modal-container' onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
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
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label>Price (₹) *</label>
                  <input
                    type='number'
                    className='input-field'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
          <div className='modal-container' onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
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
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label>Price (₹) *</label>
                  <input
                    type='number'
                    className='input-field'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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

