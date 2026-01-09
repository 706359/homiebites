/**
 * Standardized notification messages for admin dashboard
 * Ensures consistent, professional, and accurate messaging
 */

export const notificationMessages = {
  // Order operations
  orders: {
    addSuccess: 'Order added successfully',
    addError: 'Failed to add order. Please check the details and try again.',
    updateSuccess: 'Order updated successfully',
    updateError: 'Failed to update order. Please try again.',
    deleteSuccess: 'Order deleted successfully',
    deleteError: 'Failed to delete order. Please try again.',
    notFound: 'Order not found. It may have been deleted.',
    statusUpdateSuccess: 'Order status updated successfully',
    statusUpdateError: 'Failed to update order status. Please try again.',
    clearAllSuccess: (count) => `Successfully deleted ${count} order${count !== 1 ? 's' : ''}`,
    clearAllError: 'Failed to clear all orders. Please try again.',
    clearAllWarning: (count) =>
      `${count} order${count !== 1 ? 's' : ''} could not be deleted. Please try again.`,
  },

  // Settings operations
  settings: {
    updateSuccess: 'Settings saved successfully',
    updateError: 'Failed to save settings. Please check your inputs and try again.',
    loadError: 'Failed to load settings. Using default values.',
  },

  // Backup & Restore
  backup: {
    createSuccess: 'Backup created successfully',
    createError: 'Failed to create backup. Please try again.',
    restoreSuccess: 'Data restored successfully',
    restoreError: 'Failed to restore data. Please check the backup file and try again.',
    restoreWarning: 'This will overwrite all current data. Are you sure?',
  },

  // Menu operations
  menu: {
    updateSuccess: 'Menu updated successfully',
    updateError: 'Failed to update menu. Please try again.',
    loadError: 'Failed to load menu items.',
    itemAddSuccess: 'Menu item added successfully',
    itemAddError: 'Failed to add menu item. Please check the details and try again.',
    itemUpdateSuccess: 'Menu item updated successfully',
    itemUpdateError: 'Failed to update menu item. Please try again.',
    itemDeleteSuccess: 'Menu item deleted successfully',
    itemDeleteError: 'Failed to delete menu item. Please try again.',
  },

  // Gallery operations
  gallery: {
    addSuccess: 'Gallery item added successfully',
    addError: 'Failed to add gallery item. Please check the details and try again.',
    updateSuccess: 'Gallery item updated successfully',
    updateError: 'Failed to update gallery item. Please try again.',
    deleteSuccess: 'Gallery item deleted successfully',
    deleteError: 'Failed to delete gallery item. Please try again.',
    syncSuccess: (created, updated, deactivated) => {
      const parts = [];
      if (created > 0) parts.push(`${created} created`);
      if (updated > 0) parts.push(`${updated} updated`);
      if (deactivated > 0) parts.push(`${deactivated} deactivated`);
      return `Gallery synced successfully: ${parts.join(', ')}`;
    },
    syncError: 'Failed to sync gallery items. Please try again.',
  },

  // Reviews operations
  reviews: {
    addSuccess: 'Review submitted successfully. It will be published after admin approval.',
    addError: 'Failed to submit review. Please try again.',
    updateSuccess: 'Review updated successfully',
    updateError: 'Failed to update review. Please try again.',
    deleteSuccess: 'Review deleted successfully',
    deleteError: 'Failed to delete review. Please try again.',
    approveSuccess: 'Review approved and published successfully',
    approveError: 'Failed to approve review. Please try again.',
  },

  // Excel/CSV upload
  upload: {
    excelSuccess: (imported, updated, skipped, errors) => {
      const parts = [];
      if (imported > 0) parts.push(`${imported} imported`);
      if (updated > 0) parts.push(`${updated} updated`);
      if (skipped > 0) parts.push(`${skipped} skipped`);
      if (errors > 0) parts.push(`${errors} error${errors !== 1 ? 's' : ''}`);
      return `Upload completed: ${parts.join(', ')}`;
    },
    excelError: 'Failed to upload Excel file. Please check the file format and try again.',
    excelValidationError: 'Invalid Excel file. Please ensure all required columns are present.',
    excelEmptyError: 'Excel file is empty or has no valid data.',
    processing: 'Processing Excel file... Please wait.',
  },

  // Authentication
  auth: {
    loginSuccess: 'Logged in successfully',
    loginError: 'Invalid credentials. Please check your username and password.',
    logoutSuccess: 'Logged out successfully',
    sessionExpired: 'Your session has expired. Please log in again.',
    unauthorized: 'You do not have permission to perform this action.',
  },

  // Network & System
  network: {
    connectionError:
      'Network error: Unable to connect to the server. Please check your internet connection and try again.',
    timeoutError: 'Request timed out. Please try again.',
    serverError: 'Server error occurred. Please try again later.',
    databaseError: 'Database connection error. Please contact support if this persists.',
  },

  // Validation
  validation: {
    requiredFields: 'Please fill in all required fields',
    invalidDate: 'Invalid date format. Please use a valid date.',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
    invalidPrice: 'Price must be a valid number greater than or equal to 0',
    invalidQuantity: 'Quantity must be a valid number greater than 0',
    duplicateOrderId: (orderId) =>
      `Order with ID "${orderId}" already exists. Please use a different Order ID.`,
  },

  // General
  general: {
    loading: 'Loading...',
    saving: 'Saving...',
    processing: 'Processing...',
    success: 'Operation completed successfully',
    error: 'An error occurred. Please try again.',
    warning: 'Please review the information before proceeding',
    info: 'Information',
  },

  // Reminders & Notifications
  reminders: {
    sentSuccess: 'Reminder sent successfully',
    sendError: 'Failed to send reminder. Please try again.',
  },
};

/**
 * Get formatted notification message
 * @param {string} category - Message category (e.g., 'orders', 'settings')
 * @param {string} key - Message key (e.g., 'addSuccess', 'updateError')
 * @param {...any} args - Additional arguments for message formatting
 * @returns {string} Formatted message
 */
export const getNotificationMessage = (category, key, ...args) => {
  const categoryMessages = notificationMessages[category];
  if (!categoryMessages) {
    return notificationMessages.general[key] || notificationMessages.general.error;
  }

  const message = categoryMessages[key];
  if (!message) {
    return notificationMessages.general.error;
  }

  // If message is a function, call it with args
  if (typeof message === 'function') {
    return message(...args);
  }

  return message;
};

/**
 * Get notification duration based on type
 * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
 * @param {number|null} customDuration - Optional custom duration in milliseconds
 * @returns {number} Duration in milliseconds
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

export default notificationMessages;
