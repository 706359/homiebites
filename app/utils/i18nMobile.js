// Internationalization utility for React Native
// Supports English and Hindi

import AsyncStorage from '@react-native-async-storage/async-storage'

// Import translations
const enTranslations = require('../../shared/locales/en.json')
const hiTranslations = require('../../shared/locales/hi.json')

const translations = {
  en: enTranslations,
  hi: hiTranslations
}

const defaultLanguage = 'en'
const supportedLanguages = ['en', 'hi']
const STORAGE_KEY = 'homiebites_language'

// Get translation for a key path
export const t = async (key, lang = null) => {
  const currentLang = lang || await getLanguage()
  const keys = key.split('.')
  let value = translations[currentLang] || translations[defaultLanguage]
  
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
export const getLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(STORAGE_KEY)
    return lang || defaultLanguage
  } catch (error) {
    return defaultLanguage
  }
}

// Set language preference
export const setLanguage = async (lang) => {
  try {
    if (supportedLanguages.includes(lang)) {
      await AsyncStorage.setItem(STORAGE_KEY, lang)
      return true
    }
  } catch (error) {
    console.error('Error setting language:', error)
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

// Synchronous version for use in components (requires language state)
export const tSync = (key, lang = defaultLanguage) => {
  const keys = key.split('.')
  let value = translations[lang] || translations[defaultLanguage]
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key
    }
  }
  
  return value || key
}

export default {
  t,
  tSync,
  getLanguage,
  setLanguage,
  getSupportedLanguages,
  getLanguageName
}

