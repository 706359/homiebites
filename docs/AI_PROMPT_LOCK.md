# 🤖 AI Prompt Lock - Copy This Into All AI Tools

**Copy the text below into ALL AI prompts, Copilot, ChatGPT, Cursor, GitHub Copilot, etc.**

---

```
🔒 BUTTON SYSTEM LOCK - MANDATORY

Only 5 button variants exist in this codebase:
- .btn-primary
- .btn-secondary
- .btn-ghost
- .btn-public
- .btn-special (with modifiers: .whatsapp, .danger, .admin)

Creating new button styles is FORBIDDEN.

Size modifiers allowed: .btn-small, .btn-large, .btn-full, .btn-icon, .btn-qty

If you need a custom button, use .btn-special with CSS variables:
  --btn-bg: #color;
  --btn-bg-hover: #hover-color;

FORBIDDEN classes:
- .btn-outline (use .btn-ghost)
- .btn-text (use .btn-ghost)
- .btn-whatsapp (use .btn-special.whatsapp)
- .btn-danger (use .btn-special.danger)
- Any new .btn-* class

Reference: docs/BUTTON_VARIANTS_GUIDE.md
Status: FROZEN - changes require design-system review
```

---

## Where to Use This

### ✅ Cursor AI

Add to `.cursorrules` file (already done)

### ✅ GitHub Copilot

Add as a comment at the top of relevant files or in Copilot settings

### ✅ ChatGPT / Claude

Paste at the beginning of every conversation about buttons

### ✅ VS Code Copilot

Add to workspace settings or as a comment block

### ✅ Internal Documentation

Include in onboarding docs, style guides, and PR templates

---

## Quick Reference Card

Print this and keep it visible:

```
┌─────────────────────────────────────────┐
│  🔒 BUTTON SYSTEM - ONLY 5 VARIANTS   │
├─────────────────────────────────────────┤
│  ✅ .btn-primary                        │
│  ✅ .btn-secondary                      │
│  ✅ .btn-ghost                          │
│  ✅ .btn-public                         │
│  ✅ .btn-special                        │
│                                         │
│  ❌ NO NEW BUTTON CLASSES               │
│  ❌ NO ADMIN-SPECIFIC BUTTONS          │
│  ❌ NO INLINE STYLES                    │
│                                         │
│  Use .btn-special for custom colors    │
└─────────────────────────────────────────┘
```

---

## Enforcement

**If AI suggests a new button class:**

1. Stop immediately
2. Remind AI of the button system lock
3. Request migration to 5-button system
4. Reference `docs/BUTTON_SYSTEM_LOCK.md`

---

**Last Updated**: 2025-01-27  
**Status**: 🔒 **MANDATORY FOR ALL AI TOOLS**
