/**
 * Form Validation Utilities
 * Common validation functions for admin forms
 */

export const validateOrder = (orderData) => {
  const errors = {};

  // Customer Name validation
  if (!orderData.customerName || !orderData.customerName.trim()) {
    errors.customerName = 'Customer name is required';
  } else if (orderData.customerName.trim().length < 2) {
    errors.customerName = 'Customer name must be at least 2 characters';
  } else if (orderData.customerName.trim().length > 100) {
    errors.customerName = 'Customer name must be less than 100 characters';
  }

  // Delivery Address validation
  if (!orderData.deliveryAddress || !orderData.deliveryAddress.trim()) {
    errors.deliveryAddress = 'Delivery address is required';
  } else if (orderData.deliveryAddress.trim().length < 5) {
    errors.deliveryAddress = 'Delivery address must be at least 5 characters';
  } else if (orderData.deliveryAddress.trim().length > 500) {
    errors.deliveryAddress = 'Delivery address must be less than 500 characters';
  }

  // Quantity validation
  const qty = parseInt(orderData.quantity);
  if (isNaN(qty) || qty < 1) {
    errors.quantity = 'Quantity must be at least 1';
  } else if (qty > 1000) {
    errors.quantity = 'Quantity must be less than 1000';
  }

  // Unit Price validation
  const price = parseFloat(orderData.unitPrice);
  if (isNaN(price) || price < 0) {
    errors.unitPrice = 'Unit price must be a positive number';
  } else if (price > 100000) {
    errors.unitPrice = 'Unit price seems too high. Please verify.';
  }

  // Date validation
  if (!orderData.date) {
    errors.date = 'Date is required';
  } else {
    const date = new Date(orderData.date);
    if (isNaN(date.getTime())) {
      errors.date = 'Invalid date format';
    }
  }

  // Mode validation (Lunch/Dinner)
  if (!orderData.mode || !['Lunch', 'Dinner'].includes(orderData.mode)) {
    errors.mode = 'Please select a valid meal mode';
  }

  // Status validation
  if (!orderData.status || !['Paid', 'Unpaid', 'Pending', 'Delivered'].includes(orderData.status)) {
    errors.status = 'Please select a valid status';
  }

  return errors;
};

export const validateMenuItem = (menuItem) => {
  const errors = {};

  // Item name validation
  if (!menuItem.name || !menuItem.name.trim()) {
    errors.name = 'Item name is required';
  } else if (menuItem.name.trim().length < 2) {
    errors.name = 'Item name must be at least 2 characters';
  } else if (menuItem.name.trim().length > 100) {
    errors.name = 'Item name must be less than 100 characters';
  }

  // Category validation
  if (!menuItem.category || !menuItem.category.trim()) {
    errors.category = 'Category is required';
  }

  // Price validation
  const price = parseFloat(menuItem.price);
  if (isNaN(price) || price < 0) {
    errors.price = 'Price must be a positive number';
  } else if (price > 100000) {
    errors.price = 'Price seems too high. Please verify.';
  }

  // Description validation (optional but has limits)
  if (menuItem.description && menuItem.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  return errors;
};

export const validateSettings = (settings) => {
  const errors = {};

  // Business name validation
  if (settings.businessName && settings.businessName.trim().length > 200) {
    errors.businessName = 'Business name must be less than 200 characters';
  }

  // Pricing validation
  if (settings.defaultUnitPrice !== undefined) {
    const price = parseFloat(settings.defaultUnitPrice);
    if (isNaN(price) || price < 0) {
      errors.defaultUnitPrice = 'Default unit price must be a positive number';
    }
  }

  if (settings.lunchPrice !== undefined) {
    const price = parseFloat(settings.lunchPrice);
    if (isNaN(price) || price < 0) {
      errors.lunchPrice = 'Lunch price must be a positive number';
    }
  }

  if (settings.dinnerPrice !== undefined) {
    const price = parseFloat(settings.dinnerPrice);
    if (isNaN(price) || price < 0) {
      errors.dinnerPrice = 'Dinner price must be a positive number';
    }
  }

  return errors;
};

/**
 * Check if validation has errors
 * @param {Object} errors - Errors object from validation
 * @returns {boolean} True if there are errors
 */
export const hasValidationErrors = (errors) => {
  return errors && Object.keys(errors).length > 0;
};

/**
 * Get first error message
 * @param {Object} errors - Errors object
 * @returns {string|null} First error message or null
 */
export const getFirstError = (errors) => {
  if (!errors) return null;
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};
