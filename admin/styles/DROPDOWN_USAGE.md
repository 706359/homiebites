# Custom Dropdown Usage Guide

## Basic Usage

### Option 1: Using `.dropdown-wrapper` (Recommended)

```jsx
<div className='dropdown-wrapper'>
  <label>Select an option</label>
  <select>
    <option value=''>Choose...</option>
    <option value='1'>Option 1</option>
    <option value='2'>Option 2</option>
  </select>
</div>
```

### Option 2: Using `.custom-dropdown` class directly

```jsx
<select className='custom-dropdown'>
  <option value=''>Choose...</option>
  <option value='1'>Option 1</option>
</select>
```

### Option 3: With existing `.form-group`

```jsx
<div className='form-group'>
  <label>Select an option</label>
  <select>
    {' '}
    {/* Automatically styled */}
    <option value=''>Choose...</option>
  </select>
</div>
```

## Sizes

### Small

```jsx
<div className='dropdown-wrapper small'>
  <label>Small Dropdown</label>
  <select>
    <option>Option 1</option>
  </select>
</div>
```

### Large

```jsx
<div className='dropdown-wrapper large'>
  <label>Large Dropdown</label>
  <select>
    <option>Option 1</option>
  </select>
</div>
```

## States

### Error State

```jsx
<div className='dropdown-wrapper error'>
  <label>Select with Error</label>
  <select>
    <option>Option 1</option>
  </select>
  <span className='dropdown-error-message'>Please select a valid option</span>
</div>
```

### Success State

```jsx
<div className='dropdown-wrapper success'>
  <label>Valid Selection</label>
  <select>
    <option>Option 1</option>
  </select>
</div>
```

### Disabled State

```jsx
<select className='custom-dropdown' disabled>
  <option>Disabled option</option>
</select>
```

## Helper Text

```jsx
<div className='dropdown-wrapper'>
  <label>Select an option</label>
  <select>
    <option>Option 1</option>
  </select>
  <span className='dropdown-helper'>Choose the best option for you</span>
</div>
```

## Features

- ✅ Glassmorphism design matching admin theme
- ✅ Custom dropdown arrow icon
- ✅ Hover and focus states
- ✅ Error and success states
- ✅ Disabled state styling
- ✅ Multiple sizes (small, default, large)
- ✅ Uses CSS variables from admin theme
- ✅ Smooth transitions and animations
- ✅ Accessible focus indicators
