(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/lib/api-admin.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "default",
    ()=>__TURBOPACK__default__export__
]);
// Centralized API configuration and utilities
// Determine API base URL
// All APIs are now in Next.js - use relative URLs for both development and production
// Next.js API routes run on the same server as the frontend
// Endpoints already include '/api/' prefix, so base URL should be empty
let resolvedApiUrl = '';
// API URL configuration
if (("TURBOPACK compile-time value", "object") !== 'undefined') {
// Backend URL configured - no debug logging
}
const api = {
    baseURL: resolvedApiUrl,
    async request (endpoint, options = {}) {
        const url = `${resolvedApiUrl}${endpoint}`;
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('homiebites_token') : "TURBOPACK unreachable";
        // Don't set Content-Type for FormData - browser will set it with boundary
        const isFormData = options.body instanceof FormData;
        const defaultHeaders = isFormData ? {} : {
            'Content-Type': 'application/json'
        };
        // Support AbortController for request cancellation
        const signal = options.signal || options.abortController?.signal;
        const config = {
            ...options,
            signal,
            headers: {
                ...defaultHeaders,
                ...token && {
                    Authorization: `Bearer ${token}`
                },
                ...options.headers
            },
            // Force cache bypass for hard refresh
            cache: options.hardRefresh ? 'no-store' : options.cache || 'default'
        };
        // Remove signal from options to avoid passing it twice
        delete config.abortController;
        try {
            const response = await fetch(url, config);
            // Handle non-JSON responses
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = await response.json();
                } catch (jsonError) {
                    throw new Error(`Invalid JSON response: ${jsonError.message}`);
                }
            } else {
                const text = await response.text();
                // If we get HTML, it means we're hitting the wrong server (frontend instead of backend)
                if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<!DOCTYPE')) {
                    console.error(`[API] Got HTML instead of JSON from ${url}. Backend server may not be running or API URL is incorrect.`);
                    throw new Error(`Backend API not available. Please ensure the backend server is running on ${resolvedApiUrl}. Received HTML instead of JSON.`);
                }
                throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
            }
            if (!response.ok) {
                // Handle 404 for optional endpoints gracefully
                if (response.status === 404) {
                    const isOptionalEndpoint = endpoint.includes('/auth/users');
                    if (isOptionalEndpoint) {
                        // Return a response object that indicates the endpoint doesn't exist
                        // This prevents throwing an error and allows graceful fallback
                        return {
                            success: false,
                            error: 'Route not found',
                            data: null,
                            _isOptional: true
                        };
                    }
                }
                // Handle authentication errors
                if (response.status === 401 || response.status === 403) {
                    // Don't redirect if this is a login request (login endpoint can return 401 for wrong credentials)
                    const isLoginRequest = endpoint.includes('/auth/login');
                    // Clear invalid token and admin state (except for login requests)
                    if (("TURBOPACK compile-time value", "object") !== 'undefined' && !isLoginRequest) {
                        localStorage.removeItem('homiebites_token');
                        localStorage.removeItem('homiebites_admin');
                        localStorage.removeItem('homiebites_user');
                        // Redirect to admin login page if on admin route
                        if (window.location.pathname.startsWith('/admin')) {
                            console.warn('[API] Authentication failed. Redirecting to admin login...');
                            window.location.href = '/admin';
                        } else if (window.location.pathname === '/') {
                            // Don't redirect if already on home page
                            console.warn('[API] Authentication failed but already on home page');
                        }
                    }
                    // For login requests, return the error message from the API
                    if (isLoginRequest && data && data.error) {
                        throw new Error(data.error);
                    }
                    throw new Error(isLoginRequest ? 'Invalid credentials. Please check your username and password.' : 'Authentication failed. Please login again.');
                }
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            return data;
        } catch (error) {
            // Don't log errors for optional endpoints that return 404
            const isOptionalEndpoint = endpoint.includes('/auth/users');
            if (!isOptionalEndpoint) {
                console.error(`[API] Request failed for ${url}:`, error.message);
            }
            // Re-throw with more context
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error(`Network error: Unable to connect to the server. Please check your internet connection and try again.`);
            }
            // Provide user-friendly error messages
            if (error instanceof Error) {
                // Preserve original error but ensure message is user-friendly
                const userMessage = error.message || 'An error occurred';
                throw new Error(userMessage);
            }
            throw error;
        }
    },
    // Auth endpoints
    async login (email, password) {
        // Following ADMIN_PASSWORD.md - use email for login
        const loginData = {
            email: email?.trim() || email,
            password: password?.trim() || password
        };
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData)
        });
    },
    async register (userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    // Menu endpoints
    async getMenu () {
        const result = await this.request('/api/menu');
        return result;
    },
    async updateMenu (menuData) {
        // Backend accepts either array directly or { categories: [...] }
        // Send array directly to match backend expectation
        return this.request('/api/menu', {
            method: 'PUT',
            body: JSON.stringify(menuData)
        });
    },
    async deleteMenu () {
        return this.request('/api/menu', {
            method: 'DELETE'
        });
    },
    // Order endpoints
    async createOrder (orderData) {
        return this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },
    // Manual order creation (uses new OrderID format: HB-Jan'25-15-000079)
    async createManualOrder (orderData) {
        return this.request('/api/orders/manual', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },
    // Admin order endpoints
    async getAllOrders (filters = {}, options = {}) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.search) params.append('search', filters.search);
        // Add cache-busting timestamp for hard refresh
        if (options.hardRefresh) {
            params.append('_t', Date.now().toString());
        }
        const queryString = params.toString();
        return this.request(`/api/orders${queryString ? '?' + queryString : ''}`, {
            ...options,
            hardRefresh: options.hardRefresh
        });
    },
    async updateOrder (orderId, orderData) {
        return this.request(`/api/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify(orderData)
        });
    },
    async deleteOrder (orderId) {
        return this.request(`/api/orders/${orderId}`, {
            method: 'DELETE'
        });
    },
    async bulkImportOrders (orders) {
        // Backend expects the request body to be directly an array, not wrapped in an object
        if (!Array.isArray(orders)) {
            throw new Error('Orders must be an array');
        }
        return this.request('/api/orders/bulk-import', {
            method: 'POST',
            body: JSON.stringify(orders)
        });
    },
    async cleanupDuplicates () {
        return this.request('/api/orders/cleanup-duplicates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    // Upload Excel/CSV file
    async uploadExcelFile (file) {
        const formData = new FormData();
        formData.append('file', file);
        return this.request('/api/orders/upload-excel', {
            method: 'POST',
            body: formData
        });
    },
    // Clear all orders
    async clearAllOrders () {
        return this.request('/api/orders/clear-all', {
            method: 'DELETE'
        });
    },
    // Review endpoints
    async createReview (reviewData) {
        return this.request('/api/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    },
    async getReviews (featured = false, limit = 10) {
        const params = new URLSearchParams();
        if (featured) params.append('featured', 'true');
        if (limit) params.append('limit', limit.toString());
        return this.request(`/api/reviews?${params.toString()}`);
    },
    // Offers endpoints
    async getOffers () {
        return this.request('/api/offers');
    },
    async updateOffers (offersData) {
        return this.request('/api/offers', {
            method: 'PUT',
            body: JSON.stringify({
                offers: offersData
            })
        });
    },
    // Password recovery endpoints
    async forgotPassword (email) {
        return this.request('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({
                email
            })
        });
    },
    async verifyOTP (email, otp) {
        return this.request('/api/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({
                email,
                otp
            })
        });
    },
    async verifyIdentity (email, verificationToken, panCard, adminId) {
        return this.request('/api/auth/verify-identity', {
            method: 'POST',
            body: JSON.stringify({
                email,
                verificationToken,
                panCard,
                adminId
            })
        });
    },
    async resetPassword (email, resetToken, newPassword) {
        return this.request('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                email,
                resetToken,
                newPassword
            })
        });
    },
    // Admin user endpoints
    async getAllUsers () {
        return this.request('/api/auth/users');
    },
    // Gallery endpoints
    async getGallery () {
        return this.request('/api/gallery');
    },
    async createGalleryItem (itemData) {
        return this.request('/api/gallery', {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    },
    async updateGalleryItem (id, itemData) {
        return this.request(`/api/gallery/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData)
        });
    },
    async deleteGalleryItem (id) {
        return this.request(`/api/gallery/${id}`, {
            method: 'DELETE'
        });
    },
    // Settings endpoints
    async getSettings () {
        return this.request('/api/settings');
    },
    async getFullSettings () {
        return this.request('/api/settings/full');
    },
    async updateSettings (settingsData) {
        return this.request('/api/settings', {
            method: 'PUT',
            body: JSON.stringify(settingsData)
        });
    }
};
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/lib/auth-admin.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isAuthenticated",
    ()=>isAuthenticated,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "requireAuth",
    ()=>requireAuth
]);
// Authentication utility using localStorage
// Note: Login is now handled via API (api-admin.js)
// This file only provides logout and authentication check utilities
const ADMIN_KEY = "homiebites_admin";
const login = (username, password)=>{
    // Legacy function - login should be done via API
    console.warn('login() from auth-admin.js is deprecated. Use API authentication instead.');
    return {
        success: false,
        error: "Please use API authentication"
    };
};
const logout = ()=>{
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem("homiebites_admin");
    localStorage.removeItem("homiebites_user");
    localStorage.removeItem("homiebites_token");
};
const isAuthenticated = ()=>{
    return localStorage.getItem(ADMIN_KEY) === "true";
};
const requireAuth = ()=>{
    if (!isAuthenticated()) {
        return false;
    }
    return true;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/lib/globalErrorHandler.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "initializeGlobalErrorHandler",
    ()=>initializeGlobalErrorHandler,
    "safeAsync",
    ()=>safeAsync,
    "setupGlobalErrorHandlers",
    ()=>setupGlobalErrorHandlers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Global Error Handler
 * Catches and handles all unhandled errors and promise rejections
 */ let notificationContext = null;
const initializeGlobalErrorHandler = (showNotification)=>{
    notificationContext = {
        showNotification
    };
};
/**
 * Format error message for user-friendly display
 */ const formatErrorMessage = (error)=>{
    if (!error) return 'An unexpected error occurred';
    // Handle Error objects
    if (error instanceof Error) {
        const message = error.message || error.toString();
        // Network errors
        if (message.includes('fetch') || message.includes('Network')) {
            return 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
        }
        // API errors
        if (message.includes('401') || message.includes('Authentication')) {
            return 'Authentication failed. Please log in again.';
        }
        if (message.includes('403') || message.includes('Forbidden')) {
            return 'Access denied. You do not have permission to perform this action.';
        }
        if (message.includes('404') || message.includes('Not found')) {
            return 'The requested resource was not found.';
        }
        if (message.includes('500') || message.includes('Internal Server')) {
            return 'Server error: Something went wrong on the server. Please try again later.';
        }
        // Validation errors
        if (message.includes('validation') || message.includes('required')) {
            return `Validation error: ${message}`;
        }
        // Return the error message as-is if no special handling needed
        return message || 'An unexpected error occurred';
    }
    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }
    // Handle objects with error property
    if (error && typeof error === 'object' && error.error) {
        return formatErrorMessage(error.error);
    }
    // Handle objects with message property
    if (error && typeof error === 'object' && error.message) {
        return formatErrorMessage(error.message);
    }
    // Fallback
    return 'An unexpected error occurred';
};
/**
 * Handle unhandled errors
 */ const handleError = (event)=>{
    // Prevent default browser error display
    event.preventDefault?.();
    const error = event.error || event.reason || event;
    // Ignore empty objects - these are false positives
    if (error && typeof error === 'object' && Object.keys(error).length === 0) {
        return true; // Silently ignore empty error objects
    }
    // Ignore if error is null, undefined, or empty string
    if (!error || typeof error === 'string' && error.trim() === '') {
        return true; // Silently ignore
    }
    // Ignore PWA install prompt warnings (expected behavior)
    if (error && typeof error === 'object' && error.message) {
        const message = String(error.message).toLowerCase();
        if (message.includes('beforeinstallprompt') || message.includes('banner not shown') || message.includes('preventdefault')) {
            // This is expected behavior for PWA install prompts - suppress warning
            return true;
        }
    }
    // Ignore if error message contains PWA install prompt text
    if (error && typeof error === 'string') {
        const errorStr = String(error).toLowerCase();
        if (errorStr.includes('beforeinstallprompt') || errorStr.includes('banner not shown') || errorStr.includes('preventdefault')) {
            return true;
        }
    }
    // Only process if we have a real error with meaningful information
    const hasErrorMessage = error && (typeof error === 'object' && (error.message || error.stack || error.name) || typeof error === 'string' && error.trim() !== '');
    if (!hasErrorMessage) {
        // Not a real error - silently ignore
        return true;
    }
    const errorMessage = formatErrorMessage(error);
    // Log error for debugging (only real errors)
    if ("TURBOPACK compile-time truthy", 1) {
        console.error('[Global Error Handler] Error:', {
            message: error.message || error,
            stack: error.stack,
            name: error.name,
            eventType: event.type,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }
    // Show notification if available
    if (notificationContext?.showNotification) {
        notificationContext.showNotification(errorMessage, 'error', 8000);
    } else {
        // Fallback: Show alert if notification system not available
        console.error('Error:', errorMessage);
    }
    // Track error for monitoring (if error tracking service is configured)
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.errorTracker) {
        try {
            window.errorTracker.captureError(error, {
                type: 'unhandled_error',
                source: 'global_error_handler'
            });
        } catch (trackError) {
        // Don't throw if error tracking fails
        }
    }
    return true;
};
/**
 * Handle unhandled promise rejections
 */ const handleUnhandledRejection = (event)=>{
    // Prevent default browser error display
    event.preventDefault?.();
    const error = event.reason || event;
    // Ignore empty objects - these are false positives
    if (error && typeof error === 'object' && Object.keys(error).length === 0) {
        return; // Silently ignore empty error objects
    }
    // Ignore if error is null, undefined, or empty string
    if (!error || typeof error === 'string' && error.trim() === '') {
        return; // Silently ignore
    }
    // Ignore PWA install prompt warnings (expected behavior)
    if (error && typeof error === 'object' && error.message) {
        const message = String(error.message).toLowerCase();
        if (message.includes('beforeinstallprompt') || message.includes('banner not shown') || message.includes('preventdefault')) {
            // This is expected behavior for PWA install prompts - suppress warning
            return;
        }
    }
    // Ignore if error message contains PWA install prompt text
    if (error && typeof error === 'string') {
        const errorStr = String(error).toLowerCase();
        if (errorStr.includes('beforeinstallprompt') || errorStr.includes('banner not shown') || errorStr.includes('preventdefault')) {
            return;
        }
    }
    // Only process if we have a real error with meaningful information
    const hasErrorMessage = error && (typeof error === 'object' && (error.message || error.stack || error.name) || typeof error === 'string' && error.trim() !== '');
    if (!hasErrorMessage) {
        // Not a real error - silently ignore
        return;
    }
    const errorMessage = formatErrorMessage(error);
    // Log error for debugging (only real errors)
    if ("TURBOPACK compile-time truthy", 1) {
        console.error('[Global Error Handler] Unhandled Promise Rejection:', {
            message: error.message || error,
            stack: error.stack,
            name: error.name,
            reason: event.reason
        });
    }
    // Show notification if available
    if (notificationContext?.showNotification) {
        notificationContext.showNotification(errorMessage, 'error', 8000);
    } else {
        // Fallback: Show alert if notification system not available
        console.error('Unhandled Promise Rejection:', errorMessage);
    }
    // Track error for monitoring
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.errorTracker) {
        try {
            window.errorTracker.captureError(error, {
                type: 'unhandled_promise_rejection',
                source: 'global_error_handler'
            });
        } catch (trackError) {
        // Don't throw if error tracking fails
        }
    }
};
const setupGlobalErrorHandlers = (showNotification)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Initialize notification context
    initializeGlobalErrorHandler(showNotification);
    // Handle unhandled errors
    window.addEventListener('error', handleError, true);
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    // Handle React errors (if ErrorBoundary catches them)
    window.addEventListener('react-error', (event)=>{
        const { error, errorInfo } = event.detail || {};
        handleError({
            error,
            errorInfo
        });
    });
    // Return cleanup function
    return ()=>{
        window.removeEventListener('error', handleError, true);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
};
const safeAsync = async (asyncFn, errorHandler)=>{
    try {
        return await asyncFn();
    } catch (error) {
        const errorMessage = formatErrorMessage(error);
        // Use provided error handler or default
        if (errorHandler) {
            errorHandler(errorMessage, error);
        } else if (notificationContext?.showNotification) {
            notificationContext.showNotification(errorMessage, 'error', 6000);
        }
        // Re-throw if needed for caller to handle
        throw error;
    }
};
const __TURBOPACK__default__export__ = {
    setupGlobalErrorHandlers,
    initializeGlobalErrorHandler,
    formatErrorMessage,
    safeAsync
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/lib/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Centralized API configuration and utilities
// All APIs are now in Next.js - use relative URLs for both development and production
// Next.js API routes run on the same server as the frontend
// Endpoints already include '/api/' prefix, so base URL should be empty
const API_BASE_URL = (("TURBOPACK compile-time truthy", 1) ? ("TURBOPACK compile-time value", "") : "TURBOPACK unreachable") || ("TURBOPACK compile-time value", "") || ("TURBOPACK compile-time value", "") || '';
// Use relative URL (empty string means same origin)
let resolvedApiUrl = API_BASE_URL;
const api = {
    baseURL: resolvedApiUrl,
    async request (endpoint, options = {}) {
        const url = `${resolvedApiUrl}${endpoint}`;
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('homiebites_token') : "TURBOPACK unreachable";
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...token && {
                    Authorization: `Bearer ${token}`
                },
                ...options.headers
            }
        };
        try {
            const response = await fetch(url, config);
            // Handle non-JSON responses
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = await response.json();
                } catch (jsonError) {
                    throw new Error(`Invalid JSON response: ${jsonError.message}`);
                }
            } else {
                const text = await response.text();
                // If we get HTML, it means we're hitting the wrong server (frontend instead of backend)
                if (text.trim().startsWith('<!doctype') || text.trim().startsWith('<!DOCTYPE')) {
                    console.error(`[API] Got HTML instead of JSON from ${url}. Backend server may not be running or API URL is incorrect.`);
                    throw new Error(`Backend API not available. Please ensure the backend server is running on ${resolvedApiUrl}. Received HTML instead of JSON.`);
                }
                throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
            }
            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401 || response.status === 403) {
                    // Don't redirect if this is a login request (login endpoint can return 401 for wrong credentials)
                    const isLoginRequest = endpoint.includes('/auth/login');
                    // Clear invalid token and admin state (except for login requests)
                    if (("TURBOPACK compile-time value", "object") !== 'undefined' && !isLoginRequest) {
                        localStorage.removeItem('homiebites_token');
                        localStorage.removeItem('homiebites_admin');
                        localStorage.removeItem('homiebites_user');
                        // Redirect to login if on admin route
                        if (window.location.pathname.startsWith('/admin')) {
                            console.warn('[API] Authentication failed. Redirecting to login...');
                            window.location.href = '/admin';
                        }
                    }
                    // For login requests, return the error message from the API
                    if (isLoginRequest && data && data.error) {
                        throw new Error(data.error);
                    }
                    throw new Error(isLoginRequest ? 'Invalid credentials. Please check your username and password.' : 'Authentication failed. Please login again.');
                }
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error(`[API] Request failed for ${url}:`, error.message);
            // Re-throw with more context
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error(`Network error: Unable to connect to backend server at ${resolvedApiUrl}. Please check if the backend is running.`);
            }
            throw error;
        }
    },
    // Auth endpoints
    async login (emailOrUsername, password) {
        // Support both email and username for login - trim whitespace
        const loginData = {
            email: emailOrUsername?.trim() || emailOrUsername,
            username: emailOrUsername?.trim() || emailOrUsername,
            password: password?.trim() || password
        };
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginData)
        });
    },
    async register (userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    // Menu endpoints
    async getMenu () {
        return this.request('/api/menu');
    },
    async updateMenu (menuData) {
        return this.request('/api/menu', {
            method: 'PUT',
            body: JSON.stringify({
                categories: menuData
            })
        });
    },
    // Order endpoints
    async createOrder (orderData) {
        return this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },
    // Manual order creation (uses new OrderID format: HB-Jan'25-15-000079)
    async createManualOrder (orderData) {
        return this.request('/api/orders/manual', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },
    // Admin order endpoints
    async getAllOrders (filters = {}) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.search) params.append('search', filters.search);
        const queryString = params.toString();
        return this.request(`/api/orders${queryString ? '?' + queryString : ''}`);
    },
    async updateOrder (orderId, orderData) {
        return this.request(`/api/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify(orderData)
        });
    },
    async deleteOrder (orderId) {
        return this.request(`/api/orders/${orderId}`, {
            method: 'DELETE'
        });
    },
    async bulkImportOrders (orders) {
        // Backend expects the request body to be directly an array, not wrapped in an object
        if (!Array.isArray(orders)) {
            throw new Error('Orders must be an array');
        }
        return this.request('/api/orders/bulk-import', {
            method: 'POST',
            body: JSON.stringify(orders)
        });
    },
    async cleanupDuplicates () {
        return this.request('/api/orders/cleanup-duplicates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    // Review endpoints
    async createReview (reviewData) {
        return this.request('/api/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    },
    async getReviews (featured = false, limit = 10) {
        const params = new URLSearchParams();
        if (featured) params.append('featured', 'true');
        if (limit) params.append('limit', limit.toString());
        return this.request(`/api/reviews?${params.toString()}`);
    },
    // Offers endpoints
    async getOffers () {
        return this.request('/api/offers');
    },
    async updateOffers (offersData) {
        return this.request('/api/offers', {
            method: 'PUT',
            body: JSON.stringify({
                offers: offersData
            })
        });
    },
    // Password recovery endpoints
    async forgotPassword (email) {
        return this.request('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({
                email
            })
        });
    },
    async verifyOTP (email, otp) {
        return this.request('/api/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({
                email,
                otp
            })
        });
    },
    async verifyIdentity (email, verificationToken, panCard, adminId) {
        return this.request('/api/auth/verify-identity', {
            method: 'POST',
            body: JSON.stringify({
                email,
                verificationToken,
                panCard,
                adminId
            })
        });
    },
    async resetPassword (email, resetToken, newPassword) {
        return this.request('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                email,
                resetToken,
                newPassword
            })
        });
    },
    // Admin user endpoints
    async getAllUsers () {
        return this.request('/api/auth/users');
    },
    // Gallery endpoints
    async getGallery () {
        return this.request('/api/gallery');
    },
    async createGalleryItem (itemData) {
        return this.request('/api/gallery', {
            method: 'POST',
            body: JSON.stringify(itemData)
        });
    },
    async updateGalleryItem (id, itemData) {
        return this.request(`/api/gallery/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData)
        });
    },
    async deleteGalleryItem (id) {
        return this.request(`/api/gallery/${id}`, {
            method: 'DELETE'
        });
    }
};
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/lib/menuData.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMenuData",
    ()=>getMenuData,
    "getMenuDataSync",
    ()=>getMenuDataSync,
    "resetMenuData",
    ()=>resetMenuData,
    "saveMenuData",
    ()=>saveMenuData,
    "triggerDataSync",
    ()=>triggerDataSync
]);
// Menu data management with API integration and localStorage fallback
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/api.js [app-client] (ecmascript)");
;
const MENU_DATA_KEY = "homiebites_menu_data";
const defaultMenuData = [
    {
        id: 1,
        category: "Full Tiffin",
        icon: "fa-star",
        tag: "Best Seller",
        description: "Gravy Sabji + Dry Sabji + 4 Rotis + Rice (4 Rotis with Rice / 6 Rotis without Rice)",
        items: [
            {
                id: 1,
                name: "Thali Plastic (Classic)",
                price: 120
            },
            {
                id: 10,
                name: "Tiffin Steel (Zambo)",
                price: 150
            }
        ]
    },
    {
        id: 2,
        category: "Mix & Match Tiffin",
        icon: "fa-utensils",
        items: [
            {
                id: 1,
                name: "2 Sabji + 6 Rotis",
                price: 120
            },
            {
                id: 2,
                name: "1 Sabji + 4 Rotis + Rice",
                price: 100
            },
            {
                id: 3,
                name: "2 Sabji + 4 Rotis",
                price: 120
            },
            {
                id: 4,
                name: "1 Sabji + 6 Rotis",
                price: 100
            },
            {
                id: 5,
                name: "1 Sabji + 4 Rotis",
                price: 80
            },
            {
                id: 6,
                name: "1 Sabji + 2 Bowls Rice",
                price: 100
            },
            {
                id: 7,
                name: "Only 1 Sabji",
                price: 40
            }
        ]
    },
    {
        id: 3,
        category: "Khichdi Tiffin",
        icon: "fa-bowl-rice",
        description: "Full Tiffin (4 bowls)",
        items: [
            {
                id: 1,
                name: "Khichdi Meal",
                price: 120
            }
        ]
    },
    {
        id: 4,
        category: "Rotis & Parathas",
        icon: "fa-bread-slice",
        items: [
            {
                id: 1,
                name: "Plain Roti",
                price: 10
            },
            {
                id: 2,
                name: "Roti with Ghee",
                price: 12
            },
            {
                id: 3,
                name: "Plain Paratha",
                price: 20
            },
            {
                id: 4,
                name: "Stuffed Paratha (Aloo/Gobhi/Muli/Methi)",
                price: 35
            },
            {
                id: 5,
                name: "3 Stuffed Parathas",
                price: 100
            }
        ]
    },
    {
        id: 5,
        category: "Add-ons",
        icon: "fa-plus",
        items: [
            {
                id: 1,
                name: "Homemade Curd (1 Bowl)",
                price: 25
            },
            {
                id: 2,
                name: "Parathas + Curd Combo",
                price: 100
            }
        ]
    },
    {
        id: 6,
        category: "Pickup Option",
        icon: "fa-person-walking",
        items: [
            {
                id: 1,
                name: "Self-Pickup (A1 Tower)",
                price: 100
            }
        ],
        description: "Thali & Tiffin both available"
    }
];
const getMenuData = async ()=>{
    // Check if we're in browser environment
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        // Try to fetch from API first
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getMenu();
            if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
                // Don't cache to localStorage - always fetch from backend
                return response.data;
            }
        } catch (apiError) {
            console.error("API fetch failed:", apiError.message);
        // Don't use localStorage fallback - return empty array
        // Menu data must come from backend only
        }
        // Return empty array if no menu data exists (admin must add items first)
        return [];
    } catch (error) {
        console.error("Error accessing menu data:", error);
        return [];
    }
};
const getMenuDataSync = ()=>{
    // Always return empty - data must come from backend via getMenuData()
    return [];
};
const saveMenuData = async (data)=>{
    // Save directly to backend only - no localStorage
    try {
        const token = localStorage.getItem("homiebites_token");
        if (token) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateMenu(data);
            // Clear any old localStorage cache to ensure fresh data
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem(MENU_DATA_KEY);
                localStorage.removeItem("homiebites_menu_version");
            }
        } else {
            throw new Error('Not authenticated. Please login to save menu data.');
        }
    } catch (error) {
        console.error("Failed to save menu to API:", error.message);
        throw error; // Re-throw so caller can handle the error
    }
};
const resetMenuData = async ()=>{
    // Return default data for editing in admin dashboard
    // DO NOT save to localStorage - admin must click "Save Changes" to actually save
    return defaultMenuData;
};
const triggerDataSync = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        window.dispatchEvent(new CustomEvent("menuDataUpdated"));
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/lib/offersData.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOffersData",
    ()=>getOffersData,
    "getOffersDataSync",
    ()=>getOffersDataSync,
    "saveOffersData",
    ()=>saveOffersData,
    "triggerOffersDataSync",
    ()=>triggerOffersDataSync
]);
// Offers data management with API integration and localStorage fallback
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/api.js [app-client] (ecmascript)");
;
const OFFERS_DATA_KEY = "homiebites_offers_data";
const getOffersData = async ()=>{
    // Check if we're in browser environment
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        // Try to fetch from API first
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getOffers();
            if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
                // Filter only active offers with valid data
                const activeOffers = response.data.filter((offer)=>{
                    // Must be active
                    if (!offer.isActive) return false;
                    // Must not be expired (if endDate exists)
                    if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
                    // Must have a valid title (not empty, not test data)
                    if (!offer.title || offer.title.trim() === "" || offer.title.toLowerCase().includes("test") || offer.title.toLowerCase().includes("saved via")) {
                        return false;
                    }
                    return true;
                });
                // Cache in localStorage for offline access
                localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(activeOffers));
                return activeOffers;
            }
        } catch (apiError) {
            console.warn("API fetch failed, using cached data:", apiError.message);
        }
        // Fallback to localStorage - only return active offers
        const stored = localStorage.getItem(OFFERS_DATA_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    // Filter only active offers with valid data
                    const activeOffers = parsed.filter((offer)=>{
                        // Must be active
                        if (!offer.isActive) return false;
                        // Must not be expired (if endDate exists)
                        if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
                        // Must have a valid title (not empty, not test data)
                        if (!offer.title || offer.title.trim() === "" || offer.title.toLowerCase().includes("test") || offer.title.toLowerCase().includes("saved via")) {
                            return false;
                        }
                        return true;
                    });
                    return activeOffers;
                }
            } catch (e) {
                console.warn("Error parsing offers data from localStorage:", e);
            }
        }
        // Return empty array if no offers exist
        return [];
    } catch (error) {
        console.error("Error accessing offers data:", error);
        return [];
    }
};
const getOffersDataSync = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = localStorage.getItem(OFFERS_DATA_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    // Filter only active offers with valid data
                    const activeOffers = parsed.filter((offer)=>{
                        // Must be active
                        if (!offer.isActive) return false;
                        // Must not be expired (if endDate exists)
                        if (offer.endDate && new Date(offer.endDate) < new Date()) return false;
                        // Must have a valid title (not empty, not test data)
                        if (!offer.title || offer.title.trim() === "" || offer.title.toLowerCase().includes("test") || offer.title.toLowerCase().includes("saved via")) {
                            return false;
                        }
                        return true;
                    });
                    return activeOffers;
                }
            } catch (e) {
                console.warn("Error parsing offers data from localStorage:", e);
            }
        }
        // Return empty array if no offers exist
        return [];
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return [];
    }
};
const saveOffersData = async (data)=>{
    // Save to localStorage immediately for instant UI update
    localStorage.setItem(OFFERS_DATA_KEY, JSON.stringify(data));
    // Try to sync to API (admin only)
    try {
        const token = localStorage.getItem("homiebites_token");
        if (token) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateOffers(data);
        }
    } catch (error) {
        console.warn("Failed to sync offers to API, saved locally:", error.message);
    // Data is already saved to localStorage, so it's not lost
    }
};
const triggerOffersDataSync = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        window.dispatchEvent(new CustomEvent("offersDataUpdated"));
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/hooks/useKeyboardAvoidance.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAutoKeyboardAvoidance",
    ()=>useAutoKeyboardAvoidance,
    "useKeyboardAvoidance",
    ()=>useKeyboardAvoidance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const useKeyboardAvoidance = (options = {})=>{
    _s();
    const { enabled = true, mobileBreakpoint = 768, scrollBehavior = 'smooth', block = 'center', delay = null } = options;
    const inputRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useKeyboardAvoidance.useEffect": ()=>{
            if (!enabled) return;
            const isMobile = {
                "useKeyboardAvoidance.useEffect.isMobile": ()=>window.innerWidth <= mobileBreakpoint
            }["useKeyboardAvoidance.useEffect.isMobile"];
            const handleInputFocus = {
                "useKeyboardAvoidance.useEffect.handleInputFocus": (input)=>{
                    if (!isMobile() || !input) return;
                    const scrollInputIntoView = {
                        "useKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView": ()=>{
                            // Use visualViewport if available for better keyboard detection
                            if (window.visualViewport) {
                                const viewport = window.visualViewport;
                                const inputRect = input.getBoundingClientRect();
                                const viewportHeight = viewport.height;
                                // Check if input is covered by keyboard
                                if (inputRect.bottom > viewportHeight) {
                                    const scrollDelay = delay !== null ? delay : 100;
                                    setTimeout({
                                        "useKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView": ()=>{
                                            input.scrollIntoView({
                                                behavior: scrollBehavior,
                                                block: block,
                                                inline: 'nearest'
                                            });
                                        }
                                    }["useKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView"], scrollDelay);
                                }
                            } else {
                                // Fallback for browsers without visualViewport
                                const scrollDelay = delay !== null ? delay : 300;
                                setTimeout({
                                    "useKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView": ()=>{
                                        input.scrollIntoView({
                                            behavior: scrollBehavior,
                                            block: block,
                                            inline: 'nearest'
                                        });
                                    }
                                }["useKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView"], scrollDelay);
                            }
                        }
                    }["useKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView"];
                    scrollInputIntoView();
                }
            }["useKeyboardAvoidance.useEffect.handleInputFocus"];
            // Add focus listeners to all registered inputs
            const inputs = inputRefs.current.filter(Boolean);
            const focusHandlers = inputs.map({
                "useKeyboardAvoidance.useEffect.focusHandlers": (input)=>{
                    const handler = {
                        "useKeyboardAvoidance.useEffect.focusHandlers.handler": ()=>handleInputFocus(input)
                    }["useKeyboardAvoidance.useEffect.focusHandlers.handler"];
                    input.addEventListener('focus', handler);
                    return {
                        input,
                        handler
                    };
                }
            }["useKeyboardAvoidance.useEffect.focusHandlers"]);
            return ({
                "useKeyboardAvoidance.useEffect": ()=>{
                    // Cleanup: remove all event listeners
                    focusHandlers.forEach({
                        "useKeyboardAvoidance.useEffect": ({ input, handler })=>{
                            input.removeEventListener('focus', handler);
                        }
                    }["useKeyboardAvoidance.useEffect"]);
                }
            })["useKeyboardAvoidance.useEffect"];
        }
    }["useKeyboardAvoidance.useEffect"], [
        enabled,
        mobileBreakpoint,
        scrollBehavior,
        block,
        delay
    ]);
    /**
   * Register an input element for keyboard avoidance
   * @param {HTMLElement} input - Input element to register
   */ const registerInput = (input)=>{
        if (input && !inputRefs.current.includes(input)) {
            inputRefs.current.push(input);
        }
    };
    /**
   * Unregister an input element
   * @param {HTMLElement} input - Input element to unregister
   */ const unregisterInput = (input)=>{
        inputRefs.current = inputRefs.current.filter((ref)=>ref !== input);
    };
    /**
   * Create a ref callback that automatically registers the input
   * @returns {Function} - Ref callback function
   */ const createInputRef = ()=>{
        return (input)=>{
            if (input) {
                registerInput(input);
            }
        };
    };
    return {
        registerInput,
        unregisterInput,
        createInputRef,
        inputRefs: inputRefs.current
    };
};
_s(useKeyboardAvoidance, "KbBMijb38wIYom9D23LsjYZTGu4=");
const useAutoKeyboardAvoidance = (options = {})=>{
    _s1();
    const { containerSelector = 'form', inputSelector = 'input, textarea, select', ...restOptions } = options;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAutoKeyboardAvoidance.useEffect": ()=>{
            if (!restOptions.enabled && restOptions.enabled !== undefined) return;
            const isMobile = {
                "useAutoKeyboardAvoidance.useEffect.isMobile": ()=>window.innerWidth <= (restOptions.mobileBreakpoint || 768)
            }["useAutoKeyboardAvoidance.useEffect.isMobile"];
            const handleInputFocus = {
                "useAutoKeyboardAvoidance.useEffect.handleInputFocus": (input)=>{
                    if (!isMobile() || !input) return;
                    const scrollInputIntoView = {
                        "useAutoKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView": ()=>{
                            if (window.visualViewport) {
                                const viewport = window.visualViewport;
                                const inputRect = input.getBoundingClientRect();
                                const viewportHeight = viewport.height;
                                if (inputRect.bottom > viewportHeight) {
                                    const delay = restOptions.delay !== null ? restOptions.delay : 100;
                                    setTimeout({
                                        "useAutoKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView": ()=>{
                                            input.scrollIntoView({
                                                behavior: restOptions.scrollBehavior || 'smooth',
                                                block: restOptions.block || 'center',
                                                inline: 'nearest'
                                            });
                                        }
                                    }["useAutoKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView"], delay);
                                }
                            } else {
                                const delay = restOptions.delay !== null ? restOptions.delay : 300;
                                setTimeout({
                                    "useAutoKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView": ()=>{
                                        input.scrollIntoView({
                                            behavior: restOptions.scrollBehavior || 'smooth',
                                            block: restOptions.block || 'center',
                                            inline: 'nearest'
                                        });
                                    }
                                }["useAutoKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView"], delay);
                            }
                        }
                    }["useAutoKeyboardAvoidance.useEffect.handleInputFocus.scrollInputIntoView"];
                    scrollInputIntoView();
                }
            }["useAutoKeyboardAvoidance.useEffect.handleInputFocus"];
            // Find all containers and their inputs
            const containers = document.querySelectorAll(containerSelector);
            const allHandlers = [];
            containers.forEach({
                "useAutoKeyboardAvoidance.useEffect": (container)=>{
                    const inputs = container.querySelectorAll(inputSelector);
                    inputs.forEach({
                        "useAutoKeyboardAvoidance.useEffect": (input)=>{
                            const handler = {
                                "useAutoKeyboardAvoidance.useEffect.handler": ()=>handleInputFocus(input)
                            }["useAutoKeyboardAvoidance.useEffect.handler"];
                            input.addEventListener('focus', handler);
                            allHandlers.push({
                                input,
                                handler
                            });
                        }
                    }["useAutoKeyboardAvoidance.useEffect"]);
                }
            }["useAutoKeyboardAvoidance.useEffect"]);
            return ({
                "useAutoKeyboardAvoidance.useEffect": ()=>{
                    allHandlers.forEach({
                        "useAutoKeyboardAvoidance.useEffect": ({ input, handler })=>{
                            input.removeEventListener('focus', handler);
                        }
                    }["useAutoKeyboardAvoidance.useEffect"]);
                }
            })["useAutoKeyboardAvoidance.useEffect"];
        }
    }["useAutoKeyboardAvoidance.useEffect"], [
        containerSelector,
        inputSelector,
        restOptions.enabled,
        restOptions.mobileBreakpoint,
        restOptions.scrollBehavior,
        restOptions.block,
        restOptions.delay
    ]);
};
_s1(useAutoKeyboardAvoidance, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/HomieBites/web-admin/app/admin/dashboard/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminDashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$AdminDashboard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/AdminDashboard.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$contexts$2f$NotificationContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/contexts/NotificationContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$NotificationWrapper$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/NotificationWrapper.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/ErrorBoundary.jsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
function AdminDashboardPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$contexts$2f$NotificationContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationProvider"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$AdminDashboard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onLogout: ()=>window.location.href = '/admin'
                }, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/app/admin/dashboard/page.jsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$NotificationWrapper$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/Documents/HomieBites/web-admin/app/admin/dashboard/page.jsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/HomieBites/web-admin/app/admin/dashboard/page.jsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/HomieBites/web-admin/app/admin/dashboard/page.jsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = AdminDashboardPage;
var _c;
__turbopack_context__.k.register(_c, "AdminDashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_4f25b3a7._.js.map