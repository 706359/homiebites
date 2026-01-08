Complete Detailed Plan for ALL Tabs (10 Tabs Total)

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

Tab 9: Menu & Price Management
Layout:
Header:
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ Menu & Price Management │
│ Manage your menu items, categories, and pricing │
│ [➕ Add Menu Item] │
└──────────────────────────────────────────────────────────────────────────────────┘
Action Bar:
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [🔍 Search menu items...] │
│ Category: [All Categories ▼] │
│ Sort by: [Name (A-Z) ▼] │
└──────────────────────────────────────────────────────────────────────────────────┘
Menu Items Grid:
┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
│ 🍽️ Lunch Combo │ 🍽️ Dinner Special │ 🍽️ Snacks Combo │
│ Category: Lunch │ Category: Dinner │ Category: Snacks │
│ 🟢 Available │ 🟢 Available │ 🔴 Unavailable │
│ │ │ │
│ Description: │ Description: │ Description: │
│ Delicious lunch combo │ Special dinner meal │ Tasty snacks │
│ │ │ │
│ Price: ₹100 │ Price: ₹100 │ Price: ₹50 │
│ │ │ │
│ [👁️ Toggle] [✏️ Edit] [🗑️ Delete] │ [👁️ Toggle] [✏️ Edit] [🗑️ Delete] │ [👁️ Toggle] [✏️ Edit] [🗑️ Delete] │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘
Add/Edit Menu Item Modal:
┌─────────────────────────────────────┐
│ ➕ Add Menu Item ✕│
├─────────────────────────────────────┤
│ │
│ Item Name* │
│ [Lunch Combo________________] │
│ │
│ Description │
│ [Delicious lunch combo...] │
│ │
│ Category* │
│ [Lunch ▼] │
│ • Lunch │
│ • Dinner │
│ • Snacks │
│ • Beverages │
│ │
│ Price (₹)\* │
│ [100.00] │
│ │
│ Image URL │
│ [https://example.com/image.jpg] │
│ │
│ ☑️ Available for ordering │
│ │
│ [Cancel] [➕ Add Item] │
└─────────────────────────────────────┘
Features:

- Search menu items by name, description, or category
- Filter by category (Lunch, Dinner, Snacks, Beverages)
- Sort by name, price, or category (ascending/descending)
- Add new menu items with full details
- Edit existing menu items
- Delete menu items (with confirmation)
- Toggle availability (Available/Unavailable)
- Grid view with cards showing all item details
- Empty state when no items match filters
- Image URL support for menu items
- Price management per item
- Category management
  API Endpoints:
  GET /api/menu-items - Get all menu items
  POST /api/menu-items - Create new menu item
  GET /api/menu-items/:id - Get single menu item
  PUT /api/menu-items/:id - Update menu item
  DELETE /api/menu-items/:id - Delete menu item
  PUT /api/menu-items/:id/toggle-availability - Toggle availability

Tab 10: Notifications
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
│ 🍽️ Menu & Price │
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

Frontend: Next.js 16 (React Framework) + Tailwind CSS
Backend: Node.js + Express
Database: MongoDB
File Upload: Multer (for CSV/Excel)
Auth: JWT tokens
Routing: Next.js App Router (file-based routing)

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

### 8. **Menu & Price Management**
**Features:**
- Menu items CRUD (Create, Read, Update, Delete)
- Category management (Lunch, Dinner, Snacks, Beverages)
- Price management per item
- Availability toggle (Available/Unavailable)
- Search and filter menu items
- Sort by name, price, or category
- Image URL support
- Grid view with item cards

**Form Fields:**
- Item Name (required)
- Description (optional)
- Category (required)
- Price (required)
- Image URL (optional)
- Availability toggle

**Actions:**
- Add new menu item
- Edit existing menu item
- Delete menu item (with confirmation)
- Toggle availability
- Search and filter
- Sort items

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
Lifetime Value (CLV): │
│ • VIP Average: ₹4,200 • Regular Average: ₹1,800 • New Average: ₹400 │
└──────────────────────────────────────────────────────────────────────────────────┘

**5. Order Frequency Distribution:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 🔄 Order Frequency Analysis [Scatter ▼] [Export] │
├──────────────────────────────────────────────────────────────────────────────────┤
│ │
│ Orders │
│ per ● │
│ Customer │
│ 40 ┤ ● │
│ │ │
│ 30 ┤ ● ● ● │
│ │ │
│ 20 ┤ ● ● ● ● ● ● ● ● │
│ │ │
│ 10 ┤ ● ● ● ● ● ● ● ● ● ● │
│ │ │
│ 0 └─────────────────────────────────────────────────────────── Days Active │
│ 0 30 60 90 120 150 180 │
│ │
│ Insights: │
│ • One-time customers: 45 (28.8%) - Churn risk │
│ • Regular customers (>5 orders): 38 (24.4%) - Core base │
│ • VIP customers (>20 orders): 8 (5.1%) - Loyalty program candidates │
│ • Average order frequency: 8.2 orders per customer │
│ • Time between orders: Average 12.5 days │
└──────────────────────────────────────────────────────────────────────────────────┘

**6. Payment Mode Trends:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 💳 Payment Mode Evolution (6 Months) [Stacked ▼] [Export] │
├──────────────────────────────────────────────────────────────────────────────────┤
│ │
│ 100%│████████████████████████████████████████████████ Online │
│ │ │
│ 80%│████████████████████████████████████████ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Cash │
│ 60%│████████████████████████████████ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ 40%│██████████████████████████ │
│ │░░░░░░░░░░░░░░░░░░░░░░ │
│ 20%│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ UPI │
│ │ │
│ 0%└─────────────────────────────────────────────────────────────────────── │
│ Aug Sep Oct Nov Dec Jan │
│ '24 '24 '24 '24 '24 '25 │
│ │
│ Trends: │
│ • Online: 📈 Growing (65% → 76%) - Preferred method │
│ • Cash: 📉 Declining (30% → 20%) - Moving to digital │
│ • UPI: ↔️ Stable (5% → 4%) - Small but consistent │
│ │
│ Current Split: Online 76% | Cash 20% | UPI 4% │
└──────────────────────────────────────────────────────────────────────────────────┘

**7. Seasonal Trends:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 🌡️ Seasonal Performance (Year-over-Year) [Multi-line ▼] [Export]│
├──────────────────────────────────────────────────────────────────────────────────┤
│ │
│ Revenue │
│ (₹K) ●--2024 │
│ ○--2025 (Projected) │
│ 20 ┤ ● ● │
│ │ ● ● ○ │
│ 15 ┤ ● ● ● ○ │
│ │ ● ● ● ○ (Projected) │
│ 10 ┤ ● │
│ │ │
│ 5 ┤ │
│ │ │
│ 0 └───────────────────────────────────────────────────────────────────── │
│ J F M A M J J A S O N D │
│ │
│ Insights: │
│ • Summer (May-Aug): Lower demand (-15% avg) │
│ • Winter (Nov-Feb): Peak season (+25% avg) │
│ • Monsoon (July-Sep): Stable, slight dip │
│ • Festival months (Oct-Nov, Mar): High activity │
│ │
│ 2025 Projection: ₹175,000 (+20% vs 2024) │
└──────────────────────────────────────────────────────────────────────────────────┘

**8. Profit Margin Analysis (If expense data available):**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 💰 Profit Margins (Last 6 Months) [Column ▼] [Export 📥] │
├──────────────────────────────────────────────────────────────────────────────────┤
│ │
│ Amount │
│ (₹K) █ Revenue █ Cost █ Profit │
│ │
│ 20 ┤ ██████ ██████ ██████ ██████ ██████ ██████ │
│ │ ██████ ██████ ██████ ██████ ██████ ██████ │
│ 15 ┤ ██████ ██████ ██████ ██████ ██████ ██████ │
│ │ ██████ ██████ ██████ ██████ ██████ ██████ │
│ 10 ┤ ██████ ██████ ██████ ██████ ██████ ██████ │
│ │ ██░░░░ ██░░░░ ██░░░░ ██░░░░ ██░░░░ ██░░░░ │
│ 5 ┤ ██░░░░ ██░░░░ ██░░░░ ██░░░░ ██░░░░ ██░░░░ │
│ │ ▓▓▓▓▓▓ ▓▓▓▓▓▓ ▓▓▓▓▓▓ ▓▓▓▓▓▓ ▓▓▓▓▓▓ ▓▓▓▓▓▓ │
│ 0 └───────────────────────────────────────────────────────────────────── │
│ Aug'24 Sep'24 Oct'24 Nov'24 Dec'24 Jan'25 │
│ │
│ Profit Margin: 35% average │
│ Best month: December (40% margin) │
│ Cost breakdown: Materials 45%, Labor 20%, Delivery 10%, Other 25% │
└──────────────────────────────────────────────────────────────────────────────────┘

**Predictive Analytics Section:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 🔮 Predictions & Forecasts │
├──────────────────────────────────────────────────────────────────────────────────┤
│ │
│ Next Month Forecast (February 2025): │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Expected Revenue: ₹16,500 ± ₹2,000 (Confidence: 85%) │
│ Expected Orders: 82-88 orders │
│ Peak Days: 5th, 12th, 19th (Mondays) │
│ Churn Risk: 12 customers (Send win-back campaigns) │
│ │
│ Recommendations: │
│ • Focus on retaining 24 inactive customers │
│ • Promote dinner orders (currently only 35% of total) │
│ • Target weekends for special offers (20% lower than weekdays) │
│ • Consider loyalty program for 8 VIP customers │
│ │
│ [📊 View Detailed Predictions] [📥 Download Forecast Report] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Comparison Mode:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 🔄 Compare Periods │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Period A: [Jan 2025 ▼] vs Period B: [Dec 2024 ▼] [Compare] │
│ │
│ ┌────────────────────────────┬────────────────────────────┬──────────────────┐ │
│ │ Metric │ Jan 2025 │ Dec 2024 (Δ) │ │
│ ├────────────────────────────┼────────────────────────────┼──────────────────┤ │
│ │ Total Revenue │ ₹15,600 │ ₹13,867 (+12.5%)│ │
│ │ Total Orders │ 78 │ 72 (+8.3%) │ │
│ │ Avg Order Value │ ₹200 │ ₹193 (+3.6%) │ │
│ │ Lunch Orders │ 51 (65%) │ 48 (67%) (-1.5%) │ │
│ │ Dinner Orders │ 27 (35%) │ 24 (33%) (+1.5%) │ │
│ │ Online Payments │ 59 (76%) │ 51 (71%) (+5.0%) │ │
│ │ New Customers │ 5 │ 8 (-37.5%)│ │
│ │ Retention Rate │ 85% │ 82% (+3.0%) │ │
│ └────────────────────────────┴────────────────────────────┴──────────────────┘ │
│ │
│ Key Changes: │
│ ✅ Revenue up 12.5% - Strong growth │
│ ✅ Average order value increased │
│ ✅ More online payments (digital adoption) │
│ ⚠️ Fewer new customers - Need acquisition campaign │
└──────────────────────────────────────────────────────────────────────────────────┘

**Export Options:**
┌─────────────────────────────────────────────┐
│ Export Analytics Report ✕│
├─────────────────────────────────────────────┤
│ Period: [January 2025 ▼] │
│ │
│ Include: │
│ ☑️ Revenue trends │
│ ☑️ Customer analytics │
│ ☑️ Area-wise performance │
│ ☑️ Order patterns │
│ ☑️ Payment analysis │
│ ☑️ Predictions │
│ ☑️ Charts & graphs │
│ │
│ Format: │
│ ⚪ PDF Report │
│ ⚪ Excel Workbook │
│ ⚪ PowerPoint Presentation │
│ │
│ [Cancel] [📥 Export] │
└─────────────────────────────────────────────┘

### **API Endpoints:**

```javascript
// Get analytics summary
GET /api/analytics/summary?period=thisMonth

// Revenue trend
GET /api/analytics/revenue-trend?months=12

// Area-wise performance
GET /api/analytics/areas/top?limit=10&period=thisMonth

// Order patterns
GET /api/analytics/order-patterns?type=dayOfWeek
GET /api/analytics/order-patterns?type=hourly

// Customer behavior
GET /api/analytics/customers/segmentation
GET /api/analytics/customers/frequency

// Payment trends
GET /api/analytics/payments/trends?months=6

// Seasonal analysis
GET /api/analytics/seasonal?years=2

// Profit margins
GET /api/analytics/profit-margins?months=6

// Predictions
GET /api/analytics/predictions?nextMonths=1

// Compare periods
GET /api/analytics/compare?periodA=2025-01&periodB=2024-12

// Export report
POST /api/analytics/export
Body: { period, includes, format }
```

---

## **TAB 5: CUSTOMERS**

### **Layout:**

**Header:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 👥 Customers │
│ Total: 156 customers | Active: 132 | Inactive: 24 | New (This Month): 5 │
│ [➕ Add Customer] [📤 Export List] [📥 Import] [🔄 Refresh] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Search & Filter Bar:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [🔍 Search by address, name, phone... ] │
│ Status: [All ▼] [Active] [Inactive] │
│ Segment: [All ▼] [VIP] [Regular] [New] │
│ Sort by: [Total Spent ▼] [Order Count] [Last Order] [Alphabetical] │
│ [Apply Filters] [Clear] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Customer Segmentation Tabs:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [All (156)] [🌟 VIP (8)] [📈 Regular (30)] [🆕 New (118)] [⚠️ Inactive (24)] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Customer Grid/Cards View (Toggle between Grid and List):**
[Grid View 🟦] [List View ▤]
Grid View:
┌────────────────────────┬────────────────────────┬────────────────────────┐
│ 🏠 A3-1206 │ 🏠 B2-405 │ 🏠 C1-789 │
│ 👤 Rajesh Kumar │ 👤 Priya Sharma │ 👤 Amit Singh │
│ 📞 +91 98765 43210 │ 📞 +91 98765 43211 │ 📞 +91 98765 43212 │
│ │ │ │
│ 🌟 VIP Customer │ 📈 Regular Customer │ 📈 Regular Customer │
│ 🟢 Active │ 🟢 Active │ 🟢 Active │
│ │ │ │
│ 📊 Statistics: │ 📊 Statistics: │ 📊 Statistics: │
│ Total Orders: 28 │ Total Orders: 18 │ Total Orders: 12 │
│ Total Spent: ₹5,600 │ Total Spent: ₹3,600 │ Total Spent: ₹2,400 │
│ Avg Order: ₹200 │ Avg Order: ₹200 │ Avg Order: ₹200 │
│ Last Order: 2 days ago │ Last Order: 1 week ago │ Last Order: 3 days ago │
│ │ │ │
│ 🍽️ Preferences: │ 🍽️ Preferences: │ 🍽️ Preferences: │
│ Lunch (75%) │ Dinner (65%) │ Lunch (60%) │
│ 💳 Online (90%) │ 💳 Cash (60%) │ 💳 Online (75%) │
│ │ │ │
│ [View Orders] │ [View Orders] │ [View Orders] │
│ [Contact] [Edit] │ [Contact] [Edit] │ [Contact] [Edit] │
└────────────────────────┴────────────────────────┴────────────────────────┘

**List View:**
┌─┬──────────────┬────────────┬────────┬────────┬──────────┬──────────┬────────┬─────────┐
│☑│ Address │ Name │ Phone │Segment │ Orders │ Spent │Last Ord│ Actions │
├─┼──────────────┼────────────┼────────┼────────┼──────────┼──────────┼────────┼─────────┤
│☑│ A3-1206 │Rajesh K. │+91 987.│🌟 VIP │ 28 │ ₹5,600 │2 days │👁️ 💬 ✏️│
│☑│ B2-405 │Priya S. │+91 987.│📈 Reg │ 18 │ ₹3,600 │1 week │👁️ 💬 ✏️│
│☑│ C1-789 │Amit S. │+91 987.│📈 Reg │ 12 │ ₹2,400 │3 days │👁️ 💬 ✏️│
│☑│ D4-567 │Neha P. │+91 987.│🆕 New │ 4 │ ₹800 │5 days │👁️ 💬 ✏️│
│☑│ E5-890 │Vikram R. │+91 987.│⚠️ Inac │ 24 │ ₹4,800 │45 days │👁️ 💬 ✏️│
│ │ ... │... │... │... │ ... │ ... │... │ ... │
└─┴──────────────┴────────────┴────────┴────────┴──────────┴──────────┴────────┴─────────┘

**Customer Details Modal (Click on customer card or row):**
┌───────────────────────────────────────────────────────────────────┐
│ 👤 Customer Details - A3-1206 ✕│
├───────────────────────────────────────────────────────────────────┤
│ │
│ Basic Information: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Name: Rajesh Kumar │
│ Delivery Address: A3-1206, Tower A, 12th Floor │
│ Phone: +91 98765 43210 │
│ Email: rajesh.kumar@email.com │
│ Status: 🟢 Active │
│ Segment: 🌟 VIP Customer (20+ orders) │
│ Customer Since: 5 February 2024 (11 months) │
│ │
│ Order Statistics: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Total Orders: 28 orders │
│ Total Spent: ₹5,600 │
│ Average Order: ₹200 │
│ Last Order: 13 January 2025 (2 days ago) │
│ Order Frequency: Every 12 days (average) │
│ Lifetime Value: ₹5,600 (Top 5%) │
│ │
│ Preferences: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Preferred Mode: 🍽️ Lunch (21 orders, 75%) │
│ 🌙 Dinner (7 orders, 25%) │
│ Payment Mode: 💳 Online (25 orders, 90%) │
│ 💵 Cash (2 orders, 7%) │
│ 📱 UPI (1 order, 3%) │
│ Usual Order Size: 2 meals │
│ │
│ Subscription: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Plan: None │
│ [➕ Offer Subscription Plan] │
│ │
│ Order History (Last 10): │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ┌──────────┬──────┬────┬──────┬──────┬────────┬──────────────┐ │
│ │ Date │ Mode │Qty │Amount│Status│Payment │ Order ID │ │
│ ├──────────┼──────┼────┼──────┼──────┼────────┼──────────────┤ │
│ │ 13-Jan-25│Lunch │ 2 │₹200 │Paid │Online │HB-Jan'25-... │ │
│ │ 01-Jan-25│Dinner│ 2 │₹200 │Paid │Online │HB-Jan'25-... │ │
│ │ 28-Dec-24│Lunch │ 2 │₹200 │Paid │Cash │HB-Dec'24-... │ │
│ │ 15-Dec-24│Lunch │ 2 │₹200 │Paid │Online │HB-Dec'24-... │ │
│ │ 05-Dec-24│Dinner│ 2 │₹200 │Paid │Online │HB-Dec'24-... │ │
│ │ ... │... │... │... │... │... │... │ │
│ └──────────┴──────┴────┴──────┴──────┴────────┴──────────────┘ │
│ │
│ [📊 View Full Order History (28 orders)] │
│ │
│ Customer Insights: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ • Highly consistent customer - Orders every 10-14 days │
│ • Strong preference for lunch meals (75%) │
│ • Always pays online - Reliable payment │
│ • No missed/cancelled orders - Excellent track record │
│ • Perfect candidate for subscription plan │
│ │
│ Actions: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ [📧 Send Email] [💬 Send SMS] [📱 WhatsApp] [➕ Add Order] │
│ [✏️ Edit Info] [🎁 Offer Discount] [📋 Add Note] [🗑️ Delete] │
│ │
└───────────────────────────────────────────────────────────────────┘

**Add/Edit Customer Modal:**
┌─────────────────────────────────────────────┐
│ ➕ Add New Customer ✕│
├─────────────────────────────────────────────┤
│ │
│ Basic Details: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Full Name* │
│ [] │
│ │
│ Delivery Address* │
│ [] │
│ Building/Tower, Floor, Flat No. │
│ │
│ Phone Number\* │
│ [+91 __________] │
│ │
│ Email (Optional) │
│ [] │
│ │
│ Preferences: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Preferred Mode: │
│ ⚪ Lunch ⚪ Dinner ⚪ Both │
│ │
│ Preferred Payment: │
│ ⚪ Online ⚪ Cash ⚪ UPI │
│ │
│ Notes: │
│ [] │
│ (Dietary preferences, special requests) │
│ │
│ [Cancel] [💾 Save Customer] │
└─────────────────────────────────────────────┘

**Inactive Customers Alert:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Inactive Customers Alert │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 24 customers haven't ordered in 30+ days. Send win-back campaign? │
│ │
│ Most valuable inactive customers: │
│ • E5-890 (Vikram R.) - Last order: 45 days ago - LTV: ₹4,800 │
│ • H8-123 (Sunita M.) - Last order: 38 days ago - LTV: ₹3,200 │
│ • K2-456 (Ravi P.) - Last order: 35 days ago - LTV: ₹2,800 │
│ │
│ [📧 Send Win-back Email] [💬 Send SMS] [View All Inactive] [Dismiss] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Win-back Campaign Modal:**
┌─────────────────────────────────────────────────────────────┐
│ 📧 Send Win-back Campaign ✕│
├─────────────────────────────────────────────────────────────┤
│ │
│ Send to: │
│ ☑️ All inactive customers (24) │
│ ☐ Select specific customers │
│ │
│ Campaign Type: │
│ ⚪ Discount Offer (20% off next order) │
│ ⚪ Free Meal Offer (Buy 1 Get 1) │
│ ⚪ Subscription Promotion │
│ ⚪ Custom Message │
│ │
│ Message Template: │
│ ┌───────────────────────────────────────────────────────┐payment method only- Cash/Online
Orders- only mannul entry and bulk upload some time when needed3:38 PM│
│ │ Hi {customer_name}, │ │
│ │ │ │
│ │ We miss you! It's been a while since your last │ │
│ │ order. As a valued customer, we're offering you │ │
│ │ 20% OFF your next order. │ │
│ │ │ │
│ │ Use code: COMEBACK20 │ │
│ │ Valid until: 31-Jan-2025 │ │
│ │ │ │
│ │ Order now: [Link] │ │
│ │ │ │
│ │ Best regards, │ │
│ │ HomieBites Team │ │
│ └───────────────────────────────────────────────────────┘ │
│ │
│ Send via: │
│ ☑️ SMS ☑️ WhatsApp ☑️ Email │
│ │
│ Schedule: │
│ ⚪ Send now │
│ ⚪ Schedule for: [Date] [Time] │
│ │
│ Estimated cost: ₹48 (24 customers × ₹2/message) │
│ │
│ [Cancel] [Preview] [📤 Send Campaign] │
└─────────────────────────────────────────────────────────────┘

**Customer Insights Dashboard:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 📊 Customer Insights │
├──────────────────────────────────────────────────────────────────────────────────┤
│ │
│ Customer Acquisition: │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ Month │ New │ Retained │ Churned │ Net Growth │ │
│ ├────────┼─────┼──────────┼─────────┼──────────── │ │
│ │ Jan'25 │ 5 │ 132 │ 3 │ +2 │ │
│ │ Dec'24 │ 8 │ 125 │ 5 │ +3 │ │
│ │ Nov'24 │ 6 │ 122 │ 2 │ +4 │ │
│ └────────┴─────┴──────────┴─────────┴──────────── │ │
│ │
│ Customer Health Score: │
│ 🟢 Healthy (85+): 108 customers (69%) │
│ 🟡 At Risk (50-84): 24 customers (15%) │
│ 🔴 Critical (<50): 24 customers (15%) │
│ │
│ Recommended Actions: │
│ • Focus on 24 at-risk customers before they churn │
│ • Launch VIP rewards program for top 8 customers │
│ • Send personalized offers to 118 new customers to increase frequency │
│ │
│ [📥 Download Full Report] [⚙️ Configure Scoring] │
└──────────────────────────────────────────────────────────────────────────────────┘

### **API Endpoints:**

```javascript
// Get all customers with filters
GET /api/customers?search=A3&status=Active&segment=VIP&sortBy=totalSpent&page=1&limit=20

// Get single customer details
GET /api/customers/:address/details

// Get customer order history
GET /api/customers/:address/orders?limit=10

// Add new customer
POST /api/customers
Body: { name, deliveryAddress, phone, email, preferences, notes }

// Update customer
PUT /api/customers/:address
Body: { ...updated fields }

// Delete customer
DELETE /api/customers/:address

// Get customer segments
GET /api/customers/segments

// Get inactive customers
GET /api/customers/inactive?days=30

// Send win-back campaign
POST /api/customers/win-back-campaign
Body: { customerAddresses, campaignType, message, channels, schedule }

// Get customer insights
GET /api/customers/insights

// Get customer health scores
GET /api/customers/health-scores

// Export customers
GET /api/customers/export?format=csv&segment=All

// Import customers
POST /api/customers/import
Body: FormData with file
```

---

## **TAB 6: REPORTS**

### **Layout:**

**Header:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 📄 Reports │
│ Generate, schedule, and download various business reports │
└──────────────────────────────────────────────────────────────────────────────────┘

**Report Templates Grid:**
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ 📊 Sales Report │ 💰 Payment Report │ 📅 Monthly Statement │
│ ─────────────────────── │ ─────────────────────── │ ─────────────────────── │
│ Overview of all sales │ Payment collection │ Comprehensive monthly │
│ by date, area, mode │ status and trends │ business summary │
│ │ │ │
│ [Generate Report] │ [Generate Report] │ [Generate Report] │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ 🏠 Area-wise Report │ 👥 Customer Report │ 📈 Growth Report │
│ ─────────────────────── │ ─────────────────────── │ ─────────────────────── │
│ Performance by │ Customer analytics │ Business growth │
│ delivery areas │ and behavior │ and trends │
│ │ │ │
│ [Generate Report] │ [Generate Report] │ [Generate Report] │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ 📦 Inventory Report │ 🚚 Delivery Report │ 💵 Expense Report │
│ ─────────────────────── │ ─────────────────────── │ ─────────────────────── │
│ Stock and meal │ Delivery performance │ Business expenses │
│ capacity tracking │ and efficiency │ and cost analysis │
│ │ │ │
│ [Generate Report] │ [Generate Report] │ [Generate Report] │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘

**Generate Report Modal (Example: Sales Report):**
┌───────────────────────────────────────────────────────────────┐
│ 📊 Generate Sales Report ✕│
├───────────────────────────────────────────────────────────────┤
│ │
│ Report Configuration: │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ │
│ Time Period: │
│ ⚪ Today │
│ ⚪ Yesterday │
│ ⚪ This Week │
│ ⚪ This Month │
│ ⚪ Last Month │
│ ⚪ This Year │
│ ⚪ Custom Range: [From: //] [To: //] │
│ │
│ Include in Report: │
│ ☑️ Executive Summary │
│ ☑️ Revenue Breakdown │
│ ☑️ Order Statistics │
│ ☑️ Payment Analysis │
│ ☑️ Mode-wise Performance (Lunch/Dinner) │
│ ☑️ Area-wise Distribution │
│ ☑️ Charts and Graphs │
│ ☑️ Top Customers │
│ ☑️ Trends and Comparisons │
│ ☐ Detailed Transaction List │
│ │
│ Group By: │
│ ⚪ Daily ⚪ Weekly ⚪ Monthly │
│ │
│ Export Format: │
│ ⚪ PDF Report (Professional format) │
│ ⚪ Excel Workbook (.xlsx) │
│ ⚪ CSV Data (.csv) │
│ ⚪ PowerPoint Presentation (.pptx) │
│ │
│ Advanced Options: │
│ ☐ Include comparative analysis (vs previous period) │
│ ☐ Add forecasts and predictions │
│ ☐ Include recommendations │
│ ☐ Email report after generation │
│ │
│ Email to (if checked above): │
│ [admin@homiebites.com_______________________] │
│ │
│ [Cancel] [Preview] [📥 Generate & Download] │
└───────────────────────────────────────────────────────────────┘

**Report Preview Modal:**
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 👁️ Report Preview - Sales Report (January 2025) ✕│
├───────────────────────────────────────────────────────────────────────────────────┤
│ │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ HOMIEBITES │ │
│ │ Sales Report │ │
│ │ January 2025 │ │
│ │ │ │
│ │ Executive Summary │ │
│ │ ───────────────────────────────────────────────────────────────────────── │ │
│ │ Total Revenue: ₹15,600 │ │
│ │ Total Orders: 78 │ │
│ │ Average Order Value: ₹200 │ │
│ │ Growth vs Dec 2024: +12.5% │ │
│ │ │ │
│ │ Revenue Breakdown │ │
│ │ ───────────────────────────────────────────────────────────────────────── │ │
│ │ Lunch Orders: 51 (65%) - ₹10,200 │ │
│ │ Dinner Orders: 27 (35%) - ₹5,400 │ │
│ │ │ │
│ │ [Charts showing trends, distribution, etc.] │ │
│ │ │ │
│ │ ... (More sections) │ │
│ │ │ │
│ │ Page 1 of 8 │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│ │
│ [◀️ Previous Page] [Next Page ▶️] [Download PDF] [Download Excel] [Close] │
└───────────────────────────────────────────────────────────────────────────────────┘

**Scheduled Reports Section:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ⏰ Scheduled Reports [➕ Add Schedule]│
├──────────────────────────────────────────────────────────────────────────────────┤
│ │
│ ┌────────────────┬──────────────┬──────────┬──────────┬──────────┬──────────┐ │
│ │ Report Type │ Schedule │ Format │ Send To │ Status │ Actions │ │
│ ├────────────────┼──────────────┼──────────┼──────────┼──────────┼──────────┤ │
│ │ Daily Sales │ Every day │ Email │ admin@.. │ 🟢 Active│ ✏️ ⏸️ 🗑️│ │
│ │ │ 9:00 AM │ PDF │ │ │ │ │
│ ├────────────────┼──────────────┼──────────┼──────────┼──────────┼──────────┤ │
│ │ Weekly Summary │ Every Monday │ Email │ team@... │ 🟢 Active│ ✏️ ⏸️ 🗑️│ │
│ │ │ 10:00 AM │ Excel │ │ │ │ │
│ ├────────────────┼──────────────┼──────────┼──────────┼──────────┼──────────┤ │
│ │ Monthly Report │ 1st of month │ Email │ owner@.. │ 🟢 Active│ ✏️ ⏸️ 🗑️│ │
│ │ │ 8:00 AM │ PDF │ │ │ │ │
│ ├────────────────┼──────────────┼──────────┼──────────┼──────────┼──────────┤ │
│ │ Payment Report │ Every Friday │ Download │ - │ 🟡 Paused│ ✏️ ▶️ 🗑️│ │
│ │ │ 5:00 PM │ Excel │ │ │ │ │
│ └────────────────┴──────────────┴──────────┴──────────┴──────────┴──────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘

**Add Scheduled Report Modal:**
┌─────────────────────────────────────────────┐
│ ⏰ Add Scheduled Report ✕│
├─────────────────────────────────────────────┤
│ │
│ Report Type: │
│ [Sales Report ▼] │
│ • Sales Report │
│ • Payment Report │
│ • Monthly Statement │
│ • Customer Report │
│ • Custom Report │
│ │
│ Schedule Frequency: │
│ ⚪ Daily │
│ ⚪ Weekly (Every [Monday ▼]) │
│ ⚪ Monthly (On [1st ▼] of month) │
│ ⚪ Custom (Cron expression) │
│ │
│ Time: │
│ [09:00 AM ▼] │
│ │
│ Report Period: │
│ ⚪ Yesterday │
│ ⚪ Last Week │
│ ⚪ Last Month │
│ ⚪ Custom │
│ │
│ Delivery Method: │
│ ☑️ Email │
│ ☐ Download to Dashboard │
│ ☐ Upload to Google Drive │
│ │
│ Email Recipients: │
│ [admin@homiebites.com____________] │
│ [+ Add recipient] │
│ │
│ Format: │
│ ⚪ PDF ⚪ Excel ⚪ Both │
│ │
│ Include: │
│ ☑️ Summary │
│ ☑️ Charts │
│ ☐ Detailed transactions │
│ │
│ [Cancel] [💾 Save Schedule] │
└─────────────────────────────────────────────┘

**Report History:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 📚 Report History (Last 30 Days) [Clear Old] │
├──────────────────────────────────────────────────────────────────────────────────┤
│ │
│ ┌────────────┬──────────────────┬──────────────┬────────┬──────────┬─────────┐ │
│ │ Generated │ Report Type │ Period │ Format │ Size │ Actions │ │
│ ├────────────┼──────────────────┼──────────────┼────────┼──────────┼─────────┤ │
│ │ 15-Jan-25 │ Sales Report │ January 2025 │ PDF │ 2.4 MB │ 📥 👁️ 🗑️│ │
│ │ 09:00 AM │ │ │ │ │ │ │
│ ├────────────┼──────────────────┼──────────────┼────────┼──────────┼─────────┤ │
│ │ 14-Jan-25 │ Daily Sales │ 13-Jan-2025 │ PDF │ 456 KB │ 📥 👁️ 🗑️│ │
│ │ 09:00 AM │ │ │ │ │ │ │
│ ├────────────┼──────────────────┼──────────────┼────────┼──────────┼─────────┤ │
│ │ 13-Jan-25 │ Daily Sales │ 12-Jan-2025 │ PDF │ 423 KB │ 📥 👁️ 🗑️│ │
│ │ 09:00 AM │ │ │ │ │ │ │
│ ├────────────┼──────────────────┼──────────────┼────────┼──────────┼─────────┤ │
│ │ 08-Jan-25 │ Weekly Summary │ 1-7 Jan 2025 │ Excel │ 1.2 MB │ 📥 👁️ 🗑️│ │
│ │ 10:00 AM │ │ │ │ │ │ │
│ ├────────────┼──────────────────┼──────────────┼────────┼──────────┼─────────┤ │
│ │ 01-Jan-25 │ Monthly Report │ December 2024│ PDF │ 3.8 MB │ 📥 👁️ 🗑️│ │
│ │ 08:00 AM │ │ │ │ │ │ │
│ └────────────┴──────────────────┴──────────────┴────────┴──────────┴─────────┘ │
│ │
│ [Load More] [1-5 of 42 reports] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Custom Report Builder:**
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 🛠️ Custom Report Builder ✕│
├───────────────────────────────────────────────────────────────────────────────────┤
│ │
│ Report Name: │
│ [My Custom Report___________________________] │
│ │
│ Data Source: │
│ ☑️ Orders ☑️ Customers ☑️ Payments ☐ Inventory ☐ Delivery │
│ │
│ Metrics to Include: │
│ ┌─────────────────┬─────────────────┬─────────────────┐ │
│ │ ☑️ Total Revenue│ ☑️ Order Count │ ☑️ Avg Order Val│ │
│ │ ☑️ Lunch Orders │ ☑️ Dinner Orders│ ☐ Cancellations │ │
│ │ ☑️ Online Pay │ ☑️ Cash Pay │ ☑️ UPI Pay │ │
│ │ ☑️ New Customers│ ☐ Churn Rate │ ☐ Retention │ │
│ └─────────────────┴─────────────────┴─────────────────┘ │
│ │
│ Filters: │
│ Date Range: [From: //] [To: //] │
│ Status: [All ▼] Mode: [All ▼] Payment: [All ▼] │
│ │
│ Group By: │
│ ⚪ Day ⚪ Week ⚪ Month ⚪ Area ⚪ Customer │
│ │
│ Charts/Visualizations: │
│ ☑️ Revenue Trend Line Chart │
│ ☑️ Order Distribution Pie Chart │
│ ☑️ Payment Mode Bar Chart │
│ ☐ Customer Segmentation Donut │
│ │
│ [Save as Template] [Preview] [Generate Report] │
└───────────────────────────────────────────────────────────────────────────────────┘

### **API Endpoints:**

```javascript
// Get report templates
GET /api/reports/templates

// Generate report
POST /api/reports/generate
Body: {
  type: "Sales Report",
  period: { from: "2025-01-01", to: "2025-01-31" },
  includes: ["summary", "charts", "breakdown"],
  format: "pdf",
  groupBy: "daily"
}

// Get report preview
GET /api/reports/:reportId/preview

// Download report
GET /api/reports/:reportId/download?format=pdf

// Get scheduled reports
GET /api/reports/scheduled

// Add scheduled report
POST /api/reports/schedule
Body: {
  reportType: "Daily Sales",
  frequency: "daily",
  time: "09:00",
  period: "yesterday",
  deliveryMethod: "email",
  recipients: ["admin@email.com"],
  format: "pdf"
}

// Update scheduled report
PUT /api/reports/schedule/:id

// Pause/Resume scheduled report
PUT /api/reports/schedule/:id/status
Body: { status: "paused" }

// Delete scheduled report
DELETE /api/reports/schedule/:id

// Get report history
GET /api/reports/history?limit=30

// Delete old reports
DELETE /api/reports/history/clear?olderThan=30days

// Custom report builder - save template
POST /api/reports/custom/save-template
Body: { name, dataSource, metrics, filters, charts }

// Generate custom report
POST /api/reports/custom/generate
Body: { templateId, period, format }
```

---

## **TAB 7: PAYMENT MANAGEMENT**

### **Layout:**

**Header:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 💰 Payment Management │
│ Track payments, send reminders, and manage collections │
└──────────────────────────────────────────────────────────────────────────────────┘

**Summary Cards:**
┌─────────────────────┬─────────────────────┬─────────────────────┬─────────────────────┐
│ 💵 Total Collected │ ⏳ Pending Payments │ ⚠️ Overdue │ 📅 This Month │
│ ₹143,200 │ ₹2,400 │ ₹800 │ ₹15,600 │
│ 222 orders │ 12 orders │ 4 orders (>5 days) │ 78 orders │
│ 94.9% collected │ 5.1% pending │ Avg 8 days overdue │ 100% collection │
└─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘

**Filter Tabs:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [All Payments (234)] [✅ Paid (222)] [⏳ Pending (12)] [⚠️ Overdue (4)] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Action Bar:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [🔍 Search orders, addresses...] [Send Reminders] [Mark as Paid] [Export] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Pending/Overdue Payments Table (Priority View):**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Action Required - Overdue Payments (4) │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬─────────┬────────┬──────────┬──────────────┬──────────┬─────────┐ │
│ │ Date │ Address │ Amount │Days Pndng│ Order ID │ Payment │ Actions │ │
│ ├──────────┼─────────┼────────┼──────────┼──────────────┼──────────┼─────────┤ │
│ │ 05-Jan-25│ A3-1206 │ ₹200 │ 🔴 10 days│HB-Jan'25-... │ Cash │💬 💰 📞│ │
│ │ 08-Jan-25│ B2-405 │ ₹300 │ 🔴 7 days │HB-Jan'25-... │ Cash │💬 💰 📞│ │
│ │ 10-Jan-25│ C1-789 │ ₹200 │ 🟡 5 days │HB-Jan'25-... │ Cash │💬 💰 📞│ │
│ │ 12-Jan-25│ D4-567 │ ₹100 │ 🟡 3 days │HB-Jan'25-... │ Cash │💬 💰 📞│ │
│ └──────────┴─────────┴────────┴──────────┴──────────────┴──────────┴─────────┘ │
│ │
│ Total Overdue: ₹800 | [💬 Send Bulk Reminder] [Mark All as Paid] │
└──────────────────────────────────────────────────────────────────────────────────┘

**Recent Pending Payments:**
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ⏳ Recent Pending Payments (8) │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────┬─────────┬────────┬──────────┬──────────────┬──────────┬─────────┐ │
│ │ Date │ Address │ Amount │Days Pndng│ Order ID │ Payment │ Actions │ │
│ ├──────────┼─────────┼────────┼──────────┼──────────────┼──────────┼─────────┤ │
│ │ 13-Jan-25│ E5-890 │ ₹200 │ 2 days │HB-Jan'25-... │ Online │💬 💰 📞│ │
│ │ 13-Jan-25│ F6-234 │ ₹300 │ 2 days │HB-Jan'25-... │ Cash │💬 💰 📞│ │
│ │
│ │ 15-Jan-25│ H8-789 │ ₹400 │ Today │HB-Jan'25-... │ Cash │💬 💰 📞│ │
│ │ ... │ ... │ ... │ ... │... │ ... │ ... │ │
│ └──────────┴─────────┴────────┴──────────┴──────────────┴──────────┴─────────┘ │
│ │
│ Total Pending (Not Overdue): ₹1,600 | Average Days: 1.5 │
└──────────────────────────────────────────────────────────────────────────────────┘
