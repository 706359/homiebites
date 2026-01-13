(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
const AllAddressesTab = ({ orders = [], loading = false, onViewOrders, onContact, showNotification })=>{
    _s();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all'); // 'all', 'active', 'inactive'
    const [filterSegment, setFilterSegment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all'); // 'all', 'Super VIP', 'VIP', 'Regular', 'New'
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('totalSpent'); // 'totalSpent', 'totalOrders', 'lastOrder'
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('desc'); // 'asc', 'desc'
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('table'); // 'table', 'cards'
    const [selectedCustomer, setSelectedCustomer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCustomerModal, setShowCustomerModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [itemsPerPage, setItemsPerPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(25);
    // Calculate customer stats
    const customerStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllAddressesTab.useMemo[customerStats]": ()=>{
            if (!orders || orders.length === 0) {
                return [];
            }
            const customerMap = {};
            const now = new Date();
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            let ordersWithAddresses = 0;
            let ordersWithoutAddresses = 0;
            orders.forEach({
                "AllAddressesTab.useMemo[customerStats]": (order, idx)=>{
                    // Try multiple possible field names for address
                    const address = order.deliveryAddress || order.customerAddress || order.address || order['Delivery Address'] || order['delivery_address'] || order['customer_address'];
                    if (!address || !address.trim()) {
                        ordersWithoutAddresses++;
                        return;
                    }
                    ordersWithAddresses++;
                    if (!customerMap[address]) {
                        customerMap[address] = {
                            address,
                            orders: [],
                            totalOrders: 0,
                            totalSpent: 0,
                            lastOrderDate: null,
                            preferredMode: {},
                            paymentModes: {},
                            firstOrderDate: null
                        };
                    }
                    customerMap[address].orders.push(order);
                    customerMap[address].totalOrders++;
                    let orderTotal = null;
                    if (order.totalAmount !== undefined && order.totalAmount !== null) {
                        orderTotal = parseFloat(order.totalAmount);
                    } else if (order.total !== undefined && order.total !== null) {
                        orderTotal = parseFloat(order.total);
                    }
                    if (orderTotal === null || isNaN(orderTotal)) {
                        const qty = parseFloat(order.quantity || 1);
                        const price = parseFloat(order.unitPrice || 0);
                        orderTotal = qty * price;
                    }
                    customerMap[address].totalSpent += isNaN(orderTotal) ? 0 : orderTotal;
                    // Parse order date with better error handling
                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                    if (orderDate) {
                        if (!customerMap[address].lastOrderDate || orderDate > customerMap[address].lastOrderDate) {
                            customerMap[address].lastOrderDate = orderDate;
                        }
                        if (!customerMap[address].firstOrderDate || orderDate < customerMap[address].firstOrderDate) {
                            customerMap[address].firstOrderDate = orderDate;
                        }
                    }
                    // Preferred mode
                    const mode = order.mode || 'Not Set';
                    customerMap[address].preferredMode[mode] = (customerMap[address].preferredMode[mode] || 0) + 1;
                    // Payment mode
                    const paymentMode = order.paymentMode || 'Not Set';
                    customerMap[address].paymentModes[paymentMode] = (customerMap[address].paymentModes[paymentMode] || 0) + 1;
                }
            }["AllAddressesTab.useMemo[customerStats]"]);
            // Convert to array and calculate additional stats
            const customers = Object.values(customerMap).map({
                "AllAddressesTab.useMemo[customerStats].customers": (customer)=>{
                    const avgOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;
                    // Get preferred mode
                    const preferredMode = Object.entries(customer.preferredMode).sort({
                        "AllAddressesTab.useMemo[customerStats].customers": ([, a], [, b])=>b - a
                    }["AllAddressesTab.useMemo[customerStats].customers"])[0]?.[0] || 'N/A';
                    const preferredModePercent = customer.totalOrders > 0 ? customer.preferredMode[preferredMode] / customer.totalOrders * 100 : 0;
                    // Get preferred payment mode
                    const preferredPayment = Object.entries(customer.paymentModes).sort({
                        "AllAddressesTab.useMemo[customerStats].customers": ([, a], [, b])=>b - a
                    }["AllAddressesTab.useMemo[customerStats].customers"])[0]?.[0] || 'N/A';
                    const preferredPaymentPercent = customer.totalOrders > 0 ? customer.paymentModes[preferredPayment] / customer.totalOrders * 100 : 0;
                    // Determine customer segment based on spending
                    // New: < ₹2,000
                    // Regular: ₹2,000 - ₹7,999
                    // VIP: ₹8,000 - ₹14,999
                    // Super VIP: ≥ ₹15,000
                    let segment = 'New';
                    if (customer.totalSpent >= 15000) {
                        segment = 'Super VIP';
                    } else if (customer.totalSpent >= 8000 && customer.totalSpent < 15000) {
                        segment = 'VIP';
                    } else if (customer.totalSpent >= 2000 && customer.totalSpent < 8000) {
                        segment = 'Regular';
                    }
                    // Determine if inactive (no order in 30+ days)
                    const isInactive = customer.lastOrderDate && customer.lastOrderDate < thirtyDaysAgo;
                    return {
                        ...customer,
                        avgOrderValue,
                        preferredMode,
                        preferredModePercent,
                        preferredPayment,
                        preferredPaymentPercent,
                        segment,
                        isInactive
                    };
                }
            }["AllAddressesTab.useMemo[customerStats].customers"]);
            return customers;
        }
    }["AllAddressesTab.useMemo[customerStats]"], [
        orders
    ]);
    // Filter and sort customers
    const filteredCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllAddressesTab.useMemo[filteredCustomers]": ()=>{
            let filtered = [
                ...customerStats
            ];
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter({
                    "AllAddressesTab.useMemo[filteredCustomers]": (c)=>c.address.toLowerCase().includes(query)
                }["AllAddressesTab.useMemo[filteredCustomers]"]);
            }
            // Status filter
            if (filterStatus === 'active') {
                filtered = filtered.filter({
                    "AllAddressesTab.useMemo[filteredCustomers]": (c)=>!c.isInactive
                }["AllAddressesTab.useMemo[filteredCustomers]"]);
            } else if (filterStatus === 'inactive') {
                filtered = filtered.filter({
                    "AllAddressesTab.useMemo[filteredCustomers]": (c)=>c.isInactive
                }["AllAddressesTab.useMemo[filteredCustomers]"]);
            }
            // Segment filter
            if (filterSegment !== 'all') {
                filtered = filtered.filter({
                    "AllAddressesTab.useMemo[filteredCustomers]": (c)=>c.segment === filterSegment
                }["AllAddressesTab.useMemo[filteredCustomers]"]);
            }
            // Sort
            filtered.sort({
                "AllAddressesTab.useMemo[filteredCustomers]": (a, b)=>{
                    let comparison = 0;
                    switch(sortBy){
                        case 'totalSpent':
                            comparison = b.totalSpent - a.totalSpent;
                            break;
                        case 'totalOrders':
                            comparison = b.totalOrders - a.totalOrders;
                            break;
                        case 'lastOrder':
                            if (!a.lastOrderDate && !b.lastOrderDate) comparison = 0;
                            else if (!a.lastOrderDate) comparison = 1;
                            else if (!b.lastOrderDate) comparison = -1;
                            else comparison = b.lastOrderDate - a.lastOrderDate;
                            break;
                        case 'address':
                            comparison = a.address.localeCompare(b.address);
                            break;
                        case 'avgOrderValue':
                            comparison = b.avgOrderValue - a.avgOrderValue;
                            break;
                        default:
                            comparison = 0;
                    }
                    return sortOrder === 'asc' ? -comparison : comparison;
                }
            }["AllAddressesTab.useMemo[filteredCustomers]"]);
            return filtered;
        }
    }["AllAddressesTab.useMemo[filteredCustomers]"], [
        customerStats,
        searchQuery,
        filterStatus,
        filterSegment,
        sortBy,
        sortOrder
    ]);
    // Pagination
    const paginatedCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllAddressesTab.useMemo[paginatedCustomers]": ()=>{
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return filteredCustomers.slice(start, end);
        }
    }["AllAddressesTab.useMemo[paginatedCustomers]"], [
        filteredCustomers,
        currentPage,
        itemsPerPage
    ]);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    // Handle sort
    const handleSort = (column)=>{
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };
    // Customer segments and totals
    const segments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllAddressesTab.useMemo[segments]": ()=>{
            return {
                superVip: customerStats.filter({
                    "AllAddressesTab.useMemo[segments]": (c)=>c.segment === 'Super VIP'
                }["AllAddressesTab.useMemo[segments]"]).length,
                vip: customerStats.filter({
                    "AllAddressesTab.useMemo[segments]": (c)=>c.segment === 'VIP'
                }["AllAddressesTab.useMemo[segments]"]).length,
                regular: customerStats.filter({
                    "AllAddressesTab.useMemo[segments]": (c)=>c.segment === 'Regular'
                }["AllAddressesTab.useMemo[segments]"]).length,
                new: customerStats.filter({
                    "AllAddressesTab.useMemo[segments]": (c)=>c.segment === 'New'
                }["AllAddressesTab.useMemo[segments]"]).length,
                total: customerStats.length,
                totalRevenue: customerStats.reduce({
                    "AllAddressesTab.useMemo[segments]": (sum, c)=>sum + c.totalSpent
                }["AllAddressesTab.useMemo[segments]"], 0)
            };
        }
    }["AllAddressesTab.useMemo[segments]"], [
        customerStats
    ]);
    // Inactive customers
    const inactiveCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AllAddressesTab.useMemo[inactiveCustomers]": ()=>{
            return customerStats.filter({
                "AllAddressesTab.useMemo[inactiveCustomers]": (c)=>c.isInactive
            }["AllAddressesTab.useMemo[inactiveCustomers]"]);
        }
    }["AllAddressesTab.useMemo[inactiveCustomers]"], [
        customerStats
    ]);
    // Format date difference
    const formatDateDiff = (date)=>{
        if (!date) return 'Never';
        try {
            const dateObj = date instanceof Date ? date : new Date(date);
            if (isNaN(dateObj.getTime())) return 'Never';
            const now = new Date();
            const diff = now.getTime() - dateObj.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (days === 0) return 'Today';
            if (days === 1) return '1 day ago';
            if (days < 7) return `${days} days ago`;
            if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
            return `${Math.floor(days / 30)} months ago`;
        } catch (e) {
            console.warn('Error formatting date diff:', e);
            return 'Never';
        }
    };
    const handleViewCustomer = (customer)=>{
        setSelectedCustomer(customer);
        setShowCustomerModal(true);
    };
    // Export customer list
    const handleExport = ()=>{
        const csvContent = 'Address,Total Orders,Total Spent,Avg Order Value,Last Order,Segment\n' + filteredCustomers.map((c)=>`"${c.address}","${c.totalOrders}","${c.totalSpent}","${c.avgOrderValue.toFixed(2)}","${c.lastOrderDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(c.lastOrderDate) : 'Never'}","${c.segment}"`).join('\n');
        const blob = new Blob([
            csvContent
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        if (showNotification) showNotification('Customer list exported successfully', 'success');
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: "Loading customers...",
                size: "large"
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 302,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
            lineNumber: 301,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Show message if no orders
    if (!orders || orders.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card",
                style: {
                    textAlign: 'center',
                    padding: '48px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "empty-state",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fa-solid fa-users empty-state-icon"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 313,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "No orders found"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 314,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: 'var(--admin-text-light)',
                                fontSize: '0.9rem'
                            },
                            children: "Add some orders to see customer data here"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 315,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                    lineNumber: 312,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 311,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
            lineNumber: 310,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-stats customer-stats-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card stat-card-gradient-accent customer-stat-card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "customer-stat-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "customer-stat-number",
                                    children: segments.total
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 331,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "customer-stat-label",
                                    children: "Total Customers"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 332,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 330,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card stat-card-gradient-warning customer-stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-crown customer-stat-icon customer-stat-icon-green"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "customer-stat-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "customer-stat-number",
                                        children: segments.superVip
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 339,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "customer-stat-label",
                                        children: "Super VIP (≥₹15k)"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 338,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 336,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card stat-card-gradient-warning customer-stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-star customer-stat-icon customer-stat-icon-green"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "customer-stat-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "customer-stat-number",
                                        children: segments.vip
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "customer-stat-label",
                                        children: "VIP (₹8k-₹15k)"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 348,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 346,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 344,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card stat-card-gradient-secondary customer-stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-user customer-stat-icon customer-stat-icon-light"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "customer-stat-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "customer-stat-number",
                                        children: segments.regular
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "customer-stat-label",
                                        children: "Regular Customers"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 356,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 352,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card stat-card-gradient-success customer-stat-card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "customer-stat-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "customer-stat-number",
                                    children: [
                                        "₹",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(segments.totalRevenue)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "customer-stat-label",
                                    children: "Total Revenue"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 327,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card filter-bar-card filter-bar-compact",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "filter-bar-container-compact",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "search-input-wrapper search-input-compact",
                            style: {
                                flex: 1,
                                minWidth: '180px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-search search-input-icon"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 376,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "input-field search-input-with-icon",
                                    placeholder: "Search by address...",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 377,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 372,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: "input-field filter-select-compact",
                            value: filterStatus,
                            onChange: (e)=>setFilterStatus(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "all",
                                    children: "All Status"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "active",
                                    children: "Active"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 393,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "inactive",
                                    children: "Inactive"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 394,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 387,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: "input-field filter-select-compact",
                            value: filterSegment,
                            onChange: (e)=>setFilterSegment(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "all",
                                    children: "All Segments"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 403,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "VIP",
                                    children: "VIP"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 404,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "Regular",
                                    children: "Regular"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 405,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "New",
                                    children: "New"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 406,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 398,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "view-toggle-compact",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `btn btn-ghost btn-icon btn-icon-compact ${viewMode === 'table' ? 'active' : ''}`,
                                    onClick: ()=>setViewMode('table'),
                                    title: "Table View",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-table"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 416,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 411,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `btn btn-ghost btn-icon btn-icon-compact ${viewMode === 'cards' ? 'active' : ''}`,
                                    onClick: ()=>setViewMode('cards'),
                                    title: "Card View",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-th"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 423,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 418,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 410,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-secondary btn-small btn-compact",
                            onClick: handleExport,
                            title: "Export",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-download"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 433,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                " Export"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 428,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        (searchQuery || filterStatus !== 'all' || filterSegment !== 'all') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-ghost btn-small btn-compact",
                            onClick: ()=>{
                                setSearchQuery('');
                                setFilterStatus('all');
                                setFilterSegment('all');
                            },
                            title: "Clear Filters",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-xmark"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 447,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                " Clear"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 438,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                    lineNumber: 370,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 369,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            inactiveCustomers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card margin-bottom-24",
                style: {
                    background: 'var(--admin-warning-light)',
                    border: '2px solid var(--admin-warning)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        color: 'var(--admin-warning)',
                                        marginBottom: '8px'
                                    },
                                    children: [
                                        "⚠️ ",
                                        inactiveCustomers.length,
                                        " customers haven't ordered in 30+ days"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 464,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: 'var(--admin-text)',
                                        fontSize: '0.9rem'
                                    },
                                    children: "Consider reaching out to re-engage these customers"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 467,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 463,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "action-buttons-group",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-warning btn-small",
                                onClick: ()=>{
                                    setFilterStatus('inactive');
                                },
                                children: "View List"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 472,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 471,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                    lineNumber: 462,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 455,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            viewMode === 'table' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card table-container-card",
                style: {
                    padding: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "orders-table-container table-wrapper",
                    style: {
                        minHeight: '400px'
                    },
                    children: filteredCustomers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'center',
                            padding: '48px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "empty-state",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-users empty-state-icon"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 492,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "No customers found"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 493,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: 'var(--admin-text-light)',
                                        fontSize: '0.9rem'
                                    },
                                    children: orders.length > 0 && customerStats.length === 0 ? `Found ${orders.length} orders, but none have valid delivery addresses.` : searchQuery || filterStatus !== 'all' || filterSegment !== 'all' ? 'Try adjusting your search or filters' : 'No customer data available. Add orders with delivery addresses to see customers here.'
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 494,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 491,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 490,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "orders-table",
                                style: {
                                    width: '100%',
                                    display: 'table'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    onClick: ()=>handleSort('address'),
                                                    style: {
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    },
                                                    children: [
                                                        "Address",
                                                        sortBy === 'address' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: `fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`,
                                                            style: {
                                                                marginLeft: '6px',
                                                                fontSize: '10px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 514,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 508,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    onClick: ()=>handleSort('totalOrders'),
                                                    style: {
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    },
                                                    children: [
                                                        "Orders",
                                                        sortBy === 'totalOrders' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: `fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`,
                                                            style: {
                                                                marginLeft: '6px',
                                                                fontSize: '10px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 526,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 520,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    onClick: ()=>handleSort('totalSpent'),
                                                    style: {
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    },
                                                    children: [
                                                        "Total Spent",
                                                        sortBy === 'totalSpent' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: `fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`,
                                                            style: {
                                                                marginLeft: '6px',
                                                                fontSize: '10px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 538,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 532,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    onClick: ()=>handleSort('avgOrderValue'),
                                                    style: {
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    },
                                                    children: [
                                                        "Avg Order",
                                                        sortBy === 'avgOrderValue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: `fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`,
                                                            style: {
                                                                marginLeft: '6px',
                                                                fontSize: '10px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 550,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 544,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    onClick: ()=>handleSort('lastOrder'),
                                                    style: {
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    },
                                                    children: [
                                                        "Last Order",
                                                        sortBy === 'lastOrder' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: `fa-solid fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`,
                                                            style: {
                                                                marginLeft: '6px',
                                                                fontSize: '10px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 562,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 556,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Segment"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 568,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Preferred Mode"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 569,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 570,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        textAlign: 'center'
                                                    },
                                                    children: "Actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 571,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                            lineNumber: 507,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 506,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: paginatedCustomers.map((customer, idx)=>{
                                            const segmentColor = customer.segment === 'Super VIP' ? 'var(--admin-warning)' : customer.segment === 'VIP' ? 'var(--admin-accent)' : customer.segment === 'Regular' ? 'var(--admin-success)' : 'var(--admin-text-secondary)';
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                onClick: ()=>handleViewCustomer(customer),
                                                style: {
                                                    cursor: 'pointer'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontWeight: '600',
                                                                color: 'var(--admin-text-primary)'
                                                            },
                                                            children: customer.address
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 591,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 590,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontWeight: '600'
                                                            },
                                                            children: customer.totalOrders
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 596,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 595,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontWeight: '700',
                                                                color: 'var(--admin-accent)',
                                                                fontSize: '14px'
                                                            },
                                                            children: [
                                                                "₹",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(customer.totalSpent)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 599,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 598,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontWeight: '600'
                                                            },
                                                            children: [
                                                                "₹",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(customer.avgOrderValue)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 610,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 609,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '12px',
                                                                color: 'var(--admin-text-secondary)'
                                                            },
                                                            children: formatDateDiff(customer.lastOrderDate)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 615,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 614,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "badge",
                                                            style: {
                                                                background: segmentColor + '20',
                                                                color: segmentColor,
                                                                fontSize: '11px',
                                                                fontWeight: '600',
                                                                padding: '4px 8px'
                                                            },
                                                            children: [
                                                                customer.segment === 'Super VIP' ? '👑' : customer.segment === 'VIP' ? '🌟' : customer.segment === 'Regular' ? '📈' : '👤',
                                                                ' ',
                                                                customer.segment
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 622,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 621,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '12px'
                                                            },
                                                            children: customer.preferredMode
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 643,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 642,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        children: customer.isInactive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "badge badge-warning",
                                                            style: {
                                                                fontSize: '11px'
                                                            },
                                                            children: "Inactive"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 647,
                                                            columnNumber: 31
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "badge badge-success",
                                                            style: {
                                                                fontSize: '11px'
                                                            },
                                                            children: "Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 651,
                                                            columnNumber: 31
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 645,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            textAlign: 'center'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn btn-primary btn-small",
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                if (onViewOrders) onViewOrders(customer.address);
                                                            },
                                                            style: {
                                                                fontSize: '11px',
                                                                padding: '4px 8px'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-list"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 665,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 657,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 656,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 585,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0));
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 574,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 505,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    borderTop: '1px solid var(--admin-border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--admin-text-secondary)'
                                                },
                                                children: "Show:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 686,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "input-field",
                                                value: itemsPerPage,
                                                onChange: (e)=>{
                                                    setItemsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                },
                                                style: {
                                                    fontSize: '12px',
                                                    padding: '4px 8px',
                                                    minWidth: '80px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 10,
                                                        children: "10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 698,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 25,
                                                        children: "25"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 699,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 50,
                                                        children: "50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 700,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 100,
                                                        children: "100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 701,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 689,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--admin-text-secondary)'
                                                },
                                                children: [
                                                    "of ",
                                                    filteredCustomers.length,
                                                    " customers"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 703,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 685,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-ghost btn-small",
                                                onClick: ()=>setCurrentPage(Math.max(1, currentPage - 1)),
                                                disabled: currentPage === 1,
                                                style: {
                                                    fontSize: '12px',
                                                    padding: '4px 8px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-chevron-left"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 714,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 708,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '13px',
                                                    color: 'var(--admin-text)'
                                                },
                                                children: [
                                                    "Page ",
                                                    currentPage,
                                                    " of ",
                                                    totalPages
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 716,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-ghost btn-small",
                                                onClick: ()=>setCurrentPage(Math.min(totalPages, currentPage + 1)),
                                                disabled: currentPage === totalPages,
                                                style: {
                                                    fontSize: '12px',
                                                    padding: '4px 8px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-chevron-right"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 725,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 719,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 707,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 676,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                    lineNumber: 488,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 487,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /* CARD VIEW */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                },
                children: filteredCustomers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "dashboard-card",
                    style: {
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '48px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "empty-state",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-users empty-state-icon"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 749,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "No customers found"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 750,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: 'var(--admin-text-light)',
                                    fontSize: '0.9rem'
                                },
                                children: orders.length > 0 && customerStats.length === 0 ? `Found ${orders.length} orders, but none have valid delivery addresses.` : searchQuery || filterStatus !== 'all' || filterSegment !== 'all' ? 'Try adjusting your search or filters' : 'No customer data available. Add orders with delivery addresses to see customers here.'
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 751,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 748,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                    lineNumber: 744,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "list list-group",
                    children: paginatedCustomers.map((customer, idx)=>{
                        const segmentIcon = customer.segment === 'Super VIP' ? '👑' : customer.segment === 'VIP' ? '🌟' : customer.segment === 'Regular' ? '📈' : '👤';
                        const segmentLabel = customer.segment === 'Super VIP' ? 'Super VIP Customer' : customer.segment === 'VIP' ? 'VIP Customer' : customer.segment === 'Regular' ? 'Regular Customer' : 'New Customer';
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "dashboard-card list-item",
                            style: {
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            },
                            onClick: ()=>handleViewCustomer(customer),
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '';
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'start',
                                        marginBottom: '16px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    style: {
                                                        marginBottom: '4px',
                                                        fontSize: '1.2rem'
                                                    },
                                                    children: customer.address
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 807,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: 'var(--admin-text-secondary)',
                                                        fontSize: '0.9rem'
                                                    },
                                                    children: [
                                                        segmentIcon,
                                                        " ",
                                                        segmentLabel
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 810,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                            lineNumber: 806,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        customer.isInactive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "badge badge-warning",
                                            style: {
                                                fontSize: '0.75rem'
                                            },
                                            children: "Inactive"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                            lineNumber: 815,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 798,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px',
                                        marginBottom: '16px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--admin-text-secondary)'
                                                    },
                                                    children: "Total Orders:"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 830,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontWeight: '600',
                                                        color: 'var(--admin-text)'
                                                    },
                                                    children: customer.totalOrders
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 831,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                            lineNumber: 829,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--admin-text-secondary)'
                                                    },
                                                    children: "Total Spent:"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 836,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontWeight: '700',
                                                        color: 'var(--admin-accent)',
                                                        fontSize: '1.1rem'
                                                    },
                                                    children: [
                                                        "₹",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(customer.totalSpent)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 837,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                            lineNumber: 835,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--admin-text-secondary)'
                                                    },
                                                    children: "Avg Order:"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 848,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontWeight: '600',
                                                        color: 'var(--admin-text)'
                                                    },
                                                    children: [
                                                        "₹",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(customer.avgOrderValue)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 849,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                            lineNumber: 847,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--admin-text-secondary)'
                                                    },
                                                    children: "Last Order:"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 854,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontWeight: '600',
                                                        color: 'var(--admin-text)'
                                                    },
                                                    children: formatDateDiff(customer.lastOrderDate)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 855,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                            lineNumber: 853,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--admin-text-secondary)'
                                                    },
                                                    children: "Preferred:"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 860,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontWeight: '600',
                                                        color: 'var(--admin-text)'
                                                    },
                                                    children: customer.preferredMode
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 861,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                            lineNumber: 859,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 821,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "action-buttons-group",
                                    style: {
                                        marginTop: '16px'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn btn-primary btn-small btn-full",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            if (onViewOrders) onViewOrders(customer.address);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-list"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 875,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " View Orders"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 868,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 867,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, idx, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 781,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                    lineNumber: 761,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 736,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            viewMode === 'cards' && totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '24px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-ghost btn-small",
                        onClick: ()=>setCurrentPage(Math.max(1, currentPage - 1)),
                        disabled: currentPage === 1,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-chevron-left"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 902,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Previous"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 897,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '14px',
                            color: 'var(--admin-text)'
                        },
                        children: [
                            "Page ",
                            currentPage,
                            " of ",
                            totalPages
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 904,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-ghost btn-small",
                        onClick: ()=>setCurrentPage(Math.min(totalPages, currentPage + 1)),
                        disabled: currentPage === totalPages,
                        children: [
                            "Next ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-chevron-right"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 912,
                                columnNumber: 18
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                        lineNumber: 907,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 888,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showCustomerModal && selectedCustomer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                onClick: ()=>setShowCustomerModal(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-container",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: [
                                        selectedCustomer.address,
                                        " Customer Details"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 922,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "modal-close",
                                    onClick: ()=>setShowCustomerModal(false),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-times"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 924,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 923,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 921,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    marginBottom: '16px',
                                                    fontSize: '1.1rem',
                                                    fontWeight: '700'
                                                },
                                                children: "Customer Information"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 931,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: '12px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--admin-text-secondary)'
                                                                },
                                                                children: "Status:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 938,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "badge badge-success",
                                                                style: {
                                                                    marginLeft: '8px',
                                                                    fontSize: '0.85rem'
                                                                },
                                                                children: "🟢 Active"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 939,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 937,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--admin-text-secondary)'
                                                                },
                                                                children: "Customer Since:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 947,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    marginLeft: '8px',
                                                                    fontWeight: '600'
                                                                },
                                                                children: selectedCustomer.firstOrderDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateShort"])(selectedCustomer.firstOrderDate) : 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 948,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 946,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--admin-text-secondary)'
                                                                },
                                                                children: "Total Orders:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 955,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    marginLeft: '8px',
                                                                    fontWeight: '600'
                                                                },
                                                                children: selectedCustomer.totalOrders
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 956,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 954,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--admin-text-secondary)'
                                                                },
                                                                children: "Total Spent:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 961,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    marginLeft: '8px',
                                                                    fontWeight: '700',
                                                                    color: 'var(--admin-accent)'
                                                                },
                                                                children: [
                                                                    "₹",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedCustomer.totalSpent)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 962,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 960,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--admin-text-secondary)'
                                                                },
                                                                children: "Average Order Value:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 973,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    marginLeft: '8px',
                                                                    fontWeight: '600'
                                                                },
                                                                children: [
                                                                    "₹",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedCustomer.avgOrderValue)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 976,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 972,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--admin-text-secondary)'
                                                                },
                                                                children: "Preferred Mode:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 981,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    marginLeft: '8px',
                                                                    fontWeight: '600'
                                                                },
                                                                children: [
                                                                    selectedCustomer.preferredMode,
                                                                    " (",
                                                                    selectedCustomer.preferredModePercent.toFixed(0),
                                                                    "%)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 982,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 980,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--admin-text-secondary)'
                                                                },
                                                                children: "Payment Mode:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 988,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    marginLeft: '8px',
                                                                    fontWeight: '600'
                                                                },
                                                                children: [
                                                                    selectedCustomer.preferredPayment,
                                                                    " (",
                                                                    selectedCustomer.preferredPaymentPercent.toFixed(0),
                                                                    "%)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 989,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 987,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--admin-text-secondary)'
                                                                },
                                                                children: "Last Order:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 995,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    marginLeft: '8px',
                                                                    fontWeight: '600'
                                                                },
                                                                children: formatDateDiff(selectedCustomer.lastOrderDate)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 996,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                        lineNumber: 994,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 934,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 930,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    marginBottom: '16px',
                                                    fontSize: '1.1rem',
                                                    fontWeight: '700'
                                                },
                                                children: "Order History (Last 10)"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 1005,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "orders-table-container",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                    className: "orders-table",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Date"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                        lineNumber: 1012,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Qty"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                        lineNumber: 1013,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Amount"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                        lineNumber: 1014,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Status"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                        lineNumber: 1015,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                lineNumber: 1011,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 1010,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortOrdersByOrderId"])(selectedCustomer.orders || []).slice(0, 10).map((order, idx)=>{
                                                                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(// Never use createdAt (today's date) as fallback - only use actual order date
                                                                order.date || order.order_date || null);
                                                                const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(orderDate);
                                                                const isPaid = (order.status || '').toLowerCase() === 'paid';
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: dateStr
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                            lineNumber: 1031,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: order.quantity || 1
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                            lineNumber: 1032,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: [
                                                                                "₹",
                                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total || order.totalAmount || 0)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                            lineNumber: 1033,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `badge ${isPaid ? 'badge-success' : 'badge-warning'}`,
                                                                                children: order.status || 'No Status'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                                lineNumber: 1035,
                                                                                columnNumber: 35
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                            lineNumber: 1034,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, idx, true, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                                    lineNumber: 1030,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0));
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                            lineNumber: 1018,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                    lineNumber: 1009,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                                lineNumber: 1008,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                        lineNumber: 1004,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                lineNumber: 928,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 927,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-secondary",
                                    onClick: ()=>{
                                        setShowCustomerModal(false);
                                        if (onViewOrders) onViewOrders(selectedCustomer.address);
                                    },
                                    children: "View All Orders"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 1053,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary",
                                    onClick: ()=>setShowCustomerModal(false),
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                                    lineNumber: 1062,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                            lineNumber: 1052,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                    lineNumber: 920,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
                lineNumber: 919,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx",
        lineNumber: 325,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AllAddressesTab, "uzC69wLcEDoQMvuijYHoyEMaUHQ=");
_c = AllAddressesTab;
const __TURBOPACK__default__export__ = AllAddressesTab;
var _c;
__turbopack_context__.k.register(_c, "AllAddressesTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_components_admin_AllAddressesTab_jsx_acf67d07._.js.map