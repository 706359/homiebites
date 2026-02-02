import { createContext, useContext, useEffect, useState } from 'react';
import { getLanguage, setLanguage as setLang } from '../shared/utils/i18n';
// Direct JSON imports work in Vite
import enTranslations from '../shared/locales/en.json';
import hiTranslations from '../shared/locales/hi.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const translations = { en: enTranslations, hi: hiTranslations };

  useEffect(() => {
    // Load language from storage on mount
    const savedLang = getLanguage();
    setLanguageState(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    if (setLang(lang)) {
      setLanguageState(lang);
      // Trigger a re-render by dispatching a custom event
      window.dispatchEvent(new Event('languageChanged'));
      return true;
    }
    return false;
  };

  const t = (key) => {
    const keys = key.split('.');
    const locale = translations[language] || translations.en;

    let value = locale;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    // When Hindi is selected but key is missing, fall back to English so every word shows a translation
    if ((value === undefined || value === null || value === '') && language === 'hi' && locale !== translations.en) {
      let enValue = translations.en;
      for (const k of keys) {
        if (enValue && typeof enValue === 'object') {
          enValue = enValue[k];
        } else {
          enValue = undefined;
          break;
        }
      }
      if (enValue !== undefined && enValue !== null && enValue !== '') {
        return enValue;
      }
    }

    return value ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
