// Tab 8: Settings - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useState, useEffect } from 'react';
import PremiumLoader from './PremiumLoader.jsx';

const SettingsTab = ({
  settings,
  onUpdateSettings,
  onBackup,
  onRestore,
  onClearAllData,
  showNotification,
  loading = false,
  showConfirmation,
}) => {
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'orders', 'notifications', 'data', 'profile', 'theme'

  // Form states
  const [businessInfo, setBusinessInfo] = useState({
    businessName: settings?.businessName || 'HomieBites',
    contact: settings?.contact || '',
    email: settings?.email || '',
    address: settings?.address || '',
  });

  const [pricing, setPricing] = useState({
    defaultUnitPrice: settings?.defaultUnitPrice || 100,
    lunchPrice: settings?.lunchPrice || 100,
    dinnerPrice: settings?.dinnerPrice || 100,
    minimumOrderQty: settings?.minimumOrderQty || 1,
  });

  const [orderSettings, setOrderSettings] = useState({
    orderIdPrefix: settings?.orderIdPrefix || 'HB-',
    autoGenerateOrderId: settings?.autoGenerateOrderId !== false,
    allowDuplicateAddress: settings?.allowDuplicateAddress !== false,
    requirePaymentConfirmation: settings?.requirePaymentConfirmation || false,
    statusOptions: settings?.statusOptions || ['Paid', 'Pending', 'Cancelled'],
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailDailySummary: settings?.emailDailySummary !== false,
    emailNewOrderAlert: settings?.emailNewOrderAlert !== false,
    emailPaymentReceived: settings?.emailPaymentReceived !== false,
    emailLowOrderDayWarning: settings?.emailLowOrderDayWarning || false,
    smsPaymentReminders: settings?.smsPaymentReminders !== false,
    smsOrderConfirmations: settings?.smsOrderConfirmations || false,
  });

  const [dataSettings, setDataSettings] = useState({
    autoBackup: settings?.autoBackup !== false,
    autoBackupTime: settings?.autoBackupTime || '02:00',
  });

  const [userProfile, setUserProfile] = useState({
    name: settings?.userName || 'Admin Name',
    email: settings?.userEmail || 'admin@example.com',
    phone: settings?.userPhone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: settings?.theme || localStorage.getItem('homiebites_theme') || 'light',
    primaryColor: settings?.primaryColor || localStorage.getItem('homiebites_primary_color') || '#449031',
    fontSize: settings?.fontSize || localStorage.getItem('homiebites_font_size') || 'medium',
  });

  // showClearDataModal removed - using showConfirmation from parent

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Apply theme function
  const applyTheme = (theme) => {
    try {
      const root = document.documentElement;
      
      // Apply primary color
      if (theme && theme.primaryColor) {
        root.style.setProperty('--admin-accent', theme.primaryColor);
        
        // Calculate light variant
        const rgb = hexToRgb(theme.primaryColor);
        if (rgb) {
          root.style.setProperty('--admin-accent-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
        }
      }
      
      // Apply font size
      if (theme && theme.fontSize) {
        const fontSizeMap = {
          small: '14px',
          medium: '16px',
          large: '18px',
        };
        root.style.setProperty('--admin-base-font-size', fontSizeMap[theme.fontSize] || '16px');
        document.body.style.fontSize = fontSizeMap[theme.fontSize] || '16px';
      }
      
      // Apply theme (light/dark/auto)
      if (theme && theme.theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
      } else if (theme && theme.theme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
      } else if (theme && theme.theme === 'auto') {
        // Auto theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark-theme');
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.add('light-theme');
          document.documentElement.classList.remove('dark-theme');
        }
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  // Apply theme on mount and handle auto theme listener
  useEffect(() => {
    if (themeSettings) {
      applyTheme(themeSettings);
    }

    // Set up auto theme listener if needed
    if (themeSettings?.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (e.matches) {
          document.documentElement.classList.add('dark-theme');
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.add('light-theme');
          document.documentElement.classList.remove('dark-theme');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle save functions
  const handleSaveBusinessInfo = () => {
    if (onUpdateSettings) {
      onUpdateSettings({ businessInfo });
      if (showNotification) showNotification('Business information saved successfully', 'success');
    }
  };

  const handleSavePricing = () => {
    if (onUpdateSettings) {
      onUpdateSettings({ pricing });
      if (showNotification) showNotification('Pricing configuration saved successfully', 'success');
    }
  };

  const handleSaveOrderSettings = () => {
    if (onUpdateSettings) {
      onUpdateSettings({ orderSettings });
      if (showNotification) showNotification('Order settings saved successfully', 'success');
    }
  };

  const handleSaveNotificationPrefs = () => {
    if (onUpdateSettings) {
      onUpdateSettings({ notificationPrefs });
      if (showNotification) showNotification('Notification preferences saved successfully', 'success');
    }
  };

  const handleSaveDataSettings = () => {
    if (onUpdateSettings) {
      onUpdateSettings({ dataSettings });
      if (showNotification) showNotification('Data settings saved successfully', 'success');
    }
  };

  const handleSaveUserProfile = () => {
    if (userProfile.newPassword && userProfile.newPassword !== userProfile.confirmPassword) {
      if (showNotification) showNotification('Passwords do not match', 'error');
      return;
    }
    if (onUpdateSettings) {
      onUpdateSettings({ userProfile });
      if (showNotification) showNotification('Profile updated successfully', 'success');
    }
  };

  const handleSaveTheme = () => {
    // Apply theme immediately
    applyTheme(themeSettings);
    
    // Save to localStorage
    localStorage.setItem('homiebites_theme', themeSettings.theme);
    localStorage.setItem('homiebites_primary_color', themeSettings.primaryColor);
    localStorage.setItem('homiebites_font_size', themeSettings.fontSize);
    
    // Save to settings via callback
    if (onUpdateSettings) {
      onUpdateSettings({ themeSettings });
    }
    
    if (showNotification) {
      showNotification('Theme applied successfully', 'success');
    }
  };

  // Apply theme when settings change (for preview)
  const handleThemeChange = (updates) => {
    const newTheme = { ...themeSettings, ...updates };
    setThemeSettings(newTheme);
    // Apply immediately for preview
    applyTheme(newTheme);
  };

  // Handle backup
  const handleBackup = async () => {
    if (onBackup) {
      await onBackup();
      if (showNotification) showNotification('Backup created successfully', 'success');
    }
  };

  // Handle restore
  const handleRestore = async () => {
    if (onRestore) {
      await onRestore();
      if (showNotification) showNotification('Data restored successfully', 'success');
    }
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <div className='dashboard-header'>
          <h2>Settings</h2>
        </div>
        <PremiumLoader message="Loading settings..." size="large" />
      </div>
    );
  }

  return (
    <div className='admin-content'>
      {/* HEADER */}
      <div className='dashboard-header'>
        <div>
          <h2>Settings</h2>
          <p>Configure your application settings</p>
        </div>
      </div>

      {/* SETTINGS TABS */}
      <div className='action-bar' style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
        <button
          className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setActiveTab('orders')}
        >
          Order Settings
        </button>
        <button
          className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          className={`btn ${activeTab === 'data' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setActiveTab('data')}
        >
          Data Management
        </button>
        <button
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setActiveTab('profile')}
        >
          User Profile
        </button>
        <button
          className={`btn ${activeTab === 'theme' ? 'btn-primary' : 'btn-ghost'} btn-small`}
          onClick={() => setActiveTab('theme')}
        >
          Theme Settings
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'general' && (
        <div className='dashboard-grid-layout'>
          {/* Business Information */}
          <div className='dashboard-grid-item half-width'>
            <div className='dashboard-card'>
              <h3 className='dashboard-section-title'>Business Information</h3>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>Business Name</label>
                  <input
                    type='text'
                    className='input-field'
                    value={businessInfo.businessName}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                  />
                </div>
                <div className='form-group'>
                  <label>Contact</label>
                  <input
                    type='tel'
                    className='input-field'
                    value={businessInfo.contact}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, contact: e.target.value })}
                    placeholder='+91'
                  />
                </div>
                <div className='form-group'>
                  <label>Email</label>
                  <input
                    type='email'
                    className='input-field'
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  />
                </div>
                <div className='form-group'>
                  <label>Address</label>
                  <textarea
                    className='input-field'
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <button className='btn btn-primary' onClick={handleSaveBusinessInfo}>
                    <i className='fa-solid fa-save'></i> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Configuration */}
          <div className='dashboard-grid-item half-width'>
            <div className='dashboard-card'>
              <h3 className='dashboard-section-title'>Pricing Configuration</h3>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>Default Unit Price</label>
                  <input
                    type='number'
                    className='input-field'
                    value={pricing.defaultUnitPrice}
                    onChange={(e) => setPricing({ ...pricing, defaultUnitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className='form-group'>
                  <label>Lunch Price</label>
                  <input
                    type='number'
                    className='input-field'
                    value={pricing.lunchPrice}
                    onChange={(e) => setPricing({ ...pricing, lunchPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className='form-group'>
                  <label>Dinner Price</label>
                  <input
                    type='number'
                    className='input-field'
                    value={pricing.dinnerPrice}
                    onChange={(e) => setPricing({ ...pricing, dinnerPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className='form-group'>
                  <label>Minimum Order Qty</label>
                  <input
                    type='number'
                    className='input-field'
                    value={pricing.minimumOrderQty}
                    onChange={(e) => setPricing({ ...pricing, minimumOrderQty: parseInt(e.target.value) || 1 })}
                    min={1}
                  />
                </div>
                <div className='form-group' style={{ gridColumn: '1 / -1' }}>
                  <button className='btn btn-primary' onClick={handleSavePricing}>
                    <i className='fa-solid fa-save'></i> Update Pricing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className='dashboard-card'>
          <h3 className='dashboard-section-title'>Order Configuration</h3>
          <div className='form-grid'>
            <div className='form-group'>
              <label>Order ID Prefix</label>
              <input
                type='text'
                className='input-field'
                value={orderSettings.orderIdPrefix}
                onChange={(e) => setOrderSettings({ ...orderSettings, orderIdPrefix: e.target.value })}
              />
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type='checkbox'
                  checked={orderSettings.autoGenerateOrderId}
                  onChange={(e) => setOrderSettings({ ...orderSettings, autoGenerateOrderId: e.target.checked })}
                />
                <span>Auto-generate Order ID</span>
              </label>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type='checkbox'
                  checked={orderSettings.allowDuplicateAddress}
                  onChange={(e) => setOrderSettings({ ...orderSettings, allowDuplicateAddress: e.target.checked })}
                />
                <span>Allow Duplicate Address</span>
              </label>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type='checkbox'
                  checked={orderSettings.requirePaymentConfirmation}
                  onChange={(e) => setOrderSettings({ ...orderSettings, requirePaymentConfirmation: e.target.checked })}
                />
                <span>Require Payment Confirmation</span>
              </label>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label>Status Options</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {orderSettings.statusOptions.map((status, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>• {status}</span>
                  </div>
                ))}
                <button className='btn btn-ghost btn-small' style={{ alignSelf: 'flex-start' }}>
                  <i className='fa-solid fa-plus'></i> Add Status
                </button>
              </div>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <button className='btn btn-primary' onClick={handleSaveOrderSettings}>
                <i className='fa-solid fa-save'></i> Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className='dashboard-card'>
          <h3 className='dashboard-section-title'>Notification Preferences</h3>
          <div className='form-grid'>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>Email Notifications:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type='checkbox'
                    checked={notificationPrefs.emailDailySummary}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, emailDailySummary: e.target.checked })
                    }
                  />
                  <span>Daily Summary</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type='checkbox'
                    checked={notificationPrefs.emailNewOrderAlert}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, emailNewOrderAlert: e.target.checked })
                    }
                  />
                  <span>New Order Alert</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type='checkbox'
                    checked={notificationPrefs.emailPaymentReceived}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, emailPaymentReceived: e.target.checked })
                    }
                  />
                  <span>Payment Received</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type='checkbox'
                    checked={notificationPrefs.emailLowOrderDayWarning}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, emailLowOrderDayWarning: e.target.checked })
                    }
                  />
                  <span>Low Order Day Warning</span>
                </label>
              </div>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>SMS Notifications:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type='checkbox'
                    checked={notificationPrefs.smsPaymentReminders}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, smsPaymentReminders: e.target.checked })
                    }
                  />
                  <span>Payment Reminders</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type='checkbox'
                    checked={notificationPrefs.smsOrderConfirmations}
                    onChange={(e) =>
                      setNotificationPrefs({ ...notificationPrefs, smsOrderConfirmations: e.target.checked })
                    }
                  />
                  <span>Order Confirmations</span>
                </label>
              </div>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <button className='btn btn-primary' onClick={handleSaveNotificationPrefs}>
                <i className='fa-solid fa-save'></i> Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className='dashboard-card'>
          <h3 className='dashboard-section-title'>Backup & Restore</h3>
          <div className='form-grid'>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label>Last Backup</label>
              <p style={{ color: 'var(--admin-text-secondary)', marginTop: '8px' }}>
                {settings?.lastBackup || '15-Jan-2025 09:30 AM'}
              </p>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <div className='action-buttons-group'>
                <button className='btn btn-primary' onClick={handleBackup}>
                  <i className='fa-solid fa-save'></i> Backup Now
                </button>
                <button className='btn btn-secondary' onClick={() => {}}>
                  <i className='fa-solid fa-download'></i> Download Backup
                </button>
                <button className='btn btn-secondary' onClick={handleRestore}>
                  <i className='fa-solid fa-rotate'></i> Restore from Backup
                </button>
              </div>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type='checkbox'
                  checked={dataSettings.autoBackup}
                  onChange={(e) => setDataSettings({ ...dataSettings, autoBackup: e.target.checked })}
                />
                <span>Auto Backup: Daily at {dataSettings.autoBackupTime}</span>
              </label>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1', marginTop: '32px' }}>
              <h4 style={{ color: 'var(--admin-danger)', marginBottom: '16px' }}>⚠️ Danger Zone</h4>
              <button
                className='btn btn-danger'
                onClick={() => {
                  if (showConfirmation && onClearAllData) {
                    showConfirmation({
                      title: 'Clear All Data',
                      message: 'Are you sure you want to clear ALL data? This action cannot be undone and will permanently delete all orders and settings.',
                      type: 'danger',
                      confirmText: 'Clear All Data',
                      onConfirm: async () => {
                        await onClearAllData();
                        if (showNotification) showNotification('All data cleared', 'success');
                      },
                    });
                  } else if (onClearAllData) {
                    onClearAllData();
                  }
                }}
              >
                <i className='fa-solid fa-trash'></i> Clear All Data
              </button>
              <p style={{ color: 'var(--admin-text-light)', fontSize: '0.85rem', marginTop: '8px' }}>
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className='dashboard-card'>
          <h3 className='dashboard-section-title'>Your Profile</h3>
          <div className='form-grid'>
            <div className='form-group'>
              <label>Name</label>
              <input
                type='text'
                className='input-field'
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              />
            </div>
            <div className='form-group'>
              <label>Email</label>
              <input
                type='email'
                className='input-field'
                value={userProfile.email}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              />
            </div>
            <div className='form-group'>
              <label>Phone</label>
              <input
                type='tel'
                className='input-field'
                value={userProfile.phone}
                onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                placeholder='+91'
              />
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1', marginTop: '24px' }}>
              <h4 style={{ marginBottom: '16px' }}>Change Password</h4>
            </div>
            <div className='form-group'>
              <label>Current Password</label>
              <input
                type='password'
                className='input-field'
                value={userProfile.currentPassword}
                onChange={(e) => setUserProfile({ ...userProfile, currentPassword: e.target.value })}
                placeholder='********'
              />
            </div>
            <div className='form-group'>
              <label>New Password</label>
              <input
                type='password'
                className='input-field'
                value={userProfile.newPassword}
                onChange={(e) => setUserProfile({ ...userProfile, newPassword: e.target.value })}
                placeholder='********'
              />
            </div>
            <div className='form-group'>
              <label>Confirm Password</label>
              <input
                type='password'
                className='input-field'
                value={userProfile.confirmPassword}
                onChange={(e) => setUserProfile({ ...userProfile, confirmPassword: e.target.value })}
                placeholder='********'
              />
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <button className='btn btn-primary' onClick={handleSaveUserProfile}>
                <i className='fa-solid fa-save'></i> Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className='dashboard-card'>
          <h3 className='dashboard-section-title'>Appearance</h3>
          <div className='form-grid'>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label>Theme</label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', borderRadius: '8px', border: `2px solid ${themeSettings.theme === 'light' ? 'var(--admin-accent)' : 'transparent'}`, background: themeSettings.theme === 'light' ? 'var(--admin-accent-light)' : 'transparent', transition: 'all 0.2s ease' }}>
                  <input
                    type='radio'
                    name='theme'
                    value='light'
                    checked={themeSettings.theme === 'light'}
                    onChange={(e) => handleThemeChange({ theme: e.target.value })}
                  />
                  <i className='fa-solid fa-sun' style={{ color: themeSettings.theme === 'light' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)' }}></i>
                  <span>Light</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', borderRadius: '8px', border: `2px solid ${themeSettings.theme === 'dark' ? 'var(--admin-accent)' : 'transparent'}`, background: themeSettings.theme === 'dark' ? 'var(--admin-accent-light)' : 'transparent', transition: 'all 0.2s ease' }}>
                  <input
                    type='radio'
                    name='theme'
                    value='dark'
                    checked={themeSettings.theme === 'dark'}
                    onChange={(e) => handleThemeChange({ theme: e.target.value })}
                  />
                  <i className='fa-solid fa-moon' style={{ color: themeSettings.theme === 'dark' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)' }}></i>
                  <span>Dark</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', borderRadius: '8px', border: `2px solid ${themeSettings.theme === 'auto' ? 'var(--admin-accent)' : 'transparent'}`, background: themeSettings.theme === 'auto' ? 'var(--admin-accent-light)' : 'transparent', transition: 'all 0.2s ease' }}>
                  <input
                    type='radio'
                    name='theme'
                    value='auto'
                    checked={themeSettings.theme === 'auto'}
                    onChange={(e) => handleThemeChange({ theme: e.target.value })}
                  />
                  <i className='fa-solid fa-circle-half-stroke' style={{ color: themeSettings.theme === 'auto' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)' }}></i>
                  <span>Auto</span>
                </label>
              </div>
            </div>
            <div className='form-group'>
              <label>Primary Color</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type='color'
                  value={themeSettings.primaryColor}
                  onChange={(e) => handleThemeChange({ primaryColor: e.target.value })}
                  style={{ width: '60px', height: '40px', borderRadius: '8px', border: '1px solid var(--admin-border)', cursor: 'pointer' }}
                />
                <input
                  type='text'
                  className='input-field'
                  value={themeSettings.primaryColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      handleThemeChange({ primaryColor: color });
                    } else {
                      setThemeSettings({ ...themeSettings, primaryColor: color });
                    }
                  }}
                  placeholder='#449031'
                  style={{ flex: 1 }}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {['#449031', '#c45c2d', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981'].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleThemeChange({ primaryColor: color })}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: color,
                        border: `2px solid ${themeSettings.primaryColor === color ? '#fff' : 'transparent'}`,
                        cursor: 'pointer',
                        boxShadow: themeSettings.primaryColor === color ? '0 0 0 2px var(--admin-accent)' : 'none',
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className='form-group'>
              <label>Font Size</label>
              <select
                className='input-field'
                value={themeSettings.fontSize}
                onChange={(e) => handleThemeChange({ fontSize: e.target.value })}
              >
                <option value='small'>Small (14px)</option>
                <option value='medium'>Medium (16px)</option>
                <option value='large'>Large (18px)</option>
              </select>
              <div style={{ marginTop: '12px', padding: '12px', background: 'var(--admin-glass-border)', borderRadius: '8px' }}>
                <p style={{ fontSize: themeSettings.fontSize === 'small' ? '14px' : themeSettings.fontSize === 'large' ? '18px' : '16px', margin: 0 }}>
                  Preview: This is how text will look with {themeSettings.fontSize} font size.
                </p>
              </div>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <button className='btn btn-primary' onClick={handleSaveTheme}>
                <i className='fa-solid fa-save'></i> Apply Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR DATA MODAL */}
    </div>
  );
};

export default SettingsTab;
