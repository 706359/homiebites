


export const parseOrderDate = (dateValue) => {
  if (!dateValue) return null;

  try {
    
    if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }

    const dateStr = String(dateValue).trim();

    
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      
      
      const isoStr = dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00Z';
      const date = new Date(isoStr);
      return isNaN(date.getTime()) ? null : date;
    }

    
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
        
        if (year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        const date = new Date(year, monthIndex, day);
        return isNaN(date.getTime()) ? null : date;
      }
    }

    
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
      const parts = dateStr.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; 
      let year = parseInt(parts[2], 10);

      if (year < 100) {
        year = year < 50 ? 2000 + year : 1900 + year;
      }

      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }

    
    if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(dateStr)) {
      const parts = dateStr.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; 
      let year = parseInt(parts[2], 10);

      if (year < 100) {
        year = year < 50 ? 2000 + year : 1900 + year;
      }

      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }

    
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


export const formatDate = (dateValue, options = {}) => {
  const date = parseOrderDate(dateValue);
  if (!date) return 'N/A';

  
  
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  
  if (Object.keys(options).length > 0) {
    const defaultOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC', 
      ...options,
    };
    return date.toLocaleDateString('en-US', defaultOptions);
  }

  return `${day}/${month}/${year}`;
};


export const formatDateShort = (dateValue) => {
  const date = parseOrderDate(dateValue);
  if (!date) return 'N/A';

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};


export const formatDateMonthDay = (dateValue) => {
  const date = parseOrderDate(dateValue);
  if (!date) return 'N/A';

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });

  return `${day} ${month}`;
};
