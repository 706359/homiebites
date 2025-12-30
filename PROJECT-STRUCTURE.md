# HomieBites Project Structure

## Overview

This is a monorepo project with:

1. **Next.js Website** - Modern web application (`web/`)
2. **MongoDB Backend** - RESTful API server (`backend/`)

## Directory Structure

```
HomieBites/
├── web/                    # Next.js web application
│   ├── app/                # Next.js App Router
│   │   ├── layout.jsx     # Root layout
│   │   ├── page.jsx       # Home page
│   │   ├── menu/          # Menu page route
│   │   ├── login/         # Login page route
│   │   ├── account/       # Account page route
│   │   └── admin/         # Admin routes
│   │       └── dashboard/ # Admin dashboard
│   ├── components/         # React components
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   └── LanguageContext.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useSmoothScroll.js
│   │   └── useRevealAnimation.js
│   ├── lib/                # Utility functions
│   │   ├── auth.js
│   │   ├── menuData.js
│   │   └── userAuth.js
│   ├── styles/             # Global styles
│   │   ├── globals.css
│   │   └── login.css
│   ├── public/             # Static assets
│   │   └── logo.png
│   ├── next.config.js      # Next.js configuration
│   └── package.json         # Web app dependencies
│
├── backend/                # MongoDB Backend API
│   ├── Raavito/
│   │   └── HomieBites/
│   │       ├── config/
│   │       │   └── database.js     # MongoDB connection
│   │       ├── models/             # Mongoose models
│   │       │   ├── User.js
│   │       │   ├── Order.js
│   │       │   └── Menu.js
│   │       ├── routes/             # API routes
│   │       │   ├── auth.js         # Authentication routes
│   │       │   ├── orders.js       # Order CRUD routes
│   │       │   └── menu.js         # Menu routes
│   │       ├── middleware/
│   │       │   └── auth.js         # JWT authentication
│   │       ├── scripts/
│   │       │   ├── seed.js         # Database seeding
│   │       │   └── verify.js       # Database verification
│   │       ├── server.js            # Express server
│   │       └── README.md           # Backend documentation
│   ├── .env                # Environment variables
│   ├── package.json
│   └── README.md
│
├── admin/                  # Admin dashboard components (used by web app)
│   ├── AdminLogin.jsx      # Admin login component
│   ├── AdminLogin.css
│   ├── AdminDashboard.jsx  # Admin dashboard
│   └── AdminDashboard.css
│
├── shared/                 # Shared resources
│   ├── styles/             # Shared CSS
│   │   ├── variables.css   # CSS variables
│   │   └── shared.css      # Shared styles
│   ├── locales/            # Translation files
│   │   ├── en.json         # English
│   │   └── hi.json         # Hindi
│   └── utils/              # Shared utilities
│       ├── menuData.js
│       ├── adminConfig.js
│       └── i18n.js
│
├── PROJECT-STRUCTURE.md    # This file
├── README.md               # Main project README
└── package.json            # Root package.json (workspace scripts)
```

## Technology Stack

### Web Application (Next.js)

- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18
- **Styling**: CSS Modules + Shared CSS
- **Routing**: Next.js App Router

### Backend (Node.js + MongoDB)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing

## Running the Project

### Web Application (Next.js)

```bash
# Install dependencies
cd web
npm install

# Development
npm run dev
# Access at http://localhost:3000

# Production build
npm run build
npm start
```

Or from root:

```bash
npm run web
```

### Backend (MongoDB API)

```bash
# From root directory
npm run backend
# Server runs on http://localhost:3001
```

### Run All (Development)

```bash
npm run dev:full
# Runs web + backend concurrently
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Menu

- `GET /api/menu` - Get menu (public)
- `PUT /api/menu` - Update menu (admin)

### Orders

- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

## Environment Variables

### Backend (.env in backend/)

```env
MONGOURI=mongodb://...
JWT_SECRET=your_secret_key
PORT=3001
NODE_ENV=development
```

## Admin Dashboard

Access via: `http://localhost:3000/admin`

- Username: `adminHomieBites`
- Password: `Bless@@##12$$`

## Language Support

- **English** (en) - Default
- **Hindi** (hi) - Full translation support
- Language switcher in header (web)
- Language preference persists across sessions

## Notes

- Backend API provides data synchronization
- Web application supports Hindi and English languages
- MongoDB stores all persistent data
- Logo is located at `web/public/logo.png`
