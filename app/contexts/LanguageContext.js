import React, { createContext, useContext, useState, useEffect } from 'react'
import { getLanguage, setLanguage as setLang, tSync, getSupportedLanguages, getLanguageName } from '../utils/i18nMobile'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load language from storage on mount
    const loadLanguage = async () => {
      try {
        const savedLang = await getLanguage()
        setLanguageState(savedLang)
      } catch (error) {
        console.error('Error loading language:', error)
      } finally {
        setLoading(false)
      }
    }
    loadLanguage()
  }, [])

  const changeLanguage = async (lang) => {
    if (await setLang(lang)) {
      setLanguageState(lang)
      return true
    }
    return false
  }

  const t = (key) => tSync(key, language)

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, loading, getSupportedLanguages, getLanguageName }}>
      {children}
    </LanguageContext.Provider>
  )
}

