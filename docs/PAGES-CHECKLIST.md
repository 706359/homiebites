# Pages & Sections Checklist

## Available Routes (from App.jsx)

✅ **Home Page** - `/`
- Header
- Hero
- Features
- SpecialOffer
- Gallery
- Testimonials
- FAQ
- About
- Contact
- Footer

✅ **Menu Page** - `/menu`
- Should display menu items with prices
- Add to cart functionality

✅ **Search Page** - `/search`
- Search functionality

✅ **Support Page** - `/support`
- Support/contact information

✅ **FAQ Page** - `/faq`
- Frequently asked questions

✅ **Login Page** - `/login`
- User login/registration

✅ **Account Page** - `/account`
- User account dashboard
- Saved addresses
- Order history

✅ **Admin Dashboard** - `/admin`
- Admin login
- Admin dashboard

## Components Available

✅ Header.jsx
✅ Hero.jsx
✅ Features.jsx
✅ SpecialOffer.jsx
✅ Gallery.jsx
✅ Testimonials.jsx
✅ FAQ.jsx
✅ About.jsx
✅ Contact.jsx
✅ Footer.jsx
✅ OrderModal.jsx
✅ WhatsAppFloat.jsx
✅ LanguageSwitcher.jsx
✅ Rates.jsx

## Pages Available

✅ MenuPage.jsx
✅ SearchPage.jsx
✅ SupportPage.jsx
✅ FAQPage.jsx
✅ LoginPage.jsx
✅ AccountPage.jsx

## What to Check

1. **Verify all pages load:**
   - Visit each route and check if page loads
   - Check browser console for errors

2. **Check components render:**
   - All sections on homepage should be visible
   - Navigation links should work

3. **Verify functionality:**
   - Menu page should show menu items
   - Search should work
   - Login/Account should work
   - Admin dashboard should work

## Common Issues

- **404 errors:** Route not found - check App.jsx routes
- **Blank pages:** Component not rendering - check imports
- **Missing sections:** Component not included in page
- **Navigation not working:** Check route paths

## Quick Test

Run the dev server and visit:
- http://localhost:5173/ (Home)
- http://localhost:5173/menu
- http://localhost:5173/search
- http://localhost:5173/support
- http://localhost:5173/faq
- http://localhost:5173/login
- http://localhost:5173/account
- http://localhost:5173/admin

