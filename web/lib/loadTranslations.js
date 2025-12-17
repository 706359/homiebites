// Load translations for web (Vite)
// This file handles dynamic loading of JSON translations in the browser

let translationsCache = {
  en: null,
  hi: null
}

export const loadTranslations = async (lang = 'en') => {
  if (translationsCache[lang]) {
    return translationsCache[lang]
  }

  try {
    const response = await fetch(`/shared/locales/${lang}.json`)
    if (response.ok) {
      const data = await response.json()
      translationsCache[lang] = data
      return data
    }
  } catch (error) {
    console.error(`Error loading ${lang} translations:`, error)
  }

  // Fallback: return empty object
  return {}
}

// Preload both languages
export const preloadTranslations = async () => {
  await Promise.all([
    loadTranslations('en'),
    loadTranslations('hi')
  ])
}

