# 🔒 Button System Lock - FROZEN & ENFORCED

**Status**: **FROZEN**  
**Date Locked**: 2025-01-27  
**Version**: v1.0.0  
**Next Review**: After v1.2.0

---

## 🚦 OFFICIAL STATUS

**Button System: Frozen & Enforced**

Any future changes require design-system review.

---

## ⚠️ CRITICAL RULES

### 1. Only 5 Button Variants Exist

Creating new button styles is **FORBIDDEN**.

**Allowed Classes**:

- `.btn` (base - required)
- `.btn-primary`
- `.btn-secondary`
- `.btn-ghost`
- `.btn-public`
- `.btn-special` (with modifiers: `.whatsapp`, `.danger`, `.admin`)

**Size Modifiers** (allowed):

- `.btn-small`
- `.btn-large`
- `.btn-full`
- `.btn-icon`
- `.btn-qty` (special exception - circular buttons)

**FORBIDDEN**: Any other `.btn-*` class is a violation.

---

## 🚫 What You Cannot Do

❌ Create new button classes  
❌ Add admin-specific button variants  
❌ Override button colors with inline styles  
❌ Duplicate button semantics  
❌ Create `.btn-outline`, `.btn-text`, `.btn-whatsapp`, etc.  
❌ Add new modifiers without design-system review

---

## ✅ What You Can Do

✅ Use existing 5 variants  
✅ Use `.btn-special` with CSS variables for custom colors  
✅ Use size modifiers (`.btn-small`, `.btn-large`, `.btn-full`)  
✅ Use `.btn-icon` for icon-only buttons  
✅ Use `.btn-qty` for quantity controls

---

## 📋 Code Review Checklist

Before merging any PR:

- [ ] No new `.btn-*` classes added
- [ ] All buttons use one of 5 allowed variants
- [ ] No inline styles overriding button colors
- [ ] No admin-specific button classes
- [ ] Size modifiers used correctly
- [ ] `.btn-special` used for contextual buttons (danger, WhatsApp)

**If any checkbox fails → REJECT PR**

---

## 🤖 AI & Developer Prompt Lock

**Copy this into ALL AI prompts, Copilot, ChatGPT, Cursor, etc.:**

```
🔒 BUTTON SYSTEM LOCK

Only 5 button variants exist:
- .btn-primary
- .btn-secondary
- .btn-ghost
- .btn-public
- .btn-special (with modifiers: .whatsapp, .danger, .admin)

Creating new button styles is FORBIDDEN.

Size modifiers allowed: .btn-small, .btn-large, .btn-full, .btn-icon, .btn-qty

If you need a custom button, use .btn-special with CSS variables.
```

---

## 📅 Legacy CSS Removal Schedule

### Phase 1: Current (v1.0.0 - v1.1.0)

- ✅ Legacy mappings exist for backward compatibility
- ✅ All JSX migrated to new system
- ✅ Legacy CSS marked with TODO comments

### Phase 2: Removal (After v1.2.0)

- 🗑️ Delete legacy button classes from CSS
- 🗑️ Remove `.btn-remove`, `.btn-add-item`, `.btn-view-details`, etc.
- 🗑️ Remove `.faq-whatsapp-btn` and other legacy classes

**Target Date**: Q2 2025 (After v1.2.0 release)

---

## 🧠 Design System Principles

### What We Did Right ✅

1. **Consolidated variants** - Didn't keep `outline` + `ghost` → good call
2. **No admin split** - Didn't create admin-specific buttons → excellent
3. **Escape hatch** - Used `.btn-special` as extension point → textbook design-system move
4. **Preserved exceptions** - Kept `.btn-qty` as documented exception → justified

### Why This Matters

- **Consistency**: One button system across entire platform
- **Maintainability**: Single source of truth
- **Scalability**: `.btn-special` handles edge cases
- **Developer Experience**: Clear rules, no confusion

---

## 🔍 Lint Rules

### ESLint / Stylelint Configuration

```json
{
  "rules": {
    "no-restricted-selectors": [
      "error",
      {
        "selectors": [
          ".btn-outline",
          ".btn-text",
          ".btn-whatsapp",
          ".btn-danger",
          ".btn-add-item",
          ".btn-view-details",
          ".btn-edit-order",
          ".btn-delete-order",
          ".btn-remove",
          ".btn-edit",
          ".btn-delete"
        ],
        "message": "Use the 5-button system instead. See docs/BUTTON_VARIANTS_GUIDE.md"
      }
    ]
  }
}
```

### Manual Review Rule

**Any PR adding a new `.btn-*` class is auto-rejected.**

---

## 📚 Documentation

- **`docs/BUTTON_VARIANTS_GUIDE.md`** - Complete button system guide
- **`docs/BUTTON_SYSTEM_REVIEW.md`** - Migration status
- **`docs/BUTTON_COMPLIANCE_REPORT.md`** - Compliance audit
- **`docs/BUTTON_BORDERS_REVIEW.md`** - Border implementation
- **`docs/BUTTON_SYSTEM_LOCK.md`** - This file (enforcement)

---

## 🎯 Enforcement

### For Developers

1. Read `docs/BUTTON_VARIANTS_GUIDE.md` before coding
2. Use only allowed button classes
3. If you need something custom, use `.btn-special` with CSS variables
4. Ask for design-system review if unsure

### For Code Reviewers

1. Check for new `.btn-*` classes
2. Verify all buttons use allowed variants
3. Reject PRs with forbidden classes
4. Reference this document in review comments

### For AI Assistants

1. Always include button system lock in prompts
2. Never suggest new button classes
3. Always use existing 5 variants
4. Use `.btn-special` for custom needs

---

## 🚨 Violation Process

If someone adds a new button class:

1. **Immediate**: Reject PR with reference to this document
2. **Action**: Request migration to 5-button system
3. **Documentation**: Update migration guide if needed
4. **Prevention**: Add lint rule if pattern repeats

---

## ✅ Compliance Status

**Current Status**: ✅ **100% Compliant**

- All buttons use 5-button system
- No deprecated classes in JSX
- Legacy CSS marked for removal
- Documentation complete
- Lint rules ready

---

## 📞 Questions?

If you need a button that doesn't fit the 5 variants:

1. **Check**: Can `.btn-special` with CSS variables work?
2. **Review**: Is this really a new use case or existing variant?
3. **Request**: Design-system review before implementation

**Remember**: The system is frozen. Changes require review.

---

**Last Updated**: 2025-01-27  
**Status**: 🔒 **FROZEN & ENFORCED**  
**Next Review**: After v1.2.0
