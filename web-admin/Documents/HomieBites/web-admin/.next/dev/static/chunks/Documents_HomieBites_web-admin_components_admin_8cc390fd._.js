(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
/**
 * Enterprise Loader Component
 * Features:
 * - Animated logo with blur/glow effect
 * - Clean, professional design
 * - Responsive design
 */ const PremiumLoader = ({ message = 'Loading...', size = 'large', showText = false })=>{
    const sizeClasses = {
        small: {
            container: '64px',
            logo: '120px',
            text: '0.85rem'
        },
        medium: {
            container: '80px',
            logo: '150px',
            text: '0.9rem'
        },
        large: {
            container: '100px',
            logo: '180px',
            text: '1rem'
        }
    };
    const dimensions = sizeClasses[size] || sizeClasses.large;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "premium-loader-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "premium-loader-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "premium-loader-logo-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/logo.png",
                            alt: "HomieBites",
                            className: "premium-loader-logo",
                            style: {
                                width: 'auto',
                                height: dimensions.logo,
                                maxWidth: '300px',
                                maxHeight: dimensions.logo,
                                objectFit: 'contain'
                            },
                            onError: (e)=>{
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "premium-loader-logo-fallback",
                            style: {
                                display: 'none',
                                width: 'auto',
                                minWidth: dimensions.logo,
                                height: dimensions.logo,
                                fontSize: `calc(${dimensions.logo} * 0.35)`,
                                fontWeight: '700',
                                letterSpacing: '0.02em'
                            },
                            children: "HomieBites"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "premium-loader-text",
                style: {
                    fontSize: dimensions.text
                },
                children: message
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx",
                lineNumber: 59,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = PremiumLoader;
const __TURBOPACK__default__export__ = PremiumLoader;
var _c;
__turbopack_context__.k.register(_c, "PremiumLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/utils/dateUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Comprehensive date parsing utility
 * Handles multiple date formats commonly used in the application
 */ /**
 * Parse a date value into a Date object
 * Supports multiple formats:
 * - ISO format (YYYY-MM-DD)
 * - DD-MMM-YY (e.g., "5-Feb-24")
 * - DD/MM/YYYY or DD/MM/YY
 * - DD-MM-YYYY or DD-MM-YY
 * - Standard JavaScript Date parsing
 *
 * @param {string|Date|number} dateValue - The date value to parse
 * @returns {Date|null} Parsed Date object or null if invalid
 */ __turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatDateMonthDay",
    ()=>formatDateMonthDay,
    "formatDateShort",
    ()=>formatDateShort,
    "parseOrderDate",
    ()=>parseOrderDate
]);
const parseOrderDate = (dateValue)=>{
    if (!dateValue) return null;
    try {
        // If it's already a Date object, return it
        if (dateValue instanceof Date) {
            return isNaN(dateValue.getTime()) ? null : dateValue;
        }
        const dateStr = String(dateValue).trim();
        // Handle ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)
        if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
            // Parse as UTC to avoid timezone conversion issues
            // If no timezone specified, treat as UTC midnight
            const isoStr = dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00Z';
            const date = new Date(isoStr);
            return isNaN(date.getTime()) ? null : date;
        }
        // Handle DD-MMM-YY format (e.g., "5-Feb-24", "15-Jan-2026")
        if (/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/i.test(dateStr)) {
            const parts = dateStr.split('-');
            const day = parseInt(parts[0], 10);
            const monthStr = parts[1].toLowerCase();
            let year = parseInt(parts[2], 10);
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
            const monthIndex = monthNames.findIndex((m)=>monthStr.startsWith(m));
            if (monthIndex !== -1 && day > 0 && day <= 31) {
                // Handle 2-digit years
                if (year < 100) {
                    year = year < 50 ? 2000 + year : 1900 + year;
                }
                const date = new Date(year, monthIndex, day);
                return isNaN(date.getTime()) ? null : date;
            }
        }
        // Handle DD/MM/YYYY or DD/MM/YY format
        if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
            const parts = dateStr.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            let year = parseInt(parts[2], 10);
            if (year < 100) {
                year = year < 50 ? 2000 + year : 1900 + year;
            }
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
        }
        // Handle DD-MM-YYYY or DD-MM-YY format
        if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(dateStr)) {
            const parts = dateStr.split('-');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            let year = parseInt(parts[2], 10);
            if (year < 100) {
                year = year < 50 ? 2000 + year : 1900 + year;
            }
            const date = new Date(year, month, day);
            return isNaN(date.getTime()) ? null : date;
        }
        // Try standard Date parsing as fallback
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date;
        }
        return null;
    } catch (e) {
        console.warn('Error parsing date:', dateValue, e);
        return null;
    }
};
const formatDate = (dateValue, options = {})=>{
    const date = parseOrderDate(dateValue);
    if (!date) return 'N/A';
    // Use UTC methods to avoid timezone conversion issues
    // Dates are stored in UTC in MongoDB, so we should display UTC dates
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    // If custom options provided, use toLocaleDateString
    if (Object.keys(options).length > 0) {
        const defaultOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
            ...options
        };
        return date.toLocaleDateString('en-US', defaultOptions);
    }
    return `${day}/${month}/${year}`;
};
const formatDateShort = (dateValue)=>{
    const date = parseOrderDate(dateValue);
    if (!date) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleDateString('en-US', {
        month: 'short'
    });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};
const formatDateMonthDay = (dateValue)=>{
    const date = parseOrderDate(dateValue);
    if (!date) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleDateString('en-US', {
        month: 'short'
    });
    return `${day} ${month}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Order-related utility functions and calculations
 */ /**
 * Format currency in Indian format (rupees only, no paisa)
 */ __turbopack_context__.s([
    "calculateTotalAmount",
    ()=>calculateTotalAmount,
    "createOrderKey",
    ()=>createOrderKey,
    "ensureAllOrdersHaveUniqueIds",
    ()=>ensureAllOrdersHaveUniqueIds,
    "extractBillingMonth",
    ()=>extractBillingMonth,
    "extractBillingYear",
    ()=>extractBillingYear,
    "extractOrderIdSequence",
    ()=>extractOrderIdSequence,
    "findOrderByKey",
    ()=>findOrderByKey,
    "formatBillingMonth",
    ()=>formatBillingMonth,
    "formatCurrency",
    ()=>formatCurrency,
    "formatNumberIndian",
    ()=>formatNumberIndian,
    "formatReferenceMonth",
    ()=>formatReferenceMonth,
    "getDeliveredRevenue",
    ()=>getDeliveredRevenue,
    "getLastOrderForAddress",
    ()=>getLastOrderForAddress,
    "getLastUnitPriceForAddress",
    ()=>getLastUnitPriceForAddress,
    "getOrderDateOnly",
    ()=>getOrderDateOnly,
    "getOrderYear",
    ()=>getOrderYear,
    "getTotalRevenue",
    ()=>getTotalRevenue,
    "getUniqueAddresses",
    ()=>getUniqueAddresses,
    "isPaidStatus",
    ()=>isPaidStatus,
    "isPendingStatus",
    ()=>isPendingStatus,
    "normalizeOrderDate",
    ()=>normalizeOrderDate,
    "normalizeStatus",
    ()=>normalizeStatus,
    "sortOrdersByOrderId",
    ()=>sortOrdersByOrderId
]);
const formatCurrency = (amount)=>{
    try {
        const num = parseFloat(amount) || 0;
        return Math.round(num).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    } catch (error) {
        console.error('Error formatting currency:', error);
        return '0';
    }
};
const formatNumberIndian = (amount)=>{
    try {
        const num = parseFloat(amount) || 0;
        return Math.round(num).toLocaleString('en-IN');
    } catch (error) {
        console.error('Error formatting number:', error);
        return '0';
    }
};
const getTotalRevenue = (ordersList = [])=>{
    try {
        return ordersList.reduce((sum, order)=>{
            if (!order) return sum;
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
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
    } catch (error) {
        console.error('Error calculating total revenue:', error);
        return 0;
    }
};
const getDeliveredRevenue = (ordersList = [])=>{
    try {
        return ordersList.filter((order)=>order && order.status === 'delivered').reduce((sum, order)=>{
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
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
    } catch (error) {
        console.error('Error calculating delivered revenue:', error);
        return 0;
    }
};
const getOrderDateOnly = (order)=>{
    try {
        if (!order) return null;
        const dateValue = order.createdAt || order.date;
        if (!dateValue) return null;
        const orderDate = new Date(dateValue);
        if (isNaN(orderDate.getTime())) {
            return null;
        }
        const year = orderDate.getFullYear();
        const month = String(orderDate.getMonth() + 1).padStart(2, '0');
        const day = String(orderDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        return null;
    }
};
const getOrderYear = (order)=>{
    try {
        if (!order) return null;
        if (order.year) {
            return String(order.year);
        }
        const dateValue = order.createdAt || order.date;
        if (!dateValue) return null;
        const orderDate = new Date(dateValue);
        if (isNaN(orderDate.getTime())) {
            return null;
        }
        return String(orderDate.getFullYear());
    } catch (error) {
        return null;
    }
};
const calculateTotalAmount = (quantity, unitPrice)=>{
    try {
        const qty = parseInt(quantity) || 0;
        const price = parseFloat(unitPrice) || 0;
        return qty * price;
    } catch (error) {
        console.error('Error calculating total amount:', error);
        return 0;
    }
};
const extractBillingMonth = (orderDate)=>{
    try {
        if (!orderDate) return null;
        const date = new Date(orderDate);
        if (isNaN(date.getTime())) return null;
        return date.getMonth() + 1; // 1-12
    } catch (error) {
        console.error('Error extracting billing month:', error);
        return null;
    }
};
const extractBillingYear = (orderDate)=>{
    try {
        if (!orderDate) return null;
        const date = new Date(orderDate);
        if (isNaN(date.getTime())) return null;
        return date.getFullYear();
    } catch (error) {
        console.error('Error extracting billing year:', error);
        return null;
    }
};
const formatBillingMonth = (month, year)=>{
    try {
        if (!month || !year) return '';
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const monthIndex = parseInt(month) - 1;
        if (monthIndex < 0 || monthIndex > 11) return '';
        const yearStr = String(year).slice(-2);
        return `${monthNames[monthIndex]}'${yearStr}`;
    } catch (error) {
        console.error('Error formatting billing month:', error);
        return '';
    }
};
const formatReferenceMonth = (month, year)=>{
    try {
        if (!month || !year) return '';
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
        const monthIndex = parseInt(month) - 1;
        if (monthIndex < 0 || monthIndex > 11) return '';
        const yearStr = String(year).slice(-2);
        return `${String(month).padStart(2, '0')} - ${monthNames[monthIndex]}'${yearStr}`;
    } catch (error) {
        console.error('Error formatting reference month:', error);
        return '';
    }
};
const normalizeOrderDate = (dateValue)=>{
    try {
        if (!dateValue) return null;
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error normalizing order date:', error);
        return null;
    }
};
const createOrderKey = (orderDate, deliveryAddress)=>{
    try {
        const normalizedDate = normalizeOrderDate(orderDate);
        const normalizedAddress = String(deliveryAddress || '').trim().toLowerCase();
        if (!normalizedDate || !normalizedAddress) return null;
        return `${normalizedDate}|${normalizedAddress}`;
    } catch (error) {
        console.error('Error creating order key:', error);
        return null;
    }
};
const findOrderByKey = (orders, orderDate, deliveryAddress)=>{
    try {
        const key = createOrderKey(orderDate, deliveryAddress);
        if (!key) return null;
        return orders.find((order)=>{
            const orderKey = createOrderKey(order.date || order.createdAt, order.deliveryAddress || order.customerAddress);
            return orderKey === key;
        }) || null;
    } catch (error) {
        console.error('Error finding order by key:', error);
        return null;
    }
};
const getLastUnitPriceForAddress = (orders, deliveryAddress)=>{
    try {
        if (!deliveryAddress || !Array.isArray(orders)) return null;
        const normalizedAddress = String(deliveryAddress).trim().toLowerCase();
        // Find most recent order for this address
        const addressOrders = orders.filter((order)=>{
            const orderAddress = String(order.deliveryAddress || order.customerAddress || '').trim().toLowerCase();
            return orderAddress === normalizedAddress && order.unitPrice;
        }).sort((a, b)=>{
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB - dateA;
        });
        return addressOrders.length > 0 ? parseFloat(addressOrders[0].unitPrice) : null;
    } catch (error) {
        console.error('Error getting last unit price:', error);
        return null;
    }
};
const getLastOrderForAddress = (orders, deliveryAddress)=>{
    try {
        if (!deliveryAddress || !Array.isArray(orders)) return null;
        const normalizedAddress = String(deliveryAddress).trim().toLowerCase();
        // Find all orders for this address
        const addressOrders = orders.filter((order)=>{
            const orderAddress = String(order.deliveryAddress || order.customerAddress || order.address || '').trim().toLowerCase();
            return orderAddress === normalizedAddress;
        }).sort((a, b)=>{
            // Sort by date descending (most recent first)
            // Use date field first, then order_date, then createdAt
            const dateA = new Date(a.date || a.order_date || a.createdAt || 0);
            const dateB = new Date(b.date || b.order_date || b.createdAt || 0);
            if (dateB.getTime() !== dateA.getTime()) {
                return dateB.getTime() - dateA.getTime();
            }
            // If dates are same, sort by orderId descending to get the very last one
            const idA = (a.orderId || '').toString();
            const idB = (b.orderId || '').toString();
            return idB.localeCompare(idA);
        });
        return addressOrders.length > 0 ? addressOrders[0] : null;
    } catch (error) {
        console.error('Error getting last order for address:', error);
        return null;
    }
};
const getUniqueAddresses = (orders)=>{
    try {
        if (!Array.isArray(orders)) return [];
        const addressSet = new Set();
        orders.forEach((order)=>{
            const address = order.deliveryAddress || order.customerAddress;
            if (address && String(address).trim()) {
                addressSet.add(String(address).trim());
            }
        });
        return Array.from(addressSet).sort();
    } catch (error) {
        console.error('Error getting unique addresses:', error);
        return [];
    }
};
const isPaidStatus = (status, paymentStatus = null)=>{
    // Check paymentStatus first if provided (more reliable)
    if (paymentStatus) {
        const ps = String(paymentStatus).toLowerCase().trim();
        if (ps === 'paid') return true;
    }
    // Check status field
    if (!status) return false;
    const s = String(status).toLowerCase().trim();
    return s === 'paid' || s === 'delivered';
};
const isPendingStatus = (status, paymentStatus = null)=>{
    // Check paymentStatus first if provided (more reliable)
    if (paymentStatus) {
        const ps = String(paymentStatus).toLowerCase().trim();
        if (ps === 'pending' || ps === 'unpaid') return true;
        if (ps === 'paid') return false;
    }
    // Check status field
    if (!status) return true; // Treat missing status as pending
    const s = String(status).toLowerCase().trim();
    return s === 'pending' || s === 'unpaid';
};
const normalizeStatus = (status)=>{
    if (!status) return 'Pending';
    const s = String(status).toLowerCase().trim();
    if (s === 'paid' || s === 'delivered') return 'Paid';
    if (s === 'pending' || s === 'unpaid') return 'Pending';
    return 'Pending';
};
const ensureAllOrdersHaveUniqueIds = (orders)=>{
    console.warn('[DEPRECATED] ensureAllOrdersHaveUniqueIds: Order IDs are now generated by backend. This function is kept for backward compatibility only.');
    // Return orders as-is - backend handles ID generation
    return orders;
};
const extractOrderIdSequence = (orderId)=>{
    if (!orderId) return 0;
    const match = orderId.toString().match(/HB-\w+'?\d{2}-\d{2}-(\d+)$/);
    return match && match[1] ? parseInt(match[1], 10) : 0;
};
const sortOrdersByOrderId = (orders)=>{
    if (!Array.isArray(orders) || orders.length === 0) return orders;
    return [
        ...orders
    ].sort((a, b)=>{
        const seqA = extractOrderIdSequence(a.orderId);
        const seqB = extractOrderIdSequence(b.orderId);
        if (seqA > 0 && seqB > 0) {
            return seqB - seqA;
        }
        if (seqA > 0) return -1;
        if (seqB > 0) return 1;
        const idA = (a.orderId || '').toString();
        const idB = (b.orderId || '').toString();
        if (idA && idB) {
            return idB.localeCompare(idA);
        }
        if (!idA && !idB) return 0;
        if (!idA) return 1;
        if (!idB) return -1;
        return 0;
    });
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/utils/calculations.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateProfit",
    ()=>calculateProfit,
    "calculateProfitMarginPercentage",
    ()=>calculateProfitMarginPercentage,
    "calculateProfitWithMargin",
    ()=>calculateProfitWithMargin,
    "calculateTotalExpenses",
    ()=>calculateTotalExpenses,
    "getAllCustomers",
    ()=>getAllCustomers,
    "getFilteredOrdersByDate",
    ()=>getFilteredOrdersByDate,
    "getPendingOrders",
    ()=>getPendingOrders,
    "getProfitStats",
    ()=>getProfitStats,
    "getSummaryReport",
    ()=>getSummaryReport,
    "getTodayStats",
    ()=>getTodayStats,
    "getWeeklyStats",
    ()=>getWeeklyStats
]);
/**
 * Calculation utilities for dashboard statistics and reports
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
;
const getTodayStats = (ordersList = [])=>{
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayOrders = ordersList.filter((order)=>{
            try {
                if (!order || !order.orderId) return false;
                const orderDate = new Date(order.createdAt || order.date || Date.now());
                return orderDate >= today && orderDate < tomorrow;
            } catch (e) {
                return false;
            }
        });
        const todayRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeliveredRevenue"])(todayOrders);
        const todayTotalRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(todayOrders);
        const pending = todayOrders.filter((o)=>[
                "pending",
                "confirmed",
                "preparing"
            ].includes(o.status)).length;
        return {
            orders: todayOrders.length,
            pending: pending,
            revenue: todayRevenue,
            totalRevenue: todayTotalRevenue
        };
    } catch (error) {
        console.error("Error calculating today stats:", error);
        return {
            orders: 0,
            pending: 0,
            revenue: 0,
            totalRevenue: 0
        };
    }
};
const getWeeklyStats = (ordersList = [])=>{
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (6 - today.getDay())); // End of week (Saturday)
        weekEnd.setHours(23, 59, 59, 999);
        const weekOrders = ordersList.filter((order)=>{
            try {
                if (!order || !order.orderId) return false;
                const orderDate = new Date(order.createdAt || order.date);
                return orderDate >= weekStart && orderDate <= weekEnd;
            } catch (e) {
                return false;
            }
        });
        const weekRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(weekOrders);
        const weekDeliveredRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeliveredRevenue"])(weekOrders);
        const deliveredWeekOrders = weekOrders.filter((o)=>o && o.status === "delivered");
        return {
            orders: weekOrders.length,
            revenue: weekDeliveredRevenue,
            totalRevenue: weekRevenue,
            deliveredRevenue: weekDeliveredRevenue,
            avgOrderValue: deliveredWeekOrders.length > 0 ? Math.round(weekDeliveredRevenue / deliveredWeekOrders.length) : 0,
            avgOrderValueAll: weekOrders.length > 0 ? Math.round(weekRevenue / weekOrders.length) : 0,
            formattedRevenue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(weekDeliveredRevenue),
            formattedDeliveredRevenue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(weekDeliveredRevenue)
        };
    } catch (error) {
        console.error("Error calculating weekly stats:", error);
        return {
            orders: 0,
            revenue: 0,
            deliveredRevenue: 0,
            formattedRevenue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(0),
            formattedDeliveredRevenue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(0)
        };
    }
};
const getPendingOrders = (ordersList = [])=>{
    try {
        return ordersList.filter((o)=>[
                "pending",
                "confirmed",
                "preparing"
            ].includes(o.status)).length;
    } catch (error) {
        console.error("Error calculating pending orders:", error);
        return 0;
    }
};
const getFilteredOrdersByDate = (ordersList, dateRange, customStartDate, customEndDate)=>{
    try {
        if (!Array.isArray(ordersList)) {
            return [];
        }
        if (dateRange === "all") {
            return ordersList;
        }
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate, endDate;
        switch(dateRange){
            case "today":
                startDate = new Date(today);
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "week":
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "month":
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case "custom":
                if (customStartDate && customEndDate) {
                    startDate = new Date(customStartDate);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(customEndDate);
                    endDate.setHours(23, 59, 59, 999);
                } else {
                    return ordersList;
                }
                break;
            default:
                return ordersList;
        }
        return ordersList.filter((order)=>{
            try {
                if (!order) return false;
                // Support all possible date fields (check multiple field names)
                const dateValue = order.order_date || order.createdAt || order.date || order.orderDate || order.created_at;
                if (!dateValue) return false;
                // Try to parse the date
                let orderDate = new Date(dateValue);
                // If parsing fails, try parsing as DD-MMM-YY format (e.g., "31-Dec-25")
                if (isNaN(orderDate.getTime()) && typeof dateValue === "string") {
                    const dateStr = dateValue.trim();
                    // Try to parse DD-MMM-YY or DD-MMM-YYYY format
                    const dateMatch = dateStr.match(/(\d{1,2})-([A-Za-z]{3})-(\d{2,4})/i);
                    if (dateMatch) {
                        const day = parseInt(dateMatch[1], 10);
                        const monthNames = [
                            "jan",
                            "feb",
                            "mar",
                            "apr",
                            "may",
                            "jun",
                            "jul",
                            "aug",
                            "sep",
                            "oct",
                            "nov",
                            "dec"
                        ];
                        const month = monthNames.indexOf(dateMatch[2].toLowerCase());
                        let year = parseInt(dateMatch[3], 10);
                        // Handle 2-digit years: 25 -> 2025, 24 -> 2024
                        if (year < 100) {
                            year = year < 50 ? 2000 + year : 1900 + year;
                        }
                        if (month >= 0 && day > 0 && day <= 31 && year > 1900) {
                            orderDate = new Date(year, month, day);
                        }
                    }
                }
                if (isNaN(orderDate.getTime())) return false;
                // Compare dates (ignore time for date-only comparison)
                orderDate.setHours(0, 0, 0, 0);
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                return orderDate >= start && orderDate <= end;
            } catch (e) {
                return false;
            }
        });
    } catch (error) {
        console.error("Error filtering orders by date:", error);
        return ordersList;
    }
};
const getSummaryReport = (ordersList = [])=>{
    try {
        if (!Array.isArray(ordersList) || ordersList.length === 0) {
            return [];
        }
        const reportMap = new Map();
        ordersList.forEach((order)=>{
            try {
                if (!order) return;
                const dateOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrderDateOnly"])(order);
                if (!dateOnly) return;
                const orderDate = new Date(dateOnly);
                if (isNaN(orderDate.getTime())) return;
                const year = orderDate.getFullYear();
                const month = orderDate.getMonth() + 1;
                const key = `${year}-${String(month).padStart(2, "0")}`;
                if (!reportMap.has(key)) {
                    reportMap.set(key, {
                        year: String(year),
                        month: String(month).padStart(2, "0"),
                        monthName: orderDate.toLocaleString("en-US", {
                            month: "long"
                        }),
                        totalOrders: 0,
                        totalRevenue: 0,
                        deliveredOrders: 0,
                        deliveredRevenue: 0
                    });
                }
                const report = reportMap.get(key);
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
                const isDelivered = String(order.status || "").toLowerCase() === "delivered";
                report.totalOrders++;
                report.totalRevenue += isNaN(amount) ? 0 : amount;
                if (isDelivered) {
                    report.deliveredOrders++;
                    report.deliveredRevenue += isNaN(amount) ? 0 : amount;
                }
            } catch (orderError) {
                console.warn("Error processing order in summary report:", orderError);
            }
        });
        const reportArray = Array.from(reportMap.values());
        return reportArray.sort((a, b)=>{
            if (a.year !== b.year) {
                return parseInt(b.year) - parseInt(a.year);
            }
            return parseInt(b.month) - parseInt(a.month);
        });
    } catch (error) {
        console.error("Error generating summary report:", error);
        return [];
    }
};
const getAllCustomers = (ordersList = [])=>{
    try {
        if (!Array.isArray(ordersList) || ordersList.length === 0) {
            return [];
        }
        const customerMap = new Map();
        ordersList.forEach((order)=>{
            try {
                if (!order) return;
                const address = String(order.deliveryAddress || order.customerAddress || "").trim();
                if (!address) return;
                if (!customerMap.has(address)) {
                    customerMap.set(address, {
                        address: address,
                        customerName: order.customerName || order.name || address,
                        totalOrders: 0,
                        totalAmount: 0,
                        lastOrderDate: null,
                        firstOrderDate: null,
                        orders: []
                    });
                }
                const customer = customerMap.get(address);
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
                const orderDate = new Date(order.createdAt || order.date);
                customer.totalOrders++;
                customer.totalAmount += isNaN(amount) ? 0 : amount;
                customer.orders.push(order);
                if (!customer.lastOrderDate || orderDate > customer.lastOrderDate) {
                    customer.lastOrderDate = orderDate;
                }
                if (!customer.firstOrderDate || orderDate < customer.firstOrderDate) {
                    customer.firstOrderDate = orderDate;
                }
            } catch (orderError) {
                console.warn("Error processing order in getAllCustomers:", orderError);
            }
        });
        return Array.from(customerMap.values());
    } catch (error) {
        console.error("Error generating customer list:", error);
        return [];
    }
};
const calculateTotalExpenses = (revenue, expensePercentage = 70)=>{
    try {
        const revenueNum = parseFloat(revenue) || 0;
        const expensePercent = parseFloat(expensePercentage) || 70;
        return revenueNum * expensePercent / 100;
    } catch (error) {
        console.error("Error calculating total expenses:", error);
        return 0;
    }
};
const calculateProfit = (revenue, expenses = null, expensePercentage = 70)=>{
    try {
        const revenueNum = parseFloat(revenue) || 0;
        const expensesNum = expenses !== null ? parseFloat(expenses) : calculateTotalExpenses(revenueNum, expensePercentage);
        return Math.max(0, revenueNum - expensesNum);
    } catch (error) {
        console.error("Error calculating profit:", error);
        return 0;
    }
};
const calculateProfitWithMargin = (revenue, expenses = null, expensePercentage = 70, profitMargin = 30)=>{
    try {
        const profit = calculateProfit(revenue, expenses, expensePercentage);
        const marginPercent = parseFloat(profitMargin) || 30;
        return profit * marginPercent / 100;
    } catch (error) {
        console.error("Error calculating profit with margin:", error);
        return 0;
    }
};
const calculateProfitMarginPercentage = (revenue, expenses = null, expensePercentage = 70)=>{
    try {
        const revenueNum = parseFloat(revenue) || 0;
        if (revenueNum === 0) return 0;
        const profit = calculateProfit(revenue, expenses, expensePercentage);
        return profit / revenueNum * 100;
    } catch (error) {
        console.error("Error calculating profit margin percentage:", error);
        return 0;
    }
};
const getProfitStats = (revenue, expensePercentage = 70, targetProfitMargin = 30)=>{
    try {
        const revenueNum = parseFloat(revenue) || 0;
        const expenses = calculateTotalExpenses(revenueNum, expensePercentage);
        const profit = calculateProfit(revenueNum, expenses, expensePercentage);
        const profitWithMargin = calculateProfitWithMargin(revenueNum, expenses, expensePercentage, targetProfitMargin);
        const profitMarginPercent = calculateProfitMarginPercentage(revenueNum, expenses, expensePercentage);
        const targetProfit = revenueNum * targetProfitMargin / 100;
        return {
            revenue: revenueNum,
            expenses: expenses,
            profit: profit,
            profitWithMargin: profitWithMargin,
            profitMarginPercent: profitMarginPercent,
            targetProfit: targetProfit,
            targetProfitMargin: targetProfitMargin,
            expensePercentage: expensePercentage
        };
    } catch (error) {
        console.error("Error calculating profit stats:", error);
        return {
            revenue: 0,
            expenses: 0,
            profit: 0,
            profitWithMargin: 0,
            profitMarginPercent: 0,
            targetProfit: 0,
            targetProfitMargin: targetProfitMargin || 30,
            expensePercentage: expensePercentage || 70
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/utils/adminConfig.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Admin Features Configuration
__turbopack_context__.s([
    "adminFeatures",
    ()=>adminFeatures
]);
const adminFeatures = {
    dashboard: {
        name: "Dashboard",
        icon: "fa-chart-line",
        enabled: true
    },
    excelViewer: {
        name: "All Orders",
        icon: "fa-table",
        enabled: true
    },
    orders: {
        name: "Current Month",
        icon: "fa-calendar-alt",
        enabled: true
    },
    analytics: {
        name: "Analytics",
        icon: "fa-chart-bar",
        enabled: true
    },
    customers: {
        name: "Customers",
        icon: "fa-users",
        enabled: true
    },
    reports: {
        name: "Reports",
        icon: "fa-file-alt",
        enabled: true
    },
    users: {
        name: "Pending Amounts",
        icon: "fa-exclamation-triangle",
        enabled: true
    },
    notifications: {
        name: "Notifications",
        icon: "fa-bell",
        enabled: true
    },
    settings: {
        name: "Settings",
        icon: "fa-cog",
        enabled: true
    },
    menuPrice: {
        name: "Menu & Price",
        icon: "fa-utensils",
        enabled: true
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/utils/dataSyncManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * Data Sync Manager
 * Fast, safe, and efficient data synchronization with:
 * - Request cancellation
 * - Debouncing
 * - Optimistic updates
 * - Error recovery
 * - Request queuing
 */ class DataSyncManager {
    constructor(){
        this.pendingRequests = new Map(); // Track active requests
        this.syncQueue = []; // Queue for sync operations
        this.debounceTimers = new Map(); // Debounce timers
        this.optimisticUpdates = new Map(); // Track optimistic updates for rollback
        this.isProcessing = false;
        // Configuration
        this.config = {
            debounceDelay: 300,
            maxRetries: 3,
            retryDelay: 1000,
            batchSize: 50
        };
    }
    /**
   * Create a cancellable request
   */ createRequest(key, requestFn) {
        // Cancel existing request with same key
        this.cancelRequest(key);
        const abortController = new AbortController();
        const request = {
            key,
            abortController,
            promise: null,
            timestamp: Date.now()
        };
        // Wrap request function with abort signal
        request.promise = requestFn(abortController.signal).then((result)=>{
            this.pendingRequests.delete(key);
            return result;
        }).catch((error)=>{
            this.pendingRequests.delete(key);
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled');
            }
            throw error;
        });
        this.pendingRequests.set(key, request);
        return request.promise;
    }
    /**
   * Cancel a specific request
   */ cancelRequest(key) {
        const request = this.pendingRequests.get(key);
        if (request) {
            request.abortController.abort();
            this.pendingRequests.delete(key);
        }
    }
    /**
   * Cancel all pending requests
   */ cancelAllRequests() {
        this.pendingRequests.forEach((request)=>{
            request.abortController.abort();
        });
        this.pendingRequests.clear();
    }
    /**
   * Debounced sync - batches multiple rapid sync calls
   */ debouncedSync(key, syncFn, delay = null) {
        const delayMs = delay || this.config.debounceDelay;
        // Clear existing timer
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        // Cancel any pending request with same key
        this.cancelRequest(key);
        return new Promise((resolve, reject)=>{
            const timer = setTimeout(async ()=>{
                this.debounceTimers.delete(key);
                try {
                    const result = await this.createRequest(key, syncFn);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, delayMs);
            this.debounceTimers.set(key, timer);
        });
    }
    /**
   * Optimistic update - update UI immediately, sync in background
   */ async optimisticUpdate(key, updateFn, syncFn, rollbackFn = null) {
        // Store original state for rollback
        let originalState = null;
        if (rollbackFn) {
            originalState = rollbackFn();
        }
        // Apply optimistic update immediately
        const optimisticResult = updateFn();
        // Track for potential rollback
        this.optimisticUpdates.set(key, {
            originalState,
            rollbackFn,
            timestamp: Date.now()
        });
        try {
            // Sync in background
            const syncResult = await this.createRequest(key, syncFn);
            // Remove from optimistic updates (success)
            this.optimisticUpdates.delete(key);
            return {
                success: true,
                data: syncResult,
                optimistic: true
            };
        } catch (error) {
            // Rollback on error
            if (rollbackFn && originalState !== null) {
                rollbackFn(originalState);
            }
            // Remove from optimistic updates
            this.optimisticUpdates.delete(key);
            throw error;
        }
    }
    /**
   * Queue sync operation
   */ queueSync(operation) {
        this.syncQueue.push({
            ...operation,
            timestamp: Date.now()
        });
        // Process queue if not already processing
        if (!this.isProcessing) {
            this.processQueue();
        }
    }
    /**
   * Process sync queue
   */ async processQueue() {
        if (this.isProcessing || this.syncQueue.length === 0) {
            return;
        }
        this.isProcessing = true;
        try {
            // Process operations in batches
            const batch = this.syncQueue.splice(0, this.config.batchSize);
            // Execute batch operations
            const results = await Promise.allSettled(batch.map((op)=>op.execute()));
            // Handle results
            results.forEach((result, index)=>{
                const operation = batch[index];
                if (result.status === 'rejected' && operation.onError) {
                    operation.onError(result.reason);
                } else if (result.status === 'fulfilled' && operation.onSuccess) {
                    operation.onSuccess(result.value);
                }
            });
        } catch (error) {
            console.error('[DataSyncManager] Queue processing error:', error);
        } finally{
            this.isProcessing = false;
            // Process remaining items
            if (this.syncQueue.length > 0) {
                setTimeout(()=>this.processQueue(), 100);
            }
        }
    }
    /**
   * Clear all debounce timers
   */ clearDebounceTimers() {
        this.debounceTimers.forEach((timer)=>clearTimeout(timer));
        this.debounceTimers.clear();
    }
    /**
   * Get pending requests count
   */ getPendingCount() {
        return this.pendingRequests.size;
    }
    /**
   * Check if there are pending operations
   */ hasPendingOperations() {
        return this.pendingRequests.size > 0 || this.syncQueue.length > 0 || this.debounceTimers.size > 0;
    }
    /**
   * Cleanup - cancel all operations
   */ cleanup() {
        this.cancelAllRequests();
        this.clearDebounceTimers();
        this.syncQueue = [];
        this.optimisticUpdates.clear();
        this.isProcessing = false;
    }
}
// Singleton instance
const dataSyncManager = new DataSyncManager();
const __TURBOPACK__default__export__ = dataSyncManager;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/utils/errorTracker.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// Simple error tracker utility
const errorTracker = {
    log: (error, context = {})=>{
        console.error("[ErrorTracker]", context, error);
    // In production, you might want to send this to an error tracking service
    },
    track: (error, context = {})=>{
        console.error("[ErrorTracker]", context, error);
    },
    addToQueue: (operation, title, context = {})=>{
        const opId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return opId;
    },
    captureError: (error, context = {})=>{
        console.error("[ErrorTracker] Error captured:", context, error);
    // In production, send to error tracking service
    },
    completeOperation: (opId, result = {})=>{
    // Operation completed
    },
    failOperation: (opId, error)=>{
        console.error("[ErrorTracker] Operation failed:", opId, error);
    }
};
const __TURBOPACK__default__export__ = errorTracker;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/utils/notificationMessages.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Standardized notification messages for admin dashboard
 * Ensures consistent, professional, and accurate messaging
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getNotificationDuration",
    ()=>getNotificationDuration,
    "getNotificationMessage",
    ()=>getNotificationMessage,
    "notificationMessages",
    ()=>notificationMessages
]);
const notificationMessages = {
    // Order operations
    orders: {
        addSuccess: 'Order added successfully',
        addError: 'Failed to add order. Please check the details and try again.',
        updateSuccess: 'Order updated successfully',
        updateError: 'Failed to update order. Please try again.',
        deleteSuccess: 'Order deleted successfully',
        deleteError: 'Failed to delete order. Please try again.',
        notFound: 'Order not found. It may have been deleted.',
        statusUpdateSuccess: 'Order status updated successfully',
        statusUpdateError: 'Failed to update order status. Please try again.',
        clearAllSuccess: (count)=>`Successfully deleted ${count} order${count !== 1 ? 's' : ''}`,
        clearAllError: 'Failed to clear all orders. Please try again.',
        clearAllWarning: (count)=>`${count} order${count !== 1 ? 's' : ''} could not be deleted. Please try again.`
    },
    // Settings operations
    settings: {
        updateSuccess: 'Settings saved successfully',
        updateError: 'Failed to save settings. Please check your inputs and try again.',
        loadError: 'Failed to load settings. Using default values.'
    },
    // Backup & Restore
    backup: {
        createSuccess: 'Backup created successfully',
        createError: 'Failed to create backup. Please try again.',
        restoreSuccess: 'Data restored successfully',
        restoreError: 'Failed to restore data. Please check the backup file and try again.',
        restoreWarning: 'This will overwrite all current data. Are you sure?'
    },
    // Menu operations
    menu: {
        updateSuccess: 'Menu updated successfully',
        updateError: 'Failed to update menu. Please try again.',
        loadError: 'Failed to load menu items.',
        itemAddSuccess: 'Menu item added successfully',
        itemAddError: 'Failed to add menu item. Please check the details and try again.',
        itemUpdateSuccess: 'Menu item updated successfully',
        itemUpdateError: 'Failed to update menu item. Please try again.',
        itemDeleteSuccess: 'Menu item deleted successfully',
        itemDeleteError: 'Failed to delete menu item. Please try again.'
    },
    // Gallery operations
    gallery: {
        addSuccess: 'Gallery item added successfully',
        addError: 'Failed to add gallery item. Please check the details and try again.',
        updateSuccess: 'Gallery item updated successfully',
        updateError: 'Failed to update gallery item. Please try again.',
        deleteSuccess: 'Gallery item deleted successfully',
        deleteError: 'Failed to delete gallery item. Please try again.',
        syncSuccess: (created, updated, deactivated)=>{
            const parts = [];
            if (created > 0) parts.push(`${created} created`);
            if (updated > 0) parts.push(`${updated} updated`);
            if (deactivated > 0) parts.push(`${deactivated} deactivated`);
            return `Gallery synced successfully: ${parts.join(', ')}`;
        },
        syncError: 'Failed to sync gallery items. Please try again.'
    },
    // Reviews operations
    reviews: {
        addSuccess: 'Review submitted successfully. It will be published after admin approval.',
        addError: 'Failed to submit review. Please try again.',
        updateSuccess: 'Review updated successfully',
        updateError: 'Failed to update review. Please try again.',
        deleteSuccess: 'Review deleted successfully',
        deleteError: 'Failed to delete review. Please try again.',
        approveSuccess: 'Review approved and published successfully',
        approveError: 'Failed to approve review. Please try again.'
    },
    // Excel/CSV upload
    upload: {
        excelSuccess: (imported, updated, skipped, errors)=>{
            const parts = [];
            if (imported > 0) parts.push(`${imported} imported`);
            if (updated > 0) parts.push(`${updated} updated`);
            if (skipped > 0) parts.push(`${skipped} skipped`);
            if (errors > 0) parts.push(`${errors} error${errors !== 1 ? 's' : ''}`);
            return `Upload completed: ${parts.join(', ')}`;
        },
        excelError: 'Failed to upload Excel file. Please check the file format and try again.',
        excelValidationError: 'Invalid Excel file. Please ensure all required columns are present.',
        excelEmptyError: 'Excel file is empty or has no valid data.',
        processing: 'Processing Excel file... Please wait.'
    },
    // Authentication
    auth: {
        loginSuccess: 'Logged in successfully',
        loginError: 'Invalid credentials. Please check your username and password.',
        logoutSuccess: 'Logged out successfully',
        sessionExpired: 'Your session has expired. Please log in again.',
        unauthorized: 'You do not have permission to perform this action.'
    },
    // Network & System
    network: {
        connectionError: 'Network error: Unable to connect to the server. Please check your internet connection and try again.',
        timeoutError: 'Request timed out. Please try again.',
        serverError: 'Server error occurred. Please try again later.',
        databaseError: 'Database connection error. Please contact support if this persists.'
    },
    // Validation
    validation: {
        requiredFields: 'Please fill in all required fields',
        invalidDate: 'Invalid date format. Please use a valid date.',
        invalidEmail: 'Please enter a valid email address',
        invalidPhone: 'Please enter a valid phone number',
        invalidPrice: 'Price must be a valid number greater than or equal to 0',
        invalidQuantity: 'Quantity must be a valid number greater than 0',
        duplicateOrderId: (orderId)=>`Order with ID "${orderId}" already exists. Please use a different Order ID.`
    },
    // General
    general: {
        loading: 'Loading...',
        saving: 'Saving...',
        processing: 'Processing...',
        success: 'Operation completed successfully',
        error: 'An error occurred. Please try again.',
        warning: 'Please review the information before proceeding',
        info: 'Information'
    },
    // Reminders & Notifications
    reminders: {
        sentSuccess: 'Reminder sent successfully',
        sendError: 'Failed to send reminder. Please try again.'
    }
};
const getNotificationMessage = (category, key, ...args)=>{
    const categoryMessages = notificationMessages[category];
    if (!categoryMessages) {
        return notificationMessages.general[key] || notificationMessages.general.error;
    }
    const message = categoryMessages[key];
    if (!message) {
        return notificationMessages.general.error;
    }
    // If message is a function, call it with args
    if (typeof message === 'function') {
        return message(...args);
    }
    return message;
};
const getNotificationDuration = (type, customDuration = null)=>{
    if (customDuration !== null) return customDuration;
    const durations = {
        success: 4000,
        error: 6000,
        warning: 5000,
        info: 4000
    };
    return durations[type] || 4000;
};
const __TURBOPACK__default__export__ = notificationMessages;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/utils/themeFixer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Theme Fixer Utility
 * Automatically detects and fixes theme inconsistencies
 * 
 * Usage:
 * - Import and call fixTheme() when needed
 * - Can be called on page load, theme change, or error recovery
 */ /**
 * Detects theme inconsistencies and returns issues found
 */ __turbopack_context__.s([
    "autoFixThemeOnLoad",
    ()=>autoFixThemeOnLoad,
    "detectThemeIssues",
    ()=>detectThemeIssues,
    "fixTheme",
    ()=>fixTheme,
    "manualThemeFix",
    ()=>manualThemeFix,
    "watchThemeChanges",
    ()=>watchThemeChanges
]);
function detectThemeIssues() {
    const issues = [];
    try {
        // Check localStorage theme
        const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
        // Check :root theme class
        const rootHasDark = document.documentElement.classList.contains('dark-theme');
        const rootHasLight = document.documentElement.classList.contains('light-theme');
        // Check admin-dashboard theme class
        const adminDashboard = document.querySelector('.admin-dashboard');
        const dashboardHasDark = adminDashboard?.classList.contains('dark-theme');
        const dashboardHasLight = adminDashboard?.classList.contains('light-theme');
        // Check CSS variables
        const computedStyle = window.getComputedStyle(document.documentElement);
        const adminBg = computedStyle.getPropertyValue('--admin-bg').trim();
        const adminBgSecondary = computedStyle.getPropertyValue('--admin-bg-secondary').trim();
        // Issue 1: Root and dashboard theme mismatch
        if (savedTheme === 'dark' && (!rootHasDark || !dashboardHasDark)) {
            issues.push({
                type: 'theme_class_mismatch',
                severity: 'high',
                message: 'Dark theme class not applied correctly',
                expected: 'dark-theme',
                actual: {
                    root: rootHasDark ? 'dark-theme' : rootHasLight ? 'light-theme' : 'none',
                    dashboard: dashboardHasDark ? 'dark-theme' : dashboardHasLight ? 'light-theme' : 'none'
                }
            });
        }
        if (savedTheme === 'light' && (!rootHasLight || !dashboardHasLight)) {
            issues.push({
                type: 'theme_class_mismatch',
                severity: 'high',
                message: 'Light theme class not applied correctly',
                expected: 'light-theme',
                actual: {
                    root: rootHasDark ? 'dark-theme' : rootHasLight ? 'light-theme' : 'none',
                    dashboard: dashboardHasDark ? 'dark-theme' : dashboardHasLight ? 'light-theme' : 'none'
                }
            });
        }
        // Issue 2: Both themes active (conflict)
        if (rootHasDark && rootHasLight || dashboardHasDark && dashboardHasLight) {
            issues.push({
                type: 'theme_conflict',
                severity: 'critical',
                message: 'Both dark and light theme classes are active',
                root: {
                    dark: rootHasDark,
                    light: rootHasLight
                },
                dashboard: {
                    dark: dashboardHasDark,
                    light: dashboardHasLight
                }
            });
        }
        // Issue 3: CSS variables not set (fallback to white)
        if (savedTheme === 'dark' && (adminBg === '' || adminBg === '#ffffff' || adminBg === 'rgb(255, 255, 255)')) {
            issues.push({
                type: 'css_variable_missing',
                severity: 'high',
                message: 'Dark theme CSS variables not properly set',
                variable: '--admin-bg',
                value: adminBg || 'empty'
            });
        }
        // Issue 4: Admin dashboard element missing
        if (!adminDashboard) {
            issues.push({
                type: 'element_missing',
                severity: 'medium',
                message: 'Admin dashboard element not found',
                selector: '.admin-dashboard'
            });
        }
        // Issue 5: Auto theme detection issue
        if (savedTheme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const expectedTheme = prefersDark ? 'dark' : 'light';
            const actualTheme = rootHasDark ? 'dark' : rootHasLight ? 'light' : 'none';
            if (actualTheme !== expectedTheme) {
                issues.push({
                    type: 'auto_theme_mismatch',
                    severity: 'medium',
                    message: 'Auto theme not matching system preference',
                    expected: expectedTheme,
                    actual: actualTheme,
                    systemPreference: prefersDark ? 'dark' : 'light'
                });
            }
        }
    } catch (error) {
        issues.push({
            type: 'detection_error',
            severity: 'critical',
            message: 'Error detecting theme issues',
            error: error.message
        });
    }
    return {
        hasIssues: issues.length > 0,
        issues,
        timestamp: new Date().toISOString()
    };
}
function fixTheme(options = {}) {
    const { force = false, silent = false, onFix = null } = options;
    const results = {
        fixed: [],
        errors: [],
        skipped: []
    };
    try {
        // Detect issues
        const detection = detectThemeIssues();
        if (!detection.hasIssues && !force) {
            if (!silent) {
                console.log('[Theme Fixer] No issues detected. Theme is working correctly.');
            }
            return results;
        }
        if (!silent) {
            console.log(`[Theme Fixer] Found ${detection.issues.length} issue(s). Starting fix...`);
        }
        // Get saved theme
        const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
        const adminDashboard = document.querySelector('.admin-dashboard');
        // Fix 1: Apply theme classes correctly
        if (detection.issues.some((issue)=>issue.type === 'theme_class_mismatch' || issue.type === 'theme_conflict')) {
            try {
                // Remove all theme classes first
                document.documentElement.classList.remove('dark-theme', 'light-theme');
                if (adminDashboard) {
                    adminDashboard.classList.remove('dark-theme', 'light-theme');
                }
                // Apply correct theme
                let themeToApply = savedTheme;
                if (savedTheme === 'auto') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    themeToApply = prefersDark ? 'dark' : 'light';
                }
                if (themeToApply === 'dark') {
                    document.documentElement.classList.add('dark-theme');
                    document.documentElement.classList.remove('light-theme');
                    if (adminDashboard) {
                        adminDashboard.classList.add('dark-theme');
                        adminDashboard.classList.remove('light-theme');
                    }
                } else {
                    document.documentElement.classList.add('light-theme');
                    document.documentElement.classList.remove('dark-theme');
                    if (adminDashboard) {
                        adminDashboard.classList.add('light-theme');
                        adminDashboard.classList.remove('dark-theme');
                    }
                }
                results.fixed.push({
                    type: 'theme_classes',
                    message: `Applied ${themeToApply} theme classes to root and admin-dashboard`
                });
                if (onFix) onFix('theme_classes', themeToApply);
            } catch (error) {
                results.errors.push({
                    type: 'theme_classes',
                    error: error.message
                });
            }
        }
        // Fix 2: Ensure CSS variables are set
        if (detection.issues.some((issue)=>issue.type === 'css_variable_missing')) {
            try {
                const themeToApply = savedTheme === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : savedTheme;
                // Force re-apply theme to trigger CSS variable updates
                if (adminDashboard) {
                    // Trigger a reflow to ensure CSS variables are recalculated
                    void adminDashboard.offsetHeight;
                    // Re-apply theme class to ensure CSS variables are set
                    if (themeToApply === 'dark') {
                        adminDashboard.classList.add('dark-theme');
                    } else {
                        adminDashboard.classList.add('light-theme');
                    }
                }
                results.fixed.push({
                    type: 'css_variables',
                    message: 'CSS variables refreshed'
                });
                if (onFix) onFix('css_variables', themeToApply);
            } catch (error) {
                results.errors.push({
                    type: 'css_variables',
                    error: error.message
                });
            }
        }
        // Fix 3: Handle missing admin-dashboard element
        if (detection.issues.some((issue)=>issue.type === 'element_missing')) {
            results.skipped.push({
                type: 'element_missing',
                message: 'Admin dashboard element not found. This may be normal if called before DOM is ready.'
            });
        }
        // Fix 4: Auto theme detection
        if (detection.issues.some((issue)=>issue.type === 'auto_theme_mismatch')) {
            try {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const themeToApply = prefersDark ? 'dark' : 'light';
                document.documentElement.classList.remove('dark-theme', 'light-theme');
                if (adminDashboard) {
                    adminDashboard.classList.remove('dark-theme', 'light-theme');
                }
                if (themeToApply === 'dark') {
                    document.documentElement.classList.add('dark-theme');
                    if (adminDashboard) {
                        adminDashboard.classList.add('dark-theme');
                    }
                } else {
                    document.documentElement.classList.add('light-theme');
                    if (adminDashboard) {
                        adminDashboard.classList.add('light-theme');
                    }
                }
                results.fixed.push({
                    type: 'auto_theme',
                    message: `Auto theme corrected to ${themeToApply} based on system preference`
                });
                if (onFix) onFix('auto_theme', themeToApply);
            } catch (error) {
                results.errors.push({
                    type: 'auto_theme',
                    error: error.message
                });
            }
        }
        if (!silent) {
            console.log('[Theme Fixer] Fix complete:', {
                fixed: results.fixed.length,
                errors: results.errors.length,
                skipped: results.skipped.length
            });
            if (results.fixed.length > 0) {
                console.log('[Theme Fixer] Fixed issues:', results.fixed);
            }
            if (results.errors.length > 0) {
                console.error('[Theme Fixer] Errors:', results.errors);
            }
        }
    } catch (error) {
        results.errors.push({
            type: 'general',
            error: error.message
        });
        if (!silent) {
            console.error('[Theme Fixer] Critical error:', error);
        }
    }
    return results;
}
function autoFixThemeOnLoad(maxRetries = 5, retryDelay = 500) {
    let retries = 0;
    const attemptFix = ()=>{
        const adminDashboard = document.querySelector('.admin-dashboard');
        if (adminDashboard || retries >= maxRetries) {
            if (adminDashboard) {
                fixTheme({
                    silent: false
                });
            } else if (retries < maxRetries) {
                console.warn(`[Theme Fixer] Admin dashboard not found. Retrying... (${retries + 1}/${maxRetries})`);
                setTimeout(attemptFix, retryDelay);
                retries++;
            } else {
                console.error('[Theme Fixer] Max retries reached. Admin dashboard element not found.');
            }
        }
    };
    // Try immediately
    attemptFix();
}
function watchThemeChanges() {
    // Watch for localStorage changes
    window.addEventListener('storage', (e)=>{
        if (e.key === 'homiebites_theme') {
            console.log('[Theme Fixer] Theme changed in localStorage. Auto-fixing...');
            setTimeout(()=>fixTheme({
                    silent: false
                }), 100);
        }
    });
    // Watch for class changes on admin-dashboard
    const observer = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('admin-dashboard')) {
                    const hasDark = target.classList.contains('dark-theme');
                    const hasLight = target.classList.contains('light-theme');
                    const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
                    // Check for conflicts
                    if (hasDark && hasLight || savedTheme === 'dark' && !hasDark || savedTheme === 'light' && !hasLight) {
                        console.warn('[Theme Fixer] Detected theme inconsistency. Auto-fixing...');
                        setTimeout(()=>fixTheme({
                                silent: false
                            }), 100);
                    }
                }
            }
        });
    });
    // Start observing
    const adminDashboard = document.querySelector('.admin-dashboard');
    if (adminDashboard) {
        observer.observe(adminDashboard, {
            attributes: true,
            attributeFilter: [
                'class'
            ]
        });
    } else {
        // Retry when DOM is ready
        const checkAndObserve = setInterval(()=>{
            const dashboard = document.querySelector('.admin-dashboard');
            if (dashboard) {
                observer.observe(dashboard, {
                    attributes: true,
                    attributeFilter: [
                        'class'
                    ]
                });
                clearInterval(checkAndObserve);
            }
        }, 100);
    }
    return observer;
}
function manualThemeFix() {
    console.log('[Theme Fixer] Manual fix triggered');
    const results = fixTheme({
        silent: false
    });
    if (results.fixed.length > 0) {
        console.log('✅ Theme fixed successfully!');
    } else if (results.errors.length > 0) {
        console.error('❌ Errors occurred during fix:', results.errors);
    } else {
        console.log('ℹ️ No issues found or already fixed.');
    }
    return results;
}
// Make it available globally for console access
if ("TURBOPACK compile-time truthy", 1) {
    window.fixTheme = manualThemeFix;
    window.detectThemeIssues = detectThemeIssues;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const ConfirmationModal = ({ show, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning', onConfirm, onCancel, isLoading = false })=>{
    _s();
    // Handle Escape key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConfirmationModal.useEffect": ()=>{
            if (!show) return;
            const handleEscape = {
                "ConfirmationModal.useEffect.handleEscape": (e)=>{
                    if (e.key === 'Escape' && !isLoading) {
                        onCancel();
                    }
                }
            }["ConfirmationModal.useEffect.handleEscape"];
            window.addEventListener('keydown', handleEscape);
            return ({
                "ConfirmationModal.useEffect": ()=>window.removeEventListener('keydown', handleEscape)
            })["ConfirmationModal.useEffect"];
        }
    }["ConfirmationModal.useEffect"], [
        show,
        isLoading,
        onCancel
    ]);
    if (!show) return null;
    const getTypeStyles = ()=>{
        switch(type){
            case 'danger':
                return {
                    icon: 'fa-exclamation-triangle',
                    iconColor: 'var(--admin-danger, #dc2626)',
                    iconBg: 'rgba(220, 38, 38, 0.1)',
                    confirmBtn: 'btn-danger'
                };
            case 'success':
                return {
                    icon: 'fa-check-circle',
                    iconColor: 'var(--admin-success, #16a34a)',
                    iconBg: 'rgba(22, 163, 74, 0.1)',
                    confirmBtn: 'btn-success'
                };
            case 'info':
                return {
                    icon: 'fa-info-circle',
                    iconColor: 'var(--admin-accent, #449031)',
                    iconBg: 'rgba(68, 144, 49, 0.1)',
                    confirmBtn: 'btn-primary'
                };
            default:
                return {
                    icon: 'fa-exclamation-circle',
                    iconColor: 'var(--admin-warning, #f59e0b)',
                    iconBg: 'rgba(245, 158, 11, 0.1)',
                    confirmBtn: 'btn-warning'
                };
        }
    };
    const styles = getTypeStyles();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal-container",
            style: {
                maxWidth: '480px'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-header",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: styles.iconBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: `fa-solid ${styles.icon}`,
                                    style: {
                                        fontSize: '24px',
                                        color: styles.iconColor
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                                    lineNumber: 82,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    margin: 0,
                                    fontSize: '20px'
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-body",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            margin: 0,
                            fontSize: '15px',
                            lineHeight: '1.6',
                            color: 'var(--admin-text, #1a202c)'
                        },
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-footer",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-ghost",
                            onClick: onCancel,
                            disabled: isLoading,
                            children: cancelText
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `btn ${styles.confirmBtn}`,
                            onClick: onConfirm,
                            disabled: isLoading,
                            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-spinner fa-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                                        lineNumber: 110,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Processing..."
                                ]
                            }, void 0, true) : confirmText
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
            lineNumber: 67,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ConfirmationModal, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ConfirmationModal;
const __TURBOPACK__default__export__ = ConfirmationModal;
var _c;
__turbopack_context__.k.register(_c, "ConfirmationModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const EmptyState = ({ icon = "fa-inbox", title = "No data found", message = "Try adjusting your filters", onClearFilters, onAddOrder, clearFiltersLabel = "Clear Filters", addOrderLabel = "Add Order" })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-empty-state",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                className: `fa-solid ${icon}`,
                style: {
                    fontSize: "3rem",
                    color: "#64748b",
                    marginBottom: "1rem"
                }
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
                lineNumber: 12,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                style: {
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#1e293b"
                },
                children: title
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
                lineNumber: 20,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    margin: "0 0 1.5rem 0",
                    fontSize: "0.95rem",
                    color: "#64748b"
                },
                children: message
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
                lineNumber: 31,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "center",
                    flexWrap: "wrap"
                },
                children: [
                    onClearFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-ghost btn-small",
                        onClick: onClearFilters,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-filter-circle-xmark"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            clearFiltersLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    onAddOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-primary btn-small",
                        onClick: onAddOrder,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-plus"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            addOrderLabel
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
                lineNumber: 41,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = EmptyState;
const __TURBOPACK__default__export__ = EmptyState;
var _c;
__turbopack_context__.k.register(_c, "EmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$EmptyState$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/EmptyState.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$OrderModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/OrderModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/calculations.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dateUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const CurrentMonthOrdersTab = ({ orders = [], onAddOrder, onEditOrder, onDeleteOrder, onUpdateOrderStatus, currentPage = 1, recordsPerPage = 25, onPageChange, onRecordsPerPageChange, loading = false, loadOrders, showNotification, settings })=>{
    _s();
    const now = new Date();
    const currentMonthName = now.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
    // Quick filter state
    const [quickFilter, setQuickFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all'); // 'all', 'today', 'yesterday', 'thisWeek', 'pending', 'paid'
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showAddOrderModal, setShowAddOrderModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingOrder, setEditingOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [addressSuggestions, setAddressSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showAddressSuggestions, setShowAddressSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newOrder, setNewOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        date: new Date().toISOString().split('T')[0],
        deliveryAddress: '',
        quantity: 1,
        unitPrice: settings?.defaultUnitPrice || 100,
        total: settings?.defaultUnitPrice || 100,
        mode: 'Lunch',
        status: 'Pending',
        paymentMode: 'Online'
    });
    // Keyboard shortcut for new order (Ctrl+N / Cmd+N) and custom event listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CurrentMonthOrdersTab.useEffect": ()=>{
            const handleKeyDown = {
                "CurrentMonthOrdersTab.useEffect.handleKeyDown": (e)=>{
                    // Only handle if not typing in an input/textarea/select
                    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && ![
                        'INPUT',
                        'TEXTAREA',
                        'SELECT'
                    ].includes(e.target.tagName)) {
                        e.preventDefault();
                        setShowAddOrderModal(true);
                    }
                }
            }["CurrentMonthOrdersTab.useEffect.handleKeyDown"];
            const handleOpenModalEvent = {
                "CurrentMonthOrdersTab.useEffect.handleOpenModalEvent": ()=>{
                    setShowAddOrderModal(true);
                }
            }["CurrentMonthOrdersTab.useEffect.handleOpenModalEvent"];
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('openNewOrderModal', handleOpenModalEvent);
            return ({
                "CurrentMonthOrdersTab.useEffect": ()=>{
                    window.removeEventListener('keydown', handleKeyDown);
                    window.removeEventListener('openNewOrderModal', handleOpenModalEvent);
                }
            })["CurrentMonthOrdersTab.useEffect"];
        }
    }["CurrentMonthOrdersTab.useEffect"], []);
    // Get current month orders
    const currentMonthOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CurrentMonthOrdersTab.useMemo[currentMonthOrders]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredOrdersByDate"])(orders, 'month', '', '');
        }
    }["CurrentMonthOrdersTab.useMemo[currentMonthOrders]"], [
        orders
    ]);
    // Calculate stats
    const currentMonthStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CurrentMonthOrdersTab.useMemo[currentMonthStats]": ()=>{
            const revenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(currentMonthOrders);
            const total = currentMonthOrders.length;
            const pending = currentMonthOrders.filter({
                "CurrentMonthOrdersTab.useMemo[currentMonthStats].pending": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status)
            }["CurrentMonthOrdersTab.useMemo[currentMonthStats].pending"]);
            const pendingAmount = pending.reduce({
                "CurrentMonthOrdersTab.useMemo[currentMonthStats].pendingAmount": (sum, o)=>{
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
            }["CurrentMonthOrdersTab.useMemo[currentMonthStats].pendingAmount"], 0);
            // Calculate month-over-month growth
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            const lastMonthOrders = orders.filter({
                "CurrentMonthOrdersTab.useMemo[currentMonthStats].lastMonthOrders": (o)=>{
                    try {
                        // Never use createdAt (today's date) as fallback - only use actual order date
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
                    } catch (e) {
                        return false;
                    }
                }
            }["CurrentMonthOrdersTab.useMemo[currentMonthStats].lastMonthOrders"]);
            const lastMonthRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(lastMonthOrders);
            const growth = lastMonthRevenue > 0 ? (revenue - lastMonthRevenue) / lastMonthRevenue * 100 : revenue > 0 ? Infinity : 0;
            return {
                revenue,
                total,
                pendingCount: pending.length,
                pendingAmount,
                growth
            };
        }
    }["CurrentMonthOrdersTab.useMemo[currentMonthStats]"], [
        currentMonthOrders,
        orders,
        now
    ]);
    // Quick filter dates
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    // Filter orders based on quick filter
    const filteredOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CurrentMonthOrdersTab.useMemo[filteredOrders]": ()=>{
            let filtered = [
                ...currentMonthOrders
            ];
            switch(quickFilter){
                case 'today':
                    filtered = filtered.filter({
                        "CurrentMonthOrdersTab.useMemo[filteredOrders]": (o)=>{
                            try {
                                // Never use createdAt (today's date) as fallback - only use actual order date
                                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                                return orderDate >= today && orderDate < tomorrow;
                            } catch (e) {
                                return false;
                            }
                        }
                    }["CurrentMonthOrdersTab.useMemo[filteredOrders]"]);
                    break;
                case 'yesterday':
                    filtered = filtered.filter({
                        "CurrentMonthOrdersTab.useMemo[filteredOrders]": (o)=>{
                            try {
                                // Never use createdAt (today's date) as fallback - only use actual order date
                                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                                return orderDate >= yesterday && orderDate < today;
                            } catch (e) {
                                return false;
                            }
                        }
                    }["CurrentMonthOrdersTab.useMemo[filteredOrders]"]);
                    break;
                case 'thisWeek':
                    filtered = filtered.filter({
                        "CurrentMonthOrdersTab.useMemo[filteredOrders]": (o)=>{
                            try {
                                // Never use createdAt (today's date) as fallback - only use actual order date
                                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                                return orderDate >= thisWeekStart;
                            } catch (e) {
                                return false;
                            }
                        }
                    }["CurrentMonthOrdersTab.useMemo[filteredOrders]"]);
                    break;
                case 'pending':
                    filtered = filtered.filter({
                        "CurrentMonthOrdersTab.useMemo[filteredOrders]": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status)
                    }["CurrentMonthOrdersTab.useMemo[filteredOrders]"]);
                    break;
                case 'paid':
                    filtered = filtered.filter({
                        "CurrentMonthOrdersTab.useMemo[filteredOrders]": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(o.status)
                    }["CurrentMonthOrdersTab.useMemo[filteredOrders]"]);
                    break;
                default:
                    break;
            }
            // Apply search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter({
                    "CurrentMonthOrdersTab.useMemo[filteredOrders]": (order)=>{
                        const address = (order.deliveryAddress || order.customerAddress || order.address || '').toLowerCase();
                        const orderId = (order.orderId || '').toLowerCase();
                        return address.includes(query) || orderId.includes(query);
                    }
                }["CurrentMonthOrdersTab.useMemo[filteredOrders]"]);
            }
            // Sort by orderId (newest first)
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortOrdersByOrderId"])(filtered);
        }
    }["CurrentMonthOrdersTab.useMemo[filteredOrders]"], [
        currentMonthOrders,
        quickFilter,
        searchQuery,
        today,
        tomorrow,
        yesterday,
        thisWeekStart
    ]);
    // Quick filter counts
    const quickFilterCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CurrentMonthOrdersTab.useMemo[quickFilterCounts]": ()=>{
            const todayOrders = currentMonthOrders.filter({
                "CurrentMonthOrdersTab.useMemo[quickFilterCounts].todayOrders": (o)=>{
                    try {
                        // Never use createdAt (today's date) as fallback - only use actual order date
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                        return orderDate >= today && orderDate < tomorrow;
                    } catch (e) {
                        return false;
                    }
                }
            }["CurrentMonthOrdersTab.useMemo[quickFilterCounts].todayOrders"]);
            const yesterdayOrders = currentMonthOrders.filter({
                "CurrentMonthOrdersTab.useMemo[quickFilterCounts].yesterdayOrders": (o)=>{
                    try {
                        // Never use createdAt (today's date) as fallback - only use actual order date
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                        return orderDate >= yesterday && orderDate < today;
                    } catch (e) {
                        return false;
                    }
                }
            }["CurrentMonthOrdersTab.useMemo[quickFilterCounts].yesterdayOrders"]);
            const thisWeekOrders = currentMonthOrders.filter({
                "CurrentMonthOrdersTab.useMemo[quickFilterCounts].thisWeekOrders": (o)=>{
                    try {
                        // Never use createdAt (today's date) as fallback - only use actual order date
                        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                        return orderDate >= thisWeekStart;
                    } catch (e) {
                        return false;
                    }
                }
            }["CurrentMonthOrdersTab.useMemo[quickFilterCounts].thisWeekOrders"]);
            const pendingOrders = currentMonthOrders.filter({
                "CurrentMonthOrdersTab.useMemo[quickFilterCounts].pendingOrders": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status)
            }["CurrentMonthOrdersTab.useMemo[quickFilterCounts].pendingOrders"]);
            const paidOrders = currentMonthOrders.filter({
                "CurrentMonthOrdersTab.useMemo[quickFilterCounts].paidOrders": (o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(o.status)
            }["CurrentMonthOrdersTab.useMemo[quickFilterCounts].paidOrders"]);
            return {
                all: currentMonthOrders.length,
                today: todayOrders.length,
                yesterday: yesterdayOrders.length,
                thisWeek: thisWeekOrders.length,
                pending: pendingOrders.length,
                paid: paidOrders.length
            };
        }
    }["CurrentMonthOrdersTab.useMemo[quickFilterCounts]"], [
        currentMonthOrders,
        today,
        tomorrow,
        yesterday,
        thisWeekStart
    ]);
    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + recordsPerPage);
    // Handle new order change
    const handleNewOrderChange = (field, value)=>{
        const updated = {
            ...newOrder,
            [field]: value
        };
        // Auto-calculate total when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
            const qty = field === 'quantity' ? parseInt(value) || 1 : parseInt(updated.quantity) || 1;
            const price = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(updated.unitPrice) || 0;
            updated.total = qty * price;
        }
        setNewOrder(updated);
    };
    // Handle save order
    const handleSaveOrder = async ()=>{
        try {
            if (onAddOrder) {
                await onAddOrder(newOrder);
                if (showNotification) showNotification('Order added successfully', 'success');
                setShowAddOrderModal(false);
                setNewOrder({
                    date: new Date().toISOString().split('T')[0],
                    deliveryAddress: '',
                    quantity: 1,
                    unitPrice: settings?.defaultUnitPrice || 100,
                    total: settings?.defaultUnitPrice || 100,
                    mode: 'Lunch',
                    status: 'Pending',
                    paymentMode: 'Online'
                });
                if (loadOrders) loadOrders();
            }
        } catch (error) {
            console.error('Error saving order:', error);
            if (showNotification) showNotification('Error saving order', 'error');
        }
    };
    // Get recent addresses for autocomplete
    const recentAddresses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CurrentMonthOrdersTab.useMemo[recentAddresses]": ()=>{
            const addresses = new Set();
            currentMonthOrders.forEach({
                "CurrentMonthOrdersTab.useMemo[recentAddresses]": (o)=>{
                    const addr = o.deliveryAddress || o.customerAddress || o.address;
                    if (addr) addresses.add(addr);
                }
            }["CurrentMonthOrdersTab.useMemo[recentAddresses]"]);
            return Array.from(addresses).slice(0, 10);
        }
    }["CurrentMonthOrdersTab.useMemo[recentAddresses]"], [
        currentMonthOrders
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "dashboard-header",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Current Month Orders"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 322,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                    lineNumber: 321,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    message: "Loading orders...",
                    size: "large"
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
            lineNumber: 320,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-stats",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-rupee-sign"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            "₹",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(currentMonthStats.revenue)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "This Month Revenue"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-shopping-cart"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: currentMonthStats.total
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Total Orders"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 340,
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
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            "₹",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(currentMonthStats.pendingAmount)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 353,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Pending Payments"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 354,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.85rem',
                                            marginTop: '0.25rem',
                                            color: 'var(--admin-text-light)'
                                        },
                                        children: [
                                            currentMonthStats.pendingCount,
                                            " orders"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 347,
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
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: currentMonthStats.growth === Infinity ? 'New' : `${currentMonthStats.growth >= 0 ? '+' : ''}${currentMonthStats.growth.toFixed(1)}%`
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 369,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "vs Last Month"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 376,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.85rem',
                                            marginTop: '0.25rem',
                                            color: 'var(--admin-text-light)'
                                        },
                                        children: currentMonthStats.growth >= 0 ? '↑' : '↓'
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 377,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 368,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 366,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                lineNumber: 332,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card dashboard-card-spaced",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `btn ${quickFilter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                                onClick: ()=>{
                                    setQuickFilter('all');
                                    if (onPageChange) onPageChange(1);
                                },
                                style: {
                                    fontSize: '13px',
                                    padding: '8px 16px'
                                },
                                children: [
                                    "All (",
                                    quickFilterCounts.all,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 394,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `btn ${quickFilter === 'today' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                                onClick: ()=>{
                                    setQuickFilter('today');
                                    if (onPageChange) onPageChange(1);
                                },
                                style: {
                                    fontSize: '13px',
                                    padding: '8px 16px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-calendar-day",
                                        style: {
                                            marginRight: '6px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 412,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Today (",
                                    quickFilterCounts.today,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 404,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `btn ${quickFilter === 'yesterday' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                                onClick: ()=>{
                                    setQuickFilter('yesterday');
                                    if (onPageChange) onPageChange(1);
                                },
                                style: {
                                    fontSize: '13px',
                                    padding: '8px 16px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-calendar",
                                        style: {
                                            marginRight: '6px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 423,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Yesterday (",
                                    quickFilterCounts.yesterday,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 415,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `btn ${quickFilter === 'thisWeek' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                                onClick: ()=>{
                                    setQuickFilter('thisWeek');
                                    if (onPageChange) onPageChange(1);
                                },
                                style: {
                                    fontSize: '13px',
                                    padding: '8px 16px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-calendar-week",
                                        style: {
                                            marginRight: '6px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 434,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "This Week (",
                                    quickFilterCounts.thisWeek,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 426,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `btn ${quickFilter === 'pending' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                                onClick: ()=>{
                                    setQuickFilter('pending');
                                    if (onPageChange) onPageChange(1);
                                },
                                style: {
                                    fontSize: '13px',
                                    padding: '8px 16px',
                                    color: quickFilter === 'pending' ? 'var(--admin-warning)' : undefined
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-exclamation-triangle",
                                        style: {
                                            marginRight: '6px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 449,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Pending (",
                                    quickFilterCounts.pending,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 437,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `btn ${quickFilter === 'paid' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                                onClick: ()=>{
                                    setQuickFilter('paid');
                                    if (onPageChange) onPageChange(1);
                                },
                                style: {
                                    fontSize: '13px',
                                    padding: '8px 16px',
                                    color: quickFilter === 'paid' ? 'var(--admin-success)' : undefined
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-check-circle",
                                        style: {
                                            marginRight: '6px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 464,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Paid (",
                                    quickFilterCounts.paid,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 452,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "search-input-wrapper",
                                style: {
                                    flex: 1,
                                    minWidth: '250px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-search search-input-icon"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 472,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        className: "input-field search-input-with-icon",
                                        placeholder: "Search by address, order ID...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 473,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 471,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "action-buttons-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn btn-secondary btn-small",
                                        title: "Upload CSV",
                                        onClick: ()=>{
                                            // TODO: Open CSV upload modal
                                            if (showNotification) showNotification('CSV upload coming soon', 'info');
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-upload"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 490,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " Upload CSV"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 482,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn btn-secondary btn-small",
                                        title: "Export Month",
                                        onClick: ()=>{
                                            const csvContent = 'Date,Address,Quantity,Amount,Mode,Status,Payment\n' + filteredOrders.map((o)=>{
                                                // Never use createdAt (today's date) as fallback - only use actual order date
                                                const date = new Date(o.date || o.order_date || 0);
                                                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                                                return `"${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(orderDate)}","${o.deliveryAddress || o.customerAddress || o.address || 'N/A'}","${o.quantity || 1}","${o.total || o.totalAmount || 0}","${o.mode || 'N/A'}","${o.status || 'N/A'}","${o.paymentMode || 'N/A'}"`;
                                            }).join('\n');
                                            const blob = new Blob([
                                                csvContent
                                            ], {
                                                type: 'text/csv;charset=utf-8;'
                                            });
                                            const link = document.createElement('a');
                                            link.href = URL.createObjectURL(blob);
                                            link.download = `current_month_export_${new Date().toISOString().split('T')[0]}.csv`;
                                            link.click();
                                            if (showNotification) showNotification('Month data exported successfully', 'success');
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-download"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 521,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " Export Month"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 492,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn btn-ghost btn-small",
                                        title: "Refresh",
                                        onClick: ()=>loadOrders && loadOrders(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-refresh"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 528,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " Refresh"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 523,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 481,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                lineNumber: 391,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                color: 'var(--admin-text-secondary)',
                                fontSize: '0.9rem'
                            },
                            children: [
                                "Showing ",
                                startIndex + 1,
                                "-",
                                Math.min(startIndex + recordsPerPage, filteredOrders.length),
                                ' ',
                                "of ",
                                filteredOrders.length,
                                " orders"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                            lineNumber: 544,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 536,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    filteredOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$EmptyState$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: "fa-solid fa-inbox",
                        title: "No orders found",
                        message: "Try adjusting your filters or add a new order",
                        actionLabel: "Add New Order",
                        onAction: ()=>setShowAddOrderModal(true)
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                        lineNumber: 551,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "orders-table-container",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "orders-table",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "S.No"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 564,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 565,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Address"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 566,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Quantity"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 567,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 568,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Total"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 569,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Mode"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 570,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 571,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Payment"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 572,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "OrderID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 573,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        children: "Actions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 574,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 563,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                            lineNumber: 562,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: paginatedOrders.map((order, idx)=>{
                                                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(// Never use createdAt (today's date) as fallback - only use actual order date
                                                order.date || order.order_date || null);
                                                const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(orderDate);
                                                const isPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPaidStatus"])(order.status);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    onDoubleClick: ()=>{
                                                        setEditingOrder(order);
                                                        setShowAddOrderModal(true);
                                                    },
                                                    style: {
                                                        cursor: 'pointer'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: startIndex + idx + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 595,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: dateStr
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 596,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: order.deliveryAddress || order.customerAddress || order.address || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 597,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: order.quantity || 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 600,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                "₹",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.unitPrice || 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 601,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: [
                                                                "₹",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total || order.totalAmount || 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 602,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: order.mode || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 603,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                className: `status-dropdown ${isPaid ? 'status-paid' : 'status-unpaid'}`,
                                                                value: isPaid ? 'Paid' : 'Unpaid',
                                                                onChange: (e)=>{
                                                                    e.stopPropagation();
                                                                    if (onUpdateOrderStatus) {
                                                                        onUpdateOrderStatus(order._id || order.orderId, e.target.value);
                                                                    }
                                                                },
                                                                onClick: (e)=>e.stopPropagation(),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "Paid",
                                                                        children: "Paid"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                                        lineNumber: 618,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "Unpaid",
                                                                        children: "Unpaid"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                                        lineNumber: 619,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                                lineNumber: 605,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 604,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: order.paymentMode || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 622,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "monospace-text",
                                                            children: order.orderId || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 623,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    gap: '8px'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "action-icon-btn action-icon-edit",
                                                                        onClick: (e)=>{
                                                                            e.stopPropagation();
                                                                            setEditingOrder(order);
                                                                            setShowAddOrderModal(true);
                                                                        },
                                                                        title: "Edit",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fa-solid fa-pencil"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                                            lineNumber: 635,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                                        lineNumber: 626,
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
                                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                                            lineNumber: 645,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                                        lineNumber: 637,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                                lineNumber: 625,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                            lineNumber: 624,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, order._id || order.orderId || idx, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                    lineNumber: 587,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                            lineNumber: 577,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                    lineNumber: 561,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 560,
                                columnNumber: 13
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
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 664,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Previous"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 659,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    margin: '0 16px',
                                                    fontWeight: '600'
                                                },
                                                children: [
                                                    "Page ",
                                                    currentPage,
                                                    " of ",
                                                    totalPages || 1
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 666,
                                                columnNumber: 17
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
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 674,
                                                        columnNumber: 24
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 669,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 658,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Show:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 678,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "input-field",
                                                style: {
                                                    width: '80px',
                                                    padding: '6px 8px'
                                                },
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
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 689,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 50,
                                                        children: "50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 690,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: 100,
                                                        children: "100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                        lineNumber: 691,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 679,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "per page"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                                lineNumber: 693,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                        lineNumber: 677,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                                lineNumber: 657,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                lineNumber: 535,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showAddOrderModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$OrderModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                show: showAddOrderModal,
                editingOrder: editingOrder,
                newOrder: newOrder,
                orders: orders,
                addressSuggestions: recentAddresses,
                showAddressSuggestions: showAddressSuggestions,
                onClose: ()=>{
                    setShowAddOrderModal(false);
                    setEditingOrder(null);
                    setNewOrder({
                        date: new Date().toISOString().split('T')[0],
                        deliveryAddress: '',
                        quantity: 1,
                        unitPrice: settings?.defaultUnitPrice || 100,
                        total: settings?.defaultUnitPrice || 100,
                        mode: 'Lunch',
                        status: 'Pending',
                        paymentMode: 'Online'
                    });
                },
                onSave: editingOrder ? async ()=>{
                    if (onEditOrder) {
                        await onEditOrder(editingOrder._id || editingOrder.orderId, editingOrder);
                        if (showNotification) showNotification('Order updated successfully', 'success');
                    }
                    setShowAddOrderModal(false);
                    setEditingOrder(null);
                    if (loadOrders) loadOrders();
                } : handleSaveOrder,
                onNewOrderChange: handleNewOrderChange,
                onEditingOrderChange: (field, value)=>{
                    setEditingOrder({
                        ...editingOrder,
                        [field]: value
                    });
                },
                setAddressSuggestions: setAddressSuggestions,
                setShowAddressSuggestions: setShowAddressSuggestions
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
                lineNumber: 702,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx",
        lineNumber: 330,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CurrentMonthOrdersTab, "N3fSonFt9wRJdqWqyNei+iSWaBI=");
_c = CurrentMonthOrdersTab;
const __TURBOPACK__default__export__ = CurrentMonthOrdersTab;
var _c;
__turbopack_context__.k.register(_c, "CurrentMonthOrdersTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/calculations.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dateUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx [app-client] (ecmascript)");
;
;
;
;
;
const DashboardTab = ({ orders, setActiveTab, settings, loading = false })=>{
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // CURRENT MONTH ORDERS
    const currentMonthOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredOrdersByDate"])(orders, 'month', '', '');
    const currentMonthTotal = currentMonthOrders.length;
    const currentMonthRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(currentMonthOrders);
    // PROFIT STATISTICS (30% margin after expenses)
    const profitStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$calculations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfitStats"])(currentMonthRevenue, 70, 30);
    const currentMonthUnpaidAmount = currentMonthOrders.filter((o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status)).reduce((sum, o)=>{
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
    }, 0);
    const unpaidOrdersCount = currentMonthOrders.filter((o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status)).length;
    // TOTAL CUSTOMERS (unique addresses)
    const allUniqueAddresses = new Set(orders.map((o)=>o.deliveryAddress || o.customerAddress || o.address).filter(Boolean)).size;
    // MONTH-OVER-MONTH GROWTH
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthOrders = orders.filter((o)=>{
        try {
            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
            return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
        } catch (e) {
            return false;
        }
    });
    const lastMonthRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(lastMonthOrders);
    const monthOverMonthGrowth = lastMonthRevenue > 0 ? (currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100 : currentMonthRevenue > 0 ? Infinity : 0;
    const isNewGrowth = lastMonthRevenue === 0 && currentMonthRevenue > 0;
    // SECONDARY STATS
    // Today's Revenue
    const todayOrders = orders.filter((o)=>{
        try {
            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
            return orderDate >= today && orderDate < tomorrow;
        } catch (e) {
            return false;
        }
    });
    const todayOrdersCount = todayOrders.length;
    const todayRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(todayOrders);
    // This Week Revenue
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    const thisWeekOrders = orders.filter((o)=>{
        try {
            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
            return orderDate >= thisWeekStart;
        } catch (e) {
            return false;
        }
    });
    const thisWeekRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(thisWeekOrders);
    const thisWeekOrdersCount = thisWeekOrders.length;
    // Avg Order Value
    const currentMonthAvgOrderValue = currentMonthTotal > 0 ? Math.round(currentMonthRevenue / currentMonthTotal) : 0;
    // Cancel Rate
    const cancelledOrders = orders.filter((o)=>{
        const status = (o.status || '').toLowerCase();
        return status === 'cancelled' || status === 'cancel';
    });
    const cancelRate = orders.length > 0 ? cancelledOrders.length / orders.length * 100 : 0;
    // CHARTS DATA
    // Revenue Trend (Last 6 Months)
    const last6MonthsRevenue = [];
    for(let i = 5; i >= 0; i--){
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const monthOrders = orders.filter((o)=>{
            try {
                // Never use createdAt (today's date) as fallback - only use actual order date
                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                if (!orderDate) return false;
                return orderDate >= date && orderDate < nextMonth;
            } catch (e) {
                return false;
            }
        });
        // Format as "Feb 2025" (month abbreviation + year)
        const monthName = date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
        const revenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(monthOrders);
        last6MonthsRevenue.push({
            month: monthName,
            revenue: revenue,
            orders: monthOrders.length
        });
    }
    // Orders by Mode (Lunch vs Dinner)
    const ordersByMode = {
        Lunch: 0,
        Dinner: 0,
        'Not Set': 0
    };
    currentMonthOrders.forEach((o)=>{
        const mode = o.mode || 'Not Set';
        ordersByMode[mode] = (ordersByMode[mode] || 0) + 1;
    });
    // Daily Orders This Month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysInMonth = currentMonthEnd.getDate();
    const dailyOrdersData = [];
    for(let day = 1; day <= daysInMonth; day++){
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const dayOrders = currentMonthOrders.filter((o)=>{
            try {
                // Never use createdAt (today's date) as fallback - only use actual order date
                const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(o.date || o.order_date || null);
                if (!orderDate) return false;
                return orderDate >= date && orderDate < nextDay;
            } catch (e) {
                return false;
            }
        });
        dailyOrdersData.push({
            day,
            orders: dayOrders.length,
            revenue: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTotalRevenue"])(dayOrders)
        });
    }
    const maxDailyOrders = Math.max(...dailyOrdersData.map((d)=>d.orders), 1);
    const paymentModeStats = {};
    currentMonthOrders.forEach((o)=>{
        const mode = o.paymentMode || 'Not Set';
        if (!paymentModeStats[mode]) {
            paymentModeStats[mode] = {
                count: 0,
                amount: 0
            };
        }
        paymentModeStats[mode].count++;
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
        paymentModeStats[mode].amount += isNaN(amount) ? 0 : amount;
    });
    // RECENT ORDERS (Last 10) - sorted by orderId (newest first)
    const recentOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortOrdersByOrderId"])(orders).slice(0, 10);
    // MONTH LOCK STATUS
    const getMonthLockStatus = ()=>{
        if (!settings || !settings.monthLockedTill) {
            return {
                status: 'OPEN',
                lockedTill: null
            };
        }
        try {
            const lockedDate = new Date(settings.monthLockedTill);
            const currentDate = new Date();
            if (lockedDate > currentDate) {
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
                const month = monthNames[lockedDate.getMonth()];
                const year = lockedDate.getFullYear();
                return {
                    status: 'LOCKED',
                    lockedTill: `${month} ${year}`
                };
            }
        } catch (e) {}
        return {
            status: 'OPEN',
            lockedTill: null
        };
    };
    const monthLockStatus = getMonthLockStatus();
    // LOADING STATE
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "dashboard-header",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                    lineNumber: 246,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    message: "Loading dashboard data...",
                    size: "large"
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
            lineNumber: 245,
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
                        className: "admin-stats",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-rupee-sign"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 261,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "₹",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(currentMonthRevenue)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 263,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Total Revenue"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 264,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: isNewGrowth ? 'New ↑' : `${monthOverMonthGrowth >= 0 ? '+' : ''}${monthOverMonthGrowth.toFixed(1)}% ${monthOverMonthGrowth >= 0 ? '↑' : '↓'}`
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 265,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 262,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 260,
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
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 273,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: currentMonthTotal
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 275,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Total Orders"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 276,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: "Current month"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 277,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 274,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 272,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-exclamation-triangle stat-card-icon-warning"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 283,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "₹",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(currentMonthUnpaidAmount)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 285,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Pending Payments"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 286,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: [
                                                    unpaidOrdersCount,
                                                    " ",
                                                    unpaidOrdersCount === 1 ? 'order' : 'orders'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 287,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 284,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 282,
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
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 293,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: allUniqueAddresses
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 295,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Total Customers"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 296,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: "Unique addresses"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 297,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 294,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 292,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-chart-line stat-card-icon-success"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 303,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "₹",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(currentMonthAvgOrderValue)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 305,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Avg Order Value"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 306,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 304,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 302,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-chart-line stat-card-icon-success"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 310,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    "₹",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(profitStats.profit)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 312,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Profit After Expenses"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 313,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: [
                                                    profitStats.profitMarginPercent.toFixed(1),
                                                    "% margin"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 314,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 311,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 309,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "stat-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-percent stat-card-icon-secondary"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 320,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: [
                                                    profitStats.profitMarginPercent.toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 322,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Profit Margin"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 323,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "stat-card-subtitle",
                                                children: [
                                                    "Target: ",
                                                    profitStats.targetProfitMargin,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 324,
                                                columnNumber: 13
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 321,
                                        columnNumber: 11
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 319,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                        lineNumber: 259,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-grid-layout",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-grid-item two-thirds",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "dashboard-card widget",
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
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                    lineNumber: 337,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Revenue Trend (Last 6 Months)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                            lineNumber: 336,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                gap: '1rem',
                                                minHeight: '200px',
                                                padding: '1rem',
                                                borderTop: '2px solid var(--admin-border)',
                                                marginTop: '0.5rem'
                                            },
                                            children: last6MonthsRevenue.length > 0 ? (()=>{
                                                const maxRevenue = Math.max(...last6MonthsRevenue.map((m)=>m.revenue), 1);
                                                return last6MonthsRevenue.map((month, idx)=>{
                                                    const barHeight = maxRevenue > 0 ? month.revenue / maxRevenue * 180 : 0;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                    maxWidth: '80px',
                                                                    height: `${Math.max(barHeight, 10)}px`,
                                                                    minHeight: '10px',
                                                                    background: month.revenue > 0 ? 'var(--admin-accent, #449031)' : 'var(--admin-border, #e2e8f0)',
                                                                    borderRadius: '8px 8px 0 0',
                                                                    display: 'flex',
                                                                    alignItems: 'flex-end',
                                                                    justifyContent: 'center',
                                                                    paddingBottom: month.revenue > 0 ? '0.5rem' : '0',
                                                                    cursor: 'pointer',
                                                                    position: 'relative',
                                                                    boxShadow: month.revenue > 0 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                                                                    transition: 'all 0.2s ease'
                                                                },
                                                                title: `${month.month}: ₹${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(month.revenue)} (${month.orders} orders)`,
                                                                onMouseEnter: (e)=>{
                                                                    if (month.revenue > 0) {
                                                                        e.currentTarget.style.transform = 'scaleY(1.05)';
                                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                                                                    }
                                                                },
                                                                onMouseLeave: (e)=>{
                                                                    e.currentTarget.style.transform = 'scaleY(1)';
                                                                    e.currentTarget.style.boxShadow = month.revenue > 0 ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none';
                                                                },
                                                                children: month.revenue > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: 'white',
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: '600'
                                                                    },
                                                                    children: [
                                                                        "₹",
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumberIndian"])(month.revenue)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                    lineNumber: 399,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 367,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '0.75rem',
                                                                    color: 'var(--admin-text-light)',
                                                                    textAlign: 'center',
                                                                    lineHeight: '1.2',
                                                                    fontWeight: '500'
                                                                },
                                                                children: month.month
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 410,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                        lineNumber: 357,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                });
                                            })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "empty-state-text",
                                                children: "No revenue data available"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 426,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                            lineNumber: 340,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                    lineNumber: 335,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 334,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-grid-item third-width",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "dashboard-card widget",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "dashboard-section-title",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-chart-bar",
                                                    style: {
                                                        fontSize: '1rem',
                                                        opacity: 0.7
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                    lineNumber: 438,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "Payment Mode Split"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                            lineNumber: 437,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: '1.5rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1rem',
                                                borderTop: '2px solid var(--admin-border)',
                                                marginTop: '0.5rem'
                                            },
                                            children: Object.entries(paymentModeStats).sort(([, a], [, b])=>b.count - a.count).map(([mode, stats])=>{
                                                const totalCount = Object.values(paymentModeStats).reduce((sum, s)=>sum + s.count, 0);
                                                const percentage = totalCount > 0 ? Math.min(100, parseFloat((stats.count / totalCount * 100).toFixed(2))) : 0;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '0.5rem'
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
                                                                    children: mode
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                    lineNumber: 478,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontWeight: '700',
                                                                        color: 'var(--admin-accent)',
                                                                        fontSize: '1rem'
                                                                    },
                                                                    children: stats.count
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                    lineNumber: 486,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 471,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: '100%',
                                                                height: '28px',
                                                                background: 'var(--admin-glass-border)',
                                                                borderRadius: '6px',
                                                                overflow: 'hidden',
                                                                position: 'relative'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    width: `${percentage}%`,
                                                                    height: '100%',
                                                                    background: `var(--admin-accent, #449031)`,
                                                                    borderRadius: '6px',
                                                                    transition: 'width 0.5s ease',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'flex-end',
                                                                    paddingRight: '0.5rem',
                                                                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
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
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                    lineNumber: 521,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 506,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 496,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '0.85rem',
                                                                color: 'var(--admin-text-light)'
                                                            },
                                                            children: [
                                                                "₹",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(stats.amount)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 533,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, mode, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                    lineNumber: 463,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                            lineNumber: 441,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                    lineNumber: 436,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 435,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                        lineNumber: 332,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    recentOrders.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "recent-orders-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "dashboard-section-title",
                                        style: {
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-clock-rotate-left",
                                                style: {
                                                    fontSize: '1rem',
                                                    opacity: 0.7
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 554,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Recent Orders (Last 10)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 553,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn btn-ghost btn-small",
                                        onClick: ()=>setActiveTab('allOrdersData'),
                                        children: "View All Orders →"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 560,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 552,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-card widget",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "recent-orders-table-container",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "recent-orders-table",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 572,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Address"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 573,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Quantity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 574,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Amount"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 575,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Mode"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 576,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                            lineNumber: 577,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                    lineNumber: 571,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 570,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                children: recentOrders.map((order, idx)=>{
                                                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(// Never use createdAt (today's date) as fallback - only use actual order date
                                                    order.date || order.order_date || null);
                                                    const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(orderDate);
                                                    const status = (order.status || '').toLowerCase();
                                                    const isPaid = status === 'paid';
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: dateStr
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 591,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: order.deliveryAddress || order.customerAddress || order.address || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 592,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: order.quantity || 1
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 598,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: [
                                                                    "₹",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total || order.totalAmount || (order.quantity || 1) * (order.unitPrice || 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 599,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: order.mode || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 607,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `badge ${isPaid ? 'badge-success' : 'badge-warning'}`,
                                                                    children: order.status || 'No Status'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                    lineNumber: 609,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                                lineNumber: 608,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                        lineNumber: 590,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                                lineNumber: 580,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                        lineNumber: 569,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                    lineNumber: 568,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                                lineNumber: 567,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                        lineNumber: 551,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
                lineNumber: 257,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
            lineNumber: 256,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx",
        lineNumber: 255,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = DashboardTab;
const __TURBOPACK__default__export__ = DashboardTab;
var _c;
__turbopack_context__.k.register(_c, "DashboardTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dateUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const ImportantNotificationsBanner = ({ orders = [], onDismiss, onViewOrder, onViewPendingAmounts, dismissedNotifications = [] })=>{
    _s();
    // Calculate important notifications
    const importantNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ImportantNotificationsBanner.useMemo[importantNotifications]": ()=>{
            const notifications = [];
            const now = new Date();
            const fortyFiveDaysAgo = new Date(now);
            fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
            fortyFiveDaysAgo.setHours(0, 0, 0, 0); // Set to midnight for consistent date comparison
            // 1. Overdue payments (pending > 45 days)
            const overdueOrders = orders.filter({
                "ImportantNotificationsBanner.useMemo[importantNotifications].overdueOrders": (order)=>{
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(order.status)) return false;
                    // Never use createdAt (today's date) as fallback - only use actual order date
                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                    if (!orderDate) return false;
                    // Normalize orderDate to midnight for comparison
                    const orderDateMidnight = new Date(orderDate);
                    orderDateMidnight.setHours(0, 0, 0, 0);
                    return orderDateMidnight < fortyFiveDaysAgo;
                }
            }["ImportantNotificationsBanner.useMemo[importantNotifications].overdueOrders"]);
            if (overdueOrders.length > 0) {
                const totalOverdue = overdueOrders.reduce({
                    "ImportantNotificationsBanner.useMemo[importantNotifications].totalOverdue": (sum, o)=>{
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
                }["ImportantNotificationsBanner.useMemo[importantNotifications].totalOverdue"], 0);
                notifications.push({
                    id: 'overdue-payments',
                    type: 'danger',
                    icon: 'fa-exclamation-triangle',
                    title: 'Overdue Payments',
                    message: `${overdueOrders.length} order${overdueOrders.length > 1 ? 's' : ''} overdue (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalOverdue)})`,
                    action: 'viewPending',
                    priority: 1
                });
            }
            // 2. Urgent payments (pending 3-7 days)
            const threeDaysAgo = new Date(now);
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const urgentOrders = orders.filter({
                "ImportantNotificationsBanner.useMemo[importantNotifications].urgentOrders": (order)=>{
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(order.status)) return false;
                    // Never use createdAt (today's date) as fallback - only use actual order date
                    const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
                    if (!orderDate) return false;
                    return orderDate >= threeDaysAgo && orderDate < sevenDaysAgo;
                }
            }["ImportantNotificationsBanner.useMemo[importantNotifications].urgentOrders"]);
            if (urgentOrders.length > 0) {
                const totalUrgent = urgentOrders.reduce({
                    "ImportantNotificationsBanner.useMemo[importantNotifications].totalUrgent": (sum, o)=>{
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
                }["ImportantNotificationsBanner.useMemo[importantNotifications].totalUrgent"], 0);
                notifications.push({
                    id: 'urgent-payments',
                    type: 'warning',
                    icon: 'fa-clock',
                    title: 'Urgent Payments',
                    message: `${urgentOrders.length} order${urgentOrders.length > 1 ? 's' : ''} pending payment (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalUrgent)})`,
                    action: 'viewPending',
                    priority: 2
                });
            }
            const highValuePending = orders.filter({
                "ImportantNotificationsBanner.useMemo[importantNotifications].highValuePending": (order)=>{
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(order.status)) return false;
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
                    return amount > 500;
                }
            }["ImportantNotificationsBanner.useMemo[importantNotifications].highValuePending"]);
            if (highValuePending.length > 0) {
                const totalHighValue = highValuePending.reduce({
                    "ImportantNotificationsBanner.useMemo[importantNotifications].totalHighValue": (sum, o)=>{
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
                }["ImportantNotificationsBanner.useMemo[importantNotifications].totalHighValue"], 0);
                notifications.push({
                    id: 'high-value-pending',
                    type: 'info',
                    icon: 'fa-money-bill-wave',
                    title: 'High Value Pending',
                    message: `${highValuePending.length} high-value order${highValuePending.length > 1 ? 's' : ''} pending (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalHighValue)})`,
                    action: 'viewPending',
                    priority: 3
                });
            }
            // Filter out dismissed notifications
            return notifications.filter({
                "ImportantNotificationsBanner.useMemo[importantNotifications]": (notif)=>!dismissedNotifications.includes(notif.id)
            }["ImportantNotificationsBanner.useMemo[importantNotifications]"]).sort({
                "ImportantNotificationsBanner.useMemo[importantNotifications]": (a, b)=>a.priority - b.priority
            }["ImportantNotificationsBanner.useMemo[importantNotifications]"]);
        }
    }["ImportantNotificationsBanner.useMemo[importantNotifications]"], [
        orders,
        dismissedNotifications
    ]);
    if (importantNotifications.length === 0) return null;
    const getNotificationStyles = (type)=>{
        switch(type){
            case 'danger':
                return {
                    background: 'rgba(220, 38, 38, 0.08)',
                    borderColor: 'var(--admin-danger, #dc2626)',
                    iconColor: 'var(--admin-danger, #dc2626)',
                    textColor: 'var(--admin-danger, #dc2626)'
                };
            case 'warning':
                return {
                    background: 'rgba(245, 158, 11, 0.08)',
                    borderColor: 'var(--admin-warning, #f59e0b)',
                    iconColor: 'var(--admin-warning, #f59e0b)',
                    textColor: 'var(--admin-warning, #f59e0b)'
                };
            default:
                return {
                    background: 'rgba(68, 144, 49, 0.08)',
                    borderColor: 'var(--admin-accent, #449031)',
                    iconColor: 'var(--admin-accent, #449031)',
                    textColor: 'var(--admin-accent, #449031)'
                };
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "important-notifications-banner",
        children: importantNotifications.map((notif)=>{
            const styles = getNotificationStyles(notif.type);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "important-notification-item",
                style: {
                    background: styles.background,
                    borderLeft: `4px solid ${styles.borderColor}`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "important-notification-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "important-notification-icon",
                                style: {
                                    color: styles.iconColor
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: `fa-solid ${notif.icon}`
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                                    lineNumber: 191,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                                lineNumber: 190,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "important-notification-text",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "important-notification-title",
                                        style: {
                                            color: styles.textColor
                                        },
                                        children: notif.title
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                                        lineNumber: 194,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "important-notification-message",
                                        children: notif.message
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                                        lineNumber: 197,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                                lineNumber: 193,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                        lineNumber: 189,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "important-notification-actions",
                        children: [
                            notif.action === 'viewPending' && onViewPendingAmounts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-primary btn-small",
                                onClick: ()=>onViewPendingAmounts(),
                                style: {
                                    marginRight: '8px'
                                },
                                children: "View Details"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                                lineNumber: 202,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            onDismiss && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-ghost btn-small",
                                onClick: ()=>onDismiss(notif.id),
                                title: "Dismiss",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-times"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                                    lineNumber: 216,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                                lineNumber: 211,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                        lineNumber: 200,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, notif.id, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
                lineNumber: 181,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx",
        lineNumber: 177,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ImportantNotificationsBanner, "86jnaTm09HaYZsZ9u8QnCW9VYmg=");
_c = ImportantNotificationsBanner;
const __TURBOPACK__default__export__ = ImportantNotificationsBanner;
var _c;
__turbopack_context__.k.register(_c, "ImportantNotificationsBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const InstallPrompt = ()=>{
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [deferredPrompt, setDeferredPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showIOSPrompt, setShowIOSPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInstalled, setIsInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Only show on admin pages (not on public website)
    // Admin routes: /admin, /admin/* (dashboard, login, forgot-password, etc.)
    // Public routes: /, /menu, /offers, /faq, /search, etc. - should NOT show InstallPrompt
    const isAdminPage = pathname && (pathname === '/admin' || pathname.startsWith('/admin/'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InstallPrompt.useEffect": ()=>{
            // Don't run if not on admin page
            if (!isAdminPage) {
                return;
            }
            // Check if already installed
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            if (isStandalone) {
                setIsInstalled(true);
                return;
            }
            // Aggressive iOS detection - works for ANY browser on iOS
            const isIOS = {
                "InstallPrompt.useEffect.isIOS": ()=>{
                    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
                    const platform = navigator.platform || '';
                    const vendor = navigator.vendor || '';
                    // Multiple detection methods
                    const checks = [
                        /iPad|iPhone|iPod/.test(userAgent),
                        platform === 'MacIntel' && navigator.maxTouchPoints > 1,
                        /iPhone|iPad|iPod/.test(vendor),
                        /iPhone|iPad|iPod/.test(platform),
                        window.DeviceMotionEvent !== undefined && /iPhone|iPad|iPod/.test(userAgent)
                    ];
                    const isIOSDevice = checks.some({
                        "InstallPrompt.useEffect.isIOS.isIOSDevice": (check)=>check === true
                    }["InstallPrompt.useEffect.isIOS.isIOSDevice"]);
                    return isIOSDevice;
                }
            }["InstallPrompt.useEffect.isIOS"];
            const detectedIOS = isIOS();
            // Show prompt for ANY browser on iOS (iPhone/iPad)
            // Also check for mobile Safari specifically
            const isMobile = window.innerWidth < 1024;
            const shouldShow = detectedIOS || isMobile && /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
            if (shouldShow || detectedIOS) {
                // Add a delay to ensure the page is fully loaded
                const timer = setTimeout({
                    "InstallPrompt.useEffect.timer": ()=>{
                        const hasSeenPrompt = localStorage.getItem('pwa-ios-prompt-seen');
                        if (!hasSeenPrompt) {
                            setShowIOSPrompt(true);
                        }
                    }
                }["InstallPrompt.useEffect.timer"], 1500);
                return ({
                    "InstallPrompt.useEffect": ()=>clearTimeout(timer)
                })["InstallPrompt.useEffect"];
            }
            // Listen for beforeinstallprompt (Android/Chrome)
            const handleBeforeInstallPrompt = {
                "InstallPrompt.useEffect.handleBeforeInstallPrompt": (e)=>{
                    // Prevent default browser install prompt - we'll show custom button instead
                    e.preventDefault();
                    setDeferredPrompt(e);
                }
            }["InstallPrompt.useEffect.handleBeforeInstallPrompt"];
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt, {
                passive: false
            });
            return ({
                "InstallPrompt.useEffect": ()=>{
                    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
                }
            })["InstallPrompt.useEffect"];
        }
    }["InstallPrompt.useEffect"], [
        isAdminPage
    ]);
    const handleInstallClick = async ()=>{
        if (deferredPrompt) {
            // Android/Chrome install
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };
    const handleIOSDismiss = ()=>{
        setShowIOSPrompt(false);
        localStorage.setItem('pwa-ios-prompt-seen', 'true');
    };
    // Don't show if not on admin page or already installed
    if (!isAdminPage || isInstalled) {
        return null;
    }
    // iOS Install Instructions
    if (showIOSPrompt) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            id: "pwa-install-prompt",
            className: "pwa-install-prompt-ios",
            style: {
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: 'calc(100vw - 40px)',
                width: 'min(400px, calc(100vw - 40px))',
                background: '#ffffff',
                border: '2px solid var(--admin-accent, #449031)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                zIndex: 99999,
                animation: 'slideUp 0.3s ease',
                boxSizing: 'border-box'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: 600,
                                color: 'var(--admin-text, #1a202c)'
                            },
                            children: "Install App"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleIOSDismiss,
                            style: {
                                background: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: 'var(--admin-text-secondary, #64748b)',
                                padding: 0,
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        margin: '0 0 16px 0',
                        fontSize: '14px',
                        color: 'var(--admin-text-secondary, #64748b)',
                        lineHeight: '1.5'
                    },
                    children: "Install this app on your iPhone for quick access:"
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                    style: {
                        margin: '0 0 16px 0',
                        paddingLeft: '20px',
                        fontSize: '14px',
                        color: 'var(--admin-text, #1a202c)',
                        lineHeight: '1.8'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            style: {
                                marginBottom: '8px'
                            },
                            children: [
                                "Tap the ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Share"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                                    lineNumber: 187,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0)),
                                " button",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '18px',
                                        display: 'inline-block',
                                        transform: 'rotate(45deg)'
                                    },
                                    children: "□"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                ' ',
                                "at the bottom of your browser"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            style: {
                                marginBottom: '8px'
                            },
                            children: [
                                "Scroll down and tap ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: '"Add to Home Screen"'
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                                    lineNumber: 194,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)),
                                " or",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: '"Add to Home"'
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: [
                                "Tap ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: '"Add"'
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                                    lineNumber: 198,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                " to confirm"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                    lineNumber: 177,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        gap: '12px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleIOSDismiss,
                            className: "btn btn-ghost",
                            style: {
                                flex: 1
                            },
                            children: "Maybe Later"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleIOSDismiss,
                            className: "btn btn-primary",
                            style: {
                                flex: 1
                            },
                            children: "Got it!"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                    lineNumber: 201,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
            lineNumber: 110,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Android/Chrome Install Button
    if (deferredPrompt) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "install-prompt-button-container",
            style: {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                left: 'auto',
                zIndex: 10000,
                maxWidth: 'calc(100vw - 40px)',
                boxSizing: 'border-box'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleInstallClick,
                className: "btn btn-primary install-prompt-button",
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(68, 144, 49, 0.3)',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-download"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                        lineNumber: 241,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: "Install App"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                        lineNumber: 242,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
                lineNumber: 228,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx",
            lineNumber: 216,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return null;
};
_s(InstallPrompt, "a8idjv0TGnupFmhjiz82p1J9Z7I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = InstallPrompt;
const __TURBOPACK__default__export__ = InstallPrompt;
var _c;
__turbopack_context__.k.register(_c, "InstallPrompt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dateUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
// Get time ago helper
function getTimeAgo(date) {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateMonthDay"])(date);
}
const NotificationsTab = ({ orders = [], showNotification, loading = false, onViewOrder, onMarkAsPaid, onSendReminder, setActiveTab, showConfirmation })=>{
    _s();
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all'); // 'all', 'unread', 'payments', 'orders', 'system'
    const [readNotifications, setReadNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [showSettingsModal, setShowSettingsModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notificationSettings, setNotificationSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        notifyNewOrders: true,
        notifyPaymentReceived: true,
        notifyPaymentOverdue: true,
        notifyDailySummary: true,
        notifyWeeklyReport: false,
        notifyLowOrderDays: false,
        deliveryInApp: true,
        deliveryEmail: true,
        deliverySMS: false
    });
    // Generate notifications from orders - REAL DATA
    const notifications = [];
    const now = new Date();
    // Calculate overdue threshold (45 days like PendingAmountsTab)
    const fortyFiveDaysAgo = new Date(now);
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    fortyFiveDaysAgo.setHours(0, 0, 0, 0);
    // Overdue payments notifications (most urgent - show first)
    const pendingOrders = orders.filter((o)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPendingStatus"])(o.status));
    const overduePayments = pendingOrders.map((order)=>{
        try {
            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
            if (!orderDate) return null;
            const orderDateMidnight = new Date(orderDate);
            orderDateMidnight.setHours(0, 0, 0, 0);
            const daysPending = Math.floor((now - orderDateMidnight) / (1000 * 60 * 60 * 24));
            const isOverdue = orderDateMidnight < fortyFiveDaysAgo;
            const isUrgent = daysPending > 7;
            return {
                order,
                orderDate,
                daysPending,
                isOverdue,
                isUrgent
            };
        } catch (e) {
            return null;
        }
    }).filter((item)=>item && (item.isOverdue || item.isUrgent)).sort((a, b)=>b.daysPending - a.daysPending).slice(0, 15); // Show up to 15 overdue/urgent payments
    overduePayments.forEach(({ order, orderDate, daysPending, isOverdue })=>{
        const timeAgo = getTimeAgo(orderDate);
        const address = order.deliveryAddress || order.customerAddress || order.address || 'N/A';
        notifications.push({
            id: `payment-${order._id || order.orderId}`,
            type: 'payment',
            title: isOverdue ? 'Payment Overdue' : 'Payment Pending',
            message: `Order #${order.orderId || 'N/A'} from ${address}`,
            details: `₹${order.total || order.totalAmount || 0} • ${daysPending} days pending`,
            timeAgo,
            read: false,
            action: isOverdue ? 'viewPendingPayments' : 'sendReminder',
            orderId: order._id || order.orderId,
            daysPending,
            isOverdue
        });
    });
    // Recent orders notifications (last 7 days, limit to 10)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // Get recent orders from last 7 days, sorted by orderId (newest first)
    const recentOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortOrdersByOrderId"])(orders.filter((order)=>{
        try {
            const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
            if (!orderDate) return false;
            return orderDate >= sevenDaysAgo;
        } catch (e) {
            return false;
        }
    })).slice(0, 10);
    recentOrders.forEach((order)=>{
        const orderDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dateUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseOrderDate"])(order.date || order.order_date || null);
        if (!orderDate) return;
        const timeAgo = getTimeAgo(orderDate);
        notifications.push({
            id: `order-${order._id || order.orderId}`,
            type: 'order',
            title: 'New Order Received',
            message: `Order #${order.orderId || 'N/A'} from ${order.deliveryAddress || order.customerAddress || order.address || 'N/A'}`,
            details: `₹${order.total || order.totalAmount || 0} • ${order.mode || 'N/A'} • ${order.status || 'N/A'}`,
            timeAgo,
            read: false,
            action: 'viewOrder',
            orderId: order._id || order.orderId
        });
    });
    // Sort notifications: overdue payments first, then by date (newest first)
    notifications.sort((a, b)=>{
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        // For same type, sort by time (newer first)
        const timeA = a.timeAgo.includes('mins') ? 0 : a.timeAgo.includes('hour') ? 1 : 2;
        const timeB = b.timeAgo.includes('mins') ? 0 : b.timeAgo.includes('hour') ? 1 : 2;
        return timeA - timeB;
    });
    const notificationsWithReadState = notifications.map((notif)=>({
            ...notif,
            read: readNotifications.has(notif.id) || notif.read
        }));
    // Filter notifications
    const filteredNotifications = notificationsWithReadState.filter((notif)=>{
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.read;
        if (filter === 'payments') return notif.type === 'payment';
        if (filter === 'orders') return notif.type === 'order';
        if (filter === 'system') return notif.type === 'system';
        return true;
    });
    // Counts
    const unreadCount = notificationsWithReadState.filter((n)=>!n.read).length;
    const paymentCount = notifications.filter((n)=>n.type === 'payment').length;
    const orderCount = notifications.filter((n)=>n.type === 'order').length;
    const systemCount = notifications.filter((n)=>n.type === 'system').length;
    const handleMarkAsRead = (id)=>{
        setReadNotifications((prev)=>{
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
        if (showNotification) showNotification('Notification marked as read', 'success');
    };
    const handleMarkAllAsRead = ()=>{
        const allIds = notifications.map((n)=>n.id);
        setReadNotifications(new Set(allIds));
        if (showNotification) showNotification('All notifications marked as read', 'success');
    };
    // Handle notification action
    const handleAction = (notif)=>{
        switch(notif.action){
            case 'viewOrder':
                if (onViewOrder) {
                    onViewOrder(notif.orderId);
                } else if (setActiveTab) {
                    setActiveTab('allOrdersData');
                }
                break;
            case 'viewPendingPayments':
                if (setActiveTab) {
                    setActiveTab('pendingAmounts');
                    if (showNotification) {
                        showNotification('Showing overdue payments', 'info');
                    }
                }
                break;
            case 'sendReminder':
                if (onSendReminder) {
                    onSendReminder(notif.orderId);
                } else if (setActiveTab) {
                    setActiveTab('pendingAmounts');
                }
                break;
            case 'markAsPaid':
                if (showConfirmation && onMarkAsPaid) {
                    const order = orders.find((o)=>(o._id || o.orderId) === notif.orderId);
                    const orderInfo = order ? `Order ${order.orderId || notif.orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}` : `Order ${notif.orderId}`;
                    showConfirmation({
                        title: 'Mark as Paid',
                        message: `Are you sure you want to mark ${orderInfo} as paid?`,
                        type: 'info',
                        confirmText: 'Mark as Paid',
                        onConfirm: ()=>{
                            onMarkAsPaid(notif.orderId);
                        }
                    });
                } else if (onMarkAsPaid) {
                    onMarkAsPaid(notif.orderId);
                }
                break;
            case 'viewReport':
                if (setActiveTab) setActiveTab('reports');
                break;
            case 'viewDetails':
                break;
        }
    };
    // Get notification icon
    const getNotificationIcon = (type)=>{
        switch(type){
            case 'order':
                return 'fa-solid fa-shopping-cart';
            case 'payment':
                return 'fa-solid fa-money-bill-wave';
            case 'system':
                return 'fa-solid fa-info-circle';
            default:
                return 'fa-solid fa-bell';
        }
    };
    // Get notification color
    const getNotificationColor = (type)=>{
        switch(type){
            case 'order':
                return 'var(--admin-accent)';
            case 'payment':
                return 'var(--admin-warning)';
            case 'system':
                return 'var(--admin-info)';
            default:
                return 'var(--admin-text-secondary)';
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: "Loading notifications...",
                size: "large"
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                lineNumber: 261,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
            lineNumber: 260,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: [
                                "Notifications (",
                                unreadCount,
                                " unread)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                            lineNumber: 270,
                            columnNumber: 34
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "action-buttons-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-secondary btn-small",
                                onClick: handleMarkAllAsRead,
                                children: "Mark All as Read"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-ghost btn-small",
                                onClick: ()=>setShowSettingsModal(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-cog"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                        lineNumber: 276,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Settings"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                lineNumber: 269,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "action-bar action-bar-spaced",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                        onClick: ()=>setFilter('all'),
                        children: [
                            "All (",
                            notifications.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `btn ${filter === 'unread' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                        onClick: ()=>setFilter('unread'),
                        children: [
                            "Unread (",
                            unreadCount,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `btn ${filter === 'payments' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                        onClick: ()=>setFilter('payments'),
                        children: [
                            "Payments (",
                            paymentCount,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `btn ${filter === 'orders' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                        onClick: ()=>setFilter('orders'),
                        children: [
                            "Orders (",
                            orderCount,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `btn ${filter === 'system' ? 'btn-primary' : 'btn-ghost'} btn-small`,
                        onClick: ()=>setFilter('system'),
                        children: [
                            "System (",
                            systemCount,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                        lineNumber: 307,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                lineNumber: 282,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card",
                children: filteredNotifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "empty-state",
                    style: {
                        padding: '48px',
                        textAlign: 'center'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fa-solid fa-bell-slash",
                            style: {
                                fontSize: '64px',
                                color: 'var(--admin-text-light)',
                                marginBottom: '16px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                            lineNumber: 319,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "No notifications"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                            lineNumber: 323,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: 'var(--admin-text-light)',
                                fontSize: '0.9rem'
                            },
                            children: "You're all caught up!"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                            lineNumber: 324,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                    lineNumber: 318,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "notification-grid-4-col list list-group",
                    children: filteredNotifications.map((notif)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `notification-card-grid list-item ${notif.read ? 'read' : 'unread'} ${notif.isOverdue ? 'overdue' : ''}`,
                            onClick: ()=>handleAction(notif),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "notification-card-grid-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "notification-card-grid-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: getNotificationIcon(notif.type),
                                                style: {
                                                    color: getNotificationColor(notif.type)
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                lineNumber: 338,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                            lineNumber: 337,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        !notif.read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "notification-badge-unread-grid",
                                            children: "New"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                            lineNumber: 343,
                                            columnNumber: 35
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                    lineNumber: 336,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "notification-card-grid-content",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "notification-card-grid-title",
                                            children: notif.title
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                            lineNumber: 346,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "notification-card-grid-message",
                                            children: notif.message
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                            lineNumber: 347,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "notification-card-grid-details",
                                            children: notif.details
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                            lineNumber: 348,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "notification-card-grid-footer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "notification-card-grid-time",
                                                    children: notif.timeAgo
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                    lineNumber: 350,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "notification-card-grid-actions",
                                                    children: [
                                                        notif.action === 'viewPendingPayments' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn btn-primary btn-small btn-full",
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleAction(notif);
                                                            },
                                                            children: "View Payments"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                            lineNumber: 353,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        notif.action === 'viewOrder' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn btn-primary btn-small btn-full",
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleAction(notif);
                                                            },
                                                            children: "View Order"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                            lineNumber: 364,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        notif.action === 'sendReminder' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn btn-secondary btn-small btn-full",
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleAction(notif);
                                                            },
                                                            children: "Send Reminder"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                            lineNumber: 375,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn btn-ghost btn-small btn-full",
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleMarkAsRead(notif.id);
                                                            },
                                                            title: "Mark as Read",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fa-solid fa-check"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                    lineNumber: 393,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Read"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                            lineNumber: 385,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                    lineNumber: 351,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                            lineNumber: 349,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                    lineNumber: 345,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, notif.id, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                            lineNumber: 331,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                    lineNumber: 329,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                lineNumber: 316,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showSettingsModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                onClick: ()=>setShowSettingsModal(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-container",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Notification Settings"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                    lineNumber: 409,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "modal-close",
                                    onClick: ()=>setShowSettingsModal(false),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-times"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                        lineNumber: 411,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                    lineNumber: 410,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                            lineNumber: 408,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontWeight: '600',
                                                    marginBottom: '12px',
                                                    display: 'block'
                                                },
                                                children: "Notify me about:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                lineNumber: 417,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '12px'
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
                                                                checked: notificationSettings.notifyNewOrders,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        notifyNewOrders: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 429,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "New orders"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 439,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 421,
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
                                                                checked: notificationSettings.notifyPaymentReceived,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        notifyPaymentReceived: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 449,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Payment received"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 459,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 441,
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
                                                                checked: notificationSettings.notifyPaymentOverdue,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        notifyPaymentOverdue: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 469,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Payment overdue (>3 days)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 479,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 461,
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
                                                                checked: notificationSettings.notifyDailySummary,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        notifyDailySummary: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 489,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Daily summary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 499,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 481,
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
                                                                checked: notificationSettings.notifyWeeklyReport,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        notifyWeeklyReport: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 509,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Weekly report"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 519,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 501,
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
                                                                checked: notificationSettings.notifyLowOrderDays,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        notifyLowOrderDays: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 529,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Low order days"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 539,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 521,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                lineNumber: 420,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                        lineNumber: 416,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontWeight: '600',
                                                    marginBottom: '12px',
                                                    display: 'block'
                                                },
                                                children: "Delivery method:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                lineNumber: 544,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '12px'
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
                                                                checked: notificationSettings.deliveryInApp,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        deliveryInApp: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 556,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "In-app"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 566,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 548,
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
                                                                checked: notificationSettings.deliveryEmail,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        deliveryEmail: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 576,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Email"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 586,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 568,
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
                                                                checked: notificationSettings.deliverySMS,
                                                                onChange: (e)=>setNotificationSettings({
                                                                        ...notificationSettings,
                                                                        deliverySMS: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 596,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "SMS"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                                lineNumber: 606,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                        lineNumber: 588,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                                lineNumber: 547,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                        lineNumber: 543,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                lineNumber: 415,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                            lineNumber: 414,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-ghost",
                                    onClick: ()=>setShowSettingsModal(false),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                    lineNumber: 613,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary",
                                    onClick: ()=>{
                                        // In real app, would save via API
                                        if (showNotification) showNotification('Notification settings saved', 'success');
                                        setShowSettingsModal(false);
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-save"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                            lineNumber: 624,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " Save"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                                    lineNumber: 616,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                            lineNumber: 612,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                    lineNumber: 407,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
                lineNumber: 406,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx",
        lineNumber: 267,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NotificationsTab, "2iS1PigbFXFgaI+jNqm7a7IEvZg=");
_c = NotificationsTab;
const __TURBOPACK__default__export__ = NotificationsTab;
var _c;
__turbopack_context__.k.register(_c, "NotificationsTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$adminConfig$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/adminConfig.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed, currentUser, onLogout })=>{
    _s();
    const [showProfileDropdown, setShowProfileDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const profileDropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Close profile dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            const handleClickOutside = {
                "Sidebar.useEffect.handleClickOutside": (event)=>{
                    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                        setShowProfileDropdown(false);
                    }
                }
            }["Sidebar.useEffect.handleClickOutside"];
            if (showProfileDropdown) {
                document.addEventListener("mousedown", handleClickOutside);
                return ({
                    "Sidebar.useEffect": ()=>{
                        document.removeEventListener("mousedown", handleClickOutside);
                    }
                })["Sidebar.useEffect"];
            }
        }
    }["Sidebar.useEffect"], [
        showProfileDropdown
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `admin-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sidebar-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sidebar-logo",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/logo.png",
                            alt: "HomieBites",
                            className: "sidebar-logo-img",
                            onError: (e)=>{
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            },
                            onClick: ()=>setActiveTab("dashboard"),
                            style: {
                                cursor: "pointer"
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sidebar-logo-fallback",
                            style: {
                                display: "none"
                            },
                            onClick: ()=>setActiveTab("dashboard"),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-shield-halved"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                lineNumber: 40,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "sidebar-nav",
                children: [
                    {
                        key: "dashboard",
                        tabKey: "dashboard"
                    },
                    {
                        key: "excelViewer",
                        tabKey: "allOrdersData"
                    },
                    {
                        key: "orders",
                        tabKey: "currentMonthOrders"
                    },
                    {
                        key: "analytics",
                        tabKey: "analytics"
                    },
                    {
                        key: "customers",
                        tabKey: "customers"
                    },
                    {
                        key: "reports",
                        tabKey: "reports"
                    },
                    {
                        key: "users",
                        tabKey: "pendingAmounts"
                    },
                    {
                        key: "menuPrice",
                        tabKey: "menuPrice"
                    },
                    {
                        key: "notifications",
                        tabKey: "notifications"
                    },
                    {
                        key: "settings",
                        tabKey: "settings"
                    }
                ].map(({ key, tabKey })=>[
                        key,
                        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$adminConfig$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminFeatures"][key],
                        tabKey
                    ]).filter(([key, feature])=>feature && feature.enabled).map(([key, feature, tabKey])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `sidebar-item ${activeTab === tabKey ? "active" : ""}`,
                        onClick: ()=>{
                            setActiveTab(tabKey);
                            setSidebarOpen(false);
                        },
                        title: sidebarCollapsed ? feature.name : "",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: `fa-solid ${feature.icon}`
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 84,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: feature.name
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 85,
                                columnNumber: 37
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, key, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                        lineNumber: 75,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                lineNumber: 59,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sidebar-footer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sidebar-profile-section",
                        ref: profileDropdownRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "sidebar-profile-btn sidebar-item",
                                onClick: ()=>setShowProfileDropdown(!showProfileDropdown),
                                title: sidebarCollapsed ? "Profile" : "",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sidebar-profile-avatar",
                                        children: currentUser?.name ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: currentUser.name.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0, 2)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                            lineNumber: 100,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-user"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                            lineNumber: 109,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sidebar-profile-info",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sidebar-profile-name",
                                            children: currentUser?.name || "Admin User"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                            lineNumber: 114,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: `fa-solid fa-chevron-${showProfileDropdown ? "up" : "down"}`,
                                        style: {
                                            marginLeft: "auto",
                                            fontSize: "12px",
                                            opacity: 0.6
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                        lineNumber: 120,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            showProfileDropdown && !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sidebar-profile-dropdown",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "sidebar-profile-dropdown-item",
                                        onClick: ()=>{
                                            setActiveTab("settings");
                                            setShowProfileDropdown(false);
                                            setSidebarOpen(false);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-user-gear"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Profile Settings"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                                lineNumber: 139,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "sidebar-profile-dropdown-item",
                                        onClick: ()=>{
                                            setActiveTab("settings");
                                            setShowProfileDropdown(false);
                                            setSidebarOpen(false);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-cog"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Settings"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sidebar-profile-divider"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "sidebar-profile-dropdown-item sidebar-profile-dropdown-item-danger",
                                        onClick: ()=>{
                                            setShowProfileDropdown(false);
                                            onLogout();
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-sign-out-alt"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Logout"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-toggle-btn sidebar-item",
                        onClick: ()=>setSidebarCollapsed(!sidebarCollapsed),
                        title: sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: `fa-solid ${sidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Collapse"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 175,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-item logout-btn",
                        onClick: onLogout,
                        title: sidebarCollapsed ? "Logout" : "",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-arrow-right-from-bracket"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Logout"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                                lineNumber: 184,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
                lineNumber: 90,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx",
        lineNumber: 37,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Sidebar, "hRPwy2kVyp0W27fcFa4renMae5E=");
_c = Sidebar;
const __TURBOPACK__default__export__ = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const TopNav = ({ sidebarOpen, setSidebarOpen, unreadNotifications, currentUser, onLogout, setActiveTab, tabTitle, tabSubtitle, tabAction, onNewOrder, onRefresh })=>{
    _s();
    const [showSearchModal, setShowSearchModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showProfileDropdown, setShowProfileDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [recentSearches, setRecentSearches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [refreshing, setRefreshing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const profileDropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Global keyboard shortcuts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopNav.useEffect": ()=>{
            const handleKeyDown = {
                "TopNav.useEffect.handleKeyDown": (e)=>{
                    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                        e.preventDefault();
                        setShowSearchModal(true);
                    }
                    // New Order shortcut (Ctrl+N / Cmd+N)
                    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                        e.preventDefault();
                        if (onNewOrder) {
                            onNewOrder();
                        }
                    }
                    // Close search modal with Escape
                    if (e.key === 'Escape' && showSearchModal) {
                        setShowSearchModal(false);
                    }
                }
            }["TopNav.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "TopNav.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["TopNav.useEffect"];
        }
    }["TopNav.useEffect"], [
        showSearchModal,
        onNewOrder
    ]);
    // Close profile dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopNav.useEffect": ()=>{
            const handleClickOutside = {
                "TopNav.useEffect.handleClickOutside": (event)=>{
                    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                        setShowProfileDropdown(false);
                    }
                }
            }["TopNav.useEffect.handleClickOutside"];
            if (showProfileDropdown) {
                document.addEventListener('mousedown', handleClickOutside);
                return ({
                    "TopNav.useEffect": ()=>{
                        document.removeEventListener('mousedown', handleClickOutside);
                    }
                })["TopNav.useEffect"];
            }
        }
    }["TopNav.useEffect"], [
        showProfileDropdown
    ]);
    // Load recent searches from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TopNav.useEffect": ()=>{
            const stored = localStorage.getItem('homiebites_recent_searches');
            if (stored) {
                try {
                    setRecentSearches(JSON.parse(stored));
                } catch (e) {
                    setRecentSearches([]);
                }
            }
        }
    }["TopNav.useEffect"], []);
    const handleSearch = (query)=>{
        if (!query.trim()) return;
        // Add to recent searches
        const updated = [
            query,
            ...recentSearches.filter((s)=>s !== query)
        ].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('homiebites_recent_searches', JSON.stringify(updated));
        // Navigate based on search
        if (query.toLowerCase().includes('order')) {
            setActiveTab('allOrdersData');
        } else if (query.toLowerCase().includes('customer')) {
            setActiveTab('customers');
        } else if (query.toLowerCase().includes('payment') || query.toLowerCase().includes('pending')) {
            setActiveTab('pendingAmounts');
        } else if (query.toLowerCase().includes('report')) {
            setActiveTab('reports');
        } else {
            setActiveTab('allOrdersData');
        }
        setShowSearchModal(false);
        setSearchQuery('');
    };
    const handleRefresh = ()=>{
        if (!onRefresh || refreshing) return;
        // Set refreshing state immediately for visual feedback
        setRefreshing(true);
        const startTime = Date.now();
        // Run refresh silently in background without blocking
        (async ()=>{
            try {
                // Call the refresh function (non-blocking)
                if (typeof onRefresh === 'function') {
                    // Don't await - let it run in background
                    const refreshResult = onRefresh();
                    // Only call .catch() if it returns a Promise
                    if (refreshResult && typeof refreshResult.catch === 'function') {
                        refreshResult.catch((err)=>{
                            console.error('Error refreshing data:', err);
                        });
                    }
                }
                // Ensure loader shows for at least 2 seconds
                const elapsed = Date.now() - startTime;
                const remainingTime = Math.max(0, 2000 - elapsed);
                if (remainingTime > 0) {
                    await new Promise((resolve)=>setTimeout(resolve, remainingTime));
                }
            } catch (error) {
                console.error('Error refreshing data:', error);
            } finally{
                setRefreshing(false);
            }
        })();
    };
    const quickActions = [
        {
            label: 'Add new order',
            icon: 'fa-plus',
            action: ()=>setActiveTab('currentMonthOrders')
        },
        {
            label: 'Generate report',
            icon: 'fa-file-alt',
            action: ()=>setActiveTab('reports')
        },
        {
            label: 'View analytics',
            icon: 'fa-chart-line',
            action: ()=>setActiveTab('analytics')
        },
        {
            label: 'Pending payments',
            icon: 'fa-exclamation-triangle',
            action: ()=>setActiveTab('pendingAmounts')
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            tabTitle && tabTitle !== 'Dashboard' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "breadcrumb",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "breadcrumb-item",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#",
                            onClick: (e)=>{
                                e.preventDefault();
                                setActiveTab('dashboard');
                            },
                            children: "Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "breadcrumb-separator",
                        children: "/"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "breadcrumb-item active",
                        children: tabTitle
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                lineNumber: 167,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-top-nav",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "top-nav-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "top-nav-toggle",
                                onClick: ()=>setSidebarOpen(!sidebarOpen),
                                "aria-label": "Toggle sidebar",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-bars"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            tabTitle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "top-nav-tab-info",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "top-nav-title",
                                        children: tabTitle
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 194,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    tabSubtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "top-nav-subtitle",
                                        children: tabSubtitle
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 195,
                                        columnNumber: 31
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "top-nav-title",
                                children: "Admin Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                lineNumber: 198,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "top-nav-center",
                        children: tabAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "top-nav-action",
                            children: tabAction
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                            lineNumber: 202,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "top-nav-right",
                        children: [
                            onRefresh && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "top-nav-search-btn tooltip-wrapper",
                                onClick: handleRefresh,
                                title: refreshing ? 'Refreshing...' : 'Refresh Data',
                                "aria-label": refreshing ? 'Refreshing Data' : 'Refresh Data',
                                disabled: refreshing,
                                style: {
                                    opacity: refreshing ? 0.7 : 1,
                                    cursor: refreshing ? 'wait' : 'pointer'
                                },
                                children: [
                                    refreshing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-spinner fa-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 218,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-rotate"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 220,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tooltip",
                                        children: refreshing ? 'Refreshing...' : 'Refresh Data'
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            onNewOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "top-nav-search-btn tooltip-wrapper",
                                onClick: ()=>onNewOrder(),
                                title: "Add New Order",
                                "aria-label": "Add New Order",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-plus"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "top-nav-search-shortcut",
                                        children: "Ctrl+N"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 233,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tooltip",
                                        children: "Add New Order"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "top-nav-search-btn tooltip-wrapper",
                                onClick: ()=>setShowSearchModal(true),
                                title: "Search",
                                "aria-label": "Search",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-search"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 243,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tooltip",
                                        children: "Search"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 244,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "top-nav-notification-btn tooltip-wrapper",
                                onClick: ()=>setActiveTab('notifications'),
                                title: `Notifications${unreadNotifications > 0 ? ` (${unreadNotifications} unread)` : ''}`,
                                "aria-label": "Notifications",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-bell"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 254,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    unreadNotifications > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "top-nav-badge",
                                        children: unreadNotifications > 99 ? '99+' : unreadNotifications
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tooltip",
                                        children: [
                                            "Notifications",
                                            unreadNotifications > 0 ? ` (${unreadNotifications} unread)` : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                lineNumber: 246,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                lineNumber: 183,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showSearchModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                onClick: ()=>setShowSearchModal(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-container global-search-modal",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "global-search-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "global-search-input-wrapper",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-search global-search-icon"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                            lineNumber: 273,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Search everywhere...",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value),
                                            onKeyDown: (e)=>{
                                                if (e.key === 'Enter') {
                                                    handleSearch(searchQuery);
                                                }
                                            },
                                            autoFocus: true,
                                            className: "global-search-input"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                            lineNumber: 274,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                    lineNumber: 272,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "modal-close global-search-close",
                                    onClick: ()=>setShowSearchModal(false),
                                    "aria-label": "Close search",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-times"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                        lineNumber: 293,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "global-search-content",
                            children: [
                                recentSearches.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "global-search-section",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Recent Searches"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                            lineNumber: 299,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "global-search-list",
                                            children: recentSearches.map((search, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "global-search-item",
                                                    onClick: ()=>handleSearch(search),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fa-solid fa-clock-rotate-left"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                                            lineNumber: 307,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        search
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                                    lineNumber: 302,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                            lineNumber: 300,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                    lineNumber: 298,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "global-search-section",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Quick Actions"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                            lineNumber: 315,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "global-search-list",
                                            children: quickActions.map((action, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "global-search-item",
                                                    onClick: ()=>{
                                                        action.action();
                                                        setShowSearchModal(false);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: `fa-solid ${action.icon}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                                            lineNumber: 326,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        action.label
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                                    lineNumber: 318,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                            lineNumber: 316,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                                    lineNumber: 314,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                            lineNumber: 296,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                    lineNumber: 270,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx",
                lineNumber: 269,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(TopNav, "pAsUvFfkCFPvgk47ToHmG30Hecs=");
_c = TopNav;
const __TURBOPACK__default__export__ = TopNav;
var _c;
__turbopack_context__.k.register(_c, "TopNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/contexts/NotificationContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationProvider",
    ()=>NotificationProvider,
    "useNotification",
    ()=>useNotification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const NotificationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const NotificationProvider = ({ children })=>{
    _s();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const timeoutsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const lastNotificationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map()); // Track last notification by message+type
    const removeNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[removeNotification]": (id)=>{
            setNotifications({
                "NotificationProvider.useCallback[removeNotification]": (prev)=>prev.filter({
                        "NotificationProvider.useCallback[removeNotification]": (n)=>n.id !== id
                    }["NotificationProvider.useCallback[removeNotification]"])
            }["NotificationProvider.useCallback[removeNotification]"]);
            // Clear timeout if exists
            const timeoutId = timeoutsRef.current.get(id);
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutsRef.current.delete(id);
            }
        }
    }["NotificationProvider.useCallback[removeNotification]"], []);
    const showNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[showNotification]": (message, type = 'info', duration = 5000)=>{
            const now = Date.now();
            const key = `${message}-${type}`;
            const lastTime = lastNotificationRef.current.get(key);
            // Prevent duplicate notifications with same message and type within 2 seconds
            if (lastTime && now - lastTime < 2000) {
                return null; // Don't show duplicate
            }
            lastNotificationRef.current.set(key, now);
            const id = Date.now() + Math.random();
            const notification = {
                id,
                message: typeof message === 'string' ? message : String(message),
                type,
                duration: duration > 0 ? duration : 0
            };
            setNotifications({
                "NotificationProvider.useCallback[showNotification]": (prev)=>{
                    // Limit to maximum 5 notifications at once
                    const maxNotifications = 5;
                    const updated = [
                        ...prev,
                        notification
                    ];
                    if (updated.length > maxNotifications) {
                        // Remove oldest notification
                        const oldest = updated.shift();
                        const timeoutId = timeoutsRef.current.get(oldest.id);
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                            timeoutsRef.current.delete(oldest.id);
                        }
                    }
                    return updated;
                }
            }["NotificationProvider.useCallback[showNotification]"]);
            if (duration > 0) {
                const timeoutId = setTimeout({
                    "NotificationProvider.useCallback[showNotification].timeoutId": ()=>{
                        removeNotification(id);
                    }
                }["NotificationProvider.useCallback[showNotification].timeoutId"], duration);
                timeoutsRef.current.set(id, timeoutId);
            }
            return id;
        }
    }["NotificationProvider.useCallback[showNotification]"], [
        removeNotification
    ]);
    const success = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[success]": (message, duration)=>showNotification(message, 'success', duration)
    }["NotificationProvider.useCallback[success]"], [
        showNotification
    ]);
    const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[error]": (message, duration)=>showNotification(message, 'error', duration)
    }["NotificationProvider.useCallback[error]"], [
        showNotification
    ]);
    const warning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[warning]": (message, duration)=>showNotification(message, 'warning', duration)
    }["NotificationProvider.useCallback[warning]"], [
        showNotification
    ]);
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationProvider.useCallback[info]": (message, duration)=>showNotification(message, 'info', duration)
    }["NotificationProvider.useCallback[info]"], [
        showNotification
    ]);
    const value = {
        notifications,
        showNotification,
        removeNotification,
        success,
        error,
        warning,
        info
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/contexts/NotificationContext.jsx",
        lineNumber: 101,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NotificationProvider, "l9SoupwSmS2AjWL0rE2JDQSaYZk=");
_c = NotificationProvider;
const useNotification = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
_s1(useNotification, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "NotificationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/hooks/useAdminData.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAdminData",
    ()=>useAdminData
]);
/**
 * Custom hook for loading admin dashboard data
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/api-admin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$menuData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/menuData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$offersData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/offersData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/errorTracker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const useAdminData = ()=>{
    _s();
    const [menuData, setMenuData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [offersData, setOffersData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newsletterSubscriptions, setNewsletterSubscriptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        whatsappNumber: '919958983578',
        deliveryTimings: '7:30 PM - 8:30 PM',
        minOrderValue: 100,
        deliveryCharge: 0,
        announcement: 'Free delivery on orders over ₹200'
    });
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const loadMenuData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminData.useCallback[loadMenuData]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$menuData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMenuData"])();
                setMenuData(data);
            } catch (error) {
                console.error('Error loading menu:', error);
                const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$menuData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMenuDataSync"])();
                setMenuData(data);
            }
        }
    }["useAdminData.useCallback[loadMenuData]"], []);
    const loadOffersData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminData.useCallback[loadOffersData]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$offersData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOffersData"])();
                setOffersData(data);
            } catch (error) {
                console.error('Error loading offers:', error);
                const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$offersData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOffersDataSync"])();
                setOffersData(data);
            }
        }
    }["useAdminData.useCallback[loadOffersData]"], []);
    const loadOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminData.useCallback[loadOrders]": async (filters = {}, hardRefresh = false)=>{
            try {
                const token = localStorage.getItem('homiebites_token');
                const isAdmin = localStorage.getItem('homiebites_admin') === 'true';
                // Don't attempt API calls without authentication
                if (!token || !isAdmin) {
                    console.warn('[useAdminData] Cannot load orders: missing token or admin status', {
                        hasToken: !!token,
                        isAdmin
                    });
                    setOrders([]);
                    return;
                }
                try {
                    // Load ALL orders from backend (filters are applied in UI)
                    // Pass hardRefresh flag to bypass cache
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllOrders({}, {
                        hardRefresh
                    });
                    if (response.success && response.data) {
                        let nextOrders = Array.isArray(response.data) ? response.data : [];
                        if (nextOrders.length > 0) {
                            nextOrders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortOrdersByOrderId"])(nextOrders);
                        }
                        setOrders({
                            "useAdminData.useCallback[loadOrders]": (prev)=>{
                                const prevArr = Array.isArray(prev) ? prev : [];
                                if (prevArr.length === 0 && nextOrders.length === 0) return prevArr;
                                return nextOrders;
                            }
                        }["useAdminData.useCallback[loadOrders]"]);
                    } else {
                        console.warn('[useAdminData] API returned unsuccessful response:', response);
                        // Only clear orders if we got a clear error response, not on HTML errors
                        if (response && response.error) {
                            setOrders([]);
                        }
                    }
                } catch (apiError) {
                    console.error('[useAdminData] Failed to load orders from API:', apiError.message);
                    // Don't retry on auth errors - API client will handle redirect
                    if (apiError.message && apiError.message.includes('Authentication failed')) {
                        console.warn('[useAdminData] Authentication failed. Stopping data load.');
                        setOrders([]);
                        return; // Don't throw, just return empty
                    }
                    // Check if it's a backend not available error
                    if (apiError.message && (apiError.message.includes('HTML') || apiError.message.includes('not available') || apiError.message.includes('connect'))) {
                        console.error('[useAdminData] Backend server appears to be offline. Please ensure the backend server is running on', __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].baseURL);
                    }
                    // Don't clear orders on error - keep existing data (might be stale but better than empty)
                    // setOrders([]);
                    throw apiError; // Re-throw to let caller handle
                }
            } catch (error) {
                console.error('[useAdminData] Error loading orders:', error);
                // Don't clear orders on error - keep existing data
                // setOrders([]);
                throw error; // Re-throw to let caller handle
            }
        }
    }["useAdminData.useCallback[loadOrders]"], []);
    const loadUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminData.useCallback[loadUsers]": async ()=>{
            try {
                const token = localStorage.getItem('homiebites_token');
                if (token) {
                    try {
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllUsers();
                        if (response.success && response.data) {
                            setUsers(response.data);
                            localStorage.setItem('homiebites_users', JSON.stringify(response.data));
                            return;
                        }
                        // If endpoint doesn't exist (404), silently fall back to cache
                        if (response.error && response.error.includes('Route not found')) {
                        // Silently fall through to localStorage fallback
                        }
                    } catch (apiError) {
                        // Only log non-404 errors
                        if (!apiError.message.includes('Route not found') && !apiError.message.includes('404')) {
                            console.warn('Failed to load users from API, using cached data:', apiError.message);
                        }
                    }
                }
                const stored = localStorage.getItem('homiebites_users') || localStorage.getItem('homiebites_users_data');
                if (stored) {
                    try {
                        setUsers(JSON.parse(stored));
                    } catch (parseError) {
                        console.error('Error parsing stored users:', parseError);
                    }
                }
            } catch (error) {
                // Silently handle errors for optional endpoint
                if (!error.message.includes('Route not found') && !error.message.includes('404')) {
                    console.error('Error loading users:', error);
                }
            }
        }
    }["useAdminData.useCallback[loadUsers]"], []);
    const loadSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminData.useCallback[loadSettings]": ()=>{
            try {
                const stored = localStorage.getItem('homiebites_settings');
                if (stored) {
                    setSettings(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }["useAdminData.useCallback[loadSettings]"], []);
    const loadNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminData.useCallback[loadNotifications]": ()=>{
            try {
                const stored = localStorage.getItem('homiebites_notifications');
                if (stored) {
                    setNotifications(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Error loading notifications:', e);
            }
        }
    }["useAdminData.useCallback[loadNotifications]"], []);
    const loadNewsletterSubscriptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminData.useCallback[loadNewsletterSubscriptions]": ()=>{
            try {
                const stored = localStorage.getItem('homiebites_newsletter');
                if (stored) {
                    setNewsletterSubscriptions(JSON.parse(stored));
                }
            } catch (e) {
                console.error('Error loading newsletter subscriptions:', e);
            }
        }
    }["useAdminData.useCallback[loadNewsletterSubscriptions]"], []);
    const loadCurrentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAdminData.useCallback[loadCurrentUser]": ()=>{
            try {
                const userStr = localStorage.getItem('homiebites_user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Error loading current user:', error);
            }
        }
    }["useAdminData.useCallback[loadCurrentUser]"], []);
    // Load all data on mount - ONLY if authenticated
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAdminData.useEffect": ()=>{
            // Check authentication before loading
            const token = localStorage.getItem('homiebites_token');
            const isAdmin = localStorage.getItem('homiebites_admin') === 'true';
            if (!token || !isAdmin) {
                console.warn('[useAdminData] Skipping data load: user not authenticated');
                return;
            }
            const loadOpId = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].addToQueue('load-all-data', 'Load All Dashboard Data', {
                component: 'AdminDashboard',
                phase: 'initialization'
            });
            const loadAllData = {
                "useAdminData.useEffect.loadAllData": async ()=>{
                    try {
                        const results = await Promise.allSettled([
                            loadMenuData().catch({
                                "useAdminData.useEffect.loadAllData": (err)=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                                        type: 'data_load_failed',
                                        operation: 'loadMenuData',
                                        error: err
                                    });
                                    return null;
                                }
                            }["useAdminData.useEffect.loadAllData"]),
                            loadOffersData().catch({
                                "useAdminData.useEffect.loadAllData": (err)=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                                        type: 'data_load_failed',
                                        operation: 'loadOffersData',
                                        error: err
                                    });
                                    return null;
                                }
                            }["useAdminData.useEffect.loadAllData"]),
                            loadOrders().catch({
                                "useAdminData.useEffect.loadAllData": (err)=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                                        type: 'data_load_failed',
                                        operation: 'loadOrders',
                                        error: err
                                    });
                                    return null;
                                }
                            }["useAdminData.useEffect.loadAllData"]),
                            loadUsers().catch({
                                "useAdminData.useEffect.loadAllData": (err)=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                                        type: 'data_load_failed',
                                        operation: 'loadUsers',
                                        error: err
                                    });
                                    return null;
                                }
                            }["useAdminData.useEffect.loadAllData"])
                        ]);
                        // Load synchronous data
                        try {
                            loadSettings();
                        } catch (err) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                                type: 'data_load_failed',
                                operation: 'loadSettings',
                                error: err
                            });
                        }
                        try {
                            loadNotifications();
                        } catch (err) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                                type: 'data_load_failed',
                                operation: 'loadNotifications',
                                error: err
                            });
                        }
                        try {
                            loadNewsletterSubscriptions();
                        } catch (err) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                                type: 'data_load_failed',
                                operation: 'loadNewsletterSubscriptions',
                                error: err
                            });
                        }
                        try {
                            loadCurrentUser();
                        } catch (err) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                                type: 'data_load_failed',
                                operation: 'loadCurrentUser',
                                error: err
                            });
                        }
                        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].completeOperation(loadOpId, {
                            success: true
                        });
                        setLoading(false);
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].failOperation(loadOpId, error);
                        console.error('Critical error loading dashboard data:', error);
                        setLoading(false);
                    }
                }
            }["useAdminData.useEffect.loadAllData"];
            try {
                loadAllData().catch({
                    "useAdminData.useEffect": (err)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                            type: 'unhandled_promise_rejection',
                            operation: 'loadAllData',
                            error: err
                        });
                    }
                }["useAdminData.useEffect"]);
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$errorTracker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].captureError({
                    type: 'synchronous_error',
                    operation: 'loadAllData',
                    error: err
                });
            }
        }
    }["useAdminData.useEffect"], [
        loadMenuData,
        loadOffersData,
        loadOrders,
        loadUsers,
        loadSettings,
        loadNotifications,
        loadNewsletterSubscriptions,
        loadCurrentUser
    ]);
    return {
        // Data
        menuData,
        offersData,
        orders,
        users,
        newsletterSubscriptions,
        settings,
        notifications,
        currentUser,
        loading,
        // Setters
        setMenuData,
        setOffersData,
        setOrders,
        setUsers,
        setNewsletterSubscriptions,
        setSettings,
        setNotifications,
        setCurrentUser,
        // Loaders
        loadMenuData,
        loadOffersData,
        loadOrders,
        loadUsers,
        loadSettings,
        loadNotifications,
        loadNewsletterSubscriptions,
        loadCurrentUser
    };
};
_s(useAdminData, "uyV/hXNJS5u7Gy7VoS3u6eSTysg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/hooks/useOptimisticData.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useOptimisticData",
    ()=>useOptimisticData
]);
/**
 * useOptimisticData Hook
 * Provides optimistic updates for fast UI response
 * Automatically syncs with backend and handles rollback on errors
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dataSyncManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/api-admin.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
const useOptimisticData = (options = {})=>{
    _s();
    const { loadData, onError, enableOptimistic = true } = options;
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [syncing, setSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]); // Keep ref for latest data
    const originalDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]); // For rollback
    // Update refs when data changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOptimisticData.useEffect": ()=>{
            dataRef.current = data;
        }
    }["useOptimisticData.useEffect"], [
        data
    ]);
    /**
   * Load data from backend
   */ const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOptimisticData.useCallback[load]": async (filters = {})=>{
            setLoading(true);
            setError(null);
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createRequest('load-orders', {
                    "useOptimisticData.useCallback[load]": async (signal)=>{
                        if (loadData) {
                            return await loadData(filters, signal);
                        }
                        return await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllOrders(filters);
                    }
                }["useOptimisticData.useCallback[load]"]);
                if (result.success && Array.isArray(result.data)) {
                    setData(result.data);
                    originalDataRef.current = [
                        ...result.data
                    ];
                    return {
                        success: true,
                        data: result.data
                    };
                }
                throw new Error(result.error || 'Failed to load data');
            } catch (err) {
                const errorMsg = err.message || 'Failed to load data';
                setError(errorMsg);
                if (onError) onError(errorMsg);
                return {
                    success: false,
                    error: errorMsg
                };
            } finally{
                setLoading(false);
            }
        }
    }["useOptimisticData.useCallback[load]"], [
        loadData,
        onError
    ]);
    /**
   * Optimistic create - add immediately, sync in background
   */ const createOptimistic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOptimisticData.useCallback[createOptimistic]": async (newItem, createFn)=>{
            if (!enableOptimistic) {
                // Non-optimistic: wait for backend
                return await createFn();
            }
            // Store original state
            originalDataRef.current = [
                ...dataRef.current
            ];
            // Optimistically add to UI
            const tempId = `temp-${Date.now()}-${Math.random()}`;
            const optimisticItem = {
                ...newItem,
                _id: tempId,
                _optimistic: true
            };
            setData({
                "useOptimisticData.useCallback[createOptimistic]": (prev)=>[
                        ...prev,
                        optimisticItem
                    ]
            }["useOptimisticData.useCallback[createOptimistic]"]);
            try {
                // Sync in background
                const result = await createFn();
                if (result.success && result.data) {
                    // Replace optimistic item with real data
                    setData({
                        "useOptimisticData.useCallback[createOptimistic]": (prev)=>prev.map({
                                "useOptimisticData.useCallback[createOptimistic]": (item)=>item._id === tempId ? result.data : item
                            }["useOptimisticData.useCallback[createOptimistic]"])
                    }["useOptimisticData.useCallback[createOptimistic]"]);
                    return {
                        success: true,
                        data: result.data
                    };
                }
                // Rollback on failure
                setData(originalDataRef.current);
                throw new Error(result.error || 'Failed to create');
            } catch (err) {
                // Rollback on error
                setData(originalDataRef.current);
                throw err;
            }
        }
    }["useOptimisticData.useCallback[createOptimistic]"], [
        enableOptimistic
    ]);
    /**
   * Optimistic update - update immediately, sync in background
   */ const updateOptimistic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOptimisticData.useCallback[updateOptimistic]": async (id, updates, updateFn)=>{
            if (!enableOptimistic) {
                return await updateFn();
            }
            // Store original state
            originalDataRef.current = [
                ...dataRef.current
            ];
            // Find item
            const itemIndex = dataRef.current.findIndex({
                "useOptimisticData.useCallback[updateOptimistic].itemIndex": (item)=>item._id === id || item.orderId === id || item.id === id
            }["useOptimisticData.useCallback[updateOptimistic].itemIndex"]);
            if (itemIndex === -1) {
                throw new Error('Item not found');
            }
            const originalItem = dataRef.current[itemIndex];
            // Optimistically update UI
            setData({
                "useOptimisticData.useCallback[updateOptimistic]": (prev)=>prev.map({
                        "useOptimisticData.useCallback[updateOptimistic]": (item)=>item._id === id || item.orderId === id || item.id === id ? {
                                ...item,
                                ...updates,
                                _optimistic: true
                            } : item
                    }["useOptimisticData.useCallback[updateOptimistic]"])
            }["useOptimisticData.useCallback[updateOptimistic]"]);
            try {
                // Sync in background
                const result = await updateFn();
                if (result.success && result.data) {
                    // Replace with real data
                    setData({
                        "useOptimisticData.useCallback[updateOptimistic]": (prev)=>prev.map({
                                "useOptimisticData.useCallback[updateOptimistic]": (item)=>item._id === id || item.orderId === id || item.id === id ? result.data : item
                            }["useOptimisticData.useCallback[updateOptimistic]"])
                    }["useOptimisticData.useCallback[updateOptimistic]"]);
                    return {
                        success: true,
                        data: result.data
                    };
                }
                // Rollback on failure
                setData(originalDataRef.current);
                throw new Error(result.error || 'Failed to update');
            } catch (err) {
                // Rollback on error
                setData(originalDataRef.current);
                throw err;
            }
        }
    }["useOptimisticData.useCallback[updateOptimistic]"], [
        enableOptimistic
    ]);
    /**
   * Optimistic delete - remove immediately, sync in background
   */ const deleteOptimistic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOptimisticData.useCallback[deleteOptimistic]": async (id, deleteFn)=>{
            if (!enableOptimistic) {
                return await deleteFn();
            }
            // Store original state
            originalDataRef.current = [
                ...dataRef.current
            ];
            // Find item
            const item = dataRef.current.find({
                "useOptimisticData.useCallback[deleteOptimistic].item": (item)=>item._id === id || item.orderId === id || item.id === id
            }["useOptimisticData.useCallback[deleteOptimistic].item"]);
            if (!item) {
                throw new Error('Item not found');
            }
            // Optimistically remove from UI
            setData({
                "useOptimisticData.useCallback[deleteOptimistic]": (prev)=>prev.filter({
                        "useOptimisticData.useCallback[deleteOptimistic]": (item)=>item._id !== id && item.orderId !== id && item.id !== id
                    }["useOptimisticData.useCallback[deleteOptimistic]"])
            }["useOptimisticData.useCallback[deleteOptimistic]"]);
            try {
                // Sync in background
                const result = await deleteFn();
                // Check for success field or check if result exists (API might return different formats)
                if (result && (result.success === true || result.message || result.data)) {
                    return {
                        success: true,
                        data: result.data || result.order || result
                    };
                }
                // Rollback on failure
                setData(originalDataRef.current);
                throw new Error(result.error || result.message || 'Failed to delete');
            } catch (err) {
                // Rollback on error
                setData(originalDataRef.current);
                const errorMessage = err.message || 'Failed to delete';
                throw new Error(errorMessage);
            }
        }
    }["useOptimisticData.useCallback[deleteOptimistic]"], [
        enableOptimistic
    ]);
    /**
   * Debounced sync - batches rapid sync calls
   */ const syncDebounced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOptimisticData.useCallback[syncDebounced]": async (syncFn, delay = 300)=>{
            setSyncing(true);
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].debouncedSync('sync-orders', syncFn, delay);
                return result;
            } finally{
                setSyncing(false);
            }
        }
    }["useOptimisticData.useCallback[syncDebounced]"], []);
    /**
   * Cancel all pending operations
   */ const cancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOptimisticData.useCallback[cancel]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].cancelRequest('load-orders');
            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].cancelRequest('sync-orders');
        }
    }["useOptimisticData.useCallback[cancel]"], []);
    /**
   * Cleanup on unmount
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOptimisticData.useEffect": ()=>{
            return ({
                "useOptimisticData.useEffect": ()=>{
                    cancel();
                }
            })["useOptimisticData.useEffect"];
        }
    }["useOptimisticData.useEffect"], [
        cancel
    ]);
    return {
        data,
        loading,
        error,
        syncing,
        load,
        createOptimistic,
        updateOptimistic,
        deleteOptimistic,
        syncDebounced,
        cancel,
        setData
    };
};
_s(useOptimisticData, "wg4ryhqOA9uOvmI4DRo5OmkLDyI=");
const __TURBOPACK__default__export__ = useOptimisticData;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/hooks/useFastDataSync.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useFastDataSync",
    ()=>useFastDataSync
]);
/**
 * useFastDataSync Hook
 * Combines useAdminData with optimistic updates and sync manager
 * Provides fast, safe data operations with automatic sync
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/api-admin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dataSyncManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useAdminData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/hooks/useAdminData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useOptimisticData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/hooks/useOptimisticData.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const useFastDataSync = ()=>{
    _s();
    // Use existing useAdminData for initial load
    const adminData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useAdminData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminData"])();
    // Use optimistic data hook for fast updates
    const optimisticData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useOptimisticData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        loadData: {
            "useFastDataSync.useOptimisticData[optimisticData]": async (filters, signal)=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllOrders(filters);
                return {
                    success: response.success,
                    data: response.data || []
                };
            }
        }["useFastDataSync.useOptimisticData[optimisticData]"],
        enableOptimistic: true
    });
    // Sync optimisticData with adminData.orders when orders change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFastDataSync.useEffect": ()=>{
            if (adminData.orders && Array.isArray(adminData.orders)) {
                // Always sync optimisticData with adminData.orders to keep them in sync
                const currentOptimistic = optimisticData.data || [];
                const ordersChanged = currentOptimistic.length !== adminData.orders.length || !adminData.orders.every({
                    "useFastDataSync.useEffect": (order)=>currentOptimistic.some({
                            "useFastDataSync.useEffect": (item)=>order._id && item._id === order._id || order.orderId && item.orderId === order.orderId || order.id && item.id === order.id
                        }["useFastDataSync.useEffect"])
                }["useFastDataSync.useEffect"]);
                if (ordersChanged) {
                    optimisticData.setData([
                        ...adminData.orders
                    ]);
                }
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useFastDataSync.useEffect"], [
        adminData.orders
    ]);
    /**
   * Fast delete with optimistic update
   */ const fastDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFastDataSync.useCallback[fastDelete]": async (orderId, onSuccess, onError)=>{
            try {
                // Ensure optimisticData has the current orders before deleting
                const currentOrders = adminData.orders || [];
                const order = currentOrders.find({
                    "useFastDataSync.useCallback[fastDelete].order": (o)=>o._id === orderId || o.orderId === orderId || o.id === orderId
                }["useFastDataSync.useCallback[fastDelete].order"]);
                if (!order) {
                    throw new Error(`Order with ID ${orderId} not found`);
                }
                // Sync optimisticData with adminData.orders if needed
                const optimisticOrders = optimisticData.data || [];
                const orderInOptimistic = optimisticOrders.find({
                    "useFastDataSync.useCallback[fastDelete].orderInOptimistic": (o)=>o._id === orderId || o.orderId === orderId || o.id === orderId
                }["useFastDataSync.useCallback[fastDelete].orderInOptimistic"]);
                if (!orderInOptimistic) {
                    // Order not in optimistic data, sync it first
                    optimisticData.setData([
                        ...currentOrders
                    ]);
                }
                // Get the API order ID (prefer _id, then id, then orderId, then fallback to orderId param)
                const apiOrderId = order._id || order.id || order.orderId || orderId;
                // Update adminData.orders immediately with optimistic delete
                adminData.setOrders({
                    "useFastDataSync.useCallback[fastDelete]": (prevOrders)=>prevOrders.filter({
                            "useFastDataSync.useCallback[fastDelete]": (o)=>o._id !== orderId && o.orderId !== orderId && o.id !== orderId
                        }["useFastDataSync.useCallback[fastDelete]"])
                }["useFastDataSync.useCallback[fastDelete]"]);
                // Delete optimistically and call API
                await optimisticData.deleteOptimistic(orderId, {
                    "useFastDataSync.useCallback[fastDelete]": async ()=>{
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].deleteOrder(apiOrderId); // Use apiOrderId for API call
                        return response;
                    }
                }["useFastDataSync.useCallback[fastDelete]"]);
                // Call success immediately - don't wait for sync
                if (onSuccess) onSuccess();
                // Sync in background (non-blocking) with reduced delay
                optimisticData.syncDebounced({
                    "useFastDataSync.useCallback[fastDelete]": async ()=>{
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllOrders({});
                        if (response.success && response.data) {
                            adminData.setOrders(response.data);
                            optimisticData.setData(response.data);
                        }
                        return response;
                    }
                }["useFastDataSync.useCallback[fastDelete]"], 100).catch({
                    "useFastDataSync.useCallback[fastDelete]": (err)=>{
                        // Silently handle sync errors - operation already succeeded
                        console.warn('Background sync error after delete:', err);
                    }
                }["useFastDataSync.useCallback[fastDelete]"]);
            } catch (error) {
                // Format error message for user-friendly display
                const errorMessage = error.message || 'Failed to delete order';
                const formattedError = new Error(errorMessage);
                if (onError) {
                    onError(formattedError);
                } else {
                    throw formattedError;
                }
            }
        }
    }["useFastDataSync.useCallback[fastDelete]"], [
        optimisticData,
        adminData
    ]);
    /**
   * Fast update with optimistic update
   */ const fastUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFastDataSync.useCallback[fastUpdate]": async (orderId, updates, onSuccess, onError)=>{
            try {
                // Ensure optimisticData has the current orders before updating
                const currentOrders = adminData.orders || [];
                const order = currentOrders.find({
                    "useFastDataSync.useCallback[fastUpdate].order": (o)=>o._id === orderId || o.orderId === orderId || o.id === orderId
                }["useFastDataSync.useCallback[fastUpdate].order"]);
                if (!order) {
                    throw new Error(`Order with ID ${orderId} not found`);
                }
                // Sync optimisticData with adminData.orders if needed
                const optimisticOrders = optimisticData.data || [];
                const orderInOptimistic = optimisticOrders.find({
                    "useFastDataSync.useCallback[fastUpdate].orderInOptimistic": (o)=>o._id === orderId || o.orderId === orderId || o.id === orderId
                }["useFastDataSync.useCallback[fastUpdate].orderInOptimistic"]);
                if (!orderInOptimistic) {
                    // Order not in optimistic data, sync it first
                    optimisticData.setData([
                        ...currentOrders
                    ]);
                }
                const apiOrderId = order._id || order.id || order.orderId || orderId;
                const updatePayload = {};
                Object.keys(updates).forEach({
                    "useFastDataSync.useCallback[fastUpdate]": (key)=>{
                        if (updates[key] !== undefined) {
                            updatePayload[key] = updates[key];
                        }
                    }
                }["useFastDataSync.useCallback[fastUpdate]"]);
                // Ensure paymentStatus is synced when status is updated (production data integrity)
                if (updatePayload.status && !updatePayload.paymentStatus) {
                    const statusLower = String(updatePayload.status).toLowerCase().trim();
                    if (statusLower === 'paid' || statusLower === 'delivered') {
                        updatePayload.paymentStatus = 'Paid';
                    } else {
                        updatePayload.paymentStatus = 'Pending';
                    }
                }
                // Perform optimistic update with clean payload
                await optimisticData.updateOptimistic(orderId, updates, {
                    "useFastDataSync.useCallback[fastUpdate]": async ()=>{
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateOrder(apiOrderId, updatePayload);
                        // Verify response contains updated order
                        if (!response.success) {
                            throw new Error(response.error || response.message || 'Update failed');
                        }
                        return response;
                    }
                }["useFastDataSync.useCallback[fastUpdate]"]);
                // Update adminData.orders immediately with optimistic update
                adminData.setOrders({
                    "useFastDataSync.useCallback[fastUpdate]": (prevOrders)=>prevOrders.map({
                            "useFastDataSync.useCallback[fastUpdate]": (o)=>o._id === orderId || o.orderId === orderId || o.id === orderId ? {
                                    ...o,
                                    ...updates
                                } : o
                        }["useFastDataSync.useCallback[fastUpdate]"])
                }["useFastDataSync.useCallback[fastUpdate]"]);
                // Sync in background (debounced) to ensure UI reflects actual database state
                // This is critical for production data integrity
                optimisticData.syncDebounced({
                    "useFastDataSync.useCallback[fastUpdate]": async ()=>{
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllOrders({});
                        if (response.success && response.data) {
                            adminData.setOrders(response.data);
                            optimisticData.setData(response.data);
                        }
                        return response;
                    }
                }["useFastDataSync.useCallback[fastUpdate]"], 500).catch({
                    "useFastDataSync.useCallback[fastUpdate]": (err)=>{
                        // Log error but don't block - optimistic update already applied
                        console.warn('[useFastDataSync] Background sync error after update:', err);
                    }
                }["useFastDataSync.useCallback[fastUpdate]"]);
                // Call success callback immediately after optimistic update
                // Background sync will ensure data consistency
                if (onSuccess) onSuccess();
            } catch (error) {
                // Format error message for user-friendly display
                const errorMessage = error.message || 'Failed to update order';
                const formattedError = new Error(errorMessage);
                if (onError) {
                    onError(formattedError);
                } else {
                    throw formattedError;
                }
            }
        }
    }["useFastDataSync.useCallback[fastUpdate]"], [
        optimisticData,
        adminData
    ]);
    /**
   * Fast create with optimistic update
   */ const fastCreate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFastDataSync.useCallback[fastCreate]": async (orderData, onSuccess, onError)=>{
            try {
                // Create optimistically and call API
                const response = await optimisticData.createOptimistic(orderData, {
                    "useFastDataSync.useCallback[fastCreate]": async ()=>{
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createManualOrder(orderData);
                        return response;
                    }
                }["useFastDataSync.useCallback[fastCreate]"]);
                // If API returned the created order, add it immediately
                if (response && response.data && response.data.order) {
                    const newOrder = response.data.order;
                    adminData.setOrders({
                        "useFastDataSync.useCallback[fastCreate]": (prevOrders)=>[
                                ...prevOrders,
                                newOrder
                            ]
                    }["useFastDataSync.useCallback[fastCreate]"]);
                } else if (response && response.data && Array.isArray(response.data)) {
                    // If response is an array, use it
                    adminData.setOrders({
                        "useFastDataSync.useCallback[fastCreate]": (prevOrders)=>[
                                ...prevOrders,
                                ...response.data
                            ]
                    }["useFastDataSync.useCallback[fastCreate]"]);
                }
                // Call success immediately - don't wait for sync
                if (onSuccess) onSuccess();
                // Sync in background (non-blocking) with reduced delay
                optimisticData.syncDebounced({
                    "useFastDataSync.useCallback[fastCreate]": async ()=>{
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllOrders({});
                        if (response.success && response.data) {
                            adminData.setOrders(response.data);
                            optimisticData.setData(response.data);
                        }
                        return response;
                    }
                }["useFastDataSync.useCallback[fastCreate]"], 100).catch({
                    "useFastDataSync.useCallback[fastCreate]": (err)=>{
                        // Silently handle sync errors - operation already succeeded
                        console.warn('Background sync error after create:', err);
                    }
                }["useFastDataSync.useCallback[fastCreate]"]);
            } catch (error) {
                // Format error message for user-friendly display
                const errorMessage = error.message || 'Failed to create order';
                const formattedError = new Error(errorMessage);
                if (onError) {
                    onError(formattedError);
                } else {
                    throw formattedError;
                }
            }
        }
    }["useFastDataSync.useCallback[fastCreate]"], [
        optimisticData,
        adminData
    ]);
    /**
   * Debounced sync - batches multiple sync calls
   */ const syncDebounced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFastDataSync.useCallback[syncDebounced]": async (delay = 300)=>{
            return await optimisticData.syncDebounced({
                "useFastDataSync.useCallback[syncDebounced]": async ()=>{
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllOrders({});
                    if (response.success && response.data) {
                        adminData.setOrders(response.data);
                    }
                    return response;
                }
            }["useFastDataSync.useCallback[syncDebounced]"], delay);
        }
    }["useFastDataSync.useCallback[syncDebounced]"], [
        optimisticData,
        adminData
    ]);
    /**
   * Cancel all pending operations
   */ const cancelAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFastDataSync.useCallback[cancelAll]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].cancelAllRequests();
            optimisticData.cancel();
        }
    }["useFastDataSync.useCallback[cancelAll]"], [
        optimisticData
    ]);
    return {
        // Original adminData
        ...adminData,
        // Fast operations
        fastDelete,
        fastUpdate,
        fastCreate,
        syncDebounced,
        cancelAll,
        // Optimistic data state
        syncing: optimisticData.syncing,
        hasPendingOps: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasPendingOperations()
    };
};
_s(useFastDataSync, "XHehZh4BmLWyMa2I47lrjYXSZcU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useAdminData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useOptimisticData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
const __TURBOPACK__default__export__ = useFastDataSync;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/api-admin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$auth$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/auth-admin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$globalErrorHandler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/globalErrorHandler.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$AllAddressesTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/AllAddressesTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$AllOrdersDataTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/AllOrdersDataTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$AnalyticsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/AnalyticsTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$CSVUploadModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/CSVUploadModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$ConfirmationModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$CurrentMonthOrdersTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/CurrentMonthOrdersTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$DashboardTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/DashboardTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$ImportantNotificationsBanner$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/ImportantNotificationsBanner.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$InstallPrompt$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/InstallPrompt.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$MenuPriceTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$NotificationsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/NotificationsTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$OrderModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/OrderModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PendingAmountsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/PendingAmountsTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$ReportsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/ReportsTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$SettingsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$Sidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/Sidebar.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$TopNav$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/TopNav.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$contexts$2f$NotificationContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/contexts/NotificationContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useFastDataSync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/hooks/useFastDataSync.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/dataSyncManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/notificationMessages.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$themeFixer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/themeFixer.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const AdminDashboard = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { showNotification } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$contexts$2f$NotificationContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotification"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    // Setup global error handlers for unhandled errors
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminDashboard.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$globalErrorHandler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setupGlobalErrorHandlers"])(showNotification);
                return cleanup;
            }
        }
    }["AdminDashboard.useEffect"], [
        showNotification
    ]);
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showOrderModal, setShowOrderModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCSVUploadModal, setShowCSVUploadModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingOrder, setEditingOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [confirmationModal, setConfirmationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        show: false,
        title: '',
        message: '',
        type: 'warning',
        onConfirm: null,
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    });
    const [newOrder, setNewOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        date: new Date().toISOString().split('T')[0],
        deliveryAddress: '',
        quantity: 1,
        unitPrice: 100,
        total: 100,
        mode: 'Lunch',
        status: 'Unpaid',
        paymentMode: ''
    });
    const [addressSuggestions, setAddressSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showAddressSuggestions, setShowAddressSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [recordsPerPage, setRecordsPerPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(25);
    const [allOrdersFilterMonth, setAllOrdersFilterMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [allOrdersFilterAddress, setAllOrdersFilterAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [allOrdersFilterPaymentStatus, setAllOrdersFilterPaymentStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [dismissedNotifications, setDismissedNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showOverdueFilter, setShowOverdueFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dateFilterForOrders, setDateFilterForOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // For filtering orders by date from analytics
    // Load data using fast sync hook for optimized operations
    const { orders, settings, loading, loadOrders, loadMenuData, loadOffersData, loadUsers, loadSettings, currentUser, fastDelete, fastUpdate, fastCreate, cancelAll } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useFastDataSync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFastDataSync"])();
    // Check authentication on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminDashboard.useEffect": ()=>{
            const token = localStorage.getItem('homiebites_token');
            const adminFlag = localStorage.getItem('homiebites_admin');
            const userStr = localStorage.getItem('homiebites_user');
            // Check if user is authenticated and is admin (case-insensitive)
            const userRole = userStr ? JSON.parse(userStr).role : null;
            const isAdminRole = userRole && (userRole.toLowerCase() === 'admin' || userRole === 'Admin');
            const isAdmin = adminFlag === 'true' || isAdminRole;
            if (!token || !isAdmin) {
                console.warn('[AdminDashboard] Authentication check failed, redirecting to /admin');
                router.replace('/admin');
            }
        }
    }["AdminDashboard.useEffect"], [
        router
    ]);
    // Cleanup on unmount - cancel all pending operations
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminDashboard.useEffect": ()=>{
            return ({
                "AdminDashboard.useEffect": ()=>{
                    if (cancelAll) cancelAll();
                    __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$dataSyncManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].cleanup();
                }
            })["AdminDashboard.useEffect"];
        }
    }["AdminDashboard.useEffect"], [
        cancelAll
    ]);
    // Load and apply theme settings on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminDashboard.useEffect": ()=>{
            const savedTheme = localStorage.getItem('homiebites_theme') || 'light';
            const savedPrimaryColor = localStorage.getItem('homiebites_primary_color') || '#449031';
            const savedFontSize = localStorage.getItem('homiebites_font_size') || 'medium';
            const root = document.documentElement;
            // Apply primary color
            root.style.setProperty('--admin-accent', savedPrimaryColor);
            const rgb = hexToRgb(savedPrimaryColor);
            if (rgb) {
                root.style.setProperty('--admin-accent-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
            }
            // Apply font size
            const fontSizeMap = {
                small: '14px',
                medium: '16px',
                large: '18px'
            };
            root.style.setProperty('--admin-base-font-size', fontSizeMap[savedFontSize] || '16px');
            document.body.style.fontSize = fontSizeMap[savedFontSize] || '16px';
            // Apply theme to both root and admin-dashboard for consistency
            const adminDashboard = document.querySelector('.admin-dashboard');
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark-theme');
                document.documentElement.classList.remove('light-theme');
                if (adminDashboard) {
                    adminDashboard.classList.add('dark-theme');
                    adminDashboard.classList.remove('light-theme');
                }
            } else if (savedTheme === 'light') {
                document.documentElement.classList.add('light-theme');
                document.documentElement.classList.remove('dark-theme');
                if (adminDashboard) {
                    adminDashboard.classList.add('light-theme');
                    adminDashboard.classList.remove('dark-theme');
                }
            } else if (savedTheme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark-theme');
                    document.documentElement.classList.remove('light-theme');
                    if (adminDashboard) {
                        adminDashboard.classList.add('dark-theme');
                        adminDashboard.classList.remove('light-theme');
                    }
                } else {
                    document.documentElement.classList.add('light-theme');
                    document.documentElement.classList.remove('dark-theme');
                    if (adminDashboard) {
                        adminDashboard.classList.add('light-theme');
                        adminDashboard.classList.remove('dark-theme');
                    }
                }
            }
            // Auto-fix theme issues after a short delay to ensure DOM is ready
            setTimeout({
                "AdminDashboard.useEffect": ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$themeFixer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autoFixThemeOnLoad"])(5, 200);
                }
            }["AdminDashboard.useEffect"], 100);
            // Watch for theme changes and auto-fix
            const themeWatcher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$themeFixer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["watchThemeChanges"])();
            return ({
                "AdminDashboard.useEffect": ()=>{
                    // Cleanup theme watcher on unmount
                    if (themeWatcher && themeWatcher.disconnect) {
                        themeWatcher.disconnect();
                    }
                }
            })["AdminDashboard.useEffect"];
        }
    }["AdminDashboard.useEffect"], []);
    // Helper function to convert hex to RGB
    const hexToRgb = (hex)=>{
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    const handleLogout = ()=>{
        showConfirmation({
            title: 'Logout',
            message: 'Are you sure you want to logout? You will need to login again to access the dashboard.',
            type: 'warning',
            confirmText: 'Logout',
            cancelText: 'Cancel',
            onConfirm: ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$auth$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logout"])();
                router.replace('/login');
            }
        });
    };
    const handleAddOrder = async (orderData)=>{
        try {
            await fastCreate(orderData, async ()=>{
                if (showNotification) {
                    showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'addSuccess'), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
                }
                try {
                    await loadOrders();
                } catch (refreshError) {
                    console.warn('Error refreshing orders after save:', refreshError);
                // Don't block on refresh error - order was already saved
                }
                // Reset form to allow new entry (after refresh so order ID updates)
                // Use DD/MM/YYYY format to match OrderModal's date format
                const today = new Date();
                const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
                setNewOrder({
                    date: formattedDate,
                    deliveryAddress: '',
                    quantity: 1,
                    unitPrice: settings?.defaultUnitPrice || 100,
                    total: settings?.defaultUnitPrice || 100,
                    mode: 'Lunch',
                    status: 'Unpaid',
                    paymentMode: ''
                });
            // Keep modal open for next entry (don't close it)
            }, (error)=>{
                console.error('Error adding order:', error);
                if (showNotification) {
                    const errorMessage = error?.message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'addError');
                    showNotification(errorMessage, 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                }
            });
        } catch (error) {
            console.error('Error adding order:', error);
            if (showNotification) {
                const errorMessage = error?.message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'addError');
                showNotification(errorMessage, 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
            }
        }
    };
    const handleEditOrder = async (orderId, orderData)=>{
        const order = (orders || []).find((o)=>o.orderId === orderId || o._id === orderId || o.id === orderId);
        const orderInfo = order ? `Order ${order.orderId || orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}` : `Order ${orderId}`;
        const performUpdate = async ()=>{
            try {
                const apiOrderId = order?._id || order?.id || order?.orderId || orderId;
                const updateData = {};
                const allowedFields = [
                    'date',
                    'deliveryAddress',
                    'quantity',
                    'unitPrice',
                    'mode',
                    'status',
                    'paymentStatus',
                    'paymentMode',
                    'notes',
                    'customerName',
                    'billingMonth',
                    'billingYear',
                    'addressId'
                ];
                allowedFields.forEach((key)=>{
                    if (orderData[key] !== undefined) {
                        if (key === 'paymentMode' || key === 'notes' || key === 'customerName') {
                            updateData[key] = orderData[key] === '' ? '' : orderData[key] || '';
                        } else if (orderData[key] !== null) {
                            updateData[key] = orderData[key];
                        }
                    }
                });
                if (updateData.status && !updateData.paymentStatus) {
                    const statusLower = String(updateData.status).toLowerCase().trim();
                    if (statusLower === 'paid' || statusLower === 'delivered') {
                        updateData.paymentStatus = 'Paid';
                    } else {
                        updateData.paymentStatus = 'Pending';
                    }
                } else if (updateData.paymentStatus && !updateData.status) {
                    // If paymentStatus was updated but status wasn't, sync status too
                    if (updateData.paymentStatus === 'Paid') {
                        updateData.status = 'Paid';
                    } else if (updateData.paymentStatus === 'Pending') {
                        updateData.status = order.status || 'Unpaid';
                    }
                }
                await fastUpdate(apiOrderId, updateData, ()=>{
                    if (showNotification) {
                        showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'updateSuccess'), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
                    }
                    setShowOrderModal(false);
                    setEditingOrder(null);
                    // Force refresh to ensure filters work with updated data
                    if (loadOrders) {
                        setTimeout(()=>{
                            loadOrders();
                        }, 200);
                    }
                }, (error)=>{
                    console.error('Error updating order:', error);
                    if (showNotification) {
                        const errorMessage = error?.message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'updateError');
                        showNotification(errorMessage, 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                    }
                });
            } catch (error) {
                console.error('Error updating order:', error);
                if (showNotification) {
                    const errorMessage = error?.message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'updateError');
                    showNotification(errorMessage, 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                }
            }
        };
        showConfirmation({
            title: 'Update Order',
            message: `Are you sure you want to save changes to ${orderInfo}?`,
            type: 'info',
            confirmText: 'Save Changes',
            onConfirm: performUpdate
        });
    };
    // Show confirmation modal
    const showConfirmation = (config)=>{
        setConfirmationModal({
            show: true,
            title: config.title || 'Confirm Action',
            message: config.message || 'Are you sure you want to proceed?',
            type: config.type || 'warning',
            onConfirm: async ()=>{
                if (config.onConfirm) {
                    try {
                        await config.onConfirm();
                        setConfirmationModal((prev)=>({
                                ...prev,
                                show: false
                            }));
                    } catch (error) {
                        // Error handling is done in the callback itself
                        // Modal stays open so user can see the error and try again
                        const errorMessage = error?.message || error?.error || String(error) || 'Action failed';
                        if (showNotification) {
                            showNotification(errorMessage, 'error', 6000);
                        }
                        // Don't close modal on error - let user see the error message
                        return;
                    }
                } else {
                    setConfirmationModal((prev)=>({
                            ...prev,
                            show: false
                        }));
                }
            },
            onCancelCallback: config.onCancel || null,
            confirmText: config.confirmText || 'Confirm',
            cancelText: config.cancelText || 'Cancel'
        });
    };
    const handleDeleteOrder = async (orderId)=>{
        const order = (orders || []).find((o)=>(o._id || o.orderId) === orderId);
        const orderInfo = order ? `Order ${order.orderId || orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}` : `Order ${orderId}`;
        showConfirmation({
            title: 'Delete Order',
            message: `Are you sure you want to delete ${orderInfo}? This action cannot be undone.`,
            type: 'danger',
            confirmText: 'Delete',
            onConfirm: async ()=>{
                try {
                    await fastDelete(orderId, ()=>{
                        if (showNotification) {
                            showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'deleteSuccess'), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
                        }
                    }, (error)=>{
                        console.error('Error deleting order:', error);
                        if (showNotification) {
                            const errorMessage = error?.message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'deleteError');
                            showNotification(errorMessage, 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                        }
                    });
                } catch (error) {
                    console.error('Error deleting order:', error);
                    if (showNotification) {
                        showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'deleteError'), 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                    }
                }
            }
        });
    };
    const handleUpdateOrderStatus = async (orderId, status, skipConfirmation = false)=>{
        const order = (orders || []).find((o)=>o.orderId === orderId || o._id === orderId || o.id === orderId);
        if (!order) {
            if (showNotification) {
                showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'notFound'), 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
            }
            return;
        }
        const orderInfo = `Order ${order.orderId || orderId} for ${order.deliveryAddress || order.customerAddress || 'N/A'}`;
        // Normalize current status for comparison (handle different formats like 'PENDING', 'PAID', etc.)
        const currentStatus = order.status || order.paymentStatus || 'Unknown';
        const normalizedCurrentStatus = currentStatus.toLowerCase().trim();
        const normalizedNewStatus = status.toLowerCase().trim();
        // Check if status actually changed (accounting for different formats)
        const isCurrentlyPaid = normalizedCurrentStatus === 'paid' || normalizedCurrentStatus === 'delivered';
        const isNewlyPaid = normalizedNewStatus === 'paid';
        const isCurrentlyPending = normalizedCurrentStatus === 'pending' || normalizedCurrentStatus === 'unpaid';
        const isNewlyPending = normalizedNewStatus === 'pending' || normalizedNewStatus === 'unpaid';
        // If status hasn't meaningfully changed, don't update
        if (isCurrentlyPaid && isNewlyPaid || isCurrentlyPending && isNewlyPending) {
            // No change needed
            return;
        }
        // If confirmation is already shown by the component, skip it here
        const performUpdate = async ()=>{
            try {
                // Use the order's _id for API call (backend expects MongoDB _id)
                const apiOrderId = order._id || order.id || order.orderId;
                // Normalize status to ensure consistency with database schema
                // Database uses: status (legacy, default 'PENDING'), paymentStatus (default 'Pending')
                // UI sends: 'Paid' or 'Unpaid'
                // Normalize to match database expectations for production data integrity
                let normalizedStatus;
                let normalizedPaymentStatus;
                const statusLower = String(status).toLowerCase().trim();
                if (statusLower === 'paid') {
                    normalizedStatus = 'Paid';
                    normalizedPaymentStatus = 'Paid';
                } else if (statusLower === 'unpaid' || statusLower === 'pending') {
                    normalizedStatus = 'Unpaid';
                    normalizedPaymentStatus = 'Pending'; // Database default for unpaid/pending
                } else {
                    normalizedStatus = status.trim();
                    normalizedPaymentStatus = statusLower === 'paid' || statusLower === 'delivered' ? 'Paid' : 'Pending';
                }
                // This ensures we only update what we intend to update
                await fastUpdate(apiOrderId, {
                    status: normalizedStatus,
                    paymentStatus: normalizedPaymentStatus
                }, ()=>{
                    if (showNotification) {
                        showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'statusUpdateSuccess'), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
                    }
                    // Force refresh orders to ensure UI updates and filters work correctly
                    // Small delay ensures API update has completed
                    if (loadOrders) {
                        setTimeout(()=>{
                            loadOrders();
                        }, 300);
                    }
                }, (error)=>{
                    console.error('Error updating order status:', error);
                    if (showNotification) {
                        const errorMessage = error?.message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'statusUpdateError');
                        showNotification(errorMessage, 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                    }
                    // Refresh on error to get accurate state
                    if (loadOrders) {
                        loadOrders();
                    }
                });
            } catch (error) {
                console.error('Error updating order status:', error);
                if (showNotification) {
                    const errorMessage = error?.message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'statusUpdateError');
                    showNotification(errorMessage, 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                }
                // Refresh on error
                if (loadOrders) {
                    loadOrders();
                }
            }
        };
        // Only show confirmation if not already shown
        if (!skipConfirmation) {
            showConfirmation({
                title: 'Update Order Status',
                message: `Are you sure you want to change the status of ${orderInfo} from "${currentStatus}" to "${status}"?`,
                type: 'info',
                confirmText: 'Update Status',
                onConfirm: performUpdate
            });
        } else {
            // Direct update without confirmation
            await performUpdate();
        }
    };
    // Handle view orders for customer
    const handleViewCustomerOrders = (address)=>{
        setAllOrdersFilterAddress(address);
        setActiveTab('allOrdersData');
    };
    // Handle dismiss notification
    const handleDismissNotification = (notificationId)=>{
        setDismissedNotifications((prev)=>[
                ...prev,
                notificationId
            ]);
        const stored = JSON.parse(localStorage.getItem('homiebites_dismissed_notifications') || '[]');
        if (!stored.includes(notificationId)) {
            stored.push(notificationId);
            localStorage.setItem('homiebites_dismissed_notifications', JSON.stringify(stored));
        }
    };
    // Handle view pending amounts
    const handleViewPendingAmounts = ()=>{
        setShowOverdueFilter(true);
        setActiveTab('pendingAmounts');
    };
    // Load dismissed notifications from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminDashboard.useEffect": ()=>{
            const stored = JSON.parse(localStorage.getItem('homiebites_dismissed_notifications') || '[]');
            setDismissedNotifications(stored);
        }
    }["AdminDashboard.useEffect"], []);
    // Handle view order
    const handleViewOrder = (orderId)=>{
        const order = (orders || []).find((o)=>(o._id || o.orderId) === orderId);
        if (order) {
            setEditingOrder(order);
            setShowOrderModal(true);
        }
    };
    // Handle send reminder
    const handleSendReminder = (_orderId)=>{
        // In a real app, this would send a reminder
        if (showNotification) {
            showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('reminders', 'sentSuccess'), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
        }
    };
    // Handle update settings
    const handleUpdateSettings = async (newSettings)=>{
        try {
            // Save settings to backend API
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateSettings(newSettings);
            if (response && response.success) {
                // Update local settings state if needed
                // The settings will be reloaded on next sync
                if (showNotification) {
                    // Determine which specific setting was updated and show appropriate message
                    let message = '';
                    if (newSettings.businessInfo) {
                        message = 'Business information has been saved successfully';
                    } else if (newSettings.pricing) {
                        const { defaultUnitPrice, lunchPrice, dinnerPrice } = newSettings.pricing;
                        const priceParts = [];
                        if (defaultUnitPrice !== undefined) priceParts.push(`Default: ₹${defaultUnitPrice}`);
                        if (lunchPrice !== undefined) priceParts.push(`Lunch: ₹${lunchPrice}`);
                        if (dinnerPrice !== undefined) priceParts.push(`Dinner: ₹${dinnerPrice}`);
                        message = priceParts.length > 0 ? `Pricing updated: ${priceParts.join(', ')}` : 'Pricing configuration has been updated';
                    } else if (newSettings.orderSettings) {
                        message = 'Order settings have been saved successfully';
                    } else if (newSettings.notificationPrefs) {
                        message = 'Notification preferences have been updated';
                    } else if (newSettings.dataSettings) {
                        const { autoBackup, autoBackupTime } = newSettings.dataSettings;
                        message = autoBackup ? `Automatic backup enabled: Daily at ${autoBackupTime}` : 'Automatic backup has been disabled';
                    } else if (newSettings.userProfile) {
                        const { newPassword } = newSettings.userProfile;
                        message = newPassword ? 'Your profile and password have been updated' : 'Your profile has been updated successfully';
                    } else if (newSettings.themeSettings) {
                        const { theme, primaryColor, fontSize, fontFamily } = newSettings.themeSettings;
                        const changes = [];
                        // Build descriptive message parts
                        if (theme) {
                            const themeName = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Auto';
                            changes.push(`${themeName} theme`);
                        }
                        if (primaryColor) {
                            const colorNames = {
                                '#449031': 'Green',
                                '#3b82f6': 'Blue',
                                '#8b5cf6': 'Purple',
                                '#ef4444': 'Red',
                                '#10b981': 'Emerald',
                                '#c45c2d': 'Orange'
                            };
                            const colorName = colorNames[primaryColor.toLowerCase()] || primaryColor.toUpperCase();
                            changes.push(`${colorName} accent color`);
                        }
                        if (fontSize) {
                            const sizeName = fontSize === 'small' ? 'Small' : fontSize === 'large' ? 'Large' : fontSize === 'extra-large' ? 'Extra Large' : 'Medium';
                            changes.push(`${sizeName} font size`);
                        }
                        if (fontFamily && fontFamily.trim() !== '') {
                            changes.push(`${fontFamily} font family`);
                        }
                        // Format message professionally
                        if (changes.length > 0) {
                            message = `Appearance updated: ${changes.join(', ')}`;
                        } else {
                            message = 'Appearance settings have been updated successfully';
                        }
                    } else {
                        message = 'Settings have been saved successfully';
                    }
                    showNotification(message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('settings', 'updateSuccess'), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
                }
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            if (showNotification) {
                const errorMessage = error.message || 'Error updating settings';
                showNotification(errorMessage || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('settings', 'updateError'), 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
            }
        }
    };
    // Handle backup
    const handleBackup = async ()=>{
        try {
            // In a real app, this would create a backup
            if (showNotification) {
                showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('backup', 'createSuccess'), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
            }
        } catch (error) {
            console.error('Error creating backup:', error);
            if (showNotification) {
                showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('backup', 'createError'), 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
            }
        }
    };
    // Handle restore
    const handleRestore = async ()=>{
        try {
            // In a real app, this would restore from backup
            if (showNotification) {
                showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('backup', 'restoreSuccess'), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
            }
            if (loadOrders) loadOrders();
        } catch (error) {
            console.error('Error restoring data:', error);
            if (showNotification) {
                showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('backup', 'restoreError'), 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
            }
        }
    };
    // Handle clear all data with confirmation
    const handleClearAllData = async (skipConfirmation = false)=>{
        const performClear = async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].clearAllOrders();
                if (response.success) {
                    const deletedCount = response.deletedCount || 0;
                    const afterCount = response.afterCount !== undefined ? response.afterCount : null;
                    // Verify deletion was successful
                    if (afterCount !== null && afterCount > 0) {
                        if (showNotification) {
                            showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'clearAllWarning', afterCount), 'warning', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('warning'));
                        }
                    } else {
                        if (showNotification) {
                            showNotification((0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'clearAllSuccess', deletedCount), 'success', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('success'));
                        }
                    }
                    setTimeout(async ()=>{
                        if (loadOrders) {
                            try {
                                await loadOrders();
                                // Verify orders are actually cleared
                                setTimeout(async ()=>{
                                    try {
                                        if (loadOrders) await loadOrders();
                                    } catch (refreshError) {
                                        if (showNotification) {
                                            showNotification(refreshError.message || 'Failed to verify orders were cleared', 'error');
                                        }
                                    }
                                }, 500);
                            } catch (error) {
                                if (showNotification) {
                                    showNotification(error.message || 'Failed to refresh orders after clearing data', 'error');
                                }
                            }
                        }
                    }, 1000);
                } else {
                    if (showNotification) {
                        showNotification(response.error || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'clearAllError'), 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                    }
                }
            } catch (error) {
                console.error('Error clearing data:', error);
                if (showNotification) {
                    showNotification(error.message || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationMessage"])('orders', 'clearAllError'), 'error', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$notificationMessages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationDuration"])('error'));
                }
            }
        };
        // Only show confirmation if not already shown
        if (!skipConfirmation) {
            showConfirmation({
                title: 'Clear All Data',
                message: 'Are you sure you want to clear ALL orders data? This action cannot be undone and will permanently delete all orders.',
                type: 'danger',
                confirmText: 'Clear All Data',
                onConfirm: performClear
            });
        } else {
            // Direct clear without confirmation
            await performClear();
        }
    };
    const getTabInfo = ()=>{
        const getMonthLockStatus = ()=>{
            if (!settings || !settings.monthLockedTill) {
                return {
                    status: 'OPEN',
                    lockedTill: null
                };
            }
            try {
                const lockedDate = new Date(settings.monthLockedTill);
                const currentDate = new Date();
                if (lockedDate > currentDate) {
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
                    const month = monthNames[lockedDate.getMonth()];
                    const year = lockedDate.getFullYear();
                    return {
                        status: 'LOCKED',
                        lockedTill: `${month} ${year}`
                    };
                }
            } catch (e) {
            // Ignore errors when checking order status
            }
            return {
                status: 'OPEN',
                lockedTill: null
            };
        };
        const monthLockStatus = getMonthLockStatus();
        const tabInfoMap = {
            dashboard: {
                title: 'Dashboard',
                subtitle: 'Overview of your business metrics'
            },
            allOrdersData: {
                title: 'All Orders Data',
                subtitle: 'View and manage all orders'
            },
            currentMonthOrders: {
                title: 'Current Month Orders',
                subtitle: 'Manage orders for the current billing month',
                action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "btn btn-primary",
                    onClick: ()=>{
                        setEditingOrder(null);
                        setShowOrderModal(true);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fa-solid fa-plus"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                            lineNumber: 935,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        " Add New Order"
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 928,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            },
            analytics: {
                title: 'Analytics',
                subtitle: 'Business insights and performance metrics'
            },
            customers: {
                title: 'Customers',
                subtitle: 'Manage and analyze customer data'
            },
            reports: {
                title: 'Reports',
                subtitle: 'Generate and manage business reports'
            },
            pendingAmounts: {
                title: 'Payment Management',
                subtitle: 'Track and manage payment collections'
            },
            settings: {
                title: 'Settings',
                subtitle: 'Configure your application settings'
            },
            notifications: {
                title: 'Notifications',
                subtitle: 'Stay updated with your business activities'
            },
            menuPrice: {
                title: 'Menu & Price',
                subtitle: 'Manage your menu items, categories, and pricing'
            }
        };
        return tabInfoMap[activeTab] || tabInfoMap.dashboard;
    };
    const tabInfo = getTabInfo();
    const renderActiveTab = ()=>{
        // Ensure orders is always an array to prevent runtime errors
        const safeOrders = Array.isArray(orders) ? orders : [];
        const commonProps = {
            orders: safeOrders,
            settings,
            loading,
            showNotification,
            loadOrders,
            showConfirmation
        };
        switch(activeTab){
            case 'dashboard':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$DashboardTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    setActiveTab: setActiveTab
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 989,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'allOrdersData':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$AllOrdersDataTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    excelFileName: "",
                    allOrdersFilterMonth: allOrdersFilterMonth,
                    setAllOrdersFilterMonth: setAllOrdersFilterMonth,
                    allOrdersFilterAddress: allOrdersFilterAddress,
                    setAllOrdersFilterAddress: setAllOrdersFilterAddress,
                    allOrdersFilterPaymentStatus: allOrdersFilterPaymentStatus,
                    setAllOrdersFilterPaymentStatus: setAllOrdersFilterPaymentStatus,
                    onLoadExcelFile: ()=>setShowCSVUploadModal(true),
                    onClearExcelData: ()=>{},
                    onClearAllData: handleClearAllData,
                    onEditOrder: (order)=>{
                        setEditingOrder(order);
                        setShowOrderModal(true);
                    },
                    onDeleteOrder: handleDeleteOrder,
                    onUpdateOrderStatus: handleUpdateOrderStatus,
                    currentPage: currentPage,
                    recordsPerPage: recordsPerPage,
                    onPageChange: setCurrentPage,
                    onRecordsPerPageChange: setRecordsPerPage,
                    initialDateFilter: dateFilterForOrders
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 993,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'currentMonthOrders':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$CurrentMonthOrdersTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    onAddOrder: handleAddOrder,
                    onEditOrder: (order)=>{
                        setEditingOrder(order);
                        setShowOrderModal(true);
                    },
                    onDeleteOrder: handleDeleteOrder,
                    onUpdateOrderStatus: handleUpdateOrderStatus,
                    currentPage: currentPage,
                    recordsPerPage: recordsPerPage,
                    onPageChange: setCurrentPage,
                    onRecordsPerPageChange: setRecordsPerPage
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1021,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'analytics':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$AnalyticsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    onViewDayDetails: (date)=>{
                        // Format: YYYY-MM-DD
                        setDateFilterForOrders(date);
                        setActiveTab('allOrdersData');
                        showNotification(`Showing orders for ${new Date(date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}`, 'info');
                    }
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1039,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'customers':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$AllAddressesTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    onViewOrders: handleViewCustomerOrders,
                    onContact: ()=>{}
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1059,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'reports':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$ReportsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1067,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'pendingAmounts':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PendingAmountsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    onUpdateOrderStatus: handleUpdateOrderStatus,
                    onSendReminder: handleSendReminder,
                    showOverdueFilter: showOverdueFilter,
                    onOverdueFilterApplied: ()=>setShowOverdueFilter(false)
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1071,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'settings':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$SettingsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    onUpdateSettings: handleUpdateSettings,
                    onBackup: handleBackup,
                    onRestore: handleRestore,
                    onClearAllData: handleClearAllData
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1082,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'notifications':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$NotificationsTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    setActiveTab: setActiveTab,
                    showConfirmation: showConfirmation,
                    onViewOrder: handleViewOrder,
                    onMarkAsPaid: handleUpdateOrderStatus,
                    onSendReminder: handleSendReminder
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1093,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'menuPrice':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$MenuPriceTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    showConfirmation: showConfirmation
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1104,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$DashboardTab$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ...commonProps,
                    setActiveTab: setActiveTab
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                    lineNumber: 1107,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    // Refresh handler - hard refresh that bypasses cache (silent background refresh)
    const handleRefresh = ()=>{
        // Run refresh silently in background without blocking
        (async ()=>{
            try {
                // Clear any cached data first
                if ("TURBOPACK compile-time truthy", 1) {
                    // Clear localStorage cache for orders (if any)
                    // Note: We don't clear all localStorage, just order-related cache
                    const cachedOrders = localStorage.getItem('homiebites_orders');
                    if (cachedOrders) {
                        localStorage.removeItem('homiebites_orders');
                    }
                }
                // Reload all data in parallel with hard refresh flag (non-blocking)
                const promises = [];
                // Add async functions with hard refresh
                if (loadOrders && typeof loadOrders === 'function') {
                    promises.push(loadOrders({}, true).catch((err)=>console.error('Error reloading orders:', err)));
                }
                if (loadMenuData && typeof loadMenuData === 'function') {
                    promises.push(loadMenuData().catch((err)=>console.error('Error reloading menu:', err)));
                }
                if (loadOffersData && typeof loadOffersData === 'function') {
                    promises.push(loadOffersData().catch((err)=>console.error('Error reloading offers:', err)));
                }
                if (loadUsers && typeof loadUsers === 'function') {
                    promises.push(loadUsers().catch((err)=>console.error('Error reloading users:', err)));
                }
                // Handle sync functions separately
                if (loadSettings && typeof loadSettings === 'function') {
                    try {
                        loadSettings();
                    } catch (err) {
                        console.error('Error reloading settings:', err);
                    }
                }
                // Wait for all async operations in background (non-blocking)
                if (promises.length > 0) {
                    await Promise.all(promises);
                }
            } catch (error) {
                console.error('Error refreshing data:', error);
            }
        })();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-dashboard",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `sidebar-overlay ${sidebarOpen ? 'show' : ''}`,
                onClick: ()=>setSidebarOpen(false),
                "aria-hidden": !sidebarOpen
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                lineNumber: 1169,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$Sidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                activeTab: activeTab,
                setActiveTab: setActiveTab,
                sidebarOpen: sidebarOpen,
                setSidebarOpen: setSidebarOpen,
                sidebarCollapsed: sidebarCollapsed,
                setSidebarCollapsed: setSidebarCollapsed,
                currentUser: currentUser,
                onLogout: handleLogout
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                lineNumber: 1174,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$TopNav$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        sidebarOpen: sidebarOpen,
                        setSidebarOpen: setSidebarOpen,
                        unreadNotifications: 0,
                        currentUser: currentUser,
                        onLogout: handleLogout,
                        setActiveTab: setActiveTab,
                        tabTitle: tabInfo.title,
                        tabSubtitle: tabInfo.subtitle,
                        tabAction: tabInfo.action,
                        onNewOrder: ()=>{
                            setActiveTab('currentMonthOrders');
                            setTimeout(()=>{
                                window.dispatchEvent(new CustomEvent('openNewOrderModal'));
                            }, 150);
                        },
                        onRefresh: handleRefresh
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                        lineNumber: 1186,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$ImportantNotificationsBanner$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        orders: orders,
                        dismissedNotifications: dismissedNotifications,
                        onDismiss: handleDismissNotification,
                        onViewPendingAmounts: handleViewPendingAmounts
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                        lineNumber: 1206,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    renderActiveTab()
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                lineNumber: 1185,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showOrderModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$OrderModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                show: showOrderModal,
                editingOrder: editingOrder,
                newOrder: newOrder,
                orders: orders,
                addressSuggestions: addressSuggestions,
                showAddressSuggestions: showAddressSuggestions,
                onClose: ()=>{
                    setShowOrderModal(false);
                    setEditingOrder(null);
                    setNewOrder({
                        date: new Date().toISOString().split('T')[0],
                        deliveryAddress: '',
                        quantity: 1,
                        unitPrice: settings?.defaultUnitPrice || 100,
                        total: settings?.defaultUnitPrice || 100,
                        mode: 'Lunch',
                        status: 'Unpaid',
                        paymentMode: ''
                    });
                },
                onSave: editingOrder ? handleEditOrder : handleAddOrder,
                onNewOrderChange: (field, value)=>{
                    setNewOrder({
                        ...newOrder,
                        [field]: value
                    });
                },
                onEditingOrderChange: (field, value)=>{
                    setEditingOrder({
                        ...editingOrder,
                        [field]: value
                    });
                },
                setAddressSuggestions: setAddressSuggestions,
                setShowAddressSuggestions: setShowAddressSuggestions
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                lineNumber: 1219,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showCSVUploadModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$CSVUploadModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                show: showCSVUploadModal,
                onClose: ()=>setShowCSVUploadModal(false),
                onUploadSuccess: (_data)=>{
                // Upload successful
                },
                showNotification: showNotification,
                loadOrders: loadOrders,
                showConfirmation: showConfirmation
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                lineNumber: 1254,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$ConfirmationModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                show: confirmationModal.show,
                title: confirmationModal.title,
                message: confirmationModal.message,
                type: confirmationModal.type,
                confirmText: confirmationModal.confirmText,
                cancelText: confirmationModal.cancelText,
                onConfirm: confirmationModal.onConfirm,
                onCancel: ()=>{
                    if (confirmationModal.onCancelCallback) confirmationModal.onCancelCallback();
                    setConfirmationModal({
                        ...confirmationModal,
                        show: false
                    });
                }
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                lineNumber: 1265,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$InstallPrompt$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
                lineNumber: 1280,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx",
        lineNumber: 1167,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AdminDashboard, "RFx/T5lgt0D5sRMBJSgH6zAjyk0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$contexts$2f$NotificationContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotification"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$hooks$2f$useFastDataSync$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFastDataSync"]
    ];
});
_c = AdminDashboard;
const __TURBOPACK__default__export__ = AdminDashboard;
var _c;
__turbopack_context__.k.register(_c, "AdminDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$contexts$2f$NotificationContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/contexts/NotificationContext.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const NotificationWrapper = ()=>{
    _s();
    const { notifications, removeNotification } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$contexts$2f$NotificationContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotification"])();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const notificationRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    // Auto-scroll to latest notification with smooth behavior
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationWrapper.useEffect": ()=>{
            if (containerRef.current && notifications.length > 0) {
                const container = containerRef.current;
                // Smooth scroll to bottom
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }["NotificationWrapper.useEffect"], [
        notifications
    ]);
    // Add entrance animation delay based on position
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationWrapper.useEffect": ()=>{
            notifications.forEach({
                "NotificationWrapper.useEffect": (notification, index)=>{
                    const element = notificationRefs.current.get(notification.id);
                    if (element) {
                        element.style.animationDelay = `${index * 0.05}s`;
                    }
                }
            }["NotificationWrapper.useEffect"]);
        }
    }["NotificationWrapper.useEffect"], [
        notifications
    ]);
    if (!notifications || notifications.length === 0) {
        return null;
    }
    const getIcon = (type)=>{
        switch(type){
            case 'success':
                return 'fa-circle-check';
            case 'error':
                return 'fa-circle-exclamation';
            case 'warning':
                return 'fa-triangle-exclamation';
            case 'info':
                return 'fa-circle-info';
            default:
                return 'fa-circle-info';
        }
    };
    const getTypeLabel = (type)=>{
        switch(type){
            case 'success':
                return 'Success';
            case 'error':
                return 'Error';
            case 'warning':
                return 'Warning';
            case 'info':
                return 'Info';
            default:
                return 'Notification';
        }
    };
    const handleNotificationClick = (id)=>{
        // Only dismiss on click if it's not an error (errors should require explicit close)
        const notification = notifications.find((n)=>n.id === id);
        if (notification && notification.type !== 'error') {
            removeNotification(id);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-notification-container toast-container",
        ref: containerRef,
        role: "region",
        "aria-label": "Notifications",
        "aria-live": "polite",
        "aria-atomic": "false",
        children: notifications.map((notification)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: (el)=>{
                    if (el) {
                        notificationRefs.current.set(notification.id, el);
                    } else {
                        notificationRefs.current.delete(notification.id);
                    }
                },
                className: `admin-notification admin-notification-${notification.type} toast toast-${notification.type}`,
                role: "alert",
                "aria-live": notification.type === 'error' ? 'assertive' : 'polite',
                onClick: ()=>handleNotificationClick(notification.id),
                onKeyDown: (e)=>{
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationClick(notification.id);
                    } else if (e.key === 'Escape') {
                        removeNotification(notification.id);
                    }
                },
                tabIndex: 0,
                "aria-label": `${getTypeLabel(notification.type)} notification: ${notification.message}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-notification-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "admin-notification-icon",
                                "aria-hidden": "true",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: `fa-solid ${getIcon(notification.type)}`
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                                    lineNumber: 111,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "admin-notification-body",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "admin-notification-message",
                                    children: notification.message
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                                lineNumber: 113,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "admin-notification-close",
                        onClick: (e)=>{
                            e.stopPropagation();
                            removeNotification(notification.id);
                        },
                        onKeyDown: (e)=>{
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                removeNotification(notification.id);
                            }
                        },
                        "aria-label": `Close ${getTypeLabel(notification.type)} notification`,
                        type: "button",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fa-solid fa-xmark",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                            lineNumber: 133,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    notification.duration > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "admin-notification-progress",
                        "aria-hidden": "true",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "admin-notification-progress-bar",
                            style: {
                                animationDuration: `${notification.duration}ms`
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                            lineNumber: 137,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                        lineNumber: 136,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, notification.id, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
                lineNumber: 85,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx",
        lineNumber: 76,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(NotificationWrapper, "dyzg0ZaaY4gmD6wE9fpjMdgLrNI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$contexts$2f$NotificationContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotification"]
    ];
});
_c = NotificationWrapper;
const __TURBOPACK__default__export__ = NotificationWrapper;
var _c;
__turbopack_context__.k.register(_c, "NotificationWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_components_admin_8cc390fd._.js.map