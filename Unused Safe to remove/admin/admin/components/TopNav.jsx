'use client';

import { useEffect, useRef, useState } from 'react';

const TopNav = ({
  sidebarOpen,
  setSidebarOpen,
  unreadNotifications,
  currentUser,
  onLogout,
  setActiveTab,
  tabTitle,
  tabSubtitle,
  tabAction,
  onNewOrder,
  onRefresh,
}) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const profileDropdownRef = useRef(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Search shortcut (Ctrl+K / Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }

      // New Order shortcut (Ctrl+N / Cmd+N)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (onNewOrder) {
          onNewOrder();
        }
      }

      // Close search modal with Escape
      if (e.key === 'Escape' && showSearchModal) {
        setShowSearchModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal, onNewOrder]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfileDropdown]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('homiebites_recent_searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) return;

    // Add to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('homiebites_recent_searches', JSON.stringify(updated));

    // Navigate based on search
    if (query.toLowerCase().includes('order')) {
      setActiveTab('allOrdersData');
    } else if (query.toLowerCase().includes('customer')) {
      setActiveTab('customers');
    } else if (query.toLowerCase().includes('payment') || query.toLowerCase().includes('pending')) {
      setActiveTab('pendingAmounts');
    } else if (query.toLowerCase().includes('report')) {
      setActiveTab('reports');
    } else {
      setActiveTab('allOrdersData');
    }

    setShowSearchModal(false);
    setSearchQuery('');
  };

  const handleRefresh = () => {
    if (!onRefresh || refreshing) return;

    // Set refreshing state immediately for visual feedback
    setRefreshing(true);
    const startTime = Date.now();

    // Run refresh silently in background without blocking
    (async () => {
      try {
        // Call the refresh function (non-blocking)
        if (typeof onRefresh === 'function') {
          // Don't await - let it run in background
          const refreshResult = onRefresh();
          // Only call .catch() if it returns a Promise
          if (refreshResult && typeof refreshResult.catch === 'function') {
            refreshResult.catch((err) => {
              console.error('Error refreshing data:', err);
            });
          }
        }

        // Ensure loader shows for at least 2 seconds
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsed);
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setRefreshing(false);
      }
    })();
  };

  const quickActions = [
    {
      label: 'Add new order',
      icon: 'fa-plus',
      action: () => setActiveTab('currentMonthOrders'),
    },
    {
      label: 'Generate report',
      icon: 'fa-file-alt',
      action: () => setActiveTab('reports'),
    },
    {
      label: 'View analytics',
      icon: 'fa-chart-line',
      action: () => setActiveTab('analytics'),
    },
    {
      label: 'Pending payments',
      icon: 'fa-exclamation-triangle',
      action: () => setActiveTab('pendingAmounts'),
    },
  ];

  return (
    <>
      <div className='admin-top-nav'>
        <div className='top-nav-left'>
          <button
            className='top-nav-toggle'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label='Toggle sidebar'
          >
            <i className='fa-solid fa-bars'></i>
          </button>
          {tabTitle ? (
            <div className='top-nav-tab-info'>
              <h1 className='top-nav-title'>{tabTitle}</h1>
              {tabSubtitle && <p className='top-nav-subtitle'>{tabSubtitle}</p>}
            </div>
          ) : (
            <h1 className='top-nav-title'>Admin Dashboard</h1>
          )}
        </div>
        <div className='top-nav-center'>
          {tabAction && <div className='top-nav-action'>{tabAction}</div>}
        </div>
        <div
          className='top-nav-right'
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          {onRefresh && (
            <button
              className='top-nav-search-btn'
              onClick={handleRefresh}
              title={refreshing ? 'Refreshing...' : 'Refresh Data'}
              aria-label={refreshing ? 'Refreshing Data' : 'Refresh Data'}
              disabled={refreshing}
              style={{
                opacity: refreshing ? 0.7 : 1,
                cursor: refreshing ? 'wait' : 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {refreshing ? (
                <i className='fa-solid fa-spinner fa-spin' style={{ display: 'inline-block' }}></i>
              ) : (
                <i className='fa-solid fa-rotate' style={{ display: 'inline-block' }}></i>
              )}
            </button>
          )}
          {onNewOrder && (
            <button
              className='top-nav-search-btn'
              onClick={() => onNewOrder()}
              title='Add New Order (Ctrl+N)'
              aria-label='Add New Order'
            >
              <i className='fa-solid fa-plus'></i>
              <span className='top-nav-search-shortcut'>Ctrl+N</span>
            </button>
          )}
          <button
            className='top-nav-search-btn'
            onClick={() => setShowSearchModal(true)}
            title='Search (Ctrl+K or Cmd+K)'
            aria-label='Search'
          >
            <i className='fa-solid fa-search'></i>
            <span className='top-nav-search-shortcut'>Ctrl+K</span>
          </button>
          <button
            className='top-nav-notification-btn'
            onClick={() => setActiveTab('notifications')}
            title={`Notifications${unreadNotifications > 0 ? ` (${unreadNotifications} unread)` : ''}`}
            aria-label='Notifications'
          >
            <i className='fa-solid fa-bell'></i>
            {unreadNotifications > 0 && (
              <span className='top-nav-badge'>
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
          </button>
          <button
            className='top-nav-notification-btn'
            onClick={() => {
              // Dispatch event to show help center
              window.dispatchEvent(new CustomEvent('showHelpCenter'));
            }}
            title='Help Center (Ctrl+H)'
            aria-label='Help Center'
          >
            <i className='fa-solid fa-question-circle'></i>
          </button>
        </div>
      </div>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className='modal-overlay' onClick={() => setShowSearchModal(false)}>
          <div className='modal-container global-search-modal' onClick={(e) => e.stopPropagation()}>
            <div className='global-search-header'>
              <div className='global-search-input-wrapper'>
                <i className='fa-solid fa-search global-search-icon'></i>
                <input
                  type='text'
                  placeholder='Search everywhere...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  autoFocus
                  className='global-search-input'
                />
              </div>
              <button
                className='modal-close global-search-close'
                onClick={() => setShowSearchModal(false)}
                aria-label='Close search'
              >
                <i className='fa-solid fa-times'></i>
              </button>
            </div>
            <div className='global-search-content'>
              {recentSearches.length > 0 && (
                <div className='global-search-section'>
                  <h4>Recent Searches</h4>
                  <div className='global-search-list'>
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        className='global-search-item'
                        onClick={() => handleSearch(search)}
                      >
                        <i className='fa-solid fa-clock-rotate-left'></i>
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className='global-search-section'>
                <h4>Quick Actions</h4>
                <div className='global-search-list'>
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      className='global-search-item'
                      onClick={() => {
                        action.action();
                        setShowSearchModal(false);
                      }}
                    >
                      <i className={`fa-solid ${action.icon}`}></i>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
