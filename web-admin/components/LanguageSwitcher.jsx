import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getLanguageName, getSupportedLanguages } from '../shared/utils/i18n';
import Icon from './ui/Icon.jsx';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const languages = getSupportedLanguages();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languageFlags = {
    en: '🇬🇧',
    hi: '🇮🇳',
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
      // Use capture phase to ensure we check before Header's handler
      document.addEventListener('mousedown', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]);

  const handleLanguageChange = (e, lang) => {
    e.preventDefault();
    e.stopPropagation();
    if (lang !== language) {
      changeLanguage(lang);
    }
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        type="button"
        className="language-switcher-button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="language-flag">{languageFlags[currentLanguage]}</span>
        <span className="language-name">
          {getLanguageName(currentLanguage)}
        </span>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`language-option ${lang === language ? 'active' : ''}`}
              onClick={(e) => handleLanguageChange(e, lang)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="language-flag">{languageFlags[lang]}</span>
              <span className="language-name">{getLanguageName(lang)}</span>
              {lang === language && (
                <Icon name="check" className="language-check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
