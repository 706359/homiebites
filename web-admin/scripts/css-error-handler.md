# CSS Error Handler Documentation

## Overview

The CSS Error Handler provides detailed error reporting for CSS syntax errors, making it easy to identify and fix issues in your stylesheets.

## Features

1. **Detailed Error Messages**: Shows exact file, line, and column where errors occur
2. **Code Context**: Displays 3 lines before and after the error with highlighting
3. **Unclosed Block Detection**: Automatically detects unclosed braces and blocks
4. **Visual Indicators**: Color-coded output with clear error markers
5. **Helpful Suggestions**: Provides actionable suggestions for fixing errors

## Usage

### Validate a Specific File

```bash
npm run validate-css components/admin/styles/admin-components.css
```

### Validate All CSS Files

```bash
npm run validate-css:all
```

### Automatic Validation (Before Build)

The CSS validator runs automatically before builds:

```bash
npm run build
```

## Error Output Format

When an error is found, you'll see:

```
✗ CSS Syntax Error
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File: components/admin/styles/admin-components.css
Error: Unclosed block
Line: 9053
Column: 1

Context:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9048 │ .settings-theme-option {
9049 │   transition: all 0.2s ease;
9050 │ }
9051 │
9052 │ .settings-theme-option:hover {
9053 │   transform: scale(1.01);
    │              ^
9054 │   box-shadow: 0 4px 12px rgba(68, 144, 49, 0.3);
9055 │ }
9056 │

Suggestion:
  Check for missing closing brace '}' after line 9053
  Ensure all @media queries, @keyframes, and rule blocks are properly closed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Common Error Types

### 1. Unclosed Block
**Error**: `Unclosed block starting at line X. Y opening brace(s) not closed.`

**Solution**: 
- Find the opening `{` at the indicated line
- Ensure there's a matching closing `}` 
- Check nested blocks (media queries, keyframes, etc.)

### 2. Extra Closing Brace
**Error**: `Extra closing brace '}' at line X, column Y`

**Solution**:
- Remove the extra `}` or add a matching opening `{`

### 3. Syntax Errors
**Error**: Various PostCSS syntax errors

**Solution**:
- Check the exact line and column shown
- Review the code context provided
- Ensure proper CSS syntax (quotes, semicolons, etc.)

## Integration with Build Process

The validator runs automatically before builds via the `prebuild` script in `package.json`. This ensures CSS errors are caught early in the development process.

## Troubleshooting

### Script Not Running

If the script doesn't run, ensure:
1. Node.js is installed and accessible
2. Dependencies are installed: `npm install`
3. Script has execute permissions: `chmod +x scripts/validate-css.js`

### False Positives

If you see false positives:
1. Check if the CSS uses advanced features not supported by PostCSS
2. Verify file encoding is UTF-8
3. Check for hidden characters or unusual whitespace

## Tips

1. **Run validation frequently**: Catch errors early before they compound
2. **Fix one error at a time**: Errors can cascade, fix them sequentially
3. **Check context**: The 3-line context helps understand the error location
4. **Use suggestions**: The validator provides helpful fix suggestions
