# Quick Reference - CSS Utility Classes

## 🎯 Most Used Classes

### Spacing (Padding)

```
.p-none     → padding: 0
.p-xs       → padding: 0.5rem 1rem
.p-sm       → padding: 10px 12px
.p-md       → padding: 10px 18px
.p-lg       → padding: 16px 24px
.p-extra-lg → padding: 48px
```

### Spacing (Margin - Top)

```
.mt-xs   → margin-top: 4px
.mt-sm   → margin-top: 8px
.mt-md   → margin-top: 12px
.mt-lg   → margin-top: 16px
.mt-xl   → margin-top: 1rem
.mt-2xl  → margin-top: 32px
```

### Spacing (Margin - Bottom)

```
.mb-xs → margin-bottom: 4px
.mb-sm → margin-bottom: 6px
.mb-md → margin-bottom: 8px
.mb-lg → margin-bottom: 12px
.mb-xl → margin-bottom: 16px
```

### Spacing (Margin - Right)

```
.mr-xs → margin-right: 4px
.mr-sm → margin-right: 6px
.mr-md → margin-right: 8px
```

### Layout

```
.flex-center      → display: flex; align-items: center; gap: 12px;
.flex-column      → display: flex; flex-direction: column; gap: 12px;
.flex-column-md   → display: flex; flex-direction: column; gap: 16px;
.inline-flex      → display: inline-flex; align-items: center;
.text-center      → text-align: center;
.text-left        → text-align: left;
.text-inline-block → display: inline-block;
```

### Colors & Icons

```
.icon-success  → color: var(--admin-success)
.icon-warning  → color: var(--admin-warning)
.icon-danger   → color: var(--admin-danger)
.icon-accent   → color: var(--admin-accent)
```

### Form Elements

```
.form-label-small   → font-size: 13px; margin-bottom: 6px;
.form-input-small   → padding: 10px 12px; font-size: 14px;
.form-group-full    → grid-column: 1 / -1; margin-bottom: 0;
.form-textarea      → padding: 10px 12px; resize: vertical;
```

### Empty States

```
.empty-state-container   → padding: 48px; text-align: center;
.empty-state-icon        → font-size: 64px; color: var(--admin-text-light);
.empty-state-icon-success → font-size: 64px; color: var(--admin-success);
.empty-state-text        → color: var(--admin-text-light); font-size: 0.9rem;
```

### Modals

```
.modal-header-compact → padding: 18px 24px;
.modal-header-title   → font-size: 20px; margin: 0;
.modal-body-compact   → padding: 20px 24px;
.max-width-540        → max-width: 540px;
```

### Utilities

```
.cursor-pointer      → cursor: pointer;
.select-none         → user-select: none;
.display-none        → display: none;
.text-bold           → font-weight: 600;
.text-no-margin      → margin: 0; line-height: 1.6;
```

---

## 🔄 Common Conversion Examples

### Example 1: Form Input

```jsx
// Before
<input style={{ padding: '10px 12px', fontSize: '14px' }} />

// After
<input className='form-input-small' />
```

### Example 2: Spacing Container

```jsx
// Before
<div style={{ marginTop: '1rem', textAlign: 'center', padding: '48px' }}>

// After
<div className='mt-xl text-center p-extra-lg'>
```

### Example 3: Flex Layout

```jsx
// Before
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

// After
<div className='flex-center'>
```

### Example 4: Empty State

```jsx
// Before
<div style={{ padding: '48px', textAlign: 'center' }}>
  <i style={{ fontSize: '64px', color: 'var(--admin-text-light)', marginBottom: '16px' }}></i>
  <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem' }}>

// After
<div className='empty-state-container'>
  <i className='empty-state-icon'></i>
  <p className='empty-state-text'>
```

### Example 5: Icon with Margin

```jsx
// Before
<i className='fa-solid fa-xmark' style={{ marginRight: '6px' }}></i>

// After
<i className='fa-solid fa-xmark mr-sm'></i>
```

---

## ⚡ When to Keep Inline Styles

✅ **Keep inline** for:

- Dynamic colors based on data
- Calculated dimensions
- Animation durations
- Conditional sizes
- API-driven styling

```jsx
// KEEP INLINE - Dynamic height from chart data
<div style={{ height: `${chartHeight}px` }} />

// KEEP INLINE - Dynamic color from status
<i style={{ color: getStatusColor(status) }} />

// KEEP INLINE - Animation duration from props
<div style={{ animationDuration: `${duration}ms` }} />

// USE CLASS - Static padding
<div className='p-lg'>
```

---

## 📚 Complete Class Reference

### All Available Classes in `utilities.css`

**Form Classes**

- `.form-group-full`
- `.form-group-full-top`
- `.form-label`
- `.form-label-small`
- `.form-input-small`
- `.form-input-medium`
- `.form-textarea`

**Modal Classes**

- `.modal-header-compact`
- `.modal-header-title`
- `.modal-body-compact`
- `.modal-footer-compact`
- `.modal-icon-box`
- `.max-width-540`

**Empty State Classes**

- `.empty-state-container`
- `.empty-state-icon`
- `.empty-state-icon-success`
- `.empty-state-text`

**Icon Classes**

- `.icon-small`
- `.icon-medium`
- `.icon-large`
- `.icon-margin-right-xs`
- `.icon-margin-right-sm`
- `.icon-margin-left-xs`
- `.icon-success`
- `.icon-warning`
- `.icon-danger`
- `.icon-accent`
- `.indicator-circle-small`

**Text Classes**

- `.text-bold`
- `.text-bold-styled`
- `.text-no-margin`
- `.text-center`
- `.text-left`
- `.text-inline-block`

**Padding Classes**

- `.p-none`, `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-extra-lg`
- `.px-sm`, `.px-md`, `.px-lg`

**Margin Classes**

- `.m-none`, `.m-xs`, `.m-sm`, `.m-md`, `.m-lg`, `.m-xl`
- `.mt-xs`, `.mt-sm`, `.mt-md`, `.mt-lg`, `.mt-xl`, `.mt-2xl`
- `.mb-xs`, `.mb-sm`, `.mb-md`, `.mb-lg`, `.mb-xl`
- `.mr-xs`, `.mr-sm`, `.mr-md`
- `.ml-xs`

**Layout Classes**

- `.flex-center`
- `.flex-column`
- `.flex-column-md`
- `.inline-flex`
- `.display-none`

**Interaction Classes**

- `.cursor-pointer`
- `.select-none`
- `.cursor-pointer-select-none`

**Settings/Component Classes**

- `.sidebar-logo-clickable`
- `.sidebar-logo-fallback-hidden`
- `.danger-zone-icon-wrapper`
- `.danger-zone-title`

---

## 🎓 Best Practices Checklist

When creating components:

- [ ] Use utility classes for all static spacing
- [ ] Use existing color classes for theme colors
- [ ] Keep only data-driven styling as inline
- [ ] Use semantic class names
- [ ] Test responsive behavior
- [ ] Verify dark theme compatibility
- [ ] Check with multiple browsers
- [ ] Validate CSS syntax
- [ ] Ensure accessibility (ARIA labels)
- [ ] Document any custom styles

---

## 🚀 Quick Copy-Paste Templates

### Form Container

```jsx
<div className='form-grid'>
  <div className='form-group-full'>
    <label className='form-label-small'>Label</label>
    <input className='input-field form-input-small' />
  </div>
</div>
```

### Modal

```jsx
<div className='modal-overlay'>
  <div className='modal-container max-width-540'>
    <div className='modal-header-compact'>
      <h2 className='modal-header-title'>Title</h2>
    </div>
    <div className='modal-body-compact'>{/* Content */}</div>
  </div>
</div>
```

### Empty State

```jsx
<div className='empty-state-container'>
  <i className='fa-solid fa-icon empty-state-icon'></i>
  <h3>No Items</h3>
  <p className='empty-state-text'>Message here</p>
</div>
```

### Flex Layout

```jsx
<div className='flex-center'>
  <i className='fa-solid fa-icon mr-md'></i>
  <span>Text</span>
</div>
```

---

**Last Updated:** January 14, 2026  
**Total Classes:** 150+  
**Status:** ✅ Ready to Use
