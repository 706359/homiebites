import { useEffect, useMemo, useState } from 'react';

const MenuTab = ({ menuData, updateCategory, updateItem, addItem, removeItem }) => {
  const [editingItemId, setEditingItemId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(12);

  // Flatten menu items with category info for table display
  const allMenuItems = useMemo(() => {
    const items = [];
    menuData.forEach((category) => {
      category.items.forEach((item) => {
        items.push({
          ...item,
          categoryId: category.id,
          categoryName: category.category || 'Uncategorized',
          categoryIcon: category.icon,
        });
      });
    });
    return items;
  }, [menuData]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    menuData.forEach((category) => {
      categories.add(category.category || 'Uncategorized');
    });
    return Array.from(categories).sort();
  }, [menuData]);

  // Filter menu items
  const filteredMenuItems = useMemo(() => {
    let filtered = [...allMenuItems];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          (item.name || '').toLowerCase().includes(query) ||
          (item.categoryName || '').toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.categoryName === categoryFilter);
    }

    // Active filter
    if (activeFilter === 'active') {
      filtered = filtered.filter((item) => item.isActive !== false);
    } else if (activeFilter === 'inactive') {
      filtered = filtered.filter((item) => item.isActive === false);
    }

    return filtered;
  }, [allMenuItems, searchQuery, categoryFilter, activeFilter]);

  // Pagination
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredMenuItems.length / recordsPerPage));
  }, [filteredMenuItems.length, recordsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return filteredMenuItems.slice(startIndex, endIndex);
  }, [filteredMenuItems, currentPage, recordsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, activeFilter]);

  // Handle inline price edit
  const handlePriceChange = (categoryId, itemId, newPrice) => {
    updateItem(categoryId, itemId, 'price', parseFloat(newPrice) || 0);
  };

  // Handle active toggle
  const handleActiveToggle = (categoryId, itemId, currentActive) => {
    updateItem(categoryId, itemId, 'isActive', !currentActive);
  };

  // Handle delete with confirm
  const handleDeleteClick = (categoryId, itemId) => {
    setShowDeleteConfirm(`${categoryId}-${itemId}`);
  };

  const confirmDelete = (categoryId, itemId) => {
    removeItem(categoryId, itemId);
    setShowDeleteConfirm(null);
  };

  // Update category for item
  const handleCategoryChange = (categoryId, itemId, newCategory) => {
    // Update the category name of the parent category
    updateCategory(categoryId, 'category', newCategory);
  };

  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <div>
          <h2>Menu Management</h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--admin-text-light)',
              marginTop: '0.25rem',
            }}
          >
            Manage your menu items, categories, prices, and availability
          </p>
        </div>
        <div className='orders-actions'>
          <button
            className='btn btn-primary'
            onClick={() => {
              // Add item to first category or create new category
              if (menuData.length > 0) {
                addItem(menuData[0].id);
              }
            }}
          >
            <i className='fa-solid fa-plus'></i> Add Menu Item
          </button>
          <a href='/menu' target='_blank' rel='noopener noreferrer' className='btn btn-secondary'>
            <i className='fa-solid fa-external-link'></i> View Website Menu
          </a>
        </div>
      </div>

      {/* Filters */}
      {allMenuItems.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            padding: '1rem',
            background: 'var(--admin-glass-bg)',
            borderRadius: 'var(--admin-radius-lg)',
            border: '1px solid var(--admin-glass-border)',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Search Items
            </label>
            <input
              type='text'
              className='custom-dropdown'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by name or category...'
            />
          </div>
          <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Filter by Category
            </label>
            <select
              className='custom-dropdown'
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value=''>All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 150px', minWidth: '120px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Status
            </label>
            <select
              className='custom-dropdown'
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value='all'>All</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>
          {(searchQuery || categoryFilter || activeFilter !== 'all') && (
            <button
              className='btn btn-ghost btn-small'
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setActiveFilter('all');
              }}
              style={{ alignSelf: 'flex-end' }}
            >
              <i className='fa-solid fa-times'></i> Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {allMenuItems.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--admin-glass-bg)',
              borderRadius: 'var(--admin-radius-md)',
              border: '1px solid var(--admin-glass-border)',
              fontSize: '0.9rem',
            }}
          >
            <strong>Total Items:</strong> {allMenuItems.length}
          </div>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--admin-glass-bg)',
              borderRadius: 'var(--admin-radius-md)',
              border: '1px solid var(--admin-glass-border)',
              fontSize: '0.9rem',
            }}
          >
            <strong>Showing:</strong> {filteredMenuItems.length}
          </div>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--admin-success-light)',
              borderRadius: 'var(--admin-radius-md)',
              border: '1px solid var(--admin-success)',
              fontSize: '0.9rem',
              color: 'var(--admin-success-dark)',
            }}
          >
            <strong>Active:</strong> {allMenuItems.filter((item) => item.isActive !== false).length}
          </div>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--admin-warning-light)',
              borderRadius: 'var(--admin-radius-md)',
              border: '1px solid var(--admin-warning)',
              fontSize: '0.9rem',
              color: 'var(--admin-warning-dark)',
            }}
          >
            <strong>Inactive:</strong>{' '}
            {allMenuItems.filter((item) => item.isActive === false).length}
          </div>
        </div>
      )}

      {allMenuItems.length === 0 ? (
        <div className='no-data' style={{ padding: '2rem', marginTop: '2rem' }}>
          <i
            className='fa-solid fa-utensils'
            style={{ fontSize: '3rem', color: 'var(--admin-text-light)', marginBottom: '1rem' }}
          ></i>
          <p>No menu items yet. Click "Add Menu Item" to create one.</p>
        </div>
      ) : filteredMenuItems.length === 0 ? (
        <div className='no-data' style={{ padding: '2rem', marginTop: '2rem' }}>
          <i
            className='fa-solid fa-search'
            style={{ fontSize: '3rem', color: 'var(--admin-text-light)', marginBottom: '1rem' }}
          ></i>
          <p>No menu items match your filters.</p>
          <button
            className='btn btn-ghost'
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setActiveFilter('all');
            }}
            style={{ marginTop: '1rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            {paginatedItems.map((item) => {
              const itemKey = `${item.categoryId}-${item.id}`;
              const isDeleting = showDeleteConfirm === itemKey;

              return (
                <div
                  key={itemKey}
                  style={{
                    background:
                      item.isActive !== false ? 'var(--admin-card-bg)' : 'rgba(239, 68, 68, 0.05)',
                    border: `2px solid ${
                      item.isActive !== false ? 'var(--admin-border)' : 'rgba(239, 68, 68, 0.2)'
                    }`,
                    borderRadius: 'var(--admin-radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    position: 'relative',
                    opacity: item.isActive !== false ? 1 : 0.7,
                  }}
                >
                  {/* Status Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={item.isActive !== false}
                        onChange={() =>
                          handleActiveToggle(item.categoryId, item.id, item.isActive !== false)
                        }
                        style={{ cursor: 'pointer', transform: 'scale(1.1)' }}
                      />
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color:
                            item.isActive !== false
                              ? 'var(--admin-success)'
                              : 'var(--admin-text-light)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {item.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </div>

                  {/* Item Name */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--admin-text-light)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Item Name
                    </label>
                    <input
                      type='text'
                      value={item.name || ''}
                      onChange={(e) => updateItem(item.categoryId, item.id, 'name', e.target.value)}
                      className='custom-dropdown'
                      placeholder='Item name'
                      style={{
                        fontWeight: '600',
                      }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--admin-text-light)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Category
                    </label>
                    <select
                      value={item.categoryName}
                      onChange={(e) =>
                        handleCategoryChange(item.categoryId, item.id, e.target.value)
                      }
                      className='custom-dropdown'
                    >
                      {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--admin-text-light)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Price
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--admin-accent-light)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--admin-radius-md)',
                        border: '1px solid var(--admin-accent)',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: '700',
                          fontSize: '1.1rem',
                          color: 'var(--admin-accent)',
                        }}
                      >
                        ₹
                      </span>
                      <input
                        type='number'
                        value={item.price || 0}
                        onChange={(e) =>
                          handlePriceChange(item.categoryId, item.id, e.target.value)
                        }
                        className='custom-dropdown'
                        min='0'
                        step='0.01'
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: 'var(--admin-accent)',
                          textAlign: 'right',
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    {isDeleting ? (
                      <>
                        <button
                          className='btn btn-primary'
                          onClick={() => confirmDelete(item.categoryId, item.id)}
                          style={{ flex: 1 }}
                        >
                          <i className='fa-solid fa-check'></i> Confirm
                        </button>
                        <button
                          className='btn btn-ghost'
                          onClick={() => setShowDeleteConfirm(null)}
                          style={{ flex: 1 }}
                        >
                          <i className='fa-solid fa-times'></i> Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className='btn btn-special danger'
                        onClick={() => handleDeleteClick(item.categoryId, item.id)}
                        style={{ width: '100%' }}
                      >
                        <i className='fa-solid fa-trash'></i> Delete Item
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {filteredMenuItems.length > recordsPerPage && totalPages > 1 && (
            <div className='pagination-navigation' style={{ marginTop: '1.5rem' }}>
              <div className='pagination-info'>
                <label>Records per page:</label>
                <select
                  className='records-per-page-select'
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
                </select>
                <span>
                  Showing {(currentPage - 1) * recordsPerPage + 1} to{' '}
                  {Math.min(currentPage * recordsPerPage, filteredMenuItems.length)} of{' '}
                  {filteredMenuItems.length} items
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  title='First Page'
                >
                  <i className='fa-solid fa-angle-double-left'></i>
                </button>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  title='Previous Page'
                >
                  <i className='fa-solid fa-angle-left'></i>
                </button>
                <div className='page-numbers'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`btn btn-ghost btn-small ${
                            currentPage === pageNum ? 'active' : ''
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                      return (
                        <span key={pageNum} className='page-ellipsis'>
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title='Next Page'
                >
                  <i className='fa-solid fa-angle-right'></i>
                </button>
                <button
                  className='btn btn-ghost btn-small'
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  title='Last Page'
                >
                  <i className='fa-solid fa-angle-double-right'></i>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuTab;
