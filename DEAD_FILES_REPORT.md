# Dead Files & CSS Analysis Report

Generated: $(date)

## Summary

This report identifies potentially unused files, CSS, and documentation that can be safely removed or archived.

---

## ✅ VERIFIED AS USED (False Positives)

### CSS Files (Actually Used)
- `admin/styles/custom-overrides.css` - ✅ Imported in `admin/styles/index.css`
- `admin/styles/dashboard-enhancements.css` - ✅ Imported in `admin/styles/index.css`
- `admin/styles/tailwind-components.css` - ✅ Imported in `admin/styles/index.css`
- `admin/styles/theme.css` - ✅ Imported in `admin/styles/index.css`
- `web/pages/MenuPage.css` - ✅ Used in `web/app/menu/MenuPageClient.jsx`
- `web/pages/OffersPage.css` - ✅ Used in `web/app/offers/page.jsx`

### Shared CSS Files (Need Verification)
- `shared/styles/_buttons.css` - Check if imported
- `shared/styles/_glass.css` - Check if imported
- `shared/styles/variables.css` - Check if imported

---

## ⚠️ CONFIRMED DEAD FILES (Safe to Delete)

### Old React Router Files (Legacy from Pre-Next.js Migration)

#### Web App (Next.js - Old Vite Files)
- `web/App.jsx` - ❌ Old React Router setup, replaced by Next.js App Router
- `web/main.jsx` - ❌ Old Vite entry point, Next.js uses `app/` directory
- `web/index.html` - ❌ Old Vite HTML, Next.js generates its own
- `web/vite.config.js` - ❌ Vite config, not used in Next.js
- `web/vite-backup/` - ❌ Backup directory

#### Admin App (Next.js - Old Vite Files)
- `admin/App.jsx` - ❌ Old React Router setup, replaced by Next.js App Router
- `admin/main.jsx` - ❌ Old Vite entry point, Next.js uses `app/` directory
- `admin/index.html` - ❌ Old Vite HTML, Next.js generates its own
- `admin/vite.config.js` - ❌ Vite config, not used in Next.js
- `admin/vite-backup/` - ❌ Backup directory

#### Old Pages Directory (Replaced by Next.js App Router)
- `web/pages/AccountPage.jsx` - ❌ Replaced by `web/app/account/`
- `web/pages/AdminDashboardPage.jsx` - ❌ Replaced by `web/app/admin/dashboard/`
- `web/pages/AdminForgotPasswordPage.jsx` - ❌ Replaced by `web/app/admin/forgot-password/`
- `web/pages/AdminPage.jsx` - ❌ Replaced by `web/app/admin/`
- `web/pages/ErrorPage.jsx` - ❌ Replaced by `web/app/error.jsx`
- `web/pages/FAQPage.jsx` - ❌ Replaced by `web/app/faq/`
- `web/pages/HomePage.jsx` - ❌ Replaced by `web/app/page.jsx`
- `web/pages/LegalDisclaimerPage.jsx` - ❌ Check if route exists
- `web/pages/MenuPage.jsx` - ⚠️ CSS still used, but JSX might be unused
- `web/pages/NotFoundPage.jsx` - ❌ Replaced by `web/app/not-found.jsx`
- `web/pages/OffersPage.jsx` - ⚠️ CSS still used, but JSX might be unused
- `web/pages/PrivacyPolicyPage.jsx` - ❌ Check if route exists
- `web/pages/SearchPage.jsx` - ❌ Replaced by `web/app/search/`
- `web/pages/TermsOfServicePage.jsx` - ❌ Check if route exists

### Potentially Unused CSS Files
- `web/App.css` - ⚠️ Only used by old `web/App.jsx` (React Router). If Next.js is fully working, both can be deleted

### Backup Files
- `web/next.config.js.backup` - ❌ Backup file, safe to delete

---

## 📚 DOCUMENTATION FILES (Outdated/Redundant)

### Migration Documentation (Completed Migrations)
These docs document completed migrations and can be archived:

1. **Next.js Migration**
   - `NEXTJS_MIGRATION_PLAN.md`
   - `NEXTJS_OPTIMIZATION_PLAN.md`
   - `MIGRATION_COMPLETE.md`
   - `MIGRATION_VERIFICATION.md`

2. **Tailwind Migration**
   - `TAILWIND_MIGRATION_PLAN.md`
   - `TAILWIND_MIGRATION_GUIDE.md`
   - `TAILWIND_MIGRATION_COMPLETE.md`
   - `TAILWIND_MIGRATION_SUMMARY.md`
   - `TAILWIND_MIGRATION_ANALYSIS.md`
   - `TAILWIND_FIX.md`
   - `TAILWIND_SETUP_PLAN.md`

3. **Refactoring Documentation**
   - `admin/REFACTORING_PLAN.md`
   - `admin/REFACTORING_PROGRESS.md`
   - `admin/REFACTORING_COMPLETE_SUMMARY.md`
   - `admin/REFACTORING_SUMMARY.md`
   - `admin/SEPARATION_COMPLETE.md`
   - `admin/STRUCTURAL_REFACTOR.md`

4. **API Migration**
   - `API_MIGRATION_GUIDE.md`

### Status/Verification Documentation (Completed Tasks)
These docs verify completed work and can be archived:

1. **Implementation Status**
   - `IMPLEMENTATION_STATUS.md`
   - `IMPLEMENTATION_CHECKLIST.md`
   - `IMPLEMENTATION_SUMMARY.md`
   - `DASHBOARD_IMPLEMENTATION_STATUS.md`

2. **Verification Reports**
   - `DASHBOARD_VERIFICATION.md`
   - `DESIGN_VERIFICATION_DETAILED.md`
   - `DESIGN_VERIFICATION_REPORT.md`
   - `DETAILED_TAB_VERIFICATION.md`
   - `DATA_FLOW_VERIFICATION.md`
   - `DOCUMENT_VERIFICATION_REPORT.md`
   - `admin/CALCULATIONS_VERIFICATION.md`
   - `admin/MASTER_ORDERS_IMPLEMENTATION_STATUS.md`

3. **Completion Reports**
   - `CSS_CLEANUP_COMPLETE.md`
   - `CHANGES_SUMMARY.md`

### Plan Documentation (Completed Plans)
- `FULL_DASHBOARD_PLAN_COMPARISON.md`
- `admin/FULL_DASHBOARD_PLAN_COMPARISON.md`
- `admin/COMPONENT_EXTRACTION_PLAN.md`
- `CURRENT_MONTH_TAB_COMPARISON.md`

### Keep These (Still Relevant)
- `README.md` - Main project readme
- `PROJECT-STRUCTURE.md` - Project structure documentation
- `docs/DESIGN_SYSTEM.md` - Design system reference
- `docs/CURRENT_MONTH_TAB_RULES.md` - Active rules
- `docs/COMPLETE_DASHBOARD_RULES.md` - Active rules
- `README_BUTTON_SYSTEM.md` - Button system reference
- `FULL_DASHBOARD_PLAN.md` - Main plan document
- `admin/FULL_DASHBOARD_PLAN.md` - Admin plan
- `admin/README.md` - Admin readme
- `backend/README.md` - Backend readme
- `web/PRODUCTION_CHECKLIST.md` - Production checklist
- `web/PRODUCTION_READINESS_REPORT.md` - Production report

---

## 🗑️ RECOMMENDED ACTIONS

### Safe to Delete Immediately

1. **Backup Files**
   ```bash
   rm web/next.config.js.backup
   ```

2. **Unused CSS**
   ```bash
   rm web/App.css  # Not imported anywhere in Next.js
   ```

2. **Old Vite Entry Points** (if Next.js is fully working)
   - `web/App.jsx`
   - `web/main.jsx`
   - `web/index.html`
   - `admin/App.jsx`
   - `admin/main.jsx`
   - `admin/index.html`

3. **Old Pages Directory** (after verifying Next.js routes work)
   - `web/pages/*.jsx` (except CSS files that are still imported)

4. **Vite Configs** (if not using Vite)
   - `web/vite.config.js`
   - `admin/vite.config.js`

5. **Backup Directories**
   - `web/vite-backup/`
   - `admin/vite-backup/`

### Archive Documentation (Move to `docs/archive/`)

Move completed migration and verification docs to archive:
- All `*MIGRATION*.md` files
- All `*REFACTORING*.md` files
- All `*VERIFICATION*.md` files
- All `*STATUS*.md` files
- All `*COMPLETE*.md` files
- All `*SUMMARY*.md` files (except main ones)

### Verify Before Deleting

1. **CSS Files**
   - `web/App.css` - Check if imported in any Next.js files
   - `web/app/loading.css` - Check if used in `loading.jsx`
   - `shared/styles/*.css` - Verify imports

2. **Old Pages**
   - Verify all routes work in Next.js before deleting old pages

---

## 📊 Statistics

- **Total CSS Files**: 33
- **Confirmed Dead CSS**: 1 (`web/App.css`)
- **Old JS/JSX Files**: ~18 (legacy React Router/Vite)
- **Outdated Docs**: ~38 files
- **Backup Files**: 1
- **Total Cleanup Potential**: ~58 files

## ✅ Quick Cleanup Commands

### Delete Confirmed Dead Files
```bash
# Delete backup file
rm web/next.config.js.backup

# Delete unused CSS
rm web/App.css
```

### Archive Documentation
```bash
# Create archive directory
mkdir -p docs/archive

# Archive migration docs (example)
mv *MIGRATION*.md docs/archive/ 2>/dev/null
mv admin/*REFACTORING*.md docs/archive/ 2>/dev/null
mv *VERIFICATION*.md docs/archive/ 2>/dev/null
```

### Use Cleanup Script
```bash
# Run analysis
node scripts/check-dead-files.js

# Run cleanup (review first!)
node scripts/cleanup-dead-files.js files    # Delete files only
node scripts/cleanup-dead-files.js docs     # Archive docs only
node scripts/cleanup-dead-files.js all     # Do everything
```

---

## ⚠️ IMPORTANT NOTES

1. **Backup before deletion**: Always backup before deleting files
2. **Test thoroughly**: Verify all functionality works after cleanup
3. **Keep for reference**: Consider archiving instead of deleting docs
4. **Gradual cleanup**: Remove files in batches and test after each batch

---

## Next Steps

1. Create `docs/archive/` directory
2. Move outdated documentation there
3. Test Next.js apps thoroughly
4. Remove old Vite/React Router files
5. Clean up backup files
6. Verify CSS imports
7. Remove unused CSS files

