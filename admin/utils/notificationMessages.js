/**
 * Professional notification message formatters
 * Ensures consistent, professional messaging across the admin dashboard
 */

export const NotificationMessages = {
  // Success messages
  success: {
    menuItemAdded: (itemName) => `Menu item "${itemName}" has been added successfully.`,
    menuItemUpdated: (itemName) => `Menu item "${itemName}" has been updated successfully.`,
    menuItemDeleted: (itemName) => `Menu item "${itemName}" has been removed successfully.`,
    menuSaved: () => 'Menu items have been saved successfully.',
    orderAdded: (orderId) => `Order ${orderId || ''} has been created successfully.`,
    orderUpdated: (orderId) => `Order ${orderId || ''} has been updated successfully.`,
    orderDeleted: (orderId) => `Order ${orderId || ''} has been deleted successfully.`,
    orderStatusUpdated: (orderId, status) =>
      `Order ${orderId || ''} status has been updated to "${status}".`,
    settingsSaved: (section) => `${section || 'Settings'} have been saved successfully.`,
    gallerySynced: (created, updated, deactivated) => {
      const parts = [];
      if (created > 0) parts.push(`${created} created`);
      if (updated > 0) parts.push(`${updated} updated`);
      if (deactivated > 0) parts.push(`${deactivated} deactivated`);
      return `Gallery synchronized successfully. ${parts.join(', ')}.`;
    },
    backupCreated: () => 'Backup has been created successfully.',
    dataRestored: () => 'Data has been restored successfully.',
    profileUpdated: () => 'Your profile has been updated successfully.',
    themeApplied: () => 'Theme has been applied successfully.',
  },

  // Error messages
  error: {
    menuItemAddFailed: () => 'Failed to add menu item. Please try again.',
    menuItemUpdateFailed: () => 'Failed to update menu item. Please try again.',
    menuItemDeleteFailed: () => 'Failed to delete menu item. Please try again.',
    menuSaveFailed: (error) => `Failed to save menu: ${error || 'Unknown error'}.`,
    orderAddFailed: (error) => `Failed to create order: ${error || 'Unknown error'}.`,
    orderUpdateFailed: (error) => `Failed to update order: ${error || 'Unknown error'}.`,
    orderDeleteFailed: (error) => `Failed to delete order: ${error || 'Unknown error'}.`,
    orderStatusUpdateFailed: (error) =>
      `Failed to update order status: ${error || 'Unknown error'}.`,
    settingsSaveFailed: (error) => `Failed to save settings: ${error || 'Unknown error'}.`,
    gallerySyncFailed: (error) => `Failed to sync gallery: ${error || 'Unknown error'}.`,
    backupFailed: (error) => `Failed to create backup: ${error || 'Unknown error'}.`,
    restoreFailed: (error) => `Failed to restore data: ${error || 'Unknown error'}.`,
    profileUpdateFailed: (error) => `Failed to update profile: ${error || 'Unknown error'}.`,
    validationFailed: (field) =>
      `Please fill in all required fields${field ? `: ${field}` : ''}.`,
    networkError: () => 'Network error. Please check your connection and try again.',
    serverError: () => 'Server error. Please try again later.',
    unauthorized: () => 'You are not authorized to perform this action.',
  },

  // Warning messages
  warning: {
    unsavedChanges: () => 'You have unsaved changes. Are you sure you want to leave?',
    deleteConfirmation: (itemName) =>
      `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    clearAllData: () =>
      'This will permanently delete all data. This action cannot be undone.',
    lowStock: (itemName, quantity) =>
      `Low stock warning: "${itemName}" has only ${quantity} items remaining.`,
    duplicateEntry: (field) => `A ${field || 'record'} with this information already exists.`,
  },

  // Info messages
  info: {
    loading: (action) => `${action || 'Loading'}...`,
    saving: (action) => `Saving ${action || 'changes'}...`,
    processing: (action) => `Processing ${action || 'request'}...`,
    noResults: (type) => `No ${type || 'items'} found matching your criteria.`,
    selectItem: () => 'Please select an item to continue.',
    actionRequired: (action) => `Please ${action || 'complete this action'} to continue.`,
  },
};

/**
 * Helper function to format error messages professionally
 */
export const formatErrorMessage = (error, defaultMessage = 'An error occurred') => {
  if (!error) return defaultMessage;

  // Handle Error objects
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle error objects with message property
  if (error.message) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Helper function to get notification duration based on type
 */
export const getNotificationDuration = (type, customDuration = null) => {
  if (customDuration !== null) return customDuration;

  const durations = {
    success: 4000, // 4 seconds for success messages
    error: 6000, // 6 seconds for errors (users need more time to read)
    warning: 5000, // 5 seconds for warnings
    info: 4000, // 4 seconds for info messages
  };

  return durations[type] || 4000;
};

