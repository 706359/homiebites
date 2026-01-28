import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Icon from '../ui/Icon.jsx';
import { adminFeatures } from './utils/adminConfig.js';

// Helper function to check kitchen status
const getKitchenStatus = (settings) => {
  if (!settings) return true; // Default to open if no settings
  
  // Check if kitchenEnabled is explicitly set to false
  const isExplicitlyDisabled = settings.kitchenEnabled === false;
  
  // If explicitly disabled, check date range
  if (isExplicitlyDisabled) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If no dates set, closed for today only
    if (!settings.kitchenClosedFrom && !settings.kitchenClosedTo) {
      return false; // Closed today
    }
    
    // Check if today is within closed date range
    if (settings.kitchenClosedFrom && settings.kitchenClosedTo) {
      const fromDate = new Date(settings.kitchenClosedFrom);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(settings.kitchenClosedTo);
      toDate.setHours(23, 59, 59, 999);
      
      // If today is within the closed range, kitchen is closed
      if (today >= fromDate && today <= toDate) {
        return false;
      }
      // If today is past the closed range, kitchen is open again
      return true;
    }
    
    // If only from date is set (no to date)
    if (settings.kitchenClosedFrom && !settings.kitchenClosedTo) {
      const fromDate = new Date(settings.kitchenClosedFrom);
      fromDate.setHours(0, 0, 0, 0);
      // If today is before the from date, kitchen is still open
      if (today < fromDate) {
        return true;
      }
      // If today is on or after from date, kitchen is closed
      return false;
    }
    
    return false; // Closed
  }
  
  // If kitchenEnabled is true or undefined, kitchen is open
  return true;
};

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser,
  onLogout,
  settings,
  onAutoHideChange,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);
  const profileDropdownRef = useRef(null);
  const autoHideTimeoutRef = useRef(null);
  const hoverAreaRef = useRef(null);
  
  // Properly handle autoHideSidebar: check if property exists and is explicitly set
  // Use useMemo to ensure it updates when settings change
  const autoHideSidebar = useMemo(() => {
    if (!settings) return false; // Default to false if no settings
    // If undefined or null, it means it was never set, so default to false
    // If it exists (even if true), use the actual value
    return settings.autoHideSidebar !== undefined && settings.autoHideSidebar !== null
      ? Boolean(settings.autoHideSidebar)
      : false;
  }, [settings?.autoHideSidebar]);
  
  const HIDE_DELAY = 3000; // 3 seconds
  const HOVER_AREA_WIDTH = 20; // 20px hover area on left edge
  const [isAutoHidden, setIsAutoHidden] = useState(false);

  // Auto-hide sidebar after inactivity (only when sidebar is expanded)
  const resetAutoHideTimer = useCallback(() => {
    if (!autoHideSidebar || sidebarCollapsed) return;
    
    // Clear existing timer
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }
    
    // Set new timer to hide sidebar
    autoHideTimeoutRef.current = setTimeout(() => {
      if (autoHideSidebar && !sidebarCollapsed) {
        setIsAutoHidden(true);
      }
    }, HIDE_DELAY);
  }, [autoHideSidebar, sidebarCollapsed]);

  // Show sidebar on hover over left edge
  const handleMouseEnterHoverArea = useCallback(() => {
    if (!autoHideSidebar) return;
    
    // Clear hide timer
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }
    
    // Show sidebar
    setIsAutoHidden(false);
  }, [autoHideSidebar]);

  // Hide sidebar when mouse leaves sidebar area
  const handleMouseLeaveSidebar = useCallback(() => {
    if (!autoHideSidebar) return;
    
    // Start hide timer
    resetAutoHideTimer();
  }, [autoHideSidebar, resetAutoHideTimer]);
  
  // Keep sidebar visible when user interacts with it
  const handleSidebarInteraction = useCallback(() => {
    if (!autoHideSidebar) return;
    
    // Clear hide timer and show sidebar
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }
    setIsAutoHidden(false);
    resetAutoHideTimer();
  }, [autoHideSidebar, resetAutoHideTimer]);

  // Setup auto-hide functionality
  useEffect(() => {
    if (!autoHideSidebar) {
      // Clear timer and show sidebar if auto-hide is disabled
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
      setIsAutoHidden(false);
      return;
    }

    // Reset timer on user activity (but only if sidebar is visible)
    const handleActivity = () => {
      if (!isAutoHidden && !sidebarCollapsed) {
        resetAutoHideTimer();
      }
    };

    // Listen for user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timer - only start if sidebar is not collapsed
    if (!sidebarCollapsed) {
      resetAutoHideTimer();
    }

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [autoHideSidebar, sidebarCollapsed, isAutoHidden, resetAutoHideTimer]);
  
  // Reset auto-hide when sidebar is manually collapsed/expanded
  useEffect(() => {
    if (sidebarCollapsed) {
      setIsAutoHidden(false);
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    } else if (autoHideSidebar) {
      resetAutoHideTimer();
    }
  }, [sidebarCollapsed, autoHideSidebar, resetAutoHideTimer]);
  
  // Notify parent when auto-hide state changes
  useEffect(() => {
    if (onAutoHideChange) {
      onAutoHideChange(isAutoHidden && autoHideSidebar);
    }
  }, [isAutoHidden, autoHideSidebar, onAutoHideChange]);

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
    <>
      {/* Hover area on left edge to show sidebar - only when auto-hidden */}
      {autoHideSidebar && isAutoHidden && (
        <div
          ref={hoverAreaRef}
          className="sidebar-hover-area"
          onMouseEnter={handleMouseEnterHoverArea}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: `${HOVER_AREA_WIDTH}px`,
            height: '100vh',
            zIndex: 999,
            cursor: 'default',
            backgroundColor: 'transparent',
          }}
          aria-hidden="true"
        />
      )}
      
      <div
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${
          sidebarCollapsed ? 'collapsed' : ''
        } ${isAutoHidden && autoHideSidebar ? 'auto-hidden' : ''}`}
        onMouseEnter={handleSidebarInteraction}
        onMouseLeave={handleMouseLeaveSidebar}
        onMouseMove={handleSidebarInteraction}
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
          {/* Kitchen Status Indicator */}
          {settings && (
            <span
              className="kitchen-status-indicator"
              title={getKitchenStatus(settings) ? 'Kitchen is Open' : 'Kitchen is Closed'}
              style={{
                backgroundColor: getKitchenStatus(settings) ? '#10b981' : '#ef4444',
              }}
              key={`kitchen-${settings.kitchenEnabled}-${settings.kitchenClosedFrom}-${settings.kitchenClosedTo}`}
            />
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {[
          // 1. Overview & Home
          { key: 'dashboard', tabKey: 'dashboard' },
          
          // 2. Immediate & Recent Orders (Most frequently accessed)
          { key: 'todayOrder', tabKey: 'todayOrder' },
          { key: 'orders', tabKey: 'currentMonthOrders' },
          { key: 'excelViewer', tabKey: 'allOrdersData' },
          
          // 3. Action Items & Financial Overview
          { key: 'pendingAmounts', tabKey: 'pendingAmounts' },
          { key: 'financialSummary', tabKey: 'financialSummary' },
          
          // 4. Analysis & Insights
          { key: 'analytics', tabKey: 'analytics' },
          { key: 'reports', tabKey: 'reports' },
          
          // 5. Management Sections
          { key: 'customers', tabKey: 'customers' },
          { key: 'menuPrice', tabKey: 'menuPrice' },
          { key: 'offers', tabKey: 'offers' },
          { key: 'reviews', tabKey: 'reviews' },
          
          // 6. Configuration (Always last)
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
                <Icon name={feature.icon} />
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
          <Icon
            name={sidebarCollapsed ? 'chevron-right' : 'chevron-left'}
            className="sidebar-chevron-icon"
          />
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
                <Icon name="user" />
              )}
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="sidebar-profile-info">
                  <span className="sidebar-profile-name">
                    {currentUser?.name || 'Admin'}
                  </span>
                </div>
                <Icon
                  name={showProfileDropdown ? 'chevron-up' : 'chevron-down'}
                  className="sidebar-profile-chevron"
                  aria-hidden
                />
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
                    <Icon name="user" />
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
                  <Icon name="cog" />
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
                      <Icon name="sign-out-alt" />
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
            <Icon name="sign-out-alt" />
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default Sidebar;
