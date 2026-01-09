# Safe Cleanup Guide - Verified Safe to Delete

## ✅ VERIFIED: Next.js is Fully Working

All checks passed! Next.js setup is complete and working correctly.

---

## 🎯 Safe to Delete (16 files)

These files have been **verified** as safe to delete and **will not affect** your Next.js project:

### 1. Backup File (1 file)
- `web/next.config.js.backup` ✅

### 2. Old Pages JSX Files (14 files)
These are ONLY imported by old `App.jsx` which Next.js doesn't use:
- `web/pages/AccountPage.jsx` ✅
- `web/pages/AdminDashboardPage.jsx` ✅
- `web/pages/AdminForgotPasswordPage.jsx` ✅
- `web/pages/AdminPage.jsx` ✅
- `web/pages/ErrorPage.jsx` ✅
- `web/pages/FAQPage.jsx` ✅
- `web/pages/HomePage.jsx` ✅
- `web/pages/LegalDisclaimerPage.jsx` ✅
- `web/pages/MenuPage.jsx` ✅ (CSS file still used)
- `web/pages/NotFoundPage.jsx` ✅
- `web/pages/OffersPage.jsx` ✅ (CSS file still used)
- `web/pages/PrivacyPolicyPage.jsx` ✅
- `web/pages/SearchPage.jsx` ✅
- `web/pages/TermsOfServicePage.jsx` ✅

### 3. Unused CSS (1 file)
- `web/App.css` ✅ (Only used by old React Router App.jsx)

---

## 🔒 Files to KEEP (Still Used)

These CSS files are **still imported** and must NOT be deleted:
- ✅ `web/pages/MenuPage.css` - Used in `web/app/menu/MenuPageClient.jsx`
- ✅ `web/pages/OffersPage.css` - Used in `web/app/offers/page.jsx`

---

## 🛠️ How to Safely Clean Up

### Step 1: Verify Files Are Safe
```bash
npm run verify:safe
```

This will:
- ✅ Check Next.js setup
- ✅ Verify files aren't imported in Next.js
- ✅ Show which files are safe to delete

### Step 2: Preview What Will Be Deleted (Dry Run)
```bash
npm run cleanup:safe:dry
```

This shows what would be deleted **without actually deleting anything**.

### Step 3: Delete Files (With Backup)
```bash
npm run cleanup:safe
```

This will:
- ✅ Create backups in `.cleanup-backup/` directory
- ✅ Delete only verified safe files
- ✅ Verify Next.js still works after cleanup
- ✅ Show summary of what was deleted

---

## ⚠️ Files NOT Safe to Delete Yet

These files need manual verification:

### Old React Router Entry Points
- `web/App.jsx` - Old React Router (not used by Next.js, but verify)
- `web/main.jsx` - Old Vite entry (not used by Next.js, but verify)
- `web/index.html` - Old Vite HTML (not used by Next.js, but verify)
- `admin/App.jsx` - Old React Router (not used by Next.js, but verify)
- `admin/main.jsx` - Old Vite entry (not used by Next.js, but verify)
- `admin/index.html` - Old Vite HTML (not used by Next.js, but verify)

### Vite Configs
- `web/vite.config.js` - Might be needed for `vite:dev` scripts
- `admin/vite.config.js` - Might be needed for `vite:dev` scripts

**Recommendation**: If you're not using `npm run vite:dev`, these can be deleted too.

---

## 📊 Summary

- **Verified Safe**: 16 files ✅
- **Needs Verification**: 8 files ⚠️
- **Must Keep**: 2 CSS files 🔒

---

## 🔄 Restore from Backup

If something goes wrong, restore files from backup:

```bash
# View backups
ls -la .cleanup-backup/

# Restore a file (example)
cp .cleanup-backup/web/pages/MenuPage.jsx web/pages/MenuPage.jsx
```

---

## ✅ Safety Features

1. **Backup Before Delete**: All files are backed up before deletion
2. **Verification**: Checks Next.js setup before and after cleanup
3. **Dry Run**: Preview changes without deleting
4. **Selective**: Only deletes verified safe files
5. **Reversible**: Backups stored in `.cleanup-backup/`

---

## 🚀 Quick Start

```bash
# 1. Verify what's safe
npm run verify:safe

# 2. Preview cleanup
npm run cleanup:safe:dry

# 3. Actually cleanup (with backup)
npm run cleanup:safe
```

That's it! Your project will be cleaner and Next.js will still work perfectly. ✅

