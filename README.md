# HomieBites - Premium Tiffin Service

A full-stack tiffin service platform with Next.js web app and MongoDB backend.

## 🏗️ Project Structure

```
HomieBites/
├── web/          # Next.js website (App Router) - Port 3000
├── admin/        # Admin Dashboard (Vite/React) - Port 3002
├── backend/      # MongoDB REST API - Port 3001
└── shared/       # Shared resources (styles, utils, locales)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB connection string
- npm or yarn

### Installation

1. **Install root dependencies:**

```bash
npm install
```

2. **Install web app dependencies:**

```bash
cd web && npm install
```

3. **Install admin dashboard dependencies:**

```bash
cd admin && npm install
```

4. **Setup backend:**

```bash
cd backend
# Create .env file with MongoDB URI and JWT_SECRET
npm install
```

### Running the Project

#### Development Mode (All Services)

```bash
# From root directory
npm run dev:full
# Runs Web (port 3000) + Backend API (port 3001)

# Or run all services including admin:
npm run dev:all
# Runs Web (port 3000) + Admin Dashboard (port 3002) + Backend API (port 3001)
```

#### Individual Services

**Web Application (Vite/React):**

```bash
npm run web
# or
cd web && npm run dev
# Access at http://localhost:3000
```

**Admin Dashboard (Vite/React):**

```bash
npm run admin
# or
cd admin && npm run dev
# Access at http://localhost:3002 (or http://0.0.0.0:3002)
# Admin runs on a separate host/port from the website
```

**Backend API:**

```bash
npm run backend
# or
cd backend && node server.js
# API at http://localhost:3001
```

## 📱 Technology Stack

### Web (Next.js)

- Next.js 14+ with App Router
- React 18
- Server-side rendering
- API routes support

### Backend (Node.js + MongoDB)

- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

## 🔐 Admin Access

- **Admin Dashboard URL**: `http://localhost:3002` (separate host from website)
- **Website URL**: `http://localhost:3000`
- Mobile: `8958111112` or Username: `adminHomieBites`
- Password: `Bless@@!!##12`

**Note**: The admin dashboard runs on a completely separate host (port 3002) from the main website (port 3000).

## 📚 API Documentation

See [backend/README.md](./backend/README.md) for complete API documentation.

## 🌐 Language Support

- English (en)
- Hindi (hi)

Language preference persists across sessions.

## 📝 Environment Variables

### Backend (.env in backend/)

```env
MONGOURI=mongodb://...
JWT_SECRET=your_secret_key
PORT=3001
NODE_ENV=development
```

## 🛠️ Development

### Build for Production

**Web:**

```bash
cd web
npm run build
npm start
```

## 📄 License

ISC
