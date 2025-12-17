🏠 HOMIEBITES PLATFORM
COMPLETE MASTER BLUEPRINT (END-TO-END)

Version: 2.0 (FINAL)
Kitchen Type: Single Kitchen (HomieBites)
Platforms: Web (Next.js) + Mobile (Expo) + Backend + Admin
Data Source: Database only (NO Google Sheets)

1️⃣ BUSINESS SCOPE (LOCK THIS FIRST)
What HomieBites IS

Home-style food & tiffin service

Daily, weekly, monthly subscriptions

WhatsApp-confirmed orders

Admin-driven operations

What HomieBites IS NOT

❌ Multi-vendor

❌ Marketplace

❌ Fully automated (human confirmation exists)

❌ Sheet-based system

2️⃣ USER ROLES & RIGHTS (FULL)
2.1 Customer

Rights

Browse menu

Place orders

Subscribe

Pause / resume subscription

View order history

View invoices

Contact support via WhatsApp

Restrictions

Cannot modify confirmed orders

Cannot change pricing

Cannot access admin data

2.2 Admin (Owner / Manager)

Full Rights

View ALL data

Create / edit / cancel orders

Modify menu & pricing

Confirm WhatsApp orders

Manage subscriptions

Track payments

Generate reports

Export data

Control system settings

3️⃣ COMPLETE SYSTEM ARCHITECTURE
Customer (Web / App)
↓
Order Builder (Cart + Review)
↓
Backend API (Node + Express)
↓
Database (MongoDB)
↓
Admin Dashboard
↓
Kitchen / Delivery
↓
Customer (WhatsApp Updates)

4️⃣ CUSTOMER APPLICATION (WEB + MOBILE)
4.1 Pages / Screens
Public

Home

Menu

Pricing

How it Works

FAQ

Contact (WhatsApp CTA)

Auth

Login (Phone / OTP or simple login)

Register

Logged-in

Menu

Cart

Order Review

Orders History

Subscriptions

Addresses

Profile

5️⃣ CART & ORDER SYSTEM (FULL)
Cart Features

Add/remove items

Quantity control

Item availability validation

Slot-based availability

Subscription price calculation

Live total calculation

Order Types (MANDATORY)
ONE_TIME
TRIAL
DAILY
WEEKLY
MONTHLY
CUSTOM (admin-only)

Order Lifecycle
CREATED
WHATSAPP_SENT
CONFIRMED
PREPARING
READY
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
REFUNDED (future)

6️⃣ WHATSAPP INTEGRATION (CORE)
WhatsApp Usage

Order confirmation

Order clarification

Payment reminder

Subscription reminder

Pause/resume confirmation

WhatsApp Message Engine

Server-side generation

Stored per order

Editable by admin

Resendable

7️⃣ DELIVERY & SCHEDULING (FULL LOGIC)
Delivery Slots
BREAKFAST (optional future)
LUNCH
DINNER

Slot Rules

Slot capacity limit (admin-configurable)

Slot cutoff time

Slot disabled on holidays

Pause / Skip Logic (CRITICAL)

Pause entire subscription

Skip specific dates

Admin override allowed

8️⃣ SUBSCRIPTION ENGINE (DEEP)
Subscription Features

Auto-generate daily orders

Pause/resume

Skip days

Change address mid-cycle

Change slot mid-cycle

Pro-rata billing (future-ready)

Subscription States
ACTIVE
PAUSED
COMPLETED
CANCELLED

9️⃣ PAYMENT SYSTEM (CURRENT + FUTURE)
Current

Cash

UPI

Manual marking by admin

Future-ready

Razorpay / Stripe

Partial payment

Advance payment

Wallet balance

🔟 DATABASE DESIGN (COMPLETE)
User
{
name,
phone,
email,
role, // USER | ADMIN
addresses[],
isActive,
createdAt
}

Address
{
label,
address,
landmark,
pincode,
latitude,
longitude,
isDefault
}

Menu
{
category,
description,
isActive,
items: [
{
name,
price,
isAvailable,
tags
}
]
}

Order
{
orderNumber,
userId,
orderType,

items[],
delivery,
pricing,
payment,

status,
whatsappMessage,
internalNotes,

createdAt,
updatedAt
}

Subscription
{
userId,
planType,
items,
slot,
startDate,
endDate,
activeDays,
pausedDates,
pricePerDay,
status
}

Payment
{
orderId,
amount,
mode,
status,
receivedBy,
receivedAt
}

1️⃣1️⃣ ADMIN DASHBOARD (FULL COVERAGE)

11.1 Admin Architecture

Admin Access

- URL: `/admin` (Login page)
- URL: `/admin/dashboard` (Main dashboard)
- Authentication: JWT-based with role check
- Credentials: adminHomieBites / Bless@@##12$$

Admin Structure

```
admin/
├── AdminLogin.jsx          # Admin login component
├── AdminDashboard.jsx      # Main dashboard component
└── AdminDashboard.css     # Admin styles

web/app/admin/
├── page.jsx               # Admin login route
└── dashboard/
    └── page.jsx           # Admin dashboard route
```

11.2 Admin Modules (Implemented)

✅ Dashboard

- Overview statistics
- Today's orders count
- Revenue metrics
- Active subscriptions count
- Pending confirmations
- Payment pending amount
- Slot-wise order distribution

✅ Orders Management

- View all orders (table view)
- Filter by date range (today, week, month, custom)
- Filter by status (all, pending, paid, unpaid, delivered)
- Search orders by address/name
- Add new order manually
- Edit existing orders
- Delete orders
- Export orders to Excel
- View order details

✅ Menu Management

- View all menu categories and items
- Add new categories
- Add new items to categories
- Edit item names and prices
- Delete items
- Toggle item availability
- Save changes (syncs to website/app)
- Reset menu to default

✅ Customer Management

- View all registered users
- View user details
- View user order history
- View user addresses
- Block/unblock users (future)

✅ Analytics & Reports

- Monthly breakdown report
- Top 25 addresses report
- Unpaid amounts report
- Yearly performance comparison
- Revenue trends
- Order statistics
- Export data to Excel

✅ Settings

- WhatsApp number configuration
- Delivery timings
- Minimum order value
- Delivery charges
- Announcement text
- System preferences

✅ Notifications

- View system notifications
- Mark as read/unread
- Clear notifications

  11.3 Admin Dashboard Features

Sidebar Navigation

- Compact left sidebar design
- Menu items: Dashboard, Orders, Menu, Customers, Analytics, Settings
- Active state indicators
- Responsive (collapses on mobile)

Dashboard Widgets

- Today's Orders: Count of orders placed today
- Revenue Today: Total revenue for today
- Pending Payments: Amount pending payment
- Active Subscriptions: Count of active subscriptions
- Weekly Stats: Orders and revenue for current week
- Monthly Stats: Orders and revenue for current month

Orders Table

- Columns: S No., Date, Address, Quantity, Unit Price, Total, Status, Payment Mode
- Sortable columns
- Filterable by date range and status
- Search functionality
- Bulk actions (future)
- Export to Excel

Menu Editor

- Category-based organization
- Inline editing
- Add/Remove items
- Price updates
- Real-time sync to website/app

Analytics Dashboard

- Monthly breakdown charts
- Top addresses list
- Unpaid amounts summary
- Yearly comparison with trends
- Data visualization (charts/graphs)

  11.4 Admin API Endpoints

Authentication

- POST /api/auth/login (admin login)
- POST /api/auth/register (admin registration)

Orders

- GET /api/admin/orders (get all orders)
- POST /api/admin/orders (create order)
- PUT /api/admin/orders/:id (update order)
- DELETE /api/admin/orders/:id (delete order)
- GET /api/admin/orders/analytics (order analytics)

Menu

- GET /api/admin/menu (get menu)
- PUT /api/admin/menu (update menu)

Users

- GET /api/admin/users (get all users)
- GET /api/admin/users/:id (get user details)
- PUT /api/admin/users/:id (update user)
- DELETE /api/admin/users/:id (block user)

Reports

- GET /api/admin/reports/monthly (monthly breakdown)
- GET /api/admin/reports/top-addresses (top 25 addresses)
- GET /api/admin/reports/unpaid (unpaid amounts)
- GET /api/admin/reports/yearly (yearly comparison)
- GET /api/admin/reports/export (export data)

Settings

- GET /api/admin/settings (get settings)
- PUT /api/admin/settings (update settings)

  11.5 Admin Data Management

Excel Import/Export

- Upload old data via Excel file
- Export current data to Excel
- Bulk order import
- Data validation on import

Data Sync

- Real-time menu sync to website/app
- Order data persistence
- User data management
- Settings persistence

  11.6 Admin Security

Authentication

- JWT token-based authentication
- Role-based access control (admin role required)
- Session management
- Secure password storage (bcrypt)

Authorization

- Admin-only routes protected
- API endpoints require admin token
- Role verification middleware

  11.7 Admin UI/UX

Design

- Premium, compact design
- Left sidebar navigation
- Responsive layout
- Theme colors (Orange & Green)
- Consistent with website design

Components

- Data tables with sorting/filtering
- Modal dialogs for forms
- Toast notifications
- Loading states
- Error handling

  11.8 Admin Workflow

Daily Operations

1. Login to admin dashboard
2. View today's orders
3. Confirm pending orders
4. Update order status
5. Generate kitchen prep report
6. Track payments
7. Update menu if needed

Weekly Operations

1. Review weekly analytics
2. Export weekly reports
3. Update settings if needed
4. Review customer feedback
5. Manage subscriptions

Monthly Operations

1. Generate monthly reports
2. Review top customers
3. Analyze revenue trends
4. Update pricing if needed
5. Export data for accounting

1️⃣2️⃣ REPORTS (FULL LIST – DO NOT SKIP)
Operational Reports

Today’s Kitchen Prep Report

Slot-wise Order Summary

Item-wise Quantity Report

Delivery Address List

Financial Reports

Daily Revenue Report

Monthly Revenue Report

Payment Pending Report

Payment Mode Breakdown

Subscription Reports

Active Subscriptions

Expiring Subscriptions

Paused Subscriptions

Churned Customers

Customer Reports

Repeat Customers

Top Customers

Inactive Customers

Export Options

CSV

Excel

PDF (future)

1️⃣3️⃣ SETTINGS (ADMIN CONTROL)
System Settings

Kitchen open/close

Holidays

Slot timings

Cut-off times

Delivery charges

Tax settings

Content Settings

WhatsApp templates

Terms & conditions

FAQ content

1️⃣4️⃣ API LAYER (COMPLETE)

Authentication
POST /api/auth/login

- Body: { email, password }
- Returns: { success, token, user }
- Public endpoint

POST /api/auth/register

- Body: { name, email, phone, password }
- Returns: { success, token, user }
- Public endpoint

Customer Orders
POST /api/orders

- Body: { items, customerName, customerPhone, deliveryAddress, totalAmount }
- Returns: { success, order }
- Requires: Customer token (optional for guest)

GET /api/orders/my-orders

- Returns: { success, orders: [] }
- Requires: Customer token

Menu
GET /api/menu

- Returns: { success, menu: [] }
- Public endpoint

Admin Endpoints (Require Admin Token)

Orders Management
GET /api/admin/orders

- Query: ?dateRange=all|today|week|month&status=all|pending|paid|unpaid
- Returns: { success, orders: [] }
- Requires: Admin token

POST /api/admin/orders

- Body: { date, deliveryAddress, quantity, unitPrice, totalAmount, status, paymentMode, ... }
- Returns: { success, order }
- Requires: Admin token

PUT /api/admin/orders/:id

- Body: { status, paymentMode, ... }
- Returns: { success, order }
- Requires: Admin token

DELETE /api/admin/orders/:id

- Returns: { success }
- Requires: Admin token

Menu Management
PUT /api/admin/menu

- Body: { menu: [] }
- Returns: { success, menu }
- Requires: Admin token
- Syncs to website/app

User Management
GET /api/admin/users

- Returns: { success, users: [] }
- Requires: Admin token

GET /api/admin/users/:id

- Returns: { success, user, orders: [] }
- Requires: Admin token

PUT /api/admin/users/:id

- Body: { name, email, phone, role, isActive }
- Returns: { success, user }
- Requires: Admin token

Analytics & Reports
GET /api/admin/reports/monthly

- Query: ?month=YYYY-MM&year=YYYY
- Returns: { success, data: { monthlyBreakdown, topAddresses, unpaidAmounts } }
- Requires: Admin token

GET /api/admin/reports/top-addresses

- Query: ?limit=25&year=YYYY
- Returns: { success, addresses: [] }
- Requires: Admin token

GET /api/admin/reports/unpaid

- Query: ?year=YYYY
- Returns: { success, unpaid: [] }
- Requires: Admin token

GET /api/admin/reports/yearly

- Query: ?year=YYYY
- Returns: { success, data: { yearlyComparison, trends } }
- Requires: Admin token

GET /api/admin/reports/export

- Query: ?format=excel&dateRange=all|today|week|month
- Returns: Excel file download
- Requires: Admin token

Data Import
POST /api/admin/upload-excel

- Body: FormData with Excel file
- Returns: { success, imported: count }
- Requires: Admin token

Settings
GET /api/admin/settings

- Returns: { success, settings: {} }
- Requires: Admin token

PUT /api/admin/settings

- Body: { whatsappNumber, deliveryTimings, minOrderValue, ... }
- Returns: { success, settings }
- Requires: Admin token

Subscriptions (Future)
POST /api/subscriptions

- Body: { userId, planType, items, slot, startDate }
- Returns: { success, subscription }
- Requires: Customer token

PUT /api/subscriptions/:id/pause

- Returns: { success, subscription }
- Requires: Admin token

PUT /api/subscriptions/:id/resume

- Returns: { success, subscription }
- Requires: Admin token

1️⃣5️⃣ SECURITY & COMPLIANCE

JWT auth

Role-based access

Rate limiting

Input validation

Soft delete (no hard delete)

Audit logs (admin actions)

1️⃣6️⃣ DEPLOYMENT
Layer Tool
Web Vercel
Backend Railway / Render
DB MongoDB Atlas
Mobile Expo EAS
WhatsApp Deep link
1️⃣7️⃣ DEVELOPMENT PHASES (STRICT)
Phase 1 – Backend Core

Auth

Orders

Subscriptions

Reports

Phase 2 – Admin Dashboard

Operations

Reports

Controls

Phase 3 – Customer Web

Order flow

WhatsApp CTA

Phase 4 – Mobile App

Same APIs

Lightweight UI

1️⃣8️⃣ NON-NEGOTIABLE RULES

Admin is king

WhatsApp confirmation is mandatory

Database is single source of truth

Subscriptions drive revenue

Reports are not optional
