# HomieBites Admin Dashboard - Design System

## Overview

This document outlines the comprehensive design system for the HomieBites Admin Dashboard. All components should follow these design tokens and patterns for consistency.

## Design Tokens

### Colors

#### Primary Colors

- `--primary-500`: #3b82f6 (Main Brand Color - Blue)
- `--primary-600`: #2563eb (Hover state)
- `--primary-700`: #1d4ed8 (Active state)

#### Semantic Colors

- `--secondary-500`: #10b981 (Success/Green)
- `--warning-500`: #f59e0b (Warning/Orange)
- `--danger-500`: #ef4444 (Error/Red)
- `--info-500`: #06b6d4 (Info/Cyan)

#### Neutral Colors

- `--gray-50` through `--gray-900`: Complete gray scale
- `--text-primary`: #111827
- `--text-secondary`: #6b7280
- `--text-tertiary`: #9ca3af

### Typography

- **Font Family**: `--font-sans` (Inter, system fonts)
- **Font Sizes**: `--text-xs` (12px) through `--text-5xl` (48px)
- **Font Weights**: `--font-normal` (400), `--font-medium` (500), `--font-semibold` (600), `--font-bold` (700)
- **Line Heights**: `--leading-tight` (1.25), `--leading-normal` (1.5), `--leading-relaxed` (1.75)

### Spacing

8px base unit system:

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-12`: 48px

### Border Radius

- `--radius-sm`: 4px
- `--radius-md`: 6px
- `--radius-lg`: 8px
- `--radius-xl`: 12px
- `--radius-2xl`: 16px
- `--radius-full`: Circular

### Shadows

- `--shadow-sm`: Subtle shadow
- `--shadow-md`: Medium shadow (default)
- `--shadow-lg`: Large shadow
- `--shadow-xl`: Extra large shadow
- `--shadow-2xl`: Maximum shadow

## Component Library

### 1. Buttons

**Base Class**: `.btn`

**Variants**:

- `.btn-primary` - Blue background, white text
- `.btn-secondary` - Gray background
- `.btn-danger` - Red background
- `.btn-success` - Green background
- `.btn-ghost` - Transparent background

**Sizes**:

- `.btn-small` - 32px height
- Default - 40px height
- `.btn-large` - 48px height
- `.btn-full` - Full width
- `.btn-icon` - Square icon button

**States**:

- `:hover` - Slight elevation and darker color
- `:active` - Pressed state
- `:disabled` - Reduced opacity, no interaction

### 2. Input Fields

**Base Class**: `.input-field`

**Features**:

- Focus ring with primary color
- Error state with red border
- Disabled state with gray background
- Helper text support

**Form Structure**:

```html
<div class="form-group">
  <label class="required">Field Name</label>
  <input type="text" class="input-field" />
  <span class="helper-text">Helper text</span>
</div>
```

### 3. Cards

**Base Class**: `.dashboard-card` or `.stat-card`

**Features**:

- White background
- Rounded corners (--radius-xl)
- Shadow on hover
- Optional header/footer sections

### 4. Tables

**Base Class**: `.data-table` or `.orders-table`

**Features**:

- Sticky header
- Hover row highlighting
- Striped rows (optional)
- Sortable columns
- Row selection checkboxes

### 5. Badges & Status

**Base Class**: `.badge`

**Variants**:

- `.badge-success` - Green
- `.badge-warning` - Yellow
- `.badge-danger` - Red
- `.badge-info` - Cyan
- `.badge-primary` - Blue

**Status Badges**:

- `.status-paid` - Green background
- `.status-pending` - Yellow background
- `.status-overdue` - Red background
- `.status-cancelled` - Gray background

### 6. Modals

**Structure**:

- `.modal-overlay` - Backdrop with blur
- `.modal-container` - Main modal container
- `.modal-header` - Title and close button
- `.modal-body` - Content area
- `.modal-footer` - Action buttons

**Sizes**:

- Default: 500px max-width
- `.large`: 700px max-width
- `.full`: 90% width

### 7. Dropdowns

**Structure**:

- `.dropdown` - Container
- `.dropdown-menu` - Menu container
- `.dropdown-item` - Menu items
- `.dropdown-divider` - Separator

### 8. Toast Notifications

**Base Class**: `.toast`

**Variants**:

- `.toast-success` - Green left border
- `.toast-error` - Red left border
- `.toast-info` - Blue left border
- `.toast-warning` - Yellow left border

**Position**: Bottom right (default)

### 9. Charts

**Base Class**: `.chart-container`

**Structure**:

- `.chart-header` - Title and filters
- Chart visualization area
- `.chart-footer` - Insights/notes

### 10. Filters Panel

**Base Class**: `.filter-panel`

**Components**:

- `.filter-group` - Individual filter
- `.filter-label` - Filter label
- `.filter-chip` - Active filter indicator

### 11. Pagination

**Base Class**: `.pagination`

**Components**:

- `.pagination-info` - Page info text
- `.pagination-button` - Page buttons
- `.pagination-button.active` - Current page

### 12. Loading States

**Skeleton Loader**: `.skeleton`

- Animated shimmer effect
- Used for table rows, cards, etc.

**Spinner**: `.spinner`

- Rotating circle animation
- Used in buttons, loading states

### 13. Empty States

**Base Class**: `.empty-state`

**Components**:

- `.empty-icon` - Large faded icon
- `.empty-title` - Primary message
- `.empty-description` - Helper text
- Action buttons

### 14. Grid System

**Base Class**: `.grid-12` (12-column grid)

**Column Classes**:

- `.col-span-3` - 25% width
- `.col-span-4` - 33% width
- `.col-span-6` - 50% width
- `.col-span-8` - 66% width
- `.col-span-12` - 100% width

**Responsive**: Columns stack on mobile

## Usage Guidelines

### When to Use Design Tokens

1. **Always use CSS variables** instead of hardcoded values
2. **Use semantic tokens** (--text-primary) over raw colors
3. **Follow spacing scale** (--space-4, --space-6, etc.)
4. **Use component classes** when available

### Migration Strategy

1. New components: Use new design tokens directly
2. Existing components: Gradually migrate to new tokens
3. Legacy variables: Still supported for backward compatibility
4. Priority: Focus on frequently used components first

### Best Practices

1. **Consistency**: Use the same tokens for similar elements
2. **Hierarchy**: Use font sizes and weights to establish visual hierarchy
3. **Spacing**: Use spacing scale consistently
4. **Colors**: Use semantic colors (success, warning, danger) appropriately
5. **Responsive**: Always consider mobile breakpoints

## File Structure

```
admin/styles/
├── design-tokens.css    # All design tokens
├── components.css        # Component library styles
├── index.css            # Main import file
└── [component].css      # Component-specific overrides
```

## Examples

### Button Example

```html
<button class="btn btn-primary btn-small">
  <i class="fa-solid fa-save"></i> Save Order
</button>
```

### Card Example

```html
<div class="dashboard-card">
  <div class="card-header">
    <h3 class="card-title">Total Revenue</h3>
  </div>
  <div class="card-body">
    <div style="font-size: var(--text-3xl); font-weight: var(--font-bold);">
      ₹45,600
    </div>
  </div>
</div>
```

### Form Example

```html
<div class="form-group">
  <label class="required">Delivery Address</label>
  <input type="text" class="input-field" placeholder="Enter address" />
  <span class="helper-text">Enter the delivery address</span>
</div>
```

## Resources

- Design Tokens: `admin/styles/design-tokens.css`
- Components: `admin/styles/components.css`
- Visual Examples: See component library section above
