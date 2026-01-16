# Email Setup Guide - Step by Step

## ⚡ Quick Setup (Copy & Paste)

**If you already have your Gmail App Password, add this to your `.env` file:**

```env
# Email Configuration for OTP (Password Recovery)
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=706359@gmail.com
SMTP_PASSWORD=lljcepvqxxrsbqky
SMTP_FROM=706359@gmail.com
```

**Important:**

- ✅ App Password: Remove spaces → `lljc epvq xxrs bqky` becomes `lljcepvqxxrsbqky`
- ✅ Replace email if different from `706359@gmail.com`
- ✅ Restart your server: `npm run dev` (or stop/start)
- ✅ Test: Go to `/admin/forgot-password` and request OTP

**After adding, your password recovery will send OTP via email for FREE!** 🎉

---

## 🚨 Can't Find "App Passwords" in Google Account?

This is common! Here's how to fix it:

## ✅ Solution 1: Enable 2-Step Verification First (REQUIRED)

**App Passwords only appear AFTER 2-Step Verification is enabled.**

### Step-by-Step:

1. **Go to Google Account Security:**

   - Visit: https://myaccount.google.com/security
   - Or: Google Account → Security (left sidebar)

2. **Enable 2-Step Verification:**

   - Scroll to "How you sign in to Google"
   - Find "2-Step Verification"
   - Click "Get Started"
   - Follow the prompts:
     - Verify your phone number
     - Enter verification code sent to phone
     - Click "Turn On"

3. **Now App Passwords Will Appear:**

   - Go back to Security page
   - You should now see "App passwords" option
   - Click it
   - Select "Mail" → "Other (Custom name)"
   - Type "HomieBites" → Click "Generate"
   - Copy the 16-character password (no spaces!)

4. **Use in `.env`:**
   ```env
   SMTP_PASSWORD=abcd efgh ijkl mnop  # Remove spaces: abcdefghijklmnop
   ```

---

## ✅ Solution 2: Use Outlook Instead (Easier!)

**Outlook doesn't require App Passwords - use your regular password!**

### Setup:

1. **Add to `.env`:**

   ```env
   EMAIL_PROVIDER=nodemailer
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@outlook.com
   SMTP_PASSWORD=your-regular-outlook-password
   SMTP_FROM=your-email@outlook.com
   ```

2. **That's it!** No App Password needed! ✅

---

## ✅ Solution 3: Use Yahoo Mail

1. **Generate App Password from Yahoo:**

   - Go to: https://login.yahoo.com/account/security
   - Click "Generate app password"
   - Select "Mail" → "Other"
   - Copy the password

2. **Add to `.env`:**
   ```env
   EMAIL_PROVIDER=nodemailer
   SMTP_HOST=smtp.mail.yahoo.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@yahoo.com
   SMTP_PASSWORD=your-yahoo-app-password
   SMTP_FROM=your-email@yahoo.com
   ```

---

## ✅ Solution 4: Use SendGrid (100% FREE, No Setup Hassle)

**Best option if you want to avoid email provider setup!**

1. **Sign up:** https://sendgrid.com (FREE account)

2. **Get API Key:**

   - Dashboard → Settings → API Keys
   - Create API Key → Copy it

3. **Verify Sender Email:**

   - Settings → Sender Authentication
   - Verify your email (check inbox for verification link)

4. **Add to `.env`:**

   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.your_api_key_here
   SENDGRID_FROM_EMAIL=your-verified-email@example.com
   ```

5. **Install:**

   ```bash
   npm install @sendgrid/mail
   ```

6. **Done!** 100 free emails/day! ✅

---

## 🔍 Troubleshooting

### "App passwords" still not showing?

**Check these:**

- ✅ Is 2-Step Verification fully enabled? (Not just started)
- ✅ Try a different browser
- ✅ Clear browser cache
- ✅ Are you using Google Workspace? (Admin may need to enable it)
- ✅ Try incognito/private browsing mode

### Gmail says "Less secure app access"?

**This is normal!** App Passwords are the secure way to do this. The "less secure" warning is outdated - App Passwords are actually MORE secure.

### Still having issues?

**Use Outlook or SendGrid instead** - they're easier to set up!

---

## 📋 Quick Reference

| Provider | App Password Needed?  | Difficulty |
| -------- | --------------------- | ---------- |
| Gmail    | ✅ Yes (after 2-Step) | Medium     |
| Outlook  | ❌ No                 | Easy ✅    |
| Yahoo    | ✅ Yes                | Medium     |
| SendGrid | ❌ No                 | Easy ✅    |

---

## 🎯 Recommended: Start with Outlook

**Easiest setup - no App Passwords needed!**

Just use your regular Outlook password and you're done in 2 minutes! 🚀
css/_ ============================================
COMPLETE MOBILE ADMIN DASHBOARD CSS (<580px)
100% Production-Ready
============================================ _/

@media (max-width: 580px) {

/_ ============================================
BASE RESET & ROOT
============================================ _/

- {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  }

:root {
--primary: #4f46e5;
--primary-dark: #4338ca;
--secondary: #64748b;
--success: #10b981;
--danger: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
--dark: #1e293b;
--light: #f8fafc;
--border: #e2e8f0;
--text: #334155;
--text-muted: #64748b;
--shadow: 0 1px 3px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--radius: 8px;
--transition: all 0.3s ease;
}

html {
font-size: 16px;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
}

body {
margin: 0;
padding: 0;
overflow-x: hidden;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
font-size: 16px;
line-height: 1.5;
color: var(--text);
background: var(--light);
}

/_ ============================================
LAYOUT STRUCTURE
============================================ _/
.dashboard-container,
.admin-wrapper,
.app-container {
display: flex;
flex-direction: column;
width: 100%;
min-height: 100vh;
position: relative;
}

/_ ============================================
SIDEBAR
============================================ _/
.sidebar,
.side-nav,
.drawer,
.main-sidebar {
position: fixed;
top: 0;
left: -100%;
width: 280px;
max-width: 85vw;
height: 100vh;
background: var(--dark);
transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
z-index: 1000;
overflow-y: auto;
overflow-x: hidden;
-webkit-overflow-scrolling: touch;
box-shadow: var(--shadow-lg);
}

.sidebar.open,
.sidebar.active,
.sidebar.show {
left: 0;
}

.sidebar-header {
padding: 20px 16px;
border-bottom: 1px solid rgba(255,255,255,0.1);
display: flex;
align-items: center;
justify-content: space-between;
position: sticky;
top: 0;
background: var(--dark);
z-index: 10;
}

.sidebar-logo {
display: flex;
align-items: center;
gap: 12px;
color: #fff;
font-size: 18px;
font-weight: 600;
}

.sidebar-logo img {
width: 32px;
height: 32px;
border-radius: 6px;
}

.sidebar-close {
width: 40px;
height: 40px;
border: none;
background: rgba(255,255,255,0.1);
color: #fff;
border-radius: 6px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
font-size: 20px;
}

.sidebar-nav,
.nav-menu,
.sidebar-menu {
padding: 16px 0;
list-style: none;
margin: 0;
}

.sidebar-nav li,
.nav-item {
margin: 0;
}

.sidebar-nav a,
.nav-link,
.menu-link {
display: flex;
align-items: center;
gap: 12px;
padding: 12px 16px;
color: rgba(255,255,255,0.7);
text-decoration: none;
transition: var(--transition);
font-size: 15px;
min-height: 44px;
position: relative;
}

.sidebar-nav a:hover,
.sidebar-nav a.active {
background: rgba(255,255,255,0.1);
color: #fff;
}

.sidebar-nav a.active::before {
content: '';
position: absolute;
left: 0;
top: 0;
bottom: 0;
width: 3px;
background: var(--primary);
}

.nav-icon {
width: 20px;
height: 20px;
font-size: 20px;
flex-shrink: 0;
}

.nav-badge {
margin-left: auto;
background: var(--danger);
color: #fff;
padding: 2px 8px;
border-radius: 12px;
font-size: 11px;
font-weight: 600;
min-width: 20px;
text-align: center;
}

.nav-section-title {
padding: 16px 16px 8px;
color: rgba(255,255,255,0.5);
font-size: 11px;
text-transform: uppercase;
letter-spacing: 0.5px;
font-weight: 600;
}

.nav-divider {
height: 1px;
background: rgba(255,255,255,0.1);
margin: 16px 0;
}

/_ Sidebar User Profile _/
.sidebar-user {
padding: 16px;
border-top: 1px solid rgba(255,255,255,0.1);
display: flex;
align-items: center;
gap: 12px;
color: #fff;
margin-top: auto;
position: sticky;
bottom: 0;
background: var(--dark);
}

.sidebar-user-avatar {
width: 40px;
height: 40px;
border-radius: 50%;
object-fit: cover;
}

.sidebar-user-info {
flex: 1;
min-width: 0;
}

.sidebar-user-name {
font-size: 14px;
font-weight: 600;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.sidebar-user-role {
font-size: 12px;
color: rgba(255,255,255,0.6);
}

/_ Sidebar Overlay _/
.sidebar-overlay,
.drawer-overlay,
.backdrop {
display: none;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.5);
z-index: 999;
animation: fadeIn 0.3s;
}

.sidebar-overlay.show,
.sidebar-overlay.active {
display: block;
}

@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}

/_ ============================================
TOP HEADER / NAVBAR
============================================ _/
.top-header,
.main-header,
.navbar,
.app-header {
position: sticky;
top: 0;
width: 100%;
height: 56px;
background: #fff;
border-bottom: 1px solid var(--border);
display: flex;
align-items: center;
padding: 0 16px;
z-index: 100;
gap: 12px;
}

.hamburger-btn,
.menu-toggle,
.sidebar-toggle {
width: 44px;
height: 44px;
border: none;
background: transparent;
cursor: pointer;
padding: 10px;
display: flex;
flex-direction: column;
justify-content: center;
gap: 5px;
flex-shrink: 0;
}

.hamburger-btn span {
display: block;
width: 24px;
height: 2px;
background: var(--text);
transition: var(--transition);
border-radius: 2px;
}

.hamburger-btn.active span:nth-child(1) {
transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-btn.active span:nth-child(2) {
opacity: 0;
}

.hamburger-btn.active span:nth-child(3) {
transform: rotate(-45deg) translate(6px, -6px);
}

.header-logo {
display: flex;
align-items: center;
gap: 8px;
font-weight: 600;
color: var(--text);
font-size: 16px;
}

.header-logo img {
width: 28px;
height: 28px;
}

.header-search {
flex: 1;
max-width: 400px;
margin: 0 12px;
}

.header-search input {
width: 100%;
height: 36px;
padding: 8px 12px 8px 36px;
border: 1px solid var(--border);
border-radius: 18px;
font-size: 14px;
background: var(--light);
transition: var(--transition);
}

.header-search input:focus {
outline: none;
border-color: var(--primary);
background: #fff;
}

.header-actions {
display: flex;
align-items: center;
gap: 8px;
margin-left: auto;
}

.header-icon-btn,
.icon-btn {
width: 40px;
height: 40px;
border: none;
background: transparent;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
position: relative;
color: var(--text);
transition: var(--transition);
}

.header-icon-btn:hover,
.header-icon-btn:active {
background: var(--light);
}

.header-icon-btn .badge {
position: absolute;
top: 8px;
right: 8px;
min-width: 16px;
height: 16px;
background: var(--danger);
color: #fff;
border-radius: 8px;
font-size: 10px;
display: flex;
align-items: center;
justify-content: center;
padding: 0 4px;
border: 2px solid #fff;
}

.header-avatar {
width: 36px;
height: 36px;
border-radius: 50%;
object-fit: cover;
cursor: pointer;
border: 2px solid var(--border);
}

/_ ============================================
BREADCRUMBS
============================================ _/
.breadcrumb,
.breadcrumbs {
display: flex;
align-items: center;
gap: 8px;
padding: 12px 16px;
background: #fff;
border-bottom: 1px solid var(--border);
overflow-x: auto;
-webkit-overflow-scrolling: touch;
white-space: nowrap;
}

.breadcrumb::-webkit-scrollbar {
height: 0;
}

.breadcrumb-item {
display: flex;
align-items: center;
gap: 8px;
font-size: 13px;
color: var(--text-muted);
}

.breadcrumb-item a {
color: var(--text-muted);
text-decoration: none;
transition: var(--transition);
}

.breadcrumb-item a:hover {
color: var(--primary);
}

.breadcrumb-item.active {
color: var(--text);
font-weight: 500;
}

.breadcrumb-separator {
color: var(--text-muted);
font-size: 12px;
}

/_ ============================================
MAIN CONTENT
============================================ _/
.main-content,
.content-wrapper,
.page-content {
flex: 1;
padding: 16px;
width: 100%;
margin-left: 0 ;
margin-right: 0 ;
max-width: 100%;
}

.content-header {
margin-bottom: 20px;
}

.page-title,
.content-title {
font-size: 24px;
font-weight: 700;
color: var(--text);
margin: 0 0 8px 0;
line-height: 1.2;
}

.page-subtitle,
.page-description {
font-size: 14px;
color: var(--text-muted);
margin: 0;
line-height: 1.5;
}

.content-header-actions {
display: flex;
gap: 8px;
margin-top: 16px;
flex-wrap: wrap;
}

/_ ============================================
CARDS
============================================ _/
.card,
.widget,
.panel,
.box {
width: 100%;
margin: 0 0 16px 0;
padding: 16px;
border-radius: var(--radius);
background: #fff;
box-shadow: var(--shadow);
border: 1px solid var(--border);
}

.card-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 16px;
padding-bottom: 12px;
border-bottom: 1px solid var(--border);
}

.card-title {
font-size: 16px;
font-weight: 600;
color: var(--text);
margin: 0;
}

.card-subtitle {
font-size: 13px;
color: var(--text-muted);
margin: 4px 0 0 0;
}

.card-actions {
display: flex;
gap: 8px;
}

.card-body,
.card-content {
padding: 0;
}

.card-footer {
margin-top: 16px;
padding-top: 16px;
border-top: 1px solid var(--border);
display: flex;
align-items: center;
justify-content: space-between;
gap: 12px;
}

.card-grid,
.stats-grid,
.grid {
display: flex;
flex-direction: column;
gap: 16px;
width: 100%;
}

/_ Stats Cards _/
.stat-card,
.stats-card,
.metric-card {
background: #fff;
padding: 16px;
border-radius: var(--radius);
box-shadow: var(--shadow);
border: 1px solid var(--border);
display: flex;
flex-direction: column;
gap: 8px;
}

.stat-card-header {
display: flex;
align-items: center;
justify-content: space-between;
}

.stat-label {
font-size: 13px;
color: var(--text-muted);
font-weight: 500;
text-transform: uppercase;
letter-spacing: 0.5px;
}

.stat-icon {
width: 36px;
height: 36px;
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
font-size: 18px;
}

.stat-icon.primary { background: rgba(79, 70, 229, 0.1); color: var(--primary); }
.stat-icon.success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.stat-icon.danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
.stat-icon.warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
.stat-icon.info { background: rgba(59, 130, 246, 0.1); color: var(--info); }

.stat-value {
font-size: 32px;
font-weight: 700;
line-height: 1;
color: var(--text);
margin: 8px 0;
}

.stat-change {
display: flex;
align-items: center;
gap: 4px;
font-size: 13px;
font-weight: 500;
}

.stat-change.positive {
color: var(--success);
}

.stat-change.negative {
color: var(--danger);
}

.stat-change-icon {
font-size: 14px;
}

/_ ============================================
TABLES
============================================ _/
.table-container,
.table-wrapper {
width: 100%;
overflow-x: auto;
-webkit-overflow-scrolling: touch;
margin: 16px 0;
border-radius: var(--radius);
border: 1px solid var(--border);
}

table,
.table {
min-width: 600px;
width: 100%;
border-collapse: collapse;
font-size: 14px;
background: #fff;
}

table thead {
background: var(--light);
border-bottom: 2px solid var(--border);
}

table th {
padding: 12px 16px;
text-align: left;
font-weight: 600;
color: var(--text);
font-size: 13px;
text-transform: uppercase;
letter-spacing: 0.5px;
white-space: nowrap;
}

table td {
padding: 12px 16px;
border-bottom: 1px solid var(--border);
color: var(--text);
}

table tbody tr:hover {
background: var(--light);
}

table tbody tr:last-child td {
border-bottom: none;
}

/_ Mobile Table - Card View _/
.mobile-table,
.responsive-table {
display: flex;
flex-direction: column;
gap: 12px;
}

.mobile-table-card,
.table-card {
background: #fff;
border: 1px solid var(--border);
border-radius: var(--radius);
padding: 16px;
box-shadow: var(--shadow);
}

.mobile-table-card .row {
display: flex;
justify-content: space-between;
align-items: center;
padding: 8px 0;
gap: 12px;
}

.mobile-table-card .row:not(:last-child) {
border-bottom: 1px solid var(--border);
}

.mobile-table-card .label {
font-weight: 600;
color: var(--text-muted);
font-size: 13px;
text-transform: uppercase;
letter-spacing: 0.5px;
}

.mobile-table-card .value {
color: var(--text);
font-size: 14px;
text-align: right;
}

.mobile-table-card .actions {
display: flex;
gap: 8px;
justify-content: flex-end;
padding-top: 12px;
margin-top: 8px;
border-top: 1px solid var(--border);
}

/_ Table Actions _/
.table-actions {
display: flex;
gap: 8px;
align-items: center;
justify-content: flex-end;
}

.table-action-btn {
width: 32px;
height: 32px;
border: none;
background: transparent;
color: var(--text-muted);
border-radius: 4px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
transition: var(--transition);
}

.table-action-btn:hover {
background: var(--light);
color: var(--primary);
}

/_ ============================================
FORMS
============================================ _/
.form,
form {
width: 100%;
}

.form-group,
.form-field {
width: 100%;
margin-bottom: 20px;
}

.form-label,
label {
display: block;
margin-bottom: 6px;
font-weight: 500;
font-size: 14px;
color: var(--text);
}

.form-label.required::after {
content: ' \*';
color: var(--danger);
}

.form-hint,
.form-help {
display: block;
margin-top: 4px;
font-size: 12px;
color: var(--text-muted);
line-height: 1.4;
}

.form-row {
display: flex;
flex-direction: column;
gap: 20px;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="tel"],
input[type="url"],
input[type="search"],
input[type="date"],
input[type="time"],
input[type="datetime-local"],
select,
textarea,
.form-control,
.input {
width: 100%;
padding: 12px 16px;
font-size: 16px; /_ Prevents iOS zoom _/
border: 1px solid var(--border);
border-radius: 6px;
background: #fff;
color: var(--text);
transition: var(--transition);
font-family: inherit;
line-height: 1.5;
}

input:focus,
select:focus,
textarea:focus {
outline: none;
border-color: var(--primary);
box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

input:disabled,
select:disabled,
textarea:disabled {
background: var(--light);
cursor: not-allowed;
opacity: 0.6;
}

input::placeholder,
textarea::placeholder {
color: var(--text-muted);
opacity: 1;
}

textarea {
min-height: 100px;
resize: vertical;
}

select {
cursor: pointer;
appearance: none;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
background-repeat: no-repeat;
background-position: right 12px center;
padding-right: 40px;
}

/_ Form Validation States _/
.form-group.error input,
.form-group.error select,
.form-group.error textarea,
input.error,
.is-invalid {
border-color: var(--danger);
}

.form-group.error input:focus,
input.error:focus {
box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-group.success input,
input.success,
.is-valid {
border-color: var(--success);
}

.form-error,
.error-message,
.invalid-feedback {
display: block;
margin-top: 4px;
font-size: 12px;
color: var(--danger);
line-height: 1.4;
}

.form-success,
.success-message,
.valid-feedback {
display: block;
margin-top: 4px;
font-size: 12px;
color: var(--success);
line-height: 1.4;
}

/_ Checkboxes & Radio Buttons _/
.checkbox,
.radio,
.form-check {
display: flex;
align-items: flex-start;
gap: 12px;
margin-bottom: 12px;
cursor: pointer;
}

input[type="checkbox"],
input[type="radio"] {
width: 20px;
height: 20px;
margin: 0;
cursor: pointer;
flex-shrink: 0;
margin-top: 2px;
}

.checkbox label,
.radio label,
.form-check-label {
cursor: pointer;
font-weight: 400;
margin: 0;
line-height: 1.5;
user-select: none;
}

/_ Toggle Switch _/
.toggle,
.switch {
display: flex;
align-items: center;
gap: 12px;
cursor: pointer;
}

.toggle-input {
position: relative;
width: 48px;
height: 28px;
appearance: none;
background: #cbd5e1;
border-radius: 14px;
cursor: pointer;
transition: var(--transition);
flex-shrink: 0;
}

.toggle-input::before {
content: '';
position: absolute;
width: 22px;
height: 22px;
border-radius: 50%;
top: 3px;
left: 3px;
background: #fff;
transition: var(--transition);
box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-input:checked {
background: var(--primary);
}

.toggle-input:checked::before {
left: 23px;
}

/_ File Upload _/
.file-upload {
width: 100%;
position: relative;
}

.file-upload input[type="file"] {
position: absolute;
width: 100%;
height: 100%;
opacity: 0;
cursor: pointer;
z-index: 2;
}

.file-upload-label {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 12px;
padding: 32px 16px;
border: 2px dashed var(--border);
border-radius: var(--radius);
background: var(--light);
cursor: pointer;
transition: var(--transition);
text-align: center;
}

.file-upload-label:hover {
border-color: var(--primary);
background: rgba(79, 70, 229, 0.05);
}

.file-upload-icon {
font-size: 32px;
color: var(--text-muted);
}

.file-upload-text {
font-size: 14px;
color: var(--text);
}

.file-upload-hint {
font-size: 12px;
color: var(--text-muted);
}

.file-list {
margin-top: 12px;
display: flex;
flex-direction: column;
gap: 8px;
}

.file-item {
display: flex;
align-items: center;
gap: 12px;
padding: 8px 12px;
background: var(--light);
border-radius: 6px;
border: 1px solid var(--border);
}

.file-item-icon {
font-size: 20px;
color: var(--primary);
}

.file-item-info {
flex: 1;
min-width: 0;
}

.file-item-name {
font-size: 14px;
color: var(--text);
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.file-item-size {
font-size: 12px;
color: var(--text-muted);
}

.file-item-remove {
width: 28px;
height: 28px;
border: none;
background: transparent;
color: var(--text-muted);
border-radius: 4px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
}
.file-item-remove:hover {
background: #fff;
color: var(--danger);
}
/_ Input Groups _/
.input-group {
display: flex;
width: 100%;
}
.input-group input {
border-radius: 0;
}
.input-group input:first-child {
border-top-left-radius: 6px;
border-bottom-left-radius: 6px;
}
.input-group input:last-child {
border-top-right-radius: 6px;
border-bottom-right-radius: 6px;
}
.input-group-prepend,
.input-group-append {
display: flex;
align-items: center;
padding: 0 12px;
background: var(--light);
border: 1px solid var(--border);
color: var(--text-muted);
font-size: 14px;
white-space: nowrap;
}
.input-group-prepend {
border-right: none;
border-top-left-radius: 6px;
border-bottom-left-radius: 6px;
}
.input-group-append {
border-left: none;
border-top-right-radius: 6px;
border-bottom-right-radius: 6px;
}
/_ Search Input _/
.search-input,
.search-field {
position: relative;
width: 100%;
}
.search-input input {
padding-left: 40px;
}
.search-input-icon {
position: absolute;
left: 12px;
top: 50%;
transform: translateY(-50%);
color: var(--text-muted);
font-size: 18px;
pointer-events: none;
}
.search-input-clear {
position: absolute;
right: 8px;
top: 50%;
transform: translateY(-50%);
width: 28px;
height: 28px;
border: none;
background: transparent;
color: var(--text-muted);
border-radius: 50%;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
}
/_ ============================================
BUTTONS
============================================ _/
button,
.btn,
.button {
width: 100%;
padding: 12px 20px;
font-size: 16px;
font-weight: 500;
border-radius: 6px;
border: none;
cursor: pointer;
transition: var(--transition);
display: inline-flex;
align-items: center;
justify-content: center;
gap: 8px;
min-height: 44px;
text-decoration: none;
font-family: inherit;
line-height: 1.5;
user-select: none;
white-space: nowrap;
}
button:disabled,
.btn:disabled,
.btn.disabled {
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;
}
/_ Button Variants _/
.btn-primary,
button.primary {
background: var(--primary);
color: #fff;
}
.btn-primary:hover,
.btn-primary:active {
background: var(--primary-dark);
}
.btn-secondary {
background: var(--secondary);
color: #fff;
}
.btn-secondary:hover,
.btn-secondary:active {
background: #475569;
}
.btn-success {
background: var(--success);
color: #fff;
}
.btn-success:hover,
.btn-success:active {
background: #059669;
}
.btn-danger {
background: var(--danger);
color: #fff;
}
.btn-danger:hover,
.btn-danger:active {
background: #dc2626;
}
.btn-warning {
background: var(--warning);
color: #fff;
}
.btn-warning:hover,
.btn-warning:active {
background: #d97706;
}
.btn-info {
background: var(--info);
color: #fff;
}
.btn-info:hover,
.btn-info:active {
background: #2563eb;
}
.btn-light {
background: var(--light);
color: var(--text);
border: 1px solid var(--border);
}
.btn-light:hover,
.btn-light:active {
background: #e2e8f0;
}
.btn-dark {
background: var(--dark);
color: #fff;
}
.btn-dark:hover,
.btn-dark:active {
background: #0f172a;
}
.btn-outline {
background: transparent;
border: 1px solid var(--border);
color: var(--text);
}
.btn-outline:hover,
.btn-outline:active {
background: var(--light);
}
.btn-outline-primary {
background: transparent;
border: 1px solid var(--primary);
color: var(--primary);
}
.btn-outline-primary:hover,
.btn-outline-primary:active {
background: var(--primary);
color: #fff;
}
.btn-ghost {
background: transparent;
color: var(--text);
}
.btn-ghost:hover,
.btn-ghost:active {
background: var(--light);
}
.btn-link {
background: transparent;
color: var(--primary);
text-decoration: underline;
}
.btn-link:hover,
.btn-link:active {
color: var(--primary-dark);
}
/_ Button Sizes _/
.btn-sm,
.btn-small {
padding: 8px 16px;
font-size: 14px;
min-height: 36px;
}
.btn-lg,
.btn-large {
padding: 16px 24px;
font-size: 18px;
min-height: 52px;
}
/_ Button Groups _/
.btn-group,
.button-group {
display: flex;
gap: 8px;
width: 100%;
}
.btn-group button,
.btn-group .btn {
flex: 1;
}
.action-buttons {
display: flex;
flex-direction: column;
gap: 12px;
width: 100%;
}
/_ Icon Buttons _/
.btn-icon,
.icon-button {
width: 44px;
min-width: 44px;
padding: 0;
}
.btn-icon-sm {
width: 36px;
min-width: 36px;
min-height: 36px;
}
/_ Loading Button _/
.btn-loading {
position: relative;
color: transparent ;
pointer-events: none;
}
.btn-loading::after {
content: '';
position: absolute;
width: 16px;
height: 16px;
top: 50%;
left: 50%;
margin-left: -8px;
margin-top: -8px;
border: 2px solid currentColor;
border-right-color: transparent;
border-radius: 50%;
animation: spin 0.6s linear infinite;
}
@keyframes spin {
to { transform: rotate(360deg); }
}
/_ ============================================
BADGES & TAGS
============================================ _/
.badge,
.tag,
.label {
display: inline-flex;
align-items: center;
gap: 4px;
padding: 4px 10px;
border-radius: 12px;
font-size: 12px;
font-weight: 500;
line-height: 1;
white-space: nowrap;
}
.badge-primary { background: rgba(79, 70, 229, 0.1); color: var(--primary); }
.badge-secondary { background: rgba(100, 116, 139, 0.1); color: var(--secondary); }
.badge-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.badge-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
.badge-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
.badge-info { background: rgba(59, 130, 246, 0.1); color: var(--info); }
.badge-light { background: var(--light); color: var(--text); }
.badge-dark { background: var(--dark); color: #fff; }
.badge-outline {
background: transparent;
border: 1px solid currentColor;
}
.badge-dot {
padding-left: 20px;
position: relative;
}
.badge-dot::before {
content: '';
position: absolute;
left: 8px;
top: 50%;
transform: translateY(-50%);
width: 6px;
height: 6px;
border-radius: 50%;
background: currentColor;
}
/_ ============================================
ALERTS & NOTIFICATIONS
============================================ _/
.alert,
.notification,
.message {
width: 100%;
padding: 12px 16px;
border-radius: var(--radius);
margin-bottom: 16px;
display: flex;
align-items: flex-start;
gap: 12px;
border-left: 4px solid currentColor;
}
.alert-icon {
font-size: 20px;
flex-shrink: 0;
margin-top: 2px;
}
.alert-content {
flex: 1;
min-width: 0;
}
.alert-title {
font-weight: 600;
margin: 0 0 4px 0;
font-size: 14px;
}
.alert-message {
margin: 0;
font-size: 14px;
line-height: 1.5;
}
.alert-close {
width: 28px;
height: 28px;
border: none;
background: transparent;
color: currentColor;
border-radius: 4px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
opacity: 0.7;
}
.alert-close:hover {
opacity: 1;
background: rgba(0,0,0,0.05);
}
.alert-primary {
background: rgba(79, 70, 229, 0.1);
color: var(--primary);
border-left-color: var(--primary);
}
.alert-success {
background: rgba(16, 185, 129, 0.1);
color: var(--success);
border-left-color: var(--success);
}
.alert-danger,
.alert-error {
background: rgba(239, 68, 68, 0.1);
color: var(--danger);
border-left-color: var(--danger);
}
.alert-warning {
background: rgba(245, 158, 11, 0.1);
color: var(--warning);
border-left-color: var(--warning);
}
.alert-info {
background: rgba(59, 130, 246, 0.1);
color: var(--info);
border-left-color: var(--info);
}
/_ Toast Notifications _/
.toast-container {
position: fixed;
top: 72px;
right: 16px;
left: 16px;
z-index: 9999;
display: flex;
flex-direction: column;
gap: 12px;
pointer-events: none;
}
.toast {
background: #fff;
padding: 12px 16px;
border-radius: var(--radius);
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
display: flex;
align-items: flex-start;
gap: 12px;
pointer-events: auto;
animation: slideInRight 0.3s ease;
border-left: 4px solid currentColor;
}
@keyframes slideInRight {
from {
transform: translateX(100%);
opacity: 0;
}
to {
transform: translateX(0);
opacity: 1;
}
}
.toast.hiding {
animation: slideOutRight 0.3s ease;
}
@keyframes slideOutRight {
to {
transform: translateX(100%);
opacity: 0;
}
}
/_ ============================================
PROGRESS BARS
============================================ _/
.progress,
.progress-bar-container {
width: 100%;
height: 8px;
background: var(--light);
border-radius: 4px;
overflow: hidden;
position: relative;
}
.progress-bar,
.progress-fill {
height: 100%;
background: var(--primary);
border-radius: 4px;
transition: width 0.3s ease;
position: relative;
}
.progress-bar.success { background: var(--success); }
.progress-bar.danger { background: var(--danger); }
.progress-bar.warning { background: var(--warning); }
.progress-bar.info { background: var(--info); }
.progress-label {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 8px;
font-size: 13px;
color: var(--text);
}
.progress-percentage {
font-weight: 600;
color: var(--primary);
}
/_ Animated Progress _/
.progress-indeterminate .progress-bar {
width: 40%;
animation: indeterminate 1.5s infinite;
}
@keyframes indeterminate {
0% { left: -40%; }
100% { left: 100%; }
}
/_ Circular Progress _/
.circular-progress {
width: 60px;
height: 60px;
border-radius: 50%;
border: 4px solid var(--light);
border-top-color: var(--primary);
animation: spin 1s linear infinite;
}
/_ ============================================
MODALS & DIALOGS
============================================ _/
.modal,
.dialog {
display: none;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 10000;
overflow: hidden;
}
.modal.show,
.modal.active {
display: flex;
align-items: flex-end;
animation: fadeIn 0.3s;
}
.modal-backdrop {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.5);
z-index: 1;
}
.modal-container {
position: relative;
width: 100%;
max-height: 90vh;
background: #fff;
border-radius: 16px 16px 0 0;
z-index: 2;
display: flex;
flex-direction: column;
animation: slideUp 0.3s ease;
}
@keyframes slideUp {
from {
transform: translateY(100%);
}
to {
transform: translateY(0);
}
}
.modal-header {
padding: 20px 16px 16px;
border-bottom: 1px solid var(--border);
display: flex;
align-items: center;
justify-content: space-between;
flex-shrink: 0;
}
.modal-title {
font-size: 18px;
font-weight: 600;
color: var(--text);
margin: 0;
}
.modal-close {
width: 36px;
height: 36px;
border: none;
background: transparent;
color: var(--text-muted);
border-radius: 50%;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
font-size: 20px;
}
.modal-close:hover {
background: var(--light);
color: var(--text);
}
.modal-body,
.modal-content {
padding: 20px 16px;
overflow-y: auto;
-webkit-overflow-scrolling: touch;
flex: 1;
}
.modal-footer {
padding: 16px;
border-top: 1px solid var(--border);
display: flex;
gap: 12px;
flex-shrink: 0;
}
.modal-footer button {
flex: 1;
}
/_ Full Screen Modal _/
.modal-fullscreen .modal-container {
max-height: 100vh;
height: 100vh;
border-radius: 0;
}
/_ ============================================
DROPDOWNS
============================================ _/
.dropdown {
position: relative;
display: inline-block;
}
.dropdown-toggle {
cursor: pointer;
}
.dropdown-menu {
display: none;
position: absolute;
top: 100%;
left: 0;
right: 0;
margin-top: 4px;
background: #fff;
border: 1px solid var(--border);
border-radius: var(--radius);
box-shadow: var(--shadow-lg);
z-index: 1000;
max-height: 300px;
overflow-y: auto;
-webkit-overflow-scrolling: touch;
animation: slideDown 0.2s ease;
}
.dropdown-menu.show,
.dropdown-menu.active {
display: block;
}
@keyframes slideDown {
from {
opacity: 0;
transform: translateY(-10px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
.dropdown-item {
padding: 12px 16px;
display: flex;
align-items: center;
gap: 12px;
color: var(--text);
text-decoration: none;
transition: var(--transition);
cursor: pointer;
border: none;
background: none;
width: 100%;
text-align: left;
font-size: 14px;
min-height: 44px;
}
.dropdown-item:hover,
.dropdown-item:active {
background: var(--light);
}
.dropdown-item.active {
background: rgba(79, 70, 229, 0.1);
color: var(--primary);
}
.dropdown-item.disabled {
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;
}
.dropdown-divider {
height: 1px;
background: var(--border);
margin: 8px 0;
}
.dropdown-header {
padding: 8px 16px;
font-size: 12px;
color: var(--text-muted);
text-transform: uppercase;
letter-spacing: 0.5px;
font-weight: 600;
}
/_ ============================================
TABS & NAVIGATION
============================================ _/
.tabs,
.nav-tabs {
display: flex;
overflow-x: auto;
-webkit-overflow-scrolling: touch;
gap: 4px;
padding: 0;
margin: 0 0 20px 0;
border-bottom: 2px solid var(--border);
list-style: none;
}
.tabs::-webkit-scrollbar {
height: 0;
}
.tab,
.nav-tab,
.tabs button {
padding: 12px 20px;
border: none;
background: transparent;
color: var(--text-muted);
font-size: 14px;
font-weight: 500;
cursor: pointer;
white-space: nowrap;
position: relative;
transition: var(--transition);
border-bottom: 2px solid transparent;
margin-bottom: -2px;
min-height: 44px;
display: flex;
align-items: center;
gap: 8px;
}
.tab:hover,
.tab.active {
color: var(--primary);
border-bottom-color: var(--primary);
}
.tab-content {
display: none;
}
.tab-content.active {
display: block;
animation: fadeIn 0.3s;
}
/_ Pills Navigation _/
.nav-pills {
display: flex;
flex-wrap: wrap;
gap: 8px;
padding: 0;
margin: 0 0 20px 0;
list-style: none;
}
.nav-pills .nav-link {
padding: 8px 16px;
border-radius: 20px;
background: var(--light);
color: var(--text);
font-size: 14px;
white-space: nowrap;
transition: var(--transition);
min-height: 36px;
}
.nav-pills .nav-link.active {
background: var(--primary);
color: #fff;
}
/_ ============================================
ACCORDION / COLLAPSE
============================================ _/
.accordion {
border: 1px solid var(--border);
border-radius: var(--radius);
overflow: hidden;
}
.accordion-item {
border-bottom: 1px solid var(--border);
}
.accordion-item:last-child {
border-bottom: none;
}
.accordion-header {
width: 100%;
padding: 16px;
border: none;
background: #fff;
text-align: left;
cursor: pointer;
display: flex;
align-items: center;
justify-content: space-between;
gap: 12px;
font-size: 15px;
font-weight: 500;
color: var(--text);
transition: var(--transition);
min-height: 52px;
}
.accordion-header:hover {
background: var(--light);
}
.accordion-header.active {
background: var(--light);
color: var(--primary);
}
.accordion-icon {
font-size: 18px;
transition: transform 0.3s ease;
}
.accordion-header.active .accordion-icon {
transform: rotate(180deg);
}
.accordion-body {
display: none;
padding: 0 16px 16px 16px;
font-size: 14px;
line-height: 1.6;
color: var(--text);
}
.accordion-body.show {
display: block;
animation: slideDown 0.3s ease;
}
/_ ============================================
TOOLTIPS
============================================ _/
.tooltip-wrapper {
position: relative;
display: inline-block;
}
.tooltip {
position: absolute;
bottom: 100%;
left: 50%;
transform: translateX(-50%);
margin-bottom: 8px;
padding: 6px 12px;
background: var(--dark);
color: #fff;
font-size: 12px;
border-radius: 4px;
white-space: nowrap;
opacity: 0;
pointer-events: none;
transition: opacity 0.2s;
z-index: 9999;
}
.tooltip::after {
content: '';
position: absolute;
top: 100%;
left: 50%;
transform: translateX(-50%);
border: 4px solid transparent;
border-top-color: var(--dark);
}
.tooltip-wrapper:hover .tooltip {
opacity: 1;
}
/_ ============================================
PAGINATION
============================================ _/
.pagination {
display: flex;
justify-content: center;
align-items: center;
gap: 8px;
flex-wrap: wrap;
margin: 20px 0;
list-style: none;
padding: 0;
}
.pagination button,
.pagination a,
.page-link {
min-width: 44px;
height: 44px;
padding: 8px 12px;
border: 1px solid var(--border);
background: #fff;
color: var(--text);
border-radius: 6px;
cursor: pointer;
transition: var(--transition);
display: flex;
align-items: center;
justify-content: center;
text-decoration: none;
font-size: 14px;
}
.pagination button:hover,
.pagination button.active {
background: var(--primary);
color: #fff;
border-color: var(--primary);
}
.pagination button:disabled {
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;
}
/_ ============================================
CHARTS & GRAPHS
============================================ _/
.chart-container,
.graph-container {
width: 100%;
height: 250px;
margin: 16px 0;
position: relative;
}
canvas {
max-width: 100% ;
height: auto ;
}
.chart-legend {
display: flex;
flex-wrap: wrap;
gap: 16px;
margin-top: 16px;
justify-content: center;
}
.legend-item {
display: flex;
align-items: center;
gap: 8px;
font-size: 13px;
}
.legend-color {
width: 12px;
height: 12px;
border-radius: 2px;
}
/_ ============================================
LISTS
============================================ _/
.list,
.list-group {
list-style: none;
padding: 0;
margin: 0;
}
.list-item,
.list-group-item {
padding: 12px 16px;
border-bottom: 1px solid var(--border);
display: flex;
align-items: center;
gap: 12px;
background: #fff;
transition: var(--transition);
cursor: pointer;
min-height: 52px;
}
.list-item:last-child {
border-bottom: none;
}
.list-item:hover,
.list-item:active {
background: var(--light);
}
.list-item-icon {
width: 40px;
height: 40px;
border-radius: 50%;
background: var(--light);
display: flex;
align-items: center;
justify-content: center;
font-size: 18px;
color: var(--primary);
flex-shrink: 0;
}
.list-item-content {
flex: 1;
min-width: 0;
}
.list-item-title {
font-size: 14px;
font-weight: 500;
color: var(--text);
margin: 0 0 4px 0;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}
.list-item-subtitle {
font-size: 12px;
color: var(--text-muted);
margin: 0;
}
.list-item-action {
flex-shrink: 0;
}
/_ ============================================
EMPTY STATES
============================================ _/
.empty-state,
.no-data {
text-align: center;
padding: 48px 16px;
color: var(--text-muted);
}
.empty-state-icon {
font-size: 64px;
color: var(--text-muted);
opacity: 0.5;
margin-bottom: 16px;
}
.empty-state-title {
font-size: 18px;
font-weight: 600;
color: var(--text);This response paused because Claude reached its max length for a message. Hit continue to nudge Claude along.
margin: 0 0 8px 0;
}
.empty-state-message {
font-size: 14px;
color: var(--text-muted);
margin: 0 0 20px 0;
line-height: 1.5;
}
.empty-state-action {
margin-top: 20px;
}
/_ ============================================
LOADING STATES
============================================ _/
.loading-spinner,
.spinner {
width: 40px;
height: 40px;
border: 4px solid var(--light);
border-top-color: var(--primary);
border-radius: 50%;
animation: spin 0.8s linear infinite;
margin: 20px auto;
}
.loading-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(255,255,255,0.9);
display: flex;
align-items: center;
justify-content: center;
z-index: 9999;
}
.skeleton {
background: linear-gradient(90deg, var(--light) 25%, #e2e8f0 50%, var(--light) 75%);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
border-radius: 4px;
}
@keyframes shimmer {
0% { background-position: 200% 0; }
100% { background-position: -200% 0; }
}
.skeleton-text {
height: 16px;
margin-bottom: 8px;
}
.skeleton-title {
height: 24px;
width: 60%;
margin-bottom: 12px;
}
.skeleton-avatar {
width: 40px;
height: 40px;
border-radius: 50%;
}
/_ ============================================
FILTERS & SEARCH
============================================ _/
.filters,
.filter-bar {
display: flex;
flex-direction: column;
gap: 12px;
margin-bottom: 20px;
padding: 16px;
background: #fff;
border-radius: var(--radius);
border: 1px solid var(--border);
}
.filter-group {
display: flex;
flex-direction: column;
gap: 8px;
}
.filter-label {
font-size: 13px;
font-weight: 500;
color: var(--text);
}
.search-bar {
width: 100%;
margin: 0 0 16px 0;
}
.search-results {
margin-top: 12px;
}
.search-result-count {
font-size: 13px;
color: var(--text-muted);
margin-bottom: 12px;
}
/_ ============================================
DASHBOARD WIDGETS
============================================ _/
.widget-calendar {
background: #fff;
border-radius: var(--radius);
padding: 16px;
border: 1px solid var(--border);
}
.calendar-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 16px;
}
.calendar-title {
font-size: 16px;
font-weight: 600;
}
.calendar-grid {
display: grid;
grid-template-columns: repeat(7, 1fr);
gap: 4px;
}
.calendar-day {
aspect-ratio: 1;
display: flex;
align-items: center;
justify-content: center;
font-size: 13px;
border-radius: 4px;
cursor: pointer;
}
.calendar-day:hover {
background: var(--light);
}
.calendar-day.today {
background: var(--primary);
color: #fff;
}
.calendar-day.selected {
background: rgba(79, 70, 229, 0.1);
color: var(--primary);
}
/_ Activity Feed _/
.activity-feed {
display: flex;
flex-direction: column;
gap: 16px;
}
.activity-item {
display: flex;
gap: 12px;
padding-bottom: 16px;
border-bottom: 1px solid var(--border);
}
.activity-item:last-child {
border-bottom: none;
padding-bottom: 0;
}
.activity-icon {
width: 40px;
height: 40px;
border-radius: 50%;
background: var(--light);
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
}
.activity-content {
flex: 1;
min-width: 0;
}
.activity-text {
font-size: 14px;
color: var(--text);
margin: 0 0 4px 0;
}
.activity-time {
font-size: 12px;
color: var(--text-muted);
}
/_ ============================================
BOTTOM NAVIGATION
============================================ _/
.bottom-nav,
.mobile-nav {
position: fixed;
bottom: 0;
left: 0;
right: 0;
height: 64px;
background: #fff;
border-top: 1px solid var(--border);
display: flex;
justify-content: space-around;
align-items: center;
z-index: 100;
padding: 0 8px;
}
.bottom-nav-item {
flex: 1;
height: 100%;
border: none;
background: transparent;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 4px;
font-size: 11px;
color: var(--text-muted);
cursor: pointer;
transition: var(--transition);
position: relative;
}
.bottom-nav-item:active {
background: var(--light);
}
.bottom-nav-item.active {
color: var(--primary);
}
.bottom-nav-icon {
font-size: 22px;
}
.bottom-nav-label {
font-size: 10px;
font-weight: 500;
}
.bottom-nav-badge {
position: absolute;
top: 8px;
right: 50%;
transform: translateX(12px);
min-width: 16px;
height: 16px;
background: var(--danger);
color: #fff;
border-radius: 8px;
font-size: 9px;
display: flex;
align-items: center;
justify-content: center;
padding: 0 4px;
}
/_ Add padding to content when bottom nav is present _/
.has-bottom-nav .main-content {
padding-bottom: 80px;
}
/_ ============================================
AVATARS
============================================ _/
.avatar {
width: 40px;
height: 40px;
border-radius: 50%;
object-fit: cover;
background: var(--light);
color: var(--text);
display: flex;
align-items: center;
justify-content: center;
font-weight: 600;
font-size: 16px;
flex-shrink: 0;
}
.avatar-sm { width: 32px; height: 32px; font-size: 14px; }
.avatar-lg { width: 60px; height: 60px; font-size: 24px; }
.avatar-xl { width: 80px; height: 80px; font-size: 32px; }
.avatar-group {
display: flex;
align-items: center;
}
.avatar-group .avatar {
margin-left: -8px;
border: 2px solid #fff;
}
.avatar-group .avatar:first-child {
margin-left: 0;
}
/_ ============================================
DIVIDERS
============================================ _/
.divider,
hr {
height: 1px;
background: var(--border);
border: none;
margin: 24px 0;
}
.divider-text {
display: flex;
align-items: center;
gap: 16px;
margin: 24px 0;
color: var(--text-muted);
font-size: 13px;
}
.divider-text::before,
.divider-text::after {
content: '';
flex: 1;
height: 1px;
background: var(--border);
}
/_ ============================================
UTILITY CLASSES
============================================ _/
.hide-mobile,
.d-none-mobile {
display: none ;
}
.show-mobile,
.d-mobile {
display: block ;
}
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-success { color: var(--success); }
.text-danger { color: var(--danger); }
.text-warning { color: var(--warning); }
.text-info { color: var(--info); }
.text-muted { color: var(--text-muted); }
.bg-primary { background: var(--primary); color: #fff; }
.bg-secondary { background: var(--secondary); color: #fff; }
.bg-success { background: var(--success); color: #fff; }
.bg-danger { background: var(--danger); color: #fff; }
.bg-warning { background: var(--warning); color: #fff; }
.bg-info { background: var(--info); color: #fff; }
.bg-light { background: var(--light); }
.bg-dark { background: var(--dark); color: #fff; }
.rounded { border-radius: var(--radius); }
.rounded-sm { border-radius: 4px; }
.rounded-lg { border-radius: 12px; }
.rounded-full { border-radius: 9999px; }
.shadow { box-shadow: var(--shadow); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-none { box-shadow: none; }
.m-0 { margin: 0; }
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mb-1 { margin-bottom: 8px; }
.mb-2 { margin-bottom: 16px; }
.mb-3 { margin-bottom: 24px; }
.p-0 { padding: 0; }
.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }
.w-100 { width: 100%; }
.h-100 { height: 100%; }
.d-flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.align-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 8px; }
.gap-2 { gap: 16px; }
.gap-3 { gap: 24px; }
.overflow-hidden { overflow: hidden; }
.overflow-auto { overflow: auto; }
.overflow-scroll { overflow: scroll; }
.position-relative { position: relative; }
.position-absolute { position: absolute; }
.position-fixed { position: fixed; }
.cursor-pointer { cursor: pointer; }
.pointer-events-none { pointer-events: none; }
.truncate {
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}
/_ ============================================
TYPOGRAPHY
============================================ _/
h1, .h1 { font-size: 28px; font-weight: 700; line-height: 1.2; margin: 0 0 16px 0; }
h2, .h2 { font-size: 24px; font-weight: 700; line-height: 1.2; margin: 0 0 12px 0; }
h3, .h3 { font-size: 20px; font-weight: 600; line-height: 1.3; margin: 0 0 12px 0; }
h4, .h4 { font-size: 18px; font-weight: 600; line-height: 1.3; margin: 0 0 8px 0; }
h5, .h5 { font-size: 16px; font-weight: 600; line-height: 1.4; margin: 0 0 8px 0; }
h6, .h6 { font-size: 14px; font-weight: 600; line-height: 1.4; margin: 0 0 8px 0; }
p { margin: 0 0 16px 0; line-height: 1.6; }
a {
color: var(--primary);
text-decoration: none;
transition: var(--transition);
}
a:hover {
color: var(--primary-dark);
text-decoration: underline;
}
strong, b { font-weight: 600; }
em, i { font-style: italic; }
small, .small { font-size: 12px; }
.text-xs { font-size: 11px; }
.text-sm { font-size: 13px; }
.text-base { font-size: 14px; }
.text-lg { font-size: 16px; }
.text-xl { font-size: 18px; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.leading-tight { line-height: 1.2; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.6; }
/_ ============================================
ACCESSIBILITY & FOCUS STATES
============================================ _/
_:focus-visible {
outline: 2px solid var(--primary);
outline-offset: 2px;
}
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
outline: 2px solid var(--primary);
outline-offset: 2px;
}
.sr-only {
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0,0,0,0);
white-space: nowrap;
border-width: 0;
}
/_ ============================================
ANIMATIONS
============================================ _/
@keyframes pulse {
0%, 100% { opacity: 1; }
50% { opacity: 0.5; }
}
.animate-pulse {
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes bounce {
0%, 100% {
transform: translateY(0);
}
50% {
transform: translateY(-10px);
}
}
.animate-bounce {
animation: bounce 1s infinite;
}
/_ ============================================
PRINT STYLES
============================================ \*/
@media print {
.sidebar,
.top-header,
.bottom-nav,
.sidebar-overlay,
.no-print {
display: none ;
}
.main-content {
padding: 0;
}

.card {
box-shadow: none;
border: 1px solid #ddd;
page-break-inside: avoid;
}
}
}
/_ ============================================
END MOBILE CSS (<580px)
============================================ _/

This is **100% complete production-ready mobile CSS** for admin dashboards under 580px. It includes every component you'll need.
