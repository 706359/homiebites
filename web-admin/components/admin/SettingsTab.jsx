import { useEffect, useState } from 'react';
import { useAutoKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance';
import PremiumLoader from './PremiumLoader.jsx';
import './styles/settings-tab.css';

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
  const [activeTab, setActiveTab] = useState('general');

  useAutoKeyboardAvoidance({
    containerSelector: '.admin-content',
    inputSelector: 'input, textarea, select',
  });

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

  // Theme and font size settings removed - not available in Settings tab

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

  const settingsTabs = [
    { id: 'general', label: 'General', icon: 'fa-cog', description: 'Business & Pricing' },
    { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart', description: 'Order Configuration' },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'fa-bell',
      description: 'Alerts & Preferences',
    },
    { id: 'data', label: 'Data', icon: 'fa-database', description: 'Backup & Restore' },
    { id: 'profile', label: 'Profile', icon: 'fa-user', description: 'User Account' },
  ];

  return (
    <div className='admin-content'>
      <div className='dashboard-card filter-bar-card filter-bar-compact margin-bottom-24'>
        <div className='filter-bar-container-compact'>
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              className={`btn btn-ghost ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.description}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='settings-tab-content-wrapper'>
        {activeTab === 'general' && (
          <div className='admin-stats'>
            <div className='dashboard-card'>
              <div className='settings-section-header'>
                <div className='settings-section-icon-wrapper'>
                  <i className='fa-solid fa-building'></i>
                </div>
                <div className='settings-section-title-wrapper'>
                  <h3 className='settings-section-title'>Business Information</h3>
                  <p className='settings-section-subtitle'>
                    Manage your business details and contact information
                  </p>
                </div>
              </div>
              <div className='settings-section-body'>
                <div className='settings-form-grid'>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-store'></i>
                      <span>Business Name</span>
                    </label>
                    <input
                      type='text'
                      className='settings-input-field'
                      value={businessInfo.businessName}
                      onChange={(e) =>
                        setBusinessInfo({ ...businessInfo, businessName: e.target.value })
                      }
                      placeholder='Enter business name'
                    />
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-phone'></i>
                      <span>Contact Number</span>
                    </label>
                    <input
                      type='tel'
                      className='settings-input-field'
                      value={businessInfo.contact}
                      onChange={(e) =>
                        setBusinessInfo({ ...businessInfo, contact: e.target.value })
                      }
                      placeholder='+91 1234567890'
                    />
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-envelope'></i>
                      <span>Email Address</span>
                    </label>
                    <input
                      type='email'
                      className='settings-input-field'
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                      placeholder='business@example.com'
                    />
                  </div>
                  <div className='settings-form-group settings-form-group-full'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-location-dot'></i>
                      <span>Business Address</span>
                    </label>
                    <textarea
                      className='settings-input-field'
                      value={businessInfo.address}
                      onChange={(e) =>
                        setBusinessInfo({ ...businessInfo, address: e.target.value })
                      }
                      rows={3}
                      placeholder='Enter complete business address'
                    />
                  </div>
                </div>
                <div className='settings-section-actions'>
                  <button className='btn btn-primary btn-large' onClick={handleSaveBusinessInfo}>
                    <i className='fa-solid fa-save'></i>
                    <span>Save Business Information</span>
                  </button>
                </div>
              </div>
            </div>

            <div className='dashboard-card'>
              <div className='settings-section-header'>
                <div className='settings-section-icon-wrapper'>
                  <i className='fa-solid fa-indian-rupee-sign'></i>
                </div>
                <div className='settings-section-title-wrapper'>
                  <h3 className='settings-section-title'>Pricing Configuration</h3>
                  <p className='settings-section-subtitle'>
                    Set default prices for your menu items
                  </p>
                </div>
              </div>
              <div className='settings-section-body'>
                <div className='settings-form-grid'>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-tag'></i>
                      <span>Default Unit Price</span>
                    </label>
                    <div className='settings-input-with-symbol'>
                      <span className='settings-input-symbol'>₹</span>
                      <input
                        type='number'
                        className='settings-input-field'
                        value={pricing.defaultUnitPrice}
                        onChange={(e) =>
                          setPricing({
                            ...pricing,
                            defaultUnitPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder='100'
                        min='0'
                      />
                    </div>
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-sun'></i>
                      <span>Lunch Price</span>
                    </label>
                    <div className='settings-input-with-symbol'>
                      <span className='settings-input-symbol'>₹</span>
                      <input
                        type='number'
                        className='settings-input-field'
                        value={pricing.lunchPrice}
                        onChange={(e) =>
                          setPricing({ ...pricing, lunchPrice: parseFloat(e.target.value) || 0 })
                        }
                        placeholder='100'
                        min='0'
                      />
                    </div>
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-moon'></i>
                      <span>Dinner Price</span>
                    </label>
                    <div className='settings-input-with-symbol'>
                      <span className='settings-input-symbol'>₹</span>
                      <input
                        type='number'
                        className='settings-input-field'
                        value={pricing.dinnerPrice}
                        onChange={(e) =>
                          setPricing({ ...pricing, dinnerPrice: parseFloat(e.target.value) || 0 })
                        }
                        placeholder='100'
                        min='0'
                      />
                    </div>
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-box'></i>
                      <span>Minimum Order Quantity</span>
                    </label>
                    <input
                      type='number'
                      className='settings-input-field'
                      value={pricing.minimumOrderQty}
                      onChange={(e) =>
                        setPricing({ ...pricing, minimumOrderQty: parseInt(e.target.value) || 1 })
                      }
                      placeholder='1'
                      min={1}
                    />
                  </div>
                </div>
                <div className='settings-section-actions'>
                  <button className='btn btn-primary btn-large' onClick={handleSavePricing}>
                    <i className='fa-solid fa-save'></i>
                    <span>Update Pricing</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className='dashboard-card'>
            <div className='dashboard-section-header'>
              <div className='dashboard-section-icon-wrapper'>
                <i className='fa-solid fa-shopping-cart'></i>
              </div>
              <div className='dashboard-section-title-wrapper'>
                <h3 className='dashboard-section-title'>Order Configuration</h3>
                <p className='dashboard-section-subtitle'>
                  Configure how orders are created and managed
                </p>
              </div>
            </div>
            <div className='settings-section-body'>
              <div className='settings-form-grid'>
                <div className='settings-form-group'>
                  <label className='settings-form-label'>
                    <i className='fa-solid fa-hashtag'></i>
                    <span>Order ID Prefix</span>
                  </label>
                  <input
                    type='text'
                    className='settings-input-field'
                    value={orderSettings.orderIdPrefix}
                    onChange={(e) =>
                      setOrderSettings({ ...orderSettings, orderIdPrefix: e.target.value })
                    }
                    placeholder='HB-'
                  />
                  <p className='settings-form-hint'>
                    Orders will be numbered as: {orderSettings.orderIdPrefix}001,{' '}
                    {orderSettings.orderIdPrefix}002, etc.
                  </p>
                </div>

                <div className='settings-toggle-group'>
                  <div className='settings-toggle-item'>
                    <div className='settings-toggle-content'>
                      <div className='settings-toggle-label-wrapper'>
                        <i className='fa-solid fa-magic'></i>
                        <div>
                          <span className='settings-toggle-label'>Auto-generate Order ID</span>
                          <span className='settings-toggle-description'>
                            Automatically create unique order IDs
                          </span>
                        </div>
                      </div>
                      <label className='settings-toggle-switch'>
                        <input
                          type='checkbox'
                          checked={orderSettings.autoGenerateOrderId}
                          onChange={(e) =>
                            setOrderSettings({
                              ...orderSettings,
                              autoGenerateOrderId: e.target.checked,
                            })
                          }
                        />
                        <span className='settings-toggle-slider'></span>
                      </label>
                    </div>
                  </div>

                  <div className='settings-toggle-item'>
                    <div className='settings-toggle-content'>
                      <div className='settings-toggle-label-wrapper'>
                        <i className='fa-solid fa-copy'></i>
                        <div>
                          <span className='settings-toggle-label'>Allow Duplicate Address</span>
                          <span className='settings-toggle-description'>
                            Allow multiple orders with same address
                          </span>
                        </div>
                      </div>
                      <label className='settings-toggle-switch'>
                        <input
                          type='checkbox'
                          checked={orderSettings.allowDuplicateAddress}
                          onChange={(e) =>
                            setOrderSettings({
                              ...orderSettings,
                              allowDuplicateAddress: e.target.checked,
                            })
                          }
                        />
                        <span className='settings-toggle-slider'></span>
                      </label>
                    </div>
                  </div>

                  <div className='settings-toggle-item'>
                    <div className='settings-toggle-content'>
                      <div className='settings-toggle-label-wrapper'>
                        <i className='fa-solid fa-shield-halved'></i>
                        <div>
                          <span className='settings-toggle-label'>
                            Require Payment Confirmation
                          </span>
                          <span className='settings-toggle-description'>
                            Confirm payment before marking as paid
                          </span>
                        </div>
                      </div>
                      <label className='settings-toggle-switch'>
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
                        <span className='settings-toggle-slider'></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className='settings-form-group settings-form-group-full'>
                  <label className='settings-form-label'>
                    <i className='fa-solid fa-list-check'></i>
                    <span>Order Status Options</span>
                  </label>
                  <div className='settings-status-list'>
                    {orderSettings.statusOptions.map((status, idx) => (
                      <div key={idx} className='settings-status-item'>
                        <i className='fa-solid fa-circle indicator-circle-small'></i>
                        <span>{status}</span>
                      </div>
                    ))}
                    <button className='btn btn-ghost btn-small settings-add-status-btn'>
                      <i className='fa-solid fa-plus'></i>
                      <span>Add Status</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className='settings-section-actions'>
                <button className='btn btn-primary btn-large' onClick={handleSaveOrderSettings}>
                  <i className='fa-solid fa-save'></i>
                  <span>Save Order Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className='dashboard-card'>
            <div className='settings-section-header'>
              <div className='settings-section-icon-wrapper'>
                <i className='fa-solid fa-bell'></i>
              </div>
              <div className='settings-section-title-wrapper'>
                <h3 className='settings-section-title'>Notification Preferences</h3>
                <p className='settings-section-subtitle'>
                  Configure how and when you receive notifications
                </p>
              </div>
            </div>
            <div className='settings-section-body'>
              <div className='settings-notification-categories'>
                <div className='settings-notification-category'>
                  <div className='settings-notification-category-header'>
                    <i className='fa-solid fa-envelope'></i>
                    <h4 className='settings-notification-category-title'>Email Notifications</h4>
                  </div>
                  <div className='settings-toggle-group'>
                    <div className='settings-toggle-item'>
                      <div className='settings-toggle-content'>
                        <div className='settings-toggle-label-wrapper'>
                          <i className='fa-solid fa-calendar-day'></i>
                          <div>
                            <span className='settings-toggle-label'>Daily Summary</span>
                            <span className='settings-toggle-description'>
                              Receive daily order summary via email
                            </span>
                          </div>
                        </div>
                        <label className='settings-toggle-switch'>
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
                          <span className='settings-toggle-slider'></span>
                        </label>
                      </div>
                    </div>

                    <div className='settings-toggle-item'>
                      <div className='settings-toggle-content'>
                        <div className='settings-toggle-label-wrapper'>
                          <i className='fa-solid fa-bell'></i>
                          <div>
                            <span className='settings-toggle-label'>New Order Alert</span>
                            <span className='settings-toggle-description'>
                              Get notified when a new order is placed
                            </span>
                          </div>
                        </div>
                        <label className='settings-toggle-switch'>
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
                          <span className='settings-toggle-slider'></span>
                        </label>
                      </div>
                    </div>

                    <div className='settings-toggle-item'>
                      <div className='settings-toggle-content'>
                        <div className='settings-toggle-label-wrapper'>
                          <i className='fa-solid fa-money-bill-wave'></i>
                          <div>
                            <span className='settings-toggle-label'>Payment Received</span>
                            <span className='settings-toggle-description'>
                              Alert when payment is received
                            </span>
                          </div>
                        </div>
                        <label className='settings-toggle-switch'>
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
                          <span className='settings-toggle-slider'></span>
                        </label>
                      </div>
                    </div>

                    <div className='settings-toggle-item'>
                      <div className='settings-toggle-content'>
                        <div className='settings-toggle-label-wrapper'>
                          <i className='fa-solid fa-exclamation-triangle'></i>
                          <div>
                            <span className='settings-toggle-label'>Low Order Day Warning</span>
                            <span className='settings-toggle-description'>
                              Alert when daily orders are below average
                            </span>
                          </div>
                        </div>
                        <label className='settings-toggle-switch'>
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
                          <span className='settings-toggle-slider'></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='settings-notification-category'>
                  <div className='settings-notification-category-header'>
                    <i className='fa-solid fa-message'></i>
                    <h4 className='settings-notification-category-title'>SMS Notifications</h4>
                  </div>
                  <div className='settings-toggle-group'>
                    <div className='settings-toggle-item'>
                      <div className='settings-toggle-content'>
                        <div className='settings-toggle-label-wrapper'>
                          <i className='fa-solid fa-clock'></i>
                          <div>
                            <span className='settings-toggle-label'>Payment Reminders</span>
                            <span className='settings-toggle-description'>
                              Send SMS reminders for pending payments
                            </span>
                          </div>
                        </div>
                        <label className='settings-toggle-switch'>
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
                          <span className='settings-toggle-slider'></span>
                        </label>
                      </div>
                    </div>

                    <div className='settings-toggle-item'>
                      <div className='settings-toggle-content'>
                        <div className='settings-toggle-label-wrapper'>
                          <i className='fa-solid fa-check-circle'></i>
                          <div>
                            <span className='settings-toggle-label'>Order Confirmations</span>
                            <span className='settings-toggle-description'>
                              Send SMS when order is confirmed
                            </span>
                          </div>
                        </div>
                        <label className='settings-toggle-switch'>
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
                          <span className='settings-toggle-slider'></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='settings-section-actions'>
                <button className='btn btn-primary btn-large' onClick={handleSaveNotificationPrefs}>
                  <i className='fa-solid fa-save'></i>
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className='admin-stats'>
            <div className='dashboard-card'>
              <div className='settings-section-header'>
                <div className='settings-section-icon-wrapper'>
                  <i className='fa-solid fa-database'></i>
                </div>
                <div className='settings-section-title-wrapper'>
                  <h3 className='settings-section-title'>Backup & Restore</h3>
                  <p className='settings-section-subtitle'>
                    Manage your data backups and restore points
                  </p>
                </div>
              </div>
              <div className='settings-section-body'>
                <div className='settings-backup-info'>
                  <div className='settings-backup-info-item'>
                    <i className='fa-solid fa-clock'></i>
                    <div>
                      <span className='settings-backup-info-label'>Last Backup</span>
                      <span className='settings-backup-info-value'>
                        {settings?.lastBackup || '15-Jan-2025 09:30 AM'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='settings-backup-actions'>
                  <button className='btn btn-primary btn-large' onClick={handleBackup}>
                    <i className='fa-solid fa-save'></i>
                    <span>Create Backup Now</span>
                  </button>
                  <button className='btn btn-secondary btn-large' onClick={() => {}}>
                    <i className='fa-solid fa-download'></i>
                    <span>Download Backup</span>
                  </button>
                  <button className='btn btn-secondary btn-large' onClick={handleRestore}>
                    <i className='fa-solid fa-rotate'></i>
                    <span>Restore from Backup</span>
                  </button>
                </div>

                <div className='settings-form-group settings-form-group-full mt-2xl'>
                  <div className='settings-toggle-item'>
                    <div className='settings-toggle-content'>
                      <div className='settings-toggle-label-wrapper'>
                        <i className='fa-solid fa-clock-rotate-left'></i>
                        <div>
                          <span className='settings-toggle-label'>Enable Auto Backup</span>
                          <span className='settings-toggle-description'>
                            Automatically backup data daily
                          </span>
                        </div>
                      </div>
                      <label className='settings-toggle-switch'>
                        <input
                          type='checkbox'
                          checked={dataSettings.autoBackup}
                          onChange={(e) =>
                            setDataSettings({ ...dataSettings, autoBackup: e.target.checked })
                          }
                        />
                        <span className='settings-toggle-slider'></span>
                      </label>
                    </div>
                  </div>
                </div>

                {dataSettings.autoBackup && (
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-clock'></i>
                      <span>Auto Backup Time</span>
                    </label>
                    <input
                      type='time'
                      className='settings-input-field'
                      value={dataSettings.autoBackupTime}
                      onChange={(e) =>
                        setDataSettings({ ...dataSettings, autoBackupTime: e.target.value })
                      }
                    />
                    <p className='settings-form-hint'>
                      Daily backup will run automatically at this time
                    </p>
                  </div>
                )}

                {dataSettings.autoBackup && (
                  <div className='settings-section-actions'>
                    <button className='btn btn-primary btn-large' onClick={handleSaveDataSettings}>
                      <i className='fa-solid fa-save'></i>
                      <span>Save Backup Settings</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className='dashboard-card settings-danger-zone'>
              <div className='settings-section-header'>
                <div className='settings-section-icon-wrapper danger-zone-icon-wrapper'>
                  <i className='fa-solid fa-triangle-exclamation'></i>
                </div>
                <div className='settings-section-title-wrapper'>
                  <h3 className='settings-section-title danger-zone-title'>Danger Zone</h3>
                  <p className='settings-section-subtitle'>Irreversible and destructive actions</p>
                </div>
              </div>
              <div className='settings-section-body'>
                <div className='settings-danger-action'>
                  <div className='settings-danger-action-info'>
                    <i className='fa-solid fa-trash'></i>
                    <div>
                      <span className='settings-danger-action-label'>Clear All Data</span>
                      <span className='settings-danger-action-description'>
                        Permanently delete all orders, customers, and settings. This action cannot
                        be undone.
                      </span>
                    </div>
                  </div>
                  <button
                    className='btn btn-special danger btn-large'
                    onClick={() => {
                      if (showConfirmation && onClearAllData) {
                        showConfirmation({
                          title: 'Clear All Data',
                          message:
                            'Are you sure you want to clear ALL data? This action cannot be undone and will permanently delete all orders and settings.',
                          type: 'danger',
                          confirmText: 'Clear All Data',
                          onConfirm: async () => {
                            await onClearAllData(true);
                          },
                        });
                      } else if (onClearAllData) {
                        onClearAllData(true);
                      }
                    }}
                  >
                    <i className='fa-solid fa-trash'></i>
                    <span>Clear All Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className='admin-stats'>
            <div className='dashboard-card'>
              <div className='settings-section-header'>
                <div className='settings-section-icon-wrapper'>
                  <i className='fa-solid fa-user'></i>
                </div>
                <div className='settings-section-title-wrapper'>
                  <h3 className='settings-section-title'>Profile Information</h3>
                  <p className='settings-section-subtitle'>Update your personal account details</p>
                </div>
              </div>
              <div className='settings-section-body'>
                <div className='settings-form-grid'>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-user'></i>
                      <span>Full Name</span>
                    </label>
                    <input
                      type='text'
                      className='settings-input-field'
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      placeholder='Enter your full name'
                    />
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-envelope'></i>
                      <span>Email Address</span>
                    </label>
                    <input
                      type='email'
                      className='settings-input-field'
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      placeholder='your.email@example.com'
                    />
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-phone'></i>
                      <span>Phone Number</span>
                    </label>
                    <input
                      type='tel'
                      className='settings-input-field'
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      placeholder='+91 1234567890'
                    />
                  </div>
                </div>
                <div className='settings-section-actions'>
                  <button className='btn btn-primary btn-large' onClick={handleSaveUserProfile}>
                    <i className='fa-solid fa-save'></i>
                    <span>Update Profile</span>
                  </button>
                </div>
              </div>
            </div>

            <div className='dashboard-card'>
              <div className='settings-section-header'>
                <div className='settings-section-icon-wrapper'>
                  <i className='fa-solid fa-lock'></i>
                </div>
                <div className='settings-section-title-wrapper'>
                  <h3 className='settings-section-title'>Change Password</h3>
                  <p className='settings-section-subtitle'>
                    Update your account password for better security
                  </p>
                </div>
              </div>
              <div className='settings-section-body'>
                <div className='settings-form-grid'>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-key'></i>
                      <span>Current Password</span>
                    </label>
                    <input
                      type='password'
                      className='settings-input-field'
                      value={userProfile.currentPassword}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, currentPassword: e.target.value })
                      }
                      placeholder='Enter current password'
                    />
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-lock'></i>
                      <span>New Password</span>
                    </label>
                    <input
                      type='password'
                      className='settings-input-field'
                      value={userProfile.newPassword}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, newPassword: e.target.value })
                      }
                      placeholder='Enter new password'
                    />
                  </div>
                  <div className='settings-form-group'>
                    <label className='settings-form-label'>
                      <i className='fa-solid fa-lock'></i>
                      <span>Confirm New Password</span>
                    </label>
                    <input
                      type='password'
                      className='settings-input-field'
                      value={userProfile.confirmPassword}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, confirmPassword: e.target.value })
                      }
                      placeholder='Confirm new password'
                    />
                  </div>
                </div>
                <div className='settings-section-actions'>
                  <button className='btn btn-primary btn-large' onClick={handleSaveUserProfile}>
                    <i className='fa-solid fa-save'></i>
                    <span>Update Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme tab removed - appearance settings moved to Reports tab */}
      </div>
    </div>
  );
};

export default SettingsTab;
