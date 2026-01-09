# Component Extraction Plan

## Components to Extract (in order of priority)

### 1. Tab Components (High Priority - Large)

- ✅ DashboardTab.jsx (Done)
- ⏳ OrdersTab.jsx (~520 lines) - Most complex
- ⏳ MenuTab.jsx (~110 lines)
- ⏳ OffersTab.jsx (~90 lines)
- ⏳ SummaryTab.jsx (~230 lines)
- ⏳ CustomersTab.jsx (~500 lines)
- ⏳ UsersTab.jsx (~125 lines)
- ⏳ SettingsTab.jsx (~60 lines)
- ⏳ AnalyticsTab.jsx (~620 lines)
- ⏳ NotificationsTab.jsx (~120 lines)
- ⏳ ExcelViewerTab.jsx (~180 lines)

### 2. Shared Components (Medium Priority)

- ⏳ Sidebar.jsx (~130 lines)
- ⏳ OrderModal.jsx (~200 lines)
- ⏳ Pagination.jsx (~80 lines)

### 3. Utility Components (Low Priority)

- ⏳ StatsCards.jsx (header stats)
- ⏳ OrderTable.jsx (table rendering logic)

## Estimated Impact

- Current: 6,748 lines
- After extraction: ~2,500-3,000 lines (main file)
- Reduction: ~55-60%

## Strategy

1. Extract tab components first (biggest impact)
2. Extract shared components
3. Update main file to import and use components
4. Test each extraction
