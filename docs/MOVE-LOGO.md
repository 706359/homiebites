# Move Logo to Correct Folder

## Current Location
- `public/logo.png`

## New Location (Recommended)
- `src/assets/logo.png`

## Steps to Move

1. **Copy the logo file:**
   ```bash
   cp public/logo.png src/assets/logo.png
   ```

2. **Or manually:**
   - Open `public/logo.png`
   - Copy it
   - Paste it into `src/assets/` folder
   - Rename to `logo.png` if needed

## Why src/assets?

- Files in `src/assets` are imported as modules
- Vite processes them during build
- More reliable than public folder for React components
- Better for production builds

## Code Already Updated

The components are already updated to import from `src/assets/logo.png`:
- `src/components/Header.jsx` - imports logo
- `src/components/Footer.jsx` - imports logo

After moving the file, restart the dev server:
```bash
npm run dev
```

