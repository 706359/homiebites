(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$hooks$2f$useKeyboardAvoidance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/hooks/useKeyboardAvoidance.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const SettingsTab = ({ settings, onUpdateSettings, onBackup, onRestore, onClearAllData, showNotification, loading = false, showConfirmation })=>{
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('general'); // 'general', 'orders', 'notifications', 'data', 'profile', 'theme'
    // Enable keyboard avoidance for mobile
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$hooks$2f$useKeyboardAvoidance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoKeyboardAvoidance"])({
        containerSelector: '.settings-tab-content',
        inputSelector: 'input, textarea, select'
    });
    // Form states
    const [businessInfo, setBusinessInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        businessName: settings?.businessName || 'HomieBites',
        contact: settings?.contact || '',
        email: settings?.email || '',
        address: settings?.address || ''
    });
    const [pricing, setPricing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        defaultUnitPrice: settings?.defaultUnitPrice || 100,
        lunchPrice: settings?.lunchPrice || 100,
        dinnerPrice: settings?.dinnerPrice || 100,
        minimumOrderQty: settings?.minimumOrderQty || 1
    });
    const [orderSettings, setOrderSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        orderIdPrefix: settings?.orderIdPrefix || 'HB-',
        autoGenerateOrderId: settings?.autoGenerateOrderId !== false,
        allowDuplicateAddress: settings?.allowDuplicateAddress !== false,
        requirePaymentConfirmation: settings?.requirePaymentConfirmation || false,
        statusOptions: settings?.statusOptions || [
            'Paid',
            'Pending',
            'Cancelled'
        ]
    });
    const [notificationPrefs, setNotificationPrefs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        emailDailySummary: settings?.emailDailySummary !== false,
        emailNewOrderAlert: settings?.emailNewOrderAlert !== false,
        emailPaymentReceived: settings?.emailPaymentReceived !== false,
        emailLowOrderDayWarning: settings?.emailLowOrderDayWarning || false,
        smsPaymentReminders: settings?.smsPaymentReminders !== false,
        smsOrderConfirmations: settings?.smsOrderConfirmations || false
    });
    const [dataSettings, setDataSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        autoBackup: settings?.autoBackup !== false,
        autoBackupTime: settings?.autoBackupTime || '02:00'
    });
    const [userProfile, setUserProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: settings?.userName || 'Admin Name',
        email: settings?.userEmail || 'admin@example.com',
        phone: settings?.userPhone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [themeSettings, setThemeSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        theme: settings?.theme || localStorage.getItem('homiebites_theme') || 'light',
        primaryColor: settings?.primaryColor || localStorage.getItem('homiebites_primary_color') || '#449031',
        secondaryColor: settings?.secondaryColor || localStorage.getItem('homiebites_secondary_color') || '#c45c2d',
        fontSize: settings?.fontSize || localStorage.getItem('homiebites_font_size') || 'medium',
        fontFamily: settings?.fontFamily || localStorage.getItem('homiebites_font_family') || 'Baloo 2'
    });
    // showClearDataModal removed - using showConfirmation from parent
    // Helper function to convert hex to RGB
    const hexToRgb = (hex)=>{
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    // Apply theme function - SCOPED TO ADMIN DASHBOARD ONLY
    const applyTheme = (theme)=>{
        try {
            const adminDashboard = document.querySelector('.admin-dashboard');
            if (!adminDashboard) {
                return;
            }
            // Apply primary color - scoped to admin-dashboard
            if (theme && theme.primaryColor) {
                adminDashboard.style.setProperty('--admin-accent', theme.primaryColor);
                // Calculate light variant
                const rgb = hexToRgb(theme.primaryColor);
                if (rgb) {
                    adminDashboard.style.setProperty('--admin-accent-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
                }
            }
            // Apply secondary color (for logo theme) - scoped to admin-dashboard
            if (theme && theme.secondaryColor) {
                adminDashboard.style.setProperty('--admin-secondary', theme.secondaryColor);
                // Calculate light variant
                const rgb = hexToRgb(theme.secondaryColor);
                if (rgb) {
                    adminDashboard.style.setProperty('--admin-secondary-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
                }
            }
            // Apply font size - SCOPED TO ADMIN DASHBOARD ONLY
            if (theme && theme.fontSize) {
                const fontSizeMap = {
                    small: '14px',
                    medium: '16px',
                    large: '18px',
                    'extra-large': '20px'
                };
                const fontSize = fontSizeMap[theme.fontSize] || '16px';
                // Set CSS variable on admin-dashboard element
                adminDashboard.style.setProperty('--admin-base-font-size', fontSize);
                // Apply font size to admin-dashboard
                adminDashboard.style.fontSize = fontSize;
            }
            // Apply font family - SCOPED TO ADMIN DASHBOARD ONLY
            if (theme && theme.fontFamily) {
                const fontFamily = `'${theme.fontFamily}', sans-serif`;
                adminDashboard.style.setProperty('--admin-font-family', fontFamily);
                adminDashboard.style.fontFamily = fontFamily;
            }
            // Apply theme (light/dark/auto) - SCOPED TO ADMIN DASHBOARD ONLY
            if (theme && theme.theme === 'dark') {
                adminDashboard.classList.add('dark-theme');
                adminDashboard.classList.remove('light-theme');
            } else if (theme && theme.theme === 'light') {
                adminDashboard.classList.add('light-theme');
                adminDashboard.classList.remove('dark-theme');
            } else if (theme && theme.theme === 'auto') {
                // Auto theme based on system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    adminDashboard.classList.add('dark-theme');
                    adminDashboard.classList.remove('light-theme');
                } else {
                    adminDashboard.classList.add('light-theme');
                    adminDashboard.classList.remove('dark-theme');
                }
            }
        } catch (error) {
            console.error('Error applying theme:', error);
        }
    };
    // Apply theme on mount and handle auto theme listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsTab.useEffect": ()=>{
            // Wait for admin-dashboard to be available
            const applyThemeWhenReady = {
                "SettingsTab.useEffect.applyThemeWhenReady": ()=>{
                    const adminDashboard = document.querySelector('.admin-dashboard');
                    if (adminDashboard && themeSettings) {
                        applyTheme(themeSettings);
                    } else if (!adminDashboard) {
                        // Retry after a short delay if element not found
                        setTimeout(applyThemeWhenReady, 100);
                    }
                }
            }["SettingsTab.useEffect.applyThemeWhenReady"];
            applyThemeWhenReady();
            // Set up auto theme listener if needed
            if (themeSettings?.theme === 'auto') {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handleChange = {
                    "SettingsTab.useEffect.handleChange": (e)=>{
                        const adminDashboard = document.querySelector('.admin-dashboard');
                        if (adminDashboard) {
                            if (e.matches) {
                                adminDashboard.classList.add('dark-theme');
                                adminDashboard.classList.remove('light-theme');
                            } else {
                                adminDashboard.classList.add('light-theme');
                                adminDashboard.classList.remove('dark-theme');
                            }
                        }
                    }
                }["SettingsTab.useEffect.handleChange"];
                mediaQuery.addEventListener('change', handleChange);
                return ({
                    "SettingsTab.useEffect": ()=>mediaQuery.removeEventListener('change', handleChange)
                })["SettingsTab.useEffect"];
            }
        }
    }["SettingsTab.useEffect"], [
        themeSettings
    ]); // Added themeSettings as dependency
    // Handle save functions
    const handleSaveBusinessInfo = ()=>{
        if (showConfirmation) {
            showConfirmation({
                title: 'Save Business Information',
                message: 'Are you sure you want to save changes to business information?',
                type: 'info',
                confirmText: 'Save',
                onConfirm: ()=>{
                    if (onUpdateSettings) {
                        onUpdateSettings({
                            businessInfo
                        });
                    }
                }
            });
        } else {
            if (onUpdateSettings) {
                onUpdateSettings({
                    businessInfo
                });
            }
        }
    };
    const handleSavePricing = ()=>{
        if (showConfirmation) {
            showConfirmation({
                title: 'Save Pricing Configuration',
                message: 'Are you sure you want to save changes to pricing settings?',
                type: 'info',
                confirmText: 'Save',
                onConfirm: ()=>{
                    if (onUpdateSettings) {
                        onUpdateSettings({
                            pricing
                        });
                    }
                }
            });
        } else {
            if (onUpdateSettings) {
                onUpdateSettings({
                    pricing
                });
            }
        }
    };
    const handleSaveOrderSettings = ()=>{
        if (showConfirmation) {
            showConfirmation({
                title: 'Save Order Settings',
                message: 'Are you sure you want to save changes to order settings?',
                type: 'info',
                confirmText: 'Save',
                onConfirm: ()=>{
                    if (onUpdateSettings) {
                        onUpdateSettings({
                            orderSettings
                        });
                    }
                }
            });
        } else {
            if (onUpdateSettings) {
                onUpdateSettings({
                    orderSettings
                });
            }
        }
    };
    const handleSaveNotificationPrefs = ()=>{
        if (showConfirmation) {
            showConfirmation({
                title: 'Save Notification Preferences',
                message: 'Are you sure you want to save changes to notification preferences?',
                type: 'info',
                confirmText: 'Save',
                onConfirm: ()=>{
                    if (onUpdateSettings) {
                        onUpdateSettings({
                            notificationPrefs
                        });
                    }
                }
            });
        } else {
            if (onUpdateSettings) {
                onUpdateSettings({
                    notificationPrefs
                });
            }
        }
    };
    const handleSaveDataSettings = ()=>{
        if (showConfirmation) {
            showConfirmation({
                title: 'Save Data Settings',
                message: 'Are you sure you want to save changes to data settings?',
                type: 'info',
                confirmText: 'Save',
                onConfirm: ()=>{
                    if (onUpdateSettings) {
                        onUpdateSettings({
                            dataSettings
                        });
                    }
                }
            });
        } else {
            if (onUpdateSettings) {
                onUpdateSettings({
                    dataSettings
                });
            }
        }
    };
    const handleSaveUserProfile = ()=>{
        if (userProfile.newPassword && userProfile.newPassword !== userProfile.confirmPassword) {
            if (showNotification) showNotification('Passwords do not match', 'error');
            return;
        }
        if (showConfirmation) {
            showConfirmation({
                title: 'Update Profile',
                message: 'Are you sure you want to save changes to your profile?',
                type: 'info',
                confirmText: 'Save',
                onConfirm: ()=>{
                    if (onUpdateSettings) {
                        onUpdateSettings({
                            userProfile
                        });
                    }
                }
            });
        } else {
            if (onUpdateSettings) {
                onUpdateSettings({
                    userProfile
                });
            }
        }
    };
    const handleSaveTheme = ()=>{
        if (showConfirmation) {
            showConfirmation({
                title: 'Apply Theme',
                message: 'Are you sure you want to apply this theme? The changes will be saved immediately.',
                type: 'info',
                confirmText: 'Apply',
                onConfirm: ()=>{
                    // Apply theme immediately
                    applyTheme(themeSettings);
                    // Save to localStorage
                    localStorage.setItem('homiebites_theme', themeSettings.theme);
                    localStorage.setItem('homiebites_primary_color', themeSettings.primaryColor);
                    if (themeSettings.secondaryColor) {
                        localStorage.setItem('homiebites_secondary_color', themeSettings.secondaryColor);
                    }
                    localStorage.setItem('homiebites_font_size', themeSettings.fontSize);
                    localStorage.setItem('homiebites_font_family', themeSettings.fontFamily);
                    // Auto-fix any theme issues after saving
                    setTimeout(()=>{
                        __turbopack_context__.A("[project]/Documents/HomieBites/web-admin/components/admin/utils/themeFixer.js [app-client] (ecmascript, async loader)").then(({ fixTheme })=>{
                            fixTheme({
                                silent: true
                            });
                        });
                    }, 100);
                    // Save to settings via callback
                    if (onUpdateSettings) {
                        onUpdateSettings({
                            themeSettings
                        });
                    }
                }
            });
        } else {
            // Apply theme immediately
            applyTheme(themeSettings);
            // Save to localStorage
            localStorage.setItem('homiebites_theme', themeSettings.theme);
            localStorage.setItem('homiebites_primary_color', themeSettings.primaryColor);
            localStorage.setItem('homiebites_font_size', themeSettings.fontSize);
            localStorage.setItem('homiebites_font_family', themeSettings.fontFamily);
            // Auto-fix any theme issues after saving
            setTimeout(()=>{
                __turbopack_context__.A("[project]/Documents/HomieBites/web-admin/components/admin/utils/themeFixer.js [app-client] (ecmascript, async loader)").then(({ fixTheme })=>{
                    fixTheme({
                        silent: true
                    });
                });
            }, 100);
            // Save to settings via callback
            if (onUpdateSettings) {
                onUpdateSettings({
                    themeSettings
                });
            }
        }
    };
    // Apply theme when settings change (for preview)
    const handleLogoTheme = ()=>{
        // Apply logo theme colors: Green #449031 and Orange #c45c2d
        const logoTheme = {
            primaryColor: '#449031',
            secondaryColor: '#c45c2d'
        };
        setThemeSettings({
            ...themeSettings,
            ...logoTheme
        });
        handleThemeChange(logoTheme);
        // Show notification
        if (showNotification) {
            showNotification('Logo theme applied! Click "Apply Theme" to save.', 'success');
        }
    };
    const handleThemeChange = (updates)=>{
        const newTheme = {
            ...themeSettings,
            ...updates
        };
        setThemeSettings(newTheme);
        // Apply immediately for preview - with retry mechanism
        const applyWithRetry = ()=>{
            const adminDashboard = document.querySelector('.admin-dashboard');
            if (adminDashboard) {
                applyTheme(newTheme);
            } else {
                setTimeout(applyWithRetry, 50);
            }
        };
        applyWithRetry();
    };
    // Handle backup
    const handleBackup = async ()=>{
        if (showConfirmation) {
            showConfirmation({
                title: 'Create Backup',
                message: 'Are you sure you want to create a backup of all data?',
                type: 'info',
                confirmText: 'Create Backup',
                onConfirm: async ()=>{
                    if (onBackup) {
                        await onBackup();
                        if (showNotification) showNotification('Backup created successfully', 'success');
                    }
                }
            });
        } else {
            if (onBackup) {
                await onBackup();
                if (showNotification) showNotification('Backup created successfully', 'success');
            }
        }
    };
    // Handle restore
    const handleRestore = async ()=>{
        if (showConfirmation) {
            showConfirmation({
                title: 'Restore Data',
                message: 'Are you sure you want to restore data from backup? This will overwrite current data.',
                type: 'warning',
                confirmText: 'Restore',
                onConfirm: async ()=>{
                    if (onRestore) {
                        await onRestore();
                        if (showNotification) showNotification('Data restored successfully', 'success');
                    }
                }
            });
        } else {
            if (onRestore) {
                await onRestore();
                if (showNotification) showNotification('Data restored successfully', 'success');
            }
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: "Loading settings...",
                size: "large"
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                lineNumber: 474,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
            lineNumber: 473,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "settings-tab-nav",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `settings-tab-item ${activeTab === 'general' ? 'active' : ''}`,
                        onClick: ()=>setActiveTab('general'),
                        children: "General"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 483,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `settings-tab-item ${activeTab === 'orders' ? 'active' : ''}`,
                        onClick: ()=>setActiveTab('orders'),
                        children: "Order Settings"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 489,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `settings-tab-item ${activeTab === 'notifications' ? 'active' : ''}`,
                        onClick: ()=>setActiveTab('notifications'),
                        children: "Notifications"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 495,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `settings-tab-item ${activeTab === 'data' ? 'active' : ''}`,
                        onClick: ()=>setActiveTab('data'),
                        children: "Data Management"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 501,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `settings-tab-item ${activeTab === 'profile' ? 'active' : ''}`,
                        onClick: ()=>setActiveTab('profile'),
                        children: "User Profile"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 507,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `settings-tab-item ${activeTab === 'theme' ? 'active' : ''}`,
                        onClick: ()=>setActiveTab('theme'),
                        children: "Theme Settings"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 513,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                lineNumber: 482,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "settings-tab-content",
                children: [
                    activeTab === 'general' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-grid-layout settings-general-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-grid-item settings-card",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "dashboard-card settings-card-content",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "settings-card-header",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "settings-card-icon",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fa-solid fa-building"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 530,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 529,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "dashboard-section-title",
                                                    children: "Business Information"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 532,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 528,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Business Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 536,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "input-field",
                                                            value: businessInfo.businessName,
                                                            onChange: (e)=>setBusinessInfo({
                                                                    ...businessInfo,
                                                                    businessName: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 537,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 535,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Contact"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 547,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "tel",
                                                            className: "input-field",
                                                            value: businessInfo.contact,
                                                            onChange: (e)=>setBusinessInfo({
                                                                    ...businessInfo,
                                                                    contact: e.target.value
                                                                }),
                                                            placeholder: "+91"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 548,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 546,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Email"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 559,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            className: "input-field",
                                                            value: businessInfo.email,
                                                            onChange: (e)=>setBusinessInfo({
                                                                    ...businessInfo,
                                                                    email: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 560,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 558,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Address"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 568,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            className: "input-field",
                                                            value: businessInfo.address,
                                                            onChange: (e)=>setBusinessInfo({
                                                                    ...businessInfo,
                                                                    address: e.target.value
                                                                }),
                                                            rows: 3
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 569,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 567,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group settings-action-group",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn btn-primary",
                                                        onClick: handleSaveBusinessInfo,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-save"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 580,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " Save Changes"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 579,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 578,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 534,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                    lineNumber: 527,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 526,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "dashboard-grid-item settings-card",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "dashboard-card settings-card-content",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "settings-card-header",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "settings-card-icon",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fa-solid fa-indian-rupee-sign"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 592,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 591,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "dashboard-section-title",
                                                    children: "Pricing Configuration"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 594,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 590,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Default Unit Price"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 598,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input-field",
                                                            value: pricing.defaultUnitPrice,
                                                            onChange: (e)=>setPricing({
                                                                    ...pricing,
                                                                    defaultUnitPrice: parseFloat(e.target.value) || 0
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 599,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 597,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Lunch Price"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 612,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input-field",
                                                            value: pricing.lunchPrice,
                                                            onChange: (e)=>setPricing({
                                                                    ...pricing,
                                                                    lunchPrice: parseFloat(e.target.value) || 0
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 613,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 611,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Dinner Price"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 623,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input-field",
                                                            value: pricing.dinnerPrice,
                                                            onChange: (e)=>setPricing({
                                                                    ...pricing,
                                                                    dinnerPrice: parseFloat(e.target.value) || 0
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 624,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 622,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Minimum Order Qty"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 634,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "input-field",
                                                            value: pricing.minimumOrderQty,
                                                            onChange: (e)=>setPricing({
                                                                    ...pricing,
                                                                    minimumOrderQty: parseInt(e.target.value) || 1
                                                                }),
                                                            min: 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 635,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 633,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group settings-action-group",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn btn-primary",
                                                        onClick: handleSavePricing,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-save"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 647,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " Update Pricing"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 646,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 645,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 596,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                    lineNumber: 589,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 588,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 524,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'orders' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "dashboard-section-title",
                                children: "Order Configuration"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 658,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Order ID Prefix"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 661,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: orderSettings.orderIdPrefix,
                                                onChange: (e)=>setOrderSettings({
                                                        ...orderSettings,
                                                        orderIdPrefix: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 662,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 660,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: orderSettings.autoGenerateOrderId,
                                                    onChange: (e)=>setOrderSettings({
                                                            ...orderSettings,
                                                            autoGenerateOrderId: e.target.checked
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 675,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Auto-generate Order ID"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 682,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 672,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 671,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: orderSettings.allowDuplicateAddress,
                                                    onChange: (e)=>setOrderSettings({
                                                            ...orderSettings,
                                                            allowDuplicateAddress: e.target.checked
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 689,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Allow Duplicate Address"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 699,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 686,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 685,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: orderSettings.requirePaymentConfirmation,
                                                    onChange: (e)=>setOrderSettings({
                                                            ...orderSettings,
                                                            requirePaymentConfirmation: e.target.checked
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 706,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Require Payment Confirmation"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 716,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 703,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 702,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Status Options"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 720,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px',
                                                    marginTop: '8px'
                                                },
                                                children: [
                                                    orderSettings.statusOptions.map((status, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "• ",
                                                                    status
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 726,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, idx, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 725,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn btn-ghost btn-small",
                                                        style: {
                                                            alignSelf: 'flex-start'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-plus"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 730,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " Add Status"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 729,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 721,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 719,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group settings-action-group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-primary",
                                            onClick: handleSaveOrderSettings,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-save"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 736,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Save Settings"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 735,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 734,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 659,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 657,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'notifications' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "dashboard-section-title",
                                children: "Notification Preferences"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 745,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                children: "Email Notifications:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 748,
                                                columnNumber: 17
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
                                                                checked: notificationPrefs.emailDailySummary,
                                                                onChange: (e)=>setNotificationPrefs({
                                                                        ...notificationPrefs,
                                                                        emailDailySummary: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 755,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Daily Summary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 765,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 752,
                                                        columnNumber: 19
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
                                                                checked: notificationPrefs.emailNewOrderAlert,
                                                                onChange: (e)=>setNotificationPrefs({
                                                                        ...notificationPrefs,
                                                                        emailNewOrderAlert: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 770,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "New Order Alert"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 780,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 767,
                                                        columnNumber: 19
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
                                                                checked: notificationPrefs.emailPaymentReceived,
                                                                onChange: (e)=>setNotificationPrefs({
                                                                        ...notificationPrefs,
                                                                        emailPaymentReceived: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 785,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Payment Received"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 795,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 782,
                                                        columnNumber: 19
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
                                                                checked: notificationPrefs.emailLowOrderDayWarning,
                                                                onChange: (e)=>setNotificationPrefs({
                                                                        ...notificationPrefs,
                                                                        emailLowOrderDayWarning: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 800,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Low Order Day Warning"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 810,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 797,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 751,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 747,
                                        columnNumber: 15
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
                                                children: "SMS Notifications:"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 815,
                                                columnNumber: 17
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
                                                                checked: notificationPrefs.smsPaymentReminders,
                                                                onChange: (e)=>setNotificationPrefs({
                                                                        ...notificationPrefs,
                                                                        smsPaymentReminders: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 822,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Payment Reminders"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 832,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 819,
                                                        columnNumber: 19
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
                                                                checked: notificationPrefs.smsOrderConfirmations,
                                                                onChange: (e)=>setNotificationPrefs({
                                                                        ...notificationPrefs,
                                                                        smsOrderConfirmations: e.target.checked
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 837,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Order Confirmations"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 847,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 834,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 818,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 814,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group settings-action-group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-primary",
                                            onClick: handleSaveNotificationPrefs,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-save"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 853,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Save Preferences"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 852,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 851,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 746,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 744,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'data' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "dashboard-section-title",
                                children: "Backup & Restore"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 862,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Last Backup"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 865,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: 'var(--admin-text-secondary)',
                                                    marginTop: '8px'
                                                },
                                                children: settings?.lastBackup || '15-Jan-2025 09:30 AM'
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 866,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 864,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "action-buttons-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn btn-primary",
                                                    onClick: handleBackup,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fa-solid fa-save"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 873,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        " Backup Now"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 872,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn btn-secondary",
                                                    onClick: ()=>{},
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fa-solid fa-download"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 876,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        " Download Backup"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 875,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn btn-secondary",
                                                    onClick: handleRestore,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fa-solid fa-rotate"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 879,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        " Restore from Backup"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 878,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 871,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 870,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: dataSettings.autoBackup,
                                                    onChange: (e)=>setDataSettings({
                                                            ...dataSettings,
                                                            autoBackup: e.target.checked
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 887,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Enable Auto Backup"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 894,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 884,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 883,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    dataSettings.autoBackup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Auto Backup Time"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 899,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "time",
                                                className: "input-field",
                                                value: dataSettings.autoBackupTime,
                                                onChange: (e)=>setDataSettings({
                                                        ...dataSettings,
                                                        autoBackupTime: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 900,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: 'var(--admin-text-secondary)',
                                                    fontSize: '0.85rem',
                                                    marginTop: '4px'
                                                },
                                                children: "Daily backup will run at this time"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 908,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 898,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    dataSettings.autoBackup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group settings-action-group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-primary",
                                            onClick: handleSaveDataSettings,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-save"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 922,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Save Data Settings"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 921,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 920,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginTop: '32px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    color: 'var(--admin-danger)',
                                                    marginBottom: '16px'
                                                },
                                                children: "⚠️ Danger Zone"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 927,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn btn-special danger",
                                                onClick: ()=>{
                                                    if (showConfirmation && onClearAllData) {
                                                        showConfirmation({
                                                            title: 'Clear All Data',
                                                            message: 'Are you sure you want to clear ALL data? This action cannot be undone and will permanently delete all orders and settings.',
                                                            type: 'danger',
                                                            confirmText: 'Clear All Data',
                                                            onConfirm: async ()=>{
                                                                await onClearAllData();
                                                                if (showNotification) showNotification('All data cleared', 'success');
                                                            }
                                                        });
                                                    } else if (onClearAllData) {
                                                        onClearAllData();
                                                    }
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fa-solid fa-trash"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 950,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Clear All Data"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 930,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: 'var(--admin-text-light)',
                                                    fontSize: '0.85rem',
                                                    marginTop: '8px'
                                                },
                                                children: "This action cannot be undone"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 952,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 926,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 863,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 861,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'profile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "dashboard-section-title",
                                children: "Your Profile"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 968,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Name"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 971,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: userProfile.name,
                                                onChange: (e)=>setUserProfile({
                                                        ...userProfile,
                                                        name: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 972,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 970,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Email"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 980,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                className: "input-field",
                                                value: userProfile.email,
                                                onChange: (e)=>setUserProfile({
                                                        ...userProfile,
                                                        email: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 981,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 979,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Phone"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 989,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "tel",
                                                className: "input-field",
                                                value: userProfile.phone,
                                                onChange: (e)=>setUserProfile({
                                                        ...userProfile,
                                                        phone: e.target.value
                                                    }),
                                                placeholder: "+91"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 990,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 988,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginTop: '24px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            style: {
                                                marginBottom: '16px'
                                            },
                                            children: "Change Password"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 999,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 998,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Current Password"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1002,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "password",
                                                className: "input-field",
                                                value: userProfile.currentPassword,
                                                onChange: (e)=>setUserProfile({
                                                        ...userProfile,
                                                        currentPassword: e.target.value
                                                    }),
                                                placeholder: "********"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1003,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1001,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "New Password"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1014,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "password",
                                                className: "input-field",
                                                value: userProfile.newPassword,
                                                onChange: (e)=>setUserProfile({
                                                        ...userProfile,
                                                        newPassword: e.target.value
                                                    }),
                                                placeholder: "********"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1015,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1013,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Confirm Password"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1024,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "password",
                                                className: "input-field",
                                                value: userProfile.confirmPassword,
                                                onChange: (e)=>setUserProfile({
                                                        ...userProfile,
                                                        confirmPassword: e.target.value
                                                    }),
                                                placeholder: "********"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1025,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1023,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group settings-action-group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-primary",
                                            onClick: handleSaveUserProfile,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-save"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 1037,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Update Profile"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 1036,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1035,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 969,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 967,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'theme' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-card settings-theme-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "settings-card-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "settings-card-icon",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-palette"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 1048,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1047,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "dashboard-section-title",
                                        children: "Appearance"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1050,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 1046,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid settings-theme-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Theme (Light / Dark / Auto)"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1054,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "theme-options-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `theme-option ${themeSettings.theme === 'light' ? 'active' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "radio",
                                                                name: "theme",
                                                                value: "light",
                                                                checked: themeSettings.theme === 'light',
                                                                onChange: (e)=>handleThemeChange({
                                                                        theme: e.target.value
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1059,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-sun"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1066,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Light"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1067,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1056,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `theme-option ${themeSettings.theme === 'dark' ? 'active' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "radio",
                                                                name: "theme",
                                                                value: "dark",
                                                                checked: themeSettings.theme === 'dark',
                                                                onChange: (e)=>handleThemeChange({
                                                                        theme: e.target.value
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1072,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-moon"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1079,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Dark"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1080,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1069,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: `theme-option ${themeSettings.theme === 'auto' ? 'active' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "radio",
                                                                name: "theme",
                                                                value: "auto",
                                                                checked: themeSettings.theme === 'auto',
                                                                onChange: (e)=>handleThemeChange({
                                                                        theme: e.target.value
                                                                    })
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1085,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-circle-half-stroke"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1092,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Auto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1093,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1082,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1055,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1053,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Color Theme"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1098,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginBottom: '12px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `btn btn-secondary`,
                                                        onClick: handleLogoTheme,
                                                        style: {
                                                            width: '100%',
                                                            background: 'linear-gradient(135deg, #449031 0%, #449031 50%, #c45c2d 50%, #c45c2d 100%)',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '10px 16px',
                                                            borderRadius: '8px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '8px',
                                                            boxShadow: themeSettings.primaryColor === '#449031' && themeSettings.secondaryColor === '#c45c2d' ? '0 0 0 3px rgba(68, 144, 49, 0.3)' : 'none'
                                                        },
                                                        onMouseEnter: (e)=>{
                                                            e.currentTarget.style.transform = 'scale(1.02)';
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(68, 144, 49, 0.3)';
                                                        },
                                                        onMouseLeave: (e)=>{
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = themeSettings.primaryColor === '#449031' && themeSettings.secondaryColor === '#c45c2d' ? '0 0 0 3px rgba(68, 144, 49, 0.3)' : 'none';
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-image"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1132,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Apply Logo Theme"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1133,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            themeSettings.primaryColor === '#449031' && themeSettings.secondaryColor === '#c45c2d' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fa-solid fa-check",
                                                                style: {
                                                                    marginLeft: '4px'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                                lineNumber: 1135,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1100,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            fontSize: '12px',
                                                            color: 'var(--admin-text-secondary, #6b7280)',
                                                            marginTop: '8px',
                                                            textAlign: 'center'
                                                        },
                                                        children: "Uses exact logo colors: Green (#449031) & Orange (#c45c2d)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1138,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1099,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginTop: '16px',
                                                    display: 'block'
                                                },
                                                children: "Primary Color"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1147,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "color-picker-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "color",
                                                        value: themeSettings.primaryColor,
                                                        onChange: (e)=>handleThemeChange({
                                                                primaryColor: e.target.value
                                                            }),
                                                        className: "color-picker-input"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1149,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        className: "input-field color-input",
                                                        value: themeSettings.primaryColor,
                                                        onChange: (e)=>{
                                                            const color = e.target.value;
                                                            if (/^#[0-9A-F]{6}$/i.test(color)) {
                                                                handleThemeChange({
                                                                    primaryColor: color
                                                                });
                                                            } else {
                                                                setThemeSettings({
                                                                    ...themeSettings,
                                                                    primaryColor: color
                                                                });
                                                            }
                                                        },
                                                        placeholder: "#449031"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1155,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1148,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginBottom: '12px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: `btn btn-secondary`,
                                                    onClick: handleLogoTheme,
                                                    style: {
                                                        width: '100%',
                                                        background: 'linear-gradient(135deg, #449031 0%, #449031 50%, #c45c2d 50%, #c45c2d 100%)',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '10px 16px',
                                                        borderRadius: '8px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px'
                                                    },
                                                    onMouseEnter: (e)=>{
                                                        e.currentTarget.style.transform = 'scale(1.02)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(68, 144, 49, 0.3)';
                                                    },
                                                    onMouseLeave: (e)=>{
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fa-solid fa-image"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 1198,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Apply Logo Theme"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                            lineNumber: 1199,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 1171,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1170,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "color-presets",
                                                children: [
                                                    '#449031',
                                                    '#c45c2d',
                                                    '#3b82f6',
                                                    '#8b5cf6',
                                                    '#ef4444',
                                                    '#10b981'
                                                ].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `color-preset ${themeSettings.primaryColor === color ? 'active' : ''}`,
                                                        onClick: ()=>handleThemeChange({
                                                                primaryColor: color
                                                            }),
                                                        style: {
                                                            background: color
                                                        },
                                                        title: color
                                                    }, color, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1205,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1202,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1097,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Font Size"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1217,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "input-field",
                                                value: themeSettings.fontSize,
                                                onChange: (e)=>{
                                                    const newFontSize = e.target.value;
                                                    handleThemeChange({
                                                        fontSize: newFontSize
                                                    });
                                                    // Apply font size immediately - SCOPED TO ADMIN DASHBOARD
                                                    const applyFontSize = ()=>{
                                                        const adminDashboard = document.querySelector('.admin-dashboard');
                                                        if (adminDashboard) {
                                                            const fontSizeMap = {
                                                                small: '14px',
                                                                medium: '16px',
                                                                large: '18px',
                                                                'extra-large': '20px'
                                                            };
                                                            const fontSize = fontSizeMap[newFontSize] || '16px';
                                                            adminDashboard.style.setProperty('--admin-base-font-size', fontSize);
                                                            adminDashboard.style.fontSize = fontSize;
                                                            // Force reflow to ensure changes apply
                                                            adminDashboard.offsetHeight;
                                                        } else {
                                                            setTimeout(applyFontSize, 50);
                                                        }
                                                    };
                                                    applyFontSize();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "small",
                                                        children: "Small (14px)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1246,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "medium",
                                                        children: "Medium (16px)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1247,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "large",
                                                        children: "Large (18px)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1248,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "extra-large",
                                                        children: "Extra Large (20px)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1249,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1218,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "preview-box",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: themeSettings.fontSize === 'small' ? '14px' : themeSettings.fontSize === 'large' ? '18px' : themeSettings.fontSize === 'extra-large' ? '20px' : '16px',
                                                        margin: 0
                                                    },
                                                    children: [
                                                        "Preview: This is how text will look with ",
                                                        themeSettings.fontSize,
                                                        " font size."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 1252,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1251,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1216,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Font Family"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1270,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "input-field",
                                                value: themeSettings.fontFamily,
                                                onChange: (e)=>{
                                                    const newFontFamily = e.target.value;
                                                    handleThemeChange({
                                                        fontFamily: newFontFamily
                                                    });
                                                    // Apply font family immediately - SCOPED TO ADMIN DASHBOARD
                                                    const applyFontFamily = ()=>{
                                                        const adminDashboard = document.querySelector('.admin-dashboard');
                                                        if (adminDashboard) {
                                                            const fontFamily = `'${newFontFamily}', sans-serif`;
                                                            adminDashboard.style.setProperty('--admin-font-family', fontFamily);
                                                            adminDashboard.style.fontFamily = fontFamily;
                                                            // Force reflow to ensure changes apply
                                                            adminDashboard.offsetHeight;
                                                        } else {
                                                            setTimeout(applyFontFamily, 50);
                                                        }
                                                    };
                                                    applyFontFamily();
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Baloo 2",
                                                        children: "Baloo 2 (Default)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1293,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Inter",
                                                        children: "Inter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1294,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Poppins",
                                                        children: "Poppins"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1295,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Roboto",
                                                        children: "Roboto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1296,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Open Sans",
                                                        children: "Open Sans"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1297,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Lato",
                                                        children: "Lato"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1298,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Montserrat",
                                                        children: "Montserrat"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1299,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Nunito",
                                                        children: "Nunito"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1300,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Raleway",
                                                        children: "Raleway"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1301,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Ubuntu",
                                                        children: "Ubuntu"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1302,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Al Bayan",
                                                        children: "Al Bayan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1303,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Chalkboard",
                                                        children: "Chalkboard"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1304,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Cavolini",
                                                        children: "Cavolini"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                        lineNumber: 1305,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1271,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "preview-box",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontFamily: `'${themeSettings.fontFamily}', sans-serif`,
                                                        margin: 0
                                                    },
                                                    children: [
                                                        "Preview: This is how text will look with ",
                                                        themeSettings.fontFamily,
                                                        " font."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 1308,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                lineNumber: 1307,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1269,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group settings-action-group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-primary",
                                            onClick: handleSaveTheme,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-save"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                                    lineNumber: 1320,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Apply Theme"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                            lineNumber: 1319,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                        lineNumber: 1318,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                                lineNumber: 1052,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                        lineNumber: 1045,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
                lineNumber: 522,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/SettingsTab.jsx",
        lineNumber: 480,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SettingsTab, "LqXybb3ZDt+F9jMXtn8vNWtRDq0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$hooks$2f$useKeyboardAvoidance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoKeyboardAvoidance"]
    ];
});
_c = SettingsTab;
const __TURBOPACK__default__export__ = SettingsTab;
var _c;
__turbopack_context__.k.register(_c, "SettingsTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_components_admin_SettingsTab_jsx_58185a92._.js.map