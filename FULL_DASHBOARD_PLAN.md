Complete Detailed Plan for ALL Tabs

Tab 1: Dashboard (Home)
Layout Structure:
Top Stats Cards (4 columns):
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total │ Total │ Pending │ Total │
│ Revenue │ Orders │ Payments │ Customers │
│ ₹45,600 │ 234 │ ₹2,400 │ 156 │
│ +12% ↑ │ +8% ↑ │ 12 orders │ +5 new │
└─────────────┴─────────────┴─────────────┴─────────────┘
Secondary Stats Cards (4 columns):
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Today's │ This Week │ Avg Order │ Cancel Rate │
│ Revenue │ Revenue │ Value │ │
│ ₹1,800 │ ₹8,500 │ ₹195 │ 2.5% │
│ 9 orders │ 45 orders │ │ 6 orders │
└─────────────┴─────────────┴─────────────┴─────────────┘
Charts Section (2 columns):
┌─────────────────────────────┬───────────────────────┐
│ Revenue Trend (6 months) │ Orders by Mode │
│ [Line Chart] │ [Pie Chart] │
│ │ Lunch: 65% │
│ │ Dinner: 35% │
├─────────────────────────────┼───────────────────────┤
│ Daily Orders This Month │ Payment Mode Split │
│ [Area Chart] │ [Bar Chart] │
│ │ Online: 180 │
│ │ Cash: 40 │
│ │ UPI: 14 │
└─────────────────────────────┴───────────────────────┘
Recent Activity Table:
Recent Orders (Last 10)
┌────────┬────────┬─────────┬────────┬────────┬────────┐
│ Date │Address │ Quantity│ Amount │ Mode │ Status │
├────────┼────────┼─────────┼────────┼────────┼────────┤
│Jan 15 │A3-1206 │ 2 │ ₹200 │ Lunch │ Paid │
│... │... │ ... │ ... │ ... │ ... │
└────────┴────────┴─────────┴────────┴────────┴────────┘
[View All Orders →]
Quick Actions Panel:
┌─────────────────────────┐
│ Quick Actions │
├─────────────────────────┤
│ [+ Add New Order] │
│ [📤 Export Data] │
│ [💰 Pending Payments] │
│ [📊 Generate Report] │
└─────────────────────────┘
API Endpoints for Dashboard:
GET /api/dashboard/stats
GET /api/dashboard/charts/revenue-trend
GET /api/dashboard/charts/orders-by-mode
GET /api/dashboard/recent-orders

Tab 2: All Orders Data
Layout:
Top Action Bar:
[🔍 Search orders...] [📤 Upload CSV] [➕ Add Order] [🗑️ Delete All] [📥 Export]
Filters Panel (Collapsible):
┌─────────────────────────────────────────────────────────┐
│ Filters [Clear All]│
├─────────────────────────────────────────────────────────┤
│ Date Range: [From] [To] │
│ Status: [All ▼] Mode: [All ▼] Payment: [All ▼] │
│ Month: [All ▼] Year: [All ▼] Address: [Search...] │
└─────────────────────────────────────────────────────────┘
Active Filters Display:
Applied: [Status: Paid ✕] [Mode: Lunch ✕] [Date: Jan 2025 ✕]
Data Table:
☑️ Select All Showing 1-25 of 234 orders

┌─┬────┬──────┬─────────┬────┬─────┬──────┬──────┬──────┬────────┬────────┬──────────┬──────────┐
│☑│S.No│Date │Address │Qty │Price│Total │Mode │Status│Payment │Month │Year│OrderID │Actions│
├─┼────┼──────┼─────────┼────┼─────┼──────┼──────┼──────┼────────┼────────┼──────────┼──────────┤
│☑│234 │15-Jan│A3-1206 │2 │₹100 │₹200 │Lunch │Paid │Online │Jan'25 │2025│HB-Jan'25-... │✏️ 🗑️│
│☑│233 │15-Jan│B2-405 │3 │₹100 │₹300 │Dinner│Pndng │Cash │Jan'25 │2025│HB-Jan'25-... │✏️ 🗑️│
│ │... │... │... │... │... │... │... │... │... │... │... │... │... │
└─┴────┴──────┴─────────┴────┴─────┴──────┴──────┴──────┴────────┴────────┴──────────┴──────────┘
Bulk Actions Bar (appears when rows selected):
[12 selected] [Mark as Paid] [Mark as Pending] [Delete Selected] [Export Selected]
Pagination:
[◀️ Previous] Page 1 of 10 [Next ▶️]
Show: [25 ▼] per page
Features:

Click column headers to sort (↑↓)
Double-click row to open edit modal
Right-click for context menu
Drag column borders to resize
Sticky header on scroll

API Endpoints:
GET /api/orders?page=1&limit=25&status=Paid&search=A3
POST /api/orders/bulk-delete
PUT /api/orders/bulk-update
GET /api/orders/export?filters=...

Tab 3: Current Month Data
Layout (Similar to All Orders but focused):
Header:
Current Month: January 2025 [Add New Order]
Stats Row:
┌────────────┬────────────┬────────────┬────────────┐
│ This Month │ Total │ Pending │ vs Last │
│ Revenue │ Orders │ Payments │ Month │
│ ₹15,600 │ 78 │ ₹1,200 │ +15% ↑ │
└────────────┴────────────┴────────────┴────────────┘
Quick Filters:
[All (78)] [Today (9)] [Yesterday (8)] [This Week (45)] [Pending (6)] [Paid (72)]
Add Order Form (Modal):
┌─────────────────────────────────────┐
│ Add New Order ✕ │
├─────────────────────────────────────┤
│ Date* [📅 15/01/2025] │
│ │
│ Delivery [🏠 ____________] │
│ Address* Recent: [A3-1206 ▼] │
│ │
│ Quantity* [🔢 2] │
│ │
│ Unit Price* [₹ 100] │
│ │
│ Total Amount [₹ 200] 🔒 Auto │
│ │
│ Mode* ⚪ Lunch ⚪ Dinner │
│ │
│ Status* ⚪ Paid ⚪ Pending │
│ │
│ Payment Mode\* [Online ▼] │
│ │
│ Order ID: HB-Jan'25-15-000079 │
│ (Auto-generated) │
│ │
│ [Cancel] [💾 Save Order] │
└─────────────────────────────────────┘
Form Validations:

Real-time validation
Error messages below fields
Duplicate address warning
Total amount auto-calculates
Can't select future date

Data Table:
Same as All Orders but filtered to current month
API Endpoints:
GET /api/orders/current-month
POST /api/orders/manual (for adding new order)
GET /api/orders/stats/current-month
GET /api/orders/addresses/recent (for autocomplete)

Tab 4: Analytics
Layout:
Time Period Selector:
[This Month ▼] [This Year ▼] [Custom Range]
Key Metrics Grid:
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total │ Growth │ Retention │ Churn │
│ Revenue │ Rate │ Rate │ Rate │
│ ₹145,600 │ +12.5% │ 85% │ 15% │
└─────────────┴─────────────┴─────────────┴─────────────┘
Charts Section:
Revenue Analysis:
┌──────────────────────────────────────┐
│ Monthly Revenue Trend (Last 12M) │
│ [Line Chart with data points] │
│ Peak: ₹18,500 (Dec 2024) │
└──────────────────────────────────────┘
Area-wise Performance:
┌──────────────────────────────────────┐
│ Top 10 Delivery Areas │
│ [Horizontal Bar Chart] │
│ 1. A3-1206 ₹12,400 (62 orders) │
│ 2. B2-405 ₹8,900 (45 orders) │
│ ... │
└──────────────────────────────────────┘
Order Pattern Analysis:
┌──────────────────────┬───────────────────┐
│ Orders by Day │ Orders by Hour │
│ [Bar Chart] │ [Heatmap] │
│ Mon: 45 │ 11AM-1PM: Peak │
│ Tue: 38 │ 6PM-8PM: Peak │
│ ... │ ... │
└──────────────────────┴───────────────────┘
Customer Behavior:
┌──────────────────────────────────────┐
│ Order Frequency Distribution │
│ [Scatter Plot] │
│ One-time: 45 customers │
│ Regular (>5): 30 customers │
│ VIP (>20): 8 customers │
└──────────────────────────────────────┘
Payment Analysis:
┌──────────────────────────────────────┐
│ Payment Mode Trends │
│ [Stacked Area Chart] │
│ Online growing 📈 │
│ Cash declining 📉 │
└──────────────────────────────────────┘
Downloadable Reports:
[📄 Monthly Summary] [📊 Quarterly Report] [📈 Annual Report]
API Endpoints:
GET /api/analytics/revenue-trend?period=12months
GET /api/analytics/top-areas
GET /api/analytics/order-patterns
GET /api/analytics/customer-behavior
GET /api/analytics/payment-trends

Tab 5: Customers
Layout:
Header:
Total Customers: 156 [➕ Add Customer] [📤 Export List]
Search & Filter:
[🔍 Search by address...] [Active ▼] [Sort by: Total Spent ▼]
Customer Cards Grid:
┌──────────────────────────┬──────────────────────────┐
│ A3-1206 │ B2-405 │
│ 👤 Regular Customer │ 👤 VIP Customer │
│ │ │
│ Total Orders: 28 │ Total Orders: 45 │
│ Total Spent: ₹5,600 │ Total Spent: ₹9,000 │
│ Avg Order: ₹200 │ Avg Order: ₹200 │
│ Last Order: 2 days ago │ Last Order: Today │
│ Preferred: Lunch │ Preferred: Dinner │
│ │ │
│ [View Orders] [Contact] │ [View Orders] [Contact] │
└──────────────────────────┴──────────────────────────┘
Customer Details Modal (on click):
┌─────────────────────────────────────┐
│ A3-1206 Customer Details ✕│
├─────────────────────────────────────┤
│ Status: 🟢 Active │
│ Customer Since: Feb 2024 │
│ Total Orders: 28 │
│ Total Spent: ₹5,600 │
│ Average Order Value: ₹200 │
│ Preferred Mode: Lunch (75%) │
│ Payment Mode: Online (90%) │
│ Last Order: 2 days ago │
│ │
│ Order History (Last 10): │
│ ┌──────┬─────┬──────┬────────┐ │
│ │Date │Qty │Amount│Status │ │
│ │15-Jan│2 │₹200 │Paid │ │
│ │... │... │... │... │ │
│ └──────┴─────┴──────┴────────┘ │
│ │
│ [View All Orders] [Send Message] │
└─────────────────────────────────────┘
Customer Segments:
┌─────────────┬─────────────┬─────────────┐
│ 🌟 VIP │ 📈 Regular │ 🆕 New │
│ (>20 orders)│ (5-20) │ (<5 orders) │
│ 8 customers │ 30 customers│ 118 cust. │
└─────────────┴─────────────┴─────────────┘
Inactive Customers Alert:
⚠️ 12 customers haven't ordered in 30+ days
[View List] [Send Win-back Message]
API Endpoints:
GET /api/customers?search=A3&sort=total_spent
GET /api/customers/:address/details
GET /api/customers/:address/orders
GET /api/customers/segments
GET /api/customers/inactive

Tab 6: Reports
Layout:
Report Types:
┌─────────────────┬─────────────────┬─────────────────┐
│ 📊 Sales Report │ 💰 Payment │ 📅 Monthly │
│ │ Report │ Statement │
│ [Generate] │ [Generate] │ [Generate] │
├─────────────────┼─────────────────┼─────────────────┤
│ 🏠 Area-wise │ 👥 Customer │ 📈 Growth │
│ Report │ Report │ Report │
│ [Generate] │ [Generate] │ [Generate] │
└─────────────────┴─────────────────┴─────────────────┘
Report Generator:
┌─────────────────────────────────────┐
│ Generate Report │
├─────────────────────────────────────┤
│ Report Type: [Sales Report ▼] │
│ │
│ Date Range: [From] [To] │
│ │
│ Filters: │
│ ☑️ Include Charts │
│ ☑️ Include Summary │
│ ☐ Group by Area │
│ ☐ Group by Mode │
│ │
│ Format: ⚪ PDF ⚪ Excel ⚪ CSV │
│ │
│ [📄 Preview] [📥 Download] │
└─────────────────────────────────────┘
Scheduled Reports:
Automated Reports
┌────────────┬──────────┬─────────┬────────┐
│ Report │ Schedule │ Format │ Action │
├────────────┼──────────┼─────────┼────────┤
│ Daily Sales│ Daily 9AM│ Email │ [✏️ 🗑️]│
│ Weekly Sum.│ Mon 10AM │ PDF │ [✏️ 🗑️]│
│ Monthly │ 1st 8AM │ Excel │ [✏️ 🗑️]│
└────────────┴──────────┴─────────┴────────┘
[➕ Add Scheduled Report]
Report History:
Recent Reports (Last 30 days)
┌────────┬──────────────┬────────┬─────────┐
│ Date │ Report Type │ Period │ Download│
├────────┼──────────────┼────────┼─────────┤
│15-Jan │ Sales Report │ Dec'24 │ [📥] │
│01-Jan │ Monthly Stmt │ Dec'24 │ [📥] │
│... │ ... │ ... │ ... │
└────────┴──────────────┴────────┴─────────┘
API Endpoints:
POST /api/reports/generate
GET /api/reports/templates
GET /api/reports/history
POST /api/reports/schedule
DELETE /api/reports/schedule/:id

Tab 7: Payment Management
Layout:
Summary Cards:
┌────────────┬────────────┬────────────┬────────────┐
│ Total Paid │ Pending │ Overdue │ This Month │
│ ₹143,200 │ ₹2,400 │ ₹800 │ ₹15,600 │
│ 222 orders │ 12 orders │ 4 orders │ 78 orders │
└────────────┴────────────┴────────────┴────────────┘
Pending Payments Table:
Pending Payments (Urgent)
┌────────┬─────────┬────────┬─────────┬──────────────┬────────┐
│ Date │ Address │ Amount │ Days │ Order ID │ Action │
│ │ │ │ Pending │ │ │
├────────┼─────────┼────────┼─────────┼──────────────┼────────┤
│10-Jan │A3-1206 │₹200 │5 days ⚠️│HB-Jan'25-... │[Remind]│
│12-Jan │B2-405 │₹300 │3 days │HB-Jan'25-... │[Remind]│
│... │... │... │... │... │... │
└────────┴─────────┴────────┴─────────┴──────────────┴────────┘
[Mark All as Paid] [Send Bulk Reminder]
Payment Timeline:
┌──────────────────────────────────────┐
│ Payment Collection Timeline (30 days)│
│ [Area Chart showing daily collection]│
│ Avg collection time: 2.3 days │
└──────────────────────────────────────┘
Payment Mode Performance:
┌──────────────────────────────────────┐
│ Payment Mode Breakdown │
│ [Donut Chart] │
│ Online: 76% (₹108,832) │
│ Cash: 20% (₹28,640) │
│ UPI: 4% (₹5,728) │
└──────────────────────────────────────┘
Send Reminder Modal:
┌─────────────────────────────────────┐
│ Send Payment Reminder ✕│
├─────────────────────────────────────┤
│ To: A3-1206 │
│ Amount: ₹200 │
│ Order: HB-Jan'25-10-000065 │
│ │
│ Message Template: │
│ [Friendly Reminder ▼] │
│ │
│ "Hi, this is a friendly reminder │
│ for your pending payment of ₹200 │
│ for order HB-Jan'25-10-000065." │
│ │
│ Send via: │
│ ☑️ SMS ☑️ WhatsApp ☐ Email │
│ │
│ [Cancel] [📤 Send] │
└─────────────────────────────────────┘
API Endpoints:
GET /api/payments/pending
GET /api/payments/overdue
POST /api/payments/mark-paid/:orderId
POST /api/payments/send-reminder
GET /api/payments/stats

Tab 8: Settings
Layout (Tabs within Settings):
Tab 8.1: General Settings
┌─────────────────────────────────────┐
│ Business Information │
├─────────────────────────────────────┤
│ Business Name: [HomieBites______] │
│ Contact: [+91 __________] │
│ Email: [_________________] │
│ Address: [_________________] │
│ │
│ [💾 Save Changes] │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Pricing Configuration │
├─────────────────────────────────────┤
│ Default Unit Price: [₹ 100] │
│ Lunch Price: [₹ 100] │
│ Dinner Price: [₹ 100] │
│ Minimum Order Qty: [1] │
│ │
│ [💾 Update Pricing] │
└─────────────────────────────────────┘
Tab 8.2: Order Settings
┌─────────────────────────────────────┐
│ Order Configuration │
├─────────────────────────────────────┤
│ Order ID Prefix: [HB-] │
│ Auto-generate Order ID: ☑️ │
│ Allow Duplicate Address: ☑️ │
│ Require Payment Confirmation: ☐ │
│ │
│ Status Options: │
│ • Paid │
│ • Pending │
│ • Cancelled │
│ [➕ Add Status] │
│ │
│ [💾 Save Settings] │
└─────────────────────────────────────┘
Tab 8.3: Notifications
┌─────────────────────────────────────┐
│ Notification Preferences │
├─────────────────────────────────────┤
│ Email Notifications: │
│ ☑️ Daily Summary │
│ ☑️ New Order Alert │
│ ☑️ Payment Received │
│ ☐ Low Order Day Warning │
│ │
│ SMS Notifications: │
│ ☑️ Payment Reminders │
│ ☐ Order Confirmations │
│ │
│ [💾 Save Preferences] │
└─────────────────────────────────────┘
Tab 8.4: Data Management
┌─────────────────────────────────────┐
│ Backup & Restore │
├─────────────────────────────────────┤
│ Last Backup: 15-Jan-2025 09:30 AM │
│ │
│ [💾 Backup Now] │
│ [📥 Download Backup] │
│ [♻️ Restore from Backup] │
│ │
│ Auto Backup: ☑️ Daily at 2:00 AM │
│ │
│ ⚠️ Danger Zone │
│ [🗑️ Clear All Data] (Irreversible) │
└─────────────────────────────────────┘
Tab 8.5: User Profile
┌─────────────────────────────────────┐
│ Your Profile │
├─────────────────────────────────────┤
│ Name: [Admin Name______] │
│ Email: [admin@example.com] │
│ Phone: [+91 __________] │
│ │
│ Change Password: │
│ Current Password: [********] │
│ New Password: [********] │
│ Confirm Password: [********] │
│ │
│ [💾 Update Profile] │
└─────────────────────────────────────┘
Tab 8.6: Theme Settings
┌─────────────────────────────────────┐
│ Appearance │
├─────────────────────────────────────┤
│ Theme: ⚪ Light ⚪ Dark ⚪ Auto │
│ │
│ Primary Color: [🎨 #3B82F6] │
│ Font Size: [Medium ▼] │
│ │
│ [💾 Apply Theme] │
└─────────────────────────────────────┘
API Endpoints:
GET /api/settings
PUT /api/settings/business
PUT /api/settings/pricing
PUT /api/settings/notifications
POST /api/settings/backup
POST /api/settings/restore
PUT /api/user/profile
PUT /api/user/password

Tab 9: Notifications
Layout:
Header:
Notifications (8 unread) [Mark All as Read] [⚙️ Settings]
Filter Tabs:
[All (45)] [Unread (8)] [Payments (12)] [Orders (25)] [System (8)]
Notification List:
┌─────────────────────────────────────────────────────┐
│ 🔴 New Order Received 2 mins ago │
│ Order #HB-Jan'25-15-000079 from A3-1206 │
│ Amount: ₹200 | Mode: Lunch | Status: Paid │
│ [View Order] │
├─────────────────────────────────────────────────────┤
│ 💰 Payment Overdue 1 hour ago │
│ Order #HB-Jan'25-10-000065 pending for 5 days │
│ Amount: ₹200 from A3-1206 │
│ [Send Reminder] [Mark as Paid] │
├─────────────────────────────────────────────────────┤
│ 📊 Daily Summary Generated Today 9AM │
│ Total orders: 9 | Revenue: ₹1,800 │
│ [View Report] │
├─────────────────────────────────────────────────────┤
│ ⚠️ Low Order Day Yesterday │
│ Only 3 orders received yesterday │
│ [View Details] │
└─────────────────────────────────────────────────────┘
Notification Settings (in modal):
┌─────────────────────────────────────┐
│ Notification Settings ✕│
├─────────────────────────────────────┤
│ Notify me about: │
│ ☑️ New orders │
│ ☑️ Payment received │
│ ☑️ Payment overdue (>3 days) │
│ ☑️ Daily summary │
│ ☐ Weekly report │
│ ☐ Low order days │
│ │
│ Delivery method: │
│ ☑️ In-app │
│ ☑️ Email │
│ ☐ SMS │
│ │
│ [Cancel] [💾 Save] │
└─────────────────────────────────────┘
API Endpoints:
GET /api/notifications?filter=unread
PUT /api/notifications/:id/read
PUT /api/notifications/mark-all-read
GET /api/notifications/settings
PUT /api/notifications/settings

Global Features (All Tabs)
Top Navigation Bar:
┌────────────────────────────────────────────────────────┐
│ [☰] HomieBites Admin [🔍 Search...] [🔔 8] [👤] │
└────────────────────────────────────────────────────────┘
Sidebar Navigation:
┌──────────────────┐
│ 📊 Dashboard │
│ 📋 All Orders │
│ 📅 Current Month │
│ 📈 Analytics │
│ 👥 Customers │
│ 📄 Reports │
│ 💰 Payments │
│ 🔔 Notifications │
│ ⚙️ Settings │
│ │
│ [🚪 Logout] │
└──────────────────┘
Global Search (Ctrl+K):
┌─────────Continue4:23 PM────────────────────────────┐
│ 🔍 Search everywhere... │
├─────────────────────────────────────┤
│ Recent Searches │
│ • A3-1206 │
│ • Pending payments │
│ │
│ Quick Actions │
│ • Add new order │
│ • Generate report │
│ • View analytics │
└─────────────────────────────────────┘

### Loading States:

⏳ Loading orders...
[Skeleton UI with shimmer effect]

### Empty States:

┌─────────────────────────────────────┐
│ 📦 │
│ No orders found │
│ Try adjusting your filters │
│ [Clear Filters] [Add Order] │
└─────────────────────────────────────┘

### Error States:

┌─────────────────────────────────────┐
│ ⚠️ │
│ Something went wrong │
│ [Try Again] [Contact Support] │
└─────────────────────────────────────┘
HomieBites Admin Dashboard - Complete Plan
Tech Stack

Frontend: React + Tailwind CSS
Backend: Node.js + Express
Database: MongoDB
File Upload: Multer (for CSV/Excel)
Auth: JWT tokens

Database Schema
javascript// Order Model
{
orderId: String (unique),
sNo: Number,
date: Date,
deliveryAddress: String,
quantity: Number,
unitPrice: Number,
totalAmount: Number,
mode: String (Lunch/Dinner),
status: String (Paid/Pending/Cancelled),
paymentMode: String (Online/Cash/UPI),
billingMonth: String,
year: Number,
createdAt: Date,
updatedAt: Date
}

```

---

## Dashboard Tabs Structure

### 1. **Dashboard (Home)**
**Cards to show:**
- Total Revenue (current month)
- Total Orders (current month)
- Pending Payments
- Total Customers (unique addresses)
- Average Order Value
- Month-over-Month Growth %

**Charts:**
- Revenue trend (last 6 months) - Line chart
- Orders by Mode (Lunch vs Dinner) - Pie chart
- Payment Mode distribution - Bar chart
- Daily orders (current month) - Area chart

**Recent Activity:**
- Last 10 orders table (mini version)

---

### 2. **All Orders Data**
**Features:**
- Data table with all columns
- Search bar (searches across all fields)
- Filters:
  - Date range picker
  - Status dropdown (All/Paid/Pending/Cancelled)
  - Mode dropdown (All/Lunch/Dinner)
  - Payment Mode dropdown
  - Month filter
  - Year filter
- Column sorting (click headers)
- Pagination (25/50/100 per page)
- Bulk actions:
  - Delete selected
  - Export selected to CSV
  - Mark as Paid/Pending
- Individual row actions:
  - Edit
  - Delete
  - View details

**Top actions bar:**
- Upload CSV/Excel button
- Delete All Records button (with confirmation)
- Export All to CSV
- Add Single Order button

---

### 3. **Current Month Data**
- Same as All Orders but filtered to current month automatically
- Shows month name in heading
- All same features as All Orders tab
- Special cards at top:
  - This Month Revenue
  - This Month Orders
  - Pending Payments This Month
  - Comparison with last month (+/- %)

---

### 4. **Analytics**
**Monthly Reports:**
- Month selector dropdown
- Revenue breakdown by:
  - Delivery Address (top 10)
  - Mode (Lunch/Dinner)
  - Payment Mode
- Downloadable report button

**Yearly Overview:**
- Year selector
- Month-wise revenue bar chart
- Quarterly comparison
- Peak hours/days analysis

---

### 5. **Customers**
- Unique delivery addresses list
- For each customer show:
  - Total orders
  - Total spent
  - Last order date
  - Average order value
  - Preferred mode (Lunch/Dinner)
- Search and filter customers
- Export customer list

---

### 6. **Reports**
**Pre-built reports:**
- Daily Sales Report
- Weekly Summary
- Monthly Statement
- Outstanding Payments
- Payment Mode Summary

Each with:
- Date range selector
- Download as PDF/CSV
- Email report option

---

### 7. **Settings**
- Unit Price management
- Status options management
- Backup database
- Restore database
- User profile settings
- Notification preferences

---

## Backend API Endpoints
```

POST /api/orders/upload - Bulk upload CSV/Excel
GET /api/orders - Get all orders (with filters)
GET /api/orders/:id - Get single order
POST /api/orders - Create single order
PUT /api/orders/:id - Update order
DELETE /api/orders/:id - Delete order
DELETE /api/orders/bulk - Delete multiple orders
GET /api/orders/stats - Dashboard statistics
GET /api/orders/current-month - Current month data
GET /api/orders/analytics - Analytics data
GET /api/customers - Customer list
GET /api/reports/:type - Generate reports

```

---

## File Upload Process

1. User selects CSV/Excel file
2. Frontend validates file format
3. Shows preview of first 10 rows
4. User confirms upload
5. File sent to backend via FormData
6. Backend processes file:
   - Validates each row
   - Checks for duplicates (orderId)
   - Inserts to MongoDB
7. Returns success/error summary
8. Frontend refreshes data automatically

---

## Key Features to Implement

**Data Table:**
- React Table or TanStack Table
- Virtual scrolling for large datasets
- Column resizing
- Sticky headers

**Upload:**
- Drag & drop zone
- Progress bar during upload
- Error handling with line numbers
- Validation summary

**Filters:**
- Persist filters in URL params (for refresh)
- Clear all filters button
- Active filters chips display

**Real-time Updates:**
- Refresh button with loading state
- Auto-refresh every 5 minutes
- Toast notifications for actions

**Export:**
- CSV export with current filters applied
- Excel export with formatting
- PDF reports with charts

**State Management:**
- React Query for data fetching
- Optimistic updates
- Cache invalidation

---

## UI Components Needed

- DataTable component
- StatCard component
- FilterPanel component
- UploadModal component
- ConfirmDialog component
- Chart components (recharts)
- Pagination component
- SearchBar component
- DateRangePicker component
- Toast/Notification system
- Loading skeletons
- Empty states

---

## Folder Structure
```

/client
/src
/components
/common (buttons, cards, etc)
/dashboard
/orders
/analytics
/customers
/pages
/hooks
/utils
/services (API calls)
/server
/routes
/controllers
/models
/middleware
/utils
Updated Plan - Manual Order Entry in Current Month Data Tab
Current Month Data Tab - Enhanced
Layout Structure
Top Section:
[Add New Order Button] [Upload CSV] [Export Month Data] [Delete All]
Stats Cards Row:

This Month Revenue
This Month Orders
Pending Payments
vs Last Month (%)

Main Data Table (with all features)

Add New Order Form
Form Fields:
┌─────────────────────────────────────┐
│ Add New Order ✕ │
├─────────────────────────────────────┤
│ │
│ Date* [Date Picker] │
│ Delivery Address* [Text Input] │
│ Quantity* [Number Input] │
│ Unit Price* [₹ Number Input] │
│ Total Amount [Auto-calculated] │
│ Mode* [Lunch ▼ Dinner] │
│ Status* [Paid ▼ Pending] │
│ Payment Mode\* [Online ▼ Cash ▼] │
│ │
│ OrderID: Auto-generated │
│ (HB-Jan'25-01-000042) │
│ │
│ [Cancel] [Save Order] │
└─────────────────────────────────────┘
Form Features:
Auto-calculations:

Total Amount = Quantity × Unit Price (auto-updates)
OrderID auto-generated based on:

Format: HB-{Month'Year}-{Day}-{SequenceNo}
Example: HB-Jan'25-15-000023
Sequence resets each day

Smart Defaults:

Date: Today's date pre-filled
Mode: Lunch (if time < 3 PM), else Dinner
Status: Pending
Payment Mode: Online

Validation:

All required fields marked with \*
Quantity > 0
Unit Price > 0
Total Amount validation
Duplicate address warning (if same address ordered today)
Date cannot be future date

Form Behavior:

Opens as modal/drawer
Click outside to close (with unsaved warning)
Form reset after successful save
Success toast notification
Table auto-refreshes with new order at top

Quick Add vs Full Form
Option 1: Quick Add (Floating Button)
[+ Quick Order] (bottom right corner)

Quick form with minimal fields:

- Address (dropdown of recent addresses)
- Quantity
- Mode
  Rest auto-filled with defaults
  Option 2: Full Form (Main Button)
  Full modal with all fields as shown above

Backend API for Manual Entry
javascriptPOST /api/orders/manual
Body: {
date: "2025-01-15",
deliveryAddress: "A3-1206",
quantity: 2,
unitPrice: 100,
totalAmount: 200,
mode: "Lunch",
status: "Paid",
paymentMode: "Online"
}

Response: {
success: true,
order: {
orderId: "HB-Jan'25-15-000042",
sNo: 42, // Auto-incremented
...all fields,
billingMonth: "Jan'25", // Auto-set
year: 2025, // Auto-set
createdAt: "2025-01-15T10:30:00Z"
}
}

Auto-generation Logic
OrderID Generation:
javascript// Server-side logic
const date = new Date(orderDate);
const month = date.toLocaleString('en-US', { month: 'short' });
const year = date.getFullYear().toString().slice(-2);
const day = date.getDate().toString().padStart(2, '0');

// Get today's order count
const todayCount = await Order.countDocuments({
date: { $gte: startOfDay, $lte: endOfDay }
});

const sequence = (todayCount + 1).toString().padStart(6, '0');
const orderId = `HB-${month}'${year}-${day}-${sequence}`;

```

### S.No Generation:
- Auto-increment across all orders
- Fetches highest sNo and adds 1
- Unique constraint in database

### Billing Month:
- Auto-extracts from date field
- Format: "Jan'25", "Feb'25"

---

## Enhanced Features for Current Month Tab

### 1. **Address Autocomplete**
- Dropdown shows recent/frequent addresses
- Type to filter
- Shows address with last order date
- "Add new address" option

### 2. **Duplicate Detection**
```

⚠️ Warning: A3-1206 already has an order today (Lunch)
Do you want to add another order?
[Yes, Add] [No, Cancel]

```

### 3. **Bulk Actions on Manual Entries**
- Select multiple rows
- Change status (Pending → Paid)
- Delete selected
- Update payment mode

### 4. **Edit Existing Order**
- Click row or Edit icon
- Opens same form pre-filled
- Shows "Update Order" instead of "Add New Order"
- Confirmation before update

### 5. **Quick Filters for Current Month**
```

[All] [Today] [Yesterday] [This Week] [Pending Only] [Paid Only]

Form Validation Rules
javascript{
deliveryAddress: {
required: true,
minLength: 3,
pattern: /^[A-Z0-9\-\/\s]+$/i
},
quantity: {
required: true,
min: 1,
max: 50 // reasonable limit
},
unitPrice: {
required: true,
min: 10,
max: 1000 // adjust as needed
},
totalAmount: {
validate: (val, formData) =>
val === formData.quantity \* formData.unitPrice
}
}

```

---

## UI/UX Enhancements

### Add Order Button States:
```

Normal: [+ Add New Order]
Loading: [⏳ Saving...]
Success: [✓ Order Added!] (2 seconds, then back to normal)
Table Row Highlight:

Newly added order highlights in green for 3 seconds
Scrolls to new row automatically

Keyboard Shortcuts:

Ctrl + N → Open Add Order form
Ctrl + S → Save order (when form open)
Esc → Close form

Mobile Responsive Form
Mobile Layout:

Full-screen modal
Stacked fields (one per row)
Large touch-friendly buttons
Number pad for quantity/price
Date picker optimized for mobile

Data Sync Strategy

User adds order → Immediately saved to backend
Backend returns saved order with generated IDs
Frontend adds to local state (optimistic update)
Table refreshes
Stats cards update
If error → Rolls back + shows error toast

Sample Code Structure
javascript// Form Component
const AddOrderForm = ({ onSuccess, editData }) => {
const [formData, setFormData] = useState(defaultValues);
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);

    try {
      const response = await api.post('/orders/manual', formData);
      toast.success('Order added successfully!');
      onSuccess(response.data.order);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

};

// Auto-calculate total
useEffect(() => {
const total = formData.quantity \* formData.unitPrice;
setFormData(prev => ({ ...prev, totalAmount: total }));
}, [formData.quantity, formData.unitPrice]);

return (/_ form JSX _/);
};
