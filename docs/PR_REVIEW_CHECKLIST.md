# Pull Request Review Checklist

## 🔒 Button System Compliance (MANDATORY)

**Any PR that fails these checks MUST be rejected.**

- [ ] **No new `.btn-*` classes added**
  - Only 5 variants allowed: `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-public`, `btn-special`
  - Size modifiers OK: `btn-small`, `btn-large`, `btn-full`
  - Utility modifiers OK: `btn-icon`, `btn-qty`

- [ ] **All buttons use allowed variants**
  - Check all `className` attributes containing `btn`
  - Verify no deprecated classes (`btn-outline`, `btn-text`, `btn-whatsapp`, etc.)

- [ ] **Custom styles use `.btn-special`**
  - If custom colors needed, use CSS variables
  - No new button classes created

- [ ] **No inline button styles**
  - All styling via CSS classes
  - CSS variables used for customization

- [ ] **Focus states implemented**
  - All buttons have `:focus-visible` styles
  - Uses `outline: 3px solid currentColor`

- [ ] **Hover states match specification**
  - Primary: Green → Orange
  - Secondary: Orange → Green
  - Ghost: Orange border → Green border
  - Special: Maintains border color

---

## Code Quality

- [ ] **Error handling**
  - API calls wrapped in try/catch
  - ErrorBoundary used where appropriate
  - User-friendly error messages

- [ ] **Performance**
  - No unnecessary re-renders
  - Proper use of React hooks
  - Efficient data loading

- [ ] **Accessibility**
  - Proper ARIA labels
  - Keyboard navigation support
  - Focus management

---

## Testing

- [ ] **Manual testing completed**
  - Buttons work in all browsers
  - Hover states function correctly
  - Focus states visible
  - Disabled states work

- [ ] **No console errors**
  - Check browser console
  - No React warnings
  - No linting errors

---

## Documentation

- [ ] **Code comments**
  - Complex logic explained
  - TODO comments for future work
  - Legacy code marked for removal

- [ ] **Documentation updated**
  - If adding features, update relevant docs
  - Migration guides updated if needed

---

## Security

- [ ] **No sensitive data exposed**
  - API keys not hardcoded
  - User data handled securely
  - Authentication checks in place

---

## Rejection Criteria

**REJECT PR IF:**
- ❌ New `.btn-*` class added
- ❌ Deprecated button classes used
- ❌ Inline button styles added
- ❌ Focus states missing
- ❌ Breaking changes without migration plan

**APPROVE PR IF:**
- ✅ All button system checks pass
- ✅ Code quality standards met
- ✅ Tests pass
- ✅ Documentation updated

---

## Quick Reference

**Allowed Button Classes:**
```
.btn
.btn-primary
.btn-secondary
.btn-ghost
.btn-public
.btn-special
.btn-special.whatsapp
.btn-special.danger
.btn-special.admin
.btn-small
.btn-large
.btn-full
.btn-icon
.btn-qty
```

**Forbidden Button Classes:**
```
.btn-outline (use .btn-ghost)
.btn-text (use .btn-ghost)
.btn-whatsapp (use .btn-special.whatsapp)
.btn-danger (use .btn-special.danger)
.btn-add-item (use .btn-primary)
.btn-view-details (use .btn-secondary)
.btn-edit-order (use .btn-secondary)
.btn-delete-order (use .btn-special.danger)
.btn-remove (use .btn-special.danger)
```

---

**Last Updated**: 2025-01-27  
**Status**: 🔒 **ACTIVE**
