// Internationalization utility
// Supports English and Hindi

// Import translations - works in both web and Node environments
// For web: Vite will handle JSON imports
// For mobile: React Native bundler will handle require()
let enTranslations, hiTranslations

// Use dynamic import for web, require for Node/RN
if (typeof window !== 'undefined') {
  // Browser environment - use fetch or import
  // Translations will be loaded by the context provider
  enTranslations = {}
  hiTranslations = {}
} else {
  // Node/React Native environment
  try {
    enTranslations = require('../locales/en.json')
    hiTranslations = require('../locales/hi.json')
  } catch (e) {
    // Fallback if require doesn't work
    enTranslations = {}
    hiTranslations = {}
  }
}

const translations = {
  en: enTranslations,
  hi: hiTranslations
}

const defaultLanguage = 'en'
const supportedLanguages = ['en', 'hi']

// Get translation for a key path (e.g., 'header.menu' or 'common.home')
export const t = (key, lang = defaultLanguage) => {
  const keys = key.split('.')
  let value = translations[lang] || translations[defaultLanguage]
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key // Return key if translation not found
    }
  }
  
  return value || key
}

// Get current language from storage
export const getLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('homiebites_language') || defaultLanguage
  }
  return defaultLanguage
}

// Set language preference
export const setLanguage = (lang) => {
  if (typeof window !== 'undefined') {
    if (supportedLanguages.includes(lang)) {
      localStorage.setItem('homiebites_language', lang)
      return true
    }
  }
  return false
}

// Get all supported languages
export const getSupportedLanguages = () => supportedLanguages

// Get language name
export const getLanguageName = (code) => {
  const names = {
    en: 'English',
    hi: 'हिंदी'
  }
  return names[code] || code
}

export default {
  t,
  getLanguage,
  setLanguage,
  getSupportedLanguages,
  getLanguageName
}

