# HomieBites Admin Dashboard

This is a completely separate admin dashboard application, independent from the main website.

## Setup

1. Install dependencies:
```bash
npm install
```

## Development

Run the admin dashboard on port 3002:
```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:3002`

## Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

Preview the production build:
```bash
npm run preview
```

## Structure

- `lib/` - API and utility functions (api.js, auth.js, menuData.js, offersData.js)
- `components/` - React components
- `contexts/` - React contexts (NotificationContext)
- `hooks/` - Custom React hooks
- `domains/` - Domain-specific logic
- `utils/` - Utility functions
- `styles/` - CSS styles
- `public/` - Static assets

## Port Configuration

- Admin Dashboard: Port 3002
- Main Website: Port 3000
- Backend API: Port 3001

## Dependencies

The admin dashboard has its own `package.json` and is completely independent from the main website. It shares only the `shared/` directory for common styles and utilities.


