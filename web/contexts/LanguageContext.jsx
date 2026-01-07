import { createContext, useContext, useEffect, useState } from "react";
import { getLanguage, setLanguage as setLang } from "../../shared/utils/i18n";
// Direct JSON imports work in Vite
import enTranslations from "../../shared/locales/en.json";
import hiTranslations from "../../shared/locales/hi.json";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState("en");
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
      window.dispatchEvent(new Event("languageChanged"));
      return true;
    }
    return false;
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language] || translations.en;

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
