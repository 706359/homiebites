# Language Implementation Guide

## Overview
HomieBites now supports **Hindi** and **English** languages for both web and mobile platforms.

## Implementation Details

### 1. Translation Files
- **Location**: `shared/locales/`
- **Files**:
  - `en.json` - English translations
  - `hi.json` - Hindi translations

### 2. Web Implementation

#### Language Context
- **File**: `src/contexts/LanguageContext.jsx`
- Provides `useLanguage()` hook for components
- Manages language state and persistence

#### Language Switcher Component
- **File**: `src/components/LanguageSwitcher.jsx`
- Dropdown selector in the header
- Automatically saves preference to localStorage

#### Usage in Components
```jsx
import { useLanguage } from '../contexts/LanguageContext'

const MyComponent = () => {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  )
}
```

### 3. Mobile Implementation

#### Language Context
- **File**: `app/contexts/LanguageContext.js`
- Uses AsyncStorage for persistence
- Provides same API as web version

#### Usage in Mobile Screens
```jsx
import { useLanguage } from '../contexts/LanguageContext'

const MyScreen = () => {
  const { t } = useLanguage()
  
  return (
    <View>
      <Text>{t('hero.title')}</Text>
    </View>
  )
}
```

### 4. Translation Keys Structure

```
common.*          - Common terms (home, menu, etc.)
header.*          - Header navigation
hero.*            - Hero section
features.*        - Features section
menu.*            - Menu page
about.*           - About section
contact.*         - Contact information
faq.*             - FAQ page
login.*           - Login/Register
account.*         - Account page
order.*           - Order modal
footer.*          - Footer links
admin.*           - Admin dashboard
```

### 5. Language Storage

- **Web**: `localStorage.getItem('homiebites_language')`
- **Mobile**: `AsyncStorage.getItem('homiebites_language')`
- **Default**: English (`en`)

### 6. Adding New Translations

1. Add key-value pairs to both `en.json` and `hi.json`
2. Use nested structure: `section.key` (e.g., `menu.addToCart`)
3. Use in components: `t('section.key')`

### 7. Components Updated

#### Web Components (Partially Updated)
- ✅ Header - Language switcher added
- ✅ Hero - Using translations
- ⏳ Footer - Needs translation updates
- ⏳ Features - Needs translation updates
- ⏳ Other components - Can be updated as needed

#### Mobile Screens
- ⏳ All screens can be updated to use translations

### 8. Language Switcher Location

- **Web**: Top announcement bar (right side, before region selector)
- **Mobile**: Can be added to settings/account screen

## Next Steps

1. Update remaining web components to use translations
2. Update mobile screens to use translations
3. Add language switcher to mobile app settings
4. Test language switching across all pages
5. Add more translations as needed

## Notes

- Language preference persists across sessions
- Default language is English
- All translations are stored in JSON files for easy editing
- Both platforms share the same translation files from `shared/locales/`

