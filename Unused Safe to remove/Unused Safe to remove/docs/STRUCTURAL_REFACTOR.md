# Structural Refactoring Plan

## Status: Phase 1 Complete ✅

### What Was Done

1. **Created Domain Structure**

   ```
   admin/domains/
   ├── orders/
   │   ├── index.js                  (Public API)
   │   ├── useOrders.js              (Order CRUD hook)
   │   ├── useExcelOrders.js         (Excel upload with state machine)
   │   ├── orders.service.js         (API layer)
   │   └── order.normalize.js        (Business logic)
   ```

2. **Extracted Core Domain Logic**
   - ✅ Order normalization (`normalizeOrderStatus`, `normalizeOrderDate`, etc.)
   - ✅ Service layer (`orders.service.js`) - pure API calls
   - ✅ `useOrders` hook - clean state management
   - ✅ `useExcelOrders` hook - explicit state machine (replaces ref-based sync)

3. **Replaced Ref-Based Patterns**
   - ✅ State machine for Excel sync (`idle` | `uploading` | `processing` | `success` | `error` | `cancelled`)
   - ✅ No more `useRef` hacks for state escape
   - ✅ Explicit state transitions

## Next Steps (Phase 2)

### Priority 1: Migrate AdminDashboard to Use New Hooks

**Before:**

```javascript
// Old pattern - state + refs everywhere
const [orders, setOrders] = useState([]);
const isSyncingRef = useRef(false);
const loadOrders = async () => {
  /* 50 lines */
};
```

**After:**

```javascript
// New pattern - clean hooks
import { useOrders, useExcelOrders } from "./domains/orders";

const { orders, loading, loadOrders, createOrder, updateOrder, deleteOrder } =
  useOrders();
const { syncState, uploadExcel, cancel } = useExcelOrders({
  onSuccess: () => loadOrders(),
});
```

### Priority 2: Remove Duplicate Business Logic

Replace all instances of:

```javascript
const status = (order.status || order.paymentStatus || "").toLowerCase();
```

With:

```javascript
import { normalizeOrderStatus } from "./domains/orders";
const status = normalizeOrderStatus(order);
```

### Priority 3: Extract Remaining Domains

Following the same pattern:

- `domains/menu/` - Menu management
- `domains/offers/` - Offers management
- `domains/customers/` - Customer aggregation
- `domains/analytics/` - Analytics calculations

### Priority 4: Shrink AdminDashboard

Target: ~300 lines

**AdminDashboard should only:**

- Manage active tab state
- Render tab components
- Show modals (confirm, progress)
- Orchestrate hooks

**AdminDashboard should NOT:**

- Parse Excel files
- Calculate analytics
- Manage order state directly
- Handle API calls
- Business logic transformations

## Migration Guide

### Step-by-Step Migration

1. **Update imports in AdminDashboard.jsx:**

   ```javascript
   // Add new imports
   import {
     useOrders,
     useExcelOrders,
     normalizeOrderStatus,
   } from "./domains/orders";
   ```

2. **Replace order state management:**

   ```javascript
   // Remove these lines (approximately 200+ lines):
   // - const [orders, setOrders] = useState([]);
   // - All loadOrders, createOrder, updateOrder, deleteOrder functions
   // - All refs related to orders

   // Replace with:
   const {
     orders,
     loading,
     loadOrders,
     createOrder,
     updateOrder,
     deleteOrder,
   } = useOrders();
   ```

3. **Replace Excel upload logic:**

   ```javascript
   // Remove all Excel state and refs
   // Replace with:
   const { syncState, progress, message, uploadExcel, cancel } = useExcelOrders(
     {
       onSuccess: (data) => {
         showNotification(`Imported ${data.imported} orders`, "success");
         loadOrders();
       },
       onError: (error) => {
         showNotification(`Upload failed: ${error}`, "error");
       },
     },
   );
   ```

4. **Replace status normalization everywhere:**

   ```javascript
   // Find and replace all instances of:
   // (order.status || order.paymentStatus || '').toLowerCase()
   // With: normalizeOrderStatus(order)
   ```

5. **Update ProgressBar usage:**
   ```javascript
   <ProgressBar
     isVisible={syncState !== "idle"}
     progress={progress}
     message={message}
     subMessage={subMessage}
     onCancel={cancel}
   />
   ```

## Benefits

✅ **Maintainability**: Each domain is self-contained  
✅ **Testability**: Pure functions and isolated hooks  
✅ **Debuggability**: Explicit state, no hidden refs  
✅ **Reusability**: Hooks can be used in other components  
✅ **Scalability**: Easy to add new domains

## Critical Rules Going Forward

1. **NO MORE REFS FOR STATE** - Use proper React state or state machines
2. **NO BUSINESS LOGIC IN COMPONENTS** - Extract to domain utilities
3. **NO API CALLS IN COMPONENTS** - Use service layer
4. **NO DUPLICATE LOGIC** - Create utilities and reuse them
5. **KEEP COMPONENTS SMALL** - If it scrolls for minutes, it's broken

## File Size Targets

- `AdminDashboard.jsx`: **~300 lines** (currently 4000+)
- Domain hooks: **~200 lines each**
- Service files: **~150 lines each**
- Utility files: **~100 lines each**

## Notes

- This refactor maintains backward compatibility during migration
- Old code continues to work while new code is migrated
- No breaking changes to existing functionality
- Progressive migration is safe and recommended
