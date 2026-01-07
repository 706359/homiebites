# Tailwind CSS Migration Guide

## ✅ Installation Complete

Tailwind CSS has been successfully installed and configured!

## What Was Done

1. ✅ Installed Tailwind CSS, PostCSS, and Autoprefixer
2. ✅ Created `tailwind.config.js` with design token mappings
3. ✅ Created `postcss.config.js` for PostCSS processing
4. ✅ Added Tailwind directives to CSS files:
   - `web/styles/globals.css`
   - `admin/styles/index.css`

## Configuration

### Tailwind Config (`web/tailwind.config.js`)

- Content paths include all React components (web and admin)
- Design tokens mapped to Tailwind theme:
  - Colors: primary, secondary, warning, danger, info, gray
  - Typography: font families, sizes, weights
  - Spacing: matches existing design tokens
  - Border radius: matches existing tokens
  - Shadows: matches existing tokens

### PostCSS Config (`web/postcss.config.js`)

- Configured to process Tailwind CSS
- Autoprefixer enabled for browser compatibility

## How to Use Tailwind

### Option 1: Use Tailwind Classes Directly

You can now use Tailwind utility classes in any component:

```jsx
// Instead of custom CSS:
<div className="dashboard-card" style={{ padding: '1rem' }}>

// Use Tailwind:
<div className="bg-white rounded-xl p-4 shadow-md">
```

### Option 2: Gradual Migration

1. **New Components**: Use Tailwind classes from the start
2. **Existing Components**: Keep current CSS, migrate gradually
3. **Both Work Together**: Tailwind and existing CSS can coexist

## Common Tailwind Classes

### Spacing

```jsx
// Padding
className = "p-4"; // padding: 1rem
className = "px-6 py-4"; // padding: 1rem 1.5rem

// Margin
className = "m-4"; // margin: 1rem
className = "mt-8 mb-4"; // margin-top: 2rem, margin-bottom: 1rem

// Gap
className = "gap-4"; // gap: 1rem
```

### Colors

```jsx
// Background
className = "bg-primary-500"; // background: #3b82f6
className = "bg-gray-100"; // background: #f3f4f6

// Text
className = "text-primary-600"; // color: #2563eb
className = "text-gray-500"; // color: #6b7280
```

### Typography

```jsx
className = "text-xl font-semibold"; // font-size: 1.25rem, font-weight: 600
className = "text-sm text-gray-600"; // font-size: 0.875rem, color: #4b5563
```

### Layout

```jsx
className = "flex items-center gap-4"; // display: flex, align-items: center, gap: 1rem
className = "grid grid-cols-3 gap-6"; // grid, 3 columns, gap: 1.5rem
className = "flex flex-col md:flex-row"; // responsive: column on mobile, row on md+
```

### Borders & Shadows

```jsx
className = "rounded-lg border border-gray-200"; // border-radius: 0.5rem, border: 1px solid
className = "shadow-md"; // box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)
```

## Migration Examples

### Example 1: Stat Card

**Before (Custom CSS):**

```jsx
<div className="stat-card">
  <h3>₹45,600</h3>
  <p>Total Revenue</p>
</div>
```

**After (Tailwind):**

```jsx
<div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
  <h3 className="text-3xl font-bold text-gray-900">₹45,600</h3>
  <p className="text-sm text-gray-600 mt-2">Total Revenue</p>
</div>
```

### Example 2: Button

**Before (Custom CSS):**

```jsx
<button className="btn btn-primary">Save Order</button>
```

**After (Tailwind - keeping btn class for compatibility):**

```jsx
<button className="btn bg-primary-500 text-white px-5 py-2.5 rounded-lg hover:bg-primary-600 transition-colors">
  Save Order
</button>
```

**Or use both (recommended for gradual migration):**

```jsx
<button className="btn btn-primary px-5 py-2.5">Save Order</button>
```

### Example 3: Grid Layout

**Before (Custom CSS):**

```jsx
<div className="dashboard-grid-layout">
  <div className="dashboard-grid-item col-span-6">...</div>
</div>
```

**After (Tailwind):**

```jsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-6">...</div>
</div>
```

## Responsive Design

Tailwind makes responsive design easy:

```jsx
// Mobile-first approach
<div className="
  grid
  grid-cols-1        // 1 column on mobile
  md:grid-cols-2     // 2 columns on medium screens
  lg:grid-cols-4     // 4 columns on large screens
  gap-4
">
```

## Dark Mode (Future)

Tailwind supports dark mode out of the box:

```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

## Benefits

1. **Faster Development** - Write styles directly in JSX
2. **Consistency** - Built-in design system
3. **Smaller Bundle** - Only includes used styles (purged)
4. **Better DX** - IntelliSense and autocomplete
5. **Responsive** - Built-in responsive utilities
6. **Maintainability** - Less custom CSS to maintain

## Next Steps

1. **Start using Tailwind** in new components
2. **Gradually migrate** existing components
3. **Keep existing CSS** until migration is complete
4. **Both systems work together** - no breaking changes

## Testing

After installation, test Tailwind:

1. Add a test class to any component:

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Tailwind is working!
</div>
```

2. Restart dev server if needed:

```bash
npm run dev:full
```

3. Check browser - you should see blue background with white text

## Troubleshooting

### Tailwind classes not working?

1. Check `tailwind.config.js` content paths include your files
2. Restart dev server
3. Clear browser cache
4. Check browser console for errors

### PostCSS errors?

1. Verify `postcss.config.js` exists
2. Check Vite is processing PostCSS
3. Restart dev server

### Styles conflict?

- Tailwind and existing CSS can coexist
- Tailwind utilities have higher specificity
- Use `!important` if needed: `!bg-primary-500`

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Design Tokens Mapping](./TAILWIND_SETUP_PLAN.md)

---

**Status:** ✅ Ready to use!
**Migration Strategy:** Gradual (both systems work together)
