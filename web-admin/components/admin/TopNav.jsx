'use client';

import { useEffect, useRef, useState } from 'react';

const TopNav = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (onNewOrder) {
          onNewOrder();
        }
      }

      if (e.key === 'Escape' && showSearchModal) {
        setShowSearchModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal, onNewOrder]);

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

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('homiebites_recent_searches', JSON.stringify(updated));

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

    setRefreshing(true);
    const startTime = Date.now();

    (async () => {
      try {
        if (typeof onRefresh === 'function') {
          const refreshResult = onRefresh();

          if (refreshResult && typeof refreshResult.catch === 'function') {
            refreshResult.catch((err) => {
              console.error('Error refreshing data:', err);
            });
          }
        }

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
        <div className='top-nav-right'>
          {onRefresh && (
            <button
              className={`top-nav-search-btn tooltip-wrapper ${refreshing ? 'opacity-70' : ''}`}
            >
              {refreshing ? (
                <i className='fa-solid fa-spinner fa-spin'></i>
              ) : (
                <i className='fa-solid fa-rotate'></i>
              )}
            </button>
          )}
          {onNewOrder && (
            <button
              className='top-nav-search-btn tooltip-wrapper'
              onClick={() => onNewOrder()}
              title='Add New Order'
              aria-label='Add New Order'
            >
              <i className='fa-solid fa-plus'></i>
            </button>
          )}
          <button
            className='top-nav-search-btn tooltip-wrapper'
            onClick={() => setShowSearchModal(true)}
            title='Search'
            aria-label='Search'
          >
            <i className='fa-solid fa-search'></i>
          </button>
          <button
            className='top-nav-notification-btn tooltip-wrapper'
            onClick={() => setActiveTab('notifications')}
            title={`Notifications${
              unreadNotifications > 0 ? ` (${unreadNotifications} unread)` : ''
            }`}
            aria-label='Notifications'
          >
            <i className='fa-solid fa-bell'></i>
            {unreadNotifications > 0 && (
              <span className='top-nav-badge'>
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
            <span className='tooltip'>
              Notifications{unreadNotifications > 0 ? ` (${unreadNotifications} unread)` : ''}
            </span>
          </button>

          {}
          <div className='top-nav-profile-section' ref={profileDropdownRef}>
            <button
              className='top-nav-profile-btn tooltip-wrapper'
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              title='Profile'
              aria-label='Profile'
            >
              <div className='top-nav-profile-avatar'>
                {currentUser?.name ? (
                  <span>
                    {currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                ) : (
                  <i className='fa-solid fa-user'></i>
                )}
              </div>
              {currentUser?.name && (
                <span className='top-nav-profile-name'>{currentUser.name}</span>
              )}
              <i
                className={`fa-solid fa-chevron-${
                  showProfileDropdown ? 'up' : 'down'
                } profile-chevron-icon`}
              ></i>
              <span className='tooltip'>Profile</span>
            </button>

            {}
            {showProfileDropdown && (
              <div className='top-nav-profile-dropdown'>
                <button
                  className='top-nav-profile-dropdown-item'
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileDropdown(false);
                  }}
                >
                  <i className='fa-solid fa-user-gear'></i>
                  <span>Profile Settings</span>
                </button>
                <button
                  className='top-nav-profile-dropdown-item'
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileDropdown(false);
                  }}
                >
                  <i className='fa-solid fa-cog'></i>
                  <span>Settings</span>
                </button>
                <div className='top-nav-profile-divider'></div>
                <button
                  className='top-nav-profile-dropdown-item top-nav-profile-dropdown-item-danger'
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                >
                  <i className='fa-solid fa-sign-out-alt'></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {}
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
                className='btn btn-ghost btn-icon modal-close global-search-close'
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
