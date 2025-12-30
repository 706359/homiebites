import { adminFeatures } from '../../shared/utils/adminConfig.js';

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
  return (
    <div
      className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}
    >
      <div className='sidebar-header'>
        <div className='sidebar-logo'>
          <img
            src='/logo.png'
            alt='HomieBites'
            className='sidebar-logo-img'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className='sidebar-logo-fallback' style={{ display: 'none' }}>
            <i className='fa-solid fa-shield-halved'></i>
          </div>
        </div>
      </div>

      <nav className='sidebar-nav'>
        {[
          { key: 'dashboard', tabKey: 'dashboard' },
          { key: 'orders', tabKey: 'currentMonthOrders' }, // Map 'orders' config key to 'currentMonthOrders' tab
          { key: 'menu', tabKey: 'menu' },
          { key: 'offers', tabKey: 'offers' },
          { key: 'customers', tabKey: 'customers' },
          { key: 'users', tabKey: 'pendingAmounts' }, // Map 'users' config key to 'pendingAmounts' tab
          { key: 'analytics', tabKey: 'analytics' },
          { key: 'notifications', tabKey: 'notifications' },
          { key: 'summary', tabKey: 'summary' },
          { key: 'settings', tabKey: 'settings' },
          { key: 'excelViewer', tabKey: 'allOrdersData' }, // Map 'excelViewer' config key to 'allOrdersData' tab
        ]
          .map(({ key, tabKey }) => [key, adminFeatures[key], tabKey])
          .filter(([key, feature]) => feature && feature.enabled)
          .map(([key, feature, tabKey]) => (
            <button
              key={key}
              className={`sidebar-item ${activeTab === tabKey ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tabKey);
                setSidebarOpen(false);
              }}
              title={sidebarCollapsed ? feature.name : ''}
            >
              <i className={`fa-solid ${feature.icon}`}></i>
              {!sidebarCollapsed && <span>{feature.name}</span>}
            </button>
          ))}
      </nav>

      <div className='sidebar-footer'>
        <button
          className='sidebar-toggle-btn sidebar-item'
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i
            className={`fa-solid ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}
          ></i>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>

        {/* Profile Section */}
        {currentUser && (
          <div className={`sidebar-profile ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className='profile-avatar'>
              {currentUser.name ? (
                <span className='profile-avatar-initials'>
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
            {!sidebarCollapsed && (
              <div className='profile-info'>
                <div className='profile-name'>{currentUser.name || 'Admin User'}</div>
                <div className='profile-role'>
                  <i className='fa-solid fa-shield-halved'></i>
                  {currentUser.role === 'admin' ? 'Super Admin' : 'Admin'}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          className='sidebar-item logout-btn'
          onClick={onLogout}
          title={sidebarCollapsed ? 'Logout' : ''}
        >
          <i className='fa-solid fa-arrow-right-from-bracket'></i>
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

