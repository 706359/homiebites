/**
 * Comprehensive date parsing utility
 * Handles multiple date formats commonly used in the application
 */

/**
 * Parse a date value into a Date object
 * Supports multiple formats:
 * - ISO format (YYYY-MM-DD)
 * - DD-MMM-YY (e.g., "5-Feb-24")
 * - DD/MM/YYYY or DD/MM/YY
 * - DD-MM-YYYY or DD-MM-YY
 * - Standard JavaScript Date parsing
 *
 * @param {string|Date|number} dateValue - The date value to parse
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export const parseOrderDate = (dateValue) => {
  if (!dateValue) return null;

  try {
    // If it's already a Date object, return it
    if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }

    const dateStr = String(dateValue).trim();

    // Handle ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      // Parse as UTC to avoid timezone conversion issues
      // If no timezone specified, treat as UTC midnight
      const isoStr = dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00Z';
      const date = new Date(isoStr);
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle DD-MMM-YY format (e.g., "5-Feb-24", "15-Jan-2026")
    if (/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/i.test(dateStr)) {
      const parts = dateStr.split('-');
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1].toLowerCase();
      let year = parseInt(parts[2], 10);

      const monthNames = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
      ];
      const monthIndex = monthNames.findIndex((m) => monthStr.startsWith(m));

      if (monthIndex !== -1 && day > 0 && day <= 31) {
        // Handle 2-digit years
        if (year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        const date = new Date(year, monthIndex, day);
        return isNaN(date.getTime()) ? null : date;
      }
    }

    // Handle DD/MM/YYYY or DD/MM/YY format
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
      const parts = dateStr.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (year < 100) {
        year = year < 50 ? 2000 + year : 1900 + year;
      }

      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle DD-MM-YYYY or DD-MM-YY format
    if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(dateStr)) {
      const parts = dateStr.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (year < 100) {
        year = year < 50 ? 2000 + year : 1900 + year;
      }

      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }

    // Try standard Date parsing as fallback
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  } catch (e) {
    console.warn('Error parsing date:', dateValue, e);
    return null;
  }
};

/**
 * Format date for display - Consistent format across all tabs
 * Format: DD/MM/YYYY (e.g., "01/07/2026")
 * @param {Date|string|number} dateValue - The date to format
 * @param {object} options - Formatting options (optional)
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
export const formatDate = (dateValue, options = {}) => {
  const date = parseOrderDate(dateValue);
  if (!date) return 'N/A';

  // Use UTC methods to avoid timezone conversion issues
  // Dates are stored in UTC in MongoDB, so we should display UTC dates
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  // If custom options provided, use toLocaleDateString
  if (Object.keys(options).length > 0) {
    const defaultOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC', // Use UTC timezone for display
      ...options,
    };
    return date.toLocaleDateString('en-US', defaultOptions);
  }

  return `${day}/${month}/${year}`;
};

/**
 * Format date for display with short month name
 * Format: DD MMM YYYY (e.g., "01 Jul 2026")
 * @param {Date|string|number} dateValue - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (dateValue) => {
  const date = parseOrderDate(dateValue);
  if (!date) return 'N/A';

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Format date for display with month and day only
 * Format: DD MMM (e.g., "01 Jul")
 * @param {Date|string|number} dateValue - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateMonthDay = (dateValue) => {
  const date = parseOrderDate(dateValue);
  if (!date) return 'N/A';

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });

  return `${day} ${month}`;
};
