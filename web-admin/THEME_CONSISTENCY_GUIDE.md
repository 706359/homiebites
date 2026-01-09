# Theme Consistency Guide - Best Practices

This guide outlines the **best and safest** approach to maintain theme consistency across the admin dashboard.

## Core Principles

1. **Always use CSS variables** - Never hardcode colors
2. **Use utility classes** - Avoid inline styles when possible
3. **Semantic color names** - Use meaningful names (accent, success, warning, danger)
4. **Theme-aware** - All styles must respect light/dark theme

## CSS Variables Reference

### Primary Colors
- `--admin-accent` - Primary brand color (Green: #449031)
- `--admin-secondary` - Secondary brand color (Orange: #c45c2d)
- `--admin-success` - Success state (Green: #16a34a)
- `--admin-warning` - Warning state (Amber: #f59e0b)
- `--admin-danger` - Error/danger state (Red: #dc2626)

### Light Variants
- `--admin-accent-light` - Light background variant
- `--admin-secondary-light` - Light background variant
- `--admin-success-light` - Light background variant
- `--admin-warning-light` - Light background variant
- `--admin-danger-light` - Light background variant

### Text Colors
- `--admin-text` - Primary text color
- `--admin-text-primary` - Primary text (same as --admin-text)
- `--admin-text-secondary` - Secondary/muted text
- `--admin-text-light` - Light/subtle text

### Background Colors
- `--admin-bg` - Card/component background
- `--admin-bg-secondary` - Main page background

### Borders
- `--admin-border` - Standard border color

## Utility Classes

### Stat Card Utilities

```jsx
// ✅ CORRECT - Use utility classes
<div className='stat-card'>
  <i className='fa-solid fa-chart-line stat-card-icon-success'></i>
  <div>
    <h3>₹1,000</h3>
    <p>Revenue</p>
    <p className='stat-card-subtitle'>This month</p>
  </div>
</div>

// ❌ WRONG - Inline styles
<div className='stat-card'>
  <i style={{ color: 'var(--admin-success)' }}></i>
  <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)' }}>This month</p>
</div>
```

### Icon Color Classes

- `stat-card-icon-accent` - Primary accent color
- `stat-card-icon-success` - Success color
- `stat-card-icon-warning` - Warning color
- `stat-card-icon-danger` - Danger color
- `stat-card-icon-secondary` - Secondary color

### Text Color Classes

- `text-primary` - Primary text
- `text-secondary` - Secondary text
- `text-light` - Light text
- `text-accent` - Accent color text
- `text-success` - Success color text
- `text-warning` - Warning color text
- `text-danger` - Danger color text

### Background Classes

- `bg-accent-light` - Light accent background
- `bg-success-light` - Light success background
- `bg-warning-light` - Light warning background
- `bg-danger-light` - Light danger background

### Border Classes

- `border-accent` - Accent border
- `border-success` - Success border
- `border-warning` - Warning border
- `border-danger` - Danger border

## When to Use Inline Styles

**Only use inline styles for:**
1. Dynamic values (calculations, user input)
2. One-off positioning that doesn't need a class
3. JavaScript-generated styles

**Never use inline styles for:**
1. Colors (use CSS variables or utility classes)
2. Typography (use utility classes)
3. Spacing (use utility classes or CSS)
4. Theme-dependent values (always use CSS variables)

## Examples

### ✅ Good - Using Utility Classes

```jsx
<div className='stat-card'>
  <i className='fa-solid fa-coins stat-card-icon-accent'></i>
  <div>
    <h3>₹{formatCurrency(amount)}</h3>
    <p>Total Revenue</p>
    <p className='stat-card-subtitle'>{percentage}% growth</p>
  </div>
</div>
```

### ✅ Good - Using CSS Variables in CSS

```css
.my-component {
  color: var(--admin-accent, #449031);
  background: var(--admin-accent-light, rgba(68, 144, 49, 0.1));
  border: 1px solid var(--admin-border, #e5e7eb);
}
```

### ✅ Acceptable - Dynamic Inline Styles

```jsx
<div style={{ 
  width: `${calculatedWidth}px`,  // Dynamic calculation
  transform: `translateX(${offset}px)`  // Dynamic value
}}>
```

### ❌ Bad - Hardcoded Colors

```jsx
<div style={{ color: '#449031' }}>  // Never hardcode!
<div style={{ color: 'green' }}>     // Never use color names!
```

### ❌ Bad - Inline Theme Values

```jsx
<div style={{ 
  fontSize: '0.85rem',
  marginTop: '0.25rem',
  color: 'var(--admin-text-light)'  // Use utility class instead!
}}>
```

## File Structure

- `theme.css` - Core theme definitions (light/dark)
- `theme-utilities.css` - Reusable utility classes
- `dashboard-enhancements.css` - Component-specific styles
- `tailwind-components.css` - Base component styles

## Testing Theme Consistency

1. Switch between light and dark themes
2. Change primary color in settings
3. Verify all components update correctly
4. Check that no hardcoded colors remain
5. Ensure all text is readable in both themes

## Migration Checklist

When adding new components:

- [ ] Use CSS variables for all colors
- [ ] Use utility classes instead of inline styles
- [ ] Test in both light and dark themes
- [ ] Verify colors match theme settings
- [ ] Check accessibility (contrast ratios)
- [ ] Use semantic color names (accent, success, etc.)

## Quick Reference

| What | Use This |
|------|----------|
| Icon color | `stat-card-icon-{accent|success|warning|danger|secondary}` |
| Subtitle text | `stat-card-subtitle` |
| Text color | `text-{primary|secondary|light|accent|success|warning|danger}` |
| Background | `bg-{accent|success|warning|danger}-light` |
| Border | `border-{accent|success|warning|danger}` |
| Empty state | `empty-state-text` |

## Support

For questions or issues with theme consistency, refer to:
- `components/admin/styles/theme-utilities.css` - All utility classes
- `components/admin/styles/theme.css` - Theme definitions
- This guide - Best practices
