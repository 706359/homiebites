import { useEffect, useRef, useState } from 'react';
import { adminFeatures } from './utils/adminConfig.js';

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser,
  onLogout,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileDropdown]);
  return (
    <div
      className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${
        sidebarCollapsed ? 'collapsed' : ''
      }`}
    >
      <div className="sidebar-header">
        <div className={`sidebar-logo ${logoImgError ? 'logo-img-error' : ''}`}>
          <img
            src="/logo.png"
            alt="HomieBites"
            className="sidebar-logo-img"
            onError={() => setLogoImgError(true)}
            onClick={() => setActiveTab('dashboard')}
          />
          <div
            className="sidebar-logo-fallback"
            aria-hidden={!logoImgError}
            onClick={() => setActiveTab('dashboard')}
          >
            HomieBites
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {[
          { key: 'dashboard', tabKey: 'dashboard' },
          { key: 'excelViewer', tabKey: 'allOrdersData' },
          { key: 'orders', tabKey: 'currentMonthOrders' },
          { key: 'analytics', tabKey: 'analytics' },
          { key: 'customers', tabKey: 'customers' },
          { key: 'reports', tabKey: 'reports' },
          { key: 'pendingAmounts', tabKey: 'pendingAmounts' },
          { key: 'financialSummary', tabKey: 'financialSummary' },
          { key: 'menuPrice', tabKey: 'menuPrice' },
          { key: 'reviews', tabKey: 'reviews' },
          { key: 'offers', tabKey: 'offers' },
          { key: 'notifications', tabKey: 'notifications' },
          { key: 'settings', tabKey: 'settings' },
        ]
          .map(({ key, tabKey }) => [key, adminFeatures[key], tabKey])
          .filter(([key, feature]) => feature && feature.enabled)
          .map(([key, feature, tabKey]) => {
            const isActive = activeTab === tabKey;
            return (
              <button
                key={key}
                className={`sidebar-item${isActive ? ' active' : ''}`}
                onClick={() => {
                  setActiveTab(tabKey);
                  setSidebarOpen(false);
                }}
                title={sidebarCollapsed ? feature.name : ''}
              >
                <i className={`fa-solid ${feature.icon}`}></i>
                {!sidebarCollapsed && <span>{feature.name}</span>}
              </button>
            );
          })}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {!sidebarCollapsed && (
            <span className="sidebar-collapse-text">Collapse</span>
          )}
          <i
            className={`fa-solid ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}
          ></i>
        </button>

        <div className="sidebar-profile-section" ref={profileDropdownRef}>
          <button
            className={`sidebar-profile-btn ${showProfileDropdown ? 'is-open' : ''}`}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            title={sidebarCollapsed ? 'Profile' : ''}
            aria-label="Profile"
            aria-expanded={showProfileDropdown}
            aria-haspopup="menu"
          >
            <div className="sidebar-profile-avatar">
              {currentUser?.name ? (
                <span className="sidebar-profile-initials">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="sidebar-profile-info">
                  <span className="sidebar-profile-name">
                    {currentUser?.name || 'Admin'}
                  </span>
                </div>
                <i
                  className={`fa-solid fa-chevron-${showProfileDropdown ? 'up' : 'down'} sidebar-profile-chevron`}
                  aria-hidden
                ></i>
              </>
            )}
          </button>

          {showProfileDropdown && (
            <div className="sidebar-profile-dropdown" role="menu">
              <div className="sidebar-profile-dropdown-header">
                <div className="sidebar-profile-dropdown-avatar">
                  {currentUser?.name ? (
                    <span className="sidebar-profile-initials">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  ) : (
                    <i className="fa-solid fa-user"></i>
                  )}
                </div>
                <span className="sidebar-profile-dropdown-name">
                  {currentUser?.name || 'Admin'}
                </span>
              </div>
              <div className="sidebar-profile-dropdown-divider"></div>
              <button
                className="sidebar-profile-dropdown-item"
                role="menuitem"
                onClick={() => {
                  setActiveTab('settings');
                  setShowProfileDropdown(false);
                  setSidebarOpen(false);
                }}
              >
                <span className="sidebar-profile-dropdown-icon">
                  <i className="fa-solid fa-cog"></i>
                </span>
                <span>Settings</span>
              </button>
              {onLogout && (
                <>
                  <div className="sidebar-profile-divider"></div>
                  <button
                    className="sidebar-profile-dropdown-item sidebar-profile-dropdown-item-danger"
                    role="menuitem"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setSidebarOpen(false);
                      onLogout();
                    }}
                  >
                    <span className="sidebar-profile-dropdown-icon">
                      <i className="fa-solid fa-sign-out-alt"></i>
                    </span>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {onLogout && sidebarCollapsed && (
          <button
            className="sidebar-item logout-btn"
            onClick={() => {
              onLogout();
              setSidebarOpen(false);
            }}
            title="Logout"
            aria-label="Logout"
          >
            <i className="fa-solid fa-sign-out-alt"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
