(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/components/PremiumLoader.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
/**
 * Enterprise Loader Component
 * Features:
 * - Animated logo with blur/glow effect
 * - Clean, professional design
 * - Responsive design
 */ const PremiumLoader = ({ message = 'Loading...', size = 'large', showText = true })=>{
    const sizeClasses = {
        small: {
            container: '64px',
            logo: '48px',
            text: '0.85rem'
        },
        medium: {
            container: '80px',
            logo: '60px',
            text: '0.9rem'
        },
        large: {
            container: '100px',
            logo: '75px',
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
                                width: dimensions.logo,
                                height: dimensions.logo,
                                maxWidth: dimensions.logo,
                                maxHeight: dimensions.logo
                            },
                            onError: (e)=>{
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/PremiumLoader.jsx",
                            lineNumber: 30,
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
                            fileName: "[project]/Documents/HomieBites/web-admin/components/PremiumLoader.jsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/PremiumLoader.jsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/PremiumLoader.jsx",
                lineNumber: 27,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            showText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "premium-loader-text",
                style: {
                    fontSize: dimensions.text
                },
                children: message
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/PremiumLoader.jsx",
                lineNumber: 64,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/PremiumLoader.jsx",
        lineNumber: 26,
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
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_components_PremiumLoader_jsx_7d088bde._.js.map