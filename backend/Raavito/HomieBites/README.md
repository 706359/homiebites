# HomieBites Backend API

MongoDB-based backend server for HomieBites tiffin service.

## Database Configuration

The backend uses a **separate MongoDB database called "HomieBites"** to keep data isolated from other applications.

**Database Structure:**
```
MongoDB Server: sql.infodatixhosting.com:27017
Database: HomieBites
Collections:
  - users
  - orders
  - menus
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in `backend/` directory:
```env
MONGOURI=mongodb://remoteUser:95OztwADZCCVeFzy@sql.infodatixhosting.com:27017/HomieBites?authSource=admin
JWT_SECRET=YBIocj5v7exl45cb
PORT=3001
NODE_ENV=development
```

**Note:** The database name in the connection string is `/HomieBites` (not `/Raavito`)

3. Start the server:
```bash
npm start
# or from root directory
npm run backend
```

## Seed Data

Create test user and dummy order:
```bash
npm run seed
```

This creates:
- Test user: `12345@test.com` / Password: `12345`
- One dummy order entry

## Verify Data

Check what's in the database:
```bash
npm run verify
```

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "success": true,
  "user": { ... },
  "token": "jwt_token_here"
}
```

### Menu

#### Get Menu (Public)
```
GET /api/menu
```

#### Update Menu (Admin only)
```
PUT /api/menu
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "categories": [ ... ]
}
```

### Orders

#### Get All Orders (Admin only)
```
GET /api/orders
Headers: { "Authorization": "Bearer <token>" }
Query params: ?status=pending&dateFrom=2025-01-01&dateTo=2025-01-31&search=address
```

#### Get My Orders
```
GET /api/orders/my-orders
Headers: { "Authorization": "Bearer <token>" }
```

#### Create Order
```
POST /api/orders
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "date": "01/01/2025",
  "deliveryAddress": "A1-407 Shriti",
  "quantity": 1,
  "unitPrice": 100,
  "totalAmount": 100,
  "status": "pending",
  "paymentMode": "Online",
  "items": [ ... ]
}
```

#### Update Order (Admin only)
```
PUT /api/orders/:id
Headers: { "Authorization": "Bearer <token>" }
Body: { ... }
```

#### Delete Order (Admin only)
```
DELETE /api/orders/:id
Headers: { "Authorization": "Bearer <token>" }
```

## Models

### User
- name, email, phone, password
- addresses[]
- role: 'customer' | 'admin'

### Order
- sNo, date, deliveryAddress
- quantity, unitPrice, totalAmount
- status, paymentMode
- billingMonth, referenceMonth, elapsedDays, year
- customerId, customerName, customerPhone
- items[]

### Menu
- categories[]

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

Admin routes require user with `role: 'admin'`.

## Database Isolation

All HomieBites data is stored in the **HomieBites** database, separate from other applications (like Raavito) that may use the same MongoDB server.
