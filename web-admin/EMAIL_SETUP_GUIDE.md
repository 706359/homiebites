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
