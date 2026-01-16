# CSS Standards and Anti-Patterns Guide

This document outlines what CSS should **NOT** be written according to project standards and best practices.

## ❌ FORBIDDEN CSS Patterns

### 1. **Border Width > 1px**

**Rule**: All borders must be exactly 1px maximum.

```css
/* ❌ FORBIDDEN */
border: 2px solid var(--admin-border);
border: 1.5px solid var(--primary-orange);
border-width: 3px;

/* ✅ CORRECT */
border: 1px solid var(--admin-border);
border: 1px solid var(--primary-orange);
border-width: 1px;
```

**Exception**: `border-radius` values are NOT affected by this rule.

---

### 2. **Invalid CSS Selector Grouping**

**Rule**: Don't group unrelated selectors together.

```css
/* ❌ FORBIDDEN - Invalid grouping */
.kicker:focus,
html {
  scroll-behavior: smooth;
}

/* ✅ CORRECT - Separate selectors */
.kicker:focus {
  outline: none;
}

html {
  scroll-behavior: smooth;
}
```

---

### 3. **Hardcoded Colors**

**Rule**: Never use hardcoded hex colors, rgb/rgba values, or color names. Always use CSS variables.

```css
/* ❌ FORBIDDEN */
background: #fff8f0;
color: #25d366;
border-color: rgb(68, 144, 49);
background: green;

/* ✅ CORRECT */
background: var(--bg-orange, #fff5f0);
color: var(--whatsapp-green, #25d366);
border-color: var(--primary-green);
background: var(--success-green);
```

**Exception**: Gradients and complex backgrounds may use rgba values for transparency, but should prefer CSS variables when possible.

---

### 4. **Excessive Usage**

**Rule**: Avoid `` unless absolutely necessary. Use proper CSS specificity instead.

```css
/* ❌ FORBIDDEN - Unnecessary  */
.button {
  color: blue;
  padding: 10px;
}

/* ✅ CORRECT - Proper specificity */
.dashboard-card .button {
  color: blue;
  padding: 10px;
}
```

**When is ALLOWED:**

- Overriding third-party library styles that use
- Fixing critical accessibility issues
- Overriding inline styles for user settings/theme changes
- Font size hierarchy enforcement (only in `font-size-hierarchy.css`)

---

### 5. **Magic Numbers Without Variables**

**Rule**: Use CSS variables for commonly repeated values.

```css
/* ❌ FORBIDDEN - Magic numbers */
.card {
  padding: 16px;
  font-size: 14px;
  border-radius: 8px;
  max-width: 1400px;
}

/* ✅ CORRECT - Using variables */
.card {
  padding: var(--space-4, 1rem);
  font-size: var(--font-size-sm, 0.875rem);
  border-radius: var(--border-radius-md, 8px);
  max-width: var(--container-max-width, 1400px);
}
```

**Available Variables:**

- Spacing: `--space-1` through `--space-16`
- Font sizes: `--font-size-xs` through `--font-size-4xl`
- Border radius: `--border-radius-sm`, `--border-radius-md`, `--border-radius-lg`
- Colors: See `shared/styles/variables.css`

---

### 6. **Inline Styles in CSS Files**

**Rule**: CSS files should not contain inline style logic. Use classes instead.

```css
/* ❌ FORBIDDEN - Inline style logic in CSS */
.element[style*='color: red'] {
  /* ... */
}
```

**Note**: Inline styles in JSX/JS files are acceptable for dynamic values only.

---

### 7. **Non-Standard Browser Prefixes (Unnecessary)**

**Rule**: Only use vendor prefixes when necessary for browser support.

```css
/* ✅ ACCEPTABLE - Modern prefixes still needed */
-webkit-backdrop-filter: blur(10px);
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
-webkit-tap-highlight-color: transparent;
-webkit-overflow-scrolling: touch;
```

**Note**: These are acceptable as they provide necessary browser compatibility.

---

### 8. **Overly Specific Selectors**

**Rule**: Avoid unnecessarily long selector chains.

```css
/* ❌ FORBIDDEN - Overly specific */
body > div > main > section > div > .card > .title {
  color: blue;
}

/* ✅ CORRECT - Appropriate specificity */
.card-title {
  color: blue;
}
```

---

### 9. **Duplicate CSS Rules**

**Rule**: Don't define the same CSS rule multiple times.

```css
/* ❌ FORBIDDEN - Duplicate definitions */
.section-heading {
  font-size: 2rem;
}

/* ... later in file ... */

.section-heading {
  font-size: 2rem;
  margin-bottom: 2rem;
}
```

**Solution**: Consolidate into a single definition.

---

### 10. **Dead/Unused CSS**

**Rule**: Remove CSS classes that are not used anywhere in the codebase.

**How to identify:**

- Search for class name in JSX/JS files
- Check if class is added dynamically via JavaScript
- Verify it's not used in template strings

---

## ✅ CSS Best Practices

### 1. **Use CSS Variables for Colors**

```css
/* ✅ GOOD */
color: var(--admin-accent, #449031);
background: var(--admin-bg, #ffffff);
```

### 2. **Use Semantic Class Names**

```css
/* ✅ GOOD */
.stat-card-icon-success .text-primary .bg-accent-light;
```

### 3. **Organize CSS by Component/Feature**

- Keep related styles together
- Use comments to separate sections
- Follow the existing file structure

### 4. **Use Responsive Units**

```css
/* ✅ GOOD */
font-size: clamp(1rem, 2vw, 1.5rem);
padding: 1rem 2rem;
max-width: 1400px;
```

### 5. **Maintain Consistent Spacing**

```css
/* ✅ GOOD - Using variables */
padding: var(--space-4, 1rem);
margin: var(--space-2, 0.5rem) 0;
gap: var(--space-3, 0.75rem);
```

---

## 📋 Checklist Before Writing CSS

- [ ] No borders > 1px
- [ ] No hardcoded colors (use CSS variables)
- [ ] No unnecessary
- [ ] No magic numbers (use CSS variables)
- [ ] No invalid selector groupings
- [ ] No duplicate rules
- [ ] No dead/unused CSS
- [ ] Proper selector specificity
- [ ] Uses semantic class names
- [ ] Follows existing file structure

---

## 🔍 Common Issues Found and Fixed

### Fixed Issues:

1. ✅ Fixed `border: 1.5px` → `border: 1px` in `.kicker`
2. ✅ Fixed invalid selector `.kicker:focus, html` → separated into two selectors
3. ✅ Replaced hardcoded `#fff8f0` → `var(--bg-orange)`
4. ✅ Replaced hardcoded `#25d366` → `var(--whatsapp-green)`
5. ✅ Removed duplicate CSS rules (`.section-heading`, `.section-subtitle`, `@keyframes rotate`)
6. ✅ Consolidated duplicate `.addresses-list` definitions

### Remaining Issues to Review:

- ⚠️ Multiple ``declarations in`tailwind-components.css` (30+ instances)
  - These should be reviewed and reduced where possible
  - Some may be necessary for overriding third-party styles

---

## 📚 References

- `.cursorrules` - Project-specific CSS rules
- `THEME_CONSISTENCY_GUIDE.md` - Theme and color usage guidelines
- `shared/styles/variables.css` - Available CSS variables
- `components/admin/styles/theme.css` - Theme definitions

---

## 🎯 Summary

**Key Rules:**

1. **Borders**: Maximum 1px
2. **Colors**: Always use CSS variables
3. \*\*\*\*: Avoid unless absolutely necessary
4. **Magic Numbers**: Use CSS variables
5. **Selectors**: Valid and appropriately specific
6. **Duplicates**: Remove duplicate rules
7. **Dead Code**: Remove unused CSS

Following these standards ensures:

- ✅ Maintainable codebase
- ✅ Consistent styling
- ✅ Easy theme customization
- ✅ Better performance
- ✅ Fewer conflicts
