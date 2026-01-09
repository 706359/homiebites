// Tab 8: Settings - Following FULL_DASHBOARD_PLAN.md structure
// This file has been recreated from scratch to match the plan exactly

import { useEffect, useState } from 'react';
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
    primaryColor:
      settings?.primaryColor || localStorage.getItem('homiebites_primary_color') || '#449031',
    fontSize: settings?.fontSize || localStorage.getItem('homiebites_font_size') || 'medium',
    fontFamily: settings?.fontFamily || localStorage.getItem('homiebites_font_family') || 'Baloo 2',
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

  // Apply theme function - SCOPED TO ADMIN DASHBOARD ONLY
  const applyTheme = (theme) => {
    try {
      const adminDashboard = document.querySelector('.admin-dashboard');
      if (!adminDashboard) {
        console.warn('Admin dashboard element not found');
        return;
      }

      // Apply primary color - scoped to admin-dashboard
      if (theme && theme.primaryColor) {
        adminDashboard.style.setProperty('--admin-accent', theme.primaryColor);

        // Calculate light variant
        const rgb = hexToRgb(theme.primaryColor);
        if (rgb) {
          adminDashboard.style.setProperty(
            '--admin-accent-light',
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
          );
        }
      }

      // Apply font size - SCOPED TO ADMIN DASHBOARD ONLY
      if (theme && theme.fontSize) {
        const fontSizeMap = {
          small: '14px',
          medium: '16px',
          large: '18px',
          'extra-large': '20px',
        };
        const fontSize = fontSizeMap[theme.fontSize] || '16px';
        // Set CSS variable on admin-dashboard element
        adminDashboard.style.setProperty('--admin-base-font-size', fontSize);
        // Apply font size to admin-dashboard
        adminDashboard.style.fontSize = fontSize;
      }

      // Apply font family - SCOPED TO ADMIN DASHBOARD ONLY
      if (theme && theme.fontFamily) {
        const fontFamily = `'${theme.fontFamily}', sans-serif`;
        adminDashboard.style.setProperty('--admin-font-family', fontFamily);
        adminDashboard.style.fontFamily = fontFamily;
      }

      // Apply theme (light/dark/auto) - SCOPED TO ADMIN DASHBOARD ONLY
      if (theme && theme.theme === 'dark') {
        adminDashboard.classList.add('dark-theme');
        adminDashboard.classList.remove('light-theme');
      } else if (theme && theme.theme === 'light') {
        adminDashboard.classList.add('light-theme');
        adminDashboard.classList.remove('dark-theme');
      } else if (theme && theme.theme === 'auto') {
        // Auto theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          adminDashboard.classList.add('dark-theme');
          adminDashboard.classList.remove('light-theme');
        } else {
          adminDashboard.classList.add('light-theme');
          adminDashboard.classList.remove('dark-theme');
        }
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  // Apply theme on mount and handle auto theme listener
  useEffect(() => {
    // Wait for admin-dashboard to be available
    const applyThemeWhenReady = () => {
      const adminDashboard = document.querySelector('.admin-dashboard');
      if (adminDashboard && themeSettings) {
        applyTheme(themeSettings);
      } else if (!adminDashboard) {
        // Retry after a short delay if element not found
        setTimeout(applyThemeWhenReady, 100);
      }
    };

    applyThemeWhenReady();

    // Set up auto theme listener if needed
    if (themeSettings?.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const adminDashboard = document.querySelector('.admin-dashboard');
        if (adminDashboard) {
          if (e.matches) {
            adminDashboard.classList.add('dark-theme');
            adminDashboard.classList.remove('light-theme');
          } else {
            adminDashboard.classList.add('light-theme');
            adminDashboard.classList.remove('dark-theme');
          }
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeSettings]); // Added themeSettings as dependency

  // Handle save functions
  const handleSaveBusinessInfo = () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Save Business Information',
        message: 'Are you sure you want to save changes to business information?',
        type: 'info',
        confirmText: 'Save',
        onConfirm: () => {
          if (onUpdateSettings) {
            onUpdateSettings({ businessInfo });
          }
        },
      });
    } else {
      if (onUpdateSettings) {
        onUpdateSettings({ businessInfo });
      }
    }
  };

  const handleSavePricing = () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Save Pricing Configuration',
        message: 'Are you sure you want to save changes to pricing settings?',
        type: 'info',
        confirmText: 'Save',
        onConfirm: () => {
          if (onUpdateSettings) {
            onUpdateSettings({ pricing });
          }
        },
      });
    } else {
      if (onUpdateSettings) {
        onUpdateSettings({ pricing });
      }
    }
  };

  const handleSaveOrderSettings = () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Save Order Settings',
        message: 'Are you sure you want to save changes to order settings?',
        type: 'info',
        confirmText: 'Save',
        onConfirm: () => {
          if (onUpdateSettings) {
            onUpdateSettings({ orderSettings });
          }
        },
      });
    } else {
      if (onUpdateSettings) {
        onUpdateSettings({ orderSettings });
      }
    }
  };

  const handleSaveNotificationPrefs = () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Save Notification Preferences',
        message: 'Are you sure you want to save changes to notification preferences?',
        type: 'info',
        confirmText: 'Save',
        onConfirm: () => {
          if (onUpdateSettings) {
            onUpdateSettings({ notificationPrefs });
          }
        },
      });
    } else {
      if (onUpdateSettings) {
        onUpdateSettings({ notificationPrefs });
      }
    }
  };

  const handleSaveDataSettings = () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Save Data Settings',
        message: 'Are you sure you want to save changes to data settings?',
        type: 'info',
        confirmText: 'Save',
        onConfirm: () => {
          if (onUpdateSettings) {
            onUpdateSettings({ dataSettings });
          }
        },
      });
    } else {
      if (onUpdateSettings) {
        onUpdateSettings({ dataSettings });
      }
    }
  };

  const handleSaveUserProfile = () => {
    if (userProfile.newPassword && userProfile.newPassword !== userProfile.confirmPassword) {
      if (showNotification) showNotification('Passwords do not match', 'error');
      return;
    }

    if (showConfirmation) {
      showConfirmation({
        title: 'Update Profile',
        message: 'Are you sure you want to save changes to your profile?',
        type: 'info',
        confirmText: 'Save',
        onConfirm: () => {
          if (onUpdateSettings) {
            onUpdateSettings({ userProfile });
          }
        },
      });
    } else {
      if (onUpdateSettings) {
        onUpdateSettings({ userProfile });
      }
    }
  };

  const handleSaveTheme = () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Apply Theme',
        message:
          'Are you sure you want to apply this theme? The changes will be saved immediately.',
        type: 'info',
        confirmText: 'Apply',
        onConfirm: () => {
          // Apply theme immediately
          applyTheme(themeSettings);

          // Save to localStorage
          localStorage.setItem('homiebites_theme', themeSettings.theme);
          localStorage.setItem('homiebites_primary_color', themeSettings.primaryColor);
          localStorage.setItem('homiebites_font_size', themeSettings.fontSize);
          localStorage.setItem('homiebites_font_family', themeSettings.fontFamily);

          // Save to settings via callback
          if (onUpdateSettings) {
            onUpdateSettings({ themeSettings });
          }
        },
      });
    } else {
      // Apply theme immediately
      applyTheme(themeSettings);

      // Save to localStorage
      localStorage.setItem('homiebites_theme', themeSettings.theme);
      localStorage.setItem('homiebites_primary_color', themeSettings.primaryColor);
      localStorage.setItem('homiebites_font_size', themeSettings.fontSize);
      localStorage.setItem('homiebites_font_family', themeSettings.fontFamily);

      // Save to settings via callback
      if (onUpdateSettings) {
        onUpdateSettings({ themeSettings });
      }
    }
  };

  // Apply theme when settings change (for preview)
  const handleThemeChange = (updates) => {
    const newTheme = { ...themeSettings, ...updates };
    setThemeSettings(newTheme);
    // Apply immediately for preview - with retry mechanism
    const applyWithRetry = () => {
      const adminDashboard = document.querySelector('.admin-dashboard');
      if (adminDashboard) {
        applyTheme(newTheme);
      } else {
        setTimeout(applyWithRetry, 50);
      }
    };
    applyWithRetry();
  };

  // Handle backup
  const handleBackup = async () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Create Backup',
        message: 'Are you sure you want to create a backup of all data?',
        type: 'info',
        confirmText: 'Create Backup',
        onConfirm: async () => {
          if (onBackup) {
            await onBackup();
            if (showNotification) showNotification('Backup created successfully', 'success');
          }
        },
      });
    } else {
      if (onBackup) {
        await onBackup();
        if (showNotification) showNotification('Backup created successfully', 'success');
      }
    }
  };

  // Handle restore
  const handleRestore = async () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Restore Data',
        message:
          'Are you sure you want to restore data from backup? This will overwrite current data.',
        type: 'warning',
        confirmText: 'Restore',
        onConfirm: async () => {
          if (onRestore) {
            await onRestore();
            if (showNotification) showNotification('Data restored successfully', 'success');
          }
        },
      });
    } else {
      if (onRestore) {
        await onRestore();
        if (showNotification) showNotification('Data restored successfully', 'success');
      }
    }
  };

  if (loading) {
    return (
      <div className='admin-content'>
        <PremiumLoader message='Loading settings...' size='large' />
      </div>
    );
  }

  return (
    <div className='admin-content'>

      {/* SETTINGS TABS */}
      <div className='action-bar action-bar-spaced'>
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
        <div className='dashboard-grid-layout settings-general-grid'>
          {/* Business Information */}
          <div className='dashboard-grid-item settings-card'>
            <div className='dashboard-card settings-card-content'>
              <div className='settings-card-header'>
                <div className='settings-card-icon'>
                  <i className='fa-solid fa-building'></i>
                </div>
                <h3 className='dashboard-section-title'>Business Information</h3>
              </div>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>Business Name</label>
                  <input
                    type='text'
                    className='input-field'
                    value={businessInfo.businessName}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, businessName: e.target.value })
                    }
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
                <div className='form-group settings-action-group'>
                  <button className='btn btn-primary' onClick={handleSaveBusinessInfo}>
                    <i className='fa-solid fa-save'></i> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Configuration */}
          <div className='dashboard-grid-item settings-card'>
            <div className='dashboard-card settings-card-content'>
              <div className='settings-card-header'>
                <div className='settings-card-icon'>
                  <i className='fa-solid fa-indian-rupee-sign'></i>
                </div>
                <h3 className='dashboard-section-title'>Pricing Configuration</h3>
              </div>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>Default Unit Price</label>
                  <input
                    type='number'
                    className='input-field'
                    value={pricing.defaultUnitPrice}
                    onChange={(e) =>
                      setPricing({ ...pricing, defaultUnitPrice: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className='form-group'>
                  <label>Lunch Price</label>
                  <input
                    type='number'
                    className='input-field'
                    value={pricing.lunchPrice}
                    onChange={(e) =>
                      setPricing({ ...pricing, lunchPrice: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className='form-group'>
                  <label>Dinner Price</label>
                  <input
                    type='number'
                    className='input-field'
                    value={pricing.dinnerPrice}
                    onChange={(e) =>
                      setPricing({ ...pricing, dinnerPrice: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className='form-group'>
                  <label>Minimum Order Qty</label>
                  <input
                    type='number'
                    className='input-field'
                    value={pricing.minimumOrderQty}
                    onChange={(e) =>
                      setPricing({ ...pricing, minimumOrderQty: parseInt(e.target.value) || 1 })
                    }
                    min={1}
                  />
                </div>
                <div className='form-group settings-action-group'>
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
                onChange={(e) =>
                  setOrderSettings({ ...orderSettings, orderIdPrefix: e.target.value })
                }
              />
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <input
                  type='checkbox'
                  checked={orderSettings.autoGenerateOrderId}
                  onChange={(e) =>
                    setOrderSettings({ ...orderSettings, autoGenerateOrderId: e.target.checked })
                  }
                />
                <span>Auto-generate Order ID</span>
              </label>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <input
                  type='checkbox'
                  checked={orderSettings.allowDuplicateAddress}
                  onChange={(e) =>
                    setOrderSettings({ ...orderSettings, allowDuplicateAddress: e.target.checked })
                  }
                />
                <span>Allow Duplicate Address</span>
              </label>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <input
                  type='checkbox'
                  checked={orderSettings.requirePaymentConfirmation}
                  onChange={(e) =>
                    setOrderSettings({
                      ...orderSettings,
                      requirePaymentConfirmation: e.target.checked,
                    })
                  }
                />
                <span>Require Payment Confirmation</span>
              </label>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label>Status Options</label>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}
              >
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
            <div className='form-group settings-action-group'>
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
              <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>
                Email Notifications:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input
                    type='checkbox'
                    checked={notificationPrefs.emailDailySummary}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        emailDailySummary: e.target.checked,
                      })
                    }
                  />
                  <span>Daily Summary</span>
                </label>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input
                    type='checkbox'
                    checked={notificationPrefs.emailNewOrderAlert}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        emailNewOrderAlert: e.target.checked,
                      })
                    }
                  />
                  <span>New Order Alert</span>
                </label>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input
                    type='checkbox'
                    checked={notificationPrefs.emailPaymentReceived}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        emailPaymentReceived: e.target.checked,
                      })
                    }
                  />
                  <span>Payment Received</span>
                </label>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input
                    type='checkbox'
                    checked={notificationPrefs.emailLowOrderDayWarning}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        emailLowOrderDayWarning: e.target.checked,
                      })
                    }
                  />
                  <span>Low Order Day Warning</span>
                </label>
              </div>
            </div>
            <div className='form-group' style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>
                SMS Notifications:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input
                    type='checkbox'
                    checked={notificationPrefs.smsPaymentReminders}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        smsPaymentReminders: e.target.checked,
                      })
                    }
                  />
                  <span>Payment Reminders</span>
                </label>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <input
                    type='checkbox'
                    checked={notificationPrefs.smsOrderConfirmations}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        smsOrderConfirmations: e.target.checked,
                      })
                    }
                  />
                  <span>Order Confirmations</span>
                </label>
              </div>
            </div>
            <div className='form-group settings-action-group'>
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
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <input
                  type='checkbox'
                  checked={dataSettings.autoBackup}
                  onChange={(e) =>
                    setDataSettings({ ...dataSettings, autoBackup: e.target.checked })
                  }
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
                      message:
                        'Are you sure you want to clear ALL data? This action cannot be undone and will permanently delete all orders and settings.',
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
              <p
                style={{ color: 'var(--admin-text-light)', fontSize: '0.85rem', marginTop: '8px' }}
              >
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
                onChange={(e) =>
                  setUserProfile({ ...userProfile, currentPassword: e.target.value })
                }
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
                onChange={(e) =>
                  setUserProfile({ ...userProfile, confirmPassword: e.target.value })
                }
                placeholder='********'
              />
            </div>
            <div className='form-group settings-action-group'>
              <button className='btn btn-primary' onClick={handleSaveUserProfile}>
                <i className='fa-solid fa-save'></i> Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theme' && (
        <div className='dashboard-card settings-theme-card'>
          <div className='settings-card-header'>
            <div className='settings-card-icon'>
              <i className='fa-solid fa-palette'></i>
            </div>
            <h3 className='dashboard-section-title'>Appearance</h3>
          </div>
          <div className='form-grid settings-theme-grid'>
            <div className='form-group'>
              <label>Theme (Light / Dark / Auto)</label>
              <div className='theme-options-group'>
                <label
                  className={`theme-option ${themeSettings.theme === 'light' ? 'active' : ''}`}
                >
                  <input
                    type='radio'
                    name='theme'
                    value='light'
                    checked={themeSettings.theme === 'light'}
                    onChange={(e) => handleThemeChange({ theme: e.target.value })}
                  />
                  <i className='fa-solid fa-sun'></i>
                  <span>Light</span>
                </label>
                <label className={`theme-option ${themeSettings.theme === 'dark' ? 'active' : ''}`}>
                  <input
                    type='radio'
                    name='theme'
                    value='dark'
                    checked={themeSettings.theme === 'dark'}
                    onChange={(e) => handleThemeChange({ theme: e.target.value })}
                  />
                  <i className='fa-solid fa-moon'></i>
                  <span>Dark</span>
                </label>
                <label className={`theme-option ${themeSettings.theme === 'auto' ? 'active' : ''}`}>
                  <input
                    type='radio'
                    name='theme'
                    value='auto'
                    checked={themeSettings.theme === 'auto'}
                    onChange={(e) => handleThemeChange({ theme: e.target.value })}
                  />
                  <i className='fa-solid fa-circle-half-stroke'></i>
                  <span>Auto</span>
                </label>
              </div>
            </div>
            <div className='form-group'>
              <label>Primary Color</label>
              <div className='color-picker-group'>
                <input
                  type='color'
                  value={themeSettings.primaryColor}
                  onChange={(e) => handleThemeChange({ primaryColor: e.target.value })}
                  className='color-picker-input'
                />
                <input
                  type='text'
                  className='input-field color-input'
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
                />
              </div>
              <div className='color-presets'>
                {['#449031', '#c45c2d', '#3b82f6', '#8b5cf6', '#ef4444', '#10b981'].map((color) => (
                  <button
                    key={color}
                    className={`color-preset ${themeSettings.primaryColor === color ? 'active' : ''}`}
                    onClick={() => handleThemeChange({ primaryColor: color })}
                    style={{ background: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <div className='form-group'>
              <label>Font Size</label>
              <select
                className='input-field'
                value={themeSettings.fontSize}
                onChange={(e) => {
                  const newFontSize = e.target.value;
                  handleThemeChange({ fontSize: newFontSize });
                  // Apply font size immediately - SCOPED TO ADMIN DASHBOARD
                  const applyFontSize = () => {
                    const adminDashboard = document.querySelector('.admin-dashboard');
                    if (adminDashboard) {
                      const fontSizeMap = {
                        small: '14px',
                        medium: '16px',
                        large: '18px',
                        'extra-large': '20px',
                      };
                      const fontSize = fontSizeMap[newFontSize] || '16px';
                      adminDashboard.style.setProperty('--admin-base-font-size', fontSize);
                      adminDashboard.style.fontSize = fontSize;
                      // Force reflow to ensure changes apply
                      adminDashboard.offsetHeight;
                    } else {
                      setTimeout(applyFontSize, 50);
                    }
                  };
                  applyFontSize();
                }}
              >
                <option value='small'>Small (14px)</option>
                <option value='medium'>Medium (16px)</option>
                <option value='large'>Large (18px)</option>
                <option value='extra-large'>Extra Large (20px)</option>
              </select>
              <div className='preview-box'>
                <p
                  style={{
                    fontSize:
                      themeSettings.fontSize === 'small'
                        ? '14px'
                        : themeSettings.fontSize === 'large'
                          ? '18px'
                          : themeSettings.fontSize === 'extra-large'
                            ? '20px'
                            : '16px',
                    margin: 0,
                  }}
                >
                  Preview: This is how text will look with {themeSettings.fontSize} font size.
                </p>
              </div>
            </div>
            <div className='form-group'>
              <label>Font Family</label>
              <select
                className='input-field'
                value={themeSettings.fontFamily}
                onChange={(e) => {
                  const newFontFamily = e.target.value;
                  handleThemeChange({ fontFamily: newFontFamily });
                  // Apply font family immediately - SCOPED TO ADMIN DASHBOARD
                  const applyFontFamily = () => {
                    const adminDashboard = document.querySelector('.admin-dashboard');
                    if (adminDashboard) {
                      const fontFamily = `'${newFontFamily}', sans-serif`;
                      adminDashboard.style.setProperty('--admin-font-family', fontFamily);
                      adminDashboard.style.fontFamily = fontFamily;
                      // Force reflow to ensure changes apply
                      adminDashboard.offsetHeight;
                    } else {
                      setTimeout(applyFontFamily, 50);
                    }
                  };
                  applyFontFamily();
                }}
              >
                <option value='Baloo 2'>Baloo 2 (Default)</option>
                <option value='Inter'>Inter</option>
                <option value='Poppins'>Poppins</option>
                <option value='Roboto'>Roboto</option>
                <option value='Open Sans'>Open Sans</option>
                <option value='Lato'>Lato</option>
                <option value='Montserrat'>Montserrat</option>
                <option value='Nunito'>Nunito</option>
                <option value='Raleway'>Raleway</option>
                <option value='Ubuntu'>Ubuntu</option>
                <option value='Al Bayan'>Al Bayan</option>
                <option value='Chalkboard'>Chalkboard</option>
                <option value='Cavolini'>Cavolini</option>
              </select>
              <div className='preview-box'>
                <p
                  style={{
                    fontFamily: `'${themeSettings.fontFamily}', sans-serif`,
                    margin: 0,
                  }}
                >
                  Preview: This is how text will look with {themeSettings.fontFamily} font.
                </p>
              </div>
            </div>
            <div className='form-group settings-action-group'>
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
