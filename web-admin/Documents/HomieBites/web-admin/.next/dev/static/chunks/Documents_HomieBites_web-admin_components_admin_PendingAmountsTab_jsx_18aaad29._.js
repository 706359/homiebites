(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/calculations.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dateUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const PendingAmountsTab = ({ orders = [], loading = false, onUpdateOrderStatus, showNotification, settings, showConfirmation, showOverdueFilter = false, onOverdueFilterApplied })=>{
    _s();
    const [selectedOrder, setSelectedOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showReminderModal, setShowReminderModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reminderTemplate, setReminderTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('friendly');
    const [sendViaSMS, setSendViaSMS] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sendViaWhatsApp, setSendViaWhatsApp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sendViaEmail, setSendViaEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Filter state
    const [filterUrgency, setFilterUrgency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all'); // 'all', 'urgent', 'normal'
    const [filterDaysPending, setFilterDaysPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all'); // 'all', '0-3', '4-7', '7+'
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const now = new Date();
    // Calculate summary stats
    const summaryStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PendingAmountsTab.useMemo[summaryStats]": ()=>{
            const paidOrders = orders.filter({
                "PendingAmountsTab.useMemo[summaryStats].paidOrders": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(o.status)
            }["PendingAmountsTab.useMemo[summaryStats].paidOrders"]);
            const pendingOrders = orders.filter({
                "PendingAmountsTab.useMemo[summaryStats].pendingOrders": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status)
            }["PendingAmountsTab.useMemo[summaryStats].pendingOrders"]);
            // Overdue orders (pending > 45 days)
            const fortyFiveDaysAgo = new Date(now);
            fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
            fortyFiveDaysAgo.setHours(0, 0, 0, 0); // Set to midnight for consistent date comparison
            const overdueOrders = pendingOrders.filter({
                "PendingAmountsTab.useMemo[summaryStats].overdueOrders": (o)=>{
                    try {
                        // Never use createdAt (today's date) as fallback - only use actual order date
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                        if (!orderDate) return false;
                        // Normalize orderDate to midnight for comparison
                        const orderDateMidnight = new Date(orderDate);
                        orderDateMidnight.setHours(0, 0, 0, 0);
                        return orderDateMidnight < fortyFiveDaysAgo;
                    } catch (e) {
                        return false;
                    }
                }
            }["PendingAmountsTab.useMemo[summaryStats].overdueOrders"]);
            // Current month stats
            const currentMonthOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredOrdersByDate"])(orders, 'month', '', '');
            const currentMonthRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(currentMonthOrders);
            return {
                totalPaid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(paidOrders),
                totalPaidCount: paidOrders.length,
                pending: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(pendingOrders),
                pendingCount: pendingOrders.length,
                overdue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(overdueOrders),
                overdueCount: overdueOrders.length,
                thisMonth: currentMonthRevenue,
                thisMonthCount: currentMonthOrders.length
            };
        }
    }["PendingAmountsTab.useMemo[summaryStats]"], [
        orders,
        now
    ]);
    // Pending payments list
    const pendingPayments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PendingAmountsTab.useMemo[pendingPayments]": ()=>{
            const pending = orders.filter({
                "PendingAmountsTab.useMemo[pendingPayments].pending": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status)
            }["PendingAmountsTab.useMemo[pendingPayments].pending"]);
            // Calculate fortyFiveDaysAgo to match notification logic exactly
            const fortyFiveDaysAgo = new Date(now);
            fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
            fortyFiveDaysAgo.setHours(0, 0, 0, 0);
            let payments = pending.map({
                "PendingAmountsTab.useMemo[pendingPayments].payments": (order)=>{
                    try {
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                        if (!orderDate) {
                            return {
                                ...order,
                                orderDate: null,
                                daysPending: 0,
                                isUrgent: false,
                                isOverdue: false
                            };
                        }
                        const daysPending = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
                        // Use same logic as notification: normalize dates to midnight and compare
                        const orderDateMidnight = new Date(orderDate);
                        orderDateMidnight.setHours(0, 0, 0, 0);
                        const isOverdue = orderDateMidnight < fortyFiveDaysAgo;
                        return {
                            ...order,
                            orderDate,
                            daysPending,
                            isUrgent: daysPending > 7,
                            isOverdue
                        };
                    } catch (e) {
                        return {
                            ...order,
                            orderDate: null,
                            daysPending: 0,
                            isUrgent: false,
                            isOverdue: false
                        };
                    }
                }
            }["PendingAmountsTab.useMemo[pendingPayments].payments"]).sort({
                "PendingAmountsTab.useMemo[pendingPayments].payments": (a, b)=>{
                    if (b.daysPending !== a.daysPending) {
                        return b.daysPending - a.daysPending;
                    }
                    const seqA = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractOrderIdSequence"])(a.orderId);
                    const seqB = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractOrderIdSequence"])(b.orderId);
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
            }["PendingAmountsTab.useMemo[pendingPayments].payments"]);
            // Apply filters
            if (filterUrgency === 'urgent') {
                // Use isOverdue to match notification logic exactly
                payments = payments.filter({
                    "PendingAmountsTab.useMemo[pendingPayments]": (p)=>p.isOverdue
                }["PendingAmountsTab.useMemo[pendingPayments]"]);
            } else if (filterUrgency === 'normal') {
                payments = payments.filter({
                    "PendingAmountsTab.useMemo[pendingPayments]": (p)=>!p.isOverdue
                }["PendingAmountsTab.useMemo[pendingPayments]"]);
            }
            if (filterDaysPending === '0-3') {
                payments = payments.filter({
                    "PendingAmountsTab.useMemo[pendingPayments]": (p)=>p.daysPending >= 0 && p.daysPending <= 3
                }["PendingAmountsTab.useMemo[pendingPayments]"]);
            } else if (filterDaysPending === '4-7') {
                payments = payments.filter({
                    "PendingAmountsTab.useMemo[pendingPayments]": (p)=>p.daysPending >= 4 && p.daysPending <= 7
                }["PendingAmountsTab.useMemo[pendingPayments]"]);
            } else if (filterDaysPending === '7+') {
                // Filter for orders > 7 days (but not necessarily overdue)
                payments = payments.filter({
                    "PendingAmountsTab.useMemo[pendingPayments]": (p)=>p.daysPending > 7
                }["PendingAmountsTab.useMemo[pendingPayments]"]);
            } else if (filterDaysPending === '45+') {
                // Use isOverdue to match notification logic exactly (> 45 days)
                payments = payments.filter({
                    "PendingAmountsTab.useMemo[pendingPayments]": (p)=>p.isOverdue
                }["PendingAmountsTab.useMemo[pendingPayments]"]);
            }
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                payments = payments.filter({
                    "PendingAmountsTab.useMemo[pendingPayments]": (p)=>{
                        const address = (p.deliveryAddress || p.customerAddress || p.address || '').toLowerCase();
                        const orderId = (p.orderId || p._id || '').toString().toLowerCase();
                        return address.includes(query) || orderId.includes(query);
                    }
                }["PendingAmountsTab.useMemo[pendingPayments]"]);
            }
            return payments;
        }
    }["PendingAmountsTab.useMemo[pendingPayments]"], [
        orders,
        now,
        filterUrgency,
        filterDaysPending,
        searchQuery
    ]);
    // Auto-filter to overdue when opened from notification
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PendingAmountsTab.useEffect": ()=>{
            if (showOverdueFilter) {
                setFilterDaysPending('45+');
                setFilterUrgency('urgent');
                // Reset the flag after applying filters
                if (onOverdueFilterApplied) {
                    onOverdueFilterApplied();
                }
            }
        }
    }["PendingAmountsTab.useEffect"], [
        showOverdueFilter,
        onOverdueFilterApplied
    ]);
    // Payment collection timeline (last 30 days)
    const paymentTimeline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PendingAmountsTab.useMemo[paymentTimeline]": ()=>{
            const timeline = [];
            for(let i = 29; i >= 0; i--){
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);
                const nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                const dayOrders = orders.filter({
                    "PendingAmountsTab.useMemo[paymentTimeline].dayOrders": (o)=>{
                        try {
                            // Never use createdAt (today's date) as fallback - only use actual order date
                            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                            return orderDate >= date && orderDate < nextDay;
                        } catch (e) {
                            return false;
                        }
                    }
                }["PendingAmountsTab.useMemo[paymentTimeline].dayOrders"]);
                const paidOrders = dayOrders.filter({
                    "PendingAmountsTab.useMemo[paymentTimeline].paidOrders": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(o.status)
                }["PendingAmountsTab.useMemo[paymentTimeline].paidOrders"]);
                const collectionRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(paidOrders);
                timeline.push({
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateMonthDay"])(date),
                    fullDate: date,
                    collection: collectionRevenue,
                    orders: paidOrders.length
                });
            }
            return timeline;
        }
    }["PendingAmountsTab.useMemo[paymentTimeline]"], [
        orders,
        now
    ]);
    // Calculate average collection time
    const avgCollectionTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PendingAmountsTab.useMemo[avgCollectionTime]": ()=>{
            const paidOrders = orders.filter({
                "PendingAmountsTab.useMemo[avgCollectionTime].paidOrders": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(o.status)
            }["PendingAmountsTab.useMemo[avgCollectionTime].paidOrders"]);
            if (paidOrders.length === 0) return 0;
            let totalDays = 0;
            paidOrders.forEach({
                "PendingAmountsTab.useMemo[avgCollectionTime]": (order)=>{
                    try {
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.createdAt || order.date || order.order_date);
                        if (!orderDate) return;
                        const paidDate = order.paidDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.paidDate) : orderDate; // If paidDate exists, use it
                        if (!paidDate) return;
                        const days = Math.floor((paidDate - orderDate) / (1000 * 60 * 60 * 24));
                        totalDays += Math.max(0, days);
                    } catch (e) {
                    // Ignore
                    }
                }
            }["PendingAmountsTab.useMemo[avgCollectionTime]"]);
            return paidOrders.length > 0 ? (totalDays / paidOrders.length).toFixed(1) : 0;
        }
    }["PendingAmountsTab.useMemo[avgCollectionTime]"], [
        orders
    ]);
    const maxTimelineCollection = Math.max(...paymentTimeline.map((t)=>t.collection), 1);
    // Payment mode performance
    const paymentModePerformance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PendingAmountsTab.useMemo[paymentModePerformance]": ()=>{
            const modeStats = {};
            orders.forEach({
                "PendingAmountsTab.useMemo[paymentModePerformance]": (o)=>{
                    const mode = o.paymentMode || 'Not Set';
                    if (!modeStats[mode]) {
                        modeStats[mode] = {
                            count: 0,
                            amount: 0
                        };
                    }
                    modeStats[mode].count++;
                    let amount = null;
                    if (o.totalAmount !== undefined && o.totalAmount !== null) {
                        amount = parseFloat(o.totalAmount);
                    } else if (o.total !== undefined && o.total !== null) {
                        amount = parseFloat(o.total);
                    }
                    if (amount === null || isNaN(amount)) {
                        const qty = parseFloat(o.quantity || 1);
                        const price = parseFloat(o.unitPrice || 0);
                        amount = qty * price;
                    }
                    modeStats[mode].amount += isNaN(amount) ? 0 : amount;
                }
            }["PendingAmountsTab.useMemo[paymentModePerformance]"]);
            return Object.entries(modeStats).map({
                "PendingAmountsTab.useMemo[paymentModePerformance]": ([mode, stats])=>({
                        mode,
                        ...stats
                    })
            }["PendingAmountsTab.useMemo[paymentModePerformance]"]).sort({
                "PendingAmountsTab.useMemo[paymentModePerformance]": (a, b)=>b.amount - a.amount
            }["PendingAmountsTab.useMemo[paymentModePerformance]"]);
        }
    }["PendingAmountsTab.useMemo[paymentModePerformance]"], [
        orders
    ]);
    const totalPaymentAmount = paymentModePerformance.reduce((sum, p)=>sum + p.amount, 0);
    // Handle mark as paid
    const handleMarkAsPaid = async (orderId)=>{
        const order = orders.find((o)=>(o._id || o.orderId) === orderId);
        const orderInfo = order ? `Order ${order.orderId || orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}` : `Order ${orderId}`;
        if (showConfirmation && onUpdateOrderStatus) {
            showConfirmation({
                title: 'Mark as Paid',
                message: `Are you sure you want to mark ${orderInfo} as paid?`,
                type: 'info',
                confirmText: 'Mark as Paid',
                onConfirm: async ()=>{
                    await onUpdateOrderStatus(orderId, 'Paid');
                    if (showNotification) showNotification('Order marked as paid', 'success');
                }
            });
        } else if (onUpdateOrderStatus) {
            await onUpdateOrderStatus(orderId, 'Paid');
            if (showNotification) showNotification('Order marked as paid', 'success');
        }
    };
    const handleBulkMarkAsPaid = async ()=>{
        const selectedOrders = pendingPayments.filter((p)=>p.isUrgent);
        const count = selectedOrders.length;
        if (count === 0) {
            if (showNotification) showNotification('No urgent orders selected', 'info');
            return;
        }
        if (showConfirmation) {
            showConfirmation({
                title: 'Mark All Urgent as Paid',
                message: `Are you sure you want to mark ${count} urgent order${count > 1 ? 's' : ''} as paid?`,
                type: 'info',
                confirmText: 'Mark All as Paid',
                onConfirm: async ()=>{
                    try {
                        for (const order of selectedOrders){
                            if (onUpdateOrderStatus) {
                                await onUpdateOrderStatus(order._id || order.orderId, 'Paid');
                            }
                        }
                        if (showNotification) showNotification('All urgent orders marked as paid', 'success');
                    } catch (error) {
                        console.error('Error marking orders as paid:', error);
                        if (showNotification) showNotification('Error updating orders', 'error');
                    }
                }
            });
        } else {
            try {
                for (const order of selectedOrders){
                    if (onUpdateOrderStatus) {
                        await onUpdateOrderStatus(order._id || order.orderId, 'Paid');
                    }
                }
                if (showNotification) showNotification('All urgent orders marked as paid', 'success');
            } catch (error) {
                console.error('Error marking orders as paid:', error);
                if (showNotification) showNotification('Error updating orders', 'error');
            }
        }
    };
    // Handle send reminder
    const handleSendReminder = ()=>{
        if (!selectedOrder) return;
        // In a real app, this would send via SMS/WhatsApp/Email
        if (showNotification) {
            showNotification(`Reminder sent to ${selectedOrder.deliveryAddress || selectedOrder.customerAddress || selectedOrder.address}`, 'success');
        }
        setShowReminderModal(false);
        setSelectedOrder(null);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: "Loading payment data...",
                size: "large"
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                lineNumber: 357,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
            lineNumber: 356,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card dashboard-card-spaced",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "filter-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "search-input-wrapper search-input-wrapper-flex",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-search search-input-icon"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "input-field search-input-with-icon",
                                    placeholder: "Search by address or order ID...",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 370,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 368,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "filter-field-group-standard min-width-140",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "filter-label-standard",
                                    children: "Urgency"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 379,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "input-field filter-input-standard",
                                    value: filterUrgency,
                                    onChange: (e)=>setFilterUrgency(e.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "All"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 385,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "urgent",
                                            children: "Urgent (>7 days)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 386,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "normal",
                                            children: "Normal (≤7 days)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 387,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 380,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 378,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "filter-field-group-standard min-width-140",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "filter-label-standard",
                                    children: "Days Pending"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 391,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "input-field filter-input-standard",
                                    value: filterDaysPending,
                                    onChange: (e)=>setFilterDaysPending(e.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "all",
                                            children: "All"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 397,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "0-3",
                                            children: "0-3 days"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 398,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "4-7",
                                            children: "4-7 days"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 399,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "7+",
                                            children: "7+ days"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 400,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "45+",
                                            children: "45+ days (Overdue)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 401,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 390,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        (searchQuery || filterUrgency !== 'all' || filterDaysPending !== 'all') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-ghost btn-small",
                            onClick: ()=>{
                                setSearchQuery('');
                                setFilterUrgency('all');
                                setFilterDaysPending('all');
                            },
                            style: {
                                fontSize: '13px',
                                padding: '10px 16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-xmark",
                                    style: {
                                        marginRight: '6px'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 414,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Clear Filters"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 405,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                    lineNumber: 367,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                lineNumber: 366,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-stats",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-check-circle",
                                style: {
                                    color: 'var(--admin-success)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 424,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            "₹",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(summaryStats.totalPaid)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 426,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Total Paid"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 427,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.85rem',
                                            marginTop: '0.25rem',
                                            color: 'var(--admin-text-light)'
                                        },
                                        children: [
                                            summaryStats.totalPaidCount,
                                            " orders"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 428,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 425,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 423,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-exclamation-triangle",
                                style: {
                                    color: 'var(--admin-warning)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 440,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            "₹",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(summaryStats.pending)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 445,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Pending"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 446,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.85rem',
                                            marginTop: '0.25rem',
                                            color: 'var(--admin-text-light)'
                                        },
                                        children: [
                                            summaryStats.pendingCount,
                                            " orders"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 447,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 444,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-times-circle",
                                style: {
                                    color: 'var(--admin-danger)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 459,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            "₹",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(summaryStats.overdue)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 461,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Overdue"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 462,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.85rem',
                                            marginTop: '0.25rem',
                                            color: 'var(--admin-text-light)'
                                        },
                                        children: [
                                            summaryStats.overdueCount,
                                            " orders"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 463,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 460,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 458,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-calendar-alt",
                                style: {
                                    color: 'var(--admin-accent)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            "₹",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(summaryStats.thisMonth)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 477,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "This Month"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 478,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.85rem',
                                            marginTop: '0.25rem',
                                            color: 'var(--admin-text-light)'
                                        },
                                        children: [
                                            summaryStats.thisMonthCount,
                                            " orders"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 479,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                lineNumber: 422,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card margin-bottom-24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "dashboard-section-title",
                                style: {
                                    marginBottom: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-exclamation-triangle",
                                        style: {
                                            fontSize: '1rem',
                                            opacity: 0.7,
                                            color: 'var(--admin-danger)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 503,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Pending Payments ",
                                    pendingPayments.filter((p)=>p.isUrgent).length > 0 && '(Urgent)'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 502,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "action-buttons-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn btn-success btn-small",
                                        onClick: handleBulkMarkAsPaid,
                                        children: "Mark All as Paid"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 510,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn btn-secondary btn-small",
                                        children: "Send Bulk Reminder"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 513,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 509,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 494,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    pendingPayments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "empty-state",
                        style: {
                            padding: '48px',
                            textAlign: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-check-circle",
                                style: {
                                    fontSize: '64px',
                                    color: 'var(--admin-success)',
                                    marginBottom: '16px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 519,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "No pending payments"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 523,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: 'var(--admin-text-light)',
                                    fontSize: '0.9rem'
                                },
                                children: "All orders are paid!"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 524,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 518,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 533,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Address"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 534,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Amount"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 535,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Days Pending"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 536,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Order ID"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 537,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Action"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 538,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 532,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 531,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: pendingPayments.map((order, idx)=>{
                                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(// Never use createdAt (today's date) as fallback - only use actual order date
                                        order.orderDate || order.date || order.order_date || null);
                                        const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateMonthDay"])(orderDate);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            style: {
                                                background: order.isUrgent ? 'var(--admin-danger-light)' : 'transparent'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: dateStr
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                    lineNumber: 556,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: order.deliveryAddress || order.customerAddress || order.address || 'N/A'
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                    lineNumber: 557,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    style: {
                                                        fontWeight: '700',
                                                        color: 'var(--admin-accent)'
                                                    },
                                                    children: [
                                                        "₹",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total || order.totalAmount || 0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                    lineNumber: 560,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `badge ${order.isUrgent ? 'badge-danger' : 'badge-warning'}`,
                                                        children: [
                                                            order.daysPending,
                                                            " days ",
                                                            order.isUrgent && '⚠️'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 564,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                    lineNumber: 563,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "monospace-text",
                                                    children: order.orderId || 'N/A'
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                    lineNumber: 570,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            gap: '8px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "btn btn-success btn-small",
                                                                onClick: ()=>handleMarkAsPaid(order._id || order.orderId),
                                                                title: "Mark as Paid",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fa-solid fa-check"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                        lineNumber: 578,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Paid"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 573,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "btn btn-secondary btn-small",
                                                                onClick: ()=>{
                                                                    setSelectedOrder(order);
                                                                    setShowReminderModal(true);
                                                                },
                                                                title: "Send Reminder",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fa-solid fa-bell"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                        lineNumber: 588,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Remind"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 580,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 572,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                    lineNumber: 571,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, order._id || order.orderId || idx, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 550,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0));
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 541,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 530,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 529,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                lineNumber: 493,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-grid-layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-grid-item two-thirds",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "dashboard-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "dashboard-section-title",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-chart-area",
                                            style: {
                                                fontSize: '1rem',
                                                opacity: 0.7
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 607,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Payment Collection Timeline (30 days)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 606,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '16px',
                                        borderTop: '2px solid var(--admin-border)',
                                        marginTop: '0.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                gap: '0.5rem',
                                                minHeight: '200px',
                                                marginBottom: '16px'
                                            },
                                            children: paymentTimeline.map((day, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        flex: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    },
                                                    title: `${day.date}: ₹${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(day.collection)} (${day.orders} orders)`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: '100%',
                                                                height: `${day.collection / maxTimelineCollection * 180}px`,
                                                                minHeight: '4px',
                                                                background: 'var(--admin-success, #16a34a)',
                                                                borderRadius: '4px 4px 0 0',
                                                                cursor: 'pointer',
                                                                transition: 'opacity 0.2s ease'
                                                            },
                                                            onMouseEnter: (e)=>e.target.style.opacity = '0.8',
                                                            onMouseLeave: (e)=>e.target.style.opacity = '1'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                            lineNumber: 638,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        idx % 5 === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '0.7rem',
                                                                color: 'var(--admin-text-light)',
                                                                fontWeight: '500'
                                                            },
                                                            children: day.date.split(' ')[0]
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                            lineNumber: 652,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                    lineNumber: 627,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 617,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'center',
                                                color: 'var(--admin-text-secondary)',
                                                fontSize: '0.9rem'
                                            },
                                            children: [
                                                "Avg collection time: ",
                                                avgCollectionTime,
                                                " days"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 665,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 610,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 605,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 604,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-grid-item third-width",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "dashboard-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "dashboard-section-title",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-chart-pie",
                                            style: {
                                                fontSize: '1rem',
                                                opacity: 0.7
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 682,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Payment Mode Breakdown"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 681,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '16px',
                                        borderTop: '2px solid var(--admin-border)',
                                        marginTop: '0.5rem'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px'
                                        },
                                        children: paymentModePerformance.map((mode, idx)=>{
                                            // Calculate percentage: (amount / total) * 100, with accuracy based on total records / 100
                                            const percentage = totalPaymentAmount > 0 ? Math.min(100, parseFloat((mode.amount / totalPaymentAmount * 100).toFixed(2))) : 0;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '8px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontWeight: '600',
                                                                    color: 'var(--admin-text)'
                                                                },
                                                                children: mode.mode
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 712,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontWeight: '700',
                                                                    color: 'var(--admin-accent)',
                                                                    fontSize: '1rem'
                                                                },
                                                                children: [
                                                                    percentage.toFixed(0),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 715,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 704,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '0.9rem',
                                                            color: 'var(--admin-text-secondary)',
                                                            marginBottom: '4px'
                                                        },
                                                        children: [
                                                            "₹",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(mode.amount),
                                                            " (",
                                                            mode.count,
                                                            " orders)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 725,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: '100%',
                                                            height: '20px',
                                                            background: 'var(--admin-glass-border)',
                                                            borderRadius: '10px',
                                                            overflow: 'hidden'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: `${percentage}%`,
                                                                height: '100%',
                                                                background: 'var(--admin-accent, #449031)',
                                                                borderRadius: '10px',
                                                                transition: 'width 0.5s ease'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                            lineNumber: 743,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 734,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 703,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0));
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 692,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 685,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 680,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                        lineNumber: 679,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                lineNumber: 602,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showReminderModal && selectedOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                onClick: ()=>setShowReminderModal(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-container",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Send Payment Reminder"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 767,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "modal-close",
                                    onClick: ()=>setShowReminderModal(false),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-times"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 769,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 768,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 766,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "To"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 775,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: selectedOrder.deliveryAddress || selectedOrder.customerAddress || selectedOrder.address || 'N/A',
                                                readOnly: true
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 776,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 774,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Amount"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 789,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: `₹${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedOrder.total || selectedOrder.totalAmount || 0)}`,
                                                readOnly: true
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 790,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 788,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Order"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 800,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: selectedOrder.orderId || 'N/A',
                                                readOnly: true
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 801,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 799,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Message Template"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 809,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "input-field",
                                                value: reminderTemplate,
                                                onChange: (e)=>setReminderTemplate(e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "friendly",
                                                        children: "Friendly Reminder"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 815,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "urgent",
                                                        children: "Urgent Reminder"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 816,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "final",
                                                        children: "Final Notice"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 817,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 810,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 808,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Message Preview"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 821,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: '16px',
                                                    background: 'var(--admin-glass-bg)',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--admin-glass-border)',
                                                    minHeight: '80px'
                                                },
                                                children: [
                                                    reminderTemplate === 'friendly' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "Hi, this is a friendly reminder for your pending payment of ₹",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedOrder.total || selectedOrder.totalAmount || 0),
                                                            " for order ",
                                                            selectedOrder.orderId || 'N/A',
                                                            "."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 832,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    reminderTemplate === 'urgent' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "Urgent: Your payment of ₹",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedOrder.total || selectedOrder.totalAmount || 0),
                                                            " for order ",
                                                            selectedOrder.orderId || 'N/A',
                                                            " is overdue. Please settle at your earliest convenience."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 839,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    reminderTemplate === 'final' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "Final Notice: Your payment of ₹",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedOrder.total || selectedOrder.totalAmount || 0),
                                                            " for order ",
                                                            selectedOrder.orderId || 'N/A',
                                                            " is long overdue. Please contact us immediately."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 847,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 822,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 820,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Send via"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 857,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '12px',
                                                    marginTop: '8px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            cursor: 'pointer'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: sendViaSMS,
                                                                onChange: (e)=>setSendViaSMS(e.target.checked)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 874,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "SMS"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 879,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 866,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            cursor: 'pointer'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: sendViaWhatsApp,
                                                                onChange: (e)=>setSendViaWhatsApp(e.target.checked)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 889,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "WhatsApp"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 894,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 881,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            cursor: 'pointer'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: sendViaEmail,
                                                                onChange: (e)=>setSendViaEmail(e.target.checked)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 904,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Email"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                                lineNumber: 909,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                        lineNumber: 896,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                                lineNumber: 858,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                        lineNumber: 856,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                lineNumber: 773,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 772,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-ghost",
                                    onClick: ()=>setShowReminderModal(false),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 916,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary",
                                    onClick: handleSendReminder,
                                    disabled: !sendViaSMS && !sendViaWhatsApp && !sendViaEmail,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-paper-plane"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                            lineNumber: 924,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " Send"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                                    lineNumber: 919,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                            lineNumber: 915,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                    lineNumber: 765,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
                lineNumber: 764,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx",
        lineNumber: 363,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PendingAmountsTab, "pN80LDcFNvB7T1yWzYjpJP5Hutc=");
_c = PendingAmountsTab;
const __TURBOPACK__default__export__ = PendingAmountsTab;
var _c;
__turbopack_context__.k.register(_c, "PendingAmountsTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_components_admin_PendingAmountsTab_jsx_18aaad29._.js.map