(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dateUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const AllOrdersDataTab = ({ orders = [], settings: _settings, excelFileName: _excelFileName, allOrdersFilterMonth, setAllOrdersFilterMonth, allOrdersFilterAddress, setAllOrdersFilterAddress, allOrdersFilterPaymentStatus, setAllOrdersFilterPaymentStatus, onLoadExcelFile, onClearExcelData: _onClearExcelData, onClearAllData, onEditOrder, onDeleteOrder, onUpdateOrderStatus, showNotification, loading = false, currentPage = 1, recordsPerPage = 25, onPageChange, onRecordsPerPageChange, loadOrders, showConfirmation, initialDateFilter = null })=>{
    _s();
    // State for filters panel - collapsed by default
    const [filtersExpanded, setFiltersExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dateRangeFrom, setDateRangeFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialDateFilter || '');
    const [dateRangeTo, setDateRangeTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialDateFilter || '');
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterMode, setFilterMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterPayment, setFilterPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterYear, setFilterYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterAddress, setFilterAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Update date filters when initialDateFilter prop changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AllOrdersDataTab.useEffect": ()=>{
            if (initialDateFilter) {
                setDateRangeFrom(initialDateFilter);
                setDateRangeTo(initialDateFilter);
            // Keep collapsed by default - user can expand if needed
            // Clear the filter after a short delay to allow parent to reset it
            // This prevents the filter from persisting when switching tabs
            }
        }
    }["AllOrdersDataTab.useEffect"], [
        initialDateFilter
    ]);
    // Selection state
    const [selectedRows, setSelectedRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [selectAll, setSelectAll] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sortColumn, setSortColumn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('orderId');
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('desc');
    const filteredOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllOrdersDataTab.useMemo[filteredOrders]": ()=>{
            let filtered = [
                ...orders
            ];
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter({
                    "AllOrdersDataTab.useMemo[filteredOrders]": (order)=>{
                        const address = (order.deliveryAddress || order.customerAddress || order.address || '').toLowerCase();
                        const orderId = (order.orderId || '').toLowerCase();
                        return address.includes(query) || orderId.includes(query);
                    }
                }["AllOrdersDataTab.useMemo[filteredOrders]"]);
            }
            // Month filter
            if (allOrdersFilterMonth) {
                // Parse the filter value (e.g., "Jan'24" or "January'24")
                const monthNames = [
                    'jan',
                    'feb',
                    'mar',
                    'apr',
                    'may',
                    'jun',
                    'jul',
                    'aug',
                    'sep',
                    'oct',
                    'nov',
                    'dec'
                ];
                const monthNamesFull = [
                    'january',
                    'february',
                    'march',
                    'april',
                    'may',
                    'june',
                    'july',
                    'august',
                    'september',
                    'october',
                    'november',
                    'december'
                ];
                const filterMatch = allOrdersFilterMonth.match(/^([A-Za-z]+)'(\d{2})$/i);
                if (filterMatch) {
                    const filterMonthName = filterMatch[1].toLowerCase();
                    const filterYearStr = filterMatch[2];
                    const filterYear = parseInt(filterYearStr) < 50 ? 2000 + parseInt(filterYearStr) : 1900 + parseInt(filterYearStr);
                    let filterMonthIndex = monthNames.findIndex({
                        "AllOrdersDataTab.useMemo[filteredOrders].filterMonthIndex": (m)=>filterMonthName.startsWith(m)
                    }["AllOrdersDataTab.useMemo[filteredOrders].filterMonthIndex"]);
                    if (filterMonthIndex === -1) {
                        filterMonthIndex = monthNamesFull.findIndex({
                            "AllOrdersDataTab.useMemo[filteredOrders]": (m)=>filterMonthName.startsWith(m)
                        }["AllOrdersDataTab.useMemo[filteredOrders]"]);
                    }
                    if (filterMonthIndex !== -1) {
                        const filterMonth = filterMonthIndex + 1; // Convert to 1-12
                        filtered = filtered.filter({
                            "AllOrdersDataTab.useMemo[filteredOrders]": (order)=>{
                                // Use billingMonth from order if available, otherwise extract from date
                                let month, year;
                                if (order.billingMonth && order.billingYear) {
                                    month = parseInt(order.billingMonth);
                                    year = parseInt(order.billingYear);
                                } else {
                                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                                    if (!orderDate) return false;
                                    month = orderDate.getUTCMonth() + 1;
                                    year = orderDate.getUTCFullYear();
                                }
                                return month === filterMonth && year === filterYear;
                            }
                        }["AllOrdersDataTab.useMemo[filteredOrders]"]);
                    }
                }
            }
            // Address filter
            if (allOrdersFilterAddress && allOrdersFilterAddress.trim()) {
                filtered = filtered.filter({
                    "AllOrdersDataTab.useMemo[filteredOrders]": (order)=>{
                        const address = (order.deliveryAddress || order.customerAddress || order.address || '').toLowerCase();
                        return address.includes(allOrdersFilterAddress.toLowerCase());
                    }
                }["AllOrdersDataTab.useMemo[filteredOrders]"]);
            }
            // Payment status filter - check both status and paymentStatus fields
            if (allOrdersFilterPaymentStatus) {
                const statusFilter = allOrdersFilterPaymentStatus.toLowerCase();
                if (statusFilter === 'paid') {
                    filtered = filtered.filter({
                        "AllOrdersDataTab.useMemo[filteredOrders]": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(o.status, o.paymentStatus)
                    }["AllOrdersDataTab.useMemo[filteredOrders]"]);
                } else if (statusFilter === 'pending' || statusFilter === 'unpaid') {
                    filtered = filtered.filter({
                        "AllOrdersDataTab.useMemo[filteredOrders]": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status, o.paymentStatus)
                    }["AllOrdersDataTab.useMemo[filteredOrders]"]);
                }
            }
            // Additional filters - check both status and paymentStatus fields
            if (filterStatus) {
                filtered = filtered.filter({
                    "AllOrdersDataTab.useMemo[filteredOrders]": (o)=>{
                        const status = (o.status || '').toLowerCase().trim();
                        const filterValue = filterStatus.toLowerCase().trim();
                        // Use helper functions for paid/pending/unpaid for better matching
                        // Pass both status and paymentStatus for accurate filtering
                        if (filterValue === 'paid') {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(o.status, o.paymentStatus);
                        } else if (filterValue === 'pending' || filterValue === 'unpaid') {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status, o.paymentStatus);
                        } else {
                            // For other statuses, do exact match (case-insensitive)
                            return status === filterValue;
                        }
                    }
                }["AllOrdersDataTab.useMemo[filteredOrders]"]);
            }
            if (filterMode) {
                filtered = filtered.filter({
                    "AllOrdersDataTab.useMemo[filteredOrders]": (o)=>{
                        const mode = (o.mode || '').toLowerCase();
                        return mode === filterMode.toLowerCase();
                    }
                }["AllOrdersDataTab.useMemo[filteredOrders]"]);
            }
            if (filterPayment) {
                filtered = filtered.filter({
                    "AllOrdersDataTab.useMemo[filteredOrders]": (o)=>{
                        const payment = (o.paymentMode || '').toLowerCase();
                        return payment === filterPayment.toLowerCase();
                    }
                }["AllOrdersDataTab.useMemo[filteredOrders]"]);
            }
            if (filterYear) {
                filtered = filtered.filter({
                    "AllOrdersDataTab.useMemo[filteredOrders]": (order)=>{
                        // Use billingYear from order if available, otherwise extract from date
                        let year;
                        if (order.billingYear) {
                            year = parseInt(order.billingYear);
                        } else {
                            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                            if (orderDate) {
                                year = orderDate.getUTCFullYear(); // Use UTC for consistency with month filter
                            }
                        }
                        return year && year.toString() === filterYear;
                    }
                }["AllOrdersDataTab.useMemo[filteredOrders]"]);
            }
            if (filterAddress.trim()) {
                filtered = filtered.filter({
                    "AllOrdersDataTab.useMemo[filteredOrders]": (order)=>{
                        const address = (order.deliveryAddress || order.customerAddress || order.address || '').toLowerCase();
                        return address.includes(filterAddress.toLowerCase());
                    }
                }["AllOrdersDataTab.useMemo[filteredOrders]"]);
            }
            // Date range filter
            if (dateRangeFrom) {
                const fromDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(dateRangeFrom);
                if (fromDate) {
                    filtered = filtered.filter({
                        "AllOrdersDataTab.useMemo[filteredOrders]": (order)=>{
                            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                            return orderDate && orderDate >= fromDate;
                        }
                    }["AllOrdersDataTab.useMemo[filteredOrders]"]);
                }
            }
            if (dateRangeTo) {
                const toDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(dateRangeTo);
                if (toDate) {
                    toDate.setHours(23, 59, 59, 999); // End of day
                    filtered = filtered.filter({
                        "AllOrdersDataTab.useMemo[filteredOrders]": (order)=>{
                            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                            return orderDate && orderDate <= toDate;
                        }
                    }["AllOrdersDataTab.useMemo[filteredOrders]"]);
                }
            }
            if (!sortColumn || sortColumn === 'orderId') {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortOrdersByOrderId"])(filtered);
            }
            filtered.sort({
                "AllOrdersDataTab.useMemo[filteredOrders]": (a, b)=>{
                    let aVal, bVal;
                    switch(sortColumn){
                        case 'date':
                            {
                                aVal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(a.date || a.order_date || null);
                                bVal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(b.date || b.order_date || null);
                                aVal = aVal ? aVal.getTime() : 0;
                                bVal = bVal ? bVal.getTime() : 0;
                                break;
                            }
                        case 'orderId':
                            {
                                const seqA = extractOrderIdSequence(a.orderId);
                                const seqB = extractOrderIdSequence(b.orderId);
                                aVal = seqA;
                                bVal = seqB;
                                break;
                            }
                        case 'address':
                            aVal = (a.deliveryAddress || a.customerAddress || a.address || '').toLowerCase();
                            bVal = (b.deliveryAddress || b.customerAddress || b.address || '').toLowerCase();
                            break;
                        case 'quantity':
                            aVal = parseInt(a.quantity || 1);
                            bVal = parseInt(b.quantity || 1);
                            break;
                        case 'total':
                            {
                                let aTotal = null;
                                if (a.totalAmount !== undefined && a.totalAmount !== null) {
                                    aTotal = parseFloat(a.totalAmount);
                                } else if (a.total !== undefined && a.total !== null) {
                                    aTotal = parseFloat(a.total);
                                }
                                if (aTotal === null || isNaN(aTotal)) {
                                    aTotal = parseFloat(a.quantity || 1) * parseFloat(a.unitPrice || 0);
                                }
                                let bTotal = null;
                                if (b.totalAmount !== undefined && b.totalAmount !== null) {
                                    bTotal = parseFloat(b.totalAmount);
                                } else if (b.total !== undefined && b.total !== null) {
                                    bTotal = parseFloat(b.total);
                                }
                                if (bTotal === null || isNaN(bTotal)) {
                                    bTotal = parseFloat(b.quantity || 1) * parseFloat(b.unitPrice || 0);
                                }
                                aVal = isNaN(aTotal) ? 0 : aTotal;
                                bVal = isNaN(bTotal) ? 0 : bTotal;
                                break;
                            }
                        case 'mode':
                            aVal = (a.mode || '').toLowerCase();
                            bVal = (b.mode || '').toLowerCase();
                            break;
                        case 'status':
                            aVal = (a.status || '').toLowerCase();
                            bVal = (b.status || '').toLowerCase();
                            break;
                        case 'payment':
                            aVal = (a.paymentMode || '').toLowerCase();
                            bVal = (b.paymentMode || '').toLowerCase();
                            break;
                        default:
                            {
                                const seqA = extractOrderIdSequence(a.orderId);
                                const seqB = extractOrderIdSequence(b.orderId);
                                aVal = seqA;
                                bVal = seqB;
                                break;
                            }
                    }
                    if (aVal < bVal) {
                        return sortDirection === 'asc' ? -1 : 1;
                    }
                    if (aVal > bVal) {
                        return sortDirection === 'asc' ? 1 : -1;
                    }
                    const seqA = extractOrderIdSequence(a.orderId);
                    const seqB = extractOrderIdSequence(b.orderId);
                    if (seqA > 0 && seqB > 0) {
                        return seqB - seqA;
                    }
                    const idA = (a.orderId || '').toString();
                    const idB = (b.orderId || '').toString();
                    if (idA && idB) {
                        return idB.localeCompare(idA);
                    }
                    return 0;
                }
            }["AllOrdersDataTab.useMemo[filteredOrders]"]);
            return filtered;
        }
    }["AllOrdersDataTab.useMemo[filteredOrders]"], [
        orders,
        searchQuery,
        allOrdersFilterMonth,
        allOrdersFilterAddress,
        allOrdersFilterPaymentStatus,
        filterStatus,
        filterMode,
        filterPayment,
        filterYear,
        filterAddress,
        dateRangeFrom,
        dateRangeTo,
        sortColumn,
        sortDirection
    ]);
    const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + recordsPerPage);
    const activeFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllOrdersDataTab.useMemo[activeFilters]": ()=>{
            const filters = [];
            if (allOrdersFilterPaymentStatus) {
                const displayLabel = allOrdersFilterPaymentStatus.charAt(0).toUpperCase() + allOrdersFilterPaymentStatus.slice(1);
                filters.push({
                    key: 'paymentStatus',
                    label: `Payment Status: ${displayLabel}`,
                    value: allOrdersFilterPaymentStatus
                });
            }
            if (filterStatus) {
                filters.push({
                    key: 'status',
                    label: `Status: ${filterStatus}`,
                    value: filterStatus
                });
            }
            if (filterMode) filters.push({
                key: 'mode',
                label: `Mode: ${filterMode}`,
                value: filterMode
            });
            if (allOrdersFilterMonth) filters.push({
                key: 'month',
                label: `Date: ${allOrdersFilterMonth}`,
                value: allOrdersFilterMonth
            });
            if (filterYear) filters.push({
                key: 'year',
                label: `Year: ${filterYear}`,
                value: filterYear
            });
            if (dateRangeFrom || dateRangeTo) {
                const range = `${dateRangeFrom || 'Start'} - ${dateRangeTo || 'End'}`;
                filters.push({
                    key: 'daterange',
                    label: `Date Range: ${range}`,
                    value: {
                        from: dateRangeFrom,
                        to: dateRangeTo
                    }
                });
            }
            return filters;
        }
    }["AllOrdersDataTab.useMemo[activeFilters]"], [
        allOrdersFilterPaymentStatus,
        filterStatus,
        filterMode,
        allOrdersFilterMonth,
        filterYear,
        dateRangeFrom,
        dateRangeTo
    ]);
    const handleSort = (column)=>{
        if (!column) return; // Ignore clicks on non-sortable columns
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection(column === 'orderId' ? 'desc' : column === 'date' ? 'desc' : 'asc');
        }
    };
    const handleSelectAll = (checked)=>{
        setSelectAll(checked);
        if (checked) {
            setSelectedRows(new Set(paginatedOrders.map((_, idx)=>startIndex + idx)));
        } else {
            setSelectedRows(new Set());
        }
    };
    // Handle row select
    const handleRowSelect = (index, checked)=>{
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(startIndex + index);
        } else {
            newSelected.delete(startIndex + index);
        }
        setSelectedRows(newSelected);
        setSelectAll(newSelected.size === paginatedOrders.length);
    };
    // Clear all filters
    const clearAllFilters = ()=>{
        setFilterStatus('');
        setFilterMode('');
        setFilterPayment('');
        setFilterYear('');
        setFilterAddress('');
        setDateRangeFrom('');
        setDateRangeTo('');
        setAllOrdersFilterMonth('');
        setAllOrdersFilterAddress('');
        setAllOrdersFilterPaymentStatus('');
        if (setAllOrdersFilterMonth) setAllOrdersFilterMonth('');
        if (setAllOrdersFilterAddress) setAllOrdersFilterAddress('');
        if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus('');
    };
    // Remove active filter
    const removeFilter = (filter)=>{
        switch(filter.key){
            case 'paymentStatus':
                setAllOrdersFilterPaymentStatus('');
                if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus('');
                break;
            case 'status':
                setFilterStatus('');
                break;
            case 'mode':
                setFilterMode('');
                break;
            case 'month':
                {
                    setAllOrdersFilterMonth('');
                    if (setAllOrdersFilterMonth) setAllOrdersFilterMonth('');
                    break;
                }
            case 'year':
                {
                    setFilterYear('');
                    break;
                }
            case 'daterange':
                setDateRangeFrom('');
                setDateRangeTo('');
                break;
            default:
                break;
        }
    };
    // Bulk actions with confirmation
    const handleBulkAction = async (action)=>{
        const selectedOrderIds = Array.from(selectedRows).map((idx)=>filteredOrders[idx]._id || filteredOrders[idx].orderId);
        if (selectedOrderIds.length === 0) return;
        const count = selectedOrderIds.length;
        const selectedOrders = Array.from(selectedRows).map((idx)=>filteredOrders[idx]);
        if (action === 'delete') {
            if (showConfirmation) {
                showConfirmation({
                    title: 'Delete Selected Orders',
                    message: `Are you sure you want to delete ${count} selected order${count > 1 ? 's' : ''}? This action cannot be undone.`,
                    type: 'danger',
                    confirmText: 'Delete',
                    onConfirm: async ()=>{
                        try {
                            for (const id of selectedOrderIds){
                                if (onDeleteOrder) await onDeleteOrder(id);
                            }
                            setSelectedRows(new Set());
                            setSelectAll(false);
                            if (showNotification) showNotification('Selected orders deleted successfully', 'success');
                            if (loadOrders) loadOrders();
                        } catch (error) {
                            console.error('Error deleting orders:', error);
                            if (showNotification) showNotification('Error deleting orders', 'error');
                        }
                    }
                });
            }
        } else if (action === 'paid' || action === 'pending') {
            // Normalize status for bulk operations - use 'Unpaid' for pending (consistent with UI dropdowns)
            const normalizedStatus = action === 'paid' ? 'Paid' : 'Unpaid';
            const statusLabel = action === 'paid' ? 'Paid' : 'Unpaid';
            if (showConfirmation) {
                showConfirmation({
                    title: `Mark as ${statusLabel}`,
                    message: `Are you sure you want to mark ${count} selected order${count > 1 ? 's' : ''} as ${statusLabel.toLowerCase()}?`,
                    type: 'info',
                    confirmText: `Mark as ${statusLabel}`,
                    onConfirm: async ()=>{
                        try {
                            // Update all selected orders with normalized status
                            // Skip confirmation for bulk operations (already confirmed above)
                            for (const id of selectedOrderIds){
                                if (onUpdateOrderStatus) {
                                    await onUpdateOrderStatus(id, normalizedStatus, true);
                                }
                            }
                            setSelectedRows(new Set());
                            setSelectAll(false);
                            if (showNotification) showNotification(`Selected orders marked as ${statusLabel.toLowerCase()}`, 'success');
                            // Refresh to ensure filters work correctly with updated data
                            if (loadOrders) {
                                setTimeout(()=>{
                                    loadOrders();
                                }, 300);
                            }
                        } catch (error) {
                            console.error('Error updating order status:', error);
                            if (showNotification) showNotification('Error updating order status', 'error');
                            // Refresh on error to get accurate state
                            if (loadOrders) loadOrders();
                        }
                    }
                });
            }
        } else if (action === 'export') {
            // Export doesn't need confirmation, just do it
            const csvContent = 'Date,Address,Quantity,Amount,Mode,Status\n' + selectedOrders.map((o)=>{
                // Never use createdAt (today's date) as fallback - only use actual order date
                const date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                return `"${date ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(date) : ''}","${o.deliveryAddress || o.customerAddress || o.address || 'N/A'}","${o.quantity || 1}","${o.total || o.totalAmount || 0}","${o.mode || 'N/A'}","${o.status || 'N/A'}"`;
            }).join('\n');
            const blob = new Blob([
                csvContent
            ], {
                type: 'text/csv;charset=utf-8;'
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `selected_orders_export_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            if (showNotification) showNotification('Selected orders exported successfully', 'success');
        }
    };
    // Get unique values for filters
    const uniqueStatuses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllOrdersDataTab.useMemo[uniqueStatuses]": ()=>{
            const statuses = new Set();
            orders.forEach({
                "AllOrdersDataTab.useMemo[uniqueStatuses]": (o)=>{
                    if (o.status) statuses.add(o.status);
                }
            }["AllOrdersDataTab.useMemo[uniqueStatuses]"]);
            return Array.from(statuses).sort();
        }
    }["AllOrdersDataTab.useMemo[uniqueStatuses]"], [
        orders
    ]);
    const uniqueModes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllOrdersDataTab.useMemo[uniqueModes]": ()=>{
            const modes = new Set();
            orders.forEach({
                "AllOrdersDataTab.useMemo[uniqueModes]": (o)=>{
                    if (o.mode) modes.add(o.mode);
                }
            }["AllOrdersDataTab.useMemo[uniqueModes]"]);
            return Array.from(modes).sort();
        }
    }["AllOrdersDataTab.useMemo[uniqueModes]"], [
        orders
    ]);
    const uniquePaymentModes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllOrdersDataTab.useMemo[uniquePaymentModes]": ()=>{
            const paymentModes = new Set();
            orders.forEach({
                "AllOrdersDataTab.useMemo[uniquePaymentModes]": (o)=>{
                    if (o.paymentMode) paymentModes.add(o.paymentMode);
                }
            }["AllOrdersDataTab.useMemo[uniquePaymentModes]"]);
            return Array.from(paymentModes).sort();
        }
    }["AllOrdersDataTab.useMemo[uniquePaymentModes]"], [
        orders
    ]);
    const uniqueYears = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllOrdersDataTab.useMemo[uniqueYears]": ()=>{
            const years = new Set();
            orders.forEach({
                "AllOrdersDataTab.useMemo[uniqueYears]": (o)=>{
                    // Use billingYear from order if available, otherwise extract from date
                    let year;
                    if (o.billingYear) {
                        year = parseInt(o.billingYear);
                    } else {
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.createdAt || o.date || o.order_date);
                        if (orderDate) {
                            year = orderDate.getFullYear();
                        }
                    }
                    if (year) years.add(year.toString());
                }
            }["AllOrdersDataTab.useMemo[uniqueYears]"]);
            return Array.from(years).sort().reverse();
        }
    }["AllOrdersDataTab.useMemo[uniqueYears]"], [
        orders
    ]);
    // Export all filtered
    const handleExport = ()=>{
        const csvContent = 'S.No,Date,Address,Quantity,Price,Total,Mode,Status,Payment,Month,Year,OrderID\n' + filteredOrders.map((o, idx)=>{
            const date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.createdAt || o.date || o.order_date);
            // Use billingMonth/billingYear from order if available, otherwise extract from date
            let month, year;
            if (o.billingMonth && o.billingYear) {
                month = parseInt(o.billingMonth);
                year = parseInt(o.billingYear);
            } else if (date) {
                month = date.getUTCMonth() + 1;
                year = date.getUTCFullYear();
            } else {
                month = null;
                year = null;
            }
            return `${idx + 1},"${date ? date.toLocaleDateString() : ''}","${o.deliveryAddress || o.customerAddress || o.address || 'N/A'}","${o.quantity || 1}","${o.unitPrice || 0}","${o.total || o.totalAmount || 0}","${o.mode || 'N/A'}","${o.status || 'N/A'}","${o.paymentMode || 'N/A'}","${month ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBillingMonth"])(month, year) : 'N/A'}","${year || 'N/A'}","${o.orderId || 'N/A'}"`;
        }).join('\n');
        const blob = new Blob([
            csvContent
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `all_orders_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        if (showNotification) showNotification('Orders exported successfully', 'success');
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "dashboard-header",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "All Orders Data"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                        lineNumber: 668,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                    lineNumber: 667,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    message: "Loading orders...",
                    size: "large"
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                    lineNumber: 670,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
            lineNumber: 666,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "action-bar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "search-input-wrapper",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-search search-input-icon"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 680,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                className: "input-field search-input-with-icon",
                                placeholder: "Search orders...",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 681,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                        lineNumber: 679,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "action-buttons-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-secondary btn-small",
                                onClick: onLoadExcelFile,
                                title: "Upload CSV",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-upload"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 695,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Upload CSV"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 690,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-primary btn-small",
                                onClick: ()=>onEditOrder && onEditOrder(null),
                                title: "Add Order",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-plus"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 702,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Add Order"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 697,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-special danger btn-small",
                                onClick: async ()=>{
                                    if (showConfirmation && onClearAllData) {
                                        showConfirmation({
                                            title: 'Delete All Orders',
                                            message: 'Are you sure you want to delete ALL orders? This action cannot be undone and will permanently delete all order data.',
                                            type: 'danger',
                                            confirmText: 'Delete All',
                                            onConfirm: async ()=>{
                                                // Pass skipConfirmation=true since we already showed confirmation
                                                await onClearAllData(true);
                                            }
                                        });
                                    } else if (onClearAllData) {
                                        // Direct clear without confirmation
                                        await onClearAllData(true);
                                    }
                                },
                                title: "Delete All",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-trash"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 726,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Delete All"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 704,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-secondary btn-small",
                                onClick: handleExport,
                                title: "Export",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-download"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 729,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 728,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                        lineNumber: 689,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                lineNumber: 678,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card filter-bar-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-bar-container",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-bar-quick-filters",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "input-field filter-select tooltip-wrapper",
                                        value: allOrdersFilterPaymentStatus,
                                        onChange: (e)=>{
                                            setAllOrdersFilterPaymentStatus(e.target.value);
                                            if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus(e.target.value);
                                            // Clear the specific status filter when using payment status filter
                                            if (e.target.value) {
                                                setFilterStatus('');
                                            }
                                        },
                                        title: "Filter by Payment Status",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "tooltip",
                                                children: "Filter by Payment Status"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 754,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "All Payment Status"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 755,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "paid",
                                                children: "Paid"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 756,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "unpaid",
                                                children: "Unpaid"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 757,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "pending",
                                                children: "Pending"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 758,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 740,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "input-field filter-select tooltip-wrapper",
                                        value: filterStatus,
                                        onChange: (e)=>{
                                            setFilterStatus(e.target.value);
                                            // Clear payment status filter when using specific status filter
                                            if (e.target.value) {
                                                setAllOrdersFilterPaymentStatus('');
                                                if (setAllOrdersFilterPaymentStatus) setAllOrdersFilterPaymentStatus('');
                                            }
                                        },
                                        title: "Filter by Exact Status",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "tooltip",
                                                children: "Filter by Exact Status"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 774,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "All Status"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 775,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            uniqueStatuses.map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: status,
                                                    children: status
                                                }, status, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 777,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 761,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "input-field filter-select",
                                        value: filterMode,
                                        onChange: (e)=>setFilterMode(e.target.value),
                                        title: "Filter by Mode",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "All Modes"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 789,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            uniqueModes.map((mode)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: mode,
                                                    children: mode
                                                }, mode, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 791,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 783,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "input-field filter-select",
                                        value: filterPayment,
                                        onChange: (e)=>setFilterPayment(e.target.value),
                                        title: "Filter by Payment Mode",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "All Payment Modes"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 803,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            uniquePaymentModes.map((pm)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: pm,
                                                    children: pm
                                                }, pm, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 805,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 797,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 738,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            selectedRows.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bulk-actions-bar-inline",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bulk-actions-label",
                                        children: [
                                            selectedRows.size,
                                            " selected"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 814,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "action-buttons-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-success btn-small",
                                                onClick: ()=>handleBulkAction('paid'),
                                                children: "Mark as Paid"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 816,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-secondary btn-small",
                                                onClick: ()=>handleBulkAction('pending'),
                                                children: "Mark as Pending"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 822,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-special danger btn-small",
                                                onClick: ()=>handleBulkAction('delete'),
                                                children: "Delete Selected"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 828,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-secondary btn-small",
                                                onClick: ()=>handleBulkAction('export'),
                                                children: "Export Selected"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 834,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 815,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 813,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            (allOrdersFilterPaymentStatus || filterStatus || filterMode || filterPayment || filterAddress || dateRangeFrom || dateRangeTo || allOrdersFilterMonth || filterYear) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-ghost btn-small filter-clear-btn",
                                onClick: clearAllFilters,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-xmark filter-clear-icon"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 854,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Clear"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 853,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                        lineNumber: 736,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "advanced-filters-container accordion",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "accordion-item",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `accordion-header ${filtersExpanded ? 'active' : ''}`,
                                    onClick: ()=>setFiltersExpanded(!filtersExpanded),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Advanced Filters"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 867,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: `fa-solid fa-chevron-${filtersExpanded ? 'up' : 'down'} accordion-icon`
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 868,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                    lineNumber: 863,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `accordion-body ${filtersExpanded ? 'show' : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "filter-field-group date-range",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "filter-label",
                                                    children: "Date Range"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 874,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "filter-input-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            className: "input-field filter-input",
                                                            value: dateRangeFrom,
                                                            onChange: (e)=>setDateRangeFrom(e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 876,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            className: "input-field filter-input",
                                                            value: dateRangeTo,
                                                            onChange: (e)=>setDateRangeTo(e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 882,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 875,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 873,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "filter-field-group month",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "filter-label",
                                                    children: "Month"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 892,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "input-field filter-input",
                                                    value: allOrdersFilterMonth || '',
                                                    onChange: (e)=>{
                                                        setAllOrdersFilterMonth(e.target.value);
                                                        if (setAllOrdersFilterMonth) setAllOrdersFilterMonth(e.target.value);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Months"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 901,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        uniqueYears.flatMap((year)=>{
                                                            const yearStr = String(year).slice(-2);
                                                            const monthNames = [
                                                                'Jan',
                                                                'Feb',
                                                                'Mar',
                                                                'Apr',
                                                                'May',
                                                                'Jun',
                                                                'Jul',
                                                                'Aug',
                                                                'Sep',
                                                                'Oct',
                                                                'Nov',
                                                                'Dec'
                                                            ];
                                                            return monthNames.map((month)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: `${month}'${yearStr}`,
                                                                    children: [
                                                                        month,
                                                                        "'",
                                                                        yearStr
                                                                    ]
                                                                }, `${month}'${yearStr}`, true, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                    lineNumber: 919,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)));
                                                        })
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 893,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 891,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "filter-field-group year",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "filter-label",
                                                    children: "Year"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 928,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    className: "input-field filter-input",
                                                    value: filterYear || '',
                                                    onChange: (e)=>setFilterYear(e.target.value),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Years"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 934,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        uniqueYears.map((year)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: year,
                                                                children: year
                                                            }, year, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                lineNumber: 936,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 929,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 927,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "filter-field-group address",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "filter-label",
                                                    children: "Address Search"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 944,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    className: "input-field filter-input",
                                                    value: filterAddress || '',
                                                    onChange: (e)=>setFilterAddress(e.target.value),
                                                    placeholder: "Search by address..."
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 945,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 943,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                    lineNumber: 872,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                            lineNumber: 862,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                        lineNumber: 861,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeFilters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "active-filters-container",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "active-filters-label",
                                children: "Applied:"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 960,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            activeFilters.map((filter, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "badge badge-info active-filter-badge",
                                    onClick: ()=>removeFilter(filter),
                                    children: [
                                        filter.label,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-times"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 968,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, idx, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                    lineNumber: 962,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                        lineNumber: 959,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-card table-container-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "table-header-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "select-all-container",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: selectAll,
                                                    onChange: (e)=>handleSelectAll(e.target.checked)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 979,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "select-all-label",
                                                    children: "Select All"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 984,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 978,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 977,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "table-info-text",
                                        children: [
                                            "Showing ",
                                            startIndex + 1,
                                            "-",
                                            Math.min(startIndex + recordsPerPage, filteredOrders.length),
                                            " of",
                                            ' ',
                                            filteredOrders.length,
                                            " orders"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 988,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 976,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "orders-table-container table-wrapper",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "orders-table table-full-width",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "table-checkbox-header",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: selectAll,
                                                            onChange: (e)=>handleSelectAll(e.target.checked)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1000,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 999,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort(null),
                                                        children: [
                                                            "S.No ",
                                                            sortColumn === null && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1006,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort('date'),
                                                        children: [
                                                            "Date ",
                                                            sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1009,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort('address'),
                                                        children: [
                                                            "Address ",
                                                            sortColumn === 'address' && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1012,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort('quantity'),
                                                        children: [
                                                            "Qty ",
                                                            sortColumn === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1015,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort(null),
                                                        children: "Price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1018,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort('total'),
                                                        children: [
                                                            "Total ",
                                                            sortColumn === 'total' && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1021,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort('mode'),
                                                        children: [
                                                            "Mode ",
                                                            sortColumn === 'mode' && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1024,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort('status'),
                                                        children: [
                                                            "Status ",
                                                            sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1027,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort('payment'),
                                                        children: [
                                                            "Payment ",
                                                            sortColumn === 'payment' && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1030,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort(null),
                                                        children: "Month"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1033,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort(null),
                                                        children: "Year"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1036,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "sortable-header",
                                                        onClick: ()=>handleSort('orderId'),
                                                        children: [
                                                            "OrderID ",
                                                            sortColumn === 'orderId' && (sortDirection === 'asc' ? '↑' : '↓')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1039,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Actions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1042,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 998,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 997,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: paginatedOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 14,
                                                    className: "empty-state-cell",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "empty-state",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-inbox empty-state-icon"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                lineNumber: 1050,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "No orders found"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                lineNumber: 1051,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "empty-state-text",
                                                                children: "Try adjusting your filters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                lineNumber: 1052,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1049,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 1048,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 1047,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)) : paginatedOrders.map((order, idx)=>{
                                                // Never use createdAt (today's date) as fallback - only use actual order date
                                                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                                                const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(orderDate);
                                                // Use billingMonth/billingYear from order if available, otherwise extract from date
                                                let month, year;
                                                if (order.billingMonth && order.billingYear) {
                                                    month = parseInt(order.billingMonth);
                                                    year = parseInt(order.billingYear);
                                                } else if (orderDate) {
                                                    // Use UTC methods to match how dates are stored in MongoDB
                                                    month = orderDate.getUTCMonth() + 1;
                                                    year = orderDate.getUTCFullYear();
                                                } else {
                                                    month = null;
                                                    year = null;
                                                }
                                                const isSelected = selectedRows.has(startIndex + idx);
                                                const isPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(order.status, order.paymentStatus);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: `table-row-clickable ${isSelected ? 'table-row-selected' : ''}`,
                                                    onDoubleClick: ()=>onEditOrder && onEditOrder(order),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: isSelected,
                                                                onChange: (e)=>handleRowSelect(idx, e.target.checked),
                                                                onClick: (e)=>e.stopPropagation()
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                lineNumber: 1084,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1083,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: startIndex + idx + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1091,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: dateStr
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1092,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: order.deliveryAddress || order.customerAddress || order.address || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1093,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: order.quantity || 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1096,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                "₹",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.unitPrice || 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1097,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                "₹",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total || order.totalAmount || (order.quantity || 1) * (order.unitPrice || 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1098,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: order.mode || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1106,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: (()=>{
                                                                // Normalize status to 'Paid' or 'Unpaid' for the dropdown
                                                                const normalizedStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(order.status, order.paymentStatus) ? 'Paid' : 'Unpaid';
                                                                const currentStatus = order.status || 'Unpaid';
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    className: `status-dropdown ${isPaid ? 'status-paid' : 'status-unpaid'}`,
                                                                    value: normalizedStatus,
                                                                    onChange: (e)=>{
                                                                        e.stopPropagation();
                                                                        const newStatus = e.target.value;
                                                                        if (newStatus === normalizedStatus) return;
                                                                        // Store the select element to reset if cancelled
                                                                        const selectElement = e.target;
                                                                        if (showConfirmation && onUpdateOrderStatus) {
                                                                            showConfirmation({
                                                                                title: 'Update Order Status',
                                                                                message: `Are you sure you want to change the status of Order ${order.orderId || order._id} from "${normalizedStatus}" to "${newStatus}"?`,
                                                                                type: 'info',
                                                                                confirmText: 'Update Status',
                                                                                onConfirm: ()=>{
                                                                                    // Pass skipConfirmation=true since we already showed confirmation
                                                                                    onUpdateOrderStatus(order._id || order.orderId, newStatus, true);
                                                                                },
                                                                                onCancelCallback: ()=>{
                                                                                    // Reset select to current value if cancelled
                                                                                    selectElement.value = normalizedStatus;
                                                                                }
                                                                            });
                                                                        } else if (onUpdateOrderStatus) {
                                                                            // Direct update without confirmation
                                                                            onUpdateOrderStatus(order._id || order.orderId, newStatus, true);
                                                                        } else {
                                                                            // Reset if no handler
                                                                            selectElement.value = normalizedStatus;
                                                                        }
                                                                    },
                                                                    onClick: (e)=>e.stopPropagation(),
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Paid",
                                                                            children: "Paid"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                            lineNumber: 1164,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Unpaid",
                                                                            children: "Unpaid"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                            lineNumber: 1165,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                    lineNumber: 1116,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0));
                                                            })()
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1107,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: order.paymentMode || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1170,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: month ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBillingMonth"])(month, year) : 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1171,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: year || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1172,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "monospace-text",
                                                            children: order.orderId || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1173,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "action-buttons-cell",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "action-icon-btn action-icon-edit",
                                                                        onClick: (e)=>{
                                                                            e.stopPropagation();
                                                                            if (onEditOrder) onEditOrder(order);
                                                                        },
                                                                        title: "Edit",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fa-solid fa-pencil"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                            lineNumber: 1184,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                        lineNumber: 1176,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "action-icon-btn action-icon-delete",
                                                                        onClick: (e)=>{
                                                                            e.stopPropagation();
                                                                            if (onDeleteOrder) onDeleteOrder(order._id || order.orderId);
                                                                        },
                                                                        title: "Delete",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fa-solid fa-trash"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                            lineNumber: 1194,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                        lineNumber: 1186,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                                lineNumber: 1175,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                            lineNumber: 1174,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, order._id || order.orderId || idx, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                    lineNumber: 1078,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                            lineNumber: 1045,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                    lineNumber: 996,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 995,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pagination-controls",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-ghost btn-small",
                                                onClick: ()=>onPageChange && onPageChange(currentPage - 1),
                                                disabled: currentPage === 1,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fa-solid fa-chevron-left"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1214,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Previous"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 1209,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pagination-info",
                                                children: [
                                                    "Page ",
                                                    currentPage,
                                                    " of ",
                                                    totalPages || 1
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 1216,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-ghost btn-small",
                                                onClick: ()=>onPageChange && onPageChange(currentPage + 1),
                                                disabled: currentPage >= totalPages,
                                                children: [
                                                    "Next ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fa-solid fa-chevron-right"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1224,
                                                        columnNumber: 22
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 1219,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 1208,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pagination-container",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 1228,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "input-field pagination-select",
                                                value: recordsPerPage,
                                                onChange: (e)=>{
                                                    const value = parseInt(e.target.value);
                                                    if (onRecordsPerPageChange) onRecordsPerPageChange(value);
                                                    if (onPageChange) onPageChange(1);
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 25,
                                                        children: "25"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1238,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 50,
                                                        children: "50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1239,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 100,
                                                        children: "100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1240,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 200,
                                                        children: "200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                        lineNumber: 1241,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 1229,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "per page"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                                lineNumber: 1243,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                        lineNumber: 1227,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                                lineNumber: 1207,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                        lineNumber: 975,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
                lineNumber: 735,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx",
        lineNumber: 676,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AllOrdersDataTab, "5iqhFcN5X3KIbDVruKq9tinFyx0=");
_c = AllOrdersDataTab;
const __TURBOPACK__default__export__ = AllOrdersDataTab;
var _c;
__turbopack_context__.k.register(_c, "AllOrdersDataTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_components_admin_AllOrdersDataTab_jsx_050e339e._.js.map