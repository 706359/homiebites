# Standard Button System

## Overview

All buttons in the HomieBites project should use the standardized button system defined in `shared/styles/shared.css`. This ensures consistency across the entire application.

## Base Class

All buttons start with the `.btn` base class:

```html
<button class="btn">Button</button>
```

## Button Variants

### Primary Button (Orange)
Use for primary actions like "Add to Cart", "Order Now", "Submit"

```html
<button class="btn btn-primary">Primary Action</button>
```

### Secondary Button (Green)
Use for secondary actions like "Order via WhatsApp"

```html
<button class="btn btn-secondary">Secondary Action</button>
```

### Ghost Button
Use for transparent buttons on colored backgrounds

```html
<button class="btn btn-ghost">Ghost Button</button>
```

### Outline Button
Use for outlined buttons

```html
<button class="btn btn-outline">Outline Button</button>
```

### Text Button
Use for text-only buttons (like back buttons)

```html
<button class="btn btn-text">Text Button</button>
```

### WhatsApp Button
Use for WhatsApp-specific actions

```html
<button class="btn btn-whatsapp">
  <i class="fa-brands fa-whatsapp"></i>
  Contact WhatsApp
</button>
```

## Button Sizes

### Small
```html
<button class="btn btn-primary btn-small">Small Button</button>
```

### Default (Medium)
```html
<button class="btn btn-primary">Default Button</button>
```

### Large
```html
<button class="btn btn-primary btn-large">Large Button</button>
```

## Full Width Buttons

```html
<button class="btn btn-primary btn-full">Full Width Button</button>
```

## Icon Buttons

### Icon Only
```html
<button class="btn btn-primary btn-icon">
  <i class="fa-solid fa-search"></i>
</button>
```

### With Text
```html
<button class="btn btn-primary">
  <i class="fa-solid fa-cart"></i>
  Add to Cart
</button>
```

## Quantity Buttons (Cart)

For quantity controls in cart:

```html
<button class="btn btn-qty">−</button>
<span>2</span>
<button class="btn btn-qty">+</button>
```

## Disabled State

All buttons automatically handle disabled state:

```html
<button class="btn btn-primary" disabled>Disabled Button</button>
```

## Examples

### Add to Cart Button
```html
<button class="btn btn-primary btn-small btn-full">Add</button>
```

### Order Button
```html
<button class="btn btn-secondary btn-full">Order via WhatsApp</button>
```

### Search Button
```html
<button class="btn btn-primary btn-icon" type="submit">
  <i class="fa-solid fa-magnifying-glass"></i>
</button>
```

### Back Button
```html
<button class="btn btn-text">← Back</button>
```

## Migration Guide

### Old Classes → New Classes

- `.add-btn` → `.btn .btn-primary .btn-small .btn-full`
- `.order-btn` → `.btn .btn-secondary .btn-full`
- `.login-submit-btn` → `.btn .btn-primary .btn-full`
- `.cta-button` → `.btn .btn-primary .btn-large`
- `.subscribe-btn` → `.btn .btn-primary .btn-small`
- `.qty-btn` → `.btn .btn-qty`
- `.back-btn` → `.btn .btn-text`
- `.result-add-btn` → `.btn .btn-primary .btn-small .btn-full`
- `.faq-whatsapp-btn` → `.btn .btn-whatsapp`
- `.search-button` → `.btn .btn-primary .btn-icon`

## Notes

- All buttons use Inter font family
- All buttons use theme colors (orange/green)
- Hover effects are consistent across all buttons
- Disabled state is handled automatically
- Buttons are accessible and keyboard navigable
