# Shared Folder - Moved to web/

## Action Taken

The `shared/` folder has been **moved inside the `web/` folder** because it's actively used by the web app.

## What Was Moved

**From:** `/shared/` (root level)  
**To:** `/web/shared/` (inside web app)

## Contents

The shared folder contains:
- `locales/` - Translation files (en.json, hi.json)
- `styles/` - Shared CSS files (_buttons.css, _glass.css, shared.css, variables.css)
- `utils/` - Shared utilities (i18n.js)

## Import Paths Updated

All import paths in the web app have been updated:

**Before:**
```javascript
import '../../shared/styles/shared.css';
import "../../shared/utils/i18n";
import "../../shared/locales/en.json";
```

**After:**
```javascript
import '../shared/styles/shared.css';
import "../shared/utils/i18n";
import "../shared/locales/en.json";
```

## Files Updated

1. `web/app/layout.jsx` - Updated shared.css import
2. `web/contexts/LanguageContext.jsx` - Updated i18n and locale imports
3. `web/components/LanguageSwitcher.jsx` - Updated i18n import

## Verification

✅ All import paths updated
✅ No linter errors
✅ Shared folder now inside web/ where it belongs

## Why This Makes Sense

Since the web app is the only thing running on localhost:3000, and it's the only consumer of the shared folder, it makes sense to have it inside the web/ directory rather than at the root level.

