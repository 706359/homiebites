# AdminDashboard Refactoring Plan

## Current State
- **File**: `admin/AdminDashboard.jsx`
- **Lines**: ~7105 lines
- **Status**: Monolithic component with all logic and UI in one file

## Refactoring Strategy

### 1. Extract Custom Hooks ✅
- **File**: `admin/hooks/useAdminData.js`
- **Purpose**: Centralize data loading and state management
- **Status**: Created

### 2. Extract Utility Functions ✅
- **File**: `admin/utils/excelUtils.js` - Excel conversion and parsing
- **File**: `admin/utils/orderUtils.js` - Order-related utilities
- **File**: `admin/utils/calculations.js` - Statistics and calculations
- **Status**: Created

### 3. Extract Tab Components (In Progress)
- **File**: `admin/components/DashboardTab.jsx` - Dashboard overview
- **File**: `admin/components/MenuTab.jsx` - Menu management
- **File**: `admin/components/OffersTab.jsx` - Offers management
- **File**: `admin/components/OrdersTab.jsx` - Order management
- **File**: `admin/components/SummaryTab.jsx` - Summary reports
- **File**: `admin/components/CustomersTab.jsx` - Customer management
- **File**: `admin/components/UsersTab.jsx` - User management
- **File**: `admin/components/SettingsTab.jsx` - Settings
- **File**: `admin/components/AnalyticsTab.jsx` - Analytics & Reports
- **File**: `admin/components/NotificationsTab.jsx` - Notifications
- **File**: `admin/components/ExcelViewerTab.jsx` - Excel file viewer

### 4. Extract Shared Components
- **File**: `admin/components/Sidebar.jsx` - Sidebar navigation
- **File**: `admin/components/OrderModal.jsx` - Add/Edit order modal
- **File**: `admin/components/Pagination.jsx` - Reusable pagination component

### 5. Update Main File
- Keep `AdminDashboard.jsx` as orchestrator
- Import and use extracted components
- Maintain state management and routing logic

## Benefits
- **Maintainability**: Easier to find and modify specific features
- **Testability**: Components can be tested independently
- **Performance**: Better code splitting opportunities
- **Collaboration**: Multiple developers can work on different tabs
- **Readability**: Smaller, focused files are easier to understand
