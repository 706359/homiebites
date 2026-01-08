# Dead Files & CSS Cleanup Summary

## 📋 Quick Summary

**Analysis Complete!** Found potential cleanup opportunities across the codebase.

---

## ✅ Safe to Delete Now

### Backup Files

- `web/next.config.js.backup` ✅ Safe to delete

### Unused CSS (if Next.js is fully working)

- `web/App.css` - Only used by old `web/App.jsx` (React Router)

---

## ⚠️ Verify Before Deleting

### Old React Router/Vite Files (18 files)

These are legacy from pre-Next.js migration. **Verify Next.js works fully** before deleting:

**Web App:**

- `web/App.jsx` - Old React Router entry
- `web/main.jsx` - Old Vite entry point
- `web/index.html` - Old Vite HTML
- `web/vite.config.js` - Vite config (but vite scripts still in package.json)
- `web/vite-backup/` - Backup directory

**Admin App:**

- `admin/App.jsx` - Old React Router entry
- `admin/main.jsx` - Old Vite entry point
- `admin/index.html` - Old Vite HTML
- `admin/vite.config.js` - Vite config
- `admin/vite-backup/` - Backup directory

**Old Pages Directory (14 files):**

- `web/pages/*.jsx` - Replaced by Next.js App Router
- ⚠️ **Note**: `MenuPage.css` and `OffersPage.css` are still imported, keep those

---

## 📚 Documentation to Archive (~38 files)

### Migration Docs (Completed)

- All `*MIGRATION*.md` files (15 files)
- All `*REFACTORING*.md` files (6 files)

### Status/Verification Docs (Completed)

- All `*VERIFICATION*.md` files (10 files)
- All `*STATUS*.md` files (5 files)
- All `*COMPLETE*.md` files (5 files)
- All `*SUMMARY*.md` files (7 files)

**Keep These Docs:**

- `README.md`
- `PROJECT-STRUCTURE.md`
- `FULL_DASHBOARD_PLAN.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/*RULES.md`
- `README_BUTTON_SYSTEM.md`
- Production checklists/reports

---

## 🛠️ Tools Created

### Analysis Script

```bash
npm run check:dead
# or
node scripts/check-dead-files.js
```

### Cleanup Script

```bash
npm run cleanup:dead
# or
node scripts/cleanup-dead-files.js [files|docs|all]
```

---

## 📊 Statistics

- **Total Files Analyzed**: 197+
- **Dead CSS Files**: 1 confirmed
- **Legacy JS/JSX Files**: ~18
- **Outdated Docs**: ~38
- **Backup Files**: 1
- **Total Cleanup Potential**: ~58 files

---

## ⚠️ Important Notes

1. **Backup First**: Always backup before deleting
2. **Test Thoroughly**: Verify Next.js apps work after cleanup
3. **Gradual Cleanup**: Remove in batches and test
4. **Archive Don't Delete**: Consider archiving docs instead of deleting

---

## 🚀 Recommended Cleanup Order

1. ✅ **Delete backup file** (safest)

   ```bash
   rm web/next.config.js.backup
   ```

2. 📚 **Archive documentation** (safe, preserves history)

   ```bash
   mkdir -p docs/archive
   mv *MIGRATION*.md docs/archive/ 2>/dev/null
   mv admin/*REFACTORING*.md docs/archive/ 2>/dev/null
   # ... etc
   ```

3. ⚠️ **Test Next.js thoroughly** before deleting old React Router files

4. 🗑️ **Delete old Vite/React Router files** (after verification)

---

## 📄 Full Report

See `DEAD_FILES_REPORT.md` for detailed analysis and recommendations.
