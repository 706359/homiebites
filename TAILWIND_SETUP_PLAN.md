# Tailwind CSS Setup Plan

## Current Status

❌ **Tailwind CSS is NOT currently installed or configured**

## Current CSS Setup

- Custom CSS files in `admin/styles/`
- Design tokens system (`design-tokens.css`)
- Component library (`components.css`)
- Multiple component-specific CSS files

## Why Use Tailwind?

1. **Faster Development** - Utility-first approach speeds up styling
2. **Consistency** - Built-in design system
3. **Smaller Bundle** - Only includes used styles
4. **Better DX** - IntelliSense, autocomplete
5. **Responsive** - Built-in responsive utilities
6. **Maintainability** - Less custom CSS to maintain

## Migration Strategy

### Option 1: Gradual Migration (Recommended)

- Install Tailwind alongside existing CSS
- Use Tailwind for new components
- Gradually migrate existing components
- Keep existing CSS until migration complete

### Option 2: Full Migration

- Install Tailwind
- Migrate all components at once
- Remove custom CSS files
- More work upfront but cleaner long-term

## Implementation Steps

### Step 1: Install Tailwind CSS

```bash
cd web
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Configure Tailwind

- Update `tailwind.config.js` with content paths
- Configure design tokens to match existing system
- Set up custom colors, spacing, etc.

### Step 3: Add Tailwind Directives

- Add to main CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Update Vite Config

- Ensure PostCSS is configured
- Add Tailwind plugin if needed

### Step 5: Migrate Components

- Start with new components
- Gradually migrate existing ones
- Use Tailwind classes instead of custom CSS

## Design Tokens Mapping

Map existing design tokens to Tailwind:

```js
// Existing tokens → Tailwind
--primary-500 → primary-500
--text-primary → gray-900
--space-4 → p-4, m-4, gap-4
--radius-lg → rounded-lg
--shadow-md → shadow-md
```

## Benefits for This Project

1. **Faster Feature Development** - Less CSS writing
2. **Consistent Spacing** - Built-in spacing scale
3. **Responsive Utilities** - `md:`, `lg:` prefixes
4. **Dark Mode Ready** - Built-in dark mode support
5. **Better Performance** - Purged unused styles

## Recommendation

**Use Option 1: Gradual Migration**

- Install Tailwind now
- Use for new features
- Migrate existing components over time
- Keep design system compatibility
