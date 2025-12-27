# AI Assistant Prompts - HomieBites

## 🔒 MANDATORY PROMPT (Copy to all AI tools)

```
🔒 BUTTON SYSTEM LOCK - HOMIEBITES

CRITICAL RULE: Only 5 button variants exist. Creating new button styles is FORBIDDEN.

ALLOWED BUTTON CLASSES:
- Base: .btn (required)
- Variants (5 ONLY):
  1. .btn-primary
  2. .btn-secondary
  3. .btn-ghost
  4. .btn-public
  5. .btn-special (with modifiers: .whatsapp, .danger, .admin)
- Size modifiers: .btn-small, .btn-large, .btn-full
- Utility modifiers: .btn-icon, .btn-qty

FORBIDDEN:
- Creating new .btn-* classes
- Admin-specific button variants
- Color-specific button classes
- Context-specific button classes

IF YOU NEED A CUSTOM BUTTON:
1. Use .btn-special with CSS variables:
   - --btn-bg (background color)
   - --btn-bg-hover (hover background)
   - --btn-text (text color)
   - --btn-border (border color)
   - --btn-border-hover (hover border color)
2. Request design-system review
3. Get explicit approval

EXAMPLE:
<button class="btn btn-special custom-style">
  Custom Button
</button>

<style>
.custom-style {
  --btn-bg: #ff6b6b;
  --btn-bg-hover: #ee5a5a;
  --btn-text: #fff;
}
</style>

Any PR adding a new .btn-* class will be rejected.

See docs/BUTTON_SYSTEM_LOCK.md for complete rules.
```

---

## Where to Add This Prompt

### ✅ Cursor AI
Add to `.cursorrules` file (already added)

### ✅ GitHub Copilot
1. Open VS Code settings
2. Search for "GitHub Copilot: Include"
3. Add this prompt to your `.github/copilot-instructions.md`

### ✅ ChatGPT / Claude
Add to system prompt or custom instructions

### ✅ Code Review Tools
Add to PR template or review checklist

---

## Additional Context for AI

### Design System Principles
- All buttons use skew design (`transform: skewX(-8deg)`)
- Content is counter-skewed (`transform: skewX(8deg)`)
- Focus states use `outline: 3px solid currentColor`
- Borders are `2px solid` (transparent for filled buttons, colored for ghost)
- Smooth transitions: `0.25s ease` for colors, `0.15s ease` for transform

### Common Patterns
- Primary actions → `.btn-primary`
- Secondary actions → `.btn-secondary`
- Cancel/Close → `.btn-ghost`
- Danger/Delete → `.btn-special danger`
- WhatsApp → `.btn-special whatsapp`
- Marketing pages → `.btn-public`

### File Locations
- Button CSS: `shared/styles/shared.css`
- Variables: `shared/styles/variables.css`
- Documentation: `docs/BUTTON_VARIANTS_GUIDE.md`

---

**Last Updated**: 2025-01-27  
**Status**: 🔒 **ACTIVE**
