(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/lib/api-admin.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$ConfirmationModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/ConfirmationModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/PremiumLoader.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/components/admin/utils/orderUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$hooks$2f$useKeyboardAvoidance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HomieBites/web-admin/hooks/useKeyboardAvoidance.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const MenuPriceTab = ({ settings, showNotification, showConfirmation, loading = false })=>{
    _s();
    const [menuItems, setMenuItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [originalCategories, setOriginalCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Store original category structure
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        'Breakfast',
        'Lunch',
        'Dinner'
    ]);
    const [loadingMenu, setLoadingMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEditModal, setShowEditModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeleteModal, setShowDeleteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterCategory, setFilterCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('name'); // 'name', 'price', 'category'
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('asc'); // 'asc', 'desc'
    // Enable keyboard avoidance for mobile
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$hooks$2f$useKeyboardAvoidance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoKeyboardAvoidance"])({
        containerSelector: '.modal-container, .menu-price-tab',
        inputSelector: 'input, textarea, select'
    });
    // Form state
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        description: '',
        price: 0,
        isAvailable: true,
        imageUrl: '',
        category: ''
    });
    // Load menu items
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuPriceTab.useEffect": ()=>{
            loadMenuItems();
        }
    }["MenuPriceTab.useEffect"], []);
    // Ensure default categories are always available
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuPriceTab.useEffect": ()=>{
            const defaultCategories = [
                'Breakfast',
                'Lunch',
                'Dinner'
            ];
            if (categories.length === 0 || !categories.includes('Breakfast') || !categories.includes('Dinner')) {
                console.log('[Categories] Ensuring default categories are present. Current:', categories);
                const merged = [
                    ...new Set([
                        ...defaultCategories,
                        ...categories
                    ])
                ];
                setCategories(merged);
            }
        }
    }["MenuPriceTab.useEffect"], [
        categories
    ]);
    const loadMenuItems = async ()=>{
        setLoadingMenu(true);
        try {
            // Load menu categories from backend
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getMenu();
            console.log('[Menu Load] Backend response:', {
                success: response?.success,
                hasData: !!response?.data,
                isArray: Array.isArray(response?.data),
                dataLength: response?.data?.length || 0
            });
            if (response.success && response.data && Array.isArray(response.data)) {
                const totalItems = response.data.reduce((sum, cat)=>sum + (cat.items?.length || 0), 0);
                console.log('[Menu Load] Loaded categories:', {
                    categoriesCount: response.data.length,
                    totalItems: totalItems,
                    categoriesDetail: response.data.map((cat)=>({
                            category: cat.category,
                            itemsCount: cat.items?.length || 0,
                            itemNames: cat.items?.map((i)=>i.name) || []
                        }))
                });
                // Store original categories structure for preserving metadata
                setOriginalCategories(response.data);
                // Flatten categories into individual items with category info
                const flattenedItems = [];
                response.data.forEach((category)=>{
                    if (category.items && Array.isArray(category.items)) {
                        category.items.forEach((item)=>{
                            flattenedItems.push({
                                ...item,
                                category: category.category || item.category || 'Lunch',
                                categoryId: category.id,
                                categoryIcon: category.icon,
                                categoryTag: category.tag,
                                categoryDescription: category.description
                            });
                        });
                    }
                });
                console.log('[Menu Load] Flattened items:', {
                    itemsCount: flattenedItems.length,
                    categories: [
                        ...new Set(flattenedItems.map((item)=>item.category))
                    ]
                });
                setMenuItems(flattenedItems);
                const defaultCategories = [
                    'Breakfast',
                    'Lunch',
                    'Dinner'
                ];
                // Extract unique categories from loaded items
                const uniqueCategories = [
                    ...new Set(flattenedItems.map((item)=>item.category))
                ];
                console.log('[Menu Load] Category processing:', {
                    defaultCategories,
                    uniqueCategoriesFromItems: uniqueCategories
                });
                // Merge default categories with categories found in database
                const allCategories = [
                    ...new Set([
                        ...defaultCategories,
                        ...uniqueCategories
                    ])
                ];
                console.log('[Menu Load] Final categories to set:', allCategories);
                // Always set to merged categories (defaults + found in DB)
                console.log('[Menu Load] Setting categories to:', allCategories);
                setCategories(allCategories);
            } else {
                console.warn('[Menu Load] Invalid response structure:', response);
                setMenuItems([]);
                setOriginalCategories([]);
                // Even on error, keep default categories
                setCategories([
                    'Breakfast',
                    'Lunch',
                    'Dinner'
                ]);
            }
        } catch (error) {
            console.error('[Menu Load] Error loading menu items:', error);
            setMenuItems([]);
            // Even on error, keep default categories
            setCategories([
                'Breakfast',
                'Lunch',
                'Dinner'
            ]);
        } finally{
            setLoadingMenu(false);
        }
    };
    // Convert flat items array back to categories structure for saving
    const convertItemsToCategories = (items)=>{
        const categoriesMap = {};
        // First, preserve original category structure
        if (originalCategories && originalCategories.length > 0) {
            originalCategories.forEach((originalCategory)=>{
                const categoryName = originalCategory.category;
                if (categoryName) {
                    categoriesMap[categoryName] = {
                        id: originalCategory.id,
                        category: originalCategory.category,
                        icon: originalCategory.icon || 'fa-utensils',
                        tag: originalCategory.tag || '',
                        description: originalCategory.description || '',
                        items: []
                    };
                }
            });
        }
        // Then, add items to their categories (use first available category or default "Lunch" if no category)
        items.forEach((item)=>{
            // If item has no category, assign to first available category from existing categories or default to 'Lunch'
            let categoryName = item.category;
            if (!categoryName || categoryName.trim() === '') {
                // Try to get first category from existing categories map, or from state, or default
                const existingCategoryNames = Object.keys(categoriesMap);
                if (existingCategoryNames.length > 0) {
                    categoryName = existingCategoryNames[0];
                } else if (categories.length > 0) {
                    categoryName = categories[0];
                } else {
                    categoryName = 'Lunch';
                }
                console.log('[Convert Categories] Assigned category to item:', {
                    itemName: item.name,
                    assignedCategory: categoryName
                });
            }
            if (!categoriesMap[categoryName]) {
                // Create new category if it doesn't exist
                // Try to find category info from existing items in the same category
                const existingItemInCategory = items.find((i)=>i.category === categoryName && i.categoryId);
                categoriesMap[categoryName] = {
                    id: existingItemInCategory?.categoryId || item.categoryId || Date.now(),
                    category: categoryName,
                    icon: existingItemInCategory?.categoryIcon || item.categoryIcon || 'fa-utensils',
                    tag: existingItemInCategory?.categoryTag || item.categoryTag || '',
                    description: existingItemInCategory?.categoryDescription || item.categoryDescription || '',
                    items: []
                };
            }
            // Remove category metadata before adding to items array
            const { category, categoryId, categoryIcon, categoryTag, categoryDescription, ...itemData } = item;
            categoriesMap[categoryName].items.push(itemData);
        });
        const result = Object.values(categoriesMap);
        const totalItems = result.reduce((sum, cat)=>sum + (cat.items?.length || 0), 0);
        console.log('[Convert Categories] Converted to categories:', {
            categoriesCount: result.length,
            totalItems: totalItems,
            categories: result.map((cat)=>({
                    name: cat.category,
                    itemsCount: cat.items?.length || 0
                }))
        });
        // Filter out empty categories before returning
        const categoriesWithItems = result.filter((cat)=>cat.items && cat.items.length > 0);
        if (categoriesWithItems.length === 0) {
            console.error('[Convert Categories] Error: No categories with items found after conversion');
            throw new Error('No menu items found. Please add at least one menu item.');
        }
        return categoriesWithItems;
    };
    // Available images in public folder - same as Gallery component
    const publicImages = [
        'Amritsarichhole.png',
        'Curd.jpg',
        'DeliciousAaluParatha.jpg',
        'DesiThali.jpeg',
        'food.jpeg',
        'FullTiffin.jpg',
        'hero.jpeg',
        'kadhipakora.jpg',
        'kalachana.jpg',
        'lobhiya.jpg',
        'lokikofte.jpg',
        'MoondDalKhichdi.jpg',
        'rajma.jpg',
        'RotiSabji.png',
        'veg-thali.png',
        'VegThali.png'
    ];
    // Convert item name to image filename format
    const normalizeName = (name)=>{
        return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').trim();
    };
    // Find matching image from public folder based on item name
    const findImageByName = (itemName)=>{
        if (!itemName) return '/food.jpeg';
        const normalizedName = normalizeName(itemName);
        // Check for common food name variations first (more specific)
        const commonMatches = {
            'chhole': 'Amritsarichhole.png',
            'chole': 'Amritsarichhole.png',
            'chana': 'kalachana.jpg',
            'dal': 'MoondDalKhichdi.jpg',
            'khichdi': 'MoondDalKhichdi.jpg',
            'paratha': 'DeliciousAaluParatha.jpg',
            'aloo': 'DeliciousAaluParatha.jpg',
            'thali': 'DesiThali.jpeg',
            'rajma': 'rajma.jpg',
            'roti': 'RotiSabji.png',
            'sabji': 'RotiSabji.png',
            'pakora': 'kadhipakora.jpg',
            'kadhi': 'kadhipakora.jpg',
            'lobhiya': 'lobhiya.jpg',
            'kofta': 'lokikofte.jpg',
            'koofte': 'lokikofte.jpg',
            'curd': 'Curd.jpg',
            'dahi': 'Curd.jpg',
            'tiffin': 'FullTiffin.jpg',
            'full': 'FullTiffin.jpg'
        };
        for (const [key, imageFile] of Object.entries(commonMatches)){
            if (normalizedName.includes(key)) {
                return '/' + imageFile;
            }
        }
        // Try to find exact or partial match
        for (const image of publicImages){
            const imageName = normalizeName(image.replace(/\.(jpg|jpeg|png)$/i, ''));
            if (imageName.includes(normalizedName) || normalizedName.includes(imageName)) {
                return '/' + image;
            }
        }
        return '/food.jpeg'; // Default fallback
    };
    // Get image URL for an item - auto-generates if not provided
    const getItemImageUrl = (item)=>{
        // If imageUrl is explicitly provided, use it
        if (item.imageUrl && item.imageUrl.trim() !== '') {
            const imageUrl = item.imageUrl.trim();
            if (imageUrl.startsWith('/')) {
                return imageUrl;
            } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                return imageUrl;
            } else {
                return '/' + imageUrl;
            }
        }
        // Auto-generate from item name
        return findImageByName(item.name);
    };
    // Sync menu items with images to gallery
    // This automatically syncs menu items to the website gallery
    // Only items with both imageUrl and price are synced
    // Items appear on the website gallery immediately after sync
    const syncMenuItemsToGallery = async (items, showNotification = null)=>{
        try {
            console.log('[Gallery Sync] Starting sync for', items.length, 'menu items');
            // Get current gallery items
            let galleryResponse;
            try {
                galleryResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getGallery();
                console.log('[Gallery Sync] Fetched', galleryResponse?.data?.length || 0, 'existing gallery items');
            } catch (error) {
                console.error('[Gallery Sync] Error fetching gallery:', error);
                throw new Error('Failed to fetch gallery: ' + (error.message || 'Unknown error'));
            }
            const existingGalleryItems = galleryResponse.success && galleryResponse.data ? galleryResponse.data : [];
            // Use provided imageUrl if available, otherwise auto-generate from item name
            const itemsToSync = items.map((item)=>{
                // If user provided imageUrl, use it (normalize it first)
                let finalImageUrl = item.imageUrl;
                if (finalImageUrl && finalImageUrl.trim() !== '') {
                    // User provided an image URL - normalize it
                    finalImageUrl = finalImageUrl.trim();
                    if (!finalImageUrl.startsWith('/') && !finalImageUrl.startsWith('http://') && !finalImageUrl.startsWith('https://')) {
                        finalImageUrl = '/' + finalImageUrl;
                    }
                } else {
                    // No imageUrl provided - auto-generate from item name
                    finalImageUrl = getItemImageUrl(item);
                }
                return {
                    ...item,
                    imageUrl: finalImageUrl
                };
            }).filter((item)=>{
                const hasImage = item.imageUrl && item.imageUrl.trim() !== '';
                const hasPrice = item.price && item.price > 0;
                const isAvailable = item.isAvailable !== false;
                return hasImage && hasPrice && isAvailable;
            });
            console.log('[Gallery Sync] Filtering items for gallery:', {
                totalItems: items.length,
                itemsWithImageAndPrice: itemsToSync.length,
                itemsToSync: itemsToSync.map((i)=>({
                        name: i.name,
                        imageUrl: i.imageUrl,
                        price: i.price
                    }))
            });
            if (itemsToSync.length === 0) {
                console.warn('[Gallery Sync] No items to sync - items need imageUrl and price to appear in gallery');
            }
            // Create/update gallery items for each menu item
            let created = 0;
            let updated = 0;
            for (const item of itemsToSync){
                // ImageUrl is already normalized in the map step above
                const finalImageUrl = item.imageUrl;
                console.log('[Gallery Sync] Syncing item:', {
                    name: item.name,
                    originalImageUrl: item.imageUrl,
                    finalImageUrl: finalImageUrl,
                    wasAutoGenerated: !item.imageUrl || item.imageUrl.trim() === '' ? 'Yes (from name)' : 'No (user provided)'
                });
                const defaultDetails = [
                    'Dry Sabji',
                    'Gravy Sabji',
                    '4 Roti (6 without Rice)',
                    'Rice'
                ];
                const galleryItemData = {
                    name: item.name,
                    imageUrl: finalImageUrl,
                    alt: item.name,
                    caption: item.price ? `${item.name} - ₹${item.price}` : item.name,
                    price: item.price,
                    category: item.category || 'Menu',
                    details: defaultDetails,
                    order: item.order || 0,
                    isActive: item.isAvailable !== false
                };
                // Check if gallery item already exists (by name)
                const existingItem = existingGalleryItems.find((gi)=>gi.name === item.name);
                if (existingItem) {
                    // Update existing gallery item
                    try {
                        const updateResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateGalleryItem(existingItem._id || existingItem.id, galleryItemData);
                        updated++;
                        console.log('[Gallery Sync] Updated gallery item:', item.name);
                    } catch (error) {
                        console.error('[Gallery Sync] Error updating gallery item', item.name, ':', error);
                        throw error;
                    }
                } else {
                    // Create new gallery item
                    try {
                        const createResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createGalleryItem(galleryItemData);
                        created++;
                        console.log('[Gallery Sync] Created gallery item:', item.name, '- Now visible on website gallery');
                    } catch (error) {
                        console.error('[Gallery Sync] Error creating gallery item', item.name, ':', error);
                        throw error;
                    }
                }
            }
            // Deactivate gallery items that are no longer in menu or don't have images/prices
            const menuItemNames = new Set(itemsToSync.map((item)=>item.name));
            let deactivated = 0;
            for (const galleryItem of existingGalleryItems){
                if (!menuItemNames.has(galleryItem.name) && galleryItem.isActive) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateGalleryItem(galleryItem._id || galleryItem.id, {
                        isActive: false
                    });
                    deactivated++;
                }
            }
            console.log('[Gallery Sync] Sync complete:', {
                created,
                updated,
                deactivated,
                totalActive: created + updated
            });
            // Trigger immediate refresh on gallery page (if open)
            try {
                // Dispatch custom event for gallery to refresh immediately
                if ("TURBOPACK compile-time truthy", 1) {
                    window.dispatchEvent(new Event('gallery-updated'));
                    // Also update localStorage timestamp for cross-tab communication
                    localStorage.setItem('gallery-last-update', Date.now().toString());
                    console.log('[Gallery Sync] Triggered gallery refresh event');
                }
            } catch (e) {
                console.warn('[Gallery Sync] Could not trigger refresh event:', e);
            }
            // Show notification if explicitly requested (for manual sync)
            if (showNotification && (created > 0 || updated > 0)) {
                showNotification(`Gallery sync complete: ${created} created, ${updated} updated. Items should now appear on website.`, 'success');
            }
        // Sync complete - don't show notification here by default, it will be shown in saveMenuItemsToBackend
        // Gallery sync happens automatically and silently
        } catch (error) {
            console.error('[Gallery Sync] Error syncing menu items to gallery:', error);
            if (showNotification) {
                showNotification('Error syncing to gallery: ' + (error.message || 'Unknown error'), 'error');
            }
        // Don't throw error - gallery sync is optional, but log it
        }
    };
    const saveMenuItemsToBackend = async (items)=>{
        try {
            if (!items || !Array.isArray(items)) {
                throw new Error('Invalid menu items data');
            }
            if (items.length === 0) {
                console.warn('[Menu Save] Attempting to save empty menu items array');
                if (showNotification) {
                    showNotification('Cannot save empty menu. Please add at least one menu item.', 'error');
                }
                throw new Error('Cannot save empty menu. Please add at least one menu item.');
            }
            const categories = convertItemsToCategories(items);
            // Validate that we have items to save
            const totalItemsInCategories = categories.reduce((sum, cat)=>sum + (cat.items?.length || 0), 0);
            if (totalItemsInCategories === 0) {
                console.warn('[Menu Save] Warning: No items to save after conversion');
                throw new Error('No menu items to save. Please add at least one menu item.');
            }
            // Log full structure for debugging
            console.log('[Menu Save] Full categories structure:', JSON.stringify(categories, null, 2));
            console.log('[Menu Save] Sending categories to backend:', {
                categoriesCount: categories.length,
                itemsCount: items.length,
                totalItemsInCategories: totalItemsInCategories,
                categoriesStructure: categories.map((cat)=>({
                        category: cat.category,
                        itemsCount: cat.items?.length || 0,
                        allItemNames: cat.items?.map((i)=>i.name) || []
                    }))
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateMenu(categories);
            console.log('[Menu Save] Backend response:', {
                success: response?.success,
                dataLength: response?.data?.length || 0,
                error: response?.error
            });
            if (!response) {
                console.error('[Menu Save] No response from server');
                throw new Error('No response from server');
            }
            if (response.success !== true) {
                const errorMsg = response?.error || 'Failed to save menu';
                console.error('[Menu Save] Backend returned error:', errorMsg);
                console.error('[Menu Save] Full error response:', response);
                throw new Error(errorMsg);
            }
            if (!response.data || !Array.isArray(response.data)) {
                console.warn('[Menu Save] Backend response missing valid data:', response);
            // Don't throw error here, but log it - the save might still have succeeded
            } else {
                console.log('[Menu Save] Successfully saved menu with', response.data.length, 'categories');
            }
            // Automatically sync menu items to gallery (items with images will appear on website)
            console.log('[Menu Save] Starting gallery sync for', items.length, 'items...');
            try {
                await syncMenuItemsToGallery(items, null); // Don't show notification here, will show in main success message
                console.log('[Menu Save] Gallery sync completed - items should now be visible on website');
            } catch (syncError) {
                console.error('[Menu Save] Gallery sync failed:', syncError);
                // Don't fail the entire save if gallery sync fails
                showNotification('Menu saved, but gallery sync failed: ' + (syncError.message || 'Unknown error'), 'warning');
            }
            // Reload menu items from backend to ensure UI is in sync
            console.log('[Menu Save] Reloading menu items after save...');
            try {
                await loadMenuItems();
                console.log('[Menu Save] Menu items reloaded successfully');
                // Verify items were loaded
                const reloadedResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getMenu();
                if (reloadedResponse.success && reloadedResponse.data) {
                    const totalLoadedItems = reloadedResponse.data.reduce((sum, cat)=>sum + (cat.items?.length || 0), 0);
                    console.log('[Menu Save] Verification - Total items in database:', totalLoadedItems);
                    if (totalLoadedItems === 0) {
                        console.error('[Menu Save] WARNING: Items were saved but database shows 0 items!');
                        if (showNotification) {
                            showNotification('Warning: Items may not have saved correctly. Please check the database.', 'error');
                        }
                    }
                }
            } catch (reloadError) {
                console.error('[Menu Save] Error reloading menu items:', reloadError);
            // Don't throw - save might have succeeded even if reload failed
            }
            // Show single notification for save operation
            if (showNotification) {
                showNotification('Menu saved successfully', 'success');
            }
            return true;
        } catch (error) {
            console.error('[Menu Save] Error saving menu to backend:', error);
            console.error('[Menu Save] Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            if (showNotification) {
                showNotification('Error saving menu: ' + (error.message || 'Unknown error'), 'error');
            }
            throw error;
        }
    };
    // Filtered and sorted menu items
    const filteredMenuItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuPriceTab.useMemo[filteredMenuItems]": ()=>{
            let filtered = [
                ...menuItems
            ];
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter({
                    "MenuPriceTab.useMemo[filteredMenuItems]": (item)=>item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query) || item.category?.toLowerCase().includes(query)
                }["MenuPriceTab.useMemo[filteredMenuItems]"]);
            }
            // Category filter
            if (filterCategory) {
                filtered = filtered.filter({
                    "MenuPriceTab.useMemo[filteredMenuItems]": (item)=>item.category === filterCategory
                }["MenuPriceTab.useMemo[filteredMenuItems]"]);
            }
            // Sorting
            filtered.sort({
                "MenuPriceTab.useMemo[filteredMenuItems]": (a, b)=>{
                    let aVal, bVal;
                    switch(sortBy){
                        case 'price':
                            aVal = parseFloat(a.price || 0);
                            bVal = parseFloat(b.price || 0);
                            break;
                        case 'category':
                            aVal = (a.category || '').toLowerCase();
                            bVal = (b.category || '').toLowerCase();
                            break;
                        default:
                            aVal = (a.name || '').toLowerCase();
                            bVal = (b.name || '').toLowerCase();
                    }
                    if (sortOrder === 'asc') {
                        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                    } else {
                        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
                    }
                }
            }["MenuPriceTab.useMemo[filteredMenuItems]"]);
            return filtered;
        }
    }["MenuPriceTab.useMemo[filteredMenuItems]"], [
        menuItems,
        searchQuery,
        filterCategory,
        sortBy,
        sortOrder
    ]);
    // Handle add item
    const handleAddItem = async ()=>{
        if (!formData.name.trim() || !formData.price || formData.price <= 0) {
            if (showNotification) {
                showNotification('Please fill in all required fields', 'error');
            }
            return;
        }
        const performAdd = async ()=>{
            try {
                // Determine category - use first available category or default to 'Lunch' (most common)
                let itemCategory = 'Breakfast';
                if (categories.length > 0) {
                    itemCategory = categories[0];
                } else if (menuItems.length > 0 && menuItems[0].category) {
                    // Use category from existing items
                    itemCategory = menuItems[0].category;
                }
                const newItem = {
                    id: Date.now(),
                    name: formData.name.trim(),
                    description: formData.description || '',
                    price: parseFloat(formData.price),
                    imageUrl: formData.imageUrl || '',
                    isAvailable: formData.isAvailable !== false,
                    category: formData.category || itemCategory
                };
                console.log('[Add Item] New item created:', {
                    name: newItem.name,
                    category: newItem.category,
                    price: newItem.price
                });
                const updatedItems = [
                    ...menuItems,
                    newItem
                ];
                // Save to backend FIRST (before updating local state) to ensure consistency
                console.log('[Add Item] Saving new item to backend:', {
                    itemName: newItem.name,
                    category: newItem.category,
                    price: newItem.price,
                    totalItemsBefore: menuItems.length,
                    totalItemsAfter: updatedItems.length,
                    allItemsBefore: menuItems.map((i)=>({
                            name: i.name,
                            id: i.id
                        })),
                    allItemsAfter: updatedItems.map((i)=>({
                            name: i.name,
                            id: i.id
                        }))
                });
                try {
                    await saveMenuItemsToBackend(updatedItems);
                    console.log('[Add Item] Successfully saved to backend, now reloading from backend...');
                    // Reload from backend to ensure we have the latest data and sync with database
                    await loadMenuItems();
                    console.log('[Add Item] Reloaded menu items from backend - should now be in sync');
                } catch (error) {
                    console.error('[Add Item] Failed to save to backend:', error);
                    // Reload anyway to sync with backend (might have partial save)
                    try {
                        await loadMenuItems();
                    } catch (reloadError) {
                        console.error('[Add Item] Failed to reload after error:', reloadError);
                    }
                    throw error;
                }
                setShowAddModal(false);
                setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    isAvailable: true,
                    imageUrl: '',
                    category: ''
                });
            // Notification is already shown in saveMenuItemsToBackend, no need to show again
            } catch (error) {
                console.error('Error adding menu item:', error);
                if (showNotification) {
                    showNotification('Error adding menu item', 'error');
                }
            }
        };
        if (showConfirmation) {
            showConfirmation({
                title: 'Add Menu Item',
                message: `Are you sure you want to add "${formData.name.trim()}" to the menu?`,
                type: 'info',
                confirmText: 'Add Item',
                onConfirm: performAdd
            });
        } else {
            await performAdd();
        }
    };
    // Handle edit item
    const handleEditItem = async ()=>{
        if (!formData.name.trim() || !formData.price || formData.price <= 0) {
            if (showNotification) {
                showNotification('Please fill in all required fields', 'error');
            }
            return;
        }
        const performUpdate = async ()=>{
            try {
                const updatedItem = {
                    ...selectedItem,
                    name: formData.name.trim(),
                    description: formData.description || '',
                    price: parseFloat(formData.price),
                    imageUrl: formData.imageUrl || '',
                    isAvailable: formData.isAvailable !== false,
                    category: formData.category || selectedItem.category || ''
                };
                const updatedItems = menuItems.map((item)=>item.id === selectedItem.id ? updatedItem : item);
                console.log('[Edit Item] Updating item:', {
                    itemId: selectedItem.id,
                    itemName: updatedItem.name,
                    totalItems: updatedItems.length,
                    allItems: updatedItems.map((i)=>({
                            name: i.name,
                            id: i.id
                        }))
                });
                // Save to backend FIRST
                await saveMenuItemsToBackend(updatedItems);
                // Reload from backend to ensure we have the latest data
                await loadMenuItems();
                setShowEditModal(false);
                setSelectedItem(null);
                setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    isAvailable: true,
                    imageUrl: '',
                    category: ''
                });
            // Notification is already shown in saveMenuItemsToBackend, no need to show again
            } catch (error) {
                console.error('Error updating menu item:', error);
                if (showNotification) {
                    showNotification('Error updating menu item', 'error');
                }
            }
        };
        if (showConfirmation) {
            showConfirmation({
                title: 'Update Menu Item',
                message: `Are you sure you want to save changes to "${formData.name.trim()}"?`,
                type: 'info',
                confirmText: 'Save Changes',
                onConfirm: performUpdate
            });
        } else {
            await performUpdate();
        }
    };
    // Handle delete item
    const handleDeleteItem = async ()=>{
        try {
            const updatedItems = menuItems.filter((item)=>item.id !== selectedItem.id);
            console.log('[Delete Item] Deleting item:', {
                itemId: selectedItem.id,
                itemName: selectedItem.name,
                totalItemsBefore: menuItems.length,
                totalItemsAfter: updatedItems.length,
                remainingItems: updatedItems.map((i)=>({
                        name: i.name,
                        id: i.id
                    }))
            });
            // Save to backend FIRST
            await saveMenuItemsToBackend(updatedItems);
            // Reload from backend to ensure we have the latest data
            await loadMenuItems();
            setShowDeleteModal(false);
            setSelectedItem(null);
        // Notification is already shown in saveMenuItemsToBackend, no need to show again
        } catch (error) {
            console.error('Error deleting menu item:', error);
            if (showNotification) {
                showNotification('Error deleting menu item', 'error');
            }
        }
    };
    // Handle toggle availability
    const handleToggleAvailability = async (item)=>{
        try {
            const updatedItem = {
                ...item,
                isAvailable: !item.isAvailable
            };
            const updatedItems = menuItems.map((i)=>i.id === item.id ? updatedItem : i);
            // Save to backend FIRST
            await saveMenuItemsToBackend(updatedItems);
            // Reload from backend to ensure we have the latest data
            await loadMenuItems();
        // Notification is already shown in saveMenuItemsToBackend, no need to show again
        } catch (error) {
            console.error('Error toggling availability:', error);
            if (showNotification) {
                showNotification('Error updating item', 'error');
            }
        }
    };
    // Open edit modal
    const openEditModal = (item)=>{
        setSelectedItem(item);
        setFormData({
            name: item.name || '',
            description: item.description || '',
            price: item.price || 0,
            isAvailable: item.isAvailable !== false,
            imageUrl: item.imageUrl || '',
            category: item.category || ''
        });
        setShowEditModal(true);
    };
    // Open delete modal
    const openDeleteModal = (item)=>{
        setSelectedItem(item);
        setShowDeleteModal(true);
    };
    if (loading || loadingMenu) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "admin-content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$PremiumLoader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: "Loading menu...",
                size: "large"
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                lineNumber: 931,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
            lineNumber: 930,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "admin-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "action-buttons-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-primary btn-small",
                            onClick: ()=>{
                                // Initialize form when opening add modal
                                setFormData({
                                    name: '',
                                    description: '',
                                    price: 0,
                                    isAvailable: true,
                                    imageUrl: '',
                                    category: ''
                                });
                                setShowAddModal(true);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-plus"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 956,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                " Add Menu Item"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 941,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        menuItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-danger btn-small",
                            onClick: async ()=>{
                                if (showConfirmation) {
                                    showConfirmation({
                                        title: 'Clear All Menu Items',
                                        message: 'Are you sure you want to delete all menu items? This will also remove the default menu record from the database. This action cannot be undone.',
                                        type: 'warning',
                                        confirmText: 'Delete All',
                                        onConfirm: async ()=>{
                                            try {
                                                // Delete the menu record from database
                                                await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$lib$2f$api$2d$admin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].deleteMenu();
                                                // Clear local state
                                                setMenuItems([]);
                                                setOriginalCategories([]);
                                                if (showNotification) {
                                                    showNotification('All menu items and default record deleted successfully', 'success');
                                                }
                                            } catch (error) {
                                                console.error('Error deleting menu:', error);
                                                if (showNotification) {
                                                    showNotification('Error deleting menu: ' + (error.message || 'Unknown error'), 'error');
                                                }
                                            }
                                        }
                                    });
                                }
                            },
                            title: "Delete all menu items and remove default record from database",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-trash"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 997,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                " Clear All"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 959,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-secondary btn-small",
                            onClick: async ()=>{
                                // Manual sync to gallery
                                try {
                                    showNotification('Syncing menu items to gallery...', 'info');
                                    await syncMenuItemsToGallery(menuItems, showNotification);
                                } catch (error) {
                                    console.error('[Manual Sync] Error:', error);
                                    showNotification('Gallery sync failed: ' + (error.message || 'Unknown error'), 'error');
                                }
                            },
                            title: "Sync all menu items with images to website gallery",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-sync-alt"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1014,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                " Sync to Gallery"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1000,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                    lineNumber: 940,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                lineNumber: 939,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
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
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1023,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "input-field search-input-with-icon",
                                    placeholder: "Search menu items...",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1024,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1022,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "filter-field-group-standard min-width-140",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "filter-label-standard",
                                    children: "Category"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1033,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "input-field filter-input-standard",
                                    value: filterCategory,
                                    onChange: (e)=>setFilterCategory(e.target.value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "All Categories"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1039,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: cat,
                                                children: cat
                                            }, cat, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1041,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1034,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1032,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "filter-field-group-standard min-width-160",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "filter-label-standard",
                                    children: "Sort By"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1048,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    className: "input-field filter-input-standard",
                                    value: `${sortBy}-${sortOrder}`,
                                    onChange: (e)=>{
                                        const [by, order] = e.target.value.split('-');
                                        setSortBy(by);
                                        setSortOrder(order);
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "name-asc",
                                            children: "Name (A-Z)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1058,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "name-desc",
                                            children: "Name (Z-A)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1059,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "price-asc",
                                            children: "Price (Low to High)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1060,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "price-desc",
                                            children: "Price (High to Low)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1061,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "category-asc",
                                            children: "Category (A-Z)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1062,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "category-desc",
                                            children: "Category (Z-A)"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1063,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1049,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1047,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        (searchQuery || filterCategory) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-ghost btn-small",
                            onClick: ()=>{
                                setSearchQuery('');
                                setFilterCategory('');
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
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1075,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Clear Filters"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1067,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                    lineNumber: 1021,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                lineNumber: 1020,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            filteredMenuItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-card",
                style: {
                    textAlign: 'center',
                    padding: '48px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-utensils",
                        style: {
                            fontSize: '64px',
                            color: 'var(--admin-text-light)',
                            marginBottom: '16px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                        lineNumber: 1085,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            color: 'var(--admin-text-secondary)',
                            marginBottom: '8px'
                        },
                        children: "No Menu Items"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                        lineNumber: 1089,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "margin-bottom-24",
                        style: {
                            color: 'var(--admin-text-light)'
                        },
                        children: searchQuery || filterCategory ? 'No items match your filters' : 'Get started by adding your first menu item'
                    }, void 0, false, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                        lineNumber: 1092,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    !searchQuery && !filterCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn btn-primary",
                        onClick: ()=>{
                            // Initialize form with default category when opening add modal
                            setFormData({
                                name: '',
                                description: '',
                                price: 0,
                                isAvailable: true,
                                imageUrl: '',
                                category: ''
                            });
                            setShowAddModal(true);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fa-solid fa-plus"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                lineNumber: 1113,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            " Add Menu Item"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                        lineNumber: 1098,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                lineNumber: 1084,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-grid-layout menu-items-grid",
                children: filteredMenuItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-card menu-item-card",
                        style: {
                            position: 'relative',
                            animationDelay: `${index * 0.05}s`
                        },
                        children: [
                            item.imageUrl && item.imageUrl.trim() !== '' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '100%',
                                    height: '200px',
                                    marginBottom: '16px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    background: 'var(--admin-glass-border)',
                                    position: 'relative'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: (()=>{
                                        // Available images in public folder
                                        const publicImages = [
                                            'Amritsarichhole.png',
                                            'Curd.jpg',
                                            'DeliciousAaluParatha.jpg',
                                            'DesiThali.jpeg',
                                            'food.jpeg',
                                            'FullTiffin.jpg',
                                            'hero.jpeg',
                                            'kadhipakora.jpg',
                                            'kalachana.jpg',
                                            'lobhiya.jpg',
                                            'lokikofte.jpg',
                                            'MoondDalKhichdi.jpg',
                                            'rajma.jpg',
                                            'RotiSabji.png',
                                            'veg-thali.png',
                                            'VegThali.png'
                                        ];
                                        // Convert item name to image filename format
                                        const normalizeName = (name)=>{
                                            return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').trim();
                                        };
                                        // Find matching image from public folder based on item name
                                        const findImageByName = (itemName)=>{
                                            if (!itemName) return '/food.jpeg';
                                            const normalizedName = normalizeName(itemName);
                                            // Check for common food name variations first (more specific)
                                            const commonMatches = {
                                                'chhole': 'Amritsarichhole.png',
                                                'chole': 'Amritsarichhole.png',
                                                'chana': 'kalachana.jpg',
                                                'dal': 'MoondDalKhichdi.jpg',
                                                'khichdi': 'MoondDalKhichdi.jpg',
                                                'paratha': 'DeliciousAaluParatha.jpg',
                                                'aloo': 'DeliciousAaluParatha.jpg',
                                                'thali': 'DesiThali.jpeg',
                                                'rajma': 'rajma.jpg',
                                                'roti': 'RotiSabji.png',
                                                'sabji': 'RotiSabji.png',
                                                'pakora': 'kadhipakora.jpg',
                                                'kadhi': 'kadhipakora.jpg',
                                                'lobhiya': 'lobhiya.jpg',
                                                'kofta': 'lokikofte.jpg',
                                                'koofte': 'lokikofte.jpg',
                                                'curd': 'Curd.jpg',
                                                'dahi': 'Curd.jpg',
                                                'tiffin': 'FullTiffin.jpg',
                                                'full': 'FullTiffin.jpg'
                                            };
                                            for (const [key, imageFile] of Object.entries(commonMatches)){
                                                if (normalizedName.includes(key)) {
                                                    return '/' + imageFile;
                                                }
                                            }
                                            // Try to find exact or partial match
                                            for (const image of publicImages){
                                                const imageName = normalizeName(image.replace(/\.(jpg|jpeg|png)$/i, ''));
                                                if (imageName.includes(normalizedName) || normalizedName.includes(imageName)) {
                                                    return '/' + image;
                                                }
                                            }
                                            return '/food.jpeg';
                                        };
                                        // If imageUrl is explicitly provided, use it
                                        if (item.imageUrl && item.imageUrl.trim() !== '') {
                                            const imageUrl = item.imageUrl.trim();
                                            if (imageUrl.startsWith('/')) {
                                                return imageUrl;
                                            } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                                                return imageUrl;
                                            } else {
                                                return '/' + imageUrl;
                                            }
                                        }
                                        // If no imageUrl, try to find matching image from public folder
                                        const matchedImage = findImageByName(item.name);
                                        if ("TURBOPACK compile-time truthy", 1) {
                                            return matchedImage;
                                        }
                                        //TURBOPACK unreachable
                                        ;
                                    })(),
                                    alt: item.name || 'Menu item',
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block'
                                    },
                                    onError: (e)=>{
                                        console.warn('[Menu Item Image] Failed to load:', e.target.src, '- Using fallback');
                                        const fallback = '/food.jpeg';
                                        if (e.target.src !== fallback && !e.target.src.includes(fallback)) {
                                            e.target.src = fallback;
                                        }
                                    },
                                    loading: "lazy"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1138,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                lineNumber: 1127,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '100%',
                                    height: '200px',
                                    marginBottom: '16px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    background: 'var(--admin-glass-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--admin-text-light)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-image",
                                    style: {
                                        fontSize: '48px',
                                        opacity: 0.3
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1267,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                lineNumber: 1253,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    marginBottom: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    marginBottom: '4px',
                                                    fontSize: '18px',
                                                    fontWeight: '600'
                                                },
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1280,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "badge",
                                                style: {
                                                    background: item.category === 'Lunch' ? 'var(--admin-accent-light)' : item.category === 'Dinner' ? 'var(--admin-secondary-light)' : 'var(--admin-glass-border)',
                                                    color: item.category === 'Lunch' ? 'var(--admin-accent)' : item.category === 'Dinner' ? 'var(--admin-secondary)' : 'var(--admin-text-secondary)',
                                                    fontSize: '12px',
                                                    padding: '4px 8px'
                                                },
                                                children: item.category
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1283,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1279,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "badge",
                                        style: {
                                            background: item.isAvailable ? 'var(--admin-success-light)' : 'var(--admin-danger-light)',
                                            color: item.isAvailable ? 'var(--admin-success)' : 'var(--admin-danger)',
                                            fontSize: '11px',
                                            padding: '4px 8px'
                                        },
                                        children: item.isAvailable ? 'Available' : 'Unavailable'
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1305,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                lineNumber: 1271,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: 'var(--admin-text-secondary)',
                                    fontSize: '14px',
                                    marginBottom: '12px',
                                    lineHeight: '1.5'
                                },
                                children: item.description
                            }, void 0, false, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                lineNumber: 1321,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid var(--admin-border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '24px',
                                                fontWeight: '700',
                                                color: 'var(--admin-accent)'
                                            },
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$utils$2f$orderUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price || 0)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1344,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1343,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "action-buttons-group",
                                        style: {
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "action-button",
                                                onClick: ()=>handleToggleAvailability(item),
                                                title: item.isAvailable ? 'Mark as Unavailable' : 'Mark as Available',
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: `fa-solid ${item.isAvailable ? 'fa-eye-slash' : 'fa-eye'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                    lineNumber: 1356,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1351,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "action-button edit",
                                                onClick: ()=>openEditModal(item),
                                                title: "Edit",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-pencil"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                    lineNumber: 1363,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1358,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "action-button delete",
                                                onClick: ()=>openDeleteModal(item),
                                                title: "Delete",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fa-solid fa-trash"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                    lineNumber: 1370,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1365,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1350,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                lineNumber: 1333,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, `${item.id}-${item.name}-${index}`, true, {
                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                        lineNumber: 1120,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                lineNumber: 1118,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showAddModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-container",
                    style: {
                        maxWidth: '540px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            style: {
                                padding: '18px 24px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontSize: '20px',
                                        margin: 0
                                    },
                                    children: "Add Menu Item"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1384,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "modal-close",
                                    onClick: ()=>setShowAddModal(false),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-times"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1386,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1385,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1383,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            style: {
                                padding: '20px 24px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                style: {
                                    gap: '16px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: "Item Name *"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1392,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: formData.name,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        name: e.target.value
                                                    }),
                                                placeholder: "e.g., Lunch Combo",
                                                required: true,
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1393,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1391,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: "Description"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1404,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                className: "input-field",
                                                value: formData.description,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        description: e.target.value
                                                    }),
                                                placeholder: "Item description...",
                                                rows: 2,
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px',
                                                    resize: 'vertical'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1405,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1403,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: "Price (₹) *"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1415,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                className: "input-field",
                                                value: formData.price,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        price: parseFloat(e.target.value) || 0
                                                    }),
                                                placeholder: "0.00",
                                                min: "0",
                                                step: "0.01",
                                                required: true,
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1416,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1414,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: [
                                                    "Category ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--admin-text-light)',
                                                            fontWeight: 400,
                                                            fontSize: '11px'
                                                        },
                                                        children: "(Optional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                        lineNumber: 1432,
                                                        columnNumber: 30
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1431,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "input-field",
                                                value: formData.category,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        category: e.target.value
                                                    }),
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select Category"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                        lineNumber: 1440,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    categories && categories.length > 0 ? categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: cat,
                                                            children: cat
                                                        }, cat, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                            lineNumber: 1443,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Breakfast",
                                                                children: "Breakfast"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                                lineNumber: 1449,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Lunch",
                                                                children: "Lunch"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                                lineNumber: 1450,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Dinner",
                                                                children: "Dinner"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                                lineNumber: 1451,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1434,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1430,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: [
                                                    "Image URL ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--admin-text-light)',
                                                            fontWeight: 400,
                                                            fontSize: '11px'
                                                        },
                                                        children: "(Optional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                        lineNumber: 1458,
                                                        columnNumber: 31
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1457,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: formData.imageUrl,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        imageUrl: e.target.value
                                                    }),
                                                placeholder: "/food.jpeg or https://example.com/image.jpg",
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1460,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                style: {
                                                    color: 'var(--admin-text-light)',
                                                    fontSize: '11px',
                                                    marginTop: '4px',
                                                    display: 'block',
                                                    lineHeight: '1.4'
                                                },
                                                children: "Use /filename.jpg for public folder, or full URL for external images"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1468,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1456,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0,
                                            marginTop: '4px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                marginBottom: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: formData.isAvailable,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            isAvailable: e.target.checked
                                                        }),
                                                    style: {
                                                        margin: 0
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                    lineNumber: 1476,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Available for ordering"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                    lineNumber: 1482,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1473,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1472,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                lineNumber: 1390,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1389,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            style: {
                                padding: '16px 24px',
                                gap: '10px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-ghost",
                                    onClick: ()=>setShowAddModal(false),
                                    style: {
                                        padding: '10px 18px',
                                        fontSize: '14px'
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1488,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary",
                                    onClick: handleAddItem,
                                    style: {
                                        padding: '10px 18px',
                                        fontSize: '14px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-plus"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1492,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " Add Item"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1491,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1487,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                    lineNumber: 1382,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                lineNumber: 1381,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showEditModal && selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-container",
                    style: {
                        maxWidth: '540px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            style: {
                                padding: '18px 24px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontSize: '20px',
                                        margin: 0
                                    },
                                    children: "Edit Menu Item"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1504,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "modal-close",
                                    onClick: ()=>setShowEditModal(false),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fa-solid fa-times"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1506,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1505,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1503,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            style: {
                                padding: '20px 24px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                style: {
                                    gap: '16px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: "Item Name *"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1512,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: formData.name,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        name: e.target.value
                                                    }),
                                                placeholder: "e.g., Lunch Combo",
                                                required: true,
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1513,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1511,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: "Description"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1524,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                className: "input-field",
                                                value: formData.description,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        description: e.target.value
                                                    }),
                                                placeholder: "Item description...",
                                                rows: 2,
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px',
                                                    resize: 'vertical'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1525,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1523,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: "Price (₹) *"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1535,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                className: "input-field",
                                                value: formData.price,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        price: parseFloat(e.target.value) || 0
                                                    }),
                                                placeholder: "0.00",
                                                min: "0",
                                                step: "0.01",
                                                required: true,
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1536,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1534,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: [
                                                    "Category ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--admin-text-light)',
                                                            fontWeight: 400,
                                                            fontSize: '11px'
                                                        },
                                                        children: "(Optional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                        lineNumber: 1552,
                                                        columnNumber: 30
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1551,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "input-field",
                                                value: formData.category,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        category: e.target.value
                                                    }),
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select Category"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                        lineNumber: 1560,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    categories && categories.length > 0 ? categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: cat,
                                                            children: cat
                                                        }, cat, false, {
                                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                            lineNumber: 1563,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Breakfast",
                                                                children: "Breakfast"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                                lineNumber: 1569,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Lunch",
                                                                children: "Lunch"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                                lineNumber: 1570,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Dinner",
                                                                children: "Dinner"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                                lineNumber: 1571,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1554,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1550,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '13px',
                                                    marginBottom: '6px'
                                                },
                                                children: [
                                                    "Image URL ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--admin-text-light)',
                                                            fontWeight: 400,
                                                            fontSize: '11px'
                                                        },
                                                        children: "(Optional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                        lineNumber: 1578,
                                                        columnNumber: 31
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1577,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "input-field",
                                                value: formData.imageUrl,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        imageUrl: e.target.value
                                                    }),
                                                placeholder: "Leave empty to auto-match, or enter /filename.jpg",
                                                style: {
                                                    padding: '10px 12px',
                                                    fontSize: '14px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1580,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                style: {
                                                    color: 'var(--admin-text-light)',
                                                    fontSize: '11px',
                                                    marginTop: '4px',
                                                    display: 'block',
                                                    lineHeight: '1.4'
                                                },
                                                children: formData.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        "Custom: ",
                                                        formData.imageUrl
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: "Auto-matching: Finds image from public folder based on item name"
                                                }, void 0, false)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                lineNumber: 1588,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1576,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "form-group",
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginBottom: 0,
                                            marginTop: '4px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                marginBottom: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: formData.isAvailable,
                                                    onChange: (e)=>setFormData({
                                                            ...formData,
                                                            isAvailable: e.target.checked
                                                        }),
                                                    style: {
                                                        margin: 0
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                    lineNumber: 1600,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Available for ordering"
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                                    lineNumber: 1606,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1597,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                        lineNumber: 1596,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                lineNumber: 1510,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1509,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            style: {
                                padding: '16px 24px',
                                gap: '10px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-ghost",
                                    onClick: ()=>setShowEditModal(false),
                                    style: {
                                        padding: '10px 18px',
                                        fontSize: '14px'
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1612,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary",
                                    onClick: handleEditItem,
                                    style: {
                                        padding: '10px 18px',
                                        fontSize: '14px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fa-solid fa-save"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                            lineNumber: 1616,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " Save Changes"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                                    lineNumber: 1615,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                            lineNumber: 1611,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                    lineNumber: 1502,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                lineNumber: 1501,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showDeleteModal && selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$components$2f$admin$2f$ConfirmationModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                show: showDeleteModal,
                onClose: ()=>setShowDeleteModal(false),
                onConfirm: handleDeleteItem,
                title: "Delete Menu Item",
                message: `Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`,
                confirmText: "Delete",
                confirmType: "danger"
            }, void 0, false, {
                fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
                lineNumber: 1625,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HomieBites/web-admin/components/admin/MenuPriceTab.jsx",
        lineNumber: 937,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MenuPriceTab, "bAPIhsvxTjysEqQjSu0RvcgrgEg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HomieBites$2f$web$2d$admin$2f$hooks$2f$useKeyboardAvoidance$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoKeyboardAvoidance"]
    ];
});
_c = MenuPriceTab;
const __TURBOPACK__default__export__ = MenuPriceTab;
var _c;
__turbopack_context__.k.register(_c, "MenuPriceTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HomieBites_web-admin_components_admin_MenuPriceTab_jsx_2df9c867._.js.map