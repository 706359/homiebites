# Modal and Notification System Usage

## Modal Component

A reusable modal/popup wrapper component for displaying content in overlays.

### Basic Usage

```jsx
import Modal from '../components/Modal';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal Title"
      >
        <p>Your modal content here</p>
      </Modal>
    </>
  );
}
```

### Props

- `isOpen` (boolean, required): Controls modal visibility
- `onClose` (function, required): Callback when modal should close
- `title` (string, optional): Modal title (shown in header)
- `size` (string, optional): Modal size - `'small'`, `'medium'`, `'large'`, `'full'` (default: `'medium'`)
- `showCloseButton` (boolean, optional): Show close button (default: `true`)
- `closeOnOverlayClick` (boolean, optional): Close when clicking overlay (default: `true`)
- `className` (string, optional): Additional CSS classes

### Size Options

- `small`: Max width 400px
- `medium`: Max width 600px (default)
- `large`: Max width 900px
- `full`: 95vw × 95vh

### Features

- ✅ ESC key to close
- ✅ Click overlay to close (optional)
- ✅ Body scroll lock when open
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Custom scrollbar

### Example: Modal without Header

```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showCloseButton={false}
>
  <div>
    <h2>Custom Header</h2>
    <p>Content without default header</p>
  </div>
</Modal>
```

---

## Notification System

A toast notification system for showing success, error, warning, and info messages.

### Setup

The `NotificationProvider` and `NotificationWrapper` are already set up in `app/layout.jsx`.

### Basic Usage

```jsx
import { useNotification } from '../contexts/NotificationContext';

function MyComponent() {
  const { success, error, warning, info } = useNotification();

  const handleSuccess = () => {
    success('Order placed successfully!');
  };

  const handleError = () => {
    error('Something went wrong. Please try again.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### Available Methods

#### `success(message, duration?)`
Show a success notification.

```jsx
const { success } = useNotification();
success('Order placed successfully!', 5000); // 5 seconds
```

#### `error(message, duration?)`
Show an error notification.

```jsx
const { error } = useNotification();
error('Failed to save. Please try again.');
```

#### `warning(message, duration?)`
Show a warning notification.

```jsx
const { warning } = useNotification();
warning('Please check your input.');
```

#### `info(message, duration?)`
Show an info notification.

```jsx
const { info } = useNotification();
info('New features available!');
```

#### `showNotification(message, type, duration?)`
Generic method for custom notifications.

```jsx
const { showNotification } = useNotification();
showNotification('Custom message', 'info', 3000);
```

#### `removeNotification(id)`
Manually remove a notification by ID.

```jsx
const { showNotification, removeNotification } = useNotification();
const id = showNotification('This will be removed', 'info', 0); // 0 = no auto-remove
setTimeout(() => removeNotification(id), 5000);
```

#### `clearAll()`
Remove all notifications.

```jsx
const { clearAll } = useNotification();
clearAll();
```

### Notification Types

- `success`: Green border, check icon
- `error`: Red border, exclamation icon
- `warning`: Orange border, warning icon
- `info`: Blue border, info icon

### Features

- ✅ Auto-dismiss after duration (default: 5 seconds)
- ✅ Click to dismiss
- ✅ Close button
- ✅ Stack multiple notifications
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Position: Top-right (desktop), Full-width (mobile)

### Example: Using in API Calls

```jsx
import { useNotification } from '../contexts/NotificationContext';

function OrderButton() {
  const { success, error } = useNotification();

  const handleOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        success('Order placed successfully!');
      } else {
        error('Failed to place order. Please try again.');
      }
    } catch (err) {
      error('Network error. Please check your connection.');
    }
  };

  return <button onClick={handleOrder}>Place Order</button>;
}
```

### Example: Form Validation

```jsx
function ContactForm() {
  const { success, error, warning } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !message) {
      warning('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      error('Please enter a valid email address.');
      return;
    }

    // Submit form...
    success('Message sent successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

---

## Complete Example: Modal with Notifications

```jsx
'use client';

import { useState } from 'react';
import Modal from '../components/Modal';
import { useNotification } from '../contexts/NotificationContext';

export default function ExamplePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { success, error } = useNotification();

  const handleSubmit = async () => {
    try {
      // API call...
      success('Data saved successfully!');
      setIsModalOpen(false);
    } catch (err) {
      error('Failed to save. Please try again.');
    }
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="medium"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input type="text" placeholder="Enter data" />
          <button type="submit">Save</button>
        </form>
      </Modal>
    </>
  );
}
```

---

## Styling

Both components use CSS variables from the design system. Customize colors in `shared/styles/variables.css`:

- `--green`: Success color
- `--orange`: Warning color
- `--error-red`: Error color
- `--primary-blue`: Info color
- `--white`: Background
- `--black`: Text color
- `--border-color`: Borders
- `--light-gray`: Light backgrounds

---

## Notes

- Modals automatically lock body scroll when open
- Notifications stack vertically (newest on top)
- Both components are fully responsive
- All animations are smooth and performant
- Components follow the design system

