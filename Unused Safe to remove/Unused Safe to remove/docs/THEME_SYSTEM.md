# 🎨 Theme Token System - Implementation Guide

## Overview

The admin dashboard now uses a **single source of truth** theme system with CSS variables and Tailwind integration. This system supports unlimited palettes, instant theme switching, and perfect scalability.

---

## 📁 File Structure

```
admin/
├── styles/
│   ├── themes.css          # Single source of truth (THEME TOKENS)
│   └── index.css           # Imports themes.css first
├── hooks/
│   └── useTheme.js         # React hook for theme management
└── tailwind.config.js     # Consumes theme tokens
```

---

## 1️⃣ Theme Tokens (Single Source of Truth)

**File:** `styles/themes.css`

### Base Tokens (Light Default)

```css
:root {
  --bg: #f9fafb;
  --surface: #ffffff;
  --text: #111827;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --primary: #2563eb;
  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #dc2626;
  --radius: 0.75rem;
  --transition: 150ms ease;
}
```

### Dark Mode

```css
.dark,
.dark-theme {
  --bg: #0f172a;
  --surface: #111827;
  --text: #e5e7eb;
  --text-secondary: #9ca3af;
  --border: #1f2937;
  --danger: #ef4444;
}
```

### Palettes

- `theme-blue` - Blue Neutral (default)
- `theme-slate` - Slate Gray
- `theme-indigo` - Indigo Tech
- `theme-emerald` - Emerald Clean
- `theme-neon` - Dark Pro + Neon

---

## 2️⃣ Tailwind Config (Consumes Tokens)

**File:** `tailwind.config.js`

```javascript
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        textSecondary: 'var(--text-secondary)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      borderRadius: {
        xl: 'var(--radius)',
      },
    },
  },
};
```

---

## 3️⃣ Import Order (Critical)

**File:** `styles/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme Tokens - MUST BE FIRST */
@import './themes.css';

/* Other styles after */
@import './tailwind-components.css';
@import './custom-overrides.css';
```

---

## 4️⃣ React Theme Hook

**File:** `hooks/useTheme.js`

```javascript
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { dark, toggleDark, palette, setPalette, palettes } = useTheme();

  return (
    <div className='bg-bg text-text'>
      <button onClick={toggleDark}>{dark ? 'Light' : 'Dark'} Mode</button>

      <select value={palette} onChange={(e) => setPalette(e.target.value)}>
        {palettes.map((p) => (
          <option key={p} value={p}>
            {p.replace('theme-', '')}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Hook API

```typescript
{
  dark: boolean;              // Current dark mode state
  setDark: (dark: boolean) => void;
  toggleDark: () => void;     // Toggle dark mode
  palette: string;            // Current palette ('theme-blue', etc.)
  setPalette: (palette: string) => void;
  palettes: string[];         // Available palettes
  mounted: boolean;           // Whether hook is mounted (prevents SSR issues)
}
```

---

## 5️⃣ Usage Examples

### Basic Component

```jsx
import { useTheme } from '../hooks/useTheme';

export default function Card() {
  const { dark } = useTheme();

  return (
    <div className='bg-surface border border-border rounded-xl p-6'>
      <h1 className='text-xl font-semibold text-text'>Card Title</h1>
      <p className='text-textSecondary'>Card content</p>
      <button className='bg-primary text-white px-4 py-2 rounded-xl'>Action</button>
    </div>
  );
}
```

### Tailwind Classes

```jsx
// Backgrounds
<div className="bg-bg">          {/* Page background */}
<div className="bg-surface">    {/* Card background */}

// Text
<h1 className="text-text">                    {/* Primary text */}
<p className="text-textSecondary">          {/* Secondary text */}

// Borders
<div className="border border-border">       {/* Default border */}

// Colors
<button className="bg-primary">             {/* Primary color */}
<span className="text-success">             {/* Success color */}
<span className="text-warning">             {/* Warning color */}
<span className="text-danger">              {/* Danger color */}

// Light Variants
<div className="bg-primary-light">          {/* Light primary background */}
```

### CSS Variables (Direct)

```css
.my-component {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
}

.my-button {
  background: var(--primary);
  color: white;
  border-radius: var(--radius);
  transition: all var(--transition);
}
```

---

## 6️⃣ What NOT to Do

❌ **No hardcoded hex colors**

```jsx
// ❌ Bad
<div className="bg-[#2563EB]">

// ✅ Good
<div className="bg-primary">
```

❌ **No Tailwind dark: everywhere**

```jsx
// ❌ Bad
<div className="bg-white dark:bg-gray-900">

// ✅ Good
<div className="bg-surface">  {/* Automatically adapts */}
```

❌ **No duplicate palettes in config**

```javascript
// ❌ Bad - Don't define colors in tailwind.config.js
colors: {
  primary: '#2563EB',  // Hardcoded
}

// ✅ Good - Use CSS variables
colors: {
  primary: 'var(--primary)',  // From themes.css
}
```

❌ **No inline styles**

```jsx
// ❌ Bad
<div style={{ backgroundColor: '#2563EB' }}>

// ✅ Good
<div className="bg-primary">
```

❌ **No JS color logic**

```jsx
// ❌ Bad
const color = dark ? '#3B82F6' : '#2563EB';

// ✅ Good
// Use CSS variables - they adapt automatically
```

---

## 7️⃣ Benefits

✅ **Single Source of Truth** - All colors defined in `themes.css`  
✅ **Unlimited Palettes** - Easy to add new color schemes  
✅ **Instant Switching** - No rebuilds required  
✅ **Persists User Choice** - Saves to localStorage  
✅ **System Theme Sync** - Respects OS preference  
✅ **Tailwind Clean** - No duplicate color definitions  
✅ **Backward Compatible** - Legacy admin variables still work  
✅ **Scalable** - Perfect for enterprise SaaS

---

## 8️⃣ Migration Guide

### From Old System

**Before:**

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

**After:**

```jsx
<div className="bg-surface text-text">
```

### Update Components

1. Replace hardcoded colors with Tailwind classes
2. Remove `dark:` variants (handled automatically)
3. Use `useTheme` hook for theme controls
4. Use CSS variables for custom styles

---

## 9️⃣ Testing

### Manual Testing

1. Toggle dark mode - should switch instantly
2. Change palette - colors should update immediately
3. Refresh page - preferences should persist
4. Check system theme - should detect automatically

### Checklist

- [ ] Dark mode works
- [ ] All palettes work
- [ ] Preferences persist
- [ ] System theme detection works
- [ ] No hardcoded colors
- [ ] Tailwind classes work
- [ ] CSS variables work
- [ ] Backward compatibility maintained

---

## 🔟 Troubleshooting

### Colors Not Updating

- Check `themes.css` is imported first in `index.css`
- Verify Tailwind config uses `var(--primary)` not hardcoded values
- Ensure `.dark` class is on root element

### Theme Not Persisting

- Check localStorage keys: `admin-dark-theme` and `admin-palette`
- Verify `useTheme` hook is called in component

### Tailwind Classes Not Working

- Run `npm run build` to regenerate Tailwind
- Check `tailwind.config.js` content paths include your files
- Verify `darkMode: 'class'` is set

---

**Last Updated:** 2025-01-27  
**Version:** 1.0.0  
**Status:** Production Ready ✅
