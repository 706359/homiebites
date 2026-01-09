# 🔒 Button System - Quick Reference

**Status**: **FROZEN & ENFORCED**

---

## ⚡ Quick Start

Only 5 button variants exist. Use these:

```jsx
// ✅ CORRECT
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-public">Public</button>
<button className="btn btn-special danger">Danger</button>
<button className="btn btn-special whatsapp">WhatsApp</button>

// ❌ WRONG
<button className="btn btn-outline">Don't do this</button>
<button className="btn btn-text">Don't do this</button>
<button className="btn btn-whatsapp">Don't do this</button>
```

---

## 📚 Full Documentation

- **`docs/BUTTON_VARIANTS_GUIDE.md`** - Complete guide
- **`docs/BUTTON_SYSTEM_LOCK.md`** - Enforcement rules
- **`docs/BUTTON_SYSTEM_STATUS.md`** - Official status

---

## 🚨 Remember

**Creating new button styles is FORBIDDEN.**

Use `.btn-special` with CSS variables for custom needs.

---

**Last Updated**: 2025-01-27
