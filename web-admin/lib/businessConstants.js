export const BUSINESS_CONSTANTS = {
  // Contact Information
  PHONE_NUMBER: '+919958983578',
  PHONE_NUMBER_PLAIN: '919958983578',
  PHONE_NUMBER_FORMATTED: '+91-9958983578',

  // Social Media & Communication
  WHATSAPP_NUMBER: '919958983578',
  WHATSAPP_PREFIX: 'https://wa.me/',

  // Default Settings
  DEFAULT_UNIT_PRICE: 100,
  DEFAULT_LUNCH_PRICE: 120,
  DEFAULT_DINNER_PRICE: 140,

  // Business Hours
  LUNCH_START: '12:00',
  LUNCH_END: '14:00',
  DINNER_START: '19:00',
  DINNER_END: '22:00',
};

export const getWhatsAppLink = (message = '') => {
  const baseUrl = `${BUSINESS_CONSTANTS.WHATSAPP_PREFIX}${BUSINESS_CONSTANTS.WHATSAPP_NUMBER}`;
  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}?text=${encodedMessage}`;
  }
  return baseUrl;
};

export const getPhoneLink = () => {
  return `tel:${BUSINESS_CONSTANTS.PHONE_NUMBER}`;
};

export const getFormattedPhone = () => {
  return BUSINESS_CONSTANTS.PHONE_NUMBER_FORMATTED;
};
