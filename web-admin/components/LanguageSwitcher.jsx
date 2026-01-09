import { useEffect, useRef, useState } from "react";
import {
  getLanguageName,
  getSupportedLanguages,
} from "../shared/utils/i18n";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const languages = getSupportedLanguages();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languageFlags = {
    en: "🇬🇧",
    hi: "🇮🇳",
  };

  const currentLanguage =
    languages.find((lang) => lang === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="language-flag">{languageFlags[currentLanguage]}</span>
        <span className="language-name">
          {getLanguageName(currentLanguage)}
        </span>
        <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"}`}></i>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`language-option ${lang === language ? "active" : ""}`}
              onClick={() => handleLanguageChange(lang)}
            >
              <span className="language-flag">{languageFlags[lang]}</span>
              <span className="language-name">{getLanguageName(lang)}</span>
              {lang === language && (
                <i className="fa-solid fa-check language-check"></i>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
