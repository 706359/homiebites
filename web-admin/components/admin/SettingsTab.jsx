import { useEffect, useState } from 'react';
import { useAutoKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance';
import PremiumLoader from './PremiumLoader.jsx';
import {
  parseFontSize,
  applyAdminFontSize,
  roundToStep,
  ADMIN_FONT_SIZE_MIN,
  ADMIN_FONT_SIZE_MAX,
  ADMIN_FONT_SIZE_STEP,
  ADMIN_FONT_SIZE_DEFAULT,
} from './utils/fontSize.js';

// Google Fonts available for admin UI – names must match fonts.googleapis.com
const FONT_OPTIONS = [
  { value: 'Baloo 2', label: 'Baloo 2' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Source Sans 3', label: 'Source Sans 3' },
  { value: 'Work Sans', label: 'Work Sans' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Figtree', label: 'Figtree' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Manrope', label: 'Manrope' },
  { value: 'Lexend', label: 'Lexend' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Karla', label: 'Karla' },
  { value: 'Raleway', label: 'Raleway' },
];

const SettingsTab = ({
  settings,
  onUpdateSettings,
  onBackup,
  onRestore,
  onClearAllData,
  onClearAllMenuItems,
  showNotification,
  loading = false,
  showConfirmation,
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [newStatus, setNewStatus] = useState('');
  const [showStatusInput, setShowStatusInput] = useState(false);

  useAutoKeyboardAvoidance({
    containerSelector: '.admin-content',
    inputSelector: 'input, textarea, select',
  });

  const [businessInfo, setBusinessInfo] = useState({
    businessName: settings?.businessName || 'HomieBites',
    contact: settings?.contact || '',
    email: settings?.email || '',
    address: settings?.address || '',
    whatsappNumber: settings?.whatsappNumber || '',
    deliveryTimings: settings?.deliveryTimings || '',
    minOrderValue: settings?.minOrderValue || 0,
    deliveryCharge: settings?.deliveryCharge || 0,
    announcement: settings?.announcement || '',
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

  // Initialize appearance settings - properly handle false values
  const getInitialAppearanceSettings = () => {
    if (!settings) {
      return {
        fontFamily: 'Baloo 2',
        fontSize: ADMIN_FONT_SIZE_DEFAULT,
        autoHideSidebar: false,
      };
    }
    // Properly handle autoHideSidebar: check if property exists and is explicitly set
    // If undefined or null, it means it was never set, so default to false
    // If it exists (even if true), use the actual value
    const autoHideSidebar = settings.autoHideSidebar !== undefined && settings.autoHideSidebar !== null
      ? Boolean(settings.autoHideSidebar)
      : false;
    
    return {
      fontFamily: settings.fontFamily || 'Baloo 2',
      fontSize: ADMIN_FONT_SIZE_DEFAULT,
      autoHideSidebar,
    };
  };

  const [appearanceSettings, setAppearanceSettings] = useState(getInitialAppearanceSettings());

  // Initialize kitchen settings - properly handle false values
  const getInitialKitchenSettings = () => {
    if (!settings) {
      return {
        kitchenEnabled: true,
        kitchenClosedFrom: '',
        kitchenClosedTo: '',
      };
    }
    // If kitchenEnabled is explicitly false, use false; otherwise default to true
    const kitchenEnabled = settings.kitchenEnabled === false ? false : (settings.kitchenEnabled === true ? true : true);
    return {
      kitchenEnabled,
      kitchenClosedFrom: settings.kitchenClosedFrom || '',
      kitchenClosedTo: settings.kitchenClosedTo || '',
    };
  };

  const [kitchenSettings, setKitchenSettings] = useState(getInitialKitchenSettings());

  // Update kitchen settings when settings prop changes (on load/refresh)
  useEffect(() => {
    if (settings) {
      // Properly handle false values - if explicitly false, keep it false
      const kitchenEnabled = settings.kitchenEnabled === false 
        ? false 
        : (settings.kitchenEnabled === true ? true : true);
      
      setKitchenSettings({
        kitchenEnabled,
        kitchenClosedFrom: settings.kitchenClosedFrom || '',
        kitchenClosedTo: settings.kitchenClosedTo || '',
      });
    }
  }, [settings?.kitchenEnabled, settings?.kitchenClosedFrom, settings?.kitchenClosedTo]);

  // Update appearance settings when settings prop changes (on load/refresh)
  useEffect(() => {
    if (settings) {
      const fromSettings = settings.fontFamily;
      const fromStorage =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('homiebites_font_family')
          : null;
      
      // Priority: localStorage > settings from API > default
      // localStorage is the source of truth for the current session
      const fontSizeFromStorage = typeof localStorage !== 'undefined'
        ? localStorage.getItem('homiebites_font_size')
        : null;
      const fontSizeFromSettings = settings.fontSize;
      
      // Always prioritize localStorage if it exists (user's current preference)
      // Only fall back to settings from API if localStorage is empty
      const fs =
        parseFontSize(fontSizeFromStorage || fontSizeFromSettings) ?? ADMIN_FONT_SIZE_DEFAULT;
      
      // Properly handle autoHideSidebar: check if property exists and is explicitly set
      // If undefined or null, preserve current local state (don't reset to default)
      // If it exists (even if false), use the actual value from settings
      const autoHideSidebarFromSettings = settings.autoHideSidebar !== undefined && settings.autoHideSidebar !== null
        ? Boolean(settings.autoHideSidebar)
        : null; // null means not set in settings yet
      
      setAppearanceSettings((prev) => {
        // Only update if the value actually changed to prevent unnecessary re-renders
        const newFontSize = fs;
        const newFontFamily = fromSettings || fromStorage || 'Baloo 2';
        
        // For autoHideSidebar: use value from settings if explicitly set, otherwise preserve local state
        // This prevents resetting to default when settings reloads before save completes
        const newAutoHideSidebar = autoHideSidebarFromSettings !== null
          ? autoHideSidebarFromSettings // Use value from settings if explicitly set
          : (prev.autoHideSidebar !== undefined ? prev.autoHideSidebar : false); // Preserve local state or default to false
        
        if (prev.fontSize === newFontSize && 
            prev.fontFamily === newFontFamily && 
            prev.autoHideSidebar === newAutoHideSidebar) {
          return prev; // No change needed
        }
        
        return {
          ...prev,
          fontFamily: newFontFamily,
          fontSize: newFontSize,
          autoHideSidebar: newAutoHideSidebar,
        };
      });
      
      // Apply font size immediately on load
      if (fs != null) {
        applyAdminFontSize(fs);
      }
    }
  }, [settings?.fontFamily, settings?.fontSize, settings?.autoHideSidebar]);

  const handleSaveAppearance = () => {
    const saveSettings = async () => {
      // Ensure font size is applied before saving
      const fontSize = appearanceSettings.fontSize ?? ADMIN_FONT_SIZE_DEFAULT;
      const fontSizeString = String(fontSize);
      
      // Save to localStorage immediately (this is the source of truth)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('homiebites_font_size', fontSizeString);
        localStorage.setItem('homiebites_font_family', appearanceSettings.fontFamily);
      }
      
      // Apply font size immediately
      applyAdminFontSize(fontSize);
      
      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent('adminFontSizeChanged', { detail: { fontSize } })
      );
      
      // Save to database (as string to match schema)
      if (onUpdateSettings) {
        await onUpdateSettings({
          themeSettings: {
            fontFamily: appearanceSettings.fontFamily,
            fontSize: fontSizeString, // Save as string
            autoHideSidebar: appearanceSettings.autoHideSidebar,
          },
        });
      }
      
      // Update local state to prevent reset on reload
      // Include autoHideSidebar to preserve the saved value
      setAppearanceSettings((prev) => ({
        ...prev,
        fontSize: fontSize,
        autoHideSidebar: appearanceSettings.autoHideSidebar, // Preserve the saved value
      }));
      
      if (showNotification) {
        showNotification('Appearance settings saved successfully', 'success');
      }
    };

    if (showConfirmation) {
      showConfirmation({
        title: 'Save appearance',
        message: 'Apply this font style and size to your admin dashboard?',
        type: 'info',
        confirmText: 'Save',
        onConfirm: saveSettings,
      });
    } else {
      saveSettings();
    }
  };

  const applyFontSize = (v) => {
    const px = roundToStep(Number(v));
    setAppearanceSettings((p) => ({ ...p, fontSize: px }));
    if (typeof localStorage !== 'undefined')
      localStorage.setItem('homiebites_font_size', String(px));
    applyAdminFontSize(px);
    window.dispatchEvent(
      new CustomEvent('adminFontSizeChanged', { detail: { fontSize: px } })
    );
  };

  const handleSaveBusinessInfo = () => {
    if (showConfirmation) {
      showConfirmation({
        title: 'Save Business Information',
        message:
          'Are you sure you want to save changes to business information?',
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

  const handleSaveKitchenSettings = () => {
    // Validate date range if kitchen is disabled
    if (!kitchenSettings.kitchenEnabled) {
      if (kitchenSettings.kitchenClosedFrom && kitchenSettings.kitchenClosedTo) {
        const fromDate = new Date(kitchenSettings.kitchenClosedFrom);
        const toDate = new Date(kitchenSettings.kitchenClosedTo);
        if (toDate < fromDate) {
          if (showNotification) {
            showNotification('End date must be after start date', 'error');
          }
          return;
        }
        // Check if range is at least 2 days
        const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
        if (daysDiff < 1) {
          if (showNotification) {
            showNotification('Date range must be at least 2 days', 'error');
          }
          return;
        }
      }
    }

    if (showConfirmation) {
      showConfirmation({
        title: 'Save Kitchen Settings',
        message: 'Are you sure you want to save changes to kitchen status?',
        type: 'info',
        confirmText: 'Save',
        onConfirm: () => {
          if (onUpdateSettings) {
            onUpdateSettings({ kitchenSettings });
          }
        },
      });
    } else {
      if (onUpdateSettings) {
        onUpdateSettings({ kitchenSettings });
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
        message:
          'Are you sure you want to save changes to notification preferences?',
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
    if (
      userProfile.newPassword &&
      userProfile.newPassword !== userProfile.confirmPassword
    ) {
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
            if (showNotification)
              showNotification('Backup created successfully', 'success');
          }
        },
      });
    } else {
      if (onBackup) {
        await onBackup();
        if (showNotification)
          showNotification('Backup created successfully', 'success');
      }
    }
  };

  const handleDownloadBackup = async () => {
    try {
      if (onBackup) {
        // Create backup first, then download it
        await onBackup();
        if (showNotification)
          showNotification('Backup downloaded successfully', 'success');
      } else {
        if (showNotification)
          showNotification('Backup functionality not available', 'error');
      }
    } catch (error) {
      if (showNotification)
        showNotification('Failed to download backup', 'error');
    }
  };

  const handleExportSettings = () => {
    try {
      const settingsToExport = {
        businessInfo,
        pricing,
        orderSettings,
        notificationPrefs,
        dataSettings,
        userProfile: {
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
        },
        appearanceSettings,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(settingsToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `homiebites-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (showNotification)
        showNotification('Settings exported successfully', 'success');
    } catch (error) {
      if (showNotification)
        showNotification('Failed to export settings', 'error');
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
            if (showNotification)
              showNotification('Data restored successfully', 'success');
          }
        },
      });
    } else {
      if (onRestore) {
        await onRestore();
        if (showNotification)
          showNotification('Data restored successfully', 'success');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <PremiumLoader message="Loading settings..." size="large" />
      </div>
    );
  }

  const settingsTabs = [
    {
      id: 'general',
      label: 'General',
      icon: 'fa-cog',
      description: 'Business & Pricing',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: 'fa-shopping-cart',
      description: 'Order Configuration',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'fa-bell',
      description: 'Alerts & Preferences',
    },
    {
      id: 'data',
      label: 'Data',
      icon: 'fa-database',
      description: 'Backup & Restore',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'fa-user',
      description: 'User Account',
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: 'fa-palette',
      description: 'Font & display',
    },
  ];

  return (
    <div className="admin-content">
      <div className="dashboard-card filter-bar-card filter-bar-compact margin-bottom-24">
        <div className="filter-bar-container-compact">
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

      <div className="settings-tab-content-wrapper">
        {activeTab === 'general' && (
          <div className="admin-stats">
            <div className="dashboard-card">
              <div className="settings-section-header">
                <div className="settings-section-icon-wrapper">
                  <i className="fa-solid fa-building"></i>
                </div>
                <div className="settings-section-title-wrapper">
                  <h3 className="settings-section-title">
                    Business Information
                  </h3>
                  <p className="settings-section-subtitle">
                    Manage your business details and contact information
                  </p>
                </div>
              </div>
              <div className="settings-section-body">
                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-store"></i>
                      <span>Business Name</span>
                    </label>
                    <input
                      type="text"
                      className="settings-input-field"
                      value={businessInfo.businessName}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          businessName: e.target.value,
                        })
                      }
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-phone"></i>
                      <span>Contact Number</span>
                    </label>
                    <input
                      type="tel"
                      className="settings-input-field"
                      value={businessInfo.contact}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          contact: e.target.value,
                        })
                      }
                      placeholder="+91 1234567890"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-envelope"></i>
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      className="settings-input-field"
                      value={businessInfo.email}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          email: e.target.value,
                        })
                      }
                      placeholder="business@example.com"
                    />
                  </div>
                  <div className="settings-form-group settings-form-group-full">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>Business Address</span>
                    </label>
                    <textarea
                      className="settings-input-field"
                      value={businessInfo.address}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          address: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Enter complete business address"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-brands fa-whatsapp"></i>
                      <span>WhatsApp Number</span>
                    </label>
                    <input
                      type="tel"
                      className="settings-input-field"
                      value={businessInfo.whatsappNumber}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          whatsappNumber: e.target.value,
                        })
                      }
                      placeholder="919958983578"
                    />
                    <p className="settings-form-hint">
                      Enter WhatsApp number without + or spaces (e.g., 919958983578)
                    </p>
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-clock"></i>
                      <span>Delivery Timings</span>
                    </label>
                    <input
                      type="text"
                      className="settings-input-field"
                      value={businessInfo.deliveryTimings}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          deliveryTimings: e.target.value,
                        })
                      }
                      placeholder="7:30 PM - 8:30 PM"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-indian-rupee-sign"></i>
                      <span>Minimum Order Value</span>
                    </label>
                    <div className="settings-input-with-symbol">
                      <span className="settings-input-symbol">₹</span>
                      <input
                        type="number"
                        className="settings-input-field"
                        value={businessInfo.minOrderValue}
                        onChange={(e) =>
                          setBusinessInfo({
                            ...businessInfo,
                            minOrderValue: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-truck"></i>
                      <span>Delivery Charge</span>
                    </label>
                    <div className="settings-input-with-symbol">
                      <span className="settings-input-symbol">₹</span>
                      <input
                        type="number"
                        className="settings-input-field"
                        value={businessInfo.deliveryCharge}
                        onChange={(e) =>
                          setBusinessInfo({
                            ...businessInfo,
                            deliveryCharge: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="settings-form-group settings-form-group-full">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-bullhorn"></i>
                      <span>Announcement</span>
                    </label>
                    <textarea
                      className="settings-input-field"
                      value={businessInfo.announcement}
                      onChange={(e) =>
                        setBusinessInfo({
                          ...businessInfo,
                          announcement: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Home delivery on orders over ₹200"
                    />
                    <p className="settings-form-hint">
                      This message will be displayed on the website
                    </p>
                  </div>
                </div>
                <div className="settings-section-actions">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handleSaveBusinessInfo}
                  >
                    <i className="fa-solid fa-save"></i>
                    <span>Save Business Information</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="settings-section-header">
                <div className="settings-section-icon-wrapper">
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                </div>
                <div className="settings-section-title-wrapper">
                  <h3 className="settings-section-title">
                    Pricing Configuration
                  </h3>
                  <p className="settings-section-subtitle">
                    Set default prices for your menu items
                  </p>
                </div>
              </div>
              <div className="settings-section-body">
                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-tag"></i>
                      <span>Default Unit Price</span>
                    </label>
                    <div className="settings-input-with-symbol">
                      <span className="settings-input-symbol">₹</span>
                      <input
                        type="number"
                        className="settings-input-field"
                        value={pricing.defaultUnitPrice}
                        onChange={(e) =>
                          setPricing({
                            ...pricing,
                            defaultUnitPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-sun"></i>
                      <span>Lunch Price</span>
                    </label>
                    <div className="settings-input-with-symbol">
                      <span className="settings-input-symbol">₹</span>
                      <input
                        type="number"
                        className="settings-input-field"
                        value={pricing.lunchPrice}
                        onChange={(e) =>
                          setPricing({
                            ...pricing,
                            lunchPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-moon"></i>
                      <span>Dinner Price</span>
                    </label>
                    <div className="settings-input-with-symbol">
                      <span className="settings-input-symbol">₹</span>
                      <input
                        type="number"
                        className="settings-input-field"
                        value={pricing.dinnerPrice}
                        onChange={(e) =>
                          setPricing({
                            ...pricing,
                            dinnerPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="100"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-box"></i>
                      <span>Minimum Order Quantity</span>
                    </label>
                    <input
                      type="number"
                      className="settings-input-field"
                      value={pricing.minimumOrderQty}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          minimumOrderQty: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="1"
                      min={1}
                    />
                  </div>
                </div>
                <div className="settings-section-actions">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handleSavePricing}
                  >
                    <i className="fa-solid fa-save"></i>
                    <span>Update Pricing</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Kitchen Settings Section */}
            <div className="dashboard-card" style={{ marginTop: '24px' }}>
              <div className="settings-section-header">
                <div className="settings-section-icon-wrapper">
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <div className="settings-section-title-wrapper">
                  <h3 className="settings-section-title">Kitchen Status</h3>
                  <p className="settings-section-subtitle">
                    Control when the kitchen is open or closed for orders
                  </p>
                </div>
              </div>
              <div className="settings-section-body">
                <div className="settings-form-grid">
                  <div className="settings-form-group-full">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-toggle-on"></i>
                      <span>Kitchen Status</span>
                    </label>
                    <div className="settings-toggle-switch-wrapper">
                      <label className="settings-toggle-switch">
                        <input
                          type="checkbox"
                          checked={kitchenSettings.kitchenEnabled}
                          onChange={(e) => {
                            setKitchenSettings({
                              ...kitchenSettings,
                              kitchenEnabled: e.target.checked,
                              // Clear dates when enabling kitchen
                              kitchenClosedFrom: e.target.checked ? '' : kitchenSettings.kitchenClosedFrom,
                              kitchenClosedTo: e.target.checked ? '' : kitchenSettings.kitchenClosedTo,
                            });
                          }}
                        />
                        <span className="settings-toggle-slider"></span>
                      </label>
                      <span className="settings-toggle-label">
                        {kitchenSettings.kitchenEnabled ? 'Kitchen is Open' : 'Kitchen is Closed'}
                      </span>
                    </div>
                    <p className="settings-helper-text">
                      {kitchenSettings.kitchenEnabled
                        ? 'Kitchen is currently accepting orders. Use date range below to schedule future closures.'
                        : 'Kitchen is closed. Set date range below for extended closure (minimum 2 days), or leave empty to close for today only.'}
                    </p>
                  </div>

                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-calendar-alt"></i>
                      <span>Closed From Date</span>
                      {!kitchenSettings.kitchenEnabled && (
                        <span style={{ color: '#ef4444', marginLeft: '8px' }}>*</span>
                      )}
                    </label>
                    <input
                      type="date"
                      className="settings-input-field"
                      value={kitchenSettings.kitchenClosedFrom}
                      onChange={(e) =>
                        setKitchenSettings({
                          ...kitchenSettings,
                          kitchenClosedFrom: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split('T')[0]}
                      disabled={kitchenSettings.kitchenEnabled && !kitchenSettings.kitchenClosedFrom}
                      style={{
                        opacity: kitchenSettings.kitchenEnabled && !kitchenSettings.kitchenClosedFrom ? 0.6 : 1,
                      }}
                    />
                    <p className="settings-helper-text">
                      {kitchenSettings.kitchenEnabled
                        ? 'Start date for scheduled kitchen closure (optional - for future planning)'
                        : 'Start date for kitchen closure (optional - leave empty to close for today only)'}
                    </p>
                  </div>

                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-calendar-check"></i>
                      <span>Closed To Date</span>
                      {!kitchenSettings.kitchenEnabled && (
                        <span style={{ color: '#ef4444', marginLeft: '8px' }}>*</span>
                      )}
                    </label>
                    <input
                      type="date"
                      className="settings-input-field"
                      value={kitchenSettings.kitchenClosedTo}
                      onChange={(e) =>
                        setKitchenSettings({
                          ...kitchenSettings,
                          kitchenClosedTo: e.target.value,
                        })
                      }
                      min={
                        kitchenSettings.kitchenClosedFrom ||
                        new Date().toISOString().split('T')[0]
                      }
                      disabled={kitchenSettings.kitchenEnabled && !kitchenSettings.kitchenClosedFrom}
                      style={{
                        opacity: kitchenSettings.kitchenEnabled && !kitchenSettings.kitchenClosedFrom ? 0.6 : 1,
                      }}
                    />
                    <p className="settings-helper-text">
                      {kitchenSettings.kitchenEnabled
                        ? 'End date for scheduled kitchen closure (optional - minimum 2 days from start date)'
                        : 'End date for kitchen closure (optional - minimum 2 days from start date, or leave empty to close for today only)'}
                    </p>
                  </div>
                </div>
                <div className="settings-section-actions">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handleSaveKitchenSettings}
                  >
                    <i className="fa-solid fa-save"></i>
                    <span>Update Kitchen Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-card">
            <div className="dashboard-section-header">
              <div className="dashboard-section-icon-wrapper">
                <i className="fa-solid fa-shopping-cart"></i>
              </div>
              <div className="dashboard-section-title-wrapper">
                <h3 className="dashboard-section-title">Order Configuration</h3>
                <p className="dashboard-section-subtitle">
                  Configure how orders are created and managed
                </p>
              </div>
            </div>
            <div className="settings-section-body">
              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label className="settings-form-label">
                    <i className="fa-solid fa-hashtag"></i>
                    <span>Order ID Prefix</span>
                  </label>
                  <input
                    type="text"
                    className="settings-input-field"
                    value={orderSettings.orderIdPrefix}
                    onChange={(e) =>
                      setOrderSettings({
                        ...orderSettings,
                        orderIdPrefix: e.target.value,
                      })
                    }
                    placeholder="HB-"
                  />
                  <p className="settings-form-hint">
                    Orders will be numbered as: {orderSettings.orderIdPrefix}
                    001, {orderSettings.orderIdPrefix}002, etc.
                  </p>
                </div>

                <div className="settings-toggle-group">
                  <div className="settings-toggle-item">
                    <div className="settings-toggle-content">
                      <div className="settings-toggle-label-wrapper">
                        <i className="fa-solid fa-magic"></i>
                        <div>
                          <span className="settings-toggle-label">
                            Auto-generate Order ID
                          </span>
                          <span className="settings-toggle-description">
                            Automatically create unique order IDs
                          </span>
                        </div>
                      </div>
                      <label className="settings-toggle-switch">
                        <input
                          type="checkbox"
                          checked={orderSettings.autoGenerateOrderId}
                          onChange={(e) =>
                            setOrderSettings({
                              ...orderSettings,
                              autoGenerateOrderId: e.target.checked,
                            })
                          }
                        />
                        <span className="settings-toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-content">
                      <div className="settings-toggle-label-wrapper">
                        <i className="fa-solid fa-copy"></i>
                        <div>
                          <span className="settings-toggle-label">
                            Allow Duplicate Address
                          </span>
                          <span className="settings-toggle-description">
                            Allow multiple orders with same address
                          </span>
                        </div>
                      </div>
                      <label className="settings-toggle-switch">
                        <input
                          type="checkbox"
                          checked={orderSettings.allowDuplicateAddress}
                          onChange={(e) =>
                            setOrderSettings({
                              ...orderSettings,
                              allowDuplicateAddress: e.target.checked,
                            })
                          }
                        />
                        <span className="settings-toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-toggle-item">
                    <div className="settings-toggle-content">
                      <div className="settings-toggle-label-wrapper">
                        <i className="fa-solid fa-shield-halved"></i>
                        <div>
                          <span className="settings-toggle-label">
                            Require Payment Confirmation
                          </span>
                          <span className="settings-toggle-description">
                            Confirm payment before marking as paid
                          </span>
                        </div>
                      </div>
                      <label className="settings-toggle-switch">
                        <input
                          type="checkbox"
                          checked={orderSettings.requirePaymentConfirmation}
                          onChange={(e) =>
                            setOrderSettings({
                              ...orderSettings,
                              requirePaymentConfirmation: e.target.checked,
                            })
                          }
                        />
                        <span className="settings-toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="settings-form-group settings-form-group-full">
                  <label className="settings-form-label">
                    <i className="fa-solid fa-list-check"></i>
                    <span>Order Status Options</span>
                  </label>
                  <div className="settings-status-list">
                    {orderSettings.statusOptions.map((status, idx) => (
                      <div key={idx} className="settings-status-item">
                        <i className="fa-solid fa-circle indicator-circle-small"></i>
                        <span>{status}</span>
                        {orderSettings.statusOptions.length > 1 && (
                          <button
                            className="btn btn-ghost btn-icon-only btn-small"
                            onClick={() => {
                              const updated = orderSettings.statusOptions.filter(
                                (_, i) => i !== idx
                              );
                              setOrderSettings({
                                ...orderSettings,
                                statusOptions: updated,
                              });
                            }}
                            title="Remove status"
                          >
                            <i className="fa-solid fa-times"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    {showStatusInput ? (
                      <div className="settings-status-input-group">
                        <input
                          type="text"
                          className="settings-input-field settings-status-input"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newStatus.trim()) {
                              if (
                                !orderSettings.statusOptions.includes(
                                  newStatus.trim()
                                )
                              ) {
                                setOrderSettings({
                                  ...orderSettings,
                                  statusOptions: [
                                    ...orderSettings.statusOptions,
                                    newStatus.trim(),
                                  ],
                                });
                                setNewStatus('');
                                setShowStatusInput(false);
                              }
                            } else if (e.key === 'Escape') {
                              setNewStatus('');
                              setShowStatusInput(false);
                            }
                          }}
                          placeholder="Enter new status"
                          autoFocus
                        />
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => {
                            if (
                              newStatus.trim() &&
                              !orderSettings.statusOptions.includes(
                                newStatus.trim()
                              )
                            ) {
                              setOrderSettings({
                                ...orderSettings,
                                statusOptions: [
                                  ...orderSettings.statusOptions,
                                  newStatus.trim(),
                                ],
                              });
                              setNewStatus('');
                              setShowStatusInput(false);
                            }
                          }}
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button
                          className="btn btn-ghost btn-small"
                          onClick={() => {
                            setNewStatus('');
                            setShowStatusInput(false);
                          }}
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-ghost btn-small settings-add-status-btn"
                        onClick={() => setShowStatusInput(true)}
                      >
                        <i className="fa-solid fa-plus"></i>
                        <span>Add Status</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="settings-section-actions">
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleSaveOrderSettings}
                >
                  <i className="fa-solid fa-save"></i>
                  <span>Save Order Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="dashboard-card">
            <div className="settings-section-header">
              <div className="settings-section-icon-wrapper">
                <i className="fa-solid fa-bell"></i>
              </div>
              <div className="settings-section-title-wrapper">
                <h3 className="settings-section-title">
                  Notification Preferences
                </h3>
                <p className="settings-section-subtitle">
                  Configure how and when you receive notifications
                </p>
              </div>
            </div>
            <div className="settings-section-body">
              <div className="settings-notification-categories">
                <div className="settings-notification-category">
                  <div className="settings-notification-category-header">
                    <i className="fa-solid fa-envelope"></i>
                    <h4 className="settings-notification-category-title">
                      Email Notifications
                    </h4>
                  </div>
                  <div className="settings-toggle-group">
                    <div className="settings-toggle-item">
                      <div className="settings-toggle-content">
                        <div className="settings-toggle-label-wrapper">
                          <i className="fa-solid fa-calendar-day"></i>
                          <div>
                            <span className="settings-toggle-label">
                              Daily Summary
                            </span>
                            <span className="settings-toggle-description">
                              Receive daily order summary via email
                            </span>
                          </div>
                        </div>
                        <label className="settings-toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.emailDailySummary}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                emailDailySummary: e.target.checked,
                              })
                            }
                          />
                          <span className="settings-toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-toggle-item">
                      <div className="settings-toggle-content">
                        <div className="settings-toggle-label-wrapper">
                          <i className="fa-solid fa-bell"></i>
                          <div>
                            <span className="settings-toggle-label">
                              New Order Alert
                            </span>
                            <span className="settings-toggle-description">
                              Get notified when a new order is placed
                            </span>
                          </div>
                        </div>
                        <label className="settings-toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.emailNewOrderAlert}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                emailNewOrderAlert: e.target.checked,
                              })
                            }
                          />
                          <span className="settings-toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-toggle-item">
                      <div className="settings-toggle-content">
                        <div className="settings-toggle-label-wrapper">
                          <i className="fa-solid fa-money-bill-wave"></i>
                          <div>
                            <span className="settings-toggle-label">
                              Payment Received
                            </span>
                            <span className="settings-toggle-description">
                              Alert when payment is received
                            </span>
                          </div>
                        </div>
                        <label className="settings-toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.emailPaymentReceived}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                emailPaymentReceived: e.target.checked,
                              })
                            }
                          />
                          <span className="settings-toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-toggle-item">
                      <div className="settings-toggle-content">
                        <div className="settings-toggle-label-wrapper">
                          <i className="fa-solid fa-exclamation-triangle"></i>
                          <div>
                            <span className="settings-toggle-label">
                              Low Order Day Warning
                            </span>
                            <span className="settings-toggle-description">
                              Alert when daily orders are below average
                            </span>
                          </div>
                        </div>
                        <label className="settings-toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.emailLowOrderDayWarning}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                emailLowOrderDayWarning: e.target.checked,
                              })
                            }
                          />
                          <span className="settings-toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-notification-category">
                  <div className="settings-notification-category-header">
                    <i className="fa-solid fa-message"></i>
                    <h4 className="settings-notification-category-title">
                      SMS Notifications
                    </h4>
                  </div>
                  <div className="settings-toggle-group">
                    <div className="settings-toggle-item">
                      <div className="settings-toggle-content">
                        <div className="settings-toggle-label-wrapper">
                          <i className="fa-solid fa-clock"></i>
                          <div>
                            <span className="settings-toggle-label">
                              Payment Reminders
                            </span>
                            <span className="settings-toggle-description">
                              Send SMS reminders for pending payments
                            </span>
                          </div>
                        </div>
                        <label className="settings-toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.smsPaymentReminders}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                smsPaymentReminders: e.target.checked,
                              })
                            }
                          />
                          <span className="settings-toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="settings-toggle-item">
                      <div className="settings-toggle-content">
                        <div className="settings-toggle-label-wrapper">
                          <i className="fa-solid fa-check-circle"></i>
                          <div>
                            <span className="settings-toggle-label">
                              Order Confirmations
                            </span>
                            <span className="settings-toggle-description">
                              Send SMS when order is confirmed
                            </span>
                          </div>
                        </div>
                        <label className="settings-toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.smsOrderConfirmations}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                smsOrderConfirmations: e.target.checked,
                              })
                            }
                          />
                          <span className="settings-toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="settings-section-actions">
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleSaveNotificationPrefs}
                >
                  <i className="fa-solid fa-save"></i>
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="admin-stats">
            <div className="dashboard-card">
              <div className="settings-section-header">
                <div className="settings-section-icon-wrapper">
                  <i className="fa-solid fa-database"></i>
                </div>
                <div className="settings-section-title-wrapper">
                  <h3 className="settings-section-title">Backup & Restore</h3>
                  <p className="settings-section-subtitle">
                    Manage your data backups and restore points
                  </p>
                </div>
              </div>
              <div className="settings-section-body">
                <div className="settings-backup-info">
                  <div className="settings-backup-info-item">
                    <i className="fa-solid fa-clock"></i>
                    <div>
                      <span className="settings-backup-info-label">
                        Last Backup
                      </span>
                      <span className="settings-backup-info-value">
                        {settings?.lastBackup || '15-Jan-2025 09:30 AM'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="settings-backup-info">
                  <p className="settings-form-hint" style={{ marginTop: '12px' }}>
                    <i className="fa-solid fa-info-circle"></i>
                    Backup, restore, and export functions are now available in the <strong>Reports</strong> tab.
                  </p>
                </div>

                <div className="settings-form-group settings-form-group-full mt-2xl">
                  <div className="settings-toggle-item">
                    <div className="settings-toggle-content">
                      <div className="settings-toggle-label-wrapper">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        <div>
                          <span className="settings-toggle-label">
                            Enable Auto Backup
                          </span>
                          <span className="settings-toggle-description">
                            Automatically backup data daily
                          </span>
                        </div>
                      </div>
                      <label className="settings-toggle-switch">
                        <input
                          type="checkbox"
                          checked={dataSettings.autoBackup}
                          onChange={(e) =>
                            setDataSettings({
                              ...dataSettings,
                              autoBackup: e.target.checked,
                            })
                          }
                        />
                        <span className="settings-toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {dataSettings.autoBackup && (
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-clock"></i>
                      <span>Auto Backup Time</span>
                    </label>
                    <input
                      type="time"
                      className="settings-input-field"
                      value={dataSettings.autoBackupTime}
                      onChange={(e) =>
                        setDataSettings({
                          ...dataSettings,
                          autoBackupTime: e.target.value,
                        })
                      }
                    />
                    <p className="settings-form-hint">
                      Daily backup will run automatically at this time
                    </p>
                  </div>
                )}

                {dataSettings.autoBackup && (
                  <div className="settings-section-actions">
                    <button
                      className="btn btn-primary btn-large"
                      onClick={handleSaveDataSettings}
                    >
                      <i className="fa-solid fa-save"></i>
                      <span>Save Backup Settings</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-card settings-danger-zone">
              <div className="settings-section-header">
                <div className="settings-section-icon-wrapper danger-zone-icon-wrapper">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div className="settings-section-title-wrapper">
                  <h3 className="settings-section-title danger-zone-title">
                    Danger Zone
                  </h3>
                  <p className="settings-section-subtitle">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>
              <div className="settings-section-body">
                <div className="settings-danger-action">
                  <div className="settings-danger-action-info">
                    <i className="fa-solid fa-utensils"></i>
                    <div>
                      <span className="settings-danger-action-label">
                        Clear All Menu Items
                      </span>
                      <span className="settings-danger-action-description">
                        Permanently delete all menu items and remove the default menu record from the database. This action cannot be undone.
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-special danger btn-large"
                    onClick={() => {
                      if (showConfirmation && onClearAllMenuItems) {
                        showConfirmation({
                          title: 'Clear All Menu Items',
                          message:
                            'Are you sure you want to delete all menu items? This will also remove the default menu record from the database. This action cannot be undone.',
                          type: 'warning',
                          confirmText: 'Delete All',
                          onConfirm: async () => {
                            await onClearAllMenuItems();
                          },
                        });
                      } else if (onClearAllMenuItems) {
                        onClearAllMenuItems();
                      }
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                    <span>Clear All Menu Items</span>
                  </button>
                </div>
                <div className="settings-danger-action" style={{ marginTop: '20px' }}>
                  <div className="settings-danger-action-info">
                    <i className="fa-solid fa-trash"></i>
                    <div>
                      <span className="settings-danger-action-label">
                        Clear All Data
                      </span>
                      <span className="settings-danger-action-description">
                        Permanently delete all orders, customers, and settings.
                        This action cannot be undone.
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-special danger btn-large"
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
                    <i className="fa-solid fa-trash"></i>
                    <span>Clear All Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="admin-stats">
            <div className="dashboard-card">
              <div className="settings-section-header">
                <div className="settings-section-icon-wrapper">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="settings-section-title-wrapper">
                  <h3 className="settings-section-title">
                    Profile Information
                  </h3>
                  <p className="settings-section-subtitle">
                    Update your personal account details
                  </p>
                </div>
              </div>
              <div className="settings-section-body">
                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-user"></i>
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      className="settings-input-field"
                      value={userProfile.name}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-envelope"></i>
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      className="settings-input-field"
                      value={userProfile.email}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          email: e.target.value,
                        })
                      }
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-phone"></i>
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      className="settings-input-field"
                      value={userProfile.phone}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                <div className="settings-section-actions">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handleSaveUserProfile}
                  >
                    <i className="fa-solid fa-save"></i>
                    <span>Update Profile</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="settings-section-header">
                <div className="settings-section-icon-wrapper">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div className="settings-section-title-wrapper">
                  <h3 className="settings-section-title">Change Password</h3>
                  <p className="settings-section-subtitle">
                    Update your account password for better security
                  </p>
                </div>
              </div>
              <div className="settings-section-body">
                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-key"></i>
                      <span>Current Password</span>
                    </label>
                    <input
                      type="password"
                      className="settings-input-field"
                      value={userProfile.currentPassword}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-lock"></i>
                      <span>New Password</span>
                    </label>
                    <input
                      type="password"
                      className="settings-input-field"
                      value={userProfile.newPassword}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-lock"></i>
                      <span>Confirm New Password</span>
                    </label>
                    <input
                      type="password"
                      className="settings-input-field"
                      value={userProfile.confirmPassword}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="settings-section-actions">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handleSaveUserProfile}
                  >
                    <i className="fa-solid fa-save"></i>
                    <span>Update Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="admin-stats">
            <div className="dashboard-card">
              <div className="settings-section-header">
                <div className="settings-section-icon-wrapper">
                  <i className="fa-solid fa-font"></i>
                </div>
                <div className="settings-section-title-wrapper">
                  <h3 className="settings-section-title">Font style</h3>
                  <p className="settings-section-subtitle">
                    Choose a font for the full platform—main website, admin
                    dashboard, and admin login. Changes apply after saving.
                  </p>
                </div>
              </div>
              <div className="settings-section-body">
                <div className="settings-form-grid">
                  <div className="settings-form-group settings-form-group-full">
                    <label className="settings-form-label">
                      <i className="fa-solid fa-palette"></i>
                      <span>My font style</span>
                    </label>
                    <select
                      className="settings-input-field"
                      value={appearanceSettings.fontFamily}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          fontFamily: e.target.value,
                        })
                      }
                      aria-label="Select font style"
                    >
                      {FONT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <p className="settings-form-hint">
                      Applies everywhere: customer site, admin, and login. Font
                      loads from Google Fonts when you save.
                    </p>
                  </div>
                  <div className="settings-form-group settings-form-group-full">
                    <label
                      className="settings-form-label"
                      htmlFor="admin-font-size-input"
                    >
                      <i className="fa-solid fa-text-height"></i>
                      <span>Font size (admin dashboard only)</span>
                    </label>
                    <div
                      className="settings-font-size-control"
                      role="group"
                      aria-label={`Font size ${ADMIN_FONT_SIZE_MIN}–${ADMIN_FONT_SIZE_MAX} px`}
                    >
                      <button
                        type="button"
                        className="btn btn-ghost settings-font-size-btn"
                        onClick={() =>
                          applyFontSize(
                            (appearanceSettings.fontSize ??
                              ADMIN_FONT_SIZE_DEFAULT) - ADMIN_FONT_SIZE_STEP
                          )
                        }
                        disabled={
                          (appearanceSettings.fontSize ??
                            ADMIN_FONT_SIZE_DEFAULT) <= ADMIN_FONT_SIZE_MIN
                        }
                        aria-label="Decrease by 0.25 px"
                      >
                        <i className="fa-solid fa-minus" aria-hidden />
                      </button>
                      <input
                        id="admin-font-size-input"
                        type="number"
                        min={ADMIN_FONT_SIZE_MIN}
                        max={ADMIN_FONT_SIZE_MAX}
                        step={ADMIN_FONT_SIZE_STEP}
                        value={
                          appearanceSettings.fontSize ?? ADMIN_FONT_SIZE_DEFAULT
                        }
                        onChange={(e) => applyFontSize(e.target.value)}
                        onBlur={(e) => applyFontSize(e.target.value)}
                        className="settings-font-size-input"
                        aria-label={`Font size in px, ${ADMIN_FONT_SIZE_MIN} to ${ADMIN_FONT_SIZE_MAX}`}
                        aria-valuemin={ADMIN_FONT_SIZE_MIN}
                        aria-valuemax={ADMIN_FONT_SIZE_MAX}
                        aria-valuenow={
                          appearanceSettings.fontSize ?? ADMIN_FONT_SIZE_DEFAULT
                        }
                      />
                      <span className="settings-font-size-unit" aria-hidden>
                        px
                      </span>
                      <button
                        type="button"
                        className="btn btn-ghost settings-font-size-btn"
                        onClick={() =>
                          applyFontSize(
                            (appearanceSettings.fontSize ??
                              ADMIN_FONT_SIZE_DEFAULT) + ADMIN_FONT_SIZE_STEP
                          )
                        }
                        disabled={
                          (appearanceSettings.fontSize ??
                            ADMIN_FONT_SIZE_DEFAULT) >= ADMIN_FONT_SIZE_MAX
                        }
                        aria-label="Increase by 0.25 px"
                      >
                        <i className="fa-solid fa-plus" aria-hidden />
                      </button>
                    </div>
                    <p className="settings-form-hint">
                      {ADMIN_FONT_SIZE_MIN}–{ADMIN_FONT_SIZE_MAX} px in{' '}
                      {ADMIN_FONT_SIZE_STEP} px steps. Applies immediately; save
                      to persist.
                    </p>
                  </div>
                  
                  {/* Auto-hide Sidebar Toggle */}
                  <div className="settings-form-group settings-form-group-full">
                    <div className="settings-toggle-group">
                      <div className="settings-toggle-item">
                        <div className="settings-toggle-content">
                          <div className="settings-toggle-label-wrapper">
                            <i className="fa-solid fa-eye-slash"></i>
                            <div>
                              <span className="settings-toggle-label">
                                Auto-hide Sidebar
                              </span>
                              <span className="settings-toggle-description">
                                Automatically hide sidebar after inactivity. Hover over left edge to show.
                              </span>
                            </div>
                          </div>
                          <label className="settings-toggle-switch">
                            <input
                              type="checkbox"
                              checked={appearanceSettings.autoHideSidebar}
                              onChange={(e) =>
                                setAppearanceSettings({
                                  ...appearanceSettings,
                                  autoHideSidebar: e.target.checked,
                                })
                              }
                            />
                            <span className="settings-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <p className="settings-form-hint">
                      When enabled, sidebar will hide after 3 seconds of inactivity. Move cursor to the left edge to reveal it.
                    </p>
                  </div>
                </div>
                <div className="settings-section-actions">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handleSaveAppearance}
                  >
                    <i className="fa-solid fa-save"></i>
                    <span>Save font style</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;
