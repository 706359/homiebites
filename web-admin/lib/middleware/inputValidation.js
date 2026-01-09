/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate MongoDB ObjectId
 */
export function validateObjectId(id) {
  if (!id || typeof id !== 'string') {
    return false;
  }
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

/**
 * Sanitize string input
 */
export function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validate date string
 */
export function validateDate(dateString) {
  if (!dateString) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date instanceof Date;
}

/**
 * Validate numeric input
 */
export function validateNumber(value, min = null, max = null) {
  const num = Number(value);

  if (isNaN(num)) {
    return false;
  }

  if (min !== null && num < min) {
    return false;
  }

  if (max !== null && num > max) {
    return false;
  }

  return true;
}

/**
 * Validate order data
 */
export function validateOrderData(data) {
  const errors = [];

  if (!data.date || !validateDate(data.date)) {
    errors.push('Invalid date');
  }

  if (
    !data.deliveryAddress ||
    typeof data.deliveryAddress !== 'string' ||
    data.deliveryAddress.length < 5
  ) {
    errors.push('Invalid delivery address');
  }

  if (data.quantity !== undefined && !validateNumber(data.quantity, 1, 1000)) {
    errors.push('Invalid quantity');
  }

  if (data.unitPrice !== undefined && !validateNumber(data.unitPrice, 0, 100000)) {
    errors.push('Invalid unit price');
  }

  if (data.customerName && typeof data.customerName !== 'string') {
    errors.push('Invalid customer name');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate user data
 */
export function validateUserData(data) {
  const errors = [];

  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number');
  }

  if (data.username && (typeof data.username !== 'string' || data.username.length < 3)) {
    errors.push('Invalid username');
  }

  if (data.password && (typeof data.password !== 'string' || data.password.length < 6)) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
