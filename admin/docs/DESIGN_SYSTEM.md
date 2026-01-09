# 🎨 Professional Admin Platform - Design System

## Color Palette

### Light Theme (Default)
- **Background**: `#F9FAFB` - Main background
- **Cards**: `#FFFFFF` - Card backgrounds
- **Primary**: `#2563EB` - Main actions, links, accents
- **Secondary**: `#3B82F6` - Secondary actions
- **Success**: `#16A34A` - Success states, positive actions
- **Warning**: `#F59E0B` - Warnings, caution states
- **Danger**: `#DC2626` - Errors, destructive actions
- **Text Primary**: `#111827` - Main text
- **Text Secondary**: `#6B7280` - Muted text
- **Border**: `#E5E7EB` - Borders, dividers

### Dark Theme
- **Background**: `#0F172A` - Main background (dark slate)
- **Cards**: `#111827` - Card backgrounds
- **Primary**: `#3B82F6` - Main actions, links, accents
- **Accent**: `#22D3EE` - Cyan accent for highlights
- **Text Primary**: `#E5E7EB` - Main text
- **Text Secondary**: `#9CA3AF` - Muted text
- **Border**: `#1F2937` - Borders, dividers

## Typography

### Font Families
- **Primary**: 'Baloo 2', sans-serif (Customizable via settings)
- **Monospace**: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New'

### Font Sizes
- **Base**: 16px (Customizable via settings)
- **Small**: 12px
- **Medium**: 14px
- **Large**: 18px
- **XL**: 24px
- **2XL**: 32px

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing System

### Scale (8px base)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## Border Radius

- **sm**: 4px
- **md**: 8px
- **lg**: 10px
- **xl**: 12px
- **2xl**: 16px
- **full**: 9999px

## Shadows

### Elevation Levels
- **Level 1**: `0 1px 2px rgba(0, 0, 0, 0.03)` - Cards
- **Level 2**: `0 2px 8px rgba(0, 0, 0, 0.06)` - Hovered cards
- **Level 3**: `0 4px 12px rgba(0, 0, 0, 0.1)` - Modals
- **Level 4**: `0 8px 24px rgba(0, 0, 0, 0.12)` - Elevated elements

### Colored Shadows
- **Primary**: `0 2px 8px rgba(37, 99, 235, 0.15)`
- **Success**: `0 2px 8px rgba(22, 163, 74, 0.15)`
- **Warning**: `0 2px 8px rgba(245, 158, 11, 0.15)`
- **Danger**: `0 2px 8px rgba(220, 38, 38, 0.15)`

## Button System

### Variants
1. **Primary** (`.btn-primary`)
   - Solid blue background
   - White text
   - Use for main actions

2. **Secondary** (`.btn-secondary`)
   - White background
   - Blue text and border
   - Use for secondary actions

3. **Ghost** (`.btn-ghost`)
   - Transparent background
   - Text color on hover
   - Use for tertiary actions

4. **Public** (`.btn-public`)
   - For public-facing actions
   - Custom styling

5. **Special** (`.btn-special`)
   - Customizable with CSS variables
   - Supports modifiers (`.whatsapp`, `.danger`, `.admin`)

### Sizes
- **Small** (`.btn-small`): Compact buttons
- **Default**: Standard size
- **Large** (`.btn-large`): Prominent buttons
- **Full** (`.btn-full`): Full width
- **Icon** (`.btn-icon`): Square icon buttons
- **Qty** (`.btn-qty`): Circular quantity buttons

## Animation System

### Timing Functions
- **Ease**: `cubic-bezier(0.4, 0, 0.2, 1)` - Standard transitions
- **Ease In**: `cubic-bezier(0.4, 0, 1, 1)` - Enter animations
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)` - Exit animations
- **Bounce**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Playful animations

### Durations
- **Fast**: 150ms - Micro-interactions
- **Normal**: 300ms - Standard transitions
- **Slow**: 500ms - Complex animations

### Keyframe Animations
- `fadeIn` - Fade in
- `fadeInUp` - Fade in from bottom
- `fadeInDown` - Fade in from top
- `slideInLeft` - Slide in from left
- `slideInRight` - Slide in from right
- `scaleIn` - Scale in
- `pulse` - Pulse effect
- `shake` - Shake on error
- `spin` - Loading spinner

## Component Patterns

### Cards
- Consistent padding: 14px
- Border radius: 10px
- Border: 1px solid
- Shadow: Level 1
- Hover: Lift + Level 2 shadow

### Forms
- Input height: 40px
- Border radius: 8px
- Focus: Scale 1.01 + colored border + shadow
- Error: Red border + shake animation

### Tables
- Row height: 48px
- Hover: Background change + scale 1.01
- Selected: Colored background + pulse glow

### Modals
- Max width: 600px
- Border radius: 16px
- Shadow: Level 3
- Animation: Scale in with bounce

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1)
- Interactive elements meet WCAG AA standards (3:1)

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators visible
- Escape closes modals
- Enter activates buttons

### Screen Readers
- ARIA labels on icons
- Semantic HTML
- Alt text for images
- Descriptive link text

### Reduced Motion
- Respects `prefers-reduced-motion`
- Animations disabled for accessibility

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## Best Practices

1. **Consistency**: Use design tokens, not hardcoded values
2. **Accessibility**: Always consider accessibility first
3. **Performance**: Use GPU-accelerated animations
4. **Responsive**: Mobile-first approach
5. **Semantic**: Use semantic HTML
6. **Progressive**: Enhance, don't break

