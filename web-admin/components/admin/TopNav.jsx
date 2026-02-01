'use client';

import { useEffect, useState } from 'react';
import { OverlayLoader, Spinner } from '../loaders/LoaderComponents';
import Icon from '../ui/Icon.jsx';
import KeyboardShortcutsModal from './KeyboardShortcutsModal.jsx';
import NotificationDropdown from './NotificationDropdown.jsx';

const TopNav = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  unreadNotifications,
  setActiveTab,
  tabTitle,
  tabSubtitle,
  tabAction,
  onNewOrder,
  onRefresh,
  orders = [],
  reviews = [],
  onViewOrder,
  onViewPendingAmounts,
  onViewReviews,
}) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target;
        const isInput =
          /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName) ||
          target?.isContentEditable;
        if (!isInput) {
          e.preventDefault();
          setShowShortcutsModal(true);
        }
      }
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
      if (e.key === 'Escape') {
        if (showShortcutsModal) setShowShortcutsModal(false);
        else if (showSearchModal) setShowSearchModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearchModal, showShortcutsModal, onNewOrder]);

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

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem('homiebites_recent_searches', JSON.stringify(updated));

    if (query.toLowerCase().includes('order')) {
      setActiveTab('allOrdersData');
    } else if (query.toLowerCase().includes('customer')) {
      setActiveTab('customers');
    } else if (
      query.toLowerCase().includes('payment') ||
      query.toLowerCase().includes('pending')
    ) {
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
      icon: 'plus',
      action: () => setActiveTab('currentMonthOrders'),
    },
    {
      label: 'Generate report',
      icon: 'file-alt',
      action: () => setActiveTab('reports'),
    },
    {
      label: 'View analytics',
      icon: 'chart-line',
      action: () => setActiveTab('analytics'),
    },
    {
      label: 'Pending payments',
      icon: 'exclamation-triangle',
      action: () => setActiveTab('pendingAmounts'),
    },
  ];

  return (
    <>
      <OverlayLoader show={refreshing} message="Refreshing data..." />
      <div className="admin-top-nav">
        <div className="top-nav-left">
          <button
            type="button"
            className="top-nav-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Icon name="bars" />
          </button>
          {tabTitle ? (
            <div className="top-nav-tab-info">
              <h1 className="top-nav-title">{tabTitle}</h1>
              {tabSubtitle && <p className="top-nav-subtitle">{tabSubtitle}</p>}
            </div>
          ) : (
            <h1 className="top-nav-title">Admin Dashboard</h1>
          )}
        </div>
        <div className="top-nav-center">
          {tabAction && <div className="top-nav-action">{tabAction}</div>}
        </div>
        <div className="top-nav-right">
          {onRefresh && (
            <button
              type="button"
              className={`top-nav-search-btn tooltip-wrapper ${refreshing ? 'opacity-70' : ''}`}
              onClick={handleRefresh}
              title="Refresh"
              aria-label="Refresh"
            >
              {refreshing ? (
                <Spinner type="circular" size="small" />
              ) : (
                <Icon name="rotate" />
              )}
              <span className="tooltip">Refresh</span>
            </button>
          )}
          {onNewOrder && (
            <button
              type="button"
              className="top-nav-search-btn tooltip-wrapper"
              onClick={() => onNewOrder()}
              title="Add New Order (Ctrl+N)"
              aria-label="Add New Order"
            >
              <Icon name="plus" />
              <span className="tooltip">Add New Order</span>
            </button>
          )}
          <button
            type="button"
            className="top-nav-search-btn tooltip-wrapper"
            onClick={() => setShowSearchModal(true)}
            title="Search (Ctrl+K)"
            aria-label="Search"
          >
            <Icon name="search" />
            <span className="tooltip">Search</span>
          </button>
          <button
            type="button"
            className="top-nav-search-btn tooltip-wrapper"
            onClick={() => setShowShortcutsModal(true)}
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
          >
            <Icon name="key" />
            <span className="tooltip">Shortcuts</span>
          </button>
          <button
            type="button"
            className="top-nav-notification-btn tooltip-wrapper"
            title={`Notifications${
              unreadNotifications > 0 ? ` (${unreadNotifications} new)` : ''
            }`}
            aria-label="Notifications"
            onClick={() =>
              setShowNotificationDropdown(!showNotificationDropdown)
            }
          >
            <Icon name="bell" />
            {unreadNotifications > 0 && (
              <span className="top-nav-badge">
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
            <span className="tooltip">
              Notifications
              {unreadNotifications > 0 ? ` (${unreadNotifications} new)` : ''}
            </span>
          </button>

          <KeyboardShortcutsModal
            show={showShortcutsModal}
            onClose={() => setShowShortcutsModal(false)}
          />
          {/* Notification Dropdown */}
          <NotificationDropdown
            orders={orders}
            reviews={reviews}
            isOpen={showNotificationDropdown}
            onClose={() => setShowNotificationDropdown(false)}
            onViewOrder={(order) => {
              if (onViewOrder) {
                onViewOrder(order);
              } else {
                setActiveTab('allOrdersData');
              }
            }}
            onViewPendingAmounts={() => {
              if (onViewPendingAmounts) {
                onViewPendingAmounts();
              } else {
                setActiveTab('pendingAmounts');
              }
            }}
            onViewReviews={() => {
              if (onViewReviews) {
                onViewReviews();
              } else {
                setActiveTab('reviews');
              }
            }}
          />
        </div>
      </div>

      {showSearchModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="modal-container global-search-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="global-search-header">
              <div className="global-search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search everywhere..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  autoFocus
                  className="global-search-input"
                />
              </div>
              <button
                className="btn btn-ghost btn-icon modal-close global-search-close"
                onClick={() => setShowSearchModal(false)}
                aria-label="Close search"
              >
                <Icon name="times" />
              </button>
            </div>
            <div className="global-search-content">
              {recentSearches.length > 0 && (
                <div className="global-search-section">
                  <h4>Recent Searches</h4>
                  <div className="global-search-list">
                    {recentSearches.map((search, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className="global-search-item"
                        onClick={() => handleSearch(search)}
                      >
                        <Icon name="clock-rotate-left" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="global-search-section">
                <h4>Quick Actions</h4>
                <div className="global-search-list">
                  {quickActions.map((action, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className="global-search-item"
                      onClick={() => {
                        action.action();
                        setShowSearchModal(false);
                      }}
                    >
                      <Icon name={action.icon} />
                      <span>{action.label}</span>
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
