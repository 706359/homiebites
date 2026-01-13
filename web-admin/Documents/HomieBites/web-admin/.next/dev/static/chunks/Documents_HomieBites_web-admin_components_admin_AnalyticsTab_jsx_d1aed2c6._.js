(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
const AnalyticsTab = ({ orders = [], loading = false, onViewDayDetails })=>{
    _s();
    const [period, setPeriod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('thisMonth'); // 'thisMonth', 'thisYear', 'custom'
    const [customFrom, setCustomFrom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [customTo, setCustomTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const now = new Date();
    // Get filtered orders based on period
    const periodOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsTab.useMemo[periodOrders]": ()=>{
            switch(period){
                case 'thisMonth':
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredOrdersByDate"])(orders, 'month', '', '');
                case 'thisYear':
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredOrdersByDate"])(orders, 'year', '', '');
                case 'custom':
                    {
                        if (!customFrom || !customTo) return orders;
                        const from = new Date(customFrom);
                        const to = new Date(customTo);
                        to.setHours(23, 59, 59, 999);
                        return orders.filter({
                            "AnalyticsTab.useMemo[periodOrders]": (o)=>{
                                try {
                                    // Never use createdAt (today's date) as fallback - only use actual order date
                                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                                    return orderDate >= from && orderDate <= to;
                                } catch (e) {
                                    return false;
                                }
                            }
                        }["AnalyticsTab.useMemo[periodOrders]"]);
                    }
                default:
                    return orders;
            }
        }
    }["AnalyticsTab.useMemo[periodOrders]"], [
        orders,
        period,
        customFrom,
        customTo
    ]);
    // Key Metrics - Only Important Ones
    const keyMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsTab.useMemo[keyMetrics]": ()=>{
            const totalRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(periodOrders);
            const totalOrders = periodOrders.length;
            // Calculate growth rate for indicator
            let previousPeriodOrders = [];
            if (period === 'thisMonth') {
                const lastMonth = new Date(now);
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                previousPeriodOrders = orders.filter({
                    "AnalyticsTab.useMemo[keyMetrics]": (o)=>{
                        try {
                            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                            if (!orderDate) return false;
                            return orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear();
                        } catch (e) {
                            return false;
                        }
                    }
                }["AnalyticsTab.useMemo[keyMetrics]"]);
            } else if (period === 'thisYear') {
                const lastYear = now.getFullYear() - 1;
                previousPeriodOrders = orders.filter({
                    "AnalyticsTab.useMemo[keyMetrics]": (o)=>{
                        try {
                            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                            if (!orderDate) return false;
                            return orderDate.getFullYear() === lastYear;
                        } catch (e) {
                            return false;
                        }
                    }
                }["AnalyticsTab.useMemo[keyMetrics]"]);
            }
            const previousRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(previousPeriodOrders);
            const growthRate = previousRevenue > 0 ? (totalRevenue - previousRevenue) / previousRevenue * 100 : totalRevenue > 0 ? Infinity : 0;
            const pendingOrders = periodOrders.filter({
                "AnalyticsTab.useMemo[keyMetrics].pendingOrders": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status)
            }["AnalyticsTab.useMemo[keyMetrics].pendingOrders"]);
            const pendingAmount = pendingOrders.reduce({
                "AnalyticsTab.useMemo[keyMetrics].pendingAmount": (sum, o)=>{
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
                    return sum + (isNaN(amount) ? 0 : amount);
                }
            }["AnalyticsTab.useMemo[keyMetrics].pendingAmount"], 0);
            // Total customers (unique addresses)
            const uniqueAddresses = new Set(periodOrders.map({
                "AnalyticsTab.useMemo[keyMetrics]": (o)=>o.deliveryAddress || o.customerAddress || o.address
            }["AnalyticsTab.useMemo[keyMetrics]"]).filter(Boolean));
            const totalCustomers = uniqueAddresses.size;
            // Average order value
            const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
            // Calculate profit statistics
            const profitStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfitStats"])(totalRevenue, 70, 30);
            return {
                totalRevenue,
                totalOrders,
                pendingAmount,
                pendingOrdersCount: pendingOrders.length,
                totalCustomers,
                avgOrderValue,
                growthRate,
                profitStats
            };
        }
    }["AnalyticsTab.useMemo[keyMetrics]"], [
        periodOrders,
        orders,
        period,
        now
    ]);
    // Monthly Revenue Trend (Last 12 Months from most recent order date)
    const monthlyRevenueTrend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsTab.useMemo[monthlyRevenueTrend]": ()=>{
            // Find the most recent order date to determine the end date for "last 12 months"
            let mostRecentDate = now;
            const validOrders = orders.filter({
                "AnalyticsTab.useMemo[monthlyRevenueTrend].validOrders": (o)=>{
                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                    return orderDate !== null;
                }
            }["AnalyticsTab.useMemo[monthlyRevenueTrend].validOrders"]);
            if (validOrders.length > 0) {
                const dates = validOrders.map({
                    "AnalyticsTab.useMemo[monthlyRevenueTrend].dates": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null)
                }["AnalyticsTab.useMemo[monthlyRevenueTrend].dates"]).filter(Boolean);
                if (dates.length > 0) {
                    mostRecentDate = new Date(Math.max(...dates.map({
                        "AnalyticsTab.useMemo[monthlyRevenueTrend]": (d)=>d.getTime()
                    }["AnalyticsTab.useMemo[monthlyRevenueTrend]"])));
                }
            }
            const trend = [];
            for(let i = 11; i >= 0; i--){
                const date = new Date(mostRecentDate);
                date.setMonth(date.getMonth() - i);
                date.setDate(1);
                date.setHours(0, 0, 0, 0);
                const nextMonth = new Date(date);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                const monthOrders = orders.filter({
                    "AnalyticsTab.useMemo[monthlyRevenueTrend].monthOrders": (o)=>{
                        try {
                            // Never use createdAt (today's date) as fallback - only use actual order date
                            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                            if (!orderDate) return false;
                            return orderDate >= date && orderDate < nextMonth;
                        } catch (e) {
                            return false;
                        }
                    }
                }["AnalyticsTab.useMemo[monthlyRevenueTrend].monthOrders"]);
                const monthName = date.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                });
                trend.push({
                    month: monthName,
                    revenue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(monthOrders),
                    orders: monthOrders.length
                });
            }
            return trend;
        }
    }["AnalyticsTab.useMemo[monthlyRevenueTrend]"], [
        orders
    ]);
    const maxMonthlyRevenue = Math.max(...monthlyRevenueTrend.map((m)=>m.revenue), 1);
    const peakMonth = monthlyRevenueTrend.reduce((max, m)=>m.revenue > max.revenue ? m : max, monthlyRevenueTrend[0]);
    // Top 10 Delivery Areas
    const topAreas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsTab.useMemo[topAreas]": ()=>{
            const areaStats = {};
            periodOrders.forEach({
                "AnalyticsTab.useMemo[topAreas]": (o)=>{
                    const addr = o.deliveryAddress || o.customerAddress || o.address;
                    if (addr) {
                        if (!areaStats[addr]) {
                            areaStats[addr] = {
                                address: addr,
                                orders: 0,
                                revenue: 0
                            };
                        }
                        areaStats[addr].orders++;
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
                        areaStats[addr].revenue += isNaN(amount) ? 0 : amount;
                    }
                }
            }["AnalyticsTab.useMemo[topAreas]"]);
            return Object.values(areaStats).sort({
                "AnalyticsTab.useMemo[topAreas]": (a, b)=>b.revenue - a.revenue
            }["AnalyticsTab.useMemo[topAreas]"]).slice(0, 10);
        }
    }["AnalyticsTab.useMemo[topAreas]"], [
        periodOrders
    ]);
    const maxAreaRevenue = Math.max(...topAreas.map((a)=>a.revenue), 1);
    // Orders by Day of Week
    const ordersByDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsTab.useMemo[ordersByDay]": ()=>{
            const days = [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat'
            ];
            const dayStats = {
                Sun: 0,
                Mon: 0,
                Tue: 0,
                Wed: 0,
                Thu: 0,
                Fri: 0,
                Sat: 0
            };
            periodOrders.forEach({
                "AnalyticsTab.useMemo[ordersByDay]": (o)=>{
                    try {
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.createdAt || o.date || o.order_date);
                        if (!orderDate) return;
                        const dayName = days[orderDate.getDay()];
                        dayStats[dayName]++;
                    } catch (e) {
                    // Ignore
                    }
                }
            }["AnalyticsTab.useMemo[ordersByDay]"]);
            return days.map({
                "AnalyticsTab.useMemo[ordersByDay]": (day)=>({
                        day,
                        count: dayStats[day]
                    })
            }["AnalyticsTab.useMemo[ordersByDay]"]);
        }
    }["AnalyticsTab.useMemo[ordersByDay]"], [
        periodOrders
    ]);
    const maxDayOrders = Math.max(...ordersByDay.map((d)=>d.count), 1);
    // Order Frequency Distribution
    const frequencyDistribution = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsTab.useMemo[frequencyDistribution]": ()=>{
            const customerData = {};
            periodOrders.forEach({
                "AnalyticsTab.useMemo[frequencyDistribution]": (o)=>{
                    const addr = o.deliveryAddress || o.customerAddress || o.address;
                    if (addr) {
                        if (!customerData[addr]) {
                            customerData[addr] = {
                                orders: 0,
                                spent: 0
                            };
                        }
                        customerData[addr].orders++;
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
                        customerData[addr].spent += isNaN(amount) ? 0 : amount;
                    }
                }
            }["AnalyticsTab.useMemo[frequencyDistribution]"]);
            // Customer segmentation based on spending:
            // New: < ₹2,000
            // Regular: ₹2,000 - ₹7,999
            // VIP: ≥ ₹8,000
            // Super VIP: ≥ ₹15,000
            const oneTime = Object.values(customerData).filter({
                "AnalyticsTab.useMemo[frequencyDistribution]": (c)=>c.orders === 1
            }["AnalyticsTab.useMemo[frequencyDistribution]"]).length;
            const regular = Object.values(customerData).filter({
                "AnalyticsTab.useMemo[frequencyDistribution]": (c)=>c.spent >= 2000 && c.spent < 8000
            }["AnalyticsTab.useMemo[frequencyDistribution]"]).length;
            const vip = Object.values(customerData).filter({
                "AnalyticsTab.useMemo[frequencyDistribution]": (c)=>c.spent >= 8000 && c.spent < 15000
            }["AnalyticsTab.useMemo[frequencyDistribution]"]).length;
            const superVip = Object.values(customerData).filter({
                "AnalyticsTab.useMemo[frequencyDistribution]": (c)=>c.spent >= 15000
            }["AnalyticsTab.useMemo[frequencyDistribution]"]).length;
            return {
                oneTime,
                regular,
                vip,
                superVip
            };
        }
    }["AnalyticsTab.useMemo[frequencyDistribution]"], [
        periodOrders
    ]);
    // Payment Mode Trends
    const paymentTrends = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsTab.useMemo[paymentTrends]": ()=>{
            const trends = {};
            periodOrders.forEach({
                "AnalyticsTab.useMemo[paymentTrends]": (o)=>{
                    const mode = o.paymentMode || 'Not Set';
                    if (!trends[mode]) {
                        trends[mode] = {
                            count: 0,
                            amount: 0
                        };
                    }
                    trends[mode].count++;
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
                    trends[mode].amount += isNaN(amount) ? 0 : amount;
                }
            }["AnalyticsTab.useMemo[paymentTrends]"]);
            return Object.entries(trends).map({
                "AnalyticsTab.useMemo[paymentTrends]": ([mode, stats])=>({
                        mode,
                        ...stats
                    })
            }["AnalyticsTab.useMemo[paymentTrends]"]).sort({
                "AnalyticsTab.useMemo[paymentTrends]": (a, b)=>b.amount - a.amount
            }["AnalyticsTab.useMemo[paymentTrends]"]);
        }
    }["AnalyticsTab.useMemo[paymentTrends]"], [
        periodOrders
    ]);
    const totalPaymentAmount = paymentTrends.reduce((sum, t)=>sum + t.amount, 0);
    // Top 7 Days All Time by Revenue
    const top20Days = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsTab.useMemo[top20Days]": ()=>{
            const dayStats = {};
            // Group orders by date and sum amounts
            orders.forEach({
                "AnalyticsTab.useMemo[top20Days]": (o)=>{
                    try {
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                        if (!orderDate) return;
                        // Create a date key (YYYY-MM-DD format)
                        const dateKey = orderDate.toISOString().split('T')[0];
                        if (!dayStats[dateKey]) {
                            dayStats[dateKey] = {
                                date: dateKey,
                                dateObj: orderDate,
                                revenue: 0,
                                orders: 0,
                                orderIds: []
                            };
                        }
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
                        dayStats[dateKey].revenue += isNaN(amount) ? 0 : amount;
                        dayStats[dateKey].orders += 1;
                        // Store order ID if available
                        if (o.orderId || o._id) {
                            dayStats[dateKey].orderIds.push(o.orderId || o._id);
                        }
                    } catch (e) {
                    // Ignore invalid dates
                    }
                }
            }["AnalyticsTab.useMemo[top20Days]"]);
            // Convert to array, sort by revenue descending, and take top 7
            return Object.values(dayStats).sort({
                "AnalyticsTab.useMemo[top20Days]": (a, b)=>b.revenue - a.revenue
            }["AnalyticsTab.useMemo[top20Days]"]).slice(0, 7).map({
                "AnalyticsTab.useMemo[top20Days]": (day)=>({
                        ...day,
                        formattedDate: day.dateObj.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }),
                        shortDate: day.dateObj.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })
                    })
            }["AnalyticsTab.useMemo[top20Days]"]);
        }
    }["AnalyticsTab.useMemo[top20Days]"], [
        orders
    ]);
    const maxDayRevenue = Math.max(...top20Days.map((d)=>d.revenue), 1);
    // Helper function to escape CSV values
    const escapeCSV = (value)=>{
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };
    const getOrderAmount = (order)=>{
        let amount = null;
        if (order.totalAmount !== undefined && order.totalAmount !== null) {
            amount = parseFloat(order.totalAmount);
        } else if (order.total !== undefined && order.total !== null) {
            amount = parseFloat(order.total);
        }
        if (amount === null || isNaN(amount)) {
            const qty = parseFloat(order.quantity || 1);
            const price = parseFloat(order.unitPrice || 0);
            amount = qty * price;
        }
        return isNaN(amount) ? 0 : amount;
    };
    // Export reports
    const handleExportReport = (type)=>{
        let csvContent = '';
        const reportDate = new Date().toISOString().split('T')[0];
        if (type === 'monthly') {
            // Monthly Report - Last 12 months
            csvContent = 'Month,Year,Revenue (₹),Orders,Average Order Value (₹)\n';
            monthlyRevenueTrend.forEach((m)=>{
                const avgOrderValue = m.orders > 0 ? (m.revenue / m.orders).toFixed(2) : '0.00';
                csvContent += `${escapeCSV(m.month)},${escapeCSV(m.revenue)},${escapeCSV(m.orders)},${escapeCSV(avgOrderValue)}\n`;
            });
        } else if (type === 'quarterly') {
            // Quarterly Report - Last 4 quarters
            csvContent = 'Quarter,Year,Revenue (₹),Orders,Average Order Value (₹)\n';
            const quarters = [];
            // Get all unique years from orders
            const years = new Set();
            orders.forEach((o)=>{
                try {
                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                    if (orderDate) years.add(orderDate.getFullYear());
                } catch (e) {
                // Ignore
                }
            });
            const sortedYears = Array.from(years).sort((a, b)=>b - a);
            // Process last 4 quarters from most recent year
            const mostRecentYear = sortedYears.length > 0 ? sortedYears[0] : now.getFullYear();
            for(let i = 3; i >= 0; i--){
                const quarterStart = new Date(mostRecentYear, i * 3, 1);
                const quarterEnd = new Date(mostRecentYear, (i + 1) * 3, 0);
                quarterEnd.setHours(23, 59, 59, 999);
                const quarterOrders = orders.filter((o)=>{
                    try {
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                        if (!orderDate) return false;
                        return orderDate >= quarterStart && orderDate <= quarterEnd;
                    } catch (e) {
                        return false;
                    }
                });
                const revenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(quarterOrders);
                const orderCount = quarterOrders.length;
                const avgOrderValue = orderCount > 0 ? (revenue / orderCount).toFixed(2) : '0.00';
                quarters.push({
                    quarter: `Q${i + 1}`,
                    year: mostRecentYear,
                    revenue: revenue.toFixed(2),
                    orders: orderCount,
                    avgOrderValue
                });
            }
            quarters.forEach((q)=>{
                csvContent += `${escapeCSV(q.quarter)},${escapeCSV(q.year)},${escapeCSV(q.revenue)},${escapeCSV(q.orders)},${escapeCSV(q.avgOrderValue)}\n`;
            });
        } else if (type === 'annual') {
            // Annual Report - All years
            csvContent = 'Year,Revenue (₹),Orders,Average Order Value (₹),Paid Orders,Unpaid Orders,Paid Amount (₹),Unpaid Amount (₹)\n';
            const years = {};
            orders.forEach((o)=>{
                try {
                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                    if (!orderDate) return;
                    const year = orderDate.getFullYear();
                    if (!years[year]) {
                        years[year] = {
                            year,
                            revenue: 0,
                            orders: 0,
                            paidOrders: 0,
                            unpaidOrders: 0,
                            paidAmount: 0,
                            unpaidAmount: 0
                        };
                    }
                    const amount = getOrderAmount(o);
                    years[year].revenue += amount;
                    years[year].orders++;
                    const status = (o.status || '').toLowerCase();
                    if (status === 'paid') {
                        years[year].paidOrders++;
                        years[year].paidAmount += amount;
                    } else {
                        years[year].unpaidOrders++;
                        years[year].unpaidAmount += amount;
                    }
                } catch (e) {
                // Ignore
                }
            });
            Object.values(years).sort((a, b)=>b.year - a.year).forEach((y)=>{
                const avgOrderValue = y.orders > 0 ? (y.revenue / y.orders).toFixed(2) : '0.00';
                csvContent += `${escapeCSV(y.year)},${escapeCSV(y.revenue.toFixed(2))},${escapeCSV(y.orders)},${escapeCSV(avgOrderValue)},${escapeCSV(y.paidOrders)},${escapeCSV(y.unpaidOrders)},${escapeCSV(y.paidAmount.toFixed(2))},${escapeCSV(y.unpaidAmount.toFixed(2))}\n`;
            });
        }
        // Add BOM for Excel compatibility
        const BOM = '\uFEFF';
        const blob = new Blob([
            BOM + csvContent
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${type}_report_${reportDate}.csv`;
        link.click();
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "dashboard-header",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Analytics"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                        lineNumber: 529,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                    lineNumber: 528,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    message: "Loading analytics...",
                    size: "large"
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                    lineNumber: 531,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
            lineNumber: 527,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-content",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "dashboard-with-sidebar",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-main-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-card dashboard-card-spaced",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "filter-container",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "filter-field-group-standard min-width-160",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "filter-label-standard",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-calendar-alt filter-label-icon"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 545,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Time Period"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 544,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "input-field filter-input-standard",
                                            value: period,
                                            onChange: (e)=>setPeriod(e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "thisMonth",
                                                    children: "This Month"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 553,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "thisYear",
                                                    children: "This Year"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 554,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "custom",
                                                    children: "Custom Range"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 555,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 548,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                    lineNumber: 543,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                period === 'custom' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "filter-field-group-standard min-width-160",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "filter-label-standard",
                                                    children: "From Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 561,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    className: "input-field filter-input-standard",
                                                    value: customFrom,
                                                    onChange: (e)=>setCustomFrom(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 562,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 560,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "filter-field-group-standard min-width-160",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "filter-label-standard",
                                                    children: "To Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 570,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    className: "input-field filter-input-standard",
                                                    value: customTo,
                                                    onChange: (e)=>setCustomTo(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 571,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 569,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                            lineNumber: 542,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                        lineNumber: 541,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-stats",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-rupee-sign"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 586,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "₹",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(keyMetrics.totalRevenue)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 588,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Total Revenue"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 589,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            keyMetrics.growthRate !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: keyMetrics.growthRate === Infinity ? 'New ↑' : `${keyMetrics.growthRate >= 0 ? '+' : ''}${keyMetrics.growthRate.toFixed(1)}% ${keyMetrics.growthRate >= 0 ? '↑' : '↓'}`
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 591,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 587,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 585,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-shopping-cart",
                                        style: {
                                            color: 'var(--admin-accent)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 600,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: keyMetrics.totalOrders
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 602,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Total Orders"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 603,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: period === 'thisMonth' ? 'Current month' : period === 'thisYear' ? 'This year' : 'Selected period'
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 604,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 601,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 599,
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
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 610,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "₹",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(keyMetrics.pendingAmount)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 612,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Pending Payments"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 613,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: [
                                                    keyMetrics.pendingOrdersCount,
                                                    " ",
                                                    keyMetrics.pendingOrdersCount === 1 ? 'order' : 'orders'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 614,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 611,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 609,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-users",
                                        style: {
                                            color: 'var(--admin-accent)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 620,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: keyMetrics.totalCustomers
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 622,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Total Customers"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 623,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: "Unique addresses"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 624,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 621,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 619,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-chart-line",
                                        style: {
                                            color: 'var(--admin-success)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 630,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "₹",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(keyMetrics.avgOrderValue)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 632,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Avg Order Value"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 633,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 631,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 629,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-chart-line stat-card-icon-success"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 637,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "₹",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(keyMetrics.profitStats.profit)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 639,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Profit After Expenses"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 640,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: [
                                                    keyMetrics.profitStats.profitMarginPercent.toFixed(1),
                                                    "% margin"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 641,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 638,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 636,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-percent stat-card-icon-secondary"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 647,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    keyMetrics.profitStats.profitMarginPercent.toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 649,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Profit Margin"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 650,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: [
                                                    "Target: ",
                                                    keyMetrics.profitStats.targetProfitMargin,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 651,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                        lineNumber: 648,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 646,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                        lineNumber: 584,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-grid-layout",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-grid-item full-width",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "dashboard-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "dashboard-section-title",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-chart-line",
                                                    style: {
                                                        fontSize: '1rem',
                                                        opacity: 0.7
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 664,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Monthly Revenue Trend (Last 12M)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 663,
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
                                                        gap: '1rem',
                                                        minHeight: '200px',
                                                        marginBottom: '16px'
                                                    },
                                                    children: monthlyRevenueTrend.map((month, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                flex: 1,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                gap: '0.5rem'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        width: '100%',
                                                                        maxWidth: '60px',
                                                                        height: `${month.revenue / maxMonthlyRevenue * 180}px`,
                                                                        minHeight: '10px',
                                                                        background: 'var(--admin-accent, #449031)',
                                                                        borderRadius: '8px 8px 0 0',
                                                                        display: 'flex',
                                                                        alignItems: 'flex-end',
                                                                        justifyContent: 'center',
                                                                        paddingBottom: '0.5rem',
                                                                        cursor: 'pointer',
                                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                                    },
                                                                    title: `${month.month}: ₹${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(month.revenue)} (${month.orders} orders)`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            color: 'white',
                                                                            fontSize: '0.7rem',
                                                                            fontWeight: '600'
                                                                        },
                                                                        children: [
                                                                            "₹",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumberIndian"])(month.revenue)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 713,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                    lineNumber: 694,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: '0.75rem',
                                                                        color: 'var(--admin-text-light)',
                                                                        textAlign: 'center',
                                                                        fontWeight: '500'
                                                                    },
                                                                    children: month.month
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                    lineNumber: 717,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                            lineNumber: 684,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 674,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        textAlign: 'center',
                                                        color: 'var(--admin-text-secondary)',
                                                        fontSize: '0.9rem'
                                                    },
                                                    children: [
                                                        "Peak: ₹",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(peakMonth.revenue),
                                                        " (",
                                                        peakMonth.month,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 730,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 667,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                    lineNumber: 662,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 661,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-grid-item full-width",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "dashboard-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "dashboard-section-title",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-map-marker-alt",
                                                    style: {
                                                        fontSize: '1rem',
                                                        opacity: 0.7
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 747,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Top 10 Delivery Areas"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 746,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: '16px',
                                                borderTop: '2px solid var(--admin-border)',
                                                marginTop: '0.5rem'
                                            },
                                            children: topAreas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    textAlign: 'center',
                                                    padding: '48px',
                                                    color: 'var(--admin-text-light)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fa-solid fa-inbox",
                                                        style: {
                                                            fontSize: '48px',
                                                            opacity: 0.3
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                        lineNumber: 768,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            marginTop: '16px'
                                                        },
                                                        children: "No delivery areas found"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                        lineNumber: 769,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 761,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '12px'
                                                },
                                                children: topAreas.map((area, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '8px',
                                                            padding: '12px',
                                                            background: idx % 2 === 0 ? 'transparent' : 'var(--admin-glass-border)',
                                                            borderRadius: '8px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontWeight: '600',
                                                                            color: 'var(--admin-text)',
                                                                            fontSize: '0.95rem'
                                                                        },
                                                                        children: [
                                                                            idx + 1,
                                                                            ". ",
                                                                            area.address
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 792,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontWeight: '700',
                                                                            color: 'var(--admin-accent)',
                                                                            fontSize: '0.95rem'
                                                                        },
                                                                        children: [
                                                                            "₹",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(area.revenue),
                                                                            " (",
                                                                            area.orders,
                                                                            ' ',
                                                                            area.orders === 1 ? 'order' : 'orders',
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 801,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                lineNumber: 785,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    width: '100%',
                                                                    height: '20px',
                                                                    background: 'var(--admin-glass-border)',
                                                                    borderRadius: '10px',
                                                                    overflow: 'hidden',
                                                                    position: 'relative'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        width: `${maxAreaRevenue > 0 ? area.revenue / maxAreaRevenue * 100 : 0}%`,
                                                                        height: '100%',
                                                                        background: 'var(--admin-accent, #449031)',
                                                                        borderRadius: '10px',
                                                                        transition: 'width 0.5s ease',
                                                                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                    lineNumber: 822,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                lineNumber: 812,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                        lineNumber: 774,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 772,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 753,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                    lineNumber: 745,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 744,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-grid-item full-width",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "dashboard-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "dashboard-section-title",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-credit-card",
                                                    style: {
                                                        fontSize: '1rem',
                                                        opacity: 0.7
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 846,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Payment Mode Trends"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 845,
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
                                                    gap: '12px'
                                                },
                                                children: paymentTrends.map((trend, idx)=>{
                                                    // Calculate percentage: (amount / total) * 100, with accuracy based on total records / 100
                                                    const percentage = totalPaymentAmount > 0 ? Math.min(100, parseFloat((trend.amount / totalPaymentAmount * 100).toFixed(2))) : 0;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '6px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontWeight: '600',
                                                                            color: 'var(--admin-text)'
                                                                        },
                                                                        children: trend.mode
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 875,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontWeight: '700',
                                                                            color: 'var(--admin-accent)',
                                                                            fontSize: '1rem'
                                                                        },
                                                                        children: [
                                                                            "₹",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(trend.amount),
                                                                            " (",
                                                                            percentage.toFixed(2),
                                                                            "%)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 878,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                lineNumber: 868,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    width: '100%',
                                                                    height: '28px',
                                                                    background: 'var(--admin-glass-border)',
                                                                    borderRadius: '6px',
                                                                    overflow: 'hidden'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        width: `${percentage}%`,
                                                                        height: '100%',
                                                                        background: 'var(--admin-accent, #449031)',
                                                                        borderRadius: '6px',
                                                                        transition: 'width 0.5s ease',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'flex-end',
                                                                        paddingRight: '0.5rem'
                                                                    },
                                                                    children: percentage > 15 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            color: 'white',
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: '600'
                                                                        },
                                                                        children: [
                                                                            percentage.toFixed(0),
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 911,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                    lineNumber: 897,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                lineNumber: 888,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                        lineNumber: 867,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 856,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 849,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                    lineNumber: 844,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 843,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-grid-item full-width",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "dashboard-card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "dashboard-section-title",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-trophy",
                                                    style: {
                                                        fontSize: '1rem',
                                                        opacity: 0.7
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                    lineNumber: 931,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Top 7 Days All Time (By Revenue)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 930,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: '16px',
                                                borderTop: '2px solid var(--admin-border)',
                                                marginTop: '0.5rem'
                                            },
                                            children: top20Days.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    textAlign: 'center',
                                                    padding: '48px',
                                                    color: 'var(--admin-text-light)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fa-solid fa-inbox",
                                                        style: {
                                                            fontSize: '48px',
                                                            opacity: 0.3
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                        lineNumber: 949,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            marginTop: '16px'
                                                        },
                                                        children: "No orders data available"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                        lineNumber: 950,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                lineNumber: 942,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'flex-end',
                                                            gap: '0.5rem',
                                                            minHeight: '250px',
                                                            marginBottom: '16px',
                                                            overflowX: 'auto',
                                                            paddingBottom: '8px'
                                                        },
                                                        children: top20Days.map((day, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    flex: '1 1 0',
                                                                    minWidth: '60px',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            width: '100%',
                                                                            maxWidth: '80px',
                                                                            height: `${day.revenue / maxDayRevenue * 200}px`,
                                                                            minHeight: '10px',
                                                                            background: idx < 3 ? 'var(--admin-accent, #449031)' : 'var(--admin-accent, #449031)',
                                                                            borderRadius: '8px 8px 0 0',
                                                                            display: 'flex',
                                                                            alignItems: 'flex-end',
                                                                            justifyContent: 'center',
                                                                            paddingBottom: '0.5rem',
                                                                            cursor: 'pointer',
                                                                            boxShadow: idx < 3 ? '0 4px 12px rgba(68, 144, 49, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                            position: 'relative',
                                                                            transition: 'all 0.3s ease'
                                                                        },
                                                                        onClick: ()=>{
                                                                            if (onViewDayDetails) {
                                                                                onViewDayDetails(day.date);
                                                                            }
                                                                        },
                                                                        onMouseEnter: (e)=>{
                                                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                                                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(68, 144, 49, 0.4)';
                                                                        },
                                                                        onMouseLeave: (e)=>{
                                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                                            e.currentTarget.style.boxShadow = idx < 3 ? '0 4px 12px rgba(68, 144, 49, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)';
                                                                        },
                                                                        title: `Click to view orders for ${day.formattedDate}: ₹${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(day.revenue)} (${day.orders} ${day.orders === 1 ? 'order' : 'orders'})`,
                                                                        children: [
                                                                            idx < 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    position: 'absolute',
                                                                                    top: '-8px',
                                                                                    right: '-8px',
                                                                                    background: 'var(--admin-warning, #f59e0b)',
                                                                                    color: 'white',
                                                                                    borderRadius: '50%',
                                                                                    width: '24px',
                                                                                    height: '24px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    fontSize: '0.7rem',
                                                                                    fontWeight: '700',
                                                                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                                                                                },
                                                                                children: idx + 1
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                                lineNumber: 1019,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    color: 'white',
                                                                                    fontSize: '0.7rem',
                                                                                    fontWeight: '600',
                                                                                    textAlign: 'center',
                                                                                    lineHeight: '1.2'
                                                                                },
                                                                                children: [
                                                                                    "₹",
                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumberIndian"])(day.revenue)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                                lineNumber: 1040,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 977,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            alignItems: 'center',
                                                                            gap: '2px'
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: '0.7rem',
                                                                                    color: 'var(--admin-text-light)',
                                                                                    textAlign: 'center',
                                                                                    fontWeight: '500',
                                                                                    whiteSpace: 'nowrap'
                                                                                },
                                                                                children: day.shortDate
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                                lineNumber: 1060,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: '0.65rem',
                                                                                    color: 'var(--admin-text-secondary)',
                                                                                    textAlign: 'center'
                                                                                },
                                                                                children: [
                                                                                    day.orders,
                                                                                    " ",
                                                                                    day.orders === 1 ? 'order' : 'orders'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                                lineNumber: 1071,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 1052,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                lineNumber: 966,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                        lineNumber: 954,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '12px',
                                                            background: 'var(--admin-glass-border)',
                                                            borderRadius: '8px',
                                                            marginTop: '16px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '0.85rem',
                                                                            color: 'var(--admin-text-secondary)',
                                                                            fontWeight: '500'
                                                                        },
                                                                        children: "Total Revenue (Top 7 Days):"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 1096,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '1.1rem',
                                                                            color: 'var(--admin-accent)',
                                                                            fontWeight: '700',
                                                                            marginLeft: '8px'
                                                                        },
                                                                        children: [
                                                                            "₹",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(top20Days.reduce((sum, d)=>sum + d.revenue, 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 1105,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                lineNumber: 1095,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '0.85rem',
                                                                            color: 'var(--admin-text-secondary)',
                                                                            fontWeight: '500'
                                                                        },
                                                                        children: "Peak Day:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 1117,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: '1rem',
                                                                            color: 'var(--admin-text)',
                                                                            fontWeight: '600',
                                                                            marginLeft: '8px'
                                                                        },
                                                                        children: [
                                                                            top20Days[0]?.formattedDate,
                                                                            " (₹",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(top20Days[0]?.revenue || 0),
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                        lineNumber: 1126,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                                lineNumber: 1116,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                                        lineNumber: 1084,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                            lineNumber: 934,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                    lineNumber: 929,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                                lineNumber: 928,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                        lineNumber: 659,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
                lineNumber: 539,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
            lineNumber: 538,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx",
        lineNumber: 537,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AnalyticsTab, "a6CqcORxJ+Ne3kC2ifJi9CdWcEQ=");
_c = AnalyticsTab;
const __TURBOPACK__default__export__ = AnalyticsTab;
var _c;
__turbopack_context__.k.register(_c, "AnalyticsTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_components_admin_AnalyticsTab_jsx_d1aed2c6._.js.map