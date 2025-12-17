# HomieBites - Premium Tiffin Service

A full-stack tiffin service platform with Next.js web app, React Native mobile app, and MongoDB backend.

## 🏗️ Project Structure

```
HomieBites/
├── web/          # Next.js website (App Router)
├── app/          # React Native Expo mobile app
├── backend/      # MongoDB REST API
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

3. **Install mobile app dependencies:**
```bash
cd app && npm install
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
# Runs Next.js web (port 3000) + Backend API (port 3001)
```

#### Individual Services

**Web Application (Next.js):**
```bash
npm run web
# or
cd web && npm run dev
# Access at http://localhost:3000
```

**Mobile App (Expo):**
```bash
npm run mobile
# or
cd app && npm start
# Scan QR code with Expo Go app
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

### Mobile (Expo)
- React Native
- Expo SDK
- AsyncStorage for local data
- React Navigation

### Backend (Node.js + MongoDB)
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

## 🔐 Admin Access

- URL: `http://localhost:3000/admin`
- Username: `adminHomieBites`
- Password: `Bless@@##12$$`

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

**Mobile:**
```bash
cd app
npm run build:android  # or build:ios
```

## 📄 License

ISC
